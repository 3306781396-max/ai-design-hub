#!/usr/bin/env python3
"""
Generate favicon.ico, og-image.png, apple-touch-icon.png
Pure Python - no Pillow needed. Uses only struct + zlib.
"""

import struct
import zlib
import os
from pathlib import Path

OUT = Path("public")
OUT.mkdir(exist_ok=True)

# ── Minimal valid PNG writer ──

def png_chunk(ctype, data):
    """Build one PNG chunk: length + type + data + CRC32."""
    chunk = ctype + data
    return struct.pack(">I", len(data)) + chunk + struct.pack(">I", zlib.crc32(chunk) & 0xFFFFFFF)


def make_png(width, height, rows):
    """
    rows: list of rows, each row is list of (R,G,B,A) tuples.
    Returns bytes of a valid PNG file.
    """
    # Signature
    sig = b"\x89PNG\r\n\x1a\n"

    # IHDR: width, height, bit_depth=8, color_type=6 (RGBA),
    #        compression=0, filter=0, interlace=0
    ihdr_data = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    ihdr = png_chunk(b"IHDR", ihdr_data)

    # IDAT: image data
    raw = b""
    for row in rows:
        raw += b"\x00"  # filter: none
        for r, g, b, a in row:
            raw += struct.pack("BBBB", r, g, b, a)
    compressed = zlib.compress(raw, 9)
    idat = png_chunk(b"IDAT", compressed)

    # IEND
    iend = png_chunk(b"IEND", b"")

    return sig + ihdr + idat + iend


def solid_png(w, h, r, g, b, a=255):
    rows = [[(r, g, b, a) for _ in range(w)] for _ in range(h)]
    return make_png(w, h, rows)


# ── ICO generator ──

def make_ico(path, images):
    """
    images: list of (width, height, png_bytes) tuples.
    Writes a valid Windows ICO file.
    """
    # Header: reserved(2) + type(2) + count(2)
    header = struct.pack("<HHH", 0, 1, len(images))
    entries = b""
    data_offset = 6 + 16 * len(images)
    offset = data_offset
    for w, h, png_data in images:
        entries += struct.pack(
            "<BBBBII",
            w if w < 256 else, 0,
            h if h < 256 else, 0,
            0, 0,  # palette, reserved
            len(png_data),
            offset,
        )
        offset += len(png_data)
    with open(path, "wb") as f:
        f.write(header + entries)
        for _, _, png_data in images:
            f.write(png_data)


# ── Color palette ──

IND = (99, 102, 241)   # #6366f1 indigo
CYN = (34, 211, 238)   # #22d3ee cyan
DRK = (15, 23, 42)     # #0f172a
WHT = (255, 255, 255)


def diamond_pixels(cx, cy, hs, w, h, r, g, b, a=255):
    """Return list of (x,y,(r,g,b,a)) for pixels inside a diamond."""
    hits = []
    for y in range(max(0, int(cy - hs)), min(h, int(cy + hs) + 1)):
        for x in range(max(0, int(cx - hs)), min(w, int(cx + hs) + 1)):
            d = abs(x - cx) / max(hs, 1) + abs(y - cy) / max(int(hs * 0.6), 1)
            if d <= 1.0:
                hits.append((x, y, (r, g, b, a)))
    return hits


# ── Generate Favicon ──

