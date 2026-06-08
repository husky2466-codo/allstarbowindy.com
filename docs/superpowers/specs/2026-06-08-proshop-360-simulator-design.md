# Pro Shop 360 Simulator — Design

_Date: 2026-06-08 · Branch: `feature/proshop-simulator` · Approach B (lean PSV, POC-first)_

## Goal

Replace the bare-bones CSS scene-tour pro-shop "walk-in" with a real-photo **360°
simulator**: the visitor starts at the shop entry, looks around in 360 using the actual
store panoramas, eases the camera up to items on the New Arrivals wall, inspects real
balls (specs from the enriched catalog), collects them into a **reservation cart**, and
sends in / prints the reservation. No online payment, no POS sync.

This is the Phase-2 experience described in `docs/proshop-spec/05-3d-walkin-sim-spec.md`,
built lean (Approach B) as a proof-of-concept that we refine and extend afterward.

## Honesty calls (carried from the canonical spec)

1. **"Walk-in" = real-photo 360 nodes with camera moves, not a walking avatar.** "Walk up
   to an item" = camera-ease toward a marker + node cross-fade. A walkable 3D-modeled shop
   was explicitly rejected (no scan exists; modeled geometry would look *less* like the real
   All Star). Reserved as a possible Phase-3.
2. **"Cart" = reservation list, not e-commerce.** No payment, no card fields, no POS sync.
   The shop has a standalone POS (not API-integrated). Cart output = send-in (form/email)
   + printable reservation sheet. Pick up and pay in person.
3. **No invented prices.** The enriched catalog has specs but no prices. Ball cards show
   "Ask at counter / confirmed on reservation." An owner-supplied price map exists but ships
   empty; real numbers drop in later with no code change. (Parked: source real pricing from
   the owner email / their Facebook/online presence.)

## Decisions (locked in brainstorming)

| Topic | Decision |
|---|---|
| Experience | Real-photo 360 (Photo Sphere Viewer v5), not a walkable game |
| Engine | PSV v5 core + `markers-plugin` (5.14.x, verified current June 2026). Hand-rolled node switching via `setPanorama()` + cross-fade (no virtual-tour-plugin yet) |
| Cart | Reservation only. Send-in (form/email) + printable. Absorbs the existing localStorage wish-list — one collect mechanism, not two |
| Items (balls) | Pulled from `reference/bowling-catalog/BallDatabase.enriched.json` by `id` — real names + specs |
| Items (non-ball) | Bags / shoes / accessories / drilling services = small curated hardcoded list (no catalog exists for these) |
| Pricing | "Ask at counter." Empty owner price map wired in for later |
| Zones (POC) | 3 nodes: **entry → New Arrivals ball wall (hero) → counter**. Bags/specials = fast follow |
| Pano assets | Downscale the 3 real panos into committed `public/img/proshop/pano/`; gitignored originals stay as masters |
| Build style | React 18 + Babel-standalone via CDN (match existing `public/`, no bundler) |

## Architecture & file layout

All under `public/` (CDN React, no build step), except the catalog source which lives in
`reference/bowling-catalog/`.

```
public/
  js/
    proshop.jsx              EXISTING — mode toggle stays; wire "Walk-in" to new engine
    proshop-walkin.jsx       REPLACE — CSS scene-tour -> PSV 360 renderer
    proshop-cart.js          NEW — shared reservation-cart state; absorbs wish-list
    proshop-data.js          EDIT — balls reference catalog by id; non-ball items curated
    proshop-catalog.js       NEW — loads BallDatabase.enriched.json, exposes byId lookup
    lib/photo-sphere-viewer/ NEW — PSV v5 core + markers-plugin (vendored or CDN <script>)
  data/
    proshop-hotspots.json    NEW — per-node markers [{yaw,pitch,slotId,productId}]
    proshop-reservation.json NEW — owner price-field map; ships empty
  img/proshop/pano/          NEW, committed — downscaled web panos (entry, ball-wall, counter)
  css/proshop.css            EDIT — 360 viewer + cart drawer styles
```

Three clean module boundaries:

- **catalog** (`proshop-catalog.js`) — read-only ball specs from the enriched catalog, `byId()`.
- **hotspots** (`proshop-hotspots.json`) — physical marker positions per node; rarely change.
- **cart** (`proshop-cart.js`) — reservation state; changes constantly; the only stateful module.

A shelf slot in `hotspots.json` references a product by `id`. Swap the id → different ball,
same position ("live wall"). Markers open the **same shared `ProductDetail` renderer** the
standard grid uses — the wall never renders a divergent card.

## The 360 viewer & node flow (`proshop-walkin.jsx`)

- **Nodes** = the 3 downscaled panos. `NODES = { entry, ballWall, counter }`, each `{ panoUrl,
  defaultYaw, markers: [...] }` where markers come from `proshop-hotspots.json`.
