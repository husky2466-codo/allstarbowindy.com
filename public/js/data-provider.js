/* ============================================================
   ASB_DATA — the SWAPPABLE data layer (THE DEPLOY SEAM)
   ------------------------------------------------------------
   Everything in this file is MOCK / DEMO. At deploy the IDE /
   backend Claude overrides window.ASB_DATA (or replaces this
   one file) with real sources. The contract: UI components read
   member + jackpot data ONLY from window.ASB_DATA — never
   hardcode those values in JSX — so swapping mock → real is a
   one-file change, not a component rewrite.

   See docs/DATA-CONTRACT.md for the full field-by-field spec and
   the per-page audit of what is real vs. modelled vs. mock.
   Loaded right after data.js, before any component script.
   ============================================================ */
(function () {
  "use strict";

  /* ---- MEMBER (member area · Tier A per docs/MEMBER-AREA-SCOPING.md) ----
     The signed-in member. In the real build this is populated AFTER
     Cloudflare Access authenticates, from a D1/KV lookup keyed to the
     verified email.
       member === null  =>  no authenticated member / no captured games
                            =>  the UI must render the EMPTY STATE
                                (never a fabricated number).
     Field tiers (do NOT fabricate Tier B at deploy — leave null/labeled):
       (A) profile: name, first, id, joined
       (A) games / history  — REAL *iff* captured in the All Star Bowl app
       (B) tierKey          — personal BAC tier needs the venue's POS/loyalty
  */
  var DEMO_MEMBER = {
    source: "demo",            // flips to "live" when a real record loads
    name: "Marcus Bell",
    first: "Marcus",
    id: "ASB-10428",
    tierKey: "GOLD",           // (Tier B) placeholder until loyalty data exists
    games: 164,                // (Tier A) only real if app-captured
    joined: "Mar 2024",
    history: [                 // (Tier A) only real if app-captured
      { date: "Jun 5", desc: "Open bowling · 3 games", games: 3 },
      { date: "Jun 1", desc: "Casino Bowling night · 4 games", games: 4 },
      { date: "May 28", desc: "Thursday Night Mixed league", games: 3 },
      { date: "May 24", desc: "Open bowling · 2 games", games: 2 }
    ]
  };

  /* ---- STRIKE JACKPOT pots (demo until the owner supplies real figures) --
     The Kegler's Cash board (js/jackpot.jsx) reads its starting pot totals
     here. Replace with the live/owner numbers at deploy. */
  var JACKPOT = { red: 310, blue: 6916, source: "demo" };

  window.ASB_DATA = {
    // set member to null to preview the empty / no-data state
    member: DEMO_MEMBER,
    jackpot: JACKPOT,
    __source: "stub-demo",

    // convenience accessors (components prefer these over poking fields)
    getMember: function () { return window.ASB_DATA.member || null; },
    getJackpot: function () { return window.ASB_DATA.jackpot || { red: 0, blue: 0, source: "none" }; }
  };
})();
