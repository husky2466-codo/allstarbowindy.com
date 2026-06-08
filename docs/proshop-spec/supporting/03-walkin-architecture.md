# 03 — Walk-In Architecture (the wiring)

How the recommended Photo Sphere Viewer (PSV) v5 + markers + hybrid model-viewer approach is actually built. Framework-agnostic where possible; React notes called out because the repo is React-leaning (confirm stack before building).

---

## 1. High-level data flow

```
 products.json / API ─────────────┐
 (shared source, see 04)          │
                                  ▼
                     ┌────────────────────────┐
                     │  ProShopDataProvider     │  loads + normalizes products,
                     │  (shared by both modes)  │  exposes by category & by hotspotId
                     └───────┬──────────┬───────┘
                             │          │
              ┌──────────────┘          └───────────────┐
              ▼                                          ▼
   ┌────────────────────┐                    ┌────────────────────────┐
   │  StandardShopGrid   │                    │   WalkInViewer (PSV)    │
   │  (mode 1)           │                    │   (mode 2)              │
   └─────────┬──────────┘                     └───────────┬────────────┘
             │                                            │
             │   both open the same ──────────────────────┤
             ▼                                            ▼
                   ┌──────────────────────────────┐
                   │      ProductCardModal         │  one component, two callers
                   │  (photo, specs, mock price,   │
                   │   model-viewer spin, stub CTA)│
                   └──────────────────────────────┘
```

Key principle: **markers are generated FROM data, not hand-coded in the viewer.** A `hotspots` map ties each product to a physical position on a specific pano. Add a product with a hotspot entry → a marker appears on the wall. Remove/sell-out a product → its marker disappears. That's the whole "live wall."

---

## 2. Scene graph (the virtual tour node model)

PSV's **virtual-tour plugin** models the shop as nodes (one pano each) connected by floor links.

```
nodes:
  node-ballwall   → panorama: asb-133 (5554×2777)   default entry, framed on New Arrivals wall
  node-counter    → panorama: asb-132 (4166×2083)   framed on service counter + bag wall
  node-wide       → panorama: asb-079 (1600×800)    wider framing, HOT DEALS + lane archway
links (floor "move here" markers):
  node-ballwall ──> node-counter
  node-counter  ──> node-ballwall, node-wide
  node-wide     ──> node-counter, [easter-egg: lanes route]
```

Each node also declares its **product markers** and **zone/signage markers**.

> asb-079 is only 1600×800 — acceptable as a transitional/wide node but it will look soft if zoomed. Prefer asb-133/132 as primary. See 06 for a possible re-shoot ask.

---

## 3. Marker types

All markers are PSV markers (the plugin renders them as positioned, focusable elements over the sphere). Three kinds:

| Marker kind | Anchor method | Visual | On activate |
|---|---|---|---|
| **Product marker** | `position` in spherical coords (yaw/pitch) OR `positions` pixel polygon mapped to the pano | subtle pulsing ring; "highlight" mode → labeled dot | camera eases toward it → opens ProductCardModal for that product |
| **Zone/signage marker** | spherical, placed over the real "NEW ARRIVALS"/"HOT DEALS" banner | reuses the real banner as a clickable label | filters product markers to that category; optional card fan-out |
| **Navigation marker** | spherical, placed on the carpet | glowing footprint/ring | virtual-tour teleport (cross-fade) to linked node |

