import SearchPanel from "./SearchPanel";

export default function HeroSection({ sport, onSportChange, userName, popularSports = [] }) {
  return (
    <section className="hero-section">
      <div className="hero-copy">
        <p className="eyebrow">Ahmedabad / play locally</p>
        <h1>
          {userName ? (
             <>Welcome back, <em>{userName}.</em></>
          ) : (
             <>Find your next <em>game.</em></>
          )}
        </h1>
        <p className="hero-intro">
          Book great courts, meet sports enthusiasts, and make time for the
          games you keep talking about.
        </p>
        <SearchPanel sport={sport} onSportChange={onSportChange} popularSports={popularSports} />
      </div>
      <div className="hero-art">
        <img
          src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1400&q=90"
          alt="Tennis player preparing to serve on a sunlit court"
        />
        <div className="hero-art-overlay" />
        <div className="hero-art-label">
          QUICKCOURT
          <br />
          <span>LOCAL SPORTS / 01</span>
        </div>
        <div className="hero-art-caption">
          PLAY OUTSIDE
          <br />
          MEET YOUR PEOPLE
        </div>
      </div>
    </section>
  );
}
