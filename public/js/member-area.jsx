/* ============================================================
   MEMBER AREA — signed-in, Tier-A only (post Cloudflare Access)
   ------------------------------------------------------------
   Honest by design (docs/MEMBER-AREA-SCOPING.md):
   - ALL member data is read from the swappable data layer
     (window.ASB_DATA.getMember / getBag) — nothing hardcoded here.
   - Game metrics are FIRST-PARTY (captured in the All Star Bowl
     app). A member with no captured games sees an EMPTY STATE,
     never a fabricated number.
   - Equipment catalog = our owned 183-ball spec dataset
     (window.ASB_BALLS). "My Bag" = member-owned saved balls.
   - Tier-B items (personal BAC tier / visit history) are shown
     ONLY as labeled "Phase 2 — pending data" placeholders.
   - Assumes Cloudflare Access already authenticated the member;
     there is no login form to design.
   ============================================================ */

/* ---------- data helpers (read THROUGH the data layer) ---------- */
function maGetMember() { return (window.ASB_DATA && window.ASB_DATA.getMember && window.ASB_DATA.getMember()) || null; }
function maBalls() { return (window.ASB_BALLS && window.ASB_BALLS.balls) || []; }
function ballById(id) { return maBalls().find(function (b) { return b.id === id; }) || null; }

/* color-name -> hex for ball swatches (palette tokens from the dataset) */
var BALL_COLORS = {
  black: "#1b1b22", blue: "#1e46a8", brown: "#6b4a2b", charcoal: "#36404f",
  clear: "#cfe0ee", gold: "#d9a521", gray: "#8a93a3", green: "#1f9d55",
  imperial: "#2b2f6b", magenta: "#c2186a", midnight: "#14213d", navy: "#0e1a3a",
  orange: "#e8731c", pink: "#e85a9c", purple: "#7b3fe6", rainbow: "#7b3fe6",
  red: "#e0241f", royal: "#1b3a8f", ruby: "#b0203a", silver: "#b8c0cc",
  smoke: "#5a6472", teal: "#1aa39a", various: "#7b3fe6", white: "#eceadf", yellow: "#f5c518"
};
function hexOf(name) { return BALL_COLORS[name] || "#5a6472"; }

/* plain-language spec explainers (shopper-voiced) */
var COVER_DESC = {
  solid: "Solid reactive — the strongest grip; reads oil early for the biggest hook.",
  hybrid: "Hybrid reactive — a blend of solid + pearl; clean through the front, strong off the spot.",
  pearl: "Pearl reactive — saves its energy for the back end; length then a sharper move.",
  urethane: "Urethane — smooth and controllable; great on drier or shorter oil.",
  polyester: "Polyester (plastic) — rolls straight; the classic spare ball."
};
var CORE_DESC = {
  symmetric: "Symmetric core — smooth, predictable, forgiving motion.",
  asymmetric: "Asymmetric core — more defined, angular motion you can shape with the layout."
};

/* ---------- ball swatch (gradient sphere) ---------- */
function BallSwatch(props) {
  var cols = (props.colors && props.colors.length) ? props.colors : ["smoke"];
  var c1 = hexOf(cols[0]);
  var c2 = hexOf(cols[1] || cols[0]);
  var multi = cols[0] === "rainbow" || cols[0] === "various";
  var bg = multi
    ? "radial-gradient(circle at 34% 28%, rgba(255,255,255,.6) 0 5%, rgba(255,255,255,0) 24%), conic-gradient(from 210deg, #e0241f, #f5c518, #1f9d55, #1e46a8, #7b3fe6, #e0241f)"
    : "radial-gradient(circle at 34% 28%, rgba(255,255,255,.55) 0 5%, rgba(255,255,255,0) 26%), radial-gradient(circle at 68% 74%, " + c2 + " 0 40%, " + c1 + " 75%)";
  var sz = props.size || 60;
  return (
    <span className="ball-sw" style={{ width: sz, height: sz, background: bg }} aria-hidden="true">
      <span className="ball-sw-holes"></span>
    </span>
  );
}

/* ============================================================
   METRICS — derive everything from captured games
   ============================================================ */
