import type { Tool, Category, BlogPost, Keyword } from "@/types";

// ============================================================
// Categories (6)
// ============================================================

export const categories: Category[] = [
  {
    id: "cat-img",
    slug: "ai-image-tools",
    name: "AI Image Tools",
    description: "Discover the best AI image generation and editing tools.",
    icon: "image",
    tool_count: 1,
    seo_title: "Best AI Image Tools",
    seo_description: "AI image generators and editors.",
    keywords: ["AI image", "text-to-image"],
    featured: true,
  },
  {
    id: "cat-video",
    slug: "ai-video-tools",
    name: "AI Video Tools",
    description: "Create professional videos with AI.",
    icon: "video",
    tool_count: 0,
    seo_title: "Best AI Video Tools",
    seo_description: "AI video generation and editing.",
    keywords: ["AI video", "text-to-video"],
    featured: true,
  },
  {
    id: "cat-ui",
    slug: "ai-ui-tools",
    name: "AI UI/UX Tools",
    description: "Design interfaces faster with AI.",
    icon: "layout",
    tool_count: 0,
    seo_title: "Best AI UI Tools",
    seo_description: "AI-powered UI design tools.",
    keywords: ["AI UI", "design to code"],
    featured: true,
  },
  {
    id: "cat-anim",
    slug: "ai-animation-tools",
    name: "AI Animation Tools",
    description: "Create animations with AI.",
    icon: "sparkles",
    tool_count: 0,
    seo_title: "Best AI Animation Tools",
    seo_description: "AI animation generation tools.",
    keywords: ["AI animation", "motion capture"],
    featured: false,
  },
  {
    id: "cat-3d",
    slug: "ai-3d-tools",
    name: "AI 3D Tools",
    description: "Generate 3D models with AI.",
    icon: "box",
    tool_count: 0,
    seo_title: "Best AI 3D Tools",
    seo_description: "AI 3D model generation.",
    keywords: ["AI 3D", "text-to-3d"],
    featured: false,
  },
  {
    id: "cat-prod",
    slug: "ai-productivity-tools",
    name: "AI Productivity Tools",
    description: "Boost productivity with AI.",
    icon: "zap",
    tool_count: 0,
    seo_title: "Best AI Productivity Tools",
    seo_description: "AI productivity and writing tools.",
    keywords: ["AI productivity", "AI writing"],
    featured: false,
  },
];

// ============================================================
// Tools (minimal - 1 tool)
// ============================================================

export const tools: Tool[] = [
  {
    id: "tool-001",
    slug: "dall-e-3",
    name: "DALL-E 3",
    description: "OpenAI's most advanced text-to-image model, built natively into ChatGPT. Generate highly detailed, contextually aware images from natural language prompts.",
    website_url: "https://openai.com/dall-e-3",
    affiliate_link: "",
    category_slug: "ai-image-tools",
    category_name: "AI Image Tools",
    tags: ["text-to-image", "image-generation", "AI-art", "ChatGPT"],
    pricing: "Paid",
    rating: 4.8,
    review_count: 12500,
    clicks: 45800,
    featured: true,
    trending: true,
    sponsored: false,
    logo: "/images/tool-placeholder.png",
    screenshot: "/images/tool-placeholder.png",
    features: ["Text-to-image generation", "Inpainting support", "ChatGPT integration"],
    use_cases: ["Concept art", "Illustration", "Social media graphics"],
    pros: ["High quality output", "Easy to use", "ChatGPT integration"],
    cons: ["Limited free tier", "Steep learning curve"],
    faq: [
      {
        question: "How do I access DALL-E 3?",
        answer: "DALL-E 3 is available through ChatGPT Plus and API access.",
      },
    ],
    seo_title: "DALL-E 3 - Best AI Image Generator 2025",
    seo_description: "Discover DALL-E 3, OpenAI's advanced AI image generator. Create stunning visuals from text prompts.",
    keywords: ["DALL-E 3", "AI image generator", "OpenAI"],
    status: "published",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
];

// ============================================================
// Blog Posts (minimal - 1 post)
// ============================================================

export const blogPosts: BlogPost[] = [
  {
    id: "post-001",
    slug: "best-ai-image-generators-2025",
    title: "Best AI Image Generators in 2025",
    description: "Discover the best AI image generators available in 2025, including DALL-E 3, Midjourney, and more.",
    content: "AI image generation has transformed creative workflows. In this comprehensive guide, we explore the top AI image generators in 2025...",
    seo_title: "Best AI Image Generators 2025 - Top Tools Reviewed",
    seo_description: "Discover the best AI image generators in 2025.",
    keywords: ["AI image generator", "DALL-E 3", "Midjourney"],
    category: "AI Image Tools",
    tags: ["image generation", "AI art"],
    author: "AI Design Hub",
    author_avatar: "/images/tool-placeholder.png",
    read_time: 12,
    views: 12500,
    published_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
    featured: true,
    faq: [],
  },
];

// ============================================================
// Keywords (minimal)
// ============================================================

export const keywords: Keyword[] = [
  { id: "kw-001", keyword: "AI image generator", search_volume: 12000, difficulty: 65, cpc: 2.5, intent: "commercial", category: "AI Image Tools" },
];
