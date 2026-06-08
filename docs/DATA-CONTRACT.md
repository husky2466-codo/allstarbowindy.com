# Data Contract — mock → real swap map

> **Audience:** the IDE / backend Claude doing deployment.
> **Purpose:** every place the frontend reads data, what's **real vs. mock vs.
> modelled**, and exactly **where to swap** mock for real. The rule (same as the
> content brief + member scoping): **never fabricate; swap, don't rewrite.** UI
> components read data only from the named globals below — so wiring real data is
> a one-file change, not a component edit.

Load order (in `All Star Bowl.html`): `data.js` → **`data-provider.js`** → component scripts.

---

## 1. The data sources (globals)

| Global | File | Powers | Status | How to make real |
|---|---|---|---|---|
| `window.ASB` | `js/data.js` | Hours, rates, lanes (48), leagues, BAC tiers, specials, holidays, BIZ, LiveScores endpoints, standings | **REAL** facts; **MODELLED** live occupancy (see §3) | Facts are correct. Replace the occupancy model only if a real lane feed exists. |
| `window.ASB_DATA` | `js/data-provider.js` | **Member** (profile + captured games) + **My Bag** + **Strike Jackpot pots** | **MOCK** (the deploy seam) | Override this one file / object. See §2. |
| `window.ASB_BALLS` | `js/ball-catalog.js` | 183-ball spec catalog (member "Browse equipment" + "My Bag" source) | **REAL** spec reference (scraped bowwwl.com, Dec 2025); specs only, no pricing | Static owned dataset. Refresh/extend from bowwwl.com later; pricing never lives here (Pro Shop owns price). |
| `window.PROSHOP` | `js/proshop-data.js` | Pro-shop catalog (balls/bags/shoes/services) | Demo catalog | Replace with the real product dataset (same shape). |
| `window.ASB_FIX` | `js/demo-fixtures.js` | Live Scores board + Lane-38 replay | **REAL** snapshot captured 2026-06-07 (static) | Swap for a backend that polls Computer Score `wrapper.php`/`view-lanes.php` (~5s) — same shape. See `docs/livescores-system-map.md`. |
| `ASB.COSMIC` | `js/data.js` (`demo:true`) | Cosmic glow nights + pricing | **MOCK** (flagged) | Replace nights/prices with the owner's real values; drop `demo:true`. |

Everything else in the JSX (`MENU`, league `contacts` Doug/Faith/Nikki, youth `divisions`, mascot lines, nav, image lists) is **real static content**, not data needing a swap.

---

## 2. `window.ASB_DATA` — the swap seam (`js/data-provider.js`)

This file is 100% mock and exists to be replaced. At deploy, either replace the file or set `window.ASB_DATA` **before** the app boots.

### 2a. `member` (member area · Tier A per `docs/MEMBER-AREA-SCOPING.md`)
```
member: {
  source: "demo",         // set "live" when a real record loads
  name, first, email, id, // (Tier A) profile — from Cloudflare Access in prod
  joined,                 // (Tier A) profile  ("YYYY-MM")
  usbcId,                 // optional; only pre-fills the bowl.com look-up, never stored
  games: [                // (Tier A) FIRST-PARTY captured games — the headline metric source
    { date:"YYYY-MM-DD", score, lane, league, leagueName }
  ],
  tierKey: "GOLD"         // (Tier B) personal BAC tier — needs POS/loyalty; placeholder only
}
```
- **`member === null` OR `member.games === []` ⇒ the UI renders the EMPTY STATE** (`MemberStats` empty
  card in `js/member-area.jsx`) — "No games tracked yet", real Tier-A actions only, **never a fabricated
  number.** The signed-in demo toggle (`Demo data: On / Empty state`) flips `games` to `[]` to preview it.
- All metrics (average, high game, high series, trend) are **DERIVED** from `games` in
  `computeMetrics()` — there are no stored aggregate numbers to fake. Swap `games` for the real D1
  capture feed and every metric recomputes.
- Real build: populate `member` after **Cloudflare Access** authenticates (profile from the JWT email),
  `games` from the **D1** metrics datastore the All Star Bowl phone app writes to.
