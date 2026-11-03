import { getCapacityPercent, getCapacityColor, formatShortDate, getDaysUntil } from "../utils/helpers";

const CATEGORY_COLORS = {
  Tech: "#6C63FF",
  Academic: "#4ECDC4",
  Cultural: "#FF6584",
  Sports: "#FFB347",
  Workshop: "#A8E6CF",
};

export default function EventCard({ event, onRegister, onViewDetail, isAdmin, onEdit, onDelete }) {
  const capacityPct = getCapacityPercent(event.registered, event.capacity);
  const capacityColor = getCapacityColor(capacityPct);
  const isFull = event.registered >= event.capacity;
  const daysUntil = getDaysUntil(event.date);
  const isPast = daysUntil === "Past Event";

  return (
    <div className={`event-card ${event.featured ? "event-card-featured" : ""}`} id={`card-${event.id}`}>
      {event.featured && <div className="featured-badge">⭐ Featured</div>}

      <div className="event-card-img-wrap" onClick={() => onViewDetail(event)}>
        <img
          src={event.image}
          alt={event.title}
          className="event-card-img"
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://placehold.co/800x400/${CATEGORY_COLORS[event.category]?.slice(1) || "6C63FF"}/ffffff?text=${encodeURIComponent(event.category)}`;
          }}
        />
        <div className="event-card-category" style={{ background: CATEGORY_COLORS[event.category] || "#6C63FF" }}>
          {event.category}
        </div>
        {isPast && <div className="event-past-overlay">Past Event</div>}
      </div>

      <div className="event-card-body">
        <h3 className="event-title" onClick={() => onViewDetail(event)}>{event.title}</h3>

        <div className="event-meta">
          <span className="meta-item">📅 {formatShortDate(event.date)}</span>
          <span className="meta-item">🕐 {event.time}</span>
          <span className="meta-item">📍 {event.location}</span>
        </div>

        <p className="event-desc">{event.description}</p>

        <div className="event-tags">
          {event.tags?.slice(0, 3).map((tag) => (
            <span key={tag} className="event-tag">#{tag}</span>
          ))}
        </div>

        <div className="capacity-section">
          <div className="capacity-labels">
            <span>{event.registered}/{event.capacity} Registered</span>
            <span style={{ color: capacityColor }}>{capacityPct}%</span>
          </div>
          <div className="capacity-bar">
            <div
              className="capacity-fill"
              style={{ width: `${capacityPct}%`, background: capacityColor }}
            />
          </div>
        </div>

        <div className="event-footer">
          <span className={`days-badge ${isPast ? "days-past" : ""}`}>{daysUntil}</span>

          <div className="event-actions">
            {isAdmin ? (
              <>
                <button className="btn-edit" onClick={() => onEdit(event)} id={`edit-${event.id}`}>✏ Edit</button>
                <button className="btn-delete" onClick={() => onDelete(event.id)} id={`delete-${event.id}`}>🗑 Delete</button>
              </>
            ) : (
              <button
                className={`btn-register ${isFull || isPast ? "btn-disabled" : ""}`}
                onClick={() => !isFull && !isPast && onRegister(event)}
                disabled={isFull || isPast}
                id={`register-${event.id}`}
              >
                {isFull ? "Fully Booked" : isPast ? "Ended" : "Register Now"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
