# Feature Brief: LiveScores / Computer Score Integration

**Status:** Planned (future) — planning doc only, not for build now
**Project:** allstarbowlindy.com redesign
**Author:** drafted 2026-06-07
**Source material:** `docs/live-site-reference/livescores/` + three desktop screenshots (2026-06-07)

---

## 1. What the system is

All Star Bowl runs its on-site league scorekeeping on a **separate third-party
platform** called **Computer Score / Computer Scoring Systems** (the vendor),
which exposes a public web product branded **LiveScores** at
`livescores.computerscore.com`. This is the live scoreboard / league-standings
system the lanes feed into — it is **not** part of the bowling alley's own
website and we do not control it.

Each venue ("centre") is keyed by a numeric ID. **All Star Bowl is `centre=112`.**
Every URL in the system carries that ID as a query param.

There are two distinct surfaces:

- **Public view** (no login): the league schedule/standings grid and the live
  lane scoreboard. Reachable directly via URL with `?centre=112`. This is what
  the screenshots show and what we'd integrate first.
- **Member / bowler login** (gated): a credentialed area for league members,
  styled by `login-bowler.css` (authored by "Pixel House", the vendor's design
  shop). There's also a venue-level **"Live Access Code"** password field on the
  landing page. The login portion is almost certainly out of scope for a public
  marketing site — see open questions.

The system is dated: XHTML 1.0 Transitional doctype, IE9 conditional comments,
table-based layout, jQuery. Visually it does not match a modern brand.

---

## 2. What each screenshot shows

**Screenshot 1 (`1.14.54 PM`) — league schedule grid, top half.**
The LiveScores standings/schedule view for All Star Bowl. Dark blue page, "« LiveScores"
back-link top-left, "All Star Bowl" heading, "COMPUTER SCORE / COMPUTER SCORING
SYSTEMS" banner top-right. Content is a stack of day-grouped tables. Visible:
**MONDAY** (Ladies Trio, Eddie Brashear Mixed League, Ken Hendricks Monday
Morning Mixed), **TUESDAY** (Meridian Lodge Summer Mixed, Chatterbox Jazz, J E
Young Men, Tuesday Night Doubles, Ted Gaizat Goldenager Men, Summer Senior
Mixed, Goldenagers Ladies), and the start of **WEDNESDAY**. Each row has columns:
league name, **Time**, **Type** (e.g. "Mixed Night League"), **Bowlers per
Team**, **Teams**. League names are hyperlinks to that league's standings page.

**Screenshot 2 (`1.15.00 PM`) — same grid, scrolled down.**
Continuation of the same schedule grid. Shows the tail of WEDNESDAY (Youth Adult
Summer, CHRR Wednesday Night Mens, For Splits & Giggles, Senior League of
Masters, Benny's Golden Playmates), **THURSDAY** (Thursday Mixed Trios, IBLB,
Thursday Night Mixed, Zion Hope Doubles, Senior High Rollers Mixed), **FRIDAY**
(Friday Night Mixed, Indy Parks), **SATURDAY** (J.E.M.I., TNBA Indy Senate
Juniors/Bantam, Pin Pals, Pacers, Wee Strikes, Youth Sport Singles, Special
Rollers), and **SUNDAY** (Brothers & Sister). Same five-column layout.

**Screenshot 3 (`1.15.30 PM`) — the LiveScores landing / login page.**
The entry page for centre 112. Black top bar with the red "LIVE SCORES"
wordmark and the Computer Score banner. Center shows the **All Star Bowl crest**
and name with a "Change?" venue switcher. Below: a **"Live Access Code:"** text
field with a red **LOGIN** button, two prominent buttons — **"View Live Scores"**
and **"League Standings"** — and an **"Are You A Member? Member Login"** link.
This is the hub that branches to the public scoreboard, the public standings
grid, and the gated member area.

---

## 3. Current integration on the live (old DNN) site

The saved bundle is a capture of the **vendor's** pages, not the DNN site's own
markup, so we can't see the exact DNN link element from these files alone.
However, the structure makes the integration model clear and the relationship
runs the other way too:

- The vendor landing page links **out to the bowling alley's site**:
  `centre-thumb` crest links to `https://allstarbowl1.com/` (target=_blank).
- All navigation stays on `livescores.computerscore.com`. There is **no API,
  no JSON, no iframe-friendly embed endpoint** in the markup — it's a set of
  full HTML pages.

