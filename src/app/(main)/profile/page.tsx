import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import ProfileClient from "./ProfileClient";

// Server Component — checks auth on the server, no flash
export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      }
    >
      <ProfileClient user={session.user} />
    </Suspense>
  );
}
