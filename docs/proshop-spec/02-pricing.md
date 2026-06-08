# 02 — Verified Pricing (mock catalog)

**All prices here are MOCK.** They are anchored to real 2026 US retail prices so the catalog reads as believable, but they are NOT All Star Bowl's prices. This file lists only prices that survived a verification pass. Suspect or unsourced figures were dropped or flagged.

**Category convention for the UI:** in this product category, street price runs 30–40% under MSRP and "sale" is the permanent default. Show a struck-through **list** price plus a current **sale** price and a "SAVE X%" badge — a single clean price actually reads as *less* authentic than the real, messy pricing. (See `04-standard-shop-spec.md` for how the card renders this.)

---

## 1. Confirmed price anchors (live 2026 sources)

Each of these was confirmed against a live retailer page during research. Use them as the spine of the mock catalog.

| Product | Type | Sale | List | Status | Source |
|---|---|---|---|---|---|
| Storm Hy-Road | Ball (entry/mid reactive) | $138.99 | $229.99 | CONFIRMED EXACT | bowling.com |
| Columbia 300 White Dot Diamond | Ball (spare/plastic) | $63.99 | $79.99 | CONFIRMED EXACT (closeout) | bowling.com |
| Brunswick Rhino | Ball (entry reactive) | ~$85.99 | $139.95 | CONFIRMED band; sale drifts ±$2 | bowling.com |
| Brunswick Twist | Ball (entry reactive) | ~$75.99 | — | CONFIRMED band (color-dependent) | bowling.com |
| Storm Concept | Ball (performance) | $189.95 | — | CONFIRMED EXACT | bowlersmart 2026 + retailers |
| Storm Ion Max Pearl | Ball (performance) | $199.95 | — | CONFIRMED EXACT | bowling.com |
| Storm Bionic | Ball (performance) | $184.95 | $259.99 | CONFIRMED (figure was stale; use $184.95) | bowling.com |
| Hammer Full Effect | Ball (performance) | $194.95 | $269.99 | CONFIRMED EXACT | bowlersmart / bowling.com |
| Storm Phaze A.I. | Ball (performance) | $174.95 | — | CONFIRMED (cross-checked off blocked source) | The Bowler Depot + retailers |
| Dexter SST 8 Power-Frame BOA | Shoe (performance) | $249.95 | — | CONFIRMED EXACT | bowling.com / dexterbowling.com |
| Dexter Pro BOA | Shoe (mid) | $119.95 | — | CONFIRMED EXACT | bowlersmart / bowlingworld |
| Storm Reacta Clean (8oz) | Accessory (cleaner) | $13.95–$14.99 | $21.95 | CONFIRMED as a band (exact drifted; use band) | bowlersmart |

---

## 2. Verified category price bands

Every confirmed anchor above lands inside its band. Use these bands for any mock product not on the anchor list, and label such items as estimates.

| Category | Band | Notes |
|---|---|---|
| Spare / plastic ball | $50–$90 | Columbia White Dot Diamond anchors this. |
| Entry reactive ball | $75–$140 | Rhino, Twist, Hy-Road sale anchor this. |
| Mid reactive ball | $130–$175 | |
| Performance ball | $175–$260 | Concept, Ion Max, Bionic, Full Effect, Phaze A.I. anchor this; band top well-supported by list prices ~$260–$270. |
| Tote / single bag | $30–$90 | |
| Roller / tournament bag | $120–$290 | KR bag range (~$50–$320) supports both bag bands. |
| Entry shoe | $40–$80 | |
| Mid shoe | $80–$130 | Dexter Pro BOA ($119.95) anchors this. |
| Performance shoe | $130–$260 | Dexter SST 8 ($249.95) anchors the top. |
| Accessory (tape/grip/towel/cleaner) | $5–$30 | Reacta Clean anchors this. |
| Wrist support / brace | $20–$70 | No exact source; band only. |
| Service (drill/plug/resurface/install) | $10–$100 per job | No exact source; band only. |

---

## 3. Corrections applied during verification

These were caught and fixed so they are not propagated as fact:

1. **KR Flyer Lite — DROPPED.** It was mislabeled as a bag; it is actually a shoe, is discontinued, and the cited price ($59.95/$76.95) matched no live listing. Removed entirely. For an entry-shoe anchor, use a current Dexter DexLite/KR line instead; for a tote anchor, use an in-stock KR bag.
2. **Storm Bionic — corrected $174.95 → $184.95** (list $259.99). Earlier figure was stale by ~$10.
3. **Storm Reacta Clean — corrected $14.99 → $13.95–$14.99 band.** The cited source showed $13.95; treat as a band, not an exact.
4. **Brunswick Rhino / Twist — treated as approximate, not exact.** Live drifts to $85.99 / $75.99 (±$2, same band).

---

## 4. Unsourced — DO NOT present as live pricing

These have no credible exact source. They are safe for a mock catalog *if labeled as estimates*, but must never appear as "our price" without a confirm pass:

- **Motiv Jackal**, **DV8 flagship** ball prices — estimated from the performance band only.
- **Gloves**, **Mongoose wrist supports** — no exact source.
- **Tape / inserts / towels / rosin** exact figures — sourced to ranges only.
- Anything originally sourced via search snippet from bowlingball.com (HTTP 403, never read directly) — soft until confirmed on an accessible retailer. (Phaze A.I. happened to check out independently and is in the confirmed table; the rest stay soft.)

---

## 5. Service pricing (mock, band-only)

No exact sources; present as "starting at" estimates and confirm with the shop before publishing.

| Service | Mock estimate | Confidence |
|---|---|---|
| Drilling (with ball purchase) | often bundled / $30–$50 standalone | 🔴 band |
| Plug & redrill | $40–$70 | 🔴 band |
| Resurface (Abralon) | $20–$40 | 🔴 band |
| Oil extraction / detox | $25–$50 | 🔴 band |
| Grip/insert install | $10–$25 | 🔴 band |

All service prices are placeholders. The real numbers and the "free fitting?" question are client-confirmation items (see `README.md` open questions).
