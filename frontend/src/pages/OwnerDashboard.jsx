import OwnerSidebar from "../components/OwnerSidebar";
import BarChart from "../components/BarChart";
import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Calendar, DollarSign, Activity, AlertCircle } from "lucide-react";

export default function OwnerDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalBookings: 0,
    activeCourts: 0,
    totalEarnings: 0,
    monthlyEarnings: 0
  });

  const [trends, setTrends] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) return;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [statsData, trendsData, upcomingData] = await Promise.all([
          apiFetch("/owner/dashboard?ownerId=" + user.id),
          apiFetch("/owner/dashboard/" + user.id + "/trends").catch(() => []),
          apiFetch("/owner/dashboard/" + user.id + "/upcoming").catch(async () => {
            // Fallback to calendar endpoint if upcoming is unavailable
            const today = new Date();
            const startDate = today.toISOString().split("T")[0];
            const end = new Date(today);
            end.setDate(end.getDate() + 7);
            const cal = await apiFetch("/owner/dashboard/" + user.id + "/calendar?startDate=" + startDate + "&endDate=" + end.toISOString().split("T")[0]).catch(() => []);
            return Array.isArray(cal) ? cal.flatMap(d => d.bookings || []) : [];
          })
        ]);

        if (statsData) {
          setStats(statsData);
        }

        setTrends(Array.isArray(trendsData) ? trendsData : []);
        setUpcoming(Array.isArray(upcomingData) ? upcomingData : []);
      } catch (err) {
        setError(err.message || "Failed to load owner dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user?.id]);

  return (
    <main className="account-page">
      <OwnerSidebar active="dashboard" />

      <section className="account-content">
        <div className="account-header">
          <div>
            <p className="eyebrow">Facility Owner</p>
            <h1>Owner Dashboard</h1>
            <p>
              Monitor real-time reservations, court utilization, simulated earnings, and schedules.
            </p>
          </div>
        </div>

        {loading && (
          <div className="empty-bookings">
            <p>Loading dashboard analytics...</p>
          </div>
        )}

        {!loading && error && (
          <div
            className="auth-error"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 16px",
              borderRadius: "8px",
              background: "#fef2f2",
              border: "1px solid #fee2e2",
              color: "#b91c1c",
              marginBottom: "20px"
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* KPI Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "20px",
                marginBottom: "28px"
              }}
            >
              <div
                className="profile-card"
                style={{
                  background: "#ffffff",
                  border: "1px solid var(--line, #e5e7eb)",
                  borderRadius: "12px",
                  padding: "24px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <p className="eyebrow" style={{ margin: 0 }}>Total Bookings</p>
                  <Activity size={20} color="var(--muted)" />
                </div>
                <h2 style={{ fontSize: "32px", fontWeight: 700, margin: "10px 0 4px", color: "var(--ink, #1d2821)" }}>
                  {stats.totalBookings || 0}
                </h2>
                <p style={{ margin: 0, fontSize: "13px", color: "var(--muted, #666)" }}>
                  All-time venue reservations
                </p>
              </div>

              <div
                className="profile-card"
                style={{
                  background: "#ffffff",
                  border: "1px solid var(--line, #e5e7eb)",
                  borderRadius: "12px",
                  padding: "24px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <p className="eyebrow" style={{ margin: 0 }}>Active Courts</p>
                  <Calendar size={20} color="var(--muted)" />
                </div>
                <h2 style={{ fontSize: "32px", fontWeight: 700, margin: "10px 0 4px", color: "var(--ink, #1d2821)" }}>
                  {stats.activeCourts || 0}
                </h2>
                <p style={{ margin: 0, fontSize: "13px", color: "var(--muted, #666)" }}>
                  Currently available for play
                </p>
              </div>

              <div
                className="profile-card"
                style={{
                  background: "#ffffff",
                  border: "1px solid var(--line, #e5e7eb)",
                  borderRadius: "12px",
                  padding: "24px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <p className="eyebrow" style={{ margin: 0 }}>Estimated Earnings</p>
                  <DollarSign size={20} color="var(--muted)" />
                </div>
                <h2 style={{ fontSize: "32px", fontWeight: 700, margin: "10px 0 4px", color: "#16a34a" }}>
                  INR {Number(stats.totalEarnings ?? stats.monthlyEarnings ?? 0).toFixed(2)}
                </h2>
                <p style={{ margin: 0, fontSize: "13px", color: "var(--muted, #666)" }}>
                  Confirmed simulated earnings
                </p>
              </div>
            </div>

            {/* Charts Section */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "24px",
                marginBottom: "28px"
              }}
            >
              <section
                className="profile-card"
                style={{
                  background: "#ffffff",
                  border: "1px solid var(--line, #e5e7eb)",
                  borderRadius: "12px",
                  padding: "24px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
                }}
              >
                <p className="eyebrow" style={{ margin: 0 }}>Analytics</p>
                <h3 style={{ margin: "4px 0 0", fontSize: "18px", fontWeight: 700 }}>
                  Booking Trends
                </h3>
                <BarChart
                  data={trends}
                  valueKey="bookings"
                  labelKey="period"
                  color="#1d2821"
                  formatValue={v => v}
                  height={190}
                />
              </section>

              <section
                className="profile-card"
                style={{
                  background: "#ffffff",
                  border: "1px solid var(--line, #e5e7eb)",
                  borderRadius: "12px",
                  padding: "24px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
                }}
              >
                <p className="eyebrow" style={{ margin: 0 }}>Analytics</p>
                <h3 style={{ margin: "4px 0 0", fontSize: "18px", fontWeight: 700 }}>
                  Earnings Trends
                </h3>
                <BarChart
                  data={trends}
                  valueKey="earnings"
                  labelKey="period"
                  color="#16a34a"
                  formatValue={v => "₹" + Number(v).toFixed(0)}
                  height={190}
                />
              </section>
            </div>

            {/* Upcoming Bookings Table */}
            <section
              className="profile-card"
              style={{
                background: "#ffffff",
                border: "1px solid var(--line, #e5e7eb)",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "20px"
                }}
              >
                <div>
                  <p className="eyebrow" style={{ margin: 0 }}>Schedule</p>
                  <h3 style={{ margin: "4px 0 0", fontSize: "18px", fontWeight: 700 }}>
                    Upcoming Bookings
                  </h3>
                </div>

                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    padding: "4px 10px",
                    borderRadius: "12px",
                    background: "#f3f4f6",
                    color: "var(--muted)"
                  }}
                >
                  Next 7 days
                </span>
              </div>

              {upcoming.length === 0 ? (
                <div className="empty-bookings" style={{ padding: "40px", border: "1px dashed var(--line, #e5e7eb)", borderRadius: "8px" }}>
                  <p style={{ margin: 0 }}>No upcoming reservations scheduled.</p>
                </div>
              ) : (
                <div className="table-responsive" style={{ border: "1px solid var(--line, #e5e7eb)", borderRadius: "8px", overflow: "hidden" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      textAlign: "left"
                    }}
                  >
                    <thead>
                      <tr style={{ background: "#faf8f5", borderBottom: "2px solid #e5e7eb" }}>
                        <th style={{ padding: "12px 16px", fontSize: "12px", textTransform: "uppercase", color: "var(--muted)", fontWeight: 600 }}>
                          Date
                        </th>
                        <th style={{ padding: "12px 16px", fontSize: "12px", textTransform: "uppercase", color: "var(--muted)", fontWeight: 600 }}>
                          Time
                        </th>
                        <th style={{ padding: "12px 16px", fontSize: "12px", textTransform: "uppercase", color: "var(--muted)", fontWeight: 600 }}>
                          Court
                        </th>
                        <th style={{ padding: "12px 16px", fontSize: "12px", textTransform: "uppercase", color: "var(--muted)", fontWeight: 600 }}>
                          Player
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {upcoming.map((booking, index) => (
                        <tr key={booking.id || index} style={{ borderBottom: "1px solid #f3f4f6" }}>
                          <td style={{ padding: "14px 16px", fontWeight: 600 }}>
                            {booking.bookingDate || booking.date || "-"}
                          </td>

                          <td style={{ padding: "14px 16px", color: "var(--muted)" }}>
                            {booking.startTime ? (booking.startTime.length >= 5 ? booking.startTime.substring(0, 5) : booking.startTime) : "-"}
                          </td>

                          <td style={{ padding: "14px 16px", fontWeight: 600, color: "var(--ink, #1d2821)" }}>
                            {booking.courtName || "-"}
                          </td>

                          <td style={{ padding: "14px 16px" }}>
                            {booking.userName || "Player"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </section>
    </main>
  );
}