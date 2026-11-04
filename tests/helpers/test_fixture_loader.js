/**
 * Test Fixture Loader & Environment Helper
 * Safely loads environment variables, mock payloads, and manages isolated test sandboxes.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { PATHS } = require('./test_constants');

/**
 * Safely parse .env file without mutating process.env permanently unless requested
 */
function readEnvFile() {
  const envPath = path.join(PATHS.PROJECT_ROOT, '.env');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf-8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [k, ...v] = trimmed.split('=');
      env[k.trim()] = v.join('=').trim();
    }
  }
  return env;
}

/**
 * Creates an isolated temp directory for test execution (e.g. ledger testing)
 */
function createTempSandbox(prefix = 'lira-test-') {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  return {
    dir,
    cleanup: () => {
      try {
        fs.rmSync(dir, { recursive: true, force: true });
      } catch (e) {}
    },
  };
}

/**
 * Valid sample content payload that passes all guardrails
 */
function getValidSampleReelPayload() {
  return {
    format: 'reel',
    pillar: 'Craftsmanship & Student Lifestyle',
    hook_category: 'Comparison',
    topic: 'Kenapa Lira nolak pakai cup plastik kafe biasa',
    verbal_hook: 'Pernah gak lo beli matcha lima puluh ribu di kafe, tapi dua jam kemudian kepala lo malah lemes dan ngantuk parah?',
    written_hook: 'KENAPA MATCHA 50K BIKIN CRASH',
    caption: 'Di Lira, kita tolak resep murahan: pure Japanese premium matcha diemulsi bareng barista oat milk dan pemanis alami stevia, nol gula pasir. Limited batch available untuk Sabtu ini lewat link di bio.\n\nCrafted solo by @caleb766h1\n\n#drinklira #matchalatte #indiegame',
    overlays: [
      { text: 'KENAPA MATCHA 50K BIKIN LEMES & CRASH', x: 120, y: 350 },
      { text: '180 DERAJAT ANTI BOCOR', x: 120, y: 450 },
    ],
  };
}

/**
 * Valid sample carousel payload that passes all guardrails
 */
function getValidSampleCarouselPayload() {
  return {
    format: 'carousel',
    pillar: 'Sugar Crash & Stevia Science',
    hook_category: 'Educational',
    topic: 'Anatomi Sugar Crash vs Clean Energy',
    verbal_hook: '',
    written_hook: 'ANATOMI SUGAR CRASH VS CLEAN FOCUS',
    caption: 'Kenapa matcha kafe biasa bikin lemes di jam 2 siang? Simak breakdown sainsnya. Limited batch ready untuk weekend ini via link di bio.\n\nCrafted solo by @caleb766h1',
    slides: [
      { slideNumber: 1, headline: 'ANATOMI SUGAR CRASH VS CLEAN FOCUS', type: 'hook' },
      { slideNumber: 2, headline: 'DUA JAM SETELAH MINUM GULA CAIR DARAH LO DROP', type: 'reserve_hook' },
      { slideNumber: 3, headline: 'KOMPARASI: CAFE CUP VS LIRA BOTTLE', type: 'body' },
      { slideNumber: 4, headline: 'L-THEANINE & CAFFEINE RATIO FORMULA', type: 'body' },
      { slideNumber: 5, headline: 'CHEATSHEET: PANDUAN FOCUS 6 JAM TANPA CRASH', type: 'high_save' },
      { slideNumber: 6, headline: 'LIMITED BATCH SABTU: CARA AMANKAN BOTTLE LO', type: 'cta' },
    ],
  };
}

module.exports = {
  readEnvFile,
  createTempSandbox,
  getValidSampleReelPayload,
  getValidSampleCarouselPayload,
};
