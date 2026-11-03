import { useState } from "react";
import { useProfile, getInitials, getAvatarColor } from "../context/ProfileContext";
import { useRegistrations } from "../context/RegistrationContext";
import { useEvents } from "../context/EventContext";
import { formatShortDate, getDaysUntil, getCapacityPercent, getCapacityColor } from "../utils/helpers";
import ProfileSetupModal from "./ProfileSetupModal";

const CATEGORY_COLORS = {
  Tech: "#6C63FF",
  Academic: "#4ECDC4",
  Cultural: "#FF6584",
  Sports: "#FFB347",
  Workshop: "#A8E6CF",
};

const STAT_CARDS = (regs, events) => {
  const categories = [...new Set(regs.map((r) => {
    const ev = events.find((e) => e.id === r.eventId);
    return ev?.category;
  }).filter(Boolean))];
  const upcoming = regs.filter((r) => {
    const ev = events.find((e) => e.id === r.eventId);
    return ev && new Date(ev.date) >= new Date();
  }).length;

  return [
    { label: "Total Registered", value: regs.length, icon: "🎟", color: "#6C63FF" },
    { label: "Upcoming Events", value: upcoming, icon: "📅", color: "#4ECDC4" },
    { label: "Categories", value: categories.length, icon: "🏷", color: "#FF6584" },
    { label: "Past Events", value: regs.length - upcoming, icon: "✅", color: "#FFB347" },
  ];
};

export default function ProfilePage({ onViewDetail, onRegister, onClose }) {
  const { profile } = useProfile();
  const { registrations } = useRegistrations();
  const { events } = useEvents();
  const [showEdit, setShowEdit] = useState(false);
  const [filter, setFilter] = useState("all");

  const initials = getInitials(profile.name);
  const avatarColor = getAvatarColor(profile.name);

  // Get events the user registered for (matched by email)
  const myRegistrations = registrations.filter(
    (r) => r.email.toLowerCase() === profile.email.toLowerCase()
  );

  const myEvents = myRegistrations
    .map((reg) => {
      const event = events.find((e) => e.id === reg.eventId);
      return event ? { ...event, regId: reg.id, regDate: reg.registeredAt } : null;
    })
    .filter(Boolean);

  const filteredMyEvents = myEvents.filter((e) => {
    if (filter === "upcoming") return new Date(e.date) >= new Date();
    if (filter === "past") return new Date(e.date) < new Date();
    return true;
  });

  const stats = STAT_CARDS(myRegistrations, events);

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal profile-page-modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>×</button>

          {/* Profile Header */}
          <div className="profile-page-header">
            <div className="profile-hero-bg" />
            <div className="profile-header-content">
              <div className="profile-avatar-large" style={{ background: avatarColor }}>
                {initials}
              </div>
              <div className="profile-info">
                <h2 className="profile-name">{profile.name}</h2>
                <p className="profile-sub">{profile.studentId} · {profile.department}</p>
                <p className="profile-sub">{profile.year} · {profile.email}</p>
                {profile.phone && <p className="profile-sub">📞 {profile.phone}</p>}
                {profile.bio && <p className="profile-bio">"{profile.bio}"</p>}
              </div>
              <button
                className="btn-edit profile-edit-btn"
                onClick={() => setShowEdit(true)}
                id="edit-profile-btn"
              >
                ✏ Edit Profile
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="profile-stats-row">
            {stats.map((s) => (
              <div key={s.label} className="profile-stat-card" style={{ borderTopColor: s.color }}>
                <span className="profile-stat-icon">{s.icon}</span>
                <span className="profile-stat-num" style={{ color: s.color }}>{s.value}</span>
                <span className="profile-stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Registered Events */}
          <div className="profile-events-section">
            <div className="profile-events-header">
              <h3>🎟 My Registered Events</h3>
              <div className="profile-filter-tabs">
                {["all", "upcoming", "past"].map((f) => (
                  <button
                    key={f}
                    className={`profile-tab ${filter === f ? "profile-tab-active" : ""}`}
                    onClick={() => setFilter(f)}
                    id={`profile-tab-${f}`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {filteredMyEvents.length === 0 ? (
              <div className="profile-empty">
                <div className="empty-icon">🎟</div>
                <h4>No events yet</h4>
                <p>
                  {filter === "upcoming"
                    ? "You have no upcoming registered events."
                    : filter === "past"
                    ? "No past events found."
                    : "You haven't registered for any events yet. Go explore!"}
                </p>
              </div>
            ) : (
              <div className="profile-events-grid">
                {filteredMyEvents.map((event) => {
                  const capacityPct = getCapacityPercent(event.registered, event.capacity);
                  const capacityColor = getCapacityColor(capacityPct);
                  const daysUntil = getDaysUntil(event.date);
                  const isPast = daysUntil === "Past Event";
                  const catColor = CATEGORY_COLORS[event.category] || "#6C63FF";

                  return (
                    <div
                      key={event.regId}
                      className={`profile-event-card ${isPast ? "profile-event-past" : ""}`}
                      onClick={() => { onClose(); onViewDetail(event); }}
                      id={`profile-event-${event.id}`}
                    >
                      <div className="profile-event-img-wrap">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="profile-event-img"
                          onError={(e) => {
                            e.target.src = `https://placehold.co/400x200/${catColor.slice(1)}/fff?text=${encodeURIComponent(event.category)}`;
                          }}
                        />
                        <div
                          className="profile-event-cat"
                          style={{ background: catColor }}
                        >
                          {event.category}
                        </div>
                        {isPast && <div className="profile-event-past-overlay">Attended</div>}
                      </div>
                      <div className="profile-event-body">
                        <h4 className="profile-event-title">{event.title}</h4>
                        <div className="event-meta">
                          <span className="meta-item">📅 {formatShortDate(event.date)}</span>
                          <span className="meta-item">🕐 {event.time}</span>
                          <span className="meta-item">📍 {event.location}</span>
                        </div>
                        <div className="profile-event-footer">
                          <span
                            className={`days-badge ${isPast ? "days-past" : ""}`}
                            style={{ color: isPast ? undefined : catColor }}
                          >
                            {daysUntil}
                          </span>
                          <span className="reg-id-badge">
                            ID: {event.regId.slice(4, 14)}…
                          </span>
                        </div>
                        <div className="capacity-bar" style={{ marginTop: "8px" }}>
                          <div
                            className="capacity-fill"
                            style={{ width: `${capacityPct}%`, background: capacityColor }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {showEdit && (
        <ProfileSetupModal onClose={() => setShowEdit(false)} mode="edit" />
      )}
    </>
  );
}
