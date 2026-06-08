/* ============================================================
   PRO SHOP — enriched ball catalog loader (plain JS, no JSX)
   Fetches public/data/proshop-catalog.json (389 spec'd balls),
   builds an id->ball map, and exposes a ProductDetail-compatible
   product object for any ball id.

     window.ProShopCatalog = {
       ready,            // Promise that resolves when the json is loaded
       byId(id),         // normalized product object OR null
       all(),            // array of all normalized products
       filter(fn),       // array of products matching fn
       featured(n)       // first N balls, for the New Arrivals wall
     }

   HONESTY: the enriched catalog carries specs but NO prices. Every
   ball product here ships with price === null. The shared ProductDetail
   / ProductCard render "Ask at counter" when price is absent — no fake
   numbers are ever shown. (See proshop.jsx PriceBlock + the askPrice flag.)

   Loaded as a normal <script> (NOT type=text/babel) BEFORE the babel
   files that read PROSHOP.byId, so the ready promise is available early.
   ============================================================ */
(function () {
  "use strict";

  var RAW = null;            // { count, balls: [...] }
  var MAP = Object.create(null);
  var LIST = [];             // normalized products, catalog order

  /* Deterministic ball art so each ball gets a distinct, stable gradient.
     ProductArt's "ball" branch reads art.c1 (mid), art.c2 (rim), art.c3
     (highlight). We derive a hue from the id, then bias by coverstock type
     so pearls read lighter / brighter and solids read deeper. */
  function hashStr(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = (h * 16777619) >>> 0;
    }
    return h >>> 0;
  }
  function hsl(h, s, l) { return "hsl(" + h + "," + s + "%," + l + "%)"; }
  function ballArt(ball) {
    var h = hashStr(ball.id) % 360;
    var type = (ball.coverstockType || "").toLowerCase();
    var sat, lMid, lRim, lHi;
    if (type === "pearl") { sat = 78; lMid = 52; lRim = 20; lHi = 78; }
    else if (type === "hybrid") { sat = 72; lMid = 46; lRim = 16; lHi = 70; }
    else if (type === "urethane") { sat = 30; lMid = 40; lRim = 14; lHi = 62; }
    else { sat = 66; lMid = 40; lRim = 13; lHi = 64; } // solid / unknown
    return {
      kind: "ball",
      c1: hsl(h, sat, lMid),                 // mid tone
      c2: hsl((h + 8) % 360, sat - 12, lRim), // dark rim
      c3: hsl((h + 18) % 360, sat, lHi)       // highlight
    };
  }

  /* Pretty-print a release date "2026-05" -> "May 2026". */
  var MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function releaseLabel(rd) {
    if (!rd) return null;
    var m = /^(\d{4})-(\d{2})$/.exec(rd);
    if (!m) return rd;
    return (MONTHS[parseInt(m[2], 10)] || "") + " " + m[1];
  }

  function titleCase(s) {
    if (!s) return s;
    return s.replace(/\b([a-z])/g, function (_, c) { return c.toUpperCase(); });
  }

  /* Map a raw catalog ball into the product shape ProductDetail expects.
     ProductDetail reads: name, brand, tagline, price (PriceBlock),
     blurb, bestFor, specs{}, fitNote, careNote, glossaryTerms[],
     crossSell[], badge, colorNote, category, art. */
  function normalize(ball) {
    var coverFull = ball.coverstock || titleCase(ball.coverstockType || "Reactive");
    var coverType = ball.coverstockType ? titleCase(ball.coverstockType) : null;
    var coreFull = ball.coreName || titleCase(ball.coreType || "");
    var coreType = ball.coreType ? titleCase(ball.coreType) : null;
    var rel = releaseLabel(ball.releaseDate);

    var specs = {};
    specs.Coverstock = coverFull + (coverType && coverFull.toLowerCase().indexOf(coverType.toLowerCase()) < 0 ? " (" + coverType + ")" : "");
    if (coreFull) specs.Core = coreFull + (coreType && coreFull.toLowerCase().indexOf(coreType.toLowerCase()) < 0 ? " (" + coreType + ")" : "");
    else if (coreType) specs.Core = coreType;
    if (ball.rg != null) specs.RG = String(ball.rg);
    if (ball.differential != null) specs.Differential = String(ball.differential);
    if (ball.factoryFinish) specs["Factory finish"] = ball.factoryFinish;
    if (rel) specs.Released = rel;
    specs.Weights = "Typically 12–16 lb (confirm in shop)";

    var glossary = ["coverstock", "core", "rg", "differential", "hook"];

    var tagBits = [];
    if (coverType) tagBits.push(coverType + " reactive");
    if (coreType) tagBits.push(coreType + " core");
    var specLine = tagBits.join(" · ") || coverFull;

    return {
      id: ball.id,
      kind: "ball",
      category: "balls",
      subcategory: "reactive",
      name: ball.name,
      brand: ball.brand || "—",
      isMock: false,
      askPrice: true,         // tells PriceBlock/card to render "Ask at counter"
      price: null,            // NO invented prices, ever
      badge: rel ? "NEW" : null,
      specLine: specLine,
      tagline: (ball.brand ? ball.brand + " " : "") + (coverType ? coverType + " reactive." : "performance ball."),
      blurb: ball.name + " — a " + (coverType ? coverType.toLowerCase() + " " : "") + "reactive ball" +
        (coreType ? " on a " + coreType.toLowerCase() + " core" : "") +
        (rel ? ", released " + rel : "") + ". Specs from the USBC-approved ball list.",
      bestFor: null,
      specs: specs,
      fitNote: "Reserve it here — we measure your span and pitch and drill it to your exact hand in the shop.",
      careNote: "Pair it with a reactive cleaner and a microfiber towel to keep the reaction alive.",
      glossaryTerms: glossary,
      crossSell: ["reacta-clean-8oz", "ball-towel"],
      colorNote: null,
      art: ballArt(ball),
      wall: "balls",
      releaseDate: ball.releaseDate || null
    };
  }

  function ingest(data) {
    RAW = data;
    var balls = (data && data.balls) || [];
    balls.forEach(function (b) {
      if (!b || !b.id || MAP[b.id]) return;
      var prod = normalize(b);
      MAP[b.id] = prod;
      LIST.push(prod);
    });
    return LIST.length;
  }

  var ready = fetch("data/proshop-catalog.json", { cache: "force-cache" })
    .then(function (r) {
      if (!r.ok) throw new Error("proshop-catalog.json HTTP " + r.status);
      return r.json();
    })
    .then(function (data) {
      var n = ingest(data);
      return { count: n };
    })
    .catch(function (err) {
      // Non-fatal: walk-in falls back, standard grid still works.
      if (typeof console !== "undefined" && console.warn) {
        console.warn("[ProShopCatalog] failed to load enriched catalog:", err && err.message);
      }
      return { count: 0, error: String(err && err.message || err) };
    });

  window.ProShopCatalog = {
    ready: ready,
    byId: function (id) { return MAP[id] || null; },
    has: function (id) { return !!MAP[id]; },
    all: function () { return LIST.slice(); },
    filter: function (fn) { return LIST.filter(fn); },
    /* Newest releases first — these are the real "New Arrivals". */
    featured: function (n) {
      return LIST.slice()
        .sort(function (a, b) { return (b.releaseDate || "") < (a.releaseDate || "") ? -1 : 1; })
        .slice(0, n || 12);
    },
    count: function () { return LIST.length; }
  };
})();
