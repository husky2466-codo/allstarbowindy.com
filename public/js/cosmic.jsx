/* ============================================================
   COSMIC BOWLING PAGE  (#/cosmic)
   Real glow-bowling photography (projected lanes + blacklight)
   backs a neon hero. Sections: what it is · when · pricing ·
   glow gallery · ARCADE highlight · party CTA.
   rAF-safe: no opacity:0 resting states; reveals are transform-only.
   ============================================================ */

function CosmicHero() {
  const ref = useReveal();
  return (
    <section className="cosmichero" ref={ref}>
      <div className="cosmichero-photo" aria-hidden="true"
        style={{ backgroundImage: "linear-gradient(180deg, rgba(8,6,28,.62) 0%, rgba(8,6,28,.42) 42%, rgba(8,6,28,.9) 100%), url(img/cosmic-lanes.jpg)" }}></div>
      <div className="cosmichero-glowtex" aria-hidden="true"></div>
      <div className="wrap cosmichero-in">
        <div className="page-head reveal" style={{ maxWidth: 760 }}>
          <span className="kicker cosmic-kick">Friday &amp; Saturday nights</span>
          <h1 className="display cosmic-title">Cosmic<br />Bowling</h1>
          <p className="page-lead cosmic-lead">{ASB.COSMIC.lead}</p>
          <div className="hero-cta reveal reveal-d1" style={{ marginTop: 26 }}>
            <button className="btn btn-red btn-lg" onClick={function () { Router.go("/bowl"); }}><Icon name="ball" size={20} /> Reserve a glow lane</button>
            <a className="btn btn-ghost btn-lg" style={{ color: "var(--cream)" }} href={ASB.BIZ.phoneHref}><Icon name="phone" size={18} /> {ASB.BIZ.phone}</a>
          </div>
        </div>
      </div>
      <div className="cosmichero-tagline reveal reveal-d2"><span>{ASB.COSMIC.tagline}</span></div>
    </section>
  );
}

