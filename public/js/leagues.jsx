/* ============================================================
   LEAGUES & YOUTH PAGE
   ============================================================ */

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function LeaguesHero() {
  const ref = useReveal();
  const s = useStatus();
  const todayLeagues = ASB.leaguesForDay(ClockStore.now().getDay());
  return (
    <section className="leagueshero field-navy" ref={ref}>
      <div className="leagueshero-photo" aria-hidden="true"></div>
      <div className="halftone bowlhero-tex"></div>
      <div className="wrap leagueshero-grid">
        <div className="reveal">
          <span className="kicker" style={{ color: "var(--blue-300)" }}>Leagues &amp; Youth</span>
          <h1 className="display page-title">Bowl with your crew, every week.</h1>
          <p className="page-lead">Ten leagues a week for every age and skill level — plus a Saturday youth program with real coaching. New bowlers always welcome.</p>
          <div className="hero-cta" style={{ marginTop: 26 }}>
            <button className="btn btn-red btn-lg" onClick={function () { const el = document.getElementById("signup"); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" }); }}><Icon name="trophy" size={19} /> Join a league</button>
            <button className="btn btn-ghost btn-lg" onClick={function () { Router.go("/scores"); }}><Icon name="ball" size={18} /> Live scores</button>
          </div>
        </div>
        <div className="reveal reveal-d2 leagues-today">
          <div className="lt-head">
            <span className={"dot " + (todayLeagues.length ? "s-limited" : "s-open")} style={{ background: "currentColor" }}></span>
            <span>{DAY_NAMES[ClockStore.now().getDay()]}'s leagues</span>
          </div>
          {todayLeagues.length ? todayLeagues.map(function (l, i) {
            const mins = ClockStore.now().getHours() * 60 + ClockStore.now().getMinutes();
            const live = mins >= l.start && mins < l.end;
            return (
              <div key={i} className="lt-row">
                <div>
                  <strong>{l.name}</strong>
                  <span>{l.group} · {l.lanes} lanes</span>
                </div>
                <span className={"lt-time" + (live ? " live" : "")}>{live ? "Bowling now" : ASB.fmtClock(l.start)}</span>
              </div>
            );
          }) : <p className="lt-empty">No leagues today — open lanes all day. Great time to bring the family.</p>}
        </div>
      </div>
    </section>
  );
}

function LeagueSchedule() {
  const ref = useReveal();
  const [day, setDay] = useState(ClockStore.now().getDay());
  const leagues = ASB.leaguesForDay(day);
  return (
    <section className="section" ref={ref}>
      <div className="wrap">
        <SectionHead center kicker="Weekly schedule" title="Find your night." sub="Tap a day to see which leagues roll and when. Contact Doug, Faith or Nikki at (317) 352-1848 to sign up." />
        <div className="sched reveal reveal-d1">
          <div className="sched-days">
            {DAY_NAMES.map(function (d, i) {
              const has = ASB.leaguesForDay(i).length;
              return (
                <button key={i} className={"sched-day" + (i === day ? " on" : "") + (has ? "" : " empty")} onClick={function () { setDay(i); }}>
                  <span>{d.slice(0, 3)}</span>
                  <small>{has ? has + " league" + (has > 1 ? "s" : "") : "Open"}</small>
                </button>
              );
            })}
          </div>
          <div className="sched-list">
            {leagues.length ? leagues.map(function (l, i) {
              return (
                <div key={i} className="sched-card">
                  <div className="sched-time">
                    <span className="sched-time-v">{ASB.fmtClock(l.start)}</span>
                  </div>
                  <div className="sched-info">
                    <strong>{l.name}</strong>
                    <div className="sched-tags">
                      <span className="tag tag-blue">{l.group}</span>
                      <span className="tag tag-red">{l.perTeam} / team</span>
                    </div>
                  </div>
                  <div className="sched-start">
                    <span className="sched-start-label">Season starts</span>
                    <span className="sched-start-v">{l.startDate}</span>
                  </div>
                </div>
              );
            }) : (
              <div className="sched-empty">
                <span className="sched-empty-emoji">🎳</span>
                <strong>No leagues this day</strong>
                <span>Lanes are wide open — perfect for open bowling, parties or practice.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function YouthProgram() {
  const ref = useReveal();
  const divisions = [
    { name: "Wee Strikers", ages: "Ages 4–7", body: "First frames with bumpers, lightweight balls and lots of high-fives.", color: "var(--red-600)" },
    { name: "Amazing All Stars", ages: "Ages 7–12", body: "Building real technique — aim, approach and a competitive streak.", color: "var(--blue-600)" },
    { name: "Pacers", ages: "Ages 13–20", body: "Tournament-ready coaching for serious young bowlers chasing scholarships.", color: "var(--navy-700)" }
  ];
  return (
    <section className="section youth-sec field-navy" ref={ref}>
      <div className="halftone bowlhero-tex"></div>
      <div className="wrap youth-grid">
        <div className="reveal youth-copy">
          <SectionHead light kicker="Saturday youth league · 11 AM" title="Where young bowlers grow." sub="Ages 4–20, every Saturday morning. Coaching in partnership with the Score 60 Team and H2M Management — three divisions so every kid is challenged just right." />
          <a className="btn btn-cream btn-lg" href={ASB.BIZ.phoneHref}><Icon name="phone" size={18} /> Sign up your bowler</a>
        </div>
        <figure className="youth-photo reveal reveal-d2">
          <img src="img/youth-bowling.jpg" alt="Kids bowling at All Star Bowl" loading="lazy" />
        </figure>
      </div>
      <div className="wrap youth-divs">
        {divisions.map(function (d, i) {
          return (
            <div key={i} className={"youth-div reveal reveal-d" + (i + 1)}>
              <span className="youth-div-badge" style={{ background: d.color }}>{d.ages}</span>
              <strong className="display youth-div-name">{d.name}</strong>
              <p>{d.body}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function HonorScores() {
  const ref = useReveal();
  return (
    <section className="section" ref={ref}>
      <div className="wrap">
        <SectionHead center kicker="Hall of fame" title="Honor scores." sub="The perfect games and big series rolled on our synthetic lanes and wood approaches." />
        <div className="honor-grid reveal reveal-d1">
          <div className="honor-card honor-300">
            <span className="honor-num display">300</span>
            <span className="honor-label">Perfect games</span>
            <p>Twelve strikes in a row. The rarest feat in bowling — and it's happened here.</p>
            <a className="honor-link" href={ASB.BIZ.standings} target="_blank" rel="noreferrer">View the wall ↗</a>
          </div>
          <div className="honor-card honor-800">
            <span className="honor-num display">800</span>
            <span className="honor-label">Series club</span>
            <p>Three games, 800+ pins. Consistency under pressure across a full set.</p>
            <a className="honor-link" href={ASB.BIZ.standings} target="_blank" rel="noreferrer">View the wall ↗</a>
          </div>
          <div className="honor-card honor-stand">
            <span className="honor-ic"><Icon name="trophy" size={30} /></span>
            <span className="honor-label">League standings</span>
            <p>Live results, averages and team rankings, updated weekly through ComputerScore.</p>
            <a className="honor-link" href="#/scores" onClick={function (e) { e.preventDefault(); Router.go("/scores"); }}>Open standings →</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function LeagueSignup() {
  const ref = useReveal();
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", league: "" });
  const contacts = [
    { name: "Doug", role: "Men's & mixed leagues" },
    { name: "Faith", role: "Senior & ladies leagues" },
    { name: "Nikki", role: "Youth program" }
  ];
  return (
    <section className="section signup-sec" id="signup" ref={ref}>
      <div className="wrap signup-grid">
        <div className="reveal">
          <SectionHead kicker="Sign up" title="Get on a team." sub="Tell us a little about you and which league fits. Our league coordinators will reach out to get you rolling." />
          <div className="signup-contacts">
            {contacts.map(function (c, i) {
              return (
                <div key={i} className="signup-contact">
                  <span className="signup-avatar">{c.name[0]}</span>
                  <div><strong>{c.name}</strong><span>{c.role}</span></div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="reveal reveal-d2">
          <div className="signup-form card">
            {done ? (
              <div className="bk-success">
                <span className="bk-success-ic"><Icon name="check" size={26} /></span>
                <strong>Request sent!</strong>
                <span>A league coordinator will call you within a day or two.</span>
              </div>
            ) : (
              <React.Fragment>
                <h4 className="bk-h">League sign-up</h4>
                <label className="bk-field"><span>Your name</span><input type="text" value={form.name} placeholder="First & last name" onChange={function (e) { setForm(Object.assign({}, form, { name: e.target.value })); }} /></label>
                <label className="bk-field"><span>Phone</span><input type="tel" value={form.phone} placeholder="(317) 555-0142" onChange={function (e) { setForm(Object.assign({}, form, { phone: e.target.value })); }} /></label>
                <label className="bk-field"><span>Interested in</span>
                  <select value={form.league} onChange={function (e) { setForm(Object.assign({}, form, { league: e.target.value })); }}>
                    <option value="">Choose a league…</option>
                    {ASB.LEAGUES.map(function (l, i) { return <option key={i} value={l.name}>{DAY_NAMES[l.day].slice(0, 3)} · {l.name} ({l.group})</option>; })}
                    <option value="unsure">Not sure yet — help me pick</option>
                  </select>
                </label>
                <button className="btn btn-red btn-lg" style={{ justifyContent: "center", width: "100%", marginTop: 6 }} disabled={form.name.trim().length < 2} onClick={function () { setDone(true); }}><Icon name="trophy" size={18} /> Submit sign-up</button>
                <p className="bk-fineprint" style={{ textAlign: "center" }}>Or call <a href={ASB.BIZ.phoneHref} style={{ color: "var(--blue-600)", fontWeight: 700 }}>{ASB.BIZ.phone}</a></p>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function LeaguesPage() {
  return (
    <main>
      <LeaguesHero />
      <LeagueSchedule />
      <YouthProgram />
      <HonorScores />
      <LeagueSignup />
    </main>
  );
}

Object.assign(window, { LeaguesPage });
