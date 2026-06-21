/* ============================================================
   Shared components: clock store, hooks, icons, logo, nav, footer
   Exports to window for other Babel scripts.
   ============================================================ */
const { useState, useEffect, useRef, useCallback, createContext, useContext } = React;

/* ---- Clock store: real time + optional "time machine" offset ---- */
const ClockStore = (function () {
  let offset = 0;
  const subs = new Set();
  return {
    now() { return new Date(Date.now() + offset); },
    getOffset() { return offset; },
    setOffset(ms) { offset = ms; subs.forEach(function (f) { f(); }); },
    sub(f) { subs.add(f); return function () { subs.delete(f); }; }
  };
})();

/* Live status hook — ticks every second, recomputes status */
function useStatus() {
  const [, force] = useState(0);
  useEffect(function () {
    const id = setInterval(function () { force(function (n) { return n + 1; }); }, 1000);
    const un = ClockStore.sub(function () { force(function (n) { return n + 1; }); });
    return function () { clearInterval(id); un(); };
  }, []);
  return ASB.getStatus(ClockStore.now());
}

/* Count-up animation hook */
function useCountUp(target, dur, deps) {
  const [val, setVal] = useState(0);
  const raf = useRef(0);
  useEffect(function () {
    let start = null;
    const from = 0;
    function step(t) {
      if (start === null) start = t;
      const p = Math.min(1, (t - start) / (dur || 900));
      const e = 1 - Math.pow(1 - p, 3);
      setVal(from + (target - from) * e);
      if (p < 1) raf.current = requestAnimationFrame(step);
    }
    raf.current = requestAnimationFrame(step);
    return function () { cancelAnimationFrame(raf.current); };
  }, deps || [target]);
  return val;
}

/* Reveal-on-scroll — scroll-based (IntersectionObserver does not fire in
   off-screen preview iframes). Tracks a revealed set and re-applies the
   class after every render, since React resets className on re-render. */
function useReveal() {
  const ref = useRef(null);
  const revealed = useRef(new Set());

  // After every render, re-apply 'in' to already-revealed nodes
  // (React resets className when a parent re-renders, e.g. live clock ticks).
  useEffect(function () {
    revealed.current.forEach(function (n) { n.classList.add("in"); });
  });

  useEffect(function () {
    const el = ref.current;
    if (!el) return;
    let nodes = Array.from(el.querySelectorAll(".reveal"));
    if (el.classList && el.classList.contains("reveal")) nodes.push(el);
    if (!nodes.length) return;
    function reveal(n) { n.classList.add("in"); revealed.current.add(n); }
    function check() {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      nodes = nodes.filter(function (n) {
        const r = n.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) { reveal(n); return false; }
        return true;
      });
      if (!nodes.length) cleanup();
    }
    function cleanup() {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    }
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    // safety net: in environments with no scroll events, reveal everything
    const t = setTimeout(function () { nodes.forEach(reveal); }, 1100);
    return function () { clearTimeout(t); cleanup(); };
  }, []);
  return ref;
}

