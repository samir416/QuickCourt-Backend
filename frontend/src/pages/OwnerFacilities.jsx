import OwnerSidebar from "../components/OwnerSidebar";
import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function OwnerFacilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchFacilities = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await apiFetch(`/owner/${user.id}/venues`);
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
      await apiFetch(`/venues/${venueId}`, { method: 'DELETE' });
      fetchFacilities();
    } catch (err) {
      alert(`Failed to delete venue: ` + err.message);
    }
  };

  return (
    <main className="account-page">
      <OwnerSidebar active="facilities" />
      <section className="account-content">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <p className="eyebrow">Management</p>
            <h2>My Facilities (Venues)</h2>
          </div>
          <button className="button button-dark">Add New Facility</button>
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
                  <td style={{ padding: '15px 10px' }}>{f.approvalStatus || 'Pending'}</td>
                  <td style={{ padding: '15px 10px' }}>
                    <button className="outline-button">Edit</button>
                    <button className="outline-button" onClick={() => handleDelete(f.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        ) : !loading && !error ? (
           <p style={{marginTop: '20px'}}>No facilities found.</p>
        ) : null}
      </section>
    </main>
  );
}
