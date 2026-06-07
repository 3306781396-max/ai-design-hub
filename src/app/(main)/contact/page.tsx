import type { Metadata } from "next";
import { ContactPageClient } from "@/components/common/ContactPageClient";

export const metadata: Metadata = {
  title: "Contact Us | AI Design Hub 2.0",
  description:
    "Get in touch with the AI Design Hub team. We'd love to hear from you.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
