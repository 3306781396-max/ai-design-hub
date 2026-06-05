#!/usr/bin/env python3
"""
Generate favicon.ico, og-image.png, apple-touch-icon.png
Pure Python - no Pillow needed. Uses raw PNG generation.
"""

import struct
import zlib
import os
from pathlib import Path

OUT = Path("public")
OUT.mkdir(exist_ok=True)

# ─── Raw PNG writer ───

def make_png(width, height, pixels):
    """
    pixels: list of rows, each row is list of (R, G, B, A) tuples.
    Returns bytes of a valid PNG file.
    """
    def chunk(ctype, data):
        c = ctype + data
        return struct.pack(">I", len(data)) + c + struct.pack(">I", zlib.crc32(c) & 0xFFFFFFF)

    # Signature
    sig = b'\x89PNG\r\n\x1a\n'
    # IHDR
    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    # IDAT (image data)
    raw = b""
    for row in pixels:
        raw += b'\x00'  # filter none
        for r, g, b, a in row:
            raw += struct.pack("BBBB", r, g, b, a)
    compressed = zlib.compress(raw, 9)
    # IEND
    return sig + chunk(b'IHDR', ihdr) + chunk(b'IDAT', compressed) + chunk(b'IEND', b'')


def solid_png(w, h, r, g, b, a=255):
    pixels = [[(r, g, b, a) for _ in range(w)] for _ in range(h)]
    return make_png(w, h, pixels)


def gradient_png(w, h, c1, c2):
    """Vertical gradient from c1 to c2 (each is (R,G,B))."""
    pixels = []
    for y in range(h):
        t = y / max(h - 1, 1)
        cr = int(c1[0] + (c2[0] - c1[0]) * t)
        cg = int(c1[1] + (c2[1] - c1[1]) * t)
        cb = int(c1[2] + (c2[2] - c1[2]) * t)
        row = [(cr, cg, cb, 255) for _ in range(w)]
        pixels.append(row)
    return make_png(w, h, pixels)


def draw_diamond(pixels, cx, cy, hs, r, g, b, a=255, w=None, h=None):
    """Draw a filled diamond on pixel buffer."""
    h_half = len(pixels) // 2
    w_half = len(pixels[0]) // 2 if pixels else 0
    for y in range(len(pixels)):
        for x in range(len(pixels[0])):
            # Check if point is inside diamond
            # |x-cx|/hsx + |y-cy|/hsy <= 1
            d = abs(x - cx) / max(hs, 1) + abs(y - cy) / max(int(hs * 0.6), 1)
            if d <= 1.0:
                pixels[y][x] = (r, g, b, a)


def composite(pixels, overlay, ox, oy):
    """Composite overlay (RGBA pixels) onto pixels at (ox, oy)."""
    for dy in range(len(overlay)):
        for dx in range(len(overlay[0])):
            if oy + dy < 0 or oy + dy >= len(pixels):
                continue
            if ox + dx < 0 or ox + dx >= len(pixels[0]):
                continue
            or_, og, ob, oa = overlay[dy][dx]
            if oa == 0:
                continue
            # Alpha blend
            da = pixels[oy + dy][ox + dx][3] / 255.0
            na = oa / 255.0 + da * (1 - oa / 255.0)
            if na > 0:
                pr, pg, pb = pixels[oy + dy][ox + dx][:3]
                nr = int((or_ * oa / 255 + pr * da * (1 - oa / 255)) / na)
                ng = int((og * oa / 255 + pg * da * (1 - oa / 255)) / na)
                nb = int((ob * oa / 255 + pb * da * (1 - oa / 255)) / na)
                na2 = int(na * 255)
                pixels[oy + dy][ox + dx] = (nr, ng, nb, na2)


def new_pixels(w, h, r=0, g=0, b=0, a=0):
    return [[(r, g, b, a) for _ in range(w)] for _ in range(h)]


# ─── Generate Favicon (multi-size ICO) ───

