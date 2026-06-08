"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/components/auth/AuthContext";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const isAdmin = user?.role === "admin";

  // Check sessionStorage for existing password verification
  useEffect(() => {
    const stored = sessionStorage.getItem("admin_password_verified");
    if (stored === "true") {
      setPasswordVerified(true);
    }
  }, []);

  // Handle password submit (fallback for non-authenticated admin access)
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    if (adminPassword && password === adminPassword) {
      sessionStorage.setItem("admin_password_verified", "true");
      setPasswordVerified(true);
      setPasswordError("");
    } else if (!adminPassword) {
      setPasswordVerified(true);
    } else {
      setPasswordError("Incorrect password");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Verifying access...</p>
        </div>
      </div>
    );
  }

  // If logged in and is admin, allow
  if (user && isAdmin) {
    return <>{children}</>;
  }

  // If not admin but logged in, show access denied
  if (user && !isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400 mb-6">You do not have administrator privileges.</p>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  // If not authenticated but password exists, show password form
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
  if (!passwordVerified && adminPassword) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="w-full max-w-md mx-auto p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
              AD
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-slate-400">Enter the admin password to continue</p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }}
              placeholder="Enter admin password..."
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 text-center"
              autoFocus
            />
            {passwordError && (
              <p className="text-red-400 text-sm text-center">{passwordError}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              Enter Admin Panel
            </button>
          </form>
          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
              Back to Site
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated, no password configured - redirect to home
  if (!user && !adminPassword) {
    router.push("/");
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Access Denied</p>
          <p className="text-slate-500 text-sm">Admin access requires authentication.</p>
        </div>
      </div>
    );
  }

  // Password verified (fallback)
  return <>{children}</>;
}
