# CLAUDE.md — All Star Bowl (AllStarBowl.com project)

> Auto-injected into every conversation in this project. Keep it tight and high-signal.
> Deep detail lives in `HANDOFF.md` (read it at the start of a build session).

## What this project is
A full modernization of **All Star Bowl** (East-side Indianapolis family entertainment
center — bowling, sports bar, Alley Cafe, pro shop). Single deliverable:
**`All Star Bowl.html`** — a single-page React (Babel-in-browser, hash-routed) prototype.
Centerpiece = the time-aware **"Bowl-o-meter"** live-status engine (`js/data.js → window.ASB`).

## Workflow / who does what
- **Local repo (`husky2466-codo/allstarbowindy.com`, also mounted as a local folder)** =
  the **research + documentation + planning** brain (audits, content briefs, specs, curated
  image library). Done by the user's other agent.
- **THIS project** = the **authoritative build**. All real work happens here.
- ⚠️ The repo's `public/js` + `public/css` are a **STALE partial drop-zone** — never treat
  them as current. The complete, live code is in this project's `js/` and `assets/`.
- To use repo material: read docs via `local_read`/`github_read_file`; to VIEW an image you
  must copy it into this project first (`local_copy_to_project` / `copy_files`), then `view_image`.

## Confirmed business facts (source of truth — do not re-derive)
- **48 lanes** (synthetic, wood approaches). NOT 32.
- **Operator:** 3DS Entertainment Inc.  ·  **Domain:** allstarbowlindy.com (NOT allstarbowl.com).
- **Address:** 726 N Shortridge Rd, Indianapolis, IN 46219  ·  **Phone:** (317) 352-1848.
- **Real email:** allstarbowlindy@gmail.com (single source: `ASB.BIZ.email`).
- **Hours (CONFIRMED, matches live site — not the old posted sign):**
  Mon 9–10 · Tue 10–10 · Wed 11–11 · Thu 11–10 · Fri 12–11 · Sat 10–12a · Sun 12–9.
- **Tagline:** PLAY · LAUGH · CHEER · SMILE · CELEBRATE. Catering up to 67. Delivery: Grubhub & DoorDash.
- **Cash games are TWO distinct things** — keep separate: **Kegler's Cash** (Strike Jackpot board,
  all week, win up to $150, 10×, 25¢–$5 buy-in, average-based, sign up before 3rd frame) and
  **Casino Bowling** (strike = slot spin, Mon & Thu 8 PM, $6.25/game).

## Sources of truth (the linked folder)
- `docs/allstarbowl-site-audit-handoff.md` — master audit.
- `docs/DESIGNCLAUDE-CONTENT-BRIEF.md` — per-page content checklist with inline facts/prices.
- `docs/DATA-CONTRACT.md` (in THIS project) — mock→real swap map for deploy. **The deploy seam is
  `window.ASB_DATA` (`js/data-provider.js`)** — member + jackpot live there; components read it via
  `getMember()`/`getJackpot()`, never hardcoded. `member:null` → honest empty state. Live-status
  occupancy is MODELLED (open/closed + hours are real). Keep new dynamic data in this seam.
- Image manifests describe every asset: `public/img/reference/reference-manifest.json`,
  `public/img/generated/generated-manifest.json`, `.../people/people-manifest.json`,
  `public/uploads/gmaps-manifest.json`.
- **Verify prices against the real flyer images** (`reference/infodocs/`, `reference/cafe/flat-crops/`).
  When OCR and the image disagree, **the image wins.**

## Brand / design system
- Colors (vars in `assets/styles.css`): navy `--navy-900 #0a1430`, `--blue-700 #1b3a8f`,
  `--red-500 #e0241f`, `--cream #f5f1e6`, `--gold #f5b423`; status open/limited/busy/closed.
- Type: `--f-display Anton` (caps headlines), `--f-head Saira Condensed`, `--f-body Barlow`.
  Casino/marker accents use `Permanent Marker`. Avoid Inter/Roboto.
- **Detail text on dark backgrounds = cream/white (#f5f1e6), never muted gray.** Gray detail only on light bg.
- New shared components MUST `Object.assign(window, {...})` (each Babel script has its own scope).
- Never name a styles object just `styles` — collisions break the app. Use a unique name.

## Hard constraints
- **No-people photos for venue/marketing shots** — use empty-venue references (a `people/` set
  exists but is off-limits for venue hero/marketing use unless the user says otherwise).
- One strong design direction (not a design-canvas comparison) unless asked.
- **Member area (per `docs/MEMBER-AREA-SCOPING.md`): NEVER fabricate member data.** Build **Tier A only**
  (own/first-party: app-captured game metrics w/ empty states · 195-ball catalog · saved balls/bag ·
  LiveScores + standings links · USBC link-out · static BAC explainer). Tier B (personal tier/points,
  visit history, lane availability, avg-trend chart) = **label "placeholder / Phase 2"**, don't fake.
  Read all member data from a **swappable data layer** (`window.ASB_DATA`/stub) — do NOT hardcode in JSX.
  Auth = Cloudflare Access (no login form to design). ⚠️ The current `#/account` dashboard's fake `MEMBER`
  (Marcus Bell/Gold/164 games) violates this — replace w/ data layer + empty states when building for real.

## Environment gotchas (preview iframe)
- CSS **transitions & animations are FROZEN** (clocks don't advance); `requestAnimationFrame`
  and `setTimeout` DO run; `IntersectionObserver` does NOT fire. → Drive all motion with rAF +
  inline transform/opacity from state. **Never use `opacity:0` resting states** (page goes blank).
- Verify layout via **DOM rects / `eval_js`**, not screenshots (capture mis-positions display
  fonts and won't render bg-images on absolutely-positioned layers).
- CSS `url()` resolves relative to the stylesheet (in `assets/`), so paths are `url(img/x.png)`.
  Inline-style JSX backgrounds resolve relative to the HTML → `url(assets/img/x.png)`.
- Don't use `scrollIntoView` or `window.scrollTo` inside the iframe for inspection; translate the body.
- Keep files < ~1000 lines; split and load in order via the HTML.

## Build status (see HANDOFF.md for full detail)
- **Built + passing:** Home · Bowl (reservations + booking) · Cosmic (+Arcade) · Leagues ·
  Live Scores · Eat (+cafe gallery) · Specials (+ **Win Cash**: Kegler's tabbed board + Casino
  slot) · Parties · Rewards · Pro Shop (catalog + walk-in) · Contact · #/join · Terms/Privacy.
- **Open punch list:** Cafe real prices + Alley Lounge page · Parties full pricing tiers ·
  Specials extras (Good Grades, military, Easter, Ladies social) · Phone-case kiosk · Interactive Bowling.
- **Still demo values to confirm:** Strike Jackpot pot totals ($310/$6,916); Cosmic glow nights & rates.
