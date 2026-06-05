#!/usr/bin/env python3
"""
content_updater.py - AI Design Hub 自动化内容更新流水线

功能：
  1. 获取最新 AI 设计工具信息（手动输入 / 未来可接入搜索 API）
  2. 生成符合 mock.ts 格式的 TypeScript 代码片段
  3. 自动追加到 src/data/mock.ts
  4. 更新 public/sitemap.xml（新增 tool 页面条目）
  5. 触发 npm run build && 部署

用法：
  python3 scripts/content_updater.py              # 交互式添加新工具
  python3 scripts/content_updater.py --auto      # 自动模式（从预设源读取）
  python3 scripts/content_updater.py --dry-run   # 仅预览，不写入文件
"""

import json
import os
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

# ============================================================
# 路径配置
# ============================================================
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
MOCK_FILE = PROJECT_ROOT / "src" / "data" / "mock.ts"
SITEMAP_FILE = PROJECT_ROOT / "public" / "sitemap.xml"

# ============================================================
# 工具 Slug → 分类映射
# ============================================================
SLUG_TO_CATEGORY = {
    "ai-image-tools": "AI Image Tools",
    "ai-video-tools": "AI Video Tools",
    "ai-ui-tools": "AI UI/UX Tools",
    "ai-animation-tools": "AI Animation Tools",
    "ai-3d-tools": "AI 3D Tools",
    "ai-productivity-tools": "AI Productivity Tools",
}

# ============================================================
# 工具索引（用于生成新 ID）
# ============================================================
def get_next_tool_id() -> str:
    """读取 mock.ts，找出最大 tool-NNN 编号，返回下一个 ID"""
    content = MOCK_FILE.read_text(encoding="utf-8")
    ids = re.findall(r'id:\s*"tool-(\d+)"', content)
    max_id = max(int(x) for x in ids) if ids else 0
    return f"tool-{max_id + 1:03d}"


def get_existing_slugs() -> set:
    """返回已有工具的 slug 集合，避免重复"""
    content = MOCK_FILE.read_text(encoding="utf-8")
    return set(re.findall(r'slug:\s*"([^"]+)"', content))


# ============================================================
# TypeScript 代码生成
# ============================================================
def generate_tool_ts(tool: dict) -> str:
    """
    根据 tool dict 生成 TypeScript 对象字面量字符串。
    tool dict 字段名与 Tool interface 一致。
    """
    def js_str(v: str) -> str:
        return json.dumps(v, ensure_ascii=False)

    def js_arr(arr: list) -> str:
        return "[" + ", ".join(json.dumps(x, ensure_ascii=False) for x in arr) + "]"

    def js_obj_arr(items: list, key: str) -> str:
        """生成 { question: "...", answer: "..." }[] 格式"""
        if not items:
            return "[]"
        parts = []
        for item in items:
            parts.append(
                "    { "
                f"question: {js_str(item['question'])}, "
                f"answer: {js_str(item['answer'])}"
                " }"
            )
        return "[\n" + ",\n".join(parts) + "\n  ]"

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
    faq: {js_obj_arr(tool.get('faq', []), 'faq')},
    seo_title: {js_str(tool.get('seo_title', tool['name'] + ' Review 2025'))},
    seo_description: {js_str(tool.get('seo_description', tool['description'][:160]))},
    keywords: {js_arr(tool.get('keywords', []))},
    status: {js_str(tool.get('status', 'published'))},
    created_at: {js_str(tool.get('created_at', now))},
    updated_at: {js_str(tool.get('updated_at', now))},
  }},
