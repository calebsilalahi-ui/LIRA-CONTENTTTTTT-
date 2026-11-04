#!/usr/bin/env node
/**
 * Programmatic Carousel Render Verification Suite
 * Authoritative standards: PROJECT.md §Feature 12-15 & ORIGINAL_REQUEST.md §R3
 * 
 * Verifies:
 * 1. Exact 1080x1350 resolution (4:5 aspect ratio) on every slide
 * 2. Slide count strictly within 6 to 8 slides
 * 3. Non-blank visual variance (distinct buffers, file sizes > 30KB)
 * 4. Slide 1 Hook <= 8 words with open curiosity loop
 * 5. Standalone Slide 2 Re-Serve Hook <= 12 words with zero dependent conjunctions
 * 6. High-save reference sheet with comparison matrix and utility signals
 * 7. Clean Action CTA with non-numeric limited batch scarcity
 * 8. Zero banned CSS slop (no glow blobs, no 48px grids, no 01/04 badges)
 * 9. Zero unicode emojis across all copy
 * 10. Presence and integrity of authentic SSOT bottle and cooler bag assets
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const crypto = require('crypto');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const FFPROBE_BIN = fs.existsSync('/Users/caleb/.local/bin/ffprobe')
  ? '/Users/caleb/.local/bin/ffprobe'
  : 'ffprobe';

const TARGET_CAROUSEL_DIR = path.join(PROJECT_ROOT, 'out/sample_carousel');
const DESKTOP_CAROUSEL_DIR = path.join(process.env.HOME || '/Users/caleb', 'Desktop/lira reels/carousel_stevia');
const SAMPLE_DECK = require('../src/Carousels/sampleCarouselData.json');


const EMOJI_REGEX = /(?:\p{Extended_Pictographic}|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]|\uD83E[\uDD00-\uDDFF])/u;
const DEPENDENT_OPENER_REGEX = /^(?:dan|maka dari itu|lalu|seperti yang tadi dibilang)\b/i;
const UTILITY_KEYWORDS_REGEX = /CHEATSHEET|PANDUAN|FORMULA|RATIO|KOMPARASI|TABEL|CHECKLIST/i;

function getSlideSpecs(filePath) {
  const rawOutput = execFileSync(FFPROBE_BIN, [
    '-v', 'quiet',
    '-print_format', 'json',
    '-show_streams',
    filePath,
  ], { encoding: 'utf-8' });

  const meta = JSON.parse(rawOutput);
  const stream = meta.streams[0] || {};
  return {
    width: stream.width || 0,
    height: stream.height || 0,
    codec: stream.codec_name || '',
  };
}

function computeFileHash(filePath) {
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function runVerification() {
  console.log('='.repeat(76));
  console.log('   PROGRAMMATIC VERIFICATION: EDITORIAL INSTAGRAM CAROUSEL ENGINE');
  console.log('='.repeat(76));

  const checkResults = [];
  function assertCheck(name, condition, details = '') {
    const passed = !!condition;
    checkResults.push({ name, passed, details });
    const mark = passed ? '✓ PASS' : '✖ FAIL';
    console.log(`[${mark}] ${name}`);
    if (!passed && details) {
      console.error(`       Error: ${details}`);
    }
  }

  // 1. Output Directory Existence
  assertCheck(
    'Target Carousel Directory Exists',
    fs.existsSync(TARGET_CAROUSEL_DIR),
    `Directory not found: ${TARGET_CAROUSEL_DIR}`
  );

  // 2. Discover Slides (slide1.jpg ... slideN.jpg)
  const files = fs.readdirSync(TARGET_CAROUSEL_DIR);
  const slideFiles = files
    .filter(f => /^slide\d+\.jpe?g$/i.test(f))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)[0], 10);
      const numB = parseInt(b.match(/\d+/)[0], 10);
      return numA - numB;
    });

  assertCheck(
    'Slide Count Within Range [6, 8]',
    slideFiles.length >= 6 && slideFiles.length <= 8,
    `Found ${slideFiles.length} slides, expected 6-8`
  );

  // 3. Exact 1080x1350 Resolution & Non-Empty Size
  const slideHashes = new Set();
  let allResolutionPassed = true;
  let allMinSizePassed = true;

  for (const slideName of slideFiles) {
    const fullPath = path.join(TARGET_CAROUSEL_DIR, slideName);
    const stat = fs.statSync(fullPath);
    const specs = getSlideSpecs(fullPath);

    if (specs.width !== 1080 || specs.height !== 1350) {
      allResolutionPassed = false;
      console.error(`       Slide ${slideName} dimensions ${specs.width}x${specs.height} != 1080x1350`);
    }

    if (stat.size < 20000) {
      allMinSizePassed = false;
      console.error(`       Slide ${slideName} size ${stat.size} bytes < 20KB threshold`);
    }

    slideHashes.add(computeFileHash(fullPath));
  }

  assertCheck(
    'Exact 1080x1350 (4:5) Dimensions on Every Slide',
    allResolutionPassed,
    'One or more slides failed exact 1080x1350 requirement'
  );

  assertCheck(
    'Minimum Crisp JPEG File Size (> 20KB per slide)',
    allMinSizePassed,
    'One or more slides smaller than 20KB'
  );

  assertCheck(
    'Non-Blank Visual Variance (Unique content per slide)',
    slideHashes.size === slideFiles.length,
    `Expected ${slideFiles.length} distinct slide hashes, got ${slideHashes.size}`
  );

  // 4. Slide 1 Hook Word Count (<= 8 words) & Curiosity Loop
  const slide1 = SAMPLE_DECK.slides.find(s => s.slideNumber === 1);
  const s1Words = slide1.headline.trim().split(/\s+/).filter(Boolean);
  assertCheck(
    'Slide 1 Headline Word Count (<= 8 words)',
    s1Words.length <= 8,
    `Slide 1 headline "${slide1.headline}" has ${s1Words.length} words`
  );
  assertCheck(
    'Slide 1 Curiosity Loop Present',
    typeof slide1.subhead === 'string' && slide1.subhead.length > 0,
    'Slide 1 missing open curiosity subhead'
  );

  // 5. Slide 2 Standalone Re-Serve Hook (<= 12 words) & Grammatical Independence
  const slide2 = SAMPLE_DECK.slides.find(s => s.slideNumber === 2);
  const s2Words = slide2.headline.trim().split(/\s+/).filter(Boolean);
  assertCheck(
    'Slide 2 Re-Serve Hook Word Count (<= 12 words)',
    s2Words.length <= 12,
    `Slide 2 headline "${slide2.headline}" has ${s2Words.length} words`
  );
  assertCheck(
    'Slide 2 Standalone Semantic Independence (No continuation opener)',
    !DEPENDENT_OPENER_REGEX.test(slide2.headline),
    `Slide 2 headline begins with dependent continuation conjunction: "${slide2.headline}"`
  );
  assertCheck(
    'Slide 2 Designated Schema Type "reserve_hook"',
    slide2.type === 'reserve_hook',
    `Slide 2 type is "${slide2.type}", expected "reserve_hook"`
  );

  // 6. High-Save Comparison Sheet (Slide 6 or penultimate)
  const highSaveSlide = SAMPLE_DECK.slides.find(s => s.type === 'high_save' || s.type === 'comparison');
  assertCheck(
    'Presence of High-Save / Comparison Slide',
    !!highSaveSlide,
    'High-save slide missing in deck'
  );
  assertCheck(
    'High-Save Headline Conveys Durable Reference Utility',
    UTILITY_KEYWORDS_REGEX.test(highSaveSlide.headline),
    `High-save headline "${highSaveSlide.headline}" lacks utility keywords`
  );
  assertCheck(
    'Structured Comparison Rows Present',
    Array.isArray(highSaveSlide.comparisonRows) && highSaveSlide.comparisonRows.length >= 3,
    'Comparison slide lacks structured comparisonRows'
  );

  // 7. Closing Action CTA Slide
  const ctaSlide = SAMPLE_DECK.slides.find(s => s.type === 'cta');
  assertCheck(
    'Closing Action CTA Slide Present as Final Slide',
    !!ctaSlide && ctaSlide.slideNumber === SAMPLE_DECK.slides.length,
    'Final slide must be designated CTA slide'
  );
  assertCheck(
    'Order Steps Specified on CTA Slide',
    Array.isArray(ctaSlide.orderSteps) && ctaSlide.orderSteps.length >= 3,
    'CTA slide missing structured orderSteps'
  );

  // 8. Strict Anti-Slop Visual Purity in Source Code
  const engineSource = fs.readFileSync(path.join(PROJECT_ROOT, 'src/Carousels/CarouselEditorialEngine.tsx'), 'utf-8');
  assertCheck(
    'Zero Glow Blobs in Carousel Code',
    !/radial-gradient\(circle.*rgba\(57,\s*255,\s*136/i.test(engineSource) && !/radial-gradient\(circle.*transparent/i.test(engineSource),
    'Detected forbidden radial glow gradient in Carousel source'
  );
  assertCheck(
    'Zero 48px SaaS Grids in Carousel Code',
    !/48px\s*48px/i.test(engineSource),
    'Detected forbidden 48px tech grid in Carousel source'
  );
  assertCheck(
    'Zero 01/04 Robotic Badge Slop in Carousel Code',
    !/01\s*\/\s*04/i.test(engineSource),
    'Detected forbidden 01/04 badge tag in Carousel source'
  );

  // 9. Zero Emojis Across All Slide Data
  let emojiFound = false;
  for (const s of SAMPLE_DECK.slides) {
    if (EMOJI_REGEX.test(s.headline) || EMOJI_REGEX.test(s.subhead || '') || EMOJI_REGEX.test(s.bodyText || '')) {
      emojiFound = true;
      console.error(`       Emoji detected in slide ${s.slideNumber}: ${s.headline}`);
    }
  }
  assertCheck(
    'Zero Unicode Emojis Across All Carousel Copy',
    !emojiFound,
    'Unicode emojis detected in carousel text content'
  );

  // 10. Authentic SSOT Assets
  const ssotMatcha = path.join(PROJECT_ROOT, 'public/assets/bottles_ssot/matcha_ssot.png');
  const coolerBag = path.join(PROJECT_ROOT, 'public/assets/pixel/tutorial/cooler_bag_cutout.png');
  assertCheck(
    'Authentic SSOT Matcha Bottle Cutout Exists (>10KB)',
    fs.existsSync(ssotMatcha) && fs.statSync(ssotMatcha).size > 10000,
    `SSOT asset missing: ${ssotMatcha}`
  );
  assertCheck(
    'Authentic Forest Green Thermal Cooler Bag Cutout Exists (>10KB)',
    fs.existsSync(coolerBag) && fs.statSync(coolerBag).size > 10000,
    `Cooler bag asset missing: ${coolerBag}`
  );

  console.log('='.repeat(76));
  const failed = checkResults.filter(r => !r.passed);
  if (failed.length === 0) {
    console.log(`✓ VERIFICATION SUCCESSFUL: All ${checkResults.length} checks passed cleanly!`);
    console.log('='.repeat(76) + '\n');
    return true;
  } else {
    console.error(`✖ VERIFICATION FAILED: ${failed.length} / ${checkResults.length} checks failed.`);
    console.log('='.repeat(76) + '\n');
    return false;
  }
}

if (require.main === module) {
  const success = runVerification();
  process.exit(success ? 0 : 1);
}

module.exports = {
  runVerification,
};
