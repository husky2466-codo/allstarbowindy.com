/* ============================================================
   LEAGUES & LIVE SCORES — native build
   ------------------------------------------------------------
   Re-renders the venue's Computer Score / LiveScores data in the
   All Star Bowl brand. Mirrors the real system's four surfaces
   (verified in docs/livescores-system-map.md):
     1. All-lanes board     (view-lanes.php — public, every active lane)
     2. Live scoresheet     (view.php / wrapper.php — frame-by-frame, 5s poll)
     3. Series stats         (stats.php — per-series analytics)
     4. Schedule & standings (standings.php — the weekly grid)
   Member auth always stays with Computer Score; we surface display only.
   Scores here are a deterministic stand-in for the cached/polled feed.
   ============================================================ */

const LS = ASB.LIVESCORES;
const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const { useMemo } = React;

const NAMES = ["Cam", "Isaac", "Frank", "Nicolas", "Alex", "Pape", "Leak", "Brian", "Astrid", "Angel",
  "Tonya", "William", "Terence", "Geneva", "Ray", "Earl", "Keisha", "Titus", "Jordan", "Amy",
  "Sherman", "Kavion", "Richard", "Dre", "Ricci", "Nikki", "Marcus", "Dana", "Reggie", "Gloria",
  "Vince", "Renee", "Otis", "Maya", "Curt", "Deb", "Hank", "Lorraine", "Pete", "Yvette"];

