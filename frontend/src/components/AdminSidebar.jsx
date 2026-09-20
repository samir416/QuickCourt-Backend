import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";

export default function AdminSidebar({ active }) {
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
      <h1>{user ? user.name : 'Admin'}</h1>
      <p>{user ? user.email : ''}</p>
      <nav>
        <Link className={active === "dashboard" ? "account-active" : ""} to="/admin/dashboard">Dashboard</Link>
        <Link className={active === "approvals" ? "account-active" : ""} to="/admin/approvals">Approvals</Link>
        <Link className={active === "users" ? "account-active" : ""} to="/admin/users">Users</Link>
        <Link className={active === "profile" ? "account-active" : ""} to="/admin/profile">Profile</Link>
        <Link to="/" onClick={handleLogout}>Log out</Link>
      </nav>
    </aside>
  );
}
