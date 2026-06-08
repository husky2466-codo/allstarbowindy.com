#!/usr/bin/env python3
"""
parse_usbc_pdf.py — Re-parse the USBC Approved Ball List PDF into clean JSON spine files.

Reproducible, stdlib-only. Shells out to `pdftotext -layout` (poppler) to flatten the
PDF into a fixed-column text layout, then parses each ball line column-aware.

------------------------------------------------------------------------------------
PDF LAYOUT
------------------------------------------------------------------------------------
`pdftotext -layout <pdf> -` renders each ball as ONE line in a 3-COLUMN fixed layout:

        <brand>   <ball name>   <approval date>

Columns are separated by runs of 2-OR-MORE spaces. The brand is the FIRST column and may
itself contain SINGLE spaces (e.g. "Pro Bowl", "Bowling Mania", "900 Global", "Roto Grip",
"KR Strikeforce", "NL-Bowling Star", "Sunbridge Co., Ltd.", "Circle Athletics"). The date is
the LAST column. The name is everything in between (and may also contain single spaces, plus
parenthetical color lists and CJK characters, e.g. PBS "乾坤 火 (Qiankun Fire)").

The OLD parser split brand/name on a fixed/greedy boundary and mangled every MULTI-WORD
brand — producing records like brand="Pro", name="Bowl    Frosted Power". This parser fixes
that by splitting strictly on 2+-space runs.

Parse algorithm per line:
  1. Strip leading/trailing whitespace; skip blanks.
  2. cells = re.split(r'\\s{2,}', line)
       - exactly 3 cells  -> [brand, name, date]
       - more than 3 cells -> brand = cells[0], date = cells[-1],
                              name = " ".join(cells[1:-1])  (rare: name had an internal 2+-space pad)
       - fewer than 3 cells -> not a data row; skip (headers, page numbers, section titles).
  3. Validate the date parses (see formats). If not, the line is not a ball record; skip.
  4. Collapse internal multi-space runs in brand/name to single spaces; strip.
  5. Strip a leading "**" from the name (PDF legend marker for "manufactured only under 13 lbs",
     per page 1 of the source) — it's a marker, not part of the name.

------------------------------------------------------------------------------------
DATE FORMATS (all normalized to "YYYY-MM"; `year` is the 4-digit int)
------------------------------------------------------------------------------------
  - Full month + day + year   : "September 2, 2025", "March 9, 2021", "June 14, 2016"
  - Abbrev month + 2-digit yr  : "Feb-08", "Dec-'06", "Nov-'06", "Sept-'06"   (hyphen, optional apostrophe)
  - Full  month + 2-digit yr   : "April-'03", "March-'03"                     (hyphen + apostrophe)
  - Abbrev month + apostrophe  : "Jun'00", "Apr'00"                           (NO hyphen, apostrophe)
  2-digit year resolution: >= 90 -> 19xx, else 20xx  ('98->1998, '08->2008, '06->2006, '00->2000).

------------------------------------------------------------------------------------
KNOWN SOURCE TYPO (dropped)
------------------------------------------------------------------------------------
Columbia 300 "Super Cuda PowerCOR" is dated "September 3, 3024" in the source PDF — a typo for
2024/2025. Any record whose parsed year is implausibly far in the future (> CURRENT_YEAR + 1)
is DROPPED and logged rather than emitted. The prior parse also dropped it.
"""

import json
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC_DIR = os.path.dirname(HERE)  # reference/bowling-catalog/usbc-source/
PDF = os.path.join(SRC_DIR, "usbc_approved_balllist_2026-06-02.pdf")
OUT_2024 = os.path.join(SRC_DIR, "usbc_2024_2026.json")
OUT_2016 = os.path.join(SRC_DIR, "usbc_2016_present.json")

CURRENT_YEAR = 2026  # listDate 2026-06-02; reject years beyond this + 1.

MONTHS = {
    "jan": 1, "feb": 2, "mar": 3, "apr": 4, "may": 5, "jun": 6,
    "jul": 7, "aug": 8, "sep": 9, "sept": 9, "oct": 10, "nov": 11, "dec": 12,
    "january": 1, "february": 2, "march": 3, "april": 4, "june": 6,
    "july": 7, "august": 8, "september": 9, "october": 10, "november": 11, "december": 12,
}

