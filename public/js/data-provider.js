/* ============================================================
   ASB_DATA — the SWAPPABLE data layer (THE DEPLOY SEAM)
   ------------------------------------------------------------
   Everything here is MOCK / DEMO. At deploy the IDE / backend
   Claude overrides window.ASB_DATA (or replaces this file) with
   real sources. The contract: UI reads member + bag + jackpot
   data ONLY from window.ASB_DATA — never hardcode those values
   in JSX — so swapping mock -> real is a one-file change.
   See docs/DATA-CONTRACT.md + docs/MEMBER-AREA-SCOPING.md.
   Loaded right after data.js, before any component script.
   ============================================================ */
(function () {
  "use strict";

  /* ---- MEMBER (Tier A · first-party / owned) -------------------------
     In the real build the PROFILE (name/email) comes from Cloudflare
     Access (verified identity); GAMES come from our own metrics
     datastore (Cloudflare D1), captured in the All Star Bowl phone app.
     HONESTY: games[] is REAL only if the bowler actually tracked them.
       - games: []  =>  the member is authenticated but has tracked
                        nothing yet  =>  Stats renders its EMPTY STATE
                        (never a fabricated average). This is the
                        common launch-day case; the UI toggle previews it.
     Tier B (do NOT present as real): tierKey is a personal BAC tier that
     needs the venue's POS/loyalty — shown only as a labeled placeholder. */
  var DEMO_GAMES = [
      {"date":"2025-09-18","score":155,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2025-09-18","score":172,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2025-09-18","score":166,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2025-09-27","score":141,"lane":12,"league":false,"leagueName":null},
      {"date":"2025-09-27","score":171,"lane":12,"league":false,"leagueName":null},
      {"date":"2025-09-27","score":156,"lane":12,"league":false,"leagueName":null},
      {"date":"2025-10-02","score":174,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2025-10-02","score":175,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2025-10-02","score":157,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2025-10-16","score":165,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2025-10-16","score":178,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2025-10-16","score":174,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2025-10-30","score":172,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2025-10-30","score":183,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2025-10-30","score":162,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2025-11-15","score":181,"lane":7,"league":false,"leagueName":null},
      {"date":"2025-11-15","score":160,"lane":7,"league":false,"leagueName":null},
      {"date":"2025-11-15","score":157,"lane":7,"league":false,"leagueName":null},
      {"date":"2025-11-20","score":180,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2025-11-20","score":186,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2025-11-20","score":188,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2025-12-04","score":168,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2025-12-04","score":154,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2025-12-04","score":168,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2025-12-18","score":190,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2025-12-18","score":182,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2025-12-18","score":171,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2026-01-08","score":178,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2026-01-08","score":171,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2026-01-08","score":181,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2026-01-22","score":172,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2026-01-22","score":162,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2026-01-22","score":160,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2026-02-07","score":167,"lane":22,"league":false,"leagueName":null},
      {"date":"2026-02-07","score":177,"lane":22,"league":false,"leagueName":null},
      {"date":"2026-02-07","score":168,"lane":22,"league":false,"leagueName":null},
      {"date":"2026-02-12","score":163,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2026-02-12","score":196,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2026-02-12","score":164,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2026-02-26","score":188,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2026-02-26","score":197,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2026-02-26","score":175,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2026-03-12","score":194,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2026-03-12","score":182,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2026-03-12","score":176,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2026-03-26","score":177,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2026-03-26","score":172,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2026-03-26","score":175,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2026-04-09","score":186,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2026-04-09","score":186,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2026-04-09","score":163,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2026-04-23","score":200,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2026-04-23","score":176,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2026-04-23","score":204,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2026-05-09","score":180,"lane":15,"league":false,"leagueName":null},
      {"date":"2026-05-09","score":182,"lane":15,"league":false,"leagueName":null},
      {"date":"2026-05-09","score":180,"lane":15,"league":false,"leagueName":null},
      {"date":"2026-05-14","score":178,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2026-05-14","score":200,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2026-05-14","score":268,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2026-05-28","score":199,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2026-05-28","score":185,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"},
      {"date":"2026-05-28","score":170,"lane":38,"league":true,"leagueName":"Thursday Night Mixed"}
  ];

  var DEMO_MEMBER = {
    source: "demo",            // flips to "live" when a real record loads
    // profile — from Cloudflare Access in production (verified email)
    name: "Marcus Bell",
    first: "Marcus",
    email: "marcus.bell@example.com",
    id: "ASB-10428",
    joined: "2024-03",
    usbcId: "",                // optional; used to PRE-FILL the bowl.com look-up, never stored
    // first-party captured games (Tier A) — the headline metric source
    games: DEMO_GAMES,
    // Tier B placeholder (needs loyalty/POS data we don't have):
    tierKey: "GOLD"
  };

  /* ---- MY BAG (saved balls) · Tier A, genuinely member-owned ----------
     In production this lives in Cloudflare D1/KV keyed to the verified
     email. For the demo it persists in localStorage so saves survive a
     refresh (same pattern as the Pro Shop wish list). Seeded once with a
     few balls so the demo isn't empty; clearing it shows the bag's own
     honest empty state. Ball ids reference window.ASB_BALLS. */
  var BAG_KEY = "asb_member_bag";
  var BAG_SEED = ["b118-hyroad", "b016-phaze-ii-pearl", "b055-ion-pro-solid", "b119-pitch-black"];
  function readBag() {
    try {
      var raw = window.localStorage.getItem(BAG_KEY);
      if (raw === null) { window.localStorage.setItem(BAG_KEY, JSON.stringify(BAG_SEED)); return BAG_SEED.slice(); }
      return JSON.parse(raw) || [];
    } catch (e) { return BAG_SEED.slice(); }
  }
  function writeBag(ids) {
    try { window.localStorage.setItem(BAG_KEY, JSON.stringify(ids)); } catch (e) {}
  }

  /* ---- STRIKE JACKPOT pots (demo until the owner supplies real figures) */
  var JACKPOT = { red: 310, blue: 6916, source: "demo" };

  window.ASB_DATA = {
    // set member to null (or member.games to []) to preview the empty state
    member: DEMO_MEMBER,
    jackpot: JACKPOT,
    __source: "stub-demo",

    // ---- accessors (components read THROUGH these, never the fields) ----
    getMember: function () { return window.ASB_DATA.member || null; },
    getJackpot: function () { return window.ASB_DATA.jackpot || { red: 0, blue: 0, source: "none" }; },

    // My Bag — owned member data; localStorage-backed in the demo
    getBag: function () { return readBag(); },
    addToBag: function (id) {
      var ids = readBag();
      if (ids.indexOf(id) === -1) { ids.push(id); writeBag(ids); }
      return ids;
    },
    removeFromBag: function (id) {
      var ids = readBag().filter(function (x) { return x !== id; });
      writeBag(ids);
      return ids;
    },
    inBag: function (id) { return readBag().indexOf(id) !== -1; }
  };
})();
