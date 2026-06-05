#!/usr/bin/env python3
"""
test_add_tool.py - 非交互式测试添加工具
直接用 Python 添加一条测试工具，验证完整流水线
"""

import json
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path

PROJECT_ROOT = Path("/Users/yinwen/WorkBuddy/2026-06-04-21-08-38/ai-design-hub")
MOCK_FILE = PROJECT_ROOT / "src" / "data" / "mock.ts"
SITEMAP_FILE = PROJECT_ROOT / "public" / "sitemap.xml"

def get_next_tool_id() -> str:
    content = MOCK_FILE.read_text(encoding="utf-8")
    ids = re.findall(r'id:\s*"tool-(\d+)"', content)
    max_id = max(int(x) for x in ids) if ids else 0
    return f"tool-{max_id + 1:03d}"

def get_existing_slugs() -> set:
    content = MOCK_FILE.read_text(encoding="utf-8")
    return set(re.findall(r'slug:\s*"([^"]+)"', content))

def js_str(v: str) -> str:
    return json.dumps(v, ensure_ascii=False)

def js_arr(arr: list) -> str:
    return "[" + ", ".join(json.dumps(x, ensure_ascii=False) for x in arr) + "]"

def generate_tool_ts(tool: dict) -> str:
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")
    block = f"""  {{
    id: {js_str(tool['id'])},
    slug: {js_str(tool['slug'])},
    name: {js_str(tool['name'])},
    description: {js_str(tool['description'])},
    description_long: {js_str(tool.get('description_long', tool['description']))},
    website_url: {js_str(tool['website_url'])},
    category_slug: {js_str(tool['category_slug'])},
    category_name: {js_str(tool['category_name'])},
    logo: {js_str(tool.get('logo', ''))},
    screenshot: {js_str(tool.get('screenshot', ''))},
    tags: {js_arr(tool.get('tags', []))},
    pricing: {js_str(tool.get('pricing', 'Freemium'))},
    rating: {tool.get('rating', 4.0)},
    review_count: {tool.get('review_count', 0)},
    clicks: {tool.get('clicks', 0)},
    featured: {str(tool.get('featured', False)).lower()},
    trending: {str(tool.get('trending', False)).lower()},
    sponsored: {str(tool.get('sponsored', False)).lower()},
    pros: {js_arr(tool.get('pros', []))},
    cons: {js_arr(tool.get('cons', []))},
    features: {js_arr(tool.get('features', []))},
    use_cases: {js_arr(tool.get('use_cases', []))},
    alternatives: {js_arr(tool.get('alternatives', []))},
    faq: [],
    seo_title: {js_str(tool.get('seo_title', tool['name'] + ' Review 2026'))},
    seo_description: {js_str(tool.get('seo_description', tool['description'][:160]))},
    keywords: {js_arr(tool.get('keywords', []))},
    status: {js_str(tool.get('status', 'published'))},
    created_at: {js_str(tool.get('created_at', now))},
    updated_at: {js_str(tool.get('updated_at', now))},
  }},
"""
    return block

def append_tool(tool: dict):
    tool_ts = generate_tool_ts(tool)
    content = MOCK_FILE.read_text(encoding="utf-8")
    pattern = r"(\s+)\},\n\];"
    replacement = r"\1},\n" + tool_ts + r"\1];"
    new_content = re.sub(pattern, replacement, content, count=1)
    if new_content == content:
        raise RuntimeError("无法在 mock.ts 中找到 tools 数组结束位置")
    MOCK_FILE.write_text(new_content, encoding="utf-8")
    print(f"  ✅ 已追加到 mock.ts")

def update_sitemap(tool_slug: str):
    content = SITEMAP_FILE.read_text(encoding="utf-8")
    base = "https://ai-design-hub.vercel.app"
    new_entry = f"""  <url>
    <loc>{base}/tool/{tool_slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
"""
    new_content = content.replace("</urlset>", new_entry + "  </urlset>")
    SITEMAP_FILE.write_text(new_content, encoding="utf-8")
    print(f"  ✅ 已更新 sitemap.xml")

def update_category_count(category_slug: str):
    content = MOCK_FILE.read_text(encoding="utf-8")
    pattern = rf'(slug:\s*"{re.escape(category_slug)}".*?tool_count:\s*)(\d+)'
    match = re.search(pattern, content, re.DOTALL)
    if match:
        old = int(match.group(2))
        new = old + 1
        new_content = content[:match.start(2)] + str(new) + content[match.end(2):]
        MOCK_FILE.write_text(new_content, encoding="utf-8")
        print(f"  ✅ 分类 {category_slug} tool_count: {old} → {new}")

