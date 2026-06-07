import type { Metadata } from "next";
import { PrivacyPageClient } from "@/components/common/PrivacyPageClient";

export const metadata: Metadata = {
  title: "Privacy Policy | AI Design Hub 2.0",
  description:
    "Privacy Policy for AI Design Hub. Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return <PrivacyPageClient />;
}
