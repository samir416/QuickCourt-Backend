import { Link } from "react-router-dom";
import { Star, MapPin } from 'lucide-react';

export default function VenueListingCard({ venue, index = 0 }) {
  const getFallbackImage = (index) => {
    const images = [
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=500&q=85",
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=500&q=85",
      "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=500&q=85",
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=500&q=85",
      "https://images.unsplash.com/photo-1611251135345-18c56206b863?auto=format&fit=crop&w=500&q=85",
      "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=500&q=85",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=500&q=85",
      "https://images.unsplash.com/photo-1599586120429-48281b6f0ece?auto=format&fit=crop&w=500&q=80"
    ];
    return images[index % images.length];
  };;

  const hasReviews = venue.rating && venue.rating > 0 && venue.totalReviews > 0;

  return (
    <div className="listing-card">
      <div className="listing-image">
        <img
          src={venue.photos && venue.photos.length > 0 ? venue.photos[0] : getFallbackImage(index)}
          alt={venue.name}
        />
        <div className="listing-badge" style={{background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', display: 'flex', alignItems: 'center'}}>
          {hasReviews ? (
            <>
              <Star size={14} fill="currentColor" style={{marginRight: '4px', verticalAlign: 'text-bottom'}} /> 
              {Number(venue.rating).toFixed(1)} <small style={{marginLeft: '4px'}}>({venue.totalReviews})</small>
            </>
          ) : (
            <span style={{ fontSize: '11px', opacity: 0.9 }}>No reviews yet</span>
          )}
        </div>
      </div>
      <div className="listing-content">
        <p className="listing-location"><MapPin size={14} style={{marginRight: '4px', verticalAlign: 'text-bottom'}} /> {venue.city || venue.address || venue.location}</p>
        <h3 style={{ margin: '8px 0', fontSize: '18px' }}>{venue.name}</h3>
        {venue.sports && <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px', textTransform: 'capitalize' }}>{venue.sports.split(',').join(' � ')}</p>}
        <p className="listing-price" style={{ margin: '8px 0 16px', fontWeight: '600' }}>
          INR {venue.startingPrice || venue.price} <small style={{ fontWeight: '400', color: '#666' }}>per hour</small>
        </p>
        <Link to={"/booking/" + venue.id} className="button button-full" style={{ textAlign: 'center' }}>
          View details
        </Link>
      </div>
    </div>
  );
}
