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
    <section className="py-16 lg:px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <h2 className="text-2xl md:text-3xl font-bold">
                {t("home.trending.title")}
              </h2>
            </div>
            <p className="text-dark-400">
              {t("home.trending.subtitle")}
            </p>
          </div>
          <Button asChild variant="ghost" className="text-primary-400">
            <Link href="/tools?sort=trending">
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
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              <span className="gradient-text">{t("common.featured")}</span>{" "}
              {t("common.tools")}
            </h2>
            <p className="text-dark-400">
              {t("home.featured_section.subtitle")}
            </p>
          </div>
          <Button asChild variant="ghost" className="text-primary-400">
            <Link href="/tools?featured=true">
              {t("common.view_all")} <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </Button>
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
    <Card className="group overflow-hidden bg-dark-900 border-dark-800 card-hover">
      <CardContent className="p-0">
        <Link href={`/tool/${tool.slug}`} className="block">
          <div className="relative h-40 bg-gradient-to-br from-dark-800 to-dark-900 flex items-center justify-center overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center text-3xl font-bold text-primary-400 group-hover:scale-110 transition-transform">
              {tool.name.charAt(0)}
            </div>
            {tool.trending && (
              <Badge className="absolute top-3 left-3 bg-orange-500/90 dark:text-white text-gray-900 border-0 text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                {t("common.trending")}
              </Badge>
            )}
            {tool.sponsored && (
              <Badge className="absolute top-3 right-3 bg-amber-500/90 dark:text-white text-gray-900 border-0 text-xs">
                {t("common.sponsored")}
              </Badge>
            )}
          </div>

          <div className="p-5">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold dark:text-white text-gray-900 group-hover:text-primary-400 transition-colors">
                {tool.name}
              </h3>
            </div>
            <p className="text-sm text-dark-400 line-clamp-2 mb-3">
              {tool.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-medium dark:text-white text-gray-900">
                  {tool.rating.toFixed(1)}
                </span>
                <span className="text-xs text-dark-500">
                  ({tool.review_count})
                </span>
              </div>
              <Badge variant="outline" className="text-xs border-dark-700 text-dark-300">
                {tool.pricing}
              </Badge>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}

function FeaturedToolCard({ tool, index }: { tool: Tool; index: number }) {
  const { t } = useTranslation();
  return (
    <Card className="group overflow-hidden bg-dark-900 border-dark-800 card-hover border-primary-500/20">
      <CardContent className="p-0">
        <Link href={`/tool/${tool.slug}`} className="block">
          <div className="relative h-48 bg-gradient-to-br from-primary-950/50 to-dark-900 flex items-center justify-center overflow-hidden">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500/30 to-accent-500/30 flex items-center justify-center text-4xl font-bold text-primary-300 group-hover:scale-110 transition-transform">
              {tool.name.charAt(0)}
            </div>
            <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-amber-500/90 dark:text-white text-gray-900 text-xs font-medium">
              {t("home.featured_section.badge")}
            </div>
          </div>

          <div className="p-5">
            <h3 className="font-semibold text-lg dark:text-white text-gray-900 group-hover:text-primary-400 transition-colors mb-2">
              {tool.name}
            </h3>
            <p className="text-sm text-dark-400 line-clamp-2 mb-4">
              {tool.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {tool.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-medium">{tool.rating.toFixed(1)}</span>
              </div>
              <span className="text-xs text-dark-400">{tool.category_name}</span>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
