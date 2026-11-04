"use client";

import { useTranslation } from "@/i18n";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden border-t border-white/[0.05] py-28">
      <div className="absolute inset-0 bg-[#0a0a0b]" />
      <div className="starfield" />
      <div className="absolute left-1/2 top-1/2 h-[320px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5b7cfa]/[0.06] blur-[120px]" />

      <div className="relative container mx-auto px-4 text-center">
        <div className="kicker mb-6 justify-center">
          <span>{t("home.cta.badge")}</span>
        </div>
        <h2 className="font-display text-3xl font-semibold leading-tight text-white md:text-5xl">
          {t("home.cta.title")}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-white/55">
          {t("home.cta.description")}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/submit"
            className="inline-flex h-12 items-center rounded-full bg-white px-8 text-sm font-medium text-black transition-colors hover:bg-white/85"
          >
            {t("home.cta.submit")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-12 items-center rounded-full border border-white/15 px-8 text-sm font-medium text-white/80 transition-colors hover:border-white/35 hover:text-white"
          >
            {t("home.cta.advertise")}
          </Link>
        </div>
      </div>
    </section>
  );
}
