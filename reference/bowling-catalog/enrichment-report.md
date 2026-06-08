# Catalog Enrichment Report

_Generated 2026-06-07 by `scripts/enrich_catalog.py`._

## Window totals

- **Total website-window balls (USBC spine):** 661
- **Already had specs (existing catalog, system of record):** 129
- **Newly filled by TenPinDoctors:** 254 (of which 1 via constrained name-only fallback)
- **Still no specs (`specSource: none`):** 278

## The 532 balls that were missing specs

Of the **532** window balls NOT present in our existing catalog:

- **254** were filled by TenPinDoctors
- **278** remain unfilled

TenPinDoctors fill rate on the missing set: **47.7%**

## Sample — newly filled by TenPinDoctors (~15)

| Brand | Name | Cover | CoverType | Core | CoreType | RG | Diff | Rel |
|---|---|---|---|---|---|---|---|---|
| 900 Global | Cruise Control | Reserve Blend 901 Hybrid | hybrid | Ellipticon | asymmetric | 2.49 | 0.054 | 2024-06 |
| 900 Global | Wolverine Wrath | Reserve Blend 701 Pearl | pearl | Lacerate 2.0 | symmetric | 2.54 | 0.053 | 2024-06 |
| Brunswick | Vapor Zone Red | HK22C - EVO Pearl 2.0 | pearl | Zone Asymmetric | asymmetric | 2.478 | 0.048 | 2025-09 |
| DV8 | Wicked Collision | HK22C - Havoc Solid | solid | Collision | asymmetric | 2.462 | 0.052 | 2024-07 |
| Ebonite | The One (Optimus) | HK22 - GB 14.4 Solid | solid | Centrex Symmetrical Mass Bias | asymmetric | 2.466 | 0.056 | 2025-02 |
| Hammer | Black Widow Urethane Mint Solid | Hammer Solid Urethane | urethane | Gas Mask | asymmetric | 2.5 | 0.058 | 2025-05 |
| Hammer | Raw Hammer Red/White/Purple | Juiced Pearl | pearl | Raw Hammer (2021) | symmetric | 2.537 | 0.038 | 2026-05 |
| Motiv | Supra (GT) | Propulsion XRT Pearl | pearl | Quadfire V2 | symmetric | 2.57 | 0.04 | 2024-07 |
| Radical | Vexed | HK22C+ Solid | solid | Vexed | asymmetric | 2.498 | 0.036 | 2026-03 |
| Roto Grip | Hustle (PAR) Purple-Azure-Ruby | VTC Plus Solid | solid | Hustle | symmetric | 2.53 | 0.03 | 2024-12 |
| Storm | Bite Panic X | EXO Pearl | pearl | G2 | asymmetric | 2.47 | 0.058 | 2024-07 |
| Storm | Hy-Road Punch | R2S DEEP Pearl | pearl | Inverted Fe2 A.I. | symmetric | 2.55 | 0.045 | 2024-05 |
| Storm | Motor Rev | RX Pro Pearl | pearl | Torque A.I. | asymmetric | 2.48 | 0.052 | 2025-12 |
| Storm | Summit Knight | NRG Pro Pearl | pearl | Centripetal HD A.I. | symmetric | 2.46 | 0.056 | 2025-01 |
| Swag | Goat | Up 1 Pearl | pearl | Dominance V2 | asymmetric | 2.554 | 0.041 | 2024-10 |

## Sample — still unfilled (~15)

- 900 Global — Alibi
- ABS — Heki Channel
- ABS — Ultra Bend LV 6.0
- Brunswick — Rhino Pro Black (2024)
- Ebonite — Mission Signal
- Epic — Bowling         Curve Red-Black Gold (Midnight-Apple-Gold)
- Hammer — Blue Solid Urethane Hammer
- Hero — HB Pink-Blue-Gold (The Warrior Princess)
- Motiv — Frenzy Red/Dark Red/Black
- Pyramid — Bowling          Prime Pearl
- Roto Grip — Hustle (WM) White/Magenta
- Storm — Clear Storm White
- Storm — Phaze Shift (P-B-W)
- Sunbridge — Co., Ltd.          Just A Way Blue-Pink-White
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

### Spine parsing artifacts (left as-is, not repaired here)

Several USBC-spine records have a broken brand/name split (e.g. brand `Pro` + name `Bowl Under Cover ...` = "Pro Bowl", brand `Bowl` + name `Star Bowl Star`, brand `Epic`/`Bowling` + `Be Epic`/`Bowling Mania`). These are niche/import brands absent from the TenPinDoctors CSV, so they resolve to `specSource: none` regardless. The spine is the authoritative window; its records are preserved verbatim rather than rewritten here.

