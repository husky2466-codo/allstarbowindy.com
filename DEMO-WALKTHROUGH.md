# All Star Bowl — Demo Walkthrough

Your page-by-page script for the in-person demo. Each page has a title, a one-line "what this page is", and bullets of the features to point at. Features are assigned to one page only, so you never repeat yourself. The home/dashboard shows live teasers; the deep version of each feature lives on its own page.

Live URL: https://allstarbowlindy.myroproductions.com
Local: http://127.0.0.1:8090

A quick framing line you can open with: "Everything you see updating live, the lane counts, the wait time, the scores, is driven by a real-time engine. This isn't a flat brochure site, it behaves like the alley behaves."

---

## Site-wide (mention once, up front, then move on)

These are always on screen, so call them out at the start and don't re-explain them on every page.

- Top nav bar with live "Open / Closed, X lanes open" status chip that jumps to the live lane page when tapped
- Pro Shop cart in the header (slide-out drawer, item count badge) that follows you across the whole site
- Account menu (avatar) that changes between signed-out and signed-in, with quick links to stats, bag, scores, settings
- Animated 2.5D bowling lane behind the nav that replays a real ball-and-pin roll on every page change
- "Corner Buddy" mascot, bottom-right, that waves, reacts to buttons scrolling into view, gives page-specific greetings, and can be dismissed
- Footer with live "Right Now" status, hours-until-close, directions, and all the main links

---

## Home / Dashboard

The live "is it worth going right now" front page. Everything here is a teaser that links deeper; the full versions live on their own pages.

- Live "Open now" status pill with current capacity level (Open / Limited / Busy / Closed), updating every second
- Live lane-availability gauge, a circular meter showing open vs occupied lanes (e.g. "14 / 32 lanes open")
- Walk-in wait-time readout ("No wait, walk right in" or estimated minutes)
- Venue verdict card, an emoji and headline that changes with how busy it is ("It's a great bowling day" vs "Busy, reserve to be safe")
- Quick-facts strip: today's hours, open lanes, pricing from $5, tap-to-call phone
- Interactive Google Map embed with address and "Get Directions"
- Four tappable experience cards routing to Bowl / Eat / Drink / Leagues
- Teaser cards for Casino Bowling (animated slot reels), Rewards (sample member with tier badge and progress bar), and Birthday parties
- Mobile-app preview in an iOS phone frame, labeled "Coming Soon", showing the live lane grid and quick actions in-app

---

## Bowl / Reservations

The page that actually books a lane. This is the centerpiece, give it the most time.

- Full-size live status panel (large gauge, wait time, lanes-in-use, verdict, notices)
- 7-day hours table with "Open now" badge on the current day
- Open-bowling rate table (per game and per lane, time-based tiers, shoe rental, note that members pay less)
- 4-step booking flow (this is the money feature, walk through all four):
  - Step 1: pick a date on a 14-day calendar (closed days are disabled)
  - Step 2: pick a time slot, color-coded Open / Limited / Busy / Waitlist with lane counts
  - Step 3: set party size with +/- steppers (lanes and bowlers) and add shoes
  - Step 4: confirmation with itemized total, then name and phone to book
- Animated "You're booked!" success state with a texted-confirmation message
- Pro Shop drill/service hours card on the same page

---

## Leagues & Youth

Everything league-night and junior-program related, plus signup.

- "Today's leagues" widget showing which leagues are live right now
- Tap-a-day weekly schedule with league name, season start, team size, start time
- Youth program divisions: Wee Strikers (4-7), Amazing All Stars (7-12), Pacers (13-20)
- Honor-scores wall: perfect 300 games and 800+ series club
- League signup form (name, phone, league pick) with a success confirmation
- League coordinator contact cards (Doug, Faith, Nikki)

---

## Live Scores

Real-time, lane-by-lane scoring, the "wow" page for anyone who bowls. Note out loud that this is real captured league data being replayed live.

- All-lanes board: grid of every active lane with bowler names and a live indicator, tap any lane to open it
- Per-lane scoresheet: frame-by-frame grid (frames 1-10) with strikes, spares, misses, running totals
- Pin-deck visualization showing which pins are left standing after the first ball
- Game pager to flip between games 1, 2, 3 with a live update pulse
- Series stats view: match record, strike/spare counts, conversion percentages
- League standings, tabbed by day, linking out to full ComputerScore rankings
- Member access-code entry to jump into live lanes (or straight to demo lanes)

---

## Cosmic Bowling

The Friday/Saturday glow-bowling experience and the arcade.

- Glow-session schedule (which nights, what times)
- Cosmic pricing card with buy-in options and per-person cost
- "What makes it cosmic" feature cards (blacklight, projection, neon lanes)
- Photo gallery of the lanes under lights
- Arcade section: game grid with individual titles, plus claw machines and the prize-redemption wall
- Private glow-party CTA

---

## Eat & Drink

The Alley Cafe menu and sports-bar lounge.

