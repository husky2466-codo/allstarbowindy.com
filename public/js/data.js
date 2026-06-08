/* ============================================================
   All Star Bowl — Business data + live status engine
   Plain JS, attached to window.ASB. Loaded before React.
   Time-aware: reads the real clock to compute open/closed,
   lane availability, wait times, league takeovers & specials.
   ============================================================ */
(function () {
  "use strict";

  // ---- Business facts -------------------------------------------------
  var BIZ = {
    name: "All Star Bowl",
    operator: "3DS Entertainment Inc.",
    tagline: "PLAY · LAUGH · CHEER · SMILE · CELEBRATE",
    address: "726 N Shortridge Rd, Indianapolis, IN 46219",
    cityState: "Indianapolis, IN",
    phone: "(317) 352-1848",
    phoneHref: "tel:+13173521848",
    email: "allstarbowlindy@gmail.com",
    emailHref: "mailto:allstarbowlindy@gmail.com",
    maps: "https://maps.google.com/?q=726+N+Shortridge+Rd+Indianapolis+IN+46219",
    standings: "https://livescores.computerscore.com/standings.php?centre=112",
    totalLanes: 48
  };

  // ---- LiveScores / Computer Score integration -----------------------
  // The venue's league scorekeeping runs on a third-party platform
  // (Computer Score, branded "LiveScores"). All Star Bowl is centre=112.
  // No API / no iframe / no feed — only outbound links are sanctioned.
  // We keep these endpoints in one place so the Live Scores page can run
  // in either route without code changes:
  //   Route A — deep-link out to these URLs.
  //   Route B — re-render cached data natively, deep-link as fallback.
  var LIVESCORES = {
    vendor: "Computer Score",
    product: "LiveScores",
    centre: 112,
    base: "https://livescores.computerscore.com",
    landing: "https://livescores.computerscore.com/index.php?centre=112",
    lanes: "https://livescores.computerscore.com/view-lanes.php?centre=112",
    standings: "https://livescores.computerscore.com/standings.php?centre=112",
    memberLogin: "https://livescores.computerscore.com/userlogin.php",
    changeVenue: "https://livescores.computerscore.com/centres.php",
    // demo provenance for the native (Route B) "cached" badge
    syncedAt: "Today · 6:00 AM ET"
  };

  // ---- League schedule / standings grid (real, from Computer Score) ---
  // Transcribed from livescores.computerscore.com/standings.php?centre=112.
  // Data model (per feature brief): day / name / time / type /
  // bowlersPerTeam / teams. `time` kept as published (mixed 12h/24h).
  // Per-league detail codes are NOT predictable and must be parsed from
  // source — until a parser runs, each league deep-links to the grid.
  var STANDINGS = [
    { day: "Monday", name: "Ladies Trio", time: "7:00p", type: "Female Night League", perTeam: 3, teams: 8 },
    { day: "Monday", name: "Eddie Brashear Mixed League", time: "6:00p", type: "Mixed Night League", perTeam: 5, teams: 28 },
    { day: "Monday", name: "Ken Hendricks Monday Morning Mixed", time: "9:30a", type: "Mixed Day League", perTeam: 4, teams: 14 },

    { day: "Tuesday", name: "Meridian Lodge Summer Mixed League", time: "6:30p", type: "Mixed Night League", perTeam: 4, teams: 42 },
    { day: "Tuesday", name: "Chatterbox Jazz", time: "7:00p", type: "Mixed Night League", perTeam: 4, teams: 16 },
    { day: "Tuesday", name: "J E Young Men", time: "8:00p", type: "Mixed Night League", perTeam: 4, teams: 12 },
    { day: "Tuesday", name: "Tuesday Night Doubles", time: "7:00p", type: "Mixed Night League", perTeam: 2, teams: 4 },
    { day: "Tuesday", name: "Ted Gaizat Goldenager Men", time: "11:00a", type: "Male Day League", perTeam: 5, teams: 16 },
    { day: "Tuesday", name: "Summer Senior Mixed League", time: "12:00p", type: "Mixed Day League", perTeam: 4, teams: 22 },
    { day: "Tuesday", name: "Goldenagers Ladies", time: "12:00p", type: "Female Day League", perTeam: 4, teams: 10 },

    { day: "Wednesday", name: "Youth Adult Summer League", time: "6:30p", type: "Mixed Night League", perTeam: 2, teams: 4 },
    { day: "Wednesday", name: "CHRR Wednesday Night Mens", time: "6:30p", type: "Male Night League", perTeam: 5, teams: 28 },
    { day: "Wednesday", name: "For Splits & Giggles", time: "6:59p", type: "Mixed Night League", perTeam: 4, teams: 8 },
    { day: "Wednesday", name: "Senior League of Masters", time: "9:00a", type: "Male Day League", perTeam: 3, teams: 22 },
    { day: "Wednesday", name: "Benny's Golden Playmates", time: "12:00p", type: "Mixed Day League", perTeam: 4, teams: 26 },

    { day: "Thursday", name: "Thursday Mixed Trios", time: "7:00p", type: "Mixed Night League", perTeam: 3, teams: 10 },
    { day: "Thursday", name: "IBLB", time: "6:00p", type: "Mixed Night League", perTeam: 4, teams: 6 },
    { day: "Thursday", name: "Thursday Night Mixed", time: "6:45p", type: "Mixed Night League", perTeam: 4, teams: 16 },
    { day: "Thursday", name: "Zion Hope Doubles", time: "6:59p", type: "Mixed Night League", perTeam: 2, teams: 16 },
    { day: "Thursday", name: "Senior High Rollers Mixed", time: "12:00p", type: "Mixed Day League", perTeam: 4, teams: 16 },

    { day: "Friday", name: "Friday Night Mixed", time: "7:00p", type: "Mixed Night League", perTeam: 4, teams: 8 },
    { day: "Friday", name: "Indy Parks", time: "12:00p", type: "Mixed Day League", perTeam: 4, teams: 6 },

    { day: "Saturday", name: "J.E.M.I.", time: "6:00p", type: "Mixed Night League", perTeam: 5, teams: 34 },
    { day: "Saturday", name: "TNBA Indy Senate Juniors", time: "9:30a", type: "Mixed Junior League", perTeam: 1, teams: 6 },
    { day: "Saturday", name: "TNBA Indy Senate Bantam", time: "9:30a", type: "Mixed Junior League", perTeam: 1, teams: 4 },
    { day: "Saturday", name: "Pin Pals", time: "10:00a", type: "Mixed Day League", perTeam: 4, teams: 6 },
    { day: "Saturday", name: "Pacers", time: "10:00a", type: "Mixed Junior League", perTeam: 3, teams: 4 },
    { day: "Saturday", name: "Wee Strikes", time: "10:00a", type: "Mixed Junior League", perTeam: 1, teams: 4 },
    { day: "Saturday", name: "Youth Sport Singles", time: "10:00a", type: "Mixed Junior League", perTeam: 1, teams: 16 },
    { day: "Saturday", name: "Special Rollers", time: "12:30p", type: "Mixed Junior League", perTeam: 2, teams: 6 },

    { day: "Sunday", name: "Brothers & Sister", time: "5:30p", type: "Mixed Day League", perTeam: 3, teams: 10 }
  ];

  // ---- Hours of Operation ---------------------------------------------
  // CONFIRMED against the content brief (matches the live site, not the
  // older posted sign): Mon 9–10, Tue 10–10, Wed 11–11, Thu 11–10,
  // Fri 12–11, Sat 10–12a, Sun 12–9.
  // index by JS getDay(): 0=Sun ... 6=Sat. open/close in minutes-from-midnight.
  // close of 24:00 (1440) = midnight.
  var HOURS = [
    { day: "Sunday",    open: 12 * 60, close: 21 * 60 },       // Sun 12–9
    { day: "Monday",    open: 9 * 60,  close: 22 * 60 },       // Mon 9–10
    { day: "Tuesday",   open: 10 * 60, close: 22 * 60 },       // Tue 10–10
    { day: "Wednesday", open: 11 * 60, close: 23 * 60 },       // Wed 11–11
    { day: "Thursday",  open: 11 * 60, close: 22 * 60 },       // Thu 11–10
    { day: "Friday",    open: 12 * 60, close: 23 * 60 },       // Fri 12–11
    { day: "Saturday",  open: 10 * 60, close: 24 * 60 }        // Sat 10–12a (midnight)
  ];

  // ---- Rates ----------------------------------------------------------
  var RATES = {
    perGame: [
      { label: "Before 5 PM — Adults", price: "$5.00", per: "/ game" },
      { label: "Before 5 PM — Seniors 55+ & Juniors ≤9", price: "$4.25", per: "/ game" },
      { label: "After 5 PM — All ages", price: "$6.25", per: "/ game" },
      { label: "After 5 PM Fri & Sat (2 or fewer)", price: "$7.25", per: "/ game" }
    ],
    perLane: [
      { label: "Before 5 PM", price: "$35", per: "/ hr / lane" },
      { label: "After 5 PM", price: "$45", per: "/ hr / lane" },
      { label: "After 5 PM Fri & Sat", price: "$50", per: "/ hr / lane" }
    ],
    shoes: "$4.00",
    note: "Lane rate covers up to 5 bowlers. Shoe rental $4.00 / pair."
  };

  // ---- Loyalty: Bowlers' Appreciation Club (real tiers) ---------------
  var BAC_TIERS = [
    { key: "BAC",       name: "BAC",        gamesReq: 0,   day: 5.00, night: 6.25, weekend: 7.25, sj: 4.25 },
    { key: "HOLE",      name: "Hole Punch", gamesReq: 10,  day: 4.75, night: 5.75, weekend: 7.25, sj: 3.90 },
    { key: "SILVER",    name: "Silver",     gamesReq: 60,  day: 4.50, night: 5.25, weekend: 7.25, sj: 3.60 },
    { key: "GOLD",      name: "Gold",       gamesReq: 160, day: 4.25, night: 4.75, weekend: 7.25, sj: 3.30 },
    { key: "DIAMOND",   name: "Diamond",    gamesReq: 360, day: 4.00, night: 4.25, weekend: 7.25, sj: 3.00 }
  ];

  // ---- Leagues (define league-takeover windows) -----------------------
  // day = getDay(); start/end minutes; lanes = lanes occupied.
  var LEAGUES = [
    { day: 1, name: "Ladies Trio", group: "Ladies", start: 19 * 60, end: 21 * 60 + 30, lanes: 10, perTeam: 3, startDate: "Aug 21" },
    { day: 2, name: "Ted Gaizet Men's", group: "Senior Men", start: 11 * 60, end: 13 * 60 + 30, lanes: 12, perTeam: 5, startDate: "Aug 15" },
    { day: 2, name: "Golden Ager Ladies", group: "Senior Ladies", start: 12 * 60, end: 14 * 60, lanes: 8, perTeam: 4, startDate: "Aug 15" },
    { day: 2, name: "JE Young", group: "Men", start: 20 * 60 + 30, end: 23 * 60, lanes: 10, perTeam: 4, startDate: "Aug 29" },
    { day: 3, name: "Wednesday Night Men", group: "Men", start: 18 * 60 + 30, end: 21 * 60, lanes: 14, perTeam: 4, startDate: "Aug 9" },
    { day: 4, name: "Thursday Senior Mixed", group: "Senior Coed", start: 12 * 60, end: 14 * 60 + 30, lanes: 10, perTeam: 4, startDate: "Aug 17" },
    { day: 4, name: "Thursday Night Mixed", group: "Any Combo", start: 18 * 60 + 30, end: 21 * 60, lanes: 14, perTeam: 4, startDate: "Sep 7" },
    { day: 5, name: "Friday Night Mixed", group: "Coed", start: 19 * 60, end: 21 * 60 + 30, lanes: 12, perTeam: 4, startDate: "Sep 8" },
    { day: 6, name: "Saturday Youth Bumpers", group: "Ages 3–6", start: 11 * 60, end: 12 * 60 + 30, lanes: 8, perTeam: 1, startDate: "Sep 23" },
    { day: 6, name: "Saturday Youth", group: "Any Combo", start: 11 * 60, end: 13 * 60, lanes: 10, perTeam: 3, startDate: "Sep 23" }
  ];

  // ---- Recurring specials ---------------------------------------------
  // type: promo shown on the day. day = getDay() or array.
  var SPECIALS = [
    { days: [1, 4], name: "Casino Bowling", start: 20 * 60, end: 24 * 60, blurb: "Strike turns your screen into a slot machine — win cash prizes. $6.25 / person / game.", tag: "Mon & Thu · 8 PM" },
    { days: [2], name: "Senior Day", start: 11 * 60, end: 17 * 60, blurb: "Seniors 55+ bowl for $4.25 / game before 5 PM. Two senior leagues roll daytime.", tag: "Tuesdays" },
    { days: [6], name: "Saturday Youth League", start: 11 * 60, end: 13 * 60, blurb: "Wee Strikers, All Stars & Pacers divisions. Ages 4–20, coaching included.", tag: "Saturdays · 11 AM" }
  ];

  // ---- Holiday / special-hours overrides ------------------------------
  // Keyed "MM-DD". Demo entries so the holiday banner is visible.
  var HOLIDAYS = {
    "07-04": { name: "Independence Day", open: 12 * 60, close: 24 * 60, note: "Star-Spangled Bowl · extended late hours & cosmic lanes" },
    "11-27": { name: "Thanksgiving", closed: true, note: "Closed — Happy Thanksgiving from our family to yours" },
    "12-24": { name: "Christmas Eve", open: 11 * 60, close: 16 * 60, note: "Closing early at 4 PM" },
    "12-25": { name: "Christmas Day", closed: true, note: "Closed for the holiday" },
    "12-31": { name: "New Year's Eve", open: 12 * 60, close: 24 * 60 + 120, note: "Midnight Strike Party — open till 2 AM" }
  };

  // ---- Cosmic / Glow Bowling ------------------------------------------
  // DEMO schedule + pricing — plausible defaults flagged for the owner to
  // confirm. The venue runs projected-lane "cosmic" glow sessions (real
  // photos show full-lane light projection + blacklight).
  var COSMIC = {
    tagline: "Lights down. Glow up.",
    lead: "When the house lights drop, the whole house lights up. Every lane glows under blacklight and full-lane light projection, the music turns up, and bowling turns into a light show.",
    features: [
      { icon: "spark", title: "Blacklight & glow", body: "UV lights make whites, neons and the lanes themselves glow — wear light colors and watch them pop." },
      { icon: "bolt", title: "Projected lanes", body: "Color light shows play right down the lanes between frames — no two rolls look the same." },
      { icon: "star", title: "Music & lasers", body: "Club-style sound and moving lights turn the concourse into a party from the first frame to the last." }
    ],
    sessions: [
      { day: "Friday", time: "9:00 PM – Close", note: "Late-night glow" },
      { day: "Saturday", time: "9:00 PM – Midnight", note: "Our biggest glow night" },
      { day: "Holidays", time: "Extended hours", note: "July 4th & New Year's Eve run cosmic late" }
    ],
    pricing: [
      { label: "Cosmic — per person", price: "$7.25", per: "/ game", note: "Shoes included Fri & Sat glow nights" },
      { label: "Cosmic lane — per hour", price: "$50", per: "/ hr / lane", note: "Up to 5 bowlers per lane" },
      { label: "Glow party package", price: "From $20", per: "/ bowler", note: "Private cosmic lanes — call to book" }
    ],
    demo: true
  };

  // ---- Arcade & redemption --------------------------------------------
  // Grounded in the real game lineup visible in venue photos.
  var ARCADE = {
    lead: "Between frames or all night long — the arcade keeps the whole family playing. Classics, claw machines, a full-motion racer and a wall of prizes to cash your tickets in for.",
    games: [
      { name: "Pac-Man's Pixel Bash", kind: "Classics cabinet", blurb: "Dozens of arcade classics — Pac-Man, Galaga, Dig Dug and more — in one stand-up cabinet.", tag: "Retro" },
      { name: "Raw Thrills Racing", kind: "Full-motion racer", blurb: "Sit-down racing simulator with force-feedback wheel and a real bucket seat. Go for the lap record.", tag: "Driving" },
      { name: "Moonlight Catcher", kind: "Claw machine", blurb: "Plush, toys and prizes under the lights — line up the claw and drop for the win.", tag: "Claw" },
      { name: "Shooting Star", kind: "Claw machine", blurb: "The little red claw packed with novelties. A buck a try and surprisingly winnable.", tag: "Claw" }
    ],
    redemption: {
      title: "Tickets & prizes",
      body: "Win tickets across the floor and trade them in at the prize wall — candy and small toys for the little ones up to the big-ticket items on the top shelf."
    }
  };

  // ---- Helpers --------------------------------------------------------
  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function fmtClock(mins) {
    var m = ((mins % 1440) + 1440) % 1440;
    var h = Math.floor(m / 60), mm = m % 60;
    var ap = h >= 12 && h < 24 ? "PM" : "AM";
    var hr = h % 12; if (hr === 0) hr = 12;
    if (mins >= 1440) ap = "AM"; // past midnight
    return hr + (mm ? ":" + pad(mm) : "") + " " + ap;
  }

  function fmtClockShort(mins) {
    var m = ((mins % 1440) + 1440) % 1440;
    var h = Math.floor(m / 60), mm = m % 60;
    var ap = h >= 12 ? "p" : "a";
    var hr = h % 12; if (hr === 0) hr = 12;
    return hr + (mm ? ":" + pad(mm) : "") + ap;
  }

  function holidayFor(date) {
    var key = pad(date.getMonth() + 1) + "-" + pad(date.getDate());
    return HOLIDAYS[key] || null;
  }

  // Effective hours for a given date (respecting holiday overrides)
  function hoursFor(date) {
    var hol = holidayFor(date);
    var base = HOURS[date.getDay()];
    if (hol) {
      if (hol.closed) return { open: null, close: null, day: base.day, holiday: hol };
      return { open: hol.open, close: hol.close, day: base.day, holiday: hol };
    }
    return { open: base.open, close: base.close, day: base.day, holiday: null };
  }

  // Smooth pseudo-random in [0,1) seeded by integer
  function seeded(n) {
    var x = Math.sin(n * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  }

  // Base occupancy fraction (0..1) of walk-in / open-play demand by time
  function baseOccupancy(date) {
    var day = date.getDay();
    var mins = date.getHours() * 60 + date.getMinutes();
    var weekend = (day === 5 || day === 6);
    var fri = day === 5, sat = day === 6, sun = day === 0;
    var h = mins / 60;

    // Demand curve: low midday, building to an evening peak.
    var frac;
    if (h < 13) frac = 0.14;
    else if (h < 15) frac = 0.22;
    else if (h < 17) frac = 0.34;
    else if (h < 19) frac = weekend ? 0.55 : 0.44;
    else if (h < 21) frac = weekend ? 0.82 : 0.58;
    else frac = weekend ? 0.9 : 0.5;

    if (sun) frac *= 0.85;
    if (sat && h >= 19) frac = Math.min(0.95, frac + 0.05);
    if (fri && h >= 20) frac = Math.min(0.95, frac + 0.03);

    // gentle per-15-min "live" drift
    var bucket = Math.floor(mins / 15) + day * 100;
    frac += (seeded(bucket) - 0.5) * 0.06;
    return Math.max(0.05, Math.min(0.97, frac));
  }

  function activeLeagues(date) {
    var mins = date.getHours() * 60 + date.getMinutes();
    return LEAGUES.filter(function (l) {
      return l.day === date.getDay() && mins >= l.start && mins < l.end;
    });
  }

  function upcomingLeagues(date) {
    var mins = date.getHours() * 60 + date.getMinutes();
    return LEAGUES.filter(function (l) {
      return l.day === date.getDay() && l.start > mins;
    }).sort(function (a, b) { return a.start - b.start; });
  }

  function leaguesForDay(day) {
    return LEAGUES.filter(function (l) { return l.day === day; })
      .sort(function (a, b) { return a.start - b.start; });
  }

  function activeSpecials(date) {
    var day = date.getDay();
    var mins = date.getHours() * 60 + date.getMinutes();
    return SPECIALS.filter(function (s) {
      return s.days.indexOf(day) >= 0;
    }).map(function (s) {
      return Object.assign({}, s, { live: mins >= s.start && mins < s.end, upcoming: s.start > mins });
    });
  }

  // ---- The master status object ---------------------------------------
  function getStatus(now) {
    now = now || new Date();
    var total = BIZ.totalLanes;
    var eff = hoursFor(now);
    var mins = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

    var isOpen = false, minsToClose = null, minsToOpen = null;
    if (eff.open != null) {
      isOpen = mins >= eff.open && mins < eff.close;
      if (isOpen) minsToClose = eff.close - mins;
      else if (mins < eff.open) minsToOpen = eff.open - mins;
    }

    // If closed now, find next opening (today-before-open, or scan forward)
    var nextOpen = null;
    if (!isOpen) {
      if (minsToOpen != null) {
        nextOpen = { day: "Today", at: eff.open, minsAway: minsToOpen };
      } else {
        for (var i = 1; i <= 7; i++) {
          var d = new Date(now.getTime() + i * 86400000);
          var hf = hoursFor(d);
          if (hf.open != null) {
            var label = i === 1 ? "Tomorrow" : hf.day;
            var away = (i * 1440) - mins + hf.open;
            nextOpen = { day: label, at: hf.open, minsAway: away };
            break;
          }
        }
      }
    }

    // Lane math
    var leaguesNow = isOpen ? activeLeagues(now) : [];
    var leagueLanes = leaguesNow.reduce(function (a, l) { return a + l.lanes; }, 0);
    var walkInLanes = Math.round(baseOccupancy(now) * total);
    var inUse = isOpen ? Math.min(total, Math.max(leagueLanes, leagueLanes + Math.round(walkInLanes * (1 - leagueLanes / total)))) : 0;
    inUse = Math.min(total, inUse);
    var lanesOpen = isOpen ? Math.max(0, total - inUse) : 0;
    var pctOpen = lanesOpen / total;

    // Availability level
    var level, levelLabel;
    if (!isOpen) { level = "closed"; levelLabel = "Closed"; }
    else if (lanesOpen === 0) { level = "full"; levelLabel = "Full house"; }
    else if (lanesOpen <= 4) { level = "busy"; levelLabel = "Filling up fast"; }
    else if (lanesOpen <= 12) { level = "limited"; levelLabel = "Limited lanes"; }
    else { level = "open"; levelLabel = "Lanes open"; }

    // Wait estimate (walk-in)
    var wait = 0;
    if (isOpen) {
      if (lanesOpen === 0) wait = 25 + Math.round(seeded(Math.floor(mins / 10)) * 30);
      else if (lanesOpen <= 4) wait = 10 + Math.round(seeded(Math.floor(mins / 10)) * 15);
      else if (lanesOpen <= 12) wait = Math.round(seeded(Math.floor(mins / 10)) * 8);
      else wait = 0;
    }

    var specials = activeSpecials(now);
    var liveSpecial = specials.filter(function (s) { return s.live; })[0] || null;

    // Verdict — "Should I go bowling today?"
    var verdict;
    if (!isOpen) {
      verdict = {
        tone: "closed",
        emoji: "🌙",
        head: "Not right now",
        sub: nextOpen ? ("We open " + (nextOpen.day === "Today" ? "" : nextOpen.day + " ") + "at " + fmtClock(nextOpen.at)) : "Closed today",
        cta: "See full hours"
      };
    } else if (level === "open") {
      verdict = {
        tone: "great",
        emoji: "🎳",
        head: "It's a great bowling day",
        sub: lanesOpen + " of " + total + " lanes open — walk right in, no wait.",
        cta: "Reserve a lane"
      };
    } else if (level === "limited") {
      verdict = {
        tone: "good",
        emoji: "👍",
        head: "Good to go — but call ahead",
        sub: lanesOpen + " lanes left" + (wait ? " · ~" + wait + " min wait" : "") + ". Reserve to lock one in.",
        cta: "Reserve a lane"
      };
    } else if (level === "busy") {
      verdict = {
        tone: "tight",
        emoji: "⏳",
        head: "Busy — reserve to be safe",
        sub: "Only " + lanesOpen + " lane" + (lanesOpen === 1 ? "" : "s") + " left · ~" + wait + " min wait for walk-ins.",
        cta: "Reserve a lane"
      };
    } else {
      verdict = {
        tone: "full",
        emoji: "🔥",
        head: "Packed right now",
        sub: "All lanes in play · ~" + wait + " min wait. Grab a booth or reserve a later slot.",
        cta: "Reserve later"
      };
    }

    return {
      now: now,
      biz: BIZ,
      isOpen: isOpen,
      todayName: eff.day,
      todayHours: eff,
      holiday: eff.holiday,
      minsToClose: minsToClose,
      minsToOpen: minsToOpen,
      nextOpen: nextOpen,
      total: total,
      lanesOpen: lanesOpen,
      lanesInUse: inUse,
      pctOpen: pctOpen,
      level: level,
      levelLabel: levelLabel,
      wait: wait,
      leaguesNow: leaguesNow,
      leagueLanes: leagueLanes,
      upcomingLeagues: upcomingLeagues(now),
      specials: specials,
      liveSpecial: liveSpecial
    };
  }

  // Countdown string from a minutes value (can include seconds via fractional)
  function fmtCountdown(minsFloat) {
    if (minsFloat == null) return "";
    var totalSec = Math.max(0, Math.round(minsFloat * 60));
    var h = Math.floor(totalSec / 3600);
    var m = Math.floor((totalSec % 3600) / 60);
    var s = totalSec % 60;
    if (h > 0) return h + "h " + pad(m) + "m";
    return m + "m " + pad(s) + "s";
  }

  window.ASB = {
    BIZ: BIZ, HOURS: HOURS, RATES: RATES, BAC_TIERS: BAC_TIERS,
    LEAGUES: LEAGUES, SPECIALS: SPECIALS, HOLIDAYS: HOLIDAYS,
    LIVESCORES: LIVESCORES, STANDINGS: STANDINGS,
    COSMIC: COSMIC, ARCADE: ARCADE,
    getStatus: getStatus,
    hoursFor: hoursFor,
    holidayFor: holidayFor,
    leaguesForDay: leaguesForDay,
    fmtClock: fmtClock,
    fmtClockShort: fmtClockShort,
    fmtCountdown: fmtCountdown
  };
})();
