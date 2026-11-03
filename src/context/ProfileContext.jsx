import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const ProfileContext = createContext(null);

const AVATAR_COLORS = [
  "#6C63FF", "#4ECDC4", "#FF6584", "#FFB347",
  "#A8E6CF", "#FF8B94", "#7EC8E3", "#B088F9",
];

export function getAvatarColor(name) {
  if (!name) return AVATAR_COLORS[0];
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

export function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const DEFAULT_PROFILE = {
  name: "",
  email: "",
  studentId: "",
  department: "",
  year: "",
  phone: "",
  bio: "",
};

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useLocalStorage("campus_profile", DEFAULT_PROFILE);

  const updateProfile = (updates) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const hasProfile = Boolean(profile.name && profile.email);

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, hasProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
