# All Star Bowl Pro Shop — Visual Inventory & Spatial Layout

**Purpose:** Exhaustive, structured inventory of everything visible in the All Star Bowl pro shop, derived from on-site photography. This is the source-of-truth reference for both the STANDARD web shop (catalog data) and the 3D walk-in simulation (scene geometry + prop placement). Checkout is out of scope; pricing/cart are mocked.

**Business:** All Star Bowl, 726 N Shortridge Rd, Indianapolis IN 46219.

**Confidence legend used throughout:**
- ✅ **Read** — clearly visible / legible in source image.
- 🟡 **Inferred** — reasonable read partly obscured or interpolated.
- 🔴 **Guess (pano distortion)** — equirectangular curvature or low resolution makes this an estimate; treat counts as ±25%.

---

## 0. Source images analyzed

| File | Type | Native px | What it shows |
|---|---|---|---|
| `asb-132-proshop-360-pano.jpg` | Equirectangular 360 | 4166×2083 | Counter-facing view: bag wall + shoe/accessory shelves (left), reception counter (center), HOT DEALS + NEW ARRIVALS ball walls (right). Lane entrance at far left edge. |
| `asb-133-proshop-360-pano.jpg` | Equirectangular 360 | 5554×2777 | Rotated view: open lane doorway (left), bag/shoe wall, counter, full NEW ARRIVALS ball wall with bag row beneath (right). Highest-res asset. |
| `asb-079.jpg` | Equirectangular 360 | 1600×800 | Wide overview, same room; signage band legible: HOT DEALS, NEW ARRIVALS. |
| `asb-019.jpg` | Flat retail photo | 1600×1060 | NEW ARRIVALS ball wall, head-on. Boxed product + bag row at floor. **Best ball-count source.** |
| `asb-044.jpg` | Flat photo | 1600×900 | House-ball rack closeup (12 used balls, 2 tiers). |
| `proshop-01/02/03.jpg` | Curated refs | — | Duplicates of asb-019 (01/03) and asb-044 (02). No new info. |
| `pro-shop-interior-panorama.png`, `pro-shop-ball-wall.png` | AI-generated | — | Stylized; **do not use for inventory facts**, mood/lighting reference only. |

> **Pano caveat:** Both 360s are equirectangular. Straight shelves bow into arcs, the ceiling balloons, and the floor stretches into a vertical-streak band at the bottom (the photographer/tripod nadir). Horizontal distances near the poles (ceiling/floor) are unreliable. All wall-mounted item counts were cross-checked against the flat photo `asb-019` where possible.

---

## 1. Room shell (architecture)

| Element | Detail | Confidence |
|---|---|---|
| Footprint | Single rectangular retail room, roughly square-ish. Long axis runs counter ↔ lane entrance. Estimated ~28–34 ft wide × ~24–28 ft deep. | 🔴 dimensions guessed from pano |
| Ceiling | White suspended acoustic drop-tile grid (2×2 ft tiles). One large circular recessed vent/diffuser dead-center. Multiple rectangular fluorescent troffer light panels. | ✅ |
| Lighting | Recessed fluorescent troffers in a regular grid, bright neutral-white, even fill. No accent/spot lighting. Daylight bleeds from lane area. | ✅ |
| Walls | Painted CMU (cinderblock). Two-tone: pale gray/white upper, mustard-yellow lower wainscot band (~waist height). Ball/bag walls use white horizontal **slatwall** panels mounted over the block. | ✅ |
| Floor | Signature bowling-novelty carpet: black ground printed with bright bowling pins, balls, stars, and splatter in magenta/pink, cyan, teal, purple, lime. High-saturation, busy pattern wall-to-wall. | ✅ |
| Lane entrance | Open doorway / roll-up shutter opening at one end leading directly onto the bowling lanes (approach, pins, ball returns, spectator chairs visible through it). Shutter housing visible above the opening. | ✅ |
| Doors | Lane opening (left). One interior wood door behind counter (office/back room). A second dark doorway right of counter. | ✅ / 🟡 |

---

## 2. Master zone map (plan view)

Looking at the room as a clock from the entrance, walking the perimeter:

