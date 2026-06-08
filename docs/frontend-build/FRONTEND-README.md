# All Star Bowl — Frontend Build (INGEST: START HERE)

This project is the **authoritative frontend build** for the All Star Bowl modernization
(East-side Indianapolis bowling / sports bar / Alley Cafe / pro shop). It's a single-page
**React + in-browser Babel** prototype, hash-routed, **no build step** — open the entry file
and it runs.

> Companion repo `husky2466-codo/allstarbowindy.com` is the **research / docs / planning + image
> library**. Its `public/js` is a **stale partial drop-zone** — the complete, live code is **here**.

## Read these first (in order)
1. **`CLAUDE.md`** — load-bearing rules: confirmed business facts (48 lanes, hours, operator),
   workflow, brand tokens, hard constraints, and **preview-environment gotchas** (CSS transitions
   are frozen → rAF-driven motion, no `opacity:0` resting states, verify via DOM rects not screenshots).
2. **`HANDOFF.md`** — full build state, every page, every session's work, open punch list.
3. **`docs/DATA-CONTRACT.md`** — the **mock → real swap map**. The deploy seam is
   `window.ASB_DATA` (`js/data-provider.js`); components read member/jackpot via `getMember()`/
   `getJackpot()`, never hardcoded. `member:null` → honest empty state.

## Run it
Static files, no toolchain. Open **`All Star Bowl.html`** in a browser (or any static server from
the project root). It loads React/ReactDOM/Babel from CDN, then `js/*` and `assets/*` by relative path.

## File map
```
All Star Bowl.html     Entry page — defines the authoritative CSS + JS load order (read it).
assets/
  *.css                Design tokens + per-page styles (styles, components, home, pages, pages2-4,
                       wincash, scores, proshop, cosmic, mascot). CSS url() is relative to assets/.
  img/ , menu/         Imagery the build references (logo, heroes, cards, menu flyers, mascot).
js/
  data.js              window.ASB — business facts + time-aware "Bowl-o-meter" live engine.
  data-provider.js     window.ASB_DATA — THE deploy seam (member + jackpot). See DATA-CONTRACT.
  proshop-data.js      window.PROSHOP — pro-shop catalog.
  demo-fixtures.js     window.ASB_FIX — real Live Scores snapshot (captured 2026-06-07).
  lane-engine.js       Canvas nav lane transition.
  components.jsx       Hooks, Icon, Logo, Router, Nav, Footer (shared via Object.assign(window,...)).
  *.jsx                One file per page/feature (home, bowl, leagues, scores, eat, parties,
                       account, proshop[-walkin], cosmic, join, jackpot, wincash, specials,
                       contact, legal, mascot, status, mobile) + app.jsx (router/mount).
docs/DATA-CONTRACT.md  Mock→real swap map + deploy checklist.
image-slot.js, ios-frame.jsx   Starter components used by the build.
Lane Banner Motion Study.html, card-reference.html   Standalone tuning/concept sandboxes (not part of the app).
Hero Image Prompts.md, Membership Card Prompts.md     Image-gen prompt docs.
uploads/               Original source uploads (audit doc, flyers, logos, card art, OLD scraped site).
                       Provenance only — largely duplicated by the repo's curated img sets; not loaded at runtime.
public/                Stray provenance (imported reference flyer + real demo-fixture JSONs). Not loaded at runtime.
```

## Architecture notes for whoever extends this
- **Each `<script type="text/babel">` has its own scope.** Shared components/components export to
  `window` via `Object.assign(window, {...})` at the end of each file. New shared bits must do the same.
- **Never name a styles object just `styles`** — global-scope collisions break the app. Use a unique name.
- **All dynamic/member data flows through the data globals** (`ASB`, `ASB_DATA`, `PROSHOP`, `ASB_FIX`).
  Do **not** hardcode member/dynamic data in JSX — read `ASB_DATA.getMember()` / `getJackpot()` and
  render an empty state when null. That invariant is what lets deploy swap mock→real in one file.
- **Live status:** open/closed + hours are REAL; lane occupancy/wait is a MODEL (no API). See DATA-CONTRACT §3.

## Immediate next task (planned)
Full **Tier-A member-area rebuild** against `docs/MEMBER-AREA-SCOPING.md` (in the repo) — game metrics
w/ empty states, 195-ball catalog, saved bag, LiveScores/standings links, USBC link-out, static BAC
explainer — all read from the `window.ASB_DATA` seam, no fabricated data. The seam + an empty-state
`DashboardEmpty` are already in place (`js/account.jsx`, `js/data-provider.js`).

## Deploy / drop-in
Paths are relative and self-consistent (`assets/...`, `js/...`). To serve from the repo's `public/` as
`index.html`, keep `assets/` and `js/` alongside it and point the entry HTML at them (or remap per the
repo README). No bundler. See `docs/DATA-CONTRACT.md` §4 for the mock→real deploy checklist.
