# Suggestion Box Build Spec — form → Cloudflare Worker → email to owner

**For:** next session / DesignClaude (form UI) + ops (Worker deploy)
**Goal:** When the owner reviews the demo link, they can type a suggestion and drop in image(s) (their own screenshots), hit submit, and it lands in the project owner's email inbox with the images attached. No third-party form service; we own the backend.

**Recipient:** pmnicolasm@gmail.com (the suggestions go here).

---

## Why this shape (decisions already made)

- **A backend is required.** A static page cannot send email or attach a dropped file by itself — the browser sandbox forbids it. Something server-side must receive the POST. We use a **Cloudflare Worker** (we already run Cloudflare + the tunnel; no monthly fee, no third party seeing submissions).
- **No third-party form service** (Formspree/Web3Forms). Considered and rejected: they'd see submissions and gate attachments behind a ~$10-25/mo plan. The Worker is ~40 lines and free.
- **Images = drop-zone only. NO in-page "screenshot this page" button.** A web page cannot cleanly screenshot itself: `html2canvas` re-renders the DOM and gets it wrong (cross-origin images blank, animated mascot frozen/missing); `getDisplayMedia` pops a confusing share-picker. For a non-technical owner this produces broken-looking captures and frustration. Instead: the owner takes their own OS screenshot (Cmd-Shift-4 on Mac) and drags it into the drop zone. Same outcome — annotated images attached to the email — without fighting the sandbox.

---

## Email mechanism (RESEARCHED 2026-06-07 — do not use stale tutorials)

**Critical:** The old "free MailChannels from Cloudflare Workers" path that most pre-2024 tutorials show **was discontinued in August 2024.** Do not build on it.

**Use Resend** (https://resend.com), which Cloudflare now recommends for Workers email:
- Free tier: **3,000 emails/month** — vastly more than a suggestion box needs.
- **Supports attachments**: `attachments: [{ filename, content }]`, content as a buffer, **40MB total per email** after encoding.
- Requires a **verified sending domain**. We have `myroproductions.com` on Cloudflare already — verify it in the Resend domains dashboard (DNS records added to the existing zone). The reserved `onboarding@resend.dev` is test-only; use a real from-address on the verified domain (e.g. `suggestions@myroproductions.com`).
- Resend API key stored as a Worker **secret** (`wrangler secret put RESEND_API_KEY`) — never in code or client JS.

Sources:
- https://developers.cloudflare.com/workers/tutorials/send-emails-with-resend/
- https://resend.com/docs/send-with-cloudflare-workers
- MailChannels free-tier EOL: https://blog.cloudflare.com/sending-email-from-workers-with-mailchannels/ (and MailChannels' own EOL notice)

---

## Architecture

```
Owner opens demo link (static mockup on the CF tunnel / CF Pages)
   → Suggestion box: <textarea> + drag-drop image zone
   → POST multipart/form-data to the Worker URL
        (the Worker is a SEPARATE deploy on CF's edge, not the tunnel —
         which is actually more robust: the box keeps working even if the
         local machine serving the tunnel is off)
   → Worker:
        1. validate (non-empty text, image count/size/type limits)
        2. read image file(s) from the form
        3. call Resend API with the text as body + image(s) as attachments
        4. return 200 + a friendly "thanks!" / 4xx on bad input
   → Email arrives at pmnicolasm@gmail.com with images attached
```

---

## Front-end (DesignClaude builds this into the mockup)

A suggestion box, styled in-brand. Fields:
- **Suggestion text** — `<textarea>`, required.
- **Optional name/context** — single line (so the owner can sign it). Optional.
- **Image drop zone** — drag-and-drop OR click-to-browse. Accept `image/*`. Show thumbnails of what's been added; allow removing before submit. Cap at e.g. 3 images / 8MB each (stay well under Resend's 40MB total).
- **Submit** — POSTs `multipart/form-data` to the Worker URL. Show a success state ("Thanks — sent!") and an error state. Disable the button while sending.
- A short helper line under the drop zone: "Tip: press Cmd-Shift-4 (Mac) or Win-Shift-S (Windows) to screenshot the page, then drag it here."

Keep it dismissible / unobtrusive — likely a button that opens the box in a modal or slide-over, not always-on. Coordinate placement with the mascot corner-buddy (don't stack them in the same corner).

---

## Worker (ops builds/deploys this — ~40 lines)

Responsibilities:
1. Accept POST `multipart/form-data` only; reject others.
2. **CORS**: allow the demo origin (the tunnel domain) to POST. Lock it to that origin, not `*`.
3. Validate: text non-empty and under a sane length; image count ≤ 3; each image is an allowed type and under size cap; total under Resend's 40MB.
4. **Spam guard**: a honeypot hidden field + basic rate limit (Worker can use a KV counter or just rely on low volume for a demo). Don't expose an open relay.
5. Build the Resend payload: from `suggestions@myroproductions.com`, to `pmnicolasm@gmail.com`, subject like `New All Star Bowl suggestion`, body = the text + name/context, `attachments` = the uploaded images (filename + buffer).
6. POST to Resend with the `RESEND_API_KEY` secret. Return 200 on success, 4xx on bad input, 5xx on Resend failure.

Deploy with `wrangler`. Secret via `wrangler secret put RESEND_API_KEY`. Note: CF MCP is not available in this project's sessions — deploy from `~` or via the wrangler CLI directly.

---

## Pre-build checklist (blockers to clear first)

1. **Resend account** + verify `myroproductions.com` (add the DNS records to the existing Cloudflare zone). Get an API key.
2. Decide the **from-address** on the verified domain (e.g. `suggestions@myroproductions.com`).
3. Confirm the **demo origin** (tunnel domain `allstarbowlindy.myroproductions.com`) so CORS + the form's POST URL are correct.

## Out of scope (noted, not built)

- In-page page-self-screenshot (rejected above — sandbox can't do it cleanly).
- Storing suggestions in a database/dashboard (D1/KV/R2). Email-only by decision. R2 specifically is a poor fit for text suggestions; it would only earn its place if we later wanted to retain large image attachments as objects — not needed for the demo.
- File types beyond images (PDFs, etc.) — add later if asked.

## Done =

Owner opens the demo, opens the suggestion box, types a note, drags in a screenshot, submits, and an email arrives at pmnicolasm@gmail.com with the note and the image attached. Works from the tunnel origin; the Worker rejects junk/oversized/non-image input gracefully.
