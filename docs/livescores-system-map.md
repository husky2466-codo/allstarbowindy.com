# LiveScores / Computer Score — Authenticated System Map (for DesignClaude)

**Captured:** 2026-06-07 via authenticated Playwright session (logged in as a real member account).
**Venue:** All Star Bowl, `centre=112`.
**This supersedes the guesses in `feature-livescores-integration.md` §3–§7 — it's the real, verified structure.**

Screenshots live in `public/screenshots/livescores-01..04*.png`. Raw network capture: `public/screenshots/network-scoresheet.txt`.

---

## TL;DR — the integration question is ANSWERED

- The live scoreboard is driven by a single endpoint, **`wrapper.php`**, polled by the page **every 5 seconds** (`setInterval("refresh()",5000)` → `XMLHttpRequest GET wrapper.php?...`).
- `wrapper.php` returns **clean, highly-structured HTML** (not JSON, but semantic divs with stable classes/IDs) — trivially parseable, down to **per-pin** detail.
- The **all-lanes overview** (`view-lanes.php`) and **league standings** (`standings.php`) are **public, no auth**. The per-game grid (`view.php`) and per-member history (`user-lanes.php`) work with a `livecode`/session.
- **Net:** we can replicate the entire live experience natively by polling these endpoints on a timer and re-rendering in the All Star Bowl brand. No vendor API needed; no member-credential brokering needed for the public views.

---

## Page map (sitemap of the system)

