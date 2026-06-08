# Pro Shop — Mock Catalog Data Model

**Scope:** A single shared product dataset feeds BOTH the standard web shop and the 3D walk-in simulation. Pricing and cart are **mocked** — no checkout, no payment, no inventory truth. All prices are illustrative.

**Design principle:** One JSON file is the source of truth. The standard shop renders it as a grid/list; the 3D scene maps each product to a wall hotspot via `zone` + `slot`. Change data once, both views update.

---

## File

`public/data/proshop-catalog.json` (suggested path). Static, no backend needed.

## Top-level shape

```jsonc
{
  "meta": {
    "store": "All Star Bowl Pro Shop",
    "address": "726 N Shortridge Rd, Indianapolis IN 46219",
    "currency": "USD",
    "pricingDisclaimer": "Prices shown are for demonstration only. Visit the pro shop for current pricing.",
    "checkoutEnabled": false
  },
  "categories": [ /* see below */ ],
  "products": [ /* see below */ ]
}
```

## Category enum

| id | label | maps to zone |
|---|---|---|
| `balls-new` | New Arrivals | Zone B |
| `balls-deals` | Hot Deals | Zone C |
| `balls-used` | Used Balls | Zone E |
| `bags` | Bags | Zone A / Zone B floor |
| `shoes` | Shoes | Zone A |
| `accessories` | Accessories | Zone A pegboard / counter |
| `services` | Pro Shop Services (info only) | Zone D counter |

## Product object

```jsonc
{
  "id": "ball-new-001",
  "category": "balls-new",
  "name": "Storm Phaze II",          // mock/representative — see realism note
  "brand": "Storm",                  // mock unless confirmed (only Vise is confirmed)
  "isMock": true,                    // true = name/brand representative, not a confirmed in-store SKU
  "price": 189.99,                   // mocked
  "salePrice": null,                 // set for balls-deals
  "weightOptions": [12,13,14,15,16], // lbs, where relevant
  "finish": "purple/blue galaxy pearl reactive",
  "colorTags": ["purple","blue"],
  "badge": "NEW",                    // NEW | DEAL | USED | null
  "shortDesc": "Aggressive reactive pearl for medium-heavy oil.",
  "image": "/img/proshop/balls/ball-new-001.png",  // see asset note
  "scene": {
    "zone": "B",                     // A | B | C | D | E
    "row": 0, "col": 3,              // grid slot on the wall (for 3D hotspot placement)
    "hotspotId": "B-r0-c3"
  },
  "inStock": true                    // mocked; drives a subtle "available" pill
}
```

### Field notes
- **`isMock`** — REQUIRED honesty flag. Only **Vise** bag products may set `isMock: false`. Everything else is representative. This keeps us from claiming false inventory. UI may show mock items identically; the flag is for internal integrity + an optional footnote.
- **`salePrice`** — only `balls-deals` items. Standard shop shows strikethrough; 3D shows a "DEAL" badge.
- **`scene.row/col`** — drives where the ball sits on the slatwall in the 3D view. Must be unique within a zone.
- **`image`** — see asset strategy below; can be omitted for v1 and rendered as a colored sphere/placeholder.

---

## How many records to author (mock seed counts)

| Category | Records | Rationale (from inventory) |
|---|---|---|
| `balls-new` | ~24 | Representative subset of the ~44-ball wall (don't need all 44 for a demo). |
| `balls-deals` | ~12 | Subset of HOT DEALS wall. |
| `balls-used` | ~12 | The 12 from the photographed house rack. |
| `bags` | ~10 | Include the confirmed **Vise** totes (isMock:false). |
| `shoes` | ~8 | Generic men's/women's/youth pairs. |
| `accessories` | ~12 | Tape, grips, inserts, wrist supports, towels, cleaner, rosin, shoe brush, slide sole, etc. |
| `services` | ~4 | Ball drilling/fitting, plugging & re-drill, league sign-up info, lessons — INFO cards, price "Ask in shop". |
| **Total** | **~82** | Enough to feel full; not so much it's a chore. |

---

## Image / asset strategy (tiered)

The repo has NO clean cut-out product images — only the in-situ photos and AI scenes. Options, cheapest first:

1. **v1 (no new assets):** Render balls as procedurally colored glossy spheres from `colorTags`/`finish`; bags/shoes/accessories use simple icon tiles. Zero asset work. Standard shop = colored chips + text cards.
2. **v2 (crop from photos):** Crop individual balls/bags out of `asb-019.jpg` (head-on, good quality) for the New Arrivals wall. Limited but real.
3. **v3 (generate):** Use the local ComfyUI pipeline to generate clean cut-out product renders per finish. Highest polish, most effort. Only if the client wants the "fun" version pushed hard.

**Recommendation:** Build v1 data + procedural rendering first; it makes both shop modes work end-to-end with zero asset blocking. Upgrade images later without touching the data model.

---

## Realism / honesty constraints (do NOT skip)

- The ONLY brand text confirmed legible in photos is **Vise** (bags). Storm, Roto Grip, Track, Hammer, etc. are **inferred** from finish styles — author them with `isMock:true`.
- Do not invent specific real-world prices as if authoritative — the `pricingDisclaimer` + `checkoutEnabled:false` must be visible to the user.
- "Used balls" weights (10, 14, etc.) are readable on the rack and may be used literally.
- Services (drilling/fitting) are real services any pro shop offers, but mark prices "Ask in shop."
