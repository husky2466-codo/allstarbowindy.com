// data.js — single source of business truth for the static React-via-CDN app.
// Plain global (no modules in CDN/Babel mode); other scripts read window.ASB_DATA.
// Source of record: docs/allstarbowl-site-audit-handoff.md + docs/promotions-games-and-menu.md
window.ASB_DATA = {
  business: {
    name: "All Star Bowl",
    operator: "3DS Entertainment Inc.",
    address: "726 N Shortridge Rd, Indianapolis, IN 46219",
    phone: "(317) 352-1848",
    domain: "allstarbowlindy.com",
    lanes: 48,
    smoking: false,
    capacity: 67, // catering/meeting space
  },
  // DesignClaude fills these out from the spec docs. Stubs so the app renders.
  nav: ["Home", "Bowl", "Eat & Drink", "Leagues", "Parties", "Pro Shop", "Account"],
  cashGames: [
    // see docs/promotions-games-and-menu.md
    { name: "Kegler's Cash", blurb: "Strike jackpot — buy in $0.25–$5/game, win up to 10x (max $150).", confirmed: true },
    { name: "Casino Bowling", blurb: "Strike turns the screen into a slot machine — spin to win cash.", confirmed: true },
  ],
  experiences: ["Cosmic Bowling", "Interactive Bowling"],
};
