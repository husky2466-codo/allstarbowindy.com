# All Star Bowl — Modernization Build · Handoff

**Project:** AllStarBowl.com (modernized website mockup for All Star Bowl, East Indianapolis)
**Primary deliverable:** `All Star Bowl.html` (interactive multi-page React prototype)

> **CLAUDE.md now exists** at project root — auto-injected every conversation; holds the load-bearing
> facts/rules (confirmed business facts, workflow, env gotchas). Read it + this file at session start.

**Data-layer seam for deploy (LATEST, this session):** Set up so the IDE/backend Claude can overwrite
mock data with real data **without touching components**. New deliverable **`docs/DATA-CONTRACT.md`**
(in this project) = the full mock→real swap map + per-source audit.
- **New `js/data-provider.js` → `window.ASB_DATA`** (loaded right after `data.js`) is **THE swap seam.**
  Holds the only two genuinely-mock dynamic sources: **`member`** (was the hardcoded `MEMBER` in
  `account.jsx`) and **`jackpot`** (`{red:310, blue:6916}`, was hardcoded in `jackpot.jsx`). Exposes
  `getMember()` / `getJackpot()`. Components now read from it — **no member/pot literals in JSX.**
- **`account.jsx` refactor:** deleted the local `MEMBER` const; `Dashboard` reads `getMember()` and
  **renders a new `DashboardEmpty`** ("No games tracked yet" + real Tier-A actions) when `member` is
  `null`. Proven: setting `window.ASB_DATA.member=null` flips to the empty state and the fake stats card
  disappears — satisfies the no-fabricated-data rule + proves the swap. (Demo member still ships as the
  stub so the signed-in preview looks the same.)
- **`jackpot.jsx`** seeds pots from `getJackpot()` (demo fallback retained).
- **Audit result:** ✅ already-swappable: `window.ASB`, `window.PROSHOP`, `window.ASB_FIX`. ⚠️ fixed this
  session: `MEMBER` + jackpot pots → `ASB_DATA`. Flagged in the contract: **live-status occupancy is
  MODELLED** (open/closed + hours are REAL; `lanesInUse`/`wait` are a demand-curve model — no lane API
  exists → Tier B/Phase 2); `ASB.COSMIC` demo values; `ASB_FIX` is a real static snapshot to later swap
  for a Computer Score poller. Everything else (`MENU`, contacts, divisions, mascot lines) is real static
  content. See `docs/DATA-CONTRACT.md` §4 for the deploy checklist.

**Member Area scope unlocked (this session — from Claude Research):** New governing doc
`docs/MEMBER-AREA-SCOPING.md` (refs `MEMBER-AREA-RESEARCH.md`, `MEMBER-METRICS-SUITE.md`). The member
area is now greenlit to build **here in this project** — but under strict rules. **Governing rule:
DO NOT fabricate member data** (real client; inventing an average/points balance is a liability).
- **The reframe — we become the system of record.** No public API exists from Computerscore/LiveScores,
  USBC/bowl.com, or BAC (HTML-only / behind their login) — so we can't *pull* a bowler's average. The
  answer is to **capture**: a planned **companion All Star Bowl phone app** lets bowlers record their own
  games → that's **first-party data we own** → the website member area can honestly show metrics. **MVP
  capture = manual score entry**; CV shot-tracking (reviving retired BowlerTrax-V1) is Phase 2.
- **Tier A — BUILD THESE (all real / owned):** (1) **My game metrics** (average trend, high game, series,
  game log) from games captured in our app — **empty state until they've tracked a game, never a fake
  number** — this is the headline feature; (2) **Browse equipment catalog** — our **195-ball dataset**
  (`reference/bowling-catalog/`), self-contained, filter by brand/coverstock/core; (3) **My saved balls /
  my bag** — member tags balls they own, stored in our datastore keyed to identity; (4) **Live league
  scores** (link/iframe Computerscore centre 112); (5) **League standings** (link out); (6) **"Find my
  USBC average"** (link-out to bowl.com, name pre-filled, we never store it); (7) **BAC tier explainer**
  (static education, not personal status).
