import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { LanguageProvider } from "@/i18n";
import { LangUpdater } from "@/components/layout/LangUpdater";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import type { ReactNode } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "AI Design Hub 2.0 - Discover the Best AI Design Tools",
    template: "%s | AI Design Hub 2.0",
  },
  description:
    "The ultimate AI design tools directory. Discover, compare, and find the best AI tools for image generation, video creation, UI/UX design, 3D modeling, and more.",
  keywords: [
    "AI design tools",
    "AI image generator",
    "AI video generator",
    "AI UI tools",
    "Midjourney alternative",
    "Stable Diffusion",
    "AI 3D modeling",
    "AIGC",
    "design resources",
  ],
  authors: [{ name: "AI Design Hub" }],
  creator: "AI Design Hub",
  publisher: "AI Design Hub",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://ai-design-hub.vercel.app"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "AI Design Hub 2.0 - Discover the Best AI Design Tools",
    description:
      "The ultimate AI design tools directory. Discover, compare, and find the best AI tools for image generation, video creation, UI/UX design, and more.",
    siteName: "AI Design Hub 2.0",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Design Hub 2.0",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Design Hub 2.0 - Discover the Best AI Design Tools",
    description:
      "The ultimate AI design tools directory. Discover, compare, and find the best AI tools for image generation, video creation, UI/UX design, and more.",
    images: ["/og-image.png"],
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
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics (GA4) */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="AI Design Hub Blog RSS"
          href="/feed.xml"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "AI Design Hub 2.0",
              url: process.env.NEXT_PUBLIC_SITE_URL || "https://ai-design-hub.vercel.app",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate:
                    process.env.NEXT_PUBLIC_SITE_URL +
                    "/tools?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col bg-white text-gray-900 dark:bg-dark-950 dark:text-white`}>
        <ThemeProvider>
          <LanguageProvider>
            <LangUpdater />
            <Header />
            <main className="flex-1">
              <ErrorBoundary>{children}</ErrorBoundary>
            </main>
            <Footer />
            <ScrollToTop />
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
