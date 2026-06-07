import type { Metadata } from "next";
import { Suspense } from "react";
import { getTools, getCategories, getBlogPosts } from "@/lib/supabase";
import { ToolsFilteredGrid } from "@/components/tools/ToolsFilteredGrid";
import { ToolsPageHeader } from "@/components/tools/ToolsPageHeader";
import { KeywordsCloud } from "@/components/tools/KeywordsCloud";
import { getKeywords } from "@/lib/seo";
import { generateSEOMetadata } from "@/lib/seo";
import { Sidebar, RecentPosts, CategoryNav, TagCloud, RecentComments } from "@/components/sidebar";

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: "AI Design Tools Directory",
    description: "Browse and discover the best AI design tools for image generation, video creation, UI/UX design, 3D modeling, and more.",
    keywords: ["AI design tools", "AI image generator", "AI video tools", "UI design AI"],
    canonical: "/tools",
    type: "website",
  });
}

export default async function ToolsPage() {
  const { tools } = await getTools({ limit: 1000 });
  const categories = await getCategories();
  const { posts } = await getBlogPosts({ limit: 1000 });

  // Sidebar data
  const categoryCounts = categories.map((cat) => ({
    name: cat.name,
    count: cat.tool_count,
    slug: cat.slug,
  }));
  const toolTags = Array.from(new Set(tools.flatMap((t) => [...t.tags, ...(t.keywords || [])])));
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );
  const blogTags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  return (
    <div className="min-h-screen bg-dark-950 pt-32 pb-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <ToolsPageHeader toolsCount={tools.length} />
        <KeywordsCloud keywords={getKeywords([], tools.flatMap((t) => [...t.tags, ...(t.keywords || [])]))} />

        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <Suspense fallback={<div className="text-center py-20 text-dark-400">Loading search...</div>}>
              <ToolsFilteredGrid allTools={tools} allCategories={categories} />
            </Suspense>
          </div>

          {/* Sidebar */}
          <Sidebar className="w-full lg:w-80 shrink-0">
            <RecentPosts posts={sortedPosts} />
            <CategoryNav categories={categoryCounts} basePath="/tools" />
            <TagCloud tags={[...toolTags, ...blogTags].slice(0, 25)} />
            <RecentComments />
          </Sidebar>
        </div>
      </div>
    </div>
  );
}
