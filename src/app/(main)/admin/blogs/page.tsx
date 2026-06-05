import type { Metadata } from "next";
import { getBlogPosts } from "@/lib/supabase";
import { AdminBlogsTable } from "@/components/admin/BlogsTable";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Manage Blog Posts - Admin",
  robots: { index: false },
};

export default async function AdminBlogsPage() {
  const { posts, total } = await getBlogPosts({ limit: 100 });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Blog Posts</h1>
          <p className="text-slate-400 text-sm mt-1">{total} total posts</p>
        </div>
        <Button className="bg-gradient-to-r from-primary-500 to-accent-500 hover:opacity-90">
          + New Blog Post
        </Button>
      </div>

      <AdminBlogsTable posts={posts} />
    </div>
  );
}