```
                        [ LANE ENTRANCE / open doorway to lanes ]
                                       |
   ZONE E ----------------------------+---------------------------- ZONE A
   House "Used balls"                                          Bag wall +
   rack + boxed                                                shoe wall +
   accessory pallets                                           accessory pegs
        |                                                            |
        |                  ZONE D                                    |
        |             RECEPTION COUNTER                              |
        |          (curved stacked-stone face,                      |
        |           monitors, register, signage)                    |
        |                                                            |
   ZONE C ---------------------------------------------------------- ZONE B
   HOT DEALS                                                   NEW ARRIVALS
   ball wall (slatwall)                                        ball wall (slatwall)
                                                               + bag row + boxed
                                                                 product beneath
```

- **Zone A — Bag & shoe wall** (left wall in counter-facing pano `asb-132`)
- **Zone B — NEW ARRIVALS ball wall** (right wall; head-on in `asb-019`)
- **Zone C — HOT DEALS ball wall** (continues right of counter)
- **Zone D — Reception counter** (center)
- **Zone E — House/used-ball rack + boxed accessory pallets** (near lane entrance)

Each zone is detailed in `02-zone-details.md`. Quantities summarized below.

---

## 3. Inventory rollup (quantities)

### 3.1 Bowling balls

| Group | Location | Approx count | Racking | Confidence |
|---|---|---|---|---|
| NEW ARRIVALS wall | Zone B | **~42–48** | Slatwall, mounted on chrome single-ball ring brackets, ~6 rows tall × ~8–9 cols, finger-holes facing out, price/spec tag clipped beneath each | ✅ count from `asb-019` (counted ~44 distinct balls) |
| HOT DEALS wall | Zone C | **~18–28** | Same slatwall + ring-bracket system, smaller panel | 🔴 partially behind counter / pano-distorted |
| House "Used balls for sale" rack | Zone E | **12 visible** (2 tiers × 6) on the photographed rack; likely 2–3 such racks → **~24–36** | Red/blue painted wood gravity rack, wood dowel rails, balls rest in cradles | ✅ for the 12 shown; 🟡 for total rack count |
| **Total sellable balls on display** | — | **~75–110** | — | 🟡 |

Ball finishes seen: solid black (used/house), pearl/metallic (teal, magenta, blue, red), and on the new-arrivals wall a wide spread of **two- and three-color swirl/galaxy reactive-resin** finishes — purple/blue, orange/black flame, green/black, white-pearl, red/orange sunset, blue/silver. High color variety on the new wall; muted/solid on the house rack.

### 3.2 Bags

| Type | Location | Approx count | Display | Confidence |
|---|---|---|---|---|
| Boxed roller/tote bags (floor row) | Zone B, beneath ball wall | **~10–14** | Lined up on the floor along the wainscot, upright, leaning on product boxes | ✅ (counted ~12 in `asb-019`) |
| Hanging single/double tote bags | Zone A, top of bag wall | **~10–16** | Hung on slatwall arms at head height, 1–2 rows | ✅ |
| Roller bags w/ retractable handle | Zone A + flanking counter | several (**~4–8**) | Standing on floor against walls / by counter ends | 🟡 |
| **Total bags** | — | **~25–35** | — | 🟡 |

Bag colors/brands legible: **Vise** (red & black embroidered totes — clearly readable), Track/Hammer-style, plus orange, royal blue, purple, teal, pink, gray totes. Mix of 1-ball, 2-ball tote, and 3-ball roller styles.

### 3.3 Shoes

| Item | Location | Approx count | Display | Confidence |
|---|---|---|---|---|
| Bowling shoes (boxed + display pairs) | Zone A, mid/lower bag wall | **~12–20 pairs** | Display pairs sitting on small slatwall shelves; stacked shoe boxes on lower shelves | ✅ display pairs visible, 🟡 exact pairs |

### 3.4 Accessories (pegs, shelves, counter)

| Item | Location | Display | Confidence |
|---|---|---|---|
| Wrist supports / positioners | Zone A accessory pegs + counter spinner | Blister-pack pegboard cards | 🟡 (peg cards visible, individual SKUs not legible) |
| Bowling tape (insert/protective/textured) | Pegs near counter + countertop | Small boxed/carded items | 🟡 |
| Finger/thumb inserts & grips | Pegs + countertop spinner racks | Small carded items | 🟡 |
| Rosin bags / grip sacks | Countertop | Loose/boxed | 🔴 |
| Towels / microfiber & shammy pads | Pegs / shelf | Folded, carded | 🟡 |
| Ball cleaner / polish bottles | Shelf behind counter + pegs | Bottles in rows | 🟡 |
| Skid/slide accessories, shoe brushes, heel/sole parts | Pegs near shoes | Carded | 🔴 |
| Wrist braces / elbow supports | Pegs | Carded | 🔴 |
| Tape/grip multi-card spinner | Countertop | Rotating display | 🟡 |

