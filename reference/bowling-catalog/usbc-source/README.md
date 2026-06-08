# USBC Approved Ball List — source spine

The **authoritative "what balls exist and when"** layer, parsed from the USBC (United States
Bowling Congress) Approved Ball List — the official governing-body list of every ball approved
for certified play. This is the same kind of source the original BowlerTrax catalog was built
from (it had `approved_balllist-12-30-2025.pdf`).

## IMPORTANT: this is a spine, not specs

These files contain **brand + ball name + approval date ONLY**. They do **NOT** contain
RG / differential / coverstock / core. Those specs must be enriched separately (manufacturer
pages or a vetted ball-spec API) and merged into `../BallDatabase.json`, which is the spec'd
catalog the site actually uses.

Do not point the website at these files directly — they'd show names with no specs.

## Files

| File | Window | Count | Purpose |
|---|---|---|---|
| `usbc_2024_2026.json` | 2024–2026 | 661 | The **website** catalog scope (current + recently-stocked inventory). Enrich these with specs. |
| `usbc_2016_present.json` | 2016–present | 2,960 | Broader **reference** set (member "my bag" lookup, older balls a shop might still have / sell used). Not for the site. |
| `usbc_approved_balllist_2026-06-02.pdf` | full (1991–present) | ~6,200 | The raw source PDF, snapshot dated 2026-06-02. |

## Provenance

- **Source:** USBC Approved Ball List — `https://bowl.com/approved-ball-list`
- **Stable current PDF (auto-updates weekly):**
  `https://bowl.com/getmedia/8b570e80-761c-4486-8628-9d50d718dd60/approved_balllist_CURRENT.pdf`
- **Snapshot date:** 2026-06-02
- **Parsed:** 2026-06-08 via `pdftotext -layout` + a date/brand parser. One record dropped as a
  source typo (Columbia 300 "Super Cuda PowerCOR" dated "September 3, 3024").

## Enrichment status (as of 2026-06-08)

Against the existing 183-ball spec'd catalog (`../BallDatabase.json`):
- **129** of the 661 window balls already have specs in our catalog → merge.
- **532** window balls have **no specs yet** → need enrichment. This is the open work.
- **54** of our existing balls are pre-2024 → they belong to the 2016+ reference set, not the
  website window.

To refresh: re-download `approved_balllist_CURRENT.pdf` and re-run the parse; it always reflects
the latest weekly USBC update.
