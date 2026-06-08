# 01 — Visual Inventory of the Real Pro Shop

Read directly off the photos listed in `README.md`. This is the ground truth for what the standard shop depicts and what the 3D walk-in must reproduce. Every line carries a confidence flag:

- ✅ **read** — clearly visible and countable/legible in a flat photo.
- 🟡 **inferred** — visible but distorted (pano) or partially occluded; estimate.
- 🔴 **guess** — not photographed; assumed from how pro shops normally work.

---

## 1. The room shell

| Element | Detail | Confidence |
|---|---|---|
| Footprint | One retail room, roughly 30×30 ft, rectangular, open to the lanes through a wide roll-up doorway/archway. | 🟡 |
| Ceiling | White drop-tile ceiling, recessed fluorescent troffers, one round center vent/diffuser. | ✅ |
| Walls | Two-tone CMU (cinderblock): gray-white upper, mustard/gold-yellow wainscot band at the bottom. | ✅ |
| Floor | Wall-to-wall novelty bowling carpet — black ground with pink/cyan/teal/purple pins, balls, and stars. **This is the dominant brand identity element** and must be reproduced; it is what makes the room unmistakably All Star. | ✅ |
| Lane archway | Open doorway to the lanes: approach, pins, ball returns, blue spectator chairs, and overhead scoring monitors visible through it. | ✅ |
| Lighting feel | Bright, even, slightly cool fluorescent. Glossy ball surfaces catch hard specular highlights. | ✅ |

---

## 2. Bowling balls

The retail ball display is the visual centerpiece — chrome slatwall with ring brackets, holes facing out, a white spec/price tag clipped beneath each ball.

| Zone | Count | Detail | Confidence |
|---|---|---|---|
| **NEW ARRIVALS wall** | ~44 balls | ~6 rows × ~8 columns on chrome slatwall ring brackets. Orange "NEW ARRIVALS" banner above. Wide reactive-resin color variety: purple/blue galaxy, orange/black flame, green/black, white pearl, red/orange sunset, blue/silver swirl. Counted head-on in `asb-019`. | ✅ |
| **Second ball wall / "SPECIALS" or "HOT DEALS"** | ~18–28 balls | Blue banner. Pano-distorted, so the count is an estimate. Same slatwall treatment. | 🟡 |
| **House / used-ball rack** | 12 confirmed | "Used bowling balls for sale." Red/blue painted wood gravity rack, 2 tiers × 6. Solid black, teal/magenta/navy pearls, painted weights (10, 14 legible in `asb-044`). Likely 2–3 such racks total. | ✅ (one rack) / 🟡 (additional racks) |

**Color palette for ball props (from photos):** galaxy purple/blue, orange-black flame, green-black, white pearl, red-orange sunset, blue-silver swirl, teal pearl, magenta/pink pearl, navy, solid black. Use these to texture the 3D wall and to fill catalog thumbnails so the shop reads as the real one.

---

## 3. Bags

| Zone | Count | Detail | Confidence |
|---|---|---|---|
| Floor row under NEW ARRIVALS wall | ~12 | Boxed single rollers and totes lined along the floor (purple, pink, gray, orange, blue visible). | ✅ |
| Bag wall (hanging) | ~10–16 | Hanging totes on the bag wall left-of-center. | 🟡 |
| Roller bags | several | Larger wheeled roller/tournament bags. | 🟡 |

**Brand note:** **Vise** is the *only* clearly legible bag brand (red & black embroidered totes in `asb-019`). All other bag brands are mock.

Total bags on display: ~25–35. 🟡

---

## 4. Shoes

| Element | Count | Detail | Confidence |
|---|---|---|---|
| Display pairs on bag wall | ~12–20 | Display pairs mounted on the bag wall. | 🟡 |
| Stacked shoe boxes below | many | Boxes stacked beneath the display pairs (typical size-stock storage). | ✅ |

Brands not legible — all shoe brands/models are mock.

---

## 5. Accessories

Dense pegboard panel of small carded items near the counter (visible in `asb-132`). Individual SKUs are **not legible** in any photo. Categories normally present and assumed: grip/finger inserts, thumb/insert tape, skin tape, wrist supports/braces, towels/shammies, ball cleaners, rosin/grip sacks, tape removers.

- Treat the pegboard as **one grouped panel** with mock SKUs rather than trying to place individual hooks. ✅ panel present, 🔴 individual SKUs.

---

## 6. Counter and service area

| Element | Detail | Confidence |
|---|---|---|
| Reception counter | Curved/convex counter clad in stacked gray faux-ledgestone, dark laminate top. Centerpiece of the room. | ✅ |
| Monitors | ≥2 wall-mounted screens behind the counter (likely menu/scoring/promo). | ✅ |
| Office door | Wood office door beside/behind the counter. | ✅ |
| Drill / work area | Ball drilling and plugging happen in a back work area — **not photographed.** Assumed present (every pro shop has one). | 🔴 |

---

## 7. Signage and identity cues

- Orange **"NEW ARRIVALS"** banner over the main ball wall. ✅
- Blue banner over the second ball wall (**"SPECIALS"** / **"HOT DEALS"** — exact wording soft due to pano distortion). 🟡
- Handwritten/printed **"Used bowling balls for sale"** at the house-ball rack. ✅
- The novelty carpet is the strongest identity signal — pull its pink/cyan/teal/purple-on-black palette into the site's accent system so the digital shop feels like the same place. ✅

---

## 8. Zone map (for the 3D walk-in node graph)

Reading the hero pano `asb-133` clockwise from the lane archway:

1. **Lane archway** (open doorway to lanes) — entrance/exit node, looking out to approach + pins.
2. **NEW ARRIVALS ball wall** (right side) — primary product node, ~44 balls.
3. **Bag floor row** (below the ball wall) — bags node.
4. **Counter** (center, stacked stone) — service/welcome node, monitors behind.
5. **Bag wall + shoe display + accessory pegboard** (left-of-center) — bags/shoes/accessories node.
6. **Second ball wall / SPECIALS** — secondary product node.

This 6-zone clockwise loop is the skeleton for the 3D tour-node graph in `05-3d-walkin-sim-spec.md` and the wall-slot assignments in `06-shared-product-data-model.md`.

---

## 9. What is NOT visible (do not fabricate as fact)

- Exact ball brands/models (except none are legible — all mock).
- Exact prices on the clipped tags (illegible — use mock pricing from `02`).
- The back drill room.
- Restrooms, storage, employee areas.
- Any signage wording where the pano is too distorted to read confidently.

Treat all of the above as 🔴 and label it as assumed in any client-facing copy.
