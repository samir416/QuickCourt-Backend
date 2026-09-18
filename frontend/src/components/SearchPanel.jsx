import { Link } from "react-router-dom";

export default function SearchPanel({ sport, onSportChange, popularSports = [] }) {
  // Always include standard options, plus whatever the backend returned, unique and capitalized.
  const allSports = Array.from(new Set([
      "Badminton", "Football", "Tennis", 
      ...popularSports.map(s => s.charAt(0).toUpperCase() + s.slice(1))
  ]));

  return (
    <div className="search-panel">
      <label>
        <span>Where</span>
        <input defaultValue="Ahmedabad" aria-label="Location" readOnly style={{ cursor: 'default', color: '#555' }} />
      </label>
      <label>
        <span>What are you playing?</span>
        <select
          value={sport}
          onChange={(event) => onSportChange(event.target.value)}
          aria-label="Sport"
        >
          <option value="All sports">All sports</option>
          {allSports.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </label>
      <Link className="button button-dark" to="/booking">
        Find courts <span aria-hidden="true">-&gt;</span>
      </Link>
    </div>
  );
}
