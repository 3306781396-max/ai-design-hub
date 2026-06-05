"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useTranslation } from "@/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User } from "lucide-react";
import type { BlogPost } from "@/types";

const PER_PAGE = 9;

function fmtDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

interface Props {
  posts: BlogPost[];
  categories: string[];
  tags: string[];
}

export function BlogFilteredList({ posts, categories, tags }: Props) {
  const { t } = useTranslation();
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...posts];
    if (category) result = result.filter((p) => p.category === category);
    if (tag) result = result.filter((p) => p.tags.includes(tag));
    return result;
  }, [posts, category, tag]);

  const total = filtered.length;
  const totalPages = Math.ceil(total / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function changeCategory(cat: string) { setCategory(cat); setPage(1); }
  function changeTag(t: string) { setTag(t); setPage(1); }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar */}
      <aside className="lg:w-64 shrink-0 order-2 lg:order-1">
        <div className="sticky top-24 space-y-6">
          <div>
            <h3 className="dark:text-white text-gray-900 font-semibold mb-3">{t("blog.sidebar.categories")}</h3>
            <div className="space-y-1">
              <button onClick={() => changeCategory("")} className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${!category ? "bg-primary-500/20 text-primary-400" : "text-dark-300 hover:bg-dark-800 hover:dark:text-white text-gray-900"}`}>
                {t("blog.sidebar.all_posts")}
              </button>
              {categories.map((cat) => (
                <button key={cat} onClick={() => changeCategory(cat)} className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${category === cat ? "bg-primary-500/20 text-primary-400" : "text-dark-300 hover:bg-dark-800 hover:dark:text-white text-gray-900"}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="dark:text-white text-gray-900 font-semibold mb-3">{t("blog.sidebar.tags")}</h3>
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 20).map((t) => (
                <button key={t} onClick={() => changeTag(tag === t ? "" : t)}>
                  <Badge variant={tag === t ? "default" : "outline"} className="text-xs cursor-pointer hover:bg-dark-600 transition-colors">
                    {t}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Grid */}
      <div className="flex-1 order-1 lg:order-2">
        {paged.length === 0 ? (
          <div className="text-center py-20"><p className="text-dark-400 text-lg">{t("blog.empty")}</p></div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paged.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="bg-dark-900 border-dark-800 hover:border-primary-500/50 transition-all h-full group overflow-hidden">
                    <CardContent className="p-5">
                      <div className="mb-3"><Badge variant="secondary" className="text-xs">{post.category}</Badge></div>
                      <h3 className="font-semibold dark:text-white text-gray-900 text-lg mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">{post.title}</h3>
                      <p className="text-sm text-dark-400 line-clamp-2 mb-4">{post.description}</p>
                      <div className="flex items-center gap-4 text-xs text-dark-400 mt-auto">
                        <span className="flex items-center gap-1"><User className="h-3 w-3" />{post.author}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{fmtDate(post.published_at)}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.read_time} {t("blog.min")}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-dark-800">
                        {post.tags.slice(0, 3).map((t) => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)} className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${p === page ? "bg-primary-500 dark:text-white text-gray-900" : "bg-dark-800 text-dark-300 hover:bg-dark-700 hover:dark:text-white text-gray-900"}`}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
