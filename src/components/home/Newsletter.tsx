"use client";

import { useState, type FormEvent } from "react";
import { useTranslation } from "@/i18n";
import { cn } from "@/lib/utils";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { subscribeToNewsletter } from "@/lib/supabase";

type SubmissionStatus = "idle" | "loading" | "success" | "error";

export default function Newsletter() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatus("error");
      setErrorMessage(t("home.newsletter.error_empty"));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("error");
      setErrorMessage(t("home.newsletter.error_invalid"));
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const result = await subscribeToNewsletter(email, "", "zh");
      if (result.success) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
        setErrorMessage(result.message || t("home.newsletter.error_general"));
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || t("home.newsletter.error_general"));
    }
  };

  return (
    <section id="newsletter" className="relative w-full py-24">
      <div className="container mx-auto px-4">
        <div className="relative rounded-3xl border border-white/[0.07] bg-[#0e0e10] px-6 py-14 text-center sm:px-12">
        <h2 className="font-display text-2xl font-semibold text-white sm:text-4xl">
          {t("home.newsletter.title")}
        </h2>
        <p className="mt-3 text-sm text-white/50 max-w-md mx-auto">
          {t("home.newsletter.description")}
        </p>

        {status === "success" ? (
          <div className="mt-8 flex items-center justify-center gap-2 text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-medium">
              {t("home.newsletter.success")}
            </span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-3"
          >
            <div className="relative w-full sm:max-w-sm">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                placeholder={t("home.newsletter.email_placeholder")}
                disabled={status === "loading"}
                className={cn(
                  "h-12 w-full rounded-full border bg-white/[0.04] px-5 text-sm text-white placeholder-white/35 outline-none transition-colors",
                  status === "error"
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-white/10 focus:border-white/30"
                )}
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-medium text-black transition-colors hover:bg-white/85 disabled:opacity-50 sm:w-auto"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("home.newsletter.subscribing")}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  {t("home.newsletter.subscribe")}
                </>
              )}
            </button>
          </form>
        )}

        {status === "error" && errorMessage && (
          <div className="mt-4 flex items-center justify-center gap-2 text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{errorMessage}</span>
          </div>
        )}

        <p className="mt-6 text-xs text-white/35">
          {t("home.newsletter.footer")}
        </p>
        </div>
      </div>
    </section>
  );
}
