import { Link } from "react-router-dom";

export default function SearchPanel({ sport, onSportChange }) {
  return (
    <div className="search-panel">
      <label>
        <span>Where</span>
        <input defaultValue="Ahmedabad" aria-label="Location" />
      </label>
      <label>
        <span>What are you playing?</span>
        <select
          value={sport}
          onChange={(event) => onSportChange(event.target.value)}
          aria-label="Sport"
        >
          <option>All sports</option>
          <option>Badminton</option>
          <option>Football</option>
          <option>Tennis</option>
        </select>
      </label>
      <Link className="button button-dark" to="/booking">
        Find courts <span aria-hidden="true">-&gt;</span>
      </Link>
    </div>
  );
}
