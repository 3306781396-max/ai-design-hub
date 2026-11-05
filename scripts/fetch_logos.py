#!/usr/bin/env python3
"""Download tool logos from DuckDuckGo/Google favicon services into public/logos/."""
import re, os, subprocess, sys, json

MOCK = "src/data/mock.ts"
OUT_DIR = "public/logos"
os.makedirs(OUT_DIR, exist_ok=True)
PROXY = "http://127.0.0.1:7897"

src = open(MOCK, encoding="utf-8").read()

# Extract tool objects: find blocks with id: "tool-..." ... website_url
tools = []
for m in re.finditer(r'id: "(tool-\d+)",\s*\n\s*slug: "([^"]+)"', src):
    tools.append({"id": m.group(1), "slug": m.group(2)})

# map slug -> website_url by scanning object text
for m in re.finditer(r'id: "(tool-\d+)",[\s\S]{0,2500}?website_url: "([^"]+)"', src):
    for t in tools:
        if t["id"] == m.group(1):
            t["url"] = m.group(2)

def host(u):
    h = re.sub(r"^https?://(www\.)?", "", u).split("/")[0]
    return h

def try_download(url, path):
    r = subprocess.run(
        ["curl", "-sL", "-o", path, "-w", "%{http_code}", "--proxy", PROXY,
         "--max-time", "25", url],
        capture_output=True, text=True)
    if r.stdout.strip() == "200" and os.path.exists(path):
        with open(path, "rb") as f:
            head = f.read(8)
        if head[:4] == b"\x89PNG" or head[:3] == b"\xff\xd8\xff" or head[:4] == b"RIFF" or head[:4] == b"\x00\x00\x01\x00":
            return True
    if os.path.exists(path):
        os.remove(path)
    return False

results = {"ok": [], "fail": []}
for t in tools:
    h = host(t["url"])
    out = os.path.join(OUT_DIR, t["slug"] + ".png")
    if os.path.exists(out) and os.path.getsize(out) > 1000:
        results["ok"].append((t["slug"], h, "cached"))
        continue
    ok = try_download(f"https://icons.duckduckgo.com/ip3/{h}.ico", out)
    src_used = "ddg"
    if not ok:
        ok = try_download(f"https://www.google.com/s2/favicons?domain={h}&sz=256", out)
        src_used = "google"
    (results["ok"] if ok else results["fail"]).append((t["slug"], h, src_used if ok else "-"))

print(f"total={len(tools)} ok={len(results['ok'])} fail={len(results['fail'])}")
for s, h, k in results["fail"]:
    print("FAIL", s, h)
json.dump({t["slug"]: t["url"] for t in tools}, open("/tmp/tool_urls.json", "w"))
