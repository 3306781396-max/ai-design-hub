"use client";

import { useRouter } from "next/navigation";
import { useEffect, useCallback } from "react";
import {
  registerUser,
  loginUser,
  logoutUser,
  getSession,
  type AuthSession,
} from "@/lib/frontend-auth";
import { signInWithOAuth } from "@/lib/supabase";
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
  signUp: (
    email: string,
    password: string,
    name?: string
  ) => Promise<{
    success: boolean;
    error?: string;
    emailConfirmationRequired?: boolean;
  }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signInWithGitHub: () => Promise<void>;
  signOut: () => Promise<void>;
}

// ============================================================
// useAuth Hook
// ============================================================

export function useAuth(): UseAuthReturn {
  const { user: session, loading, refresh } = useAuthContext();

  // Map AuthSession → AuthUser (generic interface used by UI)
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

  // Register
  const signUp = useCallback(
    async (email: string, password: string, name?: string) => {
      const result = await registerUser(email, password, name);
      if (result.success && !result.emailConfirmationRequired) {
        await refresh();
      }
      return result;
    },
    [refresh]
  );

  // Login
  const signIn = useCallback(
    async (email: string, password: string) => {
      const result = await loginUser(email, password);
      if (result.success) {
        await refresh();
      }
      return result;
    },
    [refresh]
  );

  // GitHub OAuth — uses Supabase client-side OAuth
  const signInWithGitHub = useCallback(async () => {
    try {
      const { error } = await signInWithOAuth("github");
      if (error) {
        // If there's an error (e.g., not configured), show a message
        alert("GitHub login is not available. Please use email/password login instead.");
      }
      // On success, browser redirects to GitHub — no further action needed
    } catch {
      alert("GitHub login is not available. Please use email/password login instead.");
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    await logoutUser();
    await refresh();
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
