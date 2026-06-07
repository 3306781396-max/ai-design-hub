import type { Metadata } from "next";
import { getBlogPosts } from "@/lib/supabase";
import { BlogFilteredList } from "@/components/blog/BlogFilteredList";
import { BlogPageHeader } from "@/components/blog/BlogPageHeader";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { generateSEOMetadata } from "@/lib/seo";
import { Sidebar, RecentPosts, CategoryNav, TagCloud, RecentComments } from "@/components/sidebar";

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

  // Build category counts for sidebar
  const categoryCounts = categories.map((name) => ({
    name,
    count: posts.filter((p) => p.category === name).length,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
  }));

  const tags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  // Sort posts by date (newest first) for sidebar recent posts
  const sortedByDate = [...posts].sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );

  return (
    <div className="min-h-screen bg-dark-950 pt-32 pb-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-4 mb-12">
          <div>
            <Breadcrumb items={[{ label: "Blog" }]} />
            <BlogPageHeader title="" subtitle="" />
          </div>
          <a
            href="/blog/archive"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-dark-400 hover:text-primary-400 transition-colors shrink-0 pb-1"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Archive
          </a>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <BlogFilteredList posts={posts} categories={categories} tags={tags} />
          </div>

          {/* Sidebar */}
          <Sidebar className="w-full lg:w-80 shrink-0">
            <RecentPosts posts={sortedByDate} />
            <CategoryNav categories={categoryCounts} />
            <TagCloud tags={tags} />
            <RecentComments />
          </Sidebar>
        </div>
      </div>
    </div>
  );
}
