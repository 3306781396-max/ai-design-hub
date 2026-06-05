import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

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
