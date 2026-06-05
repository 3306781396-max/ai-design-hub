#!/usr/bin/env python3
"""
Generate favicon.ico, og-image.png, apple-touch-icon.png
for AI Design Hub.
"""

from PIL import Image, ImageDraw, ImageFont
import math

# ─── Color palette ───
INDIGO = (99, 102, 241)    # #6366f1
CYAN = (34, 211, 238)         # #22d3ee
DARK = (15, 23, 42)           # #0f172a
WHITE = (255, 255, 255)

OUT_DIR = "public/images"


def draw_logo(draw, cx, cy, size, color1=INDIGO, color2=CYAN):
    """Draw a stylized 'A' / diamond logo."""
    hs = size / 2
    # Diamond / triangle shape
    points = [
        (cx, cy - hs),
        (cx + hs * 0.85, cy + hs * 0.6),
        (cx - hs * 0.85, cy + hs * 0.6),
    ]
    # Draw a gradient-ish diamond
    draw.polygon(points, fill=color1)
    # Inner smaller diamond
    pad = size * 0.25
    inner = [
        (cx, cy - hs + pad),
        (cx + (hs - pad) * 0.85, cy + (hs - pad) * 0.6),
        (cx - (hs - pad) * 0.85, cy + (hs - pad) * 0.6),
    ]
    draw.polygon(inner, fill=color2)


def generate_favicon():
    """Generate multi-size favicon.ico"""
    sizes = [16, 32, 48, 64, 128, 256]
    images = []
    for s in sizes:
        img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        # Draw a circle background for small sizes
        pad = int(s * 0.1)
        draw.ellipse([pad, pad, s - pad, s - pad], fill=INDIGO)
        # 'A' letter or sparkle
        cx, cy = s // 2, s // 2
        hs = s * 0.3
        # Draw a simple 'A' shape
        points = [
            (cx, cy - int(hs * 1.1)),
            (cx + int(hs * 0.9), cy + int(hs * 0.7)),
            (cx - int(hs * 0.9), cy + int(hs * 0.7)),
        ]
        draw.polygon(points, fill=WHITE)
        # Cutout middle bar
        by = cy + int(hs * 0.15)
        draw.rectangle([cx - int(hs * 0.5), by - 2, cx + int(hs * 0.5), by + 2], fill=INDIGO)
        images.append(img)

    # Save as ICO
    images[0].save(
        "public/favicon.ico",
        format="ICO",
        sizes=[(img.size[0], img.size[1]) for img in images],
    )
    print("✅ favicon.ico")


