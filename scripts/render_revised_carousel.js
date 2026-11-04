#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { bundle } = require('@remotion/bundler');
const { renderStill, selectComposition } = require('@remotion/renderer');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const OUT_DIR = process.env.LIRA_CAROUSEL_DIR || (
  fs.existsSync('/Users/caleb/Desktop/lira reels')
    ? '/Users/caleb/Desktop/lira reels/carousel_revised_light_studio'
    : path.join(PROJECT_ROOT, 'public/carousel_revised_light_studio')
);

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  console.log('Bundling Remotion code from src/index.ts...');
  const bundleLocation = await bundle({
    entryPoint: path.join(PROJECT_ROOT, 'src/index.ts'),
  });

  const slideIndices = [1, 2, 3, 4, 5, 6, 7, 8];
  for (const idx of slideIndices) {
    const compId = `Carousel-RevisedLight-${idx}`;
    console.log(`Rendering ${compId}...`);
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: compId,
    });
    if (!composition) {
      console.error(`Composition ${compId} not found!`);
      continue;
    }
    const outputPath = path.join(OUT_DIR, `slide_${idx}.jpg`);
    await renderStill({
      composition,
      serveUrl: bundleLocation,
      output: outputPath,
      imageFormat: 'jpeg',
      jpegQuality: 95,
    });
    console.log(`Saved: ${outputPath}`);
  }
  console.log('All slides rendered successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