def gen_favicon():
    images = []
    for size in [16, 32, 48, 64]:
        rows = [[(0, 0, 0, 0) for _ in range(size)] for _ in range(size)]
        # Background circle
        cx, cy = size // 2, size // 2
        rad = size // 2 - 1
        for y in range(size):
            for x in range(size):
                if (x - cx) ** 2 + (y - cy) ** 2 <= rad ** 2:
                    rows[y][x] = IND + (255,)
        # White diamond
        hs = size * 0.3
        for x, y, col in diamond_pixels(cx, cy - size // 10, hs, size, size, *WHT):
            rows[y][x] = col
        # Cut bar (indigo)
        by = cy
        bw = int(hs * 0.45)
        for y2 in range(by - 2, by + 3):
            for x2 in range(cx - bw, cx + bw + 1):
                if 0 <= y2 < size and 0 <= x2 < size:
                    rows[y2][x2] = IND + (255,)
        png = make_png(size, size, rows)
        images.append((size, size, png))
    make_ico(str(OUT / "favicon.ico"), images)
    print("✅ favicon.ico")


# ── Generate OG Image (1200×630) ───

def gen_og_image():
    W, H = 1200, 630
    rows = []
    for y in range(H):
        t = y / max(H - 1, 1)
        r = int(DRK[0] + (DRK[0] - DRK[0]) * t)  # solid dark
        g = int(DRK[1] + (DRK[1] - DRK[1]) * t)
        b = int(DRK[2] + (50 - DRK[2]) * t)
        rows.append([(r, g, b, 255) for _ in range(W)])

    # Glow circles (alpha blend)
    def add_glow(cx, cy, rad, color, alpha):
        for dy in range(-rad, rad + 1):
            for dx in range(-rad, rad + 1):
                x, y = cx + dx, cy + dy
                if 0 <= x < W and 0 <= y < H:
                    d = (dx * dx + dy * dy) ** 0.5
                    if d <= rad:
                        fa = int(alpha * max(0, 1 - d / rad))
                        or_, og, ob, oa = rows[y][x]
                        na = fa + oa * (255 - fa) // 255
                        if na > 0:
                            nr = (color[0] * fa + or_ * oa * (255 - fa) // 255) // max(na, 1)
                            ng = (color[1] * fa + og * oa * (255 - fa) // 255) // max(na, 1)
                            nb = (color[2] * fa + ob * oa * (255 - fa) // 255) // max(na, 1)
                            rows[y][x] = (nr, ng, nb, 255)

    add_glow(180, 200, 160, IND, 45)
    add_glow(1020, 430, 190, CYN, 35)

    # Logo diamond (left)
    cx, cy = 200, 260
    hs = 50
    for x, y, col in diamond_pixels(cx, cy, hs, W, H, *IND):
        rows[y][x] = col
    for x, y, col in diamond_pixels(cx, cy, hs - 15, W, H, *CYN):
        rows[y][x] = col

    # Text placeholder: "AI Design Hub" as rectangle blocks
    # Title bar
    for y in range(120, 195):
        for x in range(W // 2 - 280, W // 2 + 282):
            rows[y][x] = (*WHT, 255)
    # Subtitle bar
    for y in range(210, 245):
        for x in range(W // 2 - 240, W // 2 + 242):
            rows[y][x] = (*CYN, 255)
    # URL bar
    for y in range(560, 585):
        for x in range(W // 2 - 120, W // 2 + 122):
            rows[y][x] = (150, 150, 150, 255)

    png = make_png(W, H, rows)
    (OUT / "og-image.png").write_bytes(png)
    print("✅ og-image.png (1200×630)")


# ── Generate Apple Touch Icon ───

def gen_apple_touch():
    S = 180
    rows = [[(0, 0, 0, 0) for _ in range(S)] for _ in range(S)]
    # Rounded background (simulate with circle)
    cx, cy = S // 2, S // 2
    for y in range(S):
        for x in range(S):
            dx, dy = x - cx, y - cy
            if dx * dx + dy * dy <= (S // 2 - 2) ** 2:
                rows[y][x] = (*IND, 255)
    # Border (simulate rounded rect)
    # White diamond
    hs = 40
    for x, y, col in diamond_pixels(cx, cy - 3, hs, S, S, *WHT):
        rows[y][x] = col
    # Cut bar
    by = cy - 3
    bw = int(hs * 0.45)
    for y2 in range(by - 4, by + 5):
        for x2 in range(cx - bw, cx + bw + 1):
            if 0 <= y2 < S and 0 <= x2 < S:
                rows[y2][x2] = (*IND, 255)

    png = make_png(S, S, rows)
    (OUT / "apple-touch-icon.png").write_bytes(png)
    print("✅ apple-touch-icon.png")


# ── Generate Manifest Icons ───

def gen_manifest_icons():
    for S in [192, 512]:
        rows = [[(0, 0, 0, 0) for _ in range(S)] for _ in range(S)]
        cx, cy = S // 2, S // 2
        # Background circle
        for y in range(S):
            for x in range(S):
                dx, dy = x - cx, y - cy
                if dx * dx + dy * dy <= (S // 2 - 1) ** 2:
                    rows[y][x] = (*IND, 255)
        # White diamond
        hs = S * 0.2
        for x, y, col in diamond_pixels(cx, cy, hs, S, S, *WHT):
            rows[y][x] = col
        # Cut bar
        by = cy
        bw = int(hs * 0.45)
        for y2 in range(by - int(hs * 0.08), by + int(hs * 0.08) + 1):
            for x2 in range(cx - bw, cx + bw + 1):
                if 0 <= y2 < S and 0 <= x2 < S:
                    rows[y2][x2] = (*IND, 255)

        png = make_png(S, S, rows)
        (OUT / f"icon-{S}.png").write_bytes(png)
        print(f"✅ icon-{S}.png")


if __name__ == "__main__":
    gen_favicon()
    gen_og_image()
    gen_apple_touch()
    gen_manifest_icons()
    print("\n🎉 All images generated in public/")
