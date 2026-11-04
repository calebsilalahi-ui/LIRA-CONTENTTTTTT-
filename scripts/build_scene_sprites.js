const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const FFMPEG = path.resolve(
  __dirname,
  '../node_modules/@remotion/compositor-darwin-arm64/ffmpeg'
);
const DYLD = path.resolve(
  __dirname,
  '../node_modules/@remotion/compositor-darwin-arm64'
);

function readImageRGBA(filePath, width, height) {
  const buf = execFileSync(
    FFMPEG,
    [
      '-v',
      'error',
      '-i',
      filePath,
      '-vf',
      `scale=${width}:${height}:flags=neighbor`,
      '-f',
      'rawvideo',
      '-pix_fmt',
      'rgba',
      '-',
    ],
    {
      env: { ...process.env, DYLD_LIBRARY_PATH: DYLD },
      maxBuffer: 50 * 1024 * 1024,
    }
  );
  return new Uint8Array(buf);
}

function writeImagePNG(filePath, rgba, width, height) {
  execFileSync(
    FFMPEG,
    [
      '-y',
      '-v',
      'error',
      '-f',
      'rawvideo',
      '-pix_fmt',
      'rgba',
      '-s',
      `${width}x${height}`,
      '-i',
      '-',
      filePath,
    ],
    {
      input: Buffer.from(rgba.buffer, rgba.byteOffset, rgba.byteLength),
      env: { ...process.env, DYLD_LIBRARY_PATH: DYLD },
      maxBuffer: 50 * 1024 * 1024,
    }
  );
}

// 1. Read scene_3_campus.jpg (1024x1024) and official lira_logo.jpg (64x64)
const W = 1024;
const H = 1024;
const campus = readImageRGBA('public/assets/pixel/scene_3_campus.jpg', W, H);
const logoSize = 44;
const logo = readImageRGBA('public/assets/lira_logo.jpg', logoSize, logoSize);

// Helper to get/set pixel on RGBA buffer
function getPx(buf, x, y) {
  const idx = (y * W + x) * 4;
  return [buf[idx], buf[idx + 1], buf[idx + 2], buf[idx + 3]];
}
function setPx(buf, x, y, r, g, b, a = 255) {
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  const idx = (y * W + x) * 4;
  buf[idx] = r;
  buf[idx + 1] = g;
  buf[idx + 2] = b;
  buf[idx + 3] = a;
}
function fillRect(buf, x0, y0, w, h, r, g, b, a = 255) {
  for (let y = y0; y < y0 + h; y++) {
    for (let x = x0; x < x0 + w; x++) {
      setPx(buf, x, y, r, g, b, a);
    }
  }
}

// 2. Extract Caleb Sprite from scene_3_campus.jpg using Flood-Fill from background seeds
// Caleb is inside bounding box x: [220..530], y: [345..985]
// His entire silhouette is bounded by a dark pixel outline (luminance < 52).
const calebMask = new Uint8Array(W * H); // 1 = Caleb, 0 = Background

// First mark bounding box as candidate 1
for (let y = 345; y <= 985; y++) {
  for (let x = 220; x <= 530; x++) {
    calebMask[y * W + x] = 1;
  }
}

function isDarkOutline(x, y) {
  const [r, g, b] = getPx(campus, x, y);
  // Caleb's outline and black hair/glasses/shoes are very dark
  return r < 52 && g < 46 && b < 46;
}

// Also check if a pixel is clearly part of the pink/blue UPH sign or cream stone pillar in the gap between Caleb's neck/shoulder and the bottle (x: 365..475, y: 470..565)
function isSignOrPillarInGap(x, y) {
  if (x < 355 || x > 472 || y < 440 || y > 565) return false;
  const [r, g, b] = getPx(campus, x, y);
  // Pink diamond sign (high R, medium B, low G) or Blue "UPH" banner (high B > R + 20)
  if (b > r + 15 && b > g + 10) return true; // Blue UPH banner
  if (r > 180 && g < 115 && b > 110) return true; // Pink diamond banner
  if (r > 215 && g > 210 && b > 210 && y >= 490 && y <= 542 && x >= 360 && x <= 468) return true; // White letters/border on UPH sign
  return false;
}

// Flood fill exterior background starting from the border of [220..530, 345..985]
// AND from the gap seeds inside the UPH sign (x: 415, y: 515) and stone pillar (x: 430, y: 460)
const visited = new Uint8Array(W * H);
const queue = [];

function pushSeed(x, y) {
  if (x < 220 || x > 530 || y < 345 || y > 985) return;
  const idx = y * W + x;
  if (!visited[idx] && !isDarkOutline(x, y)) {
    visited[idx] = 1;
    calebMask[idx] = 0;
    queue.push([x, y]);
  }
}

