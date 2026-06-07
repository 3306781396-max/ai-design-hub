"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import { Search } from "lucide-react";

interface KeywordsCloudProps {
  keywords: string[];
}

export function KeywordsCloud({ keywords }: KeywordsCloudProps) {
  const router = useRouter();
  const { t } = useTranslation();

  // Count keyword frequency and pick top 20
  const hotKeywords = useMemo(() => {
    const freq = new Map<string, number>();
    for (const k of keywords) {
      freq.set(k, (freq.get(k) || 0) + 1);
    }
    return Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);
  }, [keywords]);

  if (hotKeywords.length === 0) return null;

  const maxFreq = hotKeywords[0]?.[1] ?? 1;

  const handleClick = (keyword: string) => {
    router.push(`/tools?q=${encodeURIComponent(keyword)}`);
  };

  return (
    <div className="mb-8">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-dark-400">
        <Search className="h-3.5 w-3.5" />
        {t("tools.hot_searches") || "Hot Searches"}
      </h3>
      <div className="flex flex-wrap gap-2">
        {hotKeywords.map(([keyword, freq]) => {
          // Scale size from 0.75 to 1.1 based on frequency
          const scale = 0.75 + (freq / maxFreq) * 0.35;
          const sizePx = `${Math.round(scale * 12)}px`;

          return (
            <button
              key={keyword}
              onClick={() => handleClick(keyword)}
              className="rounded-full border border-dark-700 bg-dark-800/50 px-3 py-1 text-dark-300 transition-all hover:border-indigo-500/50 hover:bg-dark-800 hover:text-white cursor-pointer"
              style={{ fontSize: sizePx }}
            >
              {keyword}
            </button>
          );
        })}
      </div>
    </div>
  );
}
