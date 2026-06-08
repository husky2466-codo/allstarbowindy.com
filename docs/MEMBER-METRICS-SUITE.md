# Member Metrics Suite — Website + App + Shared Backend

> **The idea:** don't beg closed third parties (Computerscore, USBC) for bowler data — **become the
> system of record.** A companion All Star Bowl phone app lets bowlers capture their own games; the
> website member area surfaces those metrics. One product, two front-ends, one datastore. First-party
> data, honestly shown.
>
> **This is a pitch differentiator:** even Bowlero/AMF don't connect loyalty to personal stats (see
> `docs/MEMBER-AREA-RESEARCH.md`). An independent alley offering "track your game, see it on our
> site" is something the chains don't do.
>
> **Status:** plan. THIS phase = make the website + backend *ready to receive* app data. The phone
> app itself is a later build. No app code now.

---

## The three pieces

```
┌─────────────────┐        ┌──────────────────────────┐        ┌─────────────────┐
│  Phone app      │ writes │  Shared metrics backend  │  reads │  Website member │
│  (later build)  │ ─────► │  Cloudflare D1 + Worker  │ ◄───── │  area (now-ready)│
│  captures games │        │  games keyed by member   │        │  shows metrics  │
└─────────────────┘        └──────────────────────────┘        └─────────────────┘
        ▲                                                                ▲
   manual entry (MVP)                                          Cloudflare Access
   CV tracking (Phase 2,                                       gates /members/*
   revive BowlerTrax-V1)
```

- **Phone app** (later): bowler records games. **MVP = manual score entry** (per-frame or per-game),
  zero setup friction. **Phase 2 = CV shot-tracking**, reviving the retired `BowlerTrax-V1` capture
  engine (it already did "on-device CV shot tracking and real-time metrics").
- **Shared backend** (build the schema now): Cloudflare D1 holds captured games keyed by member
  identity. A Worker exposes read/write endpoints. Free-tier friendly.
- **Website member area** (design now): reads metrics from the backend and renders average trend,
  high game, series, game log. Empty state until the member has tracked games.

## Why this corrects the research's "no stats" verdict

The research was right that you can't *pull* stats from Computerscore/USBC — no API. It was scoped to
*third-party* sources. First-party capture sidesteps that entirely: the bowler gives you the data
directly, so showing it is honest. The do-not-fabricate rule still binds — you only show what was
actually captured; a member with zero games sees an empty state, not a fake average.

## What "website-ready now" concretely means (this phase)

1. **Define the metrics data shape** — a `game` record (date, scores per frame or final, lane,
   league flag) and the derived metrics (running average, high game, high series, game count). This
   shape is the contract the app will write to and the site reads from. Lock it now so both sides agree.
2. **Stub the member data layer** — `window.ASB_MEMBER` returns placeholder/empty metrics today;
   later it reads from the D1-backed Worker. Same shape, swapped source (see
   `docs/ARCHITECTURE-LONGEVITY.md`).
3. **Design the member metrics UI** against that shape, including the **empty state** (the common
   case at launch: "Track a game in the All Star Bowl app to see your stats here").
4. **Do NOT build the app or the live Worker yet** — just the schema, the stub, and the UI that
   renders it.

## Open questions before the app phase

- **Audience reality:** manual entry works for anyone, but who actually bothers? Likely league/serious
  bowlers first. The metrics tab is most valuable for that segment — don't pitch it as universal.
- **CV revival cost:** how much of `BowlerTrax-V1`'s capture engine is salvageable vs. rebuild?
  Assess when the app phase starts (full source is at the `pre-wipe-final` tag).
- **Identity bridge:** the app and the website both key on the same member identity. Cloudflare
  Access gives the website a verified email; the app needs to authenticate to the same identity so a
  game captured in the app shows up for the right member on the site. Resolve before the app build.
- **Owner buy-in:** this is a suite to sell, not just a website. Confirm the owner wants the app
  before investing in the capture engine.
