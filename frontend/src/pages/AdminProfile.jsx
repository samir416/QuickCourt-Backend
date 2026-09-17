import AdminSidebar from "../components/AdminSidebar";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../services/api";

export default function AdminProfile() {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || "", email: user.email || "" });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setStatus("Saving...");
      await apiFetch("/profile/" + user.id, {
        method: "PUT",
        body: JSON.stringify(formData)
      });
      login({ ...user, ...formData });
      setStatus("Profile updated.");
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <main className="account-page">
      <AdminSidebar active="profile" />
      <section className="account-content">
        <p className="eyebrow">Settings</p>
        <h2>Admin Profile</h2>
        <div className="account-form">
          <label className="field-label">
            Full name
            <input 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </label>
          <label className="field-label">
            Email
            <input 
              value={formData.email} 
              readOnly 
            />
          </label>
          {status && <p style={{color: status.includes("Error") ? 'red' : 'green'}}>{status}</p>}
          <button className="button button-dark" onClick={handleSave}>Save changes</button>
        </div>
      </section>
    </main>
  );
}
