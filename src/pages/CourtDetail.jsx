import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { venues } from "../data/venues";

const amenities = [
  "Parking",
  "Restroom",
  "Refreshments",
  "CCTV Surveillance",
  "Centrally Air Conditioned Hall",
  "Seating Arrangement",
  "WiFi",
  "Library",
];
const sports = ["Badminton", "Table Tennis", "Box Cricket"];

export default function CourtDetail() {
  const { venueId } = useParams();
  const venue = venues.find((item) => item.id === venueId) || venues[0];
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [selectedSport, setSelectedSport] = useState(venue.type);
  const [reviewCount, setReviewCount] = useState(2);
  const galleryImages = venue.gallery || [venue.image];
  return (
    <main className="detail-page">
      <div className="detail-topbar">
        <Link to="/booking">See venues</Link>
        <span>/</span>
        <span>Single venue details page</span>
      </div>
      <div className="detail-shell">
        <div className="detail-brand-row">
          <Link className="detail-brand" to="/">
            quickcourt
          </Link>
          <Link className="detail-book-link" to="/booking">
            ▣ Book
          </Link>
          <Link className="detail-login-link" to="/logsign">
            ▣ Log in / Sign up
          </Link>
        </div>
        <header className="detail-heading">
          <div>
            <h1>{venue.name}</h1>
            <div className="detail-meta">
              <span>♥ {venue.location}, Ahmedabad</span>
              <span>
                ★ {venue.rating || "4.5"} ({venue.reviews || 6})
              </span>
            </div>
          </div>
          <Link
            className="detail-book-button"
            to={`/booking/${venue.id}/reserve`}
          >
            ▣ Book This Venue
          </Link>
        </header>
        <div className="detail-main-grid">
          <section className="detail-gallery">
            <img
              src={galleryImages[galleryIndex]}
              alt={`${venue.name} venue view`}
            />
            <button
              className="gallery-arrow gallery-prev"
              aria-label="Previous image"
              onClick={() =>
                setGalleryIndex(
                  (current) =>
                    (current - 1 + galleryImages.length) % galleryImages.length,
                )
              }
            >
              &lt;
            </button>
            <button
              className="gallery-arrow gallery-next"
              aria-label="Next image"
              onClick={() =>
                setGalleryIndex(
                  (current) => (current + 1) % galleryImages.length,
                )
              }
            >
              &gt;
            </button>
            <span>Images / Videos</span>
          </section>
          <aside className="detail-side-info">
            <div className="hours-card">
              <h2>◷ Operating Hours</h2>
              <p>7:00AM - 11:00PM</p>
            </div>
            <div className="address-card">
              <h2>♥ Address</h2>
              <p>
                2nd Floor, Aangan Banquet Hall,
                <br />
                Opp. Akruti Heights, {venue.location},<br />
                Ahmedabad, Gujarat - 380051
              </p>
            </div>
          </aside>
        </div>
        <section className="sports-panel">
          <h2>
            Sports Available{" "}
            <small>(Click on sports to view price chart)</small>
          </h2>
          <div className="sports-options">
            {sports.map((sport) => (
              <button
                key={sport}
                className={sport === selectedSport ? "selected" : ""}
                onClick={() => setSelectedSport(sport)}
              >
                {sport}
              </button>
            ))}
          </div>
        </section>
        <section className="amenities-panel">
          <h2>Amenities</h2>
          <div className="amenities-grid">
            {amenities.map((amenity) => (
              <span key={amenity}>● {amenity}</span>
            ))}
          </div>
        </section>
        <section className="about-panel">
          <h2>About Venue</h2>
          <p>— Tournament Training Venue</p>
          <p>— For more than 2 players, INR 50 extra per person</p>
          <p>— Equipment available on rent</p>
        </section>
        <section className="reviews-panel">
          <h2>Player Reviews &amp; Ratings</h2>
          {Array.from({ length: reviewCount }, (_, index) => (
            <Review
              key={index}
              name="Mitchell Admin"
              date="10 June 2025, 5:30 PM"
            />
          ))}
          {reviewCount < 4 && (
            <button className="load-reviews" onClick={() => setReviewCount(4)}>
              [Load more reviews]
            </button>
          )}
        </section>
        <footer className="detail-footer">
          quickcourt <span>Footer</span>
        </footer>
      </div>
    </main>
  );
}

function Review({ name, date }) {
  return (
    <article className="review-card">
      <div className="review-avatar">MA</div>
      <div>
        <strong>{name} - ★★★★★</strong>
        <p>Nice turf, well maintained</p>
      </div>
      <time>▣ {date}</time>
    </article>
  );
}
