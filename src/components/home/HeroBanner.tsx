"use client";

import Link from "next/link";
import { useTranslation } from "@/i18n";
import { ArrowRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function HeroBanner() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden">
      {/* Starfield + glow background */}
      <div className="absolute inset-0 bg-[#0a0a0b]" />
      <div className="starfield" />
      <div className="absolute left-1/2 top-1/3 h-[480px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5b7cfa]/[0.07] blur-[140px]" />

      <div className="relative container mx-auto max-w-5xl px-4 pb-28 pt-32 text-center lg:pt-40">
        {/* Badge */}
        <div className="kicker mb-10 animate-fade-in justify-center">
          <span>{t("home.hero.badge")}</span>
        </div>

        {/* Heading */}
        <h1 className="font-display text-5xl font-semibold leading-[1.02] tracking-tight text-white md:text-7xl lg:text-8xl animate-slide-up">
          {t("home.hero.heading")}
          <br />
          <span className="text-white/40">{t("home.hero.version")}</span>
        </h1>

        <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-white/55 md:text-lg animate-slide-up [animation-delay:200ms]">
          {t("home.hero.description")}
        </p>

        {/* Search */}
        <div className="mx-auto mt-12 max-w-xl animate-slide-up [animation-delay:400ms]">
          <form action="/tools" method="GET" className="relative">
            <Search className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
            <Input
              name="q"
              type="search"
              placeholder={t("home.hero.search_placeholder")}
              className="h-14 w-full rounded-full border-white/10 bg-white/[0.04] pl-12 pr-32 text-base text-white placeholder:text-white/35 backdrop-blur focus:border-white/30 focus:ring-0"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 h-10 -translate-y-1/2 rounded-full bg-white px-6 text-sm font-medium text-black transition-colors hover:bg-white/85"
            >
              {t("home.hero.search_button")}
            </button>
          </form>
        </div>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 animate-slide-up [animation-delay:600ms]">
          <Link
            href="/tools"
            className="inline-flex h-12 items-center rounded-full bg-white px-8 text-sm font-medium text-black transition-colors hover:bg-white/85"
          >
            {t("home.hero.cta_browse")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/submit"
            className="inline-flex h-12 items-center rounded-full border border-white/15 bg-transparent px-8 text-sm font-medium text-white/80 transition-colors hover:border-white/35 hover:text-white"
          >
            {t("home.hero.cta_submit")}
          </Link>
        </div>

        {/* Scroll hint */}
        <div className="mt-24 flex flex-col items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.4em] text-white/30">
            Scroll
          </span>
          <span className="h-10 w-px bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </div>
    </section>
  );
}
