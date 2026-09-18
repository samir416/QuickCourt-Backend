import OwnerSidebar from "../components/OwnerSidebar";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../services/api";

export default function OwnerProfile() {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const data = await apiFetch(`/profile/${user.id}`);
        setFormData({ name: data.name || "", email: data.email || "" });
      } catch (err) {
        setStatus("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    try {
      setStatus("Saving...");
      const data = await apiFetch("/profile/" + user.id, {
        method: "PUT",
        body: JSON.stringify(formData)
      });
      login({ ...user, name: data.name, email: data.email });
      setStatus("Profile updated successfully!");
    } catch (err) {
      setStatus(err.message || "Failed to update profile.");
    }
  };

  return (
    <main className="account-page">
      <OwnerSidebar active="profile" />
      <section className="account-content">
        <p className="eyebrow">Settings</p>
        <h2>Edit Profile</h2>
        {loading ? (
            <p>Loading profile...</p>
        ) : (
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
              {status && <p style={{color: status.includes("Failed") || status.includes("Error") ? 'red' : 'green', marginBottom: '10px'}}>{status}</p>}
              <button className="button button-dark" onClick={handleSave}>Save changes</button>
            </div>
        )}
      </section>
    </main>
  );
}
