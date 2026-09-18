import React from 'react';

// Fallback image map
const SPORT_IMAGES = {
  badminton: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=500&q=85",
  football: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=500&q=85",
  cricket: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=500&q=85",
  swimming: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=500&q=85",
  tennis: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=500&q=85",
  "table tennis": "https://images.unsplash.com/photo-1611251135345-18c56206b863?auto=format&fit=crop&w=500&q=85"
};

const getDefaultImage = (sportName) => {
    const key = sportName.toLowerCase();
    if (SPORT_IMAGES[key]) return SPORT_IMAGES[key];
    if (key.includes('turf')) return SPORT_IMAGES['football'];
    if (key.includes('gym')) return "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=500&q=85";
    return "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=500&q=85"; // generic sports
};

export default function PopularSports({ sports = [], onSportSelect }) {
  if (!sports || sports.length === 0) return null;

  return (
    <section className="popular-sports">
      <div className="popular-sports-heading">
        <p className="eyebrow">Choose your game</p>
        <h2>Popular sports</h2>
      </div>
      <div className="sports-strip">
        {sports.map((sport) => (
          <button 
            className="sport-tile" 
            key={sport} 
            onClick={() => onSportSelect && onSportSelect(sport)}
          >
            <img src={getDefaultImage(sport)} alt={`${sport} players`} />
            <span style={{ textTransform: 'capitalize' }}>{sport}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