function computeMetrics(games) {
  var chron = (games || []).slice(); // stored oldest -> newest
  var scores = chron.map(function (g) { return g.score; });
  var count = scores.length;
  if (!count) return { count: 0 };
  var sum = scores.reduce(function (a, b) { return a + b; }, 0);
  var avg = Math.round(sum / count);
  var high = Math.max.apply(null, scores);
  // sessions grouped by date (order preserved)
  var sessions = [];
  chron.forEach(function (g) {
    var s = sessions[sessions.length - 1];
    if (!s || s.date !== g.date) { s = { date: g.date, league: g.league, leagueName: g.leagueName, lane: g.lane, scores: [] }; sessions.push(s); }
    s.scores.push(g.score);
  });
  sessions.forEach(function (s) {
    s.total = s.scores.reduce(function (a, b) { return a + b; }, 0);
    s.avg = Math.round(s.total / s.scores.length);
    s.series = s.scores.length >= 3
      ? s.scores.slice().sort(function (a, b) { return b - a; }).slice(0, 3).reduce(function (a, b) { return a + b; }, 0)
      : null;
  });
  var seriesVals = sessions.filter(function (s) { return s.series != null; }).map(function (s) { return s.series; });
  var highSeries = seriesVals.length ? Math.max.apply(null, seriesVals) : null;
  // running (cumulative) average trend + last-5 form
  var run = 0; var cum = chron.map(function (g, i) { run += g.score; return Math.round(run / (i + 1)); });
  var last5 = scores.slice(-5);
  var last5avg = Math.round(last5.reduce(function (a, b) { return a + b; }, 0) / last5.length);
  var leagueGames = chron.filter(function (g) { return g.league; }).length;
  return {
    count: count, avg: avg, high: high, highSeries: highSeries,
    last5avg: last5avg, scores: scores, cum: cum,
    sessions: sessions.slice().reverse(), leagueGames: leagueGames,
    firstDate: chron[0].date, lastDate: chron[chron.length - 1].date
  };
}

function fmtDate(iso) {
  var M = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var p = iso.split("-");
  return M[parseInt(p[1], 10) - 1] + " " + parseInt(p[2], 10);
}
function fmtMonth(iso) {
  var M = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var p = iso.split("-");
  return M[parseInt(p[1], 10) - 1] + " " + p[0].slice(2);
}

/* ---------- trend chart (static SVG — no CSS animation) ---------- */
function TrendChart(props) {
  var m = props.metrics;
  var W = 760, H = 240, padL = 38, padR = 14, padT = 18, padB = 30;
  var n = m.scores.length;
  var all = m.scores.concat(m.cum);
  var lo = Math.min.apply(null, all), hi = Math.max.apply(null, all);
  var yMin = Math.floor((lo - 8) / 10) * 10, yMax = Math.ceil((hi + 8) / 10) * 10;
  function X(i) { return padL + (n <= 1 ? 0 : (i / (n - 1)) * (W - padL - padR)); }
  function Y(v) { return padT + (1 - (v - yMin) / (yMax - yMin)) * (H - padT - padB); }
  var gameLine = m.scores.map(function (s, i) { return X(i) + "," + Y(s); }).join(" ");
  var avgLine = m.cum.map(function (s, i) { return X(i) + "," + Y(s); }).join(" ");
  var avgArea = "M" + X(0) + "," + Y(yMin) + " L" + m.cum.map(function (s, i) { return X(i) + "," + Y(s); }).join(" L") + " L" + X(n - 1) + "," + Y(yMin) + " Z";
  // y gridlines every 25
  var grid = [];
  for (var g = Math.ceil(yMin / 25) * 25; g <= yMax; g += 25) grid.push(g);
  return (
    <svg className="trend-svg" viewBox={"0 0 " + W + " " + H} preserveAspectRatio="none" role="img" aria-label="Average trend across captured games">
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e46a8" stopOpacity="0.20" />
          <stop offset="100%" stopColor="#1e46a8" stopOpacity="0" />
        </linearGradient>
      </defs>
      {grid.map(function (gv) {
        return <g key={gv}>
          <line x1={padL} y1={Y(gv)} x2={W - padR} y2={Y(gv)} className="trend-grid" />
          <text x={padL - 8} y={Y(gv) + 4} className="trend-ytick">{gv}</text>
        </g>;
      })}
      <path d={avgArea} fill="url(#trendFill)" />
      <polyline points={gameLine} className="trend-games" />
      {m.scores.map(function (s, i) { return <circle key={i} cx={X(i)} cy={Y(s)} r="2.4" className="trend-dot" />; })}
      <polyline points={avgLine} className="trend-avg" />
      <text x={padL} y={H - 8} className="trend-xtick" textAnchor="start">{fmtMonth(m.firstDate)}</text>
      <text x={W - padR} y={H - 8} className="trend-xtick" textAnchor="end">{fmtMonth(m.lastDate)}</text>
    </svg>
  );
}

