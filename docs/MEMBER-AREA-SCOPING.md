# Member Area — Scoping & Reality Check

> **Purpose:** define what a logged-in member area for All Star Bowl can *honestly* contain,
> grounded in data that actually exists. This drives (a) DesignClaude's member-page mockups and
> (b) the eventual backend wiring. The governing rule, same as the content brief: **do not
> fabricate member data.** This is a real client's site; inventing a member's average or rewards
> balance is a liability, not a demo flourish.
>
> Source: web research June 2026 (Bowlero/AMF MVB, BowlingRewards, ROLLER, USBC/bowl.com,
> Computerscore LiveScores centre 112). See `docs/MEMBER-AREA-RESEARCH.md` for the cited findings.

---

## The reframe: we become the system of record (first-party metrics)

Original research finding: there is **no public API** from Computerscore/LiveScores, USBC/bowl.com,
or BAC — every third-party member data source is HTML-only or behind their login. So you cannot
*pull* a bowler's average out of those systems.

**The strategic answer is not to pull — it's to capture.** A companion **All Star Bowl phone app**
(planned, app build is a later phase) lets bowlers record their own games. That data is **first-party
and ours**, so the website member area can honestly show metrics — average trend, high game, series
history — because the bowler captured them in our app. This is a real data pipeline we own end to
end, not fabrication. (See `docs/MEMBER-METRICS-SUITE.md` for the suite plan.)

**MVP capture = manual score entry** (per-frame or per-game) — zero setup friction, works for
anyone, yields real trend metrics. **CV shot-tracking** (reviving the retired BowlerTrax-V1 capture
engine) is the Phase 2 premium layer, not a v1 dependency.

### What is still genuinely off-limits (do not fabricate)

The line moves but doesn't disappear. You may **never** show data the bowler hasn't actually
captured, and you may never pull from third-party systems we have no API for:

- ❌ A metric for a member with **zero tracked games** — show an empty state ("track a game in the
  app to see your stats"), never a fake number
- ❌ "Your USBC/league average is 172" pulled from Computerscore/USBC — no API; only show what the
  bowler captured in *our* app
- ❌ "Your team is in 3rd place" attributed to the logged-in user — standings are public but not
  user-attributable without an integration we don't have
- ❌ "You have 240 reward points / you're Gold tier" — BAC uses discount tiers, not points; we have
  no member records unless the business provides them
- ❌ "Book a lane from your account" — no confirmed reservation-system integration
- ❌ "You earned a free game on your birthday" — BAC terms don't mention this; don't invent it

Any mockup element not yet backed by captured data or an owned source must be visibly labeled
**placeholder / Phase 2 — pending data**.

---

## What IS real and ours to build (Tier A — build these)

| Feature | Data source | How |
|---|---|---|
| **My game metrics** (average trend, high game, series, game log) | First-party: games the bowler captured in the All Star Bowl app | Read from our metrics datastore (Cloudflare D1) keyed to the member's identity. Empty state until they've tracked a game. The headline feature — see `docs/MEMBER-METRICS-SUITE.md`. |
| **Browse equipment catalog** | Our 195-ball dataset (`reference/bowling-catalog/`) | Fully self-contained, no external dependency. Filter by brand/coverstock/core. |
| **My saved balls / my bag** | Our dataset + member profile | Member tags balls they own; stored in our own datastore keyed to their identity. Genuine member-owned data we control. |
| **Live league scores (link/iframe)** | Computerscore LiveScores, centre 112 | Deep-link or iframe the existing public page. Real, live, already running. |
| **League standings (link)** | Same | Public HTML page — link out, don't pull. |
| **"Find my USBC average" (link-out)** | USBC bowl.com member lookup | Link to bowl.com with the bowler's name pre-filled; they see their own data there. We never store it. |
| **BAC tier explainer (static)** | BAC program copy (content brief §4) | Show what each tier unlocks generally. Static education, not a personal status. |

**The honest member value proposition:** log in → see the metrics from games you tracked in the
All Star Bowl app → browse and save equipment from a real catalog → jump to your live league scores.
Every piece is real first-party or owned data. The metrics tab is the reason to open the app at the
alley; a new member with no tracked games sees an empty state, never a fabricated number.

---

## What needs the business to open their data (Tier B — Phase 2, do not fake)

These are real features *if* the owner provides the data, and should be pitched as "Phase 2,
pending your systems":

- Personal BAC tier/visit status — needs their POS/loyalty records
- Points or visit balance — needs a loyalty backend they don't appear to have
- Visit / reservation history — needs their reservation vendor's data
- Real-time lane availability — Computerscore exposes no live status API
- Birthday/promo triggers — needs DOB in profile + email automation
- Charted average trend — needs season-long game data Computerscore doesn't expose via API

Frame these to the client as the upsell: "here's the live demo of what's real today; here's what
we light up once we connect to your systems."

---

## Auth + storage model (the layered design)

Decided: **Cloudflare Access (Zero Trust)** in front, with our own small datastore behind it.
These are two layers, not an either/or — Access is a lock, not an account system.

- **Cloudflare Access** = the gate on `/members/*`. Identity via Google / email-OTP. Free up to
  50 users. Near-zero code, real hardening. It verifies *who you are* and passes a signed JWT
  (with the verified email) to the app. It does **not** store profiles or saved data.
- **Datastore behind it (Cloudflare D1 or KV)** = where the only genuinely member-owned data
  lives: **saved balls / my bag**, keyed by the email Access verifies. Small, free-tier-friendly.

This is the minimum that supports the real Tier-A features. We are NOT building a custom
signup/login form or password store — Access handles identity.

> **Open question for the owner before any of this ships:** who are the "members"? Cloudflare
> Access's free tier and gate-style model fit a *known, small* set (the owner, league officers, a
> pilot group). If the vision is "any customer self-registers," that's a different, larger build
> and Access alone won't do it. Confirm scale before building the gate.

---

## Instruction to DesignClaude for member-page mockups

1. Build the member area around the **Tier A** features only. They're all real.
2. Any Tier B element shown for visual completeness must be **labeled placeholder / Phase 2**.
3. Read all member data from the **swappable data layer** (`window.ASB_DATA` / a stub module) —
   **do not hardcode** member names, averages, or saved items into JSX. When the backend lands,
   wiring it must be a one-file data-source swap, not a component rewrite. (See the data-layer note
   in the architecture doc.)
4. Assume the page renders *after* Cloudflare Access has authenticated — the member's verified
   email is available; there is no in-app login/password form to design.
