#!/usr/bin/env python3
"""
Pre-build setup script.
Generates sitemap.xml and robots.txt with correct production URL.
Usage:  python3 scripts/prebuild.py
"""

import os
import re
from pathlib import Path

ROOT = Path(__file__).parent.parent
PUBLIC_DIR = ROOT / "public"
OUT_DIR = ROOT / "out"

SITE_URL = os.environ.get("NEXT_PUBLIC_SITE_URL", "https://ai-design-hub.vercel.app")


def read_file(path):
    try:
        return path.read_text("utf-8")
    except FileNotFoundError:
        return None


def write_file(path, content):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, "utf-8")


def slugs_from_section(content, start_marker, end_marker):
    """
    Extract slug: "xxx" values from the text between start_marker and end_marker.
    Uses bracket-aware extraction to only match top-level array entries.
    """
    start = content.find(start_marker)
    if start == -1:
        return []
    end = content.find(end_marker, start)
    if end == -1:
        end = len(content)

    # Now find the '= [' that starts the array (skip TypeScript type annotation)
    eq_bracket = content.find("= [", start, end)
    if eq_bracket == -1:
        return []
    array_start = eq_bracket + 1  # position of '['

    # Walk to matching ']'
    depth = 1
    in_sq = False
    in_dq = False
    escaped = False
    pos = array_start + 1

    while pos < end and pos < len(content):
        ch = content[pos]
        if escaped:
            escaped = False
            pos += 1
            continue
        if ch == "\\":
            escaped = True
            pos += 1
            continue
        if in_sq:
            if ch == "'":
                in_sq = False
            pos += 1
            continue
        if in_dq:
            if ch == '"':
                in_dq = False
            pos += 1
            continue
        if ch == "'":
            in_sq = True
            pos += 1
            continue
        if ch == '"':
            in_dq = True
            pos += 1
            continue
        if ch == "[" and not in_sq and not in_dq:
            depth += 1
        elif ch == "]" and not in_sq and not in_dq:
            depth -= 1
            if depth == 0:
                # Found the end of the array
                array_body = content[array_start : pos + 1]
                return re.findall(r'slug:\s*"([^"]+)"', array_body)
        pos += 1

    # Fallback: search in full section (less precise)
    section = content[start:end]
    return re.findall(r'slug:\s*"([^"]+)"', section)


def main():
    # ─── 1. Robots.txt ───
    robots_path = PUBLIC_DIR / "robots.txt"
    if robots_path.exists():
        robots = robots_path.read_text("utf-8")
        robots = robots.replace("SITE_URL", SITE_URL)
        robots_path.write_text(robots, "utf-8")
        if OUT_DIR.exists():
            (OUT_DIR / "robots.txt").write_text(robots, "utf-8")
        print(f"✅ robots.txt → {SITE_URL}")

    # ─── 2. Sitemap XML ───
    mock_content = read_file(ROOT / "src" / "data" / "mock.ts") or ""

    entries = []

    # Static pages
    statics = [
        ("/", "daily", "1.0"),
        ("/tools", "daily", "0.9"),
        ("/blog", "daily", "0.8"),
        ("/categories", "daily", "0.8"),
        ("/compare", "weekly", "0.7"),
        ("/favorites", "weekly", "0.5"),
        ("/submit", "monthly", "0.5"),
    ]
    for path, freq, prio in statics:
        entries.append(
            f"  <url>\n"
            f"    <loc>{SITE_URL}{path}</loc>\n"
            f"    <changefreq>{freq}</changefreq>\n"
            f"    <priority>{prio}</priority>\n"
            f"  </url>"
        )

    # Categories
    categories = [
        "ai-image-tools", "ai-video-tools", "ai-ui-tools",
        "ai-animation-tools", "ai-3d-tools", "ai-productivity-tools",
    ]
    for cat in categories:
        entries.append(
            f"  <url>\n"
            f"    <loc>{SITE_URL}/category/{cat}</loc>\n"
            f"    <changefreq>weekly</changefreq>\n"
            f"    <priority>0.7</priority>\n"
            f"  </url>"
        )

    # Tools
    tool_slugs = slugs_from_section(mock_content, "export const tools:", "export const blogPosts:")
    for slug in tool_slugs:
        entries.append(
            f"  <url>\n"
            f"    <loc>{SITE_URL}/tool/{slug}</loc>\n"
            f"    <changefreq>weekly</changefreq>\n"
            f"    <priority>0.8</priority>\n"
            f"  </url>"
        )

    # Blogs
    blog_slugs = slugs_from_section(mock_content, "export const blogPosts:", "export const keywords:")
    for slug in blog_slugs:
        entries.append(
            f"  <url>\n"
            f"    <loc>{SITE_URL}/blog/{slug}</loc>\n"
            f"    <changefreq>monthly</changefreq>\n"
            f"    <priority>0.7</priority>\n"
            f"  </url>"
        )

    # Generate XML
    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(entries)
        + "\n</urlset>\n"
    )

    write_file(PUBLIC_DIR / "sitemap.xml", xml)
    if OUT_DIR.exists():
        write_file(OUT_DIR / "sitemap.xml", xml)

    print(f"✅ sitemap.xml: {len(entries)} entries → {SITE_URL}/sitemap.xml")
    print(f"   Tools: {len(tool_slugs)}, Blogs: {len(blog_slugs)}")


if __name__ == "__main__":
    main()
