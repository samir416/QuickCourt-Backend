import OwnerSidebar from "../components/OwnerSidebar";
import { useState, useEffect, useRef } from "react";
import { apiFetch, API_BASE_URL } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function OwnerFacilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', address: '', city: '', state: '',
    description: '', sports: '', amenities: '', venueType: 'Indoor', startingPrice: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const { user } = useAuth();

  const fetchFacilities = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await apiFetch("/owner/" + user.id + "/venues");
      setFacilities(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, [user]);

  const handleDelete = async (venueId) => {
    try {
      await apiFetch("/venues/" + venueId + "?ownerId=" + user.id, { method: 'DELETE' });
      fetchFacilities();
    } catch (err) {
      alert("Failed to delete venue: " + err.message);
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
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '', address: '', city: '', state: '',
      description: '', sports: '', amenities: '', venueType: 'Indoor', startingPrice: ''
    });
    setEditingId(null);
    setSelectedFiles([]);
    setShowForm(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
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
      if (selectedFiles.length > 0) {
        setUploading(true);
        const formPayload = new FormData();
        Array.from(selectedFiles).forEach(file => {
          formPayload.append('files', file);
        });
        formPayload.append('venueId', savedVenue.id);
        formPayload.append('ownerId', user.id);

        await fetch(API_BASE_URL + '/venue-photos/upload', {
          method: 'POST',
          body: formPayload
          // Note: don't set Content-Type header manually, let fetch generate it with boundary
        });
        setUploading(false);
      }

      resetForm();
      fetchFacilities();
    } catch (err) {
      alert("Error saving facility: " + err.message);
      setUploading(false);
    }
  };

  return (
    <main className="account-page">
      <OwnerSidebar active="facilities" />
      <section className="account-content">
        
        {showForm ? (
          <div className="facility-form">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <h2>{editingId ? 'Edit Facility' : 'Add New Facility'}</h2>
              <button className="outline-button" onClick={resetForm}>Cancel</button>
            </div>
            
            <form onSubmit={handleSave} className="account-form" style={{marginTop:'20px'}}>
              <label className="field-label">Name
                <input required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} />
              </label>
              <div style={{display:'flex', gap:'15px'}}>
                <label className="field-label" style={{flex:1}}>City
                  <input required value={formData.city} onChange={e=>setFormData({...formData, city: e.target.value})} />
                </label>
                <label className="field-label" style={{flex:1}}>State
                  <input required value={formData.state} onChange={e=>setFormData({...formData, state: e.target.value})} />
                </label>
              </div>
              <label className="field-label">Address
                <input required value={formData.address} onChange={e=>setFormData({...formData, address: e.target.value})} />
              </label>
              <label className="field-label">Description
                <textarea rows="3" value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})}></textarea>
              </label>
              <div style={{display:'flex', gap:'15px'}}>
                <label className="field-label" style={{flex:1}}>Venue Type
                  <select value={formData.venueType} onChange={e=>setFormData({...formData, venueType: e.target.value})}>
                    <option>Indoor</option>
                    <option>Outdoor</option>
                    <option>Mixed</option>
                  </select>
                </label>
                <label className="field-label" style={{flex:1}}>Starting Price / Hr
                  <input type="number" required value={formData.startingPrice} onChange={e=>setFormData({...formData, startingPrice: e.target.value})} />
                </label>
              </div>
              <label className="field-label">Sports Supported (comma separated)
                <input required value={formData.sports} onChange={e=>setFormData({...formData, sports: e.target.value})} placeholder="Badminton, Tennis" />
              </label>
              <label className="field-label">Amenities (comma separated)
                <input value={formData.amenities} onChange={e=>setFormData({...formData, amenities: e.target.value})} placeholder="Parking, Wi-Fi, Washroom" />
              </label>
              
              <label className="field-label">Upload Photos (Multiple)
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(e) => setSelectedFiles(e.target.files)}
                  style={{padding: '10px 0'}}
                />
                {selectedFiles.length > 0 && <small style={{color:'green'}}>{selectedFiles.length} file(s) selected.</small>}
              </label>
              
              <button type="submit" className="button button-dark button-full" disabled={uploading}>
                {uploading ? 'Saving and Uploading...' : 'Save Facility'}
              </button>
            </form>
          </div>
        ) : (
          <>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div>
                <p className="eyebrow">Management</p>
                <h2>My Facilities (Venues)</h2>
              </div>
              <button className="button button-dark" onClick={() => setShowForm(true)}>Add New Facility</button>
            </div>
            
            {loading && <p>Loading facilities...</p>}
            {error && <p style={{color: 'red'}}>{error}</p>}

            {!loading && !error && facilities.length > 0 ? (
              <div className="table-responsive"><table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '20px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #eee' }}>
                    <th style={{ padding: '15px 10px' }}>Name</th>
                    <th style={{ padding: '15px 10px' }}>Location</th>
                    <th style={{ padding: '15px 10px' }}>Status</th>
                    <th style={{ padding: '15px 10px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {facilities.map(f => (
                    <tr key={f.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '15px 10px' }}>{f.name}</td>
                      <td style={{ padding: '15px 10px' }}>{f.city}</td>
                      <td style={{ padding: '15px 10px' }}>
                        <span className={f.approvalStatus === 'APPROVED' ? "status" : "status status-muted"}>
                          {f.approvalStatus || 'PENDING'}
                        </span>
                      </td>
                      <td style={{ padding: '15px 10px' }}>
                        <button className="outline-button" onClick={() => handleEdit(f)}>Edit</button>
                        <button className="outline-button" onClick={() => handleDelete(f.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table></div>
            ) : !loading && !error ? (
               <p style={{marginTop: '20px'}}>No facilities found.</p>
            ) : null}
          </>
        )}
      </section>
    </main>
  );
}

