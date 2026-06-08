/* ============================================================
   WIN CASH — the venue's two distinct cash games, kept separate:
   1) KEGLER'S CASH (the Strike Jackpot board) — a side game that
      runs all week; tabbed "how to play" sits under the board.
   2) CASINO BOWLING — Mon & Thu 8 PM, every strike spins a slot.
   Lives as one big section on the Specials page.
   ============================================================ */

/* ---- Kegler's Cash explainer tabs (facts verified vs the real
   in-shop flyer: win up to $150, 10x, quarter–$5, average-based,
   sign up before the 3rd frame) ---- */
const KEGLERS_TABS = [
  {
    key: "how", label: "How to play", icon: "info",
    title: "A side game on top of your bowling",
    body: "Kegler's Cash runs right on top of your normal games — no separate lane, no extra gear. The board on the wall tracks the marks and strikes for every group that's signed up. You win by hitting the correct marks and/or strikes for your group's average, so it's handicap-style: a steady bowler and a first-timer both have a real shot.",
    foot: "Winning is based on your average — not your raw score."
  },
  {
    key: "buyin", label: "Pick your buy-in", icon: "ticket",
    title: "Cost is your choice — win 10× back",
    body: "Play for as little as a quarter or as much as $5.00 a game, and buy into any or all games of your series. Whatever you put down, you win ten times back — up to a $150.00 cap.",
    list: [
      ["$0.25", "win $2.50"],
      ["$1.00", "win $10.00"],
      ["$2.00", "win $20.00"],
      ["$5.00", "win $50.00"]
    ],
    foot: "Play any or all games · win up to $150.00 total."
  },
  {
    key: "signup", label: "The one rule", icon: "clock",
    title: "Sign up before the 3rd frame",
    body: "You have to sign up before you bowl — specifically before the first ball of the 3rd frame of your first game. After that the board locks for the session, so just tell the front desk you're in when you check in.",
    foot: "That's the only catch — sign up at the desk before the 3rd frame."
  },
  {
    key: "why", label: "Why it pays", icon: "trophy",
    title: "The math leans your way",
    body: "Because every win pays 10× your buy-in, the odds work in your favor. Even if you only win once every nine games, you still come out ahead — a low-stakes side bet with genuine upside, going all week long.",
    foot: "\u201cEven if you only win once every nine games, you make a profit.\u201d"
  }
];

const KEGLERS_STATS = [
  { v: "$150", l: "Win up to", s: "the season cap" },
  { v: "10\u00d7", l: "Every win pays", s: "your buy-in back" },
  { v: "25\u00a2\u2013$5", l: "Per game", s: "cost is your choice" },
  { v: "Any/all", l: "Games", s: "play as many as you like" }
];

