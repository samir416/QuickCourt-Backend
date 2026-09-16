import { useState } from "react";
import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import VenueCard from "../components/VenueCard";
import PopularSports from "../components/PopularSports";
import BackToTop from "../components/BackToTop";
import { venues } from "../data/venues";

export default function Home() {
  const [sport, setSport] = useState("All sports");
  const filteredVenues =
    sport === "All sports"
      ? venues
      : venues.filter((venue) => venue.type === sport);

  return (
    <main className="home-page">
      <HeroSection sport={sport} onSportChange={setSport} />
      <section className="venue-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Curated for you</p>
            <h2>Book venues nearby</h2>
          </div>
          <Link className="text-link" to="/booking">
            See all venues <span aria-hidden="true">-&gt;</span>
          </Link>
        </div>
        <div className="venue-grid">
          {filteredVenues.map((venue) => (
            <VenueCard venue={venue} key={venue.name} />
          ))}
        </div>
      </section>
      <PopularSports />
      <section className="home-promo">
        <div>
          <p className="eyebrow">More than a booking</p>
          <h2>Good games start with good company.</h2>
        </div>
        <div className="promo-action">
          <p>
            Whether you are looking for a weekly game or your next team,
            QuickCourt helps you find the place and people to make it happen.
          </p>
          <Link className="promo-link" to="/booking">
            Start exploring <span aria-hidden="true">-&gt;</span>
          </Link>
        </div>
      </section>
      <footer className="home-footer">
        <div className="footer-brand-block">
          <Link className="footer-brand" to="/">
            quickcourt
          </Link>
          <p>Find your next game.</p>
          <span>Ahmedabad / India</span>
        </div>
        <div className="footer-column">
          <h3>Explore</h3>
          <Link to="/">Home</Link>
          <Link to="/booking">Book a court</Link>
          <Link to="/bookings">My bookings</Link>
        </div>
        <div className="footer-column">
          <h3>Account</h3>
          <Link to="/profile">Profile</Link>
          <Link to="/logsign">Log in / Sign up</Link>
          <Link to="/booking">Saved venues</Link>
        </div>
        <div className="footer-column">
          <h3>Play locally</h3>
          <p>Courts, teams, and good games around Ahmedabad.</p>
          <Link className="footer-location" to="/booking">
            Ahmedabad <span aria-hidden="true">-&gt;</span>
          </Link>
        </div>
        <div className="footer-bottom">
          <span>© 2026 QuickCourt</span>
          <span>Made for people who play</span>
          <Link to="/booking">
            Find a venue <span aria-hidden="true">-&gt;</span>
          </Link>
        </div>
      </footer>
      <BackToTop />
    </main>
  );
}
