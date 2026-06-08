# 04 — Inventory Data Model ("live updated items on the wall")

One data source feeds the standard grid AND the walk-in wall. This is what makes "live updated items on the wall" real: the wall is a *render of the data*, not a hand-placed mural.

---

## 1. Three files (or three API endpoints), one source of truth

| File | Purpose |
|---|---|
| `products.json` | The catalog. Everything shown in both modes. |
| `hotspots.json` | Where each product/zone lives physically on a pano (yaw/pitch per node). Authored once via the marker-placement dev tool (03 §3). |
| `tour.json` | The room: nodes (panos), links, entry view. |

Splitting **what** (product) from **where** (hotspot) matters: products change constantly (new arrivals, sold out); physical wall positions change rarely. A new ball reuses an existing empty slot's hotspot, or gets a new hotspot only when the physical wall layout changes.

---

## 2. `products.json` schema

```jsonc
{
  "updatedAt": "2026-06-07T00:00:00Z",
  "currency": "USD",          // pricing is MOCK — display only, no checkout
  "products": [
    {
      "id": "ball-storm-phaze-iii",     // stable slug, used as marker.data.productId
      "type": "ball",                    // ball | bag | accessory | shoe | service | rental
      "name": "Storm Phaze III",
      "brand": "Storm",
      "category": ["new-arrivals", "balls"],   // drives zone-banner filters
      "tags": ["reactive", "hot-deal"],
      "weights": [12, 13, 14, 15, 16],          // balls only
      "specs": {                                 // free-form, rendered as a table
        "coverstock": "TX-16 Reactive",
        "core": "Velocity (asymmetric)",
        "finish": "Reacta Gloss"
      },
      "price": { "amount": 199.99, "display": "$199.99", "mock": true },
      "availability": "in-stock",        // in-stock | low | sold-out | display-only
      "media": {
        "card": "/img/proshop/balls/storm-phaze-iii.png",     // clean catalog photo (from asb-019 crop or vendor art)
        "thumb": "/img/proshop/balls/storm-phaze-iii-128.webp",
        "ball3d": { "model": "/3d/bowling-ball.glb", "color": "#2a6df0", "coverstock": "pearl" } // shared model recolor
      },
      "cta": { "type": "stub", "label": "Get this ball" },     // mocked; no checkout
      "active": true
    }
  ]
}
```

### Field notes
- `availability` drives wall rendering:
  - `in-stock` → normal marker.
  - `low` → marker with a small "Low stock" flag (fun urgency).
  - `sold-out` → marker hidden on the wall by default (or shown greyed if client wants "see what just sold"). Still listed in standard grid if `active`.
  - `display-only` (house balls, services) → informational card, no CTA stub.
- `category` strings must match zone-banner filter ids (`new-arrivals`, `hot-deals`, `bags`, `accessories`, `shoes`).
- `price.mock: true` is load-bearing — UI shows the "sample pricing" disclaimer whenever mock is true.
- `ball3d` lets one `bowling-ball.glb` represent every ball by swapping material color/finish, avoiding 50 models.

---

## 3. `hotspots.json` schema

```jsonc
{
  "hotspots": [
    {
      "id": "slot-ballwall-r3c4",      // a physical position on a wall
      "nodeId": "node-ballwall",       // which pano this lives in
      "kind": "product",               // product | zone | nav
      "position": { "yaw": 1.92, "pitch": 0.08 },   // RADIANS, authored via dev tool
      "productId": "ball-storm-phaze-iii",          // who is in this slot right now
      "size": { "width": 64, "height": 64 },        // marker hit/visual size in px
      "label": "Storm Phaze III"
    },
    {
      "id": "zone-new-arrivals",
      "nodeId": "node-ballwall",
      "kind": "zone",
      "position": { "yaw": 2.10, "pitch": 0.34 },
      "filter": "new-arrivals",
      "label": "NEW ARRIVALS"
    },
    {
      "id": "nav-ballwall-to-counter",
      "nodeId": "node-ballwall",
      "kind": "nav",
      "position": { "yaw": 0.15, "pitch": -0.55 },   // on the carpet
      "target": "node-counter"
    }
  ]
}
```

