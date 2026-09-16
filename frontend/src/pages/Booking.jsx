import { useState } from "react";
import { Link } from "react-router-dom";
import VenueFilters from "../components/VenueFilters";
import VenueListingCard from "../components/VenueListingCard";
import { venues } from "../data/venues";

const initialFilters = {
  search: "",
  sport: "All sports",
  minPrice: 0,
  maxPrice: 5000,
  indoor: false,
  outdoor: false,
  highRating: false,
  fourRating: false,
  threeRating: false,
  oneRating: false,
};

export default function Booking() {
  const [filters, setFilters] = useState(initialFilters);
  const [sortBy, setSortBy] = useState("Recommended");
  const updateFilter = (name, value) =>
    setFilters((current) => ({ ...current, [name]: value }));
  const filteredVenues = venues.filter((venue) => {
    const matchesSearch = venue.name
      .toLowerCase()
      .includes(filters.search.toLowerCase());
    const matchesSport =
      filters.sport === "All sports" || venue.type === filters.sport;
    const matchesPrice =
      Number(venue.price) >= Number(filters.minPrice || 0) &&
      Number(venue.price) <= Number(filters.maxPrice || 5000);
    const matchesType =
      (!filters.indoor && !filters.outdoor) ||
      (filters.indoor && !venue.outdoor) ||
      (filters.outdoor && venue.outdoor);
    const ratingFilters = [
      filters.highRating && 4.5,
      filters.fourRating && 4,
      filters.threeRating && 3,
      filters.oneRating && 1,
    ].filter(Boolean);
    const matchesRating =
      ratingFilters.length === 0 ||
      ratingFilters.some(
        (minimumRating) => Number(venue.rating) >= minimumRating,
      );
    return (
      matchesSearch &&
      matchesSport &&
      matchesPrice &&
      matchesType &&
      matchesRating
    );
  });
  const visibleVenues = [...filteredVenues].sort((firstVenue, secondVenue) => {
    if (sortBy === "Price: low to high")
      return Number(firstVenue.price) - Number(secondVenue.price);
    if (sortBy === "Rating")
      return Number(secondVenue.rating) - Number(firstVenue.rating);
    return 0;
  });

  return (
    <main className="venue-directory">
      <div className="directory-breadcrumb">
        <Link to="/">See venues</Link>
        <span>/</span>
        <strong>Venue booking page</strong>
      </div>
      <section className="directory-heading">
        <p className="eyebrow">QuickCourt / Ahmedabad</p>
        <h1>Sports venues in Ahmedabad</h1>
        <p>Discover and book nearby venues for every kind of game.</p>
      </section>
      <div className="directory-layout">
        <VenueFilters
          filters={filters}
          onChange={updateFilter}
          onClear={() => setFilters(initialFilters)}
        />
        <section className="venue-results">
          <div className="results-toolbar">
            <span>{visibleVenues.length} venues found</span>
            <select
              aria-label="Sort venues"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option>Recommended</option>
              <option>Price: low to high</option>
              <option>Rating</option>
            </select>
          </div>
          {visibleVenues.length > 0 ? (
            <div className="listing-grid">
              {visibleVenues.map((venue) => (
                <VenueListingCard venue={venue} key={venue.id} />
              ))}
            </div>
          ) : (
            <div className="empty-results">
              <h2>No venues found</h2>
              <p>Try clearing a filter or searching for another sport.</p>
              <button
                className="button button-dark"
                onClick={() => setFilters(initialFilters)}
              >
                Clear filters
              </button>
            </div>
          )}
          <nav className="pagination" aria-label="Venue pages">
            <button aria-label="Previous page">&lt;</button>
            <button className="current-page">1</button>
            <button>2</button>
            <button>3</button>
            <button>4</button>
            <span>...</span>
            <button>11</button>
            <button aria-label="Next page">&gt;</button>
          </nav>
        </section>
      </div>
      <footer className="directory-footer">
        quickcourt <span>Find your next game.</span>
      </footer>
    </main>
  );
}
