import OwnerSidebar from "../components/OwnerSidebar";
import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function OwnerDashboard() {
  const [stats, setStats] = useState({ totalBookings: 0, activeCourts: 0, monthlyEarnings: 0 });
  const [trends, setTrends] = useState([]);
  const [calendar, setCalendar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const today = new Date();
        const start = today.toISOString().split('T')[0];
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + 7);
        const end = endDate.toISOString().split('T')[0];
        
        const [statsData, trendsData, calData] = await Promise.all([
          apiFetch("/owner/dashboard?ownerId=" + user.id),
          apiFetch("/owner/dashboard/" + user.id + "/trends").catch(() => []),
          apiFetch(`/owner/dashboard/${user.id}/calendar?startDate=${start}&endDate=${end}`).catch(() => [])
        ]);
        if (statsData) setStats(statsData);
        if (trendsData) setTrends(trendsData);
        if (calData) setCalendar(calData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const renderBarChart = (data, labelKey, valueKey, color, height = 150) => {
    if (!data || data.length === 0) return <p>No data available</p>;
    const maxVal = Math.max(...data.map(d => Number(d[valueKey]) || 0), 1);
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: `${height}px`, marginTop: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
        {data.map((item, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '10px', color: '#666' }}>{item[valueKey]}</span>
            <div style={{ width: '100%', backgroundColor: color, height: `${(Number(item[valueKey]) || 0) / maxVal * (height-30)}px`, borderRadius: '4px 4px 0 0', minHeight: '2px' }}></div>
            <span style={{ fontSize: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', color: '#333' }}>{item[labelKey]}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <main className="account-page">
      <OwnerSidebar active="dashboard" />
      <section className="account-content">
        <p className="eyebrow">Overview</p>
        <h2>Owner Dashboard</h2>
        
        {loading && <p>Loading dashboard...</p>}
        {error && <p style={{color: 'red'}}>Failed to load data: {error}</p>}
        
        {!loading && !error && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #eaeaea', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '14px', color: '#666' }}>Total Bookings</h3>
                <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold' }}>{stats.totalBookings || 0}</p>
              </div>
              <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #eaeaea', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '14px', color: '#666' }}>Active Courts</h3>
                <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold' }}>{stats.activeCourts || 0}</p>
              </div>
              <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #eaeaea', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '14px', color: '#666' }}>Monthly Earnings</h3>
                <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold' }}>INR {stats.monthlyEarnings || '0.00'}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #eaeaea' }}>
                <h3 style={{ margin: '0', fontSize: '16px' }}>Booking Trends</h3>
                {renderBarChart(trends, 'period', 'bookings', '#2ecc71')}
              </div>
              
              <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #eaeaea' }}>
                <h3 style={{ margin: '0', fontSize: '16px' }}>Earnings Trends</h3>
                {renderBarChart(trends, 'period', 'earnings', '#e67e22')}
              </div>
            </div>

            <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #eaeaea', marginTop: '40px' }}>
              <h3 style={{ margin: '0 0 15px', fontSize: '16px' }}>Upcoming Booking Calendar (Next 7 Days)</h3>
              {calendar.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                      <th style={{ padding: '10px' }}>Date</th>
                      <th style={{ padding: '10px' }}>Time</th>
                      <th style={{ padding: '10px' }}>Court</th>
                      <th style={{ padding: '10px' }}>User</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calendar.map((c, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '10px' }}>{c.date || c.bookingDate}</td>
                        <td style={{ padding: '10px' }}>{c.startTime}</td>
                        <td style={{ padding: '10px' }}>{c.courtName}</td>
                        <td style={{ padding: '10px' }}>{c.userName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No upcoming bookings scheduled.</p>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
