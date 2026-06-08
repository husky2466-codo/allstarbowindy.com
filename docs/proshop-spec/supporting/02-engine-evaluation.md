# 02 — Engine Evaluation & Recommendation

**The single most important decision in this spec.** Read before building.

The client wants to "walk into the real pro shop." We already have genuine 360° equirectangular panoramas of that exact room. That asset should drive the technology choice, not the other way around.

---

## The three candidate approaches

### (a) 360° Pano Viewer with interactive hotspots
Wrap our real panos onto a sphere; place clickable markers over wall items; teleport between panos for "movement."
**Libraries:** Photo Sphere Viewer (PSV) v5, Pannellum, Marzipano.

### (b) True 3D scene
Build/scan a 3D model of the shop; first-person camera with WASD/pointer-lock; raycast to pick objects; real walkable space.
**Libraries:** Three.js / React Three Fiber (R3F) + drei; model-viewer for single items.

### (c) Hybrid
Pano viewer as the base "rooms," with selective real-3D objects layered in (e.g. a 3D spinnable ball on the product card, or a 3D ball wall rendered in front of the pano). Optionally a true-3D walk segment for one hero zone.

---

## Library reality check (verified June 2026)

| Library | Status / version | Strengths | Weaknesses for us |
|---|---|---|---|
| **Photo Sphere Viewer v5** | Actively maintained. Core split into `@photo-sphere-viewer/core`; **markers-plugin 5.14.x**. Rich plugin ecosystem (markers, map, plan, virtual-tour, gallery, video). | Purpose-built for exactly our use case: equirectangular pano + clickable markers (pixel- or sphere-anchored), dynamic add/remove markers, click/hover events, tooltips, built-in virtual-tour node graph, gyro + VR plugins. React wrapper exists (`react-photo-sphere-viewer`). | Heavier than Pannellum (it's Three.js under the hood). Markers plugin API has a learning curve. |
| **Pannellum** | Alive; TypeScript rewrite landed 2025. ~21KB, zero deps. | Tiny, fast, dead-simple hotspots, great for low-end devices. | Limited plugin ecosystem; hotspot styling/UX is basic; no rich marker system; weaker for a polished, card-driven product experience. |
| **Marzipano** | Google-origin, still available, but **low maintenance signal**. Supports 360 video + VR + multi-res tiling. | Multi-resolution tiling (good for gigapixel) and VR. | Lower maintenance momentum; more manual; multi-res tiling is overkill for our pano sizes. |
| **Three.js / R3F + drei** | Both current and very active. PointerLockControls / first-person patterns are well established; drei provides helpers. | Full power: real walkable 3D, raycasting, lighting, true "walk up." | We have **no 3D model of the shop**. Building/scanning one is the expensive part. Photogrammetry from these few panos won't reconstruct the room cleanly. Heavy on mobile. |
| **model-viewer** (`@google/model-viewer`) | Current, maintained by Google. Web component, AR on supported devices. | Drop-in single-model viewer, great for one product (a spinnable ball). AR quick-look "see this ball in your room." | Not a scene/room tool. Per-product 3D models don't exist and modeling 50 balls is unjustified. |

> PSV runs on Three.js internally, so choosing PSV does **not** lock us out of real 3D later — we can mount Three/R3F content alongside it in the hybrid.

---

## Why true-3D-from-scratch is the wrong MVP

- **We have no model.** The deliverable asset is *photos*, not geometry. A true-3D shop means modeling or scanning the room. Photogrammetry needs dense overlapping captures; a handful of 360 panos won't yield clean geometry, and the loud confetti carpet + glossy balls are photogrammetry-hostile (reflective, repetitive).
- **It would look *less* like All Star, not more.** A hand-modeled generic shop loses the entire point — the visitor wouldn't recognize the real store. Our panos *are* the store.
- **Cost/time blows the demo.** Modeling + texturing + lighting + locomotion + collision + 50 product models is weeks. The client wants something demoable.
- **Mobile/perf risk.** A textured walkable room with dozens of objects is far heavier than a single pano sphere + DOM markers.

True 3D earns its place only for **isolated hero objects** (one spinnable ball) and as a **phase-3 stretch** for one walkable zone — both covered by the hybrid.

---

## RECOMMENDATION

**Primary engine: Photo Sphere Viewer v5 + markers-plugin + virtual-tour-plugin. Build the walk-in as a hotspot-driven 360 virtual tour anchored on asb-133 / asb-132 / asb-079.**

**Layer in a thin hybrid:** `@google/model-viewer` for a single shared spinnable bowling-ball model on the product card (recolored per product). This delivers real 3D "wow" on the hero interaction for ~1 model's worth of effort, with optional AR quick-look on phones.

### Why PSV over Pannellum
We need a polished, product-card-driven, multi-zone experience with subtle-then-highlightable markers, hover-to-step-in camera moves, filtered marker sets by category, and a node graph. PSV's markers + virtual-tour plugins give all of that out of the box. Pannellum would mean hand-building the marker UX and node logic — more code for a worse result. Pannellum stays the **fallback/low-end option** (05) if PSV proves too heavy on the worst devices, because its tiny footprint is genuinely better there.

### Why not Marzipano
Maintenance momentum is the weakest of the three, and its headline feature (multi-res gigapixel tiling) solves a problem we don't have — our largest pano is 5554×2777, trivially within single-image territory.

### Confidence
- **Tier 2 (verified, sourced):** PSV v5 + markers-plugin 5.14.x exist and support pixel/spherical markers, dynamic add/remove, click+hover events, tooltips, and a virtual-tour node graph. Pannellum is maintained (TS rewrite 2025). model-viewer is current. R3F/Three first-person is well-trodden. See Sources.
- **Tier 3 (judgment, stated as such):** that photogrammetry from our specific panos won't yield usable geometry — based on capture count + reflective/repetitive surfaces, not a test. If the client ever wants true-3D, validate with a proper scan, don't assume the panos suffice.

---

## Decision summary (one line for DesignClaude)
> Build a Photo Sphere Viewer v5 virtual tour over the real panos, markers over wall items → product-card modal, plus a single model-viewer spinnable ball on the card. Pannellum is the lightweight fallback; standard grid is the hard fallback. True walkable 3D is an explicit phase-3 stretch, not the MVP.

---

## Sources
- Photo Sphere Viewer — official site & plugins overview: https://photo-sphere-viewer.js.org/
- MarkersPlugin docs: https://photo-sphere-viewer.js.org/plugins/markers.html
- markers-plugin npm (v5.14.x): https://www.npmjs.com/package/@photo-sphere-viewer/markers-plugin
- react wrapper: https://www.npmjs.com/package/react-photo-sphere-viewer
- Open-source 360 libraries 2026 roundup: https://portalzine.de/open-source-virtual-tour-360-panorama-libraries-in-javascript-2026/
- Pannellum: https://pannellum.org/
- R3F scaling performance: https://r3f.docs.pmnd.rs/advanced/scaling-performance
- R3F first-person tutorial: https://dev.to/jgcarrillo/create-a-first-person-movement-in-react-three-fiber-part-1-f0c
- Efficient Three.js scenes (Codrops): https://tympanus.net/codrops/2025/02/11/building-efficient-three-js-scenes-optimize-performance-while-maintaining-quality/
