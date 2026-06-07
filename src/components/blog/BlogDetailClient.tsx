"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import FAQSection from "@/components/seo/FAQSection";
import { FAQSchema } from "@/components/seo/JsonLd";
import type { BlogPost, FAQ } from "@/types";
import { Calendar, Clock, Eye, User, ArrowLeft } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

interface Props {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export default function BlogDetailClient({ post, relatedPosts }: Props) {
  const { t } = useTranslation();

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <FAQSchema faqs={post.faq || []} />
      <div className="min-h-screen bg-dark-950 pt-32 pb-16 px-4">
        <article className="container mx-auto max-w-4xl">
          <Breadcrumb
            items={[
              { label: "Blog", href: "/blog" },
              { label: post.title },
            ]}
          />

          <header className="mb-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm text-dark-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("blog.back_to_blog")}
            </Link>

            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">{post.category}</Badge>
              {post.featured && (
                <Badge className="bg-amber-500/90 text-white border-0">
                  {t("blog.featured")}
                </Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            <p className="text-dark-300 text-lg mb-6">{post.description}</p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-dark-400">
              <Link
                href={`/author/${encodeURIComponent(post.author).replace(/%20/g, "+")}`}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500/30 to-accent-500/30 flex items-center justify-center text-white font-semibold overflow-hidden">
                  {post.author_avatar ? (
                    <img src={post.author_avatar} alt={post.author} className="h-full w-full object-cover" />
                  ) : (
                    post.author.charAt(0)
                  )}
                </div>
                <div>
                  <p className="text-white font-medium">{post.author}</p>
                  <p className="text-xs text-dark-400">{t("blog.author_label")}</p>
                </div>
              </Link>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(post.published_at)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.read_time} {t("blog.min_read")}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {post.views.toLocaleString()} {t("blog.views_label")}
              </div>
            </div>
          </header>

          <div className="prose prose-invert prose-lg max-w-none mb-12">
            {post.content.split("\n\n").map((paragraph, i) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;

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

          {post.faq && post.faq.length > 0 && (
            <div className="mb-12">
              <FAQSection
                title={t("blog.faq_title")}
                faqs={post.faq}
              />
            </div>
          )}

          {relatedPosts.filter((p) => p.id !== post.id).length > 0 && (
            <div className="pt-12 border-t border-dark-800">
              <h2 className="text-2xl font-bold text-white mb-8">
                {t("blog.related_articles")}
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
