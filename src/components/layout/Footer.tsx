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
    <footer className="border-t border-white/[0.06] bg-[#0a0a0b]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        {/* Top: Logo + Social */}
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-display text-base font-semibold uppercase tracking-[0.3em] text-white">
              AI Design Hub
            </span>
          </div>
          <p className="text-sm text-white/45 max-w-xs text-center sm:text-right">
            {t("footer.tagline")}
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/50 transition-colors hover:border-white/30 hover:text-white"
                aria-label={social.label}
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-white/[0.06]" />

        {/* Columns */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Platform */}
          <div>
            <h3 className="text-[11px] font-medium uppercase tracking-[0.25em] text-white/40 mb-5">
              {t("footer.platform")}
            </h3>
            <ul className="space-y-3">
              {platformLinkKeys.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/55 transition-colors hover:text-white"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-[11px] font-medium uppercase tracking-[0.25em] text-white/40 mb-5">
              {t("footer.categories")}
            </h3>
            <ul className="space-y-3">
              {categoryLinkKeys.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/55 transition-colors hover:text-white"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-[11px] font-medium uppercase tracking-[0.25em] text-white/40 mb-5">
              {t("footer.resources")}
            </h3>
            <ul className="space-y-3">
              {resourceLinkKeys.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/55 transition-colors hover:text-white"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-[11px] font-medium uppercase tracking-[0.25em] text-white/40 mb-5">
              {t("footer.legal")}
            </h3>
            <ul className="space-y-3">
              {legalLinkKeys.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/55 transition-colors hover:text-white"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-white/[0.06] pt-8 text-center">
          <p className="text-sm text-white/35">
            {t("footer.copyright", { year })}
          </p>
        </div>
      </div>
    </footer>
  );
}
