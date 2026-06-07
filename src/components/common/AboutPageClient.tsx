"use client";

import { useTranslation } from "@/i18n/useTranslation";
import { MoreLink } from "@/components/ui/more-link";

export function AboutPageClient() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-dark-950 pt-32 pb-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 gradient-text">
          {t("pages.about.heading")}
        </h1>

        <div className="space-y-8 text-dark-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              {t("pages.about.mission_title")}
            </h2>
            <p className="mb-4">{t("pages.about.mission_p1")}</p>
            <p>{t("pages.about.mission_p2")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              {t("pages.about.what_we_do_title")}
            </h2>
            <p className="mb-4">{t("pages.about.what_we_do_p")}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-white">
                  {t("pages.about.tool_image")}
                </strong>{" "}
                - {t("pages.about.tool_image_desc")}
              </li>
              <li>
                <strong className="text-white">
                  {t("pages.about.tool_video")}
                </strong>{" "}
                - {t("pages.about.tool_video_desc")}
              </li>
              <li>
                <strong className="text-white">
                  {t("pages.about.tool_uiux")}
                </strong>{" "}
                - {t("pages.about.tool_uiux_desc")}
              </li>
              <li>
                <strong className="text-white">
                  {t("pages.about.tool_3d")}
                </strong>{" "}
                - {t("pages.about.tool_3d_desc")}
              </li>
              <li>
                <strong className="text-white">
                  {t("pages.about.tool_animation")}
                </strong>{" "}
                - {t("pages.about.tool_animation_desc")}
              </li>
              <li>
                <strong className="text-white">
                  {t("pages.about.tool_productivity")}
                </strong>{" "}
                - {t("pages.about.tool_productivity_desc")}
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              {t("pages.about.why_choose_title")}
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-dark-900 p-6 rounded-lg border border-dark-800">
                <h3 className="text-xl font-medium mb-2 text-white">
                  {t("pages.about.quality_title")}
                </h3>
                <p className="text-sm">
                  {t("pages.about.quality_desc")}
                </p>
              </div>
              <div className="bg-dark-900 p-6 rounded-lg border border-dark-800">
                <h3 className="text-xl font-medium mb-2 text-white">
                  {t("pages.about.updates_title")}
                </h3>
                <p className="text-sm">
                  {t("pages.about.updates_desc")}
                </p>
              </div>
              <div className="bg-dark-900 p-6 rounded-lg border border-dark-800">
                <h3 className="text-xl font-medium mb-2 text-white">
                  {t("pages.about.community_title")}
                </h3>
                <p className="text-sm">
                  {t("pages.about.community_desc")}
                </p>
              </div>
              <div className="bg-dark-900 p-6 rounded-lg border border-dark-800">
                <h3 className="text-xl font-medium mb-2 text-white">
                  {t("pages.about.free_title")}
                </h3>
                <p className="text-sm">
                  {t("pages.about.free_desc")}
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              {t("pages.about.team_title")}
            </h2>
            <p className="mb-4">{t("pages.about.team_p")}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t("pages.about.team_uiux")}</li>
              <li>{t("pages.about.team_dev")}</li>
              <li>{t("pages.about.team_ai")}</li>
              <li>{t("pages.about.team_pm")}</li>
              <li>{t("pages.about.team_content")}</li>
            </ul>
            <p className="mt-4">{t("pages.about.team_remote")}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              {t("pages.about.contact_title")}
            </h2>
            <p>
              {t("pages.about.contact_p")}{" "}
              <MoreLink href="/contact" className="text-primary hover:underline">
                {t("pages.about.contact_link")}
              </MoreLink>
              {" "}{t("pages.about.contact_p2")}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
