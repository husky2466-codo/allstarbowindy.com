/* ============================================================
   LOGIN PAGE (#/login) + BOWLING-BALL WIPE TRANSITION
   ------------------------------------------------------------
   Auth is Cloudflare Access in production (Google / email one-time
   code, NO password). This is the branded sign-in screen that, on
   deploy, fronts that flow. In the mockup, completing it flips the
   AuthStore session and rolls a bowling-ball wipe into the member
   area. All motion is requestAnimationFrame-driven (CSS transitions
   freeze in the preview iframe).
   ============================================================ */

/* ---- Bowling-ball wipe (global overlay; play via WipeStore) ---- */
var _wipeTrigger = null;
var WipeStore = {
  play: function (onCovered) {
    if (_wipeTrigger) _wipeTrigger(onCovered);
    else if (onCovered) onCovered();
  }
};

function BallWipe() {
  var [active, setActive] = useState(false);
  var [p, setP] = useState(0);
  var cbRef = useRef(null);
  var fired = useRef(false);

  useEffect(function () {
    _wipeTrigger = function (cb) {
      var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) { if (cb) cb(); return; }
      cbRef.current = cb; fired.current = false; setP(0); setActive(true);
    };
    return function () { _wipeTrigger = null; };
  }, []);

  useEffect(function () {
    if (!active) return;
    var raf, start = null; var dur = 1650;
    function step(ts) {
      if (start === null) start = ts;
      var t = Math.min(1, (ts - start) / dur);
      setP(t);
      if (t >= 0.5 && !fired.current) { fired.current = true; if (cbRef.current) cbRef.current(); }
      if (t < 1) raf = requestAnimationFrame(step);
      else setActive(false);
    }
    raf = requestAnimationFrame(step);
    return function () { cancelAnimationFrame(raf); };
  }, [active]);

  if (!active) return null;

  function easeInOut(x) { return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; }
  var cover = p < 0.5;
  var curtainLeft, curtainW, ballXvw, pass;
  if (cover) { var a = easeInOut(p / 0.5); curtainLeft = 0; curtainW = a * 100; ballXvw = a * 100; pass = p / 0.5; }
  else { var b = easeInOut((p - 0.5) / 0.5); curtainLeft = b * 100; curtainW = (1 - b) * 100; ballXvw = b * 100; pass = (p - 0.5) / 0.5; }
  var ballRot = pass * 720 + (cover ? 0 : 720);
  var ballSize = 124;
  var wordOp = Math.max(0, 1 - Math.abs(p - 0.5) / 0.3);
  var artDrift = (p - 0.5) * 120;

  return (
    <div className="ballwipe" aria-hidden="true">
      <div className="ballwipe-curtain" style={{ left: curtainLeft + "vw", width: curtainW + "vw" }}>
        <div className="ballwipe-tex halftone"></div>
        <div className="ballwipe-stripes" style={{ transform: "translateX(" + artDrift + "px)" }}></div>
      </div>
      <span className="ballwipe-word" style={{ opacity: wordOp }}>Rolling you in&hellip;</span>
      <div className="ballwipe-ball" style={{ left: "calc(" + ballXvw + "vw - " + (ballSize / 2) + "px)", width: ballSize, height: ballSize, transform: "rotate(" + ballRot + "deg)" }}>
        <span className="bw-ball-holes"></span>
        <span className="bw-ball-shine"></span>
      </div>
    </div>
  );
}

/* ---- Google "G" mark (for the Access identity option) ---- */
function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.6 2.4 30.1 0 24 0 14.6 0 6.4 5.4 2.5 13.2l7.9 6.1C12.3 13.2 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.5 3-2.2 5.5-4.7 7.2l7.3 5.7C43.8 37.9 46.5 31.8 46.5 24.5z" />
      <path fill="#FBBC05" d="M10.4 28.3c-.5-1.5-.8-3.1-.8-4.8s.3-3.3.8-4.8l-7.9-6.1C.9 16.1 0 19.9 0 24s.9 7.9 2.5 11.4l7.9-7.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.3-5.7c-2 1.4-4.7 2.3-8.6 2.3-6.3 0-11.7-3.7-13.6-9.1l-7.9 7.1C6.4 42.6 14.6 48 24 48z" />
    </svg>
  );
}

