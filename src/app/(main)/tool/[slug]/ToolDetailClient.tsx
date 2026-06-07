"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/tools/FavoriteButton";
import { ReviewSection } from "@/components/tools/ReviewSection";
import { ShareButton } from "@/components/tools/ShareButton";
import { ImageCarousel } from "@/components/tools/ImageCarousel";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import FAQSection from "@/components/seo/FAQSection";
import { useViewTracker } from "@/hooks/use-view-tracker";
import { useTranslation } from "@/i18n/useTranslation";
import type { Tool } from "@/types";

interface Props {
  tool: Tool;
  allTools?: Tool[];
  relatedTools: Tool[];
  frequentlyUsedTogether?: Tool[];
  peopleAlsoViewed?: Tool[];
}

export default function ToolDetailClient({ 
  tool, 
  allTools = [],
  relatedTools, 
  frequentlyUsedTogether = [],
  peopleAlsoViewed = []
}: Props) {
  const { t } = useTranslation();

  // Track page view
  const displayClicks = useViewTracker(tool.slug, tool.clicks);

  // Find alternative tools by name
  const alternativeTools = (tool.alternatives || [])
    .map((name) => allTools.find((t) => t.name === name))
    .filter(Boolean) as Tool[];

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <section className="pt-32 pb-12 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: t("tool_detail.tools"), href: "/tools" },
              { label: tool.category_name, href: `/category/${tool.category_slug}` },
              { label: tool.name },
            ]}
          />

          {/* Screenshot Carousel */}
          <div className="mb-10">
            <ImageCarousel screenshots={tool.screenshots} toolName={tool.name} />
          </div>

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
                    ⭐ {t("common.featured")}
                  </Badge>
                )}
                {tool.sponsored && (
                  <Badge className="bg-blue-500/90 text-white border-0">
                    {t("common.sponsored")}
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
                    ({t("tool_detail.review_count", { count: tool.review_count })})
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
            <div className="shrink-0 flex items-center gap-3">
              <FavoriteButton toolId={tool.id} variant="button" />
              <ShareButton
                title={tool.name}
                description={tool.description}
                url={`/tool/${tool.slug}`}
                image={tool.logo}
              />
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
                  {t("tool_detail.visit_website")}
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
                  {t("tool_detail.about", { name: tool.name })}
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
                    ✅ {t("common.pros")}
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
                    ❌ {t("common.cons")}
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

            {/* Use Cases */}
            {tool.use_cases && tool.use_cases.length > 0 && (
              <Card className="bg-dark-900 border-dark-800">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-white">
                    {t("common.use_cases") || "Use Cases"}
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {tool.use_cases.map((uc, i) => (
                      <span
                        key={i}
                        className="inline-block px-3 py-1.5 rounded-full bg-primary-500/10 text-primary-400 text-sm border border-primary-500/20"
                      >
                        {uc}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Alternatives */}
            {(tool.alternatives || []).length > 0 && (
              <Card className="bg-dark-900 border-dark-800">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-white">
                    {t("tool_detail.alternatives") || "Alternatives"}
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {tool.alternatives!.map((altName, i) => {
                      const altTool = alternativeTools.find((t) => t.name === altName);
                      return (
                        <div
                          key={i}
                          className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                            altTool
                              ? "bg-dark-800 border-dark-700 hover:border-primary-500/50 cursor-pointer"
                              : "bg-dark-800/50 border-dark-700/50 opacity-60"
                          }`}
                        >
                          {altTool ? (
                            <Link href={`/tool/${altTool.slug}`} className="flex items-center gap-3 w-full">
                              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center text-sm font-bold text-primary-400 shrink-0">
                                {altName.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <p className="text-white text-sm font-medium truncate">{altName}</p>
                                {altTool.category_name && (
                                  <p className="text-dark-400 text-xs">{altTool.category_name}</p>
                                )}
                              </div>
                            </Link>
                          ) : (
                            <>
                              <div className="w-9 h-9 rounded-lg bg-dark-700 flex items-center justify-center text-sm font-bold text-dark-400 shrink-0">
                                {altName.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <p className="text-dark-300 text-sm font-medium truncate">{altName}</p>
                                <p className="text-dark-500 text-xs">{t("tool_detail.no_detail") || "No detail available"}</p>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            <ReviewSection toolId={tool.id} toolName={tool.name} />

            {/* FAQ */}
            <FAQSection
              title={t("tool_detail.faq")}
              faqs={tool.faq || []}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card className="bg-dark-900 border-dark-800">
              <CardHeader>
                <h3 className="font-semibold text-white">
                  {t("tool_detail.side_info")}
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-dark-400">{t("common.pricing")}</span>
                  <div className="text-right">
                    <span className="text-white font-medium">
                      {tool.pricing}
                    </span>
                    {tool.pricing_details?.starting_price && (
                      <p className="text-xs text-amber-400 mt-0.5">{tool.pricing_details.starting_price}</p>
                    )}
                    {tool.pricing_details?.free_tier && (
                      <p className="text-xs text-green-400 mt-0.5">{tool.pricing_details.free_tier}</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">{t("common.category")}</span>
                  <span className="text-white font-medium">
                    {tool.category_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">{t("common.rating")}</span>
                  <span className="text-white font-medium">
                    {tool.rating.toFixed(1)}/5
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">{t("common.views")}</span>
                  <span className="text-white font-medium">
                    {displayClicks.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="bg-dark-900 border-dark-800">
              <CardHeader>
                <h3 className="font-semibold text-white">{t("common.tags")}</h3>
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

      {/* Related Tools - Based on Tag Similarity */}
      {relatedTools.filter((t) => t.id !== tool.id).length > 0 && (
        <section className="pb-16 px-4 bg-dark-900/50">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold text-white mb-8">
              {t("tool_detail.related_tools")}
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

      {/* Frequently Used Together */}
      {frequentlyUsedTogether.length > 0 && (
        <section className="pb-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold text-white mb-8">
              {t("tool_detail.frequently_used_together")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {frequentlyUsedTogether.map((t) => (
                <ToolCardSimple key={t.id} tool={t} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* People Also Viewed */}
      {peopleAlsoViewed.length > 0 && (
        <section className="pb-16 px-4 bg-dark-900/50">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold text-white mb-8">
              {t("tool_detail.people_also_viewed")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {peopleAlsoViewed.map((t) => (
                <ToolCardSimple key={t.id} tool={t} />
              ))}
            </div>
          </div>
        </section>
      )}
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
