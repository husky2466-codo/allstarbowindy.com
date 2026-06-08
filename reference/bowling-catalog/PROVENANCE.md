# Provenance — Catalog Enrichment Sources

This file documents where the spec data in **`BallDatabase.enriched.json`** comes
from, and — importantly — what may and may not be published.

## Sources

| Source | What it provides | Publish status |
|---|---|---|
| `usbc-source/usbc_2024_2026.json` | The 661-ball **website window** spine (`brand, name, dateApproved, year`). The authoritative list of which balls fall in our 2024–2026 window. | **Publishable.** USBC's approved-ball list is a public authoritative record. |
| `BallDatabase.json` | Our existing 183-ball spec'd catalog (system of record), originally salvaged from BowlerTrax-V1 / `bowwwl.com`. See `README.md`. | **Publishable** (it's our own curated dataset). |
| **TenPinDoctors CSV** | ~2,739 spec'd balls (RG, differential, coverstock, core, factory finish). Used to fill specs the USBC spine and our catalog lacked. | **INTERNAL REFERENCE ONLY — DO NOT PUBLISH AS OUR DATASET.** See below. |

## TenPinDoctors — internal-reference-only

- **What it is:** TenPinDoctors is a bowling **members / subscription** knowledge
  base. The export used here is `BowlingBalls.csv`, supplied locally at
  `~/Downloads/allstarbowl-frontend-export/BowlingBalls.csv`.
- **Capture date / version:** the export reflects data current as of the file we
  were given (latest release rows dated into mid-2026). Enrichment run: **2026-06-07**.
- **NOT committed to the repo.** The raw CSV is TenPinDoctors' curated dataset and
  is deliberately **not** copied into version control. `enrich_catalog.py` reads it
  from `~/Downloads` at runtime; it must be supplied locally to reproduce the build.
- **What we are and are not using:**
  - The **underlying RG / differential / core / coverstock values are
    manufacturer-published facts.** Those physical specs are not owned by
    TenPinDoctors — they come from Storm, Brunswick, Motiv, etc. Using them as
    reference to enrich our own catalog is fine.
  - **TenPinDoctors' _curated dataset_ — the specific selection, organization, and
    any editorial fields (ratings, member counts, demo-video flags, finish
    descriptions in their wording) — is theirs.** We do **not** republish their
    dataset verbatim, present it as our own, or ship the CSV.
- **Provenance tagging:** every record in `BallDatabase.enriched.json` carries a
  `specSource` of `existing-catalog`, `tenpindoctors`, or `none`, so any
  TenPinDoctors-derived row is traceable. **Before any of this is published on the
  live site, TenPinDoctors-sourced rows must be re-verified against
  manufacturer-published specs and re-stated in our own terms** — not shipped as the
  TenPinDoctors dataset.

## Reproducing the enrichment

```
python3 reference/bowling-catalog/scripts/enrich_catalog.py
```

Reads the three sources above, writes `BallDatabase.enriched.json` and
`enrichment-report.md`. Deterministic. Requires the TenPinDoctors CSV present at
the path noted above (Python stdlib only — no pandas/openpyxl).