def generate_og_image():
    """Generate 1200x630 OG image."""
    W, H = 1200, 630
    img = Image.new("RGB", (W, H), DARK)
    draw = ImageDraw.Draw(img)

    # Background gradient effect (simulate with rectangles)
    for y in range(H):
        t = y / H
        r = int(15 + t * (15 - 15))
        g = int(23 + t * (23 - 23))
        b = int(42 + t * (30 - 42))
        draw.line([(0, y), (W, y)], fill=(r, g, b))

    # Accent glow circles (decorative)
    for cx, cy, rad, color, alpha in [
        (180, 200, 180, (*INDIGO, 40), 40),
        (1020, 430, 200, (*CYAN, 30), 30),
        (950, 150, 120, (*INDIGO, 25), 25),
    ]:
        overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        odraw = ImageDraw.Draw(overlay)
        odraw.ellipse(
            [cx - rad, cy - rad, cx + rad, cy + rad],
            fill=color,
        )
        img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
        draw = ImageDraw.Draw(img)

    # ── Logo area (left) ───
    logo_cx, logo_cy = 200, 200
    # Diamond
    hs = 50
    points = [
        (logo_cx, logo_cy - hs),
        (logo_cx + int(hs * 0.85), logo_cy + int(hs * 0.6)),
        (logo_cx - int(hs * 0.85), logo_cy + int(hs * 0.6)),
    ]
    draw.polygon(points, fill=INDIGO)
    inner = [
        (logo_cx, logo_cy - hs + 15),
        (logo_cx + int((hs - 15) * 0.85), logo_cy + int((hs - 15) * 0.6)),
        (logo_cx - int((hs - 15) * 0.85), logo_cy + int((hs - 15) * 0.6)),
    ]
    draw.polygon(inner, fill=CYAN)

    # ── Text ───
    try:
        font_large = ImageFont.truetype("/System/Library/Fonts/Helvetica-Bold.ttc", 72)
        font_medium = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 28)
        font_small = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 22)
    except (OSError, IOError):
        font_large = ImageFont.load_default()
        font_medium = ImageFont.load_default()
        font_small = ImageFont.load_default()

    # Title: "AI Design Hub"
    title = "AI Design Hub"
    bbox = draw.textbbox((0, 0), title, font=font_large)
    tw = bbox[2] - bbox[0]
    tx = (W - tw) // 2
    draw.text((tx, 180), title, fill=WHITE, font=font_large)

    # Subtitle
    sub = "Discover the Best AI Design Tools"
    bbox2 = draw.textbbox((0, 0), sub, font=font_medium)
    sw = bbox2[2] - bbox2[0]
    sx = (W - sw) // 2
    draw.text((sx, 270), sub, fill=CYAN, font=font_medium)

    # Decorative line
    line_y = 330
    draw.line([(W // 2 - 60, line_y), (W // 2 + 60, line_y)], fill=CYAN, width=2)

    # Feature pills
    features = ["Image Gen", "Video", "3D", "UI/UX", "Productivity"]
    fx = (W - 500) // 2
    fy = 370
    for i, feat in enumerate(features):
        px = fx + i * 100
        draw.rounded_rectangle(
            [px, fy, px + 90, fy + 36],
            radius=18,
            fill=(99, 102, 241, 80),
            outline=(34, 211, 238, 120),
            width=1,
        )
        bbox3 = draw.textbbox((0, 0), feat, font=font_small)
        fw = bbox3[2] - bbox3[0]
        draw.text((px + (90 - fw) // 2, fy + 7), feat, fill=WHITE, font=font_small)

    # Bottom URL
    url = "ai-design-hub.com"
    bbox4 = draw.textbbox((0, 0), url, font=font_small)
    uw = bbox4[2] - bbox4[0]
    draw.text(((W - uw) // 2, 560), url, fill=(150, 150, 150), font=font_small)

    img.save("public/og-image.png", "PNG")
    print("✅ og-image.png (1200×630)")


def generate_apple_touch_icon():
    """Generate 180x180 Apple touch icon."""
    S = 180
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Rounded background
    draw.rounded_rectangle([4, 4, S - 4, S - 4], radius=36, fill=INDIGO)

    # Logo
    cx, cy = S // 2, S // 2 - 5
    hs = 40
    points = [
        (cx, cy - hs),
        (cx + int(hs * 0.85), cy + int(hs * 0.6)),
        (cx - int(hs * 0.85), cy + int(hs * 0.6)),
    ]
    draw.polygon(points, fill=WHITE)

    img.save("public/apple-touch-icon.png", "PNG")
    print("✅ apple-touch-icon.png")


def generate_manifest_icon():
    """Generate 512x512 PNG icon for manifest.json."""
    S = 512
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Background
    draw.rounded_rectangle([0, 0, S, S], radius=80, fill=INDIGO)

    # Glow
    glow = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gdraw.ellipse([S//2 - 150, S//2 - 150, S//2 + 150, S//2 + 150], fill=(*CYAN, 60))
    img = Image.alpha_composite(img, glow)

    draw = ImageDraw.Draw(img)
    # Logo
    cx, cy = S // 2, S // 2
    hs = 100
    points = [
        (cx, cy - hs),
        (cx + int(hs * 0.85), cy + int(hs * 0.6)),
        (cx - int(hs * 0.85), cy + int(hs * 0.6)),
    ]
    draw.polygon(points, fill=WHITE)

    # 'A' cutout bar
    by = cy + int(hs * 0.15)
    draw.rectangle([cx - 40, by - 6, cx + 40, by + 6], fill=INDIGO)

    img.save("public/icon-512.png", "PNG")
    print("✅ icon-512.png")


if __name__ == "__main__":
    import os

    os.makedirs("public", exist_ok=True)
    try:
        generate_favicon()
    except Exception as e:
        print(f"⚠ favicon failed: {e}")
    try:
        generate_og_image()
    except Exception as e:
        print(f"⚠ og-image failed: {e}")
    try:
        generate_apple_touch_icon()
    except Exception as e:
        print(f"⚠ apple-touch-icon failed: {e}")
    try:
        generate_manifest_icon()
    except Exception as e:
        print(f"⚠ icon-512 failed: {e}")
