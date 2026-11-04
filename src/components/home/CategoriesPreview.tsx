"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/i18n";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getCategories } from "@/lib/supabase";
import type { Category } from "@/types";

export function CategoriesPreview() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  return (
    <section className="border-y border-white/[0.05] bg-[#0c0c0e] py-24">
      <div className="container mx-auto px-4">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="kicker mb-4">
              <span>{t("home.categories_preview.title")}</span>
            </div>
            <h2 className="font-display text-3xl font-semibold text-white md:text-5xl">
              {t("home.categories_preview.subtitle")}
            </h2>
          </div>
          <Link
            href="/tools"
            className="inline-flex w-fit items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/45 transition-colors hover:text-white"
          >
            {t("home.categories_preview.view_all")}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="border-t border-white/[0.06]">
          {categories.map((cat, i) => {
            const num = String(i + 1).padStart(2, "0");
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group flex items-center gap-6 border-b border-white/[0.06] py-8 transition-colors hover:bg-white/[0.02] md:gap-10 md:px-4"
              >
                <span className="w-8 shrink-0 font-display text-sm text-white/30">
                  {num}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-2xl font-medium text-white md:text-3xl">
                    {cat.name}
                  </h3>
                  <span className="mt-3 block h-[2px] w-20 origin-left bg-[#5b7cfa]" />
                </div>
                <p className="hidden max-w-xs shrink-0 text-right text-sm leading-relaxed text-white/45 md:block">
                  {cat.description}
                </p>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-white/25 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
