#!/usr/bin/env python3
"""
enrich_catalog.py — Enrich the 661-ball USBC website-window spine with specs.

Reproducible enrichment pipeline. Reads three inputs, writes
BallDatabase.enriched.json + enrichment-report.md inside reference/bowling-catalog/.

Inputs:
  1. reference/bowling-catalog/BallDatabase.json
        existing 183-ball spec'd catalog (our system of record). Top key "balls".
  2. reference/bowling-catalog/usbc-source/usbc_2024_2026.json
        the WEBSITE WINDOW spine, 661 balls, top key "balls"
        ({brand, name, dateApproved, year}). No specs.
  3. ~/Downloads/allstarbowl-frontend-export/BowlingBalls.csv
        TenPinDoctors data, ~2,739 spec'd rows. The real header is on file LINE 7
        (the first 6 lines are junk). INTERNAL-REFERENCE ONLY.

        *** This CSV is NOT committed to the repo (it is TenPinDoctors' dataset,
            members/subscription site). It must be supplied locally at the path
            above. The script reads it from ~/Downloads at runtime. ***

Spec precedence per window ball (matched by normalized brand+name):
  1. existing catalog  -> specSource "existing-catalog"  (our own record wins)
  2. TenPinDoctors CSV -> specSource "tenpindoctors"
  3. constrained name-only fallback into the CSV (only when the normalized name
     is globally unique in the CSV) -> specSource "tenpindoctors" (flagged in report)
  4. no match          -> specSource "none", spec fields null

Run:  python3 reference/bowling-catalog/scripts/enrich_catalog.py
(run from the repo root, or anywhere — paths resolve relative to this file)
"""

import csv
import json
import os
import re
import sys
from collections import Counter
from datetime import date
from io import StringIO

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CATALOG_DIR = os.path.dirname(SCRIPT_DIR)  # reference/bowling-catalog

BALLDB_PATH = os.path.join(CATALOG_DIR, "BallDatabase.json")
USBC_PATH = os.path.join(CATALOG_DIR, "usbc-source", "usbc_2024_2026.json")
TPD_CSV_PATH = os.path.expanduser(
    "~/Downloads/allstarbowl-frontend-export/BowlingBalls.csv"
)

OUT_JSON_PATH = os.path.join(CATALOG_DIR, "BallDatabase.enriched.json")
OUT_REPORT_PATH = os.path.join(CATALOG_DIR, "enrichment-report.md")

GENERATED = "2026-06-07"
TPD_HEADER_LINE = 7  # 1-indexed; first 6 lines are junk

# ---------------------------------------------------------------------------
# Normalization
# ---------------------------------------------------------------------------

def norm(s):
    """lowercase; strip; drop ALL non-alphanumeric chars (spaces, hyphens,
    slashes, apostrophes, periods, ampersands, etc.)."""
    return re.sub(r"[^a-z0-9]", "", (s or "").lower())


# Brand aliases: collapse known-equivalent brands to a single normalized form so
# they collide across sources. Keys/values are already norm()'d.
#   KRSF / Strikeforce  -> KR Strikeforce (USBC spine truncates the brand name)
#   Track Inc.          -> Track
BRAND_ALIAS = {
    "krsf": "krstrikeforce",
    "strikeforce": "krstrikeforce",
    "trackinc": "track",
}


def norm_brand(b):
    n = norm(b)
    return BRAND_ALIAS.get(n, n)


def match_key(brand, name):
    return norm_brand(brand) + "|" + norm(name)


def kebab(*parts):
    joined = " ".join(p for p in parts if p)
    joined = joined.lower()
    joined = re.sub(r"[^a-z0-9]+", "-", joined)
    return joined.strip("-")


# ---------------------------------------------------------------------------
# Field mapping helpers (TenPinDoctors CSV -> our schema)
# ---------------------------------------------------------------------------

# Coverstock Type descriptor -> single-word type our catalog uses.
# Order matters: check the more specific tokens first.
def map_coverstock_type(raw):
    if not raw:
        return None
    s = raw.strip().lower()
    if not s:
        return None
    if "polyester" in s:
        return "polyester"
    if "urethane" in s:
        return "urethane"
    if "hybrid" in s:
        return "hybrid"
    if "pearl" in s:
        return "pearl"
    if "solid" in s:
        return "solid"
    if "particle" in s:
        return "particle"
    # remaining oddballs: "Microcell Polymer", "Rubber", "Not Urethane"
    if "rubber" in s:
        return "rubber"
    if "microcell" in s or "polymer" in s:
        return "particle"
    # "Not Urethane" -> treat as reactive of unknown sub-type; leave None descriptor
    return None


