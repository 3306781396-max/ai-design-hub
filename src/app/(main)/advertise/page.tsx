import type { Metadata } from "next";
import { AdvertisePageClient } from "@/components/common/AdvertisePageClient";

export const metadata: Metadata = {
  title: "Advertise With Us | AI Design Hub 2.0",
  description:
    "Advertise your AI design tool to thousands of designers, developers, and creators on AI Design Hub.",
};

export default function AdvertisePage() {
  return <AdvertisePageClient />;
}