/* ---------- MY STATS tab ---------- */
function MemberStats(props) {
  var member = props.member;
  var m = computeMetrics(member.games);

  if (!m.count) {
    return (
      <div className="ma-panel">
        <div className="ms-empty">
          <div className="ms-empty-mark"><Icon name="chart" size={30} /></div>
          <h3 className="ms-empty-h">No games tracked yet</h3>
          <p className="ms-empty-p">
            Track a game in the All Star Bowl app and your <strong>average, high game, series</strong> and full
            game log show up here. We only ever show games you&rsquo;ve actually bowled &mdash; never a number you haven&rsquo;t.
          </p>
          <div className="ms-empty-actions">
            <button className="btn btn-red" onClick={function () { Router.go("/bowl"); }}><Icon name="ball" size={18} /> Reserve a lane</button>
            <button className="btn btn-blue" onClick={function () { props.onTab && props.onTab("equipment"); }}><Icon name="bag" size={18} /> Browse equipment</button>
            <button className="btn btn-ghost" style={{ color: "var(--navy-800)" }} onClick={function () { Router.go("/scores"); }}><Icon name="trophy" size={18} /> Live league scores</button>
          </div>
          <p className="ms-empty-note"><Icon name="info" size={14} /> Manual score entry is the launch capture method; on-lane shot tracking is a planned upgrade.</p>
        </div>
      </div>
    );
  }

  var form = m.last5avg - m.avg;
  return (
    <div className="ma-panel">
      <div className="ms-grid">
        <div className="ms-stat ms-stat-hero">
          <span className="ms-stat-l">Average</span>
          <span className="ms-stat-v display">{m.avg}</span>
          <span className={"ms-stat-trend " + (form >= 0 ? "up" : "down")}>
            <Icon name="arrow" size={14} /> {form >= 0 ? "+" : ""}{form} last 5 games
          </span>
        </div>
        <div className="ms-stat">
          <span className="ms-stat-l">High game</span>
          <span className="ms-stat-v display">{m.high}</span>
        </div>
        <div className="ms-stat">
          <span className="ms-stat-l">High series</span>
          <span className="ms-stat-v display">{m.highSeries != null ? m.highSeries : "—"}</span>
          <span className="ms-stat-sub">3-game</span>
        </div>
        <div className="ms-stat">
          <span className="ms-stat-l">Games tracked</span>
          <span className="ms-stat-v display">{m.count}</span>
          <span className="ms-stat-sub">{m.leagueGames} league</span>
        </div>
      </div>

      <div className="ms-card ms-trend">
        <div className="ms-card-head">
          <h4 className="ms-card-h">Average trend</h4>
          <div className="trend-key">
            <span className="trend-key-i"><span className="tk-swatch tk-avg"></span> Running average</span>
            <span className="trend-key-i"><span className="tk-swatch tk-game"></span> Each game</span>
          </div>
        </div>
        <TrendChart metrics={m} />
        <p className="ms-src"><Icon name="info" size={13} /> From {m.count} games you tracked between {fmtMonth(m.firstDate)} and {fmtMonth(m.lastDate)}. First-party data — captured in the All Star Bowl app.</p>
      </div>

      <div className="ms-card">
        <div className="ms-card-head">
          <h4 className="ms-card-h">Session log</h4>
          <span className="ms-count">{m.sessions.length} sessions</span>
        </div>
        <SessionLog sessions={m.sessions} />
      </div>
    </div>
  );
}

function SessionLog(props) {
  var [showAll, setShowAll] = useState(false);
  var sessions = props.sessions;
  var shown = showAll ? sessions : sessions.slice(0, 6);
  return (
    <div className="slog">
      <div className="slog-head">
        <span>Date</span><span>Session</span><span className="slog-games-h">Games</span><span className="slog-tot-h">Series</span>
      </div>
      {shown.map(function (s, i) {
        return (
          <div key={i} className="slog-row">
            <span className="slog-date">{fmtDate(s.date)}</span>
            <span className="slog-desc">
              {s.league ? <span className="slog-badge league">{s.leagueName || "League"}</span> : <span className="slog-badge open">Open play</span>}
              <span className="slog-lane">Lane {s.lane}</span>
            </span>
            <span className="slog-games">
              {s.scores.map(function (sc, j) {
                var best = sc === Math.max.apply(null, s.scores);
                return <span key={j} className={"slog-score" + (best ? " best" : "")}>{sc}</span>;
              })}
            </span>
            <span className="slog-tot">{s.series != null ? s.series : "—"}</span>
          </div>
        );
      })}
      {sessions.length > 6 ? (
        <button className="slog-more" onClick={function () { setShowAll(!showAll); }}>
          {showAll ? "Show less" : "Show all " + sessions.length + " sessions"} <Icon name="chev" size={15} />
        </button>
      ) : null}
    </div>
  );
}

