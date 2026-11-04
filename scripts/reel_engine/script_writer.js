#!/usr/bin/env node
/**
 * Framework Script Writer
 * - Picks the freshest (sku, pillar, hook_category) tuple from the ledger (§7.1)
 * - Asks Gemini for an ORIGINAL script following the framework (never a 1:1 copy)
 * - Validates (framework + brand guardrails + Jaccard) and retries with feedback
 * - Falls back to unused hand-authored configs in data/reels/ if no API key
 *
 * Usage: node scripts/reel_engine/script_writer.js [--sku "..."] [--category "..."] [--out path]
 */
const fs = require('fs');
const path = require('path');
const fw = require('./framework');

const { PROJECT_ROOT } = fw;
const LEDGER_PATH = path.join(PROJECT_ROOT, 'data/content_ledger.json');
const REELS_DIR = path.join(PROJECT_ROOT, 'data/reels');

function loadEnv() {
  const p = path.join(PROJECT_ROOT, '.env');
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, 'utf-8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#') || !t.includes('=')) continue;
    const [k, ...v] = t.split('=');
    if (!process.env[k.trim()]) process.env[k.trim()] = v.join('=').trim();
  }
}

function loadLedgerEntries() {
  if (!fs.existsSync(LEDGER_PATH)) return [];
  const l = JSON.parse(fs.readFileSync(LEDGER_PATH, 'utf-8'));
  return Array.isArray(l) ? l : l.entries || [];
}

function pickTuple(entries, forced = {}) {
  const reels = entries.filter((e) => (e.format || e.type) === 'reel');
  const lastSeen = (pred) => {
    for (let i = reels.length - 1; i >= 0; i--) if (pred(reels[i])) return reels.length - i;
    return 999;
  };
  const norm = (s) => String(s || '').toLowerCase();
  let best = null;
  for (const sku of forced.sku ? [forced.sku] : fw.SKUS) {
    for (const cat of forced.category ? [forced.category] : fw.HOOK_CATEGORIES) {
      for (const pillar of forced.pillar ? [forced.pillar] : fw.PILLARS) {
        const s =
          lastSeen((e) => norm(e.sku) === norm(sku)) * 3 +
          lastSeen((e) => norm(e.hook_category).startsWith(norm(cat).split(' ')[0])) * 2 +
          lastSeen((e) => norm(e.pillar) === norm(pillar)) +
          Math.random() * 0.5;
        if (!best || s > best.score) best = { sku, hook_category: cat, pillar, score: s };
      }
    }
  }
  return best;
}

function guardrailCheck(cfg) {
  try {
    const { validateContent } = require(path.join(PROJECT_ROOT, 'scripts/validate_guardrails.js'));
    const hook = `${cfg.written_hook.pre} ${cfg.written_hook.accent} ${cfg.written_hook.post}`;
    validateContent({
      script: fw.stripTags(cfg.script),
      writtenHook: hook,
      caption: cfg.caption,
      topic: cfg.topic,
      overlays: [...(cfg.beats || []).map((b) => b.card), ...(cfg.list_items || []).map((l) => l.label)],
    });
    return [];
  } catch (e) {
    const v = e.violations || [];
    return v.length ? v.map((x) => `Guardrail ${x.rule}: "${x.match}" (${x.detail})`) : [`Guardrail: ${e.message}`];
  }
}

async function callGemini(systemPrompt, userPrompt) {
  const { GoogleGenAI } = require('@google/genai');
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const models = (process.env.LIRA_WRITER_MODELS || 'gemini-3.5-flash,gemini-3-flash-preview,gemini-2.5-flash,gemini-flash-latest').split(',');
  let lastErr;
  for (let round = 0; round < 3; round++) {
    for (const model of models) {
      try {
        const res = await ai.models.generateContent({
          model,
          contents: userPrompt,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            responseSchema: fw.RESPONSE_SCHEMA,
            temperature: 1.0,
          },
        });
        return { json: JSON.parse(res.text), model };
      } catch (e) {
        lastErr = e;
        console.warn(`[Writer] ${model} failed: ${String(e.message).slice(0, 120)}`);
      }
    }
    await new Promise((r) => setTimeout(r, 8000 * (round + 1)));
  }
  throw lastErr;
}

function recentHooks(entries, n = 12) {
  return entries
    .filter((e) => (e.format || e.type) === 'reel')
    .slice(-n)
    .map((e) => e.verbal_hook || e.written_hook || e.topic)
    .filter(Boolean);
}