// Outer perimeter seeds of Caleb's bounding box
for (let x = 220; x <= 530; x++) {
  pushSeed(x, 345);
  pushSeed(x, 985);
}
for (let y = 345; y <= 985; y++) {
  pushSeed(220, y);
  pushSeed(530, y);
}
// Interior gap seeds between Caleb's head/shoulder and his raised bottle:
// At (420, 465) is the stone background between his cheek and the bottle cap
// At (420, 515) is the blue UPH banner between his neck/cardigan and the bottle
// At (405, 650) is the courtyard/doorway between his cardigan hip and the bottle
pushSeed(420, 465);
pushSeed(445, 465);
pushSeed(420, 515);
pushSeed(395, 515);
pushSeed(445, 515);
pushSeed(415, 650);
// Between his legs (x: 342, y: 840..955)
pushSeed(342, 860);
pushSeed(342, 920);

while (queue.length > 0) {
  const [cx, cy] = queue.pop();
  const neighbors = [
    [cx + 1, cy],
    [cx - 1, cy],
    [cx, cy + 1],
    [cx, cy - 1],
  ];
  for (const [nx, ny] of neighbors) {
    if (nx < 220 || nx > 530 || ny < 345 || ny > 985) continue;
    const nIdx = ny * W + nx;
    if (visited[nIdx]) continue;
    if (!isDarkOutline(nx, ny)) {
      visited[nIdx] = 1;
      calebMask[nIdx] = 0;
      queue.push([nx, ny]);
    }
  }
}

// Also explicitly clear any remaining pink/blue UPH sign pixels in the neck-bottle gap
for (let y = 440; y <= 565; y++) {
  for (let x = 355; x <= 462; x++) {
    if (isSignOrPillarInGap(x, y)) {
      calebMask[y * W + x] = 0;
    }
  }
}

// Create calebSprite RGBA buffer (1024x1024 transparent PNG)
const calebSprite = new Uint8Array(W * H * 4);
for (let y = 345; y <= 985; y++) {
  for (let x = 220; x <= 530; x++) {
    if (calebMask[y * W + x] === 1) {
      const [r, g, b] = getPx(campus, x, y);
      setPx(calebSprite, x, y, r, g, b, 255);
    }
  }
}

// Stamp the Official Circular Lira Logo onto the bottle in Caleb's hand!
// In scene_3_campus.jpg (1024x1024), the bottle label center is at (485, 566), radius ~21px
const labelCenterX = 485;
const labelCenterY = 566;
const labelRadius = 21;
for (let dy = -labelRadius; dy <= labelRadius; dy++) {
  for (let dx = -labelRadius; dx <= labelRadius; dx++) {
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist <= labelRadius) {
      const lx = Math.min(
        logoSize - 1,
        Math.max(0, Math.round(((dx + labelRadius) / (2 * labelRadius)) * (logoSize - 1)))
      );
      const ly = Math.min(
        logoSize - 1,
        Math.max(0, Math.round(((dy + labelRadius) / (2 * labelRadius)) * (logoSize - 1)))
      );
      const lIdx = (ly * logoSize + lx) * 4;
      if (dist >= labelRadius - 1.5) {
        // Crisp dark pixel outline around circular sticker
        setPx(calebSprite, labelCenterX + dx, labelCenterY + dy, 32, 48, 18, 255);
      } else {
        setPx(
          calebSprite,
          labelCenterX + dx,
          labelCenterY + dy,
          logo[lIdx],
          logo[lIdx + 1],
          logo[lIdx + 2],
          255
        );
      }
    }
  }
}

// 3. Now build the Clean 16-Bit Pixel-Art Modern Office Building Background on a copy of campus
const officeBg = new Uint8Array(campus);

// A) Replace the classical pediment & cupola (x: 250..774, y: 15..340) with clean morning sky + Modern Glass Office Tower Penthouse Floors!
for (let y = 12; y <= 295; y++) {
  for (let x = 250; x <= 774; x++) {
    // Copy sky color from x=235 on the same row so the horizontal sky gradient & dithering match 100%!
    const [sr, sg, sb] = getPx(campus, 235, y);
    setPx(officeBg, x, y, sr, sg, sb, 255);
  }
}

// Draw a sleek 16-bit Pixel-Art Modern Office Penthouse / Upper Glass Story (x: 274..750, y: 156..340)
// Outer dark pixel outline
fillRect(officeBg, 266, 148, 492, 14, 34, 28, 26); // Flat modern roof cornice outline
fillRect(officeBg, 270, 152, 484, 8, 142, 134, 124); // Concrete roof trim
fillRect(officeBg, 274, 162, 476, 178, 34, 28, 26); // Penthouse body outline
fillRect(officeBg, 278, 166, 468, 170, 224, 206, 182); // Warm architectural limestone facade

// Vertical limestone pilasters matching the exact column positions of the building below!
const pilasterXs = [278, 354, 430, 506, 582, 658, 730];
for (const px of pilasterXs) {
  fillRect(officeBg, px, 166, 16, 170, 236, 220, 198);
  fillRect(officeBg, px + 13, 166, 3, 170, 186, 168, 146);
}

