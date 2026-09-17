import { useState, useRef, useEffect } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    if (navRef.current) {
      const activeElement = navRef.current.querySelector("a.active");
      if (activeElement) {
        setIndicatorStyle({
          left: activeElement.offsetLeft,
          width: activeElement.offsetWidth,
          opacity: 1
        });
      } else {
        setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    }
  }, [location.pathname, user]);

  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="QuickCourt home">
        <span className="brand-mark">Q</span>
        <span>quickcourt</span>
      </Link>
      <nav
        ref={navRef}
        className={menuOpen ? "site-nav mobile-open" : "site-nav"}
        aria-label="Primary navigation"
        style={{ position: 'relative' }}
      >
        <div 
          className="nav-indicator" 
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
            opacity: indicatorStyle.opacity,
            backgroundColor: 'rgba(0,0,0,0.05)',
            borderRadius: '20px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: -1
          }} 
        />
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/booking">Book a court</NavLink>
        
        {(!user || user.role === 'PLAYER') && (
          <>
            <NavLink to="/matches">Matches</NavLink>
            <NavLink to="/bookings">My bookings</NavLink>
          </>
        )}
        
        {user && (user.role === 'OWNER' || user.role === 'FACILITY_OWNER') && (
          <NavLink to="/owner/dashboard">Owner Dashboard</NavLink>
        )}
        
        {user && user.role === 'ADMIN' && (
          <NavLink to="/admin/dashboard">Admin Dashboard</NavLink>
        )}
      </nav>
      <div className="header-actions">
        {user ? (
          <>
            <NavLink className="profile-link" to={user.role === 'OWNER' || user.role === 'FACILITY_OWNER' ? "/owner/profile" : user.role === 'ADMIN' ? "/admin/profile" : "/profile"}>
              <span className="avatar">{user.name ? user.name.substring(0,2).toUpperCase() : 'U'}</span>
              <span className="profile-name">{user.name}</span>
            </NavLink>
            <button className="header-login" onClick={handleLogout} style={{background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600}}>
              Log out
            </button>
          </>
        ) : (
          <Link className="header-login" to="/logsign">
            Log in / Sign up
          </Link>
        )}
      </div>
      <button
        className="mobile-menu-toggle"
        type="button"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((current) => !current)}
      >
        {menuOpen ? "X" : "Menu"}
      </button>
    </header>
  );
}

