# Architecture & Longevity Plan

> **Purpose:** how this site stays alive cheaply and gets a real (gated) member area — without a
> custom domain for now. Free-tier Cloudflare. Written so DesignClaude's mockups don't bake in
> assumptions that fight the eventual backend.
>
> **Status:** plan, not yet built. Today the site runs as a static React-via-CDN app served by a
> local launchd httpd on port 8090, exposed through a Cloudflare tunnel at
> `allstarbowlindy.myroproductions.com`. That stays as-is until we choose to migrate.

---

## Guiding decisions (already made)

- **No custom domain yet.** Stay on a `*.myroproductions.com` subdomain. If the client takes the
  site, we move it onto their domain then — nothing here should hardcode a domain.
- **Cloudflare free tier** for hosting, routing, TLS, and auth gating.
- **Cloudflare Access (Zero Trust)** gates the member area. Not an account system — a lock. See
  `docs/MEMBER-AREA-SCOPING.md`.
- **No database for the public site.** All public content is static (or a shipped JSON file like
  the ball catalog). The only server-side state is the member "saved balls" data, behind Access.

---

## Two viable hosting shapes (pick when we migrate; not urgent)

**Today (works, keep until ready):** local httpd + cloudflared tunnel. Pro: zero migration. Con:
depends on this Mac being up; the member area can't be gated cleanly through a raw tunnel.

**Target: Cloudflare Pages + Access.** Push `public/` to Cloudflare Pages (free, global CDN, no
local machine dependency). Put `/members/*` behind a Cloudflare Access policy. Add one Worker +
D1/KV only when "saved balls" is actually built. This is the longevity answer — the site survives
this Mac being off, and Access gives real auth with near-zero code.

> Recommendation: migrate to Pages when DC's build is far enough to be worth hosting properly.
> No reason to do it the moment the member area is designed — but before any real member uses it.

---

## The auth + data layers (target state)

```
visitor ──► Cloudflare Pages (static site, public pages)        ← free, no auth
member  ──► /members/* ──► Cloudflare Access (Google/email-OTP)  ← free ≤50 users, the lock
                              │ passes signed JWT (verified email)
                              ▼
                          Worker + D1 ── shared metrics backend: captured games +
                                         saved balls, keyed by email. The phone app
                                         WRITES here; the website member area READS here.
```

- Access verifies identity and injects the email; the app trusts that, no login form.
- The datastore is the **shared backend for the suite** — the future phone app writes captured
  games to it, the website reads them (see `docs/MEMBER-METRICS-SUITE.md`). It also holds saved
  balls. Everything else the member sees is owned catalog data or a link-out to LiveScores/USBC.
  See the Tier A/B split in the scoping doc.

---

## The mockup → backend swap (READ THIS — it's the part that matters for DC)

The whole point: when we wire real backend services later, doing so must **overwrite mockup data
without rewriting components.** That only works if every page reads from a single swappable data
layer instead of hardcoding values.

**We already have the seam:** `public/js/data.js` exposes `window.ASB_DATA`. Public content reads
from it today. The member area should follow the same discipline.

**Rules for DesignClaude:**

1. **Never hardcode data into JSX.** Not business facts, not member names, not averages, not saved
   items. Components render whatever the data layer gives them.
2. **Member data reads from a stub member module** (e.g. `window.ASB_MEMBER`) that returns
   placeholder values *today* and will be swapped to read from the Worker/D1 *later*. Same shape,
   different source. Swapping it is a one-file change.
3. **Mark placeholder member values clearly** in the stub (e.g. `_placeholder: true`) so the UI can
   render a "demo data" badge on anything not yet backed by a real source — and so we can grep for
   what still needs wiring.
4. When the backend lands, "tying it in" = point the data module at the Worker. No component edits.
   That is the design goal in one sentence: **components are dumb, the data layer is the swap point.**

This is the same pattern the public site already uses with `ASB_DATA`. Extend it; don't invent a
new one.
