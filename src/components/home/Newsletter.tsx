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
    <section id="newsletter" className="relative w-full rounded-2xl p-[2px] overflow-hidden">
      {/* Animated gradient border */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-cyan-500 to-indigo-500 bg-[length:200%_100%] animate-[gradient_3s_ease_infinite] rounded-2xl" />

      <div className="relative rounded-2xl dark:bg-gray-950 bg-gray-50 px-6 py-12 sm:px-12 sm:py-16 text-center">
        <h2 className="text-2xl font-bold dark:text-white text-gray-900 sm:text-3xl">
          {t("home.newsletter.title")}
        </h2>
        <p className="mt-3 text-sm dark:text-gray-400 text-gray-500 max-w-md mx-auto">
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
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-0"
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
                  "h-11 w-full rounded-l-xl sm:rounded-r-none rounded-xl border dark:bg-gray-900 bg-white px-4 text-sm dark:text-white text-gray-900 placeholder-gray-500 outline-none transition-colors sm:rounded-l-xl sm:rounded-r-none",
                  status === "error"
                    ? "border-red-500/50 focus:border-red-500"
                    : "dark:border-white/10 border-gray-200 focus:border-indigo-500"
                )}
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl sm:rounded-l-none sm:rounded-r-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 text-sm font-semibold dark:text-white text-gray-900 transition-opacity hover:opacity-90 disabled:opacity-50 sm:w-auto"
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

        <p className="mt-6 text-xs text-gray-600">
          {t("home.newsletter.footer")}
        </p>
      </div>

      {/* Keyframe for gradient animation */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  );
}