def map_core_type(raw):
    if not raw:
        return None
    s = raw.strip().lower()
    if s.startswith("asym"):
        return "asymmetric"
    if s.startswith("sym"):
        return "symmetric"
    return None


def to_float(raw):
    if raw is None:
        return None
    s = str(raw).strip()
    if not s:
        return None
    try:
        return float(s)
    except ValueError:
        return None


def mmddyyyy_to_yyyymm(raw):
    """MM/DD/YYYY -> 'YYYY-MM'. Returns None on anything unparseable."""
    if not raw:
        return None
    s = raw.strip()
    m = re.match(r"^(\d{1,2})/(\d{1,2})/(\d{4})$", s)
    if not m:
        return None
    mm, _dd, yyyy = m.group(1), m.group(2), m.group(3)
    return f"{yyyy}-{int(mm):02d}"


# ---------------------------------------------------------------------------
# Loaders
# ---------------------------------------------------------------------------

def load_existing_catalog():
    with open(BALLDB_PATH, encoding="utf-8") as f:
        data = json.load(f)
    by_key = {}
    for b in data["balls"]:
        by_key[match_key(b["brand"], b["name"])] = b
    return by_key


def load_usbc_spine():
    with open(USBC_PATH, encoding="utf-8") as f:
        data = json.load(f)
    return data["balls"]


def load_tpd_csv():
    """Returns (by_key, by_name, name_counts, issues).
    Duplicate normalized brand+name rows (re-releases) -> keep the NEWEST by
    release date. by_name maps a globally-unique normalized name to its row."""
    issues = {"unparseable_rg": [], "duplicate_keys": [], "blank_rg": 0}
    if not os.path.exists(TPD_CSV_PATH):
        sys.exit(
            f"ERROR: TenPinDoctors CSV not found at {TPD_CSV_PATH}\n"
            "This file is internal-reference-only and is NOT committed. "
            "Supply it locally to run the enrichment."
        )
    with open(TPD_CSV_PATH, newline="", encoding="utf-8-sig") as f:
        lines = f.readlines()
    reader = csv.DictReader(StringIO("".join(lines[TPD_HEADER_LINE - 1:])))

    # Collect rows; track newest per key.
    by_key = {}
    key_dupcount = Counter()
    for row in reader:
        name = (row.get("Ball Name") or "").strip()
        brand = (row.get("Manufacturer") or "").strip()
        if not name:
            continue
        rg_raw = (row.get("RG (in.)") or "").strip()
        if rg_raw and to_float(rg_raw) is None:
            issues["unparseable_rg"].append(f"{brand} {name}: {rg_raw!r}")
        if not rg_raw:
            issues["blank_rg"] += 1

        rec = build_spec_from_csv(row)
        key = match_key(brand, name)
        key_dupcount[key] += 1
        prev = by_key.get(key)
        if prev is None:
            by_key[key] = rec
        else:
            # keep newest releaseDate (string YYYY-MM sorts correctly; None last)
            pr = prev.get("releaseDate") or ""
            nr = rec.get("releaseDate") or ""
            if nr > pr:
                by_key[key] = rec

    for k, c in key_dupcount.items():
        if c > 1:
            issues["duplicate_keys"].append((k, c))

    # name-only index, restricted to globally-unique normalized names
    name_counts = Counter()
    name_rows = {}
    # re-read to count names across ALL rows (incl. dup re-releases collapsed)
    # We base uniqueness on the collapsed by_key set's names.
    for key, rec in by_key.items():
        nn = norm(rec["name"])
        name_counts[nn] += 1
        name_rows[nn] = rec
    by_name = {nn: name_rows[nn] for nn, c in name_counts.items() if c == 1}

    return by_key, by_name, issues


def build_spec_from_csv(row):
    return {
        "name": (row.get("Ball Name") or "").strip(),
        "brand": (row.get("Manufacturer") or "").strip(),
        "coverstock": (row.get("Coverstock Name") or "").strip() or None,
        "coverstockType": map_coverstock_type(row.get("Coverstock Type")),
        "coreName": (row.get("Core Name") or "").strip() or None,
        "coreType": map_core_type(row.get("Core Type")),
        "rg": to_float(row.get("RG (in.)")),
        "differential": to_float(row.get("Differential (in.)")),
        "massBiasDiff": None,  # not in TenPinDoctors source
        "releaseDate": mmddyyyy_to_yyyymm(row.get("Release Date")),
        "factoryFinish": (row.get("Factory Finish") or "").strip() or None,
    }


# ---------------------------------------------------------------------------
# Enrichment
# ---------------------------------------------------------------------------

