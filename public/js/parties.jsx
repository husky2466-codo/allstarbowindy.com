/* ============================================================
   PARTIES PAGE — package, estimator, request form
   ============================================================ */

function PartiesHero() {
  const ref = useReveal();
  return (
    <section className="partieshero" ref={ref}>
      <div className="partieshero-bg" style={{ backgroundImage: "linear-gradient(120deg, rgba(10,20,48,.92) 0%, rgba(10,20,48,.7) 42%, rgba(10,20,48,.32) 100%), url(img/birthday-hero-banner.png)" }}></div>
      <div className="wrap partieshero-in reveal">
        <span className="tag tag-gold">From $17 / bowler</span>
        <h1 className="display partieshero-title">Throw a party<br />that bowls.</h1>
        <p className="page-lead" style={{ color: "rgba(245,241,230,.9)" }}>Birthdays, team nights, fundraisers — we handle the lanes, shoes, pizza and drinks. You just show up and celebrate.</p>
        <div className="hero-cta" style={{ marginTop: 26 }}>
          <button className="btn btn-red btn-lg" onClick={function () { const el = document.getElementById("party-request"); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" }); }}><Icon name="cake" size={19} /> Request a party</button>
          <a className="btn btn-ghost btn-lg" href={ASB.BIZ.phoneHref}><Icon name="phone" size={18} /> {ASB.BIZ.phone}</a>
        </div>
      </div>
    </section>
  );
}

function PartyPackage() {
  const ref = useReveal();
  const includes = [
    { icon: "clock", t: "1.5 hours of bowling", s: "Lanes reserved just for your group" },
    { icon: "shoe", t: "Shoes & house balls", s: "For every bowler in your party" },
    { icon: "pizza", t: "1 large 1-topping pizza", s: "Per 5 bowlers — fresh from the Cafe" },
    { icon: "beer", t: "1 drink per bowler", s: "Fountain drink included" },
    { icon: "ball", t: "Bumpers on request", s: "Gutter-free fun for the little ones" },
    { icon: "star", t: "Birthday pins", s: "Ask and we'll set up a special pin" }
  ];
  return (
    <section className="section" ref={ref}>
      <div className="wrap party-pkg-grid">
        <div className="reveal">
          <SectionHead kicker="The party package" title="Everything's included." sub="One simple package, priced per bowler. Add extra pizzas for $9 each. Bring a cake or cupcakes — we'll handle the rest." />
          <div className="party-extra">
            <div className="party-extra-item"><Icon name="info" size={16} /> 48-hour minimum notice</div>
            <div className="party-extra-item"><Icon name="ticket" size={16} /> $25 non-refundable deposit</div>
            <div className="party-extra-item"><Icon name="cake" size={16} /> Cake & cupcakes welcome (no outside drinks)</div>
          </div>
        </div>
        <div className="reveal reveal-d2 party-includes">
          {includes.map(function (it, i) {
            return (
              <div key={i} className="party-inc">
                <span className="party-inc-ic"><Icon name={it.icon} size={20} /></span>
                <div><strong>{it.t}</strong><span>{it.s}</span></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PartyEstimator() {
  const ref = useReveal();
  const [bowlers, setBowlers] = useState(10);
  const [extraPizza, setExtraPizza] = useState(0);
  const base = 17;
  const total = bowlers * base + extraPizza * 9;
  const pizzasIncluded = Math.ceil(bowlers / 5);
  return (
    <section className="section party-est-sec field-navy" ref={ref}>
      <div className="halftone bowlhero-tex"></div>
      <div className="wrap party-est reveal">
        <div className="party-est-copy">
          <SectionHead light kicker="Quick estimate" title="Build your party." sub="Slide to your group size and see the price instantly. Final details confirmed when you book." />
        </div>
        <div className="party-est-panel">
          <div className="pe-row">
            <div className="pe-label"><span>Bowlers</span><strong>{bowlers}</strong></div>
            <input className="pe-slider" type="range" min="4" max="40" value={bowlers} onChange={function (e) { setBowlers(parseInt(e.target.value, 10)); }} />
            <span className="pe-hint">{pizzasIncluded} large pizza{pizzasIncluded > 1 ? "s" : ""} included</span>
          </div>
          <div className="pe-row">
            <div className="pe-label"><span>Extra pizzas</span><strong>{extraPizza}</strong></div>
            <div className="pe-stepper">
              <button onClick={function () { setExtraPizza(Math.max(0, extraPizza - 1)); }}><Icon name="minus" size={18} /></button>
              <span>{extraPizza}</span>
              <button onClick={function () { setExtraPizza(Math.min(20, extraPizza + 1)); }}><Icon name="plus" size={18} /></button>
              <small>$9 each</small>
            </div>
          </div>
          <div className="pe-total">
            <div>
              <span className="pe-total-label">Estimated total</span>
              <span className="pe-total-sub">${base} / bowler · {bowlers} bowlers{extraPizza ? " · " + extraPizza + " extra pizza" + (extraPizza > 1 ? "s" : "") : ""}</span>
            </div>
            <span className="pe-total-v display">${total}</span>
          </div>
          <button className="btn btn-red btn-lg" style={{ justifyContent: "center", width: "100%" }} onClick={function () { const el = document.getElementById("party-request"); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" }); }}>
            <Icon name="cake" size={19} /> Request this party
          </button>
        </div>
      </div>
    </section>
  );
}

function PartyRequest() {
  const ref = useReveal();
  const [done, setDone] = useState(false);
  const [f, setF] = useState({ name: "", phone: "", date: "", time: "", bowlers: "10", notes: "" });
  function upd(k, v) { setF(Object.assign({}, f, { [k]: v })); }
  return (
    <section className="section party-req-sec" id="party-request" ref={ref}>
      <div className="wrap party-req-grid">
        <div className="reveal">
          <SectionHead kicker="Reserve your date" title="Request a party." sub="Send us your details and pay the $25 deposit online to lock it in. We'll confirm within a day." />
          <div className="party-req-deposit">
            <span className="prd-ic"><Icon name="ticket" size={22} /></span>
            <div>
              <strong>$25 deposit secures your date</strong>
              <span>Applied to your final total · non-refundable · pay securely online after you submit.</span>
            </div>
          </div>
        </div>
        <div className="reveal reveal-d2">
          <div className="party-req-form card">
            {done ? (
              <div className="bk-success">
                <span className="bk-success-ic"><Icon name="check" size={26} /></span>
                <strong>Party request sent!</strong>
                <span>Next: we'll text a secure link to pay your $25 deposit and confirm the date.</span>
                <button className="btn btn-blue btn-sm" style={{ marginTop: 12 }} onClick={function () { setDone(false); }}>Submit another</button>
              </div>
            ) : (
              <React.Fragment>
                <h4 className="bk-h">Party details</h4>
                <div className="prf-row">
                  <label className="bk-field"><span>Your name</span><input type="text" value={f.name} placeholder="First & last" onChange={function (e) { upd("name", e.target.value); }} /></label>
                  <label className="bk-field"><span>Phone</span><input type="tel" value={f.phone} placeholder="(317) 555-0142" onChange={function (e) { upd("phone", e.target.value); }} /></label>
                </div>
                <div className="prf-row">
                  <label className="bk-field"><span>Preferred date</span><input type="date" value={f.date} onChange={function (e) { upd("date", e.target.value); }} /></label>
                  <label className="bk-field"><span>Preferred time</span><input type="time" value={f.time} onChange={function (e) { upd("time", e.target.value); }} /></label>
                </div>
                <label className="bk-field"><span>How many bowlers?</span><input type="number" min="4" value={f.bowlers} onChange={function (e) { upd("bowlers", e.target.value); }} /></label>
                <label className="bk-field"><span>Anything special? (birthday name, bumpers, allergies)</span><textarea rows="2" value={f.notes} onChange={function (e) { upd("notes", e.target.value); }} placeholder="Tell us about your celebration…"></textarea></label>
                <button className="btn btn-red btn-lg" style={{ justifyContent: "center", width: "100%", marginTop: 4 }} disabled={f.name.trim().length < 2 || !f.date} onClick={function () { setDone(true); }}><Icon name="ticket" size={18} /> Submit & pay deposit</button>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---- Group / corporate package pricing tiers ---- */
function PartyTiers() {
  const ref = useReveal();
  const tiers = [
    { key: "weekday", name: "Weekday Party", when: "Mon–Fri before 5 PM", featured: false,
      rows: [{ g: "2 games", p: "10.50" }, { g: "3 games", p: "14.00" }] },
    { key: "primetime", name: "Primetime Party", when: "Weekends & weekdays after 5 PM", featured: true,
      rows: [{ g: "2 games", p: "13.00" }, { g: "3 games", p: "17.75" }] }
  ];
  return (
    <section className="section" ref={ref}>
      <div className="wrap">
        <SectionHead center kicker="Bigger groups & events" title="Group party packages." sub="Birthday parties (above) are all-inclusive. For larger groups, team nights and fundraisers, start with a bowling package — shoes included — and add food. Priced per guest." />
        <div className="ptier-grid reveal reveal-d1">
          {tiers.map(function (t) {
            return (
              <div key={t.key} className={"ptier-card" + (t.featured ? " featured" : "")}>
                <span className="ptier-when">{t.when}</span>
                <h3 className="ptier-name">{t.name}</h3>
                <div className="ptier-rows">
                  {t.rows.map(function (r, i) {
                    return <div key={i} className="ptier-row"><span>{r.g}</span><strong>${r.p}<small>/guest</small></strong></div>;
                  })}
                </div>
              </div>
            );
          })}
          <div className="ptier-card ptier-food">
            <span className="ptier-when">Add to any package</span>
            <h3 className="ptier-name">Food add-on</h3>
            <div className="ptier-rows">
              <div className="ptier-row"><span>Pizza Buffet or Tailgate</span><strong>$12.00<small>/guest</small></strong></div>
              <div className="ptier-row"><span>Kids 12 &amp; under</span><strong>$9.00<small>/guest</small></strong></div>
            </div>
          </div>
        </div>
        <div className="ptier-notes reveal reveal-d2">
          <span className="ptier-note"><Icon name="users" size={17} /> Seats up to 67</span>
          <span className="ptier-note"><Icon name="ball" size={17} /> Up to 48 lanes</span>
          <span className="ptier-note"><Icon name="shoe" size={17} /> Shoes included</span>
          <span className="ptier-note"><Icon name="beer" size={17} /> Full bar &amp; Alley Cafe</span>
          <span className="ptier-note"><Icon name="ticket" size={17} /> 50% deposit at booking</span>
        </div>
        <div className="ptier-corp reveal reveal-d2">
          <div>
            <strong>Corporate &amp; team-building nights</strong>
            <span>Custom lane blocks, catering and meeting space for up to 67 — we'll tailor it to your group.</span>
          </div>
          <a className="btn btn-blue" href={ASB.BIZ.phoneHref}><Icon name="phone" size={17} /> Call to book</a>
        </div>
      </div>
    </section>
  );
}

/* ---- Seasonal & signature events ---- */
function PartySeasonal() {
  const ref = useReveal();
  const events = [
    { icon: "spark", tag: "New Year's Eve · Family", name: "Family NYE Bash", when: "Dec 31 · 5:30–8:00 PM", price: "~$80", unit: "/ lane",
      pts: ["2.5 hrs unlimited bowling", "Free shoes · hats & noisemakers", "Pizza, drinks & a ginger-ale toast", "Raffles & prizes all night"] },
    { icon: "star", tag: "New Year's Eve · Adults", name: "Midnight Casino Bowl", when: "Dec 31 · 9 PM–Midnight", price: "$25–30", unit: "/ person",
      pts: ["Casino bowling all night long", "Champagne toast at midnight", "$25 Cosmic · $30 Interactive"] },
    { icon: "trophy", tag: "Youth · Competitive", name: "Junior Gold Practice", when: "Mondays · 7–9 PM", price: "$120", unit: "/ 8-week session",
      pts: ["8 weeks of coached practice", "Oil pattern changes every 2 weeks", "Tournament-style prep"] }
  ];
  return (
    <section className="section field-navy" ref={ref}>
      <div className="halftone bowlhero-tex"></div>
      <div className="wrap">
        <SectionHead light center kicker="Seasonal & signature events" title="More ways to celebrate." sub="From a New Year's Eve blowout to serious youth training — booked by phone, priced below." />
        <div className="pseason reveal reveal-d1">
          {events.map(function (e, i) {
            return (
              <div key={i} className="pseason-card">
                <span className="pseason-ic"><Icon name={e.icon} size={22} /></span>
                <span className="pseason-tag">{e.tag}</span>
                <h3 className="pseason-name">{e.name}</h3>
                <span className="pseason-when">{e.when}</span>
                <span className="pseason-price display">{e.price}<small>{e.unit}</small></span>
                <div className="pseason-pts">
                  {e.pts.map(function (p, j) {
                    return <span key={j} className="pseason-pt"><Icon name="check" size={15} /> {p}</span>;
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="center reveal reveal-d2" style={{ marginTop: 30 }}>
          <a className="btn btn-red btn-lg" href={ASB.BIZ.phoneHref}><Icon name="phone" size={18} /> Call {ASB.BIZ.phone} to book</a>
        </div>
      </div>
    </section>
  );
}

function PartiesPage() {
  return (
    <main>
      <PartiesHero />
      <PartyPackage />
      <PartyEstimator />
      <PartyTiers />
      <PartySeasonal />
      <PartyRequest />
    </main>
  );
}

Object.assign(window, { PartiesPage });
