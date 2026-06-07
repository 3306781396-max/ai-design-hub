"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/i18n/useTranslation";
import { Lock, ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card className="bg-dark-900 border-dark-700">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                <Lock className="w-5 h-5 text-primary-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                {t("auth.reset_password") || "Reset Password"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6 space-y-4">
              <p className="text-dark-300">
                Password reset is handled through your login provider.
              </p>
              <p className="text-dark-400 text-sm">
                If you logged in with GitHub, please reset your password on GitHub.
              </p>
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="mt-4 border-dark-600 text-white hover:bg-dark-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
