#!/usr/bin/env python3
"""
append_tool.py - 向 mock.ts 的 tools 数组正确追加新工具

用法：
  python3 scripts/append_tool.py <json_file>
  python3 scripts/append_tool.py --test   # 用内置测试数据运行
"""

import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

PROJECT_ROOT = Path("/Users/yinwen/WorkBuddy/2026-06-04-21-08-38/ai-design-hub")
MOCK_FILE = PROJECT_ROOT / "src" / "data" / "mock.ts"


def find_tools_array_end(content: str) -> int:
    """
    用括号计数法，找到 export const tools: Tool[] = [ ... ]; 的 ']'
    返回 ']' 在 content 中的索引，失败返回 -1
    """
    # 定位 "export const tools: Tool[] = ["
    header = 'export const tools: Tool[]'
    h = content.find(header)
    if h == -1:
        return -1

    # 找 '=['（数组字面量开始）
    eq = content.find('=[', h)
    if eq == -1:
        # 可能有空格：= [
        eq = content.find('= [', h)
    if eq == -1:
        return -1

    arr_start = eq + 2  # '[' 的位置（处理 "= [" 和 "= [" 两种情况）

    # 括号计数，找到顶层匹配的 ']'
    depth = 0
    in_str = False
    esc = False
    i = arr_start
    while i < len(content):
        c = content[i]
        if esc:
            esc = False
            i += 1
            continue
        if c == '\\' and in_str:
            esc = True
            i += 1
            continue
        if c == '"' and not esc:
            in_str = not in_str
            i += 1
            continue
        if in_str:
            i += 1
            continue
        if c == '[':
            depth += 1
        elif c == ']':
            depth -= 1
            if depth == 0:
                return i  # ']' 的位置
        i += 1

    return -1


def tool_to_ts(tool: dict) -> str:
    """将 tool dict 转为 TypeScript 对象字面量字符串"""
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")

    def s(v): return json.dumps(v, ensure_ascii=False)
    def a(arr): return "[" + ", ".join(json.dumps(x, ensure_ascii=False) for x in arr) + "]"

    def faq_arr(faqs):
        if not faqs:
            return "[]"
        parts = []
        for f in faqs:
            parts.append(f"    {{ question: {s(f['question'])}, answer: {s(f['answer'])} }}")
        return "[\n" + ",\n".join(parts) + "\n  ]"

    return f"""  {{
    id: {s(tool['id'])},
    slug: {s(tool['slug'])},
    name: {s(tool['name'])},
    description: {s(tool['description'])},
    description_long: {s(tool.get('description_long', tool['description']))},
    website_url: {s(tool['website_url'])},
    category_slug: {s(tool['category_slug'])},
    category_name: {s(tool['category_name'])},
    logo: {s(tool.get('logo', ''))},
    screenshot: {s(tool.get('screenshot', ''))},
    tags: {a(tool.get('tags', []))},
    pricing: {s(tool.get('pricing', 'Freemium'))},
    rating: {tool.get('rating', 4.0)},
    review_count: {tool.get('review_count', 0)},
    clicks: {tool.get('clicks', 0)},
    featured: {'true' if tool.get('featured') else 'false'},
    trending: {'true' if tool.get('trending') else 'false'},
    sponsored: {'true' if tool.get('sponsored') else 'false'},
    pros: {a(tool.get('pros', []))},
    cons: {a(tool.get('cons', []))},
    features: {a(tool.get('features', []))},
    use_cases: {a(tool.get('use_cases', []))},
    alternatives: {a(tool.get('alternatives', []))},
    faq: {faq_arr(tool.get('faq', []))},
    seo_title: {s(tool.get('seo_title', tool['name'] + ' Review 2026'))},
    seo_description: {s(tool.get('seo_description', tool['description'][:160]))},
    keywords: {a(tool.get('keywords', []))},
    status: {s(tool.get('status', 'published'))},
    created_at: {s(tool.get('created_at', now))},
    updated_at: {s(tool.get('updated_at', now))},
  }},
"""


def get_next_id(content: str) -> str:
    ids = re.findall(r'id:\s*"tool-(\d+)"', content)
    n = max(int(x) for x in ids) + 1 if ids else 1
    return f"tool-{n:03d}"


def get_slugs(content: str) -> set:
    return set(re.findall(r'slug:\s*"([^"]+)"', content))


def update_tool_count(content: str, cat_slug: str) -> str:
    """对应分类的 tool_count +1"""
    pat = rf'(slug:\s*"{re.escape(cat_slug)}"[\s\S]*?tool_count:\s*)(\d+)'
    m = re.search(pat, content)
    if m:
        old = int(m.group(2))
        content = content[:m.start(2)] + str(old + 1) + content[m.end(2):]
    return content


