import type { Metadata } from "next";
import { AboutPageClient } from "@/components/common/AboutPageClient";

export const metadata: Metadata = {
  title: "About Us | AI Design Hub 2.0",
  description:
    "Learn about AI Design Hub - the comprehensive directory of AI-powered design tools helping designers, developers, and creators discover the best AI tools.",
};

export default function AboutPage() {
  return <AboutPageClient />;
}
