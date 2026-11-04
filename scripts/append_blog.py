#!/usr/bin/env python3
"""
append_blog.py - 向 mock.ts 的 blogPosts 数组追加新博客文章

用法：
  python3 scripts/append_blog.py <json_file>
  python3 scripts/append_blog.py --test        # 用内置测试数据运行
  python3 scripts/append_blog.py --stdin       # 从 stdin 读取 JSON
"""

import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

PROJECT_ROOT = Path("/Users/yinwen/WorkBuddy/2026-06-04-21-08-38/ai-design-hub")
MOCK_FILE = PROJECT_ROOT / "src" / "data" / "mock.ts"
SITEMAP_FILE = PROJECT_ROOT / "public" / "sitemap.xml"


def find_blogposts_array_end(content: str) -> int:
    """括号计数，找到 blogPosts 数组的结束 ']'，返回其索引，失败返回 -1"""
    header = "export const blogPosts: BlogPost[]"
    h = content.find(header)
    if h == -1:
        return -1

    eq = content.find("=[", h)
    if eq == -1:
        eq = content.find("= [", h)
    if eq == -1:
        return -1

    arr_start = eq + 2

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
        if c == "\\" and in_str:
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
        if c == "[":
            depth += 1
        elif c == "]":
            depth -= 1
            if depth == 0:
                return i
        i += 1

    return -1


def blog_to_ts(post: dict) -> str:
    """将 blog post dict 转为 TypeScript 对象字面量字符串"""
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")

    def s(v):
        return json.dumps(v, ensure_ascii=False)

    def a(arr):
        if not arr:
            return "[]"
        return "[" + ", ".join(json.dumps(x, ensure_ascii=False) for x in arr) + "]"

    def faq_arr(faqs):
        if not faqs:
            return "[]"
        parts = []
        for f in faqs:
            parts.append(
                f"      {{ question: {s(f['question'])}, answer: {s(f['answer'])} }}"
            )
        return "[\n" + ",\n".join(parts) + "\n    ]"

    return f"""  {{
    id: {s(post['id'])},
    slug: {s(post['slug'])},
    title: {s(post['title'])},
    description: {s(post['description'])},
    content: {s(post['content'])},
    author: {s(post['author'])},
    author_avatar: {s(post.get('author_avatar', ''))},
    category: {s(post['category'])},
    tags: {a(post.get('tags', []))},
    seo_title: {s(post.get('seo_title', post['title']))},
    seo_description: {s(post.get('seo_description', post['description'][:160]))},
    keywords: {a(post.get('keywords', []))},
    faq: {faq_arr(post.get('faq', []))},
    read_time: {post.get('read_time', 5)},
    views: {post.get('views', 0)},
    published_at: {s(post.get('published_at', now))},
    updated_at: {s(post.get('updated_at', now))},
    featured: {'true' if post.get('featured') else 'false'},
  }},
"""


def update_blog_count_comment(content: str) -> str:
    """更新 '// Blog Posts (N)' 注释中的计数"""
    pat = r"// Blog Posts \((\d+)\)"
    m = re.search(pat, content)
    if m:
        old = int(m.group(1))
        new_content = content[: m.start(1)] + str(old + 1) + content[m.end(1) :]
        return new_content
    return content


def update_sitemap(blog_slug: str, base: str = "https://ai-design-hub.vercel.app") -> bool:
    """在 sitemap.xml 中添加新博客文章的 URL"""
    if not SITEMAP_FILE.exists():
        print("  ⚠️  sitemap.xml 不存在，跳过")
        return False

    entry = f"""  <url>
    <loc>{base}/blog/{blog_slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
"""
    content = SITEMAP_FILE.read_text(encoding="utf-8")
    # 在 </urlset> 之前插入（排在工具后面）
    content = content.replace("</urlset>", entry + "</urlset>")
    SITEMAP_FILE.write_text(content, encoding="utf-8")
    return True


def append_blog_post(post: dict, dry_run: bool = False) -> bool:
    """将一篇博客文章追加到 mock.ts"""
    content = MOCK_FILE.read_text(encoding="utf-8")

    # 检查重复 slug
    slugs = set(re.findall(r'slug:\s*"([^"]+)"', content))
    if post["slug"] in slugs:
        print(f"  ⚠️  slug '{post['slug']}' 已存在，跳过")
        return False

    # 分配 ID（如果未提供）
    if "id" not in post or not post["id"]:
        ids = re.findall(r'id:\s*"blog-(\d+)"', content)
        n = max(int(x) for x in ids) + 1 if ids else 1
        post["id"] = f"blog-{n:03d}"

    # 生成 TS 代码
    ts_block = blog_to_ts(post)

    # 找到 blogPosts 数组的结束 ']'
    end_idx = find_blogposts_array_end(content)
    if end_idx == -1:
        print("  ❌ 找不到 blogPosts 数组的结束位置")
        return False

    # 在 ']' 前插入新文章
    before = content[:end_idx]
    after = content[end_idx:]

    if not before.endswith("\n"):
        before += "\n"

    new_content = before + ts_block + after

    # 更新 blogPosts 计数注释
    new_content = update_blog_count_comment(new_content)

    if dry_run:
        print("  🔍 Dry run — 不写入文件")
        print(ts_block[:300] + "...")
        return True

    MOCK_FILE.write_text(new_content, encoding="utf-8")
    print(f"  ✅ 已写入 {MOCK_FILE.relative_to(PROJECT_ROOT)}")

    # 更新 sitemap
    update_sitemap(post["slug"])
    print(f"  ✅ 已更新 sitemap.xml")

    return True


