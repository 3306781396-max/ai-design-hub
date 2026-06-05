import type { Metadata } from "next";

const SITE_NAME = "AI Design Hub";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aidesignhub.com";

interface MetaTagsOptions {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

export function generateMetaTags({
  title,
  description,
  keywords = [],
  ogImage,
  canonical,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
}: MetaTagsOptions): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const resolvedCanonical = canonical
    ? new URL(canonical, SITE_URL).toString()
    : undefined;
  const resolvedOgImage = ogImage
    ? ogImage.startsWith("http")
      ? ogImage
      : new URL(ogImage, SITE_URL).toString()
    : `${SITE_URL}/og-default.png`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(", "),
    authors: author ? [{ name: author }] : [{ name: SITE_NAME }],
    creator: author || SITE_NAME,
    publisher: SITE_NAME,
    metadataBase: new URL(SITE_URL),
    alternates: resolvedCanonical
      ? { canonical: resolvedCanonical }
      : undefined,
    openGraph: {
      title: fullTitle,
      description,
      url: resolvedCanonical,
      siteName: SITE_NAME,
      type,
      ...(type === "article"
        ? {
            publishedTime,
            modifiedTime,
            authors: author ? [author] : undefined,
          }
        : {}),
      images: resolvedOgImage
        ? [
            {
              url: resolvedOgImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: resolvedOgImage ? [resolvedOgImage] : undefined,
      creator: author ? `@${author}` : undefined,
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
  };
}
