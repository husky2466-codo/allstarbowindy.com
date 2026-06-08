// app.jsx — application entry. Mounts React, holds top-level view switching.
// CDN/Babel mode: reads components/views off window.ASB. DesignClaude replaces
// the placeholder routing with a real router/nav as the app grows.

function App() {
  const { Nav, Footer, HomeView } = window.ASB;
  return (
    <div className="asb-app">
      <Nav />
      <HomeView />
      <Footer />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
