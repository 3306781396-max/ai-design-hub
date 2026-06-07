import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolBySlug, getTools } from "@/lib/supabase";
import { generateSEOMetadata, getKeywords } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import ToolDetailClient from "./ToolDetailClient";
import type { Tool } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);

  if (!tool) return {};

  return generateSEOMetadata({
    title: `${tool.name} - Best AI Design Tool`,
    description:
      tool.seo_description ||
      `Discover ${tool.name}: ${tool.description}. Read reviews, pricing, pros & cons.`,
    keywords: getKeywords(tool.tags, tool.keywords),
    ogImage: tool.logo || "/og-image.png",
    canonical: `/tool/${tool.slug}`,
    type: "article",
  });
}

export async function generateStaticParams() {
  const { tools } = await getTools({ limit: 1000 });
  return tools.map((tool) => ({ slug: tool.slug }));
}

export default async function ToolDetailPage({ params }: Props) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);

  if (!tool) notFound();

  // Get all tools for recommendation
  const { tools: allTools } = await getTools({ limit: 1000 });

  // Calculate tag similarity for related tools
  const toolTags = new Set(tool.tags);

  const relatedTools = allTools
    .filter((t) => t.id !== tool.id)
    .map((t) => {
      const commonTags = t.tags.filter((tag) => toolTags.has(tag)).length;
      const similarity = commonTags / Math.max(toolTags.size, t.tags.length);
      return { ...t, similarity, commonTags };
    })
    .sort((a, b) => {
      // Sort by similarity, then by rating
      if (b.similarity !== a.similarity) return b.similarity - a.similarity;
      return b.rating - a.rating;
    })
    .slice(0, 8);

  // "Frequently used together" - tools with most common tags (top 4)
  const frequentlyUsedTogether = relatedTools
    .filter((t) => t.commonTags >= 2)
    .slice(0, 4);

  // "People also viewed" - tools from same category with high ratings
  const peopleAlsoViewed = allTools
    .filter((t) => t.id !== tool.id && t.category_slug === tool.category_slug)
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 4);

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: tool.pricing === "Free" ? "0" : 
        tool.pricing_details?.paid_plans?.[0]?.price?.toString() || "0",
      priceCurrency: tool.pricing_details?.paid_plans?.[0]?.currency || "USD",
      priceValidUntil: new Date(new Date().getFullYear() + 1, 11, 31).toISOString().split("T")[0],
    },
    aggregateRating: tool.review_count > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: tool.rating.toString(),
          ratingCount: tool.review_count.toString(),
          bestRating: "5",
          worstRating: "1",
        }
      : undefined,
    url: tool.website_url,
    screenshot: tool.screenshot || tool.logo,
    keywords: tool.tags.join(", "),
    datePublished: tool.created_at,
    dateModified: tool.updated_at,
  };

  return (
    <>
      <JsonLd data={toolSchema} />
      <ToolDetailClient 
        tool={tool} 
        allTools={allTools}
        relatedTools={relatedTools}
        frequentlyUsedTogether={frequentlyUsedTogether}
        peopleAlsoViewed={peopleAlsoViewed}
      />
    </>
  );
}
