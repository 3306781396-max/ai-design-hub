"use client";

import Link from "next/link";
import { useTranslation } from "@/i18n";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function HeroBanner() {
  const { t } = useTranslation();

  const stats = [
    { label: t("home.hero.stats.ai_tools"), value: t("home.hero.stats.ai_tools_value") },
    { label: t("home.hero.stats.categories"), value: t("home.hero.stats.categories_value") },
    { label: t("home.hero.stats.monthly_visits"), value: t("home.hero.stats.monthly_visits_value") },
    { label: t("home.hero.stats.curated_reviews"), value: t("home.hero.stats.curated_reviews_value") },
  ];

  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-950/50 via-dark-950 to-accent-950/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-900/20 via-transparent to-transparent" />

      {/* Animated orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl animate-float [animation-delay:2s]" />

      <div className="relative container mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4" />
          <span>{t("home.hero.badge")}</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up">
          <span className="gradient-text">{t("home.hero.heading")}</span>
          <br />
          <span className="dark:text-white text-gray-900 text-3xl md:text-5xl lg:text-6xl">
            {t("home.hero.version")}
          </span>
        </h1>

        <p className="text-lg md:text-xl text-dark-300 max-w-2xl mx-auto mb-10 animate-slide-up [animation-delay:200ms]">
          {t("home.hero.description")}
        </p>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-10 animate-slide-up [animation-delay:400ms]">
          <form action="/tools" method="GET" className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <Input
              name="q"
              type="search"
              placeholder={t("home.hero.search_placeholder")}
              className="w-full h-14 pl-12 pr-32 text-base bg-dark-900/80 border-dark-700 rounded-2xl focus:border-primary-500 focus:ring-primary-500/20"
            />
            <Button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6 rounded-xl bg-primary-600 hover:bg-primary-500"
            >
              {t("home.hero.search_button")}
            </Button>
          </form>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 animate-slide-up [animation-delay:600ms]">
          <Button asChild size="lg" className="h-12 px-8 text-base">
            <Link href="/tools">
              {t("home.hero.cta_browse")}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 px-8 text-base border-dark-600 hover:border-primary-500/50 bg-transparent"
          >
            <Link href="/submit-tool">{t("home.hero.cta_submit")}</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mt-16 animate-slide-up [animation-delay:800ms]">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold gradient-text">
                {stat.value}
              </div>
              <div className="text-sm text-dark-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
