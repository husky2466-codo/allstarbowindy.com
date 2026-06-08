# 05 — 3D Walk-In Simulation Spec (Mode 2)

The fun hook: navigate the *real* All Star Bowl pro shop in 360 and walk up to wall items to view/get them. This spec is honest about what "walk-in" and "live" actually mean, picks an engine verified against current libraries (June 2026), and ladders down to fallbacks.

> A more detailed sibling spec set exists in this folder (`05-walkin-3d-spec.md`, `01-experience-and-ux.md`, `02-engine-evaluation.md`, `03-walkin-architecture.md`, `04-inventory-data-model.md`, `05-performance-mobile-a11y.md`, `06-build-sequence-and-assets.md`, `07-open-questions-and-risks.md`). This file is the canonical, reconciled summary indexed by `README.md`; those are the deep backing detail and are internally consistent. Where they differ, follow this file's top-line decisions.

---

## 1. The two honesty calls (state these to the client up front)

1. **"Walk-in" = real-photo 360 nodes with camera moves, NOT a walking avatar.** We have no 3D model of the shop and modeling one from scratch would make it look *less* like the real All Star. "Walk up to an item" is implemented as camera-ease-toward-marker plus node cross-fades — robust for a live demo, no physics to break. True walkable geometry is a Phase-3 stretch needing a real laser/photogrammetry scan.
2. **"Live wall" = JSON/CMS/sheet-edited data, NOT live POS sync.** Swapping a product into a wall slot re-renders the wall. Do not promise POS-synced inventory unless the client confirms their POS has an API.

---

## 2. Recommended engine (verified, June 2026)

**Photo Sphere Viewer v5 + markers-plugin (5.14.x) + virtual-tour-plugin**, anchored on the real panos as tour nodes.

- **Tour nodes** = the real equirectangular panos: `asb-133` (hero, 5554×2777), `asb-132` (4166×2083), `asb-079` (low-res, re-shoot candidate).
- **Markers** = clickable hotspots placed over each product on the wall.
- **Hybrid touch:** one shared `@google/model-viewer` spinnable ball, recolored per product, embedded in the product card — gives a "hold the ball" moment without modeling the whole room.
- **Catalog crops** come from the flat, undistorted `asb-019` (NOT a tour node) and `asb-044`.

**Rejected as MVP:** from-scratch real-time three.js walkable geometry. No model exists, it would look fake, and it blocks the demo. Reserved as Phase-3.

**Fallback ladder (4 tiers):**
1. Photo Sphere Viewer v5 (recommended).
2. Pannellum (lighter-weight pano viewer) if PSV is too heavy on target devices.
3. A static panorama with absolutely-positioned HTML hotspots (no pano-engine) if WebGL is unavailable.
4. **Hard fallback: the Standard grid (Mode 1).** Always reachable via an "exit to standard view" control.

---

## 3. Architecture (panos → nodes → markers → product card)

Keep physical layout and product data in **separate** files so the wall is "live":

- `hotspots.json` — physical marker positions per pano node (yaw/pitch + which wall slot). Stable; rarely changes.
- `proshop-data.js` / `products.json` — the products (`06` schema). Changes often.
- A wall slot references a product **by `id`**. Swap the id in the slot → the wall shows a different product, same position. No re-authoring of geometry.
- Clicking a marker opens the **same shared `ProductDetail` renderer** used by the Standard PDP. The wall never renders its own divergent card.

**Node graph** (from the `01` zone map, clockwise from the lane archway):
`lane-archway → new-arrivals-wall → bag-floor-row → counter → bags-shoes-accessories → specials-wall → (loop)`

"Walk up to an item": click a marker → camera eases toward it within the current node → product card opens. Moving between zones = node cross-fade, not locomotion.

---

## 4. Inventory / data model

The 3D wall reads the **same** schema as the Standard shop (`06-shared-product-data-model.md`). The wall is a **curated subset** (a highlight reel of real wall slots), the grid is the superset. No separate product schema for 3D — only the extra `hotspots.json` for positions.

---

## 5. Performance, mobile, accessibility

- Panos are large; serve downscaled/tiled versions for mobile, full-res on demand for zoom. `asb-079` is soft when zoomed — flag for re-shoot.
- Lazy-load the pano engine only when the user actually enters 3D mode (keep it off the Standard shop's critical path).
- Provide an obvious **"Exit to standard view"** at all times — this is the a11y escape hatch and the hard fallback.
- The 3D canvas is invisible to crawlers and hostile to screen readers; **SEO and a11y live in Mode 1**, which must be complete independently.
- Respect `prefers-reduced-motion`: reduce or disable camera-ease animations.
- Touch controls: drag to look, pinch to zoom, tap markers; on desktop, drag + scroll + click.

---

## 6. Build sequence

1. Stand up Mode 1 + the shared data + the shared `ProductDetail` renderer first (per `04`/`06`).
2. Load Photo Sphere Viewer with the hero pano `asb-133` as a single node, no markers — prove it renders on target devices.
3. Add the node graph (cross-fade between `asb-133`, `asb-132`, `asb-079`).
4. Add `hotspots.json` markers on the NEW ARRIVALS wall; wire marker click → shared ProductDetail.
5. Add the spinnable `model-viewer` ball to the card.
6. Add camera-ease "walk up" and the mode toggle + exit control.
7. Mobile downscaling + reduced-motion + fallback ladder.

---

## 7. Missing-asset checklist

- A cleaner third tour node (re-shoot `asb-079` at higher res) — nice-to-have.
- Per-product ball crops if the team wants real ball images instead of recolored model-viewer balls.
- The carpet palette for the recolored ball and UI chrome (from `01`).

---

## 8. Open questions / risks (ranked)

1. **Does the client want 3D as a headline (own tab) or co-feature (toggle)?** Drives nav and marketing weight. (Default: co-feature.)
2. **Re-shoot `asb-079`?** Affects how many clean tour nodes exist.
3. **Live POS?** If no POS API, "live wall" stays at JSON/CMS — set expectations.
4. Pano file weight vs mobile data budgets — mitigated by downscaling but worth a real device test.

---

## 9. Acceptance criteria

1. Mode 2 loads only when entered; the Standard shop is never blocked by the pano engine.
2. At least the hero pano `asb-133` renders as a navigable 360 node on a mid-range phone.
3. Wall markers on the NEW ARRIVALS wall open the **same** ProductDetail as the Standard grid, by `id`.
4. Swapping a product id in a wall slot changes the displayed product with no geometry edits ("live wall" proof).
5. "Walk up to item" eases the camera toward the marker; node-to-node uses cross-fade.
6. "Exit to standard view" is always visible and works as the hard fallback.
7. `prefers-reduced-motion` is honored; touch + desktop controls both work.
8. No checkout, no card fields; the card's action is Add to List / Reserve, identical to Mode 1.
