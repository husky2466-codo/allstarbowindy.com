# Pro Shop Services — Pricing Spec

These are LABOR/SERVICE line items, not products. A real pro shop's margin lives here. Present them as a separate "Services" panel (flat-rate or "starting at"), distinct from the product catalog. Checkout is mocked, so these are display + add-to-mock-cart only.

| Service | What it is | Price (street) | Source |
|---|---|---|---|
| Conventional drilling | Basic 3-hole drill, no inserts | $30 – $50 | flyingbowling.com 2026 guide |
| Fingertip drilling + inserts | Custom fit with finger inserts/slug | $50 – $80 | flyingbowling.com 2026 guide |
| Drilling (overall typical) | Standard drill range | $40 – $80 | flyingbowling.com / costdigest |
| "Awkward fee" (online-bought ball) | Surcharge to drill a ball bought elsewhere | $40 – $70 | flyingbowling.com 2026 guide |
| Plug & redrill | Fill old holes, re-layout | ~$40 – $70 (plug) + drill | kelleysproshop / buddiesproshop (services list) **[band]** |
| Resurfacing (standard) | Restore surface/friction | $25 – $70 | costdigest 2026 |
| Resurfacing (premium / extra work) | With added finish work | $90 – $100 | costdigest 2026 |
| Light resurface / maintenance | Quick friction restore (~every 60 games) | $20 – $30 | flyingbowling.com / costdigest |
| Oil extraction (detox) | Bake/extract absorbed oil (~every 100 games) | $20 – $40 | buddiesproshop / costdigest |
| Interchangeable thumb insert install | Install switch-grip style thumb system | ~$30 – $50 (parts + labor) | flyingbowling.com (band) **[approx]** |
| Insert / slug install (finger) | Install gripping inserts | ~$10 – $25 | buddiesproshop services (snippet) **[band]** |

## Service price bands

| Service | Band |
|---|---|
| Conventional drilling | $30 – $50 |
| Fingertip drilling + inserts | $50 – $80 |
| Plugging | $40 – $70 |
| Resurfacing | $25 – $100 |
| Oil extraction / detox | $20 – $40 |
| Insert / slug install | $10 – $50 |

## Build notes

- Model services as a distinct type with `price_from` (since real shops quote "starting at"). Some are flat, some scale with complexity — `price_from` covers both honestly.
- Natural cross-sell: when a ball is added to the mock cart, offer "+ Drilling & Fit ($40-$70)" as an upsell line. This mirrors real pro-shop flow and is good demo material.
- The "awkward fee" is a real and somewhat humorous line item — fits the client's "make it fun" ask. Worth a tooltip in the 3D sim ("Bought it online? That'll cost ya extra.").
- Items marked **[band]** / **[approx]** are sourced to a range, not a single confirmed figure — fine for a MOCK services menu.
