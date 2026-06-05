#!/usr/bin/env python3
"""Fix mock.ts lines that have /images/tool-placeholder.png without trailing '',"""
import os

PATH = os.path.join(os.path.dirname(__file__), "..", "src", "data", "mock.ts")
with open(PATH, "r", encoding="utf-8") as f:
    lines = f.readlines()

fixed = []
changed = 0
for line in lines:
    stripped = line.rstrip()
    if "/images/tool-placeholder.png" in stripped:
        if not stripped.endswith("",""):
            # Missing "", at end - add it
            line = line.rstrip() + "",\n"
            changed += 1
    fixed.append(line)

if changed > 0:
    with open(PATH, "w", encoding="utf-8") as f:
        f.writelines(fixed)
    print(f"Fixed {changed} lines in mock.ts")
else:
    print("No changes needed")
