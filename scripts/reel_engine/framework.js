/**
 * Lira Reel Framework (from plan_script_and_asset_automation.md §2, §3, §4, §5.3, §7, §8).
 * This is a CONCEPT + OUTLINE. Every run produces an ORIGINAL script; the plan's
 * example lines are illustrations only and must never be copied 1:1.
 */
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

const SKUS = ['Matcha Oatside', 'Choco Hazelnut', 'Signature Milk Tea', 'Matcha Classic'];

// §3.1 per-SKU pain points
const SKU_ANGLES = {
  'Matcha Oatside': 'Target: the 2 PM crash and brain fog. Pure Japanese matcha, Oatside barista oat milk, L-theanine calm focus, natural stevia.',
  'Choco Hazelnut': 'Target: heavy stomach and sticky throat from sweet cafe chocolate. Real cocoa blend, real hazelnut, 0g refined sugar, clean theobromine energy.',
  'Signature Milk Tea': 'Target: syrupy cafe boba / milk tea fatigue. Real tea leaves cold-steeped overnight, real milk, natural stevia, honest tea flavour.',
  'Matcha Classic': 'Target: the "matcha must be bitter / burnt" myth. First-harvest umami, no milk dilution, micro-whisked clarity.',
};

// §3.2 seven PBL categories
const HOOK_CATEGORIES = [
  'Somatic Science',
  'Polarizing Comparison',
  'Myth Busting',
  'Storytelling & Bootstrap',
  'Pattern Interrupt',
  'Authority / Expose',
  'Day in the Life',
];

const PILLARS = [
  'Sugar Crash & Stevia Science',
  'Craftsmanship & Ingredient Truth',
  'Cold Chain & Saturday COD Loop',
  'Student Lifestyle & Portability',
];

// §4.2 Red Box (1080x1440)
const RED_BOX = { x0: 192, x1: 896, y0: 202, y1: 1236 };

// §5.1 six beats (target seconds)
const BEATS = [
  { id: 'b1_hook', label: 'Super Hook & 4-layer stack', target: [0, 5] },
  { id: 'b2_agitation', label: 'Context agitation & mechanism (Top card + Clock HUD)', target: [5, 10] },
  { id: 'b3_proof', label: 'Physical proof & product contrast (real bottles)', target: [10, 16] },
  { id: 'b4_craft', label: 'Founder craft / ingredient science (Pixel Caleb + tools)', target: [16, 22] },
  { id: 'b5_coldchain', label: 'Cold chain reality (Forest Green cooler bag / Gojek)', target: [22, 27] },
  { id: 'b6_cta', label: 'Fanfare CTA + seamless loop-back', target: [27, 31] },
];

const EMOTION_TAGS = ['dramatic', 'curious', 'frustrated', 'intrigued', 'excited', 'proud', 'confident', 'urgent', 'serious', 'surprised', 'playful', 'determined'];

function loadCatalog() {
  return JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, 'data/asset_catalog.json'), 'utf-8'));
}

