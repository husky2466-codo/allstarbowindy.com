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
  const paths = {
    pin: <g><path d="M9 3c0 4 -1.5 7 -1.5 11a4.5 4.5 0 0 0 9 0c0 -4 -1.5 -7 -1.5 -11" /><path d="M9 3h6" /></g>,
    ball: <g><circle cx="12" cy="12" r="9" /><circle cx="9.5" cy="9" r="1" fill="currentColor" stroke="none" /><circle cx="12.4" cy="8.4" r="1" fill="currentColor" stroke="none" /><circle cx="11" cy="11" r="1" fill="currentColor" stroke="none" /></g>,
    phone: <path d="M4 5c0 8 7 15 15 15l0 -3.5 -4 -1.5 -2 2a11 11 0 0 1 -5 -5l2 -2 -1.5 -4 -3.5 0z" />,
    clock: <g><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></g>,
    cal: <g><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></g>,
    map: <g><path d="M12 21s7 -6 7 -11a7 7 0 1 0 -14 0c0 5 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></g>,
    star: <path d="M12 3.5l2.6 5.3 5.9 .8 -4.3 4.1 1 5.8 -5.2 -2.7 -5.2 2.7 1 -5.8 -4.3 -4.1 5.9 -.8z" fill={props.fillStar ? "currentColor" : "none"} />,
    trophy: <g><path d="M7 4h10v4a5 5 0 0 1 -10 0z" /><path d="M7 6H4a3 3 0 0 0 3 3M17 6h3a3 3 0 0 1 -3 3M9 20h6M12 13v3" /></g>,
    cake: <g><path d="M4 20h16v-7a2 2 0 0 0 -2 -2H6a2 2 0 0 0 -2 2z" /><path d="M4 15c2 1.4 3.5 1.4 4 .4 .6 1.2 2.4 1.2 3 0 .6 1.2 2.4 1.2 3 0 .5 1 2 1 4 -.4M12 6v3M12 4.5v.01" /></g>,
    pizza: <g><path d="M12 3c5 0 9 4 9 9L12 21z" /><circle cx="11" cy="11" r="1" fill="currentColor" stroke="none" /><circle cx="14.5" cy="14" r="1" fill="currentColor" stroke="none" /></g>,
    user: <g><circle cx="12" cy="8" r="4" /><path d="M5 21c0 -4 3.5 -6 7 -6s7 2 7 6" /></g>,
    chev: <path d="M9 6l6 6 -6 6" />,
    arrow: <path d="M5 12h14M13 6l6 6 -6 6" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="M6 6l12 12M18 6L6 18" />,
    check: <path d="M5 13l4 4 10 -11" />,
    mail: <g><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M4 7l8 6 8 -6" /></g>,
    bolt: <path d="M13 3L5 13h5l-1 8 8 -10h-5z" fill={props.fillStar ? "currentColor" : "none"} />,
    gift: <g><rect x="4" y="9" width="16" height="11" rx="1" /><path d="M4 13h16M12 9v11M12 9c-2 -4 -6 -3 -6 -.5 0 .3 .2 .5 .5 .5M12 9c2 -4 6 -3 6 -.5 0 .3 -.2 .5 -.5 .5" /></g>,
    fire: <path d="M12 3c1 3 4 4 4 8a4 4 0 0 1 -8 0c0 -1 .5 -2 1 -2.5C9 10 12 8 12 3z" />,
    beer: <g><path d="M6 8h9v11a2 2 0 0 1 -2 2H8a2 2 0 0 1 -2 -2z" /><path d="M15 10h2a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-2M9 4c1 1 0 2 1 3M12 4c1 1 0 2 1 3" /></g>,
    shoe: <path d="M3 9c1 0 2 .5 3 2 1.5 0 3 -1 4 -1 3 0 4 4 11 4 0 0 1 -3 -1 -4 -3 -1 -5 -2 -7 -4 -1 0 -2 1 -3 1 -1 0 -3 -1 -4 -1z" />,
    ticket: <g><path d="M4 8a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1 0 4 2 2 0 0 1 -2 2H6a2 2 0 0 1 -2 -2 2 2 0 0 0 0 -4 2 2 0 0 0 0 -4z" /><path d="M14 6v12" strokeDasharray="2 2.5" /></g>,
    users: <g><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0 -3.3 2.7 -5 6 -5s6 1.7 6 5" /><path d="M16 5.2A3.2 3.2 0 0 1 16 14M21 20c0 -3 -1.6 -4.4 -4 -4.8" /></g>,
    spark: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18" />,
    info: <g><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8v.01" /></g>,
    nav: <path d="M3 11l18 -8 -8 18 -2 -8z" />,
    bag: <g><path d="M5.5 8h13l-1 12.5a1 1 0 0 1 -1 .9H7.5a1 1 0 0 1 -1 -.9z" /><path d="M9 8V6.2a3 3 0 0 1 6 0V8" /><circle cx="12" cy="13" r="1.4" fill="currentColor" stroke="none" /></g>,
    cart: <g><circle cx="9" cy="20" r="1.5" /><circle cx="17.5" cy="20" r="1.5" /><path d="M3 4h2.2l1.8 11a1.2 1.2 0 0 0 1.2 1h7.4a1.2 1.2 0 0 0 1.2 -1L19 8H6.2" /></g>,
    tag: <g><path d="M4 12.5V5a1 1 0 0 1 1 -1h7.5L20 11.5a1.4 1.4 0 0 1 0 2L13 20.5a1.4 1.4 0 0 1 -2 0L4 13.5a1.4 1.4 0 0 1 -.4 -1z" /><circle cx="8" cy="8" r="1.3" fill="currentColor" stroke="none" /></g>,
    plus: <path d="M12 5v14M5 12h14" />,
    minus: <path d="M5 12h14" />
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
          <NavCart open={cartOpen} setOpen={setCartOpen} />
          <a className="nav-phone" href={ASB.BIZ.phoneHref}><Icon name="phone" size={16} /> {ASB.BIZ.phone}</a>
          <button className="btn btn-red btn-sm" onClick={function () { navTo("/bowl"); }}>Reserve a Lane</button>
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
  Nav, Footer, NavStatusChip, NAV_ITEMS
});
