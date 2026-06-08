# Catalog Schema — Shared by Both Shop Modes

Both the standard shop tab and the 3D walk-in sim should read from ONE catalog data source. Pricing/cart is MOCKED — no payment, no real inventory. This is the data shape DesignClaude builds against.

## Product shape

```jsonc
{
  "id": "storm-hy-road",
  "name": "Storm Hy-Road",
  "brand": "Storm",
  "category": "ball",            // ball | bag | shoe | accessory
  "tier": "mid",                 // balls: spare|entry|mid|performance
  "price": 138.99,               // street price (what shows big)
  "listPrice": 229.99,           // optional MSRP for struck-through "SAVE X%"
  "weights": [12,13,14,15,16],   // balls only
  "sizes": null,                 // shoes only
  "gender": null,                // shoes: men|women|unisex
  "handed": null,                // perf shoes/drilled balls: right|left
  "capacity": null,              // bags: 1|2|3|4
  "rolling": null,               // bags: bool
  "image": "/uploads/proshop/storm-hy-road.png",
  "wallSlot": "ball-wall-row2-3",// 3D sim: which shelf/peg it lives on
  "blurb": "Benchmark reactive — the do-everything ball.",
  "addOns": ["drilling"]         // service upsells offered on add-to-cart
}
```

## Service shape

```jsonc
{
  "id": "drilling-fingertip",
  "name": "Fingertip Drilling + Inserts",
  "type": "service",
  "priceFrom": 50,               // "starting at" — services scale with complexity
  "priceTo": 80,                 // optional upper band for honest display
  "blurb": "Custom fit with finger inserts and slug.",
  "appliesTo": "ball"            // surfaces as upsell when a ball is in cart
}
```

## Two shop modes, one data source

- **Standard shop tab:** grid/list of products filtered by `category` and `tier`. Sort by price. Service panel separate. Add-to-mock-cart with optional `addOns`.
- **3D walk-in sim:** same products, placed by `wallSlot` on the real pro-shop geometry. Walk up → item highlights → card pops with `name`/`price`/`blurb` → "Grab it" adds to the same mock cart. The "make it fun" layer: counter clerk line items like the "awkward fee" tooltip, ball-return shelf as the spare/plastic display, etc.

## Tier → wall-zone mapping suggestion (3D sim)

| Tier / category | 3D zone |
|---|---|
| Spare / plastic balls | low shelf near ball return |
| Entry + mid balls | main ball wall (eye level) |
| Performance balls | premium top rack / spotlight |
| Shoes | shoe wall / try-on bench |
| Bags | floor stack + hooks |
| Accessories | counter pegboard + glass case |
| Services | counter terminal / drill-press station |

## Reminder

Every price in docs `01`–`05` is point-in-time June 2026 and hardcodeable for the mock. Anything marked **[UNSOURCED]**, **[NOT SOURCED]**, **[approx]**, or **[band]** is a range estimate — acceptable for a mock catalog, confirm before any claim of "real-time pricing."