SPEC_FIELDS = [
    "coverstock",
    "coverstockType",
    "coreName",
    "coreType",
    "rg",
    "differential",
    "massBiasDiff",
    "releaseDate",
    "factoryFinish",
]


def empty_specs():
    return {f: None for f in SPEC_FIELDS}


def specs_from_existing(rec):
    out = empty_specs()
    for f in SPEC_FIELDS:
        out[f] = rec.get(f)  # factoryFinish absent in old catalog -> None
    return out


def specs_from_csv(rec):
    out = empty_specs()
    for f in SPEC_FIELDS:
        out[f] = rec.get(f)
    return out


def build_record(b, existing, tpd_by_key, tpd_by_name):
    """Build one enriched record for a single spine ball `b`.
    Single source of truth for the per-ball enrichment decision."""
    brand = b["brand"]
    name = b["name"]
    key = match_key(brand, name)
    rec = {
        "id": kebab(brand, name),
        "name": name,
        "brand": brand,
        "dateApproved": b.get("dateApproved"),
        "year": b.get("year"),
    }
    if key in existing:
        rec.update(specs_from_existing(existing[key]))
        rec["specSource"] = "existing-catalog"
    elif key in tpd_by_key:
        rec.update(specs_from_csv(tpd_by_key[key]))
        rec["specSource"] = "tenpindoctors"
    elif norm(name) in tpd_by_name:
        src = tpd_by_name[norm(name)]
        rec.update(specs_from_csv(src))
        rec["specSource"] = "tenpindoctors"
        rec["specSourceNote"] = (
            f"name-only fallback; CSV brand '{src['brand']}' "
            f"differs from spine brand '{brand}'"
        )
    else:
        rec.update(empty_specs())
        rec["specSource"] = "none"
    return rec


def enrich():
    existing = load_existing_catalog()
    spine = load_usbc_spine()
    tpd_by_key, tpd_by_name, issues = load_tpd_csv()

    counts = {
        "existing-catalog": 0,
        "tenpindoctors": 0,
        "tenpindoctors-namefallback": 0,
        "none": 0,
    }
    samples = {"filled": [], "unfilled": [], "namefallback": []}

    out_balls = []
    all_filled = []
    all_unfilled = []
    for b in spine:
        rec = build_record(b, existing, tpd_by_key, tpd_by_name)
        out_balls.append(rec)
        src = rec["specSource"]
        counts[src] += 1
        if src == "tenpindoctors":
            all_filled.append(rec)
            if "specSourceNote" in rec:
                counts["tenpindoctors-namefallback"] += 1
                samples["namefallback"].append(rec)
        elif src == "none":
            all_unfilled.append(f"{rec['brand']} — {rec['name']}")

    # Build brand-diverse samples by striding across the full result set rather
    # than taking the first 15 (the spine is brand-sorted, so the head clusters
    # on one brand and isn't representative).
    def stride(seq, n):
        if len(seq) <= n:
            return list(seq)
        step = len(seq) / n
        return [seq[int(i * step)] for i in range(n)]

    samples["filled"] = stride(all_filled, 15)
    samples["unfilled"] = stride(all_unfilled, 15)

    out = {
        "source": "USBC 2024-2026 website window spine, enriched with specs from "
        "the existing All Star catalog (system of record) and TenPinDoctors "
        "(internal reference only — see PROVENANCE.md).",
        "generated": GENERATED,
        "note": "Spec precedence: existing-catalog > tenpindoctors. Records with "
        "specSource 'none' had no spec match in either source. The 661 balls and "
        "their dateApproved/year come verbatim from the USBC website-window spine.",
        "count": len(out_balls),
        "balls": out_balls,
    }
    return out, counts, samples, issues, len(spine)


# ---------------------------------------------------------------------------
# Report
# ---------------------------------------------------------------------------

