"use client";

import { useLanguage } from "./LanguageProvider";

/**
 * Convenience hook for translations.
 * Usage: const { t, locale, setLocale } = useTranslation();
 *        <h1>{t("home.hero.heading")}</h1>
 *        <p>{t("tool_detail.about", { name: "Midjourney" })}</p>
 */
export function useTranslation() {
  return useLanguage();
}
