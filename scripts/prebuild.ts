/**
 * Pre-build setup: generate sitemap.xml and robots.txt with correct production URL.
 * Run before `next build`: npx tsx scripts/prebuild.ts
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-design-hub.vercel.app";
const ROOT = join(import.meta.dirname!, "..");
const PUBLIC_DIR = join(ROOT, "public");
const OUT_DIR = join(ROOT, "out");

interface SitemapEntry {
  loc: string;
  changefreq: string;
  priority: string;
}

function extractSlugsBetween(content: string, startMarker: string, endMarker: string): string[] {
  const start = content.indexOf(startMarker);
  const end = content.indexOf(endMarker, start);
  if (start === -1 || end === -1) return [];
  const section = content.slice(start, end);
  const regex = /slug:\s*"([^"]+)"/g;
  const slugs: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = regex.exec(section)) !== null) {
    slugs.push(m[1]);
  }
  return slugs;
}

function main(): void {
  const entries: SitemapEntry[] = [];

  // ─── Static pages ───
  const statics: Array<[string, string, string]> = [
    ["/", "daily", "1.0"],
    ["/tools", "daily", "0.9"],
    ["/blog", "daily", "0.8"],
    ["/categories", "daily", "0.8"],
    ["/compare", "weekly", "0.7"],
    ["/favorites", "weekly", "0.5"],
    ["/submit", "monthly", "0.5"],
  ];
  for (const [path, freq, prio] of statics) {
    entries.push({ loc: SITE_URL + path, changefreq: freq, priority: prio });
  }

  // ─── Categories ───
  const categories = [
    "ai-image-tools", "ai-video-tools", "ai-ui-tools",
    "ai-animation-tools", "ai-3d-tools", "ai-productivity-tools",
  ];
  for (const cat of categories) {
    entries.push({ loc: `${SITE_URL}/category/${cat}`, changefreq: "weekly", priority: "0.7" });
  }

  // ─── Tools & Blogs (read from mock.ts) ───
  try {
    const mockPath = join(ROOT, "src", "data", "mock.ts");
    const mockContent = readFileSync(mockPath, "utf-8");

    // Tool slugs: between "export const tools: Tool[] = [" and next "export const"
    const toolSlugs = extractSlugsBetween(mockContent, "export const tools:", "export const blogPosts:");
    for (const slug of toolSlugs) {
      entries.push({ loc: `${SITE_URL}/tool/${slug}`, changefreq: "weekly", priority: "0.8" });
    }

    // Blog slugs: between "export const blogPosts:" and end of array
    const blogSlugs = extractSlugsBetween(mockContent, "export const blogPosts:", "export const keywords:");
    for (const slug of blogSlugs) {
      entries.push({ loc: `${SITE_URL}/blog/${slug}`, changefreq: "monthly", priority: "0.7" });
    }

    console.log(`  Tools: ${toolSlugs.length}, Blogs: ${blogSlugs.length}`);
  } catch {
    console.warn("⚠ Could not read mock.ts, sitemap may be incomplete");
  }

  // ─── Generate XML ───
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(e => `  <url>
    <loc>${e.loc}</loc>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join("\n")}
</urlset>
`;

  writeFileSync(join(PUBLIC_DIR, "sitemap.xml"), xml, "utf-8");
  if (existsSync(OUT_DIR)) writeFileSync(join(OUT_DIR, "sitemap.xml"), xml, "utf-8");

  // ─── Robots.txt (replace SITE_URL placeholder) ───
  const robotsTemplate = readFileSync(join(PUBLIC_DIR, "robots.txt"), "utf-8");
  const robotsFinal = robotsTemplate.replace(/SITE_URL/g, SITE_URL);
  writeFileSync(join(PUBLIC_DIR, "robots.txt"), robotsFinal, "utf-8");
  if (existsSync(OUT_DIR)) writeFileSync(join(OUT_DIR, "robots.txt"), robotsFinal, "utf-8");

  console.log(`✅ Sitemap: ${entries.length} entries → ${SITE_URL}/sitemap.xml`);
  console.log(`✅ robots.txt → ${SITE_URL}`);
}

main();
