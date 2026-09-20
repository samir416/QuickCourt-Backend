import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";

export default function AccountSidebar({ active }) {
  const { user, logout } = useAuth();
  return (
    <aside className="account-sidebar">
      <div style={{ marginBottom: "16px" }}>
        <Avatar name={user?.name} image={user?.profileImage} size={64} className="avatar-large" />
      </div>
      <h1>{user ? user.name : "Player"}</h1>
      <p>
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
