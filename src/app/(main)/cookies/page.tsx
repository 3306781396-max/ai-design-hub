import type { Metadata } from "next";
import { CookiesPageClient } from "@/components/common/CookiesPageClient";

export const metadata: Metadata = {
  title: "Cookie Policy | AI Design Hub 2.0",
  description: "Cookie Policy for AI Design Hub. Learn about how we use cookies and similar technologies on our website.",
};

export default function CookiesPage() {
  return <CookiesPageClient />;
}