- **Do NOT ship Tier B as if real.** `tierKey` is shown only in the "Scores & More" tab as a clearly
  **labeled "Phase 2 — pending data"** placeholder, never as the member's asserted status.
- Consumers: `js/member-area.jsx` (`MemberStats` / `MemberArea`) read `getMember()`.

### 2a-bis. `bag` (My Bag · Tier A, genuinely member-owned)
- Accessors on `window.ASB_DATA`: `getBag()` → `[ballId,…]`, `addToBag(id)`, `removeFromBag(id)`, `inBag(id)`.
- Ids reference `window.ASB_BALLS`. **Demo persists in `localStorage['asb_member_bag']`** (seeded once),
  same pattern as the Pro Shop wish list; empty bag → its own honest empty state.
- Real build: store in **Cloudflare D1/KV** keyed to the Access-verified email; keep the same 4-method API.

### 2b. `jackpot` (Strike Jackpot / Kegler's Cash pots)
```
jackpot: { red: 310, blue: 6916, source: "demo" }
```
- Demo figures. Replace with the owner's real pot totals.
- Consumer: `js/jackpot.jsx` seeds the pots from `getJackpot()`.

---

## 3. ⚠️ Live status ("Bowl-o-meter") — real vs. modelled

`ASB.getStatus()` mixes real and synthetic:
- **REAL:** open/closed, today's hours, next-open countdown, holiday overrides, which leagues run when, active specials — all derived from the confirmed hours + schedules.
- **MODELLED (not a live feed):** `lanesInUse`, `lanesOpen`, `wait`, the per-15-min jitter — synthesized from a demand curve in `baseOccupancy()`. There is **no real-time lane API** (Computer Score exposes none — see member research), so this is **Phase 2 / Tier B**.

**At deploy:** keep the real open/closed + hours logic. Only replace the occupancy math if the venue gives a live lane-status source; until then it should be understood as an illustrative model, not live truth. (If that matters for launch, gate the numeric "lanes open now" behind a real feed and keep the open/closed verdict, which is real.)

---

## 4. Deploy checklist (mock → real)

- [ ] **Auth gate:** the demo `AuthStore` (`js/components.jsx`, localStorage flag) + the branded `#/login`
      page (`js/login.jsx`) front sign-in for the mockup. In production put `/members/*` behind **Cloudflare
      Access** (Google / email-OTP, no password); Access supplies the verified email. `AuthStore.isAuthed()`
      ⇒ "Access authenticated" — swap it for the real gate; member DATA layer below is unchanged.
- [ ] Replace `window.ASB_DATA.member` with the post-Access lookup: **profile** from the Access JWT,
      **`games`** from the D1 capture feed (phone-app writes). Verify `games:[]` → empty state (no fake metrics).
- [ ] Back **My Bag** (`getBag`/`addToBag`/`removeFromBag`/`inBag`) with D1/KV keyed to the verified email
      (demo uses `localStorage`). Keep the 4-method API so `js/member-area.jsx` is untouched.
- [ ] Keep Tier B (`tierKey`, any points/visit/avg-trend) labeled "Phase 2" until a real source exists.
- [ ] Replace `window.ASB_DATA.jackpot` with the owner's real pot totals.
- [ ] Confirm `ASB.COSMIC` glow nights + prices with the owner; drop `demo:true`.
- [ ] Swap `window.ASB_FIX` for the live Computer Score poller (same shape) — or keep as the offline demo.
- [ ] Decide whether `ASB.getStatus()` occupancy stays modelled or is wired to a real lane feed.
- [ ] Replace `window.PROSHOP` with the real catalog dataset.
- [ ] Booking + party deposit → real payment (Stripe/Square) — currently mock submits.
- [ ] `#/join` membership form → form-to-email service or backend POST (currently `mailto:` to `allstarbowlindy@gmail.com`).

---

## 5. Invariant for the frontend (DesignClaude)

New UI must read dynamic/member data **only** from the globals above (prefer `ASB_DATA.getMember()` / `getJackpot()`), and must render a sensible **empty state** when a source is null. No mock data inline in JSX. That invariant is what makes this contract hold at deploy.
