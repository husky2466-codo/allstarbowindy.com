# All Star Bowl — AWS Hosting + Managed-Service Cost Analysis

**Date:** 2026-06-07
**Purpose:** Model what it would cost us to host + run the redesigned All Star Bowl site on AWS (including a live-scores integration), and what we could reasonably charge them as a managed monthly service — positioned against their dying BPAA/DNN platform.

> Companion docs: `current-hosting-analysis.md` (what they run today + est. current cost), `feature-livescores-integration.md` (the scoring system details).

---

## The core constraint (read this first — it sets the whole strategy)

**Their bowling operation is welded to Computer Score.** The lane consoles + pinsetter integration + the on-site PC that "interprets the lanes" ARE Computer Score. That on-prem capture layer is the operational core of running the lanes — we **cannot and should not** try to replace it. Replacing it means integrating with their lane scoring hardware (Brunswick/Steltronic/AMF), which is a hardware-vendor-licensed, five-figure project, not a managed-website side gig.

**What we CAN do — be the middleware, not the replacement:**
Computer Score uploads league standings and live lane scores to a **public, unauthenticated** web endpoint. Verified 2026-06-07:
- `https://livescores.computerscore.com/standings.php?centre=112` → **HTTP 200**, 10.7 KB HTML
- `https://livescores.computerscore.com/view-lanes.php?centre=112` → **HTTP 200**, 16.5 KB HTML

So we let their existing system keep capturing scores on the lanes, and we **consume its public output** server-side, store it, and re-render it inside their new branded AWS-hosted site. To the customer it looks like *their* site has live scores. Under the hood it's a scheduled fetch + parse + serve.

---

## Vendor lock-in reality check (the "is the cost even there?" question) — answered 2026-06-07

Two separate vendor questions decide whether this offer makes sense at all. Both were researched against vendor docs.

### Q1: Does Computer Score force their front-end, or can we wrap our own? → **We can wrap our own, but only by LINKING or SCRAPING — there is NO official embed/export.**
- Computer Score's own docs explicitly invite: *"Create a link on your website to the LiveScores listing of your leagues."* So they **do not force their UI on the customer** — the center is expected to point its own site at the data. LiveScores is a **separate yearly subscription the center already pays** regardless of website.
- **BUT** (corrected from earlier draft): Computer Score offers **no iframe embed, no widget, no API, no data export.** Their *only* sanctioned method is an outbound link to their hosted page. Confirmed against https://computerscore.com.au/products/livescores/.
- That leaves two real implementation paths, with a real tradeoff:
  | Path | Feel | Risk |
  |------|------|------|
  | **Deep-link out** | Kicks user to Computer Score's dated page — doesn't feel like "their site" | Zero — fully sanctioned |
  | **Server-side scrape + re-render** | Native, on-brand, the experience we want | Grey zone — pages are public (HTTP 200, no auth) so technically clean, but it's *tolerated, not blessed*; breaks if CS changes HTML; owner should confirm against CS subscription ToS |
- **Implication:** the "feels native" version relies on scraping a public page, not an official integration. That's a maintenance + ToS risk the managed fee must cover, and the owner (a paying CS customer) should green-light it. It is NOT a vendor-supported embed.

### Q2: Does the platform they're being pushed toward (BowlNow) already bundle a website + scores, making us redundant? → **No. No overlap.**
- BowlNow = **online bookings + marketing + CRM + reputation/analytics.** Researched across multiple sources: lane reservations, event scheduling, marketing automation, AI chat, mobile app, prepay. **Zero league scoring, zero standings, zero live scores.**
- Scoring is Computer Score's turf (welded to lane hardware); BowlNow is a *business/marketing* layer. **They do not compete.**
- **Therefore there is no existing product that gives All Star Bowl a branded website with their live scores integrated.** That exact gap is what we fill. We are the missing middle (website + scores presentation), not redundant additive cost.

### The actual cost-justification logic (this is the crux of your concern)
- They **already pay** Computer Score (yearly) for scoring — that cost exists with or without us. We don't add to it.
- BowlNow (if adopted) is for **bookings/marketing**, a *different* need — also independent of us.
- The **website layer** (BPAA WebServices/DNN) is the *only* thing that's both (a) dying and (b) something we replace. So we're not stacking cost on a suite that already does our job — **no suite does our job.** We're replacing the one component that's being retired, and doing the scores-presentation thing no one else offers.
- **Where the "additive cost" risk is REAL:** if they adopt BowlNow for bookings, our site must *complement* it — link/embed BowlNow's booking flow rather than duplicate it. Positioning: *"We're the website + live scores. Keep BowlNow for bookings; we'll wire its booking button into the new site."* Complementary, not competing.
- **Honest failure mode:** if they're NOT willing to drop the BPAA/DNN website (e.g. it's bundled into BPAA membership they keep for other reasons and effectively "free" to them), then our monthly fee IS net-new spend and the value case rests purely on "better site + native scores." Still defensible, but weaker. **Confirm whether the BPAA website is separable from their membership** — see open questions.

