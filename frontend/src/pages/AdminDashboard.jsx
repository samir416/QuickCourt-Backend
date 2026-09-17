import AdminSidebar from "../components/AdminSidebar";
import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, facilityOwners: 0, totalBookings: 0, activeCourts: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await apiFetch("/admin/dashboard/stats");
        if (data) setStats(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <main className="account-page">
      <AdminSidebar active="dashboard" />
      <section className="account-content">
        <p className="eyebrow">Overview</p>
        <h2>Admin Dashboard</h2>
        
        {loading && <p>Loading dashboard...</p>}
        {error && <p style={{color: 'red'}}>Failed to load stats: {error}</p>}
        
        {!loading && !error && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #eee' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '14px', color: '#666' }}>Total Users</h3>
              <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold' }}>{stats.totalUsers || 0}</p>
            </div>
            <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #eee' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '14px', color: '#666' }}>Facility Owners</h3>
              <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold' }}>{stats.facilityOwners || 0}</p>
            </div>
            <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #eee' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '14px', color: '#666' }}>Total Bookings</h3>
              <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold' }}>{stats.totalBookings || 0}</p>
            </div>
            <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #eee' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '14px', color: '#666' }}>Active Courts</h3>
              <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold' }}>{stats.activeCourts || 0}</p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
