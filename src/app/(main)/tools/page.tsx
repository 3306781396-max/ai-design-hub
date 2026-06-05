import type { Metadata } from "next";
import { getTools, getCategories } from "@/lib/supabase";
import { ToolsFilteredGrid } from "@/components/tools/ToolsFilteredGrid";
import { ToolsPageHeader } from "@/components/tools/ToolsPageHeader";
import { generateSEOMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: "AI Design Tools Directory",
    description: "Browse and discover the best AI design tools for image generation, video creation, UI/UX design, 3D modeling, and more.",
    keywords: ["AI design tools", "AI image generator", "AI video tools", "UI design AI"],
    canonical: "/tools",
    type: "website",
  });
}

export default async function ToolsPage() {
  const { tools } = await getTools({ limit: 1000 });
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-dark-950 pt-32 pb-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <ToolsPageHeader toolsCount={tools.length} />
        <ToolsFilteredGrid allTools={tools} allCategories={categories} />
      </div>
    </div>
  );
}