- **Tier B — Phase 2, DO NOT FAKE (label "placeholder / Phase 2 — pending data"):** personal BAC tier/visit
  status, points/visit balance, visit/reservation history, real-time lane availability, birthday/promo
  triggers, charted average trend. (Pitch as the upsell: "what's real today vs. what lights up once we
  connect your systems.")
- **Auth + storage:** **Cloudflare Access (Zero Trust)** gates `/members/*` (identity via Google / email-OTP,
  free ≤50 users) and passes a signed JWT with the verified email; behind it a small **Cloudflare D1/KV**
  datastore holds the only member-owned data (**saved balls / my bag**, keyed to that email). **No custom
  login/password form** — Access handles identity.
- **⇒ DesignClaude (THIS project) build instructions:** (1) build around **Tier A only**; (2) any Tier B
  element shown for completeness must be **labeled placeholder / Phase 2**; (3) **read ALL member data from a
  swappable data layer** (`window.ASB_DATA` / a stub module) — **do NOT hardcode** names/averages/saved items
  in JSX, so backend wiring is a one-file data-source swap, not a rewrite; (4) assume the page renders **after
  Cloudflare Access** has authenticated (verified email available; no login form to design).
- ⚠️ **OPEN QUESTION for the owner (before the gate ships):** *who are the "members"?* Access's free tier +
  gate model fit a **small known set** (owner, league officers, pilot group). "Any customer self-registers" is
  a larger, different build. **Confirm scale before building.**
- ⚠️ **RECONCILIATION — existing Rewards dashboard conflicts.** The current `#/account` signed-in Dashboard
  renders a **fabricated `MEMBER` object** (Marcus Bell, Gold tier, 164 games, savings, activity history) and
  a **points/tier-status** framing — exactly what the scoping doc forbids. When the real member area is built:
  replace `MEMBER` with the **swappable data layer + empty states**, drop the fake game/savings/activity
  numbers, and reframe tier/points as **static education or Tier B placeholder**. The logged-out teaser
  (tier ladder, rate table, "join free" → `#/join`) is fine to keep. (Also note `account.jsx` BAC tiers are
  real, but a *personal* tier status is Tier B / not ours to assert yet.)

**Win Cash section + data corrections (this session):** Worked from the content brief
(`docs/DESIGNCLAUDE-CONTENT-BRIEF.md`, pulled from repo) and verified Kegler's rules against the real
in-shop flyer (`public/img/reference/infodocs/482199052_…_n.jpg`).
- **Two factual data corrections in `js/data.js`** (the brief confirmed both, resolving prior open
  questions): **`BIZ.totalLanes` 32 → 48** (ripples through the live Bowl-o-meter; `.lanes-grid` is
  `repeat(16,1fr)` so 48 = a clean 3 rows of 16 — no CSS change). **`HOURS` updated to the confirmed
  set** (matches the live site, NOT the old posted sign): Mon 9–10 · Tue 10–10 · Wed 11–11 · Thu 11–10 ·
  Fri 12–11 · Sat 10–12a · Sun 12–9. Added **`BIZ.operator = "3DS Entertainment Inc."`**. Also updated
  `home.jsx` Experiences card "32 Lanes" → **"48 Lanes"**.
- **NEW `js/wincash.jsx` + `assets/wincash.css`** (loaded after `jackpot.jsx` / after `pages4.css`).
  A big **`WinCashSection`** dropped onto the **Specials page only** (replaces the old conflated
  `CasinoFeature` — that fn + `CASINO_STEPS` were DELETED from `specials.jsx`). Keeps the **two cash
  games DISTINCT**, per the brief:
  - **`KeglersCashFeature`** (`#keglers-cash`) — navy card: the existing **`StrikeJackpotBoard`** (from
    `jackpot.jsx`) as centerpiece + a 4-up headline stat panel (Win up to $150 · 10× · 25¢–$5 · any/all).
    **Below the board: a tabbed explainer** (user's explicit ask) — tabs *How to play · Pick your buy-in ·
    The one rule · Why it pays* (`KEGLERS_TABS`), detail panel beneath at **~16px (well above the 12px
    floor)**. "Pick your buy-in" tab shows the win-10× ladder ($0.25→$2.50, $1→$10, $2→$20, $5→$50).
    All facts verbatim from the flyer (sign up before the 1st ball of the 3rd frame; "even if you only
    win once every nine games, you make a profit").
  - **`CasinoBowlingFeature`** (`#casino-bowling`) — after-dark card: copy + a working **3-reel slot
    machine** (`CasinoSlot`). Strike = slot spin; Mon & Thu 8 PM, $6.25/game; note that it also runs
    during Cosmic/Interactive + NYE adult party. Reserve / Call CTAs.
  - Section header has **jump chips** to each game; a small legal disclaimer at the bottom.
- **Slot machine mechanics (reusable pattern):** `CasinoSlot` is rAF-driven (CSS transitions are frozen
  in preview). 3 reels, **continuous-scroll geometry**: render 5 cells (`idx-2..idx+2`), window = 3×
  `SLOT_ITEM_H` (62px) with the center row as the red **payline**, `translateY(-itemH - frac*itemH)`.
  `spin()` eases `pos` (easeOutCubic) to an integer landing on a chosen result (`pickSlotResult` —
  ~34% jackpot 7-7-7); a manual **Pull** button works any time, and it **auto-spins every 5.2s on
  casino night** (`s.liveSpecial.name === "Casino Bowling"`). ⚠️ Debug note: a single sparse
  `setTimeout` poll can catch it at an integer-rest frame and look "stuck" — poll densely (~180ms) to
  see motion; it's verified working. SLOT symbols = red 7 / gold ★ / green $ / blue ◆ / navy ●.
- HTML wiring: added `<link … assets/wincash.css>` (after pages4.css) and
  `<script … js/wincash.jsx>` (after jackpot.jsx). Verifier forked.
- **Local folder linked** (mounted `allstarbowindy.com/`) — same content as the GitHub repo. I can
  read all docs and image **manifests** directly; to VIEW an image I copy it into the project first
  (`local_copy_to_project` → `view_image`). Confirmed the `reference/logos/all-star-bowl-3ds-logo.jpg`
  crest matches the brief (shield, "ALL STAR BOWL" + "3DS", stars, red/white stripes, crossed pins, blue ball).
  Rich asset library available: `reference/` (~39 no-people shots + 360 flat-crops), `infodocs/` (~23
  real flyers), `generated/` (~40 described assets), `uploads/gmaps-photos/` (135 GMaps photos + labeled
  360 panos), a `.glb` mascot model, and `docs/live-site-reference/` (the scraped original DNN site + livescores).

**Repo rebase + new pages (latest, this session):** Pulled the upstream GitHub repo (`husky2466-codo/allstarbowindy.com`) — which is an **asset + research store, not code** (`public/js` & `public/css` are empty placeholders; the mockup itself lives only here). Confirmed the Pro Shop (catalog + walk-in) a prior session built is intact, then added the still-missing features from the audit's "feature additions" list, using the repo's curated **no-people venue reference photos** (`public/img/reference/`, now copied into `assets/img/`). Per the user: **no people photos / avoid identifiable faces** — every reference shot used is an empty-venue shot.
- **`#/cosmic` — Cosmic Bowling page** (`js/cosmic.jsx`, `assets/cosmic.css`, route in `app.jsx`, loaded after `proshop-walkin.jsx`). Dark "after-dark" theme (deep-space base + neon magenta/cyan/violet over the venue navy — scoped vars on `.cosmic-page`, does NOT touch the global brand tokens). Sections: **CosmicHero** (real glow-lane photo `img/cosmic-lanes.jpg` = lanes-12, a genuine projected-lane/blacklight shot — no CSS faking needed) → **CosmicWhat** (3 feature cards) → **CosmicWhen** (glow session schedule + cosmic pricing card; both **DEMO values flagged** — `ASB.COSMIC.demo`) → **CosmicGallery** → **ArcadeHighlight** → **CosmicParty** CTA → `/parties`. Data: `ASB.COSMIC` in `data.js`.
- **Arcade highlight** (`ArcadeHighlight` in `cosmic.jsx`, lives at the bottom of the Cosmic page — glow night + arcade is the natural after-dark combo). Real photos `img/arcade-classics.jpg` (Pac-Man Pixel Bash + Raw Thrills racer) and `img/arcade-claw.jpg` (claw machines + prize wall) + game cards (Pac-Man's Pixel Bash, Raw Thrills Racing, Moonlight Catcher, Shooting Star, Tickets & Prizes). Data: `ASB.ARCADE`.
- **Cafe / dining gallery** (`CafeGallery` in `eat.jsx`, inserted between `MenuSection` and `NewItems`; styles `.cafe-*` in `pages2.css`). "Step inside the cafe" — feature dining-hall shot (`img/lanes-wide.jpg`) + ribs / Alley Lounge bar / mural / booths tiles. All real venue photography.
- **Pro Shop "My list" moved to a nav cart + drop-down drawer** (was a floating bottom-right `.ps-listbtn` that overlapped the Corner Buddy mascot). Now: a **cart icon in the nav** (`NavCart` in `components.jsx`, in `.nav-right`, shows only when `WishStore` count > 0, with a count badge) opens a **drawer that drops down under the nav bar** (`CartDrawer`, `.cart-drawer` absolute at `top:100%` of the sticky `.nav`, right-aligned, light panel with a transparent `.cart-scrim` click-catcher; Esc closes; auto-closes when the list empties). Drawer lists items (shared `window.ProductArt` thumbs + remove ×), an estimate total, and **Reserve / ask the pro** + **Call** actions. Reserve works from ANY page via a new global **`ReserveStore` + `<ReserveHost/>`** (in `proshop.jsx`, mounted once in `app.jsx` beside `CornerBuddy`) — `ReserveStore.open(ids|null)` mounts the existing `ReserveSheet` modal. `ProShopPage` no longer renders its own floating button or local reserve modal; its PDP reserve calls `ReserveStore.open([id])`. Cart count/badge persists via the existing localStorage `WishStore`. Styles `.nav-cart*`/`.cart-*` in `components.css`; old `.ps-listbtn` CSS is now unused.\n- **Nav consolidated into a "Bowl" hub dropdown** (per user request to reduce clutter). `NAV_ITEMS` in `components.jsx` is now nested: **Bowl ▾** → Reservations (`/bowl` — the live-status/booking page), Parties (`/parties`), Cosmic Bowling (`/cosmic`), Leagues & Youth (`/leagues`), Live Scores (`/scores`); then flat Eat · Specials · Rewards · Contact. Top-level is **5 items** (+ the separate Pro Shop pill button + the cart icon when non-empty). Desktop dropdown is CSS hover/`:focus-within` (`display:none→grid`, no opacity-fade so it can't freeze-blank in preview); mobile sheet renders the group as a labeled header + indented children; footer "Explore" flattens the tree. Styles `.nav-group/.nav-dropdown/.nav-dd-*` in `components.css`; `pages4.css` nav-fit relaxed back to 6-item padding. ⚠️ `pages.css` `.bowlhero` etc. unchanged — `/bowl` is still the reservations page, just relabeled in nav.
- **Corner Buddy mascot greetings** (`BUDDY_ROUTE_LINES` in `mascot.jsx`) extended to cover every route — previously `/cosmic`, `/proshop`, `/join`, `/terms`, `/privacy` fell through to the generic "Strike!". Now each has a fresh line (e.g. Cosmic "Lights down, glow up!", Pro Shop "Let's find your ball!", Join "Join the club — it's free!"). The bubble fires on navigation (not first mount).
- **Repo is the deployment target's asset store** — the README there maps `*.css→public/css/`, `*.jsx+data.js→public/js/`, images→`public/img/`, `All Star Bowl.html→public/index.html` on drop-in (NOT done this session — user said just update the working file).

**Membership sign-up page (latest, this session):**
- **`#/join` — BAC membership application** (`js/join.jsx`, route in `app.jsx`, styles `.join-*` in `assets/pages3.css`, loaded after `account.jsx`). Real problem it solves: joining is free but done on a **paper clipboard** that a staffer only enters into the system **once a month** (took the owner ~6 months to appear). This page lets people fill it out online instead. Hero framing = "Join free — skip the paper form." Form (`JoinForm`): first/last/email/phone required (validated), DOB + address + league/military checkboxes optional. **Submit builds a `mailto:` to `ASB.BIZ.email` (`allstarbowlindy@gmail.com`, the venue's real address — set in `BIZ` in `data.js`)** with all fields in the body, opens the user's mail app, and shows a success state (re-open button + direct-email fallback). Side rail = "Why join" perks + "What happens next" 3-step timeline (sets the honest monthly-batch expectation). The Rewards page "Join free" / "Start earning — join free" CTAs now `Router.go("/join")` (the "I'm already a member" button still toggles the demo dashboard). **Production note:** mailto requires the visitor's mail client — to make it fully hands-off, swap the submit for a form-to-email service (Formspree/FormSubmit) or a real backend POST. Also added a `mail` icon to `components.jsx`.
- **Casino "Strike Jackpot" board** (`js/jackpot.jsx`, `StrikeJackpotBoard`, loaded before `specials.jsx`; styles `.jp-*` + reworked `.casino-feature` grid in `pages4.css`) — branded recreation of the venue's real hand-drawn casino-night board (red/blue marker X grid, yellow-outlined banner, Red $310 / Blue $6,916 pots). Replaces the old slot-reel art in `CasinoFeature`; goes **live** (board straightens, green "marking strikes" badge, X's mark in, pots tween up) when `s.liveSpecial.name === "Casino Bowling"` (Mon/Thu 8 PM). Uses `Permanent Marker` Google Font (added to the `<head>` link). `CasinoFeature` also gained a 3-step "how it works" strip. **Brand convention reaffirmed:** informational/detail text on dark backgrounds must be cream/white (`#f5f1e6`), NOT muted gray — gray detail text only on light backgrounds.


**Engagement layer update (latest, this session):**
- **Corner Buddy mascot** — site-wide bowling-pin mascot (`js/mascot.jsx`, `assets/mascot.css`, mounted in `app.jsx` `App` as `<CornerBuddy/>`, script loaded after `legal.jsx`). Fixed bottom-right, **follows every page**. All motion is **rAF-driven** (CSS anims freeze in preview): idle bob, hover wave, excite-burst on route change + when a `.btn-red`/`.btn-blue` CTA scrolls into view (polled on scroll — IntersectionObserver doesn't fire in preview), and a contextual per-route speech bubble. Click → `/bowl`. **Dismiss (×) nests it** into the corner with just the head peeking at an angle (`nestY`/`nestRot`/`s.nest` ease in the rAF loop; `transform-origin:50% 100%`); click the peek to **restore** ("I'm back!"). State remembered per session via `sessionStorage['asb_buddy_dismissed']`. Art `assets/img/mascot/mascot-wave.png` (+ `mascot-four-views.png`), pulled from GitHub `husky2466-codo/allstarbowindy.com` (`public/img/generated/mascot/`).
- **Parties hero photo** — `img/birthday-hero-banner.png` (real party-in-alley shot) backs `.partieshero-bg` (inline JSX bg ⇒ `url(assets/img/...)`), navy left-wash for the headline. Old `birthday.png` still backs the Home party promo.
- **BAC membership tier cards — graffiti art set.** Five AI-generated card artworks, one graffiti style per tier (throw-up → blockbuster → chrome → gold-leaf → wildstyle burner), in `assets/img/cards/{bac,holepunch,silver,gold,diamond}.png`. `BacCard` (`js/account.jsx`) renders the tier image as-is (baked "MEMBER/SINCE" lines are part of the art — no fragile text overlay). Rewards teaser hero shows **`TierCardShow`**, a rAF-crossfade **slideshow** of all five (auto 3.6s, pause-on-hover, prev/next, dots, caption = games req + rate); the Dashboard shows the member's own tier card. CSS `.tier-show*` / `.bac-img*` in `assets/pages3.css`. Concept + reusable prompts kept in `Membership Card Prompts.md` and `card-reference.html` (shield logo × neon mural graffiti; generate at 16:9, crop to ~1.586:1).
- **360° virtual tour (Contact).** `js/contact.jsx` `TourEmbed` = full-width interactive Google pano iframe **under the hero, above the cards**, plus a **Full screen** button → `TourModal` overlay (×/Esc/backdrop close, body scroll-lock). ⚠️ `TOUR_EMBED_URL` is a **placeholder** (outdoor Street View at venue coords) — replace with the venue's real indoor 360 "Share or embed image" iframe URL. CSS `.tour-embed*` / `.tour-modal*` in `assets/pages4.css`. ⚠️ Overlay entrance must NOT use `opacity:0` keyframes (freezes invisible in preview — removed). Fixed overlay + cross-origin iframe don't render in captures; verify via `eval_js`/DOM, not screenshots.
- **Open item — icons.** Icons are still the hand-rolled `Icon` switch in `components.jsx`. Discussed swapping to **Lucide** (matches the current Feather-ish style) behind the same `<Icon name>` API — not yet done, awaiting go-ahead (adds a CDN dependency).

**LiveScores update (latest):** **Leagues & Live Scores** page (`js/scores.jsx`, `assets/scores.css`, top-nav `#/scores`) is now a **no-backend demo** that LOOKS live, per `docs/demo-livescores-build-spec.md`. Data is **real**, captured 2026-06-07 from the live floor and parsed into `js/demo-fixtures.js` (`window.ASB_FIX`) from `public/screenshots/demo-fixtures/*.json`. Surfaces: (1) **all-lanes board** — the real 44 active lanes + bowler names, **Lane 38 featured**; (2) **live scoresheet** — frame-by-frame X/spare/open, running totals, pin-carry diagrams, multi-game pager; **Lane 38 replays its real s0→s1→s2 progression** on a 5s timer (Drece 55→60, Bj 69→79) with **count-up totals** (`CountTo`, eases up / snaps on loop reset), an "updating…" pulse + sweep, and a "● live" badge. Other lanes get plausible generated sheets seeded by their real seriesID (board names stay real). (3) **series stats** (Match Record + Conversion), (4) **standings** grid (`ASB.STANDINGS`). Brand-skinned **Live Access Code** entry POSTs to Computer Score (no cred brokering). **Hard constraint met: zero runtime network calls to computerscore.com** — everything reads local fixtures, works offline. Nav is **8 items** (burger ≤1140px). Production note (not this demo): swap the fixtures for a backend that polls `wrapper.php`/`view-lanes.php` every ~5s — same data shape; see `docs/livescores-system-map.md`.

**Status:** Pages — Home, Bowl (Reservations), **Cosmic Bowling** (+ Arcade), Leagues, **Live Scores**, Eat (+ Cafe gallery), Specials, Parties, Rewards, **Pro Shop** (catalog + walk-in), Contact, `#/join` membership form, Terms/Privacy stubs — all built + verifier-passed. **Nav consolidated**: top level is **Bowl ▾ · Eat · Specials · Rewards · Contact** + a Pro Shop pill + a cart icon (shows when the Pro Shop "My list" is non-empty); the **Bowl dropdown** holds Reservations · Parties · Cosmic Bowling · Leagues & Youth · Live Scores. Live-status engine + booking flow + mobile companion working. Real venue photos placed (incl. repo reference shots — no people). Real contact email wired (`allstarbowlindy@gmail.com`). No console errors.

**Hero / background imagery (latest):** Real venue art placed as page backgrounds, each as an absolutely-positioned photo layer (`z-index:0`) UNDER the content with a navy gradient wash for legibility — the proven `contacthero-photo` pattern. ⚠️ The html-to-image capture engine does NOT render background-image on absolutely-positioned layers, so these look blank in screenshots but are fine in-browser — verify with `eval_js` computed-style or a Canvas composite (`run_script`), not captures. All images live in `assets/img/`; CSS `url()` is relative to the stylesheet so paths are `url(img/x.png)` (no `assets/` prefix).
- **Rewards** (`#/account`, logged-out hero): `.acct-hero-photo` → `img/allstar-mural.png` (graffiti "ALL STAR BOWL" mural). Left-darkened wash so the headline stays crisp, color shows behind the BAC card. JSX div in `account.jsx` `RewardsTeaserPage`; CSS `assets/pages3.css`.
- **Bowl** (`#/bowl` hero): `.bowlhero-photo` → `img/bowl-hero.png` (straight-down lanes). Scoped to the bowl hero only via `.bowlhero--photo`/`.bowlhero-photo` (other pages reuse `.bowlhero`). `bowl.jsx` `BowlHero`; CSS `assets/pages.css`.
- **Leagues** (`#/leagues` hero): `.leagueshero-photo` → `img/league-hero.png` (5-bowler team photo). `leagues.jsx` `LeaguesHero`; CSS `assets/pages2.css`.
- **Live Scores lane floor** (`#/scores`): the hero + live-center are wrapped in `<div className="lane-zone">` (in `scores.jsx` `LiveScoresPage`) whose `::before` paints a **full-bleed top-down bowling-lane** (`img/lane-boards.png`, seamless no-arrows boards) tiled `repeat-y` at `background-size: 100% auto` — so the wood runs full width, gutters at the screen edges, scrolling like you're going **down the lane**. A `linear-gradient` wash (darker over the hero) sits on top for legibility. Those two sections dropped `field-navy` for `.lane-on` (transparent bg + `z-index:1` so content paints above the lane). **Stops before Member Access** (AccessEntry + StandingsSection are outside `.lane-zone`). `img/lane-arrows.png` (with-arrows variant) is imported but unused — available if a one-time arrows accent is wanted at the very top (note: tiling it repeats the arrows / risks a seam, hence boards-only). CSS in `assets/scores.css` (`.lane-zone`, `.lane-on`).

**Recent updates (latest session):**
- **Three new pages.** **Specials** (`js/specials.jsx`, top-nav `#/specials`) — Casino marquee, weekly specials grid (from `ASB.SPECIALS`, live “on now” badge), seasonal events (from `ASB.HOLIDAYS`), BAC savings band. **Contact** (`js/contact.jsx`, top-nav `#/contact`) — info card (address/phone/standings/MiniHours) + Google Maps embed + “Send us a message” form (topic `<select>`). **Terms/Privacy** (`js/legal.jsx`, footer-linked `#/terms` `#/privacy`) — `LegalLayout` prose stubs. Styles in `assets/pages4.css`. Nav now has **7 items** (added Specials + Contact); pages4.css tightens `.nav-link` padding + hides `.nav-phone` ≤1180px so they fit before the ≤1000px burger.
- **Real venue photos placed** (replacing placeholders): `img/lanes.png` → Home hero backdrop (darkened); `img/front-building.png` → Home location card **and** Contact hero backdrop; `img/lounge.png` → Eat lounge (replaced the `image-slot`); `img/proshop.png` → Bowl pro-shop card; `img/birthday.png` → Parties hero + Home party promo. (`uploads/Birthday-logo` = a *different* alley's “Beech Grove Bowl” logo — left unused, flagged to user.)
- **⚠️ CSS `url()` path gotcha (fixed).** Background-image `url()` in a stylesheet resolves relative to the **CSS file**, not the HTML. Our CSS lives in `assets/`, so `url(assets/img/x.png)` wrongly became `assets/assets/img/x.png` (404). Correct form from these stylesheets is `url(img/x.png)`. This bit the Home hero (`.hero-photo`, home.css) and Contact hero (`.contacthero-photo`, pages4.css) backdrops. **Inline-style backgrounds in JSX (e.g. PartiesHero) resolve relative to the HTML, so those use `url(assets/img/...)` — don't “fix” those to match.** Also note: the html-to-image capture engine does NOT render background-image on absolutely-positioned divs, so these backdrops look blank in screenshots but are fine in-browser — verify with `eval_js_user_view`, not captures.
- **Full-bleed card photos** (`.proshop-photo`, `.loc-photo`) need `max-width:none` to beat the global `img{max-width:100%}` — otherwise the `calc(100% + padding)` bleed falls short and leaves a gap on the right (pages4.css).
- **Nav lane pin cycle** reworked — see §2 (`lane-engine.js`).
- **Home hero — interactive location map.** Added `HeroMap` (`js/home.jsx`) in the left hero column under the chips: a live, pan/zoom Google Maps **embed iframe** (`output=embed`, no API key) + a footer bar with red pin, address, and a blue **Directions** button. The Directions link is a `maps/dir/?api=1&destination=…` URL — opens turn-by-turn directions and launches the native Maps app for navigation on mobile. Styles: `.hero-map*` in `assets/home.css` (incl. a grid-pattern fallback bg behind the iframe + responsive rules at 980/560px).
- **Eat & Drink — hero flyer slideshow + full gallery.** The old single static `.eathero-flyer` image is now `EatHeroSlideshow` (`js/eat.jsx`): an auto-rotating (3.8s, pauses on hover) **crossfade** of all 14 uploaded menu flyers, with prev/next arrows, 14 dots, per-slide caption + tag. **Crossfade is driven by `requestAnimationFrame`, not a CSS transition** (so it animates in the frozen-transition preview); each layer's `opacity` is set inline from state so exactly one flyer is visible at rest — never an `opacity:0`-blank trap. The bottom `NewItems` section now renders **all 14** flyers statically. Both pull from one shared `MENU_FLYERS` array (single source of truth — reorder/add there to update both). Styles: `.eat-slide*` / `.eat-dot` in `assets/pages2.css`.

---

## 1. What this is

A full modernization of a bowling alley's dated website (originally a DNN/BPAA template at allstarbowlindy.com). The centerpiece is a **time-aware live-status system ("Bowl-o-meter")** that answers *"should I go bowling right now?"* by reading the real clock against the venue's hours + league schedule.

Built as a **single-page React app** (Babel-in-browser, hash routing) with six pages. Fully responsive; patriotic red/white/navy brand pulled from the venue's own logo + flyers.

### User's original brief (confirmed via questions)
- Scope: **full multi-page site** (Home, Bowl, Leagues, Eat & Drink, Parties, Account)
- Device: **both** desktop + a mobile companion view
- Live status wants: open/closed + countdown, lane availability meter, walk-in wait, league-takeover warnings, holiday hours, today's specials
- Color: **keep patriotic** red/white/blue, modernized
- Visual vibe: bold navy→red (option 3)
- Data behavior: **time-aware, reads the real clock** so "open now" is actually correct
- Account: **both** logged-out teaser + logged-in dashboard toggle
- Booking: **full multi-step flow** (date → time → lanes → confirm)
- Variations: one strong direction (NOT a design-canvas comparison)
- Type: sporty & bold condensed
- Imagery: user will provide real venue photos (lanes/lounge/cafe)

---

## 2. File structure

```
All Star Bowl.html        ← main entry; loads everything (open THIS)
HANDOFF.md                ← this file
assets/
  styles.css              ← design tokens, base, reveal system, buttons, lane meter
  components.css          ← nav, footer, live-status widgets, time machine
  home.css                ← home page
  pages.css               ← Bowl page (status panel, hours, rates, booking flow)
  pages2.css              ← Leagues + Eat & Drink + Mobile companion
  pages3.css              ← Parties + Account/Rewards
  logo.png                ← All Star Bowl shield (transparent, 1296²)
  pages4.css              ← Specials + Contact + Legal pages (+ nav 7-item fit, footer legal)
  img/youth-bowling.jpg   ← real venue photo (kids bowling) — Leagues youth section
  img/birthday-flyer.jpg
  img/lanes.png           ← ball rack + lanes (Home hero bg, darkened)
  img/lounge.png          ← The Alley Lounge bar (Eat lounge section)
  img/proshop.png         ← pro-shop ball wall (Bowl pro-shop card)
  img/front-building.png  ← storefront (Home location card)
  img/birthday.png        ← birthday party (Parties hero + Home party promo)
  menu/*.{jpg,png}        ← 16 real menu flyer images (used in Eat page showcase)
js/
  data.js                 ← PLAIN JS (not JSX). window.ASB = business data + live engine
  lane-engine.js          ← PLAIN JS. window.LaneScene = canvas bowling-lane renderer (nav transition)
  components.jsx          ← hooks (useStatus/useReveal/useCountUp), Icon, Logo, Router, Nav (+lane), Footer
  status.jsx              ← BowlGauge, LaneMeter, LiveCountdown, VerdictCard, LiveNotices, TimeMachine
  home.jsx                ← HomePage + sections + getVerdict/buildVerdict
  bowl.jsx                ← BowlPage: live panel, hours, rates, multi-step BookingFlow
  leagues.jsx             ← LeaguesPage: schedule tabs, youth, honor scores, signup
  eat.jsx                 ← EatPage: real HTML menu w/ prices, new-items, lounge
  parties.jsx             ← PartiesPage: package, price estimator, request form
  account.jsx             ← AccountPage: logged-out teaser ↔ signed-in dashboard
  proshop-data.js         ← PLAIN JS. window.PROSHOP catalog (balls/bags/shoes/accessories/services + glossary + TOUR zones)
  proshop.jsx             ← Pro Shop catalog (Mode 1) + shared PDP/ReserveSheet + ReserveStore/ReserveHost (global reserve modal)
  proshop-walkin.jsx      ← Pro Shop Walk-In sim (Mode 2): door→balls→bags/shoes→counter scene tour
  cosmic.jsx              ← CosmicPage (#/cosmic): glow hero, what/when/pricing, gallery, ArcadeHighlight, party CTA
  join.jsx                ← JoinPage (#/join): BAC membership application form → mailto, success state, side rail
  jackpot.jsx             ← StrikeJackpotBoard: branded casino-night board (used in specials.jsx CasinoFeature)
  specials.jsx            ← SpecialsPage: casino feature (Strike Jackpot board), weekly specials, seasonal events, BAC band (from ASB data)
  contact.jsx             ← ContactPage: info card + map embed + 'Send us a message' form
  legal.jsx               ← TermsPage + PrivacyPage (LegalLayout) — footer-linked stubs
  mobile.jsx              ← MobileCompanion: glance screen inside iOS frame
  app.jsx                 ← App root, router wiring, ReactDOM mount
ios-frame.jsx             ← starter component (iPhone bezel)
image-slot.js             ← starter component (drag-drop image placeholder)
uploads/                  ← original source files (audit doc, old site HTML, flyers, logo)
screenshots/              ← my verification captures (can ignore/delete)
```

**Load order in `All Star Bowl.html`** (matters): React/ReactDOM/Babel → `data.js` → `proshop-data.js` → `image-slot.js` → `lane-engine.js` → components.jsx → status.jsx → ios-frame.jsx → mobile.jsx → home.jsx → bowl.jsx → leagues.jsx → `demo-fixtures.js` → scores.jsx → eat.jsx → parties.jsx → account.jsx → proshop.jsx → proshop-walkin.jsx → cosmic.jsx → join.jsx → jackpot.jsx → specials.jsx → contact.jsx → legal.jsx → mascot.jsx → app.jsx. (CSS: styles → components → home → pages → pages2 → pages3 → pages4 → scores → proshop → **cosmic** → mascot.)

**Nav lane transition** (`lane-engine.js`): plain-JS `window.LaneScene` — a canvas 2.5D bowling lane (3° side view) that mounts BEHIND the nav. **Pin cycle (latest):** on each roll the ball clears the rack in a fast energetic **sweep (~0.55s)**, a brief beat, then a **pinsetter descent (~1s)** — a fresh rack lowers straight DOWN from above the bar (`w0≈1.25` start height, `easeInOut` fall, tiny per-pin landing stagger + fade-in), so pins *flow* onto the deck instead of popping up from the floor. These two phase durations are **absolute (not `/sp`)** so they hold their feel at the nav's `speed:1.25`; only the ball roll is speed-scaled. States: `roll → strike(sweep) → settle → set(descent) → idle`. The old `reset` vertical-scale "pop" is gone (`<canvas class="nav-lane">`, `z-index:0`; `.nav-inner` sits above at `z-index:1`). `Nav` creates one in a `useEffect` and calls `laneScene.current.roll()` inside `navTo()`, so every page nav rolls the ball down the bar (tucked behind the buttons) and clears the pins parked at the right edge. Options used: `{tilt:3, compact:true, transparent:true, autoloop:false, ball:'navy', speed:1.25}`. `transparent:true` skips the canvas backdrop so the real nav gradient shows through. Standalone tuning sandbox: `Lane Banner Motion Study.html`. The renderer uses `requestAnimationFrame` (runs in-preview; the CSS-animation freeze quirk doesn't apply) and paints a static first frame synchronously so it's never blank. Debug handle: `window.__navLane`.

**Cross-file sharing:** each `<script type="text/babel">` has its own scope. Components are shared by `Object.assign(window, {...})` at the end of each file. When adding a new component used elsewhere, export it to `window`.

---

## 3. The live-status engine (`js/data.js` → `window.ASB`)

Plain JS, no JSX. Key exports:
- `ASB.getStatus(date)` → master status object: `isOpen, lanesOpen, lanesInUse, level (open/limited/busy/full/closed), levelLabel, wait, minsToClose, nextOpen, leaguesNow, leagueLanes, upcomingLeagues, specials, liveSpecial, holiday, todayHours, pctOpen, total(32)`.
- `ASB.HOURS` (indexed by getDay 0=Sun), `ASB.RATES`, `ASB.BAC_TIERS`, `ASB.LEAGUES`, `ASB.SPECIALS`, `ASB.HOLIDAYS`
- Formatters: `fmtClock`, `fmtClockShort`, `fmtCountdown`, `hoursFor(date)`, `holidayFor`, `leaguesForDay(day)`

**How "live" works:** `baseOccupancy(date)` is a demand curve by hour/day (low midday → evening peak, weekend boost). League windows reserve fixed lanes. Lanes-in-use = clamp of walk-in + league lanes. A gentle per-15-min seeded jitter makes numbers feel alive. Everything is deterministic from the clock — no randomness that breaks reproducibility.

**Clock + time machine:** `ClockStore` (in components.jsx) holds an offset. `useStatus()` ticks every second and recomputes. The **TimeMachine** widget sets the offset so any day/time can be previewed; "Reset to now" zeroes it. Real users see real time by default.

**Verdict** ("should I bowl today?"): `buildVerdict(status)` in home.jsx returns `{tone, emoji, head, sub}` mapping the level to a friendly call. `getVerdict` is the wrapper used by components.

---

## 4. ⚠️ Critical environment quirk (READ THIS before debugging "blank page")

**The preview iframe FREEZES CSS transitions and CSS animations** (their clocks don't advance), but **`requestAnimationFrame` and `setTimeout` DO run**, and **`IntersectionObserver` callbacks do NOT fire**. This caused hours of "blank page below the nav" debugging. Consequences baked into the code:

1. **Reveal-on-scroll** (`useReveal` in components.jsx) does NOT use IntersectionObserver. It checks `getBoundingClientRect` on mount + scroll, with a 1.1s safety-net timeout that reveals everything. It also **re-applies the `in` class after every render** (a no-dep `useEffect`) because React resets `className` on re-render and would strip the imperatively-added class.
2. **Reveal animations are transform-only** (`@keyframes revealUp { from { transform: translateY(28px) } }`) with a **visible base state** — never `opacity:0` at rest. A frozen animation then still shows opaque content (just un-offset). Do NOT reintroduce `opacity:0` reveal states or the page goes blank in captures/verifier.
3. `.field-navy` has a solid `background-color` fallback after the gradient shorthand.
4. The page-wrapper entrance (`.page-anim`) is transform-only for the same reason.

**Screenshot caveat:** the capture engine (html-to-image) mis-positions display-font text (looks like overlapping headlines) and won't render gradient/photo backgrounds on absolutely-positioned divs. **These are capture artifacts, not real bugs** — verified repeatedly via `getBoundingClientRect` showing correct spacing. To inspect lower page sections, I used `document.body.style.transform = 'translateY(-NNNpx)'` in a screenshot step (window.scrollTo is also blocked in the iframe). Trust DOM rect measurements over screenshots.

---

## 5. Design system

- **Colors** (CSS vars in styles.css): `--navy-900 #0a1430`, `--navy-800 #0e1a3a`, `--blue-700 #1b3a8f`, `--blue-600 #1e46a8`, `--red-500 #e0241f`, `--red-600 #c8202a`, `--cream #f5f1e6`, `--paper #f7f4ec`, `--gold #f5b423`. Status: `--open #1f9d55 / --open-bright #28c46a`, `--limited #e8a317`, `--busy #f08522`, `--closed #d23b3b`.
- **Type** (Google Fonts): `--f-display: Anton` (giant condensed headlines, all-caps), `--f-head: Saira Condensed` (section heads/UI/nav/buttons; weights 600/700/800 load), `--f-body: Barlow`. Deliberately avoids Inter/Roboto.
- **Motifs:** halftone dot texture (`.halftone`), stars/stripes (`.stripes-bg`), navy "field" gradient (`.field-navy`), lane-guide arrows in hero.
- **Reusable bits:** `.btn` (+ `-red/-blue/-cream/-ghost`, `-lg/-sm`), `.tag` (+ color variants), `.dot` (pinging status), `.live-pill`, `SectionHead` component, `.reveal` + `.reveal-d1..d4`.

---

## 6. Content sources & data (all REAL, from user's uploads)

- **Hours** ✅ **RESOLVED (this session):** CONFIRMED set (matches the live site) — **Mon 9–10 · Tue 10–10 · Wed 11–11 · Thu 11–10 · Fri 12–11 · Sat 10–12am · Sun 12–9**, now live in `data.js HOURS`. (The earlier `uploads/hours.jpg` posted-sign values — Mon 12–10 etc. — were NOT used; the content brief confirmed the live-site hours instead.)
- **Rates:** $5 adult/game before 5; $4.25 senior/junior; $6.25 after 5; $7.25 Fri/Sat after 5 (≤2 bowlers); lanes $35/$45/$50; shoes $4.
- **BAC loyalty tiers** (real, from `uploads/BAC_Rule20251.jpg`): BAC (new) → Hole Punch (10 games) → Silver (60) → Gold (160) → Diamond (360). Per-game rates by tier for daytime/night/weekend/senior-junior are in `ASB.BAC_TIERS`.
- **Menu** (real prices, legible from flyer images) rebuilt as HTML in `js/eat.jsx` MENU object: create-your-own & specialty & premium pizzas, calzones/breads, entrées, sides.
- **Leagues** (10, from audit doc), **youth divisions** (Wee Strikers 4–7, Amazing All Stars 7–12, Pacers 13–20), **honor scores** (300/800/standings), **Casino Bowling** (Mon & Thu 8pm).
- **Business facts:** 726 N Shortridge Rd, Indianapolis IN 46219 · (317) 352-1848 · league contacts Doug/Faith/Nikki · ComputerScore standings link (centre=112) · **48 lanes (CONFIRMED)** · operator **3DS Entertainment Inc.**
- Full audit/inventory in `uploads/allstarbowl-site-audit-handoff.md` — excellent source of truth.

### Demo/placeholder values (safe to adjust)
- `ASB.HOLIDAYS` (data.js) — demo holiday hours (Jul 4, Thanksgiving, Christmas, NYE).
- League lane-counts, occupancy curve — reasonable estimates. (Total lane count is now **48, CONFIRMED** — no longer an estimate.)
- `MEMBER` object (account.jsx) — fake signed-in member (Marcus Bell, Gold, 164 games) for the dashboard.
- Lounge photo = `<image-slot id="lounge-photo">` drag-drop placeholder for user's real photo.

---

## 7. Page-by-page (routes are hash-based)

- `#/` **Home** — Hero (live board + **interactive location map**, `HeroMap`), QuickStrip, Experiences (4 cards), Casino SpecialsBand, EatTeaser (flyer collage), RewardsTeaser, MobileCompanion (iOS frame), HomeBottom (party promo + location/hours).
- `#/bowl` **Bowl** — full live status panel + TimeMachine; **BookingFlow** (4 steps: day picker → time slots with availability dots → lanes/bowlers steppers + shoes → confirm with live price + name/phone → success); HoursTable (today highlighted) + Pro Shop hours; RatesSection.
- `#/leagues` **Leagues & Youth** — today's leagues card, schedule day-tabs, YouthProgram (real photo + 3 divisions), HonorScores, LeagueSignup form.
- `#/eat` **Eat & Drink** — EatHero (**`EatHeroSlideshow`: rAF crossfade of all 14 flyers**), **MenuSection (real HTML menu w/ prices)**, NewItems (**all 14 flyers, static gallery**), Lounge (image-slot). Flyer list = `MENU_FLYERS` (shared by slideshow + gallery).
- `#/parties` **Parties** — photo hero, package includes, **PartyEstimator** (slider → live total), PartyRequest form (deposit concept).
- `#/account` **Rewards** — top toggle previews **logged-out teaser** (tier ladder, full rate table) vs **signed-in Dashboard** (progress to next tier, savings, BAC card, activity history, perks). The "Join free" / "Start earning — join free" CTAs route to `#/join`; "I'm already a member" toggles the demo dashboard.
- `#/join` **Membership form** (linked from Rewards, not in nav) — `JoinForm` collects name/email/phone (required, validated) + optional DOB/address + league/military checkboxes; submit composes a `mailto:` to `ASB.BIZ.email` and shows a success state. `JoinSideRail` = "Why join" perks + "What happens next" monthly-batch timeline. Solves the real paper-clipboard-entered-monthly pain.

All forms are mock (set a `done` state on submit; no backend). **Exception:** the `#/join` form opens a real pre-filled `mailto:` to the venue.

- `#/specials` **Specials** (top-nav) — SpecialsHero, CasinoFeature (**Strike Jackpot board**, `StrikeJackpotBoard` from `jackpot.jsx`, + 3-step how-it-works), WeeklySpecials (cards from `ASB.SPECIALS`, with live "on now" badge), SeasonalEvents (from `ASB.HOLIDAYS`), BacBand → Rewards.
- `#/contact` **Contact** (top-nav) — info card (address/phone/standings/MiniHours + directions) beside a Google Maps embed; "Send us a message" form (topic select, name/email/phone/message → success).
- `#/terms` / `#/privacy` **Legal** (footer) — `LegalLayout` prose stubs.

**Nav now has 7 items** (added Specials + Contact). `pages4.css` tightens `.nav-link` padding and hides `.nav-phone` ≤1180px so they fit 1000–1240px before the burger menu (≤1000px). Terms/Privacy/Contact also linked in `.footer-legal`. Real venue photos placed (see file tree); the Eat lounge `image-slot` was replaced with a real `<img>`.

---

## 8. Known open items / next steps (discussed with user, not yet done)

1. ✅ **DONE** — Hours confirmed (live-site set; see §6) and **lane count confirmed = 48**.
2. ✅ **DONE** — see #1 (lane count).
3. Wire booking + party deposit to **real payment** (Stripe/Square) — currently mock.
4. **`#/join` membership form delivery** — currently a `mailto:` (needs the visitor's mail client). To make it fully hands-off, swap submit for a form-to-email service (Formspree/FormSubmit) or a backend POST. Real recipient is `allstarbowlindy@gmail.com` (single source: `ASB.BIZ.email` in `data.js`).
5. ✅ **DONE** — Cosmic Bowling page built (`#/cosmic`). ⚠️ Its **glow schedule + pricing are DEMO values** (`ASB.COSMIC` in `data.js`, `demo:true`): Fri 9 PM / Sat 9 PM–midnight, $7.25/game cosmic, $50/hr cosmic lane, glow party from $20. **Confirm the real glow nights & rates.** Arcade game lineup (`ASB.ARCADE`) is grounded in venue photos but verify it's current.
6. Real **venue photography** (lounge image-slot is ready; could add more slots for lanes/cafe).
7. Gift cards, events calendar, Google reviews embed, real social links (all flagged in audit).
8. Further mobile-layout polish if desired (site is responsive; breakpoints at 1000/900/560px).
9. Strike Jackpot pot totals (Red $310 / Blue $6,916) are demo values in `jackpot.jsx` — confirm/replace with real figures, and confirm the mechanic copy matches how they actually run it.

### Content-brief punch list — still MISSING (from `docs/DESIGNCLAUDE-CONTENT-BRIEF.md`)
10. ✅ **DONE (this session)** — Cash Games / **Win Cash** (Kegler's Cash + Casino Bowling, distinct) on Specials.
11. **Cafe menu real prices + The Alley Lounge page** — biggest SEO/a11y win. Verify cents against
    `reference/cafe/flat-crops/` + `infodocs/` menu flyers (image wins over OCR); build out the Lounge
    (sports bar) with real bar/lounge photos + mascot mural. [user picked this as the recommended next item]
12. **Parties full pricing tiers** — Weekday ($10.50/$14), Primetime ($13/$17.75), food add-on ($12/$9 kids),
    50% deposit, NYE Family (~$80/lane) + NYE Adult ($25 cosmic / $30 interactive), Junior Gold ($120 / 8 wk).
13. **Specials extras** — Good Grades / "School's Out" (free game per A/B, through July 2026, joint w/ Beech
    Grove), military discount on BAC, Easter promo, Ladies League social (Mondays).
14. **Phone-case kiosk** capability card ("only at All Star Bowl" DIY 3D-embossing) + **Interactive Bowling**
    section (Multiple Lane Graphics + Matching Audio; exclusive to All Star + Beech Grove; "ask for pricing").

---

## 9. Gotchas for the next session

- **Always open `All Star Bowl.html`.** After editing, `show_html` then check `get_webview_logs`. A transient "LINK failed to load" for a just-written CSS file is a serve hiccup — reload and it loads.
- **Verify via `eval_js` DOM rects**, not screenshots, for spacing/layout. Screenshots lie about display-text positioning and don't render some gradient/photo backgrounds.
- **Don't use `scrollIntoView`** (can break the app) — use `window.scrollTo({top: el.getBoundingClientRect().top + window.scrollY - 80, behavior:'smooth'})`.
- **Don't add `opacity:0` resting states** for animations (frozen-transition quirk → blank). Keep transform-only entrances with visible base.
- **New shared components must `Object.assign(window, {...})`.**
- Keep files < ~1000 lines; split if a page grows.
- Babel-in-browser warning in console is expected/harmless.
- **Slideshow/animation pattern:** for any auto-animating UI in this app, drive it with `requestAnimationFrame` + inline `opacity`/`transform` from React state (see `EatHeroSlideshow`) rather than CSS transitions/keyframes \u2014 CSS-transition clocks are frozen in the preview, rAF is not.
- **Design System** is now linked to the project (`/projects/111d3508-ecd0-40f3-a645-a01144cd6308/`). The existing site uses its own logo-derived brand tokens and the user is happy with it; only pull from the design system if reconciling against it is explicitly requested.
- The booking flow previously crashed because a `Date` was passed where a day-object was expected — now `slotsFor(date)` derives hours via `ASB.hoursFor(date)`. Watch for similar type mismatches if extending.
