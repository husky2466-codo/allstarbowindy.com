# Hero Banner — Image Generation Prompts

Prompts for the page hero background images we still need. Written for an image
generator (ElevenLabs image / Nano Banana / Imagen / Midjourney / DALL·E — adapt phrasing as needed).

> **How these get into the site (the drop-in workflow):** generate the image (ElevenLabs is great
> for this; or any tool/your own OpenAI·Google API), then **save it to the exact file path** named under
> each prompt. The site references those paths already, so a generated file **overrides the current
> art with zero code changes** — same pattern the member-zone backgrounds use below. (DesignClaude
> can't call external image APIs from inside its build tools, so the handoff is: prompt → you generate
> → drop the file at the named path.)

---

## 0. Hero banner spec (read first — applies to every prompt below)

All page heroes render as a **full-bleed `background-size: cover` layer** behind the
headline, with a **navy gradient wash** painted on top in CSS for text legibility.
That means the generated art has hard requirements:

| Requirement | Value |
|---|---|
| **Aspect ratio** | **8:3** (wide cinematic banner) |
| **Target resolution** | **2400 × 900 px** (min 1920 × 720; bigger is better for retina full-bleed) |
| **Orientation** | Landscape, ultra-wide |
| **Safe zone** | Keep the **left ~45%** low-detail / darker — the headline + a `linear-gradient(100deg, navy .95 → .25)` wash sit there. Put the "hero" subject **center-right**. |
| **Top/bottom** | Cover-crop will trim ~15% top and bottom on some viewports — keep the key subject vertically centered, nothing critical near the edges. |
| **People** | **NONE.** Empty-venue only (hard brand constraint). |
| **Palette** | Patriotic brand: navy `#0a1430`, royal blue `#1b3a8f`, red `#e0241f`, cream/white `#f5f1e6`, gold `#f5b423`. |
| **Mood** | Photographic / true-to-venue, not illustrated. No text, no logos, no watermarks baked in. |

> **Why generate instead of reuse:** every existing venue photo is 3:2 or 2:1
> (e.g. `cosmic-lanes` 1600×1060, `proshop-pano` 1600×800). None is 8:3, and none
> reads as "deals / cash games." Two ways to get an 8:3 asset:
> 1. **Generate fresh** at 2400×900 (prompts below), or
> 2. **Outpaint/extend** a real photo from 3:2 → 8:3 (see the "Extend a real photo"
>    variant at the bottom — good if you want guaranteed venue authenticity).

**Real-venue look to honor in any prompt** (from the reference photos): long rows of
**blonde synthetic lanes**, **navy half-wall with red trim**, the hand-painted blue
**"ALL STAR BOWL" graffiti mural**, red-based ball returns, overhead spec screens,
drop-ceiling with fluorescent strips, grey/blue molded seating, light-grey tile concourse.

---

## 1. SPECIALS hero — *PRIMARY, the real gap* (`#/specials`)

