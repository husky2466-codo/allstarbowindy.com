/* ============================================================
   ACCOUNT / REWARDS PAGE — logged-out teaser <-> dashboard
   ============================================================ */

/* Member data comes from the SWAPPABLE data layer (js/data-provider.js →
   window.ASB_DATA). NEVER hardcode member data here — see docs/DATA-CONTRACT.md
   + docs/MEMBER-AREA-SCOPING.md. getMember() returns null when there is no
   authenticated member / no captured games → render the empty state, never a
   fabricated number. */
function getMember() { return (window.ASB_DATA && window.ASB_DATA.getMember && window.ASB_DATA.getMember()) || null; }

function tierByKey(k) { return ASB.BAC_TIERS.find(function (t) { return t.key === k; }); }
function nextTier(k) {
  const idx = ASB.BAC_TIERS.findIndex(function (t) { return t.key === k; });
  return ASB.BAC_TIERS[idx + 1] || null;
}

function AccountPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <main>
      <div className="acct-toggle-bar">
        <div className="wrap acct-toggle-in">
          <span className="acct-toggle-label">Preview:</span>
          <div className="acct-toggle">
            <button className={!loggedIn ? "on" : ""} onClick={function () { setLoggedIn(false); }}>Not a member yet</button>
            <button className={loggedIn ? "on" : ""} onClick={function () { setLoggedIn(true); }}>Signed-in member</button>
          </div>
        </div>
      </div>
      {loggedIn ? <Dashboard onSignOut={function () { setLoggedIn(false); }} /> : <RewardsTeaserPage onJoin={function () { setLoggedIn(true); }} />}
    </main>
  );
}

