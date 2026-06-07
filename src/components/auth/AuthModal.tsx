"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  signUp,
  signIn,
  signInWithOAuth,
  resetPasswordForEmail,
  isSupabaseConfigured,
} from "@/lib/supabase";
import { Loader2, Mail, Lock, User, Github } from "lucide-react";
import { useTranslation } from "@/i18n";

// ============================================================
// Types
// ============================================================

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

// ============================================================
// AuthModal Component
// ============================================================

export function AuthModal({ open, onOpenChange, onSuccess }: AuthModalProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Reset form when modal opens/closes
  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFullName("");
    setError(null);
    setMessage(null);
    setLoading(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) resetForm();
    onOpenChange(newOpen);
  };

  // Email/Password Login or Register
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (!isSupabaseConfigured()) {
        throw new Error(t("auth.error_supabase_not_configured"));
      }

      if (mode === "register") {
        // Register
        const { data, error } = await signUp(email, password, {
          full_name: fullName,
        });
        if (error) throw error;
        setMessage(t("auth.success_register"));
      } else {
        // Login
        const { data, error } = await signIn(email, password);
        if (error) throw error;
        handleSuccess();
      }
    } catch (err: any) {
      setError(err.message || t("auth.error_generic"));
    } finally {
      setLoading(false);
    }
  };

  // OAuth Login (Google, GitHub)
  const handleOAuth = async (provider: "google" | "github") => {
    setError(null);
    setLoading(true);
    try {
      if (!isSupabaseConfigured()) {
        throw new Error(t("auth.error_supabase_not_configured"));
      }
      const { data, error } = await signInWithOAuth(provider);
      if (error) throw error;
      // OAuth will redirect, so we don't handle success here
    } catch (err: any) {
      setError(err.message || t("auth.error_generic"));
      setLoading(false);
    }
  };

  // Forgot password handler
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (!isSupabaseConfigured()) {
        throw new Error(t("auth.error_supabase_not_configured"));
      }
      const { success, message } = await resetPasswordForEmail(email);
      if (!success) throw new Error(message);
      setMessage(t("auth.reset_email_sent") || "Password reset email sent! Check your inbox.");
    } catch (err: any) {
      setError(err.message || t("auth.error_generic"));
    } finally {
      setLoading(false);
    }
  };

  // Success handler
  const handleSuccess = () => {
    resetForm();
    onOpenChange(false);
    onSuccess?.();
  };

  // Switch mode
  const switchMode = (newMode: "login" | "register") => {
    setMode(newMode);
    setError(null);
    setMessage(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[440px] bg-dark-800 border-dark-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {mode === "login" ? t("auth.login") || "Login" : t("auth.register") || "Create Account"}
          </DialogTitle>
          <DialogDescription className="text-center text-dark-400 mt-2">
            {mode === "login"
              ? t("auth.login_desc") || "Welcome back! Please login to your account."
              : t("auth.register_desc") || "Create your account to save favorites and write reviews."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuth("google")}
              disabled={loading}
              className="border-dark-600 hover:bg-dark-700 text-white"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.11-3.11C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuth("github")}
              disabled={loading}
              className="border-dark-600 hover:bg-dark-700 text-white"
            >
              <Github className="w-5 h-5 mr-2" />
              GitHub
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-dark-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-dark-800 px-2 text-dark-400">
                {t("auth.or_continue") || "Or continue with"}
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={mode === "forgot" ? handleForgotPassword : handleSubmit} className="space-y-4">
            {/* Full Name (register only) */}
            {mode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="full-name" className="text-dark-300">
                  {t("auth.full_name") || "Full Name"}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                  <Input
                    id="full-name"
                    type="text"
                    placeholder={t("auth.full_name_placeholder") || "John Doe"}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 bg-dark-900 border-dark-700 text-white placeholder:text-dark-500"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-dark-300">
                {t("auth.email") || "Email"}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t("auth.email_placeholder") || "you@example.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-dark-900 border-dark-700 text-white placeholder:text-dark-500"
                  required
                />
              </div>
            </div>

            {/* Password (login & register only) */}
            {mode !== "forgot" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-dark-300">
                  {t("auth.password") || "Password"}
                </Label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => { setMode("forgot"); setError(null); setMessage(null); }}
                    className="text-xs text-primary-400 hover:text-primary-300"
                  >
                    {t("auth.forgot_password") || "Forgot password?"}
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder={t("auth.password_placeholder") || "••••••••"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-dark-900 border-dark-700 text-white placeholder:text-dark-500"
                  required
                  minLength={6}
                />
              </div>
            </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Success Message */}
            {message && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                {message}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {t("auth.loading") || "Please wait..."}
                </>
              ) : mode === "login" ? (
                t("auth.login_button") || "Login"
              ) : mode === "register" ? (
                t("auth.register_button") || "Create Account"
              ) : (
                t("auth.send_reset") || "Send Reset Email"
              )}
            </Button>
          </form>

          {/* Switch Mode */}
          <div className="text-center text-sm text-dark-400">
            {mode === "login" ? (
              <>
                {t("auth.no_account") || "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => switchMode("register")}
                  className="text-primary-400 hover:text-primary-300 font-medium"
                >
                  {t("auth.register_link") || "Register"}
                </button>
              </>
            ) : mode === "register" ? (
              <>
                {t("auth.has_account") || "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="text-primary-400 hover:text-primary-300 font-medium"
                >
                  {t("auth.login_link") || "Login"}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => { setMode("login"); setError(null); setMessage(null); }}
                  className="text-primary-400 hover:text-primary-300 font-medium"
                >
                  ← {t("auth.back_to_login") || "Back to Login"}
                </button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
