"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

type Locale = "zh" | "en" | "ja" | "ko";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

// Lazy load translations
const translationCache: Record<string, Record<string, unknown> | null> = {
  zh: null,
  en: null,
  ja: null,
  ko: null,
};

async function loadTranslations(locale: string): Promise<Record<string, unknown>> {
  if (translationCache[locale]) {
    return translationCache[locale]!;
  }
  const mod = await import(`./translations/${locale}.json`);
  translationCache[locale] = mod.default;
  return mod.default;
}

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current == null || typeof current !== "object") return path;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : path;
}

const STORAGE_KEY = "ai-design-hub-locale";

function detectBrowserLocale(): Locale {
  if (typeof window === "undefined") return "zh";
  try {
    const lang = navigator.language.toLowerCase();
    if (lang.startsWith("zh")) return "zh";
    if (lang.startsWith("ja")) return "ja";
    if (lang.startsWith("ko")) return "ko";
    return "en";
  } catch {
    return "zh";
  }
}

function getStoredLocale(): Locale {
  if (typeof window === "undefined") return "zh";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "zh" || stored === "en" || stored === "ja" || stored === "ko") return stored;
  } catch {
    // localStorage not available
  }
  return detectBrowserLocale();
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("zh");
  const [translations, setTranslations] = useState<Record<string, unknown>>({});
  const [loaded, setLoaded] = useState(false);

  // Load translations on mount
  useEffect(() => {
    const stored = getStoredLocale();
    setLocaleState(stored);
    loadTranslations(stored).then((data) => {
      setTranslations(data);
      setLoaded(true);
    });
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
    } catch {
      // localStorage not available
    }
    loadTranslations(newLocale).then((data) => {
      setTranslations(data);
    });
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      let value = getNestedValue(translations, key);

      // Interpolate params
      if (params) {
        for (const [paramKey, paramValue] of Object.entries(params)) {
          value = value.replace(new RegExp(`\\{${paramKey}\\}`, "g"), String(paramValue));
        }
      }

      return value;
    },
    [translations]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {loaded ? children : null}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
