/* ============================================================
   EAT & DRINK PAGE — real HTML menu + flyer showcase + lounge
   ============================================================ */

const MENU = {
  pizzas: {
    title: "Create-Your-Own Pizza", note: "Small 10\" / Large 14\"",
    items: [
      { n: "Cheese", s: "5.05", l: "13.53" },
      { n: "1 Topping", s: "6.05", l: "15.63" },
      { n: "Additional toppings", s: "1.00", l: "2.10" },
      { n: "2nd large pizza (cheese or 1-topping)", s: "", l: "9.17" }
    ],
    foot: "Meats: pepperoni, sausage, ham, bacon, chicken · Veggies: mushroom, onion, green pepper, black olive, banana pepper, pineapple, jalapeño · Double cheese crust +$4"
  },
  specialty: {
    title: "Specialty Pizzas", note: "Small 10\" / Large 14\"",
    items: [
      { n: "Sloppy Joe Pizza", s: "8.25", l: "18.34" },
      { n: "All Meats", s: "8.25", l: "19.26" },
      { n: "Veggie Deluxe", s: "8.25", l: "19.26" },
      { n: "Supreme", s: "8.72", l: "20.64" }
    ]
  },
  premium: {
    title: "Premium Specialty", note: "Large only",
    items: [
      { n: "BBQ Bacon", l: "18.80" },
      { n: "Bacon Delight", l: "18.80" },
      { n: "Chicken Bacon Ranch", l: "21.55" },
      { n: "Mega Bacon Delight", l: "21.55" },
      { n: "Mega Pepperoni", l: "22.25" }
    ]
  },
  breads: {
    title: "Calzones & Breads", note: "",
    items: [
      { n: "10\" Calzone (up to 3 fillings)", p: "11.69" },
      { n: "Stuffed Breadsticks (3 pc)", p: "7.11" },
      { n: "Garlic Cheese Bread", p: "8.94" },
      { n: "Bacon Cheese Bread", p: "10.09" },
      { n: "Pepperoni Cheese Bread", p: "10.09" },
      { n: "Nacho Bacon Cheese Bread", p: "10.09" }
    ]
  },
  entrees: {
    title: "Entrées", note: "Add small fries +$2.52 or side salad +$3.49",
    items: [
      { n: "BLT", p: "5.77" }, { n: "Hot Dog", p: "4.59" }, { n: "Mini Corn Dogs (8)", p: "5.04" },
      { n: "Barbeque", p: "6.19" }, { n: "Chicken Fingers (5)", p: "6.88" }, { n: "Sloppy Joe", p: "5.04" },
      { n: "Grilled Cheese", p: "4.59" }, { n: "Hamburger", p: "8.49" }, { n: "Cheeseburger", p: "9.00" },
      { n: "Double Burger", p: "14.00" }, { n: "Double Cheeseburger", p: "15.00" }
    ]
  },
  sides: {
    title: "Sides & Snacks", note: "",
    items: [
      { n: "Small Fries", p: "3.21" }, { n: "Large Fries", p: "5.96" }, { n: "Nachos & Cheese", p: "5.73" },
      { n: "Mozzarella Sticks (4)", p: "5.05" }, { n: "Soft Pretzel", p: "4.13" },
      { n: "Specialty Fries (bacon cheese or garlic parm)", p: "8.71" }
    ]
  }
};

/* Every menu flyer the venue uploaded — single source of truth for the
   hero slideshow AND the static gallery at the bottom of the page. */
const MENU_FLYERS = [
  { src: "img/menu/mega-pepperoni.jpg", label: "Mega Pepperoni", tag: "Fan fave" },
  { src: "img/menu/specialty-pizzas.jpg", label: "Specialty Pizzas", tag: "" },
  { src: "img/menu/create-your-own.png", label: "Create-Your-Own Pizza", tag: "" },
  { src: "img/menu/chicken-wings.png", label: "Bone-In Wings", tag: "New" },
  { src: "img/menu/waffle-sandwiches.png", label: "Waffle Breakfast Sandwiches", tag: "New" },
  { src: "img/menu/mozzarella-sticks.jpg", label: "Mozzarella Sticks", tag: "New" },
  { src: "img/menu/nacho-bacon-cheesebread.jpg", label: "Nacho Bacon Cheesebread", tag: "Fan fave" },
  { src: "img/menu/cheesebreads.png", label: "Garlic Cheese Breads", tag: "" },
  { src: "img/menu/calzones.png", label: "Huge 10\" Calzones", tag: "" },
  { src: "img/menu/pretzel-bites.jpg", label: "Pretzel Bites", tag: "" },
  { src: "img/menu/entrees-sides.png", label: "Entrées & Sides", tag: "" },
  { src: "img/menu/salads.png", label: "Fresh Salads", tag: "" },
  { src: "img/menu/dessert-pizza.png", label: "Dessert Pizza", tag: "Sweet" },
  { src: "img/menu/donuts.png", label: "Fresh Donuts", tag: "Sweet" }
];