// Modern Reflective Blue-Teal Office Curtain-Wall Windows across the upper story
const winXs = [298, 374, 450, 526, 602, 678];
for (const wx of winXs) {
  fillRect(officeBg, wx - 3, 178, 52, 108, 34, 28, 26); // Window frame
  fillRect(officeBg, wx, 181, 46, 102, 68, 98, 118); // Blue-teal office glass
  fillRect(officeBg, wx + 4, 185, 14, 94, 96, 132, 156); // Sky reflection highlight
  fillRect(officeBg, wx + 22, 185, 6, 94, 128, 166, 188); // Secondary highlight
  fillRect(officeBg, wx - 3, 230, 52, 5, 34, 28, 26); // Horizontal transom mullion
  fillRect(officeBg, wx + 8, 192, 30, 4, 248, 224, 168); // Warm office ceiling LED light
}

// B) Replace the "UPH COLLEGE" stone frieze text (x: 286..738, y: 292..332) with clean architectural limestone blocks & recessed panels (ZERO TEXT)
fillRect(officeBg, 274, 290, 476, 44, 34, 28, 26);
fillRect(officeBg, 278, 294, 468, 36, 235, 217, 192);
fillRect(officeBg, 296, 302, 136, 20, 212, 192, 166);
fillRect(officeBg, 446, 302, 132, 20, 212, 192, 166);
fillRect(officeBg, 592, 302, 136, 20, 212, 192, 166);

// C) Replace the pink/blue "UPH COLLEGE" banner (x: 380..624, y: 492..544) with a sleek Dark Steel & Glass Office Canopy (ZERO TEXT)
fillRect(officeBg, 380, 492, 244, 52, 34, 28, 26);
fillRect(officeBg, 385, 497, 234, 42, 62, 74, 84);
fillRect(officeBg, 392, 503, 106, 30, 88, 118, 138);
fillRect(officeBg, 506, 503, 106, 30, 88, 118, 138);
fillRect(officeBg, 398, 508, 36, 6, 136, 174, 196);
fillRect(officeBg, 512, 508, 36, 6, 136, 174, 196);

// D) Replace the two small blue "UPH COLLEGE" plaques by the ground floor doors (x: 408..442, y: 618..680 and x: 562..610, y: 618..680) with clean rusticated limestone blocks matching the wall!
for (const [bx, bw] of [
  [406, 38],
  [560, 52],
]) {
  fillRect(officeBg, bx, 616, bw, 68, 218, 194, 164);
  fillRect(officeBg, bx, 636, bw, 4, 178, 154, 126);
  fillRect(officeBg, bx, 658, bw, 4, 178, 154, 126);
  fillRect(officeBg, bx, 680, bw, 4, 178, 154, 126);
}

// 4. Composite Frame A (Neutral Confident Pose) and Frame B (Animated Speaking + Raised Bottle Pose)
function compositeSprite(baseBuf, spriteBuf, offsetX, offsetY, armLiftY, openMouth) {
  const out = new Uint8Array(baseBuf);
  for (let y = 345; y <= 985; y++) {
    for (let x = 220; x <= 530; x++) {
      const sIdx = (y * W + x) * 4;
      if (spriteBuf[sIdx + 3] > 0) {
        // Check if this pixel belongs to Caleb's raised right forearm + green Lira bottle (x >= 425, y <= 635)
        const isBottleArm = x >= 425 && y >= 480 && y <= 635;
        // Or his head & upper torso (y <= 680)
        const dy = isBottleArm ? offsetY + armLiftY : y <= 685 ? offsetY : 0;
        const dx = y <= 685 ? offsetX : 0;
        setPx(
          out,
          x + dx,
          y + dy,
          spriteBuf[sIdx],
          spriteBuf[sIdx + 1],
          spriteBuf[sIdx + 2],
          255
        );
      }
    }
  }
  // If openMouth (Frame B), draw a crisp 16-bit pixel open talking mouth at Caleb's exact mouth coordinates (x: 344..368, y: 496..508)
  if (openMouth) {
    const mx = 346 + offsetX;
    const my = 495 + offsetY;
    fillRect(out, mx - 2, my - 2, 22, 13, 28, 20, 18); // Dark pixel outline
    fillRect(out, mx, my, 18, 3, 245, 242, 235); // Upper teeth row
    fillRect(out, mx, my + 3, 18, 4, 92, 28, 28); // Dark mouth interior
    fillRect(out, mx + 3, my + 7, 12, 3, 208, 96, 92); // Pixel tongue
  }
  return out;
}

const scene3A = compositeSprite(officeBg, calebSprite, 0, 0, 0, false);
const scene3B = compositeSprite(officeBg, calebSprite, 0, -6, -12, true);

writeImagePNG('public/assets/pixel/scene_3_office_a.png', scene3A, W, H);
writeImagePNG('public/assets/pixel/scene_3_office_b.png', scene3B, W, H);
console.log('Generated scene_3_office_a.png and scene_3_office_b.png successfully!');
