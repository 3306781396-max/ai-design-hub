"use client";

import { useTranslation } from "@/i18n/useTranslation";
import { ArrowRight } from "lucide-react";
import { MoreLink } from "@/components/ui/more-link";

export function AdvertisePageClient() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-dark-950 pt-32 pb-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 gradient-text">
          {t("pages.advertise.heading")}
        </h1>

        <div className="space-y-12 text-dark-300 leading-relaxed">
          <section>
            <p className="text-lg mb-8">{t("pages.advertise.subtitle")}</p>
          </section>

          {/* Advertising Options */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-white">
              {t("pages.advertise.options_title")}
            </h2>

            <div className="space-y-6">
              {/* Sponsored Listings */}
              <div className="bg-dark-900 p-8 rounded-lg border border-dark-800">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📋</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">
                      {t("pages.advertise.option1_title")}
                    </h3>
                    <p className="text-dark-400">
                      {t("pages.advertise.option1_desc")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Featured Tool Placements */}
              <div className="bg-dark-900 p-8 rounded-lg border border-dark-800">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">
                      {t("pages.advertise.option2_title")}
                    </h3>
                    <p className="text-dark-400">
                      {t("pages.advertise.option2_desc")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Newsletter Sponsorship */}
              <div className="bg-dark-900 p-8 rounded-lg border border-dark-800">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📰</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">
                      {t("pages.advertise.option3_title")}
                    </h3>
                    <p className="text-dark-400">
                      {t("pages.advertise.option3_desc")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Banner Ads */}
              <div className="bg-dark-900 p-8 rounded-lg border border-dark-800">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-white mb-2">
                      {t("pages.advertise.option4_title")}
                    </h3>
                    <p className="text-dark-400">
                      {t("pages.advertise.option4_desc")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-white">
              {t("pages.advertise.pricing_title")}
            </h2>
            <p className="mb-4">{t("pages.advertise.pricing_note")}</p>
          </section>

          {/* Get Started */}
          <section className="bg-dark-900 p-8 rounded-lg border border-dark-800">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              {t("pages.advertise.get_started_title")}
            </h2>
            <p className="mb-6">{t("pages.advertise.get_started_p")}</p>
            <MoreLink
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              {t("pages.advertise.get_started_btn")}
              <ArrowRight className="w-4 h-4" />
            </MoreLink>
          </section>
        </div>
      </div>
    </div>
  );
}
