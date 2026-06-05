"use client";

import { useTranslation } from "@/i18n";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  const { t } = useTranslation();

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-950/40 to-accent-950/40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-900/10 via-transparent to-transparent" />

      <div className="relative container mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm mb-6">
          <Sparkles className="w-4 h-4" />
          <span>{t("home.cta.badge")}</span>
        </div>
        <h2 className="text-2xl md:text-4xl font-bold dark:text-white text-gray-900 mb-4">
          {t("home.cta.title")}
        </h2>
        <p className="text-lg text-dark-300 max-w-2xl mx-auto mb-10">
          {t("home.cta.description")}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="h-12 px-8 text-base">
            <Link href="/submit-tool">
              {t("home.cta.submit")}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 px-8 text-base border-dark-600 bg-transparent hover:border-primary-500/50"
          >
            <Link href="/contact">{t("home.cta.advertise")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
