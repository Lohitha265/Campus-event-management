import { formatDate, getCapacityPercent, getCapacityColor } from "../utils/helpers";
import { useRegistrations } from "../context/RegistrationContext";

const CATEGORY_COLORS = {
  Tech: "#6C63FF",
  Academic: "#4ECDC4",
  Cultural: "#FF6584",
  Sports: "#FFB347",
  Workshop: "#A8E6CF",
};

export default function EventDetailModal({ event, onClose, onRegister }) {
  const { getRegistrationsForEvent } = useRegistrations();
  if (!event) return null;

  const registrations = getRegistrationsForEvent(event.id);
  const capacityPct = getCapacityPercent(event.registered, event.capacity);
  const capacityColor = getCapacityColor(capacityPct);
  const isFull = event.registered >= event.capacity;
  const catColor = CATEGORY_COLORS[event.category] || "#6C63FF";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="detail-hero-img-wrap">
          <img src={event.image} alt={event.title} className="detail-hero-img" />
          <div className="detail-img-overlay" />
          <div
            className="detail-category-badge"
            style={{ background: catColor }}
          >
            {event.category}
          </div>
          {event.featured && <div className="detail-featured-badge">⭐ Featured Event</div>}
        </div>

        <div className="detail-body">
          <h2 className="detail-title">{event.title}</h2>

          <div className="detail-meta-grid">
            <div className="detail-meta-item">
              <span className="detail-meta-icon">📅</span>
              <div>
                <span className="detail-meta-label">Date</span>
                <span className="detail-meta-value">{formatDate(event.date)}</span>
              </div>
            </div>
            <div className="detail-meta-item">
              <span className="detail-meta-icon">🕐</span>
              <div>
                <span className="detail-meta-label">Time</span>
                <span className="detail-meta-value">{event.time}</span>
              </div>
            </div>
            <div className="detail-meta-item">
              <span className="detail-meta-icon">📍</span>
              <div>
                <span className="detail-meta-label">Location</span>
                <span className="detail-meta-value">{event.location}</span>
              </div>
            </div>
            <div className="detail-meta-item">
              <span className="detail-meta-icon">👥</span>
              <div>
                <span className="detail-meta-label">Capacity</span>
                <span className="detail-meta-value">{event.registered}/{event.capacity}</span>
              </div>
            </div>
          </div>

          <div className="detail-capacity">
            <div className="capacity-labels">
              <span>Registration Progress</span>
              <span style={{ color: capacityColor }}>{capacityPct}% Full</span>
            </div>
            <div className="capacity-bar">
              <div
                className="capacity-fill"
                style={{ width: `${capacityPct}%`, background: capacityColor }}
              />
            </div>
          </div>

          <p className="detail-description">{event.description}</p>

          {event.speakers && event.speakers.length > 0 && (
            <div className="detail-speakers">
              <h4>🎤 Speakers & Guests</h4>
              <div className="speakers-list">
                {event.speakers.map((s) => (
                  <div key={s} className="speaker-chip">{s}</div>
                ))}
              </div>
            </div>
          )}

          {event.tags && event.tags.length > 0 && (
            <div className="detail-tags">
              {event.tags.map((tag) => (
                <span key={tag} className="event-tag">#{tag}</span>
              ))}
            </div>
          )}

          {registrations.length > 0 && (
            <div className="detail-registrations">
              <h4>✅ {registrations.length} Registered from this session</h4>
            </div>
          )}

          <div className="detail-actions">
            <button className="btn-secondary" onClick={onClose}>Close</button>
            <button
              className={`btn-primary ${isFull ? "btn-disabled" : ""}`}
              onClick={() => { onClose(); onRegister(event); }}
              disabled={isFull}
              id={`detail-register-${event.id}`}
            >
              {isFull ? "Fully Booked" : "Register Now →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
