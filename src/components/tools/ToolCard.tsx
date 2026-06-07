"use client";

import Link from "next/link";
import { useTranslation } from "@/i18n";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, GitCompareArrows } from "lucide-react";
import type { Tool } from "@/types";
import { cn } from "@/lib/utils";
import { useFavorite } from "@/hooks/use-favorite";

interface Props {
  tool: Tool;
  variant?: "default" | "compact";
  onCompare?: (tool: Tool) => void;
}

export function ToolCard({ tool, variant = "default", onCompare }: Props) {
  const { t } = useTranslation();
  const [favorited, toggleFavorite] = useFavorite(tool.id);

  return (
    <Card className="group bg-dark-800 border-dark-700 hover:border-primary-500/50 transition-all duration-300 h-full flex flex-col relative">
      {/* Favorite & Compare buttons */}
      <div className="absolute top-3 right-3 flex gap-1.5 z-10">
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(); }}
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
            favorited
              ? "bg-red-500/20 text-red-400"
              : "bg-dark-900/80 text-dark-400 hover:text-red-400"
          )}
          aria-label={t("tools.card.toggle_favorite")}
        >
          <Heart className={cn("w-4 h-4", favorited && "fill-red-400")} />
        </button>
        {onCompare && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onCompare(tool); }}
            className="w-8 h-8 rounded-lg bg-dark-900/80 text-dark-400 hover:text-primary-400 flex items-center justify-center transition-colors"
            aria-label={t("tools.card.add_to_compare")}
          >
            <GitCompareArrows className="w-4 h-4" />
          </button>
        )}
      </div>

      <Link href={`/tool/${tool.slug}`} className="flex-1 flex flex-col p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center text-lg font-bold text-primary-400 shrink-0 overflow-hidden">
            {tool.logo ? (
              <img src={tool.logo} alt={tool.name} loading="lazy" className="w-7 h-7 rounded-lg object-cover" />
            ) : (
              tool.name.charAt(0)
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{tool.name}</h3>
            <div className="flex items-center gap-1.5 text-xs text-dark-400">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{tool.rating.toFixed(1)}</span>
              <span>·</span>
              <span>{tool.clicks > 999 ? (tool.clicks / 1000).toFixed(1) + "K" : tool.clicks} {t("tools.card.clicks")}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-dark-400 line-clamp-2 mb-4 flex-1">
          {tool.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tool.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-dark-700 text-dark-300">
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-dark-700">
          <Badge variant="outline" className="text-xs border-dark-600">
            {tool.pricing}
          </Badge>
          <span className="text-xs text-primary-400 font-medium">
            {t("common.view_details")} →
          </span>
        </div>
      </Link>
    </Card>
  );
}
