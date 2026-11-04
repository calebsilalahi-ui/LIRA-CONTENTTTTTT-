#!/usr/bin/env node
/**
 * Lira Framework Audio Engine
 * Takes any framework-compliant reel config JSON, generates:
 * 1. ElevenLabs v4 speech with emotion tags (strictly NO [whisper])
 * 2. Tag-filtered word-accurate timestamps and synchronized 2-3 word captions
 * 3. Dynamic beat frame alignment and list-item appearance frames
 * 4. Multi-track tension sound design pre-mix with FFmpeg (VO + BGM ducked + SFX) at -14 LUFS
 * 5. Complete composition manifest JSON for Remotion FrameworkReel
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const fw = require('./framework');

const { PROJECT_ROOT } = fw;

function parseEnvBlock(str) {
  if (!str || !str.includes('=')) return;
  for (const line of str.split(/[\r\n]+/)) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [k, ...v] = trimmed.split('=');
      const key = k.trim();
      const val = v.join('=').trim().replace(/[\r\n\t]/g, '');
      if (val && (!process.env[key] || process.env[key].includes('='))) {
        process.env[key] = val;
      }
    }
  }
}

function resolveVoiceId(voiceId) {
  const clean = String(voiceId || '').trim().replace(/[\r\n\t]/g, '');
  if (/^[a-zA-Z0-9_-]{15,30}$/.test(clean)) {
    return clean;
  }
  return 'WVwVlhKdnZoCuTIoxjYr';
}

function loadEnv() {
  const p = path.join(PROJECT_ROOT, '.env');
  if (fs.existsSync(p)) {
    parseEnvBlock(fs.readFileSync(p, 'utf-8'));
  }
  parseEnvBlock(process.env.CALEB);
  parseEnvBlock(process.env.CALEB_SECRET);
}

async function callElevenLabsTTS(text, voiceId, apiKey) {
  const cleanVoiceId = resolveVoiceId(voiceId);
  const cleanApiKey = String(apiKey || '').trim().replace(/[\r\n\t]/g, '');
  const payload = JSON.stringify({
    text,
    model_id: 'eleven_v4',
    voice_settings: {
      stability: 0.35,
      similarity_boost: 0.82,
    },
  });

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'api.elevenlabs.io',
        path: `/v1/text-to-speech/${cleanVoiceId}/with-timestamps`,
        method: 'POST',
        headers: {
          'xi-api-key': cleanApiKey,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          if (res.statusCode !== 200) {
            return reject(new Error(`ElevenLabs API HTTP ${res.statusCode}: ${data}`));
          }
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      }
    );
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function parseWordAlignment(alignment) {
  const chars = alignment.characters;
  const starts = alignment.character_start_times_seconds;
  const ends = alignment.character_end_times_seconds;

  const words = [];
  let curWord = '';
  let curStart = null;
  let curEnd = null;
  let inTag = false;

  for (let idx = 0; idx < chars.length; idx++) {
    const ch = chars[idx];
    if (ch === '[') {
      inTag = true;
      continue;
    }
    if (ch === ']') {
      inTag = false;
      continue;
    }
    if (inTag) continue;

    if (/\s/.test(ch)) {
      if (curWord.length > 0) {
        words.push({
          word: curWord,
          cleanWord: curWord.toLowerCase().replace(/[^a-z0-9]/g, ''),
          start: curStart,
          end: curEnd,
        });
        curWord = '';
        curStart = null;
        curEnd = null;
      }
    } else {
      if (curStart === null) curStart = starts[idx];
      curEnd = ends[idx];
      curWord += ch;
    }
  }
  if (curWord.length > 0) {
    words.push({
      word: curWord,
      cleanWord: curWord.toLowerCase().replace(/[^a-z0-9]/g, ''),
      start: curStart,
      end: curEnd,
    });
  }
  return words;
}

function findWordIndex(words, keyword, fromIndex = 0) {
  if (!keyword) return -1;
  const clean = String(keyword).toLowerCase().replace(/[^a-z0-9]/g, '');
  for (let i = fromIndex; i < words.length; i++) {
    if (words[i].cleanWord === clean || words[i].cleanWord.includes(clean)) {
      return i;
    }
  }
  return -1;
}

function buildCaptions(words, highlightKeywords = []) {
  const cleanKeywords = highlightKeywords.map((k) =>
    k.toUpperCase().replace(/[.,:!?]/g, '').trim()
  );

  const chunks = [];
  let i = 0;
  while (i < words.length) {
    const count = i % 2 === 0 ? Math.min(2, words.length - i) : Math.min(3, words.length - i);
    const slice = words.slice(i, i + count);
    const chunkText = slice.map((w) => w.word.toUpperCase().replace(/[.,:!?]/g, '')).join(' ');
    const fromSec = slice[0].start;
    const toSec = slice[slice.length - 1].end;

    const isHighlight = cleanKeywords.some(
      (kw) => chunkText.includes(kw) || kw.includes(chunkText)
    );

    chunks.push({
      text: chunkText,
      highlight: isHighlight,
      startSec: Number(fromSec.toFixed(3)),
      endSec: Number(toSec.toFixed(3)),
      fromFrame: Math.floor(fromSec * 30),
      toFrame: Math.ceil(toSec * 30),
    });
    i += count;
  }

  // Smooth adjacent chunks
  for (let j = 0; j < chunks.length - 1; j++) {
    if (chunks[j + 1].startSec - chunks[j].endSec < 0.45) {
      chunks[j].endSec = chunks[j + 1].startSec;
      chunks[j].toFrame = chunks[j + 1].fromFrame;
    }
  }

  // Saccadic decoupling: suppress lower subtitles until ~1.33s (frame 40)
  return chunks.filter((c) => c.fromFrame >= 38 || c.startSec >= 1.25);
}

async function buildReelAudio(cfg, opts = {}) {
  loadEnv();
  const apiKey = (process.env.ELEVENLABS_API_KEY || process.env.ELEVENLABS || process.env.XI_API_KEY || '').trim().replace(/[\r\n\t]/g, '');
  if (!apiKey) {
    throw new Error('❌ ELEVENLABS_API_KEY is missing from environment.');
  }
  const voiceId = resolveVoiceId(process.env.CALEB_VOICE_ID || process.env.CALEB);

  if (/\[\s*whisper/i.test(cfg.script) || /whisper/i.test(cfg.script)) {
    throw new Error('❌ Banned tag: [whisper] is strictly prohibited by plan §3.1');
  }

  const outDir = path.join(PROJECT_ROOT, 'public/assets/generated_reels');
  fs.mkdirSync(outDir, { recursive: true });

  const rawPath = path.join(outDir, `${cfg.id}_raw.mp3`);
  const masterPath = path.join(outDir, `${cfg.id}_master.mp3`);
  const manifestPath = path.join(outDir, `${cfg.id}_manifest.json`);

  console.log(`[AudioEngine] Synthesizing speech with ElevenLabs v4 (${voiceId})...`);
  const result = await callElevenLabsTTS(cfg.script, voiceId, apiKey);
  const audioBuf = Buffer.from(result.audio_base64, 'base64');
  fs.writeFileSync(rawPath, audioBuf);
  console.log(`[AudioEngine] ✓ Raw audio saved: ${rawPath} (${(audioBuf.length / 1024).toFixed(1)} KB)`);

  const words = parseWordAlignment(result.alignment);
  console.log(`[AudioEngine] ✓ Parsed ${words.length} spoken words with exact timestamps.`);

  // Map beat transition frames
  const beatFrames = { b1_hook: 0 };
  let currentWordIdx = 0;
  for (let b = 1; b < cfg.beats.length; b++) {
    const beat = cfg.beats[b];
    const idx = findWordIndex(words, beat.anchor, currentWordIdx);
    if (idx !== -1) {
      beatFrames[beat.id] = Math.max(0, Math.floor(words[idx].start * 30));
      currentWordIdx = idx + 1;
    } else {
      // Proportional fallback based on beat target
      const fbSec = fw.BEATS[b].target[0];
      beatFrames[beat.id] = Math.floor(fbSec * 30);
    }
  }

  // Map open-loop list items appearance frames
  const listFrames = {};
  if (Array.isArray(cfg.list_items)) {
    cfg.list_items.forEach((item, idx) => {
      const wIdx = findWordIndex(words, item.anchor, 0);
      const key = `item_${idx + 1}`;
      if (wIdx !== -1) {
        listFrames[key] = Math.floor(words[wIdx].start * 30);
      } else {
        listFrames[key] = beatFrames.b2_agitation + idx * 45;
      }
    });
  }

  // Build captions
  const captions = buildCaptions(words, cfg.highlight_keywords || []);
  const voiceDurationSec = captions[captions.length - 1].endSec + 0.8;
  const totalFrames = Math.ceil(voiceDurationSec * 30);

  console.log(`[AudioEngine] Beat Frames:`, beatFrames);
  console.log(`[AudioEngine] Total frames: ${totalFrames} (${voiceDurationSec.toFixed(2)}s)`);

  // Build multi-track audio mix with FFmpeg
  const bgmPath = path.join(PROJECT_ROOT, 'public/assets/bg_music.mp3');
  const sfxDir = path.join(PROJECT_ROOT, 'public/assets/sfx');
  const ffmpegBin = fs.existsSync('/Users/caleb/.local/bin/ffmpeg')
    ? '/Users/caleb/.local/bin/ffmpeg'
    : 'ffmpeg';

  // Build SFX inputs and filters
  const inputs = ['-y', '-i', rawPath, '-i', bgmPath];
  let filterParts = [
    `[0:a]volume=1.25,loudnorm=I=-14:TP=-1.5:LRA=11[vo];`,
    `[1:a]aloop=loop=-1:size=2e+09,volume=0.42[bgm];`,
  ];
  const mixLabels = ['[vo]', '[bgm]'];

  let sfxIdx = 2;
  const resolvedSFX = [];

  for (const sfx of cfg.sfx || []) {
    const sfxFile = path.join(sfxDir, sfx.file);
    if (!fs.existsSync(sfxFile)) continue;

    let delayMs = 0;
    if (typeof sfx.at === 'number') {
      delayMs = Math.round(sfx.at * 1000);
    } else if (sfx.anchor) {
      const idx = findWordIndex(words, sfx.anchor, 0);
      if (idx !== -1) {
        delayMs = Math.round(words[idx].start * 1000);
      }
    }

    inputs.push('-i', sfxFile);
    const label = `[sfx_${sfxIdx}]`;
    const vol = typeof sfx.vol === 'number' ? sfx.vol : 0.8;
    if (delayMs > 0) {
      filterParts.push(`[${sfxIdx}:a]adelay=${delayMs}|${delayMs},volume=${vol}${label};`);
    } else {
      filterParts.push(`[${sfxIdx}:a]volume=${vol}${label};`);
    }
    mixLabels.push(label);
    resolvedSFX.push({ file: sfx.file, delayMs, volume: vol });
    sfxIdx++;
  }

  const mixCount = mixLabels.length;
  filterParts.push(`${mixLabels.join('')}amix=inputs=${mixCount}:duration=first:dropout_transition=2:normalize=0[mixed];[mixed]loudnorm=I=-14:TP=-1.5:LRA=11[out]`);

  const ffmpegArgs = [
    ...inputs,
    '-filter_complex', filterParts.join(''),
    '-map', '[out]',
    '-c:a', 'libmp3lame',
    '-b:a', '192k',
    masterPath,
  ];

  console.log(`[AudioEngine] Mixing ${mixCount} audio tracks with FFmpeg...`);
  const mixRes = spawnSync(ffmpegBin, ffmpegArgs, { stdio: 'inherit' });
  if (mixRes.status !== 0 || !fs.existsSync(masterPath)) {
    throw new Error(`FFmpeg audio mix failed (status: ${mixRes.status})`);
  }
  console.log(`[AudioEngine] ✓ Master audio saved: ${masterPath}`);

  // Create Manifest for FrameworkReel
  const manifest = {
    id: cfg.id,
    sku: cfg.sku,
    pillar: cfg.pillar,
    hook_category: cfg.hook_category,
    topic: cfg.topic,
    threeP: cfg.threeP,
    written_hook: cfg.written_hook,
    audioMaster: `assets/generated_reels/${cfg.id}_master.mp3`,
    totalFrames,
    totalDurationSec: Number(voiceDurationSec.toFixed(2)),
    beatFrames,
    listFrames,
    captions,
    beats: cfg.beats,
    list_items: cfg.list_items,
    highlight_keywords: cfg.highlight_keywords,
    resolvedSFX,
    caption: cfg.caption,
    createdAt: new Date().toISOString(),
  };

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`[AudioEngine] ✓ Manifest saved: ${manifestPath}`);

  // Also write active manifest for Remotion root
  const activeManifestPath = path.join(PROJECT_ROOT, 'src/active_reel_manifest.json');
  fs.writeFileSync(activeManifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`[AudioEngine] ✓ Synced active manifest to src/active_reel_manifest.json`);

  return manifest;
}

if (require.main === module) {
  const cfgPath = process.argv[2];
  if (!cfgPath || !fs.existsSync(cfgPath)) {
    console.error('Usage: node scripts/reel_engine/audio_engine.js <path-to-reel-config.json>');
    process.exit(1);
  }
  const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf-8'));
  buildReelAudio(cfg).catch((e) => {
    console.error('❌ AudioEngine Error:', e.message || e);
    process.exit(1);
  });
}

module.exports = { buildReelAudio, buildCaptions, parseWordAlignment };
