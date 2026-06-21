# Outreach Pipeline — Spec for Slices 2–4

**Status:** draft for approval. Slice 1 (lead-finder) is built + committed on `feature/lead-finder`.
**Goal:** a repeatable, human-in-the-loop motion that finds local businesses with no real web
presence, builds them a demo site, and sends a human-approved cold email — pitched as
"get your first real website," not "your site is old."

**Two architectural decisions already made (2026-06-21):**
- **Template model:** build ONE new generic, vertical-agnostic, data-driven template at ASB's
  quality bar. ASB is a *design reference only* — it is too bowling-specific to reuse directly
  (~10 pages don't carry over; theme/menu/logo/typography hardcoded).
- **Generation timing:** ON-DEMAND. A demo is built only when the user marks a lead worth
  pursuing — no wasted compute on the ~60–68% who never respond.

**Research-driven constraints (verified, not assumed):**
- **Resend is BANNED for cold email** (its AUP prohibits cold outreach / scraped lists). Do NOT
  use the Vault Resend key for outreach. Use a dedicated sending domain + Google Workspace +
  Gmail Drafts API instead.
- **Cloudflare Pages soft-caps at ~100 projects.** Use **Cloudflare Workers + R2, subpath
  routing** (`demos.<domain>/{slug}`) — no caps, unlimited bandwidth, near-zero cost.
- **CAN-SPAM applies to B2B**: every email needs a physical postal address + working opt-out,
  honored within 10 days. Penalty up to ~$50k per email. Hard requirement in the email template.

---

## Slice 2 — Enrich (low risk, build first)

Turn each strong lead into a complete, facts-only "build brief" the generator can consume.

**Input:** `leads.csv` from Slice 1 (the strong leads: no-site / social-only / parked).
**Action:** for each lead the user flags, call Places **Details** (place_id → full record) to pull
the factual layer: hours, full address, lat/lng, phone, business category, rating, review count,
price level. Facts only — never logos, photos, or marketing copy (IP rule).
**Billing:** Details Enterprise tier (websiteUri/hours fields) — 1k free/mo, then $20/1k. On-demand
keeps this tiny. Use the cheap 2-step pattern: Essentials Text Search (free) already gave us
place_ids in Slice 1; Details is one call per flagged lead.
**Output:** `briefs/{slug}.json` — a normalized build-brief schema:
```
{ slug, name, category, phone, address, lat, lng, hours[], rating, review_count,
  price_level, services[]   // services inferred from category + name; user can edit
}
```
**Observability:** the report.html gains an "enriched ✓" state per lead and a brief preview.
**Effort:** small. Pure data pull + normalize. No new infra.

---

## Slice 3 — Demo generator (the heart; biggest build)

Produce a real, viewable demo site per flagged lead from the generic template + their brief.

### 3a. Build the generic template (one-time, the bulk of the work)

**Workflow (revised 2026-06-21):** the template is DESIGNED in **Claude Design** (claude.ai/design),
not hand-coded in Claude Code — the design harness produces better HTML for far fewer tokens, and the
user's mockups already live there. Claude Code's job is to make the resulting design DATA-DRIVEN, not
to author the pixels. Bridge is the **DesignSync** tool (live in-session) + `/design-sync`, bidirectional:
- `/design-sync` pushes the repo's design-system components INTO Claude Design so mockups start from
  real components, not approximations. (Verified: DesignSync tool lists/reads/writes the user's
  "Design System" project, id 111d3508-ecd0-40f3-a645-a01144cd6308, owner Nic.)
- User designs the template on the canvas; the finished design comes back as a handoff bundle.
- NOTE: the full-page "Export → Send to Claude Code" mockup handoff is a Claude Design UI action,
  distinct from the repo↔design-system component sync — confirm hands-on before relying on it.

A new, fully data-driven static template — NOT a fork of the bowling site. Sections every local
service business needs:
- **Hero** (business name, tagline, primary CTA "Call / Get a Quote", hero image = neutral/AI)
- **Services** (from brief.services — for auto/tire: oil change, tire install, brakes, alignment…)
- **Hours** (from brief.hours)
- **Location** (map embed from lat/lng + address)
- **Contact / Quote request** (phone click-to-call + simple form)
- **Reviews** (rating + count as social proof; do NOT scrape review text — show the Google
  rating number only, link out)
- **Logo: PLACEHOLDER SLOT** — never generate/reuse a brand mark. A clean "Your logo here" slot.

Design approach: match ASB's quality bar (good type, spacing, color) but **themeable** — a
`theme.json` (palette + fonts) per vertical so auto/tire looks different from salons. Build as a
template that renders to static HTML/CSS/JS from `brief.json` + `theme.json`. Keep it dependency-light
(the ASB Babel-in-browser approach works but precompile for a real deliverable). Imagery: neutral
stock or AI-generated (ComfyUI on spark2 is available), never the business's own photos.

### 3b. Generate + deploy per lead
- `generate.py --slug <slug>` → reads brief + theme, emits `dist/{slug}/` static site.
- Deploy to **Cloudflare Workers + R2**, subpath route `demos.<domain>/{slug}/`. One Worker, one
  R2 bucket, `wrangler` deploy per slug. (CF token: scoped, in Vault `Secrets/services/cloudflare`
  — note the token-hygiene memory; use a scoped token, not the global key.)
- **IP/legal guard:** generator asserts no business-supplied logo/photo/copy is embedded; logo is
  always the placeholder slot. This is a code-level invariant, not a guideline.

**Observability:** report.html gains a live **demo URL** per built lead + a thumbnail screenshot
(Playwright), and a "built ✓" state. This is where the report starts becoming the dashboard.
**Effort:** large (3a is most of it). 3b is moderate (CF Workers/R2 + wrangler scripting).
**Open sub-decisions for build time:** precompiled static vs. keep Babel-in-browser; which AI
imagery source; exact theme.json schema.

---

## Slice 4 — Human-gated outreach (deliverability + legal heavy)

Draft a personalized cold email per lead; the user approves + sends. AI never converses.

### 4a. One-time infrastructure (before ANY send)
- **Dedicated sending domain** (e.g. `try<brand>.com`), NOT the primary business domain — protects
  primary mail if the cold domain gets flagged.
- **Google Workspace** on that domain. **SPF + DKIM + DMARC** all configured before first send
  (DMARC starts `p=none`, upgrade to `quarantine` after 2–4 weeks clean).
- **Warmup:** start 5–10/day, ramp over 4–6 weeks. A brand-new domain has zero reputation; skipping
  warmup = spam folder for the first month.
- **CAN-SPAM footer block** (hard requirement, baked into every template): physical postal address
  (a CMRA/UPS-Store box is fine) + working opt-out honored within 10 days + non-deceptive subject.

### 4b. Per-lead draft + send
- `draft.py --slug <slug>` → generates a personalized email: references the actual business + the
  live demo URL (link, NOT a heavy attachment — the ASB lesson), in plain human English (no AI tells,
  no em dashes — per the Nikki email lessons).
- Push to **Gmail Drafts API** → the draft lands in the user's Gmail. User reviews, edits, clicks
  **Send**. That click IS the human gate. No custom approval UI needed.
- Email tone mirrors the winning Nikki angle: peer/helpful, not agency-pitch.

**Observability:** report.html gains per-lead state: drafted → (user) sent → replied. Closes the loop.
**Effort:** moderate. 4a is setup/DNS (user-driven, I provide exact records). 4b is Gmail API scripting.

---

## Build order + checkpoints

1. **Slice 2** (enrich) — small, unblocks everything. Verify briefs look right on real leads.
2. **Slice 3a** (generic template) — biggest piece. Build + review ONE rendered auto/tire demo
   before wiring deploy. Quality gate here.
3. **Slice 3b** (deploy) — CF Workers/R2, get one demo live at a real URL.
4. **Slice 4a** (email infra) — DNS/Workspace/warmup. Slow (warmup is weeks); start early, runs in
   background while 3 is built.
5. **Slice 4b** (draft+send) — last. Gmail Drafts integration.

Each slice extends report.html (the observability spine). When stages stabilize, wrap reports in a
live dashboard.

## What stays out of scope (deliberately)
- No automated sending. No AI-to-human conversation. No bulk blasting.
- No reuse of any business's logo/photos/copy — facts only, originals generated, logo = placeholder.
- No scaling past the human's review throughput — that cap is the safety feature, not a bug.
```
