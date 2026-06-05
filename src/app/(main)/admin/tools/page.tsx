import type { Metadata } from "next";
import { getTools } from "@/lib/supabase";
import { AdminToolsTable } from "@/components/admin/ToolsTable";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Manage Tools - Admin",
  robots: { index: false },
};

export default async function AdminToolsPage() {
  const { tools, total } = await getTools({ limit: 100 });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Tools</h1>
          <p className="text-slate-400 text-sm mt-1">{total} total tools</p>
        </div>
        <Button className="bg-gradient-to-r from-primary-500 to-accent-500 hover:opacity-90">
          + Add New Tool
        </Button>
      </div>

      <AdminToolsTable tools={tools} />
    </div>
  );
}
