# Catalog Enrichment Report

_Generated 2026-06-07 by `scripts/enrich_catalog.py`._

## Window totals

- **Total website-window balls (USBC spine):** 661
- **Already had specs (existing catalog, system of record):** 130
- **Newly filled by TenPinDoctors:** 259 (of which 6 via constrained name-only fallback)
- **Still no specs (`specSource: none`):** 272

## The 532 balls that were missing specs

Of the **531** window balls NOT present in our existing catalog:

- **259** were filled by TenPinDoctors
- **272** remain unfilled

TenPinDoctors fill rate on the missing set: **48.8%**

## Sample — newly filled by TenPinDoctors (~15)

| Brand | Name | Cover | CoverType | Core | CoreType | RG | Diff | Rel |
|---|---|---|---|---|---|---|---|---|
| 900 Global | Cruise Control | Reserve Blend 901 Hybrid | hybrid | Ellipticon | asymmetric | 2.49 | 0.054 | 2024-06 |
| 900 Global | Zen Re-Loaded | Reserve Blend 803 | pearl | Meditate A.I. | symmetric | 2.48 | 0.053 | 2024-04 |
| Brunswick | Vaporize | HK22C - EVO Pearl | pearl | Zone Asymmetric | asymmetric | 2.478 | 0.048 | 2024-08 |
| Ebonite | Blood Angular One | HK22 - XL8500 | hybrid | Iron | asymmetric | 2.463 | 0.053 | 2024-04 |
| Ebonite | The One Pluto | HK22 - GB 14.4 Hybrid | hybrid | Centrex Symmetrical Mass Bias | asymmetric | 2.466 | 0.056 | 2024-09 |
| Hammer | Effect Black | HK22C - Cohesion Solid | solid | Huntsman | asymmetric | 2.47 | 0.05 | 2024-12 |
| Hammer | Scorpion Strike | HK22 - Semtex Pearl | pearl | LED 3.0 | symmetric | 2.485 | 0.045 | 2024-07 |
| Motiv | Tank (Rampage) Pearl | Frixion M6 Pearl MCP | particle | Gear V2 | symmetric | 2.55 | 0.02 | 2024-02 |
| Radical | The Hitter Pearl | HK22 - Utility Pearl | pearl | Hitter | asymmetric | 2.488 | 0.053 | 2024-08 |
| Roto Grip | Hustle Black Sky | VTC Hybrid | hybrid | Hustle | symmetric | 2.53 | 0.03 | 2025-09 |
| Storm | Absolute Paint The Lanes Pink | R2S Pearl | pearl | Sentinel | asymmetric | 2.48 | 0.05 | 2025-09 |
| Storm | Genius Solution | NeX+ Pearl | pearl | RAD-A + A.I. | asymmetric | 2.51 | 0.053 | 2024-04 |
| Storm | Motor 30 | RX Solid | solid | Torque A.I. | asymmetric | 2.48 | 0.052 | 2025-07 |
| Storm | Star Gate | NRG 2 Pearl | pearl | Ignition | asymmetric | 2.49 | 0.052 | 2024-10 |
| Swag | Dynamite War | USY 3 Pearl | pearl | Turbine Version 2 | symmetric | 2.496 | 0.052 | 2025-09 |

## Sample — still unfilled (~15)

- 900 Global — Alibi
- ABS — Heki Channel
- ABS — Ultra Bend LV 4.0
- Brunswick — Rhino Pro Black (2024)
- Ebonite — Maxim Purple Haze
- Epic Bowling — Curve Blue-Pink-White (Candy Ice)
- Hammer — Black Widow Urethane Blue (2024)
- Hero — HB Blue-Pink-Black (Mistress of Mayhem)
- Motiv — Ascend Navy/Teal/Yellow
- Pyramid Bowling — Supermoon Pearl
- Roto Grip — Hustler Black
- Storm — Hy-Road Black
- Storm — The Joker
- Sunbridge Co., Ltd. — Just A Way Purple-Steel Blue Pearl
- Swag — Incredible! Sweet!

## Data-quality notes

- **Unparseable RG values in CSV:** 0 (none)
- **CSV rows with blank RG:** 0
- **Duplicate normalized brand+name keys in CSV (re-releases):** 4 — resolved by keeping the NEWEST release date per key.
    - `storm|alphacrux` (2 rows)
    - `columbia300|pulse` (2 rows)
    - `ebonite|turbox` (2 rows)
    - `columbia300|messengerpowercorpearl` (2 rows)

### Brand mismatches special-cased

- USBC spine truncates `KR Strikeforce` to `KRSF` / `Strikeforce`; aliased to match CSV `KR Strikeforce`.
- USBC `Track Inc.` aliased to CSV `Track` (normalized `trackinc` would not otherwise collide with `track`).
- Name-only fallback matches (normalized name globally unique in CSV, brand differs between sources):
    - 900 Global — Vintage Gem  (name-only fallback; CSV brand 'Roto Grip' differs from spine brand '900 Global')
    - Pyramid Bowling — Blood Moon Evolve  (name-only fallback; CSV brand 'Pyramid' differs from spine brand 'Pyramid Bowling')
    - Pyramid Bowling — Fortress Endgame  (name-only fallback; CSV brand 'Pyramid' differs from spine brand 'Pyramid Bowling')
    - Pyramid Bowling — Prime Pearl  (name-only fallback; CSV brand 'Pyramid' differs from spine brand 'Pyramid Bowling')
    - Pyramid Bowling — Prime Solid  (name-only fallback; CSV brand 'Pyramid' differs from spine brand 'Pyramid Bowling')
    - Skill Bowling — Skill 3.02  (name-only fallback; CSV brand 'PBA' differs from spine brand 'Skill Bowling')

### Spine parsing artifacts (left as-is, not repaired here)

Several USBC-spine records have a broken brand/name split (e.g. brand `Pro` + name `Bowl Under Cover ...` = "Pro Bowl", brand `Bowl` + name `Star Bowl Star`, brand `Epic`/`Bowling` + `Be Epic`/`Bowling Mania`). These are niche/import brands absent from the TenPinDoctors CSV, so they resolve to `specSource: none` regardless. The spine is the authoritative window; its records are preserved verbatim rather than rewritten here.

