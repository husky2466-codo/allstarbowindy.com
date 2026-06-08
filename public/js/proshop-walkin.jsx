/* ============================================================
   PRO SHOP — Walk-In simulation (Mode 2)
   An HONEST stylized walk-in: we don't have the real 360 panos
   (gitignored), so instead of faking a photo-sphere we build a
   designed scene-node tour from the real zone map (proshop-spec/01 §8):
       Front Door → New Arrivals Wall → Bags/Shoes/Accessories → Counter
   You "walk" between nodes; wall items are tap-to-open hotspots that
   mount the SAME shared ProductDetail used by the Standard grid.
   All motion is rAF-driven (CSS transitions freeze in preview).
   Reuses ProductArt / Badge / PriceBlock / useWishList from proshop.jsx.
   ============================================================ */

function WalkPriceTag(props) {
  const pr = props.product.price || {};
  if (pr.sale == null) return <span className="wk-tag">Ask us</span>;
  return <span className="wk-tag">{pr.estimate ? "est. " : ""}${pr.sale.toFixed(0)}</span>;
}

/* A single tap-to-open wall hotspot (ball or shelved item). */
function Hotspot(props) {
  const p = props.product;
  const wish = useWishList();
  const inList = wish.has(p.id);
  return (
    <button className={"wk-spot wk-spot--" + (p.art && p.art.kind === "ball" ? "ball" : "flat")} onClick={function () { props.onOpen(p.id); }}>
      <span className="wk-spot-art">
        <ProductArt product={p} size={props.size || 88} />
        {inList ? <span className="wk-spot-check"><Icon name="check" size={13} /></span> : null}
        <span className="wk-spot-ring" aria-hidden="true"></span>
      </span>
      <span className="wk-spot-info">
        <span className="wk-spot-name">{p.name}</span>
        <WalkPriceTag product={p} />
      </span>
    </button>
  );
}

/* ---- Per-node scene renderers ---- */
function NodeDoor(props) {
  return (
    <div className="wk-scene wk-door">
      <div className="wk-door-frame">
        <div className="wk-door-sign">
          <span className="wk-door-kick">Est. East Indy</span>
          <span className="display wk-door-name">All Star<br />Pro Shop</span>
          <span className="wk-door-stars">★ ★ ★ ★ ★</span>
        </div>
        <div className="wk-door-open">
          <span className="wk-door-mat">WELCOME</span>
        </div>
      </div>
      <button className="btn btn-red btn-lg wk-enter" onClick={function () { props.go(1); }}>
        Step inside <Icon name="arrow" size={19} />
      </button>
      <p className="wk-door-hint">You're walking in off the lanes. Head to the New Arrivals wall.</p>
    </div>
  );
}

function NodeBalls(props) {
  return (
    <div className="wk-scene wk-balls">
      <div className="wk-banner wk-banner--new">New Arrivals</div>
      <div className="wk-slatwall">
        {props.items.map(function (p) {
          return (
            <div key={p.id} className="wk-slot">
              <span className="wk-bracket" aria-hidden="true"></span>
              <Hotspot product={p} onOpen={props.onOpen} size={92} />
            </div>
          );
        })}
      </div>
      <p className="wk-floorhint"><Icon name="info" size={15} /> Tap any ball for specs, price and a fitting.</p>
    </div>
  );
}

function NodeBags(props) {
  const bags = props.items.filter(function (p) { return p.category === "bags"; });
  const shoes = props.items.filter(function (p) { return p.category === "shoes"; });
  const acc = props.items.filter(function (p) { return p.category === "accessories"; });
  return (
    <div className="wk-scene wk-bags">
      <div className="wk-zone-row">
        <div className="wk-shelf">
          <span className="wk-shelf-label">Shoe wall</span>
          <div className="wk-shelf-items">
            {shoes.map(function (p) { return <Hotspot key={p.id} product={p} onOpen={props.onOpen} size={70} />; })}
          </div>
        </div>
        <div className="wk-pegboard">
          <span className="wk-shelf-label">Accessory pegboard</span>
          <div className="wk-peg-items">
            {acc.map(function (p) { return <Hotspot key={p.id} product={p} onOpen={props.onOpen} size={60} />; })}
          </div>
        </div>
      </div>
      <div className="wk-bagfloor">
        <span className="wk-shelf-label">Bags on the floor</span>
        <div className="wk-shelf-items">
          {bags.map(function (p) { return <Hotspot key={p.id} product={p} onOpen={props.onOpen} size={78} />; })}
        </div>
      </div>
    </div>
  );
}

