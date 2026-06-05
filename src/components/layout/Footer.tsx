"use client";

import Link from "next/link";
import { useTranslation } from "@/i18n";
import { Sparkles, Twitter, Github, Linkedin, Youtube, Rss } from "lucide-react";

const platformLinkKeys = [
  { key: "footer.platform_links.about", href: "/about" },
  { key: "footer.platform_links.contact", href: "/contact" },
  { key: "footer.platform_links.submit_tool", href: "/submit" },
  { key: "footer.platform_links.advertise", href: "/advertise" },
] as const;

const categoryLinkKeys = [
  { key: "category.image_tools", href: "/category/ai-image-tools" },
  { key: "category.video_tools", href: "/category/ai-video-tools" },
  { key: "category.ui_ux_tools", href: "/category/ai-ui-tools" },
  { key: "category.animation_tools", href: "/category/ai-animation-tools" },
  { key: "category.3d_tools", href: "/category/ai-3d-tools" },
  { key: "category.productivity_tools", href: "/category/ai-productivity-tools" },
] as const;

const resourceLinkKeys = [
  { key: "footer.resources_links.blog", href: "/blog" },
  { key: "footer.resources_links.newsletter", href: "#newsletter" },
  { key: "footer.resources_links.api", href: "/api" },
  { key: "footer.resources_links.faq", href: "/faq" },
] as const;

const legalLinkKeys = [
  { key: "footer.legal_links.privacy", href: "/privacy" },
  { key: "footer.legal_links.terms", href: "/terms" },
  { key: "footer.legal_links.cookies", href: "/cookies" },
] as const;

const socialLinks = [
  { label: "Twitter", href: "https://twitter.com", icon: Twitter },
  { label: "GitHub", href: "https://github.com", icon: Github },
  { label: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
  { label: "YouTube", href: "https://youtube.com", icon: Youtube },
  { label: "RSS", href: "/feed.xml", icon: Rss },
] as const;

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 dark:bg-gray-950 bg-gray-50 dark:border-white/10 border-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Top: Logo + Social */}
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-cyan-400" />
            <span className="text-lg font-bold dark:text-white text-gray-900">
              AI Design{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Hub
              </span>
            </span>
          </div>
          <p className="text-sm dark:text-gray-400 text-gray-500 max-w-xs text-center sm:text-right">
            {t("footer.tagline")}
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg dark:text-gray-400 text-gray-500 transition-colors dark:hover:bg-white/5 hover:bg-gray-200 dark:hover:text-white hover:text-gray-900"
                aria-label={social.label}
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px dark:bg-white/5 bg-gray-200" />

        {/* Columns */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Platform */}
          <div>
            <h3 className="text-sm font-semibold dark:text-white text-gray-900 mb-4">
              {t("footer.platform")}
            </h3>
            <ul className="space-y-3">
              {platformLinkKeys.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm dark:text-gray-400 text-gray-500 transition-colors dark:hover:text-white hover:text-gray-900"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold dark:text-white text-gray-900 mb-4">
              {t("footer.categories")}
            </h3>
            <ul className="space-y-3">
              {categoryLinkKeys.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm dark:text-gray-400 text-gray-500 transition-colors dark:hover:text-white hover:text-gray-900"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold dark:text-white text-gray-900 mb-4">
              {t("footer.resources")}
            </h3>
            <ul className="space-y-3">
              {resourceLinkKeys.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm dark:text-gray-400 text-gray-500 transition-colors dark:hover:text-white hover:text-gray-900"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold dark:text-white text-gray-900 mb-4">
              {t("footer.legal")}
            </h3>
            <ul className="space-y-3">
              {legalLinkKeys.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm dark:text-gray-400 text-gray-500 transition-colors dark:hover:text-white hover:text-gray-900"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t dark:border-white/5 border-gray-200 pt-8 text-center">
          <p className="text-sm dark:text-gray-500 text-gray-400">
            {t("footer.copyright", { year })}
          </p>
        </div>
      </div>
    </footer>
  );
}
