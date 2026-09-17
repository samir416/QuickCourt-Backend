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
    const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        setLoading(true);
        const data = await apiFetch("/venues/" + venueId);
          const reviewsData = await apiFetch("/venues/" + venueId + "/reviews").catch(() => []);
          setReviews(Array.isArray(reviewsData) ? reviewsData : []);
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
            Ã¢Å¡Â¡ Book
          </Link>
          {user ? (
             <Link to="/profile" className="profile-link">Ã°Å¸â€˜Â¤ {user.name}</Link>
          ) : (
             <Link to="/logsign" className="header-login">
               Ã°Å¸â€˜Â¤ Log in / Sign up
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
                <span>Ã°Å¸â€œÂ {venue.location}</span>
                <span className="detail-rating">
                  Ã¢Ëœâ€¦ {venue.rating || "New"}
                </span>
              </p>
            </div>
          </div>
          <div className="detail-mobile-action">
            <Link
              to={"/booking/" + venue.id}
              className="button button-dark button-full"
            >
              Ã¢Å¡Â¡ Book This Venue
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
              <h2>Ã°Å¸â€¢â€™ Operating Hours</h2>
              <p>Mon - Sun: 06:00 AM - 11:00 PM</p>
            </div>
            <div className="detail-box">
              <h2>Ã°Å¸â€œÂ Address</h2>
              <p>{venue.location}</p>
            </div>
          </div>
          <div className="detail-section">
            <h2>Amenities</h2>
            <div className="amenities-grid">
              {venue.amenities ? venue.amenities.map(amenity => (
                <span key={amenity}>Ã¢Å“â€œ {amenity}</span>
              )) : (
                 <>
                   <span>Ã¢Å“â€œ Parking</span>
                   <span>Ã¢Å“â€œ Changing Rooms</span>
                   <span>Ã¢Å“â€œ Drinking Water</span>
                 </>
              )}
            </div>
          </div>
          <div className="detail-section">
            <h2>Reviews</h2>
            {reviews.length > 0 ? reviews.map(r => (
                <ReviewItem key={r.id} name={r.playerName || "Player"} date={new Date().toLocaleDateString()} text={r.comment} rating={r.rating} />
              )) : <p>No reviews yet.</p>}
          </div>
        </div>
        <div className="detail-sidebar">
          <div className="booking-widget">
            <div className="widget-price">
              <strong>Starting from INR {venue.startingPrice}</strong>
              <span>/ hour</span>
            </div>
            <div className="widget-rules">
              <p>Ã¢â‚¬Â¢ Tournament Training Venue</p>
              <p>Ã¢â‚¬Â¢ For more than 2 players, INR 50 extra per person</p>
              <p>Ã¢â‚¬Â¢ Equipment available on rent</p>
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
  const stars = "Ã¢Ëœâ€¦".repeat(Math.round(rating || 5));
  return (
    <div className="review-item">
      <div className="review-header">
        <div className="review-avatar">{name.charAt(0)}</div>
        <div className="review-meta">
          <strong>{name} <span style={{color: '#ffc107'}}>{stars}</span></strong>
          <time>Ã°Å¸â€œâ€¦ {date}</time>
        </div>
      </div>
      <p>{text}</p>
    </div>
  );
}


