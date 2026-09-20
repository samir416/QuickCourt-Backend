import AdminSidebar from "../components/AdminSidebar";
import Avatar from "../components/Avatar";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { apiFetch, API_BASE_URL, getStoredToken } from "../services/api";
import { Camera, Trash2, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminProfile() {
  const { user, login } = useAuth();
  const [name, setName] = useState(user ? user.name : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [profileImage, setProfileImage] = useState(user ? user.profileImage : null);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(false);

  // Feedback state
  const [status, setStatus] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const data = await apiFetch(`/profile/${user.id}`);
        setName(data.name || "");
        setEmail(data.email || "");
        setProfileImage(data.profileImage || null);
        if (data.profileImage !== user.profileImage) {
          login({ ...user, profileImage: data.profileImage });
        }
      } catch (err) {
        setStatus("Failed to load profile data.");
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user?.id]);

  const handleStartEdit = () => {
    setEditName(name);
    setSelectedFile(null);
    setPreviewUrl(null);
    setPendingDelete(false);
    setStatus("");
    setIsError(false);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setPendingDelete(false);
    setEditName(name);
    setStatus("");
    setIsError(false);
    setIsEditing(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setPendingDelete(false);
    setStatus("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeleteImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setPendingDelete(true);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!user) return;

    try {
      setSaving(true);
      setStatus("");
      setIsError(false);

      let updatedProfileImage = profileImage;

      // 1. Pending delete
      if (pendingDelete) {
        await apiFetch(`/profile/${user.id}/image`, {
          method: "DELETE"
        });
        updatedProfileImage = null;
      }
      // 2. New upload
      else if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const token = getStoredToken();
        const headers = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`${API_BASE_URL}/profile/${user.id}/image`, {
          method: "POST",
          headers,
          body: formData
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Failed to upload image");
        }

        const updated = await res.json();
        updatedProfileImage = updated.profileImage;
      }

      // 3. Name update
      const data = await apiFetch(`/profile/${user.id}`, {
        method: "PUT",
        body: JSON.stringify({ name: editName, email })
      });

      const finalName = data.name || editName;
      setName(finalName);
      setProfileImage(updatedProfileImage);

      login({
        ...user,
        name: finalName,
        email: email,
        profileImage: updatedProfileImage
      });

      setSelectedFile(null);
      setPreviewUrl(null);
      setPendingDelete(false);
      setIsEditing(false);
      setStatus("Profile updated successfully!");
      setIsError(false);
    } catch (err) {
      setStatus(err.message || "Failed to update profile.");
      setIsError(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="account-page">
      <AdminSidebar active="profile" />
      <section className="account-content">
        <div className="account-header">
          <div>
            <p className="eyebrow">Settings</p>
            <h1>Admin Profile</h1>
            <p>Manage administrative personal details and profile avatar.</p>
          </div>
        </div>

        {status && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 16px",
            borderRadius: "8px",
            background: isError ? "#fef2f2" : "#f0fdf4",
            border: `1px solid ${isError ? "#fee2e2" : "#dcfce7"}`,
            color: isError ? "#b91c1c" : "#15803d",
            marginBottom: "20px"
          }}>
            {isError ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            <span>{status}</span>
          </div>
        )}

        {loading ? (
          <div className="empty-bookings">
            <p>Loading profile...</p>
          </div>
        ) : !isEditing ? (
          /* NORMAL VIEW MODE */
          <div className="profile-card" style={{ background: "#ffffff", border: "1px solid var(--line, #e5e7eb)", borderRadius: "12px", padding: "28px", maxWidth: "640px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "28px" }}>
              <Avatar name={name || user?.name} image={profileImage} size={84} />
              <div>
                <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "var(--ink, #1d2821)" }}>
                  {name || user?.name}
                </h2>
                <p style={{ margin: "4px 0 0", color: "var(--muted, #666)", fontSize: "14px" }}>
                  {email}
                </p>
                <span style={{ display: "inline-block", marginTop: "10px", padding: "3px 10px", borderRadius: "12px", background: "#fef3c7", border: "1px solid #fde68a", fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", color: "#92400e" }}>
                  Administrator
                </span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "28px", padding: "16px 20px", background: "#faf8f5", borderRadius: "8px", border: "1px solid var(--line, #e5e7eb)" }}>
              <div>
                <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--muted, #888)", fontWeight: 600 }}>Full Name</span>
                <p style={{ margin: "4px 0 0", fontSize: "15px", fontWeight: 600, color: "var(--ink, #1d2821)" }}>{name || "Not specified"}</p>
              </div>
              <div>
                <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--muted, #888)", fontWeight: 600 }}>Email Address</span>
                <p style={{ margin: "4px 0 0", fontSize: "15px", fontWeight: 600, color: "var(--ink, #1d2821)" }}>{email}</p>
              </div>
            </div>

            <button
              type="button"
              className="button button-dark"
              onClick={handleStartEdit}
            >
              Edit Profile
            </button>
          </div>
        ) : (
          /* EDIT MODE */
          <div className="profile-card" style={{ background: "#ffffff", border: "1px solid var(--line, #e5e7eb)", borderRadius: "12px", padding: "28px", maxWidth: "640px" }}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: 700 }}>Edit Administrator Profile</h3>

            {/* Profile Photo Controls (ONLY IN EDIT MODE) */}
            <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "28px", padding: "18px", background: "#fffdf8", border: "1px solid var(--line, #e5e7eb)", borderRadius: "12px" }}>
              <Avatar
                name={editName || name || user?.name}
                image={previewUrl ? previewUrl : (pendingDelete ? null : profileImage)}
                size={84}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontWeight: 600, fontSize: "15px" }}>Profile Photo</span>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="button button-dark"
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", fontSize: "13px" }}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={saving}
                  >
                    <Camera size={14} />
                    Change Image
                  </button>

                  {((profileImage && !pendingDelete) || previewUrl) && (
                    <button
                      type="button"
                      className="outline-button"
                      style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", fontSize: "13px", color: "#dc2626", borderColor: "#fca5a5" }}
                      onClick={handleDeleteImage}
                      disabled={saving}
                    >
                      <Trash2 size={14} />
                      Delete Image
                    </button>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: "none" }}
                />

                <small style={{ color: "var(--muted, #6b7280)", fontSize: "12px" }}>
                  {pendingDelete
                    ? "Photo marked for removal (Click Save to apply)"
                    : previewUrl
                    ? "New photo selected (Click Save to apply)"
                    : "Supports JPG, PNG or WEBP (Max 5MB)"}
                </small>
              </div>
            </div>

            <form onSubmit={handleSave} className="account-form">
              <label className="field-label">
                Full name
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  required
                />
              </label>

              <label className="field-label">
                Email
                <input
                  value={email}
                  disabled
                  style={{ opacity: 0.7, cursor: "not-allowed" }}
                />
              </label>

              <div style={{ display: "flex", gap: "12px", marginTop: "24px", alignItems: "center" }}>
                <button
                  type="submit"
                  className="button button-dark"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  className="outline-button"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}