/* ---------- Logged-out teaser ---------- */
function RewardsTeaserPage(props) {
  const ref = useReveal();
  return (
    <React.Fragment>
      <section className="acct-hero field-navy" ref={ref}>
        <div className="acct-hero-photo" aria-hidden="true"></div>
        <div className="halftone bowlhero-tex"></div>
        <div className="wrap acct-hero-grid">
          <div className="reveal">
            <span className="kicker" style={{ color: "var(--blue-300)" }}>Bowlers' Appreciation Club</span>
            <h1 className="display page-title">The more you bowl, the less you pay.</h1>
            <p className="page-lead">Free to join. Every game counts toward your Bowler ID — climb five tiers and your per-game rate drops at each one. Plus members-only specials and military discounts.</p>
            <div className="hero-cta" style={{ marginTop: 26 }}>
              <button className="btn btn-red btn-lg" onClick={function () { Router.go("/join"); }}><Icon name="star" size={18} fillStar /> Join free</button>
              <button className="btn btn-ghost btn-lg" onClick={props.onJoin}>I'm already a member</button>
            </div>
          </div>
          <div className="reveal reveal-d2">
            <TierCardShow />
          </div>
        </div>
      </section>

      <section className="section" ref={useReveal()}>
        <div className="wrap">
          <SectionHead center kicker="Five tiers, real savings" title="Climb the ladder." sub="Daytime rates shown — the rate drops the more games you've bowled. Night and weekend rates have member pricing too." />
          <div className="tier-ladder reveal reveal-d1">
            {ASB.BAC_TIERS.map(function (t, i) {
              return (
                <div key={t.key} className={"tier-step tier-" + t.key.toLowerCase()}>
                  <div className="tier-step-head">
                    <span className="tier-step-name">{t.name}</span>
                    <span className="tier-step-req">{t.gamesReq === 0 ? "Sign up" : t.gamesReq + " games"}</span>
                  </div>
                  <div className="tier-step-rate">
                    <span className="tier-rate-v">${t.day.toFixed(2)}</span>
                    <span className="tier-rate-l">daytime game</span>
                  </div>
                  <div className="tier-step-bar"><span style={{ height: (40 + i * 15) + "%" }}></span></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section rate-compare-sec field-navy" ref={useReveal()}>
        <div className="halftone bowlhero-tex"></div>
        <div className="wrap">
          <SectionHead light center kicker="Member rate card" title="Every rate, every tier." />
          <div className="rate-table-wrap reveal reveal-d1">
            <table className="rate-table">
              <thead>
                <tr>
                  <th>Tier</th><th>Games req.</th><th>Daytime<small>before 5 PM</small></th><th>Sun–Thu night</th><th>Fri–Sat night</th><th>Senior / Junior<small>daytime</small></th>
                </tr>
              </thead>
              <tbody>
                {ASB.BAC_TIERS.map(function (t) {
                  return (
                    <tr key={t.key} className={"rt-" + t.key.toLowerCase()}>
                      <td className="rt-name">{t.name}</td>
                      <td>{t.gamesReq === 0 ? "New" : t.gamesReq}</td>
                      <td>${t.day.toFixed(2)}</td>
                      <td>${t.night.toFixed(2)}</td>
                      <td>${t.weekend.toFixed(2)}</td>
                      <td>${t.sj.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="center reveal reveal-d2" style={{ marginTop: 30 }}>
            <button className="btn btn-cream btn-lg" onClick={function () { Router.go("/join"); }}><Icon name="star" size={18} fillStar /> Start earning — join free</button>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

/* ---------- BAC membership card (graffiti tier artwork) ---------- */
const CARD_IMG = { BAC: "bac", HOLE: "holepunch", SILVER: "silver", GOLD: "gold", DIAMOND: "diamond" };

function BacCard(props) {
  const t = props.tier;
  return (
    <div className={"bac-card bac-img bac-" + t.key.toLowerCase()}>
      <img className="bac-img-art" src={"img/cards/" + CARD_IMG[t.key] + ".png"} alt={t.name + " membership card"} />
    </div>
  );
}

/* ---------- Tier card slideshow (hero showcase of all five) ----------
   Crossfade driven by requestAnimationFrame (CSS transitions freeze in the
   preview iframe); opacity set inline per layer so one card always shows. */
function TierCardShow() {
  const tiers = ASB.BAC_TIERS;
  const n = tiers.length;
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState(-1);
  const [t, setT] = useState(1);
  const curRef = useRef(0);
  const paused = useRef(false);

  function jump(nx) { const c = curRef.current; if (nx === c) return; curRef.current = nx; setPrev(c); setCur(nx); setT(0); }
  function advance(dir) { jump((curRef.current + dir + n) % n); }

  useEffect(function () {
    if (t >= 1) return;
    let start = null, raf = 0; const dur = 560;
    function step(ts) { if (start === null) start = ts; const p = Math.min(1, (ts - start) / dur); setT(p); if (p < 1) raf = requestAnimationFrame(step); }
    raf = requestAnimationFrame(step);
    return function () { cancelAnimationFrame(raf); };
  }, [cur]);

  useEffect(function () {
    const id = setInterval(function () { if (!paused.current) advance(1); }, 3600);
    return function () { clearInterval(id); };
  }, []);

  const tc = tiers[cur];
  return (
    <div className="tier-show"
      onMouseEnter={function () { paused.current = true; }}
      onMouseLeave={function () { paused.current = false; }}>
      <div className="tier-show-frame">
        {tiers.map(function (tt, i) {
          const op = i === cur ? t : (i === prev ? 1 - t : 0);
          return <img key={tt.key} className="tier-show-img" src={"img/cards/" + CARD_IMG[tt.key] + ".png"} alt={tt.name + " membership card"} style={{ opacity: op }} />;
        })}
        <button className="tier-show-nav prev" onClick={function () { advance(-1); }} aria-label="Previous tier">‹</button>
        <button className="tier-show-nav next" onClick={function () { advance(1); }} aria-label="Next tier">›</button>
      </div>
      <div className="tier-show-cap">
        <span className="tier-show-name">{tc.name}</span>
        <span className="tier-show-meta">{tc.gamesReq === 0 ? "Free to join" : tc.gamesReq + " games"} · ${tc.day.toFixed(2)} / game</span>
      </div>
      <div className="tier-show-dots">
        {tiers.map(function (tt, i) {
          return <button key={tt.key} className={"tier-dot" + (i === cur ? " on" : "")} onClick={function () { jump(i); }} aria-label={tt.name}></button>;
        })}
      </div>
    </div>
  );
}

/* ---------- Signed-in dashboard ---------- */
/* Empty / no-data state — shown when there is no authenticated member or no
   captured games. Honest by design (docs/MEMBER-AREA-SCOPING.md): we surface
   real Tier-A actions, never invented stats. */
function DashboardEmpty(props) {
  const ref = useReveal();
  return (
    <section className="section dash-sec" ref={ref}>
      <div className="wrap">
        <div className="dash-head reveal">
          <div>
            <span className="kicker" style={{ color: "var(--red-600)" }}>Your account</span>
            <h1 className="display dash-title">Welcome to the club.</h1>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ color: "var(--navy-800)" }} onClick={props.onSignOut}>Sign out</button>
        </div>
        <div className="reveal reveal-d1" style={{ maxWidth: 640 }}>
          <div className="dash-cta-card">
            <h4 className="dash-h">No games tracked yet</h4>
            <p className="muted" style={{ fontSize: ".95rem", lineHeight: 1.55, marginBottom: 16 }}>
              Track a game in the All Star Bowl app and your average, high game and series history
              will show up here. We only ever show games you&rsquo;ve actually bowled &mdash; never a number you haven&rsquo;t.
            </p>
            <div className="hero-cta" style={{ flexWrap: "wrap" }}>
              <button className="btn btn-red" onClick={function () { Router.go("/bowl"); }}><Icon name="ball" size={18} /> Reserve a lane</button>
              <button className="btn btn-blue" onClick={function () { Router.go("/proshop"); }}><Icon name="bag" size={18} /> Browse equipment</button>
              <button className="btn btn-ghost" style={{ color: "var(--navy-800)" }} onClick={function () { Router.go("/scores"); }}><Icon name="trophy" size={18} /> Live league scores</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Dashboard(props) {
  const ref = useReveal();
  const MEMBER = getMember();
  if (!MEMBER) return <DashboardEmpty onSignOut={props.onSignOut} />;
  const tier = tierByKey(MEMBER.tierKey);
  const next = nextTier(MEMBER.tierKey);
  const gamesToNext = next ? next.gamesReq - MEMBER.games : 0;
  const prevReq = tier.gamesReq;
  const span = next ? next.gamesReq - prevReq : 1;
  const progress = next ? Math.min(100, Math.round(((MEMBER.games - prevReq) / span) * 100)) : 100;
  const s = useStatus();
  // savings vs base BAC rate
  const savedPerGame = (ASB.BAC_TIERS[0].day - tier.day);
  const totalSaved = (MEMBER.games * savedPerGame).toFixed(0);

  return (
    <section className="section dash-sec" ref={ref}>
      <div className="wrap">
        <div className="dash-head reveal">
          <div>
            <span className="kicker" style={{ color: "var(--red-600)" }}>Welcome back</span>
            <h1 className="display dash-title">Hey, {MEMBER.first}.</h1>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ color: "var(--navy-800)" }} onClick={props.onSignOut}>Sign out</button>
        </div>

        <div className="dash-grid">
          <div className="dash-main reveal reveal-d1">
            <div className="dash-progress-card">
              <div className="dash-pc-top">
                <div>
                  <span className="dash-pc-tier">{tier.name} member</span>
                  <span className="dash-pc-games"><strong>{MEMBER.games}</strong> games bowled</span>
                </div>
                <span className="dash-pc-rate"><strong>${tier.day.toFixed(2)}</strong><small>your daytime game</small></span>
              </div>
              {next ? (
                <React.Fragment>
                  <div className="dash-bar"><span style={{ width: progress + "%" }}></span></div>
                  <span className="dash-next">{gamesToNext} games to <strong>{next.name}</strong> — unlock ${next.day.toFixed(2)} daytime games</span>
                </React.Fragment>
              ) : (
                <span className="dash-next">You've reached the top tier. Enjoy Diamond pricing! 💎</span>
              )}
              <div className="dash-tier-row">
                {ASB.BAC_TIERS.map(function (tt) {
                  const reached = tt.gamesReq <= MEMBER.games;
                  return <span key={tt.key} className={"dash-tier-chip" + (reached ? " on" : "") + (tt.key === MEMBER.tierKey ? " cur" : "")}>{tt.name}</span>;
                })}
              </div>
            </div>

            <div className="dash-stats">
              <div className="dash-stat"><span className="dash-stat-v display">${totalSaved}</span><span className="dash-stat-l">saved vs. new-member rate</span></div>
              <div className="dash-stat"><span className="dash-stat-v display">{MEMBER.games}</span><span className="dash-stat-l">lifetime games</span></div>
              <div className="dash-stat"><span className="dash-stat-v display">{MEMBER.joined}</span><span className="dash-stat-l">member since</span></div>
            </div>

            <div className="dash-history">
              <h4 className="dash-h">Recent activity</h4>
              {MEMBER.history.map(function (h, i) {
                return (
                  <div key={i} className="dash-hist-row">
                    <span className="dash-hist-date">{h.date}</span>
                    <span className="dash-hist-desc">{h.desc}</span>
                    <span className="dash-hist-games">+{h.games}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="dash-side reveal reveal-d2">
            <BacCard tier={tier} name={MEMBER.name} games={MEMBER.games} />
            <div className="dash-cta-card">
              <h4 className="dash-h">{s.isOpen ? "Lanes are open right now" : "Plan your next visit"}</h4>
              <p className="muted" style={{ fontSize: ".92rem", marginBottom: 14 }}>
                {s.isOpen ? (s.lanesOpen + " of " + s.total + " lanes open. Lock one in and rack up more games toward " + (next ? next.name : "the top") + ".") : "Reserve ahead and keep climbing toward " + (next ? next.name : "the top") + "."}
              </p>
              <button className="btn btn-red" style={{ justifyContent: "center", width: "100%" }} onClick={function () { Router.go("/bowl"); }}><Icon name="ball" size={18} /> Reserve a lane</button>
            </div>
            <div className="dash-perks">
              <h4 className="dash-h">Your perks</h4>
              <ul>
                <li><Icon name="check" size={16} /> ${tier.day.toFixed(2)} daytime · ${tier.night.toFixed(2)} weeknight games</li>
                <li><Icon name="check" size={16} /> Members-only Facebook specials</li>
                <li><Icon name="check" size={16} /> Military discount eligible</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { AccountPage });
