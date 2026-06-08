# Pro Shop — Per-Zone Detail & 3D Scene Coordinates

Companion to `01-inventory-and-layout.md`. This gives DesignClaude a buildable spatial spec for the 3D walk-in simulation: a normalized room coordinate system, per-zone placement, and prop manifests. Counts/finishes trace back to the inventory doc.

> All measurements are **normalized model units** unless a real-world estimate is noted. Treat the room as a box; refine to taste. The point is relative placement so the scene reads as "the real All Star Bowl pro shop."

---

## Coordinate system

- Right-handed, **+X = right, +Y = up, +Z = toward viewer/entrance**.
- Origin `(0,0,0)` = center of floor.
- Room box (suggested): **X ∈ [-5, +5]**, **Z ∈ [-5, +5]**, **ceiling Y = 3.0**, eye height **Y = 1.6**.
- Real-world scale guess: 1 unit ≈ 3 ft, so room ≈ 30×30 ft, 9 ft ceiling. 🔴 guessed.
- Default spawn: `(0, 1.6, +4.0)`, facing −Z (looking at the counter / back wall).

```
            BACK WALL (Z = -5)  -> counter + monitors + office door
   LEFT (X=-5)                                   RIGHT (X=+5)
   Zone A bag/shoe wall                          Zone B/C ball walls
   + Zone E house rack                           (NEW ARRIVALS / HOT DEALS)
   + lane doorway (back-left corner)
            FRONT WALL (Z = +5) -> entrance / glass / open area
```

> NOTE on real adjacency: in the photos the lane doorway, bag wall, counter, and ball walls are all visible in one 360 sweep, so they wrap the room. The mapping above is **one valid unfolding** — DesignClaude can rotate it, but keep these adjacencies: counter centered on back wall; NEW ARRIVALS and HOT DEALS together on one side wall; bag/shoe wall on the opposite side wall; house-ball rack + lane doorway near a back corner.

---

## Zone A — Bag & Shoe Wall + Accessory Pegboard

**Wall:** Left wall, X = -5, spanning Z ≈ [-3.5, +2.0].
**Surface:** White horizontal slatwall over yellow-wainscot block.

| Sub-element | Placement (X,Y,Z) | Contents | Interactable? |
|---|---|---|---|
| Hanging tote bags (top row) | X=-4.9, Y≈1.9, Z spread | ~10–16 single/double totes on slatwall arms; colors red/black **Vise**, royal, orange, purple, teal, pink, gray | ✅ each bag = a clickable product |
| Shoe display shelves (mid) | X=-4.9, Y≈1.2, Z spread | ~12–20 display shoe pairs on small slat shelves | ✅ clickable |
| Boxed shoes (lower) | X=-4.7, Y≈0.3, Z spread | Stacked shoe boxes on floor/lower shelf | static / optional click |
| Accessory pegboard | X=-4.9, Y≈1.0–1.7, Z near counter end | Dense small carded accessories (tape, grips, inserts, wrist supports, towels, cleaners) | ✅ as a grouped "accessories" panel; individual pegs = mock SKUs |
| Roller bags (floor) | X=-4.6, Y≈0.4, at zone ends | ~4–8 standing roller bags | ✅ clickable |

**Build note:** Use a repeating slatwall texture. Bags hang at ~1.9 with ~0.5 spacing. Shoes on a thin shelf at ~1.2. Pegboard is a separate textured panel; clicking it opens a grouped accessories sub-menu rather than 30 individual hotspots.

---

## Zone B — NEW ARRIVALS Ball Wall (hero feature)

**Wall:** Right wall, X = +5, spanning Z ≈ [-2.5, +2.5]. This is the most detailed, best-lit, head-on-photographed feature (`asb-019`). Make it the showpiece.

| Element | Placement | Detail |
|---|---|---|
| "NEW ARRIVALS" banner | X=4.95, Y≈2.4, top of wall | Orange/yellow banner, red text. ✅ |
| Ball grid | X=4.85, Y≈0.9–2.1 | **~44 balls**, ~6 rows × ~8 cols, on chrome single-ball ring brackets, finger-holes facing out. Spacing ~0.45 units. |
| Per-ball spec tag | just below each ball, Y offset −0.18 | White clip card: brand / model / weight / mock price. |
| Floor bag row | X=4.5, Y≈0.4, along wainscot | ~12 boxed roller/tote bags leaning on product boxes. |
| Boxed product stacks | X=4.6, Y≈0.2 | Shoe/ball boxes stacked behind the bag row. |
| Stacking chair | X=4.6, Y=0, Z≈+2.3 | Black molded plastic chair (scene dressing). |

**Ball finish palette for this wall (build variety in):** purple/blue galaxy, orange/black flame, green/black, white pearl, red/orange sunset, blue/silver swirl, magenta pearl, teal pearl, deep solid black, multicolor reactive. High saturation, glossy reactive-resin look. Each ball should have a subtle specular highlight + the three drilled holes.

**Interaction:** Each ball is a hotspot. Walking up + clicking pops a product card (see `04-walkin-3d-spec.md`).

