const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const remotionBin = path.resolve(__dirname, '../node_modules/.bin/remotion');
const ffmpegBin = '/Users/caleb/.local/bin/ffmpeg';
const baseOutDir = '/Users/caleb/Desktop/lira reels';

const env = {
  ...process.env,
  PATH: `/Users/caleb/.gemini/antigravity/scratch/.node/bin:/Users/caleb/.local/bin:${process.env.PATH}`,
};

const carousels = [
  {
    name: 'Anatomi',
    folder: path.join(baseOutDir, 'carousel_anatomi'),
    prefix: 'Carousel-Anatomi',
  },
  {
    name: 'GuideMenu',
    folder: path.join(baseOutDir, 'carousel_guidemenu'),
    prefix: 'Carousel-GuideMenu',
  },
  {
    name: 'Rutinitas',
    folder: path.join(baseOutDir, 'carousel_rutinitas'),
    prefix: 'Carousel-Rutinitas',
  },
  {
    name: 'BotolVsCup',
    folder: path.join(baseOutDir, 'carousel_botolvscup'),
    prefix: 'Carousel-BotolVsCup',
  },
  {
    name: 'PreorderChecklist',
    folder: path.join(baseOutDir, 'carousel_preorderchecklist'),
    prefix: 'Carousel-PreorderChecklist',
  },
];

const reels = [
  {
    id: 'Reel6-LaptopSpill',
    file: 'reel_new_06_laptop_spill.mp4',
  },
  {
    id: 'Reel7-MythNoSugar',
    file: 'reel_new_07_myth_no_sugar.mp4',
  },
  {
    id: 'Reel8-PureJapaneseMatcha',
    file: 'reel_new_08_pure_japanese_matcha.mp4',
  },
  {
    id: 'Reel9-OatsideFormula',
    file: 'reel_new_09_oatside_formula.mp4',
  },
  {
    id: 'Reel10-FridayNightBrewing',
    file: 'reel_new_10_friday_night_brewing.mp4',
  },
];

console.log('========================================================');
console.log('🚀 RENDERING 5 NEW CAROUSELS (20 SLIDES)');
console.log('========================================================');

for (const c of carousels) {
  fs.mkdirSync(c.folder, { recursive: true });
  for (let i = 1; i <= 4; i++) {
    const compId = `${c.prefix}-${i}`;
    const pngPath = path.join(c.folder, `slide${i}.png`);
    const jpgPath = path.join(c.folder, `slide${i}.jpg`);

    // If slide exists and is valid, skip unless preorderchecklist slide 3
    if (fs.existsSync(jpgPath) && fs.statSync(jpgPath).size > 20000 && !jpgPath.includes('preorderchecklist/slide3')) {
      console.log(`✓ Slide already exists: ${jpgPath} (skipping)`);
      continue;
    }

    console.log(`[Remotion] Still ${compId} -> slide${i}.png...`);
    execSync(`"${remotionBin}" still src/index.ts "${compId}" "${pngPath}" --overwrite --timeout=60000`, {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'inherit',
      env,
    });

    console.log(`[FFmpeg] Converting slide${i}.png -> slide${i}.jpg...`);
    execSync(`"${ffmpegBin}" -y -i "${pngPath}" -q:v 2 "${jpgPath}"`, {
      stdio: 'ignore',
      env,
    });
    console.log(`✓ Generated ${jpgPath} (${fs.statSync(jpgPath).size} bytes)`);
  }
}

console.log('\n========================================================');
console.log('🚀 RENDERING 5 NEW REELS (VIDEOS)');
console.log('========================================================');

for (const r of reels) {
  const outPath = path.join(baseOutDir, r.file);
  console.log(`\n[Remotion Render] ${r.id} -> ${r.file}...`);
  execSync(`"${remotionBin}" render src/index.ts "${r.id}" "${outPath}" --overwrite --concurrency=4`, {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'inherit',
    env,
  });
  console.log(`✓ Rendered ${outPath} (${fs.statSync(outPath).size} bytes)`);
}

console.log('\n🎉 ALL 10 NEW CONTENT PIECES SUCCESSFULLY RENDERED!');
