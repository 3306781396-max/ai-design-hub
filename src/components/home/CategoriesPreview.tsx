"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/i18n";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => {
            const num = String(i + 1).padStart(2, "0");
            return (
              <Link key={cat.id} href={`/category/${cat.slug}`} className="group">
                <div className="flex h-full flex-col rounded-2xl border border-white/[0.07] bg-[#0e0e10] p-6 transition-all duration-300 hover:border-white/25 hover:bg-[#121215]">
                  <div className="mb-8 flex items-start justify-between">
                    <span className="font-display text-sm text-white/30">{num}</span>
                    <ArrowRight className="h-4 w-4 -translate-x-1 translate-y-1 text-white/0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-white" />
                  </div>
                  <h3 className="mb-2 font-display text-xl font-medium text-white">
                    {cat.name}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/45 line-clamp-2">
                    {cat.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
