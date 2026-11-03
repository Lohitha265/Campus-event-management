import { useProfile, getInitials, getAvatarColor } from "../context/ProfileContext";
import { useRegistrations } from "../context/RegistrationContext";

export default function Navbar({ isAdmin, setIsAdmin, searchQuery, setSearchQuery, onProfileClick }) {
  const { profile, hasProfile } = useProfile();
  const { registrations } = useRegistrations();

  const initials = getInitials(profile.name);
  const avatarColor = getAvatarColor(profile.name);

  // Count registrations for this user
  const myCount = hasProfile
    ? registrations.filter((r) => r.email.toLowerCase() === profile.email.toLowerCase()).length
    : 0;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-logo">
          <span className="logo-icon">🎓</span>
          <span className="logo-text">
            Campus<span className="logo-accent">Events</span>
          </span>
        </div>

        <div className="navbar-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search events, topics, locations…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            id="search-input"
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery("")}>×</button>
          )}
        </div>

        <div className="navbar-actions">
          {/* Profile Avatar Button */}
          <button
            className="navbar-avatar-btn"
            onClick={onProfileClick}
            id="navbar-profile-btn"
            title={hasProfile ? `${profile.name} — ${myCount} event(s) registered` : "Set up your profile"}
          >
            <div className="navbar-avatar" style={{ background: hasProfile ? avatarColor : "rgba(255,255,255,0.12)" }}>
              {hasProfile ? initials : "👤"}
            </div>
            {myCount > 0 && (
              <span className="navbar-avatar-badge">{myCount}</span>
            )}
          </button>

          <button
            className={`btn-mode ${isAdmin ? "btn-admin-active" : "btn-student"}`}
            onClick={() => {
              if (!isAdmin) {
                const pw = prompt("Enter admin password:");
                if (pw === "admin123") setIsAdmin(true);
                else if (pw !== null) alert("Incorrect password.");
              } else {
                setIsAdmin(false);
              }
            }}
          >
            {isAdmin ? "👤 Student View" : "⚙ Admin"}
          </button>
        </div>
      </div>
    </nav>
  );
}
