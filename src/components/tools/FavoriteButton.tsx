"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorite } from "@/hooks/use-favorite";
import { useTranslation } from "@/i18n/useTranslation";

interface FavoriteButtonProps {
  toolId: string;
  variant?: "icon" | "button";
  className?: string;
}

export function FavoriteButton({ toolId, variant = "icon", className }: FavoriteButtonProps) {
  const [favorited, toggleFavorite] = useFavorite(toolId);
  const { t } = useTranslation();

  if (variant === "button") {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite();
        }}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all border",
          favorited
            ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
            : "bg-dark-800 border-dark-700 text-dark-300 hover:text-red-400 hover:border-red-500/30"
        )}
      >
        <Heart className={cn("w-5 h-5", favorited && "fill-red-400")} />
        <span>{favorited ? t("common.favorited") : t("common.favorite")}</span>
      </button>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite();
      }}
      className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
        favorited
          ? "bg-red-500/20 text-red-400"
          : "bg-dark-800 text-dark-400 hover:text-red-400",
        className
      )}
    >
      <Heart className={cn("w-5 h-5", favorited && "fill-red-400")} />
    </button>
  );
}
