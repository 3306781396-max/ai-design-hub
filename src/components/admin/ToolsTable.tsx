"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Tool } from "@/types";

const PAGE_SIZE = 10;

function fmtDate(iso: string) {
  const d = new Date(iso);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

interface Props {
  tools: Tool[];
}

export function AdminToolsTable({ tools }: Props) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sort, setSort] = useState<"newest" | "rating" | "popular">("newest");
  const [page, setPage] = useState(1);

  const categories = useMemo(() => {
    const set = new Set(tools.map((t) => t.category_name));
    return Array.from(set);
  }, [tools]);

  const filtered = useMemo(() => {
    let result = [...tools];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      );
    }
    if (categoryFilter) {
      result = result.filter((t) => t.category_name === categoryFilter);
    }
    if (sort === "newest") result.sort((a, b) => b.id.localeCompare(a.id));
    if (sort === "rating") result.sort((a, b) => b.rating - a.rating);
    if (sort === "popular") result.sort((a, b) => b.clicks - a.clicks);
    return result;
  }, [tools, search, categoryFilter, sort]);

  const total = filtered.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search tools..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="sm:max-w-xs"
        />
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm dark:text-white text-gray-900"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value as typeof sort); setPage(1); }}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm dark:text-white text-gray-900"
        >
          <option value="newest">Newest</option>
          <option value="rating">Highest Rated</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {/* Table */}
      <Card className="border-0 bg-slate-900/80 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left p-4 text-slate-400 font-medium">Tool</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Category</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Rating</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Clicks</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Status</th>
                  <th className="text-right p-4 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((tool) => (
                  <tr key={tool.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-slate-700 flex items-center justify-center shrink-0">
                          {tool.logo ? (
                            <img src={tool.logo} alt="" className="w-5 h-5 rounded" />
                          ) : (
                            <span className="text-slate-500 text-xs font-bold">{tool.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <Link href={`/tool/${tool.slug}`} className="dark:text-white text-gray-900 font-medium hover:text-indigo-400">
                            {tool.name}
                          </Link>
                          <p className="text-slate-500 text-xs line-clamp-1">{tool.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary" className="text-xs">{tool.category_name}</Badge>
                    </td>
                    <td className="p-4 text-slate-300">★ {tool.rating}</td>
                    <td className="p-4 text-slate-300">{tool.clicks.toLocaleString()}</td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        {tool.featured && <Badge variant="premium" className="text-xs">Featured</Badge>}
                        {tool.trending && <Badge variant="warning" className="text-xs">Trending</Badge>}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/tool/${tool.slug}`} target="_blank">
                          <Button variant="ghost" size="sm">View</Button>
                        </Link>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-slate-800">
              <p className="text-sm text-slate-400">
                Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, total)} of {total}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    variant={p === page ? "default" : "outline"}
                    size="sm"
                    className="w-9"
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
