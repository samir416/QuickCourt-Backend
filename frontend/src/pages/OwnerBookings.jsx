import OwnerSidebar from "../components/OwnerSidebar";
import { useState, useEffect } from "react";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { CalendarDays, Clock, User, AlertCircle } from "lucide-react";

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
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  const formatDate = value => {
    if (!value) return "Date unavailable";
    const date = new Date(value + "T00:00:00");
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const formatTime = value => {
    if (!value) return "-";
    const parts = String(value).split(":");
    if (parts.length < 2) return value;
    const hours = Number(parts[0]);
    const minutes = parts[1];
    if (Number.isNaN(hours)) return value;
    const suffix = hours >= 12 ? "PM" : "AM";
    const displayHour = hours % 12 || 12;
    return displayHour + ":" + minutes + " " + suffix;
  };

  return (
    <main className="account-page">
      <OwnerSidebar active="bookings" />
      <section className="account-content">
        <div className="account-header">
          <div>
            <p className="eyebrow">Reservations</p>
            <h1>Venue Court Bookings</h1>
            <p>Review customer reservations, schedule details, and payment statuses across your venues.</p>
          </div>
        </div>
        
        {loading && <p>Loading reservations...</p>}
        {error && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", borderRadius: "8px", background: "#fef2f2", border: "1px solid #fee2e2", color: "#b91c1c", marginBottom: "20px" }}>
            <AlertCircle size={18} />
            <span>Failed to load bookings: {error}</span>
          </div>
        )}

        {!loading && !error && bookings.length > 0 ? (
          <div className="table-responsive" style={{ background: "#ffffff", border: "1px solid var(--line, #e5e7eb)", borderRadius: "12px", overflow: "hidden" }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: "#faf8f5", borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '14px 16px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>Player</th>
                  <th style={{ padding: '14px 16px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>Court &amp; Venue</th>
                  <th style={{ padding: '14px 16px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>Sport</th>
                  <th style={{ padding: '14px 16px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>Date &amp; Time</th>
                  <th style={{ padding: '14px 16px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '14px 16px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600, textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink)", fontWeight: 700, fontSize: "12px" }}>
                          {(b.userName || "P").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: "14px", color: "var(--ink, #1d2821)" }}>
                            {b.userName || "Player"}
                          </p>
                          <small style={{ color: "var(--muted)", fontSize: "11px" }}>
                            {b.userEmail || `User #${b.userId}`}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <strong style={{ display: "block", fontSize: "14px", color: "var(--ink)" }}>{b.courtName || "Court"}</strong>
                      <span style={{ fontSize: "12px", color: "var(--muted)" }}>{b.venueName || "Venue"}</span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: "6px", background: "#f3f4f6", fontSize: "12px", fontWeight: 600 }}>
                        {b.sport || "Badminton"}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 500 }}>
                        <CalendarDays size={13} color="var(--muted)" />
                        {formatDate(b.bookingDate)}
                      </span>
                      <small style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--muted)", marginTop: "3px" }}>
                        <Clock size={13} color="var(--muted)" />
                        {formatTime(b.startTime)}{b.endTime ? " - " + formatTime(b.endTime) : ""}
                      </small>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        display: "inline-block",
                        padding: "3px 10px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                        background: b.status === 'CONFIRMED' ? '#e6f7ec' : b.status === 'CANCELLED' ? '#fef2f2' : '#eff6ff',
                        color: b.status === 'CONFIRMED' ? '#1e7e34' : b.status === 'CANCELLED' ? '#dc2626' : '#1d4ed8',
                        border: `1px solid ${b.status === 'CONFIRMED' ? '#b7ebc6' : b.status === 'CANCELLED' ? '#fca5a5' : '#bfdbfe'}`
                      }}>
                        {b.status || 'PENDING'}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right', fontWeight: 700, fontSize: "15px", color: "var(--ink, #1d2821)" }}>
                      INR {Number(b.totalPrice || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : !loading && !error ? (
          <div className="empty-bookings" style={{ padding: "40px", border: "1px dashed var(--line, #e5e7eb)", borderRadius: "8px" }}>
            <h3>No reservations recorded</h3>
            <p>Customer reservations booked at your courts will appear here.</p>
          </div>
        ) : null}
      </section>
    </main>
  );
}