**Honest caveat to carry into the sales conversation:** They stay dependent on Computer Score for the on-lane capture. If Computer Score ever changes/removes those public pages, our integration needs maintenance. We are improving the *presentation and website* layer, not freeing them from the scoring vendor. That's fine — the scoring vendor isn't the thing that's dying; **BPAA's website platform is.**

---

## Proposed architecture (all AWS, serverless, near-zero idle cost)

```
                          ┌─────────────────────────────┐
  Bowlers / public  ───▶  │  CloudFront (CDN, TLS, WAF)  │
                          └──────────────┬──────────────┘
                                         │
                    ┌────────────────────┴───────────────────┐
                    ▼                                         ▼
         ┌────────────────────┐                  ┌────────────────────────┐
         │  S3 (static site)  │                  │ API Gateway → Lambda   │
         │  HTML/CSS/JS/img   │                  │  /scores  /standings   │
         └────────────────────┘                  └───────────┬────────────┘
                                                             ▼
                                                  ┌────────────────────┐
                                                  │  DynamoDB (cache)  │
                                                  │  standings, scores │
                                                  └─────────▲──────────┘
                                                            │ writes
                                       ┌────────────────────┴───────────────┐
                                       │ EventBridge (every 1–5 min) →       │
                                       │ Lambda "scraper": fetch Computer    │
                                       │ Score public pages, parse, upsert   │
                                       └─────────────────────────────────────┘
```