/* ============================================================
   EQUIPMENT CATALOG — 183-ball spec browser (owned dataset)
   ============================================================ */
function EquipmentCatalog(props) {
  var DB = window.ASB_BALLS || { balls: [], brands: [], coverTypes: [], coreTypes: [] };
  var [q, setQ] = useState("");
  var [brand, setBrand] = useState("all");
  var [cover, setCover] = useState("all");
  var [core, setCore] = useState("all");
  var [sort, setSort] = useState("new");
  var [detail, setDetail] = useState(null);

  var ql = q.trim().toLowerCase();
  var list = DB.balls.filter(function (b) {
    if (brand !== "all" && b.brand !== brand) return false;
    if (cover !== "all" && b.coverType !== cover) return false;
    if (core !== "all" && b.coreType !== core) return false;
    if (ql) {
      var hay = (b.name + " " + b.brand + " " + b.core + " " + b.cover).toLowerCase();
      if (hay.indexOf(ql) === -1) return false;
    }
    return true;
  });
  list = list.slice().sort(function (a, b) {
    if (sort === "new") return (a.rel < b.rel ? 1 : a.rel > b.rel ? -1 : 0);
    if (sort === "name") return a.name.localeCompare(b.name);
    if (sort === "hook") return b.diff - a.diff;
    return 0;
  });

  function reset() { setQ(""); setBrand("all"); setCover("all"); setCore("all"); }
  var active = brand !== "all" || cover !== "all" || core !== "all" || ql;

  return (
    <div className="ma-panel">
      <div className="eq-intro">
        <p className="eq-lead">Browse the spec library — {DB.balls.length} balls across {DB.brands.length} brands. Tag the ones you throw to build <strong>My Bag</strong>. Ready to buy or get drilled? The <a className="eq-inline" href="#/proshop" onClick={function (e) { e.preventDefault(); Router.go("/proshop"); }}>Pro Shop</a> handles fitting &amp; pricing.</p>
      </div>

      <div className="eq-filters">
        <label className="eq-search">
          <Icon name="search" size={17} />
          <input type="text" value={q} placeholder="Search balls, brands, cores…" onChange={function (e) { setQ(e.target.value); }} />
        </label>
        <select className="eq-select" value={brand} onChange={function (e) { setBrand(e.target.value); }}>
          <option value="all">All brands</option>
          {DB.brands.map(function (b) { return <option key={b} value={b}>{b}</option>; })}
        </select>
        <select className="eq-select" value={sort} onChange={function (e) { setSort(e.target.value); }}>
          <option value="new">Newest</option>
          <option value="name">Name A–Z</option>
          <option value="hook">Most hook</option>
        </select>
      </div>

      <div className="eq-chiprow">
        <span className="eq-chiplabel">Cover</span>
        <button className={"eq-chip" + (cover === "all" ? " on" : "")} onClick={function () { setCover("all"); }}>All</button>
        {DB.coverTypes.map(function (c) { return <button key={c} className={"eq-chip" + (cover === c ? " on" : "")} onClick={function () { setCover(c); }}>{c}</button>; })}
        <span className="eq-chiplabel eq-chiplabel-2">Core</span>
        <button className={"eq-chip" + (core === "all" ? " on" : "")} onClick={function () { setCore("all"); }}>All</button>
        {DB.coreTypes.map(function (c) { return <button key={c} className={"eq-chip" + (core === c ? " on" : "")} onClick={function () { setCore(c); }}>{c}</button>; })}
      </div>

      <div className="eq-resultbar">
        <span className="eq-resultcount">{list.length} {list.length === 1 ? "ball" : "balls"}</span>
        {active ? <button className="eq-clear" onClick={reset}>Clear filters <Icon name="close" size={14} /></button> : null}
      </div>

      <div className="eq-grid">
        {list.map(function (b) { return <BallCard key={b.id} ball={b} onOpen={function () { setDetail(b); }} bagVersion={props.bagVersion} onBag={props.onBag} />; })}
      </div>
      {list.length === 0 ? <div className="eq-none">No balls match those filters. <button className="eq-clear" onClick={reset}>Clear</button></div> : null}

      {detail ? <BallDetail ball={detail} onClose={function () { setDetail(null); }} onBag={props.onBag} bagVersion={props.bagVersion} /> : null}
    </div>
  );
}

