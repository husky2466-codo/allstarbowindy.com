# All Star Bowl — Content Build Brief (for DesignClaude)

> **What this is:** the single, self-contained source of everything that needs to go on the
> All Star Bowl site. DesignClaude works in the claude.ai web app and **cannot open other files
> or see the reference images**, so every fact, price, and rule is written out inline here, and
> images are described in words. Paste this whole doc — or one `##` section at a time — into the
> design chat.
>
> **How to use it:** each page section below is a checklist. Items marked **[BUILT]** are reportedly
> already done; **[MISSING]** is what still needs adding (the gambling, deals, and capabilities the
> owner flagged). Build the MISSING items from the facts given here. Don't invent prices or rules —
> if something says *(confirm w/ owner)* it's not nailed down yet, so render it softly or omit.
>
> **You can pull the repo (read-only).** So you can open the reference images below to verify prices
> and rules against the actual flyers, and to view the real logo and interior photos. The facts in
> this doc were transcribed from those images — when in doubt, the image wins.

---

## Reference images in the repo (pull + view these)

- **Logo:** `public/img/reference/logos/all-star-bowl-3ds-logo.jpg` — the official crest (described in §0). Use as the source for the nav logo / favicon.
- **Kegler's Cash flyer (the §2 rules):** `public/img/reference/infodocs/482199052_9750108831687610_4794727382699239678_n.jpg` — the in-shop flyer with the buy-in ladder and "sign up before the 3rd frame" rule.
- **Promo / menu / event flyers (the rest of §2–§6 facts):** `public/img/reference/infodocs/` — ~22 FB flyers: party packages, Interactive/Corporate bowling, NYE family & adult, Junior Gold, Good Grades, phone-case kiosk, and priced menu boards. Filenames are opaque FB IDs; open them to see which is which.
- **Cafe menu boards with legible prices:** `public/img/reference/cafe/flat-crops/` (`cafe-front.jpg`, `cafe-left.jpg`, etc.) — flat crops of the in-store menu-board 360 pano; the most reliable source for exact cents.
- **Interior look-and-feel:** `public/img/reference/bar-lounge/flat-crops/` (sports bar, mascot mural, booths), `public/img/reference/proshop/flat-crops/`, plus `public/img/reference/behind-the-scenes/` and `public/img/reference/lounge/`. Use for color palette, vibe, and real photos.
- **Mascot art:** `public/img/generated/mascot/` (chroma-keyed transparent PNGs) — the corner-buddy mascot.
>
> **Status legend:** [BUILT] done · [PARTIAL] started, gaps remain · [MISSING] not started
> (Mark these accurately as you go — current marks are best-guess from the user, verify against your build.)

---

## 0. Brand + global facts (use everywhere)

- **Name:** All Star Bowl  ·  **Operator:** 3DS Entertainment Inc.
- **Address:** 726 N Shortridge Rd, Indianapolis, IN 46219 (east side)
- **Phone:** (317) 352-1848  ·  **Domain:** allstarbowlindy.com
- **Positioning:** East-side Indianapolis family entertainment — bowling, sports bar, cafe, pro shop
- **Tagline:** "PLAY ★ LAUGH ★ CHEER ★ SMILE ★ CELEBRATE"
- **48 synthetic lanes**, wood approaches · non-smoking · wheelchair accessible · catering/meeting space up to 67
- **Delivery:** cafe food via Grubhub & DoorDash