function buildSystemPrompt(catalog) {
  const sceneList = catalog.scenes
    .map((s) => `- ${s.id} [beats: ${s.beats.join(', ')}]: ${s.desc}`)
    .join('\n');
  return `You are the head writer for Lira (@drinklira), a solo-founder Indonesian artisan bottled drink brand (faceless founder, Pixelated Caleb avatar, Caleb voice clone). You write ONE original 25-32 second Instagram Reel in casual Jakarta Indonesian (lo/gue).

FRAMEWORK (concept, not a template - never reuse example sentences):
1. 3P in the first 3 seconds: PROMISE (clear value/transformation), PROOF (visceral reason to trust: science, physical test, raw experience), PATH (the roadmap).
2. Open-loop multiplier: open with a counted list of dangers/lies/signs/rules (e.g. 3), and state up-front that item #3 is the one the viewer does daily / didn't expect. Item #3 is only paid off late (beat 2 end or later). Phrase it freshly every time - DO NOT write "Dan yang nomor 3, lo lakuin tiap hari tanpa sadar" verbatim.
3. Zero throat-clearing: first word is the hook. No "Halo", no brand intro, the word "Lira" must not appear in the first sentence.
4. Six beats, ~25-32s total (~70-85 spoken words):
   b1_hook (0-5s) super hook + open loop | b2_agitation (5-10s) why the usual option fails, list items | b3_proof (10-16s) physical proof with the real bottle | b4_craft (16-22s) founder craft / ingredient science "aha" | b5_coldchain (22-27s) how it arrives cold (Forest Green foil cooler bag, Saturday Gojek COD) | b6_cta (27-31s) non-numeric scarcity CTA + seamless loop.
5. Seamless loop: the LAST sentence must stop mid-phrase so it grammatically flows straight into the FIRST words of the script when the video loops.
6. ElevenLabs v4 emotion tags in square brackets before sentences, from: ${EMOTION_TAGS.map((t) => `[${t}]`).join(' ')}. NEVER use [whisper] or any whisper/breathy tag. Delivery is fast, bold, punchy. Vary emotions for tension.
7. Write numbers that are spoken as words where natural; keep sentences short.

BRAND GUARDRAILS (hard fail):
- Scarcity is strictly non-numeric: "limited batch", "stok terbatas", "batch minggu ini". NEVER a bottle count.
- Never: exact stevia drops/grams/ml, recipe grams, supplier names, school names, HPP/COGS/margin/fees/capital figures, the word "ceremonial", emojis, unverified medical claims (keep science qualitative: "gula cair bikin energi naik lalu drop").
- Claim "premium matcha" / "matcha Jepang murni", not "ceremonial".
- Permitted numbers: Rp prices of public products, times like 03:30 or jam dua siang, "nol gula pasir".

WRITTEN HOOK (on-screen, Frame 0): <= 6 words, uppercase, exactly ONE accent word, must match the spoken hook's promise.

ASSET RULES: pick scenes ONLY from this catalog (respect SKU notes like "MATCHA SKUs only"):
${sceneList}
If a beat truly needs a prop that does not exist, you may request exactly ONE new_asset (16/32-bit pixel art, 3:4, no text, pixel bottles carry only the circular cream Lira logo). Otherwise set new_asset to null.

SFX files available: ${catalog.sfx.join(', ')}. sub_hit.mp3 at 0s and a clock/tension sound in the first 0.1s are mandatory. Lock other SFX to spoken anchor words (each anchor must be a single word that appears verbatim in the script, lower-case, punctuation-free). Use 6-10 SFX for tension and retention.

Return ONLY JSON matching the provided schema.`;
}

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    topic: { type: 'string' },
    threeP: {
      type: 'object',
      properties: { promise: { type: 'string' }, proof: { type: 'string' }, path: { type: 'string' } },
      required: ['promise', 'proof', 'path'],
    },
    written_hook: {
      type: 'object',
      properties: { pre: { type: 'string' }, accent: { type: 'string' }, post: { type: 'string' } },
      required: ['pre', 'accent', 'post'],
    },
    script: { type: 'string', description: 'Full voiceover with [emotion] tags, 70-85 spoken words, last sentence loops into the first.' },
    list_items: {
      type: 'array',
      description: 'The 3 counted items of the open loop, each <= 4 words uppercase, shown as HUD chips',
      items: { type: 'object', properties: { label: { type: 'string' }, anchor: { type: 'string' } }, required: ['label', 'anchor'] },
    },
    beats: {
      type: 'array',
      description: 'Exactly 6 beats in order b1_hook..b6_cta. anchor = first spoken word of that beat (null for b1). card = short on-screen top-card text (<= 5 words).',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          anchor: { type: 'string', nullable: true },
          scene: { type: 'string' },
          card: { type: 'string' },
        },
        required: ['id', 'scene', 'card'],
      },
    },
    highlight_keywords: { type: 'array', items: { type: 'string' } },
    sfx: {
      type: 'array',
      items: {
        type: 'object',
        properties: { file: { type: 'string' }, anchor: { type: 'string', nullable: true }, at: { type: 'number', nullable: true }, vol: { type: 'number' } },
        required: ['file', 'vol'],
      },
    },
    new_asset: {
      type: 'object',
      nullable: true,
      properties: { id: { type: 'string' }, beat: { type: 'string' }, prompt: { type: 'string' } },
    },
    caption: { type: 'string', description: 'Instagram caption in Indonesian, no emojis, ends with "Crafted solo by @caleb766h1" and 6-10 hashtags' },
  },
  required: ['topic', 'threeP', 'written_hook', 'script', 'list_items', 'beats', 'highlight_keywords', 'sfx', 'caption'],
};

