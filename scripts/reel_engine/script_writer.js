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
    const key = k.trim();
    const val = v.join('=').trim().replace(/[\r\n\t]/g, '');
    if (!process.env[key]) process.env[key] = val;
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

const https = require('https');

function extractJson(text) {
  if (!text) return null;
  let clean = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
  const match = clean.match(/\{[\s\S]*\}/);
  if (match) {
    try { return JSON.parse(match[0]); } catch (e) {}
  }
  try { return JSON.parse(clean); } catch (e) {}
  return null;
}

function requestOpenAICompatible(endpoint, key, model, systemPrompt, userPrompt) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint);
    const payload = JSON.stringify({
      model,
      response_format: { type: 'json_object' },
      temperature: 1.0,
      messages: [
        {
          role: 'system',
          content: systemPrompt + '\n\nIMPORTANT: Respond ONLY with a valid JSON object matching the required schema. Zero markdown wrappers, zero preamble.'
        },
        { role: 'user', content: userPrompt }
      ]
    });

    const req = https.request({
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + (url.search || ''),
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      },
      timeout: 25000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          return reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0, 180)}`));
        }
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.message?.content;
          if (!content) return reject(new Error('No content returned in choices'));
          const cleanJson = extractJson(content);
          if (!cleanJson) return reject(new Error('Failed to parse JSON from response: ' + content.slice(0, 100)));
          resolve({ json: cleanJson, model: `${model} (${url.hostname})` });
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Request timed out after 25s to ${url.hostname}`));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function requestNativeGemini(key, model, systemPrompt, userPrompt) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      systemInstruction: { parts: [{ text: systemPrompt + '\n\nIMPORTANT: Respond ONLY with a valid JSON object matching the required schema. Zero markdown wrappers, zero preamble.' }] },
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 1.0,
      }
    });

    const req = https.request({
      protocol: 'https:',
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/${model}:generateContent?key=${key}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      },
      timeout: 25000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          return reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0, 180)}`));
        }
        try {
          const parsed = JSON.parse(data);
          const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!text) return reject(new Error('No text returned in candidate parts'));
          const cleanJson = extractJson(text);
          if (!cleanJson) return reject(new Error('Failed to parse JSON from response: ' + text.slice(0, 100)));
          resolve({ json: cleanJson, model: `${model} (Google Gemini)` });
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Request timed out after 25s to Gemini ${model}`));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function getProviderCandidates() {
  const candidates = [];

  // 1. Groq (Ultra-fast LPU hardware, ~1,000 RPD free tier)
  const groqKey = (process.env.GROQ_API_KEY || '').trim();
  if (groqKey) {
    candidates.push(
      { name: 'Groq (qwen3.8-27b)', endpoint: 'https://api.groq.com/openai/v1/chat/completions', key: groqKey, model: 'qwen/qwen3.8-27b' },
      { name: 'Groq (gpt-oss-120b)', endpoint: 'https://api.groq.com/openai/v1/chat/completions', key: groqKey, model: 'openai/gpt-oss-120b' },
      { name: 'Groq (gpt-oss-20b)', endpoint: 'https://api.groq.com/openai/v1/chat/completions', key: groqKey, model: 'openai/gpt-oss-20b' }
    );
  }

  // 2. OpenRouter (Free frontier open-weight models)
  const openRouterKey = (process.env.OPENROUTER_API_KEY || '').trim();
  if (openRouterKey) {
    candidates.push(
      { name: 'OpenRouter (llama-3.3-70b:free)', endpoint: 'https://openrouter.ai/api/v1/chat/completions', key: openRouterKey, model: 'meta-llama/llama-3.3-70b-instruct:free' },
      { name: 'OpenRouter (gemini-2.0-flash:free)', endpoint: 'https://openrouter.ai/api/v1/chat/completions', key: openRouterKey, model: 'google/gemini-2.0-flash-exp:free' },
      { name: 'OpenRouter (qwen-2.5-72b:free)', endpoint: 'https://openrouter.ai/api/v1/chat/completions', key: openRouterKey, model: 'qwen/qwen-2.5-72b-instruct:free' }
    );
  }

  // 3. Mistral AI (Free mode)
  const mistralKey = (process.env.MISTRAL_API_KEY || '').trim();
  if (mistralKey) {
    candidates.push(
      { name: 'Mistral (mistral-small-2603)', endpoint: 'https://api.mistral.ai/v1/chat/completions', key: mistralKey, model: 'mistral-small-2603' },
      { name: 'Mistral (ministral-8b-2512)', endpoint: 'https://api.mistral.ai/v1/chat/completions', key: mistralKey, model: 'ministral-8b-2512' }
    );
  }

  // 4. Google Gemini (Active Fast Free Tier Models via Native REST API)
  const geminiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (geminiKey) {
    candidates.push(
      { name: 'Gemini (3.1-flash-lite)', nativeGemini: true, key: geminiKey, model: 'gemini-3.1-flash-lite' },
      { name: 'Gemini (3.5-flash-lite)', nativeGemini: true, key: geminiKey, model: 'gemini-3.5-flash-lite' },
      { name: 'Gemini (3.6-flash)', nativeGemini: true, key: geminiKey, model: 'gemini-3.6-flash' }
    );
  }

  // 5. Kilo Code (Zero Key / Anonymous Free Tier: 200 req/hr, never blocked)
  const kiloKey = (process.env.KILO_API_KEY || 'anonymous').trim();
  candidates.push(
    { name: 'Kilo Code (nemotron-3.5-lightning:free)', endpoint: 'https://api.kilo.ai/api/gateway/chat/completions', key: kiloKey, model: 'nvidia/nemotron-3.5-lightning:free' },
    { name: 'Kilo Code (kilo-auto:free)', endpoint: 'https://api.kilo.ai/api/gateway/chat/completions', key: kiloKey, model: 'kilo-auto/free' }
  );

  return candidates;
}

