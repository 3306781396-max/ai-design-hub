import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // Conditional static export for CloudStudio deployment
  // Set STATIC_EXPORT=true to build static HTML for CloudStudio
  ...(isStaticExport ? { output: "export" as const } : {}),
};

export default nextConfig;
