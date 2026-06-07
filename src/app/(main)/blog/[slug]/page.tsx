import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/supabase";
import { generateSEOMetadata } from "@/lib/seo";
import BlogDetailClient from "@/components/blog/BlogDetailClient";
import { Sidebar, RecentPosts, CategoryNav, TagCloud, RecentComments } from "@/components/sidebar";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};

  return generateSEOMetadata({
    title: post.seo_title || post.title,
    description: post.seo_description || post.description,
    keywords: post.keywords,
    ogImage: post.author_avatar || "/og-image.png",
    canonical: `/blog/${post.slug}`,
    type: "article",
  });
}

export async function generateStaticParams() {
  const { posts } = await getBlogPosts({ limit: 100 });
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const { posts: allPosts } = await getBlogPosts({ limit: 1000 });
  const relatedPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 3);

  // Sidebar data
  const categories = Array.from(new Set(allPosts.map((p) => p.category)));
  const categoryCounts = categories.map((name) => ({
    name,
    count: allPosts.filter((p) => p.category === name).length,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
  }));
  const tags = Array.from(new Set(allPosts.flatMap((p) => p.tags)));
  const sortedByDate = [...allPosts].sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    author: {
      "@type": "Person",
      name: post.author,
    },
    datePublished: post.published_at,
    dateModified: post.updated_at,
    keywords: post.keywords?.join(", ") || post.tags.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="min-h-screen bg-dark-950 pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <BlogDetailClient post={post} relatedPosts={relatedPosts} />
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
    </>
  );
}
