"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMockStore } from "@/lib/mock-store";
import { getAdminStats } from "@/lib/supabase";
import { StatsCards } from "@/components/admin/StatsCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AdminStats } from "@/types";

function fmtDate(iso: string) {
  const d = new Date(iso);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export default function AdminDashboardPage() {
  const store = useMockStore();
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    if (store.isReady) {
      // Compute live stats from store
      setStats({
        total_tools: store.tools.length,
        total_blogs: store.posts.length,
        total_categories: [...new Set(store.tools.map((t) => t.category_name))].length,
        total_submissions: 0,
        pending_submissions: 0,
        total_clicks: store.tools.reduce((sum, t) => sum + t.clicks, 0),
        total_views: store.posts.reduce((sum, p) => sum + p.views, 0),
        seo_score: 92,
      });
    } else {
      getAdminStats().then(setStats);
    }
  }, [store.isReady, store.tools, store.posts]);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-400">Loading dashboard...</p>
      </div>
    );
  }

  // Get recent 5 from store if ready, else empty
  const recentTools = store.isReady ? store.tools.slice(0, 5) : [];
  const recentPosts = store.isReady ? store.posts.slice(0, 5) : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">
          Welcome back! Here's what's happening with your site.
        </p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/tools">
          <Card className="border-0 bg-slate-900/80 hover:bg-slate-800/80 transition-colors cursor-pointer">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Add New Tool</p>
                <p className="text-slate-400 text-sm">Submit a new AI tool</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/blogs">
          <Card className="border-0 bg-slate-900/80 hover:bg-slate-800/80 transition-colors cursor-pointer">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Write Blog Post</p>
                <p className="text-slate-400 text-sm">Create new article</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/tools">
          <Card className="border-0 bg-slate-900/80 hover:bg-slate-800/80 transition-colors cursor-pointer">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">View Site</p>
                <p className="text-slate-400 text-sm">Preview public site</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 bg-slate-900/80">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Recent Tools</CardTitle>
            <Link href="/admin/tools">
              <Button variant="ghost" size="sm">View All →</Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTools.map((tool) => (
              <div
                key={tool.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-slate-700 flex items-center justify-center text-sm">
                    {tool.logo ? (
                      <img src={tool.logo} alt={tool.name} className="w-5 h-5 rounded" />
                    ) : (
                      <span className="text-slate-500 text-xs font-bold">
                        {tool.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{tool.name}</p>
                    <p className="text-xs text-slate-500">{tool.category_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {tool.featured && <Badge variant="premium" className="text-xs">Featured</Badge>}
                  {tool.trending && <Badge variant="warning" className="text-xs">Trending</Badge>}
                  <span className="text-xs text-slate-500">
                    ★ {tool.rating}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-0 bg-slate-900/80">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Recent Blog Posts</CardTitle>
            <Link href="/admin/blogs">
              <Button variant="ghost" size="sm">View All →</Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50"
              >
                <div>
                  <p className="text-sm font-medium text-white">{post.title}</p>
                  <p className="text-xs text-slate-500">
                    {post.published_at ? fmtDate(post.published_at) : "Draft"} · {post.views} views
                  </p>
                </div>
                {post.featured && (
                  <Badge variant="success" className="text-xs shrink-0">Featured</Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
