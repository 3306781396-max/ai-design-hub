"use client";

import { useTranslation } from "@/i18n/useTranslation";
import { ArrowRight } from "lucide-react";
import { MoreLink } from "@/components/ui/more-link";

export function ApiPageClient() {
  const { t } = useTranslation();

  return (
    <div className="space-y-12 text-dark-300 leading-relaxed">
      {/* Status Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🚧</span>
          <div>
            <h2 className="text-xl font-semibold text-amber-400 mb-2">
              {t("pages.api.status_badge")}
            </h2>
            <p className="text-amber-200/80">
              {t("pages.api.intro")}
            </p>
          </div>
        </div>
      </div>

      {/* Overview */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-white">
          {t("pages.api.overview_title")}
        </h2>
        <p className="mb-4">{t("pages.api.overview_p")}</p>
      </section>

      {/* Planned Endpoints */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-white">
          {t("pages.api.endpoints_title")}
        </h2>

        <div className="space-y-6">
          {/* GET /api/v1/tools */}
          <div className="bg-dark-900 rounded-lg border border-dark-800 overflow-hidden">
            <div className="bg-dark-800 px-6 py-3 flex items-center gap-3">
              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-medium rounded">
                GET
              </span>
              <code className="text-primary font-mono">{t("pages.api.endpoint1")}</code>
            </div>
          </div>

          {/* GET /api/v1/tools/[slug] */}
          <div className="bg-dark-900 rounded-lg border border-dark-800 overflow-hidden">
            <div className="bg-dark-800 px-6 py-3 flex items-center gap-3">
              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-medium rounded">
                GET
              </span>
              <code className="text-primary font-mono">{t("pages.api.endpoint2")}</code>
            </div>
          </div>

          {/* GET /api/v1/categories */}
          <div className="bg-dark-900 rounded-lg border border-dark-800 overflow-hidden">
            <div className="bg-dark-800 px-6 py-3 flex items-center gap-3">
              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-medium rounded">
                GET
              </span>
              <code className="text-primary font-mono">{t("pages.api.endpoint3")}</code>
            </div>
          </div>

          {/* GET /api/v1/tools/[slug]/reviews */}
          <div className="bg-dark-900 rounded-lg border border-dark-800 overflow-hidden">
            <div className="bg-dark-800 px-6 py-3 flex items-center gap-3">
              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-medium rounded">
                GET
              </span>
              <code className="text-primary font-mono">{t("pages.api.endpoint4")}</code>
            </div>
          </div>

          {/* GET /api/v1/search */}
          <div className="bg-dark-900 rounded-lg border border-dark-800 overflow-hidden">
            <div className="bg-dark-800 px-6 py-3 flex items-center gap-3">
              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-medium rounded">
                GET
              </span>
              <code className="text-primary font-mono">{t("pages.api.endpoint5")}</code>
            </div>
          </div>
        </div>
      </section>

      {/* Authentication */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-white">
          {t("pages.api.auth_title")}
        </h2>
        <p className="mb-4">{t("pages.api.auth_p")}</p>
      </section>

      {/* Rate Limiting */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-white">
          {t("pages.api.rate_limit_title")}
        </h2>
        <p className="mb-4">{t("pages.api.rate_limit_p")}</p>
      </section>

      {/* Stay Updated */}
      <section className="bg-dark-900 p-8 rounded-lg border border-dark-800 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-white">
          {t("pages.api.stay_updated")}
        </h2>
        <p className="text-dark-400 mb-6">
          {t("pages.api.stay_updated_p")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <MoreLink
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            {t("pages.contact.contact_btn")}
            <ArrowRight className="w-4 h-4" />
          </MoreLink>
        </div>
      </section>
    </div>
  );
}
