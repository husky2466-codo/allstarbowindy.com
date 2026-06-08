/* ============================================================
   Live status widgets — the "Bowl-o-meter" system
   ============================================================ */

function toneColor(tone) {
  return {
    great: "var(--open)", good: "var(--limited)", tight: "var(--busy)",
    full: "var(--closed)", closed: "var(--blue-400)"
  }[tone] || "var(--open)";
}
function levelColor(level) {
  return {
    open: "var(--open-bright)", limited: "var(--limited)", busy: "var(--busy)",
    full: "var(--closed)", closed: "var(--blue-300)"
  }[level] || "var(--open-bright)";
}

/* ---- Live countdown to close / open ---- */
function LiveCountdown(props) {
  const s = props.status;
  let label, value, sub;
  if (s.isOpen && s.minsToClose != null) {
    label = "Closes in"; value = ASB.fmtCountdown(s.minsToClose); sub = "at " + ASB.fmtClock(s.todayHours.close);
  } else if (!s.isOpen && s.nextOpen) {
    label = "Opens in"; value = ASB.fmtCountdown(s.nextOpen.minsAway);
    sub = (s.nextOpen.day === "Today" ? "today" : s.nextOpen.day) + " at " + ASB.fmtClock(s.nextOpen.at);
  } else { label = "Status"; value = "—"; sub = ""; }
  return (
    <div className="countdown">
      <span className="countdown-label">{label}</span>
      <span className="countdown-val">{value}</span>
      <span className="countdown-sub">{sub}</span>
    </div>
  );
}

/* ---- Circular Bowl-o-meter gauge ---- */
function BowlGauge(props) {
  const s = props.status;
  const size = props.size || 220;
  const stroke = props.stroke || 18;
  const r = (size - stroke) / 2 - 6;
  const cx = size / 2, cy = size / 2;
  const sweep = 270; // degrees
  const startAngle = 135; // start bottom-left
  const pct = s.isOpen ? s.pctOpen : 0;
  const animPct = useCountUp(pct, 1100, [Math.round(pct * 100), s.isOpen]);
  const lanesShown = Math.round(useCountUp(s.lanesOpen, 1100, [s.lanesOpen, s.isOpen]));

  function polar(angleDeg, radius) {
    const a = (angleDeg - 90) * Math.PI / 180;
    return { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) };
  }
  function arc(fromPct, toPct, radius) {
    const a0 = startAngle + sweep * fromPct;
    const a1 = startAngle + sweep * toPct;
    const p0 = polar(a0, radius), p1 = polar(a1, radius);
    const large = (a1 - a0) > 180 ? 1 : 0;
    return "M " + p0.x + " " + p0.y + " A " + radius + " " + radius + " 0 " + large + " 1 " + p1.x + " " + p1.y;
  }
  const col = levelColor(s.level);

  return (
    <div className="gauge" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={"0 0 " + size + " " + size}>
        <path d={arc(0, 1, r)} stroke="rgba(255,255,255,.12)" strokeWidth={stroke} fill="none" strokeLinecap="round" />
        {s.isOpen && (
          <path d={arc(0, Math.max(0.001, animPct), r)} stroke={col} strokeWidth={stroke} fill="none" strokeLinecap="round"
                style={{ filter: "drop-shadow(0 0 8px " + col + "88)", transition: "stroke .5s" }} />
        )}
        {/* ticks */}
        {Array.from({ length: 9 }).map(function (_, i) {
          const pp = i / 8;
          const o = polar(startAngle + sweep * pp, r - stroke / 2 - 4);
          const o2 = polar(startAngle + sweep * pp, r - stroke / 2 - 11);
          return <line key={i} x1={o.x} y1={o.y} x2={o2.x} y2={o2.y} stroke="rgba(255,255,255,.25)" strokeWidth="2" strokeLinecap="round" />;
        })}
      </svg>
      <div className="gauge-center">
        <span className="gauge-num display" style={{ color: s.isOpen ? "var(--cream)" : "var(--blue-300)" }}>{s.isOpen ? lanesShown : "—"}</span>
        <span className="gauge-cap">{s.isOpen ? "lanes open" : "closed"}</span>
        <span className="gauge-of">of {s.total}</span>
      </div>
    </div>
  );
}

/* ---- 32-lane visual meter ---- */
function LaneMeter(props) {
  const s = props.status;
  const total = s.total;
  const open = s.isOpen ? s.lanesOpen : 0;
  const league = s.isOpen ? Math.min(total - open, s.leagueLanes) : 0;
  const busy = total - open - league;
  const cells = [];
  for (let i = 0; i < total; i++) {
    let cls = "busy";
    if (i < open) cls = "open";
    else if (i < open + league) cls = "league";
    cells.push(cls);
  }
  return (
    <div className="lanemeter">
      <div className="lanes-grid">
        {cells.map(function (c, i) {
          return <div key={i} className={"lane-cell " + (s.isOpen ? c : "")} style={{ transitionDelay: (i * 14) + "ms" }} title={"Lane " + (i + 1)}></div>;
        })}
      </div>
      <div className="lanemeter-legend">
        <span><i className="lg open"></i>{open} open</span>
        <span><i className="lg league"></i>{league} league</span>
        <span><i className="lg busy"></i>{busy} in play</span>
      </div>
    </div>
  );
}