# "September 2, 2025"
RE_FULL = re.compile(r"^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$")
# "Feb-08", "Dec-'06", "Sept-'06", "April-'03", "March-'03"  (hyphen, optional apostrophe)
RE_HYPHEN = re.compile(r"^([A-Za-z]+)-'?(\d{2})$")
# "Jun'00", "Apr'00"  (apostrophe, no hyphen)
RE_APOS = re.compile(r"^([A-Za-z]+)'(\d{2})$")


def resolve_two_digit_year(yy: int) -> int:
    # The source spans the 1980s through the listDate. Any 2-digit year greater than the
    # current 2-digit year is in the 1900s; otherwise it's in the 2000s.
    # (e.g. '83->1983, '88->1988, '98->1998, '06->2006, '26->2026).
    return 1900 + yy if yy > (CURRENT_YEAR % 100) else 2000 + yy


def parse_date(cell: str):
    """Return (dateApproved 'YYYY-MM', year:int) or None if not a recognizable date."""
    cell = cell.strip()

    m = RE_FULL.match(cell)
    if m:
        mon = MONTHS.get(m.group(1).lower())
        if not mon:
            return None
        year = int(m.group(3))
        return f"{year:04d}-{mon:02d}", year

    for rx in (RE_HYPHEN, RE_APOS):
        m = rx.match(cell)
        if m:
            mon = MONTHS.get(m.group(1).lower())
            if not mon:
                return None
            year = resolve_two_digit_year(int(m.group(2)))
            return f"{year:04d}-{mon:02d}", year

    return None


def parse_pdf(pdf_path: str):
    """Return (records, dropped) where records is a list of {brand,name,dateApproved,year}."""
    raw = subprocess.run(
        ["pdftotext", "-layout", pdf_path, "-"],
        check=True, capture_output=True, text=True,
    ).stdout

    records = []
    dropped = []
    for line in raw.splitlines():
        s = line.strip()
        if not s:
            continue
        cells = re.split(r"\s{2,}", s)
        if len(cells) < 3:
            continue  # header / page-number / section title / non-data
        brand = re.sub(r"\s+", " ", cells[0]).strip()
        name = re.sub(r"\s+", " ", " ".join(cells[1:-1])).strip()
        # The PDF prefixes "**" to names of balls manufactured only under 13 lbs
        # (per the legend on page 1). It's a marker, not part of the name -> strip it.
        name = re.sub(r"^\*+\s*", "", name).strip()
        parsed = parse_date(cells[-1])
        if parsed is None:
            continue  # last cell isn't a date -> not a ball record (e.g. "Date Approved" header)
        date_approved, year = parsed
        if not brand or not name:
            continue
        rec = {"brand": brand, "name": name, "dateApproved": date_approved, "year": year}
        if year > CURRENT_YEAR + 1:
            dropped.append(rec)
            continue
        records.append(rec)
    return records, dropped


def sort_key(rec):
    return (rec["brand"].lower(), rec["name"].lower())


def load_metadata(path):
    """Read existing file's top-level metadata (everything except 'balls'/'count')."""
    with open(path) as f:
        data = json.load(f)
    meta = {k: v for k, v in data.items() if k not in ("balls", "count")}
    # preserve original key ordering, with count restored in its original slot
    order = list(data.keys())
    return meta, order


def write_window(path, records, predicate):
    meta, order = load_metadata(path)
    balls = sorted([r for r in records if predicate(r["year"])], key=sort_key)
    out = {}
    for key in order:
        if key == "count":
            out["count"] = len(balls)
        elif key == "balls":
            out["balls"] = balls
        else:
            out[key] = meta[key]
    with open(path, "w") as f:
        # ensure_ascii=True to match the existing files' encoding (CJK names like
        # "乾坤 火" are stored as \uXXXX escapes, not raw UTF-8).
        json.dump(out, f, indent=2, ensure_ascii=True)
        f.write("\n")
    return len(balls)


def main():
    if not os.path.exists(PDF):
        sys.exit(f"PDF not found: {PDF}")
    records, dropped = parse_pdf(PDF)
    print(f"Parsed {len(records)} total ball records from PDF.")
    for d in dropped:
        print(f"DROPPED (implausible year {d['year']}): {d['brand']} - {d['name']} ({d['dateApproved']})")

    n2024 = write_window(OUT_2024, records, lambda y: y in (2024, 2025, 2026))
    n2016 = write_window(OUT_2016, records, lambda y: y >= 2016)
    print(f"Wrote {n2024} balls -> {OUT_2024}")
    print(f"Wrote {n2016} balls -> {OUT_2016}")


if __name__ == "__main__":
    main()