### How "live wall" works
- The viewer iterates `hotspots` for the current node.
- For each `kind:"product"` hotspot, it resolves `productId` against `products.json`.
  - If the product is missing / `active:false` / `sold-out` (and hide-sold-out is on) → **no marker rendered** (empty slot).
  - Else → render marker; click opens that product's card.
- **To update the wall, you edit `products.json`** (swap the `productId` in a slot, flip availability, add a new product to an existing empty slot). The wall re-renders. No code, no re-placing markers.

### Live data options (pick per phase, see 06)
- **MVP/demo:** static `products.json` in the repo. "Live" = edit the file + redeploy. Honest and instant.
- **v1:** a CMS-backed or sheet-backed JSON (e.g. a published Google Sheet → JSON, or the existing site CMS). Staff edit inventory in a familiar tool; site fetches on load.
- **Stretch:** real POS/inventory feed. Out of scope unless the shop's POS exposes an API — most don't cleanly, so assume the v1 CMS path is the realistic ceiling. Do not promise live POS sync without confirming the POS first.

---

## 4. `tour.json` schema

```jsonc
{
  "defaultNode": "node-ballwall",
  "nodes": [
    {
      "id": "node-ballwall",
      "panorama": "/uploads/gmaps-photos/asb-133-proshop-360-pano.jpg",
      "name": "New Arrivals Wall",
      "initialView": { "yaw": 2.0, "pitch": 0.05, "zoom": 45 },
      "links": ["node-counter"]
    },
    {
      "id": "node-counter",
      "panorama": "/uploads/gmaps-photos/asb-132-proshop-360-pano.jpg",
      "name": "Service Counter",
      "initialView": { "yaw": 0.0, "pitch": 0.0, "zoom": 50 },
      "links": ["node-ballwall", "node-wide"]
    },
    {
      "id": "node-wide",
      "panorama": "/uploads/gmaps-photos/asb-079.jpg",
      "name": "Shop Floor",
      "links": ["node-counter"],
      "lowRes": true               // 1600×800 — flag so UI can soften zoom limits
    }
  ]
}
```

---

## 5. TypeScript types (for `shared/types.ts`)

```ts
type Availability = 'in-stock' | 'low' | 'sold-out' | 'display-only';
type ProductType = 'ball' | 'bag' | 'accessory' | 'shoe' | 'service' | 'rental';

interface Product {
  id: string;
  type: ProductType;
  name: string;
  brand?: string;
  category: string[];
  tags?: string[];
  weights?: number[];
  specs?: Record<string, string>;
  price: { amount: number; display: string; mock: true };
  availability: Availability;
  media: {
    card: string; thumb: string;
    ball3d?: { model: string; color: string; coverstock?: string };
  };
  cta: { type: 'stub'; label: string };
  active: boolean;
}

interface Hotspot {
  id: string;
  nodeId: string;
  kind: 'product' | 'zone' | 'nav';
  position: { yaw: number; pitch: number };  // radians
  size?: { width: number; height: number };
  label?: string;
  productId?: string;   // kind=product
  filter?: string;      // kind=zone
  target?: string;      // kind=nav
}

interface TourNode {
  id: string; panorama: string; name: string;
  initialView?: { yaw: number; pitch: number; zoom: number };
  links: string[]; lowRes?: boolean;
}
```

---

## 6. Validation / safety
- Validate `products.json` against the schema on load; a malformed entry must not crash the viewer — skip it and log.
- Treat the data file as untrusted input if it ever becomes CMS/sheet-fed (sanitize strings rendered into the DOM; no raw HTML from product fields).
- Every product image referenced must exist; missing `media.card` → render a placeholder, never a broken-image marker.
