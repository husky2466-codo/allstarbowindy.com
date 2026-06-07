# Mascot Integration Spec — interactive corner-buddy mascot

**For:** DesignClaude
**Goal:** Drop the All Star Bowl pin mascot onto the site as a fun, animated, interactive "corner buddy" — a persistent character in the bottom-right that idles, reacts to hover, points at calls-to-action on scroll, and is dismissible. It sets a playful, instantly-theirs tone for the pitch.

**Status:** A working, browser-verified reference implementation already exists at `public/mascot-demo.html`. This spec tells you how to fold it into the real mockup. Do not rebuild from scratch — port the proven behavior.

---

## Why this matters for the pitch

The mascot is a near-direct capture of All Star Bowl's **actual mural mascot** (a smiling cartoon bowling pin). Putting *their own* character, animated, on the redesign makes the demo feel personal and bespoke — not a generic template. It is one of the highest-emotion, lowest-effort wins in the whole pitch.

**Provenance caveat (carry forward, do not act on it yourself):** this mascot is the client's existing IP, regenerated via AI. Fine for the demo. Before any production ship, the owner must okay us using/animating their mascot. Note it; do not block the mockup on it.

---

## Assets (ready, transparent PNGs)

In `public/img/generated/mascot/`:

| File | What it is | Use |
|------|-----------|-----|
| `mascot-wave.png` | Single hero pose: smiling pin mascot, one arm raised waving, red tongue. 928×1152, transparent (chroma-key + despill, no green fringe). | **This is the corner buddy.** The only asset the current build needs. |
| `mascot-four-views.png` | Turnaround sheet: front/back/left/right views with text labels, transparent. 928×1152. | NOT used by the corner buddy. Reference/future asset only (e.g. if the mascot is later rigged as an SVG puppet). Do not place this on the page. |

Both have real alpha channels — they composite cleanly over any background, light or dark.

---

## The behavior to port (all verified working in `public/mascot-demo.html`)

The reference file is self-contained (inline CSS + JS). Lift the `.buddy` block — markup, styles, and script — into the mockup. Behaviors:

1. **Entrance** — slides up from below + fades in ~800ms after load (`cubic-bezier` overshoot for a little bounce).
2. **Idle loop** — gentle bob (translateY) + sway (rotate ±1.5deg), 4s ease-in-out infinite. Pivots near its base (`transform-origin: 50% 90%`) so it reads as standing, not floating.
3. **Hover** — switches to a faster, bigger wave animation and pops a speech bubble cycling friendly lines ("Ready to bowl?", "Strike!", "Grab a lane!", "Hey there!").
4. **CTA reaction** — an `IntersectionObserver` watches the primary CTA (the "Book a Lane" button). When it scrolls ~90% into view, the buddy plays an "excited" bounce-and-scale and shows a "Book here! →" bubble pointing at it.
5. **Click** — smooth-scrolls the page to the booking section.
6. **Dismissible** — a × button (appears on hover) removes the buddy and remembers the choice for the session via `sessionStorage`. The buddy must ALWAYS be dismissible — this is non-negotiable; a corner mascot that can't be closed is an annoyance, not a feature.
7. **Accessibility** — honors `@media (prefers-reduced-motion: reduce)`: all looping animation is disabled, the buddy just fades in. Keep this.

---

## Integration rules (so it doesn't go wrong)

- **Reuse, don't reinvent.** The CSS keyframes and JS in `mascot-demo.html` are tuned and tested. Port them; adjust only the wiring (see below).
- **Wire the CTA observer to the REAL booking button** in the mockup, not the demo's placeholder `#bookBtn`. Update the `IntersectionObserver` target and the click-scroll target (`#book`) to the mockup's actual booking section/anchor IDs.
- **Size:** controlled by `--buddy-size` (150px in the demo). Tune per the final layout; keep it a CSS variable.
- **z-index:** the buddy sits at `z-index: 9999`. Make sure it stays under any modal/nav overlays the mockup introduces.
- **Mobile:** the buddy uses `clamp()` for size and offset so it shrinks on small screens. VERIFY it does not cover key content or CTAs on a phone viewport. If it does, either shrink it further at a mobile breakpoint or auto-dismiss it below a width threshold. Do not let it sit on top of the mobile nav or a sticky footer CTA.
- **Drop shadow:** `filter: drop-shadow(...)` makes it read as a sticker on the page rather than a pasted cutout. Keep it; tune the values to the mockup's background.

---

## What this version is — and is not

- **It is** a single-image mascot animated as a whole: it bobs, tilts, scales, slides, and pops bubbles. For a mockup/demo this reads as alive and fun.
- **It is not** a part-rigged puppet. The raised arm cannot wave independently, the eyes do not blink, the mouth does not talk — the whole image moves as one. That is a deliberate MVP choice (ships now, tiny, sharp). Do not attempt to fake per-part motion by slicing the PNG in CSS; that path leads to the rigged-SVG/Rive/Lottie approach, which is explicitly out of scope for this mockup.
- **Future upgrade path (out of scope, noted only):** vectorize → cut into parts (arm/eyes/mouth) → rig in Rive or Lottie with a state machine for true per-part wave/talk. ComfyUI on the DGX Sparks would generate the consistent part variations. Not for this build.

---

## Done = 

The mockup loads, the mascot slides into the bottom-right corner, idles with a gentle bob, waves + shows a bubble on hover, reacts/points when the real booking CTA scrolls into view, smooth-scrolls to booking on click, and can be dismissed. Works on desktop and does not obstruct content on mobile. Reduced-motion users get a static fade-in.

Reference implementation: `public/mascot-demo.html` (keep it in the repo as the canonical behavior source; it can be deleted once the behavior lives in the real mockup, your call).
