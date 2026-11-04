// ============================================================
// Frontend Auth System (Supabase-backed, works in static export)
// ============================================================
// This module wraps Supabase Auth for use in a static Next.js export.
// Supabase client-side SDK communicates directly with supabase.co REST API,
// so no server-side runtime is needed.
// ============================================================

import { supabase, isSupabaseConfigured } from "./supabase";

// ============================================================
// Types
// ============================================================

export interface AuthSession {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: "admin" | "user";
}

// ============================================================
// Admin email — users with this email get admin role
// ============================================================

const ADMIN_EMAIL = "admin@aidesignhub.com";

// ============================================================
// Session helpers
// ============================================================

function supabaseSessionToAuthSession(session: any): AuthSession | null {
  if (!session?.user) return null;
  const user = session.user;
  const email = (user.email || "").toLowerCase();
  const metadata = user.user_metadata || {};
  return {
    id: user.id,
    email,
    name: metadata.full_name || user.email?.split("@")[0] || "User",
    avatar: metadata.avatar_url || "",
    role: email === ADMIN_EMAIL ? "admin" : "user",
  };
}

// Cache session in localStorage for instant initial render
// (avoids loading spinner on every page load)
const SESSION_CACHE_KEY = "aid-hub_session";

function cacheSession(session: AuthSession | null): void {
  if (typeof window === "undefined") return;
  if (session) {
    try {
      localStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(session));
    } catch { /* ignore quota errors */ }
  } else {
    try {
      localStorage.removeItem(SESSION_CACHE_KEY);
    } catch { /* ignore */ }
  }
}

// ============================================================
// Public API — synchronous cache read (fast first render)
// ============================================================

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  cacheSession(null);
}

// Async refresh — validates against Supabase
export async function refreshSession(): Promise<AuthSession | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data } = await supabase!.auth.getSession();
    const authSession = supabaseSessionToAuthSession(data.session);
    cacheSession(authSession);
    return authSession;
  } catch {
    return null;
  }
}

// ============================================================
// Auth Functions
// ============================================================

export async function registerUser(
  email: string,
  password: string,
  name?: string
): Promise<{
  success: boolean;
  error?: string;
  emailConfirmationRequired?: boolean;
}> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: "Authentication service is not configured.",
    };
  }

  if (!email || !password) {
    return { success: false, error: "Email and password are required" };
  }
  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters" };
  }

  const { data, error } = await supabase!.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name || email.split("@")[0] },
    },
  });

  if (error) {
    // Map common errors
    if (error.message.includes("already registered") || error.message.includes("already exists")) {
      return { success: false, error: "An account with this email already exists" };
    }
    return { success: false, error: error.message };
  }

  // If the user has no identities, email confirmation is required
  if (data.user && (!data.user.identities || data.user.identities.length === 0)) {
    return { success: true, emailConfirmationRequired: true };
  }

  // Auto-login (no email confirmation required)
  if (data.session) {
    const authSession = supabaseSessionToAuthSession(data.session);
    cacheSession(authSession);
    notifyAuthChange(authSession);
    return { success: true };
  }

  // Default: confirmation required
  return { success: true, emailConfirmationRequired: true };
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: "Authentication service is not configured.",
    };
  }

  if (!email || !password) {
    return { success: false, error: "Email and password are required" };
  }

  const { data, error } = await supabase!.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Map Supabase errors to user-friendly messages
    const msg = error.message.toLowerCase();
    if (msg.includes("invalid login credentials") || msg.includes("invalid email or password")) {
      return { success: false, error: "Invalid email or password" };
    }
    if (msg.includes("email not confirmed")) {
      return {
        success: false,
        error: "Please confirm your email first. Check your inbox for the confirmation link.",
      };
    }
    return { success: false, error: error.message };
  }

  const authSession = supabaseSessionToAuthSession(data.session);
  cacheSession(authSession);
  notifyAuthChange(authSession);
  return { success: true };
}

export async function logoutUser(): Promise<void> {
  clearSession();
  notifyAuthChange(null);

  // Clear user-specific localStorage data
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("aid-hub_favorites");
    } catch { /* ignore */ }
  }

  // Sign out from Supabase
  if (isSupabaseConfigured()) {
    try {
      await supabase!.auth.signOut();
    } catch { /* silently fail */ }
  }
}

// ============================================================
// Session Change Listener (custom event bus)
// ============================================================

type AuthListener = (session: AuthSession | null) => void;
const listeners: Set<AuthListener> = new Set();

export function onAuthChange(listener: AuthListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyAuthChange(session: AuthSession | null): void {
  listeners.forEach((fn) => fn(session));
}

// ============================================================
// Subscribe to Supabase auth state changes (cross-tab sync)
// ============================================================

if (typeof window !== "undefined" && isSupabaseConfigured()) {
  supabase!.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
      const authSession = supabaseSessionToAuthSession(session);
      cacheSession(authSession);
      notifyAuthChange(authSession);
    } else if (event === "SIGNED_OUT") {
      cacheSession(null);
      notifyAuthChange(null);
    }
  });

  // Initial refresh to validate cached session
  refreshSession().then((session) => {
    if (session) notifyAuthChange(session);
  });
}
