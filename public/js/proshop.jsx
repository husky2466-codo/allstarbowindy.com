/* ============================================================
   PRO SHOP — shared pieces + Standard catalog (Mode 1)
   - Wish-list store (localStorage, no checkout)
   - Shared ProductArt, PriceBlock, Term tooltip
   - Shared ProductDetail (PDP) used by BOTH modes
   - ReserveSheet (mailto inquiry, phone-first)
   - ProShopPage shell + mode toggle (Standard ⇄ Walk-In)
   The Walk-In sim (Mode 2) lives in proshop-walkin.jsx and reuses
   the shared renderers exported here.
   ============================================================ */

/* ---------- Wish-list store (mock; persists in localStorage) ---------- */
const WishStore = (function () {
  const KEY = "asb_proshop_list";
  let ids = [];
  try { ids = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { ids = []; }
  const subs = new Set();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch (e) {} subs.forEach(function (f) { f(); }); }
  return {
    get() { return ids.slice(); },
    has(id) { return ids.indexOf(id) >= 0; },
    add(id) { if (ids.indexOf(id) < 0) { ids.push(id); save(); } },
    remove(id) { const i = ids.indexOf(id); if (i >= 0) { ids.splice(i, 1); save(); } },
    toggle(id) { if (this.has(id)) this.remove(id); else this.add(id); },
    clear() { ids = []; save(); },
    sub(f) { subs.add(f); return function () { subs.delete(f); }; }
  };
})();

function useWishList() {
  const [, force] = React.useState(0);
  React.useEffect(function () { return WishStore.sub(function () { force(function (n) { return n + 1; }); }); }, []);
  return WishStore;
}

/* ---------- Product art (CSS balls + flat tiles) ---------- */
function ProductArt(props) {
  const p = props.product, art = p.art || { kind: "flat", c1: "#1b3a8f", c2: "#f5f1e6" };
  const size = props.size || 132;
  if (art.kind === "ball") {
    const holes = [
      { x: 50, y: 30, r: 5.2 }, { x: 43, y: 40, r: 5 }, { x: 57, y: 40, r: 5 }
    ];
    return (
      <div className="ps-ball" style={{ width: size, height: size }}>
        <div className="ps-ball-sphere" style={{
          background: "radial-gradient(circle at 34% 30%, " + art.c3 + " 0%, " + art.c1 + " 42%, " + art.c2 + " 100%)"
        }}>
          <span className="ps-ball-gloss"></span>
          {holes.map(function (h, i) {
            return <span key={i} className="ps-ball-hole" style={{ left: h.x + "%", top: h.y + "%", width: h.r * 2 + "%", height: h.r * 2 + "%" }}></span>;
          })}
        </div>
      </div>
    );
  }
  // flat tile for bags / shoes / accessories / services
  const icon = p.category === "bags" ? "gift" : p.category === "shoes" ? "shoe" : p.category === "services" ? "info" : "spark";
  return (
    <div className="ps-flat" style={{ width: size, height: size, background: "linear-gradient(150deg, " + art.c1 + ", " + (art.c2) + ")" }}>
      <span className="ps-flat-ic" style={{ color: art.c2 === "#f5f1e6" || art.c2 === "#eef1f6" || art.c2 === "#36e6d8" || art.c2 === "#f5b423" ? art.c2 : "#f5f1e6" }}>
        <Icon name={icon} size={Math.round(size * 0.34)} />
      </span>
    </div>
  );
}

/* ---------- Price block (struck list + sale + SAVE%) ---------- */
function PriceBlock(props) {
  const pr = props.price || {}, big = props.big;
  if (pr.sale == null) return null;
  const est = pr.estimate;
  const save = (pr.list && pr.list > pr.sale) ? Math.round((1 - pr.sale / pr.list) * 100) : 0;
  return (
    <div className={"ps-price" + (big ? " ps-price--big" : "")}>
      {pr.list ? <span className="ps-price-list">${pr.list.toFixed(2)}</span> : null}
      <span className="ps-price-sale">{est ? <small className="ps-est">est.</small> : null}${pr.sale.toFixed(2)}{pr.unit ? <small className="ps-unit"> {pr.unit}</small> : null}</span>
      {save > 0 ? <span className="ps-save">Save {save}%</span> : null}
    </div>
  );
}