function KeglersCashFeature() {
  const [tab, setTab] = useState("how");
  const active = KEGLERS_TABS.filter(function (t) { return t.key === tab; })[0] || KEGLERS_TABS[0];
  return (
    <div className="wc-game wc-keglers" id="keglers-cash">
      <div className="wc-game-head">
        <span className="wc-badge">Runs all week</span>
        <h3 className="display wc-game-title">Kegler's Cash</h3>
        <p className="wc-game-tag">The alley's classic side game. <strong>Win up to $150</strong> on your marks &amp; strikes — and the cost is entirely your choice.</p>
      </div>

      <div className="wc-keglers-main">
        <div className="wc-board-wrap">
          <StrikeJackpotBoard />
        </div>
        <div className="wc-stats">
          {KEGLERS_STATS.map(function (st, i) {
            return (
              <div key={i} className="wc-stat">
                <span className="wc-stat-l">{st.l}</span>
                <strong className="wc-stat-v">{st.v}</strong>
                <span className="wc-stat-s">{st.s}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="wc-explainer">
        <div className="wc-tabs" role="tablist" aria-label="How Kegler's Cash works">
          {KEGLERS_TABS.map(function (t) {
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={t.key === tab}
                className={"wc-tab" + (t.key === tab ? " is-on" : "")}
                onClick={function () { setTab(t.key); }}
              >
                <Icon name={t.icon} size={16} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        <div className="wc-tabpanel" role="tabpanel">
          <h4 className="wc-tp-title">{active.title}</h4>
          <p className="wc-tp-body">{active.body}</p>
          {active.list ? (
            <ul className="wc-ladder">
              {active.list.map(function (row, i) {
                return (
                  <li key={i} className="wc-ladder-row">
                    <span className="wc-ladder-in">{row[0]}</span>
                    <span className="wc-ladder-arrow"><Icon name="chev" size={14} /></span>
                    <span className="wc-ladder-out">{row[1]}</span>
                  </li>
                );
              })}
            </ul>
          ) : null}
          {active.foot ? <p className="wc-tp-foot">{active.foot}</p> : null}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   CASINO BOWLING — strike = slot spin. A working 3-reel slot
   (rAF continuous-scroll reels; CSS transitions are frozen in
   preview so motion is driven from state). Auto-spins on casino
   night; a manual "Pull" works any time.
   ============================================================ */
const SLOT_SYMBOLS = [
  { g: "7", c: "#e0241f" },
  { g: "\u2605", c: "#f5b423" },
  { g: "$", c: "#1f9d55" },
  { g: "\u25c6", c: "#1e46a8" },
  { g: "\u25cf", c: "#0e1a3a" }
];
const SLOT_N = SLOT_SYMBOLS.length;
const SLOT_ITEM_H = 62;

function pickSlotResult() {
  const r = Math.random();
  if (r < 0.34) return [0, 0, 0];                  // jackpot 7-7-7
  if (r < 0.5) { const s = 1 + Math.floor(Math.random() * (SLOT_N - 1)); return [s, s, s]; }
  return [0, 1, 2].map(function () { return Math.floor(Math.random() * SLOT_N); });
}

function SlotReelCell(props) {
  const sym = SLOT_SYMBOLS[((props.idx % SLOT_N) + SLOT_N) % SLOT_N];
  return <div className="slot-cell" style={{ height: SLOT_ITEM_H, color: sym.c }}>{sym.g}</div>;
}

function CasinoSlot() {
  const s = useStatus();
  const live = !!(s.liveSpecial && s.liveSpecial.name === "Casino Bowling");

  const posRef = useRef([0, 0, 0]);
  const animRef = useRef([null, null, null]);
  const raf = useRef(0);
  const resultRef = useRef([0, 0, 0]);
  const [, setTick] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [win, setWin] = useState(null); // {amount}

  function settle() {
    const r = resultRef.current;
    const jackpot = r[0] === r[1] && r[1] === r[2];
    if (jackpot) setWin({ amount: r[0] === 0 ? 50 : 25 });
    else setWin(null);
  }

  function loop(t) {
    let any = false;
    const anims = animRef.current;
    for (let i = 0; i < 3; i++) {
      const a = anims[i];
      if (!a) continue;
      any = true;
      const p = Math.min(1, (t - a.start) / a.dur);
      const e = 1 - Math.pow(1 - p, 3);
      posRef.current[i] = a.from + (a.to - a.from) * e;
      if (p >= 1) { posRef.current[i] = a.to; anims[i] = null; }
    }
    setTick(t);
    if (any) { raf.current = requestAnimationFrame(loop); }
    else { setSpinning(false); settle(); }
  }

  function spin() {
    if (animRef.current.some(Boolean)) return;
    setWin(null);
    setSpinning(true);
    const result = pickSlotResult();
    resultRef.current = result;
    const now = performance.now();
    for (let i = 0; i < 3; i++) {
      const cur = posRef.current[i];
      let P = Math.ceil(cur) + 7 + i * 5;
      const delta = (((result[i] - (P % SLOT_N)) % SLOT_N) + SLOT_N) % SLOT_N;
      P += delta;
      animRef.current[i] = { from: cur, to: P, dur: 1500 + i * 480, start: now };
    }
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(loop);
  }

  // auto-spin on casino night
  useEffect(function () {
    if (!live) return undefined;
    const id = setInterval(function () { spin(); }, 5200);
    const kick = setTimeout(function () { spin(); }, 700);
    return function () { clearInterval(id); clearTimeout(kick); };
    // eslint-disable-next-line
  }, [live]);

  useEffect(function () { return function () { cancelAnimationFrame(raf.current); }; }, []);

  return (
    <div className={"slot" + (win ? " is-win" : "") + (live ? " is-live" : "")}>
      <div className="slot-top">
        <span className="slot-eyebrow">&#9733; All Star &#9733;</span>
        <span className="slot-marquee">Casino Bowling</span>
      </div>
      <div className="slot-window">
        <span className="slot-payline" aria-hidden="true"></span>
        {[0, 1, 2].map(function (i) {
          const pos = posRef.current[i];
          const idx = Math.floor(pos);
          const frac = pos - idx;
          return (
            <div key={i} className="slot-reel">
              <div className="slot-reel-inner" style={{ transform: "translateY(" + (-SLOT_ITEM_H - frac * SLOT_ITEM_H) + "px)" }}>
                <SlotReelCell idx={idx - 2} />
                <SlotReelCell idx={idx - 1} />
                <SlotReelCell idx={idx} />
                <SlotReelCell idx={idx + 1} />
                <SlotReelCell idx={idx + 2} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="slot-foot">
        {win ? (
          <span className="slot-msg slot-msg--win"><Icon name="trophy" size={15} /> Strike pays — ${win.amount}!</span>
        ) : spinning ? (
          <span className="slot-msg">Spinning…</span>
        ) : (
          <span className="slot-msg slot-msg--idle">{live ? "Live now — strike to spin" : "Pull to try a spin"}</span>
        )}
        <button className="slot-lever" onClick={spin} disabled={spinning}>
          <Icon name="ball" size={15} /> {spinning ? "…" : "Pull"}
        </button>
      </div>
    </div>
  );
}

function CasinoBowlingFeature() {
  return (
    <div className="wc-game wc-casino" id="casino-bowling">
      <div className="wc-casino-grid">
        <div className="wc-casino-copy">
          <span className="wc-badge wc-badge--gold">Mon &amp; Thu · 8 PM – close</span>
          <h3 className="display wc-game-title wc-game-title--light">Casino Bowling</h3>
          <p className="wc-casino-lead">Twice a week, every strike turns your lane's screen into a slot machine. Throw a strike, the reels spin, and matching symbols pay <strong>real cash on the spot</strong> — same lanes, same $6.25 a game, a whole lot more on the line after dark.</p>
          <div className="wc-casino-meta">
            <div className="wc-cm-item"><span className="wc-cm-l">Price</span><strong>$6.25 / person / game</strong></div>
            <div className="wc-cm-item"><span className="wc-cm-l">When</span><strong>Mon &amp; Thu, 8 PM – close</strong></div>
          </div>
          <p className="wc-casino-note"><Icon name="spark" size={15} /> Also runs during select Cosmic &amp; Interactive sessions and our New Year's Eve adult party.</p>
          <div className="wc-casino-cta">
            <button className="btn btn-red btn-lg" onClick={function () { Router.go("/bowl"); }}><Icon name="ball" size={18} /> Reserve a lane</button>
            <a className="btn btn-ghost btn-lg" style={{ color: "var(--cream)" }} href={ASB.BIZ.phoneHref}><Icon name="phone" size={17} /> {ASB.BIZ.phone}</a>
          </div>
        </div>
        <div className="wc-casino-machine">
          <CasinoSlot />
        </div>
      </div>
    </div>
  );
}

/* ---- The whole Win Cash section (drops onto the Specials page) ---- */
function WinCashSection() {
  const ref = useReveal();
  function jump(id) {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 84, behavior: "smooth" });
  }
  return (
    <section className="section wincash-sec" id="win-cash" ref={ref}>
      <div className="wrap">
        <div className="wc-head reveal">
          <span className="kicker" style={{ color: "var(--red-600)" }}>Play for cash</span>
          <h2 className="display wc-title">Win real money while you bowl.</h2>
          <p className="wc-lead">All Star Bowl runs <strong>two completely different cash games</strong>. Kegler's Cash is a low-stakes side bet you can play any day of the week. Casino Bowling turns every strike into a slot spin on Monday and Thursday nights. Here's how each one works.</p>
          <div className="wc-jump">
            <button className="wc-chip" onClick={function () { jump("keglers-cash"); }}><Icon name="trophy" size={16} /> Kegler's Cash <em>· all week</em></button>
            <button className="wc-chip wc-chip--gold" onClick={function () { jump("casino-bowling"); }}><Icon name="spark" size={16} /> Casino Bowling <em>· Mon &amp; Thu</em></button>
          </div>
        </div>

        <KeglersCashFeature />
        <CasinoBowlingFeature />

        <p className="wc-disclaimer">Must be of legal age to participate. Kegler's Cash buy-in levels, average brackets and current pot are confirmed at the front desk. Cash games run as posted in-house.</p>
      </div>
    </section>
  );
}

Object.assign(window, { WinCashSection, KeglersCashFeature, CasinoBowlingFeature, CasinoSlot });
