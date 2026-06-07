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
import { Loader2, Mail, Lock, User, Github } from "lucide-react";
import { useTranslation } from "@/i18n";
import { useAuth } from "@/hooks/use-auth";

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
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const { signIn, signUp, signInWithGitHub } = useAuth();

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

  // Email/Password Login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const result = mode === "login"
        ? await signIn(email, password)
        : await signUp(email, password);

      if (!result.success) {
        setError(result.error || t("auth.invalid_credentials") || "Invalid email or password");
        setLoading(false);
        return;
      }

      // Success
      handleSuccess();
    } catch (err: any) {
      setError(err.message || t("auth.error_generic") || "An error occurred");
      setLoading(false);
    }
  };

  // GitHub OAuth Login
  const handleGitHub = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGitHub();
      // This will redirect to GitHub, so we don't need to handle success here
    } catch (err: any) {
      setError(err.message || t("auth.error_generic") || "An error occurred");
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
          {/* GitHub OAuth Button */}
          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={handleGitHub}
              disabled={loading}
              className="w-full border-dark-600 hover:bg-dark-700 text-white h-12"
            >
              <Github className="w-5 h-5 mr-2" />
              {t("auth.login_with_github") || "Continue with GitHub"}
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-dark-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-dark-800 px-2 text-dark-400">
                {t("auth.or_continue") || "Or with email"}
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-dark-300">
                {t("auth.password") || "Password"}
              </Label>
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
              ) : (
                t("auth.register_button") || "Create Account"
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
            ) : (
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
            )}
          </div>

          {/* Note about GitHub login */}
          {mode === "register" && (
            <p className="text-xs text-dark-500 text-center mt-2">
              Tip: Use GitHub login for the fastest registration — no password needed!
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
