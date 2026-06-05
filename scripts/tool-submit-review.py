#!/usr/bin/env python3
"""
tool_submit_review.py - AI 工具提交审核脚本
检查新工具提交的质量、SEO 完整性、合规性
"""

import json
import re
from typing import List, Dict

REQUIRED_FIELDS = ["name", "description", "website_url", "category_slug", "pricing"]
MIN_DESCRIPTION_LEN = 50
MAX_DESCRIPTION_LEN = 300

def validate_tool(tool: Dict) -> List[str]:
    """验证工具数据完整性，返回错误列表"""
    errors = []
    
    # 必填字段检查
    for field in REQUIRED_FIELDS:
        if field not in tool or not tool[field]:
            errors.append(f"Missing required field: {field}")
    
    # 描述长度检查
    desc = tool.get("description", "")
    if len(desc) < MIN_DESCRIPTION_LEN:
        errors.append(f"Description too short: {len(desc)} chars (min {MIN_DESCRIPTION_LEN})")
    if len(desc) > MAX_DESCRIPTION_LEN:
        errors.append(f"Description too long: {len(desc)} chars (max {MAX_DESCRIPTION_LEN})")
    
    # URL 格式检查
    url = tool.get("website_url", "")
    if url and not url.startswith(("http://", "https://")):
        errors.append(f"Invalid website_url format: {url}")
    
    # Pricing 值检查
    valid_pricing = ["Free", "Freemium", "Paid", "Free Trial"]
    if tool.get("pricing") not in valid_pricing:
        errors.append(f"Invalid pricing value: {tool.get('pricing')}")
    
    return errors

def review_submission(tool_data: Dict) -> bool:
    """审核单个工具提交，返回是否通过"""
    print(f"\n🔍 Reviewing: {tool_data.get('name', 'Unknown')}" )
    
    errors = validate_tool(tool_data)
    
    if errors:
        print("❌ Validation FAILED:")
        for err in errors:
            print(f"   - {err}")
        return False
    
    print("✅ Validation PASSED")
    print(f"   - SEO title: {len(tool_data.get('seo_title', ''))} chars")
    print(f"   - SEO desc: {len(tool_data.get('seo_description', ''))} chars")
    print(f"   - Tags: {len(tool_data.get('tags', []))} items")
    return True

if __name__ == "__main__":
    # 示例用法
    sample = {
        "name": "Example AI Tool",
        "description": "A powerful AI tool for creative professionals.",
        "website_url": "https://example.com",
        "category_slug": "ai-image-tools",
        "pricing": "Freemium",
        "seo_title": "Example AI Tool - Best AI Image Generator 2025",
        "seo_description": "Discover Example AI Tool, the best AI-powered image generator.",
        "tags": ["AI", "image", "generator"]
    }
    review_submission(sample)