The Specials page now leads with **Win Cash** (Kegler's Cash + Casino Bowling), then
weekly deals and seasonal events. The hero should feel like **"casino night at the
bowling alley"** — energetic, a little after-dark, money-on-the-line — while staying
true to this specific venue and the patriotic palette. No people.

### Prompt A — Casino-night energy (recommended)
```
Ultra-wide 8:3 cinematic photograph of an empty American bowling alley at night,
"casino night" mood. A long row of blonde synthetic bowling lanes recedes to the
right; at the head of the nearest lane, a strike is happening — white bowling pins
exploding in mid-air, a single bowling ball in motion, sharp motion blur. Warm gold
and amber light spills across the lanes from overhead, mixing with the venue's navy
and red brand lighting on the side walls. Bokeh sparkle and glints like a jackpot
payout. The left third of the frame falls into deep navy shadow (negative space).
Rich patriotic color palette: navy blue, royal blue, red, cream, and gold accents.
Photographic, dramatic low-key lighting, shallow depth of field, no people, no text,
no logos, no watermark. 2400x900, ultra-wide banner composition, subject biased to
the center-right, dark and clean on the left.
```

### Prompt B — Bright "always something rolling" deals energy (alt)
```
Ultra-wide 8:3 photograph of a vibrant empty bowling alley interior, celebratory and
high-energy. Rows of glossy blonde wood lanes lead to the right with colorful overhead
screens glowing. Confetti and soft light streaks suggest a deal or event. Navy walls
with red trim and bright cream highlights; gold star accents. The left side is darker
and uncluttered for a headline. Patriotic red-white-and-navy palette with gold pops.
Clean, photographic, bright but moody, no people, no text, no logos, no watermark.
2400x900 ultra-wide banner, key subject center-right, calm dark space on the left.
```

**File when done:** `assets/img/specials-hero.jpg` (or `.png`). Wire it into
`SpecialsHero` in `js/specials.jsx` the same way the Contact/Bowl heroes work
(an absolutely-positioned `.specialshero-photo` layer at `z-index:0`, navy gradient on top).

---

## 2. EAT & DRINK hero — *optional upgrade* (`#/eat`)

Currently a navy hero with a rotating **flyer slideshow** beside the copy (intentional —
it already shows imagery). Only generate if you want a true photo backdrop behind it.

### Prompt — Alley Cafe / food energy
```
Ultra-wide 8:3 photograph of a bowling-alley snack bar and cafe counter, warm and
inviting, no people. Stone-oven pizzas, wings and waffle fries styled on a counter to
the right under warm overhead lights; the blonde bowling lanes and navy brand wall blur
softly in the background. Cozy amber lighting, patriotic navy-red-cream palette with
gold warmth. Left third darker and uncluttered for a headline. Photographic, appetizing,
shallow depth of field, no people, no text, no logos, no watermark. 2400x900 ultra-wide
banner, food biased center-right, dark clean space on the left.
```
**File:** `assets/img/eat-hero.jpg`.

---

## 3. PRO SHOP hero — *optional upgrade* (`#/proshop`)

Currently a navy hero with a generated **carpet-pattern texture** treatment (intentional).
There IS a real candidate — `proshop-pano.jpg` (**1600×800, 2:1**) — but it's not 8:3 and
is only 1600px wide. Either widen it (extend variant below) or generate fresh.

### Prompt — Pro shop ball wall
```
Ultra-wide 8:3 photograph of a bowling pro-shop interior, no people. A wall of glossy
new bowling balls in many colors arranged on a lit display rack fills the center-right,
with a fitting counter and rows of bowling bags below. Clean retail lighting, the
venue's navy-and-red brand colors on trim and signage, cream and gold accents. Left
third darker and uncluttered for a headline. Photographic, crisp, premium, no people,
no text, no logos, no watermark. 2400x900 ultra-wide banner, ball wall biased
center-right, clean dark space on the left.
```
**File:** `assets/img/proshop-hero.jpg`.

---

## 4. Variant — "Extend a real photo" (if you prefer guaranteed authenticity)

Instead of generating fresh, take a **real venue photo** and **outpaint it from 3:2 to
8:3**, adding negative space on the left. Best source candidates already in the project:
- Specials/general lanes: `assets/img/lanes-angle.jpg` or `lanes-wide.jpg` (1600×1060)
- Pro Shop: `assets/img/proshop-pano.jpg` (1600×800 — already 2:1, least work to widen)

### Outpaint prompt (image-to-image / "extend")
```
Extend this bowling-alley photograph into an ultra-wide 8:3 banner (2400x900). Keep the
existing scene exactly as-is on the right two-thirds; generate a natural continuation of
the same alley to the LEFT — more lanes, navy wall and concourse — but keep that left
area darker, softer and uncluttered (negative space for a headline). Match the original
lighting, color and grain. Patriotic navy-red-cream palette. No people, no text, no logos,
no watermark.
```
Then upscale the result to ≥2400px wide (any AI upscaler) so it's crisp full-bleed.

---

## Quick reference — what to ask for

| Page | Need? | Approach | Output file |
|---|---|---|---|
| **Specials** | ✅ yes (gap) | Generate — Prompt A | `assets/img/specials-hero.jpg` |
| Eat & Drink | optional | Generate — §2 | `assets/img/eat-hero.jpg` |
| Pro Shop | optional | Extend `proshop-pano` or generate — §3 | `assets/img/proshop-hero.jpg` |
| Home / Bowl / Leagues / Cosmic / Parties / Rewards / Contact / Live Scores | ❌ done | already have photo heroes | — |

> All outputs: **8:3, 2400×900, no people, dark/clean left 45%, patriotic palette.**
> Hand me the finished file(s) and I'll wire each into its hero with the navy-gradient
> wash and `z-index:0` photo layer.

---

## 5. MEMBER ZONE — graffiti backgrounds (login page + sign-in wipe)

The gated member zone is intentionally **graffiti-styled** to feel distinct from the cream/paper
public pages. Two backgrounds power it. **Both already ship as bespoke generated textures** (made
in-project with canvas) so the page looks finished today — these prompts are for an optional
**hand-painted / AI upgrade**. Drop the new file at the same path and it replaces the texture
automatically; **no code change.**

### 5a. Login form-panel — graffiti wall  →  `assets/img/login-graffiti-bg.png`
Used `background-size: cover` behind the right-hand sign-in card (and the "already signed in"
screen). The card is a solid white panel, so the wall must stay **calmer / darker through the
vertical center** for contrast and get busier toward the edges.
```
A dark navy graffiti wall, full-frame texture, no people, no readable words. Deep midnight-navy
base (#0a1430 to #101f44). Across it: scattered spray-paint dots, bubbles and bursts, paint drips,
bold outlined rings, and small five-point stars — in the venue's patriotic palette (red #e0241f,
royal blue #1b3a8f, gold #f5b423, green #1f9d55, purple, orange, teal, with cream/white star
accents). Energetic, hand-sprayed street-art feel, like the colorful dot halo around a bowling-
alley graffiti mural. Keep a calmer, darker vertical band through the CENTER (negative space for a
UI card); concentrate the paint toward the left and right edges. No text, no letters, no logos, no
watermark. Square-ish, ~1500x1500 or larger, tileable-friendly, painterly but clean.
```
Square ~1500×1500 (crops gracefully to the tall desktop panel and the short mobile band).

### 5b. Sign-in "roll" wipe — confetti  →  `assets/img/wipe-confetti.png`
The bowling-ball wipe curtain (navy gradient) is overlaid with this. Optional to regenerate.
```
A wide field of colorful bowling-alley graffiti confetti on a TRANSPARENT background (PNG alpha) —
multicolor spray-paint dots, bubbles, outlined rings and small five-point stars scattered edge to
edge, in red, royal blue, gold, green, purple, orange, teal with cream/white star accents.
Celebratory, hand-sprayed, evenly distributed, no large empty gaps, no text, no logos, no
watermark. Ultra-wide, ~1680x1000, transparent background.
```

> If you'd rather keep the current in-project textures, no action needed — they're already live.
> A generated upgrade just has to land at the path above.
