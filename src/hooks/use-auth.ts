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
  github_username?: string;
}

export interface UseAuthReturn {
  user: AuthUser | null;
  session: any | null;
  loading: boolean;
  error: Error | null;
  // Auth methods
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGitHub: () => Promise<void>;
  signOut: () => Promise<void>;
}

// ============================================================
// useAuth Hook
// ============================================================

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const user: AuthUser | null = session?.user
    ? {
        id: (session.user as any).id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: (session.user as any).role || "user",
        provider: (session.user as any).provider,
        github_username: (session.user as any).github_username,
      }
    : null;

  // Email/Password login
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

  // Sign up — same as signIn for credentials provider
  const signUp = async (email: string, password: string) => {
    return signIn(email, password);
  };

  // GitHub OAuth login
  const signInWithGitHub = async () => {
    await nextAuthSignIn("github", { callbackUrl: window.location.origin + "/" });
  };

  // Sign out
  const signOut = async () => {
    localStorage.removeItem("aid-hub_favorites");
    await nextAuthSignOut({ callbackUrl: "/" });
  };

  return {
    user,
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