function CosmicWhat() {
  const ref = useReveal();
  return (
    <section className="section cosmic-what" ref={ref}>
      <div className="cosmic-dots" aria-hidden="true"></div>
      <div className="wrap">
        <SectionHead center light kicker="What makes it cosmic" title="It's bowling, after dark." sub="Same lanes you love — but the lights go down, the glow comes up, and the whole place turns into one big light show." />
        <div className="cosmic-feat-grid reveal reveal-d1">
          {ASB.COSMIC.features.map(function (f, i) {
            return (
              <div key={i} className={"cosmic-feat reveal reveal-d" + (i + 1)}>
                <span className="cosmic-feat-ic"><Icon name={f.icon} size={26} /></span>
                <strong className="cosmic-feat-title">{f.title}</strong>
                <p className="cosmic-feat-body">{f.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CosmicWhen() {
  const ref = useReveal();
  return (
    <section className="section section--tight cosmic-when" ref={ref}>
      <div className="wrap cosmic-when-grid">
        <div className="cosmic-when-copy reveal">
          <SectionHead light kicker="When to glow" title="Glow nights." sub="Cosmic sessions run weekend nights once the sun's down. Walk in or reserve a lane — and ask about locking in a private glow party any night of the week." />
          <ul className="cosmic-sessions">
            {ASB.COSMIC.sessions.map(function (s, i) {
              return (
                <li key={i} className="cosmic-session">
                  <span className="cosmic-session-day">{s.day}</span>
                  <span className="cosmic-session-time">{s.time}</span>
                  <span className="cosmic-session-note">{s.note}</span>
                </li>
              );
            })}
          </ul>
          {ASB.COSMIC.demo ? <p className="cosmic-confirm"><Icon name="info" size={14} /> Sample schedule — call to confirm tonight's glow times.</p> : null}
        </div>
        <div className="cosmic-price-card reveal reveal-d2">
          <span className="cosmic-price-kick">Cosmic rates</span>
          <ul className="cosmic-prices">
            {ASB.COSMIC.pricing.map(function (p, i) {
              return (
                <li key={i} className="cosmic-price">
                  <div className="cosmic-price-top">
                    <span className="cosmic-price-label">{p.label}</span>
                    <span className="cosmic-price-val">{p.price}<small>{p.per}</small></span>
                  </div>
                  <span className="cosmic-price-note">{p.note}</span>
                </li>
              );
            })}
          </ul>
          <button className="btn btn-red btn-lg cosmic-price-cta" onClick={function () { Router.go("/bowl"); }}><Icon name="ball" size={18} /> Reserve a lane</button>
        </div>
      </div>
    </section>
  );
}

function CosmicGallery() {
  const ref = useReveal();
  const shots = [
    { src: "img/cosmic-lanes.jpg", cap: "Full-lane light projection", big: true },
    { src: "img/lanes-straight.jpg", cap: "Glow down all 46 lanes" },
    { src: "img/mural.jpg", cap: "The mural under the lights" }
  ];
  return (
    <section className="section cosmic-gallery-sec field-navy" ref={ref}>
      <div className="halftone bowlhero-tex"></div>
      <div className="wrap">
        <SectionHead light kicker="See the glow" title="The whole house lights up." />
        <div className="cosmic-gallery reveal reveal-d1">
          {shots.map(function (s, i) {
            return (
              <figure key={i} className={"cosmic-shot" + (s.big ? " cosmic-shot--big" : "")}>
                <img src={s.src} alt={s.cap} loading="lazy" />
                <figcaption>{s.cap}</figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- ARCADE HIGHLIGHT ---------- */
function ArcadeHighlight() {
  const ref = useReveal();
  const a = ASB.ARCADE;
  return (
    <section className="section arcade-sec" ref={ref}>
      <div className="wrap">
        <div className="arcade-head reveal">
          <div>
            <span className="kicker" style={{ color: "var(--red-600)" }}>Right off the lanes</span>
            <h2 className="display arcade-title">The Arcade.</h2>
          </div>
          <p className="arcade-lead">{a.lead}</p>
        </div>

        <div className="arcade-photos reveal reveal-d1">
          <figure className="arcade-photo">
            <img src="img/arcade-classics.jpg" alt="Pac-Man Pixel Bash and the racing simulator in the arcade" loading="lazy" />
            <figcaption>Classics &amp; the full-motion racer</figcaption>
          </figure>
          <figure className="arcade-photo">
            <img src="img/arcade-claw.jpg" alt="Claw machines and the prize wall in the arcade" loading="lazy" />
            <figcaption>Claw machines &amp; the prize wall</figcaption>
          </figure>
        </div>

        <div className="arcade-grid reveal reveal-d2">
          {a.games.map(function (g, i) {
            return (
              <article key={i} className="arcade-game">
                <span className="arcade-game-tag">{g.tag}</span>
                <h3 className="arcade-game-name">{g.name}</h3>
                <span className="arcade-game-kind">{g.kind}</span>
                <p className="arcade-game-blurb">{g.blurb}</p>
              </article>
            );
          })}
          <article className="arcade-game arcade-game--prize">
            <span className="arcade-prize-ic"><Icon name="gift" size={24} /></span>
            <h3 className="arcade-game-name">{a.redemption.title}</h3>
            <p className="arcade-game-blurb">{a.redemption.body}</p>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ---------- Party tie-in CTA ---------- */
function CosmicParty() {
  const ref = useReveal();
  return (
    <section className="section section--tight cosmic-party" ref={ref}>
      <div className="wrap">
        <div className="cosmic-party-card reveal"
          style={{ backgroundImage: "linear-gradient(110deg, rgba(12,8,40,.92) 0%, rgba(40,12,70,.78) 55%, rgba(120,20,90,.6) 100%), url(img/cosmic-lanes.jpg)" }}>
          <div className="cosmic-party-in">
            <span className="tag tag-gold">Private glow parties</span>
            <h3 className="display cosmic-party-title">Book the glow<br />for your crew.</h3>
            <p>Birthdays, lock-ins, team nights — reserve private cosmic lanes with the lights, the music and the whole light show to yourselves.</p>
            <div className="hero-cta" style={{ marginTop: 18 }}>
              <button className="btn btn-red btn-lg" onClick={function () { Router.go("/parties"); }}><Icon name="cake" size={18} /> Plan a glow party</button>
              <a className="btn btn-ghost btn-lg" style={{ color: "var(--cream)" }} href={ASB.BIZ.phoneHref}><Icon name="phone" size={17} /> Call to book</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CosmicPage() {
  return (
    <main className="cosmic-page">
      <CosmicHero />
      <CosmicWhat />
      <CosmicWhen />
      <CosmicGallery />
      <ArcadeHighlight />
      <CosmicParty />
    </main>
  );
}

Object.assign(window, { CosmicPage, ArcadeHighlight });
