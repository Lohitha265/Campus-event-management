import { createContext, useContext, useState, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { seedEvents } from "../data/seedEvents";

const EventContext = createContext(null);

export function EventProvider({ children }) {
  const [events, setEvents] = useLocalStorage("campus_events", []);

  // Seed on first load
  useEffect(() => {
    const seeded = localStorage.getItem("campus_events_seeded");
    if (!seeded) {
      setEvents(seedEvents);
      localStorage.setItem("campus_events_seeded", "true");
    }
  }, []);

  const addEvent = (event) => {
    const newEvent = {
      ...event,
      id: "evt-" + Date.now(),
      registered: 0,
      featured: false,
    };
    setEvents((prev) => [newEvent, ...prev]);
    return newEvent;
  };

  const updateEvent = (id, updates) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const deleteEvent = (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const incrementRegistered = (id) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, registered: (e.registered || 0) + 1 } : e
      )
    );
  };

  return (
    <EventContext.Provider
      value={{ events, addEvent, updateEvent, deleteEvent, incrementRegistered }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  return useContext(EventContext);
}
