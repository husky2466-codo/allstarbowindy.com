# Pro Shop — Standard Website Shop Spec (Top-Tab Version)

**Project:** allstarbowlindy.com redesign
**Business:** All Star Bowl · 726 N Shortridge Rd, Indianapolis IN 46219 · (317) 352-1848
**Author role:** E-commerce UX architect
**Status:** SPEC ONLY — DesignClaude builds from this. Do not build any page from this doc.
**Scope:** The conventional grid/category "standard shop." The 3D walk-in simulation is a SEPARATE spec; this doc defines the data contract they share.
**Companion docs in this folder:**
- `01-product-data-model.md` (the shared source of truth — see §4; if it does not exist yet, this doc defines it inline and that section is authoritative until extracted)
- `03-3d-sim-shop-spec.md` (the walk-in sim — not written by this task)

---

## 0. Hard constraints (read first — these are not negotiable)

1. **No real checkout. Ever.** No payment, no Stripe, no card fields, no real inventory commitment. Pricing and cart are **mocked**. The "buy" action is a **Reserve / Ask in store** flow that produces an inquiry, not a transaction. This is a *call-and-walk-in* business (audit §Summary); the site's job is to get the customer to the counter, not to take money online.
2. **Static stack, no build step.** The site is plain HTML/CSS + **in-browser JSX (React via CDN/Babel)** served as static files from `public/` (README). No bundler, no npm, no server. The shop must work as static files. Data lives in a JS module (`public/js/data.js` pattern), not a database or API.
3. **Single source of product truth.** The standard shop and the 3D sim **must read the same product objects** from one file. No duplicated product lists. See §4 — this is the highest-risk integration point.
4. **It is a pro shop, not Amazon.** Catalog is small (tens of items, not thousands). Design for a *curated wall of gear*, not infinite scroll. Do not over-engineer pagination/search for a 40-item catalog.
5. **Mobile-first.** Most bowlers arrive on phones (audit §Mobile-first). The grid, filters, and Reserve flow must be thumb-usable first; desktop is the enhancement.

---

## 1. Information Architecture

### 1.1 Top-tab placement
- The Pro Shop is a **primary nav tab**, consistent with the redesign IA: `Home · Bowl · Parties & Events · Leagues & Youth · Eat & Drink · Pro Shop · Contact` (audit §IA recommendation).
- The tab label is **"Pro Shop"** (not "Shop" / "Store" — keep the real business name; locals know it as the pro shop).
- **Two entry modes live UNDER this one tab**, not as two separate top-level tabs:
  - The Pro Shop landing page presents a **mode toggle / two-door choice**: **"Browse the Shop"** (this standard grid) and **"Walk the Shop in 3D"** (the sim).
  - Rationale: one nav tab keeps the IA clean and mobile nav short. The 3D sim is a *delight feature*, not a co-equal primary destination — surfacing it as its own top tab would over-promise and clutter mobile nav. The toggle also makes the relationship explicit: same gear, two ways to look at it.
- **Default mode:** Standard grid. The 3D sim is opt-in (it is heavier, and not every device/connection should be forced into it). On the landing page the 3D option is presented as a fun **"or take the scenic route →"** card, not the default.
- **Deep-link friendly:** `#/proshop` (grid), `#/proshop/3d` (sim), `#/proshop/item/<id>` (detail). Hash routing, since this is a static SPA-style mockup. A product detail URL must open the SAME item regardless of which mode the visitor came from.

### 1.2 Categories
Five categories, matching the real pro shop offering (audit: "Balls, bags, shoes, accessories, professional drilling"):

| Category | Slug | Notes |
|---|---|---|
| **Balls** | `balls` | The hero category. Most products, richest specs. |
| **Bags** | `bags` | Single/double/triple/roller. |
| **Shoes** | `shoes` | Men's/women's/youth; rental-vs-own framing. |
| **Accessories** | `accessories` | Tape, grips, wrist supports, towels, cleaners, inserts. |
| **Services** | `services` | NOT physical products — drilling, plug & re-drill, surface/resurface, fitting. These are "Ask the Pro" line items with no cart quantity. See §3.5. |

- **Services is a first-class category but behaves differently** (no quantity, no "reserve" — instead "Book a fitting / Ask the pro"). It belongs in the shop because drilling is the pro shop's core value-add and the reason a ball purchase isn't self-service. Treating it as a category (not burying it) is the whole differentiation: *you don't just buy a ball online, you get it drilled to your hand here.*
- Category nav is a **horizontal pill bar** (mobile: scrollable row; desktop: inline). Plus an **"All"** pill that shows everything.

