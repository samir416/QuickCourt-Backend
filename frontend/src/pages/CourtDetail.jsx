import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function CourtDetail() {
  const { venueId } = useParams();
  const { user } = useAuth();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        setLoading(true);
        const data = await apiFetch("/venues/" + venueId);
        setVenue(data);
        setRating(data.rating || 4);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVenue();
  }, [venueId]);

  if (loading) return <main className="home-page"><p style={{padding:'20px'}}>Loading venue details...</p></main>;
  if (error) return <main className="home-page"><p style={{padding:'20px', color:'red'}}>{error}</p></main>;
  if (!venue) return <main className="home-page"><p style={{padding:'20px'}}>Venue not found.</p></main>;

  return (
    <main className="home-page">
      <header className="site-header detail-header">
        <Link className="brand" to="/">
          <span className="brand-mark">Q</span>
          <span>quickcourt</span>
        </Link>
        <nav className="site-nav">
          <Link to="/">Home</Link>
          <Link to="/booking" className="active">
            âš¡ Book
          </Link>
          {user ? (
             <Link to="/profile" className="profile-link">ðŸ‘¤ {user.name}</Link>
          ) : (
             <Link to="/logsign" className="header-login">
               ðŸ‘¤ Log in / Sign up
             </Link>
          )}
        </nav>
      </header>
      <div className="detail-gallery">
        <img
          src={venue.photos && venue.photos.length > 0 ? venue.photos[0] : "https://images.unsplash.com/photo-1599586120429-48281b6f0ece?auto=format&fit=crop&w=1200&q=80"}
          alt="Venue"
        />
      </div>
      <div className="detail-container">
        <div className="detail-main">
          <div className="detail-brand-row">
            <div>
              <h1>{venue.name}</h1>
              <p className="detail-location">
                <span>ðŸ“ {venue.location}</span>
                <span className="detail-rating">
                  â˜… {venue.rating || "New"}
                </span>
              </p>
            </div>
          </div>
          <div className="detail-mobile-action">
            <Link
              to={"/booking/" + venue.id}
              className="button button-dark button-full"
            >
              âš¡ Book This Venue
            </Link>
          </div>
          <div className="detail-section">
            <h2>Sports</h2>
            <div className="sports-options">
              {venue.sports ? venue.sports.map(s => (
                  <span key={s} className="sport-pill">{s}</span>
              )) : <span className="sport-pill">Multi-sport</span>}
            </div>
          </div>
          <div className="detail-section">
            <h2>About</h2>
            <p>
              {venue.description || "A premium sports facility offering top-tier courts for all your athletic needs."}
            </p>
          </div>
          <div className="detail-grid-section">
            <div className="detail-box">
              <h2>ðŸ•’ Operating Hours</h2>
              <p>Mon - Sun: 06:00 AM - 11:00 PM</p>
            </div>
            <div className="detail-box">
              <h2>ðŸ“ Address</h2>
              <p>{venue.location}</p>
            </div>
          </div>
          <div className="detail-section">
            <h2>Amenities</h2>
            <div className="amenities-grid">
              {venue.amenities ? venue.amenities.map(amenity => (
                <span key={amenity}>âœ“ {amenity}</span>
              )) : (
                 <>
                   <span>âœ“ Parking</span>
                   <span>âœ“ Changing Rooms</span>
                   <span>âœ“ Drinking Water</span>
                 </>
              )}
            </div>
          </div>
          <div className="detail-section">
            <h2>Reviews</h2>
            <ReviewItem
              name="Rahul Sharma"
              date="October 2026"
              text="Excellent courts and well maintained facility. Highly recommend for badminton."
              rating={5}
            />
          </div>
        </div>
        <div className="detail-sidebar">
          <div className="booking-widget">
            <div className="widget-price">
              <strong>Starting from INR 200</strong>
              <span>/ hour</span>
            </div>
            <div className="widget-rules">
              <p>â€¢ Tournament Training Venue</p>
              <p>â€¢ For more than 2 players, INR 50 extra per person</p>
              <p>â€¢ Equipment available on rent</p>
            </div>
            <Link
              to={"/booking/" + venue.id}
              className="button button-dark button-full"
            >
              Check Availability
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function ReviewItem({ name, date, text, rating }) {
  const stars = "â˜…".repeat(Math.round(rating || 5));
  return (
    <div className="review-item">
      <div className="review-header">
        <div className="review-avatar">{name.charAt(0)}</div>
        <div className="review-meta">
          <strong>{name} <span style={{color: '#ffc107'}}>{stars}</span></strong>
          <time>ðŸ“… {date}</time>
        </div>
      </div>
      <p>{text}</p>
    </div>
  );
}