- Auto-rotating hero slideshow of food/drink flyers with "Fan fave / New / Sweet" tags
- Full categorized menu (pizzas, specialty pizzas, premium, calzones, entrees, sides) with small/large pricing
- Grubhub and DoorDash delivery links
- Lounge section: full bar, draft/cocktails, big-screen watch parties
- Cafe photo gallery (lane-side booths, bar, kitchen, mural)

---

## Parties

End-to-end party and group-event booking with a live price calculator.

- Party package details (1.5 hrs bowling, shoes, pizza, drinks, bumpers, birthday pins) starting at $17/bowler
- Interactive price estimator: slide the bowler count (4-40), add extra pizzas, watch the total update live
- Group tiers (weekday-before-5 vs primetime-after-5, 2-game vs 3-game) plus a food add-on
- Corporate / team-building call-out
- Signature seasonal events (Family NYE Bash, Midnight Casino Bowl, Junior Gold Practice)
- Party request form (name, phone, date, time, size, requests) with a deposit-confirmation success state

---

## Pro Shop

Product catalog with two ways to shop and a reserve-to-fit workflow.

- Mode toggle: standard catalog grid vs the 3D "Walk-in Shop" tour
- Category filters (Balls, Bags, Shoes, Accessories, Services) with ball sub-filters (New, Deals, Used)
- Product cards with art, brand, specs, price, and an add-to-list heart
- Product detail modal with specs table, fit/care notes, plain-language glossary tooltips, and cross-sell suggestions
- 360 virtual walk-in tour: drag through real shop photos across three zones, tap glowing pins on products to open them
- Reserve / ask-the-pro request form that emails the front desk with your selected items
- Honest "representative pricing, not live inventory" disclaimer throughout

---

## Specials & Win Cash

Recurring promos, seasonal events, the rewards club, and the cash games.

- Weekly specials grid (Casino Bowling, Senior Day, Saturday Youth) with an "On now" indicator when one is live
- Seasonal/holiday events grid
- Bowlers' Appreciation Club (BAC) band: free to join, four tiers (Bronze to Diamond), per-game cost dropping from $6.25 to $4.00
- Kegler's Cash game: animated strike-jackpot board with two live-counting pots, plus tabbed how-to-play / buy-in / rules / payout-math explainers
- Casino Bowling game: 3-reel slot machine you can pull manually (auto-spins on casino nights), paying out $25/$50 on a match

---

## Rewards / Account (signed out)

The membership pitch for non-members. (When signed in, this becomes the member dashboard, see next.)

- "The more you bowl, the less you pay" hero with Join-free and already-a-member CTAs
- Rotating tier-card slideshow through all five tiers (BAC, Hole Punch, Silver, Gold, Diamond)
- Visual tier ladder showing game requirements and per-game rate climbing each tier
- Full rate-comparison table (games required vs daytime / weeknight / weekend / senior-junior rates)

---

## Member Dashboard (signed in)

The logged-in member's personal hub, a tabbed dashboard. (Demo tip: sign in on the login page with any 6 digits to land here.)

- My Stats tab: average with trend arrow, high game, high series, games tracked, an SVG score-trend chart, and a session log
- Equipment tab: searchable, filterable bowling-ball library (by brand, cover type, core type) with an add-to-bag toggle and a detail modal that explains specs in plain language
- My Bag tab: your saved balls, persisted for the session
- Scores & More tab: quick links to live scores, standings, and USBC average lookup
- Settings tab: profile, USBC ID lookup, and clearly-labeled "Phase 2" placeholders for loyalty/POS integration
- Honest empty states everywhere (no fake numbers, it shows "no games tracked yet" rather than inventing data)

---

## Login

Passwordless sign-in to the member area.

- Two methods: Continue with Google, or email me a one-time code
- 6-digit code entry (paste-friendly, auto-advancing boxes)
- Demo hint on screen: "any 6 digits sign you in"
- A rolling-bowling-ball wipe animation plays as it logs you in

---

## Join

Free BAC membership signup. (This is the no-friction version of the league/party forms.)

- Membership form (name, email, phone required; DOB, address optional)
- League-bowler and military/veteran checkboxes for discount eligibility
- Submit pre-fills an email to the front desk; success screen tells you to hit send
- Side rail listing the perks and a three-step "what happens next" timeline

---

## Contact

Find us, reach us, and tour the building.

- Embedded Google Street View 360 walk-through of the alley (with a full-screen button)
- Contact card: address (opens directions), tap-to-call, league standings link, mini hours
- Contact form with a topic dropdown (parties, leagues, pro shop, lost & found, feedback) and a sent confirmation
- Embedded location map

---

## Terms & Privacy

Standard legal pages, worth a 5-second mention so they know it's a complete, real site.

- Terms of Use (site use, reservations & deposits, house rules, trademarks)
- Privacy Policy (what's collected, how it's used, cookies/analytics, your choices)
- Both dated "Last updated June 2026" with a back-home button

---

## One-liner to close on

"This is a full site, not a mockup: live lane status, a working booking flow, real-time scores, a member dashboard, and a pro shop, all running today. The pieces that need your point-of-sale or loyalty data are clearly marked Phase 2, so you can see exactly where it plugs into your systems."
