/* ============================================================
   HOME PAGE
   ============================================================ */

/* Shared section heading */
function SectionHead(props) {
  return (
    <div className={"sechead " + (props.center ? "sechead--center " : "") + (props.light ? "sechead--light " : "")} style={props.style}>
      <div className="sec-label" style={props.center ? { justifyContent: "center" } : null}>
        <span className="kicker" style={{ color: props.light ? "var(--blue-300)" : "var(--red-600)" }}>{props.kicker}</span>
      </div>
      <h2 className="display sechead-title">{props.title}</h2>
      {props.sub && <p className="sechead-sub">{props.sub}</p>}
    </div>
  );
}

/* Quick facts strip */
function QuickStrip() {
  const s = useStatus();
  const items = [
    { icon: "clock", label: "Today's hours", value: s.todayHours.open != null ? (ASB.fmtClockShort(s.todayHours.open) + " – " + ASB.fmtClockShort(s.todayHours.close)) : "Closed", accent: s.isOpen },
    { icon: "ball", label: "Open lanes now", value: s.isOpen ? (s.lanesOpen + " / " + s.total) : "—" },
    { icon: "ticket", label: "Games from", value: "$5.00" },
    { icon: "phone", label: "Call us", value: ASB.BIZ.phone, href: ASB.BIZ.phoneHref }
  ];
  return (
    <div className="quickstrip">
      {items.map(function (it, i) {
        const inner = (
          <React.Fragment>
            <span className="qs-ic"><Icon name={it.icon} size={20} /></span>
            <span className="qs-text">
              <span className="qs-label">{it.label}</span>
              <span className={"qs-value" + (it.accent ? " on" : "")}>{it.value}</span>
            </span>
          </React.Fragment>
        );
        return it.href
          ? <a key={i} className="qs-item" href={it.href}>{inner}</a>
          : <div key={i} className="qs-item">{inner}</div>;
      })}
    </div>
  );
}

/* The hero live board */
function LiveBoard() {
  const s = useStatus();
  const v = ASB.getStatus(ClockStore.now());
  return (
    <div className="liveboard">
      <div className="liveboard-top">
        <div className="live-pill">
          <span className={"dot " + (s.isOpen ? (s.level === "open" ? "s-open" : s.level === "limited" ? "s-limited" : "s-busy") : "s-closed")} style={{ background: "currentColor" }}></span>
          {s.isOpen ? "Open now · " + s.levelLabel : "Closed"}
        </div>
        <span className="liveboard-clock">{ClockStore.now().toLocaleDateString(undefined, { weekday: "long" })} · {ClockStore.now().toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}</span>
      </div>

      <div className="liveboard-main">
        <BowlGauge status={s} size={210} stroke={17} />
        <div className="liveboard-side">
          <LiveCountdown status={s} />
          <div className="liveboard-wait">
            <Icon name="users" size={17} />
            <span>{s.isOpen ? (s.wait > 0 ? ("~" + s.wait + " min walk-in wait") : "No wait — walk right in") : "Closed for the night"}</span>
          </div>
        </div>
      </div>

      <div className="liveboard-lanes">
        <LaneMeter status={s} />
      </div>

      <div className="liveboard-verdict">
        <VerdictCard status={s} verdict={getVerdict(s)} />
      </div>

      <LiveNotices status={s} max={2} />

      <div className="liveboard-foot">
        <button className="btn btn-red" onClick={function () { Router.go("/bowl"); }}><Icon name="ball" size={18} /> Reserve a Lane</button>
        <TimeMachine status={s} />
      </div>
    </div>
  );
}

