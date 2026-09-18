import AdminSidebar from "../components/AdminSidebar";
import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, facilityOwners: 0, totalBookings: 0, activeCourts: 0 });
  const [trends, setTrends] = useState([]);
  const [approvalTrend, setApprovalTrend] = useState([]);
  const [sportsTrend, setSportsTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, trendsData, appTrend, spTrend] = await Promise.all([
          apiFetch("/admin/dashboard/stats"),
          apiFetch("/admin/dashboard/trends").catch(()=>[]),
          apiFetch("/admin/dashboard/approval-trend").catch(()=>[]),
          apiFetch("/admin/dashboard/most-active-sports").catch(()=>[])
        ]);
        if (statsData) setStats(statsData);
        if (trendsData) setTrends(trendsData);
        if (appTrend) setApprovalTrend(appTrend);
        if (spTrend) setSportsTrend(spTrend);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
      <AdminSidebar active="dashboard" />
      <section className="account-content">
        <p className="eyebrow">Overview</p>
        <h2>Admin Dashboard</h2>
        
        {loading && <p>Loading dashboard...</p>}
        {error && <p style={{color: 'red'}}>Failed to load data: {error}</p>}
        
        {!loading && !error && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #eaeaea', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '14px', color: '#666' }}>Total Users</h3>
                <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold' }}>{stats.totalUsers || 0}</p>
              </div>
              <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #eaeaea', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '14px', color: '#666' }}>Facility Owners</h3>
                <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold' }}>{stats.facilityOwners || 0}</p>
              </div>
              <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #eaeaea', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '14px', color: '#666' }}>Total Bookings</h3>
                <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold' }}>{stats.totalBookings || 0}</p>
              </div>
              <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #eaeaea', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '14px', color: '#666' }}>Active Courts</h3>
                <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold' }}>{stats.activeCourts || 0}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
              <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #eaeaea' }}>
                <h3 style={{ margin: '0', fontSize: '16px' }}>Booking Activity Over Time</h3>
                {renderBarChart(trends, 'period', 'bookings', '#2ecc71')}
              </div>
              
              <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #eaeaea' }}>
                <h3 style={{ margin: '0', fontSize: '16px' }}>User Registration Trends</h3>
                {renderBarChart(trends, 'period', 'users', '#3498db')}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #eaeaea' }}>
                <h3 style={{ margin: '0', fontSize: '16px' }}>Facility Approval Trend</h3>
                {renderBarChart(approvalTrend, 'period', 'approved', '#f1c40f')}
              </div>
              
              <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #eaeaea' }}>
                <h3 style={{ margin: '0', fontSize: '16px' }}>Most Active Sports</h3>
                {renderBarChart(sportsTrend, 'sport', 'bookingCount', '#9b59b6')}
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
