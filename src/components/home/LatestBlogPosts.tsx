"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/i18n";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { getBlogPosts } from "@/lib/supabase";
import type { BlogPost } from "@/types";

export function LatestBlogPosts() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    getBlogPosts({ limit: 6 }).then(({ posts }) => setPosts(posts));
  }, []);

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="kicker mb-4">
              <span>{t("home.blog_preview.title")}</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-semibold text-white">
              {t("home.blog_preview.subtitle")}
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/45 transition-colors hover:text-white"
          >
            {t("common.view_all")} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <Card className="overflow-hidden bg-[#0e0e10] border-white/[0.07] card-hover h-full flex flex-col">
                <div className="h-40 bg-[#101013] border-b border-white/[0.05] flex items-center justify-center">
                  <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center">
                    <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </div>
                </div>
                <CardContent className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-3 text-xs text-white/35">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.published_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.read_time} {t("common.min_read")}
                    </span>
                  </div>
                  <h3 className="font-display font-medium text-white group-hover:text-white/80 transition-colors mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-white/45 line-clamp-2 mb-4 flex-1">
                    {post.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-white/50">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
