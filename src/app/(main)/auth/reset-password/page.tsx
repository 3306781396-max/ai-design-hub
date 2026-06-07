"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updatePassword, isSupabaseConfigured } from "@/lib/supabase";
import { useTranslation } from "@/i18n/useTranslation";
import { CheckCircle, AlertCircle, Lock } from "lucide-react";

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      setError(t("auth.error_supabase_not_configured") || "Supabase not configured");
    }
  }, [t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError(t("auth.error_password_length") || "Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError(t("auth.error_password_mismatch") || "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { success, message } = await updatePassword(password);
      if (!success) throw new Error(message);
      setSuccess(true);
      setTimeout(() => router.push("/"), 2000);
    } catch (err: any) {
      setError(err.message || t("auth.error_generic") || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

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
            <p className="text-dark-400 text-sm">
              {t("auth.reset_password_desc") || "Enter your new password below."}
            </p>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center py-6">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <p className="text-white font-medium">
                  {t("auth.password_updated") || "Password updated!"}
                </p>
                <p className="text-dark-400 text-sm mt-2">
                  {t("auth.redirecting") || "Redirecting to home..."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-dark-300">
                    {t("auth.new_password") || "New Password"}
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-dark-800 border-dark-600 text-white"
                    required
                    minLength={6}
                  />
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-dark-300">
                    {t("auth.confirm_password") || "Confirm Password"}
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-dark-800 border-dark-600 text-white"
                    required
                    minLength={6}
                  />
                </div>

                {/* Error */}
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary-500 to-accent-500 hover:opacity-90"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t("auth.updating") || "Updating..."}
                    </span>
                  ) : (
                    t("auth.update_password") || "Update Password"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
