import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import VenueFilters from "../components/VenueFilters";
import VenueListingCard from "../components/VenueListingCard";
import { apiFetch } from "../services/api";

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
  const [apiVenues, setApiVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const data = await apiFetch("/venues?size=1000");
        setApiVenues(Array.isArray(data) ? data : (data.content || []));
        setError(null);
      } catch (err) {
        setError(err.message);
        setApiVenues([]); 
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  const updateFilter = (name, value) =>
    setFilters((current) => ({ ...current, [name]: value }));
  const filteredVenues = apiVenues.filter((venue) => {
    const matchesSearch = venue.name
      ?.toLowerCase()
      .includes(filters.search.toLowerCase());
    const matchesSport =
      filters.sport === "All sports" || (venue.sports && venue.sports.includes(filters.sport));
    const matchesPrice =
      Number(venue.startingPrice || 0) >= Number(filters.minPrice || 0) &&
      Number(venue.startingPrice || 0) <= Number(filters.maxPrice || 5000);
    const isIndoor = venue.venueType?.toLowerCase().includes("indoor");
    const isOutdoor = venue.venueType?.toLowerCase().includes("outdoor");
    const matchesType =
      (!filters.indoor && !filters.outdoor) ||
      (filters.indoor && isIndoor) ||
      (filters.outdoor && isOutdoor);
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
      return Number(firstVenue.startingPrice) - Number(secondVenue.startingPrice);
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
          {loading && <p style={{margin: '20px 0'}}>Loading venues from backend...</p>}
          {error && <p style={{color: 'red', margin: '20px 0'}}>Failed to load venues: {error}</p>}
          
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
          
          {!loading && !error && visibleVenues.length > 0 ? (
            <div className="listing-grid">
              {(visibleVenues.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)).map((venue) => (
                <VenueListingCard venue={venue} key={venue.id || venue.name} />
              ))}
            </div>
          ) : !loading && !error ? (
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
          ) : null}
          
          {Math.ceil(visibleVenues.length / itemsPerPage) > 1 && (
            <nav className="pagination" aria-label="Venue pages">
              <button aria-label="Previous page" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>&lt;</button>
              {Array.from({length: Math.ceil(visibleVenues.length / itemsPerPage)}, (_, i) => i + 1).map(p => (
                <button key={p} className={currentPage === p ? "current-page" : ""} onClick={() => setCurrentPage(p)}>{p}</button>
              ))}
              <button aria-label="Next page" disabled={currentPage === Math.ceil(visibleVenues.length / itemsPerPage)} onClick={() => setCurrentPage(p => p + 1)}>&gt;</button>
            </nav>
            )}
        </section>
      </div>
      <footer className="directory-footer">
        quickcourt <span>Find your next game.</span>
      </footer>
    </main>
  );
}



