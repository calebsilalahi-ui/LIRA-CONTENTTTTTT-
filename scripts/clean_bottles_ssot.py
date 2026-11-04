import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy.ndimage import binary_erosion, binary_fill_holes

ASSETS_DIR = "/Users/caleb/.gemini/antigravity/scratch/lira-remotion/public/assets"
OUT_DIR = os.path.join(ASSETS_DIR, "bottles_ssot")
os.makedirs(OUT_DIR, exist_ok=True)

LOGO_PATH = os.path.join(ASSETS_DIR, "lira_logo.jpg")
logo_img = Image.open(LOGO_PATH).convert("RGBA")

# Create circular mask for official Lira logo
lw, lh = logo_img.size
mask = Image.new("L", (lw, lh), 0)
draw = ImageDraw.Draw(mask)
draw.ellipse((2, 2, lw - 3, lh - 3), fill=255)
logo_img.putalpha(mask)


def clean_bottle(src_name: str, out_name: str):
    path = os.path.join(ASSETS_DIR, src_name)
    im = Image.open(path).convert("RGBA")
    arr = np.array(im).astype(np.uint8)
    h, w, _ = arr.shape

    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]
    brightness = (r.astype(np.int32) + g.astype(np.int32) + b.astype(np.int32)) / 3.0

    # Fill any internal alpha holes first, then erode 4px outer white halo
    fg = binary_fill_holes(a > 120)
    inner_fg = binary_erosion(fg, iterations=5)
    deep_fg = binary_erosion(fg, iterations=12)
    halo_ring = inner_fg & (~deep_fg) & (brightness > 215)
    clean_mask = binary_fill_holes(inner_fg & (~halo_ring))

    arr[:, :, 3] = np.where(clean_mask, 255, 0)

    ys, xs = np.where(clean_mask)
    y_min, y_max = ys.min(), ys.max()
    x_min, x_max = xs.min(), xs.max()
    bh = y_max - y_min

    # Seamless vertical interpolation + gentle texture blend over the old label zone (30% to 73%)
    y_top = int(y_min + bh * 0.28)
    y_bot = int(y_min + bh * 0.74)

    # Use clean liquid rows from 20-28% and 74-86%
    s_top1, s_top2 = int(y_min + bh * 0.21), int(y_min + bh * 0.28)
    s_bot1, s_bot2 = int(y_min + bh * 0.74), int(y_min + bh * 0.86)

    top_band = arr[s_top1:s_top2, :, :3].astype(np.float32)
    bot_band = arr[s_bot1:s_bot2, :, :3].astype(np.float32)
    top_mean = np.mean(top_band, axis=0)
    bot_mean = np.mean(bot_band, axis=0)

    span = max(1, y_bot - y_top)
    for idx, y in enumerate(range(y_top, y_bot)):
        t = idx / span
        # Smooth cosine blend between top and bottom liquid profiles + subtle droplet texture
        w_cos = 0.5 - 0.5 * np.cos(np.pi * t)
        tex_top = top_band[idx % len(top_band)] - top_mean
        tex_bot = bot_band[idx % len(bot_band)] - bot_mean
        base_row = (1.0 - w_cos) * top_mean + w_cos * bot_mean
        tex_row = (1.0 - w_cos) * tex_top + w_cos * tex_bot
        row_rgb = np.clip(base_row + 0.55 * tex_row, 0, 255).astype(np.uint8)
        row_mask = clean_mask[y, :]
        arr[y, row_mask, :3] = row_rgb[row_mask]

    pad = 8
    cropped = Image.fromarray(
        arr[
            max(0, y_min - pad) : min(h, y_max + pad),
            max(0, x_min - pad) : min(w, x_max + pad),
        ]
    )

    cw, ch = cropped.size
    logo_diam = int(cw * 0.72)
    logo_resized = logo_img.resize((logo_diam, logo_diam), Image.Resampling.LANCZOS)
    lx = (cw - logo_diam) // 2
    ly = int(ch * 0.46) - logo_diam // 2
    cropped.paste(logo_resized, (lx, ly), logo_resized)

    out_path = os.path.join(OUT_DIR, out_name)
    cropped.save(out_path)
    print(f"Saved clean SSOT bottle: {out_path} ({cropped.size})")


if __name__ == "__main__":
    clean_bottle("choco.png", "choco_ssot.png")
    clean_bottle("matcha.png", "matcha_ssot.png")
    clean_bottle("milktea.png", "milktea_ssot.png")