- **Render:** one PSV instance, lazy-loaded only when the user enters Walk-in mode (kept off
  the standard shop's critical path). `markers-plugin` registered.
- **Node switch:** `viewer.setPanorama(node.panoUrl, { transition, ... })` + opacity cross-fade.
  We own the graph: entry → ballWall → counter, navigable both ways via on-pano "move" markers
  or a small zone strip. No virtual-tour-plugin.
- **"Walk up to item":** marker click → `viewer.animate({ yaw, pitch, zoom })` eases the camera
  toward the marker, then opens the product card. Respects `prefers-reduced-motion` (reduce/skip
  the ease).
- **Entry node caveat:** assets are `asb-131-frontdesk` (front desk) + `asb-132/133-proshop`.
  We may NOT have a true "outside the front door / banner" shot. Resolve at build time: either
  repurpose front-desk pano as entry, or a flat door+banner intro image before the 360 mounts.
- **Controls:** desktop drag + scroll + click; touch drag + pinch + tap. Always-visible **"Exit
  to standard view"** (a11y escape hatch + hard fallback).

## Cart & reserve (`proshop-cart.js`)

- **State:** array of `{ id, name, kind, qty, note }`, persisted to `localStorage` under one key.
  **Migrates/absorbs the existing wish-list key** so users don't have two separate lists.
- **API:** `add(id)`, `remove(id)`, `setQty(id,n)`, `items()`, `subscribe(fn)`. Plain pub/sub
  module so both the grid and the 360 wall write to the same cart. React components subscribe.
- **UI:** a cart **drawer** (slides from the right) with a floating cart button showing count.
  Reuses the existing floating-wish-list button slot.
- **Reserve actions** (no payment anywhere):
  1. **Send in** — a reservation form (name, phone, email, optional message) + the item list,
     submitted via the site's existing contact/email path (mirror how the suggestion box / contact
     form sends; reuse, don't invent a new backend).
  2. **Print** — `window.print()` against a print-stylesheet reservation sheet (items, specs,
     "ask at counter" pricing, shop contact). No server needed.
- **Honest disclaimer** on the cart: "This is a reservation request, not a purchase. Pricing and
  availability confirmed at the counter."

## Data binding (`proshop-catalog.js` + `proshop-data.js`)

- `proshop-catalog.js` fetches `BallDatabase.enriched.json` once, builds an id→ball map, exposes
  `byId(id)` and `search()/filter()` helpers. Ball card fields: name, brand, coverstock(+type),
  core(+type), RG, differential, factory finish, releaseDate.
- `proshop-data.js`: the New Arrivals wall slots become `{ slotId, productId }` referencing catalog
  ids. Non-ball products (bags/shoes/accessories/services) remain inline curated records with a
  `kind` field so the cart and card know how to render them.
- **Price resolution:** `price(id)` checks `proshop-reservation.json`'s owner map; if absent →
  `null` → card shows "Ask at counter." Nothing fake is ever shown.
- **Catalog id reconciliation risk:** the wall slots must reference ids that actually exist in
  `BallDatabase.enriched.json`. Build step: verify every `productId` resolves; fail loud (console
  warning + visible placeholder) on a miss rather than silently rendering an empty shelf.

## Fallback ladder (spec tiers, POC honors at least 1 + 4)

1. PSV v5 360 (primary).
2. _(later)_ Pannellum if PSV too heavy on target devices.
3. _(later)_ Static pano + absolutely-positioned HTML hotspots (no WebGL).
4. **Hard fallback: the standard grid (Mode 1)** — always reachable via "Exit to standard view".
   The standard grid carries SEO + a11y independently (the 360 canvas is invisible to crawlers /
   hostile to screen readers).

For the POC: ship tier 1 + the always-present tier-4 exit. If WebGL is unavailable, route
straight to the standard grid.

## Build sequence (thin vertical slices)

1. **Pano assets** — downscale 3 panos → `public/img/proshop/pano/`, commit. Confirm they render.
2. **PSV mounts** — Walk-in mode loads PSV with the ball-wall pano as a single node, no markers.
   Prove it renders 360 on desktop + a mid-range phone.
3. **Catalog binding** — `proshop-catalog.js` loads enriched catalog; render one real ball card
   from an id.
4. **Markers** — `proshop-hotspots.json` + markers on the ball wall; click → shared ProductDetail.
5. **Cart** — `proshop-cart.js`; add-to-cart from a card; drawer + floating button; wish-list
   migration.
6. **Reserve** — send-in form (reuse existing email path) + print stylesheet.
7. **Node graph** — add entry + counter nodes, cross-fade, "walk up" camera ease.
8. **Polish** — reduced-motion, touch, exit-to-standard, WebGL fallback route.

## Acceptance criteria

1. Walk-in mode loads PSV only when entered; the standard shop is never blocked by the pano engine.
2. At least the ball-wall pano renders as a navigable 360 node on a mid-range phone.
3. Wall markers open the **same** ProductDetail as the standard grid, by `id`.
4. Ball card data comes from `BallDatabase.enriched.json` (real specs), not hardcoded mock.
5. Swapping a `productId` in a wall slot changes the displayed ball with no geometry edits.
6. Cart collects items from both grid and 360 wall into one list; persists; absorbs the old
   wish-list.
7. Reserve = send-in form (no payment) **and** printable sheet. No card fields anywhere.
8. No invented prices; "ask at counter" until an owner price map is supplied.
9. "Exit to standard view" always visible and works as the hard fallback.
10. `prefers-reduced-motion` honored; touch + desktop controls both work.

## Parked / out of scope (follow-ups)

- Research real pro-shop pricing (owner email / Facebook / online) → fill `proshop-reservation.json`.
- Remaining spec zones (bag-floor-row, bags-shoes-accessories, specials-wall) → add as nodes.
- Pannellum / static-hotspot fallback tiers (2 & 3).
- `@google/model-viewer` spinnable ball in the card (spec's "hold the ball" touch).
- Re-shoot `asb-079` for a cleaner third tour node.
- Live POS integration (only if the shop ever exposes a POS API).
