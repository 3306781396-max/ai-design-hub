"use client";

import { useTranslation } from "@/i18n/useTranslation";

export function TermsPageClient() {
  const { t } = useTranslation();
  const p = (key: string) => t(`pages.terms.${key}`);

  return (
    <div className="min-h-screen bg-dark-950 pt-32 pb-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 gradient-text">{p("heading")}</h1>
        <p className="text-dark-400 text-sm mb-8">{p("effective_date")}</p>
        <div className="space-y-8 text-dark-300 leading-relaxed">
          <p>{p("intro")}</p>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((n) => (
            <section key={n}>
              <h2 className="text-xl font-semibold mb-3 text-white">{p(`s${n}_title`)}</h2>
              {n === 3 ? (
                <>
                  <p className="mb-2">{p(`s${n}_p`)}</p>
                  <ul className="list-disc pl-6 space-y-1">
                    {[1, 2, 3, 4, 5, 6].map((i) => <li key={i}>{p(`s${n}_li${i}`)}</li>)}
                  </ul>
                </>
              ) : (
                <p>{p(`s${n}_p`)}</p>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