/* derive verdict object from status (mirrors data engine) */
function getVerdict(s) {
  return ASB.getStatus(s.now).__v || buildVerdict(s);
}
function buildVerdict(s) {
  if (!s.isOpen) return { tone: "closed", emoji: "🌙", head: "Not right now", sub: s.nextOpen ? ("We open " + (s.nextOpen.day === "Today" ? "" : s.nextOpen.day + " ") + "at " + ASB.fmtClock(s.nextOpen.at)) : "Closed today" };
  if (s.level === "open") return { tone: "great", emoji: "🎳", head: "It's a great bowling day", sub: s.lanesOpen + " of " + s.total + " lanes open — walk right in, no wait." };
  if (s.level === "limited") return { tone: "good", emoji: "👍", head: "Good to go — maybe call ahead", sub: s.lanesOpen + " lanes left" + (s.wait ? " · ~" + s.wait + " min wait" : "") + "." };
  if (s.level === "busy") return { tone: "tight", emoji: "⏳", head: "Busy — reserve to be safe", sub: "Only " + s.lanesOpen + " lane" + (s.lanesOpen === 1 ? "" : "s") + " left · ~" + s.wait + " min wait." };
  return { tone: "full", emoji: "🔥", head: "Packed right now", sub: "All lanes in play · ~" + s.wait + " min wait." };
}

