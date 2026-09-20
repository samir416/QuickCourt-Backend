import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin
} from "lucide-react";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./CourtBooking.css";

export default function CourtBooking() {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [venue, setVenue] = useState(null);
  const [courts, setCourts] = useState([]);
  const [slots, setSlots] = useState([]);

  const [courtId, setCourtId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(1);

  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState("");

  const today = useMemo(
    () => new Date().toISOString().split("T")[0],
    []
  );

  useEffect(() => {
    if (!user) {
      navigate("/logsign");
      return;
    }

    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError("");

        const [venueData, courtsData] = await Promise.all([
          apiFetch("/venues/" + venueId),
          apiFetch("/courts/venue/" + venueId)
        ]);

        const activeCourts = Array.isArray(courtsData)
          ? courtsData.filter(court => court.active !== false)
          : [];

        setVenue(venueData);
        setCourts(activeCourts);

        if (activeCourts.length > 0) {
          setCourtId(String(activeCourts[0].id));
        }
      } catch (err) {
        setError(
          "Unable to load booking data. " +
            (err.message || "Please try again.")
        );
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [venueId, user, navigate]);

  useEffect(() => {
    if (!courtId || !date) {
      setSlots([]);
      setStartTime("");
      return;
    }

    const loadSlots = async () => {
      try {
        setSlotsLoading(true);
        setError("");
        setStartTime("");

        const data = await apiFetch(
          "/time-slots/court/" +
            courtId +
            "/available?date=" +
            encodeURIComponent(date)
        );

        setSlots(Array.isArray(data) ? data : []);
      } catch (err) {
        setSlots([]);
        setError(
          "Unable to load available time slots. " +
            (err.message || "Please try again.")
        );
      } finally {
        setSlotsLoading(false);
      }
    };

    loadSlots();
  }, [courtId, date]);

  const selectedCourt = courts.find(
    court => String(court.id) === String(courtId)
  );

  const pricePerHour = Number(
    selectedCourt?.pricePerHour || 0
  );

  const total = pricePerHour * duration;

  const normalizeSlotTime = slot => {
    if (typeof slot === "string") return slot;

    return (
      slot?.startTime ||
      slot?.time ||
      slot?.slotTime ||
      ""
    );
  };

  const availableTimes = slots
    .map(normalizeSlotTime)
    .filter(Boolean);

  const handlePayment = async () => {
    const currentUserId = user?.id || user?.userId;
    if (!currentUserId) {
      navigate("/logsign");
      return;
    }

    if (!courtId || !date || !startTime) {
      setError("Please select court, date and start time.");
      return;
    }

    try {
      setPaymentLoading(true);
      setError("");

      const booking = await apiFetch("/bookings", {
        method: "POST",
        body: JSON.stringify({
          userId: Number(currentUserId),
          courtId: Number(courtId),
          bookingDate: date,
          startTime,
          durationHours: Number(duration)
        })
      });

      if (!booking?.id) {
        throw new Error(
          "Booking was not created by the server."
        );
      }

      await apiFetch("/bookings/payment", {
        method: "POST",
        body: JSON.stringify({
          bookingId: booking.id
        })
      });

      navigate("/bookings");
    } catch (err) {
      setError(
        err.message ||
          "Booking or payment failed. Please try again."
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="booking-page-new">
        <div className="booking-container-new">
          <div className="booking-state-new">
            <div className="booking-loader-new" />
            <p>Loading booking details...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!venue) {
    return (
      <main className="booking-page-new">
        <div className="booking-container-new">
          <div className="booking-state-new">
            <h2>Booking unavailable</h2>
            <p>
              {error ||
                "Venue data could not be loaded."}
            </p>

            <Link
              className="booking-dark-button"
              to="/booking"
            >
              <ArrowLeft size={16} />
              Back to venues
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="booking-page-new">
      <div className="booking-container-new">
        <Link
          to={"/booking/" + venueId}
          className="booking-back-link"
        >
          <ArrowLeft size={16} />
          Back to venue
        </Link>

        <div className="booking-header-new">
          <div>
            <p className="booking-eyebrow">
              Reserve Your Court
            </p>

            <h1>Court Booking</h1>

            <p className="booking-header-description">
              Select your court, date and available time slot.
            </p>
          </div>

          <div className="booking-secure-badge">
            <CheckCircle2 size={16} />
            Secure booking
          </div>
        </div>

        {error && (
          <div className="booking-error-new">
            <strong>Booking issue</strong>
            <span>{error}</span>
          </div>
        )}

        <div className="booking-layout-new">
          <section className="booking-form-card-new">
            <div className="booking-venue-summary">
              <div className="booking-venue-icon">
                <MapPin size={20} />
              </div>

              <div>
                <p className="booking-eyebrow">
                  Selected Venue
                </p>

                <h2>{venue.name}</h2>

                <span>
                  {venue.city ||
                    venue.address ||
                    "Location unavailable"}
                </span>
              </div>
            </div>

            <div className="booking-form-grid-new">
              <label className="booking-field-new">
                <span>Court</span>

                {courts.length === 1 ? (
                  <div className="booking-static-field">
                    <strong>
                      {courts[0].name ||
                        courts[0].courtName ||
                        "Court"}
                    </strong>

                    <span>
                      {courts[0].sport || "Sport"} · INR{" "}
                      {Number(courts[0].pricePerHour || 0).toFixed(2)}/hr
                    </span>
                  </div>
                ) : (
                  <select
                    value={courtId}
                    onChange={event => {
                      setCourtId(event.target.value);
                      setStartTime("");
                    }}
                    disabled={courts.length === 0}
                  >
                    {courts.length === 0 ? (
                      <option value="">
                        No active courts available
                      </option>
                    ) : (
                      courts.map(court => (
                        <option key={court.id} value={court.id}>
                          {(court.name ||
                            court.courtName ||
                            "Court") +
                            " · " +
                            (court.sport || "Sport") +
                            " · INR " +
                            Number(court.pricePerHour || 0).toFixed(2) +
                            "/hr"}
                        </option>
                      ))
                    )}
                  </select>
                )}
              </label>

              <label className="booking-field-new">
                <span>Date</span>

                <div className="booking-input-icon">
                  <CalendarDays size={17} />

                  <input
                    type="date"
                    min={today}
                    value={date}
                    onChange={event => {
                      setDate(event.target.value);
                      setStartTime("");
                    }}
                  />
                </div>
              </label>

              <label className="booking-field-new">
                <span>Start Time</span>

                <div className="booking-input-icon">
                  <Clock3 size={17} />

                  <select
                    value={startTime}
                    onChange={event =>
                      setStartTime(event.target.value)
                    }
                    disabled={!date || slotsLoading}
                  >
                    <option value="">
                      {slotsLoading
                        ? "Loading available times..."
                        : !date
                          ? "Select a date first"
                          : availableTimes.length === 0
                            ? "No available slots"
                            : "Choose time"}
                    </option>

                    {availableTimes.map(
                      (time, index) => (
                        <option
                          key={index}
                          value={time}
                        >
                          {time}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </label>

              <div className="booking-field-new">
                <span>Duration</span>

                <div className="booking-duration">
                  <button
                    type="button"
                    onClick={() =>
                      setDuration(value =>
                        Math.max(1, value - 1)
                      )
                    }
                    disabled={duration <= 1}
                  >
                    −
                  </button>

                  <div>
                    <strong>{duration}</strong>
                    <span>
                      {duration === 1
                        ? "hour"
                        : "hours"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setDuration(value =>
                        Math.min(4, value + 1)
                      )
                    }
                    disabled={duration >= 4}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </section>

          <aside className="booking-summary-card-new">
            <p className="booking-eyebrow">
              Booking Summary
            </p>

            <h2>{venue.name}</h2>

            <div className="booking-summary-row">
              <span>Court</span>
              <strong>
                {selectedCourt?.name ||
                  selectedCourt?.courtName ||
                  "Not selected"}
              </strong>
            </div>

            <div className="booking-summary-row">
              <span>Sport</span>
              <strong>
                {selectedCourt?.sport || "—"}
              </strong>
            </div>

            <div className="booking-summary-row">
              <span>Date</span>
              <strong>{date || "—"}</strong>
            </div>

            <div className="booking-summary-row">
              <span>Time</span>
              <strong>{startTime || "—"}</strong>
            </div>

            <div className="booking-summary-row">
              <span>Duration</span>
              <strong>
                {duration}{" "}
                {duration === 1 ? "hour" : "hours"}
              </strong>
            </div>

            <div className="booking-total-new">
              <span>Total</span>
              <strong>
                INR {total.toFixed(2)}
              </strong>
            </div>

            <button
              type="button"
              className="booking-payment-button"
              disabled={
                paymentLoading ||
                !courtId ||
                !date ||
                !startTime ||
                courts.length === 0
              }
              onClick={handlePayment}
            >
              <CreditCard size={17} />

              {paymentLoading
                ? "Processing..."
                : "Continue to Payment"}
            </button>

            <p className="booking-note-new">
              Payment is simulated for this application.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}