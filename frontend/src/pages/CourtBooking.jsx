import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { venues } from "../data/venues";

export default function CourtBooking() {
  const { venueId } = useParams();
  const venue = venues.find((item) => item.id === venueId) || venues[0];
  const [sport, setSport] = useState(venue.type);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(2);
  const [court, setCourt] = useState("");
  const total = Number(venue.price) * duration;

  return (
    <main className="court-booking-page">
      <div className="court-booking-shell">
        <div className="court-booking-topbar">
          <Link to="/">quickcourt</Link>
          <Link to="/booking">▣ Book</Link>
          <Link to="/profile">◉ Mitchell Admin</Link>
        </div>
        <div className="court-booking-content">
          <p className="eyebrow">Venue booking page</p>
          <h1>Court Booking</h1>
          <section className="court-booking-card">
            <h2>{venue.name}</h2>
            <div className="court-booking-meta">
              <span>♥ {venue.location}, Ahmedabad</span>
              <span>
                ★ {venue.rating || "4.5"} ({venue.reviews || 6})
              </span>
            </div>
            <div className="court-booking-form">
              <label className="booking-field">
                Sport
                <select
                  value={sport}
                  onChange={(event) => setSport(event.target.value)}
                >
                  <option>Badminton</option>
                  <option>Table Tennis</option>
                  <option>Box Cricket</option>
                </select>
              </label>
              <label className="booking-field">
                Date
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
                <small>The selected date must be today or later.</small>
              </label>
              <label className="booking-field">
                Start time
                <select
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                >
                  <option value="">Choose time</option>
                  <option>5:00 PM</option>
                  <option>6:00 PM</option>
                  <option>7:00 PM</option>
                  <option disabled>8:00 PM - unavailable</option>
                </select>
                <small>Unavailable time slots cannot be selected.</small>
              </label>
              <div className="booking-field">
                <span>Duration</span>
                <div className="duration-stepper">
                  <button
                    type="button"
                    onClick={() =>
                      setDuration((current) => Math.max(1, current - 1))
                    }
                  >
                    −
                  </button>
                  <strong>
                    <small>Playing for</small>
                    {duration} {duration === 1 ? "hour" : "hours"}
                  </strong>
                  <button
                    type="button"
                    onClick={() =>
                      setDuration((current) => Math.min(4, current + 1))
                    }
                  >
                    +
                  </button>
                </div>
              </div>
              <label className="booking-field">
                Court
                <select
                  value={court}
                  onChange={(event) => setCourt(event.target.value)}
                >
                  <option value="">--Select Court--</option>
                  <option>Court 1</option>
                  <option>Court 2</option>
                  <option>Court 3</option>
                </select>
              </label>
              <div className="payment-summary">
                <span>
                  Total for {duration} {duration === 1 ? "hour" : "hours"}
                </span>
                <strong>INR {total}.00</strong>
              </div>
              <button
                className="button payment-button"
                disabled={!date || !time || !court}
              >
                Continue to Payment - INR {total}.00
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
