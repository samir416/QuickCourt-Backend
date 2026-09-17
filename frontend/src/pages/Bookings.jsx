import AccountSidebar from "../components/AccountSidebar";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { venues } from "../data/venues";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Bookings() {
  const [activeTab, setActiveTab] = useState("all");
  const [apiBookings, setApiBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) {
        setLoading(false);
        setError("Please log in to view your bookings.");
        return;
      }
      try {
        setLoading(true);
        const data = await apiFetch("/bookings/user/" + user.id);
        setApiBookings(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        setError(err.message);
        setApiBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  const handleCancelBooking = async (bookingId) => {
    try {
      await apiFetch("/bookings/" + bookingId + "/cancel", { method: "PUT" });
      const data = await apiFetch("/bookings/user/" + user.id);
      setApiBookings(Array.isArray(data) ? data : []);
    } catch(err) {
      alert("Failed to cancel: " + err.message);
    }
  };

  const visibleBookings = apiBookings.filter((booking) =>
    activeTab === "all"
      ? booking.status !== "CANCELLED"
      : booking.status === "CANCELLED",
  );
  
  const allCount = apiBookings.filter(b => b.status !== "CANCELLED").length;
  const cancelCount = apiBookings.filter(b => b.status === "CANCELLED").length;

  return (
    <main className="account-page bookings-wireframe-page">
      <AccountSidebar active="bookings" />
      <section className="account-content">
        <div className="bookings-header">
          <div>
            <p className="eyebrow">Profile page</p>
            <h2>All bookings</h2>
            <p className="bookings-intro">
              Manage your upcoming and past court reservations.
            </p>
          </div>
          <Link className="button button-dark" to="/booking">
            Book a new court -&gt;
          </Link>
        </div>
        <div
          className="booking-tabs"
          role="tablist"
          aria-label="Booking history"
        >
          <button
            className={activeTab === "all" ? "active" : ""}
            onClick={() => setActiveTab("all")}
            role="tab"
          >
            All bookings <span>{allCount}</span>
          </button>
          <button
            className={activeTab === "cancelled" ? "active" : ""}
            onClick={() => setActiveTab("cancelled")}
            role="tab"
          >
            Cancelled <span>{cancelCount}</span>
          </button>
        </div>
        
        {loading && <p style={{marginTop:'20px'}}>Loading bookings...</p>}
        {error && <p style={{color: 'red', marginTop:'20px'}}>{error}</p>}

        <div className="booking-history">
          {!loading && !error && visibleBookings.length > 0 ? (
            visibleBookings.map((booking) => {
              const isCancelled = booking.status === "CANCELLED";
              const [year, month, day] = booking.bookingDate ? booking.bookingDate.split("-") : ["", "", ""];
              const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
              const monthName = month ? months[parseInt(month, 10) - 1] : "?";

              return (
                <article className="booking-record" key={booking.id}>
                  <div className="booking-date">
                    <strong>{day || "?"}</strong>
                    <span>{monthName}</span>
                    <small>
                      {isCancelled ? "CANCELLED" : "UPCOMING"}
                    </small>
                  </div>
                  <Link className="history-art" to={`/booking/${booking.venueId || 1}`}>
                    <img src="https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=300&q=80" alt="Venue" />
                    <span>Court</span>
                  </Link>
                  <div className="booking-record-info">
                    <div className="booking-record-title">
                      <h3>
                        {booking.venueName || "Venue"} <small>({booking.courtName})</small>
                      </h3>
                      <span
                        className={
                          isCancelled
                            ? "status status-cancelled"
                            : "status"
                        }
                      >
                        {booking.status}
                      </span>
                    </div>
                    <p>
                      {booking.bookingDate} <span>/</span> {booking.startTime} ({booking.durationHours} hr)
                    </p>
                    <p>Ahmedabad</p>
                  </div>
                  <div className="booking-actions">
                    {booking.status === "CONFIRMED" && (
                      <button
                        className="outline-button"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Cancel booking
                      </button>
                    )}
                    <Link className="text-action" to={`/booking/${booking.venueId || 1}`}>
                      View venue -&gt;
                    </Link>
                  </div>
                </article>
              );
            })
          ) : !loading && !error ? (
            <div className="empty-bookings">
              <h3>No {activeTab} bookings</h3>
              <p>Your {activeTab} court reservations will appear here.</p>
              <Link className="button button-dark" to="/booking">
                Find a court -&gt;
              </Link>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
