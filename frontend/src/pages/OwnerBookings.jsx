import OwnerSidebar from "../components/OwnerSidebar";
import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function OwnerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const data = await apiFetch(`/owner/${user.id}/bookings`);
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  return (
    <main className="account-page">
      <OwnerSidebar active="bookings" />
      <section className="account-content">
        <p className="eyebrow">Management</p>
        <h2>Court Bookings</h2>
        
        {loading && <p>Loading bookings...</p>}
        {error && <p style={{color: 'red'}}>{error}</p>}

        {!loading && !error && bookings.length > 0 ? (
          <div className="table-responsive"><table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '20px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee' }}>
                <th style={{ padding: '15px 10px' }}>Date</th>
                <th style={{ padding: '15px 10px' }}>Time</th>
                <th style={{ padding: '15px 10px' }}>Venue</th>
                <th style={{ padding: '15px 10px' }}>Court</th>
                <th style={{ padding: '15px 10px' }}>User</th>
                <th style={{ padding: '15px 10px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px 10px' }}>{b.bookingDate}</td>
                  <td style={{ padding: '15px 10px' }}>{b.startTime}</td>
                  <td style={{ padding: '15px 10px' }}>{b.venueName}</td>
                  <td style={{ padding: '15px 10px' }}>{b.courtName}</td>
                  <td style={{ padding: '15px 10px' }}>{b.userName}</td>
                  <td style={{ padding: '15px 10px' }}>{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table></div>
        ) : !loading && !error ? (
           <p style={{marginTop: '20px'}}>No bookings found for your venues.</p>
        ) : null}
      </section>
    </main>
  );
}
