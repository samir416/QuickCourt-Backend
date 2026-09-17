import OwnerSidebar from "../components/OwnerSidebar";
import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function OwnerCourts() {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchCourts = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await apiFetch(`/owner/${user.id}/courts`);
      setCourts(Array.isArray(data) ? data : []);
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
      await apiFetch(`/courts/${courtId}`, { method: 'DELETE' });
      fetchCourts();
    } catch (err) {
      alert(`Failed to delete court: ` + err.message);
    }
  };

  return (
    <main className="account-page">
      <OwnerSidebar active="courts" />
      <section className="account-content">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <p className="eyebrow">Management</p>
            <h2>My Courts</h2>
          </div>
          <button className="button button-dark">Add New Court</button>
        </div>
        
        {loading && <p>Loading courts...</p>}
        {error && <p style={{color: 'red'}}>{error}</p>}

        {!loading && !error && courts.length > 0 ? (
          <div className="table-responsive"><table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '20px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee' }}>
                <th style={{ padding: '15px 10px' }}>Court Name</th>
                <th style={{ padding: '15px 10px' }}>Venue</th>
                <th style={{ padding: '15px 10px' }}>Sport</th>
                <th style={{ padding: '15px 10px' }}>Price/Hr</th>
                <th style={{ padding: '15px 10px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {courts.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px 10px' }}>{c.name || c.courtName}</td>
                  <td style={{ padding: '15px 10px' }}>{c.venueName}</td>
                  <td style={{ padding: '15px 10px' }}>{c.sport}</td>
                  <td style={{ padding: '15px 10px' }}>?{c.pricePerHour}</td>
                  <td style={{ padding: '15px 10px' }}>
                    <button className="outline-button">Edit</button>
                    <button className="outline-button" onClick={() => handleDelete(c.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        ) : !loading && !error ? (
           <p style={{marginTop: '20px'}}>No courts found.</p>
        ) : null}
      </section>
    </main>
  );
}
