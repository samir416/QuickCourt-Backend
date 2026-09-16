export default function VenueFilters({ filters, onChange, onClear }) {
  return (
    <aside className="venue-filters">
      <div className="filter-heading">
        <h2>Filter venues</h2>
        <button onClick={onClear}>Clear all</button>
      </div>
      <label className="filter-field">
        Search by venue name
        <input
          value={filters.search}
          onChange={(event) => onChange("search", event.target.value)}
          placeholder="Search for venue"
        />
      </label>
      <label className="filter-field">
        Filter by sport
        <select
          value={filters.sport}
          onChange={(event) => onChange("sport", event.target.value)}
        >
          <option>All sports</option>
          <option>Badminton</option>
          <option>Football</option>
          <option>Tennis</option>
        </select>
      </label>
      <fieldset>
        <legend>Price range (per hour)</legend>
        <div className="price-inputs">
          <input
            type="number"
            min="0"
            value={filters.minPrice}
            onChange={(event) => onChange("minPrice", event.target.value)}
            aria-label="Minimum price"
          />
          <span>to</span>
          <input
            type="number"
            min="0"
            value={filters.maxPrice}
            onChange={(event) => onChange("maxPrice", event.target.value)}
            aria-label="Maximum price"
          />
        </div>
      </fieldset>
      <fieldset>
        <legend>Choose venue type</legend>
        <label className="check-row">
          <input
            type="checkbox"
            checked={filters.indoor}
            onChange={(event) => onChange("indoor", event.target.checked)}
          />
          Indoor
        </label>
        <label className="check-row">
          <input
            type="checkbox"
            checked={filters.outdoor}
            onChange={(event) => onChange("outdoor", event.target.checked)}
          />
          Outdoor
        </label>
      </fieldset>
      <fieldset>
        <legend>Rating</legend>
        <label className="check-row">
          <input
            type="checkbox"
            checked={filters.highRating}
            onChange={(event) => onChange("highRating", event.target.checked)}
          />
          4.5 stars & up
        </label>
        <label className="check-row">
          <input
            type="checkbox"
            checked={filters.fourRating}
            onChange={(event) => onChange("fourRating", event.target.checked)}
          />
          4 stars & up
        </label>
        <label className="check-row">
          <input
            type="checkbox"
            checked={filters.threeRating}
            onChange={(event) => onChange("threeRating", event.target.checked)}
          />
          3 stars & up
        </label>
        <label className="check-row">
          <input
            type="checkbox"
            checked={filters.oneRating}
            onChange={(event) => onChange("oneRating", event.target.checked)}
          />
          1 star & up
        </label>
      </fieldset>
    </aside>
  );
}
