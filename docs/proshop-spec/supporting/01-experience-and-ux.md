# 01 — Experience & UX

This doc describes what the visitor *feels and does*, grounded in what the real panoramas actually show. The engineering of it lives in 03; this is the experience contract.

---

## 1. What the real shop actually contains (from the panos)

I read all five shop images. This is the real layout DesignClaude must respect — the virtual shop should feel like *this* room, not a generic one.

### asb-133 (5554×2777, highest-res) — the hero pano
- **Right wall:** a tall slatwall labeled **"NEW ARRIVALS"** packed with bowling balls in a grid, each with a small spec/price tag tucked under it. Below the balls: bowling bags (orange, blue, black roller bags) standing on the floor.
- **Center-back:** the **service counter** — grey stacked-stone face, register, drilling/pro-service area behind it. Blue signage above.
- **Left:** an open doorway/archway through to the **lanes** (you can see lanes and bright lane lighting through it). Bags and accessory racks flank it.
- **Floor:** the signature loud bowling-alley carpet (black with pink/teal/blue confetti shapes).
- **Ceiling:** drop-tile ceiling with recessed lights and a round vent.

### asb-132 (4166×2083) — alternate vantage, same room
- Same counter, but framed more centrally. Shows the **bag wall** (colorful roller bags hung in rows) and an **accessory pegboard wall** (wrist supports, tape, small boxed goods) left of the counter, plus a **house-ball rack** on the floor (the asb-044 rack) at far left near the lane entrance.

### asb-079 (1600×800) — wider counter framing
- Shows signage banners clearly: **"HOT DEALS"** and **"NEW ARRIVALS"** above the right-side ball wall, **bag wall** center-left, **accessory pegboard** left of counter, house-ball rack and lane entrance far left.

### asb-019 / proshop-01 (1600×1064) — the flat money shot
- A **straight, undistorted** photo of the New Arrivals ball wall. ~50+ balls in a grid on white slatwall, each with a printed tag. Below: stacked shoe boxes + a row of roller bags (purple, pink, grey, orange, blue). **This image is gold for hotspot authoring** because it's not warped — see 03.

### asb-044 / proshop-02 (1200×675) — house-ball rack closeup
- A red/blue wooden rack of house balls (numbered, drilled). This is the *rental* ball rack, not retail. Useful as a secondary clickable prop ("house balls / pricing") but not a product grid.

### Identified "zones" (these become the interactive regions)
1. **New Arrivals ball wall** (right wall) — primary retail grid, the star of the show.
2. **Hot Deals** section (banner-adjacent on the ball wall) — a filtered subset.
3. **Bag wall** — roller bags, totes.
4. **Accessory pegboard** — tape, wrist supports, cleaners, small goods.
5. **Service counter** — pro services (drilling, plugging, fitting), "talk to a pro" / contact CTA, hours.
6. **House-ball rack** — rentals / league info (informational, not a buy).
7. **Lane archway** — a navigation exit back to the rest of the site / "enter the lanes" easter egg.

---

## 2. Two modes, one tab group

Top-nav gets a **"Pro Shop"** tab. Landing on it shows a **mode toggle** (two big cards, not a buried switch):

```
   ┌────────────────────────┐   ┌────────────────────────┐
   │  🛒  Browse the Shop   │   │  🎳  Walk Into the Shop │
   │  Fast grid, filters,   │   │  Look around the real   │
   │  specs. Standard.      │   │  pro shop in 360°.      │
   └────────────────────────┘   └────────────────────────┘
```

- **Default for first-time / mobile / reduced-data users:** Browse the Shop (standard). It's the safe, fast, accessible path.
- **Walk-In** is the fun path, opt-in. It pre-warns nothing scary — just loads the 360 viewer.
- A persistent small toggle lets you jump between modes without losing your place (same product set underneath).

### Standard Shop (mode 1) — specced lightly here
- Responsive product grid reading the shared data model (04).
- Filters: category (balls / bags / accessories / shoes), brand, "New Arrivals", "Hot Deals", price range (mocked), weight (for balls).
- Product detail = the same product-card content used by the walk-in modal (one component, two entry points).
- "Add to cart" / price = mocked stub with a tooltip "Pricing shown is sample data — visit the shop or call to purchase." (No checkout.)
- This mode is the **accessibility + SEO baseline**. Search engines and screen readers get the real product list here regardless of the 3D path.

