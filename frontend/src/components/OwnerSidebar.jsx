import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";

export default function OwnerSidebar({ active }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/");
  };

  return (
    <aside className="account-sidebar">
      <div style={{ marginBottom: "16px" }}>
        <Avatar name={user?.name} image={user?.profileImage} size={64} className="avatar-large" />
      </div>
      <h1>{user ? user.name : 'Owner'}</h1>
      <p>{user ? user.email : ''}</p>
      <nav>
        <Link className={active === "dashboard" ? "account-active" : ""} to="/owner/dashboard">Dashboard</Link>
        <Link className={active === "facilities" ? "account-active" : ""} to="/owner/facilities">Facilities</Link>
        <Link className={active === "courts" ? "account-active" : ""} to="/owner/courts">Courts & Slots</Link>
        <Link className={active === "bookings" ? "account-active" : ""} to="/owner/bookings">Bookings</Link>
        <Link className={active === "profile" ? "account-active" : ""} to="/owner/profile">Profile</Link>
        <Link to="/" onClick={handleLogout}>Log out</Link>
      </nav>
    </aside>
  );
}