### Anchoring strategy (the fiddly part — be honest)
- Markers in PSV are placed in **spherical coordinates** (yaw, pitch) on the sphere, or via image-relative helpers. Because our panos are **equirectangular and warped**, you cannot eyeball pixel x/y and expect it to land — a point near the top/bottom of the image is heavily distorted.
- **Authoring workflow:** build a tiny one-off **"marker placement" dev tool** (a PSV instance with click-to-log-coordinates: clicking the pano prints the yaw/pitch to console, which you paste into the data file). This is the standard way teams author PSV tours and removes all the equirectangular guesswork. Budget this tool as a build task (06, phase 1).
- The flat **asb-019** image is NOT used for placement math (it's not the projected sphere) but IS the **catalog photo source** for cropping clean per-ball product images, because it's undistorted and sharp.

---

## 4. The "walk up to an item" mechanism — concretely

We deliberately **avoid raycasting** in the pano approach; PSV's markers plugin does its own hit-testing and fires events. Raycasting only re-enters if/when a true-3D zone is added (phase 3).

Sequence on a product marker:
1. `markers-plugin` emits `select-marker` (click/tap) or focus (keyboard) / `enter-marker` (hover).
2. On hover/focus: call viewer `animate({ yaw, pitch, zoom })` toward the marker — a ~400ms ease that reads as "stepping up." Show the marker tooltip (name + mock price).
3. On select: look up `marker.data.productId` → `ProShopDataProvider.getById()` → open `ProductCardModal`.
4. Modal renders: clean catalog photo, name/brand/weights/specs, mocked price, **model-viewer** spinnable ball (one shared `bowling-ball.glb`, material color/coverstock swapped per product), stub CTA, "View in standard shop" link.
5. Close → modal unmounts, camera stays where it was. (Optionally store last yaw/pitch to restore if hover moved it.)

### Why this is robust for a demo
No physics, no collision, no character controller, no per-object meshes. The "movement" is camera animation + node cross-fades. It cannot fall through the floor or get stuck — failure modes of true 3D that would wreck a live client demo.

---

## 5. Component / file layout (proposed)

```
/proshop/
  data/
    products.json                # shared product source (04)
    hotspots.json                # productId|zoneId → {nodeId, yaw, pitch}  (authored via dev tool)
    tour.json                    # nodes, panoramas, links, default node, initial view
  shared/
    ProShopDataProvider.{ts,tsx} # load + normalize + index by id/category/hotspot
    ProductCardModal.{tsx}       # the one modal, used by both modes
    BallSpinViewer.{tsx}         # wraps <model-viewer>, recolors shared ball glb
    types.ts                     # Product, Hotspot, TourNode types (04)
  standard/
    StandardShopGrid.{tsx}       # mode 1 grid + filters
  walkin/
    WalkInViewer.{tsx}           # mounts PSV core + virtual-tour + markers plugins
    useTour.{ts}                 # builds markers from data, wires events
    MarkerHighlightToggle.{tsx}  # subtle ↔ highlighted markers
    NavFootprint, ZoneBanner     # marker render helpers
    fallback/
      WalkInFallback.{tsx}       # static pano + standard-grid fallback (05)
  tools/
    marker-placement-dev.html    # dev-only: click pano → log yaw/pitch
  ProShopTabPage.{tsx}           # the top-nav tab; mode toggle (01)
```

> Adapt to the repo's actual conventions (check existing component patterns before creating). If the site is not React, PSV ships vanilla — same structure, no JSX.

---

## 6. Loading & init order (WalkInViewer)
1. Mount container, show branded loader.
2. `ProShopDataProvider` resolves products + hotspots + tour config.
3. Instantiate PSV `Viewer` with `VirtualTourPlugin.withConfig(...)` and `MarkersPlugin.withConfig(...)`.
4. Feed virtual-tour the nodes (panos) + links; set default node `node-ballwall` + initial yaw aimed at the New Arrivals wall.
5. On each `node-changed`, rebuild that node's markers from data (product + zone + nav).
6. Hide loader on `ready`. Start idle auto-rotate; cancel on first interaction.

---

## 7. State to track
- `currentNodeId`, `lastView {yaw,pitch,zoom}`
- `highlightMarkers: boolean`
- `activeCategoryFilter` (from zone banners)
- `openProductId | null`
- `audioOn: boolean` (default false)

Keep this in a small store/context; none of it needs a server.
