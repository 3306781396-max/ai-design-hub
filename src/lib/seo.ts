import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
};

/**
 * Merge tags and explicit keywords, deduplicate, and optionally
 * weight by frequency for tag cloud / hot search usage.
 */
export function getKeywords(
  tags: string[] = [],
  keywords: string[] = [],
): string[] {
  const merged = new Map<string, number>();
  for (const k of [...tags, ...keywords]) {
    const key = k.toLowerCase().trim();
    if (key) merged.set(key, (merged.get(key) || 0) + 1);
  }
  return Array.from(merged.keys());
}

export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  ogImage = "/og-image.png",
  canonical,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  section,
}: Props): Metadata {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://ai-design-hub.vercel.app";
  const fullTitle = `${title} | AI Design Hub`;
  const fullOgImage = ogImage.startsWith("http")
    ? ogImage
    : `${baseUrl}${ogImage}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(", "),
    authors: authors ? [{ name: authors[0] }] : [{ name: "AI Design Hub" }],
    creator: "AI Design Hub",
    publisher: "AI Design Hub",
    metadataBase: new URL(baseUrl),
    alternates: canonical
      ? { canonical: canonical.startsWith("http") ? canonical : `${baseUrl}${canonical}` }
      : undefined,
    openGraph: {
      type: type === "article" ? "article" : "website",
      locale: "en_US",
      url: canonical || baseUrl,
      title: fullTitle,
      description,
      siteName: "AI Design Hub",
      images: [
        {
          url: fullOgImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors,
        section,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [fullOgImage],
      creator: "@aidesignhub",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  };
}