def write_report(counts, samples, issues, total):
    missing_total = total - counts["existing-catalog"]  # not in existing catalog
    filled_by_tpd = counts["tenpindoctors"]
    still_none = counts["none"]

    L = []
    L.append("# Catalog Enrichment Report")
    L.append("")
    L.append(f"_Generated {GENERATED} by `scripts/enrich_catalog.py`._")
    L.append("")
    L.append("## Window totals")
    L.append("")
    L.append(f"- **Total website-window balls (USBC spine):** {total}")
    L.append(
        f"- **Already had specs (existing catalog, system of record):** "
        f"{counts['existing-catalog']}"
    )
    L.append(
        f"- **Newly filled by TenPinDoctors:** {filled_by_tpd} "
        f"(of which {counts['tenpindoctors-namefallback']} via constrained "
        f"name-only fallback)"
    )
    L.append(f"- **Still no specs (`specSource: none`):** {still_none}")
    L.append("")
    L.append("## The 532 balls that were missing specs")
    L.append("")
    L.append(
        f"Of the **{missing_total}** window balls NOT present in our existing "
        f"catalog:"
    )
    L.append("")
    L.append(f"- **{filled_by_tpd}** were filled by TenPinDoctors")
    L.append(f"- **{still_none}** remain unfilled")
    L.append("")
    if missing_total:
        pct = 100.0 * filled_by_tpd / missing_total
        L.append(f"TenPinDoctors fill rate on the missing set: **{pct:.1f}%**")
        L.append("")

    L.append("## Sample — newly filled by TenPinDoctors (~15)")
    L.append("")
    L.append("| Brand | Name | Cover | CoverType | Core | CoreType | RG | Diff | Rel |")
    L.append("|---|---|---|---|---|---|---|---|---|")
    for r in samples["filled"]:
        L.append(
            "| {brand} | {name} | {cov} | {ct} | {core} | {crt} | {rg} | {df} | {rel} |".format(
                brand=r["brand"],
                name=r["name"],
                cov=r.get("coverstock") or "",
                ct=r.get("coverstockType") or "",
                core=r.get("coreName") or "",
                crt=r.get("coreType") or "",
                rg=r.get("rg") if r.get("rg") is not None else "",
                df=r.get("differential") if r.get("differential") is not None else "",
                rel=r.get("releaseDate") or "",
            )
        )
    L.append("")

    L.append("## Sample — still unfilled (~15)")
    L.append("")
    for n in samples["unfilled"]:
        L.append(f"- {n}")
    L.append("")

    L.append("## Data-quality notes")
    L.append("")
    L.append(
        f"- **Unparseable RG values in CSV:** {len(issues['unparseable_rg'])}"
        + (
            " — " + "; ".join(issues["unparseable_rg"][:10])
            if issues["unparseable_rg"]
            else " (none)"
        )
    )
    L.append(f"- **CSV rows with blank RG:** {issues['blank_rg']}")
    L.append(
        f"- **Duplicate normalized brand+name keys in CSV "
        f"(re-releases):** {len(issues['duplicate_keys'])} — resolved by keeping "
        f"the NEWEST release date per key."
    )
    for k, c in issues["duplicate_keys"]:
        L.append(f"    - `{k}` ({c} rows)")
    L.append("")
    L.append("### Brand mismatches special-cased")
    L.append("")
    L.append(
        "- USBC spine truncates `KR Strikeforce` to `KRSF` / `Strikeforce`; "
        "aliased to match CSV `KR Strikeforce`."
    )
    L.append(
        "- USBC `Track Inc.` aliased to CSV `Track` (normalized `trackinc` would "
        "not otherwise collide with `track`)."
    )
    if samples["namefallback"]:
        L.append(
            "- Name-only fallback matches (normalized name globally unique in CSV, "
            "brand differs between sources):"
        )
        for r in samples["namefallback"]:
            L.append(f"    - {r['brand']} — {r['name']}  ({r.get('specSourceNote','')})")
    L.append("")
    L.append(
        "### Spine parsing artifacts (left as-is, not repaired here)\n"
        "\nSeveral USBC-spine records have a broken brand/name split (e.g. brand "
        "`Pro` + name `Bowl Under Cover ...` = \"Pro Bowl\", brand `Bowl` + name "
        "`Star Bowl Star`, brand `Epic`/`Bowling` + `Be Epic`/`Bowling Mania`). "
        "These are niche/import brands absent from the TenPinDoctors CSV, so they "
        "resolve to `specSource: none` regardless. The spine is the authoritative "
        "window; its records are preserved verbatim rather than rewritten here."
    )
    L.append("")

    with open(OUT_REPORT_PATH, "w", encoding="utf-8") as f:
        f.write("\n".join(L) + "\n")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    out, counts, samples, issues, total = enrich()

    with open(OUT_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2, ensure_ascii=False)
        f.write("\n")

    write_report(counts, samples, issues, total)

    # console summary
    missing_total = total - counts["existing-catalog"]
    print(f"Window balls: {total}")
    print(f"  existing-catalog: {counts['existing-catalog']}")
    print(
        f"  tenpindoctors:    {counts['tenpindoctors']} "
        f"(name-fallback: {counts['tenpindoctors-namefallback']})"
    )
    print(f"  none:             {counts['none']}")
    print(f"Of {missing_total} missing-spec balls: "
          f"{counts['tenpindoctors']} filled by TenPinDoctors, "
          f"{counts['none']} remain unfilled.")
    print(f"Wrote {OUT_JSON_PATH}")
    print(f"Wrote {OUT_REPORT_PATH}")


if __name__ == "__main__":
    main()
