#!/usr/bin/env python3
"""
Pre-build setup script.
Generates sitemap.xml and robots.txt with correct production URL.
Also generates RSS feed.xml from blog posts.
Usage:  python3 scripts/prebuild.py
"""

import os
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).parent.parent
PUBLIC_DIR = ROOT / "public"
OUT_DIR = ROOT / "out"


def load_env_local():
    """Load NEXT_PUBLIC_* vars from .env.local into os.environ."""
    env_file = ROOT / ".env.local"
    if not env_file.exists():
        return
    for line in env_file.read_text("utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key = key.strip()
        value = value.strip().strip("'\"")
        if key.startswith("NEXT_PUBLIC_"):
            os.environ[key] = value


load_env_local()
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
        # Try '= [' with spaces
        eq_bracket = content.find("=  [", start, end)
    if eq_bracket == -1:
        return []

    array_start = content.find("[", eq_bracket)
    if array_start == -1:
        return []

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
                array_body = content[array_start : pos + 1]
                return re.findall(r'slug:\s*"([^"]+)"', array_body)
        pos += 1

    # Fallback: search in full section (less precise)
    section = content[start:end]
    return re.findall(r'slug:\s*"([^"]+)"', section)


def extract_blog_posts(content):
    """
    Extract blog post metadata (slug, title, description, published_at, author)
    from the blogPosts array in mock.ts.
    """
    start = content.find("export const blogPosts:")
    if start == -1:
        return []

    # Find the array start
    eq_bracket = content.find("= [", start)
    if eq_bracket == -1:
        return []

    array_start = content.find("[", eq_bracket)
    if array_start == -1:
        return []

    # Walk to matching ']'
    depth = 1
    in_sq = False
    in_dq = False
    escaped = False
    pos = array_start + 1
    end_pos = -1

    while pos < len(content):
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
                end_pos = pos + 1
                break
        pos += 1

    if end_pos == -1:
        return []

    array_body = content[array_start:end_pos]

    # Extract individual objects (top-level '{...}')
    objects = []
    obj_start = array_body.find("{")
    while obj_start != -1:
        depth = 1
        in_sq = False
        in_dq = False
        escaped = False
        pos = obj_start + 1
        obj_end = -1

        while pos < len(array_body):
            ch = array_body[pos]
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
            if ch == "{" and not in_sq and not in_dq:
                depth += 1
            elif ch == "}" and not in_sq and not in_dq:
                depth -= 1
                if depth == 0:
                    obj_end = pos + 1
                    break
            pos += 1

        if obj_end != -1:
            obj_str = array_body[obj_start:obj_end]
            # Extract fields
            slug = re.search(r'slug:\s*"([^"]+)"', obj_str)
            title = re.search(r'title:\s*"([^"]+)"', obj_str)
            desc = re.search(r'description:\s*"([^"]*)"', obj_str)
            date = re.search(r'published_at:\s*"([^"]+)"', obj_str)
            author = re.search(r'author:\s*"([^"]+)"', obj_str)

            objects.append({
                "slug": slug.group(1) if slug else "",
                "title": title.group(1) if title else "",
                "description": desc.group(1) if desc else "",
                "published_at": date.group(1) if date else "",
                "author": author.group(1) if author else "AI Design Hub",
            })

        # Find next object
        obj_start = array_body.find("{", obj_end if obj_end != -1 else obj_start + 1)

    return objects


def generate_rss(blog_posts):
    """Generate RSS 2.0 XML string from blog post list."""
    items = []
    for p in blog_posts:
        title = escape_xml(p["title"]) or p["slug"]
        link = f"{SITE_URL}/blog/{p['slug']}"
        guid = link
        pub_date = to_rfc822(p["published_at"])
        desc = escape_xml(p["description"])
        author = escape_xml(p["author"])
        items.append(f"""
    <item>
      <title>{title}</title>
      <link>{link}</link>
      <guid>{guid}</guid>
      <pubDate>{pub_date}</pubDate>
      <description>{desc}</description>
      <author>{author}</author>
    </item>""")

    rss = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AI Design Hub Blog</title>
    <link>{SITE_URL}/blog</link>
    <description>Latest AI design trends, tool comparisons, tutorials and best practices for creative professionals.</description>
    <language>en-us</language>
    <lastBuildDate>{to_rfc822("now")}</lastBuildDate>
    <atom:link href="{SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
{''.join(items)}
  </channel>
</rss>"""
    return rss


def escape_xml(s):
    if not s:
        return ""
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def to_rfc822(date_str):
    try:
        from datetime import datetime, timezone
        if date_str == "now":
            d = datetime.now(timezone.utc)
        else:
            # Try parsing ISO format
            d = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
        # Format: 'Wed, 02 Jun 2026 12:00:00 +0000'
        return d.strftime("%a, %d %b %Y %H:%M:%S +0000")
    except Exception:
        return ""


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
        ("/about", "monthly", "0.6"),
        ("/contact", "monthly", "0.5"),
        ("/advertise", "monthly", "0.5"),
        ("/api", "monthly", "0.5"),
        ("/faq", "monthly", "0.6"),
        ("/privacy", "yearly", "0.3"),
        ("/terms", "yearly", "0.3"),
        ("/cookies", "yearly", "0.3"),
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

    # ─── 3. RSS Feed XML ───
    blog_posts = extract_blog_posts(mock_content)
    if blog_posts:
        rss_xml = generate_rss(blog_posts)
        write_file(PUBLIC_DIR / "feed.xml", rss_xml)
        if OUT_DIR.exists():
            write_file(OUT_DIR / "feed.xml", rss_xml)
        print(f"✅ feed.xml: {len(blog_posts)} items → {SITE_URL}/feed.xml")
        print(f"   Blog posts: {[p['slug'] for p in blog_posts[:3]]}...")
    else:
        print("⚠️  No blog posts found, skipping RSS generation")


if __name__ == "__main__":
    main()
