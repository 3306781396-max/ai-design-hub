"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // NextAuth handles OAuth callbacks automatically via the API route
    // This page is just a fallback for manual redirects
    const timer = setTimeout(() => router.push("/"), 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
        <p className="text-lg text-muted-foreground">
          Redirecting...
        </p>
      </div>
    </div>
  );
}
