/* ============================================================
   STRIKE JACKPOT BOARD — a branded recreation of the alley's
   real hand-drawn casino-night board. Marker X's mark in, two
   pots (Red / Blue) climb, and on casino nights it goes live.
   ============================================================ */

/* Base fill pattern — 10 cols x 4 rows. "r"=red X, "b"=blue X, "."=empty */
const JP_BASE = [
  "r", "b", "b", "r", ".", "b", "r", "b", "r", ".",
  "b", "r", "r", "b", "r", ".", "r", "b", ".", "r",
  "r", "b", ".", "r", "b", "r", "b", ".", "r", "b",
  "b", "r", "b", ".", "r", ".", "b", ".", ".", "."
];

/* deterministic hand-drawn tilt per cell */
function jpRot(i) { return ((i * 37) % 17) - 8; }

/* eases the displayed value toward a moving target (rAF — runs in preview) */
function useTween(target, dur) {
  const [v, setV] = useState(0);
  const cur = useRef(0);
  const raf = useRef(0);
  useEffect(function () {
    const from = cur.current;
    const to = target;
    let s = null;
    function step(t) {
      if (s === null) s = t;
      const p = Math.min(1, (t - s) / (dur || 1200));
      const e = 1 - Math.pow(1 - p, 3);
      const val = from + (to - from) * e;
      cur.current = val; setV(val);
      if (p < 1) raf.current = requestAnimationFrame(step);
    }
    raf.current = requestAnimationFrame(step);
    return function () { cancelAnimationFrame(raf.current); };
  }, [target, dur]);
  return v;
}

function jpMoney(v) { return "$" + Math.round(v).toLocaleString(); }

function StrikeJackpotBoard() {
  const s = useStatus();
  const live = !!(s.liveSpecial && s.liveSpecial.name === "Casino Bowling");

  // Pot totals come from the swappable data layer (window.ASB_DATA.jackpot);
  // demo values until the owner supplies real figures. See docs/DATA-CONTRACT.md.
  const JP = (window.ASB_DATA && window.ASB_DATA.getJackpot && window.ASB_DATA.getJackpot()) || { red: 310, blue: 6916 };
  const cellsRef = useRef(JP_BASE.slice());
  const [cells, setCells] = useState(JP_BASE);
  const [flash, setFlash] = useState(-1);
  const [redT, setRedT] = useState(JP.red);
  const [blueT, setBlueT] = useState(JP.blue);
  const redV = useTween(redT, 1500);
  const blueV = useTween(blueT, 1800);

  /* On casino night, periodically mark a fresh strike + grow the pot */
  useEffect(function () {
    if (!live) return undefined;
    const id = setInterval(function () {
      const prev = cellsRef.current;
      const empties = [];
      prev.forEach(function (c, i) { if (c === ".") empties.push(i); });
      if (!empties.length) return;
      const pick = empties[Math.floor(Math.random() * empties.length)];
      const col = Math.random() < 0.5 ? "r" : "b";
      const next = prev.slice(); next[pick] = col;
      cellsRef.current = next; setCells(next);
      setFlash(pick);
      const bump = 5 + Math.floor(Math.random() * 7);
      if (col === "r") setRedT(function (x) { return x + bump; });
      else setBlueT(function (x) { return x + bump; });
      setTimeout(function () { setFlash(-1); }, 850);
    }, 5200);
    return function () { clearInterval(id); };
  }, [live]);

  return (
    <div className={"jp-board" + (live ? " is-live" : "")}>
      <span className="jp-screw jp-screw--tl"></span>
      <span className="jp-screw jp-screw--tr"></span>
      <span className="jp-screw jp-screw--bl"></span>
      <span className="jp-screw jp-screw--br"></span>

      <div className="jp-banner">
        <span className="jp-bx">X</span>
        <span className="jp-title">
          Strike Jackpot
          <svg className="jp-swoosh" viewBox="0 0 240 22" preserveAspectRatio="none" aria-hidden="true">
            <path d="M4 15 Q 60 2 120 9 T 236 7" />
          </svg>
        </span>
        <span className="jp-bx">X</span>
      </div>

      <div className="jp-grid">
        {cells.map(function (c, i) {
          const filled = c !== ".";
          return (
            <div key={i} className={"jp-cell" + (filled ? " is-filled" : "") + (i === flash ? " is-flash" : "")}>
              {filled ? (
                <span className={"jp-mark jp-mark--" + c} style={{ transform: "rotate(" + jpRot(i) + "deg)" }}>X</span>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="jp-total">
        <span className="jp-total-label">Jackpot Total</span>
        <div className="jp-pots">
          <span className="jp-pot jp-pot--red"><em>Red</em><strong>{jpMoney(redV)}</strong></span>
          <span className="jp-pot jp-pot--blue"><em>Blue</em><strong>{jpMoney(blueV)}</strong></span>
        </div>
      </div>

      <div className={"jp-status" + (live ? " is-live" : "")}>
        {live ? (
          <span><span className="jp-livedot"></span> Live now — marking strikes</span>
        ) : (
          <span>As of last casino night · Mon &amp; Thu 8 PM it goes live</span>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { StrikeJackpotBoard });
