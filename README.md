# All Star Bowl — allstarbowlindy.com redesign

Redesign of the All Star Bowl website (East-side Indianapolis family entertainment
center: bowling, sports bar, cafe, pro shop). Replaces the legacy DNN/BPAA template site.

Real business content + full audit of the existing site:
[`docs/allstarbowl-site-audit-handoff.md`](docs/allstarbowl-site-audit-handoff.md).

## Status

Receiving an externally-built static mockup. No build step — the mockup is plain
HTML/CSS + in-browser JSX (React via CDN/Babel), served as static files.

## Folder structure

```
allstarbowindy.com/
├── docs/                  Audit, handoffs, design notes
├── public/                WEB ROOT — everything servable lives here
│   ├── index.html         Entry page (the mockup's "All Star Bowl.html" → renamed here)
│   ├── css/               styles.css, home.css, pages.css, components.css
│   ├── js/                app.jsx, home.jsx, bowl.jsx, eat.jsx, leagues.jsx,
│   │                      parties.jsx, account.jsx, status.jsx, components.jsx, data.js
│   ├── img/               logo.png and imagery
│   │   └── menu/          cafe menu images
│   ├── screenshots/
│   └── uploads/
├── .gitignore
└── README.md
```

## Dropping in the mockup

When the designer's files arrive, place them under `public/` per the map above:

- `*.css`  → `public/css/`
- `*.jsx`, `data.js` → `public/js/`
- images → `public/img/` (cafe menu images → `public/img/menu/`)
- `logo.png` → `public/img/`
- the entry HTML (`All Star Bowl.html`) → `public/index.html`

After copying, check the entry HTML's `<link>` / `<script src>` paths resolve relative
to `public/` (e.g. `css/styles.css`, `js/app.jsx`). Fix paths there, not by moving files.

## Serving locally / for the demo

Static files — any static server works from the `public/` dir, e.g.:

```
cd public && python3 -m http.server 8090 --bind 127.0.0.1
```

(open http://localhost:8090)

Port 8090 is used because 8080 is occupied by another local project on this
machine. On the dev Mac the server runs persistently via a launchd agent
(`~/Library/LaunchAgents/com.allstarbowl.httpd.plist`) so the demo survives
reboot/logout.

## Remote demo

The local server is exposed over the internet via a Cloudflare tunnel through
`myroproductions.com` so the design can be shown on-site and shared:

- **Public URL:** https://allstarbowlindy.myroproductions.com
- **Tunnel:** `myroproductions` (`80721cb3-…`), ingress
  `allstarbowlindy.myroproductions.com → http://localhost:8090`
- **Config:** `~/.cloudflared/partiesbykels.yml`
- Tunnel runs persistently via launchd alongside the static server.

## Business facts

Source of truth is `docs/allstarbowl-site-audit-handoff.md` §1 (hours, rates,
specials, parties, leagues, youth, pro shop, cafe, address/phone).
Real domain: **allstarbowlindy.com** (note: `allstarbowl.com` is NOT theirs).
