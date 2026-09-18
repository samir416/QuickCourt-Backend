import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, User, MapPin, Star, Clock, CheckCircle, Info, Calendar } from 'lucide-react';

export default function CourtDetail() {
  const { venueId } = useParams();
  const { user } = useAuth();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        setLoading(true);
        const data = await apiFetch("/venues/" + venueId);
        const reviewsData = await apiFetch("/reviews/venue/" + venueId).catch(() => []);
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
        setVenue(data);
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

  const parseStringArray = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') return data.split(',').map(s => s.trim()).filter(Boolean);
    return [];
  };
  
  const normalizedSports = parseStringArray(venue.sports);
  const normalizedAmenities = parseStringArray(venue.amenities);
  const hasReviews = venue.rating && venue.rating > 0 && venue.totalReviews > 0;

  return (
    <main className="home-page">
      
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
                <span><MapPin size={16} style={{marginRight: '4px', verticalAlign: 'text-bottom'}} /> {venue.city || venue.address || venue.location}</span>
                <span className="detail-rating" style={{ display: 'inline-flex', alignItems: 'center' }}>
                  {hasReviews ? (
                    <>
                       <Star size={16} fill="currentColor" style={{marginRight: '4px', color: '#ffc107'}} /> 
                       {Number(venue.rating).toFixed(1)} <small style={{marginLeft: '4px', color: '#666'}}>({venue.totalReviews} reviews)</small>
                    </>
                  ) : (
                       <span style={{ fontSize: '13px', color: '#666' }}>No reviews yet</span>
                  )}
                </span>
              </p>
            </div>
          </div>
          <div className="detail-mobile-action">
            <Link
              to={"/booking/" + venue.id + "/reserve"}
              className="button button-dark button-full"
            >
              Book This Venue
            </Link>
          </div>
          <div className="detail-section">
            <h2>Sports</h2>
            <div className="sports-options">
              {normalizedSports.length > 0 ? normalizedSports.map(s => (
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
              <h2><Clock size={20} style={{marginRight: '8px', verticalAlign: 'text-bottom'}} /> Operating Hours</h2>
              <p>Mon - Sun: 06:00 AM - 11:00 PM</p>
            </div>
            <div className="detail-box">
              <h2><MapPin size={20} style={{marginRight: '8px', verticalAlign: 'text-bottom'}} /> Address</h2>
              <p>{venue.address || venue.city || venue.location}</p>
            </div>
          </div>
          <div className="detail-section">
            <h2>Amenities</h2>
            <div className="amenities-grid">
              {normalizedAmenities.length > 0 ? normalizedAmenities.map(amenity => (
                <span key={amenity}><CheckCircle size={16} style={{marginRight: '4px', verticalAlign: 'text-bottom'}} /> {amenity}</span>
              )) : (
                 <>
                   <span><CheckCircle size={16} style={{marginRight: '4px', verticalAlign: 'text-bottom'}} /> Parking</span>
                   <span><CheckCircle size={16} style={{marginRight: '4px', verticalAlign: 'text-bottom'}} /> Changing Rooms</span>
                   <span><CheckCircle size={16} style={{marginRight: '4px', verticalAlign: 'text-bottom'}} /> Drinking Water</span>
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
              <strong>Starting from INR {venue.startingPrice || venue.price}</strong>
              <span>/ hour</span>
            </div>
            <div className="widget-rules">
              <p><Info size={16} style={{marginRight: '8px', verticalAlign: 'text-bottom'}} /> Tournament Training Venue</p>
              <p><Info size={16} style={{marginRight: '8px', verticalAlign: 'text-bottom'}} /> For more than 2 players, INR 50 extra per person</p>
              <p><Info size={16} style={{marginRight: '8px', verticalAlign: 'text-bottom'}} /> Equipment available on rent</p>
            </div>
            <Link
              to={"/booking/" + venue.id + "/reserve"}
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
  return (
    <div className="review-item">
      <div className="review-header">
        <div className="review-avatar">{name.charAt(0)}</div>
        <div className="review-meta">
          <strong>{name} <span style={{color: '#ffc107', marginLeft: '4px'}}><Star size={14} fill="currentColor" style={{verticalAlign: 'text-bottom'}}/> {rating}</span></strong>
          <time><Calendar size={14} style={{marginRight: '4px', verticalAlign: 'text-bottom'}} /> {date}</time>
        </div>
      </div>
      <p>{text}</p>
    </div>
  );
}
