#!/usr/bin/env node
/**
 * Lira Editorial Instagram Carousel Renderer
 * Authoritative standards: PROJECT.md §Feature 12-15 & ORIGINAL_REQUEST.md §R3
 * 
 * Renders a complete 8-slide (or 6-slide) editorial carousel deck to crisp 1080x1350 JPEG images.
 * Output target: out/sample_carousel/slide1.jpg ... slide8.jpg
 */

const fs = require('fs');
const path = require('path');
const { bundle } = require('@remotion/bundler');
const { renderStill, selectComposition } = require('@remotion/renderer');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const DEFAULT_OUT_DIR = path.join(PROJECT_ROOT, 'out/sample_carousel');
const DESKTOP_CAROUSEL_DIR = path.join(process.env.HOME || '/Users/caleb', 'Desktop/lira reels/carousel_stevia');

function parseArgs(args) {
  const options = {
    outDir: DEFAULT_OUT_DIR,
    desktopSync: true,
    slideCount: 8,
    force: false,
    quality: 95,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--out' || arg === '-o') {
      options.outDir = path.resolve(args[++i]);
    } else if (arg.startsWith('--out=')) {
      options.outDir = path.resolve(arg.split('=')[1]);
    } else if (arg === '--slides' || arg === '-s') {
      options.slideCount = parseInt(args[++i], 10);
    } else if (arg === '--no-desktop') {
      options.desktopSync = false;
    } else if (arg === '--force' || arg === '-f') {
      options.force = true;
    }
  }

  return options;
}

async function renderCarousel(options) {
  console.log('='.repeat(72));
  console.log('       LIRA EDITORIAL INSTAGRAM CAROUSEL RENDER ENGINE (4:5)');
  console.log('='.repeat(72));
  console.log(`• Output directory: ${options.outDir}`);
  console.log(`• Slide count:      ${options.slideCount} slides (1080 x 1350 px)`);
  console.log(`• JPEG quality:     ${options.quality}%`);
  console.log(`• Desktop sync:     ${options.desktopSync ? 'Enabled' : 'Disabled'}`);
  console.log('='.repeat(72));

  fs.mkdirSync(options.outDir, { recursive: true });
  if (options.desktopSync) {
    fs.mkdirSync(DESKTOP_CAROUSEL_DIR, { recursive: true });
  }

  const startTime = Date.now();

  console.log('\n[1/3] Bundling Remotion compositions from src/index.ts...');
  const entryPoint = path.join(PROJECT_ROOT, 'src/index.ts');
  const bundleLocation = await bundle({
    entryPoint,
    onProgress: (progress) => {
      if (progress % 25 === 0 || progress === 100) {
        process.stdout.write(`  Bundling progress: ${progress}%\r`);
      }
    },
  });
  console.log(`\n✓ Remotion bundle ready in ${((Date.now() - startTime) / 1000).toFixed(2)}s`);

  console.log(`\n[2/3] Rendering ${options.slideCount} slides to JPEG (1080x1350)...`);
  const renderedSlides = [];

  for (let i = 1; i <= options.slideCount; i++) {
    const compId = `Carousel-Editorial-${i}`;
    const slideStart = Date.now();
    const outputFileName = `slide${i}.jpg`;
    const outputPath = path.join(options.outDir, outputFileName);
    const aliasPath = path.join(options.outDir, `slide_${i}.jpg`);

    process.stdout.write(`• Rendering Slide ${i}/${options.slideCount} (${compId})... `);

    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: compId,
    });

    if (!composition) {
      throw new Error(`Composition ${compId} not found in bundle! Check src/Root.tsx.`);
    }

    await renderStill({
      composition,
      serveUrl: bundleLocation,
      output: outputPath,
      imageFormat: 'jpeg',
      jpegQuality: options.quality,
    });

    // Copy to alias name slide_N.jpg for convenience
    fs.copyFileSync(outputPath, aliasPath);

    // Sync to Desktop directory if enabled
    if (options.desktopSync) {
      fs.copyFileSync(outputPath, path.join(DESKTOP_CAROUSEL_DIR, outputFileName));
      fs.copyFileSync(outputPath, path.join(DESKTOP_CAROUSEL_DIR, `slide_${i}.jpg`));
    }

    const stat = fs.statSync(outputPath);
    const durationMs = Date.now() - slideStart;

    console.log(`✓ DONE (${(stat.size / 1024).toFixed(1)} KB, ${durationMs}ms)`);

    renderedSlides.push({
      slideNumber: i,
      compId,
      filename: outputFileName,
      path: outputPath,
      sizeBytes: stat.size,
      width: composition.width,
      height: composition.height,
      durationMs,
    });
  }

  const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('\n[3/3] Render Summary:');
  console.log('-'.repeat(72));
  console.log(
    'Slide #'.padEnd(10) +
    'File'.padEnd(16) +
    'Dimensions'.padEnd(16) +
    'Size'.padEnd(14) +
    'Render Time'
  );
  console.log('-'.repeat(72));

  for (const s of renderedSlides) {
    console.log(
      `Slide ${s.slideNumber}`.padEnd(10) +
      s.filename.padEnd(16) +
      `${s.width}x${s.height}`.padEnd(16) +
      `${(s.sizeBytes / 1024).toFixed(1)} KB`.padEnd(14) +
      `${s.durationMs}ms`
    );
  }
  console.log('-'.repeat(72));
  console.log(`✓ All ${options.slideCount} slides rendered successfully in ${totalDuration}s`);
  console.log(`✓ Location: ${options.outDir}`);
  if (options.desktopSync) {
    console.log(`✓ Synced to: ${DESKTOP_CAROUSEL_DIR}`);
  }
  console.log('='.repeat(72) + '\n');

  return renderedSlides;
}

if (require.main === module) {
  const options = parseArgs(process.argv.slice(2));
  renderCarousel(options)
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('\n✖ Render Error:', err.message);
      if (err.stack) console.error(err.stack);
      process.exit(1);
    });
}

module.exports = {
  renderCarousel,
};
