import OwnerSidebar from "../components/OwnerSidebar";
import ConfirmModal from "../components/ConfirmModal";
import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Plus, Clock, Edit2, Trash2, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

export default function OwnerCourts() {
  const [courts, setCourts] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const { user } = useAuth();
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formData, setFormData] = useState({
    venueId: '', name: '', sport: '', pricePerHour: '', openingTime: '06:00', closingTime: '23:00'
  });

  // Time Slots State
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [slotDate, setSlotDate] = useState(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState([]);
  const [newSlotTime, setNewSlotTime] = useState('10:00');
  const [slotMsg, setSlotMsg] = useState(null);
  const [slotErr, setSlotErr] = useState(null);

  // Confirm Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [courtToDelete, setCourtToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCourts = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await apiFetch("/owner/" + user.id + "/courts");
      setCourts(Array.isArray(data) ? data : []);
      const vData = await apiFetch("/owner/" + user.id + "/venues");
      setVenues(Array.isArray(vData) ? vData : []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourts();
  }, [user]);

  const confirmDeleteCourt = (court) => {
    setCourtToDelete(court);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!courtToDelete) return;
    try {
      setDeleting(true);
      await apiFetch("/courts/" + courtToDelete.id + "?ownerId=" + user.id, { method: 'DELETE' });
      setSuccessMsg(`Court "${courtToDelete.name || courtToDelete.courtName}" deleted successfully.`);
      setDeleteModalOpen(false);
      setCourtToDelete(null);
      fetchCourts();
    } catch (err) {
      setError("Failed to delete court: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = (c) => {
    setFormData({
      venueId: c.venueId || '',
      name: c.name || c.courtName || '',
      openingTime: c.openingTime || '06:00',
      closingTime: c.closingTime || '23:00',
      sport: c.sport || '',
      pricePerHour: c.pricePerHour || ''
    });
    setEditingId(c.id);
    setFormError(null);
    setShowForm(true);
  };
  
  const resetForm = () => {
    setFormData({ venueId: '', name: '', sport: '', pricePerHour: '', openingTime: '06:00', closingTime: '23:00' });
    setEditingId(null);
    setFormError(null);
    setShowForm(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.venueId) {
      setFormError("Please select a venue for this court.");
      return;
    }
    try {
      setFormSaving(true);
      setFormError(null);
      if (editingId) {
        await apiFetch("/courts/" + editingId + "?ownerId=" + user.id, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
        setSuccessMsg("Court updated successfully.");
      } else {
        await apiFetch("/courts?ownerId=" + user.id, {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        setSuccessMsg("New court created successfully.");
      }
      resetForm();
      fetchCourts();
    } catch (err) {
      setFormError(err.message || "Failed to save court.");
    } finally {
      setFormSaving(false);
    }
  };

  const fetchSlots = async (courtId, date) => {
    try {
      const data = await apiFetch("/time-slots/court/" + courtId + "?date=" + date);
      setSlots(Array.isArray(data) ? data : []);
      setSlotErr(null);
    } catch (err) {
      setSlotErr("Failed to load time slots: " + err.message);
    }
  };

  const openSlotManager = (c) => {
    setSelectedCourt(c);
    setSlotMsg(null);
    setSlotErr(null);
    fetchSlots(c.id, slotDate);
  };

  const handleAddSlot = async () => {
    try {
      setSlotMsg(null);
      setSlotErr(null);

      if (!newSlotTime) {
        setSlotErr("Please select a valid start time.");
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      if (slotDate < today) {
        setSlotErr("Cannot add time slots for past dates.");
        return;
      }

      // Calculate endTime as 1 hour after startTime
      const [h, m] = newSlotTime.split(':').map(Number);
      const endH = ((h + 1) % 24).toString().padStart(2, '0');
      const endTime = `${endH}:${m.toString().padStart(2, '0')}:00`;
      const startTime = newSlotTime.length === 5 ? newSlotTime + ':00' : newSlotTime;

      await apiFetch("/time-slots?ownerId=" + user.id, {
        method: 'POST',
        body: JSON.stringify({
          courtId: selectedCourt.id,
          slotDate: slotDate,
          date: slotDate,
          startTime: startTime,
          endTime: endTime
        })
      });
      setSlotMsg(`Slot at ${newSlotTime} added successfully.`);
      fetchSlots(selectedCourt.id, slotDate);
    } catch (err) {
      setSlotErr(err.message || "Failed to add slot.");
    }
  };

  const toggleSlotBlock = async (slot) => {
    try {
      setSlotMsg(null);
      setSlotErr(null);
      const isAvail = slot.status === 'AVAILABLE' || slot.isAvailable === true || slot.available === true;
      if (isAvail) {
        await apiFetch("/time-slots/" + slot.id + "/block?reason=Maintenance&ownerId=" + user.id, { method: 'PUT' });
        setSlotMsg(`Slot at ${slot.startTime} blocked for maintenance.`);
      } else {
        await apiFetch("/time-slots/" + slot.id + "/unblock?ownerId=" + user.id, { method: 'PUT' });
        setSlotMsg(`Slot at ${slot.startTime} unblocked.`);
      }
      fetchSlots(selectedCourt.id, slotDate);
    } catch (err) {
      setSlotErr(err.message || "Failed to update slot.");
    }
  };

  return (
    <main className="account-page">
      <OwnerSidebar active="courts" />
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>
                {editingId ? 'Edit Court' : 'Add New Court'}
              </h2>
              <button className="outline-button" onClick={resetForm} disabled={formSaving}>
                Cancel
              </button>
            </div>

            {formError && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", borderRadius: "6px", background: "#fef2f2", border: "1px solid #fee2e2", color: "#b91c1c", marginBottom: "16px" }}>
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="account-form">
              <label className="field-label">
                Select Venue
                <select required value={formData.venueId} onChange={e => setFormData({ ...formData, venueId: e.target.value })}>
                  <option value="">-- Select Venue --</option>
                  {venues.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </label>

              <label className="field-label">
                Court Name
                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Court 1 - Main Indoor" />
              </label>

              <label className="field-label">
                Sport
                <input required value={formData.sport} onChange={e => setFormData({ ...formData, sport: e.target.value })} placeholder="e.g. Badminton" />
              </label>

              <label className="field-label">
                Price Per Hour (INR)
                <input type="number" step="10" required value={formData.pricePerHour} onChange={e => setFormData({ ...formData, pricePerHour: e.target.value })} placeholder="e.g. 300" />
              </label>

              <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                <button type="submit" className="button button-dark" disabled={formSaving}>
                  {formSaving ? 'Saving...' : 'Save Court'}
                </button>
                <button type="button" className="outline-button" onClick={resetForm} disabled={formSaving}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : selectedCourt ? (
          <div className="profile-card" style={{ background: "#ffffff", border: "1px solid var(--line, #e5e7eb)", borderRadius: "12px", padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <button
                  type="button"
                  onClick={() => setSelectedCourt(null)}
                  style={{ background: "none", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: 600, padding: 0, marginBottom: "8px" }}
                >
                  <ArrowLeft size={16} /> Back to Courts
                </button>
                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>
                  Time Slots: {selectedCourt.name || selectedCourt.courtName}
                </h2>
              </div>
            </div>

            {slotMsg && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", borderRadius: "6px", background: "#f0fdf4", border: "1px solid #dcfce7", color: "#15803d", marginBottom: "16px" }}>
                <CheckCircle2 size={16} />
                <span>{slotMsg}</span>
              </div>
            )}

            {slotErr && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", borderRadius: "6px", background: "#fef2f2", border: "1px solid #fee2e2", color: "#b91c1c", marginBottom: "16px" }}>
                <AlertCircle size={16} />
                <span>{slotErr}</span>
              </div>
            )}

            <div style={{ background: "#faf8f5", border: "1px solid var(--line, #e5e7eb)", borderRadius: "8px", padding: "16px", display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center", marginBottom: "24px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: 600, color: "var(--muted)" }}>Date</label>
                <input
                  type="date"
                  value={slotDate}
                  onChange={e => { setSlotDate(e.target.value); fetchSlots(selectedCourt.id, e.target.value); }}
                  style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #ccc", background: "#fff" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <label style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: 600, color: "var(--muted)" }}>Start Time</label>
                <input
                  type="time"
                  value={newSlotTime}
                  onChange={e => setNewSlotTime(e.target.value)}
                  style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #ccc", background: "#fff" }}
                />
              </div>

              <div style={{ alignSelf: "flex-end" }}>
                <button
                  type="button"
                  className="button button-dark"
                  onClick={handleAddSlot}
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <Plus size={15} /> Add Slot
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '12px 14px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>Time</th>
                    <th style={{ padding: '12px 14px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>Status</th>
                    <th style={{ padding: '12px 14px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {slots.map(s => {
                    const isBooked = s.status === 'BOOKED';
                    const isAvailable = s.status === 'AVAILABLE' || s.isAvailable === true || s.available === true;
                    const isBlocked = s.status === 'BLOCKED' || (!isAvailable && !isBooked);

                    return (
                      <tr key={s.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '14px', fontWeight: 600, fontSize: '14px' }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                            <Clock size={15} color="var(--muted)" />
                            {s.startTime ? s.startTime.substring(0, 5) : '-'}
                            {s.endTime ? ` - ${s.endTime.substring(0, 5)}` : ''}
                          </span>
                        </td>
                        <td style={{ padding: '14px' }}>
                          {isBooked ? (
                            <span style={{
                              display: "inline-block",
                              padding: "3px 10px",
                              borderRadius: "12px",
                              fontSize: "11px",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              background: "#eff6ff",
                              color: "#2563eb",
                              border: "1px solid #bfdbfe"
                            }}>
                              Booked
                            </span>
                          ) : isBlocked ? (
                            <span style={{
                              display: "inline-block",
                              padding: "3px 10px",
                              borderRadius: "12px",
                              fontSize: "11px",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              background: "#fef2f2",
                              color: "#dc2626",
                              border: "1px solid #fca5a5"
                            }}>
                              Blocked {s.blockReason ? `(${s.blockReason})` : ''}
                            </span>
                          ) : (
                            <span style={{
                              display: "inline-block",
                              padding: "3px 10px",
                              borderRadius: "12px",
                              fontSize: "11px",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              background: "#e6f7ec",
                              color: "#1e7e34",
                              border: "1px solid #b7ebc6"
                            }}>
                              Available
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '14px', textAlign: 'right' }}>
                          {isBooked ? (
                            <span style={{ fontSize: "12px", color: "var(--muted)", fontStyle: "italic", padding: "6px 12px" }}>
                              Reserved
                            </span>
                          ) : isBlocked ? (
                            <button
                              type="button"
                              className="button button-dark"
                              onClick={() => toggleSlotBlock(s)}
                              style={{ fontSize: "12px", padding: "6px 14px" }}
                            >
                              Unblock Slot
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="outline-button"
                              onClick={() => toggleSlotBlock(s)}
                              style={{ fontSize: "12px", padding: "6px 14px" }}
                            >
                              Block Slot
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {slots.length === 0 && (
                    <tr>
                      <td colSpan="3" style={{ padding: '24px', textAlign: 'center', color: 'var(--muted)' }}>
                        No slots generated for this date. Use the controls above to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <p className="eyebrow">Management</p>
                <h1>Courts &amp; Time Slots</h1>
                <p>Manage your facility courts, sports, hourly pricing, and availability schedules.</p>
              </div>
              <button
                className="button button-dark"
                onClick={() => setShowForm(true)}
                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <Plus size={16} /> Add New Court
              </button>
            </div>
            
            {loading && <p>Loading courts...</p>}

            {!loading && courts.length > 0 ? (
              <div className="table-responsive" style={{ background: "#ffffff", border: "1px solid var(--line, #e5e7eb)", borderRadius: "12px", overflow: "hidden" }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb', background: "#faf8f5" }}>
                      <th style={{ padding: '14px 18px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>Court Name</th>
                      <th style={{ padding: '14px 18px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>Venue</th>
                      <th style={{ padding: '14px 18px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>Sport</th>
                      <th style={{ padding: '14px 18px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>Price/Hr</th>
                      <th style={{ padding: '14px 18px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courts.map(c => (
                      <tr key={c.id} style={{ borderBottom: '1px solid #f3f4f6', transition: "background 0.15s ease" }}>
                        <td style={{ padding: '16px 18px', fontWeight: 600, color: 'var(--ink, #1d2821)' }}>{c.name || c.courtName}</td>
                        <td style={{ padding: '16px 18px', color: 'var(--muted)' }}>{c.venueName || '-'}</td>
                        <td style={{ padding: '16px 18px' }}>
                          <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: "6px", background: "#f3f4f6", fontSize: "12px", fontWeight: 600 }}>
                            {c.sport || 'General'}
                          </span>
                        </td>
                        <td style={{ padding: '16px 18px', fontWeight: 700 }}>INR {Number(c.pricePerHour || 0).toFixed(2)}</td>
                        <td style={{ padding: '16px 18px', textAlign: 'right' }}>
                          <div style={{ display: "inline-flex", gap: "8px" }}>
                            <button
                              className="outline-button"
                              onClick={() => openSlotManager(c)}
                              style={{ fontSize: "12px", padding: "6px 10px" }}
                            >
                              Slots
                            </button>
                            <button
                              className="outline-button"
                              onClick={() => handleEdit(c)}
                              style={{ fontSize: "12px", padding: "6px 10px" }}
                            >
                              Edit
                            </button>
                            <button
                              className="outline-button"
                              onClick={() => confirmDeleteCourt(c)}
                              style={{ fontSize: "12px", padding: "6px 10px", color: "#dc2626", borderColor: "#fca5a5" }}
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
                <h3>No courts created yet</h3>
                <p>Click &quot;Add New Court&quot; above to set up courts for your venue.</p>
              </div>
            ) : null}
          </>
        )}

        <ConfirmModal
          isOpen={deleteModalOpen}
          title="Delete Court"
          message={`Are you sure you want to delete court "${courtToDelete?.name || courtToDelete?.courtName}"? This action cannot be undone.`}
          confirmText="Delete Court"
          cancelText="Cancel"
          confirmDanger={true}
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => { setDeleteModalOpen(false); setCourtToDelete(null); }}
        />
      </section>
    </main>
  );
}
