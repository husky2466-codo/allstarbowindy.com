/* ============================================================
   CONTACT PAGE — map, address/phone/hours + message form
   ============================================================ */

/* 360° virtual tour embed.
   ⚠️ REPLACE this with the venue's real indoor Google 360 pano:
   on the business's Google Maps listing → the "See inside" / 360 photo →
   ⋯ menu → "Share or embed image" → copy the <iframe src="…"> URL here.
   (Placeholder below is an outdoor Street View at the venue's coordinates.) */
const TOUR_EMBED_URL = "https://www.google.com/maps?q=&layer=c&cbll=39.779333,-86.042262&cbp=12,0,0,0,0&output=svembed";

function PanoIcon(props) {
  const s = props.size || 17;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <ellipse cx="12" cy="12" rx="9" ry="5.2" />
      <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
      <path d="M7 16.2l-1.6 3M17 16.2l1.6 3" />
    </svg>
  );
}

function TourModal(props) {
  useEffect(function () {
    if (!props.open) return;
    function onKey(e) { if (e.key === "Escape") props.onClose(); }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return function () { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [props.open]);
  if (!props.open) return null;
  return (
    <div className="tour-modal" role="dialog" aria-modal="true" aria-label="All Star Bowl virtual tour" onClick={props.onClose}>
      <div className="tour-modal-card" onClick={function (e) { e.stopPropagation(); }}>
        <div className="tour-modal-bar">
          <span className="tour-modal-title"><PanoIcon size={16} /> Step inside All Star Bowl · 360° tour</span>
          <button className="tour-modal-close" onClick={props.onClose} aria-label="Close tour">&times;</button>
        </div>
        <div className="tour-modal-frame">
          <iframe title="All Star Bowl 360° virtual tour" src={TOUR_EMBED_URL} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
    </div>
  );
}

function TourButton(props) {
  const [open, setOpen] = useState(false);
  return (
    <React.Fragment>
      <button className={props.cls} style={props.style} onClick={function () { setOpen(true); }}>{props.children}</button>
      <TourModal open={open} onClose={function () { setOpen(false); }} />
    </React.Fragment>
  );
}

function ExpandIcon(props) {
  const s = props.size || 16;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 3H4v4M16 3h4v4M8 21H4v-4M16 21h4v-4" />
    </svg>
  );
}

/* Inline interactive tour — full-width, sits under the hero, above the cards. */
function TourEmbed() {
  const [full, setFull] = useState(false);
  const ref = useReveal();
  return (
    <section className="section tour-embed-sec" ref={ref}>
      <div className="wrap reveal">
        <div className="tour-embed-head">
          <div>
            <span className="kicker" style={{ color: "var(--red-600)" }}>Look around first</span>
            <h2 className="tour-embed-title">Take a virtual walk through the alley</h2>
            <p className="tour-embed-sub">Drag to look around and step lane-to-lane — then go full screen for the full walkthrough.</p>
          </div>
          <button className="btn btn-blue tour-embed-expand" onClick={function () { setFull(true); }}><ExpandIcon size={16} /> Full screen</button>
        </div>
        <div className="tour-embed-frame">
          <iframe title="All Star Bowl 360° virtual tour" src={TOUR_EMBED_URL} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
          <button className="tour-embed-fs" onClick={function () { setFull(true); }} aria-label="Open full-screen tour"><ExpandIcon size={15} /> Full screen</button>
        </div>
      </div>
      <TourModal open={full} onClose={function () { setFull(false); }} />
    </section>
  );
}

function ContactHero() {
  const ref = useReveal();
  return (
    <section className="bowlhero contacthero field-navy" ref={ref}>
      <div className="contacthero-photo" aria-hidden="true"></div>
      <div className="halftone bowlhero-tex"></div>
      <div className="wrap">
        <div className="page-head reveal">
          <span className="kicker" style={{ color: "var(--blue-300)" }}>Get in touch</span>
          <h1 className="display page-title">Come see us.</h1>
          <p className="page-lead">On the east side of Indianapolis, just off Shortridge. Call for lane availability and party dates, or drop us a message below — we'll get right back to you.</p>
        </div>
      </div>
    </section>
  );
}

function ContactInfo() {
  const q = ASB.BIZ.address;
  const embed = "https://www.google.com/maps?q=" + encodeURIComponent(q) + "&z=15&output=embed";
  const dir = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(q);
  return (
    <div className="contact-info">
      <div className="contact-details card">
        <h3 className="bk-h" style={{ marginBottom: 4 }}>Visit &amp; call</h3>
        <a className="contact-row" href={dir} target="_blank" rel="noreferrer">
          <span className="contact-row-ic"><Icon name="map" size={18} /></span>
          <span><strong>726 N Shortridge Rd</strong><span>Indianapolis, IN 46219</span></span>
        </a>
        <a className="contact-row" href={ASB.BIZ.phoneHref}>
          <span className="contact-row-ic"><Icon name="phone" size={18} /></span>
          <span><strong>{ASB.BIZ.phone}</strong><span>Front desk &amp; reservations</span></span>
        </a>
        <a className="contact-row" href={ASB.BIZ.standings} target="_blank" rel="noreferrer">
          <span className="contact-row-ic"><Icon name="trophy" size={18} /></span>
          <span><strong>League standings</strong><span>Live scores on ComputerScore ↗</span></span>
        </a>
        <div className="contact-hours">
          <span className="loc-hours-h">Hours this week</span>
          <MiniHours />
        </div>
        <a className="btn btn-blue" style={{ justifyContent: "center" }} href={dir} target="_blank" rel="noreferrer"><Icon name="nav" size={17} /> Get directions</a>
      </div>
      <div className="contact-map">
        <iframe
          title="All Star Bowl — 726 N Shortridge Rd on Google Maps"
          src={embed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

function ContactForm() {
  const [done, setDone] = useState(false);
  const [f, setF] = useState({ name: "", email: "", phone: "", topic: "General question", message: "" });
  function upd(k, v) { setF(Object.assign({}, f, { [k]: v })); }
  const valid = f.name.trim().length > 1 && /.+@.+\..+/.test(f.email) && f.message.trim().length > 4;
  return (
    <div className="contact-form card">
      {done ? (
        <div className="bk-success">
          <span className="bk-success-ic"><Icon name="check" size={26} /></span>
          <strong>Message sent!</strong>
          <span>Thanks for reaching out — we'll reply by phone or email within a day. For anything urgent, give us a call.</span>
          <button className="btn btn-blue btn-sm" style={{ marginTop: 12 }} onClick={function () { setDone(false); }}>Send another</button>
        </div>
      ) : (
        <React.Fragment>
          <h3 className="bk-h">Send us a message</h3>
          <div className="prf-row">
            <label className="bk-field"><span>Your name</span><input type="text" value={f.name} placeholder="First &amp; last" onChange={function (e) { upd("name", e.target.value); }} /></label>
            <label className="bk-field"><span>Email</span><input type="email" value={f.email} placeholder="you@email.com" onChange={function (e) { upd("email", e.target.value); }} /></label>
          </div>
          <div className="prf-row">
            <label className="bk-field"><span>Phone (optional)</span><input type="tel" value={f.phone} placeholder="(317) 555-0142" onChange={function (e) { upd("phone", e.target.value); }} /></label>
            <label className="bk-field"><span>Topic</span>
              <select value={f.topic} onChange={function (e) { upd("topic", e.target.value); }}>
                <option>General question</option>
                <option>Birthday / group party</option>
                <option>Leagues</option>
                <option>Pro shop</option>
                <option>Lost &amp; found</option>
                <option>Feedback</option>
              </select>
            </label>
          </div>
          <label className="bk-field"><span>How can we help?</span><textarea rows="4" value={f.message} placeholder="Tell us what you need…" onChange={function (e) { upd("message", e.target.value); }}></textarea></label>
          <button className="btn btn-red btn-lg" style={{ justifyContent: "center", width: "100%", marginTop: 4 }} disabled={!valid} onClick={function () { setDone(true); }}><Icon name="arrow" size={18} /> Send message</button>
          <p className="contact-formnote"><Icon name="info" size={14} /> Prefer to talk? Call <a href={ASB.BIZ.phoneHref}>{ASB.BIZ.phone}</a> during open hours.</p>
        </React.Fragment>
      )}
    </div>
  );
}

function ContactMain() {
  const ref = useReveal();
  return (
    <section className="section" ref={ref}>
      <div className="wrap contact-grid">
        <div className="reveal"><ContactInfo /></div>
        <div className="reveal reveal-d2"><ContactForm /></div>
      </div>
    </section>
  );
}

function ContactPage() {
  return (
    <main>
      <ContactHero />
      <TourEmbed />
      <ContactMain />
    </main>
  );
}

Object.assign(window, { ContactPage });
