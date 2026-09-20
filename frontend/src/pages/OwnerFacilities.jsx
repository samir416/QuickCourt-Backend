import OwnerSidebar from "../components/OwnerSidebar";
import ConfirmModal from "../components/ConfirmModal";
import { useState, useEffect, useRef } from "react";
import { apiFetch, API_BASE_URL } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Plus, CheckCircle2, AlertCircle, Image as ImageIcon, X } from "lucide-react";

export default function OwnerFacilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const { user } = useAuth();
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formData, setFormData] = useState({
    name: '', address: '', city: '', state: '',
    description: '', sports: '', amenities: '', venueType: 'Indoor', startingPrice: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Delete Confirm Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [venueToDelete, setVenueToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchFacilities = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await apiFetch("/owner/" + user.id + "/venues");
      setFacilities(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, [user]);

  const confirmDeleteVenue = (venue) => {
    setVenueToDelete(venue);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!venueToDelete) return;
    try {
      setDeleting(true);
      await apiFetch("/venues/" + venueToDelete.id + "?ownerId=" + user.id, { method: 'DELETE' });
      setSuccessMsg(`Facility "${venueToDelete.name}" deleted successfully.`);
      setDeleteModalOpen(false);
      setVenueToDelete(null);
      fetchFacilities();
    } catch (err) {
      setError("Failed to delete venue: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = (f) => {
    setFormData({
      name: f.name || '',
      address: f.address || '',
      city: f.city || '',
      state: f.state || '',
      description: f.description || '',
      sports: f.sports || '',
      amenities: f.amenities || '',
      venueType: f.venueType || 'Indoor',
      startingPrice: f.startingPrice || ''
    });
    setEditingId(f.id);
    setSelectedFiles([]);
    setFilePreviews([]);
    setFormError(null);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '', address: '', city: '', state: '',
      description: '', sports: '', amenities: '', venueType: 'Indoor', startingPrice: ''
    });
    setEditingId(null);
    setSelectedFiles([]);
    setFilePreviews([]);
    setFormError(null);
    setShowForm(false);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    const combinedFiles = [...selectedFiles, ...files];
    setSelectedFiles(combinedFiles);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setFilePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeSelectedPhoto = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setFilePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      setFormError(null);
      let savedVenue;
      if (editingId) {
        savedVenue = await apiFetch("/venues/" + editingId + "?ownerId=" + user.id, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        savedVenue = await apiFetch("/venues?ownerId=" + user.id, {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }

      // If photos were selected, upload them now
      if (selectedFiles.length > 0 && savedVenue?.id) {
        const formPayload = new FormData();
        selectedFiles.forEach(file => {
          formPayload.append('files', file);
        });
        formPayload.append('venueId', savedVenue.id);
        formPayload.append('ownerId', user.id);

        await fetch(API_BASE_URL + '/venue-photos/upload', {
          method: 'POST',
          body: formPayload
        });
      }

      setSuccessMsg(editingId ? "Facility updated successfully." : "New facility created and submitted for approval.");
      resetForm();
      fetchFacilities();
    } catch (err) {
      setFormError(err.message || "Failed to save facility.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="account-page">
      <OwnerSidebar active="facilities" />
      <section className="account-content">
        
        {successMsg && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", borderRadius: "8px", background: "#f0fdf4", border: "1px solid #dcfce7", color: "#15803d", marginBottom: "20px" }}>
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {error && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", borderRadius: "8px", background: "#fef2f2", border: "1px solid #fee2e2", color: "#b91c1c", marginBottom: "20px" }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {showForm ? (
          <div className="profile-card" style={{ background: "#ffffff", border: "1px solid var(--line, #e5e7eb)", borderRadius: "12px", padding: "28px" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "20px" }}>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>
                {editingId ? 'Edit Facility' : 'Add New Facility'}
              </h2>
              <button className="outline-button" onClick={resetForm} disabled={uploading}>Cancel</button>
            </div>

            {formError && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", borderRadius: "6px", background: "#fef2f2", border: "1px solid #fee2e2", color: "#b91c1c", marginBottom: "16px" }}>
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}
            
            <form onSubmit={handleSave} className="account-form">
              <label className="field-label">Name
                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Metro Badminton Club" />
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <label className="field-label">City
                  <input required value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} placeholder="e.g. Ahmedabad" />
                </label>
                <label className="field-label">State
                  <input required value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} placeholder="e.g. Gujarat" />
                </label>
              </div>

              <label className="field-label">Address
                <input required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="Full street address" />
              </label>

              <label className="field-label">Description
                <textarea
                  rows="4"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your sports complex, courts, and highlights"
                  style={{ minHeight: "110px", width: "100%", resize: "vertical", boxSizing: "border-box" }}
                ></textarea>
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <label className="field-label">Venue Type
                  <select value={formData.venueType} onChange={e => setFormData({ ...formData, venueType: e.target.value })}>
                    <option>Indoor</option>
                    <option>Outdoor</option>
                    <option>Mixed</option>
                  </select>
                </label>
                <label className="field-label">Starting Price / Hr (INR)
                  <input type="number" required value={formData.startingPrice} onChange={e => setFormData({ ...formData, startingPrice: e.target.value })} placeholder="e.g. 250" />
                </label>
              </div>

              <label className="field-label">Sports Supported (comma separated)
                <input required value={formData.sports} onChange={e => setFormData({ ...formData, sports: e.target.value })} placeholder="Badminton, Tennis, Pickleball" />
              </label>

              <label className="field-label">Amenities (comma separated)
                <input value={formData.amenities} onChange={e => setFormData({ ...formData, amenities: e.target.value })} placeholder="Parking, Locker Rooms, Wi-Fi, Drinking Water" />
              </label>
              
              <div style={{ marginTop: "16px", marginBottom: "24px" }}>
                <label className="field-label">Facility Photos (Optional)</label>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "6px" }}>
                  <button
                    type="button"
                    className="outline-button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    <ImageIcon size={15} /> Select Photos
                  </button>
                  <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                    {selectedFiles.length} photo(s) selected
                  </span>
                </div>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />

                {filePreviews.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "14px" }}>
                    {filePreviews.map((src, idx) => (
                      <div key={idx} style={{ position: "relative", width: "72px", height: "72px", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--line)" }}>
                        <img src={src} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <button
                          type="button"
                          onClick={() => removeSelectedPhoto(idx)}
                          style={{
                            position: "absolute",
                            top: "2px",
                            right: "2px",
                            background: "rgba(0,0,0,0.6)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "50%",
                            width: "20px",
                            height: "20px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div style={{ display: "flex", gap: "12px" }}>
                <button type="submit" className="button button-dark" disabled={uploading}>
                  {uploading ? 'Saving and Uploading...' : 'Save Facility'}
                </button>
                <button type="button" className="outline-button" onClick={resetForm} disabled={uploading}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "24px" }}>
              <div>
                <p className="eyebrow">Management</p>
                <h1>My Facilities</h1>
                <p>Manage your registered venues and check approval status.</p>
              </div>
              <button
                className="button button-dark"
                onClick={() => setShowForm(true)}
                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <Plus size={16} /> Add New Facility
              </button>
            </div>
            
            {loading && <p>Loading facilities...</p>}

            {!loading && facilities.length > 0 ? (
              <div className="table-responsive" style={{ background: "#ffffff", border: "1px solid var(--line, #e5e7eb)", borderRadius: "12px", overflow: "hidden" }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb', background: "#faf8f5" }}>
                      <th style={{ padding: '14px 18px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>Facility Name</th>
                      <th style={{ padding: '14px 18px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>Location</th>
                      <th style={{ padding: '14px 18px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>Starting Price</th>
                      <th style={{ padding: '14px 18px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>Status</th>
                      <th style={{ padding: '14px 18px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facilities.map(f => (
                      <tr key={f.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '16px 18px', fontWeight: 600, color: 'var(--ink, #1d2821)' }}>{f.name}</td>
                        <td style={{ padding: '16px 18px', color: 'var(--muted)' }}>{f.city}, {f.state}</td>
                        <td style={{ padding: '16px 18px', fontWeight: 600 }}>INR {Number(f.startingPrice || 0).toFixed(2)}/hr</td>
                        <td style={{ padding: '16px 18px' }}>
                          <span style={{
                            display: "inline-block",
                            padding: "3px 10px",
                            borderRadius: "12px",
                            fontSize: "11px",
                            fontWeight: 700,
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                            background: f.approvalStatus === 'APPROVED' ? "#e6f7ec" : "#fef3c7",
                            color: f.approvalStatus === 'APPROVED' ? "#1e7e34" : "#92400e",
                            border: `1px solid ${f.approvalStatus === 'APPROVED' ? "#b7ebc6" : "#fde68a"}`
                          }}>
                            {f.approvalStatus || 'PENDING'}
                          </span>
                        </td>
                        <td style={{ padding: '16px 18px', textAlign: 'right' }}>
                          <div style={{ display: "inline-flex", gap: "8px" }}>
                            <button
                              className="outline-button"
                              onClick={() => handleEdit(f)}
                              style={{ fontSize: "12px", padding: "6px 12px" }}
                            >
                              Edit
                            </button>
                            <button
                              className="outline-button"
                              onClick={() => confirmDeleteVenue(f)}
                              style={{ fontSize: "12px", padding: "6px 12px", color: "#dc2626", borderColor: "#fca5a5" }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : !loading ? (
              <div className="empty-bookings">
                <h3>No facilities found</h3>
                <p>Click &quot;Add New Facility&quot; above to submit your sports facility for approval.</p>
              </div>
            ) : null}
          </>
        )}

        <ConfirmModal
          isOpen={deleteModalOpen}
          title="Delete Facility"
          message={`Are you sure you want to delete facility "${venueToDelete?.name}"? All associated courts and bookings will be removed.`}
          confirmText="Delete Facility"
          cancelText="Cancel"
          confirmDanger={true}
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => { setDeleteModalOpen(false); setVenueToDelete(null); }}
        />
      </section>
    </main>
  );
}
