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

// §5.1 eight retention beats (Hook - Lead - Body 1 - Open Loop - Body 2 - Open Loop - Body 3 - CTA)
const BEATS = [
  { id: 'b1_hook', label: 'Hook (0-3s Frame-0 Super Hook & 4-layer stack)', target: [0, 3] },
  { id: 'b2_lead', label: 'Lead (3-6s Context bridge & premise setup)', target: [3, 7] },
  { id: 'b3_body1', label: 'Body 1 (7-12s Point 1 Truth & Problem Agitation)', target: [7, 12] },
  { id: 'b4_loop1', label: 'Open Loop 1 (12-15s Curiosity gap & teaser into Point 2)', target: [12, 15] },
  { id: 'b5_body2', label: 'Body 2 (15-20s Point 2 Physical Proof & Mechanism)', target: [15, 20] },
  { id: 'b6_loop2', label: 'Open Loop 2 (20-23s Second curiosity gap & teaser into Point 3)', target: [20, 23] },
  { id: 'b7_body3', label: 'Body 3 (23-27s Point 3 Formulation & Cold Chain Truth)', target: [23, 27] },
  { id: 'b8_cta', label: 'CTA (27-31s Punchy conversion & seamless loop-back)', target: [27, 31] },
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

RETENTION FORMAT (MANDATORY 8-STAGE SEQUENCE):
Hook -> Lead -> Body 1 -> Open Loop -> Body 2 -> Open loop -> Body 3 -> CTA
You MUST structure the script, beats, and pacing through these 8 sequential stages to eliminate viewer drop-off:
1. Hook (0-3s, beat b1_hook):
   - Visceral scroll-stopper (somatic pain, contrarian claim, or pattern interrupt).
   - First word is immediate without throat-clearing. No "Halo", no brand intro, the word "Lira" must not appear in the first sentence.
2. Lead (3-6s, beat b2_lead):
   - Bridges from the hook into the core stakes/premise. Explains why ordinary cafe drinks or habits fail before revealing the points ("Masalahnya, tiap kali lo beli cup kafe...", "Banyak yang ngira minum manis itu biasa...", "Ini alasan kenapa hari lo selalu crash...").
3. Body 1 (6-11s, beat b3_body1):
   - Point 1 Truth & Agitation. Explains the first core problem or revelation (e.g. cup plastik berembun dan meleleh, atau matcha murah dipanggang gosong).
4. Open Loop 1 (11-14s, beat b4_loop1):
   - Curiosity gap / teaser bridging into Point 2 ("Tapi itu belum seberapa dibanding bahaya berikutnya...", "Dan lo bakal kaget pas tahu apa yang sebenernya terjadi...", "Tapi bukan cuma masalah bocornya...").
5. Body 2 (14-20s, beat b5_body2):
   - Point 2 Physical Proof & Mechanism (e.g. 180° hermetic sealed Almond bottle dibalik di atas MacBook tanpa tetes bocor, atau chasen micro-whisking).
6. Open Loop 2 (20-23s, beat b6_loop2):
   - Second curiosity gap / teaser bridging into Point 3 ("Tapi bagian paling pentingnya ada di jam dua siang nanti...", "Dan ada satu rahasia lagi yang kafe gak pernah ceritain...", "Dan lo harus tahu apa yang bikin manisnya beda...").
7. Body 3 (23-27s, beat b7_body3):
   - Point 3 Formulation & Cold Chain Truth (e.g. 100% pure liquid stevia leaf zero sugar crash, 16h overnight cold steep, atau Bagmart forest green thermal cooler bag 2-4°C).
8. CTA (27-31s, beat b8_cta):
   - Complete punchy sentence delivering conversion: "Biar punya minuman yang gak bakal tumpah di laptop lo, klik link di bio sekarang!" (or SKU variant ensuring drinks won't spill on laptop). NEVER end on an incomplete fragment or trailing conjunction.

ElevenLabs v4 emotion tags in square brackets before sentences, from: ${EMOTION_TAGS.map((t) => `[${t}]`).join(' ')}. NEVER use [whisper] or any whisper/breathy tag. Delivery is fast, bold, punchy. Vary emotions for tension.
Write numbers that are spoken as words where natural; keep sentences short.

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
  - b2_lead: anchor = first spoken word of the Lead bridge
  - b3_body1: anchor = first spoken word of Point 1 / Body 1
  - b4_loop1: anchor = first spoken word of Open Loop 1 teaser
  - b5_body2: anchor = first spoken word of Point 2 / Body 2 proof
  - b6_loop2: anchor = first spoken word of Open Loop 2 teaser
  - b7_body3: anchor = first spoken word of Point 3 / Body 3 formulation
  - b8_cta: anchor = first spoken word of the CTA sentence (e.g. "biar")
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
  "script": "[dramatic] First hook sentence. [curious] Lead transition sentence setting the stakes. [frustrated] Point 1 body sentence. [intrigued] Open loop 1 teaser sentence. [confident] Point 2 proof sentence. [serious] Open loop 2 teaser sentence. [proud] Point 3 formulation sentence. [urgent] Biar punya minuman yang gak bakal tumpah di laptop lo, klik link di bio sekarang!",
  "list_items": [
    { "num": 1, "label": "LABEL 1 (<= 5 words)", "anchor": "word_in_body1" },
    { "num": 2, "label": "LABEL 2 (<= 5 words)", "anchor": "word_in_body2" },
    { "num": 3, "label": "LABEL 3 (<= 5 words)", "anchor": "word_in_body3" }
  ],
  "beats": [
    { "id": "b1_hook", "scene": "totebag_cup_tilt", "card": "STOP TARUH CUP DI TOTEBAG", "anchor": null },
    { "id": "b2_lead", "scene": "desk_cup_typing", "card": "KENAPA INI BAHAYA", "anchor": "word_in_script" },
    { "id": "b3_body1", "scene": "wet_notes_cup", "card": "POIN 1: CUP GAMPANG BOCOR", "anchor": "word_in_script" },
    { "id": "b4_loop1", "scene": "sugar_vs_stevia_chart", "card": "TAPI ITU BELUM SEBERAPA...", "anchor": "word_in_script" },
    { "id": "b5_body2", "scene": "inverted_bottle_laptop", "card": "POIN 2: 180° SEALED ANTI BOCOR", "anchor": "word_in_script" },
    { "id": "b6_loop2", "scene": "batch_bottling", "card": "BAGIAN PALING PENTINGNYA...", "anchor": "word_in_script" },
    { "id": "b7_body3", "scene": "cold_steep_tea", "card": "POIN 3: ZERO SUGAR CRASH", "anchor": "word_in_script" },
    { "id": "b8_cta", "scene": "caleb_sip_smirk", "card": "KLIK LINK DI BIO SEKARANG", "anchor": "biar" }
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

IMPORTANT: Total spoken words in "script" MUST be between 70 and 95 words. Beats MUST use scenes from the asset catalog matching the SKU. Return ONLY JSON matching the provided schema.`;
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
    script: { type: 'string', description: 'Full voiceover with [emotion] tags, ~70-95 spoken words following the 8-stage retention progression (Hook -> Lead -> Body 1 -> Open Loop -> Body 2 -> Open Loop -> Body 3 -> CTA).' },
    list_items: {
      type: 'array',
      description: 'The 3 distinct points, each <= 5 words uppercase, corresponding to Body 1, Body 2, and Body 3.',
      items: { type: 'object', properties: { label: { type: 'string' }, anchor: { type: 'string' } }, required: ['label', 'anchor'] },
    },
    beats: {
      type: 'array',
      description: '8 beats in order: b1_hook (Hook 0-3s), b2_lead (Lead 3-6s), b3_body1 (Body 1 6-11s), b4_loop1 (Open Loop 1 11-14s), b5_body2 (Body 2 14-20s), b6_loop2 (Open Loop 2 20-23s), b7_body3 (Body 3 23-27s), b8_cta (CTA 27-31s). anchor = first spoken word of that beat (null for b1). card = short on-screen card text (<= 5 words).',
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
  if (spoken.length < 60 || spoken.length > 115) errors.push(`Spoken word count ${spoken.length} outside 60-115 (target 25-35s).`);

  const firstSentence = stripTags(script).trim().split(/[.!?]/)[0] || '';
  if (/\blira\b/i.test(firstSentence)) errors.push('Brand name in the first sentence (throat-clearing).');
  if (/^\s*(halo|hai|hi|hey|guys)\b/i.test(firstSentence)) errors.push('Throat-clearing greeting at frame 0.');

  const wh = cfg.written_hook || {};
  let hookWords = `${wh.pre || ''} ${wh.accent || ''} ${wh.post || ''}`.trim().split(/\s+/).filter(Boolean);
  if (hookWords.length > 6) {
    const preWords = (wh.pre || '').trim().split(/\s+/).filter(Boolean);
    const maxPost = Math.max(0, 6 - preWords.length - 1);
    const postWords = (wh.post || '').trim().split(/\s+/).filter(Boolean).slice(0, maxPost);
    wh.post = postWords.join(' ');
    hookWords = `${wh.pre || ''} ${wh.accent || ''} ${wh.post || ''}`.trim().split(/\s+/).filter(Boolean);
  }
  if (!wh.accent || wh.accent.trim().split(/\s+/).length !== 1) errors.push('Written hook needs exactly one accent word.');

  const expected = BEATS.map((b) => b.id);
  const isMatcha = /matcha/i.test(cfg.sku || '');
  const defaultScenes = {
    b1_hook: isMatcha ? 'chasen_whisk' : 'totebag_cup_tilt',
    b2_lead: isMatcha ? 'totebag_cup_tilt' : 'desk_cup_typing',
    b3_body1: isMatcha ? 'melted_ice_cup' : 'wet_notes_cup',
    b4_loop1: 'sugar_vs_stevia_chart',
    b5_body2: 'inverted_bottle_laptop',
    b6_loop2: isMatcha ? 'blender_kitchen' : 'cooler_bag_pack',
    b7_body3: isMatcha ? 'stevia_dropper' : 'cold_steep_tea',
    b8_cta: 'caleb_sip_smirk',
  };

  // Auto-reconcile / adapt beats if LLM returns different beat count or legacy beat ids
  if (!Array.isArray(cfg.beats) || cfg.beats.length !== expected.length || cfg.beats.some((b, i) => b.id !== expected[i])) {
    const oldBeats = Array.isArray(cfg.beats) ? cfg.beats : [];
    const legacyMap = {
      b1_hook: ['b1_hook'],
      b2_lead: ['b2_lead', 'b2_agitation', 'b2_point1'],
      b3_body1: ['b3_body1', 'b2_point1', 'b2_agitation'],
      b4_loop1: ['b4_loop1', 'b3_proof'],
      b5_body2: ['b5_body2', 'b3_proof', 'b3_point2'],
      b6_loop2: ['b6_loop2', 'b4_craft', 'b4_point3'],
      b7_body3: ['b7_body3', 'b4_craft', 'b4_point3', 'b5_coldchain'],
      b8_cta: ['b8_cta', 'b6_cta', 'b5_cta'],
    };

    const newBeats = [];
    for (let i = 0; i < expected.length; i++) {
      const eId = expected[i];
      let match = oldBeats.find((b) => b.id === eId);
      if (!match) {
        for (const candidate of legacyMap[eId] || []) {
          match = oldBeats.find((b) => b.id === candidate);
          if (match) break;
        }
      }

      const scene = match?.scene && sceneIds.has(match.scene) ? match.scene : defaultScenes[eId];
      const card = match?.card || (
        eId === 'b1_hook' ? (cfg.written_hook?.accent ? `${cfg.written_hook.pre || ''} ${cfg.written_hook.accent} ${cfg.written_hook.post || ''}`.trim() : 'HOOK') :
        eId === 'b2_lead' ? 'KENAPA INI PENTING' :
        eId === 'b3_body1' ? (cfg.list_items?.[0]?.label || 'POIN 1: CUP GAMPANG BOCOR') :
        eId === 'b4_loop1' ? 'TAPI ITU BELUM SEBERAPA...' :
        eId === 'b5_body2' ? (cfg.list_items?.[1]?.label || 'POIN 2: 180° SEALED ANTI BOCOR') :
        eId === 'b6_loop2' ? 'BAGIAN PALING PENTINGNYA...' :
        eId === 'b7_body3' ? (cfg.list_items?.[2]?.label || 'POIN 3: ZERO SUGAR CRASH') :
        'KLIK LINK DI BIO SEKARANG'
      );

      newBeats.push({
        id: eId,
        scene,
        card,
        anchor: eId === 'b1_hook' ? null : (match?.anchor || null),
      });
    }
    cfg.beats = newBeats;
  }

  let lastIdx = -1;
  cfg.beats.forEach((b, i) => {
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
          const frac = i / cfg.beats.length;
          const targetPos = Math.min(spoken.length - 1, Math.max(lastIdx + 1, Math.floor(spoken.length * frac)));
          b.anchor = spoken[targetPos];
          idx = targetPos;
        }
      }
      lastIdx = idx;
    }
  });

  for (const b of cfg.beats) {
    const sc = catalog.scenes.find((s) => s.id === b.scene);
    if (sc && /MATCHA SKUs only/.test(sc.desc) && !isMatcha) {
      b.scene = 'cold_steep_tea';
    }
    if (sc && /MILK TEA SKU/.test(sc.desc) && !/milk tea/i.test(cfg.sku || '')) {
      b.scene = isMatcha ? 'chasen_whisk' : 'totebag_cup_tilt';
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