/* Auto-rotating hero slideshow. Crossfade is driven by requestAnimationFrame
   (not a CSS transition) so it animates correctly in the frozen-transition
   preview; opacity is set inline per layer so the active flyer is always shown. */
function EatHeroSlideshow() {
  const n = MENU_FLYERS.length;
  const [cur, setCur] = React.useState(0);
  const [prev, setPrev] = React.useState(-1);
  const [t, setT] = React.useState(1);
  const curRef = React.useRef(0);
  const paused = React.useRef(false);

  function jump(nx) {
    const c = curRef.current;
    if (nx === c) return;
    curRef.current = nx;
    setPrev(c); setCur(nx); setT(0);
  }
  function advance(dir) { jump((curRef.current + dir + n) % n); }

  // crossfade tween whenever cur changes
  React.useEffect(function () {
    if (t >= 1) return;
    let start = null, raf = 0;
    const dur = 620;
    function step(ts) {
      if (start === null) start = ts;
      const p = Math.min(1, (ts - start) / dur);
      setT(p);
      if (p < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return function () { cancelAnimationFrame(raf); };
  }, [cur]);

  // autoplay
  React.useEffect(function () {
    const id = setInterval(function () { if (!paused.current) advance(1); }, 3800);
    return function () { clearInterval(id); };
  }, []);

  const f = MENU_FLYERS[cur];
  return (
    <div className="reveal reveal-d2 eat-slideshow"
      onMouseEnter={function () { paused.current = true; }}
      onMouseLeave={function () { paused.current = false; }}>
      <div className="eat-slide-frame">
        {MENU_FLYERS.map(function (m, i) {
          const op = i === cur ? t : (i === prev ? 1 - t : 0);
          return <img key={i} className="eat-slide-img" src={m.src} alt={m.label} style={{ opacity: op }} loading={i < 2 ? undefined : "lazy"} />;
        })}
        {f.tag && <span className="eat-slide-tag">{f.tag}</span>}
        <div className="eat-slide-cap">{f.label}</div>
        <button className="eat-slide-nav prev" onClick={function () { advance(-1); }} aria-label="Previous flyer">‹</button>
        <button className="eat-slide-nav next" onClick={function () { advance(1); }} aria-label="Next flyer">›</button>
      </div>
      <div className="eat-slide-dots">
        {MENU_FLYERS.map(function (m, i) {
          return <button key={i} className={"eat-dot" + (i === cur ? " on" : "")} onClick={function () { jump(i); }} aria-label={m.label}></button>;
        })}
      </div>
    </div>
  );
}

function EatHero() {
  const ref = useReveal();
  return (
    <section className="eathero field-navy" ref={ref}>
      <div className="halftone bowlhero-tex"></div>
      <div className="wrap eathero-grid">
        <div className="reveal">
          <span className="kicker" style={{ color: "var(--blue-300)" }}>The Alley Cafe &amp; Lounge</span>
          <h1 className="display page-title">Eat. Drink.<br />Cheer.</h1>
          <p className="page-lead">Hand-built pizzas, loaded calzones, waffle breakfast sandwiches and a full sports bar — all steps from your lane. Dine in or get it delivered.</p>
          <div className="eathero-delivery">
            <span className="muted-light">Delivery:</span>
            <span className="deliver-chip">Grubhub</span>
            <span className="deliver-chip">DoorDash</span>
          </div>
        </div>
        <EatHeroSlideshow />
      </div>
    </section>
  );
}

function MenuSection() {
  const ref = useReveal();
  const groups = [
    ["pizzas", "specialty"], ["premium", "breads"], ["entrees", "sides"]
  ];
  function renderGroup(key) {
    const g = MENU[key];
    const dual = g.items[0] && (g.items[0].s !== undefined || g.items[0].l !== undefined);
    return (
      <div className="menu-card" key={key}>
        <div className="menu-card-head">
          <h3 className="menu-card-title">{g.title}</h3>
          {dual && <span className="menu-card-cols"><span>SM</span><span>LG</span></span>}
        </div>
        <ul className="menu-items">
          {g.items.map(function (it, i) {
            return (
              <li key={i} className="menu-item">
                <span className="menu-item-n">{it.n}</span>
                <span className="menu-dots"></span>
                {dual ? (
                  <span className="menu-prices">
                    <span className="menu-price">{it.s ? "$" + it.s : "—"}</span>
                    <span className="menu-price">{it.l ? "$" + it.l : "—"}</span>
                  </span>
                ) : (
                  <span className="menu-price">${it.p}</span>
                )}
              </li>
            );
          })}
        </ul>
        {g.foot && <p className="menu-foot">{g.foot}</p>}
        {g.note && !g.foot && <p className="menu-note-sm">{g.note}</p>}
      </div>
    );
  }
  return (
    <section className="section menu-sec" ref={ref}>
      <div className="wrap">
        <SectionHead center kicker="The full menu" title="Real food. Real prices." sub="No more squinting at a flyer — here's everything, with prices. Tax not included." />
        <div className="menu-grid reveal reveal-d1">
          {["pizzas", "specialty", "premium", "breads", "entrees", "sides"].map(renderGroup)}
        </div>
      </div>
    </section>
  );
}

function NewItems() {
  const ref = useReveal();
  return (
    <section className="section newitems-sec field-navy" ref={ref}>
      <div className="halftone bowlhero-tex"></div>
      <div className="wrap">
        <SectionHead light center kicker="The whole spread" title="See it all." sub="Every flyer, all in one place — the stuff people drive across town for." />
        <div className="newitems-grid reveal reveal-d1">
          {MENU_FLYERS.map(function (it, i) {
            return (
              <figure key={i} className="newitem">
                <img src={it.src} alt={it.label} loading="lazy" />
                {it.tag && <span className="newitem-tag">{it.tag}</span>}
                <figcaption>{it.label}</figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Lounge() {
  const ref = useReveal();
  return (
    <section className="section lounge-sec" ref={ref}>
      <div className="wrap lounge-grid">
        <div className="reveal lounge-copy">
          <SectionHead kicker="The Alley Lounge" title="Every game. Every screen." sub="Pull up to the bar, grab a cold one, and catch the game between frames. Big screens, full bar, and the best seat in the house when your team's on." />
          <div className="lounge-feats">
            <div className="lounge-feat"><span className="lounge-feat-ic"><Icon name="beer" size={20} /></span><div><strong>Full sports bar</strong><span>Draft & bottle, cocktails, and game-day specials.</span></div></div>
            <div className="lounge-feat"><span className="lounge-feat-ic"><Icon name="star" size={20} fillStar /></span><div><strong>Watch parties</strong><span>Every screen tuned to the big game, all season long.</span></div></div>
          </div>
        </div>
        <div className="reveal reveal-d2 lounge-art">
          <img src="img/lounge.png" alt="The Alley Lounge bar at All Star Bowl" loading="lazy" />
        </div>
      </div>
    </section>
  );
}

function CafeGallery() {
  const ref = useReveal();
  const shots = [
    { src: "img/lanes-wide.jpg", cap: "Eat right at your lane", sub: "Full-service tables lane-side", feature: true },
    { src: "img/cafe-ribs.jpg", cap: "Fresh from the kitchen", sub: "" },
    { src: "img/lounge-bar.jpg", cap: "The Alley Lounge", sub: "" },
    { src: "img/lounge-mural.jpg", cap: "Kick back & cheer", sub: "" },
    { src: "img/lanes-angle.jpg", cap: "Booths, screens & snacks", sub: "" }
  ];
  return (
    <section className="section cafe-gallery-sec" ref={ref}>
      <div className="wrap">
        <SectionHead kicker="Step inside the cafe" title="Pull up a chair." sub="Booths and tables right alongside the lanes, a full bar in the Alley Lounge, and screens everywhere — eat, drink and watch the game without missing a frame." />
        <div className="cafe-gallery reveal reveal-d1">
          {shots.map(function (s, i) {
            return (
              <figure key={i} className={"cafe-shot" + (s.feature ? " cafe-shot--feature" : "")}>
                <img src={s.src} alt={s.cap} loading="lazy" />
                <figcaption>
                  <span className="cafe-shot-cap">{s.cap}</span>
                  {s.sub ? <span className="cafe-shot-sub">{s.sub}</span> : null}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function EatPage() {
  return (
    <main>
      <EatHero />
      <MenuSection />
      <CafeGallery />
      <NewItems />
      <Lounge />
    </main>
  );
}

Object.assign(window, { EatPage, MENU, MENU_FLYERS });
