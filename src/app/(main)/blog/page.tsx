import type { Metadata } from "next";
import { getBlogPosts } from "@/lib/supabase";
import { BlogFilteredList } from "@/components/blog/BlogFilteredList";
import { BlogPageHeader } from "@/components/blog/BlogPageHeader";
import { generateSEOMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: "AI Design Blog - Tips, Tutorials & Industry Insights",
    description: "Stay updated with the latest AI design trends, tool comparisons, tutorials, and best practices for creative professionals.",
    keywords: ["AI design blog", "AI tools comparison", "design tips", "AI tutorials", "creative workflow", "design trends"],
    canonical: "/blog",
    type: "website",
  });
}

export default async function BlogPage() {
  const { posts } = await getBlogPosts({ limit: 1000 });
  const categories = Array.from(new Set(posts.map((p) => p.category)));
  const tags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  return (
    <div className="min-h-screen bg-dark-950 pt-32 pb-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <BlogPageHeader title="" subtitle="" />
        <BlogFilteredList posts={posts} categories={categories} tags={tags} />
      </div>
    </div>
  );
}