async function writeWithGemini(tuple, entries, catalog) {
  const system = fw.buildSystemPrompt(catalog);
  const avoid = recentHooks(entries);
  let feedback = '';
  for (let attempt = 1; attempt <= 4; attempt++) {
    const user = `Write today's reel.
SKU: ${tuple.sku} (${fw.SKU_ANGLES[tuple.sku]})
Pillar: ${tuple.pillar}
Hook category: ${tuple.hook_category}
Recent hooks to AVOID echoing (different angle, different wording):
${avoid.map((h) => `- ${h}`).join('\n')}
${feedback ? `\nYOUR PREVIOUS ATTEMPT FAILED VALIDATION. Fix every issue:\n${feedback}` : ''}`;
    const { json, model } = await callGemini(system, user);
    const cfg = { ...json, sku: tuple.sku, pillar: tuple.pillar, hook_category: tuple.hook_category, format: 'reel', writer_model: model };
    // Optional single new asset: accept the scene id for validation; generation handled downstream.
    const v = fw.validateReelConfig(cfg, { catalog, ledgerEntries: entries });
    const g = guardrailCheck(cfg);
    const errors = [...v.errors, ...g];
    console.log(`[Writer] attempt ${attempt} (${model}): ${errors.length ? `${errors.length} issue(s)` : 'PASS'} | words=${v.spokenWords} jaccard=${v.maxJaccard.toFixed(2)}`);
    if (!errors.length) return cfg;
    errors.forEach((e) => console.log(`   - ${e}`));
    feedback = errors.map((e) => `- ${e}`).join('\n');
  }
  throw new Error('Script writer could not produce a valid script after 4 attempts.');
}

function fallbackConfig(entries, catalog) {
  if (!fs.existsSync(REELS_DIR)) return null;
  const used = new Set(entries.map((e) => e.config_id).filter(Boolean));
  for (const f of fs.readdirSync(REELS_DIR).filter((x) => x.endsWith('.json')).sort()) {
    const cfg = JSON.parse(fs.readFileSync(path.join(REELS_DIR, f), 'utf-8'));
    if (used.has(cfg.id) || cfg.status === 'published') continue;
    const v = fw.validateReelConfig(cfg, { catalog, ledgerEntries: entries });
    if (v.ok && !guardrailCheck(cfg).length) return cfg;
    console.warn(`[Writer] fallback ${f} rejected: ${v.errors.join('; ')}`);
  }
  return null;
}

async function writeReel(opts = {}) {
  loadEnv();
  const catalog = fw.loadCatalog();
  const entries = loadLedgerEntries();
  let cfg = null;

  if (opts.config) {
    cfg = JSON.parse(fs.readFileSync(path.resolve(opts.config), 'utf-8'));
    const v = fw.validateReelConfig(cfg, { catalog, ledgerEntries: entries });
    const g = guardrailCheck(cfg);
    if (!v.ok || g.length) throw new Error(`Config invalid:\n${[...v.errors, ...g].join('\n')}`);
  } else if (process.env.GEMINI_API_KEY) {
    const tuple = pickTuple(entries, opts);
    console.log(`[Writer] Fresh tuple -> SKU: ${tuple.sku} | Pillar: ${tuple.pillar} | Hook: ${tuple.hook_category}`);
    cfg = await writeWithGemini(tuple, entries, catalog);
  } else {
    console.warn('[Writer] GEMINI_API_KEY missing - using unused hand-authored config bank.');
    cfg = fallbackConfig(entries, catalog);
    if (!cfg) throw new Error('No GEMINI_API_KEY and no unused valid config in data/reels/.');
  }

  if (!cfg.id) {
    const slug = `${cfg.sku}_${cfg.hook_category}`.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    cfg.id = `fw_${slug}_${Date.now()}`;
  }
  cfg.createdAt = new Date().toISOString();
  fs.mkdirSync(REELS_DIR, { recursive: true });
  const out = opts.out || path.join(REELS_DIR, `${cfg.id}.json`);
  fs.writeFileSync(out, JSON.stringify(cfg, null, 2));
  console.log(`[Writer] ✓ Reel config saved: ${out}`);
  console.log(`[Writer] Hook: ${cfg.written_hook.pre} [${cfg.written_hook.accent}] ${cfg.written_hook.post}`);
  return { cfg, path: out };
}

if (require.main === module) {
  const a = process.argv.slice(2);
  const get = (k) => (a.includes(k) ? a[a.indexOf(k) + 1] : undefined);
  writeReel({ sku: get('--sku'), category: get('--category'), pillar: get('--pillar'), out: get('--out'), config: get('--config') }).catch((e) => {
    console.error('❌', e.message);
    process.exit(1);
  });
}

module.exports = { writeReel, pickTuple };