"""
    return block


def append_tool_to_mock(tool_ts: str) -> None:
    """将新工具代码块插入 mock.ts 的 tools 数组末尾（最后一个 ];` 前）"""
    content = MOCK_FILE.read_text(encoding="utf-8")
    # 找到 tools: Tool[] = [ ... ]; 的结束位置
    # 在最后一个 }, 之后、]; 之前插入
    pattern = r"(\s+)\},\n\];"
    replacement = r"\1},\n" + tool_ts + r"\1];"
    new_content = re.sub(pattern, replacement, content, count=1)
    if new_content == content:
        raise RuntimeError("无法在 mock.ts 中找到 tools 数组的结束位置，请手动检查文件格式")
    MOCK_FILE.write_text(new_content, encoding="utf-8")
    print(f"✅ 已追加工具到 {MOCK_FILE.relative_to(PROJECT_ROOT)}")


def update_sitemap(tool_slug: str, base_url: str = "https://ai-design-hub.vercel.app") -> None:
    """在 sitemap.xml 的 Tool Pages 注释后插入新的 <url> 条目"""
    content = SITEMAP_FILE.read_text(encoding="utf-8")
    new_entry = f"""  <url>
    <loc>{base_url}/tool/{tool_slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
"""
    # 在 <!-- Tool Pages (from mock data) --> 注释后的第一个 </url> 后插入
    # 更稳健：在 </urlset> 前插入
    new_content = content.replace("</urlset>", new_entry + "  </urlset>")
    SITEMAP_FILE.write_text(new_content, encoding="utf-8")
    print(f"✅ 已更新 {SITEMAP_FILE.relative_to(PROJECT_ROOT)}（新增 /tool/{tool_slug}）")


def update_category_tool_count(category_slug: str) -> None:
    """对应分类的 tool_count +1"""
    content = MOCK_FILE.read_text(encoding="utf-8")
    # 找到对应 category 的 tool_count 行，+1
    pattern = rf'(slug:\s*"{re.escape(category_slug)}".*?tool_count:\s*)(\d+)'
    match = re.search(pattern, content, re.DOTALL)
    if match:
        old_count = int(match.group(2))
        new_count = old_count + 1
        new_content = content[:match.start(2)] + str(new_count) + content[match.end(2):]
        MOCK_FILE.write_text(new_content, encoding="utf-8")
        print(f"✅ 分类 {category_slug} 的 tool_count: {old_count} → {new_count}")


# ============================================================
# Build & Deploy
# ============================================================
def run_build() -> bool:
    """运行 npm run build"""
    print("🔨 开始构建静态站点...")
    result = subprocess.run(
        ["npm", "run", "build"],
        cwd=PROJECT_ROOT,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        print("❌ 构建失败！")
        print(result.stderr[-2000:])  # 最后 2000 字符
        return False
    print("✅ 构建成功")
    return True


def deploy_to_cloudstudio() -> bool:
    """
    调用 WorkBuddy CLI 部署到 CloudStudio。
    实际执行：读取 .workbuddy 配置，调用 deploy 命令。
    这里用 Python 子进程调用 workbuddy CLI（如已安装）。
    """
    print("🚀 部署到 CloudStudio...")
    out_dir = PROJECT_ROOT / "out"
    if not out_dir.exists():
        print(f"❌ 构建输出目录不存在: {out_dir}")
        return False
    # 使用 WorkBuddy 的 cloudstudio deploy 功能
    # 通过 Python 调用 node 脚本或直接用 CLI
    result = subprocess.run(
        ["node", "-e", """
const { execSync } = require('child_process');
console.log('Deploying to CloudStudio...');
// 实际部署逻辑由 WorkBuddy 桌面端处理
console.log('Please use WorkBuddy Desktop to deploy the out/ directory.');
"""],
        cwd=PROJECT_ROOT,
        capture_output=True,
        text=True,
    )
    print(result.stdout)
    print("📌 请通过 WorkBuddy 桌面端将 out/ 目录部署到 CloudStudio")
    return True


# ============================================================
# 自动发现新工具（占位符，未来可接入搜索 API）
# ============================================================
def discover_new_tools() -> list:
    """
    自动发现新 AI 设计工具。
    当前为占位实现，返回空列表。
    未来可接入：
      - ProductHunt API
      - G2 / Capterra 新工具爬虫
      - Google News RSS（AI 设计工具关键词）
      - Semrush / Ahrefs API（新出现的关键词对应的工具）
    """
    print("🔍 正在搜索最新 AI 设计工具...")
    print("   （当前为模拟模式，请手动在交互模式下添加工具）")
    return []


# ============================================================
# 交互式添加工具
# ============================================================
def interactive_add_tool() -> dict:
    """通过命令行交互收集新工具信息"""
    print("\n📝 交互式添加新工具")
    print("（按 Enter 跳过可选字段）\n")

    slug = input("工具 Slug（如 adobe-firefly）: ").strip()
    name = input("工具名称（如 Adobe Firefly）: ").strip()
    description = input("简短描述: ").strip()
    website_url = input("官网 URL: ").strip()
    category_slug = input("分类 Slug（ai-image-tools/ai-video-tools/...）: ").strip()

    # 可选字段
    tags = input("标签（逗号分隔）: ").strip()
    pricing = input("定价（Free/Freemium/Paid/Free Trial）[Freemium]: ").strip() or "Freemium"
    rating = input("评分（0-5）[4.0]: ").strip() or "4.0"

    category_name = SLUG_TO_CATEGORY.get(category_slug, category_slug)

    tool = {
        "id": get_next_tool_id(),
        "slug": slug,
        "name": name,
        "description": description,
        "website_url": website_url,
        "category_slug": category_slug,
        "category_name": category_name,
        "logo": f"https://logo.clearbit.com/{website_url.replace('https://', '').replace('http://', '').rstrip('/')}",
        "screenshot": f"https://placehold.co/800x450/6366f1/ffffff?text={slug.replace('-', '+')}",
        "tags": [t.strip() for t in tags.split(",") if t.strip()],
        "pricing": pricing,
        "rating": float(rating),
        "review_count": 0,
        "clicks": 0,
        "featured": False,
        "trending": False,
        "sponsored": False,
        "pros": [],
        "cons": [],
        "features": [],
        "use_cases": [],
        "alternatives": [],
        "faq": [],
        "seo_title": f"{name} Review 2026 - Best AI Design Tool",
        "seo_description": description[:160],
        "keywords": [name, "AI design tool", "AI tool review"],
        "status": "published",
    }
    return tool


def preview_tool_ts(tool: dict) -> None:
    """预览生成的 TypeScript 代码"""
    print("\n" + "=" * 60)
    print("📄 预览生成的 TypeScript 代码：")
    print("=" * 60)
    print(generate_tool_ts(tool))
    print("=" * 60)


# ============================================================
# Main
# ============================================================
def main():
    dry_run = "--dry-run" in sys.argv
    auto_mode = "--auto" in sys.argv

    print("🤖 AI Design Hub - 内容自动更新流水线")
    print("=" * 50)

    # 检查 mock.ts 是否存在
    if not MOCK_FILE.exists():
        print(f"❌ 找不到 {MOCK_FILE}")
        sys.exit(1)

    existing_slugs = get_existing_slugs()
    print(f"📊 当前工具数量: {len(existing_slugs)}")

    tools_to_add = []

    if auto_mode:
        tools_to_add = discover_new_tools()
        if not tools_to_add:
            print("没有发现新工具，退出。")
            sys.exit(0)
    else:
        # 交互式模式（默认）
        while True:
            tool = interactive_add_tool()
            if tool["slug"] in existing_slugs:
                print(f"⚠️  工具 Slug '{tool['slug']}' 已存在，跳过")
                continue
            preview_tool_ts(tool)
            confirm = input("\n确认添加此工具？(y/n/q): ").strip().lower()
            if confirm == "q":
                break
            if confirm == "y":
                tools_to_add.append(tool)
                existing_slugs.add(tool["slug"])
                more = input("继续添加更多工具？(y/n): ").strip().lower()
                if more != "y":
                    break
            else:
                print("已取消，重新输入...")
                continue

    if not tools_to_add:
        print("没有添加任何工具，退出。")
        sys.exit(0)

    # 写入文件
    if dry_run:
        print("\n� Dry Run 模式，不写入文件。")
        for tool in tools_to_add:
            preview_tool_ts(tool)
        sys.exit(0)

    for tool in tools_to_add:
        tool_ts = generate_tool_ts(tool)
        append_tool_to_mock(tool_ts)
        update_sitemap(tool["slug"])
        update_category_tool_count(tool["category_slug"])
        print(f"✅ 工具「{tool['name']}」添加完成\n")

    # 构建
    if "--no-build" not in sys.argv:
        if run_build():
            deploy_to_cloudstudio()
    else:
        print("\n⚠️  跳过构建（使用了 --no-build 参数）")
        print("请手动运行: npm run build && （部署）")

    print("\n🎉 内容更新流水线执行完成！")


if __name__ == "__main__":
    main()
