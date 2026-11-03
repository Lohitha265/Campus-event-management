import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { generateId } from "../utils/helpers";

const RegistrationContext = createContext(null);

export function RegistrationProvider({ children }) {
  const [registrations, setRegistrations] = useLocalStorage("campus_registrations", []);

  const addRegistration = (formData, eventId) => {
    const reg = {
      ...formData,
      id: generateId(),
      eventId,
      registeredAt: new Date().toISOString(),
    };
    setRegistrations((prev) => [reg, ...prev]);
    return reg;
  };

  const isAlreadyRegistered = (eventId, email) => {
    return registrations.some(
      (r) => r.eventId === eventId && r.email.toLowerCase() === email.toLowerCase()
    );
  };

  const getRegistrationsForEvent = (eventId) => {
    return registrations.filter((r) => r.eventId === eventId);
  };

  const deleteRegistration = (id) => {
    setRegistrations((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <RegistrationContext.Provider
      value={{
        registrations,
        addRegistration,
        isAlreadyRegistered,
        getRegistrationsForEvent,
        deleteRegistration,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistrations() {
  return useContext(RegistrationContext);
}
