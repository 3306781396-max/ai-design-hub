"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/i18n";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTools } from "@/lib/supabase";
import { Star, ArrowRight, TrendingUp, Flame } from "lucide-react";
import type { Tool } from "@/types";

export function TrendingTools() {
  const { t } = useTranslation();
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    getTools({ trending: true, limit: 8 }).then(({ tools }) => setTools(tools));
  }, []);

  return (
    <section className="py-24 lg:px-4">
      <div className="container mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="kicker mb-4">
              <span>{t("home.trending.title")}</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-semibold text-white">
              {t("home.trending.subtitle")}
            </h2>
          </div>
          <div className="hidden max-w-xs text-right sm:block">
            <p className="text-sm leading-relaxed text-white/45">
              Live rankings built from clicks, saves, and weekly re-scores.
            </p>
            <Link
              href="/tools?sort=trending"
              className="mt-3 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/45 transition-colors hover:text-white"
            >
              {t("common.view_all")} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool: Tool, i: number) => (
            <ToolCard key={tool.id} tool={tool} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function LatestTools() {
  const { t } = useTranslation();
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    getTools({ limit: 8, sort: "newest" }).then(({ tools }) => setTools(tools));
  }, []);

  return (
    <section className="py-16 bg-dark-900/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              {t("home.latest.title")}
            </h2>
            <p className="text-dark-400">{t("home.latest.subtitle")}</p>
          </div>
          <Button asChild variant="ghost" className="text-primary-400">
            <Link href="/tools?sort=newest">
              {t("common.view_all")} <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool: Tool, i: number) => (
            <ToolCard key={tool.id} tool={tool} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturedTools() {
  const { t } = useTranslation();
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    getTools({ featured: true, limit: 6 }).then(({ tools }) => setTools(tools));
  }, []);

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="kicker mb-4">
              <span>{t("common.featured")}</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-semibold text-white">
              {t("common.tools")}
            </h2>
          </div>
          <div className="hidden max-w-xs text-right sm:block">
            <p className="text-sm leading-relaxed text-white/45">
              Hand-picked by our editors — the tools we actually reach for every day.
            </p>
            <Link
              href="/tools?featured=true"
              className="mt-3 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/45 transition-colors hover:text-white"
            >
              {t("common.view_all")} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool: Tool, i: number) => (
            <FeaturedToolCard key={tool.id} tool={tool} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  const { t } = useTranslation();
  return (
    <Card className="group overflow-hidden bg-[#0e0e10] border-white/[0.07] card-hover">
      <CardContent className="p-0">
        <a href={tool.website_url} target="_blank" rel="noopener noreferrer" className="block">
          <div className="relative h-40 bg-[#101013] bg-[radial-gradient(ellipse_at_50%_130%,rgba(91,124,250,0.22),transparent_65%)] border-b border-white/[0.05] flex items-center justify-center overflow-hidden">
            <div className="w-16 h-16 rounded-2xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-3xl font-display font-medium text-white/85 group-hover:scale-110 transition-transform overflow-hidden">
              {tool.logo ? (
                <img src={tool.logo} alt={tool.name} loading="lazy" className="w-full h-full object-cover" />
              ) : (
                tool.name.charAt(0)
              )}
            </div>
            {tool.trending && (
              <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[10px] uppercase tracking-wider text-white/60 backdrop-blur">
                <TrendingUp className="h-3 w-3" />
                {t("common.trending")}
              </span>
            )}
            {tool.sponsored && (
              <span className="absolute top-3 right-3 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[10px] uppercase tracking-wider text-white/60 backdrop-blur">
                {t("common.sponsored")}
              </span>
            )}
          </div>

          <div className="p-5">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-display font-medium dark:text-white text-gray-900 group-hover:text-white transition-colors">
                {tool.name}
              </h3>
            </div>
            <p className="text-sm text-white/45 line-clamp-2 mb-3">
              {tool.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-medium dark:text-white text-gray-900">
                  {tool.rating.toFixed(1)}
                </span>
                <span className="text-xs text-white/35">
                  ({tool.review_count})
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-wider border border-white/15 rounded-full px-2.5 py-0.5 text-white/55">
                {tool.pricing}
              </span>
            </div>
          </div>
        </a>
      </CardContent>
    </Card>
  );
}

function FeaturedToolCard({ tool, index }: { tool: Tool; index: number }) {
  const { t } = useTranslation();
  return (
    <Card className="group overflow-hidden bg-[#0e0e10] border-white/[0.07] card-hover">
      <CardContent className="p-0">
        <a href={tool.website_url} target="_blank" rel="noopener noreferrer" className="block">
          <div className="relative h-48 bg-[#101013] bg-[radial-gradient(ellipse_at_50%_130%,rgba(91,124,250,0.22),transparent_65%)] border-b border-white/[0.05] flex items-center justify-center overflow-hidden">
            <div className="w-20 h-20 rounded-2xl border border-white/10 bg-white/[0.05] flex items-center justify-center text-4xl font-display font-medium text-white/85 group-hover:scale-110 transition-transform overflow-hidden">
              {tool.logo ? (
                <img src={tool.logo} alt={tool.name} loading="lazy" className="w-full h-full object-cover" />
              ) : (
                tool.name.charAt(0)
              )}
            </div>
            <span className="absolute top-3 left-3 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[10px] uppercase tracking-wider text-white/60 backdrop-blur">
              {t("home.featured_section.badge")}
            </span>
          </div>

          <div className="p-5">
            <h3 className="font-display text-lg font-medium dark:text-white text-gray-900 group-hover:text-white transition-colors mb-2">
              {tool.name}
            </h3>
            <p className="text-sm text-white/45 line-clamp-2 mb-4">
              {tool.description}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {tool.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-white/50">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-medium">{tool.rating.toFixed(1)}</span>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-white/40">{tool.category_name}</span>
            </div>
          </div>
        </a>
      </CardContent>
    </Card>
  );
}
