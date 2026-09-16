import { Link } from "react-router-dom";

export default function VenueCard({ venue }) {
  return (
    <article className="venue-card">
      <Link
        className="venue-image venue-image-link"
        to={`/booking/${venue.id || "sbr-badminton"}`}
        aria-label={`View ${venue.name}`}
      >
        <img src={venue.image} alt={venue.alt} />
        <span>{venue.type}</span>
      </Link>
      <div className="venue-card-body">
        <div>
          <h3>{venue.name}</h3>
          <p>
            {venue.location} <span>/</span> {venue.type}
          </p>
        </div>
        <strong>
          <small>from</small> INR {venue.price}
          <small>/hr</small>
        </strong>
      </div>
    </article>
  );
}