function BallCard(props) {
  var b = props.ball;
  var saved = window.ASB_DATA.inBag(b.id);
  function toggle(e) { e.stopPropagation(); if (saved) window.ASB_DATA.removeFromBag(b.id); else window.ASB_DATA.addToBag(b.id); props.onBag && props.onBag(); }
  return (
    <div className="eq-card" onClick={props.onOpen}>
      <div className="eq-card-art"><BallSwatch colors={b.colors} size={76} /></div>
      <div className="eq-card-body">
        <span className="eq-card-brand">{b.brand}</span>
        <h4 className="eq-card-name">{b.name}</h4>
        <div className="eq-card-tags">
          <span className={"eq-tag cover-" + b.coverType}>{b.coverType}</span>
          <span className="eq-tag eq-tag-core">{b.coreType === "asymmetric" ? "asym" : "sym"}</span>
        </div>
        <div className="eq-card-spec">
          <span><b>RG</b> {b.rg.toFixed(2)}</span>
          <span><b>Diff</b> {b.diff.toFixed(3)}</span>
        </div>
      </div>
      <button className={"eq-bagbtn" + (saved ? " on" : "")} onClick={toggle} aria-label={saved ? "Remove from bag" : "Add to bag"} title={saved ? "In your bag" : "Add to My Bag"}>
        <Icon name={saved ? "check" : "plus"} size={16} />
      </button>
    </div>
  );
}

