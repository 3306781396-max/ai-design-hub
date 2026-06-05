import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategoryBySlug, getTools, getCategories } from "@/lib/supabase";
import { CategoryToolsGrid } from "@/components/tools/CategoryToolsGrid";
import { generateSEOMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

const iconMap: Record<string, string> = {
  image: "🖼️", video: "🎬", layout: "🎨", sparkles: "✨", box: "📦", zap: "⚡",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return generateSEOMetadata({
    title: category.seo_title || `Best ${category.name} - AI Design Hub`,
    description: category.seo_description || `Discover the best ${category.name.toLowerCase()}. Browse top-rated AI tools.`,
    keywords: category.keywords,
    canonical: `/category/${category.slug}`,
    type: "website",
  });
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((cat) => ({ slug: cat.slug }));
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const { tools } = await getTools({ category: slug, limit: 1000 });
  const allCategories = await getCategories();
  const others = allCategories.filter((c) => c.slug !== slug);

  return (
    <div className="min-h-screen bg-dark-950 pt-32 pb-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <nav className="flex items-center gap-2 text-sm text-dark-400 mb-6">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-white transition-colors">Tools</Link>
          <span>/</span>
          <span className="text-white">{category.name}</span>
        </nav>
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center text-3xl">
              {iconMap[category.icon] || "🎯"}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">{category.name}</h1>
              <p className="text-dark-400 mt-1">{tools.length} tools available</p>
            </div>
          </div>
          <p className="text-dark-300 text-lg max-w-3xl">{category.description}</p>
        </div>
        <CategoryToolsGrid category={category} tools={tools} otherCategories={others} />
      </div>
    </div>
  );
}
