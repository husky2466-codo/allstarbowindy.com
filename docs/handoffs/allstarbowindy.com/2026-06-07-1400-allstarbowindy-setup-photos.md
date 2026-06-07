# Handoff — All Star Bowl: folder setup + photo library

**Date**: 2026-06-07 14:00
**Project**: allstarbowindy.com
**Branch**: main (5 untracked items: .gitignore, .playwright-mcp/, README.md, docs/, public/)
**Session topic**: Fixed CF MCP token, built project folder skeleton for an incoming static mockup, scraped and curated 39 Google Maps reference photos into a categorized image library.

---

## State + in-progress work

**Done — no further action needed:**
- Cloudflare MCP token replaced with valid token from Vault (Secrets/services/cloudflare). Token starts "RLnk0S...", expires 2028. ~/.claude.json updated; ~/.claude.json.bak-20260607-125725 is the backup. CREDENTIALS.md annotated (~line 123).
- Project folder skeleton created under public/ with all expected subdirectories plus .gitignore and README.md.
- 129 Google Maps photos scraped, downloaded as originals (asb-001..129.jpg), classified by a vision subagent, curated to 39 good no-people shots, copied into public/img/reference/ category subfolders, manually re-reviewed and reclassified by the user (cafe/ and seating/ deleted; some images moved), then renamed to <category>-NN.jpg. Manifest rebuilt from disk.

**Not started — main queued work:**
- Cloudflare tunnel: `allstarbowlindy.myroproductions.com` pointing at a static server on `public/` (locally-managed ~/.cloudflared yml + launchd plist). This is the single most important next step — it should be pre-staged before the mockup arrives so demo is instant.
- The external mockup (static HTML + in-browser JSX) has NOT arrived yet. public/ is still an empty skeleton. No ETA known.

**Nothing has been committed this session.** All new content is untracked.

---

## Decisions + reasoning

- **Demo URL: allstarbowlindy.myroproductions.com (not allstarbowl or allstarbowindy)** — Why: matches the client's actual brand spelling (allstarbowlindy.com). The repo is named allstarbowindy.com but that is an internal artifact — the real site/brand uses "indy".

- **Web root is public/, not repo root** — Why: keeps build artifacts, docs, and source control files out of the served directory. Consistent with standard static-site layout.

- **Entry file: public/index.html (not "All Star Bowl.html")** — Why: designer's filename has a space and is non-standard; rename on drop-in for a clean demo URL.

- **No auth, no DB, no security hardening at this stage** — Why: these concerns were raised but deferred. They don't apply to a static mockup demo. Revisit when there is a real app to protect.

- **Originals never moved, only copied** — Why: public/uploads/gmaps-photos/asb-001..129.jpg are the untouched source of truth. The 50 people-shots stay parked there as composition reference for AI regeneration. public/img/reference/ holds only the 39 curated no-people copies.

- **Dropped per-image descriptive notes from rebuilt manifest** — Why: after the user's manual reshuffle and rename pass, the old subagent notes could no longer be reliably mapped to the renamed files. The manifest records file + category only. Notes can be regenerated fresh via a subagent in a later session if needed.

