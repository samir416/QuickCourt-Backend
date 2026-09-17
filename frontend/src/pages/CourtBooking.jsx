import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function CourtBooking() {
  const { venueId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [venue, setVenue] = useState(null);
  const [courts, setCourts] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [court, setCourt] = useState("");
  const [sport, setSport] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const pricePerHour = court ? (courts.find(c => c.id.toString() === court)?.pricePerHour || 0) : 0;
  const total = pricePerHour * duration;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const venueData = await apiFetch("/venues/" + venueId);
        setVenue(venueData);
        const courtsData = await apiFetch("/venues/" + venueId + "/courts");
        setCourts(Array.isArray(courtsData) ? courtsData : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [venueId]);

  useEffect(() => {
    if (court && date) {
      apiFetch("/time-slots/court/" + court + "/available?date=" + date)
        .then(data => setAvailableSlots(Array.isArray(data) ? data : []))
        .catch(console.error);
    } else {
      setAvailableSlots([]);
    }
  }, [court, date]);

  const handlePaymentSubmit = async () => {
    if (!user) {
      navigate("/logsign");
      return;
    }
    try {
      setIsSubmitting(true);
      setSubmitError("");
      const payload = {
        playerId: user.id,
        courtId: Number(court),
        bookingDate: date,
        startTime: time,
        durationHours: duration
      };
      const bookingData = await apiFetch("/bookings", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      if (bookingData && bookingData.id) {
         await apiFetch("/bookings/" + bookingData.id + "/payment", { method: "POST" });
      }
      navigate("/bookings");
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <main className="court-booking-page"><p style={{padding:'20px'}}>Loading venue details...</p></main>;
  if (error) return <main className="court-booking-page"><p style={{padding:'20px', color:'red'}}>{error}</p></main>;
  if (!venue) return <main className="court-booking-page"><p style={{padding:'20px'}}>Venue not found.</p></main>;

  return (
    <main className="court-booking-page">
      <div className="court-booking-shell">
        <div className="court-booking-topbar">
          <Link to="/">quickcourt</Link>
          <Link to="/booking">âš¡ Book</Link>
          <Link to={user ? "/profile" : "/logsign"}>{user ? user.name : "Log in"}</Link>
        </div>
        <div className="court-booking-content">
          <p className="eyebrow">Venue booking page</p>
          <h1>Court Booking</h1>
          <section className="court-booking-card">
            <h2>{venue.name}</h2>
            <div className="court-booking-meta">
              <span>ðŸ“ {venue.location}</span>
              <span>â˜… {venue.rating || "4.5"} ({venue.reviews || 6})</span>
            </div>
            
            <div className="court-booking-form">
              <label className="booking-field">
                Court
                <select value={court} onChange={(event) => {
                  setCourt(event.target.value);
                  const c = courts.find(x => x.id.toString() === event.target.value);
                  if (c) setSport(c.sport);
                }}>
                  <option value="">Select Court</option>
                  {courts.map(c => (
                    <option key={c.id} value={c.id}>{c.name || c.courtName} ({c.sport}) INR {c.pricePerHour}/hr</option>
                  ))}
                </select>
              </label>

              <label className="booking-field">
                Date
                <input type="date" min={new Date().toISOString().split("T")[0]} value={date} onChange={(event) => setDate(event.target.value)} disabled={!court} />
                <small>The selected date must be today or later.</small>
              </label>

              <label className="booking-field">
                Start Time
                <select value={time} onChange={(event) => setTime(event.target.value)} disabled={!date || availableSlots.length === 0}>
                  <option value="">Choose time</option>
                  {availableSlots.length > 0 ? availableSlots.map(slot => (
                    <option key={slot.id} value={slot.startTime}>{slot.startTime}</option>
                  )) : (date && <option disabled>No slots available</option>)}
                </select>
                <small>Unavailable time slots cannot be selected.</small>
              </label>

              <div className="booking-field">
                <span>Duration</span>
                <div className="duration-stepper">
                  <button type="button" onClick={() => setDuration((current) => Math.max(1, current - 1))}>-</button>
                  <strong><small>Playing for</small> {duration} {duration === 1 ? "hour" : "hours"}</strong>
                  <button type="button" onClick={() => setDuration((current) => Math.min(4, current + 1))}>+</button>
                </div>
              </div>
              
              <div className="payment-summary">
                <span>Total for {duration} {duration === 1 ? "hour" : "hours"}</span>
                <strong>INR {total}.00</strong>
              </div>

              {submitError && <small className="auth-error" style={{display:'block', marginBottom:'10px', color:'red'}}>{submitError}</small>}

              <button className="button payment-button" disabled={!date || !time || !court || isSubmitting} onClick={handlePaymentSubmit}>
                {isSubmitting ? "Processing..." : "Continue to Payment INR " + total + ".00"}
              </button>
            </div>
          </section>
        </div>
        <footer className="court-booking-footer">
          quickcourt <span>Footer</span>
        </footer>
      </div>
    </main>
  );
}


