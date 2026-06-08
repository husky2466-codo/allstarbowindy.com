# Handoff — Assets Research and React Scaffold

**Date**: 2026-06-07 21:30
**Project**: allstarbowindy.com
**Branch**: main (27 untracked/modified, 4 deleted — see uncommitted pile below)
**Session topic**: Long asset-prep, content research, and React CDN scaffold build for the All Star Bowl pitch site.

---

## State + in-progress work

### Fully done and merged (PRs 4–7)
- **PR #4** — Mascot corner-buddy: chroma-keyed mascot PNGs, CSS micro-animation demo, mascot-integration-spec.md, mascot-talking-video-workflow.md.
- **PR #5** — Pro shop spec: docs/proshop-spec/ (README + 6 canonical files + supporting/).
- **PR #6** — Feature specs bundle: suggestion-box-build-spec.md, elevenlabs-video-prompt-doc.md, strike-jackpot-research.md (initial), plus prior handoff doc.
- **PR #7** — Reference assets: membership card cutouts (5 tiers, transparent), 360-pano flat crops (32 total across proshop/cafe/bar-lounge).

### Uncommitted — must go out in the NEXT PR(s)

The session ended mid-commit-decision. User was deciding one combined PR vs splitting app-scaffold from research-docs. Files:

**Research/content docs (new or modified):**
- `docs/strike-jackpot-research.md` — modified: "ANSWERED" banner added; Kegler's Cash confirmed as the named game.
- `docs/outstanding-research.md` — new untracked.
- `docs/promotions-games-and-menu.md` — new untracked; full promotions, cash games, and REAL cafe menu with prices (harvested from FB).

**React CDN scaffold (all new untracked):**
- `public/index.html`
- `public/js/data.js`
- `public/js/app.jsx`
- `public/js/components.jsx` (Nav, Footer)
- `public/js/home.jsx`, `bowl.jsx`, `eat.jsx`, `leagues.jsx`, `parties.jsx`, `account.jsx`, `status.jsx`
- `public/css/styles.css`, `components.css`, `home.css`, `pages.css`

Scaffold was verified working in a real browser: all 15 files serve 200, React 18 mounts via CDN+Babel, all 9 components register on `window.ASB`, business data renders. Only benign console noise: Babel "precompile for production" warning + favicon 404.

**FB-download reference images (new untracked folders):**
- `public/img/reference/infodocs/` — FB flyers including the Kegler's Cash flyer.
- `public/img/reference/behind-the-scenes/`
- `public/img/reference/lounge/` — two new jpg files (one of which is a stray duplicate of a people/incidental image).