---

## Zone C — HOT DEALS Ball Wall

**Wall:** Continues the right/back-right wall from Zone B toward the counter, X ≈ +5 → wrapping, Z ≈ [-4, -2.5].

| Element | Placement | Detail |
|---|---|---|
| "HOT DEALS" banner | top of panel, blue banner | ✅ legible |
| Ball grid | smaller slatwall panel | **~18–28 balls** (🔴 pano-distorted; partly behind counter). Same bracket system. Mix of discounted/older finishes — more solids, some closeout colors. |
| Sale tags | under each ball | Mock "was/now" pricing to justify the HOT DEALS framing. |

**Build note:** Treat as a smaller sibling of Zone B. If exact count is uncertain, build ~20 balls. Tag them with a "DEAL" badge in both the 3D and standard shop.

---

## Zone D — Reception Counter

**Placement:** Centered on back wall, counter front face at Z ≈ -3.2, spanning X ≈ [-1.8, +1.8].

| Element | Placement | Detail |
|---|---|---|
| Counter body | curved convex front, Z=-3.2 | **Stacked gray stone / faux-ledgestone** clad face, dark flat laminate top at Y≈1.0. ✅ |
| POS terminal | on top, X≈+0.5 | Register + card reader. |
| Wall monitors | back wall, Y≈1.8, X≈-0.5 & +0.5 | ≥2 flat panels mounted above/behind counter. ✅ |
| Office door | back wall, X≈-1.2, Y 0–2.1 | Wood interior door. ✅ |
| Second doorway | back wall, X≈+1.8 | Dark opening to back. 🟡 |
| Counter-top retail | on top | Spinner accessory racks + brochure stand. 🟡 |
| Framed certs/signage | back wall | Above counter. 🟡 |
| (Assumed) drill press / work area | behind office door | NOT photographed — optional back-room easter egg. 🔴 |

**Interaction:** Counter is the natural "info / pro shop services" hotspot — drilling, fitting, league sign-up blurbs (informational; no checkout). A "Talk to the pro" prompt fits here.

---

## Zone E — House / Used-Ball Rack + Accessory Pallets

**Placement:** Back-left corner near the lane doorway, X ≈ [-4, -2.5], Z ≈ -3.0.

| Element | Placement | Detail |
|---|---|---|
| "Used bowling balls for sale" sign | wall above rack, Y≈1.9 | With directional arrows. ✅ |
| House-ball gravity rack | X≈-3.5, Y 0.3–1.1 | Red/blue painted wood rack, **2 tiers × 6 = 12 balls** shown (`asb-044`). Wood dowel rails, chrome cradle wires. Likely 2–3 racks total → ~24–36 balls. |
| Ball finishes | — | Solid black, teal pearl, magenta pearl, red, navy, with visible weights painted on (e.g., "10", "14"). Scuffed/used look. |
| Boxed accessory/product pallets | X≈-3.2, Y 0–0.6 | Stacked boxes of shoes/accessories on the floor near the rack. ✅ |

---

## Lane Doorway (scene boundary / background)

**Placement:** Back-left corner opening, X ≈ -4.5, Z ≈ -4.5, opening 1.2w × 2.1h.

- Roll-up shutter housing above. ✅
- Through it: bowling approach, lanes, pin decks, ball returns, blue spectator chairs, overhead scoring monitors. ✅
- **Build as a backdrop:** a lit doorway with a static (or subtly animated) lanes image/plane behind it. It anchors the "you're really in the bowling alley" feel. A "← Back to lanes / exit shop" affordance can live here.

---

## Lighting & material cheat-sheet (for 3D)

| Surface | Material |
|---|---|
| Ceiling | Light gray drop-tile, emissive troffer panels in a grid, one round center vent. |
| Walls | Matte: gray-white upper + mustard-yellow lower band. |
| Ball/bag walls | White horizontal slatwall (grooved), low spec. |
| Counter | Stacked-stone normal-mapped face, dark satin laminate top. |
| Floor | The novelty bowling carpet — **make/commission a tiling texture** of black ground + pink/cyan/teal/purple pins, balls, stars, splatter. This carpet is the single most identity-defining surface; get it right. |
| Balls | Glossy reactive-resin: high spec, colored swirl albedo, 3 drilled holes, clearcoat sheen. |
| Lighting rig | Even neutral-white ambient + soft area lights from ceiling panels; daylight spill from lane doorway. Avoid dramatic shadows — the real shop is flatly, brightly lit. |

---

## Minimum-viable scene (if cutting scope)

If the full room is too much for v1, build in this priority order:
1. **Zone B (NEW ARRIVALS wall)** + floor + carpet + ceiling — the hero.
2. **Zone D counter** — gives the room an anchor/focal point.
3. **Zone A bag/shoe wall** — second product surface.
4. **Zone C HOT DEALS** + **Zone E house rack** — fill.
5. **Lane doorway backdrop** — immersion polish.

Stop at any tier and it still reads as the pro shop.
