import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPosts } from "@/lib/supabase";
import { generateSEOMetadata } from "@/lib/seo";
import { Sidebar, RecentPosts, CategoryNav, TagCloud, RecentComments } from "@/components/sidebar";

interface Props {
  params: Promise<{ name: string }>;
}

function decodeAuthorName(encoded: string): string {
  // Handle both "Sarah+Chen" and "sarah-chen" formats
  return decodeURIComponent(encoded).replace(/-/g, " ");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const decodedName = decodeAuthorName(name);
  return generateSEOMetadata({
    title: `${decodedName} - Author Archive | AI Design Hub`,
    description: `All blog posts by ${decodedName} on AI design tools, tutorials, and industry insights.`,
    canonical: `/author/${name}`,
    type: "article",
  });
}

export async function generateStaticParams() {
  const { posts } = await getBlogPosts({ limit: 1000 });
  const authors = Array.from(new Set(posts.map((p) => p.author)));
  return authors.map((author) => ({
    name: author.replace(/\s+/g, "+"),
  }));
}

export default async function AuthorPage({ params }: Props) {
  const { name } = await params;
  const decodedName = decodeAuthorName(name);

  const { posts } = await getBlogPosts({ limit: 1000 });
  const authorPosts = posts.filter(
    (p) => p.author.toLowerCase() === decodedName.toLowerCase()
  );

  if (authorPosts.length === 0) notFound();

  // Get unique categories and tags from author's posts
  const categoryCounts = Array.from(new Set(authorPosts.map((p) => p.category))).map((name) => ({
    name,
    count: authorPosts.filter((p) => p.category === name).length,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
  }));
  const tags = Array.from(new Set(authorPosts.flatMap((p) => p.tags)));

  // All posts for sidebar
  const allPosts = posts.sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );

  const firstPost = authorPosts[0];
  const authorAvatar = firstPost?.author_avatar || "";
  const totalViews = authorPosts.reduce((sum, p) => sum + p.views, 0);

  return (
    <div className="min-h-screen bg-dark-950 pt-32 pb-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Author Header */}
            <div className="flex items-center gap-5 mb-10 pb-8 border-b border-dark-800">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white text-xl font-bold shrink-0 overflow-hidden">
                {authorAvatar ? (
                  <img src={authorAvatar} alt={decodedName} className="h-full w-full object-cover" />
                ) : (
                  decodedName.charAt(0)
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{decodedName}</h1>
                <p className="text-dark-400 text-sm mt-1">
                  {authorPosts.length} {authorPosts.length === 1 ? "post" : "posts"}
                  {" · "}
                  {totalViews.toLocaleString()} views
                </p>
              </div>
            </div>

            {/* Author's Posts */}
            <div className="space-y-6">
              {authorPosts
                .sort(
                  (a, b) =>
                    new Date(b.published_at).getTime() -
                    new Date(a.published_at).getTime()
                )
                .map((post) => (
                  <a
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group block p-5 rounded-xl border border-dark-800 bg-dark-900/50 hover:bg-dark-800/50 hover:border-dark-700 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-dark-500">
                        {new Date(post.published_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="text-dark-600">·</span>
                      <span className="text-xs text-dark-400">{post.category}</span>
                      {post.featured && (
                        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-400 border border-primary-500/30">
                          Featured
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-dark-400 mt-2 line-clamp-2">
                      {post.description}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-xs text-dark-500">
                        {post.views.toLocaleString()} views
                      </span>
                      <span className="text-dark-600">·</span>
                      <span className="text-xs text-dark-500">
                        {post.read_time} min read
                      </span>
                    </div>
                  </a>
                ))}
            </div>
          </div>

          {/* Sidebar */}
          <Sidebar className="w-full lg:w-80 shrink-0">
            <RecentPosts posts={allPosts} />
            <CategoryNav categories={categoryCounts} />
            <TagCloud tags={tags} />
            <RecentComments />
          </Sidebar>
        </div>
      </div>
    </div>
  );
}