> The dense pegboard between the shoe shelves and the counter (`asb-132` left/center) holds dozens of small carded accessories. **Individual SKUs are NOT legible** — treat as a "wall of small accessories" prop with representative mock SKUs in the catalog.

### 3.5 Counter / reception (Zone D)

| Element | Detail | Confidence |
|---|---|---|
| Counter body | Curved (convex) front-of-house counter, face clad in **stacked gray stone / faux-ledgestone** veneer. Flat dark laminate top. | ✅ |
| Register/POS | POS terminal + at least **2 flat-panel monitors** mounted on the back wall above/behind the counter (likely scoring/league or product displays). | ✅ |
| Back wall behind counter | Mounted monitors, a wood interior door, framed certificates/signage, small shelved retail behind. | ✅ |
| Counter-top retail | Spinner display racks of small accessories, a literature/brochure stand, register mat. | 🟡 |
| Drill press / pro work area | NOT clearly visible in frame — a ball-drilling/plug station almost certainly exists in the back room behind the counter door. **Flag as assumed, not photographed.** | 🔴 assumed |

### 3.6 Signage (legible text)

| Sign | Text | Location | Confidence |
|---|---|---|---|
| Ball wall banner | **"NEW ARRIVALS"** | Top of Zone B ball wall (orange/yellow banner, red text) | ✅ |
| Ball wall banner | **"HOT DEALS"** | Top of Zone C ball wall (blue banner) | ✅ |
| House rack sign | **"Used bowling balls for sale"** (with arrows) | Above Zone E house-ball rack | ✅ |
| Brand strip signs | Small blue/white header signs along bag wall — likely brand logos (Storm/Roto Grip/Brunswick-style). Text not fully legible. | Zone A header band | 🟡 |
| Per-ball spec tags | White clip tags under each new-arrival ball (brand, model, weight, price). Layout readable, text not. | Zone B | 🟡 |

### 3.7 Misc props (for scene dressing)

- Black molded-plastic stacking chair (right of NEW ARRIVALS wall) ✅
- Stacked product boxes (shoe boxes, ball boxes) on floor along walls ✅
- Wheeled/roller carts parked at wall ends 🟡
- Brochure / literature stand on counter 🟡
- Spectator chairs + lanes + pin decks visible THROUGH the lane doorway (background only) ✅

---

## 4. Brand logos / products spotted (for mock catalog realism)

Legible or strongly inferred from ball finishes, tags, and bag embroidery:

- **Vise** — bag embroidery (clearly read). ✅
- **Storm / Roto Grip** — finish styles + tag layout strongly suggest these (dominant in modern reactive new-arrivals walls). 🟡
- **Track** — yellow boxed product near floor row matches Track packaging. 🟡
- **Hammer / Brunswick / Motiv / DV8 / Ebonite** — plausible given a full new-arrivals wall; not individually confirmed. 🔴

> For the mock catalog, generate plausible model names per brand (e.g., Storm Phaze, Roto Grip Hustle, Hammer Black Widow) but **mark them as representative/mock**, not confirmed in-store SKUs.

---

## 5. What is clearly readable vs. guessed (summary for builders)

**Clearly readable (build to these):**
- Room shell, two-tone walls, slatwall ball/bag walls, stacked-stone curved counter, novelty carpet, drop-ceiling, lane doorway.
- Three sign zones: NEW ARRIVALS, HOT DEALS, "Used bowling balls for sale."
- New-arrivals ball wall ~44 balls in a grid with under-tags + floor row of ~12 bags.
- House-ball rack: 12 balls, 2 tiers, red/blue wood gravity rack.
- Bag wall with hanging totes + shoe display + dense accessory pegboard.
- Vise-branded bags.

**Guessed / interpolated (use ranges, don't hard-code):**
- All total counts beyond the head-on ball wall (pano distortion).
- HOT DEALS ball count, number of house-ball racks, exact shoe pair count.
- Individual accessory SKUs on pegboard.
- Existence/location of a drill press / back-room work area.
- Room dimensions in feet.

See `02-zone-details.md` for per-zone spatial coordinates and `03-mock-catalog-schema.md` for the product data model.
