# Bowling Catalog Reference Data

Reusable bowling reference data salvaged from the retired **BowlerTrax-V1** iOS app
(`husky2466-codo/BowlerTrax-V1`). Pulled here so it survives — the source repo's default
branch was wiped down to a README, and this data otherwise lived only at a git tag and
inside a compiled iOS simulator bundle. Both are fragile.

**This data is preserved reference material. It is NOT wired into the site.** Use it as the
source for a future Pro Shop / equipment-browsing page or member "my equipment" feature.

## Provenance

- **Source repo:** `husky2466-codo/BowlerTrax-V1`
- **Source ref:** git tag `pre-wipe-final` (the default branch no longer contains these files)
- **Original scrape source:** `bowwwl.com`, per the dataset's own `dataSource` field
- **Data captured:** Dec 2025 (BallDatabase `lastUpdated: 2025-12-31`)
- **Imported to this repo:** 2026-06-08

If you ever need the full original app source (Swift models, services, the source PDF
`Analysis/approved_balllist-12-30-2025.pdf`), it is all at the `pre-wipe-final` tag of the
BowlerTrax-V1 repo. Only the three most reusable files were brought over here.

## Files

| File | Contents |
|---|---|
| `BallDatabase.json` | **183 bowling balls** across 15 brands. Per-ball spec fields: `id, name, brand, coverstock, coverstockType, coreName, coreType, rg, differential, massBiasDiff, releaseDate, colors[]`. Top-level key: `balls`. |
| `OilPatterns.json` | **22 lane oil patterns** (PBA Animal series, etc.). Fields: `id, name, category, lengthFeet, volumeML, ratio, difficulty, description, isPreset`. Top-level key: `patterns`. |
| `Bowling-Info-Ref.md` | ~28 KB hand-written reference: rev-rate formulas, casual + PBA/USBC rules, scoring. Prose, not structured data. |

Brands in `BallDatabase.json`: 900 Global, Brunswick, Columbia 300, DV8, Ebonite, Hammer,
HIH Bowling, KR Strikeforce, Motiv, Pyramid, Radical, Roto Grip, Storm, SWAG, Track.

## Data-quality audit (2026-06-08)

Audited for use as the **spec backbone behind future Pro Shop inventory** (the owner supplies stock
+ prices; we match each item to its spec record here). Findings:

- **Deduped 195 → 183.** 12 records were exact duplicates (same name/brand/specs/release, different
  `id` — the scrape hit some balls via two paths). Removed; `totalBalls` now 183. No unique ball lost.
- **All fields populated** except `massBiasDiff`, empty on the 111 **symmetric** balls — correct, not
  missing (mass bias applies only to asymmetric cores).
- **RG/differential values sane.** A few RG values at 2.66–2.75 are spare/plastic balls (legitimately
  high-RG), not errors.
- **Brands consistent** (15, no spelling fragmentation). **Freshness good** — 107 balls are 2025.
- **Source `bowwwl.com` is live** (confirmed 2026-06-08), so refreshing/extending is viable later.
  Note: its owner is building his own iOS ball-database app.

## Caveats before publishing any of this on the live site

- **Scale:** 183 balls is a curated catalog, not an exhaustive inventory. A strong starting set,
  not "every ball All Star Bowl stocks."
- **Freshness:** specs scraped from `bowwwl.com` (data captured Dec 2025). Re-verify current models
  before presenting as in-stock pro-shop inventory.
- **No pricing:** specs only, no retail prices. Pro-shop pricing must come from the business — this
  catalog is the spec layer the owner's stock list matches against, not the inventory itself.