- **Tunnels on myro-pro are still config.yml-based (not dashboard-managed)** — Why: the global CLAUDE.md says tunnels went dashboard-managed, but that was on bobclaw. On myro-pro (10.0.0.210), an existing molt-government tunnel uses ~/.cloudflared/*.yml and cloudflared 2026.5.2 is installed and authenticated. Follow the same pattern for the new tunnel.

---

## File paths + line refs

**Project root**: `/Volumes/DevDrive-M4Pro/Projects/allstarbowindy.com`

- `README.md` — drop-in mapping instructions for when the mockup arrives (*.css -> public/css/, *.jsx + data.js -> public/js/, images -> public/img/, "All Star Bowl.html" -> public/index.html; reminder to fix relative asset paths in the entry HTML)
- `public/img/reference/` — 39 curated reference photos, user-reviewed, in category subfolders
- `public/img/reference/reference-manifest.json` — rebuilt from disk post-curation; source of truth for the reference library
- `public/uploads/gmaps-photos/asb-001.jpg` .. `asb-129.jpg` — all 129 originals, untouched
- `public/uploads/gmaps-photos/index.html` — contact sheet for quick visual scan
- `public/uploads/_gmaps_photo_urls.json` — raw extracted URLs from the Maps scrape
- `public/uploads/gmaps-manifest.json` — original subagent classification (all 129; people/category/quality/note per image; stale after curation but kept for reference)
- `docs/allstarbowl-site-audit-handoff.md` — full business content audit (hours, rates, leagues, parties, pro shop, cafe, etc.) — content source of truth for the redesign
- `~/.cloudflared/` — existing tunnel config files on myro-pro; model the new tunnel on whatever yml is there (e.g. molt-government tunnel)
- `~/.claude.json` — Cloudflare MCP config; scoped to /Users/myro-pro project only (tools don't load in this project's sessions)
- `~/.claude/CREDENTIALS.md:~123` — updated CF token note

**Current reference library breakdown:**

| Category | Count | Files |
|----------|-------|-------|
| lanes    | 18    | lanes-01..18.jpg |
| mural    | 5     | mural-01..05.jpg |
| exterior | 4     | exterior-01..04.jpg |
| misc     | 3     | misc-01..03.jpg |
| proshop  | 3     | proshop-01..03.jpg |
| arcade   | 2     | arcade-01..02.jpg |
| lounge   | 2     | lounge-01..02.jpg |
| food     | 1     | food-01.jpg |
| scorer   | 1     | scorer-01.jpg |

---

## Business context (needed for design decisions)

- **Client**: All Star Bowl, 726 N Shortridge Rd, Indianapolis, IN 46219, (317) 352-1848
- **Real domain**: allstarbowlindy.com (NOT allstarbowl.com — that is someone else's)
- East-side Indianapolis family entertainment: bowling, sports bar, cafe, pro shop
- Current live site: dated DNN/BPAA-template. Full content audit at `docs/allstarbowl-site-audit-handoff.md`
- **Mockup format**: static HTML + in-browser JSX (React via CDN/Babel, no build step). Designer's layout: img/ (with menu/ subfolder), css/ (styles.css, home.css, pages.css, components.css), js/ (app.jsx, home.jsx, bowl.jsx, eat.jsx, leagues.jsx, parties.jsx, account.jsx, status.jsx, components.jsx, data.js), screenshots/, uploads/, entry: "All Star Bowl.html"
- **Goal for demo**: get the mockup accessible at allstarbowlindy.myroproductions.com so the user can show the client on-site and let them click around

---

## Next steps + open questions

1. **Build the Cloudflare tunnel** (highest priority — pre-stage before mockup arrives):
   - Named tunnel: suggest `allstarbowl-demo` or similar
   - Route: allstarbowlindy.myroproductions.com -> http://localhost:8080
   - Config: ~/.cloudflared/allstarbowl-demo.yml (follow molt-government pattern on this machine)
   - Ingress: local static server (`python3 -m http.server 8080` from public/ or a lightweight alternative like `npx serve`)
   - launchd plist so it survives restarts: ~/Library/LaunchAgents/com.cloudflare.allstarbowl-demo.plist
   - DNS CNAME in myroproductions.com zone: allstarbowlindy -> <tunnel-uuid>.cfargotunnel.com (proxied)
   - CF MCP tools are NOT available in this project's sessions — use Bash/cloudflared CLI or open a session from ~ to use the MCP
2. **Receive the external mockup** into public/ per README drop-in map; rename entry to index.html; fix relative asset paths.
3. **Verify demo end-to-end**: static server up -> tunnel active -> allstarbowlindy.myroproductions.com loads -> all assets 200.
4. **Optional — AI image generation** (ComfyUI via comfyui-spark2 MCP on BobSpark2 / DGX Spark 2): use empty-lane reference shots to generate people-free stock; prioritize filling lounge (2 shots), party (0 kept), and proshop (3 shots — user flagged as a key draw) gaps. The 50 people-shots in public/uploads/gmaps-photos/ are composition references for regeneration.
5. **Optional — re-caption reference images**: a subagent vision pass on the 39 final files would restore descriptive notes that were dropped during the rename pass. Low priority unless needed for the brief.
6. **Commit** when the user asks — nothing has been committed yet. Files to stage: .gitignore, README.md, docs/, public/ (excluding uploads/gmaps-photos/ if 29MB is too heavy for git — consider .gitignore-ing the originals or using git-lfs).

- ? Old dead CF token "O88szMcu..." — was it ever a real issued token? If so, rotate/delete it in the Cloudflare dashboard to close the credential hygiene loop.
- ? Mockup ETA — unknown. No blockers on our side; tunnel can be ready before it lands.
- ? Should public/uploads/gmaps-photos/ (129 originals, ~29MB) be tracked in git or gitignored? Worth deciding before the first commit.
