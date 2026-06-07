"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { User, Session } from "@supabase/supabase-js";
import {
  signUp as supaSignUp,
  signIn as supaSignIn,
  signInWithOAuth as supaSignInWithOAuth,
  signOut as supaSignOut,
  getSession,
  onAuthStateChange,
  getProfile,
} from "@/lib/supabase";

// ============================================================
// Types
// ============================================================

export interface AuthUser extends User {
  profile?: {
    username?: string;
    full_name?: string;
    avatar_url?: string;
    website?: string;
    bio?: string;
    role?: string;
  } | null;
}

export interface UseAuthReturn {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
  // Auth methods
  signUp: (email: string, password: string, metadata?: { full_name?: string }) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signInWithOAuth: (provider: "google" | "github") => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  // Profile
  profile: any | null;
  refreshProfile: () => Promise<void>;
}

// ============================================================
// useAuth Hook
// ============================================================

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [profile, setProfile] = useState<any | null>(null);

  // Initialize - get session
  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        const session = await getSession();
        if (!mounted) return;

        setSession(session);
        if (session?.user) {
          const authUser = session.user as AuthUser;
          // Fetch profile
          const profileData = await getProfile(session.user.id);
          authUser.profile = profileData;
          if (mounted) {
            setUser(authUser);
            setProfile(profileData);
          }
        }
      } catch (err) {
        if (mounted) setError(err as Error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initialize();

    // Listen for auth state changes
    const { data: { subscription } } = onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      setSession(session);
      if (session?.user) {
        const authUser = session.user as AuthUser;
        const profileData = await getProfile(session.user.id);
        authUser.profile = profileData;
        setUser(authUser);
        setProfile(profileData);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Sign up
  const signUp = useCallback(
    async (email: string, password: string, metadata?: { full_name?: string }) => {
      try {
        setError(null);
        const { data, error } = await supaSignUp(email, password, metadata);
        if (error) return { success: false, error: error.message };
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
    []
  );

  // Sign in
  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        setError(null);
        const { data, error } = await supaSignIn(email, password);
        if (error) return { success: false, error: error.message };
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
    []
  );

  // Sign in with OAuth (Google, GitHub)
  const signInWithOAuth = useCallback(
    async (provider: "google" | "github") => {
      try {
        setError(null);
        const { data, error } = await supaSignInWithOAuth(provider);
        if (error) return { success: false, error: error.message };
        // OAuth will redirect, so we don't return success here
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
    []
  );

  // Sign out
  const signOut = useCallback(async () => {
    try {
      setError(null);
      const { error } = await supaSignOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
      setProfile(null);
      // Clear auth-dependent local caches
      localStorage.removeItem("aid-hub_favorites");
    } catch (err: any) {
      setError(err);
    }
  }, []);

  // Refresh profile
  const refreshProfile = useCallback(async () => {
    if (!user?.id) return;
    const profileData = await getProfile(user.id);
    setProfile(profileData);
    setUser((prev) => {
      if (!prev) return null;
      return { ...prev, profile: profileData };
    });
  }, [user?.id]);

  return {
    user,
    session,
    loading,
    error,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    profile,
    refreshProfile,
  };
}

// ============================================================
// useRequireAuth Hook (optional - redirect if not logged in)
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
