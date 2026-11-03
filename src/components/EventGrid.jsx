import EventCard from "./EventCard";

export default function EventGrid({ events, onRegister, onViewDetail, isAdmin, onEdit, onDelete, sortBy, setSortBy }) {
  const sorted = [...events].sort((a, b) => {
    if (sortBy === "date") return new Date(a.date) - new Date(b.date);
    if (sortBy === "popularity") return b.registered - a.registered;
    if (sortBy === "name") return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <div className="event-grid-section">
      <div className="grid-header">
        <p className="grid-count">
          {events.length} event{events.length !== 1 ? "s" : ""} found
        </p>
        <div className="sort-group">
          <label htmlFor="sort-select">Sort by:</label>
          <select
            id="sort-select"
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Date</option>
            <option value="popularity">Popularity</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No events found</h3>
          <p>Try adjusting your search or category filter.</p>
        </div>
      ) : (
        <div className="event-grid">
          {sorted.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onRegister={onRegister}
              onViewDetail={onViewDetail}
              isAdmin={isAdmin}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