function BallDetail(props) {
  var b = props.ball;
  var saved = window.ASB_DATA.inBag(b.id);
  function toggle() { if (saved) window.ASB_DATA.removeFromBag(b.id); else window.ASB_DATA.addToBag(b.id); props.onBag && props.onBag(); }
  useEffect(function () {
    function esc(e) { if (e.key === "Escape") props.onClose(); }
    document.addEventListener("keydown", esc);
    return function () { document.removeEventListener("keydown", esc); };
  }, []);
  var relTxt = (function () { var p = b.rel.split("-"); var M = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; return M[parseInt(p[1], 10) - 1] + " " + p[0]; })();
  return (
    <div className="bd-scrim" onClick={props.onClose}>
      <div className="bd-sheet" onClick={function (e) { e.stopPropagation(); }}>
        <button className="bd-close" onClick={props.onClose} aria-label="Close"><Icon name="close" size={20} /></button>
        <div className="bd-top">
          <BallSwatch colors={b.colors} size={132} />
          <div className="bd-top-info">
            <span className="bd-brand">{b.brand}</span>
            <h3 className="bd-name display">{b.name}</h3>
            <div className="bd-badges">
              <span className={"eq-tag cover-" + b.coverType}>{b.coverType}</span>
              <span className="eq-tag eq-tag-core">{b.coreType} core</span>
              <span className="bd-rel">Released {relTxt}</span>
            </div>
            <button className={"btn btn-sm " + (saved ? "btn-ghost bd-saved" : "btn-red")} style={saved ? { color: "var(--navy-800)" } : null} onClick={toggle}>
              <Icon name={saved ? "check" : "bag"} size={16} /> {saved ? "In My Bag — remove" : "Add to My Bag"}
            </button>
          </div>
        </div>

        <div className="bd-specs">
          <div className="bd-spec"><span className="bd-spec-l">Coverstock</span><span className="bd-spec-v">{b.cover}</span></div>
          <div className="bd-spec"><span className="bd-spec-l">Core</span><span className="bd-spec-v">{b.core}</span></div>
          <div className="bd-spec"><span className="bd-spec-l">RG</span><span className="bd-spec-v">{b.rg.toFixed(3)}</span></div>
          <div className="bd-spec"><span className="bd-spec-l">Differential</span><span className="bd-spec-v">{b.diff.toFixed(3)}</span></div>
          {b.mb != null ? <div className="bd-spec"><span className="bd-spec-l">Mass bias</span><span className="bd-spec-v">{b.mb.toFixed(3)}</span></div> : null}
          <div className="bd-spec"><span className="bd-spec-l">Colors</span><span className="bd-spec-v bd-cap">{b.colors.join(" / ")}</span></div>
        </div>

        <div className="bd-explain">
          <p><span className="bd-ex-k">Cover</span> {COVER_DESC[b.coverType]}</p>
          <p><span className="bd-ex-k">Core</span> {CORE_DESC[b.coreType]}</p>
          <p><span className="bd-ex-k">Numbers</span> Lower RG ({b.rg.toFixed(2)}) revs earlier; higher differential ({b.diff.toFixed(3)}) means more hook potential.</p>
        </div>

        <div className="bd-foot">
          <span className="bd-foot-note"><Icon name="info" size={14} /> Specs only — no pricing here. For fitting, drilling &amp; what&rsquo;s in stock, see the Pro Shop.</span>
          <button className="btn btn-blue btn-sm" onClick={function () { Router.go("/proshop"); }}><Icon name="arrow" size={15} /> Go to Pro Shop</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MY BAG — saved balls (member-owned, localStorage-backed)
   ============================================================ */
function MyBag(props) {
  var ids = window.ASB_DATA.getBag();
  var balls = ids.map(ballById).filter(Boolean);
  if (!balls.length) {
    return (
      <div className="ma-panel">
        <div className="ms-empty">
          <div className="ms-empty-mark"><Icon name="bag" size={28} /></div>
          <h3 className="ms-empty-h">Your bag is empty</h3>
          <p className="ms-empty-p">Tag balls you own from the equipment catalog and they&rsquo;ll live here — your personal arsenal, saved to your account.</p>
          <div className="ms-empty-actions">
            <button className="btn btn-red" onClick={function () { props.onTab && props.onTab("equipment"); }}><Icon name="search" size={18} /> Browse equipment</button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="ma-panel">
      <div className="bag-head">
        <p className="eq-lead" style={{ margin: 0 }}>{balls.length} {balls.length === 1 ? "ball" : "balls"} in your arsenal. Saved to your account.</p>
      </div>
      <div className="bag-list">
        {balls.map(function (b) {
          return (
            <div key={b.id} className="bag-item">
              <BallSwatch colors={b.colors} size={58} />
              <div className="bag-item-info">
                <span className="eq-card-brand">{b.brand}</span>
                <h4 className="bag-item-name">{b.name}</h4>
                <span className="bag-item-spec">{b.coverType} · {b.coreType} · RG {b.rg.toFixed(2)} · Diff {b.diff.toFixed(3)}</span>
              </div>
              <button className="bag-remove" onClick={function () { window.ASB_DATA.removeFromBag(b.id); props.onBag && props.onBag(); }} aria-label="Remove from bag"><Icon name="close" size={16} /></button>
            </div>
          );
        })}
      </div>
      <div className="bag-foot">
        <span className="bd-foot-note"><Icon name="info" size={14} /> Saved on this device for the demo. In the full build your bag syncs to your account from the All Star Bowl app.</span>
        <button className="btn btn-blue btn-sm" onClick={function () { Router.go("/proshop"); }}><Icon name="bag" size={15} /> Reserve / get drilled at the Pro Shop</button>
      </div>
    </div>
  );
}

/* ============================================================
   SCORES & MORE — real link-outs + static BAC explainer
   ============================================================ */
function MemberLinks(props) {
  var member = props.member;
  var LS = ASB.LIVESCORES;
  var usbcName = encodeURIComponent(member.name || "");
  var usbcUrl = "https://www.bowl.com/find-a-member?name=" + usbcName;
  return (
    <div className="ma-panel">
      <div className="ml-grid">
        <div className="ml-card">
          <div className="ml-ico"><Icon name="trophy" size={20} /></div>
          <h4 className="ml-h">Live league scores</h4>
          <p className="ml-p">Lane-by-lane scoring straight off the floor — the same Computer Score feed the alley runs.</p>
          <button className="btn btn-red btn-sm" onClick={function () { Router.go("/scores"); }}><Icon name="arrow" size={15} /> Open Live Scores</button>
        </div>
        <div className="ml-card">
          <div className="ml-ico"><Icon name="chart" size={20} /></div>
          <h4 className="ml-h">League standings</h4>
          <p className="ml-p">Full standings for every All Star Bowl league (centre 112), on Computer Score.</p>
          <a className="btn btn-blue btn-sm" href={LS.standings} target="_blank" rel="noopener noreferrer"><Icon name="ext" size={15} /> View standings</a>
        </div>
        <div className="ml-card">
          <div className="ml-ico"><Icon name="medal" size={20} /></div>
          <h4 className="ml-h">Find my USBC average</h4>
          <p className="ml-p">Look up your sanctioned book average on bowl.com. We open it with your name &mdash; <strong>we never store your USBC data.</strong></p>
          <a className="btn btn-ghost btn-sm" style={{ color: "var(--navy-800)" }} href={usbcUrl} target="_blank" rel="noopener noreferrer"><Icon name="ext" size={15} /> Look up on bowl.com</a>
        </div>
      </div>

      <div className="ml-bac">
        <div className="ms-card-head">
          <h4 className="ms-card-h">Bowlers&rsquo; Appreciation Club — how the tiers work</h4>
          <span className="ml-static">General program info</span>
        </div>
        <p className="ml-bac-lead">Every game you bowl counts toward your Bowler ID. Cross a tier and your per-game rate drops — for good. This is how the program works for everyone; it isn&rsquo;t your personal status.</p>
        <div className="ml-tiers">
          {ASB.BAC_TIERS.map(function (t) {
            return (
              <div key={t.key} className={"ml-tier ml-tier-" + t.key.toLowerCase()}>
                <span className="ml-tier-name">{t.name}</span>
                <span className="ml-tier-req">{t.gamesReq === 0 ? "Sign up" : t.gamesReq + " games"}</span>
                <span className="ml-tier-rate">${t.day.toFixed(2)}<small>day game</small></span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="ml-phase2">
        <div className="ml-phase2-tag">Phase 2 — pending data</div>
        <h4 className="ml-h" style={{ marginTop: 6 }}>Your personal tier &amp; visit history</h4>
        <p className="ml-p" style={{ maxWidth: 620 }}>Your live BAC tier, points/visit balance and reservation history will appear here once All Star Bowl connects their point-of-sale and loyalty systems. We won&rsquo;t show a personal tier or visit count until it&rsquo;s backed by real data.</p>
      </div>
    </div>
  );
}

/* ============================================================
   SETTINGS — profile (from Access) + Phase-2 placeholders
   ============================================================ */
function MemberSettings(props) {
  var m = props.member;
  var [usbc, setUsbc] = useState(m.usbcId || "");
  return (
    <div className="ma-panel">
      <div className="set-grid">
        <div className="ms-card set-card">
          <h4 className="ms-card-h">Profile</h4>
          <p className="set-note"><Icon name="info" size={13} /> From your secure sign-in (Cloudflare Access). Manage it with your Google / email provider.</p>
          <div className="set-row"><span className="set-l">Name</span><span className="set-v">{m.name}</span></div>
          <div className="set-row"><span className="set-l">Email</span><span className="set-v">{m.email}</span></div>
          <div className="set-row"><span className="set-l">Bowler ID</span><span className="set-v">{m.id}</span></div>
          <div className="set-row"><span className="set-l">Member since</span><span className="set-v">{fmtMonth(m.joined + "-01")}</span></div>
        </div>

        <div className="ms-card set-card">
          <h4 className="ms-card-h">USBC look-up</h4>
          <p className="set-note">Add your USBC member ID to pre-fill the bowl.com average look-up. <strong>We don&rsquo;t store it</strong> — it just travels with the link.</p>
          <label className="set-field">
            <span className="set-fieldl">USBC member ID (optional)</span>
            <input type="text" value={usbc} placeholder="e.g. 1234-5678" onChange={function (e) { setUsbc(e.target.value); }} />
          </label>
          <a className="btn btn-blue btn-sm" href={"https://www.bowl.com/find-a-member?id=" + encodeURIComponent(usbc)} target="_blank" rel="noopener noreferrer"><Icon name="ext" size={15} /> Open my look-up</a>
        </div>
      </div>

      <div className="ml-phase2 set-phase2">
        <div className="ml-phase2-tag">Phase 2 — pending data</div>
        <h4 className="ml-h" style={{ marginTop: 6 }}>Notifications &amp; data controls</h4>
        <p className="ml-p" style={{ maxWidth: 640, marginBottom: 14 }}>Email reminders for league night, promo alerts, and the ability to export or delete your tracked-game data will live here once the All Star Bowl app + backend are connected. Shown for completeness — not active yet.</p>
        <div className="set-stub-row">
          <span className="set-stub"><Icon name="mail" size={15} /> League-night reminders</span>
          <span className="set-stub"><Icon name="bolt" size={15} /> Promo &amp; specials alerts</span>
          <span className="set-stub"><Icon name="info" size={15} /> Download / delete my data</span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MEMBER AREA SHELL — tabs + header + demo toggle
   ============================================================ */
var MA_TABS = [
  { key: "stats", label: "My Stats", icon: "chart" },
  { key: "equipment", label: "Equipment", icon: "search" },
  { key: "bag", label: "My Bag", icon: "bag" },
  { key: "links", label: "Scores & More", icon: "trophy" },
  { key: "settings", label: "Settings", icon: "sliders" }
];

function MemberArea(props) {
  var ref = useReveal();
  var [tab, setTab] = useState(function () {
    var t = window.__maInitialTab; window.__maInitialTab = null;
    return (t && MA_TABS.some(function (x) { return x.key === t; })) ? t : "stats";
  });
  var [populated, setPopulated] = useState(true);
  var [bagVersion, setBagVersion] = useState(0);
  function bumpBag() { setBagVersion(function (v) { return v + 1; }); }
  // account-menu deep links fire this even when already on /account
  useEffect(function () {
    function onTab(e) { if (e.detail && MA_TABS.some(function (x) { return x.key === e.detail; })) setTab(e.detail); }
    window.addEventListener("asb-matab", onTab);
    return function () { window.removeEventListener("asb-matab", onTab); };
  }, []);

  var base = maGetMember();
  // The demo toggle previews the honest EMPTY STATE: an authenticated member
  // (profile from Access) who hasn't captured any games yet. We derive it from
  // the real member object — never fabricate a separate one.
  var member = base ? (populated ? base : Object.assign({}, base, { games: [] })) : null;

  if (!member) {
    return (
      <section className="section ma-shell"><div className="wrap"><div className="ms-empty"><h3 className="ms-empty-h">Not signed in</h3><p className="ms-empty-p">This area sits behind secure access. Sign in to see your stats.</p></div></div></section>
    );
  }

  var bagCount = window.ASB_DATA.getBag().length;

  return (
    <section className="section ma-shell" ref={ref}>
      <div className="wrap">
        <div className="ma-head reveal">
          <div className="ma-head-l">
            <span className="kicker" style={{ color: "var(--red-600)" }}>Members area</span>
            <h1 className="display ma-title">Hey, {member.first}.</h1>
            <span className="ma-sub">{member.email} · Bowler ID {member.id} · member since {fmtMonth(member.joined + "-01")}</span>
          </div>
          <div className="ma-head-r">
            <div className="ma-demo" title="Preview the empty / no-data state">
              <span className="ma-demo-l">Demo data</span>
              <button className={"ma-demo-tog" + (populated ? " on" : "")} onClick={function () { setPopulated(!populated); }} role="switch" aria-checked={populated}>
                <span className="ma-demo-knob"></span>
              </button>
              <span className="ma-demo-state">{populated ? "On" : "Empty state"}</span>
            </div>
            <button className="btn btn-ghost btn-sm" style={{ color: "var(--navy-800)" }} onClick={props.onSignOut}>Sign out</button>
          </div>
        </div>

        <div className="ma-tabs reveal reveal-d1" role="tablist">
          {MA_TABS.map(function (t) {
            return (
              <button key={t.key} className={"ma-tab" + (tab === t.key ? " on" : "")} role="tab" aria-selected={tab === t.key} onClick={function () { setTab(t.key); }}>
                <Icon name={t.icon} size={17} /> {t.label}
                {t.key === "bag" && bagCount ? <span className="ma-tab-badge">{bagCount}</span> : null}
              </button>
            );
          })}
        </div>

        <div className="ma-body reveal reveal-d2">
          {tab === "stats" ? <MemberStats member={member} onTab={setTab} /> : null}
          {tab === "equipment" ? <EquipmentCatalog bagVersion={bagVersion} onBag={bumpBag} /> : null}
          {tab === "bag" ? <MyBag bagVersion={bagVersion} onBag={bumpBag} onTab={setTab} /> : null}
          {tab === "links" ? <MemberLinks member={member} /> : null}
          {tab === "settings" ? <MemberSettings member={member} /> : null}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, {
  MemberArea: MemberArea, MemberStats: MemberStats, EquipmentCatalog: EquipmentCatalog,
  MyBag: MyBag, MemberLinks: MemberLinks, MemberSettings: MemberSettings, BallSwatch: BallSwatch, computeMetrics: computeMetrics
});
