import OwnerSidebar from "../components/OwnerSidebar";
import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function OwnerCourts() {
  const [courts, setCourts] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    venueId: '', name: '', sport: '', pricePerHour: ''
  });

  // Time Slots State
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [slotDate, setSlotDate] = useState(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState([]);
  const [newSlotTime, setNewSlotTime] = useState('10:00');

  const fetchCourts = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await apiFetch(/owner/ + user.id + /courts);
      setCourts(Array.isArray(data) ? data : []);
      const vData = await apiFetch(/owner/ + user.id + /venues);
      setVenues(Array.isArray(vData) ? vData : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourts();
  }, [user]);

  const handleDelete = async (courtId) => {
    try {
      await apiFetch(/courts/ + courtId, { method: 'DELETE' });
      fetchCourts();
    } catch (err) {
      alert("Failed to delete court: " + err.message);
    }
  };

  const handleEdit = (c) => {
    setFormData({
      venueId: c.venueId || '',
      name: c.name || c.courtName || '',
      sport: c.sport || '',
      pricePerHour: c.pricePerHour || ''
    });
    setEditingId(c.id);
    setShowForm(true);
  };
  
  const resetForm = () => {
    setFormData({ venueId: '', name: '', sport: '', pricePerHour: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.venueId) {
        alert("Please select a venue.");
        return;
    }
    try {
      if (editingId) {
        await apiFetch(/courts/ + editingId, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await apiFetch(/courts?ownerId= + user.id, {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      resetForm();
      fetchCourts();
    } catch (err) {
      alert("Error saving court: " + err.message);
    }
  };

  const fetchSlots = async (courtId, date) => {
    try {
      const data = await apiFetch(/time-slots/court/ + courtId + ?date= + date);
      setSlots(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const openSlotManager = (c) => {
    setSelectedCourt(c);
    fetchSlots(c.id, slotDate);
  };

  const handleAddSlot = async () => {
    try {
      await apiFetch(/time-slots?ownerId= + user.id, {
        method: 'POST',
        body: JSON.stringify({ courtId: selectedCourt.id, date: slotDate, startTime: newSlotTime + ':00', isAvailable: true })
      });
      fetchSlots(selectedCourt.id, slotDate);
    } catch (err) {
      alert("Failed to add slot: " + err.message);
    }
  };

  const toggleSlotBlock = async (slot) => {
    try {
      if (slot.isAvailable) {
        const reason = prompt("Reason for blocking?", "Maintenance");
        if (reason) await apiFetch(/time-slots/ + slot.id + /block?reason= + reason + &ownerId= + user.id, { method: 'PUT' });
      } else {
        await apiFetch(/time-slots/ + slot.id + /unblock?ownerId= + user.id, { method: 'PUT' });
      }
      fetchSlots(selectedCourt.id, slotDate);
    } catch (err) {
      alert("Failed to update slot: " + err.message);
    }
  };

  return (
    <main className="account-page">
      <OwnerSidebar active="courts" />
      <section className="account-content">
        
        {showForm ? (
          <div className="facility-form">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <h2>{editingId ? 'Edit Court' : 'Add New Court'}</h2>
              <button className="outline-button" onClick={resetForm}>Cancel</button>
            </div>
            <form onSubmit={handleSave} className="account-form" style={{marginTop:'20px'}}>
              <label className="field-label">Select Venue
                <select required value={formData.venueId} onChange={e=>setFormData({...formData, venueId: e.target.value})}>
                  <option value="">-- Select Venue --</option>
                  {venues.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </label>
              <label className="field-label">Court Name
                <input required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} placeholder="e.g. Court A" />
              </label>
              <label className="field-label">Sport
                <input required value={formData.sport} onChange={e=>setFormData({...formData, sport: e.target.value})} placeholder="e.g. Badminton" />
              </label>
              <label className="field-label">Price Per Hour (INR)
                <input type="number" required value={formData.pricePerHour} onChange={e=>setFormData({...formData, pricePerHour: e.target.value})} />
              </label>
              <button type="submit" className="button button-dark button-full" style={{marginTop: '20px'}}>
                Save Court
              </button>
            </form>
          </div>
        ) : selectedCourt ? (
          <div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <h2>Manage Slots: {selectedCourt.name || selectedCourt.courtName}</h2>
              <button className="outline-button" onClick={() => setSelectedCourt(null)}>Back to Courts</button>
            </div>
            <div style={{marginTop: '20px', display: 'flex', gap: '15px', alignItems: 'center'}}>
                <input type="date" value={slotDate} onChange={e => { setSlotDate(e.target.value); fetchSlots(selectedCourt.id, e.target.value); }} />
                <input type="time" value={newSlotTime} onChange={e => setNewSlotTime(e.target.value)} />
                <button className="button button-dark" onClick={handleAddSlot}>Add Slot</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '20px' }}>
                <thead><tr style={{ borderBottom: '2px solid #eee' }}><th style={{ padding: '15px 10px' }}>Time</th><th style={{ padding: '15px 10px' }}>Status</th><th style={{ padding: '15px 10px' }}>Action</th></tr></thead>
                <tbody>
                    {slots.map(s => (
                        <tr key={s.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '15px 10px' }}>{s.startTime}</td>
                            <td style={{ padding: '15px 10px' }}>{s.isAvailable ? 'Available' : 'Blocked'}</td>
                            <td style={{ padding: '15px 10px' }}>
                                <button className="outline-button" onClick={() => toggleSlotBlock(s)}>
                                    {s.isAvailable ? 'Block' : 'Unblock'}
                                </button>
                            </td>
                        </tr>
                    ))}
                    {slots.length === 0 && <tr><td colSpan="3" style={{padding: '15px 10px'}}>No slots generated for this date.</td></tr>}
                </tbody>
            </table>
          </div>
        ) : (
          <>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div>
                <p className="eyebrow">Management</p>
                <h2>My Courts & Slots</h2>
              </div>
              <button className="button button-dark" onClick={() => setShowForm(true)}>Add New Court</button>
            </div>
            
            {loading && <p>Loading courts...</p>}
            {error && <p style={{color: 'red'}}>{error}</p>}

            {!loading && !error && courts.length > 0 ? (
              <div className="table-responsive"><table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '20px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #eee' }}>
                    <th style={{ padding: '15px 10px' }}>Court Name</th>
                    <th style={{ padding: '15px 10px' }}>Venue</th>
                    <th style={{ padding: '15px 10px' }}>Price/Hr</th>
                    <th style={{ padding: '15px 10px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {courts.map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '15px 10px' }}>{c.name || c.courtName}</td>
                      <td style={{ padding: '15px 10px' }}>{c.venueName || '-'}</td>
                      <td style={{ padding: '15px 10px' }}>INR {c.pricePerHour}</td>
                      <td style={{ padding: '15px 10px' }}>
                        <button className="outline-button" onClick={() => openSlotManager(c)}>Slots</button>
                        <button className="outline-button" onClick={() => handleEdit(c)}>Edit</button>
                        <button className="outline-button" onClick={() => handleDelete(c.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table></div>
            ) : !loading && !error ? (
               <p style={{marginTop: '20px'}}>No courts found.</p>
            ) : null}
          </>
        )}
      </section>
    </main>
  );
}
