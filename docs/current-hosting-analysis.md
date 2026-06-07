# All Star Bowl — Current Hosting & Platform Analysis

**Domain:** allstarbowlindy.com
**Investigated:** 2026-06-07
**Purpose:** Establish what the client runs today, what it likely costs, and the cost/value case for our redesign.

---

## What they run today (verified — Tier 1 evidence from live DNS/HTTP probes)

| Layer | Finding | How verified |
|-------|---------|--------------|
| **CMS** | **DotNetNuke (DNN)** | `dnn_IsMobile`, `.ASPXANONYMOUS`, `__RequestVerificationToken` cookies; saved-page bundle is full of `dnn.js`, `dnncore.js`, DNN module CSS |
| **Server OS / stack** | **Windows + IIS + ASP.NET**, Plesk-managed | `x-powered-by-plesk: PleskWin` header; `.aspx` / `.axd` resources |
| **Host** | **dnn4less** (DotNetNuke specialty host), BPAA-branded reseller box | reverse DNS `bpaa07.dnn4less.com` on the site IP |
| **IP / datacenter** | `66.35.109.120` — Northern Valley Communications LLC (Aberdeen, SD) | whois |
| **DNS** | `ns3/ns4.bpaahost.com` | dig NS |
| **Email** | `mail.bpaamail.com` (MX) | dig MX |
| **Template** | Dated **BPAA / BPAA-WebServices** bowling-center template on DNN | NS/MX both BPAA-owned; template matches the BPAA WebServices product |

**Bottom line on the stack:** This is the **BPAA WebServices** product (the Bowling Proprietors' Association of America's member website program), built on **DotNetNuke**, hosted on **dnn4less** infrastructure, with BPAA running their DNS and email. It is a legacy ASP.NET/Windows stack — heavy, slow, and visually dated (table-ish DNN skin, jQuery 1.x era, Font Awesome 5).

The on-site **league scoring** ("Computer Score / LiveScores") is a **separate** third-party Australian vendor (`computerscore.com`) — not part of the website hosting. See `feature-livescores-integration.md`.

---

## What it costs them (estimated — published starting prices + segment norms)

BPAA does **not** publish WebServices pricing (contact-sales only), and BPAA is **mid-transition to a new web partner, BowlNow**, which also gates pricing. So these are grounded estimates, not invoices:

| Component | Evidence | Estimated cost |
|-----------|----------|----------------|
| dnn4less DNN hosting (the underlying box) | dnn4less published: shared DNN "starts at **$20/mo**", reseller "$40/mo", managed "$125/mo" | **$20–40/mo** at the infra layer |
| BPAA WebServices markup (template, email, "lightning fast hosting", support, domain) | bundled member product on top of dnn4less; resold member benefit | **$30–75/mo** bundled is typical for assoc. web programs |
| **Likely all-in today** | — | **~$40–75/mo (~$500–900/yr)** for the website + email bundle |
| If/when pushed onto **BowlNow** (BPAA's replacement partner: website + CRM + online bookings + marketing automation) | contact-sales; this class of all-in bowling SaaS commonly runs **$100–300+/mo** | **$1,200–3,600+/yr** — a likely *increase* over the legacy DNN bundle |

**Key strategic point:** BPAA is sunsetting the old WebServices/DNN program in favor of **BowlNow**. So the client isn't on a stable platform — they're on a deprecating one, and the vendor's own upgrade path (BowlNow) is a bundled SaaS that will likely *raise* their monthly cost and lock them deeper into a closed ecosystem.

---

## What we can offer (the pitch math)

Our redesign is a **static site** (HTML + in-browser JSX, no build step, no database, no Windows/ASP.NET licensing). That changes the cost structure entirely:

| | Their DNN/BPAA today | Their BowlNow upgrade path | **Our static redesign** |
|---|---|---|---|
| Stack | DotNetNuke / ASP.NET / Windows / IIS | Proprietary SaaS bundle | Static files on a CDN |
| Hosting cost | ~$40–75/mo | ~$100–300+/mo (est.) | **$0–5/mo** (Cloudflare Pages / static + tunnel; effectively free at this traffic) |
| Speed | Slow (heavy DNN, server-rendered .aspx) | Unknown | **Fast** (static, CDN-edge, no server round-trip) |
| Design | Dated template, off-brand | Templated | **Custom, on-brand** (the mockup we're building) |
| Lock-in | BPAA ecosystem, deprecating | Heavy SaaS lock-in | **None — we own the files** |
| Email | bpaamail bundled | bundled | Keep their email anywhere (Google Workspace ~$6/user/mo, or keep bpaamail) |

**The story to the client:** "You're paying ~$500–900/yr for a slow, dated site on a platform BPAA is *retiring*. Their replacement (BowlNow) will likely cost you *more* per month and lock you in harder. We can give you a faster, modern, custom-branded site for a near-zero monthly hosting bill, that you actually own — and still surface your live league scores."

---

## Caveats / open questions (don't overstate to the client)

- **Exact current bill is unconfirmed.** BPAA WebServices and BowlNow both hide pricing. The $40–75/mo figure is inferred from dnn4less's published rates + the BPAA bundle markup. **Ask the client what they actually pay** — that turns this from estimate to fact and sharpens the pitch.
- **Email migration is the real switching cost.** Their `@allstarbowlindy.com` email is on bpaamail. Moving off BPAA hosting means moving email too — plan for that (Google Workspace / Microsoft 365 / keep bpaamail standalone). This is the thing most likely to cause friction.
- **BowlNow may bundle value we don't replace** (CRM, online lane bookings, marketing automation). If they actively use online booking/CRM, a pure static site doesn't cover that — we'd need to add a booking integration or position ours as "website + keep your booking tool." Find out if they book lanes/parties online today.
- **Domain control.** DNS is on BPAA nameservers. To move, we need registrar access (who is the registrar? — not yet confirmed; NS being bpaahost.com suggests BPAA may control the domain too). Confirm the client can get registrar login before promising a clean cutover.

---

## Sources
- Live DNS/HTTP/whois probes of allstarbowlindy.com (2026-06-07)
- dnn4less hosting pricing: https://dnn4less.com/Web-Hosting
- BPAA WebServices: https://bpaa.com/webservices (now routing to BowlNow transition)
- BowlNow: https://joinbowlnow.com/pricing/ (contact-sales, no public pricing)