/* Interactive location map in the hero — pan/zoom embed + directions */
function HeroMap() {
  const q = "726 N Shortridge Rd, Indianapolis, IN 46219";
  const embed = "https://www.google.com/maps?q=" + encodeURIComponent(q) + "&z=15&output=embed";
  const dir = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(q);
  return (
    <div className="hero-map reveal reveal-d3">
      <div className="hero-map-frame">
        <iframe
          className="hero-map-embed"
          title="All Star Bowl — 726 N Shortridge Rd on Google Maps"
          src={embed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        ></iframe>
      </div>
      <div className="hero-map-bar">
        <span className="hero-map-pin"><Icon name="map" size={16} /></span>
        <div className="hero-map-text">
          <strong>726 N Shortridge Rd</strong>
          <span>East Indianapolis · IN 46219</span>
        </div>
        <a className="hero-map-dir" href={dir} target="_blank" rel="noreferrer">
          <Icon name="nav" size={15} /> Directions
        </a>
      </div>
    </div>
  );
}

function Hero() {
  const ref = useReveal();
  return (
    <section className="hero field-navy" ref={ref}>
      <div className="hero-photo" aria-hidden="true"></div>
      <div className="hero-stripes halftone"></div>
      <div className="hero-arrows" aria-hidden="true">
        {[0, 1, 2, 3, 4].map(function (i) { return <span key={i} className="hero-arrow" style={{ animationDelay: (i * 0.4) + "s" }}></span>; })}
      </div>
      <div className="wrap hero-grid">
        <div className="hero-copy reveal">
          <div className="hero-kicker">
            <span className="star">★</span> 726 N Shortridge Rd · East Indianapolis
          </div>
          <h1 className="display hero-title">
            Know before<br />you go.
          </h1>
          <p className="hero-sub">
            Live lane availability, real walk-in wait times, league takeovers and tonight's specials —
            so you always know if today's a bowling day at <strong>All Star Bowl</strong>.
          </p>
          <div className="hero-cta">
            <button className="btn btn-red btn-lg" onClick={function () { Router.go("/bowl"); }}><Icon name="ball" size={20} /> Reserve a Lane</button>
            <button className="btn btn-ghost btn-lg" onClick={function () { Router.go("/eat"); }}>See the Menu</button>
          </div>
          <div className="hero-chips">
            <span className="hero-chip"><strong>32</strong> synthetic lanes</span>
            <span className="hero-chip"><strong>Sports bar</strong> + Alley Cafe</span>
            <span className="hero-chip"><strong>Pro shop</strong> on site</span>
          </div>
          <HeroMap />
        </div>
        <div className="hero-board reveal reveal-d2">
          <LiveBoard />
        </div>
      </div>
    </section>
  );
}

/* Feature cards: the four experiences */
function Experiences() {
  const ref = useReveal();
  const cards = [
    { icon: "ball", tag: "Bowl", title: "48 Lanes", body: "Synthetic lanes on real wood approaches. Bumpers for the kids, league-grade for the pros.", to: "/bowl", color: "var(--blue-600)" },
    { icon: "beer", tag: "Drink", title: "Sports Bar & Lounge", body: "Every game on the screens, cold drinks, and a place to cheer between frames.", to: "/eat", color: "var(--red-600)" },
    { icon: "pizza", tag: "Eat", title: "The Alley Cafe", body: "Hand-built pizzas, waffle sandwiches, wings and more. Delivery on Grubhub & DoorDash.", to: "/eat", color: "var(--gold-600)" },
    { icon: "trophy", tag: "Compete", title: "Leagues & Youth", body: "Ten leagues a week plus a Saturday youth program with real coaching.", to: "/leagues", color: "var(--blue-700)" }
  ];
  return (
    <section className="section" ref={ref}>
      <div className="wrap">
        <SectionHead center kicker="More than a bowling alley" title="One stop. All the fun." sub="Bowl a few games, grab a booth, watch the game, and refuel — all under one roof on the east side." />
        <div className="exp-grid">
          {cards.map(function (c, i) {
            return (
              <button key={i} className={"exp-card reveal reveal-d" + ((i % 4) + 1)} onClick={function () { Router.go(c.to); }}>
                <span className="exp-ic" style={{ background: c.color }}><Icon name={c.icon} size={26} /></span>
                <span className="exp-tag">{c.tag}</span>
                <strong className="exp-title display">{c.title}</strong>
                <span className="exp-body">{c.body}</span>
                <span className="exp-arrow"><Icon name="arrow" size={18} /></span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* Specials band — Casino bowling etc. */
function SpecialsBand() {
  const ref = useReveal();
  return (
    <section className="specials-band" ref={ref}>
      <div className="specials-stripe stripes-bg"></div>
      <div className="wrap specials-inner reveal">
        <div className="specials-copy">
          <span className="tag tag-gold">Mon &amp; Thu · 8 PM – close</span>
          <h3 className="display specials-title">Casino Bowling Nights</h3>
          <p>Every strike turns your lane screen into a slot machine — line it up and win <strong>real cash prizes</strong>. Just $6.25 per person, per game, all night long.</p>
          <div className="specials-cta">
            <button className="btn btn-cream" onClick={function () { Router.go("/bowl"); }}>See all specials</button>
            <a className="btn btn-ghost" href={ASB.BIZ.phoneHref}><Icon name="phone" size={17} /> {ASB.BIZ.phone}</a>
          </div>
        </div>
        <div className="specials-card">
          <div className="slot-reels">
            {["🎰", "7", "★"].map(function (r, i) {
              return <div key={i} className="slot-reel" style={{ animationDelay: (i * 0.18) + "s" }}>{r}</div>;
            })}
          </div>
          <div className="slot-caption">STRIKE = WIN</div>
        </div>
      </div>
    </section>
  );
}

/* Eat & drink teaser w/ real flyer imagery */
function EatTeaser() {
  const ref = useReveal();
  const flyers = [
    { src: "img/menu/mega-pepperoni.jpg", label: "Mega Pepperoni" },
    { src: "img/menu/waffle-sandwiches.png", label: "Waffle Sandwiches" },
    { src: "img/menu/chicken-wings.png", label: "Bone-In Wings" }
  ];
  return (
    <section className="section field-navy eat-teaser" ref={ref}>
      <div className="halftone eat-tex"></div>
      <div className="wrap eat-grid">
        <div className="eat-copy reveal">
          <SectionHead light kicker="The Alley Cafe" title="Fuel between frames." sub="A full all-American menu built for sharing — hand-stretched pizzas, loaded calzones, waffle breakfast sandwiches and our famous mega pies." />
          <ul className="eat-list">
            <li><Icon name="check" size={18} /> Create-your-own & specialty pizzas</li>
            <li><Icon name="check" size={18} /> New bone-in wings & mozzarella sticks</li>
            <li><Icon name="check" size={18} /> Delivery via Grubhub & DoorDash</li>
          </ul>
          <button className="btn btn-red btn-lg" onClick={function () { Router.go("/eat"); }}><Icon name="pizza" size={19} /> View full menu & prices</button>
        </div>
        <div className="eat-flyers reveal reveal-d2">
          {flyers.map(function (f, i) {
            return (
              <figure key={i} className={"eat-flyer eat-flyer--" + i}>
                <img src={f.src} alt={f.label} loading="lazy" />
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* Rewards teaser (BAC) */
function RewardsTeaser() {
  const ref = useReveal();
  return (
    <section className="section rewards-teaser" ref={ref}>
      <div className="wrap rewards-grid">
        <div className="rewards-card reveal">
          <div className="rewards-card-head">
            <span className="kicker" style={{ color: "var(--blue-300)" }}>Bowlers' Appreciation Club</span>
            <span className="rewards-tier">GOLD</span>
          </div>
          <div className="rewards-points">
            <span className="rewards-num display">164</span>
            <span className="rewards-unit">games this season</span>
          </div>
          <div className="rewards-bar"><span style={{ width: "82%" }}></span></div>
          <span className="rewards-next">196 games to <strong>Diamond</strong> · unlock $4.00 daytime games</span>
          <div className="rewards-tiers">
            {ASB.BAC_TIERS.map(function (t, i) {
              return <span key={t.key} className={"rewards-chip" + (t.key === "GOLD" ? " on" : "")}>{t.name}</span>;
            })}
          </div>
        </div>
        <div className="rewards-copy reveal reveal-d2">
          <SectionHead kicker="Free to join" title="The more you bowl, the less you pay." sub="Every game you bowl is tracked to your Bowler ID. Climb from Hole Punch to Diamond and your per-game rate drops at every tier — plus members-only specials and military discounts." />
          <div className="rewards-stats">
            <div><strong className="display">$4.00</strong><span>Diamond daytime game</span></div>
            <div><strong className="display">5</strong><span>reward tiers</span></div>
            <div><strong className="display">$0</strong><span>to join</span></div>
          </div>
          <div className="hero-cta">
            <button className="btn btn-blue btn-lg" onClick={function () { Router.go("/account"); }}><Icon name="star" size={18} fillStar /> Join the club</button>
            <button className="btn btn-ghost btn-lg" style={{ color: "var(--navy-800)" }} onClick={function () { Router.go("/account"); }}>See my dashboard</button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Parties + location split */
function HomeBottom() {
  const ref = useReveal();
  return (
    <section className="section section--tight" ref={ref}>
      <div className="wrap home-bottom">
        <div className="party-promo reveal" style={{ backgroundImage: "linear-gradient(180deg, rgba(10,20,48,.15), rgba(10,20,48,.8)), url(img/birthday.png)" }}>
          <div className="party-promo-in">
            <span className="tag tag-gold">From $17 / bowler</span>
            <h3 className="display party-title">Birthday parties<br />that bowl.</h3>
            <p>1.5 hours of bowling, shoes, pizza and drinks — we set it all up. Bumpers and birthday pins on request.</p>
            <button className="btn btn-red" onClick={function () { Router.go("/parties"); }}><Icon name="cake" size={18} /> Plan a party</button>
          </div>
        </div>
        <div className="loc-card reveal reveal-d2">
          <img className="loc-photo" src="img/front-building.png" alt="All Star Bowl storefront on N Shortridge Rd" loading="lazy" />
          <h3 className="display loc-title">Find us on the east side.</h3>
          <div className="loc-row"><Icon name="map" size={18} /><span>{ASB.BIZ.address}</span></div>
          <div className="loc-row"><Icon name="phone" size={18} /><a href={ASB.BIZ.phoneHref}>{ASB.BIZ.phone}</a></div>
          <div className="loc-hours">
            <span className="loc-hours-h">Hours this week</span>
            <MiniHours />
          </div>
          <a className="btn btn-blue" href={ASB.BIZ.maps} target="_blank" rel="noreferrer"><Icon name="nav" size={17} /> Get directions</a>
        </div>
      </div>
    </section>
  );
}

function MiniHours() {
  const today = ClockStore.now().getDay();
  return (
    <ul className="minihours">
      {ASB.HOURS.map(function (h, i) {
        const isToday = i === today;
        return (
          <li key={i} className={isToday ? "on" : ""}>
            <span>{h.day.slice(0, 3)}</span>
            <span>{ASB.fmtClockShort(h.open) + " – " + ASB.fmtClockShort(h.close)}</span>
          </li>
        );
      })}
    </ul>
  );
}

function HomePage() {
  return (
    <main>
      <Hero />
      <QuickStrip />
      <Experiences />
      <SpecialsBand />
      <EatTeaser />
      <RewardsTeaser />
      <MobileCompanion />
      <HomeBottom />
    </main>
  );
}

Object.assign(window, { HomePage, SectionHead, QuickStrip, MiniHours, getVerdict, buildVerdict });
