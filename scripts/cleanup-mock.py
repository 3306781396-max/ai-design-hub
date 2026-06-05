#!/usr/bin/env python3
"""Clean up mock data for production:
1. Replace placehold.co URLs in mock.ts with local placeholder
2. (Done elsewhere) Remove getMockReviews() from tool page
"""

import re
from pathlib import Path

ROOT = Path(__file__).parent.parent
MOCK = ROOT / "src" / "data" / "mock.ts"
# Use default encoding, try utf-8


def main():
    content = MOCK.read_text("utf-8")
    orig_len = len(content)

    # 1. Replace all placehold.co URLs with local placeholder
    #    https://placehold.co/800x450/hex/hex?text=...
    # -> /images/tool-placeholder.png
    new_content = re.sub(
        r'https?://placehold\.co/\S+',
        '/images/tool-placeholder.png',
        content
    )

    # 2. Also replace logo.clearbit.com URLs
    new_content = re.sub(
        r'https?://logo\.clearbit\.com/\S+',
        '/images/tool-placeholder.png',
        new_content
    )

    if new_content != content:
        MOCK.write_text(new_content, "utf-8")
        print(f"✅ mock.ts: replaced {orig_len - len(new_content)} chars of placeholder URLs")
    else:
        print("ℹ No placeholder URLs found in mock.ts (already cleaned?)")

    # 3. Generate the placeholder image if it doesn't exist
    placeholder = ROOT / "public" / "images" / "tool-placeholder.png"
    if not placeholder.exists():
        print(f"⚠️  {placeholder} not found - run image generation script")
    else:
        print(f"✅ {placeholder} exists")


if __name__ == "__main__":
    main()
