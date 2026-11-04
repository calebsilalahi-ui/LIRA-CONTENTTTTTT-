/**
 * Lira E2E Test Suite - Universal Test Constants & Specifications
 * Authoritative source: PROJECT.md & ORIGINAL_REQUEST.md
 */

const path = require('path');
const fs = require('fs');

module.exports = {
  // Runtime Tooling Paths
  TOOLING: {
    NODE_BIN: '/Users/caleb/.gemini/antigravity/scratch/.node/bin/node',
    PYTHON_BIN: '/Users/caleb/.gemini/antigravity/scratch/dwp_reel/.venv/bin/python3',
    FFMPEG_BIN: fs.existsSync('/Users/caleb/.local/bin/ffmpeg') ? '/Users/caleb/.local/bin/ffmpeg' : 'ffmpeg',
    FFPROBE_BIN: fs.existsSync('/Users/caleb/.local/bin/ffprobe') ? '/Users/caleb/.local/bin/ffprobe' : 'ffprobe',
    CLOUDFLARED_BIN: fs.existsSync('/Users/caleb/.gemini/antigravity/scratch/bin/cloudflared')
      ? '/Users/caleb/.gemini/antigravity/scratch/bin/cloudflared'
      : 'cloudflared',
  },

  // Directory & File Paths
  PATHS: {
    PROJECT_ROOT: path.resolve(__dirname, '../..'),
    DESKTOP_REELS: path.join(process.env.HOME || '/Users/caleb', 'Desktop/lira reels'),
    SIDECAR_CONFIG: '/Users/caleb/.gemini/config/sidecars/lira-viral-content-engine/sidecar.json',
    USER_CONFIG: '/Users/caleb/.gemini/config/user_config.json',
    SKILL_FILE: '/Users/caleb/.gemini/config/skills/lira-video/SKILL.md',
    MASTER_BIBLE: path.join(process.env.HOME || '/Users/caleb', 'Desktop/lira reels/LIRA_ULTIMATE_REEL_AND_CAROUSEL_BIBLE.md'),
    ARCHIFY_DIR: path.resolve(__dirname, '../../.archify'),
    PUBLIC_ASSETS: path.resolve(__dirname, '../../public/assets'),
    BOTTLES_SSOT: path.resolve(__dirname, '../../public/assets/bottles_ssot'),
    DATA_LEDGER: path.resolve(__dirname, '../../data/content_ledger.json'),
    SCRIPTS_DIR: path.resolve(__dirname, '../../scripts'),
  },

  // Reel 9:16 Canvas & Safe Zone Specifications
  REEL_SPECS: {
    WIDTH: 1080,
    HEIGHT: 1920,
    FPS: 30,
    MIN_DURATION_SEC: 22,
    MAX_DURATION_SEC: 35,
    SAFE_BOX: {
      xMin: 84,
      xMax: 888,
      yMin: 288,
      yMax: 1248,
      width: 804,
      height: 960,
    },
    HEADLINE_MAX_WORDS: 6,
    FRAME0_TEXT_MAX_WORDS: 8,
    SUBTITLE_SUPPRESS_DELAY_SEC: 1.30, // Lower captions suppressed until >= 1.30s
  },

  // Carousel 4:5 Canvas Specifications
  CAROUSEL_SPECS: {
    WIDTH: 1080,
    HEIGHT: 1350,
    MIN_SLIDES: 6,
    MAX_SLIDES: 8,
    SLIDE2_MAX_WORDS: 12, // Standalone re-serve hook
  },

  // Audio Pipeline Standards (EBU R128)
  AUDIO_SPECS: {
    TARGET_LUFS: -14.0,
    LUFS_TOLERANCE: 2.0, // Acceptable range: [-16.0, -12.0]
    MAX_SPEECH_ONSET_SEC: 0.03, // Target <= 0.02s, hard ceiling 0.03s
    MAX_MID_HOOK_SILENCE_SEC: 0.20, // Zero mid-hook pause > 0.20s in 0.0s-3.0s
    PROHIBITED_TRACKS: ['Sweet Boy', 'Malcolm Todd', 'sweet_boy'],
  },

  // Core Lira Business Context
  LIRA_CONTEXT: {
    SKUS: [
      'Matcha Oatside',
      'Choco Hazelnut',
      'Signature Milk Tea',
      'Matcha Classic',
    ],
    PBL_HOOK_CATEGORIES: [
      'Educational',
      'Comparison',
      'Myth Busting',
      'Storytelling',
      'Random',
      'Authority',
      'Day in the Life',
    ],
    MAX_BIGRAM_JACCARD: 0.30,
    CONSECUTIVE_TEST_SLOTS: 10,
  },

  // Guardrail Negative Patterns
  GUARDRAILS: {
    BOTTLE_COUNT_REGEX: /(?<![-–—\d]\s*)\b(?:\d+|(?:(?:dua|tiga|empat|lima|enam|tujuh|delapan|sembilan)\s*puluh(?:\s*(?:satu|dua|tiga|empat|lima|enam|tujuh|delapan|sembilan))?|(?:dua|tiga|empat|lima|enam|tujuh|delapan|sembilan)\s*belas|sebelas|sepuluh|seratus|seribu|(?:dua|tiga|empat|lima|enam|tujuh|delapan|sembilan)\s*ratus|satu|dua|tiga|empat|lima|enam|tujuh|delapan|sembilan))\s*(?:botol|pcs|bottle)\b/i,
    STEVIA_DOSAGE_REGEX: /\b\d+\s*(?:tetes|ml|gram|g)\s*(?:daun\s*)?stevia\b/i,
    SCHOOL_NAMES_REGEX: /\b(UPH|UPHC|UPH College|Baranangsiang|Barsih|SMK Baranangsiang)\b/i,
    FINANCIALS_REGEX: /\b(Rp500M|Rp21M|Rp8\.6M|War Chest|CapEx(?:\s*Reserve)?|HPP|COGS|margin|20%\s*fee|74%|66%)\b/i,
    BANNED_TERMS_REGEX: /\b(ceremonial|WithUs|JBD|Jakarta Bubble Drink)\b/i,
    EMOJI_REGEX: /(?:\p{Extended_Pictographic}|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]|\uD83E[\uDD00-\uDDFF])/u,
  },

  // Buffer GraphQL Publisher Constants
  BUFFER_PUBLISHER: {
    API_URL: 'https://api.buffer.com',
    CHANNEL_ID: '6ad933a2778b240e2f81b45d',
    SCHEDULING_TYPE: 'shareNow',
    TUNNEL_TIMEOUT_SEC: 300,
    PROHIBITED_FIELDS: ['firstComment', 'collaborators'],
    ALLOWED_TYPES: ['reel', 'carousel'],
  },

  // Sidecar Specifications
  SIDECAR_SPECS: {
    SCHEDULE_CRON: '30 7,12,18 * * *',
    TIMEZONE: 'Asia/Jakarta',
    EXPECTED_CRON_EXPRESSION: 'CRON_TZ=Asia/Jakarta 30 7,12,18 * * *',
    DISALLOW_WILDCARDS: true,
  },
};
