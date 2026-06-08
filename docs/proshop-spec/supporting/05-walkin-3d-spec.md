# Pro Shop — Mode 2: 3D "Walk-In" Simulation Spec

**What:** A first-person, navigable 3D recreation of the real All Star Bowl pro shop. The user "walks in," moves around the room, walks up to the ball/bag/accessory walls, and clicks an item to view it (and add it to their mock list). The fun, immersive mode. **No checkout** — same mocked pricing/list as the standard shop.

**Build it from:** `01-inventory-and-layout.md` (what's in the room) + `02-zone-details.md` (where everything goes) + `03-mock-catalog-schema.md` (the shared product data). The 3D scene and the standard shop read the SAME `proshop-catalog.json`.

---

## Experience flow

1. User clicks **"Try the 3D Walk-In Shop"** from the standard shop / nav.
2. Loading screen (carpet-pattern themed) → optional intro: camera fades in at the entrance, "Welcome to the All Star Bowl Pro Shop."
3. User navigates the room (controls below).
4. Approaching a wall, item hotspots highlight. Clicking an item opens a **product card overlay** (same data as standard shop) with a mock **"Add to list."**
5. Counter zone offers an info prompt (services / talk to the pro).
6. Lane doorway offers **"← Exit to standard shop"** (and is a visual immersion anchor).

---

## Two implementation tiers — PICK ONE

The phrase "3D walk-in" can mean very different builds. Two honest options; the cheaper one delivers 80% of the wow at 20% of the effort.

### Tier 1 — **Panorama hotspot walk-through** (RECOMMENDED first)
- Use the REAL 360 equirectangular panos (`asb-132`, `asb-133`, `asb-079`) as navigable photo-spheres (like Google Street View / Matterport).
- Library: a photo-sphere viewer (e.g., Pannellum / Photo Sphere Viewer / three.js sphere). 
- Place clickable **hotspots** over each ball/bag/accessory at known pano pixel coords → open the product card.
- Move between 2–3 pano "stations" (counter view ↔ ball-wall view ↔ entrance view) via floor arrows.
- **Pros:** Looks photorealistic instantly (it IS the real shop), light, mobile-friendly, fast to build, no 3D modeling. Uses assets we already have.
- **Cons:** Movement is teleport-between-stations, not free walking. Hotspot placement is manual per pano.
- **This is the right MVP.** It is genuinely "walk into the real pro shop."

### Tier 2 — **Real-time 3D room** (the big-vision version)
- Build the room as actual geometry in **three.js / React-Three-Fiber** (or Babylon.js) from the coordinates in `02-zone-details.md`.
- Free first-person movement (WASD + mouse on desktop, drag-look + on-screen joystick on mobile).
- Balls = glossy spheres on slatwall; bags/shoes = simple meshes or billboarded crops; counter = stacked-stone box; carpet = tiling texture.
- Hotspots = raycast against item meshes; proximity highlight.
- **Pros:** True walk-around, most "fun," fully controllable lighting/interaction.
- **Cons:** Much heavier to build and to run; needs asset/texture work (carpet, balls, counter); perf + mobile + a11y all harder.

> **Recommendation:** Ship **Tier 1** as the real deliverable. Treat Tier 2 as a Phase-2 upgrade only if the client loves the concept and wants to invest. Do not let Tier 2 ambition block shipping a working walk-in. Both tiers consume the same catalog data and the same product-card overlay, so the data/UI work is not wasted if you later upgrade.

---

## Controls

| | Tier 1 (pano) | Tier 2 (3D room) |
|---|---|---|
| Look | Drag / mouse | Mouse-look / drag |
| Move | Click floor arrows → teleport to next station | WASD / on-screen joystick |
| Select item | Click hotspot | Walk close + click mesh (raycast) |
| Mobile | Touch-drag look, tap arrows/hotspots | Touch-drag look + joystick |
| Exit | Top-corner "Standard view" + lane-door hotspot | same |

---

## Hotspot → product card

- Each hotspot binds to a `product.scene.hotspotId` from the catalog.
- On select: overlay card (HTML on top of canvas) with image/finish, name, brand, mock price, weight options, **"Add to list."**
- Card reuses the SAME component as the standard shop's product detail — build once.
- Badges (NEW/DEAL/USED) carry through.

---

## Scene content (from inventory — what must be present to read as "the pro shop")

Priority build order (mirrors `02` minimum-viable list):
1. **NEW ARRIVALS ball wall** (~24 of the ~44 balls as hotspots) + "NEW ARRIVALS" banner.
2. **Reception counter** (stacked stone, monitors) — focal anchor + services prompt.
3. **Bag & shoe wall** (Vise totes + others, shoe pairs) + accessory pegboard (grouped hotspot).
4. **HOT DEALS wall** (~12 balls, DEAL badges) + **Used-ball rack** ("Used bowling balls for sale" sign, 12 balls).
5. **Lane doorway** backdrop (lanes visible through it) — immersion + exit.
6. The **novelty carpet** everywhere — non-negotiable identity element.

---

## Performance & accessibility (do not skip — this is where 3D shops fail)

- **Always provide the escape hatch:** a permanent, obvious "Switch to standard view" link. The standard shop (Mode 1) is the accessible/SEO-complete equivalent; the 3D mode is enhancement, never the only path to a product.
- Respect `prefers-reduced-motion` (skip camera fly-ins, reduce auto-rotate).
- Lazy-load the heavy viewer; show a lightweight poster + "Enter 3D" button so the page doesn't pay the cost until opted in.
- Tier 1: panos are large (4–5 MP) — serve resized/tiled versions, preload only the first station.
- Tier 2: cap draw calls, instance the balls, bake lighting, target 60fps mid-range mobile or gracefully degrade.
- Keyboard users / screen readers get routed to the standard shop (announce it).

---

## Fun layer (optional, if client wants it)

- Ambient bowling-alley sound bed (pins, distant chatter) with a mute toggle, default OFF.
- A subtle mascot guide (project already has a mascot — see `docs/mascot-integration-spec.md`) who "greets" you at the entrance and points to New Arrivals.
- Picking up a ball = a little spin animation in the product card.
- "Find the hidden golden ball" easter egg.
- Keep all of it skippable; never block browsing.

---

## Acceptance criteria

- [ ] Reachable from the standard shop via "Try the 3D Walk-In Shop."
- [ ] User can look around and move between at least the New Arrivals wall, counter, and bag wall.
- [ ] At least the New Arrivals balls are clickable hotspots opening the shared product card.
- [ ] Product card supports mock "Add to list" syncing with the standard shop's list.
- [ ] Permanent "Switch to standard view" escape hatch present.
- [ ] No checkout/payment; mock-pricing disclaimer reachable.
- [ ] Loads acceptably on mobile (or cleanly offers the standard shop instead).
- [ ] Reads recognizably as the All Star Bowl pro shop (carpet + ball wall + stone counter + signage).