/* ---- Verdict card: should I bowl today? ---- */
function VerdictCard(props) {
  const s = props.status;
  const v = { tone: s.isOpen ? (s.level === "open" ? "great" : s.level === "limited" ? "good" : s.level === "busy" ? "tight" : "full") : "closed" };
  const data = props.verdict;
  return (
    <div className={"verdict verdict--" + data.tone}>
      <div className="verdict-emoji">{data.emoji}</div>
      <div className="verdict-body">
        <span className="verdict-q">Should I go bowling?</span>
        <strong className="verdict-head">{data.head}</strong>
        <span className="verdict-sub">{data.sub}</span>
      </div>
    </div>
  );
}

/* ---- League / special live notices ---- */
function LiveNotices(props) {
  const s = props.status;
  const items = [];
  if (s.leaguesNow.length) {
    items.push({ tone: "blue", icon: "trophy", title: "League play in progress", body: s.leaguesNow.map(function (l) { return l.name; }).join(" · ") + " — " + s.leagueLanes + " lanes reserved." });
  }
  if (s.liveSpecial) {
    items.push({ tone: "gold", icon: "spark", title: s.liveSpecial.name + " happening now", body: s.liveSpecial.blurb });
  } else {
    const up = s.specials.filter(function (x) { return x.upcoming; })[0];
    if (up) items.push({ tone: "gold", icon: "spark", title: up.name + " · " + up.tag, body: up.blurb });
  }
  if (s.holiday) {
    items.push({ tone: "red", icon: "info", title: s.holiday.name + " hours", body: s.holiday.note });
  }
  const upL = s.upcomingLeagues[0];
  if (upL && !s.leaguesNow.length) {
    items.push({ tone: "blue", icon: "cal", title: "Heads up: league tonight", body: upL.name + " starts " + ASB.fmtClock(upL.start) + " — " + upL.lanes + " lanes will fill up." });
  }
  if (!items.length) return null;
  return (
    <div className="notices">
      {items.slice(0, props.max || 3).map(function (it, i) {
        return (
          <div key={i} className={"notice notice--" + it.tone}>
            <span className="notice-ic"><Icon name={it.icon} size={18} /></span>
            <div><strong>{it.title}</strong><span>{it.body}</span></div>
          </div>
        );
      })}
    </div>
  );
}

/* ---- Time machine: preview any time/day ---- */
function TimeMachine(props) {
  const s = props.status;
  const [open, setOpen] = useState(false);
  const offset = ClockStore.getOffset();
  const previewing = offset !== 0;
  const now = ClockStore.now();
  const dayIdx = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();

  function setDay(targetDay) {
    const base = ClockStore.now();
    let diff = targetDay - base.getDay();
    const d = new Date(base.getTime() + diff * 86400000);
    ClockStore.setOffset(d.getTime() - Date.now());
  }
  function setTime(m) {
    const base = ClockStore.now();
    const d = new Date(base); d.setHours(Math.floor(m / 60), m % 60, 0, 0);
    ClockStore.setOffset(d.getTime() - Date.now());
  }
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className={"timemachine" + (open ? " open" : "")}>
      <button className="tm-toggle" onClick={function () { setOpen(!open); }}>
        <Icon name="clock" size={16} />
        {previewing ? ("Previewing " + days[dayIdx] + " " + ASB.fmtClockShort(mins)) : "Time machine"}
        <Icon name="chev" size={15} style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform .2s" }} />
      </button>
      {open && (
        <div className="tm-panel">
          <span className="tm-cap">See the live board on any day & time</span>
          <div className="tm-days">
            {days.map(function (d, i) {
              return <button key={d} className={"tm-day" + (i === dayIdx ? " on" : "")} onClick={function () { setDay(i); }}>{d}</button>;
            })}
          </div>
          <input className="tm-slider" type="range" min="0" max="1439" step="15" value={mins}
                 onChange={function (e) { setTime(parseInt(e.target.value, 10)); }} />
          <div className="tm-row">
            <span>{ASB.fmtClock(mins)}</span>
            <button className="tm-reset" onClick={function () { ClockStore.setOffset(0); }}>Reset to now</button>
          </div>
          <div className="tm-quick">
            {[["Sat 9 PM", 6, 21 * 60], ["Wed 1 PM", 3, 13 * 60], ["Mon 8 PM", 1, 20 * 60], ["Sun 8 PM", 0, 20 * 60]].map(function (q) {
              return <button key={q[0]} className="tm-chip" onClick={function () { setDay(q[1]); setTimeout(function () { setTime(q[2]); }, 0); }}>{q[0]}</button>;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, {
  LiveCountdown, BowlGauge, LaneMeter, VerdictCard, LiveNotices, TimeMachine,
  toneColor, levelColor
});
