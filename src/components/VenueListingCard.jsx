import { Link } from "react-router-dom";

export default function VenueListingCard({ venue }) {
  return (
    <article className="listing-card">
      <Link
        className="listing-image listing-image-link"
        to={`/booking/${venue.id || "sbr-badminton"}`}
        aria-label={`View ${venue.name}`}
      >
        <img src={venue.image} alt={venue.alt} />
        <span className="listing-image-label">Image</span>
      </Link>
      <div className="listing-card-content">
        <div className="listing-title-row">
          <h3>{venue.name}</h3>
          <span className="rating">
            ★ {venue.rating || "4.5"} <small>({venue.reviews || 6})</small>
          </span>
        </div>
        <p className="listing-location">♥ {venue.location}</p>
        <p className="listing-price">
          ₹ {venue.price} <small>per hour</small>
        </p>
        <div className="listing-tags">
          <span>{venue.type}</span>
          <span>{venue.outdoor ? "Outdoor" : "Indoor"}</span>
        </div>
        <div className="listing-tags">
          <span>Top Rated</span>
          <span>Budget</span>
        </div>
        <Link
          className="details-button"
          to={`/booking/${venue.id || "sbr-badminton"}`}
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