**Pre-existing asset churn (NOT this session's deliverables — tidy separately):**
- `public/img/reference/misc/misc-01.jpg`, `misc-02.jpg`, `misc-03.jpg` — deleted (replaced by .png variants).
- `public/img/reference/misc/misc-01.png`, `misc-03.png` — new.
- `public/img/reference/misc-02.jpg` — stray file at wrong path.
- `public/img/reference/people/incidental/lounge-jet-pong-bar-lounge-person-01.jpg` — deleted (appears duplicated into lounge/).
- `public/uploads/3d/` — untracked folder; origin unclear. Do not bundle into a deliverable PR without investigating.

### In-progress / blocked
- **Cloudflare tunnel** — long-carried across multiple sessions. Target: `allstarbowlindy.myroproductions.com` -> `localhost:8080`, dashboard-managed tunnel. Blocker: `wrangler` v4.69.0 installed but not logged in. Must `wrangler login` or set `CLOUDFLARE_API_TOKEN` from Vault before deploying.
- **Demo build** — DesignClaude builds: actual site UI into the scaffold, LiveScores demo page (fixtures + build-spec already committed from prior session), suggestion box, mascot integration.
- **IndyStar history article** — paywalled. Legitimate paths only: Indianapolis Public Library card, or user pastes text. Needed for About/Our Story page.
- **Instagram research** — Playwright browser was still open and logged into the user's Facebook at session end; user may continue the browser session for Instagram next.
- **Owner callback items** — (1) Confirm Kegler's Cash average brackets for copy accuracy, (2) BPAA website cost: bundled with membership or separable?

---

## Decisions + reasoning

- **React via CDN/Babel static, no build step** — Why: user's explicit choice, matches existing README, correct for a Cloudflare tunnel demo with no build infra. DesignClaude builds the UI into the scaffold.
- **DesignClaude handles UI build** — Why: DesignClaude is the designated UI-builder Claude instance; the main session produces specs and scaffold, DesignClaude consumes them.
- **CSS micro-animation for mascot, not rigged SVG** — Why: simplest verified path; rigged SVG via Rive/Lottie + ComfyUI part-generation is documented as the upgrade path but is not in scope for the pitch.
- **Transparent video for talking mascot: WebM/VP9-alpha + HEVC fallback** — Why: browsers barely support transparent video; the workflow doc captures the honest caveats (flicker risk, Safari fallback complexity).
- **Google Maps 360 panos: keep equirectangular + generate flat crops** — Why: equirectangular is the most flexible source; flat crops are readable for spec/content work and can feed Photo Sphere Viewer later.
- **Cafe vs bar-lounge naming by actual image content** — Why: user's labels were reversed. Red-counter/menu-boards = cafe; bar-stools/booths/mascot-mural = bar-lounge. Names corrected at time of filing.
- **Stopped FB deep-history at ~45 flyers** — Why: deep history (500+ photos) is un-OCR'd snapshots with no alt-text; marginal return vs time cost.
- **proshop-spec cleanup: 6 canonical + README at top level, 28 sibling drafts -> supporting/** — Why: preserves research depth, eliminates naming collisions, README points to supporting/ for context.
- **Suggestion box: own Cloudflare Worker + Resend** — Why: MailChannels-free-from-Workers was killed Aug 2024. Resend: 3000 free emails/mo, supports attachments, needs verified domain (myroproductions.com is already live on Cloudflare). Drop-zone images only — `html2canvas`/`getDisplayMedia` self-screenshot is not viable.
- **Won't paywall-bypass IndyStar** — Why: paywall circumvention = taking paid content. Legit paths only.
- **SRI integrity hashes skipped on CDN scripts** — Why: premature for a throwaway scaffold likely to be replaced; documented as a production to-do in the scaffold comments.
- **ElevenLabs Veo 3.1 Fast two-frame interpolation: unverified** — Why: the video prompt doc was written to the user's stated workflow topology, but whether Veo 3.1 Fast actually accepts begin+end frames for interpolation was flagged as unconfirmed. Verify before building.

---

## File paths + line refs

### Committed + merged
- `docs/proshop-spec/README.md` — canonical entry point; links to 6 spec files + supporting/
- `docs/proshop-spec/05-3d-walkin-sim-spec.md` — Photo Sphere Viewer v5 + markers + virtual-tour plugin architecture
- `docs/suggestion-box-build-spec.md` — Cloudflare Worker + Resend architecture; wrangler login blocker noted
- `docs/mascot-integration-spec.md` — CSS corner-buddy spec for DesignClaude
- `docs/mascot-talking-video-workflow.md` — green-screen prep + chroma-key-to-transparent-WebM pipeline + caveats
- `docs/elevenlabs-video-prompt-doc.md` — TWO Gemini lanes -> Veo 3.1 Fast topology; Veo two-frame caveat flagged
- `public/mascot-demo.html` — verified working CSS animation demo (idle bob, wave-on-hover, CTA-scroll, click-to-book, dismiss, prefers-reduced-motion)
- `public/img/generated/mascot/mascot-wave.png` — chroma-keyed mascot, transparent PNG
- `public/img/generated/mascot/mascot-four-views.png` — chroma-keyed mascot, transparent PNG
- `public/img/generated/cards/` — 5 membership tier card cutouts (BAC, Diamond, Gold, Hole Punch, Silver), transparent PNGs
- `public/img/reference/proshop/flat-crops/` — 16 flat crops from 2 proshop 360 panos
- `public/img/reference/cafe/flat-crops/` — 8 flat crops from cafe 360 pano (menu boards with legible prices)
- `public/img/reference/bar-lounge/flat-crops/` — 8 flat crops from bar-lounge 360 pano

### Uncommitted — scaffold
- `public/index.html` — CDN loader: React 18 + ReactDOM + Babel standalone; wires all css/js
- `public/js/data.js` — real business facts as `window.ASB_DATA` global (address, phone, hours, lanes, etc.)
- `public/js/app.jsx` — mounts React via `ReactDOM.createRoot`, view-switcher for 7 pages
- `public/js/components.jsx` — Nav and Footer components
- `public/js/home.jsx`, `bowl.jsx`, `eat.jsx`, `leagues.jsx`, `parties.jsx`, `account.jsx`, `status.jsx` — page-view stubs
- `public/css/styles.css` — base reset
- `public/css/components.css`, `home.css`, `pages.css` — stubs

### Uncommitted — research/content
- `docs/strike-jackpot-research.md` — modified; "ANSWERED" section added at top with Kegler's Cash mechanics
- `docs/promotions-games-and-menu.md` — **new; most content-rich doc this session**: Kegler's Cash rules, Casino Bowling, Cosmic Bowling, Interactive Bowling, party pricing (weekday/primetime/NYE/Good Grades/Junior Gold/corporate), full cafe menu with real prices, phone-case kiosk, arcade
- `docs/outstanding-research.md` — new; open research gaps tracker
- `public/img/reference/infodocs/` — FB flyers; includes the Kegler's Cash flyer confirming $0.25-$5.00 buy-in / 10x payout / average-based qualification / sign-up-before-3rd-frame rule

### Gitignored (local only — do NOT commit)
- `public/uploads/gmaps-photos/` — 130+ photos including asb-130 through asb-135 (lounge bar, front desk 360, proshop 360s, bar-lounge 360, cafe 360)

### Project memory
- `/Users/myro-pro/.claude/projects/-Volumes-DevDrive-M4Pro-Projects-allstarbowindy-com/memory/MEMORY.md` — index
- `/Users/myro-pro/.claude/projects/-Volumes-DevDrive-M4Pro-Projects-allstarbowindy-com/memory/strike-jackpot-keglers-cash.md` — Kegler's Cash confirmed facts
- `/Users/myro-pro/.claude/projects/-Volumes-DevDrive-M4Pro-Projects-allstarbowindy-com/memory/email-routing.md` — suggestion box recipient is pmnicolasm@gmail.com (NOT husky2466@gmail.com)
- `/Users/myro-pro/.claude/projects/-Volumes-DevDrive-M4Pro-Projects-allstarbowindy-com/memory/allstarbowl-computerscore-login.md` — LiveScores authenticated access credentials

---

## Next steps + open questions

1. **Commit the uncommitted pile.** User was deciding one "project-init + FB-research" PR vs splitting app-scaffold from research-docs. Pick a split, create PR(s), merge.
2. **Tidy pre-existing misc/ asset churn** (jpg->png swaps, stray misc-02.jpg at reference root, lounge/ duplicates, uploads/3d/) in a separate cleanup PR — do NOT bundle with deliverable PRs.
3. **Build Cloudflare tunnel** — `allstarbowlindy.myroproductions.com` -> `localhost:8080`. Blocker: `wrangler login` or set `CLOUDFLARE_API_TOKEN` from Vault (`Secrets/data/cloudflare/...`). CF account is "Pmnicolasm@gmail.com's Account"; zone `myroproductions.com` (zone id starts `252edb...ff87`) is already live serving `kelsiepreview.myroproductions.com`.
4. **DesignClaude UI build pass** — builds into the verified scaffold: site UI (Nav/Footer/pages), LiveScores demo page (fixtures + build-spec from prior session already committed), suggestion box, mascot corner-buddy integration.
5. **Get IndyStar history legitimately** — Indianapolis Public Library card or user pastes article text. Target: About/Our Story page content.
6. **Instagram research** — Playwright browser may still be open (tab 0 = FB, user will close). Drive a new Instagram session for @allstarbowlindy.
7. **Owner callback** — (1) Confirm Kegler's Cash average bracket thresholds and exact payout tiers for copy; (2) Is the BPAA website cost bundled with BPAA membership or separable? (This is the pitch cost-comparison crux.)
8. **Verify Veo 3.1 Fast two-frame interpolation** before telling the user the ElevenLabs flow-canvas topology works as designed.

- ? Does `public/uploads/3d/` have an owner / purpose? Investigate before touching.
- ? Kegler's Cash: what are the exact average brackets that determine win thresholds? Flyer gives buy-in tiers and 10x rule but not the handicap/average breakpoints — owner callback needed.
- ? BPAA website: is the legacy DNN/template site cost bundled with BPAA membership fees or a standalone line item? Critical for the pitch cost comparison.
