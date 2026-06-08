# Member Area — Research Findings (cited)

> Web research, June 2026. Supports `docs/MEMBER-AREA-SCOPING.md`. The scoping doc is the
> decision; this is the evidence behind it.

## (a) How real bowling membership programs work online

**Bowlero / AMF "MVB Rewards"** (~300 locations — the industry's most developed program):
- 10 pts/dollar on bowling, shoes, food, pro shop; NOT on league lineage fees or online reservations
- Dashboard: point balance, activity history, coupon redemption ($5–$20 tiers, in-app barcode),
  claim-a-purchase for missed receipts, profile management
- **No lane reservation in the rewards system** (separate flow); **no league standings integration**
- Sources: [bowlero.com/mvb-faqs](https://www.bowlero.com/mvb-faqs), [amf.com/mvb-faqs](https://www.amf.com/mvb-faqs)

**BowlingRewards.com** (main third-party platform for independent centers):
- Three balances: Gift (prepaid), Rewards (cash-back %, never points), Games (free games)
- Online: balances, transaction history, profile, renew membership; birthday free games
- No stats, no reservations, no league data
- Source: [bowlingrewards.com/patrons/how-it-works.html](https://bowlingrewards.com/patrons/how-it-works.html)

**Independent best practices** (ROLLER): member accounts typically show visit history, upcoming
reservations, tier status, discounts. Honest caveat from the source: "many bowling centers lack
integrated systems, making manual benefit tracking the current reality."
Source: [roller.software/blog/bowling-alley-memberships](https://www.roller.software/blog/bowling-alley-memberships)

**Key ceiling:** even the largest chain does NOT connect its loyalty dashboard to league stats.
Loyalty and league data are separate systems everywhere.

## (b) Genuine member-facing data sources for All Star Bowl

**Computerscore / LiveScores — centre 112** (fetched directly):
- Login page with two paths: a session-scoped Live Access Code (6-digit, printed on scoresheets)
  and a persistent Member Login
- Live lane scores visible without login (real-time, frame-by-frame); League Standings in nav;
  prior scoresheets via the printed access code
- **Unclear:** whether Member Login gives a personal multi-week average-trend dashboard
- **No documented public API** — HTML pages only. Practical integration = deep-link / iframe.
- Sources: [livescores.computerscore.com centre 112](https://livescores.computerscore.com/index.php?state=IN&centre=112),
  [computerscore.com.au/products/livescores](https://computerscore.com.au/products/livescores/)

**USBC / BOWL.com:**
- Member Lookup (name + zip) returns member records; BOWL.com app shows averages, leagues, honor
  scores, membership card
- **No public REST API**; data is behind member login / in the app, not embeddable
- A center site can link to bowl.com but cannot pull the data without a USBC partnership/API that
  isn't publicly available
- Sources: [webapps.bowl.com/USBCFindA/Home/MemberLookup](https://webapps.bowl.com/USBCFindA/Home/MemberLookup),
  [bowl.com USBC app](https://bowl.com/news/usbc-unveils-updated-bowl-com-mobile-app)

**BAC (Bowlers' Appreciation Club):** the center's own program. Data lives in their internal
POS/tracking; no cloud layer or API. Visit count, discount tier, military status would have to be
provided by the business.

## (c) Recommended realistic feature set

**Tier A — sourceable today:** league live-scores link, standings link, USBC average via link-out,
equipment catalog browse (our 195-ball dataset), "my saved balls" (our datastore), BAC tier
explainer (static), next league night via LiveScores deep-link.

**Tier B — needs business to provide/build:** personal BAC tier/points, visit history, "my
reservations," real-time lane availability, birthday/promo triggers, charted personal average trend.

## (d) Do-not-fabricate list

No verified data source exists for this center for any of: personal BAC tier/points, personal
season average, team standing attributed to the logged-in user, lane booking from account, birthday
rewards, stats-based ball recommendations, full personal game history. Do not present these as real.

## Sources

- https://www.bowlero.com/mvb-faqs
- https://www.amf.com/mvb-faqs
- https://www.amf.com/mvb-rewards
- https://bowlingrewards.com/patrons/how-it-works.html
- https://bowlingrewards.com/business-owners/gift-rewards-games.html
- https://www.roller.software/blog/bowling-alley-memberships
- https://bowl.com/news/usbc-unveils-updated-bowl-com-mobile-app
- https://webapps.bowl.com/USBCFindA/Home/MemberLookup
- https://computerscore.com.au/products/livescores/
- https://computerscore.com.au/products/duohd/bowlers/
- https://livescores.computerscore.com/index.php?state=IN&centre=112
