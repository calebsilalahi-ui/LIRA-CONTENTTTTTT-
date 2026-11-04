import numpy as np
from PIL import Image
from scipy import ndimage

src_path = "/Users/caleb/Desktop/lira reels/Cooler bag.jpeg"
out_path = "/Users/caleb/.gemini/antigravity/scratch/lira-remotion/public/assets/pixel/tutorial/cooler_bag_cutout.png"

img = Image.open(src_path).convert("RGBA")
arr = np.array(img)
h, w, _ = arr.shape

r = arr[:, :, 0].astype(np.float32)
g = arr[:, :, 1].astype(np.float32)
b = arr[:, :, 2].astype(np.float32)

# The studio background is near-white (r>238, g>238, b>238)
# Also mask out the lower-left text area: x < 395 and y > 650
is_bg = (r > 236) & (g > 236) & (b > 236)
fg = ~is_bg
fg[640:, :405] = False  # remove factory spec text in lower-left corner

# Keep largest connected component (the cooler bag + straps)
labeled, num_features = ndimage.label(fg)
sizes = ndimage.sum(fg, labeled, range(1, num_features + 1))
largest_label = np.argmax(sizes) + 1
bag_mask = labeled == largest_label

# Fill internal holes (the white Lira logo & text inside the green bag!)
# Notice the handle loop at the top has a white background gap between the two black straps (y < 280).
# So we fill holes strictly inside the green bag body (y >= 260) while keeping the gap between the top straps transparent!
body_region = bag_mask.copy()
body_filled = ndimage.binary_fill_holes(body_region)
# For y < 255 (top handle arch), keep original bag_mask so the space between the handles stays transparent
final_mask = body_filled.copy()
final_mask[:255, :] = bag_mask[:255, :]

# Slight 1px anti-aliased feather on outer boundary to prevent white halo
eroded = ndimage.binary_erosion(final_mask, iterations=1)
alpha = (eroded.astype(np.float32) * 255.0).astype(np.uint8)

arr[:, :, 3] = alpha

# Crop tightly around the bag with a small 16px transparent margin
ys, xs = np.where(alpha > 0)
y0, y1 = max(0, ys.min() - 16), min(h, ys.max() + 16)
x0, x1 = max(0, xs.min() - 16), min(w, xs.max() + 16)

cropped = Image.fromarray(arr[y0:y1, x0:x1])
cropped.save(out_path)
print(f"Saved clean cooler bag cutout to {out_path} ({cropped.size})")
