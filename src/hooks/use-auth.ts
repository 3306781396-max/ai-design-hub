"use client";

import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
  session: any | null;
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
  const { data: session, status } = useSession();

  const loading = status === "loading";
  const user: AuthUser | null = session?.user
    ? {
        id: (session.user as any).id || undefined,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: (session.user as any).role || "user",
        provider: (session.user as any).provider,
        profile: null,
      }
    : null;

  // Sign up - in NextAuth, this is handled by the signIn flow
  // For credentials provider: sign in == sign up (if not exists)
  const signUp = async (email: string, password: string, metadata?: { full_name?: string }) => {
    try {
      const result = await nextAuthSignIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        return { success: false, error: result.error };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Sign in with email/password (credentials)
  const signIn = async (email: string, password: string) => {
    try {
      const result = await nextAuthSignIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        return { success: false, error: result.error };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Sign in with OAuth (GitHub)
  const signInWithOAuth = async (provider: "google" | "github") => {
    try {
      // NextAuth only supports GitHub in our config
      if (provider === "github") {
        await nextAuthSignIn("github", { callbackUrl: "/" });
        return { success: true };
      }
      return { success: false, error: `Provider ${provider} is not configured` };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Sign out
  const signOut = async () => {
    localStorage.removeItem("aid-hub_favorites");
    await nextAuthSignOut({ callbackUrl: "/" });
  };

  // Refresh profile (no-op in NextAuth - profile comes from provider)
  const refreshProfile = async () => {};

  return {
    user,
    session,
    loading,
    error: null,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    profile: null,
    refreshProfile,
  };
}

// ============================================================
// useRequireAuth Hook
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
