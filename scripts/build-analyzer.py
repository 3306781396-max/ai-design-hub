#!/usr/bin/env python3
"""
build_analyzer.py - 分析 Next.js 构建产物大小
帮助优化包体积和加载性能
"""

import os
import json
from pathlib import Path

BUILD_DIR = Path(__file__).parent.parent / ".next"
ANALYZE_OUTPUT = Path(__file__).parent / "build-report.json"

def analyze_build():
    """分析构建产物"""
    if not BUILD_DIR.exists():
        print("❌ No .next build directory found. Run `npm run build` first.")
        return
    
    print("📊 Analyzing build output...")
    
    # 收集所有 JS 文件
    js_files = list(BUILD_DIR.rglob("*.js"))
    
    total_size = 0
    file_data = []
    
    for f in js_files:
        size = f.stat().st_size
        total_size += size
        file_data.append({
            "file": str(f.relative_to(BUILD_DIR)),
            "size_kb": round(size / 1024, 2)
        })
    
    # 按大小排序
    file_data.sort(key=lambda x: x["size_kb"], reverse=True)
    
    report = {
        "total_js_kb": round(total_size / 1024, 2),
        "total_files": len(js_files),
        "top_10_largest": file_data[:10]
    }
    
    with open(ANALYZE_OUTPUT, "w") as f:
        json.dump(report, f, indent=2)
    
    print(f"✅ Analysis complete:")
    print(f"   - Total JS: {report['total_js_kb']} KB")
    print(f"   - Files: {report['total_files']}")
    print(f"   - Report: {ANALYZE_OUTPUT}")

if __name__ == "__main__":
    analyze_build()