# ─── 测试数据 ───────────────────────────────────────────
TEST_POST = {
    "slug": "ai-design-news-june-8-2026",
    "title": "AI 设计日报 | 2026年6月8日 - Figma AI 重大更新, Midjourney V7 发布",
    "description": "今日 AI 设计领域速览：Figma 推出全新 AI 布局功能，Midjourney V7 正式发布带来革命性改进，Adobe 发布 AI 视频编辑工具。",
    "content": """## 🚀 今日头条

### Figma AI 推出智能布局引擎
Figma 今日发布了全新的 AI 驱动智能布局引擎，可以自动识别设计稿中的元素关系，一键完成自适应布局。这项功能将大幅提升 UI/UX 设计师的工作效率。

**亮点功能：**
- 自动识别组件层级关系
- 智能间距调整
- 响应式断点预览
- 与现有 Auto Layout 无缝集成

### Midjourney V7 正式发布
经过数月的测试，Midjourney V7 正式版本终于发布。新版本在图像质量、提示词理解、风格控制等方面都有显著提升。

**核心改进：**
- 图像分辨率提升至 4K
- 角色一致性大幅增强
- 新增「风格记忆」功能
- 支持视频生成（Beta）

### Adobe 发布 Premiere Pro AI 插件
Adobe 为 Premiere Pro 推出了全新的 AI 视频编辑插件，支持智能剪辑、自动字幕生成、场景识别等功能。

## 📊 行业趋势

- AI 设计工具市场规模预计 2026 年突破 150 亿美元
- 超过 60% 的设计师已在使用 AI 工具辅助工作
- 视频生成 AI 成为新的投资热点

## 🛠️ 新工具推荐

本周值得关注的 AI 设计新工具：
- **Relume AI** - AI 网站架构生成
- **Galileo AI** - 自然语言生成 UI 设计
- **Diagram** - AI 设计系统管理

---
*本文由 AI Design Hub 自动生成，旨在提供 AI 设计领域每日资讯。*""",
    "author": "AI Design Hub",
    "author_avatar": "https://ui-avatars.com/api/?name=AI+Hub&background=8b5cf6&color=fff",
    "category": "AI 日报",
    "tags": ["AI 日报", "AI 设计新闻", "Figma AI", "Midjourney V7", "Adobe"],
    "seo_title": "AI 设计日报 2026年6月8日 - Figma AI 更新, Midjourney V7",
    "seo_description": "每日 AI 设计新闻速览：Figma AI 智能布局引擎发布，Midjourney V7 正式上线，Adobe 推出 AI 视频编辑工具。了解最新的 AI 设计行业动态。",
    "keywords": ["AI 设计日报", "AI 设计新闻", "Figma AI", "Midjourney V7", "Adobe AI", "AI 设计工具"],
    "faq": [
        {
            "question": "这是什么栏目？",
            "answer": "AI 日报是 AI Design Hub 每日自动更新的 AI 设计领域新闻速览，涵盖新工具发布、行业动态、技术趋势等。"
        }
    ],
    "read_time": 5,
    "views": 0,
    "featured": False,
}


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    flags = [a for a in sys.argv[1:] if a.startswith("--")]
    dry_run = "--dry-run" in flags
    is_test = "--test" in flags
    from_stdin = "--stdin" in flags

    print("📝 向 mock.ts 追加新博客文章")
    print("=" * 50)

    if not MOCK_FILE.exists():
        print(f"❌ 找不到 {MOCK_FILE}")
        sys.exit(1)

    posts_to_add = []

    if is_test:
        posts_to_add.append(TEST_POST)
    elif from_stdin:
        raw = sys.stdin.read()
        data = json.loads(raw)
        if isinstance(data, dict):
            data = [data]
        posts_to_add = data
    elif args:
        json_path = Path(args[0])
        if not json_path.exists():
            print(f"❌ JSON 文件不存在: {json_path}")
            sys.exit(1)
        data = json.loads(json_path.read_text(encoding="utf-8"))
        if isinstance(data, dict):
            data = [data]
        posts_to_add = data
    else:
        print("用法：")
        print("  python3 scripts/append_blog.py --test [--dry-run]     # 测试模式")
        print("  python3 scripts/append_blog.py data.json [--dry-run]   # JSON 文件")
        print("  python3 scripts/append_blog.py --stdin [--dry-run]     # 从 stdin 读取")
        print("  python3 scripts/append_blog.py --help                  # 帮助")
        sys.exit(1)

    for post in posts_to_add:
        print(f"\n📄 添加文章: {post['title'][:60]}...")
        if not append_blog_post(post, dry_run=dry_run):
            print(f"  ❌ 失败！")
            sys.exit(1)

    if dry_run:
        print("\n🔍 Dry run 完成，未写入文件")
    else:
        print("\n✅ 全部完成！请运行 npm run build 构建站点")


if __name__ == "__main__":
    main()
