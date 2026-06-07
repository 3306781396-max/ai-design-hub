"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useTranslation } from "@/i18n";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Tool } from "@/types";
import { logError } from "@/lib/logger";
import { Heart, ArrowRight, Trash2 } from "lucide-react";
import { useFavorites, useFavorite } from "@/hooks/use-favorite";
import { useAuth } from "@/hooks/use-auth";
import { clearAllFavorites } from "@/lib/supabase";

function FavCard({ tool }: { tool: Tool }) {
  const { t } = useTranslation();
  const [, toggle] = useFavorite(tool.id);

  return (
    <Card className="bg-dark-900 border-dark-800 hover:border-primary-500/50 transition-colors group relative">
      <button
        onClick={toggle}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-lg bg-dark-800/80 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors"
        aria-label={t("favorites.remove")}
      >
        <Heart className="w-4 h-4 fill-red-400" />
      </button>

      <Link href={`/tool/${tool.slug}`} className="block p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center text-lg font-bold text-primary-400 shrink-0">
            {tool.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{tool.name}</h3>
            <div className="flex items-center gap-1.5 text-xs text-dark-400">
              <span className="text-amber-400">★</span>
              <span>{tool.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-dark-400 line-clamp-2 mb-3">
          {tool.description}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-dark-800">
          <span className="text-xs px-2 py-0.5 rounded border border-dark-700 text-dark-400">
            {tool.pricing}
          </span>
          <span className="text-xs text-primary-400 font-medium">
            {t("common.view_details")} <ArrowRight className="w-3 h-3 inline" />
          </span>
        </div>
      </Link>
    </Card>
  );
}

export default function FavoritesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const favoriteIds = useFavorites();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const ids: string[] = favoriteIds;
      if (ids.length === 0) {
        setTools([]);
        setLoading(false);
        return;
      }

      // Load all tools from mock data and filter by favorite IDs
      const { tools: allTools } = await import("@/data/mock");
      // Build a map of id->tool for fast lookup
      const toolMap = new Map(allTools.map((t) => [t.id, t]));
      const loaded = ids
        .map((id) => toolMap.get(id))
        .filter(Boolean) as Tool[];
      setTools(loaded);
      setLoading(false);
    }
    load();
  }, [favoriteIds]);

  const clearAll = useCallback(async () => {
    try {
      if (user) {
        // Logged in: clear Supabase favorites
        await clearAllFavorites(user.id);
        // Also clear localStorage for consistency
      }
      // Clear localStorage
      localStorage.setItem("aid-hub_favorites", "[]");
      setTools([]);
      // Trigger reload to refresh useFavorites
      window.location.reload();
    } catch (err) {
      logError("Failed to clear favorites", err);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-white text-lg">{t("favorites.loading")}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <section className="pt-32 pb-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <Link href="/tools" className="text-dark-400 hover:text-white text-sm mb-4 inline-block">
            ← {t("common.back_to_tools")}
          </Link>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {t("favorites.page_title")}
              </h1>
              <p className="text-dark-400">
                {tools.length === 1
                  ? t("favorites.saved_count", { count: tools.length })
                  : t("favorites.saved_count_plural", { count: tools.length })}
              </p>
            </div>
            {tools.length > 0 && (
              <Button
                variant="outline"
                className="border-dark-700 text-dark-300 hover:text-red-400"
                onClick={clearAll}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {t("favorites.clear_all")}
              </Button>
            )}
          </div>

          {tools.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🤍</div>
              <h2 className="text-2xl font-bold text-white mb-2">{t("favorites.empty_title")}</h2>
              <p className="text-dark-400 mb-6">
                {t("favorites.empty_desc")}
              </p>
              <Link href="/tools">
                <Button className="bg-primary-500 hover:bg-primary-600">
                  {t("favorites.browse_tools")}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool) => (
                <FavCard key={tool.id} tool={tool} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
