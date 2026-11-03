const CATEGORIES = ["All", "Tech", "Academic", "Cultural", "Sports", "Workshop"];

const CATEGORY_ICONS = {
  All: "🌐",
  Tech: "💻",
  Academic: "📚",
  Cultural: "🎭",
  Sports: "⚽",
  Workshop: "🛠",
};

export default function CategoryFilter({ active, setActive }) {
  return (
    <div className="category-filter">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          id={`cat-${cat.toLowerCase()}`}
          className={`cat-pill ${active === cat ? "cat-pill-active" : ""}`}
          onClick={() => setActive(cat)}
        >
          <span className="cat-icon">{CATEGORY_ICONS[cat]}</span>
          {cat}
        </button>
      ))}
    </div>
  );
}
