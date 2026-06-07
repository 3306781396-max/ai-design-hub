import type { Metadata } from "next";
import { getBlogPosts } from "@/lib/supabase";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { generateSEOMetadata } from "@/lib/seo";
import { Sidebar, RecentPosts, CategoryNav, TagCloud, RecentComments } from "@/components/sidebar";
import { BlogArchiveClient } from "@/components/blog/BlogArchiveClient";

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: "Blog Archive - AI Design Hub",
    description: "Browse all our AI design blog posts organized by month and year. Find tutorials, comparisons, and industry insights.",
    keywords: ["AI design blog archive", "design tutorials archive", "AI tools articles"],
    canonical: "/blog/archive",
    type: "website",
  });
}

export default async function BlogArchivePage() {
  const { posts } = await getBlogPosts({ limit: 1000 });

  // Group posts by year and month
  const archive: Record<string, Record<string, typeof posts>> = {};

  posts.forEach((post) => {
    const date = new Date(post.published_at);
    const year = date.getFullYear().toString();
    const month = date.toLocaleString("en-US", { month: "long" });

    if (!archive[year]) archive[year] = {};
    if (!archive[year][month]) archive[year][month] = [];
    archive[year][month].push(post);
  });

  // Sort years descending
  const sortedYears = Object.keys(archive).sort((a, b) => Number(b) - Number(a));

  const monthOrder = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  // Sidebar data
  const categories = Array.from(new Set(posts.map((p) => p.category)));
  const categoryCounts = categories.map((name) => ({
    name,
    count: posts.filter((p) => p.category === name).length,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
  }));
  const tags = Array.from(new Set(posts.flatMap((p) => p.tags)));
  const sortedByDate = [...posts].sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );

  return (
    <div className="min-h-screen bg-dark-950 pt-32 pb-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <Breadcrumb
          items={[
            { label: "Blog", href: "/blog" },
            { label: "Archive" },
          ]}
        />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-white mb-2">Blog Archive</h1>
            <p className="text-dark-400 mb-8">
              Browse all {posts.length} articles organized by date.
            </p>
            <BlogArchiveClient
              archive={archive}
              sortedYears={sortedYears}
              monthOrder={monthOrder}
            />
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
