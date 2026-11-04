const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const carousels = [
  {
    name: 'SatDrop',
    folder: '/Users/caleb/Desktop/lira reels/carousel_sat_drop',
    prefix: 'Carousel-SatDrop',
  },
  {
    name: 'SunReset',
    folder: '/Users/caleb/Desktop/lira reels/carousel_sun_reset',
    prefix: 'Carousel-SunReset',
  },
  {
    name: 'DeepWork',
    folder: '/Users/caleb/Desktop/lira reels/carousel_deep_work',
    prefix: 'Carousel-DeepWork',
  },
  {
    name: 'Finance',
    folder: '/Users/caleb/Desktop/lira reels/carousel_finance',
    prefix: 'Carousel-Finance',
  },
  {
    name: 'Scarcity',
    folder: '/Users/caleb/Desktop/lira reels/carousel_scarcity',
    prefix: 'Carousel-Scarcity',
  },
];

const remotionBin = path.resolve(__dirname, '../node_modules/.bin/remotion');
const ffmpegBin = '/Users/caleb/.local/bin/ffmpeg';

console.log('🚀 Starting batch render for 5 scheduled carousels (20 slides)...');

for (const c of carousels) {
  console.log(`\n========================================`);
  console.log(`Rendering Carousel: ${c.name} (${c.folder})`);
  console.log(`========================================`);
  fs.mkdirSync(c.folder, { recursive: true });

  for (let i = 1; i <= 4; i++) {
    const compId = `${c.prefix}-${i}`;
    const pngPath = path.join(c.folder, `slide${i}.png`);
    const jpgPath = path.join(c.folder, `slide${i}.jpg`);

    if (fs.existsSync(jpgPath) && fs.statSync(jpgPath).size > 10000) {
      console.log(`✓ Slide already exists: ${jpgPath} (skipping)`);
      continue;
    }

    console.log(`[Remotion] Rendering ${compId} -> slide${i}.png...`);
    execSync(`"${remotionBin}" still src/index.ts "${compId}" "${pngPath}" --overwrite --timeout=60000`, {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'inherit',
      env: {
        ...process.env,
        PATH: `/Users/caleb/.gemini/antigravity/scratch/.node/bin:/Users/caleb/.local/bin:${process.env.PATH}`,
      },
    });

    console.log(`[FFmpeg] Converting slide${i}.png -> slide${i}.jpg...`);
    execSync(`"${ffmpegBin}" -y -i "${pngPath}" -q:v 2 "${jpgPath}"`, {
      stdio: 'ignore',
    });
    console.log(`✓ Generated ${jpgPath} (${fs.statSync(jpgPath).size} bytes)`);
  }
}

console.log('\n🎉 ALL 20 SLIDES SUCCESSFULLY RENDERED & CONVERTED TO JPEG!');
