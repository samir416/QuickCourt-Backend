import AdminSidebar from "../components/AdminSidebar";
import BarChart from "../components/BarChart";
import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";
import { Users, Shield, CalendarCheck, MapPin, AlertCircle } from "lucide-react";

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
          apiFetch("/admin/dashboard/trends").catch(() => []),
          apiFetch("/admin/dashboard/approval-trend").catch(() => []),
          apiFetch("/admin/dashboard/most-active-sports").catch(() => [])
        ]);
        if (statsData) setStats(statsData);
        if (trendsData) setTrends(Array.isArray(trendsData) ? trendsData : []);
        if (appTrend) setApprovalTrend(Array.isArray(appTrend) ? appTrend : []);
        if (spTrend) setSportsTrend(Array.isArray(spTrend) ? spTrend : []);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="account-page">
      <AdminSidebar active="dashboard" />
      <section className="account-content">
        <div className="account-header">
          <div>
            <p className="eyebrow">Overview</p>
            <h1>Admin Dashboard</h1>
            <p>System-wide metrics, facility approvals, registration trends, and activity telemetry.</p>
          </div>
        </div>
        
        {loading && <p>Loading system analytics...</p>}
        {error && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", borderRadius: "8px", background: "#fef2f2", border: "1px solid #fee2e2", color: "#b91c1c", marginBottom: "20px" }}>
            <AlertCircle size={18} />
            <span>Failed to load data: {error}</span>
          </div>
        )}
        
        {!loading && !error && (
          <>
            {/* Global Stats KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid var(--line, #e5e7eb)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <p className="eyebrow" style={{ margin: 0 }}>Total Users</p>
                  <Users size={18} color="var(--muted)" />
                </div>
                <h2 style={{ margin: '8px 0 0', fontSize: '32px', fontWeight: 'bold', color: "var(--ink, #1d2821)" }}>{stats.totalUsers || 0}</h2>
              </div>
              <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid var(--line, #e5e7eb)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <p className="eyebrow" style={{ margin: 0 }}>Facility Owners</p>
                  <Shield size={18} color="var(--muted)" />
                </div>
                <h2 style={{ margin: '8px 0 0', fontSize: '32px', fontWeight: 'bold', color: "var(--ink, #1d2821)" }}>{stats.totalFacilityOwners ?? stats.facilityOwners ?? 0}</h2>
              </div>
              <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid var(--line, #e5e7eb)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <p className="eyebrow" style={{ margin: 0 }}>Total Bookings</p>
                  <CalendarCheck size={18} color="var(--muted)" />
                </div>
                <h2 style={{ margin: '8px 0 0', fontSize: '32px', fontWeight: 'bold', color: "var(--ink, #1d2821)" }}>{stats.totalBookings || 0}</h2>
              </div>
              <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid var(--line, #e5e7eb)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <p className="eyebrow" style={{ margin: 0 }}>Active Courts</p>
                  <MapPin size={18} color="var(--muted)" />
                </div>
                <h2 style={{ margin: '8px 0 0', fontSize: '32px', fontWeight: 'bold', color: "var(--ink, #1d2821)" }}>{stats.activeCourts || 0}</h2>
              </div>
            </div>

            {/* Charts Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '28px' }}>
              <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid var(--line, #e5e7eb)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <p className="eyebrow" style={{ margin: 0 }}>Activity</p>
                <h3 style={{ margin: '4px 0 0', fontSize: '18px', fontWeight: 700 }}>Booking Activity Over Time</h3>
                <BarChart data={trends} labelKey="period" valueKey="bookings" color="#16a34a" height={190} />
              </div>
              
              <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid var(--line, #e5e7eb)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <p className="eyebrow" style={{ margin: 0 }}>Growth</p>
                <h3 style={{ margin: '4px 0 0', fontSize: '18px', fontWeight: 700 }}>User Registration Trends</h3>
                <BarChart data={trends} labelKey="period" valueKey="users" color="#2563eb" height={190} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid var(--line, #e5e7eb)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <p className="eyebrow" style={{ margin: 0 }}>Approvals</p>
                <h3 style={{ margin: '4px 0 0', fontSize: '18px', fontWeight: 700 }}>Facility Approval Trend</h3>
                <BarChart data={approvalTrend} labelKey="period" valueKey="approved" color="#d97706" height={190} />
              </div>
              
              <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid var(--line, #e5e7eb)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <p className="eyebrow" style={{ margin: 0 }}>Preferences</p>
                <h3 style={{ margin: '4px 0 0', fontSize: '18px', fontWeight: 700 }}>Most Active Sports</h3>
                <BarChart data={sportsTrend} labelKey="sport" valueKey="bookingCount" color="#7c3aed" height={190} />
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
