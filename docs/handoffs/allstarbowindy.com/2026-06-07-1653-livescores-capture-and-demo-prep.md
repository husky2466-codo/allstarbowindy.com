# Handoff — LiveScores system map + demo fixture capture

**Date**: 2026-06-07 16:35
**Project**: allstarbowindy.com
**Branch**: main (1 untracked: public/uploads/3d/)
**Session topic**: Mapped the Computer Score / LiveScores system via authenticated Playwright walk, captured live fixture data, and wrote the demo build spec for a snapshot + fake-motion scoreboard page.

---

## State + in-progress work

**Done — fully merged to main (3 PRs this session):**

PR #1 — hosting/scoring/cost docs:
- `docs/current-hosting-analysis.md` — verified DNN/dnn4less/BPAA stack + estimated cost ($40-75/mo), BPAA WebServices retirement + BowlNow successor documented.
- `docs/cost-analysis-aws-offer.md` — AWS serverless architecture proposal + managed-service pricing tiers + vendor lock-in reality check written.
- `docs/feature-livescores-integration.md` — initial LiveScores integration brief (§3-7 now superseded by livescores-system-map.md but §7a access-asset note added in PR #2).
- `public/img/generated/` — 30 AI assets in menu/parties/logos/info/scenes subfolders + generated-manifest.json.
- `docs/live-site-reference/` — live DNN site HTML/CSS/JS snapshot + `livescores/` login-bundle subdirectory.

PR #2 — LiveScores system map + people library:
- `docs/livescores-system-map.md` — AUTHORITATIVE system map from authenticated walk (endpoints, 5s poll mechanism, full data structure, 4 feature surfaces). Supersedes feature-livescores-integration.md §3-7.
- `public/img/reference/people/` — 59 people photos in category subfolders (lanes/seating/party/cafe/exterior/misc + incidental/) + people-manifest.json.
- `public/screenshots/` — 4 LiveScores screenshots (livescores-01-member-lanes, 02-scoresheet, 03-stats, 04-view-lanes) + network/wrapper capture txt files.
- `docs/feature-livescores-integration.md:§7a` — login access-asset note added.

PR #3 — demo fixtures + build spec:
- `public/screenshots/demo-fixtures/all-lanes-board.json` — 44 live active lanes at capture time (~3:30pm).
- `public/screenshots/demo-fixtures/lane38-s0.json`, `lane38-s1.json`, `lane38-s2.json` — Lane 38 (Woggie/Drece/Bj/Ricici) across 3 snapshots ~35s apart with REAL frame-to-frame movement captured.
- `docs/demo-livescores-build-spec.md` — spec for DesignClaude: how to build the snapshot + fake-motion demo page from these fixtures.

**Not started — carried from prior session + new:**
- Cloudflare tunnel (allstarbowlindy.myroproductions.com -> public/) — STILL not started, third session running.
- The actual site mockup has NOT arrived. public/index.html does not exist.
- The demo LiveScores page has NOT been built yet — fixtures and spec are ready; DesignClaude builds it.
- The main site has not been built yet — DesignClaude builds it.

**Loose end — Playwright browser still open:**
The Playwright browser is open and logged into the user's Computer Score member account (myersav93@outlook.com). The session may or may not have timed out. Ask the user whether to close it before doing anything with Playwright.

---

## Decisions + reasoning

- **Demo = snapshot + fake-live JS motion, no backend, no runtime Computer Score dependency** — Why: can't break on stage; no ToS risk for a one-time demo; looks live. A real backend matters for production, not the client pitch.

- **Production path = AWS serverless middleware** polling Computer Score public pages, parse HTML, cache to DynamoDB, render in-brand — Why: Computer Score hardware is physically welded into their bowling op (can't replace it), but it publishes public score pages we can mirror. No vendor API available; scraping is grey-zone but tolerated.

- **ToS deemed manageable if hired as hosting team** — Why: user's explicit call. Not a blocker for the build or demo.

- **wrapper.php works with seriesID alone** (no livecode needed for live active lanes) — Why: confirmed via live polling. Simplifies both the demo fixture capture and the eventual production build.

- **Computer Score login (myersav93@outlook.com) treated as a project access asset** — Why: provides authenticated access to member history, stats endpoints, and deeper system data. Captured in project memory (allstarbowl-computerscore-login.md).

- **Gitignore public/uploads/gmaps-photos/ (129 originals, ~29MB) and .playwright-mcp/** — Why: repo bloat; designer only needs curated/reference/generated assets.

- **PR-then-merge flow for all commits** — Why: user preference established prior session; maintained for all 3 PRs this session.

- **People images: category subfolders + descriptive names, incidental kept separate** — Why: user chose this organization explicitly.

- **Beech Grove Bowl logos filed in logos/ but flagged** — Why: two AI-generated files appear to be a DIFFERENT bowling alley's brand (Beech Grove Bowl, not All Star Bowl). Possible AI source mixup. Filed but flagged in generated-manifest.json — do not use in the client deliverable without review.

---

## File paths + line refs

**Project root**: `/Volumes/DevDrive-M4Pro/Projects/allstarbowindy.com`

Core docs for DesignClaude / next session:
- `docs/demo-livescores-build-spec.md` — how to build the snapshot+fake-motion demo page; read this first for demo work
- `docs/livescores-system-map.md` — authoritative LiveScores system map; supersedes feature-livescores-integration.md §3-7
- `docs/feature-livescores-integration.md` — original integration brief; §7a has the access-asset note; §3-7 stale
- `docs/current-hosting-analysis.md` — verified current DNN/dnn4less/BPAA stack, cost estimate, BowlNow successor context
- `docs/cost-analysis-aws-offer.md` — AWS architecture + managed-service pricing tiers + vendor lock-in analysis

Demo fixtures (real captured data, ready to use):
- `public/screenshots/demo-fixtures/all-lanes-board.json` — 44 active lanes at capture
- `public/screenshots/demo-fixtures/lane38-s0.json` — Lane 38 snapshot 0 (baseline)
- `public/screenshots/demo-fixtures/lane38-s1.json` — Lane 38 snapshot 1 (~35s later, Drece 55->60)
- `public/screenshots/demo-fixtures/lane38-s2.json` — Lane 38 snapshot 2 (~35s later, Bj 69->79)

LiveScores screenshots:
- `public/screenshots/livescores-01-member-lanes.png` — member lane history view
- `public/screenshots/livescores-02-scoresheet.png` — per-game scoresheet
- `public/screenshots/livescores-03-stats.png` — per-series stats (strike/spare/splits/opens)
- `public/screenshots/livescores-04-view-lanes.png` — public live lanes board

Asset libraries:
- `public/img/generated/` — 30 AI assets; generated-manifest.json has category + notes
- `public/img/generated/logos/` — includes 2 Beech Grove Bowl files flagged in manifest — do not use
- `public/img/reference/` — 39 curated no-people reference photos (from prior session)
- `public/img/reference/people/` — 59 people photos + people-manifest.json

Live site reference:
- `docs/live-site-reference/` — DNN HTML/CSS/JS snapshot
- `docs/live-site-reference/livescores/` — Computer Score / LiveScores login bundle

Prior session reference:
- `docs/allstarbowl-site-audit-handoff.md` — full business content audit (hours, rates, leagues, parties, pro shop, cafe — content source of truth for the redesign)
- `public/uploads/gmaps-photos/` — 129 raw originals, GITIGNORED (local only, do not commit)

Key LiveScores endpoints (from livescores-system-map.md):
- Live scoreboard: `wrapper.php?centre=112&seriesID=X` — polled every 5s, returns structured HTML
- Active lanes: `view-lanes.php?centre=112` — public, no auth
- Standings: `standings.php?centre=112` — public
- Per-game grid: `view.php?centre=112&seriesID=X&game=N`
- Stats: `stats.php?centre=112&seriesID=X` — strike/spare/splits/opens (feature we had missed)
- Member history: `user-lanes.php` — requires auth
- Venue key: `centre=112` (fixed for All Star Bowl)

---

## Business context (stable — unchanged from prior session)

- **Client**: All Star Bowl, 726 N Shortridge Rd, Indianapolis, IN 46219, (317) 352-1848
- **Real domain**: allstarbowlindy.com (NOT allstarbowindy.com — that is the internal repo name)
- **Current live site**: DNN 9.x / ASP.NET / IIS, Plesk-managed, hosted by dnn4less, served as BPAA WebServices product (DNS: bpaahost.com, email: bpaamail.com, IP: 66.35.109.120, rDNS: bpaa07.dnn4less.com). Estimated ~$40-75/mo.
- **BPAA is retiring WebServices** — transitioning to BowlNow (bookings+CRM+marketing, contact-sales, likely $100-300+/mo). This is the pitch pressure point.
- **Scoring hardware**: Computer Score brand, physically installed, not replaceable. LiveScores is Computer Score's public web front-end at prestocomputerscore.com.
- **Demo goal**: get a branded in-motion scoreboard in front of the owner so they see what they're missing. Main site mockup + LiveScores demo page together.

---

## Next steps + open questions

1. **Build the Cloudflare tunnel** (highest priority, third session without this) — allstarbowlindy.myroproductions.com -> http://localhost:8080; model on molt-government tunnel at ~/.cloudflared/; launchd plist for restarts. CF MCP not available in this project's sessions — run from ~ or use CLI.
2. **DesignClaude: build the LiveScores demo page** per `docs/demo-livescores-build-spec.md` using fixtures in `public/screenshots/demo-fixtures/`. No backend — snapshot + JS fake motion only.
3. **DesignClaude: build the main site mockup** into public/ per the drop-in map in README.md (entry file -> public/index.html; fix relative asset paths).
4. **Close or confirm the Playwright browser** — it is still open and logged into myersav93@outlook.com on Computer Score. Ask the user before touching it.
5. **Verify demo end-to-end** once mockup + LiveScores page + tunnel are up: static server -> tunnel -> allstarbowlindy.myroproductions.com -> all assets 200.
6. **ASK THE OWNER (before the pitch):** Is the BPAA website a cost they currently pay separately (we can swap it) or is it bundled "free" into BPAA membership? This is the single biggest unknown for the cost pitch. If bundled, the value prop shifts from "save money" to "better product for incremental cost."

Open questions:
- ? Is the BPAA website cost separable from membership, or bundled? (Biggest question — determines if the cost pitch holds. Must ask the owner directly.)
- ? What does the client actually pay BPAA today in total? (Turns estimate into a hard anchor.)
- ? Do they book lanes/parties online? (If BowlNow bundles bookings, our static site must complement it, not compete.)
- ? Does livecode expire for historical series? (Affects a future "season archive" feature; live active lanes don't need it.)
- ? Domain registrar access + email migration: allstarbowlindy.com email runs on bpaamail.com — switching friction not yet assessed.
- ? Why are Beech Grove Bowl logos in the AI asset pile? Possible source mixup in AI generation. Verify before using any logos/ content.
- ? Old dead CF token "O88szMcu..." — was it ever a real issued token? If so, rotate/delete in the Cloudflare dashboard.
