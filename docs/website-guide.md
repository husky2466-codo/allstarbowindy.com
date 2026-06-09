<!--
  All Star Bowl - Website Guide (client-facing)
  Audience: Nikki (owner). Plain-English tour of what the site does and why it matters.
  Companion doc: technical-and-costs.md (architecture + hosting costs).

  Image note: screenshots live in _local-artifacts/screenshots/site-tour/ (gitignored,
  ~41MB) and are referenced with a relative path. They render in any Markdown previewer
  reading from disk, but are intentionally NOT committed to keep the repo light and clean
  (per the 2026-06-08 security cleanup that pulled artifacts out of the repo). When we
  render this to PDF/web, the renderer pulls them from disk regardless.

  Demo data: the live lane counts, member stats, league standings, and pot amounts shown
  in these screenshots are realistic SAMPLE data so you can see how it all works. Real
  numbers drop in once you confirm them.
-->

# All Star Bowl - Website Guide

A walk-through of the site, page by page. For each one: what it does, and why it earns its place. Everything you see works today on a phone and on a computer.

**Live site:** https://allstarbowlindy.myroproductions.com

> The numbers in these screenshots (open lanes, wait times, member stats, league
> standings, jackpot pots) are realistic **sample data**. They show how the site behaves;
> your real numbers slot in once confirmed.

---

## The one idea behind the whole site

Most bowling-alley websites are a digital flyer: hours, a phone number, maybe a menu. This one is built around the question your customers actually ask before they leave the house:

**"Should I go bowling right now?"**

Is it open? Are lanes free? How long's the wait? What's going on tonight? The whole site answers that at a glance, so people stop calling to find out and just show up.

---

## Home - Know before you go

| Phone | Desktop |
|---|---|
| ![Home on phone](../_local-artifacts/screenshots/site-tour/home-phone.png) | ![Home on desktop](../_local-artifacts/screenshots/site-tour/home-desktop.png) |

The centerpiece is the live status block at the top: **open or closed, roughly how many lanes are free, the wait, and what's happening tonight.** It changes through the day, "No wait, walk right in" when it's quiet, "Busy, reserve to be safe" when it's packed.

**Why it matters:** This is the thing nobody else on the east side has. It turns "I wonder if it's busy" into "let's go" - and it turns a phone call your front desk has to answer into a decision the customer makes on their own. Below the status, the home page funnels people straight to the things that make you money: Casino Bowling nights, the Cafe, parties, and the rewards club.

---

## The Alley Cafe - Fuel between frames

| Phone | Desktop |
|---|---|
| ![Menu on phone](../_local-artifacts/screenshots/site-tour/menu-phone.png) | ![Menu on desktop](../_local-artifacts/screenshots/site-tour/menu-desktop.png) |

The full Cafe menu with prices, pizzas, wings, waffle sandwiches, and the rest, laid out so people can read it before they get there.

**Why it matters:** Food is margin. A menu people can actually browse on their phone at the lane sells more of it. No more "what do you have to eat?" at the counter.

---

## Leagues & Youth - Schedules and sign-up

| Phone | Desktop |
|---|---|
| ![Leagues on phone](../_local-artifacts/screenshots/site-tour/leagues-phone.png) | ![Leagues on desktop](../_local-artifacts/screenshots/site-tour/leagues-desktop.png) |

League info, youth programs, and how to get involved, all in one place.

**Why it matters:** Leagues are your recurring revenue. The easier it is for someone to understand what's offered and how to join, the more lanes you fill on weeknights.

---

## Cosmic / Glow Bowling - The night out

| Phone | Desktop |
|---|---|
| ![Cosmic on phone](../_local-artifacts/screenshots/site-tour/cosmic-phone.png) | ![Cosmic on desktop](../_local-artifacts/screenshots/site-tour/cosmic-desktop.png) |

Glow nights, the arcade, the after-dark vibe, presented to look like the good time it is.

**Why it matters:** This is what pulls in the weekend crowd and the younger groups. It deserves to look exciting, not like a line item. (Nights and pricing here are placeholders until you confirm them.)

