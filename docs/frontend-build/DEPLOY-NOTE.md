# DEPLOY NOTE — for Deploy Claude (refreshed export)

This is a **full, current snapshot** of the All Star Bowl frontend build. It supersedes the previous
export. Same drop-in model as before: it's a static React-via-CDN app, **no build step** — the
authoritative load order lives in **`All Star Bowl.html`** (mirror its `<link>` / `<script>` order
exactly when wiring `public/`). Read `README.md` → `HANDOFF.md` → `docs/DATA-CONTRACT.md` first.

## What changed since the last export (wire these)

**New member area + auth + content. New files (already referenced in `All Star Bowl.html` — keep its order):**

- **`js/ball-catalog.js`** — plain JS, `window.ASB_BALLS` (183-ball spec catalog). Load with the data
  scripts, **after `js/proshop-data.js`**.
- **`js/member-area.jsx`** — Babel; the signed-in Tier-A member area (`MemberArea`). Load **before
  `js/account.jsx`**.
- **`js/login.jsx`** — Babel; the `#/login` page + the bowling-ball wipe (`BallWipe` / `WipeStore`).
  Load **after `js/legal.jsx`, before `js/app.jsx`** (and `app.jsx` now mounts `<BallWipe/>`).
- **`assets/member.css`** — load **after `assets/pages3.css`**.
- **`assets/login.css`** — load **after `assets/member.css`**.
- **New images:** `assets/img/wipe-confetti.png`, `assets/img/login-graffiti-bg.png` (bespoke generated
  graffiti textures; both are **swap slots** — see `Hero Image Prompts.md` §5 if a hand-painted upgrade is dropped in).

**Routing:** new hash route **`#/login`** (in `js/app.jsx`). `#/account` now shows the Tier-A member area
when signed in, else the Rewards teaser.

**Auth (IMPORTANT for deploy):** `AuthStore` (in `js/components.jsx`) is a **demo localStorage flag only**
(`asb_auth`). In production, gate `/members/*` behind **Cloudflare Access** (Google / email one-time code,
no password) and treat `AuthStore.isAuthed()` as "Access authenticated." The branded `#/login` page fronts
that flow for the mockup. **No member data is hardcoded** — it all flows through `window.ASB_DATA`
(`js/data-provider.js`) and `window.ASB_BALLS`. See `docs/DATA-CONTRACT.md` §2a / §4 for the full mock→real
swap map and deploy checklist (member profile+games → Cloudflare D1, "My Bag" → D1/KV, etc.).

**Content:** Parties page (`js/parties.jsx`) now has the full real **group pricing tiers + seasonal events**
(Weekday/Primetime/food add-on, NYE Family/Adult, Junior Gold). Static content, nothing to wire.

## Still mock / unchanged caveats (same as before)
- Live-status occupancy is MODELLED (open/closed + hours are real). `ASB.COSMIC` glow nights/prices are demo.
- Strike Jackpot pots, `ASB_FIX` Live Scores snapshot = demo/static (swap per DATA-CONTRACT §4).
- Forms are mock submits (`#/join` mailto; booking/party deposits not wired to payment).

Nothing else moved. Repo mapping (`*.css→public/css`, `*.jsx+*.js→public/js`, images→`public/img`,
`All Star Bowl.html→public/index.html`) is unchanged from the repo README.
