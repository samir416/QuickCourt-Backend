import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AccountSidebar({ active }) {
  const { user, logout } = useAuth();
  return (
    <aside className="account-sidebar">
      <span className="avatar avatar-large">{user && user.name ? user.name.substring(0,2).toUpperCase() : "MA"}</span>
      <h1>{user ? user.name : "Player"}</h1>
      <p>
        9999999999
        <br />
        {user ? user.email : "user@example.com"}
      </p>
      <nav>
        <Link
          className={active === "profile" ? "account-active" : ""}
          to="/profile"
        >
          Edit Profile
        </Link>
        <Link
          className={active === "bookings" ? "account-active" : ""}
          to="/bookings"
        >
          All bookings
        </Link>
        <button onClick={() => { logout(); window.location.href = "/"; }} style={{background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '0.75rem 1rem', fontSize: '1rem', color: '#dc2626'}}>Log out</button>
      </nav>
    </aside>
  );
}
