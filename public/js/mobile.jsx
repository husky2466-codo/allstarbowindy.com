/* ============================================================
   MOBILE COMPANION — glanceable live status in a phone frame
   ============================================================ */

function MobilePhoneScreen() {
  const s = useStatus();
  const v = getVerdict(s);
  const open = s.isOpen ? s.lanesOpen : 0;
  const league = s.isOpen ? Math.min(s.total - open, s.leagueLanes) : 0;
  const cells = [];
  for (let i = 0; i < s.total; i++) {
    cells.push(i < open ? "open" : i < open + league ? "league" : "busy");
  }
  const verdictBg = { great: "#1f9d55", good: "#e8a317", tight: "#f08522", full: "#d23b3b", closed: "#2a5bd0" }[v.tone];

  return (
    <div style={{
      minHeight: "100%", paddingTop: 58,
      background: "linear-gradient(180deg, #0e1a3a, #0a1430)",
      color: "#f5f1e6", fontFamily: "var(--f-body)",
      display: "flex", flexDirection: "column"
    }}>
      {/* app header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 22px 14px" }}>
        <img src="img/logo.png" alt="" style={{ width: 34, height: 34, objectFit: "contain" }} />
        <div style={{ lineHeight: 1 }}>
          <div style={{ fontFamily: "var(--f-display)", fontSize: 17, textTransform: "uppercase", letterSpacing: ".02em" }}>All Star Bowl</div>
          <div style={{ fontSize: 11, color: "rgba(245,241,230,.5)", fontWeight: 600 }}>East Indianapolis</div>
        </div>
        <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontFamily: "var(--f-head)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: s.isOpen ? "#28c46a" : "#d23b3b" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "currentColor" }}></span>
          {s.isOpen ? "Live" : "Closed"}
        </span>
      </div>

      {/* hero status */}
      <div style={{ padding: "0 22px" }}>
        <div style={{
          background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)",
          borderRadius: 22, padding: 20
        }}>
          <div style={{ fontFamily: "var(--f-head)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", fontSize: 12, color: s.isOpen ? "#28c46a" : "#d23b3b" }}>
            {s.isOpen ? s.levelLabel : "Closed now"}
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginTop: 6 }}>
            <span style={{ fontFamily: "var(--f-display)", fontSize: 64, lineHeight: .85 }}>{s.isOpen ? open : "—"}</span>
            <span style={{ paddingBottom: 8 }}>
              <span style={{ display: "block", fontFamily: "var(--f-head)", fontWeight: 700, textTransform: "uppercase", fontSize: 13, letterSpacing: ".06em" }}>lanes open</span>
              <span style={{ fontSize: 12, color: "rgba(245,241,230,.55)" }}>of {s.total}</span>
            </span>
          </div>
          <div style={{ fontSize: 13, color: "rgba(245,241,230,.7)", marginTop: 6, fontWeight: 600 }}>
            {s.isOpen
              ? ("Closes " + ASB.fmtClock(s.todayHours.close) + " · " + ASB.fmtCountdown(s.minsToClose) + " left")
              : (s.nextOpen ? ("Opens " + (s.nextOpen.day === "Today" ? "today" : s.nextOpen.day) + " " + ASB.fmtClock(s.nextOpen.at)) : "See hours")}
          </div>
          {/* mini lane meter */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(16, 1fr)", gap: 3, marginTop: 14 }}>
            {cells.map(function (c, i) {
              const bg = c === "open" ? "linear-gradient(180deg,#28c46a,#1f9d55)" : c === "league" ? "repeating-linear-gradient(45deg,#2a5bd0,#2a5bd0 3px,#1b3a8f 3px,#1b3a8f 6px)" : "#2c3658";
              return <span key={i} style={{ aspectRatio: "1/2.4", borderRadius: 2, background: s.isOpen ? bg : "rgba(255,255,255,.1)" }}></span>;
            })}
          </div>
        </div>
      </div>

      {/* verdict */}
      <div style={{ padding: "14px 22px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", borderRadius: 16, padding: "14px 16px", borderLeft: "5px solid " + verdictBg }}>
          <span style={{ fontSize: 26 }}>{v.emoji}</span>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontFamily: "var(--f-display)", fontSize: 16, textTransform: "uppercase", color: "#0e1a3a" }}>{v.head}</div>
            <div style={{ fontSize: 12, color: "#5b6478" }}>{v.sub}</div>
          </div>
        </div>
      </div>

      {/* today's special */}
      {(s.liveSpecial || s.specials[0]) && (
        <div style={{ padding: "12px 22px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(245,180,35,.14)", border: "1px solid rgba(245,180,35,.3)", borderRadius: 14, padding: "11px 14px" }}>
            <span style={{ fontSize: 18 }}>🎰</span>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "#f5f1e6" }}>
              <strong style={{ color: "#f5b423" }}>{(s.liveSpecial || s.specials[0]).name}</strong> · {(s.liveSpecial || s.specials[0]).tag}
            </div>
          </div>
        </div>
      )}

      {/* reserve button */}
      <div style={{ padding: "16px 22px 10px" }}>
        <div style={{ background: "#e0241f", color: "#fff", borderRadius: 999, padding: "15px", textAlign: "center", fontFamily: "var(--f-head)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", fontSize: 15, boxShadow: "0 10px 24px -8px rgba(224,36,31,.7)" }}>
            Reserve a Lane
        </div>
      </div>

      {/* quick links */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, padding: "4px 22px 24px" }}>
        {[["Hours", "clock"], ["Menu", "pizza"], ["Rewards", "star"]].map(function (q) {
          return (
            <div key={q[0]} style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 14, padding: "12px 8px", textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", color: "#6f9bf0", marginBottom: 5 }}><Icon name={q[1]} size={20} fillStar={q[1] === "star"} /></div>
              <div style={{ fontFamily: "var(--f-head)", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: ".04em" }}>{q[0]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MobileCompanion() {
  const ref = useReveal();
  return (
    <section className="section mobile-sec field-navy" ref={ref}>
      <div className="halftone bowlhero-tex"></div>
      <div className="wrap mobile-grid">
        <div className="reveal mobile-copy">
          <span className="coming-soon-badge" style={{display:'inline-flex',alignItems:'center',gap:'6px',padding:'5px 12px',marginBottom:'14px',borderRadius:'999px',background:'rgba(255,184,0,.16)',border:'1px solid rgba(255,184,0,.55)',color:'#ffb800',fontFamily:'"Saira Condensed",sans-serif',fontWeight:700,fontSize:'13px',letterSpacing:'.08em',textTransform:'uppercase'}}>
            <Icon name="info" size={14} /> Coming Soon — app in development
          </span>
          <SectionHead light kicker="Check it on your phone" title="Know before you leave the house." sub="The same live board is coming to your pocket. Soon you'll glance at open lanes, tonight's wait and the day's specials — then reserve in a couple of taps before you head over." />
          <ul className="mobile-list">
            <li><Icon name="check" size={18} /> Real-time open-lane count & wait</li>
            <li><Icon name="check" size={18} /> Today's specials and league takeovers</li>
            <li><Icon name="check" size={18} /> One-tap reserve & rewards balance</li>
          </ul>
          <div className="mobile-tip"><Icon name="info" size={16} /> Add to your home screen for a one-tap "should I go bowling?" check.</div>
        </div>
        <div className="reveal reveal-d2 mobile-phone">
          <IOSDevice dark width={372} height={760}>
            <MobilePhoneScreen />
          </IOSDevice>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { MobileCompanion, MobilePhoneScreen });