def make_favicon():
    """Create a 64x64 PNG and save as favicon.ico (single-image ICO)."""
    S = 64
    px = new_pixels(S, S)
    # Background circle (indigo)
    for y in range(S):
        for x in range(S):
            dx, dy = x - S // 2, y - S // 2
            if dx * dx + dy * dy <= (S // 2 - 2) ** 2:
                px[y][x] = (99, 102, 241, 255)
    # White diamond (A shape)
    cx, cy = S // 2, S // 2
    hs = 18
    draw_diamond(px, cx, cy - 4, hs, 255, 255, 255, 255)
    # Cut middle bar (indigo)
    by = cy
    for y in range(by - 3, by + 4):
        for x in range(cx - 8, cx + 9):
            if 0 <= y < S and 0 <= x < S:
                px[y][x] = (99, 102, 241, 255)

    png = make_png(S, S, px)
    OUT.joinpath("favicon.ico").write_bytes(png)
    print("✅ favicon.ico")


def make_og_image():
    """1200x630 OG image."""
    W, H = 1200, 630
    # Background: dark gradient
    px = new_pixels(W, H)
    for y in range(H):
        t = y / H
        r = int(15 + t * (15 - 15))
        g = int(23 + t * (23 - 23))
        b = int(42 + t * (50 - 42))
        for x in range(W):
            px[y][x] = (r, g, b, 255)

    # Glow circles (semi-transparent overlay)
    def add_glow(cx, cy, rad, color, alpha):
        for y in range(max(0, cy - rad), min(H, cy + rad + 1)):
            for x in range(max(0, cx - rad), min(W, cx + rad + 1)):
                d = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5
                if d <= rad:
                    fa = int(alpha * max(0, 1 - d / rad))
                    if fa > 0:
                        pr, pg, pb, pa = px[y][x]
                        na = fa + pa * (255 - fa) // 255
                        if na > 0:
                            nr = (color[0] * fa + pr * pa * (255 - fa) // 255) // max(na, 1)
                            ng = (color[1] * fa + pg * pa * (255 - fa) // 255) // max(na, 1)
                            nb = (color[2] * fa + pb * pa * (255 - fa) // 255) // max(na, 1)
                            px[y][x] = (nr, ng, nb, 255)

    add_glow(180, 200, 150, (99, 102, 241), 50)
    add_glow(1020, 430, 180, (34, 211, 238), 40)

    # Logo diamond (left side)
    logo_cx, logo_cy = 200, 250
    hs = 50
    # Outer diamond (indigo)
    diamond_outer = new_pixels(W, H)
    draw_diamond(diamond_outer, logo_cx, logo_cy, hs, 99, 102, 241, 255)
    composite(px, diamond_outer, 0, 0)
    # Inner diamond (cyan)
    diamond_inner = new_pixels(W, H)
    draw_diamond(diamond_inner, logo_cx, logo_cy, hs - 15, 34, 211, 238, 255)
    composite(px, diamond_inner, 0, 0)

    # ── Text rendering (bitmap font) ───
    # Simple: just draw "AI DESIGN HUB" as rectangle blocks
    # Title at y=120
    def draw_text_block(px, x, y, text, color=(255,255,255,255)):
        """Super simple text: each char is a 5x7 block."""
        # Just draw a placeholder rectangle for text
        for dy in range(40):
            for dx in range(len(text) * 20):
                if y + dy < H and x + dx < W:
                    px[y + dy][x + dx] = color

    # Title: "AI Design Hub"
    draw_text_block(px, W // 2 - 200, 120, "AI Design Hub", (255, 255, 255, 255))
    draw_text_block(px, W // 2 - 280, 200, "Discover the Best AI Design Tools", (34, 211, 238, 255))

    png = make_png(W, H, px)
    OUT.joinpath("og-image.png").write_bytes(png)
    print("✅ og-image.png (1200×630)")


def make_apple_touch_icon():
    S = 180
    px = new_pixels(S, S)
    # Rounded rect background (fill)
    for y in range(S):
        for x in range(S):
            # Simple rounding
            corner = 18
            in_rect = True
            if x < corner and y < corner:
                dx, dy = corner - x, corner - y
                in_rect = (dx * dx + dy * dy) <= corner * corner
            if in_rect:
                px[y][x] = (99, 102, 241, 255)
    # White diamond
    cx, cy = S // 2, S // 2 - 5
    hs = 35
    draw_diamond(px, cx, cy, hs, 255, 255, 255, 255)
    # Cut bar
    by = cy
    for y in range(by - 5, by + 6):
        for x in range(cx - 15, cx + 16):
            if 0 <= y < S and 0 <= x < S:
                px[y][x] = (99, 102, 241, 255)

    png = make_png(S, S, px)
    OUT.joinpath("apple-touch-icon.png").write_bytes(png)
    print("✅ apple-touch-icon.png")


def make_manifest_icons():
    for size in [192, 512]:
        px = new_pixels(size, size)
        # Background
        for y in range(size):
            for x in range(size):
                dx, dy = x - size // 2, y - size // 2
                if dx * dx + dy * dy <= (size // 2) ** 2:
                    px[y][x] = (99, 102, 241, 255)
        # Diamond
        cx, cy = size // 2, size // 2
        hs = size // 5
        draw_diamond(px, cx, cy, hs, 255, 255, 255, 255)
        # Cut bar
        by = cy
        bw = int(hs * 0.45)
        for y in range(by - 4, by + 5):
            for x in range(cx - bw, cx + bw + 1):
                if 0 <= y < size and 0 <= x < size:
                    px[y][x] = (99, 102, 241, 255)

        png = make_png(size, size, px)
        OUT.joinpath(f"icon-{size}.png").write_bytes(png)
        print(f"✅ icon-{size}.png")


if __name__ == "__main__":
    make_favicon()
    make_og_image()
    make_apple_touch_icon()
    make_manifest_icons()
    print("\n🎉 All images generated in /public/")
