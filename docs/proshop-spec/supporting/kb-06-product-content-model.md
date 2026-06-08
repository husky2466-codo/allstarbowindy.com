# Product-Detail Content Model

> The reusable *content fields* each product type carries on a detail page (standard shop) or wall item (3D walk-in shop). This is the bridge: KB knowledge → structured fields → DesignClaude's components.
>
> **Scope note:** this defines the **content/copy fields**, not the data plumbing. The canonical *data schema* (IDs, hotspot coordinates, live-wall wiring, price source) is owned by the inventory spec (`04-inventory-data-model.md` from ArchitectClaude / the inventory author). Where they overlap, the inventory schema wins on structure; this doc supplies the *content* that fills it. Prices are mocked (out of scope here).

---

## Design principle: write once, render in both modes

A product's detail content must be **mode-agnostic**. The exact same content block renders whether the shopper:
- clicked a card in the standard shop grid, OR
- walked up to the item on the 3D pro-shop wall and "got" it.

So: no field should assume a layout. Give DesignClaude content + semantics; let the two modes present it differently (full page vs floating product card/modal).

---

## Universal fields (every product type)

| Field | Type | Notes |
|---|---|---|
| `name` | string | Product name, e.g. "Storm Hy-Road". |
| `category` | enum | `ball` \| `shoe` \| `accessory` \| `bag`. |
| `shortPitch` | string (≤120 chars) | The one-line "what's this for / who's it for." Pull from the `kb-*` "shopper takeaway" lines. |
| `description` | markdown | 1–3 short paragraphs of education copy. |
| `whoItsFor` | string[] | Bullet audience tags, e.g. ["Beginners", "Spare shooting"]. |
| `images` | string[] | Product photo(s). For 3D mode, also the wall-item render. |
| `price_mock` | object | **Mocked.** Supplied by pricing spec; rendered as list-struck + street + "SAVE X%". Never a real transaction. |
| `learnMoreRef` | string | Link/anchor to the relevant `kb-*` explainer (e.g. "what is a coverstock?"). |
| `crossSell` | string[] | Companion product IDs (see cross-sell logic in `kb-04`). |

---

## Ball-specific fields

| Field | Type | Notes / source in KB |
|---|---|---|
| `coverstockFamily` | enum | `plastic` \| `urethane` \| `reactive` \| `particle`. Drives the "how much hook" badge. (`kb-01`) |
| `coverstockSubtype` | enum? | For reactive: `solid` \| `pearl` \| `hybrid`. |
| `tier` | enum | `spare` \| `entry` \| `mid` \| `performance` — **matches the pricing spec's tiers** so both docs filter alike. |
| `hookRating` | 1–5 | Shopper-friendly "how much it hooks" scale. Plastic≈1, particle≈5. This is the headline, not RG/diff. |
| `coreType` | enum | `symmetrical` \| `asymmetrical`. |
| `rg` | number | e.g. 2.55. Shown in a small "Specs" panel, not the headline. (`kb-01`) |
| `differential` | number | e.g. 0.045. Small specs panel. (`kb-01`) |
| `weights` | number[] | e.g. [10,11,12,13,14,15,16]. Price flat across weights (per pricing spec). |
| `needsDrilling` | bool | True for balls. Triggers the "+ fitting/drilling add-on" callout and a CTA to the in-shop fitting (`kb-02`). |

**UI hint:** lead a ball card with `hookRating` (a 1–5 dot/bar) + `coverstockFamily` + `tier`. Tuck `rg`/`differential`/`coreType` into an expandable "Specs" section. Always show the "needs drilling → book a fitting" CTA.

---

## Shoe-specific fields

| Field | Type | Notes / source in KB |
|---|---|---|
| `shoeType` | enum | `athletic` \| `performance`. (`kb-03`) |
| `interchangeable` | bool | True for performance shoes. |
| `handedness` | enum | `right` \| `left` \| `universal`. Site should ask handedness first and default correctly. |
| `slideSoleIncluded` | string? | Which slide number ships with it, if performance. |
| `sizes` | (number\|string)[] | Standard US sizing. |
| `convertible` | bool | True if symmetrical soles allow righty/lefty swap (`kb-03`). |

**UI hint:** ask handedness up front; gate the product to the right version. For performance shoes, surface "swappable soles tune your slide" and cross-sell a spare sole + shoe bag.

---

## Accessory-specific fields

| Field | Type | Notes / source in KB |
|---|---|---|
| `accessoryJob` | enum | `grip-hand` \| `tape-skin` \| `ball-care` \| `support-protection` \| `carry`. Matches the `kb-04` grouping. |
| `consumable` | bool | True for tapes, rosin, cleaner — drives "re-order" / restock cross-sell. |
| `leagueLegal` | bool? | For wrist supports, rosin, etc. — call out USBC legality where relevant (`kb-04`). |
| `pairsWith` | string[] | What it's typically bought alongside. |

**UI hint:** lead an accessory with the one-line "what it's FOR" from `kb-04`. These are impulse adds — keep it to a sentence plus price.

---

## Bag-specific fields

| Field | Type | Notes |
|---|---|---|
| `ballCapacity` | enum | `1` \| `2` \| `3+`. Drives the "how many balls do you carry?" picker (`kb-04`). |
| `wheeled` | bool | Roller vs tote. |
| (pricing/SKUs) | — | Owned by `02-bags.md` inventory spec; this doc only defines the *capacity → who it's for* content. |

---

## The "hook rating" reference (so all balls get rated consistently)

| Family | Subtype | hookRating | tier hint |
|---|---|---|---|
| Plastic | — | 1 | spare |
| Urethane | — | 2 | entry |
| Reactive | hybrid (entry) | 3 | entry/mid |
| Reactive | solid (mid/benchmark) | 4 | mid |
| Reactive | pearl/solid (performance) | 4–5 | performance |
| Particle | — | 5 | performance |

(Approximate — a driller's layout shifts real-world hook. This is a *shopper-facing relative* scale, not a measured spec.)

---

## Education panels to attach (reuse the kb-* intros)

Each category page and each 3D-shop section intro should embed the matching `kb-*` intro copy:

- Balls section → `kb-01` one-paragraph version + "Which ball is me?" block.
- Shoes section → `kb-03` "why bowling shoes are special" + "which shoes are me?".
- Accessories section → `kb-04` grouping by job.
- A site-wide "Bowling Terms" page → `kb-05` glossary; wire glossary terms as tooltips on product specs.
- Everywhere a ball appears → the `kb-02` fitting CTA.
