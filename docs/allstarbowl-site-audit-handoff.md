# All Star Bowl — Website Audit & Modernization Handoff
**Site:** https://www.allstarbowlindy.com (note: allstarbowl.com is NOT their domain)
**Audit date:** June 7, 2026
**Purpose:** Full content inventory + technical/design audit for redesign handoff

---

## 1. Business Facts (source of truth for redesign)

| Item | Value |
|---|---|
| Name | All Star Bowl |
| Address | 726 N Shortridge Rd, Indianapolis, IN 46219 |
| Phone | (317) 352-1848 |
| Maps link | https://goo.gl/maps/qRB5h79DSZDQ62H18 |
| Positioning | East-side Indianapolis family entertainment: bowling, sports bar, cafe, pro shop |
| Tagline | "PLAY * LAUGH * CHEER * SMILE * CELEBRATE" |
| Key staff (leagues) | Doug, Faith, Nikki — 317-352-1848 |
| Lanes | Synthetic lanes, wood approaches (touted on Honor Scores page) |

### Hours of Operation
| Day | Hours |
|---|---|
| Monday | 9:00 AM – 10:00 PM |
| Tuesday | 10:00 AM – 10:00 PM |
| Wednesday | 11:00 AM – 11:00 PM |
| Thursday | 11:00 AM – 10:00 PM |
| Friday | 12:00 PM – 11:00 PM |
| Saturday | 10:00 AM – 12:00 AM |
| Sunday | 12:00 PM – 9:00 PM |

### Rates
**Before 5 PM:** $5.00/person/game (adults); $4.25 (seniors 55+ & juniors ≤9); $35/hr/lane (up to 5 people)
**After 5 PM:** $6.25/person/game (all ages); $45/hr/lane
**After 5 PM Fri & Sat:** $7.25/game/person (2 or fewer bowlers); $50/hr/lane
**Shoe rental:** $4.00/pair

### Specials
- **Casino Bowling** — Mon & Thu 8 PM–close, $6.25/person/game. Strike turns screen into a slot machine; cash prizes.
- **Bowlers' Appreciation Club (BAC)** — free loyalty club, discounts the more you bowl, military discounts available. (Promoted via image scans on Specials page; the homepage link to its detail page is broken — returns a blank page.)

### Birthday Parties
- Package: 1.5 hrs bowling, shoes & balls, 1 large 1-topping pizza per 5 bowlers, 1 small drink per bowler — from $17/person
- Extra 1-topping pizzas $9 + tax
- Cake/cupcakes only (no outside beverages)
- 48-hour minimum notice; $25 non-refundable deposit; bowling starts promptly at scheduled time
- Bumpers available; birthday pins on request

### Leagues (Fall menu as listed — dates have no year and appear stale)
| Day | League | Per team | Start |
|---|---|---|---|
| Mon | Ladies Trio (Ladies) | 3 | 7:00 PM Aug 21 |
| Tue | Ted Gaizet Men's (Senior Men) | 5 | 11:00 AM Aug 15 |
| Tue | Golden Ager Ladies (Senior Ladies) | 4 | 12:00 PM Aug 15 |
| Tue | JE Young (Men) | 4 | 8:30 PM Aug 29 |
| Wed | Wednesday Night Men | 4 | 6:30 PM Aug 9 |
| Thu | Thursday Senior Mixed (Senior Coed) | 4 | 12:00 PM Aug 17 |
| Thu | Thursday Night Mixed (Any Combo) | 4 | 6:30 PM Sep 7 |
| Fri | Friday Night Mixed (Coed) | 4 | 7:00 PM Sep 8 |
| Sat | Saturday Youth Bumpers (ages 3–6) | 1 | 10:00 AM Sep 23 |
| Sat | Saturday Youth (Any Combo) | 3 | 10:00 AM Sep 23 |

### Youth Program
- Saturday Youth League, 10:00 AM; ages 4–20
- Coaching partnership: Score 60 Team + H2M Management
- Divisions: Wee Strikers (4–7), Amazing All Stars (7–12), Pacers (13–20)

### Pro Shop
Balls, bags, shoes, accessories, professional drilling.
Hours: Mon 4–8, Tue 11–8, Wed 4–9, Thu 12–7, Fri 5–8, Sat 9:30–2, Sun closed.

### The Alley Cafe
All-American menu; delivery via Grubhub and DoorDash. Categories: Pizzas & Calzones (create-your-own, specialty, MEGA pepperoni, calzones, garlic/nacho-bacon cheesebread, waffle sandwiches), Entrees & Sides (wings, mozzarella sticks, pretzel bites, fries, salads, mac & cheese), Sweets & Treats (dessert pizza, mini donuts). **Entire menu is images — zero text/prices in HTML.**

### The Alley Lounge
Page exists in nav but is **completely empty**. (Meta keywords reference bar/lounge/sports watching.)