async function callFreeLLM(systemPrompt, userPrompt) {
  const candidates = getProviderCandidates();
  let lastErr = null;

  for (let round = 0; round < 2; round++) {
    for (const cand of candidates) {
      try {
        console.log(`[Writer] Querying ${cand.name}...`);
        const res = cand.nativeGemini
          ? await requestNativeGemini(cand.key, cand.model, systemPrompt, userPrompt)
          : await requestOpenAICompatible(cand.endpoint, cand.key, cand.model, systemPrompt, userPrompt);
        return res;
      } catch (e) {
        lastErr = e;
        console.warn(`[Writer] ${cand.name} failed: ${String(e.message).slice(0, 100)}`);
      }
    }
    if (round === 0) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  throw lastErr || new Error('All Free LLM providers failed.');
}

function recentHooks(entries, n = 12) {
  return entries
    .filter((e) => (e.format || e.type) === 'reel')
    .slice(-n)
    .map((e) => e.verbal_hook || e.written_hook || e.topic)
    .filter(Boolean);
}

async function writeWithFreeLLM(tuple, entries, catalog) {
  const system = fw.buildSystemPrompt(catalog);
  const avoid = recentHooks(entries);
  let feedback = '';
  for (let attempt = 1; attempt <= 4; attempt++) {
    const user = `Write today's reel following the 8-stage retention format:
Hook -> Lead -> Body 1 -> Open Loop -> Body 2 -> Open loop -> Body 3 -> CTA
SKU: ${tuple.sku} (${fw.SKU_ANGLES[tuple.sku]})
Pillar: ${tuple.pillar}
Hook category: ${tuple.hook_category}
Beats required (8):
- b1_hook: Hook (0-3s scroll-stopping pattern interrupt / somatic pain)
- b2_lead: Lead (3-6s context bridge / why ordinary drinks fail)
- b3_body1: Body 1 (6-11s Point 1 problem agitation)
- b4_loop1: Open Loop 1 (11-14s curiosity gap teasing Point 2)
- b5_body2: Body 2 (14-20s Point 2 physical proof / 180° sealed bottle)
- b6_loop2: Open Loop 2 (20-23s second curiosity gap teasing Point 3)
- b7_body3: Body 3 (23-27s Point 3 formulation / 100% stevia zero crash)
- b8_cta: CTA (27-31s conversion to bio link)
Recent hooks to AVOID echoing (different angle, different wording):
${avoid.map((h) => `- ${h}`).join('\n')}
${feedback ? `\nYOUR PREVIOUS ATTEMPT FAILED VALIDATION. Fix every issue:\n${feedback}` : ''}`;
    const { json, model } = await callFreeLLM(system, user);
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
  } else {
    const tuple = pickTuple(entries, opts);
    console.log(`[Writer] Fresh tuple -> SKU: ${tuple.sku} | Pillar: ${tuple.pillar} | Hook: ${tuple.hook_category}`);
    try {
      cfg = await writeWithFreeLLM(tuple, entries, catalog);
    } catch (e) {
      console.warn(`[Writer] Free LLM generation failed: ${e.message}. Attempting fallback bank...`);
      cfg = fallbackConfig(entries, catalog);
      if (!cfg) throw e;
    }
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