- **S3 + CloudFront** — the redesigned static site (the mockup we're building). Fast, edge-cached, HTTPS.
- **EventBridge → Lambda (scraper)** — on a schedule (e.g. every 1–5 min during open hours), fetch `standings.php` / `view-lanes.php?centre=112`, parse the HTML tables, write normalized JSON to DynamoDB. This is the middleware.
- **DynamoDB** — caches standings + live scores so the public site never hammers Computer Score and stays fast.
- **API Gateway → Lambda (read)** — the site's front-end calls our own `/scores` endpoint (served from DynamoDB cache), not Computer Score directly.
- **Route 53** — DNS (if we take over the domain) or just a CNAME if they keep their registrar.

No servers, no Windows licensing, no DNN. Idle cost is effectively zero — Lambda/DynamoDB on-demand charge nothing when no one's bowling.

---

## Our actual AWS cost (this is what it costs US to run it)

Bowling-center traffic is low — a few thousand page views/month, a few hundred bowlers checking scores. This sits **inside or barely above AWS free-tier** for everything but DNS.

| Service | Usage assumption | Monthly cost (US East) |
|---------|------------------|------------------------|
| S3 (static hosting) | ~50–200 MB site assets, low GET volume | **< $0.05** |
| CloudFront | < 100 GB transfer, < 1M requests (free tier: 100 GB + 1M req/mo, permanent) | **$0** (free tier) |
| Lambda (scraper + read API) | scraper ~12–43k invocations/mo (1–5 min cadence), tiny read API; free tier 1M req + 400k GB-s | **$0** (free tier) |
| EventBridge | scheduled rule | **$0** |
| DynamoDB | tiny tables, on-demand; free tier 25 GB + 200M req/mo | **$0** (free tier) |
| API Gateway | low request volume (HTTP API: 1M req ≈ $1; free tier first 12 mo) | **$0–1** |
| Route 53 | 1 hosted zone $0.50 + negligible queries | **~$0.50–1** |
| **Total AWS infra cost to us** | | **≈ $1–3 / month** |

Even being conservative and adding CloudWatch logs, certificate (ACM is free), and some headroom: **realistically $2–5/month all-in to operate.** Compare: their current DNN/BPAA bundle is an estimated **$40–75/mo**, and BPAA's BowlNow replacement is likely **$100–300+/mo**.

> Alternative to consider: CloudFront flat-rate **Pro plan ($15/mo)** bundles CloudFront + WAF + Route 53 + S3 credits with **no overage risk even under attack/traffic spikes**. For a managed client where predictability matters, eating $15/mo for DDoS-proof flat billing may be worth it vs. chasing $2/mo with overage exposure. Model both.

---

## What we charge them (the side-gig managed-service offer)

The value isn't the $3 of AWS — it's a modern custom site + live-scores integration + **we manage it so they never touch a CMS.** Price against what they pay now and what the alternative (BowlNow) will cost, not against our cost.

### One-time: design & build
- Custom redesigned site (already in progress) + AWS setup + live-scores middleware integration.
- Suggested **one-time build fee: $1,500–4,000** depending on scope (number of pages, whether we build the league-standings native re-render now or later). Anchor: a custom bowling-center site from an agency runs $3k–10k+; we're competitive and we own the relationship.

### Recurring: managed hosting + maintenance (the side gig)
This is the recurring revenue. Tiers:

| Tier | What they get | Our cost | **Suggested price/mo** | Margin |
|------|---------------|----------|------------------------|--------|
| **Basic** | AWS hosting, SSL, DNS, uptime, the static site stays live, minor content tweaks | ~$2–5 | **$25–35** | high |
| **Standard (recommended)** | Basic + **live scores/standings integration maintained**, monthly content updates (menus, leagues, events), email support | ~$3–6 | **$50–75** | high |
| **Premium** | Standard + proactive updates, seasonal redesign refreshes, analytics reporting, priority turnaround, optional native league-DB | ~$5–15 | **$100–150** | high |

**Pricing logic:** Even at **$50/mo (Standard)**, that's roughly *at or below* what they likely pay BPAA today (~$40–75), it's *far* below the BowlNow upgrade path (~$100–300), and it nets us ~$45+/mo per client at near-zero marginal cost. Ten clients like this = ~$500/mo recurring for a few hours of monthly upkeep. That's the scalable side-gig.

**The pitch in one line:** *"Keep your scoring system exactly as it is. We replace the website BPAA is about to retire with a faster, custom, AWS-hosted site that pulls your live league scores in — for about what you pay now, less than their replacement will cost, and we run all of it for you."*

---

## Effort estimate (how hard is the integration, really?)

| Piece | Difficulty | Notes |
|-------|-----------|-------|
| Static site on S3/CloudFront | **Easy** | It's the mockup; deploy is standard. |
| League **standings** native re-render | **Easy** | The grid IS basically an Excel table (day, league, time, type, bowlers/team, teams). Parse public HTML → JSON → render. You were right about this part. |
| **Live lane scores** mirror | **Easy–Medium** | Public `view-lanes.php` page is fetchable; parsing it + caching + refresh cadence is the work. Medium only because the HTML format may be quirky and need a resilient parser. |
| Scheduled scraper + cache (Lambda/EventBridge/DynamoDB) | **Easy–Medium** | Standard serverless pattern. Main risk = Computer Score HTML changes break the parser → ongoing maintenance (this is what the managed fee covers). |
| Replacing Computer Score's on-lane capture | **DON'T** | Hardware-vendor territory. Out of scope. |

**Verdict:** The integration you want is genuinely **not hard** — *because we scope it as middleware over their public feed, not a replacement of their scoring system.* Your instinct ("Excel fields with basic math") is correct **for the standings/display layer**, which is exactly the layer we're touching. The complexity we're sidestepping (lane hardware capture) is the part we deliberately leave with Computer Score.

---

## Open questions before quoting a real number

1. **What do they actually pay BPAA today?** — Confirm the real current bill. Turns our estimate into a precise anchor. (Biggest unknown.)
2. **Do they book lanes/parties online today?** — If yes (and BowlNow bundles booking), a static site doesn't replace booking; we'd add a booking tool/integration or position around it.
3. **Domain registrar access** — NS is on BPAA (`bpaahost.com`). To cut over cleanly we need registrar login. Confirm they can get it.
4. **Email** — `@allstarbowlindy.com` is on `bpaamail`. Moving off BPAA = moving email (Google Workspace ~$6/user/mo, or keep bpaamail standalone). Plan the migration; it's the main switching friction.
5. **Computer Score ToS** — re-displaying their public pages: confirm there's no contractual problem. The owner (a paying CS customer) is best placed to ask CS directly. Their standings page carries `meta robots=noindex` — worth noting.
6. **Refresh cadence for "live"** — how live is live enough? 1-min vs 5-min polling changes nothing on cost but affects parser/CS load politeness.
7. **Is the BPAA website separable from their membership?** (decides if our fee is a SWAP or net-new spend) — If the DNN site is bundled "free" into BPAA membership they keep anyway, our monthly fee is net-new and the value case weakens to "better site + native scores." If it's a separable paid line item (or BPAA is forcing them onto a paid BowlNow/successor website), our fee is a *swap* and the math is much stronger. This is the single biggest determinant of whether the cost is justified — ask it early.

---

## Sources
- Live probes of livescores.computerscore.com (2026-06-07): standings.php & view-lanes.php both HTTP 200, unauthenticated
- Computer Score LiveScores product (architecture): https://computerscore.com.au/products/livescores/
- AWS CloudFront pricing (free tier 100GB+1M req; Pro flat-rate $15/mo): https://aws.amazon.com/cloudfront/pricing/
- AWS Route 53 pricing ($0.50/hosted zone): https://aws.amazon.com/route53/pricing/
- DynamoDB / Lambda free tiers; S3 storage $0.023/GB — AWS Always Free tier