---

## Parties & Events - Done-for-you fun

| Phone | Desktop |
|---|---|
| ![Parties on phone](../_local-artifacts/screenshots/site-tour/parties-phone.png) | ![Parties on desktop](../_local-artifacts/screenshots/site-tour/parties-desktop.png) |

Birthday and event packages laid out clearly, what's included, who it's for.

**Why it matters:** Parties are big-ticket bookings. A clear packages page does the selling for you and cuts down the back-and-forth before someone commits.

---

## Pro Shop - Gear, fitting, and a 360 look inside

| Phone | Desktop |
|---|---|
| ![Pro Shop on phone](../_local-artifacts/screenshots/site-tour/proshop-phone.png) | ![Pro Shop on desktop](../_local-artifacts/screenshots/site-tour/proshop-desktop.png) |

The Pro Shop page, including a **360 walk-through** so people can look around the shop before they visit, plus the path to fitting and drilling.

**Why it matters:** Most people don't know a real pro shop is in there. Showing it, literally letting them look around, turns "I'll buy a ball online" into "I'll get fitted at All Star."

---

## Live Scores & Standings

| Phone | Desktop |
|---|---|
| ![Live scores on phone](../_local-artifacts/screenshots/site-tour/scores-phone.png) | ![Live scores on desktop](../_local-artifacts/screenshots/site-tour/scores-desktop.png) |

League standings and scores, pulled into the site so bowlers don't have to dig through a separate system.

**Why it matters:** League bowlers check standings constantly. Putting them on your site gives those bowlers a reason to come back to it again and again, and every visit is a chance to see tonight's specials.

---

## Bowlers' Appreciation Club - The loyalty engine

This is the part with the most room to grow, and the biggest payoff. It is a **preview** today: the experience is built and clickable, but the live member data behind it is the next phase to wire up.

### Before you sign in

![Rewards teaser](../_local-artifacts/screenshots/site-tour/account-teaser-desktop.png)

A simple pitch to join, free, with the promise that **the more you bowl, the less you pay.**

### Signing in

![Sign-in screen](../_local-artifacts/screenshots/site-tour/login-desktop.png)

No password to remember, members sign in with Google or a one-time email code. (In the demo, any 6 digits sign you in so you can look around.)

### The member dashboard

| Phone | Desktop |
|---|---|
| ![Member area on phone](../_local-artifacts/screenshots/site-tour/account-member-phone.png) | ![Member area on desktop](../_local-artifacts/screenshots/site-tour/account-member-desktop.png) |

Once signed in, a bowler sees **their own game**: average, high game, high series, games tracked, a trend chart of how they're improving, and a session log of every set they've bowled.

### My Bag - their equipment

![My Bag](../_local-artifacts/screenshots/site-tour/account-mybag-desktop.png)

A place for each bowler to track the balls they throw, their "bag", which ties straight back into the Pro Shop for fitting and new gear.

**Why it matters:** This is what turns a casual bowler into a regular. People come back to places that *remember them* and show them getting better. It's also a direct line into Pro Shop sales and a reason to bowl more games to climb the rewards tiers. This is the difference between a website and a customer-retention machine, and it's the part we build out together.

---

## Contact

| Phone | Desktop |
|---|---|
| ![Contact on phone](../_local-artifacts/screenshots/site-tour/contact-phone.png) | ![Contact on desktop](../_local-artifacts/screenshots/site-tour/contact-desktop.png) |

Address, phone, hours, directions, and a map, the basics, done right.

---

## The short version

- **Phase 1 - live and real today:** knowing what's happening right now, beautifully, on any phone. Home status, menu, leagues, cosmic, parties, pro shop, scores, contact.
- **Phase 2 - previewed, built next:** the loyalty club with real member accounts, game tracking, My Bag, and the deeper insights that show you who's coming in and what's drawing them.

What it costs to run, and the two ways we can host it, is covered in the companion document: **technical-and-costs.md**.
