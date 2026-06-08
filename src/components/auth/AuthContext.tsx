"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import {
  getSession,
  saveSession,
  clearSession,
  onAuthChange,
  notifyAuthChange,
  type AuthSession,
} from "@/lib/frontend-auth";

// ============================================================
// Types
// ============================================================

interface AuthContextValue {
  user: AuthSession | null;
  loading: boolean;
  refresh: () => void;
}

// ============================================================
// Context
// ============================================================

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  refresh: () => {},
});

export function useAuthContext() {
  return useContext(AuthContext);
}

// ============================================================
// Provider
// ============================================================

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    const session = getSession();
    setUser(session);
  }, []);

  useEffect(() => {
    // Initial load
    const session = getSession();
    setUser(session);
    setLoading(false);

    // Listen for changes
    const unsubscribe = onAuthChange((newSession) => {
      setUser(newSession);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}
