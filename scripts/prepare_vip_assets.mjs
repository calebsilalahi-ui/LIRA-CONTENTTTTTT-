import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/caleb/.gemini/antigravity/brain/3595f506-09b5-4ee0-8e1b-94092977b48d';
const SCRATCH_DIR = '/Users/caleb/.gemini/antigravity/scratch/lira-remotion';

async function main() {
  console.log('--- 1. Processing Backgrounds to 1080x1440 ---');
  const entranceIn = path.join(SCRATCH_DIR, 'public/assets/pixel/vip_club_entrance.jpg');
  const entranceOut = path.join(SCRATCH_DIR, 'public/assets/pixel/vip_club_entrance.png');
  await sharp(entranceIn)
    .resize(1080, 1440, { fit: 'cover' })
    .png({ quality: 100 })
    .toFile(entranceOut);
  console.log('Saved vip_club_entrance.png');

  const loungeIn = path.join(SCRATCH_DIR, 'public/assets/pixel/vip_lounge_interior.jpg');
  const loungeOut = path.join(SCRATCH_DIR, 'public/assets/pixel/vip_lounge_interior.png');
  await sharp(loungeIn)
    .resize(1080, 1440, { fit: 'cover' })
    .png({ quality: 100 })
    .toFile(loungeOut);
  console.log('Saved vip_lounge_interior.png');

  console.log('--- 2. Processing Golden Key to Transparent PNG ---');
  const keyIn = path.join(ARTIFACT_DIR, 'pixel_golden_key_1792418338852.jpg');
  const keyOut = path.join(SCRATCH_DIR, 'public/assets/pixel/pixel_golden_key_clean.png');

  // Load raw image buffer
  const { data: keyData, info: keyInfo } = await sharp(keyIn)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const kw = keyInfo.width;
  const kh = keyInfo.height;

  // Key is on pure black background. Pixels with R < 18, G < 18, B < 18 become transparent.
  // Also crop tight around the key bounding box.
  let minX = kw, maxX = 0, minY = kh, maxY = 0;
  for (let y = 0; y < kh; y++) {
    for (let x = 0; x < kw; x++) {
      const idx = (y * kw + x) * 4;
      const r = keyData[idx];
      const g = keyData[idx + 1];
      const b = keyData[idx + 2];
      const maxVal = Math.max(r, g, b);
      if (maxVal < 24) {
        keyData[idx + 3] = 0; // transparent
      } else {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;

  await sharp(keyData, { raw: { width: kw, height: kh, channels: 4 } })
    .extract({ left: minX, top: minY, width: cropW, height: cropH })
    .png()
    .toFile(keyOut);
  console.log(`Saved pixel_golden_key_clean.png (${cropW}x${cropH})`);

  console.log('--- 3. Processing Caleb Front to Transparent PNG ---');
  const calebIn = path.join(SCRATCH_DIR, 'public/assets/pixel/character/caleb_front.png');
  const calebOut = path.join(SCRATCH_DIR, 'public/assets/pixel/character/caleb_front_clean.png');

  const { data: cData, info: cInfo } = await sharp(calebIn)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const cw = cInfo.width;
  const ch = cInfo.height;

  // Caleb is surrounded by background gray RGB(211, 216, 220)
  // Let's do BFS from borders
  const visited = new Uint8Array(cw * ch);
  const queue = [];
  for (let x = 0; x < cw; x++) {
    queue.push([x, 0]);
    queue.push([x, ch - 1]);
    visited[0 * cw + x] = 1;
    visited[(ch - 1) * cw + x] = 1;
  }
  for (let y = 0; y < ch; y++) {
    queue.push([0, y]);
    queue.push([cw - 1, y]);
    visited[y * cw + 0] = 1;
    visited[y * cw + (cw - 1)] = 1;
  }

  while (queue.length > 0) {
    const [x, y] = queue.pop();
    const idx = (y * cw + x) * 4;
    cData[idx + 3] = 0; // Transparent

    const neighbors = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < cw && ny >= 0 && ny < ch) {
        const nPos = ny * cw + nx;
        if (!visited[nPos]) {
          const nr = cData[nPos * 4];
          const ng = cData[nPos * 4 + 1];
          const nb = cData[nPos * 4 + 2];
          // Check color difference from initial light gray background
          const diff = Math.abs(nr - 211) + Math.abs(ng - 216) + Math.abs(nb - 220);
          // Dark outline of character has high difference
          if (diff < 42) {
            visited[nPos] = 1;
            queue.push([nx, ny]);
          }
        }
      }
    }
  }

  await sharp(cData, { raw: { width: cw, height: ch, channels: 4 } })
    .png()
    .toFile(calebOut);
  console.log(`Saved caleb_front_clean.png (${cw}x${ch})`);

  console.log('All VIP assets processed successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
