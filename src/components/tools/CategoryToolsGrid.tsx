"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Tool, Category } from "@/types";

const PER_PAGE = 12;

const iconMap: Record<string, string> = {
  image: "🖼️", video: "🎬", layout: "🎨", sparkles: "✨", box: "📦", zap: "⚡",
};

interface Props {
  category: Category;
  tools: Tool[];
  otherCategories: Category[];
}

export function CategoryToolsGrid({ category, tools, otherCategories }: Props) {
  const [sort, setSort] = useState<"rating" | "newest" | "clicks">("rating");
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    const result = [...tools];
    if (sort === "rating") result.sort((a, b) => b.rating - a.rating);
    if (sort === "newest") result.sort((a, b) => b.id.localeCompare(a.id));
    if (sort === "clicks") result.sort((a, b) => b.clicks - a.clicks);
    return result;
  }, [tools, sort]);

  const total = sorted.length;
  const totalPages = Math.ceil(total / PER_PAGE);
  const paged = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      {/* Sort */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-dark-400 text-sm">Sort by:</span>
        {[
          { value: "rating" as const, label: "Highest Rated" },
          { value: "newest" as const, label: "Newest" },
          { value: "clicks" as const, label: "Most Popular" },
        ].map((opt) => (
          <button key={opt.value} onClick={() => { setSort(opt.value); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${sort === opt.value ? "bg-primary-500/20 text-primary-400" : "text-dark-300 hover:bg-dark-800 hover:dark:text-white text-gray-900"}`}>
            {opt.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {paged.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-dark-400 text-lg">No tools found in this category yet.</p>
          <Link href="/tools" className="inline-block mt-4 text-primary-400 hover:text-primary-300">Browse all tools →</Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paged.map((tool) => (
              <Link key={tool.id} href={`/tool/${tool.slug}`}>
                <Card className="bg-dark-900 border-dark-800 hover:border-primary-500/50 transition-all h-full group">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center text-xl font-bold text-primary-400 shrink-0 group-hover:scale-110 transition-transform">
                        {tool.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold dark:text-white text-gray-900 truncate group-hover:text-primary-400 transition-colors">{tool.name}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-amber-400 text-sm">★</span>
                          <span className="text-sm dark:text-white text-gray-900">{tool.rating.toFixed(1)}</span>
                          <span className="text-xs text-dark-400 ml-1">({tool.review_count})</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs shrink-0">{tool.pricing}</Badge>
                    </div>
                    <p className="text-sm text-dark-400 line-clamp-2">{tool.description}</p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {tool.tags.slice(0, 3).map((tag) => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${p === page ? "bg-primary-500 dark:text-white text-gray-900" : "bg-dark-800 text-dark-300 hover:bg-dark-700 hover:dark:text-white text-gray-900"}`}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Other Categories */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold dark:text-white text-gray-900 mb-6">Explore Other Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {otherCategories.map((cat) => (
            <Link key={cat.id} href={`/category/${cat.slug}`}>
              <Card className="bg-dark-900 border-dark-800 hover:border-primary-500/50 hover:bg-dark-800/50 transition-all text-center group">
                <CardContent className="p-4">
                  <div className="text-2xl mb-2">{iconMap[cat.icon] || "🎯"}</div>
                  <h3 className="text-sm font-medium dark:text-white text-gray-900 group-hover:text-primary-400 transition-colors">{cat.name}</h3>
                  <p className="text-xs text-dark-400 mt-1">{cat.tool_count} tools</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
