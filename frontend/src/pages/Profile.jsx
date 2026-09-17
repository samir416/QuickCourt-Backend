import AccountSidebar from "../components/AccountSidebar";
import { useState } from "react";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, login } = useAuth();
  const [name, setName] = useState(user ? user.name : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!user) return;
    try {
      setError("");
      setMessage("");
      // API currently only updates user details, backend might not support password update yet, so we just update name
      const data = await apiFetch(`/profile/${user.id}`, {
        method: "PUT",
        body: JSON.stringify({ name, email })
      });
      // update context
      login({ ...user, name, email });
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    }
  };

  return (
    <main className="account-page">
      <AccountSidebar active="profile" />
      <section className="account-content">
        <p className="eyebrow">Account settings</p>
        <h2>Edit profile</h2>
        <div className="account-form">
          <label className="field-label">
            Full name
            <input value={name} onChange={e => setName(e.target.value)} />
          </label>
          <label className="field-label">
            Email
            <input value={email} onChange={e => setEmail(e.target.value)} disabled />
          </label>
          <label className="field-label">
            Old password
            <input type="password" placeholder="Not supported yet" disabled />
          </label>
          <label className="field-label">
            New password
            <input type="password" placeholder="Not supported yet" disabled />
          </label>
          
          {error && <small className="auth-error" style={{color: 'red'}}>{error}</small>}
          {message && <small className="auth-success" style={{color: 'green'}}>{message}</small>}
          
          <button className="button button-dark" onClick={handleSave}>Save changes</button>
        </div>
      </section>
    </main>
  );
}