### 1.3 Filtering & sorting
Keep it proportional to a small catalog. **Do not** build faceted search with 12 dimensions for 40 items.

**Filters (per category, only show filters that apply to the active category):**
- Balls: **Brand**, **Coverstock type** (Reactive / Urethane / Plastic-Polyester / Particle), **Skill level** (Beginner / Intermediate / Advanced), **Hand fit available** (in-stock weights 6–16 lb as a range chip).
- Bags: **Type** (Single / Double / Triple / Roller), **Brand**.
- Shoes: **Gender/fit** (Men / Women / Youth / Universal), **Slide-sole** (Athletic / Performance/interchangeable), **Brand**.
- Accessories: **Sub-type** (Grip / Tape / Wrist support / Care / Other).
- Services: no filters (short list).

**Sorting:**
- **Featured** (default — pro's picks / what they actually stock and push; an editorial order set in data, not algorithmic).
- Price: Low → High / High → Low (uses mocked price).
- Name: A → Z.
- Newest / Just arrived (uses an `addedAt` field).

**Behavior:**
- Filters are **client-side only** (data is already loaded). Instant, no spinner.
- Active filters render as **removable chips** above the grid with a "Clear all."
- **Empty state** is on-brand and useful, never a dead end: *"No gear matches that combo — but the pro probably has it in back. Call (317) 352-1848 or swing by."* with a phone CTA. (A pro shop's real inventory exceeds the website's; the empty state should push to the counter, not apologize.)
- **Search** (optional, P2): a single text box matching name + brand. For ~40 items this is a nicety, not a requirement. If included, it's an inline filter, not a separate results page.

---

## 2. Product Card (grid tile)

The card is the unit of the grid. Mobile: 2-up (or 1-up on narrow). Tablet/desktop: 3–4-up.

**Fields shown on the card:**
- **Product image** (square, on a clean/branded backdrop). Lazy-loaded.
- **Brand** (small, above name — e.g. "Storm", "Hammer", "Brunswick", "Dexter").
- **Name** (the model — e.g. "Phaze II", "Black Widow 2.0").
- **Price** — mocked, formatted `$XXX`. Label it honestly where space allows (see §5 on the "no checkout" reality). If a price is a "from" (e.g. shoes by size), show `From $XX`.
- **One spec line** — the single most decision-relevant spec per category:
  - Balls → coverstock + skill level (e.g. "Reactive · Intermediate").
  - Bags → type (e.g. "3-Ball Roller").
  - Shoes → fit (e.g. "Men's · Performance").
  - Accessories → sub-type.
  - Services → starting price / "Ask the pro."
- **A category/affordance badge** when relevant — e.g. **"Needs drilling"** on balls (sets the expectation that this isn't a ship-it-home item, it's a come-in-and-get-fit item), **"In-store fitting"** on services.
- **Hover/tap affordance:** card lifts; primary action reveals: **"View"** (→ detail). Secondary quick action: **"+ Reserve"** (adds to mock cart without leaving the grid). On mobile, both are tappable buttons, no hover dependency.
- **Optional ribbon:** "Pro's Pick" / "Just In" / "On the Wall" (the last one cross-links to where it lives in the 3D sim — see §4.4).

**Card does NOT show:** full spec table, drilling note, multiple images. Those are detail-page only. Keep the card scannable.

---

## 3. Product Detail Page (PDP)

Route: `#/proshop/item/<id>`. Opens as a full page (mobile) or a large panel/modal (desktop) — DesignClaude's call, but the URL must be shareable either way.

### 3.1 Structure (top → bottom)
1. **Image area** — primary image + thumbnail strip if multiple. If the item has a 3D model (balls especially), offer a small **"View on the wall in 3D →"** link that deep-links into the sim at this item (see §4.4). This is the *bridge* between the two modes.
2. **Header block:** Brand · Name · mocked Price (with honest framing, §5).
3. **Short pitch** — 1–2 sentences in brand voice (the pro's plain-English "who this is for"). E.g. *"A heavy-oil hook monster. If you bowl in a competitive league and the lanes are slick, this is your ball."*
4. **Spec table** — see §3.3.
5. **Fit / Drilling note** — see §3.4. THIS IS THE DIFFERENTIATING FIELD. Do not omit.
6. **Primary CTA:** **"Reserve / Ask the Pro Shop"** (see §3.6). For Services: **"Book a fitting."**
7. **Secondary CTA:** **"Add to my list"** (mock cart) and **"Call the shop"** (`tel:+13173521848`).
8. **Pro Shop hours + address block** (so a "come in" CTA is actionable): *Mon 4–8 · Tue 11–8 · Wed 4–9 · Thu 12–7 · Fri 5–8 · Sat 9:30–2 · Sun closed.* Plus map link.
9. **"You might also like"** — 3 related items (same category or pro-curated), reusing the product card.

### 3.2 Required data fields (every product)
| Field | Type | Notes |
|---|---|---|
| `id` | string | Stable, unique, shared with 3D sim. Never reuse. |
| `category` | enum | balls/bags/shoes/accessories/services |
| `brand` | string | |
| `name` | string | Model name |
| `price` | number \| null | Mocked. `null` = "Ask for price." |
| `priceLabel` | enum | `exact` / `from` / `ask` — controls how price renders |
| `pitch` | string | 1–2 sentence brand-voice blurb |
| `specs` | object | Category-shaped, see §3.3 |
| `fitNote` | string | Drilling/fit guidance, see §3.4 |
| `images` | string[] | Paths under `public/img/...` |
| `model3d` | string \| null | Path to `.glb` (or null). Used by sim; presence drives "View in 3D." |
| `wallLocation` | object \| null | Where it lives in the sim (see §4.4) |
| `badges` | string[] | e.g. ["Pro's Pick","Needs drilling"] |
| `level` | enum \| null | beginner/intermediate/advanced (balls) |
| `addedAt` | ISO date | for "Just In" / Newest sort |
| `featuredRank` | number \| null | editorial order for "Featured" sort |
| `inStock` | bool | mock; controls "In store" vs "Ask if available" |

### 3.3 Category-shaped `specs`
Specs differ by category. The PDP renders whatever keys exist; don't force every product to have every field.
- **Balls:** `coverstock` (Reactive/Urethane/Plastic/Particle), `core` (Symmetric/Asymmetric), `weights` (array, e.g. [10,12,14,15,16]), `finish` (e.g. "1500-grit polished"), `recommendedOil` (Light/Medium/Heavy), `level`.
- **Bags:** `capacity` (1/2/3/6 ball), `wheels` (bool), `material`, `dimensions`.
- **Shoes:** `gender` (Men/Women/Youth/Universal), `sizes` (array), `slideSole` (fixed/interchangeable), `material`.
- **Accessories:** `subType`, `compatibility` (free text, optional).
- **Services:** `serviceType` (Drill/Plug & re-drill/Resurface/Fit), `startingPrice`, `turnaround` (e.g. "Same day for league members"), `requires` (e.g. "Ball + your hand — book a fitting").

### 3.4 Fit / Drilling note (the load-bearing field)
Every **ball** and every **service** must carry a `fitNote`. This is what makes the pro shop a pro shop, not a warehouse. Plain-English, one short paragraph. Examples:
- Ball: *"This ball needs to be drilled to YOUR hand — we don't ship pre-drilled. Reserve it here, then come in for a free fitting and we'll measure your span and pitch so it fits like a glove."*
- Shoes: *"Sizing runs true; if you're between sizes go up. Not sure? Reserve a couple sizes and try them at the counter."*
- Service: *"Bring the ball and your hand. A fitting takes ~15 minutes; drilling is usually same-day for league members."*

The fitNote's job: **set the expectation that the transaction completes in the building**, which is *why there's no online checkout* — and turns that limitation into the brand promise.

### 3.5 Services PDP variant
- No quantity, no "reserve qty." Replace price with `startingPrice` + "Ask the pro for exact." Primary CTA = **"Book a fitting"** → same inquiry flow (§3.6) flagged `type: service`.
- Surface turnaround and "what to bring."

### 3.6 The Reserve / Ask CTA (since checkout is mocked)
- Label: **"Reserve / Ask the Pro Shop"** (products) or **"Book a fitting"** (services).
- Clicking opens the **inquiry sheet** (see §5.3), NOT a payment flow.
- The sheet collects: name, phone (required — phone-first culture), optional note, and the item(s) auto-attached. Submitting produces a **mocked confirmation** ("We'll hold it / We'll call you") — see §5 for what "submit" actually does in a no-backend mockup.

---

## 4. Shared product data — single source of truth (CRITICAL)

**Both the standard shop and the 3D sim read the same product objects. There is exactly ONE product list.**

### 4.1 Where it lives
- A single module: **`public/js/proshop-data.js`** (mirrors the existing `public/js/data.js` convention — plain JS, exports an array of product objects, no fetch/no API).
- Export shape: `export const PROSHOP_PRODUCTS = [ {…}, … ]` plus small helpers `getProductById(id)`, `getByCategory(cat)`, `getWallItems()`.
- If a JSON-only artifact is preferred for portability, the canonical file is `proshop-data.js` and it may import/inline a `proshop-products.json`. Pick one; do not maintain two.

### 4.2 Why one source (the failure mode this prevents)
The obvious-but-wrong path is: the grid has its catalog, the 3D scene hard-codes labels/prices on wall meshes. That guarantees drift — a price changes in one place, the other lies. **Forbidden.** The 3D sim's wall items must be *data-driven from the same array*. A wall hotspot references a product **by `id`**, and pulls name/price/specs at render time. Change the data once → both modes update.

### 4.3 Division of responsibility
- `proshop-data.js` owns: all product facts (name, brand, price, specs, fitNote, images, badges).
- The **standard shop** owns: grid layout, filtering, sorting, PDP rendering, mock cart.
- The **3D sim** owns: scene, geometry, wall hotspot placement, camera/navigation, and the `wallLocation` → hotspot mapping. It reads product facts; it does not store them.
- **Shared UI:** the PDP content (header, specs, fitNote, Reserve CTA) should be a **shared renderer/component** (`ProductDetail`) so that walking up to a wall ball in 3D opens the *same* detail content the grid opens. Build the detail once; both modes mount it. This is the single biggest reuse win and keeps the two modes honest.

### 4.4 The `wallLocation` + 3D bridge fields
For items physically on the sim's walls:
```
wallLocation: { wall: "north" | "south" | "east" | "rack-a" | ...,
                slot: 7,            // hotspot index on that wall
                anchor: [x,y,z] }   // optional precise placement, sim may override
model3d: "img/3d/balls/phaze-ii.glb" | null
```
- Grid card → if `model3d` present, show **"View on the wall in 3D →"** (deep-links `#/proshop/3d?focus=<id>`; sim spawns the camera at that hotspot).
- Sim hotspot → **"See full details / Reserve"** opens the shared `ProductDetail` (or deep-links `#/proshop/item/<id>` back into the grid PDP).
- Items WITHOUT `wallLocation` (e.g. accessories in a bin) simply don't appear on a wall — they're grid-only. That's fine; the grid is the complete catalog, the wall is a curated subset. **The grid is the superset, the wall is a highlight reel.**

### 4.5 Mock cart / "My List" state
- A single client-side store (`localStorage` key `asb_proshop_list`) holding `[{id, qty}]`.
- Shared by both modes: reserve a ball from the 3D wall, it shows in the grid's list and vice-versa.
- This is a **"My List" / "Hold for me"**, not a cart with a total-and-pay. A subtotal may be shown but labeled as an *estimate* (§5).

---

## 5. The "no real checkout" reality

This is mocked retail. The UX must be **honest, not deceptive** — never imitate a checkout that can't complete. We turn the limitation into the brand's actual operating model: come see the pro.

### 5.1 What replaces the cart
- The cart is a **"My List" / "Hold for me at the counter"** drawer.
- It shows items, qty, and an **estimated** subtotal explicitly labeled: *"Estimate — final price & fit confirmed in store."*
- No "Checkout" button. The terminal action is **"Send to the Pro Shop"** (the inquiry).

### 5.2 What replaces checkout — the Reserve / Ask flow
Single flow for both single-item ("Reserve this") and list ("Send my list"):
1. **Inquiry sheet** collects: **Name**, **Phone (required)**, optional **Email**, optional **Note** ("left-handed, 15 lb please"), and auto-attached item list.
2. Microcopy sets expectations: *"This holds your gear and tells the pro you're coming — it's not a payment. We'll confirm price, weight, and fit when you come in or call."*
3. **Submit behavior depends on backend availability** — DesignClaude/integration decides, but the spec REQUIRES one of these and forbids a fake success with no delivery:
   - **(a) mailto fallback (default for a no-backend static demo):** compose a pre-filled email to the shop / `tel:` prompt. Guaranteed to work statically.
   - **(b) Form endpoint (P2):** a no-code form service (e.g. Formspree-class) or the site's existing form tooling (audit notes 4 forms to rebuild) posts the inquiry. Reuse that tooling — do not invent a new one.
   - **(c) Telegram/email webhook** if the redesign already wires one.
4. **Confirmation state:** friendly, concrete: *"Got it! Your gear's on hold. The pro shop will reach out, or call us at (317) 352-1848. Shop hours: …"* Include hours + address so the customer can act immediately.

### 5.3 Honesty rules (non-negotiable)
- Never render a credit-card field.
- Never say "Order placed" / "Payment received" / "Purchase complete."
- Always frame price as estimate and the action as reserve/ask.
- Every terminal screen offers the **phone number** as the real-world fallback — this matches the call-and-walk-in culture.

---

## 6. Brand & tone

Brand anchors (from existing assets): the **3D star logo** (`Logo_ASB_3DS`), the **mural pin mascot** (already captured as a site "corner buddy," see `mascot-integration-spec.md`), and a **graffiti / star, loud-fun east-side** vibe. The pro shop should feel like the coolest corner of the building, not a sterile e-commerce template.

### 6.1 Voice
- **Confident, plain-spoken, a little swagger.** The pro talking to you, not marketing copy. "Hook monster." "Fits like a glove." "Swing by."
- **No fake scarcity, no countdown timers, no dark patterns.** This is a local shop with a reputation, not a funnel.
- Pitch lines and fitNotes are where the voice lives — keep spec tables factual and clean so the personality reads as expertise, not noise.

### 6.2 Visual cues for DesignClaude (direction, not pixel spec)
- **Graffiti/star accents** as section dividers, the active category pill, the "Pro's Pick" ribbon, and the mode-toggle doors — not as a wallpaper that fights product images. Product images stay on clean backdrops; the brand energy lives in the chrome.
- The **mascot** can cameo: pointing at the 3D-mode door ("take the scenic route"), or in the empty-state and reserve-confirmation moments. Keep it dismissible/non-blocking per the mascot spec.
- **Mobile-first, big tap targets, fast.** Static + no build = it should feel instant. Don't let "fun" cost performance; defer the 3D bundle until the user opts in.
- Reuse generated card/scene art already under `public/img/generated/` where it fits (cards, scenes, logos subfolders exist).

### 6.3 Make it fun (if the client wants it) — bounded
Optional flourishes, all behind the standard grid being solid first:
- A **"Pro's Pick of the Week"** spotlight at the top of the grid.
- The **"On the Wall"** ribbon that visibly ties a grid item to its 3D-sim location — reinforces the two-mode story.
- Mascot reactions on add-to-list ("Nice ball!"). Subtle, skippable, never blocking the Reserve flow.
- These are P2 polish. The P1 is: clean grid, honest mock cart, working Reserve-to-counter flow, shared data.

---

## 7. Relationship to BowlNow (don't compete, don't overlap)

- **BowlNow is BPAA's website+CRM+online-lane/party-booking SaaS** the client may be pushed toward (`current-hosting-analysis.md`). Per `cost-analysis-aws-offer.md` Q2, there is **no overlap** between BowlNow and a *retail pro shop catalog* — BowlNow does bookings/CRM/marketing, not gear retail.
- **This shop does NOT do lane/party booking.** If/when the client uses a booking tool (BowlNow or otherwise), this Pro Shop tab must **link out to it** for "Book a lane / Book a party," never reimplement it.
- **One place they touch:** "Book a **fitting**" (a pro-shop service appointment) is NOT a lane/party booking. Keep fitting requests in this shop's Reserve/Ask flow (§3.6) unless the client explicitly wants fitting appointments routed through their booking system — in which case the "Book a fitting" CTA deep-links to that system. Flag this as a **client question**, don't assume.
- Net: the standard shop **complements** booking by handling gear/services; it hands off cleanly to whatever books lanes and parties.

---

## 8. Build order for DesignClaude (thin slices)

1. **Data first:** `public/js/proshop-data.js` with ~8–12 seed products across all 5 categories (real-ish brands/models), every required field incl. `fitNote`. This unblocks BOTH modes.
2. **Shared `ProductDetail` renderer** (consumed by grid PDP and later the sim).
3. **Standard grid:** category pills + cards + sort. (Filters next.)
4. **PDP** wired to `ProductDetail`.
5. **Mock cart / "My List"** (localStorage) + drawer.
6. **Reserve / Ask inquiry sheet** with mailto fallback (honest confirmation).
7. **Filters**, search (P2), fun flourishes (P2).
8. **Bridge fields** (`model3d`, `wallLocation`) populated so the 3D-sim spec can consume them — but the sim itself is a separate build/spec.

**Definition of done (standard shop):** grid browses all 5 categories, filters/sorts client-side, PDP shows specs + fitNote, "My List" persists, Reserve flow produces an honest non-payment confirmation with the phone fallback, and every product object is read from the single `proshop-data.js` — zero hard-coded product facts in components.

---

## 9. Open questions for the client (do not block the spec)
1. Do they want fitting appointments routed through their booking tool, or kept as a simple "we'll call you" inquiry? (Default: inquiry.)
2. Real catalog: should we seed with their actual stocked brands/models, or representative samples for the demo? (Default: representative, swap later.)
3. Is there an email/form endpoint we should wire the Reserve inquiry to, or is mailto/phone acceptable for the demo? (Default: mailto + phone.)
