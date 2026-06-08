# 06 — Build Sequence & Asset Checklist

Thin slices. Each phase is demoable on its own. Ship MVP first, then earn the fancy parts.

---

## Phase 0 — Foundations (shared, ~both modes depend on it)
1. Define `shared/types.ts` (from 04 §5).
2. Author a **seed `products.json`** — 8–12 real items pulled from the panos (the visible Storm/Hammer/etc. balls on the New Arrivals wall, a couple of roller bags, a wrist support, a cleaner). Mock prices, real names where legible; placeholder where not.
3. Build `ProShopDataProvider` (load + validate + index by id/category/hotspot).
4. Build `ProductCardModal` + `BallSpinViewer` (model-viewer wrapper) against seed data. **This unblocks every other tier** because it's the shared payoff screen.
   - Need: one `bowling-ball.glb` (low-poly sphere + finger holes + normal/roughness map). Can be generated/modeled cheaply; it's recolored per product.

**Demo at end of P0:** click a fake button → real product card with a spinning recolored ball. Proves the payoff before any 360 work.

---

## Phase 1 — Walk-in MVP (the client "wow", Tier A core)
1. Pre-process panos: generate 2048 / 4096 / 6144 variants, compress (05 §1). Output to `/uploads/proshop-panos/`.
2. Build the **marker-placement dev tool** (`tools/marker-placement-dev.html`): load asb-133 in PSV, click → log yaw/pitch. (Half a day; saves days of guessing.)
3. Author `hotspots.json` for **node-ballwall only** — place ~8–12 product markers over the real balls/bags, 1 zone marker on "NEW ARRIVALS", and (later) nav markers.
4. Build `WalkInViewer` with PSV core + markers plugin (single node first, virtual-tour later). Wire `select-marker` → `ProductCardModal`.
5. Subtle markers + "highlight items" toggle. Hover/focus → ease-toward + tooltip.
6. Idle auto-rotate, reduced-motion guard.

**Demo at end of P1:** open the real New Arrivals wall in 360, look around, click a real ball → product card with spin. This is a genuinely strong client demo on ONE pano.

---

## Phase 2 — Full tour + standard shop + fallbacks (v1)
1. Add virtual-tour plugin; wire node-counter (asb-132) + node-wide (asb-079); floor nav markers + cross-fade.
2. Author hotspots for the other nodes (counter "ask a pro", bag wall, pegboard accessories).
3. Zone-banner filters (NEW ARRIVALS / HOT DEALS) driving marker subsets.
4. Build **StandardShopGrid** (mode 1) + filters off the same data. Build the **ProShopTabPage** toggle (01).
5. Implement the **fallback ladder** (05 §4): WebGL/save-data detection → Pannellum Tier B → static-region Tier C → grid Tier D.
6. Full a11y pass (focusable markers, modal trap, SR labeling, contrast).
7. Move `products.json` behind a CMS/sheet feed if the client wants staff-editable inventory ("live wall").

**Demo at end of P2:** full two-mode pro shop, walk the whole room, accessible, degrades cleanly.

---

## Phase 3 — Stretch / fun (only if client buys in)
- Ambient audio toggle + lane-archway strike easter egg.
- AR quick-look on the ball (model-viewer AR on supported phones).
- Gyro look-around opt-in.
- **One** true-3D walkable zone (R3F + pointer-lock) as a hero segment — *only* with a proper scan/model; do not attempt from the panos (02).
- "Low stock / just sold" live flags; sold-out ghost markers.

---

## Asset checklist — what exists vs. what's still needed

### Have (verified in repo)
- ✅ asb-133 (5554×2777), asb-132 (4166×2083), asb-079 (1600×800) — true 2:1 equirectangular panos of the real shop.
- ✅ asb-019 / proshop-01 (flat New Arrivals ball wall, undistorted) — catalog-crop source.
- ✅ asb-044 / proshop-02 (house-ball rack closeup) — rental prop.
- ✅ AI-generated pano/ball-wall scenes — **reference/mood only, do NOT ship as the real shop** (they're synthetic; the real panos are the asset).

### Still needed before/within build
- ❌ **`bowling-ball.glb`** — one shared low-poly ball model (recolorable). Blocking for the card spin.
- ❌ **Clean per-product catalog images** — crop from asb-019 or pull vendor art for the 8–12 seed products. Blocking for product cards looking good.
- ❌ **Real product data** — names, brands, weights, specs, and *mock* prices for seed items. Client/staff input. Blocking for credibility.
- ❌ **Pano derivatives** — 2048/4096/6144 compressed variants. Build task, not a client ask.
- ⚠️ **Optional re-shoots / better panos** — asb-079 is only 1600×800 (soft when zoomed). If the client wants a crisper tour, a fresh 360 capture of the counter + bag wall + lane archway at ≥6000px would noticeably help. Nice-to-have, not blocking.
- ⚠️ **Ambient audio clip** + strike SFX — only if Phase 3 fun layer is approved. Use royalty-free/licensed; no copyrighted music.
- ⚠️ **Inventory feed decision** — static JSON vs CMS/sheet vs POS (04 §3). Needs a client answer for "how live is live."

### Dependencies to add (justified)
- `@photo-sphere-viewer/core`, `@photo-sphere-viewer/markers-plugin`, `@photo-sphere-viewer/virtual-tour-plugin` (and `react-photo-sphere-viewer` if React). — core engine.
- `@google/model-viewer` — single spinnable ball + optional AR.
- `pannellum` — only for Tier B fallback (load lazily / only if needed).
- No physics/character-controller deps in MVP (no true 3D until phase 3).