# ─── 测试工具数据 ────────────────────────────────────────────
TEST_TOOL = {
    "slug": "ideogram-ai",
    "name": "Ideogram AI",
    "description": "Ideogram AI is an advanced text-to-image generation platform that excels at rendering accurate, coherent text within images. Unlike other AI image generators that struggle with typography, Ideogram produces stunning visuals with precise text integration.",
    "description_long": "Ideogram AI is an advanced text-to-image generation platform that excels at rendering accurate, coherent text within images. Unlike other AI image generators that struggle with typography, Ideogram produces stunning visuals with precise text integration. The platform offers multiple aspect ratios, style controls, and a vibrant community feed for inspiration. Ideogram's Describe feature can analyze any image and generate a prompt that would recreate it, making it both a generation and analysis tool. With both free and paid plans, it has quickly become a favorite among designers who need text-integrated graphics, marketing materials, and social media content.",
    "website_url": "https://ideogram.ai",
    "category_slug": "ai-image-tools",
    "category_name": "AI Image Tools",
    "logo": "https://logo.clearbit.com/ideogram.ai",
    "screenshot": "https://placehold.co/800x450/8b5cf6/ffffff?text=Ideogram+AI",
    "tags": ["text-to-image", "typography", "text rendering", "AI art", "design tool"],
    "pricing": "Freemium",
    "rating": 4.5,
    "review_count": 3200,
    "clicks": 18500,
    "featured": True,
    "trending": True,
    "sponsored": False,
    "pros": [
        "Excellent text rendering in images",
        "Intuitive and clean user interface",
        "Describe feature for image-to-prompt",
        "Active community with public feed",
        "Multiple aspect ratio options",
    ],
    "cons": [
        "Free plan has daily generation limits",
        "Sometimes struggles with complex prompts",
        "No API access on lower tiers",
        "Image resolution limited on free plan",
        "Style consistency needs improvement",
    ],
    "features": [
        "Text-to-image with accurate text rendering",
        "Describe feature for prompt generation from images",
        "Multiple aspect ratios (1:1, 16:9, 9:16, etc.)",
        "Remix mode for iterating on community images",
        "Style customization with various parameters",
        "Community feed for inspiration and learning",
    ],
    "use_cases": [
        "Marketing materials with text overlays",
        "Social media posts with typography",
        "Poster and flyer design",
        "Logo concept generation",
        "Book cover design with titles",
    ],
    "alternatives": ["DALL-E 3", "Midjourney", "Adobe Firefly"],
    "seo_title": "Ideogram AI Review 2026 - Best AI Image Generator with Text",
    "seo_description": "Complete Ideogram AI review: Features, pricing, text rendering capabilities. Learn why Ideogram excels at generating AI images with accurate text.",
    "keywords": ["Ideogram AI", "AI image generator", "text-to-image with text", "AI typography", "Ideogram review"],
    "status": "published",
}

def main():
    print("🧪 AI Design Hub - 端到端测试")
    print("=" * 50)

    existing = get_existing_slugs()
    if TEST_TOOL["slug"] in existing:
        print(f"⚠️  测试工具 '{TEST_TOOL['slug']}' 已存在，跳过添加")
        print("请手动删除该工具后重新运行，或修改 slug 为其他值")
        return

    TEST_TOOL["id"] = get_next_tool_id()
    print(f"📝 添加测试工具: {TEST_TOOL['name']} ({TEST_TOOL['id']})")

    append_tool(TEST_TOOL)
    update_sitemap(TEST_TOOL["slug"])
    update_category_count(TEST_TOOL["category_slug"])

    print("\n🔨 开始构建...")
    result = subprocess.run(
        ["npm", "run", "build"],
        cwd=PROJECT_ROOT,
        capture_output=True,
        text=True,
        timeout=300,
    )
    if result.returncode != 0:
        print("❌ 构建失败！")
        print(result.stderr[-3000:])
        return
    print("✅ 构建成功！")

    out_dir = PROJECT_ROOT / "out"
    page_count = sum(1 for _ in out_dir.rglob("*.html"))
    print(f"📄 生成静态页面数: {page_count}")

    print("\n🎉 端到端测试完成！")
    print(f"请通过 WorkBuddy 将 {out_dir} 部署到 CloudStudio")

if __name__ == "__main__":
    main()
