/* ============================================================
   SPECIALS PAGE — recurring promos, casino nights, seasonal
   events & BAC savings. All pulled from ASB data.
   ============================================================ */

/* icon + accent per recurring special (keyed by name) */
const SPECIAL_META = {
  "Casino Bowling": { icon: "spark", color: "var(--gold)" },
  "Senior Day": { icon: "users", color: "var(--blue-600)" },
  "Saturday Youth League": { icon: "trophy", color: "var(--red-500)" }
};
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function SpecialsHero() {
  const s = useStatus();
  const ref = useReveal();
  const live = s.liveSpecial;
  return (
    <section className="bowlhero field-navy" ref={ref}>
      <div className="halftone bowlhero-tex"></div>
      <div className="wrap">
        <div className="page-head reveal">
          <span className="kicker" style={{ color: "var(--blue-300)" }}>Deals &amp; promotions</span>
          <h1 className="display page-title">Always something rolling.</h1>
          <p className="page-lead">Casino nights, senior days, youth mornings and seasonal blowouts — plus members pay less every single game. Here's everything on the board.</p>
          {live ? (
            <div className="spec-live-pill reveal reveal-d1">
              <span className="dot s-open" style={{ background: "currentColor" }}></span>
              <strong>{live.name}</strong> is live right now
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/* Recurring weekly specials grid (from ASB.SPECIALS) */
function WeeklySpecials() {
  const ref = useReveal();
  const s = useStatus();
  const liveNames = (s.specials || []).filter(function (x) { return x.live; }).map(function (x) { return x.name; });
  return (
    <section className="section" ref={ref}>
      <div className="wrap">
        <SectionHead kicker="Every week" title="The weekly lineup." sub="Recurring deals you can count on. Times shown are when each special runs." />
        <div className="spec-grid">
          {ASB.SPECIALS.map(function (sp, i) {
            const meta = SPECIAL_META[sp.name] || { icon: "ticket", color: "var(--blue-600)" };
            const days = sp.days.map(function (d) { return DOW[d]; }).join(" & ");
            const isLive = liveNames.indexOf(sp.name) >= 0;
            return (
              <div key={i} className={"spec-card reveal reveal-d" + ((i % 3) + 1)}>
                <div className="spec-card-top">
                  <span className="spec-ic" style={{ background: meta.color }}><Icon name={meta.icon} size={22} /></span>
                  {isLive ? <span className="spec-now"><span className="dot s-open" style={{ background: "currentColor" }}></span> On now</span> : <span className="spec-day">{sp.tag}</span>}
                </div>
                <h3 className="spec-name display">{sp.name}</h3>
                <p className="spec-blurb">{sp.blurb}</p>
                <div className="spec-foot">
                  <span className="spec-when"><Icon name="clock" size={15} /> {days} · {ASB.fmtClockShort(sp.start)}–{ASB.fmtClockShort(sp.end)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* Seasonal / holiday events derived from ASB.HOLIDAYS */
function SeasonalEvents() {
  const ref = useReveal();
  const events = Object.keys(ASB.HOLIDAYS)
    .map(function (k) { return Object.assign({ key: k }, ASB.HOLIDAYS[k]); })
    .filter(function (h) { return !h.closed; });
  return (
    <section className="section seasonal-sec field-navy" ref={ref}>
      <div className="halftone bowlhero-tex"></div>
      <div className="wrap">
        <SectionHead light center kicker="Mark your calendar" title="Seasonal events & holiday hours." sub="Our biggest nights of the year — and the dates our hours shift. The live board always shows the real status for today." />
        <div className="season-grid reveal">
          {events.map(function (h, i) {
            const isParty = /strike|cosmic|midnight|spangled/i.test(h.note || "");
            return (
              <div key={h.key} className="season-card">
                <span className="season-ic"><Icon name={isParty ? "spark" : "star"} size={20} fillStar /></span>
                <strong className="season-name">{h.name}</strong>
                <span className="season-note">{h.note}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* BAC savings band → rewards */
function BacBand() {
  const ref = useReveal();
  return (
    <section className="section section--tight" ref={ref}>
      <div className="wrap">
        <div className="bac-band reveal">
          <div className="bac-band-copy">
            <span className="kicker" style={{ color: "var(--red-600)" }}>The ongoing deal</span>
            <h2 className="display bac-band-title">Members pay less every game.</h2>
            <p>The Bowlers' Appreciation Club is free to join. The more you bowl, the lower your rate drops — from $6.25 down to $4.00 a game at Diamond, plus members-only specials and military discounts.</p>
            <button className="btn btn-blue btn-lg" onClick={function () { Router.go("/account"); }}><Icon name="star" size={18} fillStar /> Join the club — it's free</button>
          </div>
          <div className="bac-band-tiers">
            {ASB.BAC_TIERS.map(function (t) {
              return (
                <div key={t.key} className="bac-tier-row">
                  <span className="bac-tier-name">{t.name}</span>
                  <span className="bac-tier-rate">${t.night.toFixed(2)}<small>/ night game</small></span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function SpecialsPage() {
  return (
    <main>
      <SpecialsHero />
      <WinCashSection />
      <WeeklySpecials />
      <SeasonalEvents />
      <BacBand />
    </main>
  );
}

Object.assign(window, { SpecialsPage });