/* ---- Login page ---- */
function LoginPage() {
  var authed = useAuth();
  var [step, setStep] = useState("choose");          // choose | code
  var [email, setEmail] = useState("");
  var [digits, setDigits] = useState(["", "", "", "", "", ""]);
  var [err, setErr] = useState("");
  var [pending, setPending] = useState("");           // "" | "google" | "email"
  var boxes = useRef([]);

  function validEmail(e) { return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e); }

  function finishSignIn() {
    // roll the bowling-ball wipe; flip session at full cover, land in member area
    WipeStore.play(function () { AuthStore.signIn(); window.__maInitialTab = "stats"; Router.go("/account"); });
  }

  function sendCode() {
    if (!validEmail(email)) { setErr("Enter a valid email address."); return; }
    setErr(""); setPending("email");
    setTimeout(function () { setPending(""); setStep("code"); setTimeout(function () { if (boxes.current[0]) boxes.current[0].focus(); }, 40); }, 650);
  }
  function googleSignIn() {
    setPending("google");
    setTimeout(function () { setPending(""); finishSignIn(); }, 700);
  }
  function setDigit(i, v) {
    v = v.replace(/[^0-9]/g, "").slice(0, 1);
    var nd = digits.slice(); nd[i] = v; setDigits(nd); setErr("");
    if (v && i < 5 && boxes.current[i + 1]) boxes.current[i + 1].focus();
  }
  function onKeyDown(i, e) {
    if (e.key === "Backspace" && !digits[i] && i > 0 && boxes.current[i - 1]) boxes.current[i - 1].focus();
  }
  function onPaste(e) {
    var t = (e.clipboardData.getData("text") || "").replace(/[^0-9]/g, "").slice(0, 6);
    if (t) { e.preventDefault(); var nd = ["", "", "", "", "", ""]; for (var k = 0; k < t.length; k++) nd[k] = t[k]; setDigits(nd); var n = Math.min(t.length, 5); if (boxes.current[n]) boxes.current[n].focus(); }
  }
  function verify() {
    if (digits.join("").length < 6) { setErr("Enter the 6-digit code. (Any digits work in this demo.)"); return; }
    finishSignIn();
  }

  if (authed) {
    return (
      <main className="login-page">
        <div className="login-already">
          <Logo light size={58} />
          <h1 className="display login-already-h">You&rsquo;re signed in.</h1>
          <p className="login-already-p">Head to your stats, equipment catalog and saved bag.</p>
          <div className="login-already-cta">
            <button className="btn btn-red btn-lg" onClick={function () { window.__maInitialTab = "stats"; Router.go("/account"); }}><Icon name="chart" size={18} /> Go to my account</button>
            <button className="btn btn-ghost btn-lg" style={{ color: "var(--cream)", borderColor: "rgba(245,241,230,.5)" }} onClick={function () { AuthStore.signOut(); }}>Sign out</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="login-page">
      <div className="login-split">
        {/* brand panel */}
        <div className="login-brand">
          <div className="login-brand-photo" aria-hidden="true"></div>
          <div className="halftone login-brand-tex"></div>
          <div className="login-brand-in">
            <Logo light size={56} />
            <h1 className="display login-brand-h">Your game,<br />on the board.</h1>
            <p className="login-brand-p">Sign in to see the stats from games you&rsquo;ve tracked, build your ball bag, and jump straight to live league scores.</p>
            <ul className="login-brand-list">
              <li><Icon name="chart" size={18} /> Average, high game &amp; series</li>
              <li><Icon name="bag" size={18} /> Your saved arsenal</li>
              <li><Icon name="trophy" size={18} /> Live scores &amp; standings</li>
            </ul>
          </div>
        </div>

        {/* form panel */}
        <div className="login-form-wrap">
          <div className="login-card">
            <div className="login-card-head">
              <span className="kicker" style={{ color: "var(--red-600)" }}>Members</span>
              <h2 className="login-card-h">{step === "choose" ? "Sign in to All Star Bowl" : "Check your email"}</h2>
            </div>

            {step === "choose" ? (
              <React.Fragment>
                <button className={"login-google" + (pending === "google" ? " busy" : "")} onClick={googleSignIn} disabled={!!pending}>
                  {pending === "google" ? <span className="login-spin"></span> : <GoogleG />}
                  <span>{pending === "google" ? "Connecting…" : "Continue with Google"}</span>
                </button>

                <div className="login-or"><span>or</span></div>

                <label className="login-field">
                  <span className="login-label">Email address</span>
                  <input type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" value={email}
                    onChange={function (e) { setEmail(e.target.value); setErr(""); }}
                    onKeyDown={function (e) { if (e.key === "Enter") sendCode(); }} />
                </label>
                {err ? <p className="login-err">{err}</p> : null}
                <button className={"btn btn-red btn-lg login-submit" + (pending === "email" ? " busy" : "")} onClick={sendCode} disabled={!!pending}>
                  {pending === "email" ? <span className="login-spin light"></span> : <Icon name="mail" size={18} />}
                  {pending === "email" ? "Sending code…" : "Email me a sign-in code"}
                </button>

                <p className="login-fine"><Icon name="info" size={14} /> Secured by Cloudflare Access. We sign you in with Google or a one-time email code &mdash; <strong>there&rsquo;s no password to remember.</strong></p>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <p className="login-codetext">We sent a 6-digit code to <strong>{email}</strong>. Enter it below.</p>
                <div className="login-code" onPaste={onPaste}>
                  {digits.map(function (d, i) {
                    return <input key={i} ref={function (el) { boxes.current[i] = el; }} className="login-code-box" inputMode="numeric" maxLength={1} value={d}
                      onChange={function (e) { setDigit(i, e.target.value); }} onKeyDown={function (e) { onKeyDown(i, e); }} />;
                  })}
                </div>
                {err ? <p className="login-err">{err}</p> : null}
                <p className="login-demohint"><Icon name="info" size={13} /> Demo: any 6 digits sign you in.</p>
                <button className="btn btn-red btn-lg login-submit" onClick={verify}><Icon name="check" size={18} /> Verify &amp; sign in</button>
                <button className="login-back" onClick={function () { setStep("choose"); setDigits(["", "", "", "", "", ""]); setErr(""); }}><Icon name="arrow" size={15} style={{ transform: "rotate(180deg)" }} /> Use a different email</button>
              </React.Fragment>
            )}

            <div className="login-join">
              Not a member yet? <button onClick={function () { Router.go("/join"); }}>Join the club &mdash; it&rsquo;s free</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

Object.assign(window, { LoginPage: LoginPage, BallWipe: BallWipe, WipeStore: WipeStore });