/* ---------- deterministic RNG (hashed seed → adjacent seeds decorrelate) ---------- */
function rng(seed) {
  let s = (Math.imul(seed | 0, 2654435761) >>> 0) % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

/* ---------- ball / frame generation ---------- */
function firstBall(r) {
  const x = r();
  if (x < 0.34) return 10;          // strike
  if (x < 0.57) return 9;
  if (x < 0.74) return 8;
  if (x < 0.86) return 7;
  if (x < 0.94) return 6;
  return 4 + Math.floor(r() * 2);
}
function secondBall(r, standing) {
  if (standing <= 0) return 0;
  if (r() < 0.46) return standing;  // spare
  return Math.floor(r() * standing);
}
function pinsKnocked(r, count) {
  const pins = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  for (let i = pins.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const t = pins[i]; pins[i] = pins[j]; pins[j] = t; }
  return pins.slice(0, count).sort(function (a, b) { return a - b; });
}
function buildFrame(r, i) {
  if (i < 9) {
    const b1 = firstBall(r);
    if (b1 === 10) return { balls: [10], strike: true, leave: [] };
    const b2 = secondBall(r, 10 - b1);
    return { balls: [b1, b2], spare: b1 + b2 === 10, leave: pinsKnocked(r, 10 - b1) };
  }
  // tenth
  const b1 = firstBall(r);
  if (b1 === 10) { const b2 = firstBall(r); const b3 = b2 === 10 ? firstBall(r) : secondBall(r, 10 - b2); return { balls: [10, b2, b3], tenth: true, leave: [] }; }
  const b2 = secondBall(r, 10 - b1);
  if (b1 + b2 === 10) return { balls: [b1, b2, firstBall(r)], tenth: true, leave: [] };
  return { balls: [b1, b2], tenth: true, leave: pinsKnocked(r, 10 - b1) };
}

/* Score a list of complete frames; `extra` are look-ahead balls (from the
   in-progress frame) used only for strike/spare bonuses — never scored as a
   frame themselves, so a half-thrown current frame can't poison the total. */
function scoreFrames(frames, extra) {
  const rolls = []; const starts = [];
  frames.forEach(function (f) { starts.push(rolls.length); f.balls.forEach(function (b) { rolls.push(b); }); });
  (extra || []).forEach(function (b) { if (b != null) rolls.push(b); });
  const cums = []; let cum = 0; let blocked = false;
  for (let i = 0; i < frames.length; i++) {
    if (blocked) { cums.push(null); continue; }
    const s = starts[i];
    if (i === 9) { cum += frames[i].balls.reduce(function (a, b) { return a + b; }, 0); cums.push(cum); continue; }
    if (rolls[s] === 10) {
      if (rolls[s + 1] != null && rolls[s + 2] != null) { cum += 10 + rolls[s + 1] + rolls[s + 2]; cums.push(cum); }
      else { blocked = true; cums.push(null); }
    } else if (rolls[s] + rolls[s + 1] === 10) {
      if (rolls[s + 2] != null) { cum += 10 + rolls[s + 2]; cums.push(cum); }
      else { blocked = true; cums.push(null); }
    } else { cum += rolls[s] + rolls[s + 1]; cums.push(cum); }
  }
  return cums;
}

function frameMarks(f, i) {
  const b = f.balls;
  if (i < 9) {
    if (f.strike) return ["", "X"];
    const m1 = b[0] === 0 ? "-" : String(b[0]);
    if (b[1] == null) return [m1, ""];                       // in-progress: one ball thrown
    return [m1, f.spare ? "/" : (b[1] === 0 ? "-" : String(b[1]))];
  }
  // tenth
  return b.map(function (v, k) {
    if (v === 10) return "X";
    if (k > 0 && b[k - 1] !== 10 && v + b[k - 1] === 10) return "/";
    return v === 0 ? "-" : String(v);
  });
}

/* A full or partial game → display frames + running totals + counts. */
function genGame(r, framesPlayed) {
  framesPlayed = framesPlayed == null ? 10 : Math.max(1, Math.min(10, framesPlayed));
  const complete = framesPlayed >= 10 ? 10 : framesPlayed - 1;
  const frames = [];
  for (let i = 0; i < complete; i++) frames.push(buildFrame(r, i));
  let current = null;
  if (framesPlayed < 10) {
    // in-progress current frame: 1 or 2 balls thrown
    const ci = complete;
    const b1 = firstBall(r);
    if (b1 === 10) current = { balls: [10], strike: true, current: true, leave: [] };
    else if (r() < 0.5) current = { balls: [b1], current: true, half: true, leave: pinsKnocked(r, 10 - b1) };
    else { const b2 = secondBall(r, 10 - b1); current = { balls: [b1, b2], spare: b1 + b2 === 10, current: true, leave: pinsKnocked(r, 10 - b1) }; }
    current._i = ci;
  }
  const cums = scoreFrames(frames, current ? current.balls : []);
  const display = frames.map(function (f, i) { return { marks: frameMarks(f, i), cum: cums[i], strike: f.strike, spare: f.spare, leave: f.leave, tenth: f.tenth, i: i }; });
  if (current) display.push({ marks: frameMarks(current, current._i), cum: null, strike: current.strike, spare: current.spare, leave: current.leave, current: true, i: current._i });
  const strikes = frames.filter(function (f, i) { return i < 9 && f.strike; }).length + (frames[9] ? frames[9].balls.filter(function (b) { return b === 10; }).length : 0);
  const spares = frames.filter(function (f) { return f.spare; }).length;
  const opens = frames.filter(function (f, i) { return i < 9 && !f.strike && !f.spare; }).length;
  const valid = cums.filter(function (c) { return c != null && !isNaN(c); });
  const lastCum = valid.length ? valid[valid.length - 1] : 0;
  return { display: display, frames: display.length, total: lastCum, resolved: valid.length > 0, strikes: strikes, spares: spares, opens: opens, complete: framesPlayed >= 10 };
}
function showTot(g) { return g.resolved ? g.total : "–"; }

/* A player's whole series: completed games + the in-progress one. */
function genSeries(seed, gamesDone, curFrame) {
  const games = [];
  for (let g = 0; g < gamesDone; g++) games.push(genGame(rng(seed + g * 911), 10));
  const current = genGame(rng(seed + gamesDone * 911), curFrame);
  const all = games.concat([current]);
  const seriesTotal = all.reduce(function (a, g) { return a + g.total; }, 0);
  const strikes = all.reduce(function (a, g) { return a + g.strikes; }, 0);
  const spares = all.reduce(function (a, g) { return a + g.spares; }, 0);
  const opens = all.reduce(function (a, g) { return a + g.opens; }, 0);
  const r = rng(seed + 7);
  const splitTries = 2 + Math.floor(r() * 4);
  const splitMade = Math.floor(r() * 2);
  return {
    games: all, gamesDone: gamesDone, seriesTotal: seriesTotal,
    strikes: strikes, spares: spares,
    conv: { splits: splitMade + "/" + splitTries, open: opens + "/" + (all.length * 9), xonx: Math.max(0, strikes - 4) + "/" + (strikes + 2) }
  };
}

/* ---------- build a live session for the current clock ---------- */
function buildSession(now) {
  const status = ASB.getStatus(now);
  const leaguesNow = status.leaguesNow;
  const live = leaguesNow.length > 0;
  let src, label;
  if (live) { src = leaguesNow; label = leaguesNow.length === 1 ? leaguesNow[0].name : leaguesNow.length + " leagues bowling now"; }
  else {
    const up = status.upcomingLeagues[0];
    const all = ASB.LEAGUES.filter(function (l) { return l.day === now.getDay(); });
    src = all.length ? all : [ASB.LEAGUES[4], ASB.LEAGUES[6], ASB.LEAGUES[7]];
    label = up ? ("Next session · " + up.name + " at " + ASB.fmtClock(up.start)) : "Sample league session";
  }
  const minuteBucket = Math.floor((now.getHours() * 60 + now.getMinutes()) / 1) + now.getDate() * 1440;
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  const lanes = [];
  let laneNo = 1;
  src.forEach(function (lg, li) {
    const count = live ? Math.min(lg.lanes, 14) : Math.min(lg.lanes, 9);
    for (let j = 0; j < count; j++) {
      const seedBase = dayOfYear * 131 + laneNo * 7919 + li * 97;
      const r = rng(seedBase + Math.floor(minuteBucket / 7));
      const nPlayers = Math.max(2, Math.min(5, lg.perTeam || 4));
      const gamesDone = Math.min(2, Math.floor(r() * 3));
      const curFrame = 2 + Math.floor(r() * 8);
      const players = [];
      for (let p = 0; p < nPlayers; p++) {
        const nm = NAMES[(seedBase + p * 7) % NAMES.length];
        players.push(Object.assign({ name: nm }, genSeries(seedBase * 31 + p * 1013 + Math.floor(minuteBucket / 11), gamesDone, curFrame)));
      }
      lanes.push({ lane: laneNo, seriesID: 1320000 + dayOfYear * 7 + laneNo * 3 + li * 101, league: lg.name, game: gamesDone + 1, ofGames: 3, curFrame: curFrame, players: players });
      laneNo += 1;
    }
  });
  return { live: live, label: label, lanes: lanes, count: lanes.length };
}

/* ============================================================
   Demo fixtures (REAL data, captured 2026-06-07) — no backend.
   window.ASB_FIX from js/demo-fixtures.js.
   ============================================================ */
function canonicalLeave(n, seed) {
  if (n <= 0) return [];
  const r = rng((seed + 1) * 131 + n * 17);
  const pins = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  for (let i = pins.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const t = pins[i]; pins[i] = pins[j]; pins[j] = t; }
  return pins.slice(0, n).sort(function (a, b) { return a - b; });
}
function fixturePlayerGame(player) {
  const display = []; let strikes = 0, spares = 0, opens = 0;
  player.frames.forEach(function (fr, i) {
    const has = fr.f !== "" || fr.s !== "" || fr.t3 !== "";
    if (!has) return;
    const tenth = i === 9;
    let marks, strike = false, spare = false, leave = [];
    if (tenth) {
      marks = [fr.f, fr.s, fr.t3].filter(function (x) { return x !== ""; });
      marks.forEach(function (m) { if (m === "X") strikes++; else if (m === "/") spares++; });
    } else if (fr.s === "X") { marks = ["", "X"]; strike = true; strikes++; }
    else if (fr.s === "/") { marks = [fr.f, "/"]; spare = true; spares++; }
    else { marks = [fr.f, fr.s]; if (fr.f !== "" && fr.s !== "") opens++; if (fr.f !== "") leave = canonicalLeave(10 - (parseInt(fr.f, 10) || 0), i); }
    const cum = fr.tot === "" ? null : parseInt(fr.tot, 10);
    const inProgress = !tenth && fr.f !== "" && fr.s === "" && !strike;
    display.push({ marks: marks, cum: cum, strike: strike, spare: spare, leave: leave, tenth: tenth, current: inProgress, i: i });
  });
  const total = parseInt(player.total, 10) || 0;
  const fc = Math.max(1, display.length);
  const conv = { splits: "0/" + Math.max(1, Math.round(fc / 3)), open: opens + "/" + fc, xonx: Math.max(0, strikes - 1) + "/" + (strikes + 1) };
  return { display: display, frames: display.length, total: total, resolved: true, strikes: strikes, spares: spares, opens: opens, conv: conv };
}
function fixtureStatePlayers(state) {
  return state.players.map(function (p) {
    const g = fixturePlayerGame(p);
    return { name: p.name, games: [g], seriesTotal: g.total, strikes: g.strikes, spares: g.spares, conv: g.conv };
  });
}
function buildDemoSession() {
  const F = window.ASB_FIX;
  const lanes = F.board.map(function (b) {
    const isF = b.lane === F.lane38.lane;
    let players, states = null;
    if (isF) { states = F.lane38.states.map(fixtureStatePlayers); players = states[states.length - 1]; }
    else {
      players = b.bowlers.map(function (nm, i) {
        const g = genGame(rng(b.seriesID * 7 + i * 1013), 3 + (b.seriesID % 7));
        const conv = { splits: "0/" + Math.max(1, Math.round(g.frames / 3)), open: g.opens + "/" + Math.max(1, g.frames), xonx: Math.max(0, g.strikes - 1) + "/" + (g.strikes + 1) };
        return { name: nm, games: [g], seriesTotal: g.total, strikes: g.strikes, spares: g.spares, conv: conv };
      });
    }
    return { lane: b.lane, seriesID: b.seriesID, bowlers: b.bowlers, isFeatured: isF, states: states, players: players, game: 1, ofGames: 3, curFrame: isF ? 7 : (3 + (b.seriesID % 7)) };
  });
  return { live: true, label: "Captured live · " + F.captured, count: lanes.length, featured: F.lane38.lane, lanes: lanes };
}

/* eases a number from its previous value to a new target when it changes */
function CountTo(props) {
  const [disp, setDisp] = useState(props.value);
  const prev = useRef(props.value);
  useEffect(function () {
    const from = prev.current, to = props.value; prev.current = to;
    if (from === to) { setDisp(to); return; }
    if (to < from) { setDisp(to); return; }              // loop reset → snap, don't count down
    let raf, start = null;
    function step(t) { if (start == null) start = t; const p = Math.min(1, (t - start) / 700); const e = 1 - Math.pow(1 - p, 3); setDisp(Math.round(from + (to - from) * e)); if (p < 1) raf = requestAnimationFrame(step); }
    raf = requestAnimationFrame(step);
    return function () { cancelAnimationFrame(raf); };
  }, [props.value]);
  return disp;
}

/* ============================================================
   Hero
   ============================================================ */
function ScoresHero(props) {
  const ref = useReveal();
  const s = props.session;
  const fl = s.lanes.find(function (l) { return l.isFeatured; }) || s.lanes[0];
  const teaser = fl.states ? fl.states[0] : fl.players;
  return (
    <section className="scoreshero lane-on" ref={ref}>
      <div className="halftone bowlhero-tex"></div>
      <div className="wrap scoreshero-grid">
        <div className="reveal">
          <span className="kicker" style={{ color: "var(--blue-300)" }}>Leagues · Live Scores</span>
          <h1 className="display page-title">Every lane, every league — live.</h1>
          <p className="page-lead">Live lane-by-lane scoring, frame-by-frame sheets, series stats and the full weekly standings — straight from our on-lane scoring system, re-rendered in All Star Bowl colors and ticking in real time.</p>
          <div className="hero-cta" style={{ marginTop: 26 }}>
            <button className="btn btn-red btn-lg" onClick={function () { props.onOpenLane(fl.lane); }}><Icon name="ball" size={19} /> Watch a lane live</button>
            <button className="btn btn-ghost btn-lg" onClick={function () { props.onJump("standings"); }}><Icon name="trophy" size={18} /> League standings</button>
          </div>
          <p className="scoreshero-src"><LiveDot on={s.live} /> {s.count} lanes scoring now · live demo</p>
        </div>
        <button className="reveal reveal-d2 scoreshero-board" onClick={function () { props.onOpenLane(fl.lane); }}>
          <div className="lb-mini-head">
            <span className="lb-mini-title"><LiveDot on={true} /> Lane {fl.lane} · live</span>
            <span className="lb-mini-session">tap for scoresheet →</span>
          </div>
          {teaser.map(function (p) {
            const g = p.games[p.games.length - 1];
            return (
              <div key={p.name} className="lb-mini-row">
                <span className="lb-mini-name lb-mini-solo">{p.name}<small>Frame {g.display.length}</small></span>
                <span className="lb-mini-marks">{g.display.slice(-3).map(function (f, k) { return <i key={k} className={"mm " + markCls(f.marks[f.marks.length - 1])}>{f.marks[f.marks.length - 1] || "–"}</i>; })}</span>
                <span className="lb-mini-score">{showTot(g)}</span>
              </div>
            );
          })}
          <span className="lb-mini-foot" onClick={function (e) { e.stopPropagation(); props.onJump("live"); }}>See all {s.count} lanes →</span>
        </button>
      </div>
    </section>
  );
}

function LiveDot(props) {
  return <span className={"dot " + (props.on ? "s-open" : "s-limited")} style={{ background: "currentColor", display: "inline-block", verticalAlign: "middle" }}></span>;
}

/* "updated Ns ago" ticker — conveys the 5-second poll cadence. */
function LiveTicker(props) {
  const [sec, setSec] = useState(0);
  useEffect(function () {
    if (!props.on) return;
    const id = setInterval(function () { setSec(function (n) { return (n + 1) % 6; }); }, 1000);
    return function () { clearInterval(id); };
  }, [props.on]);
  if (!props.on) return <span className="live-ticker idle"><Icon name="clock" size={13} /> Updates live during league play</span>;
  return <span className="live-ticker"><span className="lt-pulse"></span> Live · polling every 5s · updated {sec}s ago</span>;
}

/* ============================================================
   Live center — all-lanes board ⇄ per-lane scoresheet ⇄ stats
   ============================================================ */
function LiveCenter(props) {
  const ref = useReveal();
  const s = props.session;
  const [view, setView] = useState({ mode: "board" });

  function openLane(lane) { setView({ mode: "sheet", lane: lane, tab: "grid" }); window.scrollTo({ top: document.getElementById("live-center").getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" }); }
  props.bind(openLane);

  const lane = view.mode === "sheet" ? s.lanes.find(function (l) { return l.lane === view.lane; }) : null;

  return (
    <section className="section live-sec lane-on" id="live-center" ref={ref}>
      <div className="halftone bowlhero-tex"></div>
      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        {view.mode === "board" ? (
          <AllLanesBoard session={s} onOpen={openLane} />
        ) : (
          <LaneSheet lane={lane} tab={view.tab} onTab={function (t) { setView(Object.assign({}, view, { tab: t })); }} onBack={function () { setView({ mode: "board" }); }} session={s} />
        )}
      </div>
    </section>
  );
}

function AllLanesBoard(props) {
  const s = props.session;
  const featuredLane = s.lanes.find(function (l) { return l.isFeatured; });
  return (
    <React.Fragment>
      <div className="live-head reveal">
        <SectionHead light kicker="All lanes · live floor" title="On the lanes right now." sub="Every active lane and who's bowling — captured live from the floor. Tap any lane for its full frame-by-frame scoresheet." />
        <div className="live-head-side">
          <span className="live-status-pill is-live"><LiveDot on={true} /> {s.count} lanes live</span>
          <LiveTicker on={true} />
          {featuredLane ? <button className="watch-btn" onClick={function () { props.onOpen(featuredLane.lane); }}><Icon name="ball" size={15} /> Watch Lane {featuredLane.lane} live</button> : null}
        </div>
      </div>
      <div className="board-grid reveal reveal-d1">
        {s.lanes.map(function (ln) {
          return (
            <button key={ln.lane} className={"board-lane is-live" + (ln.isFeatured ? " featured" : "")} onClick={function () { props.onOpen(ln.lane); }}>
              {ln.isFeatured ? <span className="bl-ribbon">Featured</span> : null}
              <div className="bl-top">
                <span className="bl-no">Lane {ln.lane}</span>
                <span className="bl-live on">{ln.isFeatured ? "● Watch live" : "● Live"}</span>
              </div>
              <div className="bl-names">{ln.bowlers.join(" · ")}</div>
              <div className="bl-foot">
                <span>{ln.bowlers.length} bowling</span>
                <span className="bl-open">Scoresheet →</span>
              </div>
            </button>
          );
        })}
      </div>
      <ProvenanceLine />
    </React.Fragment>
  );
}

/* ---------- per-lane scoresheet + stats ---------- */
function PinDeck(props) {
  // props.leave = pins left STANDING after the first ball
  const standing = props.leave || [];
  const rows = [[7, 8, 9, 10], [4, 5, 6], [2, 3], [1]];
  if (props.strike || props.spare) {
    return <div className="pindeck all"><span className="pd-mark">{props.strike ? "carry" : "spare"}</span></div>;
  }
  return (
    <div className="pindeck">
      {rows.map(function (row, ri) {
        return <div key={ri} className="pd-row">{row.map(function (pin) {
          const up = standing.indexOf(pin) >= 0;
          return <span key={pin} className={"pd-pin" + (up ? " up" : "")}></span>;
        })}</div>;
      })}
    </div>
  );
}

function ScoreFrame(props) {
  const f = props.frame;
  const marks = f.marks;
  return (
    <div className={"sf" + (f.current ? " cur" : "") + (f.tenth ? " tenth" : "")}>
      <div className="sf-balls">
        {f.tenth ? marks.map(function (m, i) { return <span key={i} className={"sf-b " + markCls(m)}>{m}</span>; })
          : [<span key="a" className={"sf-b " + markCls(marks[0])}>{marks[0]}</span>, <span key="b" className={"sf-b " + markCls(marks[1])}>{marks[1]}</span>]}
      </div>
      <div className="sf-cum">{f.cum != null ? f.cum : (f.current ? <span className="sf-cur-ind">‹</span> : "")}</div>
    </div>
  );
}
function markCls(m) { return m === "X" ? "is-strike" : m === "/" ? "is-spare" : m === "-" ? "is-miss" : ""; }

function LaneSheet(props) {
  const ln = props.lane;
  const featured = ln.isFeatured && ln.states && ln.states.length > 1;
  const [stateIdx, setStateIdx] = useState(0);
  const [flash, setFlash] = useState(false);
  useEffect(function () {
    if (!featured) return;
    let to;
    const id = setInterval(function () {
      setStateIdx(function (i) { return (i + 1) % ln.states.length; });
      setFlash(true); clearTimeout(to); to = setTimeout(function () { setFlash(false); }, 1300);
    }, 5000);
    return function () { clearInterval(id); clearTimeout(to); };
  }, [featured, ln.lane]);

  const players = featured ? ln.states[stateIdx] : ln.players;
  const [gameIdx, setGameIdx] = useState(players[0].games.length - 1);
  const nGames = players[0].games.length;
  if (props.tab === "stats") return <SeriesStats lane={ln} onTab={props.onTab} onBack={props.onBack} />;
  const gi = Math.min(gameIdx, nGames - 1);

  return (
    <div className="reveal">
      <div className="sheet-bar">
        <button className="sheet-back" onClick={props.onBack}><Icon name="chev" size={16} style={{ transform: "rotate(180deg)" }} /> All lanes</button>
        <div className="sheet-id">
          <strong className="display">Lane {ln.lane}</strong>
          <span>{players.length} bowling · series #{ln.seriesID}</span>
        </div>
        <div className="sheet-tabs">
          <button className="sheet-tab on">Scoresheet</button>
          <button className="sheet-tab" onClick={function () { props.onTab("stats"); }}>Stats</button>
        </div>
      </div>

      <div className="game-pager">
        <button className="gp-btn" disabled={gi === 0} onClick={function () { setGameIdx(Math.max(0, gi - 1)); }}><Icon name="chev" size={16} style={{ transform: "rotate(180deg)" }} /></button>
        <span className="gp-label">Game {gi + 1} <small>of {ln.ofGames}</small>{gi === nGames - 1 ? <em> · live</em> : null}</span>
        <button className="gp-btn" disabled={gi === nGames - 1} onClick={function () { setGameIdx(Math.min(nGames - 1, gi + 1)); }}><Icon name="chev" size={16} /></button>
        <span className={"gp-live" + (flash ? " flash" : "")}><span className="lt-pulse"></span>{flash ? "updating…" : "live"}</span>
      </div>

      <div className="sheet-scroll">
        <div className={"sheet" + (flash ? " is-updating" : "")}>
          <div className="sheet-head">
            <span className="sh-name">Bowler</span>
            <div className="sh-frames">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (n) { return <span key={n} className="sh-fn">{n}</span>; })}
            </div>
            <span className="sh-total">Total</span>
          </div>
          {players.map(function (p, pi) {
            const g = p.games[gi];
            return (
              <div key={pi} className={"sheet-row tone-" + (pi % 3)}>
                <span className="sr-name">{p.name}</span>
                <div className="sr-frames">
                  {g.display.map(function (f, fi) { return <ScoreFrame key={fi} frame={f} />; })}
                  {Array.from({ length: 10 - g.display.length }).map(function (_, k) { return <div key={"e" + k} className="sf empty"><div className="sf-balls"></div><div className="sf-cum"></div></div>; })}
                </div>
                <span className="sr-total">{featured && g.resolved ? <CountTo value={g.total} /> : showTot(g)}</span>
              </div>
            );
          })}
          <div className="sheet-pins">
            <span className="sr-name sp-label">{players[0].name} · pins</span>
            <div className="sr-frames">
              {players[0].games[gi].display.map(function (f, fi) { return <div key={fi} className="sf"><PinDeck leave={f.leave} strike={f.strike} spare={f.spare} /></div>; })}
            </div>
            <span className="sr-total"></span>
          </div>
        </div>
      </div>
      <ProvenanceLine />
    </div>
  );
}

function SeriesStats(props) {
  const ln = props.lane;
  const nGames = ln.players[0].games.length;
  const netByGame = [];
  for (let g = 0; g < nGames; g++) netByGame.push(ln.players.reduce(function (a, p) { return a + p.games[g].total; }, 0));
  const netSeries = ln.players.reduce(function (a, p) { return a + p.seriesTotal; }, 0);
  return (
    <div className="reveal">
      <div className="sheet-bar">
        <button className="sheet-back" onClick={props.onBack}><Icon name="chev" size={16} style={{ transform: "rotate(180deg)" }} /> All lanes</button>
        <div className="sheet-id">
          <strong className="display">Lane {ln.lane} · Stats</strong>
          <span>{ln.players.length} bowling · series #{ln.seriesID}</span>
        </div>
        <div className="sheet-tabs">
          <button className="sheet-tab" onClick={function () { props.onTab("grid"); }}>Scoresheet</button>
          <button className="sheet-tab on">Stats</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stats-card">
          <h4 className="stats-h">Match record</h4>
          <div className="stats-scroll">
            <table className="stats-table">
              <thead>
                <tr><th>Player</th>{Array.from({ length: nGames }).map(function (_, g) { return <th key={g}>Game {g + 1}</th>; })}<th className="st-series">Series</th></tr>
              </thead>
              <tbody>
                {ln.players.map(function (p, pi) {
                  return (
                    <tr key={pi}>
                      <td className="st-player">{p.name}</td>
                      {p.games.map(function (g, gi) {
                        return <td key={gi} className="st-game"><b>{showTot(g)}</b><small>{g.strikes}<i>X</i> {g.spares}<i>/</i></small></td>;
                      })}
                      <td className="st-series"><b>{p.seriesTotal}</b></td>
                    </tr>
                  );
                })}
                <tr className="st-net">
                  <td>Net total</td>
                  {netByGame.map(function (v, i) { return <td key={i}>{v}</td>; })}
                  <td className="st-series">{netSeries}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="stats-card stats-conv">
          <h4 className="stats-h">Conversion</h4>
          <table className="stats-table conv">
            <thead><tr><th>Player</th><th>Splits</th><th>Open</th><th>X on X</th></tr></thead>
            <tbody>
              {ln.players.map(function (p, pi) {
                return <tr key={pi}><td className="st-player">{p.name}</td><td>{p.conv.splits}</td><td>{p.conv.open}</td><td>{p.conv.xonx}</td></tr>;
              })}
            </tbody>
          </table>
          <p className="conv-note">Splits made · open frames · strikes after a strike, across the series.</p>
        </div>
      </div>
      <ProvenanceLine />
    </div>
  );
}

function ProvenanceLine() {
  const cap = (window.ASB_FIX && window.ASB_FIX.captured) || "2026-06-07";
  return (
    <div className="prov">
      <span><LiveDot on={true} /> Demo · real scores captured {cap} · replayed live, no backend</span>
      <a href={LS.lanes} target="_blank" rel="noreferrer" className="prov-src">Computer Score ↗</a>
    </div>
  );
}

/* ============================================================
   Member access — brand-skinned Live Access Code (auth stays with CS)
   ============================================================ */
function AccessEntry(props) {
  const ref = useReveal();
  return (
    <section className="section access-sec" ref={ref}>
      <div className="wrap access-grid">
        <div className="reveal access-copy">
          <SectionHead kicker="Member access" title="Got a Live Access Code?" sub="Bowlers and league secretaries log in to live lane control, recap sheets and team tools. Access is handled securely by Computer Score — we just give you a cleaner front door." />
          <ul className="access-points">
            <li><span className="access-tick"><Icon name="check" size={15} /></span> Follow your league's lanes in real time</li>
            <li><span className="access-tick"><Icon name="check" size={15} /></span> Pull recap sheets &amp; series stats</li>
            <li><span className="access-tick"><Icon name="check" size={15} /></span> Secretaries: edit line-ups and absentees</li>
          </ul>
          <p className="access-foot"><Icon name="info" size={15} /> No code needed to <button className="access-inline" onClick={function () { props.onJump("live"); }}>watch live lanes</button> or <button className="access-inline" onClick={function () { props.onJump("standings"); }}>browse standings</button>.</p>
        </div>
        <div className="reveal reveal-d2">
          <form className="access-card" method="POST" action={LS.landing} target="_blank">
            <div className="access-card-head">
              <span className="access-badge"><Icon name="ball" size={18} /></span>
              <div>
                <strong>Live Access Code</strong>
                <span>All Star Bowl · centre {LS.centre}</span>
              </div>
            </div>
            <label className="access-field">
              <span>Enter your code</span>
              <input name="pass" type="password" placeholder="••••••••" autoComplete="off" />
            </label>
            <button type="submit" className="btn btn-red btn-lg access-submit"><Icon name="arrow" size={18} /> Log in</button>
            <div className="access-or"><span>or jump straight in</span></div>
            <div className="access-secondary">
              <button type="button" className="access-pill" onClick={function () { props.onJump("live"); }}><Icon name="ball" size={16} /> Live lanes</button>
              <button type="button" className="access-pill" onClick={function () { props.onJump("standings"); }}><Icon name="trophy" size={16} /> Standings</button>
            </div>
            <a className="access-member" href={LS.memberLogin} target="_blank" rel="noreferrer">Registered member? <strong>Member login ↗</strong></a>
            <p className="access-secured"><Icon name="check" size={13} /> Secured &amp; verified by Computer Score</p>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Schedule & standings grid (native)
   ============================================================ */
function StandingsSection(props) {
  const ref = useReveal();
  const todayName = DAY_ORDER[(ClockStore.now().getDay() + 6) % 7];
  const [day, setDay] = useState(todayName);
  const grouped = {};
  ASB.STANDINGS.forEach(function (l) { (grouped[l.day] = grouped[l.day] || []).push(l); });
  const active = DAY_ORDER.filter(function (d) { return grouped[d]; });
  const list = grouped[day] || [];
  function typeClass(t) {
    if (/junior/i.test(t)) return "tt-junior";
    if (/female/i.test(t)) return "tt-female";
    if (/male/i.test(t)) return "tt-male";
    return "tt-mixed";
  }
  return (
    <section className="section standings-sec" id="standings" ref={ref}>
      <div className="wrap">
        <div className="stand-head reveal">
          <SectionHead kicker="Schedule & standings" title="Find your league." sub="Every league that rolls at All Star Bowl, by day. Tap a league for full standings, averages and team rankings." />
          <div className="stand-count"><strong>{ASB.STANDINGS.length}</strong><span>leagues a week</span></div>
        </div>
        <div className="stand-tabs reveal reveal-d1">
          {active.map(function (d) {
            const isToday = d === todayName;
            return (
              <button key={d} className={"stand-tab" + (d === day ? " on" : "")} onClick={function () { setDay(d); }}>
                <span>{d.slice(0, 3)}</span>
                <small>{grouped[d].length} league{grouped[d].length > 1 ? "s" : ""}{isToday ? " · today" : ""}</small>
              </button>
            );
          })}
        </div>
        <div className="stand-table reveal reveal-d2" key={day}>
          <div className="stand-row stand-row--head">
            <span className="st-league">{day}</span>
            <span className="st-time">Time</span>
            <span className="st-type">Type</span>
            <span className="st-num">Bowlers / team</span>
            <span className="st-num">Teams</span>
            <span className="st-go"></span>
          </div>
          {list.map(function (l, i) {
            return (
              <a key={i} className="stand-row" href={LS.standings} target="_blank" rel="noreferrer">
                <span className="st-league"><strong>{l.name}</strong></span>
                <span className="st-time">{l.time}</span>
                <span className="st-type"><span className={"tt " + typeClass(l.type)}>{l.type}</span></span>
                <span className="st-num" data-label="Bowlers / team">{l.perTeam}</span>
                <span className="st-num" data-label="Teams">{l.teams}</span>
                <span className="st-go"><Icon name="chev" size={16} /></span>
              </a>
            );
          })}
        </div>
        <div className="prov">
          <span><LiveDot on={true} /> Synced from Computer Score · centre {LS.centre} · updated weekly</span>
          <a href={LS.standings} target="_blank" rel="noreferrer" className="prov-src">View live source ↗</a>
        </div>
        <div className="stand-cta reveal">
          <div>
            <strong className="display">Want in on a league?</strong>
            <span>New bowlers welcome — sub spots and full teams across every night.</span>
          </div>
          <button className="btn btn-red btn-lg" onClick={function () { Router.go("/leagues"); }}><Icon name="users" size={18} /> Join a league</button>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Page
   ============================================================ */
function LiveScoresPage() {
  const session = useMemo(function () { return buildDemoSession(); }, []);
  const openLaneRef = useRef(null);
  function jump(id) { const el = document.getElementById(id === "live" ? "live-center" : id); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" }); }
  function openLane(lane) { if (openLaneRef.current) openLaneRef.current(lane); }
  return (
    <main>
      <div className="lane-zone">
        <ScoresHero session={session} onJump={jump} onOpenLane={openLane} />
        <LiveCenter session={session} bind={function (fn) { openLaneRef.current = fn; }} />
      </div>
      <AccessEntry onJump={jump} />
      <StandingsSection />
    </main>
  );
}

Object.assign(window, { LiveScoresPage });
