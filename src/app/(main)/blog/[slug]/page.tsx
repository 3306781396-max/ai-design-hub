import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/supabase";
import { generateSEOMetadata } from "@/lib/seo";
import FAQSection from "@/components/seo/FAQSection";
import { FAQSchema } from "@/components/seo/JsonLd";
import type { BlogPost, FAQ } from "@/types";
import { Calendar, Clock, Eye, User, ArrowLeft } from "lucide-react";

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

  const { posts: relatedPosts } = await getBlogPosts({
    limit: 3,
  });

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
      <FAQSchema faqs={post.faq || []} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="min-h-screen bg-dark-950 pt-32 pb-16 px-4">
        <article className="container mx-auto max-w-4xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-dark-400 mb-8">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white transition-colors">
              Blog
            </Link>
            <span>/</span>
            <span className="text-white truncate max-w-[200px]">
              {post.title}
            </span>
          </nav>

          {/* Article Header */}
          <header className="mb-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm text-dark-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>

            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">{post.category}</Badge>
              {post.featured && (
                <Badge className="bg-amber-500/90 text-white border-0">
                  Featured
                </Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            <p className="text-dark-300 text-lg mb-6">
              {post.description}
            </p>

            {/* Author & Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-dark-400">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500/30 to-accent-500/30 flex items-center justify-center text-white font-semibold">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-medium">{post.author}</p>
                  <p className="text-xs text-dark-400">Author</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(post.published_at)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.read_time} min read
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {post.views.toLocaleString()} views
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-invert prose-lg max-w-none mb-12">
            {/* Split content into paragraphs */}
            {post.content.split("\n\n").map((paragraph, i) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;

              // Check for headings (## Heading)
              if (trimmed.startsWith("## ")) {
                return (
                  <h2 key={i} className="text-2xl font-bold text-white mt-10 mb-4">
                    {trimmed.replace("## ", "")}
                  </h2>
                );
              }
              if (trimmed.startsWith("### ")) {
                return (
                  <h3 key={i} className="text-xl font-semibold text-white mt-8 mb-3">
                    {trimmed.replace("### ", "")}
                  </h3>
                );
              }

              // Check for lists
              if (trimmed.startsWith("- ")) {
                const items = trimmed.split("\n").filter(Boolean);
                return (
                  <ul key={i} className="list-disc list-inside space-y-1 text-dark-300 my-4">
                    {items.map((item, j) => (
                      <li key={j}>{item.replace("- ", "")}</li>
                    ))}
                  </ul>
                );
              }
              if (trimmed.match(/^\d+\.\s/)) {
                const items = trimmed.split("\n").filter(Boolean);
                return (
                  <ol key={i} className="list-decimal list-inside space-y-1 text-dark-300 my-4">
                    {items.map((item, j) => (
                      <li key={j}>{item.replace(/^\d+\.\s/, "")}</li>
                    ))}
                  </ol>
                );
              }

              return (
                <p key={i} className="text-dark-300 leading-relaxed mb-4">
                  {trimmed}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-12 pt-8 border-t border-dark-800">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-dark-700 transition-colors"
                >
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>

          {/* FAQ Section */}
          {post.faq && post.faq.length > 0 && (
            <Card className="bg-dark-900 border-dark-800 mb-12">
              <CardHeader>
                <h2 className="text-xl font-semibold text-white">
                  Frequently Asked Questions
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {post.faq.map((faq: FAQ, i: number) => (
                    <details
                      key={i}
                      className="group rounded-lg border border-dark-800 p-4"
                    >
                      <summary className="flex items-center justify-between cursor-pointer text-white font-medium">
                        {faq.question}
                        <span className="transition group-open:rotate-180 ml-2 shrink-0">
                          ▼
                        </span>
                      </summary>
                      <p className="mt-3 text-dark-300">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Related Posts */}
          {relatedPosts.filter((p) => p.id !== post.id).length > 0 && (
            <div className="pt-12 border-t border-dark-800">
              <h2 className="text-2xl font-bold text-white mb-8">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts
                  .filter((p) => p.id !== post.id)
                  .slice(0, 3)
                  .map((related) => (
                    <Link key={related.id} href={`/blog/${related.slug}`}>
                      <Card className="bg-dark-900 border-dark-800 hover:border-primary-500/50 transition-all h-full group">
                        <CardContent className="p-5">
                          <Badge variant="secondary" className="text-xs mb-3">
                            {related.category}
                          </Badge>
                          <h3 className="font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
                            {related.title}
                          </h3>
                          <p className="text-sm text-dark-400 line-clamp-2 mb-3">
                            {related.description}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-dark-400">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {related.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {related.read_time} min
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </>
  );
}