---

## 3. The Walk-In Simulation — the experience

### 3.1 Entry
- Click **"Walk Into the Shop."**
- A brief branded loader ("Stepping into the pro shop…") while the hero pano (asb-133) streams in.
- The view opens looking at the **New Arrivals ball wall** (the most visually impressive and most commercially relevant zone), not at a blank wall.

### 3.2 Looking around
- Drag (mouse) / swipe (touch) / device-gyro (mobile, optional) / arrow-keys to pan around the full 360°.
- Subtle auto-rotate on idle (stops on interaction) so a static screenshot/demo still feels alive.
- Limited zoom in/out (clamped so you can't zoom into mush — our panos are good but not gigapixel).

### 3.3 "Walking up to" an item — the core interaction
This is what the client asked for: *navigate the shop and walk up to wall items to view/get them.*

The honest version, given we're anchored on photos:

- Each retail item on a wall has a **hotspot marker** floating exactly over its real position in the pano (over ball #14, over the orange roller bag, over the wrist support on the pegboard).
- Markers are **subtle by default** (a soft glowing ring/dot that pulses), so the room looks like a room, not a minefield of icons. A **"highlight items"** toggle makes them all pop for users who want to see everything clickable.
- **Hover/focus** a marker → the camera does a short ease-in *toward* that point (a gentle zoom + recenter) so it literally feels like stepping up to the shelf, and a tooltip shows the item name + price.
- **Click/tap/Enter** → the **product card modal** slides in: large product photo (the clean catalog image, not the cropped-from-pano pixels), name, brand, weight options, specs, mocked price, and a **"Get this ball" / "Add to bag"** stub button. A "View in standard shop" link cross-navigates.
- Closing the card returns you to the exact view you were at.

> **Design honesty:** there is no avatar literally walking across the carpet in the MVP. "Walk up to" is delivered as a *camera move toward the item* inside the 360 node. This reads as walking up to a shelf and is far cheaper/more robust than character locomotion. True locomotion is a stretch goal (see 02 hybrid / 06 phase 3).

### 3.4 Moving around the room (between vantage points)
- The shop is multiple panos (asb-133, asb-132, asb-079). Place **floor "move here" hotspots** (a glowing footprint/ring on the carpet) that teleport you to the next vantage point with a quick cross-fade — classic Google Street View / Matterport feel.
- Example flow: open at the ball wall (asb-133) → click a floor marker near the counter → cross-fade to asb-132 framed on the counter → from there a marker by the lane archway → "Enter the lanes" easter-egg / back-to-site.
- Because all three panos are the *same physical room from slightly different spots*, the teleports feel coherent, not teleport-to-another-building.

### 3.5 Zone signage as wayfinding
- Reproduce the real **"NEW ARRIVALS" / "HOT DEALS"** banners as in-scene clickable labels. Clicking a banner filters the markers to that category and can fan the cards out. This reuses the real shop's own signage as UI — strong grounding, low effort.

### 3.6 The fun layer (optional, client wants it fun)
- **Ambient audio** toggle: low bowling-alley room tone + faint pin-crash from the lane archway. Off by default (autoplay/a11y).
- **"Spin the ball"** micro-interaction on the product card: a small rotating 3D ball (model-viewer with one shared ball model, recolored per product) so at least the hero product has real 3D without modeling 50 balls. Cheap wow.
- **Easter egg:** clicking through the lane archway plays a 2-second strike animation/sound and routes to the lanes/booking page.
- **"Ask a pro"** marker on the counter → opens the contact/lesson-booking flow.

---

## 4. Experience non-negotiables
- Every clickable thing reachable by **keyboard** and announced to screen readers (markers are real focusable buttons — see 05).
- The walk-in must **degrade to the standard grid** if WebGL/data/network fails (05).
- Nothing about the fun layer (audio, auto-rotate, ball-spin) is required to complete the core task of finding and viewing a product.
