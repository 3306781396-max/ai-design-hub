import type { Metadata } from "next";
import { FaqPageClient } from "@/components/common/FaqPageClient";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | AI Design Hub 2.0",
  description:
    "Find answers to common questions about AI Design Hub, AI design tools, and how to use our directory.",
};

export default function FAQPage() {
  return <FaqPageClient />;
}
