"use client";

import { useRouter } from "next/navigation";
import { useEffect, useCallback } from "react";
import {
  registerUser,
  loginUser,
  logoutUser,
  notifyAuthChange,
  getSession,
  type AuthSession,
} from "@/lib/frontend-auth";
import { useAuthContext } from "@/components/auth/AuthContext";

// ============================================================
// Types
// ============================================================

export interface AuthUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
  provider?: string;
  github_username?: string;
}

export interface UseAuthReturn {
  user: AuthUser | null;
  session: AuthSession | null;
  loading: boolean;
  error: Error | null;
  signUp: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGitHub: () => Promise<void>;
  signOut: () => Promise<void>;
}

// ============================================================
// useAuth Hook
// ============================================================

export function useAuth(): UseAuthReturn {
  const { user: session, loading, refresh } = useAuthContext();

  const mappedUser: AuthUser | null = session
    ? {
        id: session.id,
        name: session.name,
        email: session.email,
        image: session.avatar || null,
        role: session.role,
        provider: "credentials",
        github_username: undefined,
      }
    : null;

  // Email/Password login
  const signIn = useCallback(async (email: string, password: string) => {
    const result = await loginUser(email, password);
    if (result.success) {
      notifyAuthChange(getSession());
      refresh();
    }
    return result;
  }, [refresh]);

  // Register
  const signUp = useCallback(async (email: string, password: string, name?: string) => {
    const result = await registerUser(email, password, name);
    if (result.success) {
      notifyAuthChange(getSession());
      refresh();
    }
    return result;
  }, [refresh]);

  // GitHub OAuth — not available in static mode
  const signInWithGitHub = useCallback(async () => {
    // Show a toast/alert that GitHub login requires the full version
    if (typeof window !== "undefined") {
      alert("GitHub login is not available in this version. Please use email/password login instead.");
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    logoutUser();
    notifyAuthChange(null);
    refresh();
  }, [refresh]);

  return {
    user: mappedUser,
    session,
    loading,
    error: null,
    signUp,
    signIn,
    signInWithGitHub,
    signOut,
  };
}

// ============================================================
// useRequireAuth Hook — client-side route guard
// ============================================================

export function useRequireAuth(redirectTo: string = "/") {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, redirectTo, router]);

  return { user, loading };
}
