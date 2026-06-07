import type { Metadata } from "next";
import Link from "next/link";
import { getCategories, getTools } from "@/lib/supabase";
import { generateSEOMetadata } from "@/lib/seo";

const iconMap: Record<string, string> = {
  image: "🖼️", video: "🎬", layout: "🎨", sparkles: "✨", box: "📦", zap: "⚡",
};

export const metadata: Metadata = generateSEOMetadata({
  title: "AI Tool Categories - AI Design Hub",
  description: "Browse all AI tool categories. Find the best AI tools for image generation, video creation, UI/UX design, and more.",
  keywords: ["ai tools", "categories", "ai image", "ai video", "ai design"],
  canonical: "/categories",
});

export default async function CategoriesPage() {
  const categories = await getCategories();
  const { tools } = await getTools({ limit: 1000 });

  const catCounts = new Map<string, number>();
  for (const tool of tools) {
    catCounts.set(tool.category_slug, (catCounts.get(tool.category_slug) || 0) + 1);
  }

  return (
    <div className="min-h-screen bg-dark-950 pt-32 pb-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            AI Tool Categories
          </h1>
          <p className="text-dark-400 text-lg max-w-2xl mx-auto">
            Explore our curated collection of AI tools across every creative domain
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const count = catCounts.get(cat.slug) || 0;
            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-dark-800 bg-dark-900 p-6 transition-all hover:border-primary-500/30 hover:bg-dark-850 hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-500/10 to-transparent rounded-bl-full" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                    {iconMap[cat.icon] || "🎯"}
                  </div>
                  <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
                    {cat.name}
                  </h2>
                  <p className="text-dark-400 text-sm leading-relaxed line-clamp-3">
                    {cat.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-xs font-medium text-primary-400 bg-primary-500/10 px-2.5 py-1 rounded-full">
                      {count} tools
                    </span>
                    <span className="text-xs text-dark-500 group-hover:text-primary-400 transition-colors ml-auto">
                      Explore →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-20">
            <p className="text-dark-400 text-lg">No categories found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
