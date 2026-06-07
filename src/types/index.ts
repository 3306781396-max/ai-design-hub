export interface FAQ {
  question: string;
  answer: string;
}

export interface PricingPlan {
  name: string;
  price: number;
  currency: string;
  interval: string; // "month" | "year" | "one-time"
  features: string[];
}

export interface PricingDetails {
  free_tier?: string;
  starting_price?: string; // "Free" | "$10/month" | "Contact for pricing"
  paid_plans?: PricingPlan[];
}

export interface Tool {
  id: string;
  slug: string;
  name: string;
  description: string;
  description_long?: string;
  website_url: string;
  affiliate_link?: string;
  category_slug: string;
  category_name: string;
  logo?: string;
  screenshot?: string;
  screenshots?: string[]; // Image carousel URLs
  pricing: "Free" | "Freemium" | "Paid" | "Free Trial" | "Enterprise";
  pricing_details?: PricingDetails;
  rating: number;
  review_count: number;
  clicks: number;
  featured: boolean;
  trending: boolean;
  sponsored: boolean;
  tags: string[];
  pros: string[];
  cons: string[];
  features?: string[];
  use_cases?: string[];
  alternatives?: string[];
  faq?: FAQ[];
  seo_title: string;
  seo_description: string;
  keywords?: string[];
  status?: "draft" | "published";
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  tool_count: number;
  seo_title: string;
  seo_description: string;
  keywords: string[];
  featured: boolean;
  parent_id?: string;
  children?: Category[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  author: string;
  author_avatar?: string;
  category: string;
  tags: string[];
  seo_title: string;
  seo_description: string;
  keywords: string[];
  faq?: FAQ[];
  read_time: number;
  views: number;
  published_at: string;
  updated_at: string;
  featured: boolean;
}

export interface Keyword {
  id: string;
  keyword: string;
  search_volume: number;
  difficulty: number;
  cpc: number;
  intent: string;
  category: string;
}

export interface AdminStats {
  total_tools: number;
  total_blogs: number;
  total_categories: number;
  total_submissions: number;
  pending_submissions: number;
  total_clicks: number;
  total_views: number;
  seo_score: number;
}
