import type { Metadata } from "next";
import { ApiPageClient } from "@/components/common/ApiPageClient";

export const metadata: Metadata = {
  title: "API Documentation | AI Design Hub 2.0",
  description:
    "API documentation for AI Design Hub. Learn about our planned API endpoints and how to integrate with our platform.",
};

export default function ApiPage() {
  return (
    <div className="min-h-screen bg-dark-950 pt-32 pb-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 gradient-text">
          API Documentation
        </h1>
        <ApiPageClient />
      </div>
    </div>
  );
}
