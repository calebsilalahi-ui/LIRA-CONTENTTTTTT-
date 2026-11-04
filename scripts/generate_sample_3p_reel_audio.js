#!/usr/bin/env node
/**
 * GENERATE 3P SOMATIC SCIENCE REEL VOICEOVER & ALIGNMENT
 * ID: sample_3p_somatic_reel
 * Voice: Caleb clone (WVwVlhKdnZoCuTIoxjYr) via eleven_v4 /with-timestamps
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// Auto-load .env
const envPath = path.join(__dirname, '../.env');
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
  console.error('❌ ELEVENLABS_API_KEY (or ELEVENLABS) is required in .env or environment');
  process.exit(1);
}

const VOICE_ID = 'WVwVlhKdnZoCuTIoxjYr'; // Caleb clone
const MODEL_ID = 'eleven_v4';

const REEL = {
  id: 'sample_3p_somatic_reel',
  title: '3 Tanda Gula Kafe Merusak Fokus Lo',
  script:
    "[curious] Ini 3 tanda tubuh lo udah kecanduan gula tersembunyi dari matcha kafe lima puluh ribu. " +
    "[whispering] Dan yang nomor tiga, lo minum tiap jam dua siang tanpa sadar. " +
    "[frustrated] Pas jam dua siang kepala lo mendadak lemes dan berat, itu bukan karena kurang tidur, tapi insulin lo nge-drop ke titik nol. " +
    "[proud] Bandingin sama botol Lira ini: pure matcha Jepang dan barista oat milk tanpa gula pasir, nol glikemik. " +
    "[confident] Segel rapat seratus delapan puluh derajat, dingin tahan tujuh hari. " +
    "[urgent] Limited batch diseduh fresh weekend ini lewat link di bio sebelum kehabisan!",
  highlightKeywords: [
    '3 TANDA', 'KECANDUAN GULA', 'MATCHA KAFE', 'LIMA PULUH RIBU',
    'NOMOR TIGA', 'JAM DUA SIANG', 'TANPA SADAR', 'KEPALA LEMES',
    'INSULIN DROP', 'BOTOL LIRA', 'PURE MATCHA', 'BARISTA OAT MILK',
    'NOL GULA PASIR', 'NOL GLIKEMIK', '180 DERAJAT', 'DINGIN 7 HARI',
    'LIMITED BATCH', 'LINK DI BIO'
  ]
};

function generateWithAlignment(reel) {
  console.log(`🎙️ Generating 3P Voiceover for: "${reel.title}"...`);
  const payload = JSON.stringify({
    text: reel.script,
    model_id: MODEL_ID,
    voice_settings: {
      stability: 0.50,
      similarity_boost: 0.85
    }
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.elevenlabs.io',
      path: `/v1/text-to-speech/${VOICE_ID}/with-timestamps`,
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`ElevenLabs API HTTP ${res.statusCode}: ${data}`));
          return;
        }
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function processAlignment(result, reel) {
  const audioBuffer = Buffer.from(result.audio_base64, 'base64');
  const rawAudioOutPath = path.join(__dirname, `../public/assets/${reel.id}_raw.mp3`);
  const normalizedAudioOutPath = path.join(__dirname, `../public/assets/${reel.id}.mp3`);
  fs.writeFileSync(rawAudioOutPath, audioBuffer);
  console.log(`✓ Raw Audio saved: ${rawAudioOutPath} (${audioBuffer.length} bytes)`);

  // Normalize audio loudness with FFmpeg to -14 LUFS
  const ffmpegBin = fs.existsSync('/Users/caleb/.local/bin/ffmpeg') ? '/Users/caleb/.local/bin/ffmpeg' : 'ffmpeg';
  const ffmpegRes = spawnSync(ffmpegBin, [
    '-y', '-i', rawAudioOutPath,
    '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11',
    '-c:a', 'libmp3lame', '-b:a', '192k',
    normalizedAudioOutPath
  ], { stdio: 'inherit' });

  if (ffmpegRes.status === 0) {
    console.log(`✓ Loudnorm audio normalized to -14 LUFS: ${normalizedAudioOutPath}`);
  } else {
    fs.copyFileSync(rawAudioOutPath, normalizedAudioOutPath);
    console.warn(`⚠️ Loudnorm failed, using raw audio copy.`);
  }

  const chars = result.alignment.characters;
  const starts = result.alignment.character_start_times_seconds;
  const ends = result.alignment.character_end_times_seconds;

  const rawWords = [];
  let curWord = '';
  let wordStart = null;
  let wordEnd = null;

  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    if (/\s/.test(c)) {
      if (curWord) {
        rawWords.push({ word: curWord, start: wordStart, end: wordEnd });
        curWord = '';
        wordStart = null;
        wordEnd = null;
      }
    } else {
      if (wordStart === null) wordStart = starts[i];
      wordEnd = ends[i];
      curWord += c;
    }
  }
  if (curWord) {
    rawWords.push({ word: curWord, start: wordStart, end: wordEnd });
  }

  // Filter out emotion brackets like [curious], [whispering], etc.
  const words = rawWords.filter(w => !/^\[.*\]$/.test(w.word));

  const chunks = [];
  let i = 0;
  while (i < words.length) {
    const remaining = words.length - i;
    const count = (remaining === 4) ? 2 : (remaining >= 3 ? 3 : remaining);
    const group = words.slice(i, i + count);

    const chunkText = group
      .map(w => w.word.toUpperCase().replace(/[.,:;!?]/g, ''))
      .join(' ')
      .trim();

    const fromSec = group[0].start;
    const toSec = group[group.length - 1].end;

    const isHighlight = reel.highlightKeywords.some(kw => chunkText.includes(kw));

    const fromFrame = Math.max(0, Math.floor(fromSec * 30));
    const toFrame = Math.ceil(toSec * 30) + 2;

    chunks.push({
      from: fromFrame,
      to: toFrame,
      text: chunkText,
      highlight: isHighlight,
      startSec: Number(fromSec.toFixed(3)),
      endSec: Number(toSec.toFixed(3))
    });

    i += count;
  }

  // Prevent overlapping captions
  for (let j = 0; j < chunks.length - 1; j++) {
    if (chunks[j].to > chunks[j + 1].from) {
      chunks[j].to = chunks[j + 1].from;
    }
  }

  const jsonOutPath = path.join(__dirname, `../src/${reel.id}_captions.json`);
  fs.writeFileSync(jsonOutPath, JSON.stringify(chunks, null, 2), 'utf-8');
  console.log(`✓ Captions saved: ${jsonOutPath} (${chunks.length} chunks)`);

  const totalDurationSec = chunks[chunks.length - 1].endSec + 0.8;
  const totalFrames = Math.ceil(totalDurationSec * 30);
  console.log(`\n⏱️ Total Voice Duration: ${totalDurationSec.toFixed(2)}s (${totalFrames} frames @ 30fps)`);
  
  return { durationSec: totalDurationSec, durationFrames: totalFrames, audioPath: normalizedAudioOutPath, captionsPath: jsonOutPath };
}

async function main() {
  try {
    const result = await generateWithAlignment(REEL);
    const timing = processAlignment(result, REEL);
    console.log(`\n🎉 Successfully synthesized 3P VO (${timing.durationSec.toFixed(2)}s, ${timing.durationFrames} frames)`);
  } catch (err) {
    console.error('❌ Error generating audio:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
