"use client";

import { useTranslation } from "@/i18n";

interface Props {
  toolsCount: number;
}

export function ToolsPageHeader({ toolsCount }: Props) {
  const { t } = useTranslation();

  return (
    <div className="mb-10">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
        {t("tools.page_title")}
      </h1>
      <p className="text-dark-400 text-lg">
        {t("tools.page_subtitle", { count: toolsCount })}
      </p>
    </div>
  );
}
