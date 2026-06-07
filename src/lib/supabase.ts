import { createClient } from "@supabase/supabase-js";
import { logError } from "./logger";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only create the client when real credentials are provided (not placeholder values)
function isConfigured(): boolean {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  if (supabaseUrl.includes("placeholder") || supabaseUrl.includes("your-project")) return false;
  if (supabaseAnonKey.includes("placeholder") || supabaseAnonKey.includes("your-anon")) return false;
  return true;
}

export const supabase = isConfigured()
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

export function isSupabaseConfigured(): boolean {
  return supabase !== null;
}

export async function getTools(options?: {
  category?: string;
  featured?: boolean;
  trending?: boolean;
  sponsored?: boolean;
  limit?: number;
  offset?: number;
  search?: string;
  sort?: "rating" | "newest" | "clicks";
}) {
  // For demo/build purposes, return mock data
  const { tools, categories } = await import("@/data/mock");
  
  let filtered = [...tools];
  
  if (options?.category) {
    filtered = filtered.filter((t) => t.category_slug === options.category);
  }
  if (options?.featured) {
    filtered = filtered.filter((t) => t.featured);
  }
  if (options?.trending) {
    filtered = filtered.filter((t) => t.trending);
  }
  if (options?.sponsored) {
    filtered = filtered.filter((t) => t.sponsored);
  }
  if (options?.search) {
    const q = options.search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }
  if (options?.sort) {
    switch (options.sort) {
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "clicks":
        filtered.sort((a, b) => b.clicks - a.clicks);
        break;
    }
  }

  const offset = options?.offset || 0;
  const limit = options?.limit || 20;
  
  return {
    tools: filtered.slice(offset, offset + limit),
    total: filtered.length,
  };
}

export async function getToolBySlug(slug: string) {
  const { tools } = await import("@/data/mock");
  return tools.find((t) => t.slug === slug) || null;
}

export async function getCategories() {
  const { categories } = await import("@/data/mock");
  return categories;
}

export async function getCategoryBySlug(slug: string) {
  const { categories } = await import("@/data/mock");
  return categories.find((c) => c.slug === slug) || null;
}

export async function getBlogPosts(options?: {
  limit?: number;
  offset?: number;
  category?: string;
  tag?: string;
}) {
  const { blogPosts } = await import("@/data/mock");
  let filtered = [...blogPosts];

  if (options?.category) {
    filtered = filtered.filter((b) => b.category === options.category);
  }
  if (options?.tag) {
    filtered = filtered.filter((b) => b.tags.includes(options.tag!));
  }

  const offset = options?.offset || 0;
  const limit = options?.limit || 10;
  
  return {
    posts: filtered.slice(offset, offset + limit),
    total: filtered.length,
  };
}

export async function getBlogPostBySlug(slug: string) {
  const { blogPosts } = await import("@/data/mock");
  return blogPosts.find((b) => b.slug === slug) || null;
}

export async function getKeywords() {
  const { keywords } = await import("@/data/mock");
  return keywords;
}

export async function getAdminStats(): Promise<import("@/types").AdminStats> {
  const { tools, blogPosts, categories } = await import("@/data/mock");
  const totalClicks = tools.reduce((sum, t) => sum + t.clicks, 0);
  const totalViews = blogPosts.reduce((sum, b) => sum + b.views, 0);
  
  return {
    total_tools: tools.length,
    total_blogs: blogPosts.length,
    total_categories: categories.length,
    total_submissions: 8,
    pending_submissions: 3,
    total_clicks: totalClicks,
    total_views: totalViews,
    seo_score: 87,
  };
}

// ============================================================
// Auth Helpers
// ============================================================

