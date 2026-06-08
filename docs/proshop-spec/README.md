# All Star Bowl — Pro Shop Spec (build folder)

**Status:** SPEC ONLY. Nothing in this folder is a built page. DesignClaude builds from these documents.

**Business:** All Star Bowl, 726 N Shortridge Rd, Indianapolis, IN 46219.

**What we are speccing:** an online pro shop with **two modes** off a single top-level "Pro Shop" entry point:

1. **Standard shop** — a normal catalog browse-and-detail experience (top tab).
2. **3D "walk-in simulation"** — navigate the *real* All Star Bowl pro shop in 360 and walk up to wall items to view/get them.

**Hard scope boundary:** **Checkout is OUT of scope.** No payments, no card fields, no "order placed." Pricing and cart are **mocked**. The cart is reframed as a non-transactional **wish list / reserve-and-ask** flow. This is by design and must not drift back toward a real store.

---

## How DesignClaude should use this folder

Read in this order. These six files are the canonical, reconciled spec set:

| # | File | What it gives you |
|---|------|-------------------|
| 0 | `README.md` (this file) | Index, scope, asset pointers, provenance rules. |
| 1 | `01-visual-inventory.md` | What is actually in the real store, read off the photos, with confidence flags. Ground truth for what to depict. |
| 2 | `02-pricing.md` | Verified pricing tables only. Use these numbers for mock data. Honestly flagged where unsourced. |
| 3 | `03-product-knowledge.md` | Shop copy, glossary, education layer. Source of product blurbs, fit notes, tooltips. |
| 4 | `04-standard-shop-spec.md` | Mode 1 build spec: IA, card vs detail, list/reserve flow, tone. |
| 5 | `05-3d-walkin-sim-spec.md` | Mode 2 build spec: engine choice, pano-node tour, hotspots, "walk up to item," fallbacks. |
| 6 | `06-shared-product-data-model.md` | The single JSON schema feeding BOTH modes, with example products. Start here for data. |

**Build order recommendation:** ship `06` (data) and `04` (standard shop) first — they are the foundation and the fallback. Layer `05` (3D) on top once the data and the standard shop render. The 3D mode degrades to the standard grid, so the grid must exist first.

---

## Source assets (real pro-shop photos in the repo)

These are the photos this spec was read from. Use them as both the 3D tour source and the catalog-image source.

**360 equirectangular panos (2:1, distorted — account for curvature when reading shelves):**
- `public/uploads/gmaps-photos/asb-132-proshop-360-pano.jpg` — 4166×2083. Curved stacked-stone counter, monitors behind, bag wall + accessory pegboard left-of-center, "SPECIALS"/ball wall right.
- `public/uploads/gmaps-photos/asb-133-proshop-360-pano.jpg` — 5554×2777. **Hero pano.** "NEW ARRIVALS" ball wall, bag floor row, counter, archway to lanes.
- `public/uploads/gmaps-photos/asb-079.jpg` — pro-shop counter + balls pano (lower res ~1600×800, soft when zoomed — flagged for possible re-shoot).

**Flat reference photos (undistorted — use as catalog crops, NOT tour nodes):**
- `public/uploads/gmaps-photos/asb-019.jpg` — the NEW ARRIVALS ball wall, head-on. ~44 balls countable. **Primary catalog-crop source.**
- `public/uploads/gmaps-photos/asb-044.jpg` — house-ball gravity rack closeup (painted weights 10/14, pearl + solid mix).

**Curated reference photos:**
- `public/img/reference/proshop/proshop-01.jpg`, `proshop-02.jpg`, `proshop-03.jpg`

**AI-generated scenes (use only as mood/placeholder, never as "this is the real shop"):**
- `public/img/generated/scenes/pro-shop-interior-panorama.png`
- `public/img/generated/scenes/pro-shop-ball-wall.png`

---

## Provenance and honesty rules (NON-NEGOTIABLE)

This spec was assembled from photo analysis plus web research. Some research was unsourced or corrected during verification. Carry these honesty rules into the build:

1. **Only one brand is visually confirmed in-store: Vise** (red/black embroidered bags). Every other brand/model named anywhere in this spec is **representative mock data**, not a claim that All Star Bowl stocks it. Do not present mock SKUs as the shop's real inventory.
2. **All prices are mock/representative.** They are anchored to real 2026 retail prices (see `02-pricing.md`) so they read as believable, but they are NOT All Star Bowl's prices. Label estimates as estimates in the UI.
3. **No checkout.** The cart is a wish list. The conversion action is "Reserve / Ask the Pro Shop" (phone + in-store fitting), never "Buy."
4. **"Walk-in" = real-photo 360 nodes with camera moves, not a walking avatar.** Don't promise avatar locomotion or physics.
5. **"Live wall" = JSON/CMS-edited data, not POS sync.** Don't promise live inventory without confirming a POS API exists.
6. Where this spec says "estimated," "representative," "not visually confirmed," or "needs client confirmation," preserve that hedge in any client-facing copy.

---

## Open client questions (do not block the build)

- Is the 3D walk-in sim a **headline draw** (own top tab) or a **co-feature** (toggle under Pro Shop)? Default in this spec: toggle under one "Pro Shop" tab. Flip to own-tab only if the client wants it as the marketing hook.
- Is in-shop ball fitting **free / walk-in**? The copy assumes a friendly fitting CTA; confirm actual shop policy before publishing that claim.
- Do fitting appointments route through the existing BowlNow booking system or a simple inquiry form?
- Does the shop want a possible re-shoot of `asb-079` (low-res) for a cleaner third tour node?

---

## Supporting research (`supporting/` subfolder)

Deeper backing research written by parallel agents lives in `supporting/` (`kb-*.md`, `01-balls.md`…`05-services.md`, `02-engine-evaluation.md`, `02-zone-details.md`, `01-experience-and-ux.md`, etc.). **The six numbered files at this folder's top level (indexed in the table above) are the canonical, reconciled spec set** and supersede the overlapping `supporting/` drafts where they conflict. The supporting files are kept as detail to draw on; DesignClaude should treat this README's table as the authoritative reading order and dip into `supporting/` only for extra depth on a specific topic (e.g. `supporting/kb-02-fit-and-drilling.md` for drilling detail).
