const CATEGORY_ICONS = {
  Tech: "💻",
  Academic: "📚",
  Cultural: "🎭",
  Sports: "⚽",
  Workshop: "🛠",
  default: "🎯",
};

const FLOAT_CLASSES = ["hero-card-float-1", "hero-card-float-2", "hero-card-float-3"];

export default function HeroSection({ onExplore, events = [], onEventClick }) {
  // Pick top 3 featured or first 3 events for floating cards
  const featuredEvents = [
    ...events.filter((e) => e.featured),
    ...events.filter((e) => !e.featured),
  ].slice(0, 3);

  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
      </div>
      <div className="hero-content">
        <div className="hero-badge">✨ Your Campus. Your Events.</div>
        <h1 className="hero-title">
          Discover <span className="gradient-text">Campus Events</span>
          <br />
          That Shape Your Future
        </h1>
        <p className="hero-subtitle">
          Explore hundreds of academic, cultural, sports, and tech events.
          Register in seconds. Never miss a moment.
        </p>
        <div className="hero-cta">
          <button className="btn-primary" onClick={onExplore} id="hero-explore-btn">
            Explore Events <span>→</span>
          </button>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-num">{events.length}+</span>
              <span className="stat-label">Events</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">
                {events.reduce((sum, e) => sum + (e.registered || 0), 0)}
              </span>
              <span className="stat-label">Registrations</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">6</span>
              <span className="stat-label">Categories</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating clickable event cards */}
      <div className="hero-visual">
        {featuredEvents.length > 0
          ? featuredEvents.map((event, i) => (
              <button
                key={event.id}
                className={`hero-card-float ${FLOAT_CLASSES[i]} hero-card-float-clickable`}
                onClick={() => onEventClick && onEventClick(event)}
                id={`hero-float-${event.id}`}
                title={`View: ${event.title}`}
              >
                <span>{CATEGORY_ICONS[event.category] || CATEGORY_ICONS.default}</span>
                <span className="hero-float-title">
                  {event.title.length > 22 ? event.title.slice(0, 22) + "…" : event.title}
                </span>
                <span className="hero-float-arrow">→</span>
              </button>
            ))
          : (
            // Fallback placeholders before events load
            <>
              <div className="hero-card-float hero-card-float-1"><span>🎯</span> AI Summit – Nov 15</div>
              <div className="hero-card-float hero-card-float-2"><span>⚽</span> Football Champ – Nov 20</div>
              <div className="hero-card-float hero-card-float-3"><span>🎭</span> Rang 2026 – Nov 25</div>
            </>
          )}
      </div>
    </section>
  );
}
