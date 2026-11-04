import sharp from 'sharp';
import path from 'path';

const UPLOAD_DIR = '/Users/caleb/.gemini/antigravity/brain/4f9fdd76-e165-46e3-bf28-88d6ecf6d7a0/.user_uploaded';
const OUT_DIR = '/Users/caleb/.gemini/antigravity/scratch/lira-remotion/public/assets';

const BOTTLES = [
  {
    name: 'choco.png',
    input: path.join(UPLOAD_DIR, 'media_1792216892658_bba05684.jpg'),
  },
  {
    name: 'matcha.png',
    input: path.join(UPLOAD_DIR, 'media_1792216892658_d5e0bfa8.jpg'),
  },
  {
    name: 'milktea.png',
    input: path.join(UPLOAD_DIR, 'media_1792216892658_6b9c5612.jpg'),
  },
];

async function processBottle({ name, input }) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  const getPixel = (x, y) => {
    const idx = (y * width + x) * channels;
    return [data[idx], data[idx + 1], data[idx + 2]];
  };

  const rowBg = new Array(height);
  for (let y = 0; y < height; y++) {
    const [r1, g1, b1] = getPixel(20, y);
    const [r2, g2, b2] = getPixel(width - 20, y);
    rowBg[y] = [(r1 + r2) / 2, (g1 + g2) / 2, (b1 + b2) / 2];
  }

  const diffFromBg = (x, y) => {
    const [r, g, b] = getPixel(x, y);
    const [br, bg, bb] = rowBg[y];
    const dr = Math.abs(r - br);
    const dg = Math.abs(g - bg);
    const db = Math.abs(b - bb);
    const maxC = Math.max(r, g, b);
    const minC = Math.min(r, g, b);
    const sat = maxC - minC;
    return Math.max(dr, dg, db) + sat * 0.65;
  };

  let topY = 208;
  for (let y = 180; y < 260; y++) {
    let count = 0;
    for (let x = Math.floor(width * 0.38); x < Math.floor(width * 0.62); x++) {
      if (diffFromBg(x, y) > 22) count++;
    }
    if (count > 30) {
      topY = y;
      break;
    }
  }

  const bottomCenterY = 758;
  const searchMinX = Math.floor(width * 0.32);
  const searchMaxX = Math.floor(width * 0.68);

  const leftSamples = [];
  const rightSamples = [];
  for (let y = 380; y <= 680; y++) {
    for (let x = searchMinX; x <= searchMaxX; x++) {
      if (diffFromBg(x, y) > 18) {
        leftSamples.push(x);
        break;
      }
    }
    for (let x = searchMaxX; x >= searchMinX; x--) {
      if (diffFromBg(x, y) > 18) {
        rightSamples.push(x);
        break;
      }
    }
  }
  leftSamples.sort((a, b) => a - b);
  rightSamples.sort((a, b) => a - b);
  const bodyLeftX = leftSamples[Math.floor(leftSamples.length / 2)];
  const bodyRightX = rightSamples[Math.floor(rightSamples.length / 2)];

  // Store leftEdge and rightEdge per row so we can also bake a paper-cutout border & shadow
  const rowEdges = new Array(height).fill(null);

  for (let y = topY; y <= bottomCenterY; y++) {
    const isNeck = y > topY + 42 && y < topY + 105;
    const threshold = isNeck ? 11.5 : 18.0;

    let leftEdge = width;
    let rightEdge = 0;

    if (y >= 360 && y <= bottomCenterY) {
      leftEdge = bodyLeftX;
      rightEdge = bodyRightX;
      const baseCornerHeight = 24;
      if (y > bottomCenterY - baseCornerHeight) {
        const dy = (y - (bottomCenterY - baseCornerHeight)) / baseCornerHeight;
        const inset = Math.round(Math.pow(dy, 2.2) * 20);
        leftEdge = bodyLeftX + inset;
        rightEdge = bodyRightX - inset;
      }
    } else {
      for (let x = searchMinX; x <= searchMaxX; x++) {
        if (diffFromBg(x, y) > threshold) {
          leftEdge = x;
          break;
        }
      }
      for (let x = searchMaxX; x >= searchMinX; x--) {
        if (diffFromBg(x, y) > threshold) {
          rightEdge = x;
          break;
        }
      }
      leftEdge = Math.max(leftEdge, bodyLeftX);
      rightEdge = Math.min(rightEdge, bodyRightX);
    }

    if (leftEdge < rightEdge) {
      rowEdges[y] = [leftEdge, rightEdge];
    }
  }

  // Build bottle mask, white paper sticker border (7px), and soft drop shadow
  const out = Buffer.alloc(width * height * 4, 0);
  const BORDER = 7;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // 1. Check if inside bottle
      const edges = rowEdges[y];
      if (edges && x >= edges[0] && x <= edges[1]) {
        out[idx] = data[idx];
        out[idx + 1] = data[idx + 1];
        out[idx + 2] = data[idx + 2];
        out[idx + 3] = 255;
        continue;
      }

      // 2. Check minimum distance to bottle for paper-cutout border (#f7f2e7)
      let minDistSq = 9999;
      const yMin = Math.max(topY, y - BORDER - 2);
      const yMax = Math.min(bottomCenterY, y + BORDER + 2);
      for (let ny = yMin; ny <= yMax; ny++) {
        const ne = rowEdges[ny];
        if (!ne) continue;
        const dy = y - ny;
        let dx = 0;
        if (x < ne[0]) dx = ne[0] - x;
        else if (x > ne[1]) dx = x - ne[1];
        const dSq = dx * dx + dy * dy;
        if (dSq < minDistSq) minDistSq = dSq;
      }

      const dist = Math.sqrt(minDistSq);
      if (dist <= BORDER + 1.2) {
        const alpha = dist <= BORDER - 0.5 ? 1 : Math.max(0, (BORDER + 1.2 - dist) / 1.7);
        out[idx] = 247;     // #f7
        out[idx + 1] = 242; // #f2
        out[idx + 2] = 231; // #e7
        out[idx + 3] = Math.round(alpha * 255);
      }
    }
  }

  const cropWidth = 340;
  const cropHeight = 620;
  const cropLeft = Math.round((bodyLeftX + bodyRightX) / 2 - cropWidth / 2);
  const cropTop = 180;

  const outPath = path.join(OUT_DIR, name);
  await sharp(out, { raw: { width, height, channels: 4 } })
    .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
    .png()
    .toFile(outPath);

  console.log(`Saved ${outPath} with baked paper-cutout border`);
}

for (const b of BOTTLES) {
  await processBottle(b);
}
