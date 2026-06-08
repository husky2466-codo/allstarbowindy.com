/* ============================================================
   BOWL PAGE — live status detail, hours, rates, booking flow
   ============================================================ */

/* ---------- Page hero: full live board ---------- */
function BowlHero() {
  const s = useStatus();
  const ref = useReveal();
  return (
    <section className="bowlhero bowlhero--photo field-navy" ref={ref}>
      <div className="bowlhero-photo" aria-hidden="true"></div>
      <div className="halftone bowlhero-tex"></div>
      <div className="wrap">
        <div className="page-head reveal">
          <span className="kicker" style={{ color: "var(--blue-300)" }}>Live lane status</span>
          <h1 className="display page-title">The board, right now.</h1>
          <p className="page-lead">A real-time read on lanes, waits, leagues and specials — pulled straight from today's schedule and the clock. Reserve in a few taps.</p>
        </div>

        <div className="statuspanel reveal reveal-d1">
          <div className="statuspanel-left">
            <div className="sp-head">
              <div className="live-pill">
                <span className={"dot " + (s.isOpen ? (s.level === "open" ? "s-open" : s.level === "limited" ? "s-limited" : "s-busy") : "s-closed")} style={{ background: "currentColor" }}></span>
                {s.isOpen ? "Open now · " + s.levelLabel : "Closed"}
              </div>
              <TimeMachine status={s} />
            </div>
            <div className="sp-gauge-row">
              <BowlGauge status={s} size={240} stroke={19} />
              <div className="sp-readouts">
                <LiveCountdown status={s} />
                <div className="sp-readout">
                  <span className="sp-readout-label">Walk-in wait</span>
                  <span className="sp-readout-val">{s.isOpen ? (s.wait > 0 ? "~" + s.wait + " min" : "None") : "—"}</span>
                </div>
                <div className="sp-readout">
                  <span className="sp-readout-label">Lanes in play</span>
                  <span className="sp-readout-val">{s.isOpen ? s.lanesInUse + " / " + s.total : "—"}</span>
                </div>
              </div>
            </div>
            <div className="sp-lanes">
              <LaneMeter status={s} />
            </div>
          </div>
          <div className="statuspanel-right">
            <VerdictCard status={s} verdict={getVerdict(s)} />
            <LiveNotices status={s} max={4} />
            <button className="btn btn-red btn-lg" style={{ justifyContent: "center", width: "100%" }} onClick={function () { const el = document.getElementById("book"); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" }); }}>
              <Icon name="ball" size={19} /> Reserve a lane now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Hours table ---------- */
function HoursTable() {
  const ref = useReveal();
  const today = ClockStore.now().getDay();
  const s = useStatus();
  return (
    <section className="section" ref={ref}>
      <div className="wrap hours-grid">
        <div className="reveal">
          <SectionHead kicker="Hours of operation" title="When we're rolling." />
          <table className="hours-table">
            <tbody>
              {ASB.HOURS.map(function (h, i) {
                const isToday = i === today;
                return (
                  <tr key={i} className={isToday ? "today" : ""}>
                    <td className="ht-day">{h.day}{isToday && <span className="ht-now">{s.isOpen ? "Open now" : "Today"}</span>}</td>
                    <td className="ht-time">{ASB.fmtClock(h.open)} <span className="ht-dash">–</span> {ASB.fmtClock(h.close)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="hours-note"><Icon name="info" size={15} /> Holiday hours may vary — the live board above always shows today's real status.</p>
        </div>
        <div className="reveal reveal-d2 hours-side">
          <div className="proshop-card">
            <img className="proshop-photo" src="img/proshop.png" alt="Wall of bowling balls and bags in the All Star Bowl pro shop" loading="lazy" />
            <span className="kicker" style={{ color: "var(--red-600)" }}>Pro Shop</span>
            <h3 className="display" style={{ fontSize: "1.7rem", color: "var(--navy-800)", margin: "8px 0 14px" }}>Drilled & dialed in.</h3>
            <p className="muted" style={{ marginBottom: 16 }}>Balls, bags, shoes and accessories with professional drilling on site.</p>
            <ul className="proshop-hours">
              {[["Mon", "4–8"], ["Tue", "11–8"], ["Wed", "4–9"], ["Thu", "12–7"], ["Fri", "5–8"], ["Sat", "9:30–2"], ["Sun", "Closed"]].map(function (r) {
                return <li key={r[0]}><span>{r[0]}</span><span>{r[1]}</span></li>;
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Rates ---------- */
function RatesSection() {
  const ref = useReveal();
  return (
    <section className="section rates-sec field-navy" ref={ref}>
      <div className="halftone bowlhero-tex"></div>
      <div className="wrap">
        <SectionHead light center kicker="Open bowling rates" title="Pay by the game or the lane." sub="Lane rate covers up to 5 bowlers. Shoe rental $4.00 / pair. Bowlers' Appreciation Club members pay less at every tier." />
        <div className="rates-cols reveal">
          <div className="rate-col">
            <h4 className="rate-col-h">Per game</h4>
            {ASB.RATES.perGame.map(function (r, i) {
              return (
                <div key={i} className="rate-row">
                  <span className="rate-label">{r.label}</span>
                  <span className="rate-price">{r.price}<small>{r.per}</small></span>
                </div>
              );
            })}
          </div>
          <div className="rate-col">
            <h4 className="rate-col-h">Per lane</h4>
            {ASB.RATES.perLane.map(function (r, i) {
              return (
                <div key={i} className="rate-row">
                  <span className="rate-label">{r.label}</span>
                  <span className="rate-price">{r.price}<small>{r.per}</small></span>
                </div>
              );
            })}
            <div className="rate-row rate-shoes">
              <span className="rate-label"><Icon name="shoe" size={17} /> Shoe rental</span>
              <span className="rate-price">{ASB.RATES.shoes}<small>/ pair</small></span>
            </div>
          </div>
        </div>
        <div className="rates-cta reveal reveal-d2">
          <button className="btn btn-cream btn-lg" onClick={function () { Router.go("/account"); }}><Icon name="star" size={18} fillStar /> Save more with rewards</button>
        </div>
      </div>
    </section>
  );
}

/* ---------- Booking flow ---------- */
function BookingFlow() {
  const ref = useReveal();
  const s = useStatus();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ date: null, slot: null, lanes: 1, party: 4, name: "", phone: "", shoes: true });
  const steps = ["Date", "Time", "Lanes", "Confirm"];

  // build next 14 days
  const days = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(ClockStore.now()); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + i);
    const hf = ASB.hoursFor(d);
    days.push({ date: d, closed: hf.open == null, hf: hf, i: i });
  }

  function slotsFor(date) {
    if (!date) return [];
    const hf = ASB.hoursFor(date);
    if (hf.open == null) return [];
    const out = [];
    for (let m = Math.ceil(hf.open / 60) * 60; m <= hf.close - 60; m += 60) {
      // estimate availability by reusing engine occupancy
      const probe = new Date(date); probe.setHours(Math.floor(m / 60), m % 60, 0, 0);
      const st = ASB.getStatus(probe);
      out.push({ m: m, label: ASB.fmtClock(m), level: st.level, lanesOpen: st.lanesOpen });
    }
    return out;
  }
  const slots = slotsFor(data.date);

  function next() { setStep(Math.min(steps.length - 1, step + 1)); }
  function back() { setStep(Math.max(0, step - 1)); }
  const canNext = (step === 0 && !!data.date) || (step === 1 && data.slot != null) || (step === 2) || step === 3;

  const pricePer = data.slot && data.slot.m >= 17 * 60 ? 45 : 35;
  const estPrice = pricePer * data.lanes + (data.shoes ? 4 * data.party : 0);

  return (
    <section className="section booking-sec" id="book" ref={ref}>
      <div className="wrap">
        <SectionHead center kicker="Reserve online · no more 'please call'" title="Book a lane in four taps." sub="Pick a day and time, choose your lanes, and we'll have them ready. Pay at the desk." />

        <div className="booking reveal reveal-d1">
          <div className="booking-steps">
            {steps.map(function (st, i) {
              return (
                <div key={i} className={"bk-step" + (i === step ? " on" : "") + (i < step ? " done" : "")}>
                  <span className="bk-step-num">{i < step ? <Icon name="check" size={15} /> : (i + 1)}</span>
                  <span className="bk-step-label">{st}</span>
                </div>
              );
            })}
          </div>

          <div className="booking-body">
            {step === 0 && (
              <div className="bk-pane">
                <h4 className="bk-h">Choose a day</h4>
                <div className="bk-days">
                  {days.map(function (d) {
                    const wd = d.date.toLocaleDateString(undefined, { weekday: "short" });
                    const dn = d.date.getDate();
                    const sel = data.date && data.date.getTime() === d.date.getTime();
                    return (
                      <button key={d.i} disabled={d.closed} className={"bk-day" + (sel ? " sel" : "") + (d.closed ? " closed" : "")}
                        onClick={function () { setData(Object.assign({}, data, { date: d.date, slot: null })); }}>
                        <span className="bk-day-wd">{d.i === 0 ? "Today" : d.i === 1 ? "Tmrw" : wd}</span>
                        <span className="bk-day-dn">{dn}</span>
                        <span className="bk-day-hint">{d.closed ? "Closed" : ASB.fmtClockShort(d.hf.open)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="bk-pane">
                <h4 className="bk-h">Pick a start time · {data.date && data.date.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}</h4>
                <div className="bk-slots">
                  {slots.map(function (sl, i) {
                    const sel = data.slot && data.slot.m === sl.m;
                    return (
                      <button key={i} className={"bk-slot lvl-" + sl.level + (sel ? " sel" : "")} onClick={function () { setData(Object.assign({}, data, { slot: sl })); }}>
                        <span className="bk-slot-time">{sl.label}</span>
                        <span className="bk-slot-av">{sl.level === "full" ? "Waitlist" : sl.lanesOpen + " open"}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="bk-legend">
                  <span><i className="bk-dot lvl-open"></i> Plenty</span>
                  <span><i className="bk-dot lvl-limited"></i> Limited</span>
                  <span><i className="bk-dot lvl-busy"></i> Busy</span>
                  <span><i className="bk-dot lvl-full"></i> Waitlist</span>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bk-pane">
                <h4 className="bk-h">How many lanes &amp; bowlers?</h4>
                <div className="bk-steppers">
                  <Stepper label="Lanes" sub="Up to 5 bowlers each" value={data.lanes} min={1} max={8} onChange={function (v) { setData(Object.assign({}, data, { lanes: v, party: Math.max(data.party, v) })); }} icon="ball" />
                  <Stepper label="Bowlers" sub="Total in your group" value={data.party} min={1} max={40} onChange={function (v) { setData(Object.assign({}, data, { party: v })); }} icon="users" />
                </div>
                <label className="bk-shoes">
                  <input type="checkbox" checked={data.shoes} onChange={function (e) { setData(Object.assign({}, data, { shoes: e.target.checked })); }} />
                  <span><Icon name="shoe" size={18} /> Add shoe rental for the group <small>+$4.00 / bowler</small></span>
                </label>
              </div>
            )}

            {step === 3 && (
              <div className="bk-pane bk-confirm">
                <div className="bk-summary">
                  <h4 className="bk-h">Your reservation</h4>
                  <dl className="bk-dl">
                    <div><dt>When</dt><dd>{data.date && data.date.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })} · {data.slot ? data.slot.label : "—"}</dd></div>
                    <div><dt>Lanes</dt><dd>{data.lanes} lane{data.lanes > 1 ? "s" : ""}</dd></div>
                    <div><dt>Bowlers</dt><dd>{data.party}</dd></div>
                    <div><dt>Shoes</dt><dd>{data.shoes ? data.party + " pair" : "None"}</dd></div>
                    <div className="bk-dl-total"><dt>Est. total</dt><dd>${estPrice.toFixed(2)}</dd></div>
                  </dl>
                  <p className="bk-fineprint">Estimate based on {data.slot && data.slot.m >= 17 * 60 ? "after-5 PM" : "before-5 PM"} lane rates. Pay at the front desk. We'll hold your lanes for 15 minutes past your start time.</p>
                </div>
                <div className="bk-form">
                  <label className="bk-field"><span>Name on reservation</span><input type="text" value={data.name} placeholder="First & last name" onChange={function (e) { setData(Object.assign({}, data, { name: e.target.value })); }} /></label>
                  <label className="bk-field"><span>Mobile number</span><input type="tel" value={data.phone} placeholder="(317) 555-0142" onChange={function (e) { setData(Object.assign({}, data, { phone: e.target.value })); }} /></label>
                  <BookButton data={data} estPrice={estPrice} />
                </div>
              </div>
            )}
          </div>

          {step < 3 && (
            <div className="booking-foot">
              <button className="btn btn-ghost" style={{ color: "var(--navy-800)", visibility: step === 0 ? "hidden" : "visible" }} onClick={back}>Back</button>
              <span className="booking-hint">{step === 0 ? (data.date ? "" : "Select a day to continue") : step === 1 ? (data.slot ? "" : "Pick a start time") : ""}</span>
              <button className="btn btn-red" disabled={!canNext} onClick={next}>Continue <Icon name="arrow" size={17} /></button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Stepper(props) {
  return (
    <div className="stepper">
      <div className="stepper-info">
        <span className="stepper-ic"><Icon name={props.icon} size={18} /></span>
        <span><strong>{props.label}</strong><small>{props.sub}</small></span>
      </div>
      <div className="stepper-ctrl">
        <button onClick={function () { props.onChange(Math.max(props.min, props.value - 1)); }} disabled={props.value <= props.min}><Icon name="minus" size={18} /></button>
        <span className="stepper-val">{props.value}</span>
        <button onClick={function () { props.onChange(Math.min(props.max, props.value + 1)); }} disabled={props.value >= props.max}><Icon name="plus" size={18} /></button>
      </div>
    </div>
  );
}

function BookButton(props) {
  const [done, setDone] = useState(false);
  const ok = props.data.name.trim().length > 1;
  if (done) {
    return (
      <div className="bk-success">
        <span className="bk-success-ic"><Icon name="check" size={26} /></span>
        <strong>You're booked, {props.data.name.split(" ")[0]}!</strong>
        <span>We texted a confirmation. See you on the lanes.</span>
      </div>
    );
  }
  return (
    <button className="btn btn-red btn-lg" style={{ justifyContent: "center", width: "100%", marginTop: 4 }} disabled={!ok} onClick={function () { setDone(true); }}>
      <Icon name="check" size={19} /> Confirm reservation
    </button>
  );
}

function BowlPage() {
  return (
    <main>
      <BowlHero />
      <BookingFlow />
      <HoursTable />
      <RatesSection />
    </main>
  );
}

Object.assign(window, { BowlPage });
