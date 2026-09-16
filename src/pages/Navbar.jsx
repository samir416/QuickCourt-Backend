import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="QuickCourt home">
        <span className="brand-mark">Q</span>
        <span>quickcourt</span>
      </Link>
      <nav
        className={menuOpen ? "site-nav mobile-open" : "site-nav"}
        aria-label="Primary navigation"
      >
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/booking">Book a court</NavLink>
        <NavLink to="/bookings">My bookings</NavLink>
      </nav>
      <div className="header-actions">
        <NavLink className="profile-link" to="/profile">
          <span className="avatar">MA</span>
          <span className="profile-name">Mitchell Admin</span>
        </NavLink>
        <Link className="header-login" to="/logsign">
          Log in
        </Link>
      </div>
      <button
        className="mobile-menu-toggle"
        type="button"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((current) => !current)}
      >
        {menuOpen ? "×" : "☰"}
      </button>
    </header>
  );
}
