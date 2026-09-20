import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Clock3,
  MapPin,
  Star,
  Trophy,
  Wifi
} from "lucide-react";
import { apiFetch } from "../services/api";
import "./CourtDetail.css";

export default function CourtDetail() {
  const { venueId } = useParams();

  const [venue, setVenue] = useState(null);
  const [courts, setCourts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadVenue = async () => {
      try {
        setLoading(true);
        setError("");

        const venueData = await apiFetch("/venues/" + venueId);

        const [courtsResult, reviewsResult] = await Promise.all([
          apiFetch("/courts/venue/" + venueId).catch(() => []),
          apiFetch("/reviews/venue/" + venueId).catch(() => [])
        ]);

        if (!mounted) return;

        setVenue(venueData);
        setCourts(Array.isArray(courtsResult) ? courtsResult : []);
        setReviews(Array.isArray(reviewsResult) ? reviewsResult : []);
      } catch (err) {
        if (mounted) {
          setError(err.message || "Unable to load venue data.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadVenue();

    return () => {
      mounted = false;
    };
  }, [venueId]);

  const parseList = value => {
    if (Array.isArray(value)) {
      return value.map(item => String(item).trim()).filter(Boolean);
    }

    if (!value) return [];

    return String(value)
      .split(",")
      .map(item => item.trim())
      .filter(Boolean);
  };

  const sports = useMemo(
    () => parseList(venue?.sports),
    [venue?.sports]
  );

  const amenities = useMemo(
    () => parseList(venue?.amenities),
    [venue?.amenities]
  );

  const photos = useMemo(() => {
    if (!Array.isArray(venue?.photos)) return [];
    return venue.photos
      .map((photo, index) => {
        if (typeof photo === "string") {
          return { id: index, url: photo };
        }
        if (photo && (photo.url || photo.imageUrl)) {
          return { id: photo.id || index, url: photo.url || photo.imageUrl };
        }
        return null;
      })
      .filter(Boolean);
  }, [venue?.photos]);

  const rating =
    venue?.averageRating !== undefined && venue?.averageRating !== null
      ? Number(venue.averageRating)
      : venue?.rating !== undefined && venue?.rating !== null
        ? Number(venue.rating)
        : 0;

  const totalReviews =
    venue?.totalReviews !== undefined && venue?.totalReviews !== null
      ? Number(venue.totalReviews)
      : reviews.length;

  const openingTime = courts
    .map(court => court.openingTime)
    .filter(Boolean)
    .sort()[0];

  const closingTime = courts
    .map(court => court.closingTime)
    .filter(Boolean)
    .sort()
    .slice(-1)[0];

  const formatTime = value => {
    if (!value) return "";

    const parts = String(value).split(":");

    if (parts.length < 2) return value;

    const hour = Number(parts[0]);
    const minute = parts[1];

    if (Number.isNaN(hour)) return value;

    const suffix = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;

    return `${displayHour}:${minute} ${suffix}`;
  };

  if (loading) {
    return (
      <main className="venue-detail-page">
        <div className="venue-detail-container">
          <div className="venue-state">
            <div className="venue-loader" />
            <p>Loading venue...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !venue) {
    return (
      <main className="venue-detail-page">
        <div className="venue-detail-container">
          <div className="venue-state">
            <h2>Unable to load venue</h2>
            <p>{error || "Venue data is unavailable."}</p>
            <Link to="/booking" className="venue-dark-button">
              <ArrowLeft size={16} />
              Back to venues
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="venue-detail-page">
      <div className="venue-detail-container">
        <Link to="/booking" className="venue-back-link">
          <ArrowLeft size={16} />
          Back to venues
        </Link>

        <section className="venue-detail-card">
          <div className="venue-header">
            <div className="venue-header-info">
              <p className="venue-eyebrow">Sports Venue</p>

              <h1>{venue.name}</h1>

              <div className="venue-meta">
                <span>
                  <MapPin size={16} />
                  {venue.city || venue.address || "Location unavailable"}
                </span>

                {totalReviews > 0 && rating > 0 && (
                  <span>
                    <Star size={15} fill="currentColor" />
                    {rating.toFixed(1)}
                    <small>({totalReviews} reviews)</small>
                  </span>
                )}
              </div>
            </div>

            <Link
              to={"/booking/" + venue.id + "/reserve"}
              className="venue-book-button"
            >
              Book this venue
            </Link>
          </div>

          <div className="venue-main-grid">
            <div className="venue-gallery">
              {photos.length > 0 ? (
                <>
                  <div className="venue-main-photo">
                    <img
                      src={photos[0].url}
                      alt={venue.name}
                    />
                  </div>

                  {photos.length > 1 && (
                    <div className="venue-photo-strip">
                      {photos.slice(1, 5).map((photo, index) => (
                        <img
                          key={photo.id || index}
                          src={photo.url}
                          alt={`${venue.name} ${index + 2}`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="venue-no-photo">
                  <span>No venue photos available</span>
                </div>
              )}
            </div>

            <div className="venue-info-column">
              <div className="venue-info-card">
                <p className="venue-eyebrow">Operating Hours</p>

                <div className="venue-info-value">
                  <Clock3 size={17} />

                  {openingTime && closingTime
                    ? `${formatTime(openingTime)} - ${formatTime(closingTime)}`
                    : "Hours unavailable"}
                </div>
              </div>

              <div className="venue-info-card">
                <p className="venue-eyebrow">Address</p>

                <div className="venue-info-value venue-address">
                  <MapPin size={17} />

                  <span>
                    {venue.address || "Address unavailable"}
                    {venue.city ? `, ${venue.city}` : ""}
                    {venue.state ? `, ${venue.state}` : ""}
                    {venue.pincode ? ` - ${venue.pincode}` : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <section className="venue-section-block">
            <p className="venue-eyebrow">Sports</p>

            {sports.length > 0 ? (
              <div className="venue-chip-list">
                {sports.map((sport, index) => (
                  <div className="venue-chip" key={`${sport}-${index}`}>
                    <Trophy size={15} />
                    {sport}
                  </div>
                ))}
              </div>
            ) : (
              <p className="venue-muted">No sports information available.</p>
            )}
          </section>

          <section className="venue-section-block">
            <p className="venue-eyebrow">Amenities</p>

            {amenities.length > 0 ? (
              <div className="venue-amenities">
                {amenities.map((amenity, index) => (
                  <div
                    className="venue-amenity"
                    key={`${amenity}-${index}`}
                  >
                    <Wifi size={15} />
                    {amenity}
                  </div>
                ))}
              </div>
            ) : (
              <div className="venue-empty-box">
                No amenities information available.
              </div>
            )}
          </section>

          <section className="venue-section-block">
            <p className="venue-eyebrow">About This Venue</p>

            <p className="venue-description">
              {venue.description || "No description available."}
            </p>
          </section>

          {courts.length > 0 && (
            <section className="venue-section-block">
              <div className="venue-section-title">
                <div>
                  <p className="venue-eyebrow">Available Courts</p>
                  <h2>{courts.length} court{courts.length !== 1 ? "s" : ""}</h2>
                </div>
              </div>

              <div className="venue-court-grid">
                {courts.map(court => (
                  <article className="venue-court-card" key={court.id}>
                    <div>
                      <span className="venue-court-sport">
                        {court.sport || "Sport"}
                      </span>

                      <h3>
                        {court.name || court.courtName || "Court"}
                      </h3>
                    </div>

                    <strong>
                      INR {Number(court.pricePerHour || 0).toFixed(2)}
                      <small>/hour</small>
                    </strong>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section className="venue-section-block">
            <div className="venue-section-title">
              <div>
                <p className="venue-eyebrow">Reviews</p>
                <h2>
                  {totalReviews > 0
                    ? `${totalReviews} review${totalReviews !== 1 ? "s" : ""}`
                    : "Reviews"}
                </h2>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="venue-empty-box">
                No reviews yet.
              </div>
            ) : (
              <div className="venue-reviews">
                {reviews.map(review => (
                  <article className="venue-review" key={review.id}>
                    <div className="venue-review-top">
                      <strong>
                        {review.userName ||
                          review.user?.name ||
                          "Player"}
                      </strong>

                      <span className="venue-review-rating">
                        <Star size={14} fill="currentColor" />
                        {review.rating || 0}/5
                      </span>
                    </div>

                    <p>
                      {review.comment || "No comment provided."}
                    </p>

                    {review.createdAt && (
                      <small>
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-IN"
                        )}
                      </small>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}