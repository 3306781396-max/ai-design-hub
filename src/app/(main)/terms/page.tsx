import type { Metadata } from "next";
import { TermsPageClient } from "@/components/common/TermsPageClient";

export const metadata: Metadata = {
  title: "Terms of Service | AI Design Hub 2.0",
  description: "Terms of Service for AI Design Hub. Read our terms and conditions for using our website and services.",
};

export default function TermsPage() {
  return <TermsPageClient />;
}
