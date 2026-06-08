/* ============================================================
   APP ROOT — router + page mounting
   ============================================================ */

function ComingSoon(props) {
  const ref = useReveal();
  return (
    <main ref={ref}>
      <section className="section field-navy" style={{ minHeight: "60vh", display: "grid", placeItems: "center", textAlign: "center" }}>
        <div className="wrap reveal">
          <span className="kicker" style={{ color: "var(--blue-300)" }}>{props.kicker || "Page"}</span>
          <h1 className="display" style={{ fontSize: "clamp(2.4rem,6vw,4rem)", color: "var(--cream)", margin: "12px 0" }}>{props.title || "Coming soon"}</h1>
          <p style={{ color: "rgba(245,241,230,.78)", maxWidth: 520, margin: "0 auto 24px" }}>{props.body || "We're building this out."}</p>
          <button className="btn btn-red btn-lg" onClick={function () { Router.go("/"); }}>Back home</button>
        </div>
      </section>
    </main>
  );
}

function NotFound() {
  return <ComingSoon kicker="404" title="Gutter ball" body="That page rolled out of bounds. Let's get you back in the lane." />;
}

function App() {
  const route = useRoute();
  let Page;
  if (route === "/" || route === "") Page = window.HomePage;
  else if (route.indexOf("/bowl") === 0) Page = window.BowlPage;
  else if (route.indexOf("/leagues") === 0) Page = window.LeaguesPage;
  else if (route.indexOf("/cosmic") === 0) Page = window.CosmicPage;
  else if (route.indexOf("/scores") === 0) Page = window.LiveScoresPage;
  else if (route.indexOf("/eat") === 0) Page = window.EatPage;
  else if (route.indexOf("/parties") === 0) Page = window.PartiesPage;
  else if (route.indexOf("/proshop") === 0) Page = window.ProShopPage;
  else if (route.indexOf("/account") === 0) Page = window.AccountPage;
  else if (route.indexOf("/login") === 0) Page = window.LoginPage;
  else if (route.indexOf("/join") === 0) Page = window.JoinPage;
  else if (route.indexOf("/specials") === 0) Page = window.SpecialsPage;
  else if (route.indexOf("/contact") === 0) Page = window.ContactPage;
  else if (route.indexOf("/terms") === 0) Page = window.TermsPage;
  else if (route.indexOf("/privacy") === 0) Page = window.PrivacyPage;

  const Resolved = Page || (function () { return <NotFound />; });

  return (
    <React.Fragment>
      <Nav />
      <div key={route} className="page-anim">
        <Resolved />
      </div>
      <Footer />
      <CornerBuddy />
      <ReserveHost />
      <BallWipe />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
