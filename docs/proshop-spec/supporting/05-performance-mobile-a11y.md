# 05 — Performance, Mobile & Accessibility (the honest part)

The fun 360 experience is the *enhancement*. The standard grid is the *baseline*. This doc keeps the enhancement from breaking the baseline.

---

## 1. Performance realities

### What's actually heavy
- **PSV uses Three.js + WebGL** under the hood. The sphere itself is cheap; the cost is **decoding and uploading the pano texture**.
- Our panos: asb-133 is **5554×2777 (~15.4 MP)**, asb-132 **4166×2083 (~8.7 MP)**, asb-079 1600×800. A 5554-wide JPEG is fine to *download* but the **GPU texture upload** can hitch on low-end mobile, and some mobile GPUs cap texture size at 4096px — a 5554px-wide texture may be **downscaled or rejected** on those devices.

### Mandatory mitigations
1. **Resize/serve per-device pano variants.** Pre-generate each pano at multiple widths: e.g. 6144 (desktop hi), 4096 (desktop/standard — the safe mobile ceiling), 2048 (mobile). Serve via `srcset`-style selection or device check. **Never ship the raw 5554px to phones.**
   - 4096px max width also dodges the common mobile `MAX_TEXTURE_SIZE` = 4096 cliff.
2. **Compress.** Re-encode to well-optimized JPEG (quality ~80) or WebP. The current files are likely uncompressed-ish from the capture; target < ~1.5 MB per delivered pano.
3. **Lazy-load nodes.** Only the entry pano (asb-133) loads up front. Other nodes load on first teleport (PSV virtual-tour supports preloading the *next* likely node, not all at once).
4. **One viewer instance.** Reuse the PSV viewer across node changes; don't tear down/recreate.
5. **Markers are DOM, keep them few.** Dozens of DOM markers are fine; hundreds aren't. Cap visible product markers per node (the New Arrivals wall has ~50 balls — render markers for the *retail* subset we actually sell online, not every physical ball; or cluster).
6. **model-viewer (ball spin) loads only when a product card opens** — never on initial load. One shared `bowling-ball.glb`, kept small (< ~500KB, low-poly sphere + normal map; a ball is geometrically trivial).
7. **Idle auto-rotate pauses** when tab is hidden (`visibilitychange`) and respects reduced-motion.

### Budget targets (demo-grade, not gospel)
- Initial walk-in interactive (entry pano visible + draggable) on a mid-range phone: **< 3.5s on a decent connection.**
- No single delivered pano > ~1.5 MB.
- 60fps drag on desktop; ≥30fps on mid mobile. If a device can't, fall back (below).

---

## 2. Mobile realities
- **Touch:** drag-to-look, pinch-to-zoom — PSV handles these.
- **Gyro/device-orientation** look-around: nice but requires the iOS permission prompt (`DeviceOrientationEvent.requestPermission`) and HTTPS. Make it an explicit opt-in button, not automatic.
- **Data:** a 360 tour is heavier than a product grid. Respect `navigator.connection.saveData` / slow effective type → default such users to the standard grid and show a "Load the 360 shop?" button instead of auto-loading.
- **Battery/heat:** WebGL + gyro drains battery. Stop rendering when the viewer is offscreen or the tab is hidden.
- **Small screens:** product card becomes a full-height bottom sheet, not a centered modal. Markers get a larger touch target than their visual size (min 44×44px hit area).

---

## 3. Accessibility realities (this is where 360 viewers usually fail — don't)

- **Markers must be real, focusable, labeled controls.** Each product marker = a `<button>` (or `role="button"`, `tabindex=0`) with an accessible name ("Storm Phaze III, sample price $199.99, view details"). Tab cycles markers in a sensible order; Enter/Space activates; the camera eases to the focused marker so sighted-keyboard users see what they selected.
- **The product card modal** follows standard modal a11y: focus trap, `aria-modal`, Esc to close, focus returns to the triggering marker.
- **Reduced motion** (`prefers-reduced-motion`): disable auto-rotate, disable the ease-toward-item camera move (jump instead), disable strike easter-egg animation.
- **Screen-reader users get the standard grid.** The 360 viewer is inherently visual; the *accessible equivalent of the whole experience* is mode 1. Announce on the toggle: "Walk-In is a visual 360 experience; the standard shop has the same products in an accessible list." Both read the same data, so nothing is missing for SR users.
- **No audio autoplay.** Ambient sound is off by default, toggle only.
- **Color/contrast:** marker rings and tooltips must hit WCAG contrast against the busy carpet/wall — don't rely on a thin glow alone; back tooltips with an opaque chip.
- **Captions/labels** on the strike easter egg sound (it's decorative; mark it `aria-hidden`).

---

## 4. Fallback ladder (degrade gracefully, always land on something usable)

```
Tier A  Full walk-in:  PSV virtual tour + markers + model-viewer ball spin
          │  (WebGL ok, data ok, not save-data, not reduced-motion-only)
          ▼ if WebGL unavailable / texture rejected / low-end / save-data / PSV error
Tier B  Lite pano:  Pannellum (21KB) single entry pano + simple hotspots, no model-viewer
          │  (still grounded in the real room, far lighter)
          ▼ if even that fails / no WebGL at all
Tier C  Static fallback:  a flat panorama image (or asb-019 flat ball wall) with
          │  CSS/SVG clickable regions over items → opens the SAME ProductCardModal
          ▼ if JS/data fails entirely
Tier D  Standard grid:  mode 1. The product list. Always works, SEO + SR baseline.
```

- The **ProductCardModal is shared across all tiers**, so "view an item" works no matter how far we degrade.
- **Detection:** test WebGL context creation + a small texture upload before committing to Tier A; catch PSV init errors and drop to B/C; honor save-data/reduced-motion preferences to pick the entry tier.
- The toggle screen (01) can pre-route: phone on slow data → suggest Tier D; desktop with WebGL → offer Tier A.

---

## 5. What we will NOT pretend works
- It will **not** be a perfectly photoreal walkable room — it's photo nodes with camera moves. Set that expectation with the client; it's a feature (robust, real photos), not a limitation to hide.
- True gyro VR / headset mode is possible (PSV has plugins) but **untested for us** — leave it as a stretch, don't demo it cold.
- "Live POS sync" is **not** guaranteed (04 §3). The achievable "live" is CMS/sheet-edited JSON.
