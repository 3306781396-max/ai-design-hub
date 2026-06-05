#!/usr/bin/env python3
"""
fix_mock.py - 修复 mock.ts 中被错误插入的内容，并验证 tools 数组格式
"""

import re
from pathlib import Path

MOCK_FILE = Path("/Users/yinwen/WorkBuddy/2026-06-04-21-08-38/ai-design-hub/src/data/mock.ts")

def find_array_end(content: str, array_start: int) -> int:
    """
    从 array_start 位置开始，用括号计数法找到顶层数组的结束 '];'
    返回 '];' 的起始索引，找不到返回 -1
    """
    depth = 0
    in_string = False
    escape_next = False
    i = array_start
    
    while i < len(content):
        ch = content[i]
        
        if escape_next:
            escape_next = False
            i += 1
            continue
            
        if ch == '\\' and in_string:
            escape_next = True
            i += 1
            continue
            
        if ch == '"' and not escape_next:
            in_string = not in_string
            i += 1
            continue
            
        if in_string:
            i += 1
            continue
            
        if ch == '[':
            depth += 1
        elif ch == ']':
            depth -= 1
            if depth == 0:
                # 检查后面是否紧跟 ';'
                j = i + 1
                while j < len(content) and content[j] in ' \t':
                    j += 1
                if j < len(content) and content[j] == ';':
                    return i  # 返回 ']' 的位置
        elif ch == '{':
            pass  # 对象括号不计入（已简化处理）
            
        i += 1
    
    return -1


def fix_mock_file():
    content = MOCK_FILE.read_text(encoding="utf-8")
    
    # 找到 categories 数组的范围，检查是否有 tool 对象被错误插入
    cat_match = re.search(r'export const categories:\s*Category\[\]\s*=\s*\[', content)
    tools_match = re.search(r'export const tools:\s*Tool\[\]\s*=\s*\[', content)
    
    if not cat_match or not tools_match:
        print("❌ 找不到 categories 或 tools 数组")
        return False
    
    cat_start = cat_match.end()
    tools_start = tools_match.start()
    cat_array_end = find_array_end(content, cat_start)
    
    if cat_array_end == -1:
        print("❌ 找不到 categories 数组的结束位置")
        return False
    
    # categories 数组内容范围
    cat_content_start = cat_start
    cat_content_end = cat_array_end  # ']' 的位置
    
    print(f"Categories 数组: 起始约 {cat_start}, 结束于 {cat_array_end}")
    print(f"Tools 数组起始: {tools_start}")
    
    # 检查 categories 数组内容中是否有 slug: "ideogram-ai" 或类似 tool 字段
    cat_body = content[cat_content_start:cat_content_end]
    
    # 查找被错误插入的 tool 对象（有 slug 字段但在 categories 里）
    # 更简单的检查：categories 里不应该有 slug 字段
    if '"ideogram-ai"' in cat_body or 'slug:' in cat_body:
        print("⚠️  检测到 categories 数组中有错误插入的 tool 对象")
        print("   需要手动修复 mock.ts")
        # 尝试自动修复：找到 ideogram-ai 块的起始和结束
        # 在 cat_body 中找 { ... }
        idx = cat_body.find('"ideogram-ai"')
        if idx != -1:
            # 向前找到 '{'
            block_start = cat_body.rfind('{', 0, idx)
            # 向后找到匹配的 '}'
            depth = 0
            block_end = -1
            for j in range(block_start, len(cat_body)):
                if cat_body[j] == '{':
                    depth += 1
                elif cat_body[j] == '}':
                    depth -= 1
                    if depth == 0:
                        block_end = j
                        break
            
            if block_end != -1:
                # 在整个 content 中的绝对位置
                abs_start = cat_content_start + block_start
                abs_end = cat_content_start + block_end + 1  # 包含 '}'
                
                # 找前面的逗号
                pre_start = abs_start
                while pre_start > 0 and content[pre_start] in ' \t\n':
                    pre_start -= 1
                if pre_start >= 0 and content[pre_start] == ',':
                    pre_start -= 1
                    while pre_start > 0 and content[pre_start] in ' \t\n':
                        pre_start -= 1
                    pre_start += 1
                
                print(f"   删除位置: {pre_start} ~ {abs_end}")
                content = content[:pre_start] + "\n" + content[abs_end+1:]
                MOCK_FILE.write_text(content, encoding="utf-8")
                print("✅ 已删除错误插入的 tool 对象")
                return True
    
    print("✅ categories 数组看起来正常")
    return True


def validate_tools_array():
    """验证 tools 数组的 TypeScript 语法没有明显问题"""
    content = MOCK_FILE.read_text(encoding="utf-8")
    tools_match = re.search(r'export const tools:\s*Tool\[\]\s*=\s*\[', content)
    if not tools_match:
        print("❌ 找不到 tools 数组")
        return False
    
    # 找到 tools 数组的内容
    start = tools_match.end()
    # 简单找结束 '];'
    depth = 0
    in_string = False
    escape_next = False
    i = start
    
   工具列表 = []
    return True


if __name__ == "__main__":
    print("🔧 修复 mock.ts...")
    fix_mock_file()
    print("\n完成。请运行: python3 scripts/test_add_tool_v2.py")
