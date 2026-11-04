const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const REMOTION_BIN = path.join(__dirname, '../node_modules/.bin/remotion');
const OUTPUT_DIR = '/Users/caleb/Desktop/lira reels';

const REELS_TO_RENDER = [
  { id: 'Reel1-BlenderEfficiency', file: 'reel_new_01_blender_efficiency.mp4' },
  { id: 'Reel2-BlindTasteTest', file: 'reel_new_02_blind_taste_test.mp4' },
  { id: 'Reel3-WorkplaceEnergy', file: 'reel_new_03_workplace_energy.mp4' },
  { id: 'Reel4-PriceGuess', file: 'reel_new_04_price_guess.mp4' },
  { id: 'Reel5-FounderAntiFactory', file: 'reel_new_05_founder_anti_factory.mp4' },
];

console.log('========================================================');
console.log('🎬 RENDERING 5 BRAND NEW REELS TO DESKTOP/LIRA REELS');
console.log('========================================================');

const results = [];

for (let i = 0; i < REELS_TO_RENDER.length; i++) {
  const r = REELS_TO_RENDER[i];
  const outPath = path.join(OUTPUT_DIR, r.file);
  console.log(`\n[${i + 1}/${REELS_TO_RENDER.length}] Rendering ${r.id} -> ${r.file}...`);
  const startTime = Date.now();

  try {
    const cmd = `export PATH="/Users/caleb/.gemini/antigravity/scratch/.node/bin:/Users/caleb/.local/bin:$PATH" && "${REMOTION_BIN}" render src/index.ts "${r.id}" "${outPath}" --concurrency=4 --gl=angle`;
    execSync(cmd, { cwd: path.join(__dirname, '..'), stdio: 'inherit' });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const stat = fs.statSync(outPath);
    console.log(`✓ Render complete: ${r.file} (${(stat.size / 1024 / 1024).toFixed(2)} MB in ${elapsed}s)`);
    results.push({ reel: r.id, file: r.file, sizeMB: (stat.size / 1024 / 1024).toFixed(2), elapsedSec: elapsed, status: 'SUCCESS' });
  } catch (err) {
    console.error(`❌ Render failed for ${r.id}:`, err.message);
    results.push({ reel: r.id, file: r.file, status: `FAILED: ${err.message}` });
  }
}

console.log('\n========================================================');
console.log('🎉 ALL RENDERS FINISHED:');
console.log('========================================================');
console.table(results);
