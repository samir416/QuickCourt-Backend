import AdminSidebar from "../components/AdminSidebar";
import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";

export default function AdminApprovals() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/admin/venues/pending");
      setVenues(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (venueId, action) => {
    try {
      await apiFetch(`/admin/venues/${venueId}/${action}`, { method: 'PUT' });
      fetchPending();
    } catch (err) {
      alert(`Failed to ${action} venue: ` + err.message);
    }
  };

  return (
    <main className="account-page">
      <AdminSidebar active="approvals" />
      <section className="account-content">
        <p className="eyebrow">Management</p>
        <h2>Pending Venue Approvals</h2>
        
        {loading && <p>Loading pending venues...</p>}
        {error && <p style={{color: 'red'}}>{error}</p>}

        {!loading && !error && venues.length > 0 ? (
          <div className="table-responsive"><table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee' }}>
                <th style={{ padding: '15px 10px' }}>Venue Name</th>
                <th style={{ padding: '15px 10px' }}>Owner ID</th>
                <th style={{ padding: '15px 10px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {venues.map(v => (
                <tr key={v.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px 10px' }}>{v.name}</td>
                  <td style={{ padding: '15px 10px' }}>{v.ownerId}</td>
                  <td style={{ padding: '15px 10px' }}>
                    <button className="button button-dark" onClick={() => handleAction(v.id, 'approve')}>Approve</button>
                    <button className="outline-button" onClick={() => handleAction(v.id, 'reject')}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        ) : !loading && !error ? (
           <p>No pending venue approvals.</p>
        ) : null}
      </section>
    </main>
  );
}
