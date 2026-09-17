import OwnerSidebar from "../components/OwnerSidebar";
import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function OwnerDashboard() {
  const [stats, setStats] = useState({ totalBookings: 0, activeCourts: 0, monthlyEarnings: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const data = await apiFetch("/owner/dashboard?ownerId=" + user.id);
        if (data) setStats(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  return (
    <main className="account-page">
      <OwnerSidebar active="dashboard" />
      <section className="account-content">
        <p className="eyebrow">Overview</p>
        <h2>Owner Dashboard</h2>
        
        {loading && <p>Loading dashboard...</p>}
        {error && <p style={{color: 'red'}}>Failed to load data: {error}</p>}
        
        {!loading && !error && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #eee' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '14px', color: '#666' }}>Total Bookings</h3>
              <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold' }}>{stats.totalBookings || 0}</p>
            </div>
            <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #eee' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '14px', color: '#666' }}>Active Courts</h3>
              <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold' }}>{stats.activeCourts || 0}</p>
            </div>
            <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #eee' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '14px', color: '#666' }}>Monthly Earnings</h3>
              <p style={{ margin: '0', fontSize: '32px', fontWeight: 'bold' }}>?{stats.monthlyEarnings || '0.00'}</p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