function NodeCounter(props) {
  return (
    <div className="wk-scene wk-counter">
      <div className="wk-monitors">
        <span className="wk-monitor">NOW DRILLING</span>
        <span className="wk-monitor">FIT · DRILL · PLUG</span>
      </div>
      <div className="wk-deskwrap">
        <div className="wk-services">
          {props.items.map(function (p) { return <Hotspot key={p.id} product={p} onOpen={props.onOpen} size={66} />; })}
        </div>
        <div className="wk-desk" aria-hidden="true"><span className="wk-desk-top"></span></div>
      </div>
      <div className="wk-counter-cta">
        <h3 className="display">This is where we fit you.</h3>
        <p>Measured span, custom drill, gear set aside — all at the counter. Send your list and we'll have it ready.</p>
        <button className="btn btn-red btn-lg" onClick={props.onReserve}><Icon name="phone" size={18} /> Reserve / ask the pro</button>
      </div>
    </div>
  );
}

/* ---- The Walk-In stage ---- */
function ProShopWalkIn(props) {
  const ref = useReveal();
  const [node, setNode] = React.useState(0);
  const [opacity, setOpacity] = React.useState(1);
  const raf = React.useRef(0);
  const tour = PROSHOP.TOUR;
  const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function go(i) {
    const next = Math.max(0, Math.min(tour.length - 1, i));
    if (next === node) return;
    if (reduce) { setNode(next); setOpacity(1); return; }
    // rAF cross-fade (CSS transitions are frozen in preview)
    cancelAnimationFrame(raf.current);
    const t0 = performance.now();
    function fade(t) {
      const p = Math.min(1, (t - t0) / 180);
      setOpacity(1 - p);
      if (p < 1) { raf.current = requestAnimationFrame(fade); }
      else {
        setNode(next);
        const t1 = performance.now();
        function fin(tt) {
          const q = Math.min(1, (tt - t1) / 220);
          setOpacity(q);
          if (q < 1) raf.current = requestAnimationFrame(fin);
        }
        raf.current = requestAnimationFrame(fin);
      }
    }
    raf.current = requestAnimationFrame(fade);
  }
  React.useEffect(function () { return function () { cancelAnimationFrame(raf.current); }; }, []);

  const cur = tour[node];
  const items = (cur.products || []).map(function (id) { return PROSHOP.byId(id); }).filter(Boolean);

  return (
    <section className="section section--tight" ref={ref}>
      <div className="wrap">
        <div className="wk reveal">
          {/* top bar: zone + minimap + exit */}
          <div className="wk-top">
            <div className="wk-zone">
              <span className="wk-zone-n">Zone {node + 1} / {tour.length}</span>
              <strong className="wk-zone-name">{cur.name}</strong>
              <span className="wk-zone-sub">{cur.sub}</span>
            </div>
            <div className="wk-map" role="tablist" aria-label="Shop zones">
              {tour.map(function (n, i) {
                return (
                  <button key={n.id} className={"wk-map-dot" + (i === node ? " active" : "") + (i < node ? " done" : "")}
                    title={n.name} aria-label={n.name} aria-selected={i === node} onClick={function () { go(i); }}>
                    <span>{i + 1}</span>
                  </button>
                );
              })}
            </div>
            <button className="wk-exit" onClick={function () { props.setMode("standard"); }}>
              <Icon name="menu" size={16} /> Exit to catalog
            </button>
          </div>

          {/* the scene */}
          <div className="wk-stage">
            <div className="wk-ceiling" aria-hidden="true"></div>
            <div className="wk-room" style={{ opacity: opacity }}>
              {node === 0 ? <NodeDoor go={go} /> : null}
              {node === 1 ? <NodeBalls items={items} onOpen={props.onOpen} /> : null}
              {node === 2 ? <NodeBags items={items} onOpen={props.onOpen} /> : null}
              {node === 3 ? <NodeCounter items={items} onOpen={props.onOpen} onReserve={function () { props.onOpen("service-drill-fit"); }} /> : null}
            </div>
            <div className="wk-carpet" aria-hidden="true"></div>

            {/* walk controls */}
            <button className="wk-walk wk-walk--prev" disabled={node === 0} onClick={function () { go(node - 1); }} aria-label="Walk back">
              <Icon name="chev" size={26} style={{ transform: "rotate(180deg)" }} />
            </button>
            <button className="wk-walk wk-walk--next" disabled={node === tour.length - 1} onClick={function () { go(node + 1); }} aria-label="Walk forward">
              <Icon name="chev" size={26} />
            </button>
          </div>

          {/* caption */}
          <div className="wk-caption">
            <p>{cur.blurb}</p>
            <div className="wk-caption-nav">
              <button className="wk-cap-btn" disabled={node === 0} onClick={function () { go(node - 1); }}>← {node > 0 ? tour[node - 1].name : ""}</button>
              <button className="wk-cap-btn wk-cap-btn--next" disabled={node === tour.length - 1} onClick={function () { go(node + 1); }}>{node < tour.length - 1 ? tour[node + 1].name : ""} →</button>
            </div>
          </div>

          <p className="wk-disclaimer"><Icon name="info" size={14} /> A stylized walk-through of the real shop layout. {PROSHOP.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { ProShopWalkIn, Hotspot });
