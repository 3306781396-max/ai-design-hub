"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useMockStore } from "@/lib/mock-store";
import { getTools } from "@/lib/supabase";
import type { Tool } from "@/types";

const PAGE_SIZE = 10;

function fmtDate(iso: string) {
  const d = new Date(iso);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export default function AdminToolsPage() {
  const store = useMockStore();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sort, setSort] = useState<"newest" | "rating" | "popular">("newest");
  const [page, setPage] = useState(1);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(!store.isReady);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  // Initialize store on first mount
  useEffect(() => {
    if (store.isReady) { setLoading(false); return; }
    (async () => {
      const { tools } = await getTools({ limit: 1000 });
      const { initStore } = await import("@/lib/mock-store");
      // We also need posts for full store init
      const { getBlogPosts } = await import("@/lib/supabase");
      const { posts } = await getBlogPosts({ limit: 1000 });
      initStore(tools, posts);
      setLoading(false);
    })();
  }, [store.isReady]);

  const categories = [...new Set(store.tools.map((t) => t.category_name))];

  const filtered = (() => {
    let result = [...store.tools];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      );
    }
    if (categoryFilter) result = result.filter((t) => t.category_name === categoryFilter);
    if (sort === "newest") result.sort((a, b) => b.id.localeCompare(a.id));
    if (sort === "rating") result.sort((a, b) => b.rating - a.rating);
    if (sort === "popular") result.sort((a, b) => b.clicks - a.clicks);
    return result;
  })();

  const total = filtered.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = (id: string, name: string) => {
    setDeleteConfirm({ id, name });
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      store.deleteTool(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const defaultTool = (): Partial<Tool> => ({
    id: store.getNextToolId(),
    slug: "",
    name: "",
    description: "",
    website_url: "",
    category_slug: "ai-image-tools",
    category_name: "AI Image Tools",
    pricing: "Freemium",
    rating: 0,
    review_count: 0,
    clicks: 0,
    featured: false,
    trending: false,
    sponsored: false,
    tags: [],
    pros: [],
    cons: [],
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    seo_title: "",
    seo_description: "",
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-400">Loading tools...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Tools</h1>
          <p className="text-slate-400 text-sm mt-1">{store.tools.length} total tools</p>
        </div>
        <Button
          className="bg-gradient-to-r from-primary-500 to-accent-500 hover:opacity-90"
          onClick={() => {
            setEditingTool(null);
            setShowAddForm(true);
          }}
        >
          + Add New Tool
        </Button>
      </div>

      {/* Add/Edit Form Modal */}
      {(showAddForm || editingTool) && (
        <Card className="border border-slate-700 bg-slate-900">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-white mb-4">
              {editingTool ? `Edit: ${editingTool.name}` : "Add New Tool"}
            </h2>
            <ToolForm
              initial={editingTool || (defaultTool() as Tool)}
              onSave={(tool) => {
                if (editingTool) {
                  store.updateTool(tool.id, tool);
                } else {
                  store.addTool(tool as Tool);
                }
                setEditingTool(null);
                setShowAddForm(false);
              }}
              onCancel={() => {
                setEditingTool(null);
                setShowAddForm(false);
              }}
            />
          </CardContent>
        </Card>
      )}

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
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value as typeof sort); setPage(1); }}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
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
                            <img src={tool.logo} alt={tool.name} className="w-5 h-5 rounded" />
                          ) : (
                            <span className="text-slate-500 text-xs font-bold">{tool.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <Link href={`/tool/${tool.slug}`} className="text-white font-medium hover:text-indigo-400">
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
                        <Button variant="ghost" size="sm" onClick={() => setEditingTool(tool)}>
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleDelete(tool.id, tool.name)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-slate-800">
              <p className="text-sm text-slate-400">
                Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, total)} of {total}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  Previous
                </Button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const p = Math.max(1, page - 2) + i;
                  if (p > totalPages) return null;
                  return (
                    <Button
                      key={p}
                      variant={p === page ? "default" : "outline"}
                      size="sm"
                      className="w-9"
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </Button>
                  );
                })}
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirm !== null}
        onOpenChange={(open) => { if (!open) setDeleteConfirm(null); }}
        title="Delete Tool"
        description={`Are you sure you want to delete "${deleteConfirm?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={confirmDelete}
      />
    </div>
  );
}

// ---- Tool Form Component ----
function ToolForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Tool;
  onSave: (tool: Tool) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({ ...initial });

  const update = (key: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  const pricingOptions = ["Free", "Freemium", "Free Trial", "Paid", "Enterprise"];
  const categoryOptions = [
    { slug: "ai-image-tools", name: "AI Image Tools" },
    { slug: "ai-video-tools", name: "AI Video Tools" },
    { slug: "ai-ui-tools", name: "AI UI/UX Tools" },
    { slug: "ai-animation-tools", name: "AI Animation Tools" },
    { slug: "ai-3d-tools", name: "AI 3D Tools" },
    { slug: "ai-productivity-tools", name: "AI Productivity Tools" },
  ];

  const inputClass = "w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500";
  const labelClass = "block text-sm text-slate-400 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Name *</label>
          <input className={inputClass} value={form.name} onChange={(e) => { update("name", e.target.value); update("slug", e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")); }} required />
        </div>
        <div>
          <label className={labelClass}>Slug</label>
          <input className={inputClass} value={form.slug} onChange={(e) => update("slug", e.target.value)} required />
        </div>
        <div>
          <label className={labelClass}>Category</label>
          <select
            className={inputClass}
            value={form.category_slug}
            onChange={(e) => {
              const cat = categoryOptions.find((c) => c.slug === e.target.value);
              update("category_slug", e.target.value);
              update("category_name", cat?.name || "");
            }}
          >
            {categoryOptions.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Pricing</label>
          <select className={inputClass} value={form.pricing} onChange={(e) => update("pricing", e.target.value)}>
            {pricingOptions.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Website URL</label>
          <input className={inputClass} value={form.website_url} onChange={(e) => update("website_url", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Rating (0-5)</label>
          <input className={inputClass} type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => update("rating", parseFloat(e.target.value) || 0)} />
        </div>
        <div>
          <label className={labelClass}>Tags (comma-separated)</label>
          <input className={inputClass} value={Array.isArray(form.tags) ? form.tags.join(", ") : ""} onChange={(e) => update("tags", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} />
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-400">
            <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-400">
            <input type="checkbox" checked={form.trending} onChange={(e) => update("trending", e.target.checked)} />
            Trending
          </label>
        </div>
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea className={inputClass} rows={2} value={form.description} onChange={(e) => update("description", e.target.value)} required />
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="bg-gradient-to-r from-primary-500 to-accent-500">
          {initial.id.includes("tool-") ? "Save Changes" : "Create Tool"}
        </Button>
      </div>
    </form>
  );
}
