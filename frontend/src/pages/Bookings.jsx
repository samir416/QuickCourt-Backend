import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Clock, MapPin, XCircle, ArrowRight } from "lucide-react";
import AccountSidebar from "../components/AccountSidebar";
import ConfirmModal from "../components/ConfirmModal";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Bookings() {
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const loadBookings = async () => {
    if (!user?.id) {
      setBookings([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await apiFetch("/bookings/user/" + user.id);
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [user?.id]);

  const confirmCancel = (booking) => {
    setBookingToCancel(booking);
    setCancelModalOpen(true);
  };

  const handleCancel = async () => {
    if (!user?.id || !bookingToCancel || cancellingId) return;

    try {
      setCancellingId(bookingToCancel.id);
      setError("");

      await apiFetch(
        "/bookings/" +
          bookingToCancel.id +
          "/cancel?userId=" +
          encodeURIComponent(user.id),
        {
          method: "PUT"
        }
      );

      setCancelModalOpen(false);
      setBookingToCancel(null);
      await loadBookings();
    } catch (err) {
      setError(err.message || "Unable to cancel booking.");
    } finally {
      setCancellingId(null);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === "upcoming") {
      return booking.status === "CONFIRMED";
    }

    if (activeTab === "cancelled") {
      return booking.status === "CANCELLED";
    }

    return true;
  });

  const formatDate = value => {
    if (!value) return "Date unavailable";

    const date = new Date(value + "T00:00:00");

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const formatTime = value => {
    if (!value) return "Time unavailable";

    const parts = String(value).split(":");

    if (parts.length < 2) return value;

    const hours = Number(parts[0]);
    const minutes = parts[1];

    if (Number.isNaN(hours)) return value;

    const suffix = hours >= 12 ? "PM" : "AM";
    const displayHour = hours % 12 || 12;

    return displayHour + ":" + minutes + " " + suffix;
  };

  const getStatusClass = status => {
    if (status === "CONFIRMED") return "confirmed";
    if (status === "CANCELLED") return "cancelled";
    if (status === "COMPLETED") return "completed";
    return "";
  };

  return (
    <main className="account-page">
      <AccountSidebar active="bookings" />

      <section className="account-content">
        <div className="account-header">
          <div>
            <p className="eyebrow">Your reservations</p>
            <h1>My Bookings</h1>
            <p>Manage your sports court reservations and view venue details.</p>
          </div>
        </div>

        <div className="booking-tabs">
          <button
            type="button"
            className={activeTab === "all" ? "active" : ""}
            onClick={() => setActiveTab("all")}
          >
            All
          </button>

          <button
            type="button"
            className={activeTab === "upcoming" ? "active" : ""}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming
          </button>

          <button
            type="button"
            className={activeTab === "cancelled" ? "active" : ""}
            onClick={() => setActiveTab("cancelled")}
          >
            Cancelled
          </button>
        </div>

        {error && (
          <div
            className="auth-error"
            style={{
              marginBottom: "16px",
              color: "#c62828"
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <div className="empty-bookings">
            <p>Loading your bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="empty-bookings">
            <CalendarDays size={32} />
            <h3>No {activeTab} bookings</h3>
            <p>Your court reservations will appear here.</p>
            <Link className="button button-dark" to="/booking">
              Find a court
            </Link>
          </div>
        ) : (
          <div className="booking-records">
            {filteredBookings.map(booking => (
              <article className="booking-record" key={booking.id}>
                <div className="booking-record-main">
                  <div className="booking-record-title">
                    <div>
                      <p className="eyebrow" style={{ margin: "0 0 4px 0" }}>
                        Booking #{booking.id}
                      </p>

                      <h3 style={{ margin: 0 }}>
                        {booking.venueName || "Venue"}
                      </h3>
                    </div>

                    <span
                      className={
                        "booking-status " +
                        getStatusClass(booking.status)
                      }
                    >
                      {booking.status || "UNKNOWN"}
                    </span>
                  </div>

                  <div className="booking-record-meta">
                    <span>
                      <MapPin size={15} />
                      {booking.venueCity ||
                        booking.venueAddress ||
                        "Location unavailable"}
                    </span>

                    <span>
                      <CalendarDays size={15} />
                      {formatDate(booking.bookingDate)}
                    </span>

                    <span>
                      <Clock size={15} />
                      {formatTime(booking.startTime)}
                      {booking.endTime
                        ? " - " + formatTime(booking.endTime)
                        : ""}
                    </span>
                  </div>

                  <div className="booking-record-details">
                    <div className="booking-detail-item">
                      <span className="detail-label">Court</span>
                      <strong className="detail-value">
                        {booking.courtName || "Court unavailable"}
                      </strong>
                    </div>

                    <div className="booking-detail-item">
                      <span className="detail-label">Sport</span>
                      <strong className="detail-value">
                        {booking.sport || "Not specified"}
                      </strong>
                    </div>

                    <div className="booking-detail-item">
                      <span className="detail-label">Total</span>
                      <strong className="detail-value">
                        INR {Number(booking.totalPrice || 0).toFixed(2)}
                      </strong>
                    </div>

                    <div className="booking-detail-item">
                      <span className="detail-label">Payment</span>
                      <strong className="detail-value">
                        {booking.paymentStatus || "PENDING"}
                      </strong>
                    </div>
                  </div>

                  <div className="booking-record-actions">
                    {booking.status === "CONFIRMED" && (
                      <button
                        type="button"
                        className="booking-btn-cancel"
                        disabled={cancellingId === booking.id}
                        onClick={() => confirmCancel(booking)}
                      >
                        <XCircle size={15} />
                        Cancel Booking
                      </button>
                    )}

                    {booking.venueId && (
                      <Link
                        className="booking-btn-view"
                        to={"/booking/" + booking.venueId}
                      >
                        <span>View Venue</span>
                        <ArrowRight size={14} />
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <ConfirmModal
          isOpen={cancelModalOpen}
          title="Cancel Booking"
          message={`Are you sure you want to cancel booking #${bookingToCancel?.id} at ${bookingToCancel?.venueName}? Your time slot will be released.`}
          confirmText="Cancel Booking"
          cancelText="Keep Booking"
          confirmDanger={true}
          loading={cancellingId === bookingToCancel?.id}
          onConfirm={handleCancel}
          onCancel={() => { setCancelModalOpen(false); setBookingToCancel(null); }}
        />
      </section>
    </main>
  );
}