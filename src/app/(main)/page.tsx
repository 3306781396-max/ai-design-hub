import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { HeroBanner } from "@/components/home/HeroBanner";
import { TrendingTools } from "@/components/home/ToolSections";

// Lazy load non-critical below-fold components to reduce initial JS bundle
const CategoriesPreview = dynamic(
  () => import("@/components/home/CategoriesPreview").then((m) => ({ default: m.CategoriesPreview })),
  { loading: () => <SectionSkeleton /> },
);
const FeaturedTools = dynamic(
  () => import("@/components/home/ToolSections").then((m) => ({ default: m.FeaturedTools })),
  { loading: () => <SectionSkeleton /> },
);
const LatestBlogPosts = dynamic(
  () => import("@/components/home/LatestBlogPosts").then((m) => ({ default: m.LatestBlogPosts })),
  { loading: () => <SectionSkeleton /> },
);
const Newsletter = dynamic(
  () => import("@/components/home/Newsletter"),
  { loading: () => <SectionSkeleton /> },
);
const CTASection = dynamic(
  () => import("@/components/home/CTASection").then((m) => ({ default: m.CTASection })),
  { loading: () => <SectionSkeleton /> },
);

function SectionSkeleton() {
  return (
    <div className="py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="h-8 w-48 rounded-lg bg-dark-800 animate-pulse mb-6" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 rounded-xl bg-dark-800 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "AI Design Hub 2.0 - Discover the Best AI Design Tools",
  description:
    "The ultimate AI design tools directory. Discover, compare, and find the best AI tools for image generation, video creation, UI/UX design, 3D modeling, and more.",
};

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <TrendingTools />
      <CategoriesPreview />
      <FeaturedTools />
      <LatestBlogPosts />
      <Newsletter />
      <CTASection />
    </>
  );
}
