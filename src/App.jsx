import { useState, useRef, useCallback } from "react";
import { EventProvider, useEvents } from "./context/EventContext";
import { RegistrationProvider } from "./context/RegistrationContext";
import { ProfileProvider, useProfile } from "./context/ProfileContext";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import CategoryFilter from "./components/CategoryFilter";
import EventGrid from "./components/EventGrid";
import RegistrationModal from "./components/RegistrationModal";
import EventDetailModal from "./components/EventDetailModal";
import AdminPanel from "./components/AdminPanel";
import RegistrationsList from "./components/RegistrationsList";
import ProfilePage from "./components/ProfilePage";
import ProfileSetupModal from "./components/ProfileSetupModal";
import Toast from "./components/Toast";

let toastId = 0;

function AppInner() {
  const { events, deleteEvent } = useEvents();
  const { hasProfile } = useProfile();

  // UI state
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("date");

  // Modals
  const [registerEvent, setRegisterEvent] = useState(null);
  const [detailEvent, setDetailEvent] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  // Admin editing
  const [editingEvent, setEditingEvent] = useState(null);

  // Toasts
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = "success") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Filtered events
  const filteredEvents = events.filter((e) => {
    const matchCat = activeCategory === "All" || e.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      e.title.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.tags?.some((t) => t.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  const eventsRef = useRef(null);
  const scrollToEvents = () => eventsRef.current?.scrollIntoView({ behavior: "smooth" });

  const handleDeleteEvent = (id) => {
    if (window.confirm("Delete this event? This cannot be undone.")) {
      deleteEvent(id);
      addToast("Event deleted.", "error");
    }
  };

  const handleRegistrationSuccess = (reg) => {
    setRegisterEvent(null);
    addToast(`🎉 Registered! Your ID: ${reg.id.slice(0, 16)}`, "success");
  };

  const handleAdminSuccess = (msg) => {
    addToast(msg, "success");
    setEditingEvent(null);
  };

  // Profile button click: show setup if no profile, else show profile page
  const handleProfileClick = () => {
    if (!hasProfile) {
      setShowProfileSetup(true);
    } else {
      setShowProfile(true);
    }
  };

  return (
    <div className="app">
      <Navbar
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onProfileClick={handleProfileClick}
      />

      {!isAdmin && (
        <HeroSection
          onExplore={scrollToEvents}
          events={events}
          onEventClick={(event) => setDetailEvent(event)}
        />
      )}

      <main className="main-content" ref={eventsRef}>
        {isAdmin ? (
          <div className="admin-layout">
            <div className="admin-left">
              <AdminPanel
                events={events}
                onEdit={(event) => setEditingEvent(event)}
                editingEvent={editingEvent}
                setEditingEvent={setEditingEvent}
                onAddSuccess={handleAdminSuccess}
              />
            </div>
            <div className="admin-right">
              <RegistrationsList />
            </div>
          </div>
        ) : (
          <>
            <div className="filter-bar">
              <CategoryFilter active={activeCategory} setActive={setActiveCategory} />
            </div>
            <EventGrid
              events={filteredEvents}
              onRegister={setRegisterEvent}
              onViewDetail={setDetailEvent}
              isAdmin={false}
              onEdit={() => {}}
              onDelete={() => {}}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </>
        )}
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <span className="logo-text">Campus<span className="logo-accent">Events</span></span>
          <p>© 2026 CampusEvents. Built with ❤ for students.</p>
        </div>
      </footer>

      {/* Modals */}
      {registerEvent && (
        <RegistrationModal
          event={registerEvent}
          onClose={() => setRegisterEvent(null)}
          onSuccess={handleRegistrationSuccess}
        />
      )}
      {detailEvent && (
        <EventDetailModal
          event={detailEvent}
          onClose={() => setDetailEvent(null)}
          onRegister={(e) => { setDetailEvent(null); setRegisterEvent(e); }}
        />
      )}
      {showProfile && (
        <ProfilePage
          onClose={() => setShowProfile(false)}
          onViewDetail={(event) => { setShowProfile(false); setDetailEvent(event); }}
          onRegister={(event) => { setShowProfile(false); setRegisterEvent(event); }}
        />
      )}
      {showProfileSetup && (
        <ProfileSetupModal
          onClose={() => setShowProfileSetup(false)}
          mode="setup"
        />
      )}

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default function App() {
  return (
    <ProfileProvider>
      <EventProvider>
        <RegistrationProvider>
          <AppInner />
        </RegistrationProvider>
      </EventProvider>
    </ProfileProvider>
  );
}
