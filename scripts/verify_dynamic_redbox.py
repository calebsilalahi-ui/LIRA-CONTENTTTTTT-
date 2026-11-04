import os
import sys
from PIL import Image, ImageDraw

def verify_and_draw_red_box(image_path, output_path):
    im = Image.open(image_path)
    w, h = im.size
    assert w == 1080 and h == 1440, f"Expected 1080x1440, got {w}x{h}"
    
    # Red box coordinates
    # x: [192, 896], y: [202, 1236]
    draw = ImageDraw.Draw(im)
    draw.rectangle([192, 202, 896, 1236], outline="red", width=4)
    
    im.save(output_path, "JPEG")
    print(f"Verified {image_path}: Red Box drawn -> {output_path}")

if __name__ == "__main__":
    frames = [45, 200, 360, 520, 700, 840]
    out_dir = "/Users/caleb/.gemini/antigravity/brain/f18f0beb-93e2-4242-821c-d5f2f1299248/sample_dynamic_verified_frames"
    os.makedirs(out_dir, exist_ok=True)
    for f in frames:
        src = f"/Users/caleb/.gemini/antigravity/brain/f18f0beb-93e2-4242-821c-d5f2f1299248/sample_dynamic_still_{f}.jpg"
        if os.path.exists(src):
            dst = os.path.join(out_dir, f"box_still_{f}.jpg")
            verify_and_draw_red_box(src, dst)
        else:
            print(f"Pending: {src}")
