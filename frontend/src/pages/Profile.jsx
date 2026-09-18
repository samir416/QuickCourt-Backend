import AccountSidebar from "../components/AccountSidebar";
import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, login } = useAuth();
  const [name, setName] = useState(user ? user.name : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const data = await apiFetch(`/profile/${user.id}`);
        setName(data.name || "");
        setEmail(data.email || "");
      } catch (err) {
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

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
      login({ ...user, name: data.name, email: data.email });
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
        
        {loading ? (
            <p>Loading profile...</p>
        ) : (
            <div className="account-form">
              <label className="field-label">
                Full name
                <input value={name} onChange={e => setName(e.target.value)} />
              </label>
              <label className="field-label">
                Email
                <input value={email} onChange={e => setEmail(e.target.value)} disabled />
              </label>
              
              {error && <small className="auth-error" style={{color: 'red', display: 'block', marginBottom: '10px'}}>{error}</small>}
              {message && <small className="auth-success" style={{color: 'green', display: 'block', marginBottom: '10px'}}>{message}</small>}
              
              <button className="button button-dark" onClick={handleSave}>Save changes</button>
            </div>
        )}
      </section>
    </main>
  );
}
