import { Link } from "react-router-dom";

export default function AccountSidebar({ active }) {
  return (
    <aside className="account-sidebar">
      <span className="avatar avatar-large">MA</span>
      <h1>Mitchell Admin</h1>
      <p>
        9999999999
        <br />
        mitchelladmin2017@gmail.com
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
        <Link to="/">Log out</Link>
      </nav>
    </aside>
  );
}
