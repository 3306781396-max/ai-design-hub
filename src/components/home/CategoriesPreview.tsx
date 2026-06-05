"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/i18n";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ArrowRight, Image, Video, Layout, Lock, Box, Zap } from "lucide-react";
import { getCategories } from "@/lib/supabase";
import type { Category } from "@/types";

const categoryIcons: Record<string, any> = {
  "ai-image-tools": Image,
  "ai-video-tools": Video,
  "ai-ui-tools": Layout,
  "ai-animation-tools": Zap,
  "ai-3d-tools": Box,
  "ai-productivity-tools": Lock,
};

const categoryColors: Record<string, string> = {
  "ai-image-tools": "#f59e0b",
  "ai-video-tools": "#3b82f6",
  "ai-ui-tools": "#8b5cf6",
  "ai-animation-tools": "#ec4899",
  "ai-3d-tools": "#06b6d4",
  "ai-productivity-tools": "#10b981",
};

export function CategoriesPreview() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  return (
    <section className="py-16 bg-dark-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            {t("home.categories_preview.title")}
          </h2>
          <p className="text-dark-400 max-w-xl mx-auto">
            {t("home.categories_preview.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.slug] || Zap;
            const color = categoryColors[cat.slug] || "#6366f1";
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group"
              >
                <Card className="p-6 bg-dark-900 border-dark-800 card-hover h-full">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                      style={{
                        background: `linear-gradient(135deg, ${color}20, ${color}10)`,
                        border: `1px solid ${color}30`,
                      }}
                    >
                      <Icon
                        className="w-6 h-6"
                        style={{ color }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold dark:text-white text-gray-900 group-hover:text-primary-400 transition-colors mb-1">
                        {cat.name}
                      </h3>
                      <p className="text-sm text-dark-400 line-clamp-2 mb-2">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors"
          >
            {t("home.categories_preview.view_all")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
