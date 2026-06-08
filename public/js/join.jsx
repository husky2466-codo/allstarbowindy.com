/* ============================================================
   JOIN PAGE — Bowlers' Appreciation Club sign-up form.
   Skips the paper clipboard: collects the member's details and
   emails them straight to the desk (mailto stand-in for now).
   Routed at #/join. Reached from the Rewards "Join free" CTAs.
   ============================================================ */

function JoinForm() {
  const [f, setF] = useState({
    first: "", last: "", email: "", phone: "",
    dob: "", street: "", city: "", zip: "",
    league: false, military: false
  });
  const [done, setDone] = useState(false);
  const [touched, setTouched] = useState(false);
  function upd(k, v) { setF(function (p) { const n = Object.assign({}, p); n[k] = v; return n; }); }

  const validEmail = /.+@.+\..+/.test(f.email);
  const validPhone = f.phone.replace(/\D/g, "").length >= 10;
  const valid = f.first.trim().length > 1 && f.last.trim().length > 1 && validEmail && validPhone;

  function buildMailto() {
    const subject = "BAC Membership Application — " + f.first + " " + f.last;
    const lines = [
      "New Bowlers' Appreciation Club membership application",
      "Submitted from allstarbowlindy.com",
      "",
      "Name: " + f.first + " " + f.last,
      "Email: " + f.email,
      "Phone: " + f.phone,
      f.dob ? "Date of birth: " + f.dob : null,
      (f.street || f.city || f.zip) ? "Address: " + [f.street, f.city, f.zip].filter(Boolean).join(", ") : null,
      "Current league bowler: " + (f.league ? "Yes" : "No"),
      "Military / veteran: " + (f.military ? "Yes" : "No"),
      "",
      "Application date: " + new Date().toLocaleDateString()
    ].filter(function (x) { return x !== null; });
    return "mailto:" + ASB.BIZ.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"));
  }

  function submit() {
    if (!valid) { setTouched(true); return; }
    window.location.href = buildMailto();
    setDone(true);
  }

  if (done) {
    return (
      <div className="join-form card">
        <div className="bk-success join-success">
          <span className="bk-success-ic"><Icon name="check" size={28} /></span>
          <strong>You're on the list, {f.first}!</strong>
          <span>We opened your email with the application filled in — just hit <strong>send</strong> to deliver it to the front desk. That's the whole sign-up.</span>
          <a className="btn btn-red" style={{ justifyContent: "center", marginTop: 14 }} href={buildMailto()}><Icon name="mail" size={17} /> Re-open the email</a>
          <span className="join-success-note">Didn't open? Email us directly at <a href={ASB.BIZ.emailHref}>{ASB.BIZ.email}</a> with your name, phone &amp; email.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="join-form card">
      <h3 className="bk-h">Your details</h3>
      <p className="join-form-lead">Takes about a minute. We only need enough to set up your Bowler ID.</p>

      <div className="prf-row">
        <label className={"bk-field" + (touched && f.first.trim().length < 2 ? " is-err" : "")}><span>First name *</span><input type="text" value={f.first} placeholder="Jordan" onChange={function (e) { upd("first", e.target.value); }} /></label>
        <label className={"bk-field" + (touched && f.last.trim().length < 2 ? " is-err" : "")}><span>Last name *</span><input type="text" value={f.last} placeholder="Bell" onChange={function (e) { upd("last", e.target.value); }} /></label>
      </div>

      <div className="prf-row">
        <label className={"bk-field" + (touched && !validEmail ? " is-err" : "")}><span>Email *</span><input type="email" value={f.email} placeholder="you@email.com" onChange={function (e) { upd("email", e.target.value); }} /></label>
        <label className={"bk-field" + (touched && !validPhone ? " is-err" : "")}><span>Phone *</span><input type="tel" value={f.phone} placeholder="(317) 555-0142" onChange={function (e) { upd("phone", e.target.value); }} /></label>
      </div>

      <div className="prf-row">
        <label className="bk-field"><span>Date of birth <em className="bk-opt">optional</em></span><input type="text" value={f.dob} placeholder="MM / DD / YYYY" onChange={function (e) { upd("dob", e.target.value); }} /></label>
        <label className="bk-field"><span>Street address <em className="bk-opt">optional</em></span><input type="text" value={f.street} placeholder="726 N Shortridge Rd" onChange={function (e) { upd("street", e.target.value); }} /></label>
      </div>

      <div className="prf-row">
        <label className="bk-field"><span>City <em className="bk-opt">optional</em></span><input type="text" value={f.city} placeholder="Indianapolis" onChange={function (e) { upd("city", e.target.value); }} /></label>
        <label className="bk-field"><span>ZIP <em className="bk-opt">optional</em></span><input type="text" value={f.zip} placeholder="46219" onChange={function (e) { upd("zip", e.target.value); }} /></label>
      </div>

      <div className="join-checks">
        <label className="join-check">
          <input type="checkbox" checked={f.league} onChange={function (e) { upd("league", e.target.checked); }} />
          <span>I'm a current league bowler</span>
        </label>
        <label className="join-check">
          <input type="checkbox" checked={f.military} onChange={function (e) { upd("military", e.target.checked); }} />
          <span>Military / veteran <em>(discount eligible)</em></span>
        </label>
      </div>

      {touched && !valid ? <p className="join-err-msg">Please add your name, a valid email, and a phone number so we can reach you.</p> : null}

      <button className="btn btn-red btn-lg join-submit" onClick={submit}><Icon name="star" size={18} fillStar /> Send my application</button>
      <p className="join-fine">Free to join, no card or payment. We'll only use your info to set up and contact you about your membership.</p>
    </div>
  );
}

function JoinSideRail() {
  const base = ASB.BAC_TIERS[0];
  const top = ASB.BAC_TIERS[ASB.BAC_TIERS.length - 1];
  const STEPS = [
    { n: "1", title: "Fill this out", body: "A minute online — no clipboard at the desk, no waiting for the sign-up sheet." },
    { n: "2", title: "We enter you in", body: "Applications are added to the system in a monthly batch. We stamp yours with today's date." },
    { n: "3", title: "Start saving", body: "We'll email you when your Bowler ID is active — then member rates kick in every game." }
  ];
  return (
    <div className="join-side">
      <div className="join-perks card">
        <h4 className="bk-h">Why join</h4>
        <ul className="join-perk-list">
          <li><Icon name="check" size={16} /> <span><strong>Free forever</strong> — no card or fee</span></li>
          <li><Icon name="check" size={16} /> <span>Lower rate every tier — <strong>${base.day.toFixed(2)} → ${top.day.toFixed(2)}</strong> a game</span></li>
          <li><Icon name="check" size={16} /> <span>Members-only specials &amp; birthday perks</span></li>
          <li><Icon name="check" size={16} /> <span>Military &amp; veteran discount</span></li>
        </ul>
      </div>
      <div className="join-steps card">
        <h4 className="bk-h">What happens next</h4>
        <div className="join-step-list">
          {STEPS.map(function (s) {
            return (
              <div key={s.n} className="join-step">
                <span className="join-step-n">{s.n}</span>
                <div className="join-step-tx"><strong>{s.title}</strong><span>{s.body}</span></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function JoinPage() {
  const ref = useReveal();
  return (
    <main>
      <section className="acct-hero join-hero field-navy" ref={ref}>
        <div className="halftone bowlhero-tex"></div>
        <div className="wrap">
          <button className="join-back" onClick={function () { Router.go("/account"); }}>‹ Back to Rewards</button>
          <div className="page-head reveal">
            <span className="kicker" style={{ color: "var(--blue-300)" }}>Bowlers' Appreciation Club</span>
            <h1 className="display page-title">Join free — skip the paper form.</h1>
            <p className="page-lead">Membership is free, but the clipboard at the desk only gets entered into the system once a month. Fill this out instead and it goes straight to the front desk — we'll set up your Bowler ID and email you the moment it's active.</p>
          </div>
        </div>
      </section>

      <section className="section join-sec" ref={useReveal()}>
        <div className="wrap join-grid reveal">
          <JoinForm />
          <JoinSideRail />
        </div>
      </section>
    </main>
  );
}

Object.assign(window, { JoinPage });
