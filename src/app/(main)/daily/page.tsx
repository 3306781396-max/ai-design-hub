import type { Metadata } from "next";
import { getBlogPosts } from "@/lib/supabase";
import { BlogFilteredList } from "@/components/blog/BlogFilteredList";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { generateSEOMetadata } from "@/lib/seo";
import { toBlogMini } from "@/lib/blog-mini";
import { Sidebar, RecentPosts, CategoryNav, TagCloud, RecentComments } from "@/components/sidebar";

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: "AI 日报 - 每日 AI 设计资讯 | AI Design Hub",
    description: "AI Design Hub 每日自动更新的 AI 设计领域新闻速览，涵盖新工具发布、行业动态、技术趋势。每天一篇，保持行业敏感度。",
    keywords: ["AI 日报", "AI 设计新闻", "AI 设计动态", "AI 工具更新", "每日 AI 资讯", "AI design daily"],
    canonical: "/daily",
    type: "website",
  });
}

export default async function DailyPage() {
  // 筛选 category 为 "AI 日报" 的文章
  const { posts } = await getBlogPosts({ category: "AI 日报", limit: 100 });

  const sortedByDate = [...posts].sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );

  const tags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  return (
    <div className="min-h-screen bg-dark-950 pt-32 pb-16 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <Breadcrumb items={[{ label: "AI 日报", href: "/daily" }]} />
          <div className="mt-4">
            <h1 className="text-4xl font-bold text-white mb-3 flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </span>
              AI 日报
            </h1>
            <p className="text-dark-400 text-lg max-w-2xl">
              每日自动更新的 AI 设计领域新闻速览。涵盖新工具发布、行业动态、技术趋势，每天一篇，保持行业敏感度。
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            {posts.length === 0 ? (
              <div className="bg-dark-900/50 rounded-2xl border border-dark-800 p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-dark-800 flex items-center justify-center">
                  <svg className="w-8 h-8 text-dark-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-dark-300 mb-2">即将上线</h3>
                <p className="text-dark-500">AI 日报栏目正在准备中，第一篇文章即将自动发布，请稍后再来。</p>
              </div>
            ) : (
              <BlogFilteredList posts={posts} categories={["AI 日报"]} tags={tags} />
            )}
          </div>

          <Sidebar className="w-full lg:w-80 shrink-0">
            <RecentPosts posts={toBlogMini(sortedByDate)} />
            <CategoryNav categories={[{ name: "AI 日报", count: posts.length, slug: "ai-日报" }]} />
            <TagCloud tags={tags} />
            <RecentComments />
          </Sidebar>
        </div>
      </div>
    </div>
  );
}