/* ---------- Glossary term tooltip ---------- */
function Term(props) {
  const def = PROSHOP.GLOSSARY[props.name];
  if (!def) return <span>{props.children}</span>;
  return (
    <span className="ps-term" tabIndex={0}>
      {props.children}
      <span className="ps-term-pop" role="tooltip">{def}</span>
    </span>
  );
}

/* ---------- Badge pill ---------- */
function Badge(props) {
  const b = props.badge;
  if (!b) return null;
  const map = { NEW: "ps-b-new", DEAL: "ps-b-deal", USED: "ps-b-used", CLOSEOUT: "ps-b-close" };
  const label = b === "NEW" ? "New Arrival" : b === "DEAL" ? "Hot Deal" : b === "CLOSEOUT" ? "Closeout" : "Used";
  return <span className={"ps-badge " + (map[b] || "ps-b-new")}>{label}</span>;
}

/* ---------- Shared Product Detail (PDP) — used by BOTH modes ---------- */
function ProductDetail(props) {
  const p = props.product;
  const wish = useWishList();
  React.useEffect(function () {
    document.body.style.overflow = "hidden";
    function onKey(e) { if (e.key === "Escape") props.onClose(); }
    window.addEventListener("keydown", onKey);
    return function () { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, []);
  if (!p) return null;
  const inList = wish.has(p.id);
  const isService = p.category === "services";
  const cross = (p.crossSell || []).map(function (id) { return PROSHOP.byId(id); }).filter(Boolean);
  const specKeys = Object.keys(p.specs || {});

  function reserve() { props.onClose(); props.onReserve && props.onReserve(p.id); }

  return (
    <div className="ps-modal" onMouseDown={function (e) { if (e.target === e.currentTarget) props.onClose(); }}>
      <div className="ps-modal-card" role="dialog" aria-modal="true" aria-label={p.name}>
        <button className="ps-modal-x" onClick={props.onClose} aria-label="Close"><Icon name="close" size={20} /></button>
        <div className="ps-pdp">
          <div className="ps-pdp-art">
            <ProductArt product={p} size={232} />
            <Badge badge={p.badge} />
            {p.colorNote ? <span className="ps-pdp-colornote">{p.colorNote}</span> : null}
          </div>
          <div className="ps-pdp-body">
            <div className="ps-pdp-head">
              <span className="ps-pdp-brand">{p.brand && p.brand !== "—" ? p.brand : "All Star Bowl"}</span>
              <h2 className="display ps-pdp-name">{p.name}</h2>
              <p className="ps-pdp-tag">{p.tagline}</p>
            </div>
            {isService ? (
              <div className="ps-svc-price">{p.price && p.price.sale ? <span><small className="ps-est">from est.</small> ${p.price.sale.toFixed(2)} <small>{p.price.unit}</small></span> : "Ask at the counter"}</div>
            ) : (p.askPrice || !(p.price && p.price.sale != null)) ? (
              <div className="ps-ask-price">Ask at counter — confirmed on reservation</div>
            ) : <PriceBlock price={p.price} big />}
            <p className="ps-pdp-blurb">{p.blurb}</p>
            {p.bestFor ? <p className="ps-pdp-best"><strong>Best for:</strong> {p.bestFor}</p> : null}

            {specKeys.length ? (
              <table className="ps-spec">
                <tbody>
                  {specKeys.map(function (k) {
                    return <tr key={k}><th>{k}</th><td>{p.specs[k]}</td></tr>;
                  })}
                </tbody>
              </table>
            ) : null}

            {p.fitNote ? (
              <div className="ps-fitnote">
                <span className="ps-fitnote-ic"><Icon name="spark" size={18} /></span>
                <span>{p.fitNote}</span>
              </div>
            ) : null}
            {p.careNote ? <p className="ps-care"><Icon name="info" size={15} /> {p.careNote}</p> : null}

            {p.glossaryTerms && p.glossaryTerms.length ? (
              <div className="ps-terms">
                <span className="ps-terms-label">Bowling-speak:</span>
                {p.glossaryTerms.map(function (t, i) {
                  return <React.Fragment key={t}><Term name={t}>{t.replace(/-/g, " ")}</Term>{i < p.glossaryTerms.length - 1 ? <span className="ps-terms-dot">·</span> : null}</React.Fragment>;
                })}
              </div>
            ) : null}

            <div className="ps-pdp-actions">
              <button className={"btn " + (inList ? "btn-ghost" : "btn-red") + " btn-lg"} style={inList ? { color: "var(--navy-800)" } : null} onClick={function () { wish.toggle(p.id); }}>
                <Icon name={inList ? "check" : "plus"} size={18} /> {inList ? "On your list" : "Add to list"}
              </button>
              <button className="btn btn-blue btn-lg" onClick={reserve}><Icon name="phone" size={17} /> Reserve / ask the pro</button>
            </div>

            {cross.length ? (
              <div className="ps-cross">
                <span className="ps-cross-label">Goes with</span>
                <div className="ps-cross-row">
                  {cross.map(function (c) {
                    return (
                      <button key={c.id} className="ps-cross-chip" onClick={function () { props.onOpen && props.onOpen(c.id); }}>
                        <ProductArt product={c} size={40} />
                        <span>{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Reserve / Ask sheet (mailto, phone-first, NO checkout) ---------- */
function ReserveSheet(props) {
  const wish = useWishList();
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [note, setNote] = React.useState("");
  const [err, setErr] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const items = (props.ids || wish.get()).map(function (id) { return PROSHOP.byId(id); }).filter(Boolean);

  React.useEffect(function () {
    document.body.style.overflow = "hidden";
    function onKey(e) { if (e.key === "Escape") props.onClose(); }
    window.addEventListener("keydown", onKey);
    return function () { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, []);

  function submit(e) {
    e.preventDefault();
    if (!name.trim()) { setErr("Please add your name."); return; }
    if (!phone.replace(/\D/g, "").match(/\d{7,}/)) { setErr("A phone number lets the shop call you back."); return; }
    const lines = items.map(function (it) {
      const pr = it.price && it.price.sale ? ("$" + it.price.sale.toFixed(2) + (it.price.estimate ? " est." : "")) : "";
      return "• " + it.name + (it.brand && it.brand !== "—" ? " (" + it.brand + ")" : "") + (pr ? " — " + pr : "");
    });
    const body = [
      "Pro Shop reservation / question from the website",
      "",
      "Name: " + name,
      "Phone: " + phone,
      email ? "Email: " + email : null,
      "",
      items.length ? "Items I'm interested in:" : "Items: (none selected — general question)",
      items.length ? lines.join("\n") : null,
      "",
      note ? "Note: " + note : null,
      "",
      "(Estimate only — I understand this is not an order.)"
    ].filter(function (x) { return x != null; }).join("\n");
    const subject = "Pro Shop reservation — " + name;
    window.location.href = ASB.BIZ.emailHref + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    setSent(true);
  }

  const estTotal = items.reduce(function (s, it) { return s + (it.price && it.price.sale ? it.price.sale : 0); }, 0);

  return (
    <div className="ps-modal" onMouseDown={function (e) { if (e.target === e.currentTarget) props.onClose(); }}>
      <div className="ps-modal-card ps-reserve" role="dialog" aria-modal="true" aria-label="Reserve or ask the pro shop">
        <button className="ps-modal-x" onClick={props.onClose} aria-label="Close"><Icon name="close" size={20} /></button>
        {sent ? (
          <div className="ps-sent">
            <span className="ps-sent-ic"><Icon name="check" size={34} /></span>
            <h2 className="display">Request sent</h2>
            <p>Your mail app should be open with everything filled in. Hit send and the shop will call you back — usually same day they're open.</p>
            <p className="ps-sent-or">Mail app didn't open? Just call us:</p>
            <a className="btn btn-red btn-lg" href={ASB.BIZ.phoneHref}><Icon name="phone" size={18} /> {ASB.BIZ.phone}</a>
            <button className="btn btn-ghost" style={{ color: "var(--navy-800)", marginTop: 10 }} onClick={props.onClose}>Close</button>
          </div>
        ) : (
          <form className="ps-reserve-form" onSubmit={submit}>
            <span className="kicker" style={{ color: "var(--red-600)" }}>Reserve / ask the pro shop</span>
            <h2 className="display ps-reserve-title">No checkout — we fit it in person.</h2>
            <p className="ps-reserve-lead">Send your list and we'll set the gear aside, measure your hand, and drill it to fit. <strong>This is a request, not an order.</strong></p>

            {items.length ? (
              <div className="ps-reserve-items">
                {items.map(function (it) {
                  return (
                    <div key={it.id} className="ps-reserve-item">
                      <ProductArt product={it} size={40} />
                      <span className="ps-ri-name">{it.name}</span>
                      <span className="ps-ri-price">{it.price && it.price.sale ? (it.price.estimate ? "est. " : "") + "$" + it.price.sale.toFixed(2) : "—"}</span>
                    </div>
                  );
                })}
                <div className="ps-reserve-total"><span>Estimate</span><strong>${estTotal.toFixed(2)}</strong></div>
                <p className="ps-reserve-disc">Estimate only — representative pricing, not a checkout total.</p>
              </div>
            ) : (
              <p className="ps-reserve-empty">No items selected — that's fine. Ask us anything below.</p>
            )}

            <div className="ps-field-row">
              <label className="ps-field"><span>Name *</span><input value={name} onChange={function (e) { setName(e.target.value); }} placeholder="Your name" /></label>
              <label className="ps-field"><span>Phone *</span><input value={phone} onChange={function (e) { setPhone(e.target.value); }} placeholder="(317) 000-0000" inputMode="tel" /></label>
            </div>
            <label className="ps-field"><span>Email (optional)</span><input value={email} onChange={function (e) { setEmail(e.target.value); }} placeholder="you@email.com" inputMode="email" /></label>
            <label className="ps-field"><span>Anything to add? (optional)</span><textarea value={note} onChange={function (e) { setNote(e.target.value); }} rows={2} placeholder="Hand size, weight you bowl, when you'd come in…" /></label>

            {err ? <p className="ps-err">{err}</p> : null}
            <div className="ps-reserve-actions">
              <button type="submit" className="btn btn-red btn-lg"><Icon name="mail" size={18} /> Send request</button>
              {items.length ? (
                <button type="button" className="btn btn-ghost btn-lg" style={{ color: "var(--navy-800)" }}
                  onClick={function () { window.print(); }}><Icon name="info" size={17} /> Print reservation</button>
              ) : null}
              <a className="btn btn-ghost btn-lg" style={{ color: "var(--navy-800)" }} href={ASB.BIZ.phoneHref}><Icon name="phone" size={17} /> Or call the shop</a>
            </div>

            {/* Print-only reservation sheet (hidden on screen; @media print reveals it) */}
            <div className="ps-print-sheet" aria-hidden="true">
              <div className="ps-print-head">
                <strong>All Star Bowl — Pro Shop reservation</strong>
                <span>{ASB.BIZ.address}</span>
                <span>{ASB.BIZ.phone} · {ASB.BIZ.email}</span>
              </div>
              <p className="ps-print-note">This is a reservation request, not a purchase. Pricing and availability are confirmed at the counter.</p>
              <table className="ps-print-list">
                <thead><tr><th>Item</th><th>Brand</th><th>Specs</th><th>Price</th></tr></thead>
                <tbody>
                  {items.map(function (it) {
                    var sp = it.specs || {};
                    var specStr = [sp.Coverstock, sp.Core, sp.RG ? "RG " + sp.RG : null, sp.Differential ? "Diff " + sp.Differential : null]
                      .filter(Boolean).join(" · ");
                    var pr = it.price && it.price.sale != null ? "$" + it.price.sale.toFixed(2) + (it.price.estimate ? " est." : "") : "Ask at counter";
                    return (
                      <tr key={it.id}>
                        <td>{it.name}</td>
                        <td>{it.brand && it.brand !== "—" ? it.brand : ""}</td>
                        <td>{specStr}</td>
                        <td>{pr}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="ps-print-foot">Name: {name || "____________"} · Phone: {phone || "____________"}{email ? " · " + email : ""}</p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ---------- Standard catalog: product card ---------- */
function ProductCard(props) {
  const p = props.product;
  const wish = useWishList();
  const inList = wish.has(p.id);
  return (
    <article className="ps-card reveal" onClick={function () { props.onOpen(p.id); }} tabIndex={0}
      onKeyDown={function (e) { if (e.key === "Enter") props.onOpen(p.id); }}>
      <div className="ps-card-art">
        <ProductArt product={p} size={150} />
        <Badge badge={p.badge} />
      </div>
      <div className="ps-card-body">
        <div className="ps-card-brand">{p.brand && p.brand !== "—" ? p.brand : "\u00A0"}</div>
        <h3 className="ps-card-name">{p.name}</h3>
        <div className="ps-card-spec">{p.specLine}</div>
        <div className="ps-card-foot">
          {p.category === "services"
            ? <span className="ps-card-svc">{p.price && p.price.sale ? "from est. $" + p.price.sale.toFixed(0) : "Ask us"}</span>
            : (p.askPrice || !(p.price && p.price.sale != null))
              ? <span className="ps-card-ask">Ask at counter</span>
              : <PriceBlock price={p.price} />}
          <button className={"ps-add" + (inList ? " on" : "")} aria-label={inList ? "On your list" : "Add to list"}
            onClick={function (e) { e.stopPropagation(); wish.toggle(p.id); }}>
            <Icon name={inList ? "check" : "plus"} size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}

/* ---------- Standard catalog grid (Mode 1) ---------- */
function StandardShop(props) {
  const ref = useReveal();
  const [cat, setCat] = React.useState("all");
  const [ballFilter, setBallFilter] = React.useState("all");
  let items = PROSHOP.PRODUCTS.filter(function (p) { return cat === "all" ? true : p.category === cat; });
  if (cat === "balls" && ballFilter !== "all") {
    items = items.filter(function (p) { return p.badge === ballFilter || (ballFilter === "USED" && p.subcategory === "used"); });
  }
  return (
    <section className="section section--tight" ref={ref}>
      <div className="wrap">
        <div className="ps-catbar reveal">
          {PROSHOP.CATEGORIES.map(function (c) {
            return (
              <button key={c.key} className={"ps-cat" + (cat === c.key ? " active" : "")} onClick={function () { setCat(c.key); setBallFilter("all"); }}>
                <Icon name={c.icon} size={17} /> {c.label}
              </button>
            );
          })}
        </div>
        {cat === "balls" ? (
          <div className="ps-subbar reveal">
            {PROSHOP.BALL_FILTERS.map(function (f) {
              return <button key={f.key} className={"ps-sub" + (ballFilter === f.key ? " active" : "")} onClick={function () { setBallFilter(f.key); }}>{f.label}</button>;
            })}
          </div>
        ) : null}
        <div className="ps-grid">
          {items.map(function (p) { return <ProductCard key={p.id} product={p} onOpen={props.onOpen} />; })}
        </div>
        <p className="ps-disclaimer reveal"><Icon name="info" size={15} /> {PROSHOP.disclaimer}</p>
      </div>
    </section>
  );
}

/* ---------- Pro Shop hero + mode toggle ---------- */
function ProShopHero(props) {
  const ref = useReveal();
  return (
    <section className="bowlhero field-navy ps-hero" ref={ref}>
      <div className="halftone bowlhero-tex"></div>
      <div className="ps-hero-carpet" aria-hidden="true"></div>
      <div className="wrap">
        <div className="page-head reveal">
          <span className="kicker" style={{ color: "var(--blue-300)" }}>Balls · Bags · Shoes · Drilling</span>
          <h1 className="display page-title">The All Star Pro Shop.</h1>
          <p className="page-lead">Walls of reactive balls, Vise bags, performance shoes and the accessories that keep them rolling — plus in-house fitting and drilling. Browse the catalog, or take a walk through the real shop.</p>
          <div className="ps-mode-toggle reveal reveal-d1" role="tablist">
            <button role="tab" aria-selected={props.mode === "standard"} className={"ps-mode" + (props.mode === "standard" ? " active" : "")} onClick={function () { props.setMode("standard"); }}>
              <Icon name="menu" size={18} /> Browse catalog
            </button>
            <button role="tab" aria-selected={props.mode === "walkin"} className={"ps-mode" + (props.mode === "walkin" ? " active" : "")} onClick={function () { props.setMode("walkin"); }}>
              <Icon name="nav" size={18} /> Walk-in shop <span className="ps-mode-tag">3D</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Pro Shop hours + visit footer band ---------- */
function ProShopVisit() {
  const ref = useReveal();
  const today = new Date().getDay(); // 0=Sun
  const idx = today === 0 ? 6 : today - 1; // HOURS array is Mon..Sun
  return (
    <section className="section ps-visit field-navy" ref={ref}>
      <div className="halftone bowlhero-tex"></div>
      <div className="wrap ps-visit-grid reveal">
        <div className="ps-visit-copy">
          <span className="kicker" style={{ color: "var(--blue-300)" }}>Come get fitted</span>
          <h2 className="display ps-visit-title">A ball isn't bought — it's fitted.</h2>
          <p>Pick what you like here, then come in. We measure your span and pitch and drill it to your exact hand — that's the part that actually makes you bowl better. Walk in during shop hours or call ahead.</p>
          <div className="hero-cta" style={{ marginTop: 20 }}>
            <a className="btn btn-red btn-lg" href={ASB.BIZ.phoneHref}><Icon name="phone" size={18} /> {ASB.BIZ.phone}</a>
            <a className="btn btn-ghost btn-lg" style={{ color: "var(--cream)" }} href={ASB.BIZ.maps} target="_blank" rel="noreferrer"><Icon name="map" size={18} /> Directions</a>
          </div>
        </div>
        <div className="ps-hours">
          <h3 className="ps-hours-h">Pro Shop hours</h3>
          <ul className="ps-hours-list">
            {PROSHOP.HOURS.map(function (h, i) {
              return (
                <li key={h.day} className={i === idx ? "is-today" : ""}>
                  <span className="ps-hd">{h.day}</span>
                  <span className="ps-ht">{h.open ? (h.open + " – " + h.close) : "Closed"}</span>
                </li>
              );
            })}
          </ul>
          <p className="ps-hours-note">Shop hours differ from lane hours. Drilling by walk-in or appointment.</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Global reserve store + host ----------
   Lets the nav cart drawer (and the PDP) open the ReserveSheet from
   anywhere. <ReserveHost/> is mounted once globally in app.jsx. */
const ReserveStore = (function () {
  let ids = null, isOpen = false;
  const subs = new Set();
  function emit() { subs.forEach(function (f) { f(); }); }
  return {
    open(list) { ids = list || null; isOpen = true; emit(); },
    close() { isOpen = false; emit(); },
    getOpen() { return isOpen; },
    getIds() { return ids; },
    sub(f) { subs.add(f); return function () { subs.delete(f); }; }
  };
})();

function ReserveHost() {
  const [, force] = React.useState(0);
  React.useEffect(function () { return ReserveStore.sub(function () { force(function (n) { return n + 1; }); }); }, []);
  if (!ReserveStore.getOpen()) return null;
  return <ReserveSheet ids={ReserveStore.getIds()} onClose={function () { ReserveStore.close(); }} />;
}

/* ---------- Page root ---------- */
function ProShopPage() {
  const [mode, setMode] = React.useState("standard");
  const [openId, setOpenId] = React.useState(null);
  useWishList();

  function openProduct(id) { setOpenId(id); }
  function reserveOne(id) { ReserveStore.open([id]); }

  const openProd = openId ? PROSHOP.byId(openId) : null;

  return (
    <main className="ps-page">
      <ProShopHero mode={mode} setMode={setMode} />

      {mode === "standard"
        ? <StandardShop onOpen={openProduct} />
        : <ProShopWalkIn onOpen={openProduct} setMode={setMode} />}

      <ProShopVisit />

      {openProd ? (
        <ProductDetail
          product={openProd}
          onClose={function () { setOpenId(null); }}
          onOpen={function (id) { setOpenId(id); }}
          onReserve={reserveOne}
        />
      ) : null}
    </main>
  );
}

Object.assign(window, {
  WishStore, useWishList, ProductArt, PriceBlock, Term, Badge,
  ProductDetail, ReserveSheet, ProductCard, StandardShop, ProShopPage,
  ReserveStore, ReserveHost
});
