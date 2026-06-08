# 04 — Standard Shop Spec (Mode 1)

The dependable, accessible, SEO-visible default. The 3D walk-in (Mode 2) degrades to this, so this mode must be complete and correct on its own.

> A more detailed sibling draft also exists in this folder (`02-standard-shop-spec.md`, the longer 23k version). This file is the canonical, reconciled version indexed by `README.md`; where they differ, follow this one. The sibling has extra wireframe ASCII and is useful supporting detail.

---

## 1. Information architecture

- One top-nav entry: **"Pro Shop."**
- Inside the Pro Shop, a **mode toggle**: `Standard` (default) ⇄ `Walk-in 3D`. Both modes render the same product data (`06`).
  - **Decision / open question:** the toggle keeps the 3D sim *under* the Pro Shop tab rather than as its own top tab. Rationale: mobile nav real estate is scarce (most of this audience is on phones), and two equal "shop" tabs confuse customers about which is "the real one." Flip the 3D sim to its own top tab ONLY if the client wants it as the headline marketing draw. This is a branding decision, not a UX one — flagged for the client (see `README.md`).
- **Categories (5):** Balls · Bags · Shoes · Accessories · **Services**.
  - Services is first-class but behaves differently: you don't buy-and-ship, you **reserve and get it done in-store** (drilling, plugging, resurfacing, fitting).
- **Sub-badges for balls:** NEW ARRIVALS / HOT DEALS / USED — these mirror the real wall banners (see `01`).
- **Deep links:** hash-routed so a single item opens identically from either mode, e.g. `#/proshop/balls/storm-hy-road`. A wall hotspot in 3D and a grid card in Standard open the **same** product detail.

---

## 2. Page structure

```
Top nav (site-wide) … [ Pro Shop ]
─────────────────────────────────────
Pro Shop hero strip
  "All Star Bowl Pro Shop"
  [ Browse catalog ]   [ Try the 3D Walk-In Shop → ]
  small mock-pricing / "wish list, not an order" disclaimer
─────────────────────────────────────
Category bar:  All | Balls | Bags | Shoes | Accessories | Services
   (balls sub-filter: New Arrivals | Hot Deals | Used)
─────────────────────────────────────
Responsive product grid (2 col mobile → 4 col desktop)
─────────────────────────────────────
Footer: address (726 N Shortridge Rd) / hours / "Visit in person"
```

---

## 3. Product card (grid)

Stay scannable. The card shows:

- Product image (clean backdrop; for balls, a spinnable/recolored thumbnail is a nice-to-have, not required).
- `name` + `brand` (brand may be "—").
- **One** `specLine` (e.g., "Hybrid reactive · medium oil").
- Price block: struck-through **list** + **sale** + **SAVE X%** badge (see `02` for why the messy two-price treatment is more authentic than one clean price).
- A category/condition badge where relevant ("NEW ARRIVALS", "HOT DEAL", "USED", "CLOSEOUT").
- Primary action: **Add to List** (not "Add to Cart").

Do NOT put the full spec table or fit note on the card — those live on the detail view.

---

## 4. Product detail (PDP)

- Full spec table (coverstock, core type, RG, differential, weights available, etc. from `06`).
- `blurb` + `bestFor` (shopper voice, from `03`).
- **`fitNote` is the load-bearing element.** It carries the drilling/fitting message that turns no-checkout into the brand promise: *"Reserve it here — we'll fit it to your hand in the shop."*
- `careNote` cross-sell for balls (cleaner + towel + bag).
- Glossary terms surface as inline tooltips (from `03`).
- For `services`: info card, no price block (or a "starting at" estimate), "Call or visit" CTA.
- Actions: **Add to List** and **Reserve / Ask the Pro Shop**.

---

## 5. Shared data contract

- One file: `public/js/proshop-data.js` (or `proshop-catalog.json`) matching the existing static-JS `data.js` convention in this repo — no backend.
- Both the Standard grid and the 3D wall read from it. Schema is defined in `06-shared-product-data-model.md`.
- **Forbidden failure mode:** the 3D scene hard-coding prices/labels onto meshes or textures. That causes drift between modes. Wall hotspots reference products **by `id`**; a single shared `ProductDetail` renderer mounts in both modes so wall and grid always show identical detail.
- The Standard grid is the **superset** (everything). The 3D wall is a **curated highlight reel** (a subset placed in real wall slots).

---

## 6. The no-checkout reality (cart reframed)

- **"My List"** — a mock wish list. Persists in `localStorage`. Shows an explicitly-labeled **estimate** total, never a checkout total. Includes a "Bring this list to the shop" printable/share view — turns the mock into something genuinely useful for an in-person visit.
- **"Reserve / Ask the Pro Shop"** — an inquiry sheet, not a payment form.
  - Fields: name, **phone (required)** — matching the call-and-walk-in culture — optional email, optional note, and the items from the list.
  - Default submit is **`mailto:`** (static stack, no backend) or a simple form endpoint if one exists.
  - Always offer a **phone fallback** ("or just call the shop: [number]").
- **Honesty rules in this flow:**
  - No card fields. Ever.
  - No "order placed" / "payment received" language. Use "request sent — the shop will call you."
  - The estimate is always labeled an estimate.
  - Explicit copy somewhere visible: **"This is a wish list, not an order. Come see us to buy."**

---

## 7. Tone (in-brand fun, bounded)

- Pull the **novelty-carpet palette** (pink/cyan/teal/purple on black) into accent chrome — pills, ribbons, the mode-toggle "doors," badges.
- Graffiti/star energy in the *chrome only*; product images stay on clean backdrops so gear reads clearly.
- Playful empty states ("Your list is emptier than a 7-10 split").
- Optional mascot cameos at the "enter the 3D shop" door and at the reserve-confirmation moment.
- Bound the fun so it never costs performance or blocks the Reserve flow. Respect `prefers-reduced-motion`.

---

## 8. Accessibility and SEO

- This mode is the **a11y + SEO source of truth** (the 3D canvas is invisible to crawlers and hostile to screen readers).
- Semantic HTML for grid + PDP, real headings, alt text on every product image, keyboard-navigable cards and the reserve sheet.
- The saturated carpet palette must still pass AA contrast on badges/pills — verify.
- Each PDP is a crawlable deep-linked route with title/description from the product data; include store address and hours.

---

## 9. BowlNow boundary

- BowlNow handles bookings/CRM, not gear retail — no overlap. The shop **links out** to booking, never reimplements it.
- Gray area: whether fitting appointments route through BowlNow's booking system or a simple inquiry form. Logged as a client question, not assumed.

---

## 10. Acceptance criteria

1. Reachable from a top-nav "Pro Shop" tab; renders all catalog records grouped by the 5 categories from `proshop-data.js` with no hard-coded products in markup.
2. Card shows exactly one spec line + the two-price block + badge + "Add to List."
3. PDP shows full spec table + fitNote + care/cross-sell + both actions.
4. "My List" persists across reloads and shows a labeled estimate; printable "bring to shop" view works.
5. Reserve sheet collects phone (required), submits via mailto/endpoint, shows a non-transactional confirmation, and offers a phone fallback.
6. No card fields, no "order/payment" language, no real-inventory claims anywhere.
7. Deep links open the same PDP from Standard and from 3D.
8. Keyboard + screen-reader pass on grid, PDP, and reserve sheet; passes basic Lighthouse a11y; works on mobile.