def update_sitemap(tool_slug: str, base: str = "https://ai-design-hub.vercel.app"):
    sm = PROJECT_ROOT / "public" / "sitemap.xml"
    if not sm.exists():
        return
    entry = f"""  <url>
    <loc>{base}/tool/{tool_slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
"""
    content = sm.read_text(encoding="utf-8")
    content = content.replace("</urlset>", entry + "  </urlset>")
    sm.write_text(content, encoding="utf-8")


def append_tool(tool: dict, dry_run: bool = False) -> bool:
    content = MOCK_FILE.read_text(encoding="utf-8")

    # 检查重复
    slugs = get_slugs(content)
    if tool["slug"] in slugs:
        print(f"  ⚠️  slug '{tool['slug']}' 已存在，跳过")
        return False

    # 分配 ID
    if "id" not in tool or not tool["id"]:
        tool["id"] = get_next_id(content)

    # 生成 TS 代码
    ts_block = tool_to_ts(tool)

    # 找到 tools 数组的结束 ']'
    end_idx = find_tools_array_end(content)
    if end_idx == -1:
        print("  ❌ 找不到 tools 数组的结束位置")
        return False

    # 在 ']' 前插入新工具（前面加换行和逗号处理）
    # end_idx 指向 ']'，在它前面插入
    before = content[:end_idx]
    after = content[end_idx:]

    # 确保前一个字符是换行
    if not before.endswith("\n"):
        before += "\n"

    new_content = before + ts_block + after

    # 更新 tool_count
    new_content = update_tool_count(new_content, tool["category_slug"])

    if dry_run:
        print("  🔍 Dry run — 不写入文件")
        print(ts_block[:300] + "...")
        return True

    MOCK_FILE.write_text(new_content, encoding="utf-8")
    print(f"  ✅ 已写入 {MOCK_FILE.relative_to(PROJECT_ROOT)}")

    # 更新 sitemap
    update_sitemap(tool["slug"])
    print(f"  ✅ 已更新 sitemap.xml")

    return True


# ─── 测试数据 ───────────────────────────────────────────
TEST_TOOL = {
    "slug": "ideogram-ai",
    "name": "Ideogram AI",
    "description": "AI image generator with state-of-the-art text rendering. Create stunning images with accurate typography, logos, and text overlays.",
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
    "faq": [
        {
            "question": "Is Ideogram free to use?",
            "answer": "Ideogram offers a free plan with daily generation limits. Paid plans start at $8/month for more generations and higher resolution."
        },
        {
            "question": "How accurate is the text rendering?",
            "answer": "Ideogram is currently the best AI image generator for text rendering, with high accuracy for short to medium-length text strings."
        },
    ],
    "seo_title": "Ideogram AI Review 2026 - Best AI Image Generator with Text",
    "seo_description": "Complete Ideogram AI review: Features, pricing, text rendering capabilities. Learn why Ideogram excels at generating AI images with accurate text.",
    "keywords": ["Ideogram AI", "AI image generator", "text-to-image with text", "AI typography", "Ideogram review"],
    "status": "published",
}


def main():
    """主入口"""
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    flags = [a for a in sys.argv[1:] if a.startswith('--')]
    dry_run = '--dry-run' in flags
    is_test = '--test' in flags

    print("🤖 向 mock.ts 追加新工具")
    print("=" * 50)

    if not MOCK_FILE.exists():
        print(f"❌ 找不到 {MOCK_FILE}")
        sys.exit(1)

    tools_to_add = []

    if is_test:
        tools_to_add.append(TEST_TOOL)
    elif args:
        json_path = Path(args[0])
        if not json_path.exists():
            print(f"❌ JSON 文件不存在: {json_path}")
            sys.exit(1)
        data = json.loads(json_path.read_text(encoding="utf-8"))
        if isinstance(data, dict):
            data = [data]
        tools_to_add = data
    else:
        print("用法：")
        print("  python3 scripts/append_tool.py --test [--dry-run]    # 测试模式")
        print("  python3 scripts/append_tool.py data.json [--dry-run]  # JSON 文件")
        print("  python3 scripts/append_tool.py --help                 # 帮助")
        sys.exit(1)

    for tool in tools_to_add:
        print(f"\n➕ 添加: {tool['name']} ({tool['slug']})")
        if not append_tool(tool, dry_run=dry_run):
            print(f"  ❌ 失败！")
            sys.exit(1)

    if dry_run:
        print("\n🔍 Dry run 完成，未写入文件")
    else:
        print("\n✅ 全部完成！请运行 npm run build 构建站点")
if __name__ == "__main__":
    main()
