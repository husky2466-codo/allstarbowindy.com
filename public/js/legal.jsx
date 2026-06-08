/* ============================================================
   LEGAL — Terms of Use & Privacy Policy (footer stubs)
   ============================================================ */

function LegalLayout(props) {
  const ref = useReveal();
  return (
    <main ref={ref}>
      <section className="bowlhero field-navy">
        <div className="halftone bowlhero-tex"></div>
        <div className="wrap">
          <div className="page-head reveal">
            <span className="kicker" style={{ color: "var(--blue-300)" }}>{props.kicker}</span>
            <h1 className="display page-title">{props.title}</h1>
            <p className="page-lead">{props.lead}</p>
          </div>
        </div>
      </section>
      <section className="section legal-sec">
        <div className="wrap legal-wrap reveal">
          <p className="legal-updated">Last updated June 2026</p>
          {props.sections.map(function (sec, i) {
            return (
              <div key={i} className="legal-block">
                <h2 className="legal-h">{sec.h}</h2>
                {sec.p.map(function (para, j) { return <p key={j} className="legal-p">{para}</p>; })}
              </div>
            );
          })}
          <div className="legal-foot">
            <p>Questions about this policy? Reach us at <a href={ASB.BIZ.phoneHref}>{ASB.BIZ.phone}</a> or through our <button className="legal-link" onClick={function () { Router.go("/contact"); }}>contact page</button>.</p>
            <button className="btn btn-red" onClick={function () { Router.go("/"); }}>Back home</button>
          </div>
        </div>
      </section>
    </main>
  );
}

function TermsPage() {
  return (
    <LegalLayout
      kicker="The fine print"
      title="Terms of Use"
      lead="The basics for using this website and bowling with us at All Star Bowl."
      sections={[
        { h: "Using this site", p: ["This website is provided to help you check hours, lane availability, rates, leagues and events at All Star Bowl. Live status, wait times and lane counts are estimates that update from our schedule and the clock — they're a guide, not a guarantee. For confirmed availability, please call the front desk."] },
        { h: "Reservations & parties", p: ["Lane and party requests made online are requests, not confirmed bookings, until our team confirms them by phone or email. Party reservations require 48 hours' notice and a $25 non-refundable deposit applied to your final total. Payment is collected at the desk or through a secure link we send you.", "Posted rates are subject to change. Shoe rental, lane and per-game pricing shown here reflect our current rates and may differ for special events and holidays."] },
        { h: "House rules", p: ["Bowlers use the lanes and equipment at their own risk. Bowling shoes are required on the approaches. Please follow staff instructions, keep food and drinks behind the foul line, and let us help with any equipment issues — never enter the lane or pinsetter area."] },
        { h: "Content & trademarks", p: ["The All Star Bowl name, logo and the content on this site are the property of All Star Bowl. Third-party links (maps, league standings, delivery partners) are provided for convenience; we aren't responsible for their content or availability."] }
      ]}
    />
  );
}

function PrivacyPage() {
  return (
    <LegalLayout
      kicker="Your information"
      title="Privacy Policy"
      lead="What we collect when you contact or book with us, and how we use it."
      sections={[
        { h: "What we collect", p: ["When you submit a contact message, party request or league sign-up, we collect the details you give us — typically your name, phone number, email and any notes about your visit. We don't ask for sensitive personal information through this site."] },
        { h: "How we use it", p: ["We use your information only to respond to you, confirm bookings and events, and follow up about your request. We don't sell your information. If you opt in to hear about specials, you can ask us to stop at any time by calling the front desk."] },
        { h: "Cookies & analytics", p: ["This site may use basic analytics to understand which pages are useful so we can improve them. Embedded maps and league-standings links are served by third parties (such as Google) under their own privacy terms."] },
        { h: "Your choices", p: ["You can request that we update or delete the contact information you've shared with us. Just reach out by phone or through the contact page and we'll take care of it."] }
      ]}
    />
  );
}

Object.assign(window, { TermsPage, PrivacyPage });
