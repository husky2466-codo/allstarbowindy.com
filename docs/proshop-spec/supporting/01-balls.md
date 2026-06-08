# Bowling Balls — Pricing Spec

Real product lines and 2026 street prices, tiered the way a pro shop merchandises them. Use these for the mock catalog. Prices are point-in-time June 2026; the build can hardcode them.

> Important pricing reality: bowling balls are **almost always sold below MSRP**. Street price is typically 30-40% under list. Present both (list struck through + "SAVE X%") for authenticity. Ball weights run 6-16 lb; price does not vary by weight within a model.

---

## Tier 1 — Spare / Plastic (polyester)

Straight-rolling balls for picking up spares or absolute beginners. Lowest price tier, no hook.

| Product | Brand | Street price | List/MSRP | Source |
|---|---|---|---|---|
| White Dot Diamond | Columbia 300 | $63.99 | $79.99 | bowling.com (confirmed) |
| White Dot (solid colors) | Columbia 300 | ~$60 – $75 | — | bowlersmart / national bowling store (snippet) |
| T-Zone / spare plastic | Brunswick | ~$55 – $70 | — | expertbowler guide |
| Spare ball (generic plastic) | Motiv / Hammer | ~$50 – $80 | — | motivbowling.com / hammerbowling.com (category) |

**Band: $50 – $90.** White Dot is the canonical example — "most popular polyester ball in history."

---

## Tier 2 — Entry Reactive

First "hooking" ball. Reactive resin cover, entry symmetric core. Good league starter.

| Product | Brand | Street price | List/MSRP | Source |
|---|---|---|---|---|
| Twist | Brunswick | $77.99 | $129.95 | bowling.com (confirmed) |
| Rhino (pearl) | Brunswick | $87.99 | $139.95 | bowling.com (confirmed) |
| Rhino (solid) | Brunswick | ~$87.95 | — | bowlersmart (snippet) |
| First reactive (generic band) | Storm / Roto Grip | $90 – $160 | — | expertbowler / bowling.com (snippet) |

**Band: $75 – $140.** Twist is the standard "wallet-friendly first hook ball" reference.

---

## Tier 3 — Mid / Benchmark Reactive

The "do-everything" balls experienced league bowlers reach for first. This is the volume tier.

| Product | Brand | Street price | List/MSRP | Source |
|---|---|---|---|---|
| Hy-Road | Storm | $138.99 | $229.99 | bowling.com (confirmed) |
| Hy-Road Pearl | Storm | ~$135 – $150 | — | national bowling store (snippet) |
| Axe | Hammer | ~$130 – $150 | — | ctdbowling.com (snippet) |
| IQ Tour | Storm | $179.99 | — | bowling.com (snippet) |

**Band: $130 – $175.** Hy-Road is the textbook "benchmark" ball — lead with it in this tier.

---

## Tier 4 — High-Performance

Top-end coverstocks, asymmetric/A.I. cores, latest releases. Premium tier.

| Product | Brand | Street price | List/MSRP | Source |
|---|---|---|---|---|
| Phaze A.I. | Storm | ~$199 (new lower price) | $259.95 typical hi-perf list | bowlingball.com / expertbowler (snippet) |
| Phaze 3 (Phaze III) | Storm | ~$199 – $220 | — | bowlersmart / bowling.com (snippet) |
| IQ Tour A.I. | Storm | ~$199.95 | — | buddiesproshop (snippet) |
| Bionic | Storm | $174.95 | — | bowlersmart 2026 guide (confirmed snippet) |
| Concept | Storm | $189.95 | — | bowlersmart 2026 guide (confirmed snippet) |
| Ion Max | Storm | $174.95 | — | bowlersmart (snippet) |
| Ion Max Pearl | Storm | $199.95 | — | bowlersmart (snippet) |
| Full Effect | Hammer | $194.95 | — | bowlersmart (snippet) |
| Jackal (line) | Motiv | ~$200 – $230 | — | **[UNSOURCED — estimate]** typical Motiv flagship band |
| Roto Grip flagship (e.g. Hyped/UFO line) | Roto Grip | $164.95 – $199.95 | — | bowlersmart 2026 tournament band (snippet) |
| DV8 flagship | DV8 | ~$180 – $220 | — | **[UNSOURCED — estimate]** DV8 sits in Brunswick-family hi-perf band |

**Band: $175 – $260.** Typical high-end list price cited at $259.95; street settles $175-$220 for current releases.

---

## Build notes for the catalog

- Recommended hero items per tier (good 3D-wall candidates): White Dot (spare), Twist (entry), Hy-Road (mid), Phaze A.I. (hi-perf). These are the most recognizable names and all confirmed-priced or near-confirmed.
- Add a `tier` field (spare / entry / mid / performance) so both shop modes can filter and so the 3D wall can group balls by shelf.
- Each ball needs a `weights` array (typically 10,11,12,13,14,15,16) for the mock product card — price is flat across weights.
- Mark drilling as an **add-on at checkout-mock** (see services doc): an undrilled ball is what's priced here; drilling is +$40-$70.
