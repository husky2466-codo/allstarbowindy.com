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
  const authed = useAuth();
  return (
    <main>
      {authed
        ? <MemberArea onSignOut={function () { AuthStore.signOut(); Router.go("/"); }} />
        : <RewardsTeaserPage onJoin={function () { Router.go("/login"); }} />}
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

/* ---------- Signed-in member area ---------------------------------------
   The full Tier-A signed-in experience (stats / equipment / bag / links)
   now lives in js/member-area.jsx as <MemberArea/>. AccountPage renders it
   for the signed-in branch. The old fabricated-stats Dashboard was removed
   per docs/MEMBER-AREA-SCOPING.md (no invented member data).
   ------------------------------------------------------------------------ */
Object.assign(window, { AccountPage });
