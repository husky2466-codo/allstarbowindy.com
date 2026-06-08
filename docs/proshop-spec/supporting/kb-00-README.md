# Pro Shop KNOWLEDGE BASE — Index (kb-* files)

**Project:** All Star Bowl pro shop (allstarbowindy.com)
**Location:** 726 N Shortridge Rd, Indianapolis, IN 46219
**Author:** DomainClaude (bowling-equipment domain expert)
**Status:** SPEC ONLY — no pages built. DesignClaude builds from these docs.
**Date:** 2026-06-07

---

## Why this is a separate `kb-*` index

This folder is shared by several spec authors writing concurrently:

- **ArchitectClaude** owns `00-README.md` and the architecture set (`01-experience-and-ux.md`, `02-engine-evaluation.md`, etc.) — the *how it's built / 3D engine* spec.
- **PricingClaude / InventoryClaude** own `00-pricing-research.md`, `01-balls.md`, `02-bags.md`, `01-inventory-and-layout.md`, etc. — the *which SKU + price + where on the wall* spec.
- **DomainClaude (this set, `kb-*`)** owns the *bowling knowledge* — what the products ARE, what they're FOR, and the shopper-facing explainer + glossary copy.

To avoid clobbering files in a busy numeric namespace, every file in **this** deliverable is prefixed `kb-` (knowledge base). DesignClaude: read the `kb-*` set for *content/copy*, the architecture set for *structure*, and the pricing/inventory set for *data*.

## What the `kb-*` set is for

Shopper-facing knowledge that becomes two kinds of site content:

1. **Education / explainer copy** — "What ball do I need?", "What's a fingertip grip?", "Why a wrist support?" Lowers a beginner's fear of buying.
2. **Product-detail content fields** — the structured facts (ball type, coverstock, core, RG/diff, fit notes) attached to each SKU on a product page or to a wall item in the 3D walk-in shop.

It is NOT a catalog or price list. Checkout, cart, pricing are out of scope (mocked) — pricing lives in the pricing spec, not here.

## How it feeds the two shop modes

Both the **standard shop** (top-nav tab, grid → detail) and the **3D walk-in simulation** (navigate the real shop, walk up to wall items) render the **same product-detail content** defined in `kb-06`. Write the content once; surface it in both modes. Keep product-detail blocks mode-agnostic so a ball reads identically whether reached by clicking a grid card or walking up to it on the 3D wall.

## File map (this deliverable)

| File | Purpose |
|---|---|
| `kb-00-README.md` | This index. |
| `kb-01-ball-types.md` | The four coverstock families + coverstock/core/RG/differential explained for shoppers. |
| `kb-02-fit-and-drilling.md` | Fitting & drilling, conventional vs fingertip grip, why fit matters, the in-shop experience. |
| `kb-03-shoes.md` | Athletic vs performance (interchangeable) shoes, slide/traction soles, brake heels, handedness, slide-number system. |
| `kb-04-accessories.md` | What each accessory is FOR — wrist supports, tapes, rosin/grip sacks, cleaners, towels, bags, inserts, thumb savers. |
| `kb-05-glossary.md` | A-Z beginner glossary of bowling-shop terms. |
| `kb-06-product-content-model.md` | The reusable content fields each product type carries on a detail page / wall item. |
| `kb-07-source-mirror-notes.md` | Authoritative full-category sources worth mirroring, with URLs and coverage. |

## Tone guidance for the live copy

- Write to a nervous first-time buyer, not a tournament pro. Lead with "what's this for / which one is me."
- Never shame the house-ball bowler. The funnel is: house bowler → first own ball → first fitting.
- Numbers (RG, differential) are supporting detail, not headlines. People choose on "how much hook / how forgiving."
- End every explainer with a soft next step to the in-shop pro: "Not sure? Our pro shop fits you in about 30 minutes." Honest (fitting is hands-on) and it's the real conversion path for a brick-and-mortar shop.