**Logo (describe to recreate — you can't see the file):** a shield/crest. Blue top banner reads
**"ALL STAR BOWL"** in white, with **"3DS"** below it flanked by small stars. A single white star sits
in a notch at the top center. The shield body has **red-and-white vertical stripes** behind two
**crossed white bowling pins** and a **blue bowling ball** (three finger holes) at the center bottom.
Americana / all-star sports feel: red, white, navy blue.

### Hours of Operation
| Day | Hours |
|---|---|
| Mon | 9:00 AM – 10:00 PM |
| Tue | 10:00 AM – 10:00 PM |
| Wed | 11:00 AM – 11:00 PM |
| Thu | 11:00 AM – 10:00 PM |
| Fri | 12:00 PM – 11:00 PM |
| Sat | 10:00 AM – 12:00 AM |
| Sun | 12:00 PM – 9:00 PM |

---

## 1. Bowling rates  — page: Bowl / Hours & Rates  — [MISSING/PARTIAL]

- **Before 5 PM:** $5.00/person/game (adults) · $4.25 (seniors 55+ & juniors ≤9) · $35/hr/lane (up to 5 people)
- **After 5 PM:** $6.25/person/game (all ages) · $45/hr/lane
- **After 5 PM Fri & Sat:** $7.25/person/game (2 or fewer bowlers) · $50/hr/lane
- **Shoe rental:** $4.00/pair

---

## 2. CASH GAMES / GAMBLING  — NEW PAGE: "Win Cash" (or section under Bowl)  — [MISSING]

This is the headline gap. There are **two separate cash mechanics** — keep them distinct.

### Kegler's Cash — the "Strike Jackpot" (CONFIRMED)
A branded vendor game. A wall board with a frame grid tracks player marks/strikes.
- **Win up to $150.00.**
- **Buy-in is the player's choice: $0.25 up to $5.00 per game.**
- **Win 10× what you play for.** Ladder: $0.25→$2.50 · $1.00→$10 · $2.00→$20 · $5.00→$50 (up to the $150 cap across games).
- **Average-based / handicap-style:** you win on "the correct marks and/or strikes based on your average group." (NOT consecutive strikes, NOT a red-pin game.)
- **Must sign up BEFORE you bowl** — before the first ball of the **3rd frame of the first game**.
- Tagline: *"Even if you only win once every nine games, you make a profit."*
- *(Confirm w/ owner: exact average brackets, whether all buy-in levels run, current pot.)*

### Casino Bowling (CONFIRMED)
- A **strike turns the lane screen into a slot machine — spin to win cash.**
- Runs **Mon & Thu, 8 PM–close**, **$6.25/person/game.**
- Also offered during Cosmic / Interactive sessions and the NYE Adult party.

> **Do NOT add** Monte Carlo, standalone Red Pin, or No-Tap — no evidence they run these.

---

## 3. Bowling experiences  — page: Bowl  — [PARTIAL: cosmic reportedly built]

- **Cosmic Bowling** — CONFIRMED real (was previously only a hidden meta keyword on the old site; deserves a real section). Glow/blacklight environment. NYE reference price: $25/person.
- **Interactive Bowling** — "Multiple Lane Graphics with Matching Audio." **Exclusive to All Star Bowl + Beech Grove Bowl.** Premium; "Ask for Details on Pricing." NYE reference price: $30/person.

---

## 4. Deals / promotions / specials  — page: Specials (or Home highlights)  — [MISSING]

- **Bowlers' Appreciation Club (BAC)** — free loyalty club; discounts grow the more you bowl; **military discounts available.** (On the old site this had a broken detail link — rebuild it properly.)
- **Good Grades / "School's Out"** — bring a report card (late May/June); **one free game pass per "A" or "B"** (high school & under); good through end of **July 2026**. Joint with Beech Grove Bowl; open 24 hrs that stretch, free shoe rental.
- **Easter promo** (seasonal).
- **Ladies League social programs** — Mondays.

---

## 5. Parties / events  — page: Parties  — [MISSING/PARTIAL]

### Birthday Parties
1.5 hrs bowling, shoes & balls, 1 large 1-topping pizza per 5 bowlers, 1 small drink per bowler — **from $17/person.** Extra 1-topping pizzas $9 + tax. Cake/cupcakes only (no outside beverages). 48-hr notice; **$25 non-refundable deposit.**

### Group / package parties (48 lanes, full bar & cafe, up to 67, shoes included, bumpers on request)
- **Weekday Party** (Mon–Fri before 5 PM): 2 games **$10.50/guest** · 3 games **$14.00/guest**
- **Primetime Party** (weekends & weekdays after 5 PM): 2 games **$13.00/guest** · 3 games **$17.75/guest**
- **Add food:** Pizza Buffet or Tailgate package **$12.00/guest** ($9.00 kids 12 & under)
- **50% non-refundable deposit** at booking for group events.
- **Corporate / teambuilding parties** — book 317-352-1848.

### Seasonal
- **New Year's Eve — Family** (5:30–8 PM): 2.5 hrs unlimited bowling, free shoes, hats/noisemakers, pizza + drinks, ginger-ale toast, raffles/prizes — **~$80/lane.**
- **New Year's Eve — Adult** (9 PM–midnight): casino bowling, champagne toast — **$25/person Cosmic / $30/person Interactive.**

### Youth / competitive
- **Junior Gold Practice** — $120, 8-week session, oil pattern changes every 2 weeks, Mondays (e.g. 5/18–7/6), 7–9 PM.

---

## 6. The Alley Cafe  — page: Eat & Drink  — [MISSING the real prices]

The old site's menu was **images only, zero prices in HTML** — rebuilding this as real text is a big SEO + accessibility win. *(Verify exact cents against flyers before publishing; these are captured from FB flyer OCR.)*

- **Pizzas (create-your-own):** Small 10" cheese **$5.05** / Large 14" cheese **$6.05**; +$1.00 small / +$2.10 large per topping. 2nd large (equal/lesser) ~$13.53–15.63. Double-cheese-crust +$4.00/pizza.
- **Specialty pizzas:** Sloppy Joe ~$8.25; premium large-only ~$18.34–22.25; **Mega Pepperoni** (2 crusts/2 cheese/4 pepperoni) ~$22.25.
- **Calzones:** 10", up to 3 fillings ~$11.69. Specialty: Grilled Cheese & Bacon, Philly Cheese Steak.
- **Cheesebreads/breadsticks:** Garlic $7.11; Bacon/Pepperoni/Nacho ~$8.94–10.09.
- **Entrees (~$3.21–9.00):** BLT, hot dog, mini corn dogs (8), chicken fingers (5), sloppy joe, grilled cheese, burgers (single/double, +cheese).
- **Sides (~$8.49–15.00):** small/large fries, nachos & cheese, mozzarella sticks (4), soft pretzel, specialty fries (bacon-nacho / garlic-parm), pretzel bites.
- **Wings:** bone-in + boneless — Original, Sweet & Spicy, Hot.
- **Breakfast:** Maple Waffle Breakfast Sandwiches (bacon or sausage, egg & cheese).
- **Salads:** Garden, Grilled Chicken Garden, side salads.
- **Desserts:** Peanut Butter dessert pizzas (chocolate / M&M / Reese's / S'mores / bacon-PB) ~$10.32–11.37; mini donuts.
- **Roasted Cauliflower** (large/small; plain / w-cheese / w-cheese & bacon).
- *"Tax not included."* Delivery: Grubhub & DoorDash.

### The Alley Lounge (sports bar) — [MISSING — old page was empty]
Full bar, sports watching. Needs real copy + photos. Mascot mural lives in this space.

---

## 7. Leagues  — page: Leagues  — [PARTIAL]

Contacts: **Doug, Faith, Nikki — 317-352-1848.** Standings live externally at livescores.computerscore.com (centre=112) — there's a separate LiveScores demo in the works.

Fall league menu (dates are stale/year-less — present as "typical schedule, contact to confirm"):
Mon Ladies Trio 7 PM · Tue Ted Gaizet Men's 11 AM · Tue Golden Ager Ladies 12 PM · Tue JE Young 8:30 PM · Wed Wednesday Night Men 6:30 PM · Thu Senior Mixed 12 PM · Thu Night Mixed 6:30 PM · Fri Night Mixed 7 PM · Sat Youth Bumpers (3–6) 10 AM · Sat Youth (any) 10 AM.

**Youth program:** Saturday Youth League 10 AM, ages 4–20. Coaching: Score 60 Team + H2M Management. Divisions: Wee Strikers (4–7), Amazing All Stars (7–12), Pacers (13–20).

---

## 8. Pro Shop  — page: Pro Shop  — [BUILT]
Balls, bags, shoes, accessories, professional drilling. Hours: Mon 4–8, Tue 11–8, Wed 4–9, Thu 12–7, Fri 5–8, Sat 9:30–2, Sun closed. *(Reportedly already built — verify it includes these hours.)*

---

## 9. Other capabilities  — Home highlights / dedicated cards  — [MISSING]
- **Custom Phone Cases** — in-house DIY 3D-embossing kiosk: scan, pick a case, upload a photo, pay, print. *"Only at All Star Bowl."*
- **Arcade / redemption** — prize robot/claw machines, mystery capsule toys.

---

## 10. Not yet available (don't fabricate)
- **History / "Our Story"** — the good source is a paywalled 2022 IndyStar feature; not retrieved yet. Leave an About page light until the user supplies the text.
- **Instagram content** — not captured yet.
- **Exact Kegler's Cash brackets, BPAA cost questions** — pending owner callback.

---

## Quick "what's missing" punch list (the user's actual ask)
1. **Cash Games / "Win Cash" page** — Kegler's Cash + Casino Bowling (§2). ← top priority
2. **Deals/Specials** — BAC, Good Grades, seasonal (§4).
3. **Cafe menu with real prices** as text (§6).
4. **The Alley Lounge** sports-bar page (§6).
5. **Phone-case kiosk + arcade** capability cards (§9).
6. **Parties** full pricing tiers (§5).
7. Real **bowling rates** if not already in (§1).
