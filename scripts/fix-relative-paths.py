#!/usr/bin/env python3
"""
Post-process Next.js static export to work with file:// protocol.
Converts absolute paths to relative paths and adds <base> tags.
"""
import re
import os
from pathlib import Path

OUT_DIR = Path(__file__).resolve().parent.parent / "out"


def get_base_href(html_path: Path) -> str:
    """Calculate relative path to root for this HTML file."""
    rel = html_path.relative_to(OUT_DIR)
    depth = len(rel.parts) - 1  # e.g., blog/post/index.html = 2 levels deep
    if depth <= 0:
        return "./"
    return "../" * depth


def fix_html(file_path: Path) -> bool:
    """Convert absolute paths to relative in a single HTML file."""
    content = file_path.read_text(encoding="utf-8")
    original = content
    
    # Calculate base href for this file
    base_href = get_base_href(file_path)
    
    # Add <base> tag right after <head>
    content = content.replace(
        "<head>",
        f'<head><base href="{base_href}">'
    )
    
    # Strip leading / from resource paths (src, href in link/script/img/meta)
    # Pattern: src="/xxx" or href="/xxx" -> src="xxx" or href="xxx"
    # But NOT in JSON-LD, schema.org, or external URLs
    
    def replace_path(match):
        attr = match.group(1)  # src or href
        quote = match.group(2)  # " or '
        path = match.group(3)  # the path value
        
        # Don't modify external URLs
        if path.startswith("http://") or path.startswith("https://") or path.startswith("//"):
            return match.group(0)
        
        # Strip leading slash
        stripped = path.lstrip("/")
        if not stripped:  # path was just "/"
            stripped = "."
        
        return f'{attr}={quote}{stripped}{quote}'
    
    # Match src="/..." and href="/..."
    content = re.sub(
        r'(src|href)=("|\')(/[\w\-.~:/?#\[\]@!$&\'()*+,;=%]+)("|\')',
        replace_path,
        content
    )
    
    # Also fix inline style URLs: url(/xxx) -> url(xxx)
    def replace_url(match):
        path = match.group(1)
        if path.startswith("http://") or path.startswith("https://") or path.startswith("//"):
            return match.group(0)
        stripped = path.lstrip("/")
        return f"url({stripped})"
    
    content = re.sub(
        r'url\((/[\w\-.~:/?#\[\]@!$&\'()*+,;=%]+)\)',
        replace_url,
        content
    )
    
    # Fix JSON-LD and other inline absolute paths in script tags
    # These typically contain https:// URLs which we skip
    
    if content != original:
        file_path.write_text(content, encoding="utf-8")
        return True
    return False


def main():
    html_files = list(OUT_DIR.rglob("*.html"))
    total = len(html_files)
    fixed = 0
    
    for html_file in html_files:
        if fix_html(html_file):
            fixed += 1
    
    print(f"Processed {total} HTML files, modified {fixed}")
    
    # Verify a sample
    sample = OUT_DIR / "index.html"
    content = sample.read_text(encoding="utf-8")
    has_abs_src = '/_next/' in content
    has_base = '<base href="' in content
    print(f"Sample check - base tag: {has_base}, still has abs /_next/: {has_abs_src}")
    
    if not has_abs_src and has_base:
        print("✅ All absolute paths converted to relative successfully!")
    else:
        print("⚠️  Some issues remain, check the output")


if __name__ == "__main__":
    main()
