import type { Metadata } from "next";
import { HeroBanner } from "@/components/home/HeroBanner";
import { TrendingTools } from "@/components/home/ToolSections";
import { CategoriesPreview } from "@/components/home/CategoriesPreview";
import { FeaturedTools } from "@/components/home/ToolSections";
import { LatestBlogPosts } from "@/components/home/LatestBlogPosts";
import Newsletter from "@/components/home/Newsletter";
import { CTASection } from "@/components/home/CTASection";

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