**Conclusion:** today's integration is almost certainly a plain **outbound link**
from the DNN site to `https://livescores.computerscore.com/index.php?centre=112`
(the landing page). It is not an embed and not a data feed. (Worth a 2-minute
confirm against the actual DNN page when convenient, but everything here points
to a simple hyperlink.)

---

## 4. Real URLs / endpoints found in the bundle

All carry `centre=112` for All Star Bowl. Base domain: `livescores.computerscore.com`.

| Purpose | URL |
|---|---|
| Venue landing / login | `https://livescores.computerscore.com/index.php?centre=112` |
| View live lane scores | `https://livescores.computerscore.com/view-lanes.php?centre=112` |
| League standings / schedule grid | `https://livescores.computerscore.com/standings.php?centre=112` |
| Single league's standings | `https://livescores.computerscore.com/standings.php?centre=112&results=<code>/standing.htm` |
| Change venue | `https://livescores.computerscore.com/centres.php` |
| Member login | `https://livescores.computerscore.com/userlogin.php` |
| Vendor corporate site | `https://www.computerscore.com.au/` (note: `.com.au` — Australian vendor) |

**Login form** (`index.php?centre=112`): `<form method="POST"
action="https://livescores.computerscore.com/index.php?centre=112">` with a
single `pass` (password) field — the venue "Live Access Code". No public
credentials are stored in the bundle.

**Per-league result codes** seen in `standings.php` links (the `results=`
param): numeric (`016`, `110`, `112`, `117`, `220`...) and short alpha codes
(`mls`, `ssl`, `yas`, `slm`, `tmt`, `tsm`, `ind`, etc.), each pointing to a
static `…/standing.htm` file. This tells us standings are published as
**pre-rendered static HTML per league** — convenient for scraping.

> Note on filenames: the saved file `computer-score.html` is actually the
> **`standings.php?centre=112`** page (the schedule grid), and
> `all-star-bowl-livescores-login.html` is **`index.php?centre=112`** (the
> landing/login page). The `meta name="robots" content="noindex"` on the
> standings page is relevant to the scraping/ToS question below.

---

## 5. Integration options (tiered)

### MVP — Link / embed the existing public view (lowest effort, no data work)
Add a **"Leagues & Live Scores"** page to the new site that surfaces the
existing Computer Score public surface. Two sub-options:

- **5a. Deep links (recommended MVP).** Branded buttons on our page that open the
  vendor pages in a new tab: "View Live Scores" → `view-lanes.php?centre=112`,
  "League Standings & Schedule" → `standings.php?centre=112`. Zero data
  modeling, zero maintenance, no ToS exposure. The visual mismatch is the only
  downside, and it's contained to a separate tab.
- **5b. iframe embed.** Embed `standings.php?centre=112` in an iframe. Cheap but
  fragile — the vendor page is not responsive in a modern sense, carries its own
  dark theme, and may set `X-Frame-Options`/CSP that blocks framing. **Verify
  framing is even allowed before committing** (likely needs a quick header
  check). Lower confidence than 5a.

**Recommendation: start with 5a.** It ships immediately, can't break, and gives
us a real page to iterate on.

### Phase 2 — Re-render the schedule grid natively
The schedule grid is a trivial weekly dataset (see §6). Scrape/parse
`standings.php?centre=112` once (or on a cron), cache it, and **render it in our
own brand/components**. The HTML is clean table markup grouped by day, so a
one-time parser is straightforward. This gives a fully on-brand "Leagues"
page while live scores still deep-link out (5a) until Phase 3.

Considerations:
- Refresh cadence can be slow — league rosters/schedules change seasonally, not
  live. A daily or weekly cache refresh is plenty for the *schedule* grid.
- Respect the `noindex` signal and check ToS before scraping (see §7).
- Build a fallback: if the parse fails, fall back to the MVP deep link so the
  page never shows stale/empty data silently.

### Phase 3 (Full) — Live lane scores & standings, native
Pull **live** lane scores (`view-lanes.php`) and per-league standings
(`…/standing.htm`) and render them natively, ideally near-real-time during
league nights. This is the big lift and the **most uncertain**:
- Requires either a vendor API/feed (unknown if one exists) or scraping the
  live `view-lanes.php` page on a short interval.
- Live data likely sits behind the **"Live Access Code"** / member login, which
  raises auth, ToS, and rate-limit questions.
- **Flag as needing vendor research.** Do not scope Phase 3 until we know
  whether Computer Score offers an official data feed.

