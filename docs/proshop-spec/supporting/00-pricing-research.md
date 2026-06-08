# Pro Shop Pricing Research — 2026 Market Data

**Business:** All Star Bowl, 726 N Shortridge Rd, Indianapolis IN 46219
**Purpose:** Real 2026 street-price reference for the pro-shop spec (standard shop tab + 3D walk-in sim). Checkout is OUT of scope; cart and prices are MOCKED. This doc gives DesignClaude realistic numbers and real product names to populate the mock catalog.
**Researched:** 2026-06-07. All prices are US retailer street prices (sale prices common in this category — MSRP often 30-40% higher than street).

> Methodology note: bowlingball.com blocks automated fetch (HTTP 403), so its figures come from search-result snippets; bowling.com, bowlersmart.com, krstrikeforce.com and dexterbowling.com were used for confirmed exact prices. Every price band cites its source. Items that could not be sourced to an exact figure are marked **[UNSOURCED — estimate]** or **[NOT SOURCED]**.

---

## Pricing model guidance for the build

- The pro-shop catalog should carry a **street price** (what you'd actually pay) and optionally a **list/MSRP** with a "SAVE X%" badge — this matches how every bowling retailer presents pricing and reads as authentic.
- Balls dominate the catalog and are the natural "hero" items for the 3D wall-walk. Tier them visually: Spare (plastic) → Entry reactive → Mid/benchmark → High-performance.
- Services (drilling, plugging, resurfacing) are NOT products — they're a separate "Pro Shop Services" panel with flat-rate or "starting at" pricing. These are where a real pro shop makes margin; surface them prominently.
- Prices below are point-in-time June 2026. Treat them as representative bands, not live quotes. The mock catalog can hardcode them.

---

## Category price bands (summary — full tables in companion docs)

| Category | Typical street-price band |
|---|---|
| Spare / plastic balls | $50 – $90 |
| Entry reactive balls | $75 – $140 |
| Mid / benchmark reactive balls | $130 – $175 |
| High-performance balls | $175 – $260 |
| Bags (tote/single/double) | $30 – $90 |
| Bags (3-ball roller / tournament) | $120 – $290 |
| Shoes (rental-grade / entry athletic) | $40 – $80 |
| Shoes (athletic / mid) | $80 – $130 |
| Shoes (performance / interchangeable BOA) | $130 – $260 |
| Accessories (tape, grip, towel, cleaner) | $5 – $30 |
| Wrist supports | $20 – $70 |
| Pro-shop services (per job) | $10 – $100 |

See companion docs:
- `01-balls.md`
- `02-bags.md`
- `03-shoes.md`
- `04-accessories.md`
- `05-services.md`
- `06-catalog-schema.md` (data shape for the mock catalog — both shop modes share it)

---

## Source index

All sources accessed 2026-06-07.

- bowling.com — confirmed exact prices (Hy-Road, White Dot, Reacta Clean, IQ Tour, bags, shoes)
- bowlersmart.com — Storm 2026 releases, bags, Phaze 3, Reacta Clean sizes
- bowlingball.com — via search snippets only (fetch blocked 403): Phaze A.I., shoes, accessories counts
- krstrikeforce.com — Flyer entry shoes
- dexterbowling.com — SST 8 / Pro BOA performance shoes
- expertbowler.com — category buying guides, price-band sanity checks
- flyingbowling.com / costdigest.org / kelleysproshop.com / buddiesproshop.com — service pricing (drilling, plugging, resurfacing, insert install)
