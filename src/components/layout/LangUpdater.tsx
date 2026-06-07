"use client";

import { useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";

/** Dynamically updates <html lang="..."> for SEO and accessibility. */
export function LangUpdater() {
  const { locale } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
