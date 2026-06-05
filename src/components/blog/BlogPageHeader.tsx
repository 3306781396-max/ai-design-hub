"use client";

import { useTranslation } from "@/i18n";

interface Props {
  title: string;
  subtitle: string;
}

export function BlogPageHeader({ title, subtitle }: Props) {
  const { t } = useTranslation();

  return (
    <div className="mb-12">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
        {t("blog.page_title")}
      </h1>
      <p className="text-dark-400 text-lg max-w-2xl">
        {t("blog.page_subtitle")}
      </p>
    </div>
  );
}
