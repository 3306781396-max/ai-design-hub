"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useMockStore } from "@/lib/mock-store";
import { getBlogPosts } from "@/lib/supabase";
import type { BlogPost } from "@/types";

const PAGE_SIZE = 10;

function fmtDate(iso: string) {
  const d = new Date(iso);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export default function AdminBlogsPage() {
  const store = useMockStore();
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(!store.isReady);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    if (store.isReady) { setLoading(false); return; }
    (async () => {
      const { posts } = await getBlogPosts({ limit: 1000 });
      const { getTools } = await import("@/lib/supabase");
      const { tools } = await getTools({ limit: 1000 });
      const { initStore } = await import("@/lib/mock-store");
      initStore(tools, posts);
      setLoading(false);
    })();
  }, [store.isReady]);

  const categories = [...new Set(store.posts.map((p) => p.category))];

  const filtered = categoryFilter
    ? store.posts.filter((p) => p.category === categoryFilter)
    : store.posts;

  const total = filtered.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = (id: string, title: string) => {
    setDeleteConfirm({ id, title });
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      store.deletePost(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const defaultPost = (): Partial<BlogPost> => ({
    id: store.getNextPostId(),
    slug: "",
    title: "",
    description: "",
    content: "",
    author: "Admin",
    category: "Guide",
    tags: [],
    read_time: 5,
    views: 0,
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    featured: false,
    seo_title: "",
    seo_description: "",
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-400">Loading blogs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Blog Posts</h1>
          <p className="text-slate-400 text-sm mt-1">{store.posts.length} total posts</p>
        </div>
        <Button
          className="bg-gradient-to-r from-primary-500 to-accent-500 hover:opacity-90"
          onClick={() => {
            setEditingPost(null);
            setShowAddForm(true);
          }}
        >
          + New Blog Post
        </Button>
      </div>

      {/* Add/Edit Form Modal */}
      {(showAddForm || editingPost) && (
        <Card className="border border-slate-700 bg-slate-900">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-white mb-4">
              {editingPost ? `Edit: ${editingPost.title}` : "New Blog Post"}
            </h2>
            <BlogForm
              initial={editingPost || (defaultPost() as BlogPost)}
              onSave={(post) => {
                if (editingPost) {
                  store.updatePost(post.id, post);
                } else {
                  store.addPost(post as BlogPost);
                }
                setEditingPost(null);
                setShowAddForm(false);
              }}
              onCancel={() => {
                setEditingPost(null);
                setShowAddForm(false);
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Category Filter */}
      <div className="flex gap-3">
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
      </div>

      {/* Table */}
      <Card className="border-0 bg-slate-900/80 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left p-4 text-slate-400 font-medium">Title</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Category</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Views</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Published</th>
                  <th className="text-right p-4 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((post) => (
                  <tr key={post.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                    <td className="p-4">
                      <div>
                        <p className="text-white font-medium">{post.title}</p>
                        <p className="text-slate-500 text-xs mt-0.5 line-clamp-1">{post.description}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                    </td>
                    <td className="p-4 text-slate-300">{post.views.toLocaleString()}</td>
                    <td className="p-4">
                      {post.published_at ? (
                        <span className="text-slate-400 text-sm">{fmtDate(post.published_at)}</span>
                      ) : (
                        <Badge variant="outline" className="text-xs">Draft</Badge>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {post.published_at && (
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <Button variant="ghost" size="sm">View</Button>
                          </Link>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => setEditingPost(post)}>
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleDelete(post.id, post.title)}
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
        title="Delete Blog Post"
        description={`Are you sure you want to delete "${deleteConfirm?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={confirmDelete}
      />
    </div>
  );
}

// ---- Blog Form Component ----
function BlogForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: BlogPost;
  onSave: (post: BlogPost) => void;
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

  const categoryOptions = ["Guide", "Review", "News", "Tutorial", "Comparison", "Opinion"];
  const inputClass = "w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500";
  const labelClass = "block text-sm text-slate-400 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Title *</label>
          <input
            className={inputClass}
            value={form.title}
            onChange={(e) => {
              update("title", e.target.value);
              update("slug", e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").substring(0, 60));
            }}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Slug</label>
          <input className={inputClass} value={form.slug} onChange={(e) => update("slug", e.target.value)} required />
        </div>
        <div>
          <label className={labelClass}>Category</label>
          <select className={inputClass} value={form.category} onChange={(e) => update("category", e.target.value)}>
            {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Author</label>
          <input className={inputClass} value={form.author} onChange={(e) => update("author", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Read Time</label>
          <input className={inputClass} type="number" value={form.read_time} onChange={(e) => update("read_time", parseInt(e.target.value) || 5)} />
        </div>
        <div>
          <label className={labelClass}>Tags (comma-separated)</label>
          <input
            className={inputClass}
            value={Array.isArray(form.tags) ? form.tags.join(", ") : ""}
            onChange={(e) => update("tags", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-400">
            <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} />
            Featured
          </label>
        </div>
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea className={inputClass} rows={2} value={form.description} onChange={(e) => update("description", e.target.value)} required />
      </div>

      <div>
        <label className={labelClass}>Content (HTML)</label>
        <textarea className={inputClass} rows={8} value={form.content} onChange={(e) => update("content", e.target.value)} />
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="bg-gradient-to-r from-primary-500 to-accent-500">
          {initial.id.startsWith("blog-") && initial.title ? "Save Changes" : "Create Post"}
        </Button>
      </div>
    </form>
  );
}
