"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function handleCallback() {
      try {
        const code = searchParams.get("code");
        const error = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        if (error) {
          setStatus("error");
          setMessage(errorDescription || t("auth.callback_auth_failed"));
          setTimeout(() => router.push("/"), 3000);
          return;
        }

        if (!code) {
          setStatus("error");
          setMessage(t("auth.callback_no_code"));
          setTimeout(() => router.push("/"), 3000);
          return;
        }

        if (!supabase) {
          setStatus("error");
          setMessage(t("auth.callback_no_client"));
          setTimeout(() => router.push("/"), 3000);
          return;
        }

        const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

        if (sessionError) {
          setStatus("error");
          setMessage(sessionError.message || t("auth.callback_login_failed"));
          setTimeout(() => router.push("/"), 3000);
          return;
        }

        setStatus("success");
        setMessage(t("auth.callback_success"));
        setTimeout(() => router.push("/profile"), 1500);
      } catch (err: any) {
        setStatus("error");
        setMessage(err?.message || t("auth.callback_error"));
        setTimeout(() => router.push("/"), 3000);
      }
    }

    handleCallback();
  }, [searchParams, router, t]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        {status === "loading" && (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
            <p className="text-lg text-muted-foreground">
              {message || t("auth.callback_processing")}
            </p>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
            <p className="text-lg text-green-600">{message}</p>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle className="w-12 h-12 text-red-500 mx-auto" />
            <p className="text-lg text-red-600">{message}</p>
            <p className="text-sm text-muted-foreground">
              {t("auth.callback_redirecting")}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
