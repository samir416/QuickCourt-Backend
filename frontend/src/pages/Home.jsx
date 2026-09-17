import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import VenueCard from "../components/VenueCard";
import PopularSports from "../components/PopularSports";
import BackToTop from "../components/BackToTop";
import { apiFetch } from "../services/api";

export default function Home() {
  const [sport, setSport] = useState("All sports");
  const [apiVenues, setApiVenues] = useState([]);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const data = await apiFetch('/venues?size=4');
        setApiVenues(data.content || []);
      } catch (err) {
        console.error("Failed to load venues for home", err);
      }
    };
    fetchVenues();
  }, []);

  const filteredVenues = sport === "All sports" 
    ? apiVenues 
    : apiVenues.filter((venue) => venue.sports && venue.sports.toLowerCase().includes(sport.toLowerCase()));

  const mappedVenues = filteredVenues.map(v => ({
    id: v.id,
    name: v.name,
    type: v.venueType || 'Sports',
    location: v.city || v.address,
    price: v.startingPrice,
    image: v.photos && v.photos.length > 0 ? v.photos[0] : "https://images.unsplash.com/photo-1599586120429-48281b6f0ece?auto=format&fit=crop&w=600&q=80",
    alt: v.name
  }));

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
          {mappedVenues.length > 0 ? mappedVenues.map((venue) => (
            <VenueCard venue={venue} key={venue.id} />
          )) : <p style={{gridColumn: "1 / -1", textAlign: "center"}}>No venues found.</p>}
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
          <span>&copy; 2026 QuickCourt</span>
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
