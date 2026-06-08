"use client";

import { useAuth } from "@/hooks/use-auth";
import { Suspense } from "react";
import ProfileClient from "./ProfileClient";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          请先登录
        </h1>
        <p className="mb-6 max-w-md text-gray-500 dark:text-gray-400">
          登录后即可查看个人主页。
        </p>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      }
    >
      <ProfileClient user={user} />
    </Suspense>
  );
}