/* ---- Icons ---- */
function Icon(props) {
  const p = { width: props.size || 22, height: props.size || 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: props.sw || 1.9, strokeLinecap: "round", strokeLinejoin: "round", style: props.style, className: props.className };
  // Icon set: Lucide (https://lucide.dev), ISC-licensed, free for commercial use,
  // no attribution required. Paths taken from lucide-static v1.21.0. The two
  // bowling marks (pin, ball) are hand-drawn — Lucide has no bowling icons.
  // All paths inherit the component's stroke/fill via the spread `p`.
  const paths = {
    pin: <g><path d="M9 3c0 4 -1.5 7 -1.5 11a4.5 4.5 0 0 0 9 0c0 -4 -1.5 -7 -1.5 -11" /><path d="M9 3h6" /></g>,
    ball: <g><circle cx="12" cy="12" r="9" /><circle cx="9.5" cy="9" r="1" fill="currentColor" stroke="none" /><circle cx="12.4" cy="8.4" r="1" fill="currentColor" stroke="none" /><circle cx="11" cy="11" r="1" fill="currentColor" stroke="none" /></g>,
    phone: <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />,
    clock: <g><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></g>,
    cal: <g><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></g>,
    map: <g><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></g>,
    star: <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" fill={props.fillStar ? "currentColor" : "none"} />,
    trophy: <g><path d="M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978" /><path d="M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978" /><path d="M18 9h1.5a1 1 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z" /><path d="M6 9H4.5a1 1 0 0 1 0-5H6" /></g>,
    cake: <g><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" /><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" /><path d="M2 21h20" /><path d="M7 8v3" /><path d="M12 8v3" /><path d="M17 8v3" /><path d="M7 4h.01" /><path d="M12 4h.01" /><path d="M17 4h.01" /></g>,
    pizza: <g><path d="m12 14-1 1" /><path d="m13.75 18.25-1.25 1.42" /><path d="M17.775 5.654a15.68 15.68 0 0 0-12.121 12.12" /><path d="M18.8 9.3a1 1 0 0 0 2.1 7.7" /><path d="M21.964 20.732a1 1 0 0 1-1.232 1.232l-18-5a1 1 0 0 1-.695-1.232A19.68 19.68 0 0 1 15.732 2.037a1 1 0 0 1 1.232.695z" /></g>,
    user: <g><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></g>,
    chev: <path d="m9 18 6-6-6-6" />,
    arrow: <g><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></g>,
    menu: <g><path d="M4 5h16" /><path d="M4 12h16" /><path d="M4 19h16" /></g>,
    close: <g><path d="M18 6 6 18" /><path d="m6 6 12 12" /></g>,
    check: <path d="M20 6 9 17l-5-5" />,
    mail: <g><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /><rect x="2" y="4" width="20" height="16" rx="2" /></g>,
    bolt: <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" fill={props.fillStar ? "currentColor" : "none"} />,
    gift: <g><path d="M12 7v14" /><path d="M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" /><path d="M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5" /><rect x="3" y="7" width="18" height="4" rx="1" /></g>,
    fire: <path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4" />,
    beer: <g><path d="M17 11h1a3 3 0 0 1 0 6h-1" /><path d="M9 12v6" /><path d="M13 12v6" /><path d="M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5S9.44 2 11 2s2 1.5 3 1.5 1.72-.5 2.5-.5a2.5 2.5 0 0 1 0 5c-.78 0-1.5-.5-2.5-.5Z" /><path d="M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" /></g>,
    shoe: <g><path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z" /><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z" /><path d="M16 17h4" /><path d="M4 13h4" /></g>,
    ticket: <g><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" /></g>,
    users: <g><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><path d="M16 3.128a4 4 0 0 1 0 7.744" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><circle cx="9" cy="7" r="4" /></g>,
    spark: <g><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" /><path d="M20 2v4" /><path d="M22 4h-4" /><circle cx="4" cy="20" r="2" /></g>,
    info: <g><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></g>,
    nav: <polygon points="3 11 22 2 13 21 11 13 3 11" />,
    bag: <g><path d="M16 10a4 4 0 0 1-8 0" /><path d="M3.103 6.034h17.794" /><path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z" /></g>,
    cart: <g><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></g>,
    tag: <g><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" /><circle cx="7.5" cy="7.5" r=".5" fill="currentColor" /></g>,
    plus: <g><path d="M5 12h14" /><path d="M12 5v14" /></g>,
    minus: <path d="M5 12h14" />,
    search: <g><path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" /></g>,
    ext: <g><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></g>,
    sliders: <g><path d="M10 5H3" /><path d="M12 19H3" /><path d="M14 3v4" /><path d="M16 17v4" /><path d="M21 12h-9" /><path d="M21 19h-5" /><path d="M21 5h-7" /><path d="M8 10v4" /><path d="M8 12H3" /></g>,
    chart: <g><path d="M3 3v16a2 2 0 0 0 2 2h16" /><path d="m19 9-5 5-4-4-3 3" /></g>,
    medal: <g><path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15" /><path d="M11 12 5.12 2.2" /><path d="m13 12 5.88-9.8" /><path d="M8 7h8" /><circle cx="12" cy="17" r="5" /><path d="M12 18v-2h-.5" /></g>
  };
  return <svg {...p}>{paths[props.name] || null}</svg>;
}

