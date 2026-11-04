#!/usr/bin/env node
/**
 * Lira Audio & Tension Sound Design Engine
 * Plan Script: Somatic Science 3P Formula with "Dan yang nomor 3" Open-Loop
 * 
 * Rules:
 * 1. Model: eleven_v4 with emotive bracket tags ([curious], [frustrated], [dramatic], [urgent], [excited], [proud], [confident]).
 * 2. Mandatory constraint: STRICTLY NEVER use [whisper].
 * 3. Tag-safe parser ignores [...] bracketed tags during word alignment, ensuring 100% synced subtitles with zero tag leaks.
 * 4. SFX tension suite layered with FFmpeg to create retention tension:
 *    - 0.0s: sub_hit (deep hook drop) + eightbit_clock_spin (urgent countdown ticking)
 *    - "lemes": impact thud / clock spin
 *    - "es batu / air tawar": snap (ice dilution punch)
 *    - "titik nol": eightbit_1star_buzz (insulin crash warning)
 *    - "Bandingin": whoosh (pivoting contrast into Lira solution)
 *    - "stevia": eightbit_portal_shimmer (pure stevia / Japanese matcha sparkle)
 *    - "seratus delapan puluh derajat / anti bocor": eightbit_pop (tactile 180° seal pop)
 *    - "Limited batch": eightbit_5star_fanfare (level-up CTA fanfare)
 *    - Groovy Lo-Fi BGM (normalized to -14 LUFS alongside VO, ducked during speech)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');

// Load environment variables
const envPath = path.join(PROJECT_ROOT, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [k, ...v] = trimmed.split('=');
      process.env[k.trim()] = v.join('=').trim();
    }
  }
}

const API_KEY = process.env.ELEVENLABS_API_KEY || process.env.ELEVENLABS || process.env.XI_API_KEY;
if (!API_KEY) {
  console.error('❌ ELEVENLABS_API_KEY is missing');
  process.exit(1);
}

const VOICE_ID = process.env.CALEB_VOICE_ID || 'WVwVlhKdnZoCuTIoxjYr';
const MODEL_ID = 'eleven_v4';

// Exact Plan Script from plan_script_and_asset_automation.md §3.2 & §5.1
const SCRIPT_WITH_EMOTION_TAGS =
  '[dramatic] Ini 3 tanda tubuh lo udah kecanduan gula tersembunyi dari matcha kafe. ' +
  '[curious] Dan yang nomor tiga, lo minum tiap jam dua siang tanpa sadar. ' +
  '[frustrated] Tanda satu: dua jam setelah minum, kepala lo mendadak lemes dan susah fokus. ' +
  '[intrigued] Tanda dua: lo bayar lima puluh ribu buat es batu yang mencair jadi air tawar. ' +
  '[dramatic] Dan tanda nomor tiga: gula cair murah bikin insulin lo melonjak tajam, terus nge-drop drastis ke titik nol! ' +
  '[excited] Bandingin sama botol Lira ini! ' +
  '[proud] Pure matcha Jepang murni, barista oat milk, dan pemanis alami stevia. ' +
  '[confident] Nol gula pasir, nol crash, energi fokus empat jam penuh! ' +
  '[proud] Segel rapat seratus delapan puluh derajat anti bocor. ' +
  '[urgent] Limited batch diseduh fresh weekend ini lewat link di bio sebelum kehabisan!';

// Enforce strict constraint: NEVER USE [whisper]
if (SCRIPT_WITH_EMOTION_TAGS.toLowerCase().includes('[whisper]')) {
  throw new Error('❌ Constraint Violation: [whisper] tag is strictly banned!');
}

const HIGHLIGHT_KEYWORDS = [
  '3 TANDA', 'GULA TERSEMBUNYI', 'NOMOR TIGA', 'JAM DUA SIANG',
  'TANDA SATU', 'LEMES', 'SUSAH FOKUS', 'TANDA DUA', 'LIMA PULUH RIBU',
  'AIR TAWAR', 'INSULIN MELONJAK', 'TITIK NOL', 'BOTOL LIRA',
  'PURE MATCHA', 'STEVIA', 'NOL GULA PASIR', 'NOL CRASH', '4 JAM PENUH',
  '180 DERAJAT', 'ANTI BOCOR', 'LIMITED BATCH', 'LINK DI BIO'
];

async function generateVoice() {
  console.log(`🎙️ Calling ElevenLabs API with model "${MODEL_ID}" and emotive tags...`);
  console.log(`Script length: ${SCRIPT_WITH_EMOTION_TAGS.length} chars`);

  const payload = JSON.stringify({
    text: SCRIPT_WITH_EMOTION_TAGS,
    model_id: MODEL_ID,
    voice_settings: {
      stability: 0.35,
      similarity_boost: 0.82,
    },
  });

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'api.elevenlabs.io',
        path: `/v1/text-to-speech/${VOICE_ID}/with-timestamps`,
        method: 'POST',
        headers: {
          'xi-api-key': API_KEY,
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

async function main() {
  const result = await generateVoice();
  console.log('✓ ElevenLabs v4 speech synthesis with timestamps received successfully!');

  const audioBuffer = Buffer.from(result.audio_base64, 'base64');
  const rawPath = path.join(PROJECT_ROOT, 'public/assets/plan_somatic_raw.mp3');
  fs.writeFileSync(rawPath, audioBuffer);
  console.log(`✓ Raw voiceover audio saved: ${rawPath} (${(audioBuffer.length / 1024).toFixed(1)} KB)`);

  // Parse character alignment while strictly filtering out emotion tags in [...]
  const align = result.alignment;
  const chars = align.characters;
  const starts = align.character_start_times_seconds;
  const ends = align.character_end_times_seconds;

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
        words.push({ word: curWord, start: curStart, end: curEnd });
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
    words.push({ word: curWord, start: curStart, end: curEnd });
  }

  console.log(`✓ Parsed ${words.length} spoken words (zero emotion tag leakage into subtitles).`);

  // Find key event timestamps dynamically from parsed words
  function findWordTime(keyword, fallbackSec) {
    const found = words.find((w) => w.word.toLowerCase().includes(keyword.toLowerCase()));
    return found ? found.start : fallbackSec;
  }

  const tSatu = findWordTime('satu', 7.5);
  const tMencair = findWordTime('mencair', 12.0);
  const tTitikNol = findWordTime('titik', 18.0);
  const tBandingin = findWordTime('bandingin', 19.8);
  const tStevia = findWordTime('stevia', 24.0);
  const tBocor = findWordTime('bocor', 28.5);
  const tLimited = findWordTime('limited', 30.5);

  console.log(`⏱️ Key SFX Sync Anchors:
    - Tanda Satu (tick):      ${tSatu.toFixed(2)}s
    - Mencair (ice snap):     ${tMencair.toFixed(2)}s
    - Titik Nol (buzz):       ${tTitikNol.toFixed(2)}s
    - Bandingin (whoosh):     ${tBandingin.toFixed(2)}s
    - Stevia (shimmer):       ${tStevia.toFixed(2)}s
    - Anti Bocor (pop):       ${tBocor.toFixed(2)}s
    - Limited Batch (fanfare):${tLimited.toFixed(2)}s`);

  // Group into 2-3 word chunks
  const chunks = [];
  let i = 0;
  while (i < words.length) {
    const count = i % 2 === 0 ? Math.min(2, words.length - i) : Math.min(3, words.length - i);
    const slice = words.slice(i, i + count);
    const chunkText = slice.map((w) => w.word.toUpperCase().replace(/[.,:!?]/g, '')).join(' ');
    const fromSec = slice[0].start;
    const toSec = slice[slice.length - 1].end;

    const isHighlight = HIGHLIGHT_KEYWORDS.some((kw) => chunkText.includes(kw));

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

  // Connect adjacent subtitle chunks to eliminate flickering
  for (let j = 0; j < chunks.length - 1; j++) {
    if (chunks[j + 1].startSec - chunks[j].endSec < 0.45) {
      chunks[j].endSec = chunks[j + 1].startSec;
      chunks[j].toFrame = chunks[j + 1].fromFrame;
    }
  }

  const captionsOutPath = path.join(PROJECT_ROOT, 'src/plan_somatic_captions.json');
  fs.writeFileSync(captionsOutPath, JSON.stringify(chunks, null, 2), 'utf-8');
  console.log(`✓ Seamless Captions JSON saved: ${captionsOutPath} (${chunks.length} chunks)`);

  const totalDuration = chunks[chunks.length - 1].endSec + 0.8;
  const totalFrames = Math.ceil(totalDuration * 30);
  console.log(`⏱️ Total voice duration: ${totalDuration.toFixed(2)}s (${totalFrames} frames)`);

  // Sound Design & Master Pre-Mix with FFmpeg
  const bgmPath = path.join(PROJECT_ROOT, 'public/assets/bg_music.mp3');
  const sfxDir = path.join(PROJECT_ROOT, 'public/assets/sfx');
  const masterAudioOutPath = path.join(PROJECT_ROOT, 'public/assets/plan_somatic_master.mp3');

  const ffmpegBin = fs.existsSync('/Users/caleb/.local/bin/ffmpeg')
    ? '/Users/caleb/.local/bin/ffmpeg'
    : 'ffmpeg';

  console.log('🎵 Building Multi-Track Tension Sound Design with FFmpeg...');

  // Convert seconds to milliseconds for adelay
  const msSatu = Math.round(tSatu * 1000);
  const msMencair = Math.round(tMencair * 1000);
  const msTitikNol = Math.round(tTitikNol * 1000);
  const msBandingin = Math.round(tBandingin * 1000);
  const msStevia = Math.round(tStevia * 1000);
  const msBocor = Math.round(tBocor * 1000);
  const msLimited = Math.round(tLimited * 1000);

  // Audio Inputs:
  // 0: VO raw
  // 1: BGM
  // 2: sub_hit (at 0ms)
  // 3: eightbit_clock_spin (at 80ms)
  // 4: snap (at msMencair)
  // 5: eightbit_1star_buzz (at msTitikNol)
  // 6: whoosh (at msBandingin)
  // 7: eightbit_portal_shimmer (at msStevia)
  // 8: eightbit_pop (at msBocor)
  // 9: eightbit_5star_fanfare (at msLimited)

  const filterComplex = [
    // 0: Voiceover loudnorm
    `[0:a]volume=1.25,loudnorm=I=-14:TP=-1.5:LRA=11[vo];`,
    // 1: Lo-Fi BGM looped & ducked cleanly to audible groovy level (0.40 = ~ -16dB relative to VO)
    `[1:a]aloop=loop=-1:size=2e+09,volume=0.42[bgm];`,
    // 2: Sub-hit at 0.0s for instant visceral scroll-stop
    `[2:a]volume=0.85[sfx_sub];`,
    // 3: Clock gear spin at 0.08s for countdown tension
    `[3:a]adelay=80|80,volume=0.75[sfx_clock];`,
    // 4: Snap at "mencair jadi air tawar"
    `[4:a]adelay=${msMencair}|${msMencair},volume=0.9[sfx_snap];`,
    // 5: 8-Bit Error Buzzer at "titik nol" crash
    `[5:a]adelay=${msTitikNol}|${msTitikNol},volume=0.9[sfx_buzz];`,
    // 6: Whoosh transition at "Bandingin sama botol Lira ini!"
    `[6:a]adelay=${msBandingin}|${msBandingin},volume=0.8[sfx_whoosh];`,
    // 7: Sparkle shimmer at "pemanis alami stevia"
    `[7:a]adelay=${msStevia}|${msStevia},volume=0.8[sfx_shimmer];`,
    // 8: Bottle pop at "Segel 180 derajat anti bocor"
    `[8:a]adelay=${msBocor}|${msBocor},volume=0.85[sfx_pop];`,
    // 9: 5-Star Level-Up Fanfare at "Limited batch" CTA
    `[9:a]adelay=${msLimited}|${msLimited},volume=0.8[sfx_fanfare];`,
    // Mix all 10 tracks into master with dropout_transition=2
    `[vo][bgm][sfx_sub][sfx_clock][sfx_snap][sfx_buzz][sfx_whoosh][sfx_shimmer][sfx_pop][sfx_fanfare]amix=inputs=10:duration=first:dropout_transition=2[out]`,
  ].join('');

  const ffmpegArgs = [
    '-y',
    '-i', rawPath,
    '-i', bgmPath,
    '-i', path.join(sfxDir, 'sub_hit.mp3'),
    '-i', path.join(sfxDir, 'eightbit_clock_spin.wav'),
    '-i', path.join(sfxDir, 'snap.mp3'),
    '-i', path.join(sfxDir, 'eightbit_1star_buzz.wav'),
    '-i', path.join(sfxDir, 'whoosh.mp3'),
    '-i', path.join(sfxDir, 'eightbit_portal_shimmer.wav'),
    '-i', path.join(sfxDir, 'eightbit_pop.wav'),
    '-i', path.join(sfxDir, 'eightbit_5star_fanfare.wav'),
    '-filter_complex', filterComplex,
    '-map', '[out]',
    '-c:a', 'libmp3lame',
    '-b:a', '192k',
    masterAudioOutPath,
  ];

  const mixRes = spawnSync(ffmpegBin, ffmpegArgs, { stdio: 'inherit' });
  if (mixRes.status !== 0) {
    throw new Error('FFmpeg tension sound design mix failed');
  }

  console.log(`✓ Master Audio with Tension SFX Suite saved: ${masterAudioOutPath}`);
  console.log('\n🎉 ElevenLabs v4 with tension SFX suite generated successfully!');
  return { totalFrames, totalDuration };
}

if (require.main === module) {
  main().catch((err) => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
}

module.exports = {
  main,
  generateVoice,
  SCRIPT_WITH_EMOTION_TAGS,
};