---

## 2. Site Map (as crawled)

```
Home (/)
├── Info
│   ├── Hours & Rates (/Info/Hours-Rates)
│   └── Parties (/Info/Parties) ............... EMPTY PAGE
├── Leagues (/Leagues)
│   ├── League Standings ..................... EXTERNAL: livescores.computerscore.com (centre=112)
│   └── Honor Scores (/Leagues/Honor-Scores)
│       ├── 300 Games ........................ 1 entry, dated 1/20/2016
│       ├── 800 Series ....................... 1 entry, dated 1/7/16
│       └── High Averages .................... placeholder ("Check back later")
├── Birthdays (/Birthdays) ................... + party request form
├── The Alley Lounge (/The-Alley-Lounge) ..... EMPTY PAGE
├── The Alley Cafe (/The-Alley-Cafe) ......... menu = images only
├── Pro Shop (/-Pro-Shop) .................... note leading hyphen in URL
├── Youth (/Youth)
├── Specials (/Specials) ..................... content = scanned image flyers
├── Contact (/Contact) ....................... map embed + contact form
│   └── Join Email Club (/Contact/Join-Email-Club)
├── Terms (/Terms), Privacy (/Privacy)
└── (orphan) /specials/bowlers-appreciation-club ... BLANK (linked from homepage)
```

**Forms on site (all LiveForms + CAPTCHA):** League Sign Up (Leagues), Party Request (Birthdays), Send Us A Message (Contact), Join Email Club (asks full street address + birthday + country — country list still includes "Soviet Union," "Yugoslavia," "Zaire").

---

## 3. Technical Stack Assessment

| Layer | Finding |
|---|---|
| CMS | **DNN (DotNetNuke)** — ASP.NET WebForms. Evidence: `/Portals/0/`, `/DesktopModules/`, `__doPostBack()` postback links, DNN search module, "Sigma" icon set. |
| Template | BPAA Web Services template ("BlockBuilder" image system; BPAA Webservices logo in footer area). This is the Bowling Proprietors' Association turnkey site product. |
| Forms | DNN "LiveForms" module with CAPTCHA |
| League standings | Third-party: CDE Software ComputerScore (livescores.computerscore.com, centre 112) — keep this integration |
| Map | Google Maps iframe embed |
| Hosting/SSL | HTTPS works on www.allstarbowlindy.com |
| Mobile | Viewport meta present; WebForms-era template — heavy, postback-driven |

### Critical technical defects found
1. **Admin file-manager UI leaking to public** — the /Leagues page renders the entire DNN Digital Assets module (Create/Rename/Delete/Move Folder, Upload Files, "DROP STUFF HERE" drop zone) to anonymous visitors. Module permission misconfiguration. Looks broken and hints at a poorly maintained install — flag for immediate fix regardless of redesign timeline.
2. **Broken link, misspelled** — Honor Scores page links 800 Series to `/Legaues/Honor-Scores/800-Series` (typo "Legaues").
3. **Broken homepage link** — "Bowlers' Appreciation Club" → `/specials/bowlers-appreciation-club` returns an empty page.
4. **Placeholder/junk content live** — Pro Shop page shows "Add Content..." and a "GET SOCIAL" block linking to bare `facebook.com`, `twitter.com`, dead Google+ (`aboutme.google.com/...gplus`), generic LinkedIn, and a malformed Pinterest URL with a stray quote (`https://www.pinterest.com/"`).
5. **Empty pages in primary nav** — Parties, The Alley Lounge.
6. **Stale data** — honor scores last updated 2016; league start dates lack years; homepage "Tournament Special" block just restates regular rates.
7. **Image filenames suggest unfinished work** — menu images named `...TEST.png`, `GPT...jpg` (AI-generated menu photos) with mismatched alt text (e.g., alt "Roasted Cauliflower" on a salads image, alt "Kraft Mac & Cheese" on pretzel bites).

---

## 4. SEO / Accessibility Audit

**SEO**
- Title tags: every page is "All Star Bowl > [breadcrumb]" — no keyword-bearing, location-bearing titles.
- Meta description: literally "All Star Bowl" on most pages. No unique descriptions.
- Meta keywords tag in use (obsolete since ~2009).
- No structured data (LocalBusiness/schema.org) — hours, address, menu invisible to search/AI assistants.
- Cafe menu and Specials are images — no indexable text, no prices in HTML.
- "Cosmic bowling" appears in meta keywords but nowhere in actual site content — lost ranking opportunity if they offer it.

**Accessibility**
- Heading abuse everywhere: body copy and price lists marked up as H1–H3 (Pro Shop hours are seven separate H1s).
- Menu/specials as images with weak or wrong alt text — screen-reader users get nothing.
- Map embeds render as raw URL text in some contexts; postback `javascript:` links for search.
- Form labels/captcha pattern is dated; no visible focus/skip-nav (template-era).

