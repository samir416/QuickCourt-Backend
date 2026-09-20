import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import VenueCard from "../components/VenueCard";
import PopularSports from "../components/PopularSports";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const [sport, setSport] = useState("All sports");
  const [apiVenues, setApiVenues] = useState([]);
  const [popularSports, setPopularSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const data = await apiFetch('/home');
        setApiVenues(data.popularVenues || data.approvedVenues || []);
        
        const backendSports = data.popularSports || [];
        if(backendSports.length > 0) {
            setPopularSports(backendSports);
        } else {
            // Fallback if backend returned no sports
            setPopularSports(["Badminton", "Football", "Tennis", "Cricket"]);
        }
      } catch (err) {
        console.error("Failed to load venues for home", err);
        setError("Failed to load popular venues. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const getFallbackImage = (id, index) => {
    const images = [
        "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1611251135345-18c56206b863?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=85",
        "https://images.unsplash.com/photo-1599586120429-48281b6f0ece?auto=format&fit=crop&w=900&q=80"
    ];
    // Deterministic selection based on id so adjacent cards don't use the exact same image
    return images[index % images.length];
  };
const filteredVenues = sport === "All sports" 
    ? apiVenues 
    : apiVenues.filter((venue) => venue.sports && venue.sports.toLowerCase().includes(sport.toLowerCase()));

  const mappedVenues = filteredVenues.map((v, index) => ({
    id: v.id,
    name: v.name,
    type: v.venueType || 'Sports',
    location: v.city || v.address,
    price: v.startingPrice,
    rating: v.rating,
    image: v.photos && v.photos.length > 0 ? v.photos[0] : getFallbackImage(v.id, index),
    alt: v.name
  }));

  const handleSportSelect = (selectedSport) => {
    setSport(selectedSport);
    // Scroll to venues section
    document.querySelector('.venue-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="home-page">
      <HeroSection sport={sport} onSportChange={setSport} userName={user?.name} popularSports={popularSports} />
      
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
        
        {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>Loading venues...</div>
        ) : error ? (
            <div style={{ textAlign: "center", padding: "40px", color: "red" }}>{error}</div>
        ) : (
            <div className="venue-grid">
              {mappedVenues.length > 0 ? mappedVenues.map((venue) => (
                <VenueCard venue={venue} key={venue.id} onClick={() => navigate(`/court/${venue.id}`)} />
              )) : <p style={{gridColumn: "1 / -1", textAlign: "center"}}>No venues found for the selected sport.</p>}
            </div>
        )}
      </section>

      <PopularSports sports={popularSports} onSportSelect={handleSportSelect} />

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
      
    </main>
  );
}
