const sports = [
  {
    name: "Badminton",
    image:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=500&q=85",
  },
  {
    name: "Football",
    image:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=500&q=85",
  },
  {
    name: "Cricket",
    image:
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=500&q=85",
  },
  {
    name: "Swimming",
    image:
      "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=500&q=85",
  },
  {
    name: "Tennis",
    image:
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=500&q=85",
  },
  {
    name: "Table Tennis",
    image:
      "https://images.unsplash.com/photo-1611251135345-18c56206b863?auto=format&fit=crop&w=500&q=85",
  },
];

export default function PopularSports() {
  return (
    <section className="popular-sports">
      <div className="popular-sports-heading">
        <p className="eyebrow">Choose your game</p>
        <h2>Popular sports</h2>
      </div>
      <div className="sports-strip">
        {sports.map((sport) => (
          <button className="sport-tile" key={sport.name}>
            <img src={sport.image} alt={`${sport.name} players`} />
            <span>{sport.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
