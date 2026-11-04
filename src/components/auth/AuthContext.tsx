"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import {
  getSession,
  refreshSession,
  onAuthChange,
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

  const refresh = useCallback(async () => {
    const session = await refreshSession();
    setUser(session);
  }, []);

  useEffect(() => {
    let cancelled = false;

    // Phase 1: instant cached session (no loading spinner)
    const cached = getSession();
    if (cached && !cancelled) {
      setUser(cached);
    }

    // Phase 2: validate against Supabase
    refreshSession().then((session) => {
      if (!cancelled) {
        setUser(session);
        setLoading(false);
      }
    });

    // Listen for auth state changes (login/logout across tabs)
    const unsubscribe = onAuthChange((newSession) => {
      if (!cancelled) {
        setUser(newSession);
        if (loading) setLoading(false);
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}
