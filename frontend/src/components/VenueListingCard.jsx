import { Link } from "react-router-dom";

export default function VenueListingCard({ venue }) {
  return (
    <div className="listing-card">
      <div className="listing-image">
        <img
          src={venue.photos && venue.photos.length > 0 ? venue.photos[0] : "https://images.unsplash.com/photo-1599586120429-48281b6f0ece?auto=format&fit=crop&w=600&q=80"}
          alt={venue.name}
        />
        {venue.rating && (
          <div className="listing-badge">
            â˜… {venue.rating || "4.5"} <small>({venue.reviews || 6})</small>
          </div>
        )}
      </div>
      <div className="listing-content">
        <p className="listing-location">ðŸ“ {venue.location}</p>
        <h3>{venue.name}</h3>
        <p className="listing-price">
          â‚¹ {venue.price || 200} <small>per hour</small>
        </p>
        <Link to={"/booking/" + venue.id} className="button button-full">
          View details
        </Link>
      </div>
    </div>
  );
}

