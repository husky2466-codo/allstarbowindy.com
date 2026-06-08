# 06 — Shared Product Data Model

One schema feeds **both** the Standard shop (`04`) and the 3D walk-in (`05`). The 3D wall references products by `id`; physical marker positions live separately in `hotspots.json` (see `05`). Build the data + the shared `ProductDetail` renderer once.

**File:** `public/js/proshop-data.js` (static, no backend — matches the repo's existing `data.js` convention). Export an array of product objects.

---

## 1. Schema (per product)

```jsonc
{
  "id": "storm-hy-road",            // stable slug; deep-link + wall-slot key
  "category": "balls",              // balls | bags | shoes | accessories | services
  "subcategory": "reactive",        // balls: spare|urethane|reactive|particle; shoes: athletic|performance; bags: tote|roller; etc.
  "name": "Storm Hy-Road",
  "brand": "Storm",                 // "—" if unknown; only "Vise" is store-confirmed
  "isMock": true,                   // ALWAYS true here — representative, not confirmed store stock
  "badge": "NEW",                   // NEW | DEAL | USED | CLOSEOUT | null  (mirrors real wall banners)

  "price": {                        // ALL prices mock; see 02-pricing.md
    "sale": 138.99,
    "list": 229.99,                 // null if no struck-through price
    "estimate": false,              // true => UI must label it "est." (unsourced band guess)
    "unit": null                    // e.g. "per job" for services
  },

  "specLine": "Hybrid reactive · medium oil",   // ONE line for the card
  "tagline": "The benchmark first hook ball.",
  "blurb": "A do-everything hybrid that reads medium oil predictably — the classic first reactive ball.",
  "bestFor": "Newer-to-intermediate bowlers wanting controllable hook on house shots.",

  "specs": {                        // full table for the PDP; keys optional per category
    "coverstock": "Hybrid reactive",
    "core": "Symmetrical",
    "rg": "2.57",
    "differential": "0.046",
    "weights": [12, 13, 14, 15, 16]
  },

  "fitNote": "Reserve it here — we'll measure your span and drill it to your hand in the shop.",
  "careNote": "Pair with a reactive ball cleaner + microfiber towel to keep the hook alive.",
  "crossSell": ["reacta-clean-8oz", "ball-towel", "vise-tote-3ball"],
  "glossaryTerms": ["coverstock", "hook", "rg", "differential", "span"],

  "colorTags": ["blue", "black", "silver"],   // for ball color filter + 3D ball recolor
  "image": "public/img/proshop/storm-hy-road.png",  // clean-backdrop crop; null => use recolored model-viewer ball
  "wallSlot": "new-arrivals-r2-c3"            // optional; null if not on the 3D wall (grid-only)
}
```

**Notes for the builder:**
- `isMock` is always `true` in this mock catalog. The UI uses it to drive the "representative pricing / not live inventory" disclaimer.
- `price.estimate: true` forces an "est." label (use for band-guessed, unsourced items per `02`).
- `wallSlot` ties a product to a 3D hotspot position; the wall is a curated subset, so most grid items have `wallSlot: null`.
- Services use `price.unit: "per job"` and may set `price.list: null`.

---

## 2. Example products (concrete mock data to start from)

Drawn from the real inventory (`01`) and verified pricing (`02`). 12 entries spanning every category.

```jsonc
[
  {
    "id": "storm-hy-road", "category": "balls", "subcategory": "reactive",
    "name": "Storm Hy-Road", "brand": "Storm", "isMock": true, "badge": "NEW",
    "price": { "sale": 138.99, "list": 229.99, "estimate": false, "unit": null },
    "specLine": "Hybrid reactive · medium oil",
    "tagline": "The benchmark first hook ball.",
    "blurb": "A do-everything hybrid that reads medium oil predictably.",
    "bestFor": "Newer-to-intermediate bowlers wanting controllable hook.",
    "specs": { "coverstock": "Hybrid reactive", "core": "Symmetrical", "rg": "2.57", "differential": "0.046", "weights": [12,13,14,15,16] },
    "fitNote": "Reserve it here — we'll drill it to your hand in the shop.",
    "careNote": "Pair with a cleaner + towel to keep the hook alive.",
    "crossSell": ["reacta-clean-8oz","ball-towel"], "glossaryTerms": ["coverstock","hook","rg","differential"],
    "colorTags": ["blue","black","silver"], "image": null, "wallSlot": "new-arrivals-r2-c3"
  },
  {
    "id": "columbia-white-dot-diamond", "category": "balls", "subcategory": "spare",
    "name": "Columbia 300 White Dot Diamond", "brand": "Columbia 300", "isMock": true, "badge": "CLOSEOUT",
    "price": { "sale": 63.99, "list": 79.99, "estimate": false, "unit": null },
    "specLine": "Plastic spare ball · goes straight",
    "tagline": "Your spare-shooting insurance.",
    "blurb": "A straight-rolling plastic ball for picking up corner pins and splits.",
    "bestFor": "Every bowler — a dedicated spare ball.",
    "specs": { "coverstock": "Polyester (plastic)", "core": "Spare", "weights": [10,12,14,15,16] },
    "fitNote": "Drilled to match your strike ball's grip so it feels familiar.",
    "crossSell": ["vise-tote-3ball"], "glossaryTerms": ["plastic-ball","hook"],
    "colorTags": ["white"], "image": null, "wallSlot": "new-arrivals-r5-c1"
  },
  {
    "id": "brunswick-rhino", "category": "balls", "subcategory": "reactive",
    "name": "Brunswick Rhino", "brand": "Brunswick", "isMock": true, "badge": "DEAL",
    "price": { "sale": 85.99, "list": 139.95, "estimate": false, "unit": null },
    "specLine": "Entry reactive · light-medium oil",
    "tagline": "Big hook, small price.",
    "blurb": "An affordable reactive that introduces real hook without a pro-level price.",
    "bestFor": "First reactive ball on a budget.",
    "specs": { "coverstock": "Reactive (R-16 pearl)", "core": "Symmetrical (Rhino Low RG)", "weights": [10,12,13,14,15,16] },
    "fitNote": "We'll fit and drill it in-store.",
    "crossSell": ["reacta-clean-8oz"], "glossaryTerms": ["reactive-resin","hook"],
    "colorTags": ["red","black","gold"], "image": null, "wallSlot": "hot-deals-r1-c2"
  },
  {
    "id": "storm-phaze-ai", "category": "balls", "subcategory": "reactive",
    "name": "Storm Phaze A.I.", "brand": "Storm", "isMock": true, "badge": "NEW",
    "price": { "sale": 174.95, "list": null, "estimate": false, "unit": null },
    "specLine": "Performance solid · heavy oil",
    "tagline": "Tour-level traction.",
    "blurb": "A strong solid reactive built to read heavier oil with a controllable, continuous motion.",
    "bestFor": "Higher-rev / higher-speed bowlers (low-RG read) on fresh oil.",
    "specs": { "coverstock": "Solid reactive (ERG)", "core": "Asymmetrical", "rg": "2.49", "differential": "0.053", "weights": [12,13,14,15,16] },
    "fitNote": "Layout matters on a ball this strong — we'll lay it out for your game in-store.",
    "careNote": "Heavy-oil balls drink oil fast; cleaner + extraction keep it fresh.",
    "crossSell": ["reacta-clean-8oz","ball-towel"], "glossaryTerms": ["coverstock","differential","layout"],
    "colorTags": ["purple","black"], "image": null, "wallSlot": "new-arrivals-r1-c5"
  },
  {
    "id": "hammer-full-effect", "category": "balls", "subcategory": "reactive",
    "name": "Hammer Full Effect", "brand": "Hammer", "isMock": true, "badge": "NEW",
    "price": { "sale": 194.95, "list": 269.99, "estimate": false, "unit": null },
    "specLine": "Performance hybrid · medium-heavy oil",
    "tagline": "Angular and aggressive.",
    "blurb": "A performance hybrid with a sharp, defined backend for bowlers who want shape.",
    "bestFor": "Intermediate-to-advanced bowlers wanting angular backend.",
    "specs": { "coverstock": "Hybrid reactive", "core": "Asymmetrical", "weights": [12,13,14,15,16] },
    "fitNote": "We'll drill and lay it out to match your rev rate.",
    "crossSell": ["reacta-clean-8oz"], "glossaryTerms": ["coverstock","track-flare"],
    "colorTags": ["black","red"], "image": null, "wallSlot": "new-arrivals-r1-c7"
  },
  {
    "id": "used-house-ball-14", "category": "balls", "subcategory": "spare",
    "name": "Used Ball — 14 lb (assorted)", "brand": "—", "isMock": true, "badge": "USED",
    "price": { "sale": 35.0, "list": null, "estimate": true, "unit": null },
    "specLine": "Pre-owned · drilled or undrilled",
    "tagline": "Cheap, cheerful, ready to roll.",
    "blurb": "From the used-ball rack — solids and pearls, mostly 10–14 lb. Stock changes constantly.",
    "bestFor": "Beginners, kids, or a backup ball.",
    "specs": { "weights": [10,12,14] },
    "fitNote": "Bring it to the counter — we can re-drill a used ball to fit you.",
    "glossaryTerms": ["hook"], "colorTags": ["black","pink","teal","navy"], "image": null, "wallSlot": "used-rack-tier1"
  },
  {
    "id": "vise-tote-3ball", "category": "bags", "subcategory": "roller",
    "name": "Vise 3-Ball Roller", "brand": "Vise", "isMock": true, "badge": null,
    "price": { "sale": 159.0, "list": 199.0, "estimate": true, "unit": null },
    "specLine": "3-ball roller · tournament-ready",
    "tagline": "Haul the whole arsenal.",
    "blurb": "A wheeled tournament bag for three balls plus shoes and accessories.",
    "bestFor": "League and tournament bowlers carrying multiple balls.",
    "specs": { "capacity": "3 balls + shoes" },
    "crossSell": [], "glossaryTerms": [], "colorTags": ["red","black"],
    "image": "public/img/proshop/vise-3ball-roller.png", "wallSlot": "bag-wall-roller-1"
  },
  {
    "id": "single-tote-bag", "category": "bags", "subcategory": "tote",
    "name": "Single Tote Bag", "brand": "—", "isMock": true, "badge": null,
    "price": { "sale": 39.0, "list": null, "estimate": true, "unit": null },
    "specLine": "1-ball tote · grab and go",
    "tagline": "Just you and your ball.",
    "blurb": "A simple one-ball tote with a shoe pocket — the casual bowler's bag.",
    "bestFor": "Casual and once-a-week bowlers.",
    "specs": { "capacity": "1 ball + shoes" },
    "colorTags": ["purple","pink","gray","orange","blue"], "image": null, "wallSlot": "bag-floor-row-1"
  },
  {
    "id": "dexter-pro-boa", "category": "shoes", "subcategory": "mid",
    "name": "Dexter Pro BOA", "brand": "Dexter", "isMock": true, "badge": null,
    "price": { "sale": 119.95, "list": null, "estimate": false, "unit": null },
    "specLine": "BOA-lace performance shoe · universal slide",
    "tagline": "Dial-in fit, dependable slide.",
    "blurb": "A BOA dial-lace performance shoe with a comfortable, consistent slide.",
    "bestFor": "League bowlers wanting a reliable mid-tier shoe.",
    "specs": { "handedness": "both", "slideSole": "universal", "sizes": "7-14" },
    "fitNote": "Sizing runs brand-specific — try them on at the shop.",
    "glossaryTerms": ["slide-sole"], "colorTags": ["black"], "image": null, "wallSlot": "shoe-wall-1"
  },
  {
    "id": "dexter-sst8-boa", "category": "shoes", "subcategory": "performance",
    "name": "Dexter SST 8 Power-Frame BOA", "brand": "Dexter", "isMock": true, "badge": "NEW",
    "price": { "sale": 249.95, "list": null, "estimate": false, "unit": null },
    "specLine": "Top-tier performance · interchangeable soles",
    "tagline": "The serious bowler's shoe.",
    "blurb": "Interchangeable slide and traction soles with a brake heel — tune your slide to the approach.",
    "bestFor": "Advanced bowlers who change soles for approach conditions.",
    "specs": { "handedness": "right or left (specify)", "slideSole": "interchangeable", "sizes": "7-15" },
    "fitNote": "Handedness-specific — we'll set you up with the right slide foot in-store.",
    "glossaryTerms": ["slide-sole","track-flare"], "colorTags": ["white","black"], "image": null, "wallSlot": "shoe-wall-2"
  },
  {
    "id": "reacta-clean-8oz", "category": "accessories", "subcategory": "cleaner",
    "name": "Storm Reacta Clean (8 oz)", "brand": "Storm", "isMock": true, "badge": null,
    "price": { "sale": 13.95, "list": 21.95, "estimate": false, "unit": null },
    "specLine": "Reactive ball cleaner · USBC-approved",
    "tagline": "Keep the hook alive.",
    "blurb": "Pulls lane oil off a reactive cover to restore reaction — the single most impactful care product.",
    "bestFor": "Anyone who owns a reactive ball.",
    "specs": { "volume": "8 oz" },
    "glossaryTerms": ["reactive-resin"], "colorTags": [], "image": null, "wallSlot": "accessory-pegboard"
  },
  {
    "id": "service-drill-fit", "category": "services", "subcategory": "drilling",
    "name": "Ball Fitting & Drilling", "brand": "All Star Bowl Pro Shop", "isMock": true, "badge": null,
    "price": { "sale": 40.0, "list": null, "estimate": true, "unit": "per job" },
    "specLine": "Measured fit + custom drill",
    "tagline": "We fit it to your hand.",
    "blurb": "We measure your span and pitch and drill the ball to fit you — often bundled with a ball purchase.",
    "bestFor": "Every ball that leaves the shop.",
    "specs": {},
    "fitNote": "Walk in or reserve a time — pricing/policy confirmed at the counter.",
    "glossaryTerms": ["span","pitch","layout"], "colorTags": [], "image": null, "wallSlot": null
  }
]
```

---

## 3. Honesty constraints on the data (enforce in the UI)

- Every record has `isMock: true` → the shop shows a visible "representative pricing, not live inventory" disclaimer.
- `price.estimate: true` records (used ball, both bags, fitting service) → UI must prefix the price with "est."
- `brand: "—"` is normal and honest; don't invent brands. Only `"Vise"` is a store-confirmed brand.
- No `price` field anywhere implies a checkout total. Totals in "My List" are labeled estimates.
- `wallSlot` keys map to `hotspots.json` positions in `05`; products with `wallSlot: null` are grid-only.
