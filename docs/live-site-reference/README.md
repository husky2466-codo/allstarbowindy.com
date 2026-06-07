# Live Site Reference — allstarbowlindy.com

Snapshot of the **current live All Star Bowl website** (`https://www.allstarbowlindy.com/`),
captured **2026-06-07** via the browser's "Save Page As (Complete)" feature.

The live site runs on **DNN (DotNetNuke)** with a dated **BPAA bowling-center template**.
This folder exists purely as **content/structure reference** for the redesign mockup — so the
designer can see what sections and content the current site has (and what the new mockup may be
missing). It is **not** wired into the new build and is **not** meant to run.

## Folders

- `html/` — the saved page HTML
  - `all-star-bowl.html` — homepage as saved by the browser (inlined/rewritten markup)
  - `allstarbowl-index.html` — homepage with the original source URL annotation; cleaner reference for structure/content
  - `embed.html` — the Google Maps embed iframe page used on the site (mostly Google Maps styling; included to document the map placement)
- `css/` — the site's own theme / skin / module stylesheets
  - `base.css`, `default.css`, `container.css`, `portal.css` (DNN League Standings module),
    `SearchSkinObjectPreview.css`, `swcohk2u6gm.css` (Google "Manrope" webfont CSS used by the theme),
    `all.min.css` (**Font Awesome 5.8.0** icon font — third-party but small and part of the live look, so kept)
- `js/` — the site's own DNN / skin scripts
  - `dnn.js`, `dnncore.js`, `dnn.modalpopup.js`, `dnn.servicesframework.js`,
    `SearchSkinObjectPreview.js` (DNN search box), `main.js` (jQuery skin behavior)

## Intentionally excluded (not copied)

Generic libraries, Google Maps payloads, tracking, and ASP.NET runtime cruft — none add design insight:

- **jQuery / jQuery UI / jQuery Migrate / jquery-latest** — library
- **bootstrap.min.css / bootstrap.bundle.min.js** — library
- **Google Maps blobs** — `common.js`, `controls.js`, `log.js`, `map.js`, `util.js`, `geometry.js`,
  `onion.js`, `places.js`, `places_impl.js`, `init_embed.js`, `search.js`, `search_impl.js`,
  `main(1).js`, the `js` / `css` / `css(1)` no-extension files, and all `vt` / `vt(N)` vector-tile files — google-maps
  - Note: the live site's `common.js`, `controls.js`, and `log.js` are **all Google Maps modules**, not DNN scripts despite the names.
- **dc.js** — Google Analytics / DoubleClick tracker — tracking
- **ScriptResource.axd / ScriptResource(1).axd / WebResource.axd** — ASP.NET runtime — axd
- **skin.css** — 0 bytes — empty
- **lb-…js** — 0-byte lazyload stub — empty
- **saved_resource.html / saved_resource(1).html** — 149-byte `about:blank` stubs — redirect-stub
- **.DS_Store** — macOS junk
- All image files (`.png`/`.jpg`) — handled separately by another agent
- `All Star Bowl - LiveScores Login_files/` subfolder — handled separately (see `livescores/`)

## Provenance

Source dump: `/Users/myro-pro/Downloads/All Star Bowl_files/` — copied (never moved); originals untouched.