---

## 6. Data model sketch (for Phase 2 native re-render)

The schedule grid maps cleanly to one flat table. Each row in the vendor's
day-grouped tables becomes one record:

```json
{
  "leagues": [
    {
      "day": "MONDAY",
      "league_name": "Eddie Brashear Mixed League",
      "time": "6:00p",
      "type": "Mixed Night League",
      "bowlers_per_team": 5,
      "teams": 28,
      "standings_url": "https://livescores.computerscore.com/standings.php?centre=112&results=110/standing.htm",
      "result_code": "110"
    }
  ],
  "centre_id": 112,
  "source": "livescores.computerscore.com/standings.php?centre=112",
  "fetched_at": "2026-06-07T00:00:00Z"
}
```

Field notes:
- `day` — enum MONDAY…SUNDAY (table groups in source order).
- `time` — string as published (`"7:00p"`, `"09:30"`, `"12:00"`); mixed
  12h/24h-ish formatting in the source — normalize on display, don't assume.
- `type` — free text in source (`"Mixed Night League"`, `"Female Day League"`,
  `"Mixed Junior League"`). Could be split into `gender` + `time_of_day` +
  `age_group` if we want filters, but store the raw string too.
- `bowlers_per_team`, `teams` — integers.
- `result_code` / `standings_url` — needed only if Phase 2 also links each
  league to its detail page. Codes are mixed numeric/alpha and not predictable —
  must be parsed from the source, never constructed.

---

## 7. Open questions / unknowns

1. **(BIGGEST)** Does Computer Score / `computerscore.com` publish an **API or
   data feed** for schedules, standings, and live lane scores? Everything we
   need for Phases 2–3 hinges on this. If yes, scraping is moot. If no, we're
   committed to parsing HTML and must clear ToS. **Answer this first** — it
   determines whether Phase 3 is even feasible and changes the Phase 2 approach.
2. **ToS / robots for scraping.** The standings page is marked
   `noindex`. Need the vendor's terms before we cache/re-render their data, and
   the alley owner should confirm they're comfortable (they're the vendor's
   customer and can simply ask).
3. **Auth for live data.** Is `view-lanes.php` public, or gated behind the
   "Live Access Code" / member login? Determines whether Phase 3 needs
   credentials at all.
4. **Is the bowler/member login in scope?** Recommendation: **no** — leave member
   login as a deep link to `userlogin.php`. A public marketing site shouldn't
   broker third-party member credentials.
5. **Refresh cadence.** Schedule = seasonal (daily/weekly cache fine). Live
   scores = minutes during league nights. Confirm expectations with the owner.
6. **Centre ID stability.** Confirm `centre=112` is permanent for All Star Bowl
   (it appears to be the venue's fixed key).
7. **Vendor relationship.** The alley is a paying Computer Score customer — the
   fastest path to answering 1–3 may simply be the owner emailing the vendor.
   Cheaper than reverse-engineering.

---

## 7a. Access asset on hand (noted 2026-06-07)

We have a **working Computer Score / LiveScores login** (set up previously, tied to
games played ~Feb 2025). This is an *access asset for the build phase*, not a
route-changer — the recommended integration is still the no-auth public pages.
What it confirms / enables:

- **Historical data is retained.** Feb-2025 games still visible ~16 months later —
  supports a future "season archive / past results" feature.
- **An authenticated member view exists** alongside the public standings page, and
  the owner has reported it appears to **live-feed** (updates without manual refresh).
- **Use it WHEN WE BUILD, not now:** log in with DevTools → Network open to check
  whether the authenticated view calls **clean JSON endpoints**. If it does, that
  upgrades us from "scrape public HTML" (current plan) to "consume a structured
  feed" — more reliable, less maintenance. This is the single most valuable thing
  to verify at build time and partially answers open questions #1 and #3.
- **Do NOT** wire the member login into the marketing site or broker these
  credentials in the product (see #4). The login stays a personal diagnostic tool.

---

## 8. Recommendation summary

Ship **MVP 5a (branded deep-link page)** now-ish — it's free, unbreakable, and
gives users the live scores/standings they want immediately. In parallel, have
the owner ask Computer Score whether an API/feed exists (open question #1).
The answer routes everything else: API → skip scraping and go native; no API →
Phase 2 scrape-and-cache of the schedule grid (low risk, slow-changing data),
and treat live native scores (Phase 3) as a separate, vendor-dependent effort.