/* ------------------------------ Similarity (§7.2) ------------------------------ */
function stripTags(s) {
  return String(s || '').replace(/\[[^\]]*\]/g, ' ');
}
function tokenize(t) {
  return stripTags(t).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
}
function bigrams(t) {
  const w = tokenize(t);
  const s = new Set();
  for (let i = 0; i < w.length - 1; i++) s.add(`${w[i]} ${w[i + 1]}`);
  return s;
}
function jaccard(a, b) {
  const A = bigrams(a);
  const B = bigrams(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  return inter / (A.size + B.size - inter);
}

function wordsOf(script) {
  return tokenize(script);
}

/* --------------------------- Structural validation --------------------------- */
function validateReelConfig(cfg, { catalog, ledgerEntries = [] } = {}) {
  catalog = catalog || loadCatalog();
  const errors = [];
  const sceneIds = new Set(catalog.scenes.map((s) => s.id));
  const script = cfg.script || '';
  const spoken = wordsOf(script);

  if (/\[\s*whisper/i.test(script) || /whisper/i.test(script)) errors.push('Script contains a whisper tag (banned).');
  const tags = (script.match(/\[([^\]]+)\]/g) || []).map((t) => t.slice(1, -1).trim().toLowerCase());
  if (tags.length < 4) errors.push(`Too few emotion tags (${tags.length}); need >= 4 for an emotional read.`);
  if (spoken.length < 60 || spoken.length > 95) errors.push(`Spoken word count ${spoken.length} outside 60-95 (target 25-32s).`);

  const firstSentence = stripTags(script).trim().split(/[.!?]/)[0] || '';
  if (/\blira\b/i.test(firstSentence)) errors.push('Brand name in the first sentence (throat-clearing).');
  if (/^\s*(halo|hai|hi|hey|guys)\b/i.test(firstSentence)) errors.push('Throat-clearing greeting at frame 0.');

  const wh = cfg.written_hook || {};
  const hookWords = `${wh.pre || ''} ${wh.accent || ''} ${wh.post || ''}`.trim().split(/\s+/).filter(Boolean);
  if (hookWords.length > 6) errors.push(`Written hook has ${hookWords.length} words (> 6).`);
  if (!wh.accent || wh.accent.trim().split(/\s+/).length !== 1) errors.push('Written hook needs exactly one accent word.');

  const beats = cfg.beats || [];
  const expected = BEATS.map((b) => b.id);
  if (beats.length !== 6 || beats.some((b, i) => b.id !== expected[i])) errors.push(`Beats must be exactly ${expected.join(', ')} in order.`);
  let lastIdx = -1;
  beats.forEach((b, i) => {
    if (!sceneIds.has(b.scene) && !(cfg.new_asset && cfg.new_asset.id === b.scene)) errors.push(`Beat ${b.id} uses unknown scene "${b.scene}".`);
    if (i > 0) {
      const a = String(b.anchor || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const idx = spoken.indexOf(a, lastIdx + 1);
      if (!a || idx === -1) errors.push(`Beat ${b.id} anchor "${b.anchor}" not found in order in script.`);
      else lastIdx = idx;
    }
  });

  const isMatcha = /matcha/i.test(cfg.sku || '');
  for (const b of beats) {
    const sc = catalog.scenes.find((s) => s.id === b.scene);
    if (sc && /MATCHA SKUs only/.test(sc.desc) && !isMatcha) errors.push(`Scene ${sc.id} is matcha-only but SKU is ${cfg.sku}.`);
    if (sc && /MILK TEA SKU/.test(sc.desc) && !/milk tea/i.test(cfg.sku || '')) errors.push(`Scene ${sc.id} is milk-tea-only.`);
  }

  for (const s of cfg.sfx || []) {
    if (!catalog.sfx.includes(s.file)) errors.push(`Unknown SFX ${s.file}.`);
    if (s.anchor) {
      const a = String(s.anchor).toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!spoken.includes(a)) errors.push(`SFX anchor "${s.anchor}" not in script.`);
    }
  }
  if (!(cfg.sfx || []).some((s) => s.file === 'sub_hit.mp3' && (s.at === 0 || s.at === null || s.at === undefined) && !s.anchor)) {
    errors.push('Missing frame-0 sub_hit.mp3.');
  }
  if ((cfg.list_items || []).length !== 3) errors.push('Need exactly 3 open-loop list items.');

  // §7.1 tuple cooldown (last 10 reels) + §7.2 Jaccard
  const reels = ledgerEntries.filter((e) => (e.format || e.type) === 'reel');
  const last10 = reels.slice(-10);
  if (last10.some((e) => e.sku === cfg.sku && e.hook_category === cfg.hook_category && e.pillar === cfg.pillar)) {
    errors.push(`Tuple (${cfg.sku}, ${cfg.pillar}, ${cfg.hook_category}) used in the last 10 reels.`);
  }
  let maxJ = 0;
  for (const e of ledgerEntries) {
    for (const prev of [e.verbal_script, e.verbal_hook, e.script].filter(Boolean)) {
      maxJ = Math.max(maxJ, jaccard(script, prev));
    }
  }
  if (maxJ >= 0.3) errors.push(`Bigram Jaccard vs ledger = ${maxJ.toFixed(2)} (>= 0.30).`);

  return { ok: errors.length === 0, errors, maxJaccard: maxJ, spokenWords: spoken.length };
}

module.exports = {
  PROJECT_ROOT,
  SKUS,
  SKU_ANGLES,
  HOOK_CATEGORIES,
  PILLARS,
  RED_BOX,
  BEATS,
  EMOTION_TAGS,
  RESPONSE_SCHEMA,
  loadCatalog,
  buildSystemPrompt,
  validateReelConfig,
  jaccard,
  tokenize,
  stripTags,
};
