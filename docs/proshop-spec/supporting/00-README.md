# Pro Shop Spec — Index & Reading Order

**Business:** All Star Bowl, 726 N Shortridge Rd, Indianapolis IN 46219
**Status:** SPEC ONLY. No page is built here. DesignClaude builds from these docs.
**Author:** ArchitectClaude (web-3D technical architect)
**Date:** 2026-06-07
**Verified against:** Photo Sphere Viewer v5 / markers-plugin 5.14.x, Pannellum (TS rewrite 2025), React Three Fiber + Three.js, model-viewer — all confirmed current via web search June 2026 (sources listed in 02-engine-evaluation.md).

---

## What this folder specifies

Two shop modes for the All Star Bowl website:

1. **Standard Shop** — a normal web storefront reachable from a top-nav tab. Grid of products, filters, product detail. Checkout is OUT of scope (cart + pricing are mocked). Specced only at the boundary level here; the focus of this spec set is mode 2.
2. **Walk-In Simulation Shop** — a fun, navigable recreation of the *real* All Star pro shop, anchored on the actual 360° panoramas we already shot. The visitor "looks around" the room, sees the real ball wall / bag wall / counter, and clicks (walks up to) wall items to pop a product card. **This is the document set's primary deliverable.**

Both modes read from the **same product data source** (see `04-inventory-data-model.md`) so "live updated items on the wall" and the standard grid never drift apart.

---

## Reading order

| # | Doc | What it covers |
|---|-----|----------------|
| 00 | `00-README.md` | This index. Scope, constraints, glossary. |
| 01 | `01-experience-and-ux.md` | The end-to-end visitor experience for both modes. Scene graph of the real shop, navigation model, what "walk up to an item" feels like. |
| 02 | `02-engine-evaluation.md` | The core technical decision. Pano-viewer vs true-3D vs hybrid, with a ranked recommendation and the reasoning. **Read this before building anything.** |
| 03 | `03-walkin-architecture.md` | How the recommended approach is actually wired: panos → nodes → hotspots → raycast/marker-click → product-card modal. Component tree, data flow, file layout. |
| 04 | `04-inventory-data-model.md` | The JSON schema that drives BOTH shops. How "live wall" inventory works, how a product maps to a physical hotspot on a real wall. |
| 05 | `05-performance-mobile-a11y.md` | Honest performance/mobile/accessibility realities + the mandatory non-3D fallback. |
| 06 | `06-build-sequence-and-assets.md` | Phased build order (demo → v1 → stretch), and the exact list of assets still missing before a build can start. |
| 07 | `07-open-questions-and-risks.md` | Hard parts, unknowns, and decisions the client/DesignClaude must make. |

---

## Hard constraints (do not violate)

- **Anchor on the REAL panos.** asb-132, asb-133, asb-079 are genuine equirectangular 360° captures of *this* shop. The walk-in experience must use them as the primary surface, not a from-scratch 3D room. A generic 3D bowling shop would throw away the single biggest asset we have: it actually looks like All Star.
- **Checkout is mocked.** No payments, no real cart persistence, no inventory write-back. "Add to cart" / "Get this ball" is a visual stub.
- **Demo-achievable first.** The first milestone must be demoable to the client quickly. Fancy true-3D is a stretch goal, not the MVP.
- **One product source of truth.** Standard shop and walk-in shop read the same data file/endpoint.
- **No secrets, no live store credentials** anywhere in this build. It is a presentation/marketing experience.

---

## Glossary

- **Equirectangular pano** — a 2:1 image (e.g. 5554×2777) that wraps onto a sphere to make a 360° view. Straight lines bow; shelves curve. All three of our shop panos are confirmed true 2:1 equirectangular.
- **Node / scene** — one 360° vantage point (one pano). A virtual tour = several nodes you teleport between.
- **Hotspot / marker** — a clickable point fixed to a location in the pano (e.g. "ball #14 on the New Arrivals wall").
- **Raycasting** — in true 3D, casting a ray from the camera/cursor to detect which object was clicked. In the pano approach we mostly avoid this in favor of the markers plugin's built-in hit-testing.
- **Product card** — the modal/panel that appears when you "walk up to" an item: photo, name, specs, mocked price, "get it" stub.
