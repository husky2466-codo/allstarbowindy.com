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
| `window.ASB_DATA` | `js/data-provider.js` | **Member** + **Strike Jackpot pots** | **MOCK** (the deploy seam) | Override this one file / object. See §2. |
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
  source: "demo",        // set "live" when a real record loads
  name, first, id,       // (Tier A) profile
  joined,                // (Tier A) profile
  games,                 // (Tier A) ONLY real if captured in the ASB app
  history: [{date,desc,games}],  // (Tier A) ONLY real if app-captured
  tierKey: "GOLD"        // (Tier B) personal BAC tier — needs POS/loyalty; placeholder
}
```
- **`member === null` ⇒ the UI renders the EMPTY STATE** (`DashboardEmpty` in `account.jsx`) — "no games tracked yet", real Tier-A actions only, **never a fabricated number.** This is the required no-data behavior.
- Real build: populate `member` after **Cloudflare Access** authenticates, from a **D1/KV** lookup keyed to the verified email.
- **Do NOT ship Tier B as if real.** `tierKey` (and any points/visit/avg-trend) must be backed by the venue's systems or left out / labeled "Phase 2". The logged-out teaser (tier ladder, rate table) is generic education and stays.
- Consumer: `js/account.jsx` `Dashboard` reads `getMember()`; renders `DashboardEmpty` if null.

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

- [ ] Replace `window.ASB_DATA.member` with the post-Access D1 lookup; verify `null` → empty state renders (no fake stats).
- [ ] Reframe/limit Tier B (`tierKey`, any points/visit/avg-trend) — real source or labeled Phase 2.
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
