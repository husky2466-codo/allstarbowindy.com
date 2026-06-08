/* ============================================================
   All Star Bowl — Pro Shop catalog (shared data model)
   Plain JS → window.PROSHOP. Feeds BOTH the Standard catalog
   and the 3D-style Walk-In sim. Built from docs/proshop-spec.

   HONESTY RULES baked in (see proshop-spec/README):
   - Every product isMock:true → UI shows a "representative pricing,
     not live inventory" disclaimer.
   - Only "Vise" is a store-confirmed brand. Everything else is mock.
   - price.estimate:true → UI prefixes the price with "est."
   - NO checkout anywhere. The cart is a wish list. The conversion
     action is "Reserve / Ask the Pro Shop" (phone + in-store fitting).
   ============================================================ */
(function () {
  "use strict";

  /* Pro-shop hours (from the real posted sign / site audit) */
  var HOURS = [
    { day: "Mon", open: "4:00 PM", close: "8:00 PM" },
    { day: "Tue", open: "11:00 AM", close: "8:00 PM" },
    { day: "Wed", open: "4:00 PM", close: "9:00 PM" },
    { day: "Thu", open: "12:00 PM", close: "7:00 PM" },
    { day: "Fri", open: "5:00 PM", close: "8:00 PM" },
    { day: "Sat", open: "9:30 AM", close: "2:00 PM" },
    { day: "Sun", open: null, close: null }
  ];

  /* Shopper-voiced glossary → inline tooltips (from proshop-spec/03) */
  var GLOSSARY = {
    coverstock: "The outer shell of the ball; controls how much it grips and hooks.",
    core: "The weight block inside; controls how the ball rolls and revs.",
    rg: "How early or late the ball starts to rev. Low = early, high = late / longer.",
    differential: "How much hook potential the core has. More = more flare = more hook.",
    hook: "How much the ball curves toward the pins.",
    "reactive-resin": "The standard modern coverstock that grips the lane and hooks.",
    urethane: "A smoother, more controllable cover; great on dry / short oil.",
    "plastic-ball": "A straight-rolling ball for picking up spares.",
    span: "Distance between your thumb and finger holes — the key fit measurement.",
    pitch: "The angle a finger or thumb hole is drilled at.",
    layout: "How the holes are positioned to aim the ball's reaction.",
    "track-flare": "The migrating oil rings on a rolling ball; more flare = more hook.",
    "slide-sole": "The sole on your sliding foot; swappable to match the approach.",
    abralon: "Sanding-pad grit used to resurface a ball."
  };

  /* Ball-color art tokens → CSS gradient for thumbnails + the 3D wall.
     Colors picked from the real wall palette read in the visual inventory. */
  function ball(c1, c2, c3) { return { kind: "ball", c1: c1, c2: c2, c3: c3 || c1 }; }
  function flat(bg, fg) { return { kind: "flat", c1: bg, c2: fg }; }

  /* ---- The catalog -------------------------------------------------- */
  var PRODUCTS = [
    /* ====== BALLS — New Arrivals wall ====== */
    {
      id: "storm-hy-road", category: "balls", subcategory: "reactive",
      name: "Storm Hy-Road", brand: "Storm", isMock: true, badge: "NEW",
      price: { sale: 138.99, list: 229.99, estimate: false },
      specLine: "Hybrid reactive · medium oil",
      tagline: "The benchmark first hook ball.",
      blurb: "A do-everything hybrid that reads medium oil predictably — the classic first reactive ball that just works.",
      bestFor: "Newer-to-intermediate bowlers wanting controllable hook on house shots.",
      specs: { Coverstock: "Hybrid reactive", Core: "Symmetrical", RG: "2.57", Differential: "0.046", Weights: "12–16 lb" },
      fitNote: "Reserve it here — we'll measure your span and drill it to your hand in the shop.",
      careNote: "Pair with a reactive cleaner + microfiber towel to keep the hook alive.",
      crossSell: ["reacta-clean-8oz", "ball-towel"], glossaryTerms: ["coverstock", "hook", "rg", "differential"],
      art: ball("#3f74e6", "#1a1147", "#6f9bf0"), wall: "balls"
    },
    {
      id: "storm-phaze-ai", category: "balls", subcategory: "reactive",
      name: "Storm Phaze A.I.", brand: "Storm", isMock: true, badge: "NEW",
      price: { sale: 174.95, list: null, estimate: false },
      specLine: "Performance solid · heavy oil",
      tagline: "Tour-level traction.",
      blurb: "A strong solid reactive built to read heavier oil with a controllable, continuous motion.",
      bestFor: "Higher-rev / higher-speed bowlers wanting an early, low-RG read on fresh oil.",
      specs: { Coverstock: "Solid reactive (ERG)", Core: "Asymmetrical", RG: "2.49", Differential: "0.053", Weights: "12–16 lb" },
      fitNote: "Layout matters on a ball this strong — we'll lay it out for your game in-store.",
      careNote: "Heavy-oil balls drink oil fast; a cleaner + extraction keep it fresh.",
      crossSell: ["reacta-clean-8oz", "ball-towel"], glossaryTerms: ["coverstock", "differential", "layout"],
      art: ball("#7b3fe6", "#160a2e", "#b98bff"), wall: "balls"
    },
    {
      id: "hammer-full-effect", category: "balls", subcategory: "reactive",
      name: "Hammer Full Effect", brand: "Hammer", isMock: true, badge: "NEW",
      price: { sale: 194.95, list: 269.99, estimate: false },
      specLine: "Performance hybrid · medium-heavy oil",
      tagline: "Angular and aggressive.",
      blurb: "A performance hybrid with a sharp, defined backend for bowlers who want shape down the lane.",
      bestFor: "Intermediate-to-advanced bowlers wanting an angular backend.",
      specs: { Coverstock: "Hybrid reactive", Core: "Asymmetrical", Weights: "12–16 lb" },
      fitNote: "We'll drill and lay it out to match your rev rate.",
      crossSell: ["reacta-clean-8oz"], glossaryTerms: ["coverstock", "track-flare"],
      art: ball("#e0241f", "#120a0a", "#f0433c"), wall: "balls"
    },
    {
      id: "storm-ion-max-pearl", category: "balls", subcategory: "reactive",
      name: "Storm Ion Max Pearl", brand: "Storm", isMock: true, badge: "NEW",
      price: { sale: 199.95, list: null, estimate: false },
      specLine: "Pearl reactive · length + sharp backend",
      tagline: "Skid-flip on a string.",
      blurb: "A pearl reactive that saves its energy for the back of the lane — long, then a sharp, defined motion.",
      bestFor: "Bowlers wanting more length and a later, angular reaction.",
      specs: { Coverstock: "Pearl reactive", Core: "Symmetrical", Weights: "12–16 lb" },
      fitNote: "We'll fit and drill it to your hand at the counter.",
      crossSell: ["reacta-clean-8oz", "ball-towel"], glossaryTerms: ["coverstock", "hook", "rg"],
      art: ball("#dfe7f2", "#9aa9c4", "#ffffff"), wall: "balls"
    },
    {
      id: "storm-concept", category: "balls", subcategory: "reactive",
      name: "Storm Concept", brand: "Storm", isMock: true, badge: null,
      price: { sale: 189.95, list: null, estimate: false },
      specLine: "Performance solid · all-rounder",
      tagline: "One ball, most patterns.",
      blurb: "A versatile performance solid that handles a wide range of house and sport conditions.",
      bestFor: "Bowlers who want a single strong ball for most nights out.",
      specs: { Coverstock: "Solid reactive", Core: "Symmetrical", Weights: "12–16 lb" },
      fitNote: "Reserve it — we'll drill it to fit in the shop.",
      crossSell: ["reacta-clean-8oz"], glossaryTerms: ["coverstock", "core"],
      art: ball("#13b1a6", "#06302d", "#36e6d8"), wall: "balls"
    },
    {
      id: "storm-bionic", category: "balls", subcategory: "reactive",
      name: "Storm Bionic", brand: "Storm", isMock: true, badge: "DEAL",
      price: { sale: 184.95, list: 259.99, estimate: false },
      specLine: "Performance solid · heavy oil control",
      tagline: "Smooth, strong, controllable.",
      blurb: "A strong solid that reads heavy oil early and smooths out the backend — control over flash.",
      bestFor: "Smoother players who want traction without an over-sharp backend.",
      specs: { Coverstock: "Solid reactive", Core: "Symmetrical", Weights: "12–16 lb" },
      fitNote: "We'll lay it out for a smooth, readable motion.",
      crossSell: ["reacta-clean-8oz", "ball-towel"], glossaryTerms: ["coverstock", "hook"],
      art: ball("#f08522", "#1a0d04", "#ffb04d"), wall: "balls"
    },
    {
      id: "brunswick-rhino", category: "balls", subcategory: "reactive",
      name: "Brunswick Rhino", brand: "Brunswick", isMock: true, badge: "DEAL",
      price: { sale: 85.99, list: 139.95, estimate: false },
      specLine: "Entry reactive · light-medium oil",
      tagline: "Big hook, small price.",
      blurb: "An affordable reactive that introduces real hook without a pro-level price tag.",
      bestFor: "Your first reactive ball on a budget.",
      specs: { Coverstock: "Reactive (R-16 pearl)", Core: "Symmetrical (Low RG)", Weights: "10–16 lb" },
      fitNote: "We'll fit and drill it in-store so it feels like yours.",
      crossSell: ["reacta-clean-8oz"], glossaryTerms: ["reactive-resin", "hook"],
      art: ball("#1b9e3e", "#06210f", "#46d36c"), wall: "balls"
    },
    {
      id: "brunswick-twist", category: "balls", subcategory: "reactive",
      name: "Brunswick Twist", brand: "Brunswick", isMock: true, badge: "DEAL",
      price: { sale: 75.99, list: null, estimate: true },
      specLine: "Entry reactive · dry-medium oil",
      tagline: "Easy, friendly hook.",
      blurb: "The most popular first reactive — forgiving, colorful, and easy to control as you learn to hook it.",
      bestFor: "Beginners stepping up from a house ball.",
      specs: { Coverstock: "Reactive", Core: "Symmetrical", Weights: "8–16 lb" },
      fitNote: "Great first ball — we'll drill it to your hand and show you the basics.",
      crossSell: ["reacta-clean-8oz", "single-tote-bag"], glossaryTerms: ["reactive-resin", "hook"],
      art: ball("#e6399b", "#2a0820", "#ff6fc0"), wall: "balls"
    },
    {
      id: "columbia-white-dot-diamond", category: "balls", subcategory: "spare",
      name: "Columbia 300 White Dot Diamond", brand: "Columbia 300", isMock: true, badge: "CLOSEOUT",
      price: { sale: 63.99, list: 79.99, estimate: false },
      specLine: "Plastic spare ball · goes straight",
      tagline: "Your spare-shooting insurance.",
      blurb: "A straight-rolling plastic ball for picking up corner pins and splits — every serious bowler carries one.",
      bestFor: "Everyone — a dedicated spare ball that ignores the oil.",
      specs: { Coverstock: "Polyester (plastic)", Core: "Spare", Weights: "10–16 lb" },
      fitNote: "Drilled to match your strike ball's grip so it feels familiar.",
      crossSell: ["vise-tote-3ball"], glossaryTerms: ["plastic-ball", "hook"],
      art: ball("#eef1f6", "#c2cad8", "#ffffff"), wall: "balls"
    },
    {
      id: "used-house-ball-14", category: "balls", subcategory: "used",
      name: "Used Ball — assorted", brand: "—", isMock: true, badge: "USED",
      price: { sale: 35.00, list: null, estimate: true },
      specLine: "Pre-owned · drilled or undrilled",
      tagline: "Cheap, cheerful, ready to roll.",
      blurb: "From the used-ball rack — solids and pearls, mostly 10–14 lb. Stock changes constantly, so come see what's in.",
      bestFor: "Beginners, kids, or a backup ball.",
      specs: { Coverstock: "Mixed", Weights: "10–14 lb (typical)" },
      fitNote: "Bring it to the counter — we can re-drill a used ball to fit you.",
      glossaryTerms: ["hook"],
      art: ball("#2a3550", "#0b1224", "#5a6c92"), wall: "balls"
    },

    /* ====== BAGS ====== */
    {
      id: "vise-tote-3ball", category: "bags", subcategory: "roller",
      name: "Vise 3-Ball Roller", brand: "Vise", isMock: true, badge: null,
      price: { sale: 159.00, list: 199.00, estimate: true },
      specLine: "3-ball roller · tournament-ready",
      tagline: "Haul the whole arsenal.",
      blurb: "A wheeled tournament bag for three balls plus shoes and accessories. Vise is the one bag brand we actually stock.",
      bestFor: "League and tournament bowlers carrying multiple balls.",
      specs: { Capacity: "3 balls + shoes", Type: "Wheeled roller" },
      crossSell: [], glossaryTerms: [],
      art: flat("#c8202a", "#0e1a3a"), wall: "bags"
    },
    {
      id: "single-tote-bag", category: "bags", subcategory: "tote",
      name: "Single Tote Bag", brand: "—", isMock: true, badge: null,
      price: { sale: 39.00, list: null, estimate: true },
      specLine: "1-ball tote · grab and go",
      tagline: "Just you and your ball.",
      blurb: "A simple one-ball tote with a shoe pocket — the casual bowler's bag, in a row of colors on the floor.",
      bestFor: "Casual and once-a-week bowlers.",
      specs: { Capacity: "1 ball + shoes", Type: "Soft tote" },
      glossaryTerms: [],
      art: flat("#7b3fe6", "#1a1147"), wall: "bags"
    },

    /* ====== SHOES ====== */
    {
      id: "dexter-pro-boa", category: "shoes", subcategory: "mid",
      name: "Dexter Pro BOA", brand: "Dexter", isMock: true, badge: null,
      price: { sale: 119.95, list: null, estimate: false },
      specLine: "BOA-lace performance · universal slide",
      tagline: "Dial-in fit, dependable slide.",
      blurb: "A BOA dial-lace performance shoe with a comfortable, consistent slide on either foot.",
      bestFor: "League bowlers wanting a reliable, easy-fitting mid-tier shoe.",
      specs: { Slide: "Universal", Sizes: "7–14", Handedness: "Either" },
      fitNote: "Sizing runs brand-specific — try them on at the shop before you commit.",
      glossaryTerms: ["slide-sole"],
      art: flat("#0e1a3a", "#f5b423"), wall: "bags"
    },
    {
      id: "dexter-sst8-boa", category: "shoes", subcategory: "performance",
      name: "Dexter SST 8 Power-Frame BOA", brand: "Dexter", isMock: true, badge: "NEW",
      price: { sale: 249.95, list: null, estimate: false },
      specLine: "Top-tier · interchangeable soles",
      tagline: "The serious bowler's shoe.",
      blurb: "Interchangeable slide and traction soles with a brake heel — tune your slide to any approach.",
      bestFor: "Advanced bowlers who swap soles for approach conditions.",
      specs: { Slide: "Interchangeable", Sizes: "7–15", Handedness: "Right or left (specify)" },
      fitNote: "Handedness-specific — we'll set you up with the right slide foot in-store.",
      glossaryTerms: ["slide-sole", "track-flare"],
      art: flat("#dfe7f2", "#0e1a3a"), wall: "bags"
    },

    /* ====== ACCESSORIES ====== */
    {
      id: "reacta-clean-8oz", category: "accessories", subcategory: "cleaner",
      name: "Storm Reacta Clean (8 oz)", brand: "Storm", isMock: true, badge: null,
      price: { sale: 13.95, list: 21.95, estimate: false },
      specLine: "Reactive ball cleaner · USBC-approved",
      tagline: "Keep the hook alive.",
      blurb: "Pulls lane oil off a reactive cover to restore reaction — the single most impactful care product you can own.",
      bestFor: "Anyone who owns a reactive ball.",
      specs: { Volume: "8 oz", Approval: "USBC-approved" },
      glossaryTerms: ["reactive-resin"],
      art: flat("#2a5bd0", "#eef1f6"), wall: "accessories"
    },
    {
      id: "ball-towel", category: "accessories", subcategory: "towel",
      name: "Microfiber Ball Towel", brand: "—", isMock: true, badge: null,
      price: { sale: 9.95, list: null, estimate: true },
      specLine: "Microfiber shammy · wipes oil between shots",
      tagline: "Wipe down, lock in.",
      blurb: "A microfiber towel to wipe oil off the ball between shots — pairs with any cleaner.",
      bestFor: "Every bowler with their own ball.",
      specs: { Material: "Microfiber" },
      glossaryTerms: [],
      art: flat("#13b1a6", "#06302d"), wall: "accessories"
    },
    {
      id: "wrist-support", category: "accessories", subcategory: "support",
      name: "Wrist Support", brand: "—", isMock: true, badge: null,
      price: { sale: 34.00, list: null, estimate: true },
      specLine: "Stabilizes the wrist for a consistent release",
      tagline: "Steady the release.",
      blurb: "Holds the wrist firm for a repeatable release. Most wrist supports are USBC-legal — check the specific device.",
      bestFor: "Bowlers fighting an inconsistent wrist at release.",
      specs: { Note: "Most models USBC-legal — verify the device" },
      glossaryTerms: [],
      art: flat("#c8202a", "#120a0a"), wall: "accessories"
    },
    {
      id: "grip-sack", category: "accessories", subcategory: "grip",
      name: "Rosin Grip Sack", brand: "—", isMock: true, badge: null,
      price: { sale: 6.50, list: null, estimate: true },
      specLine: "For sweaty hands · improves thumb grip",
      tagline: "Tack up your grip.",
      blurb: "A rosin bag for sweaty hands — improves thumb and finger grip on humid nights.",
      bestFor: "Anyone whose hand slips on the ball.",
      specs: {},
      glossaryTerms: [],
      art: flat("#f5b423", "#3a2a06"), wall: "accessories"
    },

    /* ====== SERVICES ====== */
    {
      id: "service-drill-fit", category: "services", subcategory: "drilling",
      name: "Ball Fitting & Drilling", brand: "All Star Bowl Pro Shop", isMock: true, badge: null,
      price: { sale: 40.00, list: null, estimate: true, unit: "per job" },
      specLine: "Measured fit + custom drill",
      tagline: "We fit it to your hand.",
      blurb: "We measure your span and pitch and drill the ball to fit you — often bundled with a ball purchase.",
      bestFor: "Every ball that leaves the shop.",
      specs: {},
      fitNote: "Walk in or reserve a time — pricing and policy confirmed at the counter.",
      glossaryTerms: ["span", "pitch", "layout"],
      art: flat("#1b3a8f", "#f5f1e6"), wall: "counter"
    },
    {
      id: "service-resurface", category: "services", subcategory: "resurface",
      name: "Resurface & Oil Extraction", brand: "All Star Bowl Pro Shop", isMock: true, badge: null,
      price: { sale: 30.00, list: null, estimate: true, unit: "per job" },
      specLine: "Restore a tired ball's reaction",
      tagline: "Bring the hook back.",
      blurb: "Abralon resurfacing plus oil extraction to restore a ball that's stopped reacting after heavy use.",
      bestFor: "Owned balls that have lost their hook.",
      specs: {},
      fitNote: "Drop it at the counter — turnaround and pricing confirmed in-store.",
      glossaryTerms: ["abralon", "track-flare"],
      art: flat("#172c5e", "#36e6d8"), wall: "counter"
    }
  ];

  /* Category meta for the standard catalog filter bar */
  var CATEGORIES = [
    { key: "all", label: "All", icon: "spark" },
    { key: "balls", label: "Balls", icon: "ball" },
    { key: "bags", label: "Bags", icon: "gift" },
    { key: "shoes", label: "Shoes", icon: "shoe" },
    { key: "accessories", label: "Accessories", icon: "spark" },
    { key: "services", label: "Services", icon: "info" }
  ];

  /* Ball sub-badges that mirror the real wall banners */
  var BALL_FILTERS = [
    { key: "all", label: "All balls" },
    { key: "NEW", label: "New Arrivals" },
    { key: "DEAL", label: "Hot Deals" },
    { key: "USED", label: "Used" }
  ];

  /* ---- Walk-In simulation: scene-node graph ----
     We do NOT have the real 360 panos (gitignored), so this is an
     honest STYLIZED walk-in: discrete scene nodes you "walk" between,
     built from the real zone map in proshop-spec/01 §8. Each node lists
     which product ids surface as wall hotspots (a curated subset).
     NOTE: the PSV 360 walk-in (proshop-walkin.jsx) sources its markers
     from public/data/proshop-hotspots.json, not from TOUR. TOUR is kept
     here for the legacy stylized-tour data shape and as a fallback. */
  var TOUR = [
    {
      id: "door", name: "Front Door", sub: "Step inside off the concourse",
      blurb: "Welcome to the All Star Pro Shop. The lanes are right behind you — straight ahead is the New Arrivals wall.",
      products: []
    },
    {
      id: "balls", name: "New Arrivals Wall", sub: "~44 balls on the chrome slatwall",
      blurb: "The centerpiece. Fresh reactive balls under the orange banner — tap any ball to see specs and reserve a fitting.",
      products: ["storm-phaze-ai", "hammer-full-effect", "storm-ion-max-pearl", "storm-hy-road", "storm-concept", "storm-bionic", "brunswick-rhino", "brunswick-twist", "columbia-white-dot-diamond", "used-house-ball-14"]
    },
    {
      id: "bags", name: "Bags · Shoes · Accessories", sub: "Left of the counter",
      blurb: "Vise roller bags and totes on the floor, shoes on the wall, and the accessory pegboard by the counter.",
      products: ["vise-tote-3ball", "single-tote-bag", "dexter-sst8-boa", "dexter-pro-boa", "reacta-clean-8oz", "ball-towel", "wrist-support", "grip-sack"]
    },
    {
      id: "counter", name: "The Counter", sub: "Stacked-stone service desk",
      blurb: "Where it all comes together. This is where we measure your hand, drill your ball, and answer anything.",
      products: ["service-drill-fit", "service-resurface"]
    }
  ];

  /* ---- New Arrivals wall: slot -> productId references ----
     The 360 walk-in's ball wall sources REAL spec'd balls from the
     enriched catalog (public/data/proshop-catalog.json) by id. Swapping
     a productId here (and in proshop-hotspots.json) re-stocks a wall slot
     with no geometry edits. Every id below is verified to resolve against
     the enriched catalog (see scripts/verify-proshop-ids.* check). */
  var WALL = [
    { slotId: "wall-1", productId: "storm-physix-genesis" },
    { slotId: "wall-2", productId: "hammer-spawn" },
    { slotId: "wall-3", productId: "roto-grip-gremlin-tour-x" },
    { slotId: "wall-4", productId: "brunswick-infinity-quest-pearl" },
    { slotId: "wall-5", productId: "storm-code-crush" },
    { slotId: "wall-6", productId: "hammer-black-widow-toxin-pearl" },
    { slotId: "wall-7", productId: "motiv-venom-hysteria" },
    { slotId: "wall-8", productId: "dv8-heckler-taunt" }
  ];

  /* Tag every curated record with a `kind` so the cart / card know how to
     render it (balls vs. flat goods vs. service). Catalog balls already
     carry kind:"ball" from proshop-catalog.js. */
  PRODUCTS.forEach(function (p) {
    if (!p.kind) {
      p.kind = p.category === "balls" ? "ball"
        : p.category === "services" ? "service"
          : "good";
    }
  });

  /* Curated (non-catalog) items keyed by id for fast lookup. */
  var curatedById = {};
  PRODUCTS.forEach(function (p) { curatedById[p.id] = p; });

  /* byId resolves BOTH the curated hardcoded items AND the enriched
     catalog balls. Curated wins on id collision (hand-authored copy).
     For a catalog ball we delegate to ProShopCatalog (loaded as a plain
     <script> before this file's consumers run). If the catalog hasn't
     resolved yet, this returns null for that id until ProShopCatalog.ready
     fires — walk-in waits on that promise before rendering markers. */
  function byId(id) {
    if (curatedById[id]) return curatedById[id];
    if (window.ProShopCatalog && typeof window.ProShopCatalog.byId === "function") {
      return window.ProShopCatalog.byId(id);
    }
    return null;
  }

  window.PROSHOP = {
    HOURS: HOURS,
    GLOSSARY: GLOSSARY,
    PRODUCTS: PRODUCTS,
    CATEGORIES: CATEGORIES,
    BALL_FILTERS: BALL_FILTERS,
    TOUR: TOUR,
    WALL: WALL,
    byId: byId,
    disclaimer: "Representative pricing for demo — not live inventory. Only Vise is a confirmed in-store brand; all other brands, models and prices are examples. This is a wish list, not a store: come see us to buy."
  };
})();
