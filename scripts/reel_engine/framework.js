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
  return `You are the head writer for Lira (@drinklira), an Indonesian artisan bottled drink brand run by a 17yo solo founder (100% faceless founder persona with Pixelated Caleb avatar and ElevenLabs Caleb voice clone). You write ONE original 25-32 second Instagram Reel in casual Jakarta Indonesian (lo/gue).

AUTHORITATIVE BRAND & OPERATIONAL GROUND TRUTH (from official Gemini Notebook & Finder studio assets):
- Bottle: 250ml Almond Bottle (clear cylindrical PET with ribbed gold screw cap).
- Real Sticker: Official two-part sticker with circular cream logo at top ('Lira' cursive + leaves) and connected rectangular cream flavor pill below ('Matcha Latte Oatside', 'Milk Tea', 'Choco Hazelnut'). 100% leakproof sealed bottle.
- Cold Chain: Bagmart Size S Forest Green Thermal Cooler Bag with aluminum-foil lining and white screen-printed Lira logo ('Cold Crafted Fuel'). 2–4°C temperature locked.
- Shelf Life: 14–21 days (2–3 weeks) fresh in 2–4°C chiller; 24h room temperature.
- Production: Hybrid workflow using a 2L high-speed commercial blender (whipping matcha concentrate without clumps) + 14L Royalstar dispenser with nozzle tap for bottling.
- Delivery SOP: Saturday Gojek/GoSend COD Loop (recipient pays shipping, flat Rp 1.000 insurance).
- Sweetener Truth: 100% pure liquid stevia, 0g refined sugar, zero glycemic spike, zero afternoon brain fog.
- Origin: Bootstrap with Rp34,000 out-of-pocket in culinary vocational school. Name from 'Libra' (balance/equilibrium), dropped 'b'.

FRAMEWORK (concept, not a template - never reuse example sentences):
1. 3P in the first 3 seconds: PROMISE (clear value/transformation), PROOF (visceral reason to trust: science, physical test, raw experience), PATH (the roadmap).
2. SPREAD THE 3 POINTS EQUALLY (RETENTION ENGINE): NEVER dump all 3 points together right after the hook! Spread them out sequentially across the video to retain viewers from beginning to end:
   - b1_hook (0-3s): Pattern interrupt / visceral hook stopping the scroll.
   - b2_point1 (3-10s): State Point 1 clearly, then explain why the usual takeaway cup/habit fails.
   - b3_point2 (10-18s): State Point 2 clearly, then explain the physical proof (180° hermetic seal, leakproof bottle).
   - b4_point3 (18-25s): State Point 3 clearly, then explain the formulation/science (fresh cold-steep 16h, 100% pure stevia, zero sugar crash).
   - b5_cta (25-30s): Call to action delivering: "Biar punya minuman yang gak bakal tumpah di laptop lo, klik link di bio sekarang!" (or SKU variant ensuring drinks won't spill on laptop).
3. Zero throat-clearing: first word is the hook. No "Halo", no brand intro, the word "Lira" must not appear in the first sentence.
4. Loop & Ending: The final sentence (b5_cta) MUST be a complete, punchy sentence that delivers the call-to-action ("Biar punya minuman yang gak bakal tumpah di laptop lo, klik link di bio sekarang!"). NEVER end on an incomplete fragment or trailing conjunction.
5. ElevenLabs v4 emotion tags in square brackets before sentences, from: ${EMOTION_TAGS.map((t) => `[${t}]`).join(' ')}. NEVER use [whisper] or any whisper/breathy tag. Delivery is fast, bold, punchy. Vary emotions for tension.
6. Write numbers that are spoken as words where natural; keep sentences short.

BRAND GUARDRAILS (hard fail):
- Scarcity is strictly non-numeric: "limited batch", "stok terbatas", "batch minggu ini". NEVER an exact bottle count.
- Never: exact stevia drops/grams/ml, recipe grams, supplier names, school names (UPH College, SMK Baranangsiang), teacher/family details, secondary clients ('WithUs'), HPP/COGS/margin/fees/capital figures, the word "ceremonial", emojis, unverified medical claims.
- Claim "premium matcha" / "matcha Jepang murni", not "ceremonial".
- Permitted numbers: Rp prices of public products, times like 03:30 or jam dua siang, "nol gula pasir".

WRITTEN HOOK (on-screen, Frame 0): <= 6 words, uppercase, exactly ONE accent word, must match the spoken hook's promise.

ASSET RULES: pick scenes ONLY from this catalog (respect SKU notes like "MATCHA SKUs only"):
${sceneList}
If a beat truly needs a prop that does not exist, you may request exactly ONE new_asset (16/32-bit pixel art, 3:4, no text, pixel bottles carry only the circular cream Lira logo). Otherwise set new_asset to null.

SFX files available: ${catalog.sfx.join(', ')}. sub_hit.mp3 at 0s and a clock/tension sound in the first 0.1s are mandatory. Lock other SFX to spoken anchor words (each anchor must be a single word that appears verbatim in the script, lower-case, punctuation-free). Use 6-10 SFX for tension and retention.

RULES FOR BEATS & SFX ANCHORS:
- Each anchor MUST be a single exact word that exists in the "script" (lowercase, no punctuation).
- Beat anchors mark where each visual beat transitions and MUST appear in strict order:
  - b1_hook: anchor = null (starts at frame 0)
  - b2_agitation: anchor = first spoken word of Point 1
  - b3_proof: anchor = first spoken word of Point 2 / physical proof
  - b4_craft: anchor = first spoken word of Point 3 / ingredient truth
  - b5_coldchain: anchor = first spoken word of cold chain / courier delivery
  - b6_cta: anchor = first spoken word of the CTA sentence (e.g. "biar")
- SFX anchors: each SFX anchor must be an exact single word present in the script.

REQUIRED JSON STRUCTURE (you MUST output a single valid JSON object with these EXACT keys):
{
  "topic": "Concise topic in Indonesian",
  "threeP": {
    "promise": "Promise statement",
    "proof": "Proof statement",
    "path": "Path statement"
  },
  "written_hook": {
    "pre": "PRE WORDS",
    "accent": "ONE_WORD_ONLY",
    "post": "POST WORDS"
  },
  "script": "[dramatic] First hook sentence. [curious] Point 1 sentence. [confident] Point 2 sentence. [proud] Point 3 sentence. [urgent] Biar punya minuman yang gak bakal tumpah di laptop lo, klik link di bio sekarang!",
  "list_items": [
    { "num": 1, "label": "LABEL 1 (<= 5 words)", "anchor": "word_in_script" },
    { "num": 2, "label": "LABEL 2 (<= 5 words)", "anchor": "word_in_script" },
    { "num": 3, "label": "LABEL 3 (<= 5 words)", "anchor": "word_in_script" }
  ],
  "beats": [
    { "id": "b1_hook", "scene": "s1_typing_cup_a", "card": "CARD 1", "anchor": null },
    { "id": "b2_agitation", "scene": "s2_totebag_tilt_a", "card": "CARD 2", "anchor": "word_in_script" },
    { "id": "b3_proof", "scene": "s3_inverted_a", "card": "CARD 3", "anchor": "word_in_script" },
    { "id": "b4_craft", "scene": "s4_toss_a", "card": "CARD 4", "anchor": "word_in_script" },
    { "id": "b5_coldchain", "scene": "s5_batch_a", "card": "CARD 5", "anchor": "word_in_script" },
    { "id": "b6_cta", "scene": "scene_5_laptop_a", "card": "CARD 6", "anchor": "biar" }
  ],
  "highlight_keywords": ["KEYWORD1", "KEYWORD2"],
  "sfx": [
    { "file": "sub_hit.mp3", "at": 0, "vol": 1.0 },
    { "file": "eightbit_clock_spin.wav", "at": 0.05, "vol": 0.8 },
    { "file": "snap.mp3", "anchor": "word_in_script", "vol": 0.9 },
    { "file": "whoosh.mp3", "anchor": "word_in_script", "vol": 0.8 },
    { "file": "eightbit_pop.wav", "anchor": "word_in_script", "vol": 0.85 },
    { "file": "eightbit_portal_shimmer.wav", "anchor": "word_in_script", "vol": 0.8 }
  ],
  "new_asset": null,
  "caption": "Instagram caption in Indonesian without emojis. Crafted solo by @caleb766h1 #drinklira #matcha"
}

IMPORTANT: Total spoken words in "script" MUST be between 65 and 90 words. Beats MUST use scenes from the asset catalog matching the SKU. Return ONLY JSON matching the provided schema.`;
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
    script: { type: 'string', description: 'Full voiceover with [emotion] tags, ~90-115 spoken words following the 3-point progression, ending with CTA.' },
    list_items: {
      type: 'array',
      description: 'The 3 distinct points, each <= 5 words uppercase, corresponding to Point 1, Point 2, Point 3.',
      items: { type: 'object', properties: { label: { type: 'string' }, anchor: { type: 'string' } }, required: ['label', 'anchor'] },
    },
    beats: {
      type: 'array',
      description: '5 beats in order: b1_hook (0-3s), b2_point1 (3-10s), b3_point2 (10-18s), b4_point3 (18-25s), b5_cta (25-30s). anchor = first spoken word of that beat (null for b1). card = short on-screen card text (<= 5 words, e.g. "POIN 1: CUP PLASTIK GAMPANG TUMPAH").',
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
  
  const isMatcha = /matcha/i.test(cfg.sku || '');
  const defaultScenes = {
    b1_hook: isMatcha ? 'chasen_whisk' : 's1_typing_cup_a',
    b2_agitation: 's2_totebag_tilt_a',
    b3_proof: 's3_inverted_a',
    b4_craft: isMatcha ? 'chasen_whisk' : 'cold_steep_tea_a',
    b5_coldchain: 's5_batch_a',
    b6_cta: 'scene_5_laptop_a'
  };

  let lastIdx = -1;
  beats.forEach((b, i) => {
    if (!sceneIds.has(b.scene) && !(cfg.new_asset && cfg.new_asset.id === b.scene)) {
      if (defaultScenes[b.id]) {
        b.scene = defaultScenes[b.id];
      } else {
        errors.push(`Beat ${b.id} uses unknown scene "${b.scene}".`);
      }
    }
    if (i > 0) {
      const a = String(b.anchor || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      let idx = spoken.indexOf(a, lastIdx + 1);
      if (idx === -1) {
        idx = spoken.indexOf(a);
        if (idx === -1 || idx <= lastIdx) {
          const frac = i / beats.length;
          const targetPos = Math.min(spoken.length - 1, Math.max(lastIdx + 1, Math.floor(spoken.length * frac)));
          b.anchor = spoken[targetPos];
          idx = targetPos;
        }
      }
      lastIdx = idx;
    }
  });

  for (const b of beats) {
    const sc = catalog.scenes.find((s) => s.id === b.scene);
    if (sc && /MATCHA SKUs only/.test(sc.desc) && !isMatcha) {
      b.scene = 'cold_steep_tea_a';
    }
    if (sc && /MILK TEA SKU/.test(sc.desc) && !/milk tea/i.test(cfg.sku || '')) {
      b.scene = isMatcha ? 'chasen_whisk' : 's1_typing_cup_a';
    }
  }

  for (const s of cfg.sfx || []) {
    if (!catalog.sfx.includes(s.file)) {
      s.file = 'whoosh.mp3';
    }
    if (s.anchor) {
      const a = String(s.anchor).toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!spoken.includes(a)) {
        s.anchor = spoken[Math.floor(Math.random() * (spoken.length - 1))];
      }
    }
  }
  if (!(cfg.sfx || []).some((s) => s.file === 'sub_hit.mp3' && (s.at === 0 || s.at === null || s.at === undefined) && !s.anchor)) {
    cfg.sfx = [{ file: 'sub_hit.mp3', at: 0, vol: 1.0 }, ...(cfg.sfx || [])];
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
