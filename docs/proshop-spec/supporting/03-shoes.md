# Shoes — Pricing Spec

Real 2026 street prices. Three tiers: rental-grade/entry athletic (universal sole, both feet slide), athletic/mid (better materials), and performance (interchangeable slide sole + heel, BOA dial lacing, slide-foot-specific).

> Key distinction for the catalog: **performance shoes are handed** (right- or left-hand bowler — the slide foot differs) and have **interchangeable soles**. Entry/athletic shoes are universal. Surface a `handed` boolean and an `interchangeable_sole` boolean.

| Tier | Product | Brand | Street price | List/MSRP | Source |
|---|---|---|---|---|---|
| Entry / rental-grade | Flyer Lite | KR Strikeforce | $59.95 | $76.95 | krstrikeforce.com / bowlersmart (confirmed snippet) |
| Entry / athletic | Flyer Mesh | KR Strikeforce | ~$60 – $80 | — | krstrikeforce.com (snippet) |
| Entry band (guide) | "athletic shoe under $80" | various | < $80 | — | expertbowler guide |
| Mid / performance-value | DexLite Pro BOA | Dexter | ~$119 – $130 | — | bowling.com (snippet) |
| Performance | Pro BOA (White/Grey etc.) | Dexter | $119.95 | — | bowlerx (confirmed snippet) |
| Performance / interchangeable | SST 8 Power-Frame BOA | Dexter | $249.95 | — | bowling.com / dexterbowling.com (confirmed snippet) |
| Performance band (guide) | high-end models | Dexter | ~$259.95 | — | expertbowler guide |

## Price bands

| Shoe class | Band |
|---|---|
| Rental-grade / entry athletic | $40 – $80 |
| Athletic / mid | $80 – $130 |
| Performance / interchangeable-sole BOA | $130 – $260 |

## Build notes

- Recommended hero items: KR Flyer Lite (entry, $59.95 with struck list), Dexter Pro BOA (performance-value, $119.95), Dexter SST 8 Power-Frame BOA (top performance, $249.95). All confirmed-snippet.
- Shoes need a `sizes` array and a `gender` field (men's / women's / unisex youth) — pro shops stock all three.
- For performance shoes, add `handed: "right" | "left"` since the slide sole is foot-specific.
- KR Strikeforce = value leader; Dexter = performance/innovation leader (BOA, interchangeable soles). Use that framing in tier copy.
