# 07 — Open Questions & Risks

The hard parts and the decisions someone (client / DesignClaude) must make. Stated plainly.

---

## Decisions the client must make
1. **How "live" is the live wall?** Static JSON (edit + redeploy), CMS/sheet (staff-editable), or real POS sync? Default recommendation: **CMS/sheet** for v1. POS sync is not promised until the actual POS is confirmed to have an API (most retail bowling POS systems don't expose one cleanly).
2. **Mock pricing — show numbers or not?** Sample prices add realism but can mislead/anger if wrong. Option: show "$$$ — call for current pricing" instead of dollar amounts. Recommend mock numbers WITH a visible "sample pricing" disclaimer.
3. **How much fun is too much?** Audio, strike easter egg, AR — all Phase 3, all opt-in. Confirm the client actually wants them before building (they cost time and add a11y surface).
4. **Re-shoot panos?** asb-079 is low-res (1600×800). Accept soft zoom on that node, or capture a fresh ≥6000px 360 of the counter/bag area?

## Technical risks (ranked)
1. **Equirectangular marker placement is fiddly.** Mitigated by the dev tool (03 §3 / 06 P1). Without the tool, placing 30+ markers by hand on warped images is a time sink — build the tool first.
2. **Mobile texture-size cap (4096px) + texture-upload hitch.** Mitigated by serving ≤4096 variants to mobile (05 §1). If skipped, the tour may render black or jank on some phones — this is the most likely "works on my laptop, broken on a phone" failure. Non-negotiable mitigation.
3. **Product ↔ physical-ball mapping drifts.** The real wall changes weekly; our hotspots are fixed positions. Mitigated by the slot model (04): hotspots are *positions*, products are swapped into them. But if the client physically rearranges the wall, the panos (and hotspot positions) go stale. **The panos are a snapshot in time.** Set expectations: the virtual room won't auto-match the physical room's rearrangements; periodic re-shoots or accepting "representative, not literal" framing is the deal.
4. **"Walk up to" ≠ true locomotion.** If the client expects an avatar literally walking the carpet, manage that expectation early (01 §3.3). The camera-move version is what's robust and demoable. True walking is Phase 3 and needs a real 3D model.
5. **PSV bundle weight on low-end devices.** PSV pulls Three.js. The Tier B Pannellum fallback (21KB) exists precisely for this. Don't ship PSV to a $80 Android without the fallback path tested.
6. **AI-generated scene images getting shipped by mistake.** They're mood/reference only. Risk: someone uses `pro-shop-interior-panorama.png` as a tour node. It is NOT the real shop and will look "off." Keep generated assets out of `tour.json`.
7. **Accessibility regressions.** 360 viewers default to inaccessible `<canvas>` blobs. The focusable-marker + shared-grid-baseline approach (05 §3) fixes it but must be tested with a real screen reader, not assumed.

## Things explicitly OUT of scope (restating, so no one builds them)
- Checkout, payments, real cart persistence, real inventory write-back.
- Live POS integration (unless separately confirmed + scoped).
- Headset/WebXR VR mode (stretch, untested).
- A from-scratch fully-modeled walkable 3D shop (rejected in 02 — throws away the real-pano advantage).

## One-line risk summary
> The build is low-risk IF: panos are resized for mobile, markers are placed with a dev tool, the standard grid exists as the hard fallback, and the client understands "walk-in" = real-photo 360 nodes with camera moves, not avatar locomotion. Every red flag above has a stated mitigation already in the spec.
