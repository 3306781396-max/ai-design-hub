import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getToolBySlug, getTools } from "@/lib/supabase";
import { generateSEOMetadata } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import type { Tool, FAQ } from "@/types";

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
    keywords: tool.tags,
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

  const { tools: relatedTools } = await getTools({
    category: tool.category_slug,
    limit: 4,
  });

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: tool.pricing === "Free" ? "0" : "0",
      priceCurrency: "USD",
    },
    aggregateRating: tool.review_count > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: tool.rating.toString(),
          ratingCount: tool.review_count.toString(),
        }
      : undefined,
    url: tool.website_url,
    screenshot: tool.screenshot || tool.logo,
  };

  return (
    <>
      <JsonLd data={toolSchema} />
      <div className="min-h-screen bg-dark-950">
        {/* Header */}
        <section className="pt-32 pb-12 px-4">
          <div className="container mx-auto max-w-5xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-dark-400 mb-8">
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <span>/</span>
              <Link href="/tools" className="hover:text-white">
                Tools
              </Link>
              <span>/</span>
              <Link
                href={`/category/${tool.category_slug}`}
                className="hover:text-white"
              >
                {tool.category_name}
              </Link>
              <span>/</span>
              <span className="text-white">{tool.name}</span>
            </nav>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Logo */}
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center text-4xl font-bold text-primary-400 shrink-0">
                {tool.name.charAt(0)}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    {tool.name}
                  </h1>
                  {tool.featured && (
                    <Badge className="bg-amber-500/90 text-white border-0">
                      ⭐ Featured
                    </Badge>
                  )}
                  {tool.sponsored && (
                    <Badge className="bg-blue-500/90 text-white border-0">
                      Sponsored
                    </Badge>
                  )}
                </div>

                <p className="text-dark-300 text-lg mb-4">
                  {tool.description}
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {"★".repeat(Math.round(tool.rating))}
                      {"☆".repeat(5 - Math.round(tool.rating))}
                    </div>
                    <span className="text-white font-medium">
                      {tool.rating.toFixed(1)}
                    </span>
                    <span className="text-dark-400 text-sm">
                      ({tool.review_count} reviews)
                    </span>
                  </div>

                  {/* Pricing */}
                  <Badge variant="outline" className="border-dark-700">
                    {tool.pricing}
                  </Badge>

                  {/* Category */}
                  <Link href={`/category/${tool.category_slug}`}>
                    <Badge
                      variant="secondary"
                      className="hover:bg-dark-700 cursor-pointer"
                    >
                      {tool.category_name}
                    </Badge>
                  </Link>
                </div>
              </div>

              {/* CTA */}
              <div className="shrink-0">
                <Button
                  size="lg"
                  className="w-full md:w-auto bg-gradient-to-r from-primary-500 to-accent-500 hover:opacity-90"
                  asChild
                >
                  <a
                    href={tool.affiliate_link || tool.website_url}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                  >
                    Visit Website →
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="pb-16 px-4">
          <div className="container mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <Card className="bg-dark-900 border-dark-800">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-white">
                    About {tool.name}
                  </h2>
                </CardHeader>
                <CardContent>
                  <p className="text-dark-300 leading-relaxed">
                    {tool.description_long || tool.description}
                  </p>
                </CardContent>
              </Card>

              {/* Pros & Cons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-dark-900 border-dark-800">
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-green-400">
                      ✅ Pros
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {(tool.pros || [
                        "Easy to use interface",
                        "High quality output",
                        "Regular updates",
                      ]).map((pro: string, i: number) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-dark-300"
                        >
                          <span className="text-green-400 mt-0.5">•</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-dark-900 border-dark-800">
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-red-400">
                      ❌ Cons
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {(tool.cons || [
                        "Learning curve for advanced features",
                        "Limited free tier",
                      ]).map((con, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-dark-300"
                        >
                          <span className="text-red-400 mt-0.5">•</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Reviews */}
              <Card className="bg-dark-900 border-dark-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">
                      User Reviews
                    </h2>
                    <Badge variant="outline" className="border-dark-700 text-dark-300">
                      {tool.review_count} reviews
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Rating Overview */}
                  <div className="flex items-center gap-6 mb-6 pb-6 border-b border-dark-800">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-white">{tool.rating.toFixed(1)}</div>
                      <div className="flex text-amber-400 text-lg">
                        {"★".repeat(Math.round(tool.rating))}
                        {"☆".repeat(5 - Math.round(tool.rating))}
                      </div>
                      <div className="text-xs text-dark-500 mt-1">out of 5</div>
                    </div>
                    <div className="flex-1 space-y-1">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-2">
                          <span className="text-xs text-dark-400 w-3">{star}</span>
                          <div className="flex-1 h-2 rounded-full bg-dark-800 overflow-hidden">
                            <div
                              className="h-full bg-amber-400 rounded-full"
                              style={{
                                width: `${star === Math.round(tool.rating) ? 70 : star === Math.round(tool.rating) - 1 ? 20 : 5}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* No Reviews Yet */}
                  <div className="text-center py-8 text-dark-500">
                    <p className="text-sm">No reviews yet. Be the first to share your experience!</p>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ */}
              {tool.faq && tool.faq.length > 0 && (
                <Card className="bg-dark-900 border-dark-800">
                  <CardHeader>
                    <h2 className="text-xl font-semibold text-white">
                      Frequently Asked Questions
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <FAQSection faqs={tool.faq} />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <Card className="bg-dark-900 border-dark-800">
                <CardHeader>
                  <h3 className="font-semibold text-white">
                    Tool Information
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-dark-400">Pricing</span>
                    <span className="text-white font-medium">
                      {tool.pricing}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-400">Category</span>
                    <span className="text-white font-medium">
                      {tool.category_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-400">Rating</span>
                    <span className="text-white font-medium">
                      {tool.rating.toFixed(1)}/5
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-400">Views</span>
                    <span className="text-white font-medium">
                      {tool.clicks.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card className="bg-dark-900 border-dark-800">
                <CardHeader>
                  <h3 className="font-semibold text-white">Tags</h3>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {tool.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer hover:bg-dark-600"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Related Tools */}
        {relatedTools.filter((t) => t.id !== tool.id).length > 0 && (
          <section className="pb-16 px-4 bg-dark-900/50">
            <div className="container mx-auto max-w-5xl">
              <h2 className="text-2xl font-bold text-white mb-8">
                Related Tools
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedTools
                  .filter((t) => t.id !== tool.id)
                  .slice(0, 4)
                  .map((t) => (
                    <ToolCardSimple key={t.id} tool={t} />
                  ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}

function FAQSection({ faqs }: { faqs: FAQ[] }) {
  return (
    <div className="space-y-4">
      {faqs.map((faq, i) => (
        <details
          key={i}
          className="group rounded-lg border border-dark-800 p-4"
        >
          <summary className="flex items-center justify-between cursor-pointer text-white font-medium">
            {faq.question}
            <span className="transition group-open:rotate-180">▼</span>
          </summary>
          <p className="mt-3 text-dark-300">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}

function ToolCardSimple({ tool }: { tool: Tool }) {
  return (
    <Link href={`/tool/${tool.slug}`}>
      <Card className="bg-dark-800 border-dark-700 hover:border-primary-500/50 transition-colors h-full">
        <CardContent className="p-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center text-lg font-bold text-primary-400 mb-3">
            {tool.name.charAt(0)}
          </div>
          <h3 className="font-medium text-white mb-1">{tool.name}</h3>
          <p className="text-xs text-dark-400 line-clamp-2">
            {tool.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
