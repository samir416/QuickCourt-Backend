import AccountSidebar from "../components/AccountSidebar";
import { useState } from "react";
import { Link } from "react-router-dom";
import { venues } from "../data/venues";

const bookingData = [
  {
    venueId: "skyline-badminton",
    day: "18",
    month: "JUN",
    date: "18 June 2026",
    time: "5:00 PM - 6:00 PM",
    location: "Rajkot, Gujarat",
    status: "Confirmed",
    type: "upcoming",
  },
  {
    venueId: "sbr-badminton",
    day: "10",
    month: "JUN",
    date: "10 June 2026",
    time: "5:00 PM - 6:00 PM",
    location: "Ahmedabad, Gujarat",
    status: "Completed",
    type: "past",
  },
  {
    venueId: "green-kick",
    day: "04",
    month: "JUN",
    date: "04 June 2026",
    time: "7:00 PM - 8:00 PM",
    location: "Thaltej, Ahmedabad",
    status: "Cancelled",
    type: "cancelled",
  },
];

export default function Bookings() {
  const [activeTab, setActiveTab] = useState("all");
  const [cancelled, setCancelled] = useState(false);
  const visibleBookings = bookingData.filter((booking) =>
    activeTab === "all"
      ? booking.type !== "cancelled"
      : booking.type === "cancelled",
  );

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
            All bookings{" "}
            <span>
              {
                bookingData.filter((booking) => booking.type !== "cancelled")
                  .length
              }
            </span>
          </button>
          <button
            className={activeTab === "cancelled" ? "active" : ""}
            onClick={() => setActiveTab("cancelled")}
            role="tab"
          >
            Cancelled{" "}
            <span>
              {
                bookingData.filter((booking) => booking.type === "cancelled")
                  .length
              }
            </span>
          </button>
        </div>
        <div className="booking-history">
          {visibleBookings.length > 0 ? (
            visibleBookings.map((booking) => {
              const venue =
                venues.find((item) => item.id === booking.venueId) || venues[0];
              const isCancelled =
                (cancelled && booking.type === "upcoming") ||
                booking.type === "cancelled";
              return (
                <article className="booking-record" key={booking.venueId}>
                  <div className="booking-date">
                    <strong>{booking.day}</strong>
                    <span>{booking.month}</span>
                    <small>
                      {booking.type === "past"
                        ? "PAST"
                        : booking.type === "cancelled"
                          ? "CANCELLED"
                          : "UPCOMING"}
                    </small>
                  </div>
                  <Link className="history-art" to={`/booking/${venue.id}`}>
                    <img src={venue.image} alt={venue.alt} />
                    <span>{venue.type}</span>
                  </Link>
                  <div className="booking-record-info">
                    <div className="booking-record-title">
                      <h3>
                        {venue.name} <small>({venue.type})</small>
                      </h3>
                      <span
                        className={
                          isCancelled
                            ? "status status-cancelled"
                            : booking.type === "past"
                              ? "status status-muted"
                              : "status"
                        }
                      >
                        {isCancelled ? "Cancelled" : booking.status}
                      </span>
                    </div>
                    <p>
                      {booking.date} <span>/</span> {booking.time}
                    </p>
                    <p>{booking.location}</p>
                  </div>
                  <div className="booking-actions">
                    {booking.type === "upcoming" && !isCancelled && (
                      <button
                        className="outline-button"
                        onClick={() => setCancelled(true)}
                      >
                        Cancel booking
                      </button>
                    )}
                    {booking.type === "past" && (
                      <button className="outline-button">Write review</button>
                    )}
                    <Link className="text-action" to={`/booking/${venue.id}`}>
                      View venue -&gt;
                    </Link>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="empty-bookings">
              <h3>No {activeTab} bookings</h3>
              <p>Your {activeTab} court reservations will appear here.</p>
              <Link className="button button-dark" to="/booking">
                Find a court -&gt;
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