---

## 5. Modernization Recommendations

### Quick wins (do now, even pre-redesign)
1. Fix Digital Assets module permissions on /Leagues (public file-manager exposure).
2. Fix the "Legaues" typo link and the dead BAC homepage link.
3. Remove "Add Content..." placeholder and dead social links on Pro Shop; either link real profiles or drop the block.
4. Remove or populate empty Parties and Alley Lounge pages.
5. Update or remove 2016 honor scores and undated league schedule.

### Redesign scope (new build)
- **Platform:** Replace DNN/WebForms with a modern stack — lightweight CMS (WordPress, Webflow) or static/Next.js with headless CMS. Site is ~12 pages of mostly static content; this is a small build.
- **Information architecture:** Consolidate to: Home · Bowl (rates/hours/specials) · Parties & Events · Leagues & Youth · Eat & Drink (Cafe + Lounge) · Pro Shop · Contact. Kill the orphaned/empty pages.
- **Content conversion:** Rebuild Cafe menu and Specials as real HTML with prices (huge SEO + accessibility win). Keep delivery links (Grubhub/DoorDash) as prominent CTAs.
- **Mobile-first:** Current template is desktop-era; most bowling customers arrive on phones looking for hours, prices, phone number — make those instantly visible.
- **Keep:** ComputerScore standings integration (link or iframe), Google Maps embed, phone-first contact pattern, the four forms (rebuild in modern form tooling, drop the address/birthday/country friction from Email Club).

### Feature additions (the "what could we add" list)
| Feature | Notes |
|---|---|
| **Online lane reservation/booking** | Biggest gap. Currently "please call." Options: full booking integration, or even a simple request-a-lane form with date/time as phase 1. |
| **Online party booking + deposit payment** | They already require a $25 deposit — let people pay it online (Stripe/Square). Converts the existing request form into revenue. |
| **Events calendar** | Casino Bowling nights, league start dates, specials — recurring events with dates/years. |
| **Cosmic bowling page** | In their meta keywords, absent from site. If offered, give it a page. |
| **Gift cards** | Standard for modern FEC sites. |
| **Live specials management** | CMS-editable specials so they stop uploading scanned flyers. |
| **Photo/video gallery** | Lanes, lounge, parties — currently almost no real photography of the venue. |
| **Google reviews embed + real social links** | Replace dead placeholder links. |
| **LocalBusiness + Menu schema** | Hours, geo, menu, priceRange — feeds Google/Maps/AI answers. |
| **League online registration** | Keep/upgrade existing sign-up form; auto-route by league type to Doug/Faith/Nikki. |
| **Email club via real ESP** | Mailchimp/Klaviyo signup (name + email only) instead of the address-and-birthday LiveForm. |
| **Analytics** | GA4 + Search Console baseline before/after launch. |

---

## 6. Asset Inventory (for design reference)

- Logo: `https://www.allstarbowlindy.com/Portals/0/Logo_ASB_3DS_png.png`
- Homepage banner: `/Portals/0/BlockBuilderImages/436/hours.jpg`
- Youth: `/Portals/0/BlockBuilderImages/397/youthbowling.jpg`
- Specials flyers: `/Portals/0/BlockBuilderImages/399/BAC_Rule20251.jpg`, `BAC_Rule2025.jpg`, `website_designsBowling Items II.jpg`
- Cafe menu images (all under `/Portals/0/BlockBuilderImages/394/`): Calzones.png, GPTMegaPep.jpg, "create your own pizza TEST.png", Cheesebreads.png, GPTNachoBaconCheesebread.jpg, "Waffle Sandwiches.png", GPTSpecPizzaMenu.jpg, Entree1.png, GPTMozzSticks.jpg, "Chicken Wings TEST.png", "salads TEST.png", GPTPretzelBites.jpg, "Dessert Pizza TEST.png", donuts1.png
- BPAA badge: `/Portals/0/BlockBuilderImages/383/BPAA-Webservices-new.png`

**Note:** Nearly all imagery is either menu graphics (some AI-generated) or scanned flyers. A redesign will need a real photo shoot of the venue, or licensed bowling photography as a stopgap.

---

## 7. Summary for the Design Team

This is a ~12-page DNN/BPAA template site, last meaningfully maintained years ago: 2016 honor scores, two empty nav pages, three broken links, placeholder text in production, and an admin file manager rendering publicly. The business content itself is solid and complete (hours, rates, parties, leagues, youth program, cafe, pro shop) and is fully captured in Section 1 — you can rebuild the entire site from this document without touching the old CMS. Highest-value additions: online lane/party booking with deposit payment, a real HTML menu, an events calendar, and basic local SEO (schema, titles, descriptions). Retain the ComputerScore standings link and the phone-first culture — this is a call-and-walk-in business; the site's job is hours, prices, directions, and bookings in two taps.
