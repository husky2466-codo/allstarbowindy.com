// home.jsx — Home view. Stub. DesignClaude builds the real homepage here.
function HomeView() {
  const { business, cashGames, experiences } = window.ASB_DATA;
  return (
    <main className="asb-home">
      <h1>{business.name}</h1>
      <p>{business.lanes}-lane family bowling center · {business.address}</p>
      <p className="asb-stub-note">Home view stub — DesignClaude builds the real page here.</p>
    </main>
  );
}
window.ASB = window.ASB || {};
window.ASB.HomeView = HomeView;
