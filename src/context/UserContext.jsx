import { createContext, useContext, useMemo, useState } from "react";

const UserContext = createContext(null);

const STORAGE_KEY = "hintro_user_id";

export function UserProvider({ children }) {
  const [userId, setUserIdState] = useState(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "u2" ? "u2" : "u1";
  });

  const setUserId = (nextUserId) => {
    const normalized = nextUserId === "u2" ? "u2" : "u1";
    window.localStorage.setItem(STORAGE_KEY, normalized);
    setUserIdState(normalized);
  };

  const value = useMemo(() => ({ userId, setUserId }), [userId]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within UserProvider");
  }
  return ctx;
}

export function resetUserToDefault() {
  window.localStorage.setItem(STORAGE_KEY, "u1");
}

