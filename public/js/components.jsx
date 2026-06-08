// components.jsx — shared UI components. CDN/Babel mode: attach to window, no imports/exports.
// DesignClaude builds the real components here (Nav, Footer, Card, etc.).

function Nav() {
  const { nav, business } = window.ASB_DATA;
  return (
    <nav className="asb-nav">
      <span className="asb-brand">{business.name}</span>
      <ul>{nav.map((item) => <li key={item}>{item}</li>)}</ul>
    </nav>
  );
}

function Footer() {
  const { business } = window.ASB_DATA;
  return (
    <footer className="asb-footer">
      <div>{business.address}</div>
      <div>{business.phone}</div>
    </footer>
  );
}

// expose for other scripts
window.ASB = window.ASB || {};
window.ASB.Nav = Nav;
window.ASB.Footer = Footer;
