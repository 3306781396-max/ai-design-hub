"use client";

import { useTranslation } from "@/i18n/useTranslation";
import { ChevronDown } from "lucide-react";
import { MoreLink } from "@/components/ui/more-link";

const FAQ_IDS = Array.from({ length: 12 }, (_, i) => i + 1);

export function FaqPageClient() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-dark-950 pt-32 pb-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-4 gradient-text">
          {t("pages.faq.heading")}
        </h1>
        <p className="text-dark-400 mb-12 text-lg">
          {t("pages.faq.still_p1")}{" "}
          <MoreLink href="/contact" className="text-primary hover:underline">
            {t("pages.faq.contact_btn")}
          </MoreLink>
          .
        </p>

        <div className="space-y-4">
          {FAQ_IDS.map((id) => (
            <details
              key={id}
              className="group bg-dark-900 rounded-lg border border-dark-800 overflow-hidden"
            >
              <summary className="flex items-center justify-between cursor-pointer p-6 hover:bg-dark-800/50 transition-colors list-none">
                <h3 className="text-lg font-semibold text-white pr-4">
                  {t(`pages.faq.q${id}_q`)}
                </h3>
                <ChevronDown className="w-5 h-5 text-dark-400 group-open:rotate-180 transition-transform flex-shrink-0" />
              </summary>
              <div className="px-6 pb-6 pt-0">
                <p className="text-dark-300 leading-relaxed">
                  {t(`pages.faq.q${id}_a`)}
                </p>
              </div>
            </details>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="mt-12 bg-dark-900 p-8 rounded-lg border border-dark-800 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-white">
            {t("pages.faq.still_questions")}
          </h2>
          <p className="text-dark-400 mb-6">
            {t("pages.faq.still_p1")}
          </p>
          <MoreLink
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            {t("pages.faq.contact_btn")}
          </MoreLink>
        </div>
      </div>
    </div>
  );
}