| Page | URL pattern | Auth? | What it is | Screenshot |
|------|-------------|-------|------------|-----------|
| **Login** | `index.php?centre=112` | public | Venue "Live Access Code" field + "Member login" link + links to public views | (bundle) |
| **All-lanes overview** | `view-lanes.php?centre=112` | **public** | Live list of EVERY active lane with current bowler names + `seriesID` per lane. Updates as people bowl. | `livescores-04-view-lanes.png` |
| **Member home** | `user-lanes.php` | member login | The logged-in bowler's own game history (date, lane, View Scores link per series) | `livescores-01-member-lanes.png` |
| **Score grid (per game)** | `view.php?centre=112&seriesID=<S>&livecode=<C>` | livecode | The frame-by-frame scoresheet for a lane/series. Game N-of-M pagination. Live-refreshes. | `livescores-02-scoresheet.png` |
| **Per-game nav** | `view.php?...&game=<N>` | livecode | Jump to a specific game in the series | — |
| **Stats** | `stats.php?centre=112&seriesID=<S>` | livecode | Rich per-series analytics: per-game scores, strikes/spares, splits, opens, strike/spare conversion, series totals, net total | `livescores-03-stats.png` |
| **League standings** | `standings.php?centre=112` | **public** | League schedule + standings grid (the table from the original screenshots) | (bundle) |
| **Live data source** | `wrapper.php?centre=112&seriesID=<S>&livecode=<C>` | livecode | **The AJAX endpoint** the grid polls every 5s. Returns the players/frames HTML fragment. THIS is the live feed. | `network-scoresheet.txt` |
| **Change venue** | `centres.php` | public | Switch which centre you're viewing | — |
| **Member login** | `userlogin.php` | — | Per-bowler login (out of scope for our site — don't broker creds) | — |

**ID scheme:** `centre` = venue (112 = All Star Bowl, fixed). `seriesID` = one bowling session on one lane (e.g. 1329045). `livecode` = a per-series access token (e.g. 880073) that accompanies the seriesID for the grid/wrapper. `game=N` selects the game within the series.

---

## The live mechanism (verified)

On `view.php`, the page runs:
```js
setInterval("refresh()", 5000);   // every 5 seconds
function refresh() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'wrapper.php?centre=112&seriesID=1329045&livecode=880073', true);
  // ... swaps returned HTML into #players-wrap
}
```
Response headers on `wrapper.php`: `Cache-Control: no-store, no-cache` (always fresh), `Content-Type: text/html`, `X-Powered-By: PHP/8.1.34`. So "live" = 5-second HTML polling. **To replicate: our backend (AWS Lambda/EventBridge) polls the same endpoint on a timer, parses, caches, and our front-end renders it — identical pattern, our brand.**

---

## Data structures we can parse (this is what makes native re-render easy)

### `wrapper.php` scoresheet fragment — per player:
```html
<div id="player1" class="player">
  <h2>Frank</h2>
  <div class="frame filled">
    <div class="bowl-first">8</div>
    <div class="bowl-second">-</div>            <!-- "-" = miss -->
    <div class="bowl-arrow"><div class="bowl-total">8</div></div>
  </div>
  <!-- spare: <div class="bowl-second"><span class="spare">/</span></div> -->
  <!-- strike: <div class="bowl-second">X</div> -->
  ...10 frames (last is class="frame final" with bowl-third)...
  <div class="player-total"><div class="player-total-btm">32</div></div>
  <!-- plus per-pin: table.pindicationtable with f1pin1per..f1pin10per, classes dot1/dot2/dot3
       = which pins stood/fell. Granular enough to draw a pin diagram. -->
</div>
```
Parse target → per player: `{ name, frames: [{ first, second, third?, runningTotal, pins[] }], total }`.

### `stats.php` table (per series) — columns:
`Player | Game1..Game5 (score + superscript "4X 4/" = strikes/spares) | Series total | Splits | Open | X on X (strike conversion)` + a `Net Total` row.
Example row: `Frank 170(4X 4/) 171(3X 6/) 146(3X 3/) 132(3X 3/) 32 → Series 651, Splits 0/4, Open 17/44, X-on-X 0/12`. Net total 1906.
Parse target → per player series stats; clean HTML `<table>`.

### `view-lanes.php` (all lanes) — table rows:
`Lane <n> | <comma-separated bowler names> | View Lane(→ view.php?seriesID=<S>)`. ~40 lanes, live. Parse target → `[{ lane, bowlers[], seriesID }]`.

---

## KEY FEATURES WE'D MISSED (you asked — here they are)

Earlier planning only knew about the public standings grid + a generic "live scores" link. The authenticated walk surfaced **four feature surfaces worth designing for**:

1. **Per-lane live scoresheet** (`view.php`) — frame-by-frame, strikes/spares/splits rendered, **per-pin pindication diagrams**, multi-game pagination. This is the marquee "live" experience.
2. **Stats / analytics page** (`stats.php`) — series stats: strike & spare conversion %, splits, opens, per-game breakdown, net totals. A genuinely rich feature; great for league bowlers.
3. **All-lanes "what's happening now" board** (`view-lanes.php`, public) — every active lane + who's on it, live. Strong "the place is alive right now" marketing surface for the homepage.
4. **Member game history** (`user-lanes.php`) — a logged-in bowler's past series. (Lower priority / member-gated; note for a possible "bowler accounts" phase, but don't broker CS credentials on the marketing site.)

---

## What this means for the build (updates the recommendation)

- **Route confirmed:** server-side poll of `wrapper.php` / `view-lanes.php` / `standings.php` → parse structured HTML → cache (DynamoDB) → serve to our branded front-end. The 5s cadence is the system's own; we can match or relax it.
- **Effort: lower than feared.** The HTML is semantic and stable — parsing is a contained job, not a fragile scrape of a blob.
- **Still grey-zone on ToS:** these are public/livecode pages, not an official API. Owner (paying CS customer) should green-light re-display. Member-login flows stay out of scope.
- **Open: does `livecode` expire?** For live lanes, `view-lanes.php` hands out fresh `seriesID`s with no `livecode` in the link (grid loads anyway while live) — confirm whether historical series need a stored `livecode`. Affects the "season archive" feature.

---

## Files captured this session
- `public/screenshots/livescores-01-member-lanes.png` — member home / history
- `public/screenshots/livescores-02-scoresheet.png` — live frame-by-frame grid
- `public/screenshots/livescores-03-stats.png` — series stats/analytics
- `public/screenshots/livescores-04-view-lanes.png` — all-lanes live board (~40 lanes active)
- `public/screenshots/network-scoresheet.txt` — network request log for the grid page
- `public/screenshots/wrapper-sample-status.txt` — wrapper.php fetch sanity check