export async function signUp(email: string, password: string, metadata?: { full_name?: string }) {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signInWithOAuth(provider: "google" | "github") {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`,
    },
  });
  return { data, error };
}

export async function signOut() {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getSession() {
  if (!supabase) return null;
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) return null;
  return session;
}

export function onAuthStateChange(callback: (event: string, session: any) => void) {
  if (!supabase) return { data: { subscription: null } };
  return supabase.auth.onAuthStateChange(callback);
}

// ============================================================
// User Profile
// ============================================================

export async function getProfile(userId: string) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) return null;
  return data;
}

export async function updateProfile(userId: string, updates: {
  full_name?: string;
  username?: string;
  avatar_url?: string;
  website?: string;
  bio?: string;
}) {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();
  return { data, error };
}

// ============================================================
// Favorites
// ============================================================

export async function getFavorites(userId: string): Promise<string[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("favorites")
    .select("tool_id")
    .eq("user_id", userId);
  if (error || !data) return [];
  return data.map((row: any) => row.tool_id);
}

export async function toggleFavorite(userId: string, toolId: string): Promise<boolean> {
  if (!supabase) throw new Error("Supabase client not initialized");
  
  // Check if already favorited
  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("tool_id", toolId)
    .maybeSingle();
  
  if (existing) {
    // Remove
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", userId)
      .eq("tool_id", toolId);
    if (error) throw error;
    return false; // removed
  } else {
    // Add
    const { error } = await supabase
      .from("favorites")
      .insert({ user_id: userId, tool_id: toolId });
    if (error) throw error;
    return true; // added
  }
}

export async function isFavorited(userId: string, toolId: string): Promise<boolean> {
  if (!supabase) return false;
  const { data } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("tool_id", toolId)
    .maybeSingle();
  return !!data;
}

export async function clearAllFavorites(userId: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId);
  if (error) throw error;
}

// ============================================================
// Reviews
// ============================================================

export interface Review {
  id: string;
  user_id: string;
  tool_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
    username: string | null;
  } | null;
}

export async function getReviews(toolId: string): Promise<Review[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("reviews")
    .select(`
      *,
      profiles:user_id (
        full_name,
        avatar_url
      )
    `)
    .eq("tool_id", toolId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data as Review[];
}

export async function upsertReview(userId: string, toolId: string, rating: number, comment?: string) {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data, error } = await supabase
    .from("reviews")
    .upsert({
      user_id: userId,
      tool_id: toolId,
      rating,
      comment: comment || null,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: "user_id,tool_id",
    })
    .select()
    .single();
  return { data, error };
}

export async function deleteReview(reviewId: string, userId: string) {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId)
    .eq("user_id", userId);
  return { error };
}

export async function getUserReviews(userId: string): Promise<Review[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) {
    logError("Failed to fetch user reviews", error);
    return [];
  }
  return data as Review[];
}

// ============================================================
// Password Reset
// ============================================================

export async function resetPasswordForEmail(email: string): Promise<{ success: boolean; message: string }> {
  if (!supabase) {
    return { success: false, message: "Supabase not configured" };
  }
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/reset-password`,
    });
    if (error) throw error;
    return { success: true, message: "Password reset email sent" };
  } catch (err: any) {
    logError("Password reset error", err);
    return { success: false, message: err.message || "Password reset failed" };
  }
}

export async function updatePassword(newPassword: string): Promise<{ success: boolean; message: string }> {
  if (!supabase) {
    return { success: false, message: "Supabase not configured" };
  }
  try {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
    return { success: true, message: "Password updated successfully" };
  } catch (err: any) {
    logError("Update password error", err);
    return { success: false, message: err.message || "Password update failed" };
  }
}

// ============================================================
// Tool Views Tracking
// ============================================================

export async function incrementToolViews(toolId: string, toolSlug: string): Promise<void> {
  if (!supabase) return;
  try {
    // Try to insert a view record; if it fails due to RLS, that's ok (function may not exist)
    await supabase
      .from("tool_views")
      .insert({ tool_id: toolId, viewed_at: new Date().toISOString() });
  } catch {
    // Silently fail - view tracking is non-critical
  }
}

// ============================================================
// Newsletter Subscribers
// ============================================================

export interface NewsletterSubscriber {
  id?: string;
  email: string;
  name?: string;
  locale: string;
  subscribed_at?: string;
  status: "active" | "unsubscribed";
}

export async function subscribeToNewsletter(
  email: string,
  name?: string,
  locale: string = "zh"
): Promise<{ success: boolean; message: string }> {
  if (!supabase) {
    return { success: false, message: "Supabase not configured" };
  }

  try {
    // Check if already subscribed
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, status")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      if (existing.status === "unsubscribed") {
        // Re-subscribe
        const { error } = await supabase
          .from("newsletter_subscribers")
          .update({ status: "active", subscribed_at: new Date().toISOString() })
          .eq("id", existing.id);
        if (error) throw error;
        return { success: true, message: "re-subscribed" };
      }
      return { success: true, message: "already-subscribed" };
    }

    // New subscription
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email,
        name: name || null,
        locale,
        subscribed_at: new Date().toISOString(),
        status: "active",
      });

    if (error) throw error;
    return { success: true, message: "subscribed" };
  } catch (err: any) {
    logError("Newsletter subscription error", err);
    return { success: false, message: err.message || "Subscription failed" };
  }
}

export async function getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .eq("status", "active")
    .order("subscribed_at", { ascending: false });
  if (error) return [];
  return data as NewsletterSubscriber[];
}


