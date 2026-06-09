<!--
  All Star Bowl - Technical & Costs (companion to website-guide.md)
  Audience: owner-facing, but more detailed than the guide. Covers how the site is
  hosted and what it costs to run.

  STATUS: DRAFT. The "What it costs you" care-plan section is pending a pricing
  research pass (workflow asb-pricing-research). Figures below for AWS INFRA are
  verified on-demand pricing (us-east-1, June 2026), priced WITHOUT 12-month trial
  free tiers (account is past its trial window), but honoring the PERMANENT
  always-free tiers where they genuinely apply. Sources listed at the bottom.

  Diagram GIFs render from the Remotion project at /Volumes/DevDrive-M4Pro/Projects/remotion
  (compositions ASBPhase1 / ASBPhase2, branch feature/asb-aws-diagram). Rendered output was
  copied into docs/assets/aws-diagrams/ (committed - ~6MB, this IS the deliverable) so the
  doc is self-contained. To re-render: cd into the remotion project, `npx remotion render
  ASBPhase1 out/asb-aws/asb-phase1.gif --image-format=png --codec=gif --every-nth-frame=2`
  (same for ASBPhase2), then re-copy.
-->

# All Star Bowl - Technical & Costs

How the website is hosted, and what it actually costs to run. Plain enough to follow, honest about the numbers.

> Companion document: **website-guide.md** is the page-by-page tour. This one is the "under the hood and what's the bill" document.

---

## Where the site runs today

Right now the site runs on a Cloudflare tunnel at no infrastructure cost. That's perfect for showing it off and for early real use, but it routes through a developer-owned account - it isn't a setup the business owns or can hand off cleanly. The production path below puts it on its own proper foundation.

---

## How it's built (the short version)

The public website is a **static site**: fast, secure, and cheap to host because there's no heavy server doing work on every visit. The pages, images, menu, the 360 pro-shop view, all of it is delivered straight from storage through a global content network, so it loads fast on a phone anywhere.

The **member/loyalty area** (Phase 2) adds a small, modern backend: a secure sign-in, a lightweight API, and a database that holds each bowler's stats and bag. It only runs when a member is actually using it, which is why it costs almost nothing at this scale.

### Phase 1 - the live site

![All Star Bowl AWS Phase 1 architecture](assets/aws-diagrams/asb-phase1.gif)

*Visitor → Route 53 (DNS) → CloudFront (the global CDN, with a free TLS certificate from ACM) → S3 (the static website files).*

### Phase 2 - the member backend

![All Star Bowl AWS Phase 2 architecture](assets/aws-diagrams/asb-phase2.gif)

*Same front end, plus a Cognito-secured API on Lambda that reads and writes each member's stats and bag in DynamoDB. It only spins up when a member uses it.*

---

## What it costs to RUN (AWS infrastructure)

These are the raw cloud costs, the bill AWS sends for keeping the site online. This is **not** the price to you (that's the care plan further down); it's the underlying cost, shown so you can see there's nothing hidden.

Pricing is current (us-east-1, mid-2026), figured the **conservative** way: as if the 12-month new-account free credits do not apply. A few AWS services have *permanent* free allowances (not trial credits) that this site stays comfortably inside; those are noted.

### Phase 1 - static site

| Service | What it does | Monthly cost at your scale |
|---|---|---|
| S3 | Stores the website files | ~$0.01 |
| CloudFront | Global CDN + HTTPS (fast loads everywhere) | $0 inside permanent free tier; ~$1.40 worst-case |
| Route 53 | DNS (your domain name routing) | $0.50 |
| ACM | TLS/HTTPS certificate | Free |
| **Phase 1 total** | | **~$0.50 - $2.00 / month** |

The only guaranteed recurring charge is Route 53's $0.50/month domain hosting. If the domain's DNS stays where it is now (outside AWS), even that goes away.

### Phase 2 - add the member backend

| Service | What it does | Monthly cost at your scale |
|---|---|---|
| Cognito | Member sign-in (up to 10,000 members free, permanently) | $0 |
| Lambda | Runs the member API on demand | $0 inside permanent free tier; ~$0.02 worst-case |
| DynamoDB | Stores member stats & bag | ~$0.28 |
| **Phase 2 adds** | | **~$0.30 / month** |

**All-in, running the full site (Phase 1 + Phase 2) lands around $1 - $2.50/month in raw AWS cost** at a single alley's traffic. These numbers hold until traffic grows roughly 50-100x or membership passes ~10,000 active members - a long way off.

---

## What it costs YOU (care plan)

The website is built, and it's yours. There's no charge for the build and no big upfront invoice. The only thing to cover going forward is keeping it **online, secure, fast, and current** - and that's one simple monthly plan.

### The Care Plan - $39/month

One flat number, no setup fee. It covers everything it takes to keep the site running so you never have to think about the technical side:

- **Managed hosting** on fast cloud infrastructure - your site loads quickly for anyone, anywhere
- **Security & uptime monitoring** - I know before you do if anything ever goes down
- **SSL / HTTPS certificate** kept active and renewed automatically
- **Daily backups** - the site can always be restored
- **Software updates & patching** - it stays current and protected
- **Small content changes** - a few quick updates a month: hours, phone number, league nights, event flyers, menu price tweaks. Just text or email me.

Bigger work - brand-new pages, a redesign, or new features (expanding the 360 pro-shop, wiring up live scores, the member loyalty system) - is quoted separately so you always know the cost up front. The monthly plan keeps the lights on; anything that grows the site is its own conversation.

### Why it's a fair price

A professional website care plan typically runs **$50-$300/month**. At **$39**, this is a deliberately local-friendly rate - below what an agency would charge, and it's the single phone call you make if anything ever looks wrong. For context, $39/month is about what a place this size spends on lane oil, and it's roughly **one league night's lane fees**. The site handles itself; you just bowl.

> In plain terms: I built this because I think All Star Bowl deserves a great website. I'd love to be the person who keeps it running for you.

---

## Why AWS over staying on the tunnel

The Cloudflare tunnel is free and fine for a demo, but the AWS path gives the business **its own** production setup: its own account, its own domain routing, a real CDN-backed site, and a backend that scales, for an infrastructure cost of about the price of one bowling game a month. It's the difference between borrowing a setup and owning one.

---

## Sources (AWS pricing, mid-2026)

- S3: https://aws.amazon.com/s3/pricing/
- CloudFront: https://aws.amazon.com/cloudfront/pricing/ (1 TB/mo + 10M requests permanent free tier: https://aws.amazon.com/blogs/aws/aws-free-tier-data-transfer-expansion-100-gb-from-regions-and-1-tb-from-amazon-cloudfront-per-month/)
- Route 53: https://aws.amazon.com/route53/pricing/
- ACM: https://aws.amazon.com/certificate-manager/pricing/
- Lambda: https://aws.amazon.com/lambda/pricing/ (1M req + 400K GB-s permanent free tier)
- DynamoDB on-demand: https://aws.amazon.com/dynamodb/pricing/on-demand/
- Cognito: https://aws.amazon.com/cognito/pricing/ (10,000 MAU permanent free tier)