/* ---- Logo lockup ---- */
function Logo(props) {
  const size = props.size || 46;
  return (
    <a href="#/" className="logo" aria-label="All Star Bowl home"
       onClick={function (e) { e.preventDefault(); Router.go("/"); }}
       style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
      <img src="img/logo.png" alt="All Star Bowl" width={size} height={size}
           style={{ width: size, height: size, objectFit: "contain", filter: "drop-shadow(0 4px 10px rgba(0,0,0,.25))" }} />
      {!props.markOnly && (
        <span style={{ lineHeight: .92 }}>
          <span className="display" style={{ fontSize: size * 0.43, display: "block", letterSpacing: ".02em", color: props.light ? "var(--cream)" : "var(--navy-800)" }}>All Star Bowl</span>
          <span className="kicker" style={{ fontSize: size * 0.2, color: props.light ? "var(--blue-300)" : "var(--red-600)", letterSpacing: ".34em" }}>EAST INDY · EST. BOWLING</span>
        </span>
      )}
    </a>
  );
}

/* ---- Tiny router (hash-based) ---- */
const Router = (function () {
  const subs = new Set();
  function parse() { return (location.hash || "#/").replace(/^#/, "") || "/"; }
  function go(path) { if (location.hash !== "#" + path) location.hash = "#" + path; else subs.forEach(function (f) { f(parse()); }); window.scrollTo({ top: 0, behavior: "auto" }); }
  window.addEventListener("hashchange", function () { subs.forEach(function (f) { f(parse()); }); });
  return { parse: parse, go: go, sub(f) { subs.add(f); return function () { subs.delete(f); }; } };
})();

function useRoute() {
  const [route, setRoute] = useState(Router.parse());
  useEffect(function () { return Router.sub(setRoute); }, []);
  return route;
}

/* ---- Auth session (demo) — localStorage-backed; drives nav + account ----
   A LOCK, not an account system: in production Cloudflare Access authenticates
   (Google / email one-time code, no password) and the app trusts the verified
   email. Here we persist a simple signed-in flag so the nav + member area
   reflect a real session across pages and refresh. Member DATA still comes from
   window.ASB_DATA — this only tracks "are we signed in." */
const AuthStore = (function () {
  const KEY = "asb_auth";
  const subs = new Set();
  function read() { try { return JSON.parse(window.localStorage.getItem(KEY)) || null; } catch (e) { return null; } }
  let state = read();
  function notify() { subs.forEach(function (f) { f(state); }); }
  return {
    isAuthed: function () { return !!(state && state.authed); },
    signIn: function () { state = { authed: true, at: Date.now() }; try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} notify(); },
    signOut: function () { state = null; try { window.localStorage.removeItem(KEY); } catch (e) {} notify(); },
    sub: function (f) { subs.add(f); return function () { subs.delete(f); }; }
  };
})();
function useAuth() {
  const [a, setA] = useState(AuthStore.isAuthed());
  useEffect(function () { return AuthStore.sub(function () { setA(AuthStore.isAuthed()); }); }, []);
  return a;
}

/* ---- Account menu (nav dropdown) — swaps logged-out / logged-in ---- */
function AccountMenu() {
  const authed = useAuth();
  const route = useRoute();
  const [open, setOpen] = useState(false);
  useEffect(function () { setOpen(false); }, [route]);
  useEffect(function () {
    function onKey(e) { if (e.key === "Escape") setOpen(false); }
    if (open) window.addEventListener("keydown", onKey);
    return function () { window.removeEventListener("keydown", onKey); };
  }, [open]);
  const m = (window.ASB_DATA && window.ASB_DATA.getMember && window.ASB_DATA.getMember()) || null;
  const initial = (m && m.first ? m.first[0] : "A").toUpperCase();
  function goTab(tab) { window.__maInitialTab = tab; setOpen(false); Router.go("/account"); window.dispatchEvent(new CustomEvent("asb-matab", { detail: tab })); }
  function signOut() { AuthStore.signOut(); setOpen(false); Router.go("/"); }
  return (
    <div className="acctmenu">
      <button className={"acctmenu-btn" + (authed ? " authed" : "") + (open ? " open" : "")} aria-label="Account menu" aria-haspopup="true" aria-expanded={open} onClick={function () { setOpen(!open); }}>
        {authed ? <span className="acctmenu-avatar">{initial}</span> : <Icon name="user" size={20} />}
      </button>
      {open ? <div className="acctmenu-scrim" onClick={function () { setOpen(false); }}></div> : null}
      {open ? (
        <div className="acctmenu-pop" role="menu">
          {authed ? (
            <React.Fragment>
              <div className="acctmenu-head">
                <span className="acctmenu-avatar lg">{initial}</span>
                <span className="acctmenu-id"><strong>{m ? m.name : "Member"}</strong><span>{m ? m.email : ""}</span></span>
              </div>
              <button className="acctmenu-item" role="menuitem" onClick={function () { goTab("stats"); }}><Icon name="chart" size={17} /> My Stats</button>
              <button className="acctmenu-item" role="menuitem" onClick={function () { goTab("bag"); }}><Icon name="bag" size={17} /> My Bag</button>
              <button className="acctmenu-item" role="menuitem" onClick={function () { goTab("links"); }}><Icon name="trophy" size={17} /> Scores &amp; standings</button>
              <button className="acctmenu-item" role="menuitem" onClick={function () { goTab("settings"); }}><Icon name="sliders" size={17} /> Account settings</button>
              <div className="acctmenu-div"></div>
              <button className="acctmenu-item danger" role="menuitem" onClick={signOut}><Icon name="arrow" size={17} style={{ transform: "rotate(180deg)" }} /> Sign out</button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <button className="acctmenu-item strong" role="menuitem" onClick={function () { setOpen(false); Router.go("/login"); }}><Icon name="user" size={17} /> Sign in</button>
              <button className="acctmenu-item" role="menuitem" onClick={function () { setOpen(false); Router.go("/join"); }}><Icon name="star" size={17} fillStar /> Join the club &mdash; free</button>
              <button className="acctmenu-item" role="menuitem" onClick={function () { setOpen(false); Router.go("/account"); }}><Icon name="gift" size={17} /> Rewards &amp; perks</button>
              <div className="acctmenu-div"></div>
              <a className="acctmenu-item" role="menuitem" href="https://www.bowl.com/find-a-member" target="_blank" rel="noopener noreferrer" onClick={function () { setOpen(false); }}><Icon name="medal" size={17} /> Find my USBC average <Icon name="ext" size={13} className="acctmenu-ext" /></a>
              <button className="acctmenu-item" role="menuitem" onClick={function () { setOpen(false); Router.go("/scores"); }}><Icon name="chart" size={17} /> League standings</button>
            </React.Fragment>
          )}
        </div>
      ) : null}
    </div>
  );
}

/* ---- Mini live chip used in the nav ---- */
function NavStatusChip() {
  const s = useStatus();
  const cls = s.isOpen ? (s.level === "open" ? "s-open" : s.level === "limited" ? "s-limited" : "s-busy") : "s-closed";
  const label = s.isOpen ? (s.lanesOpen + " lanes open") : "Closed now";
  return (
    <button className="nav-status" onClick={function () { Router.go("/bowl"); }}>
      <span className={"dot " + cls} style={{ background: "currentColor" }}></span>
      <span className={cls} style={{ fontFamily: "var(--f-head)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", fontSize: ".8rem" }}>
        {s.isOpen ? "Open" : "Closed"}
      </span>
      <span style={{ color: "var(--cream)", opacity: .75, fontSize: ".82rem", fontWeight: 600 }}>· {label}</span>
    </button>
  );
}

/* ---- Pro-shop "My list" cart (lives in the nav; drawer drops under it) ---- */
function useCart() {
  const [, force] = useState(0);
  useEffect(function () {
    if (!window.WishStore) return;
    return window.WishStore.sub(function () { force(function (n) { return n + 1; }); });
  }, []);
  return window.WishStore || null;
}

function NavCart(props) {
  const cart = useCart();
  const count = cart ? cart.get().length : 0;
  if (count <= 0) return null;
  return (
    <button className={"nav-cart" + (props.open ? " open" : "")} aria-label={"My list, " + count + " item" + (count === 1 ? "" : "s")} aria-expanded={props.open} onClick={function () { props.setOpen(!props.open); }}>
      <Icon name="cart" size={20} />
      <span className="nav-cart-badge">{count}</span>
    </button>
  );
}

function CartDrawer(props) {
  const cart = useCart();
  const items = cart ? cart.get().map(function (id) { return window.PROSHOP ? window.PROSHOP.byId(id) : null; }).filter(Boolean) : [];
  useEffect(function () {
    function onKey(e) { if (e.key === "Escape") props.onClose(); }
    window.addEventListener("keydown", onKey);
    return function () { window.removeEventListener("keydown", onKey); };
  }, []);
  useEffect(function () { if (items.length === 0) props.onClose(); }, [items.length]);
  const estTotal = items.reduce(function (s, it) { return s + (it.price && it.price.sale ? it.price.sale : 0); }, 0);
  return (
    <React.Fragment>
      <div className="cart-scrim" onClick={props.onClose}></div>
      <div className="cart-drawer" role="dialog" aria-label="My list">
        <div className="cart-drawer-head">
          <span className="cart-drawer-title"><Icon name="cart" size={18} /> My list <span className="cart-drawer-n">{items.length}</span></span>
          <button className="cart-drawer-x" onClick={props.onClose} aria-label="Close"><Icon name="close" size={18} /></button>
        </div>
        <div className="cart-drawer-items">
          {items.map(function (it) {
            return (
              <div key={it.id} className="cart-row">
                {window.ProductArt ? React.createElement(window.ProductArt, { product: it, size: 42 }) : null}
                <div className="cart-row-info">
                  <span className="cart-row-name">{it.name}</span>
                  <span className="cart-row-price">{it.price && it.price.sale ? (it.price.estimate ? "est. " : "") + "$" + it.price.sale.toFixed(2) : "Ask us"}</span>
                </div>
                <button className="cart-row-x" aria-label={"Remove " + it.name} onClick={function () { cart.remove(it.id); }}><Icon name="close" size={15} /></button>
              </div>
            );
          })}
        </div>
        <div className="cart-drawer-foot">
          <div className="cart-est"><span>Estimate</span><strong>${estTotal.toFixed(2)}</strong></div>
          <p className="cart-est-note">Representative pricing — not a checkout. We fit &amp; drill in person.</p>
          <div className="cart-actions">
            <button className="btn btn-red btn-sm" onClick={function () { props.onClose(); if (window.ReserveStore) window.ReserveStore.open(null); }}><Icon name="mail" size={16} /> Reserve / ask the pro</button>
            <a className="btn btn-ghost btn-sm" style={{ color: "var(--navy-800)" }} href={ASB.BIZ.phoneHref}><Icon name="phone" size={15} /> Call</a>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

/* ---- Nav ---- */
const NAV_ITEMS = [
  { label: "Bowl", path: "/bowl", children: [
    { label: "Reservations", path: "/bowl", icon: "ball", desc: "Live lanes & booking" },
    { label: "Parties", path: "/parties", icon: "cake", desc: "Birthdays & events" },
    { label: "Cosmic Bowling", path: "/cosmic", icon: "spark", desc: "Glow nights & arcade" },
    { label: "Leagues & Youth", path: "/leagues", icon: "trophy", desc: "Schedules & sign-up" },
    { label: "Live Scores", path: "/scores", icon: "star", desc: "Standings & lanes" }
  ] },
  { label: "Eat", path: "/eat" },
  { label: "Specials", path: "/specials" },
  { label: "Rewards", path: "/account" },
  { label: "Contact", path: "/contact" }
];

function Nav(props) {
  const route = useRoute();
  const authed = useAuth();
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(function () {
    function onScroll() { setScrolled(window.scrollY > 24); }
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return function () { window.removeEventListener("scroll", onScroll); };
  }, []);
  useEffect(function () { setOpen(false); setCartOpen(false); }, [route]);

  /* Bowling-lane transition that lives behind the nav */
  const laneCanvas = useRef(null);
  const laneScene = useRef(null);
  useEffect(function () {
    if (!laneCanvas.current || !window.LaneScene) return;
    laneScene.current = new window.LaneScene(laneCanvas.current, {
      tilt: 3, speed: 1.25, ball: "navy", autoloop: false, compact: true, transparent: true
    });
    window.__navLane = laneScene.current;
    return function () { if (laneScene.current) laneScene.current.stop(); };
  }, []);

  function navTo(p) { Router.go(p); setOpen(false); setCartOpen(false); if (laneScene.current) laneScene.current.roll(); }
  const isActive = function (p) { return route === p || (p !== "/" && route.indexOf(p) === 0); };

  return (
    <header className={"nav" + (scrolled ? " nav--scrolled" : "")}>
      <canvas className="nav-lane" ref={laneCanvas} aria-hidden="true"></canvas>
      <div className="nav-inner wrap">
        <Logo light size={44} />
        <nav className="nav-links">
          {NAV_ITEMS.map(function (it) {
            if (it.children) {
              const gActive = it.children.some(function (c) { return isActive(c.path); });
              return (
                <div key={it.label} className="nav-group">
                  <button className={"nav-link nav-link--group" + (gActive ? " active" : "")} onClick={function () { navTo(it.path); }} aria-haspopup="true">
                    {it.label}<Icon name="chev" size={14} className="nav-caret" style={{ transform: "rotate(90deg)" }} />
                  </button>
                  <div className="nav-dropdown" role="menu">
                    {it.children.map(function (c) {
                      return (
                        <button key={c.path} role="menuitem" className={"nav-dd-item" + (isActive(c.path) ? " active" : "")} onClick={function () { navTo(c.path); }}>
                          <span className="nav-dd-ic"><Icon name={c.icon} size={18} /></span>
                          <span className="nav-dd-text"><strong>{c.label}</strong><span>{c.desc}</span></span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            }
            return <button key={it.path} className={"nav-link" + (isActive(it.path) ? " active" : "")} onClick={function () { navTo(it.path); }}>{it.label}</button>;
          })}
        </nav>
        <button className={"nav-shop" + (isActive("/proshop") ? " active" : "")} aria-label="Pro Shop" title="Pro Shop — balls, bags, shoes & drilling" onClick={function () { navTo("/proshop"); }}>
          <Icon name="bag" size={20} />
          <span className="nav-shop-label">Pro Shop</span>
        </button>
        <div className="nav-right">
          <a className="nav-phone" href={ASB.BIZ.phoneHref}><Icon name="phone" size={16} /> {ASB.BIZ.phone}</a>
          <button className="btn btn-red btn-sm" onClick={function () { navTo("/bowl"); }}>Reserve a Lane</button>
          <span className="nav-div" aria-hidden="true"></span>
          <NavCart open={cartOpen} setOpen={setCartOpen} />
          <AccountMenu />
          <button className="nav-burger" aria-label="Menu" onClick={function () { setOpen(!open); }}>
            <Icon name={open ? "close" : "menu"} size={24} />
          </button>
        </div>
      </div>
      <div className="nav-statusrow wrap"><NavStatusChip /></div>
      {cartOpen ? <CartDrawer onClose={function () { setCartOpen(false); }} /> : null}

      {open && (
        <div className="nav-sheet">
          {NAV_ITEMS.map(function (it) {
            if (it.children) {
              return (
                <React.Fragment key={it.label}>
                  <div className="nav-sheet-group">{it.label}</div>
                  {it.children.map(function (c) {
                    return <button key={c.path} className={"nav-sheet-link ns-child" + (isActive(c.path) ? " active" : "")} onClick={function () { navTo(c.path); }}><span className="ns-child-in"><Icon name={c.icon} size={16} /> {c.label}</span><Icon name="chev" size={18} /></button>;
                  })}
                </React.Fragment>
              );
            }
            return <button key={it.path} className={"nav-sheet-link" + (isActive(it.path) ? " active" : "")} onClick={function () { navTo(it.path); }}>{it.label}<Icon name="chev" size={18} /></button>;
          })}
          <button className={"nav-sheet-link ns-shop" + (isActive("/proshop") ? " active" : "")} onClick={function () { navTo("/proshop"); }}><span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}><Icon name="bag" size={18} /> Pro Shop</span><Icon name="chev" size={18} /></button>
          <div className="nav-sheet-group">Account</div>
          {authed ? (
            <React.Fragment>
              <button className="nav-sheet-link" onClick={function () { navTo("/account"); }}><span className="ns-child-in"><Icon name="user" size={16} /> My account</span><Icon name="chev" size={18} /></button>
              <button className="nav-sheet-link" onClick={function () { AuthStore.signOut(); navTo("/"); }}><span className="ns-child-in"><Icon name="arrow" size={16} style={{ transform: "rotate(180deg)" }} /> Sign out</span><Icon name="chev" size={18} /></button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <button className="nav-sheet-link" onClick={function () { navTo("/login"); }}><span className="ns-child-in"><Icon name="user" size={16} /> Sign in</span><Icon name="chev" size={18} /></button>
              <button className="nav-sheet-link" onClick={function () { navTo("/join"); }}><span className="ns-child-in"><Icon name="star" size={16} fillStar /> Join free</span><Icon name="chev" size={18} /></button>
            </React.Fragment>
          )}
          <a className="btn btn-red btn-lg" style={{ margin: "14px 4px 4px", justifyContent: "center" }} href={ASB.BIZ.phoneHref}><Icon name="phone" size={18} /> {ASB.BIZ.phone}</a>
        </div>
      )}
    </header>
  );
}

/* ---- Footer ---- */
function Footer() {
  const s = useStatus();
  return (
    <footer className="footer field-navy">
      <div className="footer-stripe stripes-bg"></div>
      <div className="wrap footer-grid">
        <div>
          <Logo light size={58} />
          <p style={{ marginTop: 18, maxWidth: 320, color: "rgba(245,241,230,.72)" }}>
            East-side Indy's home for bowling, a full sports bar, the Alley Cafe and a stocked pro shop. Family fun since the first frame.
          </p>
          <div className="footer-social">
            {["facebook", "instagram", "google"].map(function (n) {
              return <span key={n} className="footer-soc" title={n}><Icon name={n === "google" ? "map" : "star"} size={18} fillStar /></span>;
            })}
          </div>
        </div>
        <div>
          <h4 className="footer-h">Visit</h4>
          <ul className="footer-list">
            <li><Icon name="map" size={16} /> <span>{ASB.BIZ.address}</span></li>
            <li><Icon name="phone" size={16} /> <a href={ASB.BIZ.phoneHref}>{ASB.BIZ.phone}</a></li>
            <li><a className="footer-link" href={ASB.BIZ.maps} target="_blank" rel="noreferrer">Get directions →</a></li>
          </ul>
        </div>
        <div>
          <h4 className="footer-h">Explore</h4>
          <ul className="footer-list">
            {NAV_ITEMS.reduce(function (acc, it) { return acc.concat(it.children ? it.children : [it]); }, []).map(function (it) { return <li key={it.path + it.label}><button className="footer-link" onClick={function () { Router.go(it.path); }}>{it.label}</button></li>; })}
            <li><a className="footer-link" href={ASB.BIZ.standings} target="_blank" rel="noreferrer">League Standings ↗</a></li>
          </ul>
        </div>
        <div>
          <h4 className="footer-h">Right now</h4>
          <div className={"footer-status " + (s.isOpen ? "is-open" : "is-closed")}>
            <span className={"dot " + (s.isOpen ? "s-open" : "s-closed")} style={{ background: "currentColor" }}></span>
            <strong>{s.isOpen ? "Open now" : "Closed"}</strong>
          </div>
          <p style={{ color: "rgba(245,241,230,.72)", fontSize: ".92rem", marginTop: 8 }}>
            {s.isOpen
              ? (s.lanesOpen + " of " + s.total + " lanes open · closes " + ASB.fmtClock(s.todayHours.close))
              : (s.nextOpen ? ("Opens " + (s.nextOpen.day === "Today" ? "today" : s.nextOpen.day.toLowerCase()) + " at " + ASB.fmtClock(s.nextOpen.at)) : "See hours")}
          </p>
          <button className="btn btn-cream btn-sm" style={{ marginTop: 12 }} onClick={function () { Router.go("/bowl"); }}>Live lane status</button>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© {new Date().getFullYear()} All Star Bowl · {ASB.BIZ.cityState}</span>
        <span className="footer-legal">
          <button className="footer-link" onClick={function () { Router.go("/contact"); }}>Contact</button>
          <button className="footer-link" onClick={function () { Router.go("/terms"); }}>Terms of Use</button>
          <button className="footer-link" onClick={function () { Router.go("/privacy"); }}>Privacy</button>
        </span>
        <span className="footer-tag">{ASB.BIZ.tagline}</span>
      </div>
    </footer>
  );
}

Object.assign(window, {
  ClockStore, useStatus, useCountUp, useReveal, Icon, Logo, Router, useRoute,
  AuthStore, useAuth, AccountMenu,
  Nav, Footer, NavStatusChip, NAV_ITEMS
});
