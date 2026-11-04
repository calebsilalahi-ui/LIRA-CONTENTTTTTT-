#!/usr/bin/env node
/**
 * Lira Voiceover & Alignment Engine
 * 
 * Generates speech using ElevenLabs v4 with inline emotion tags,
 * parses character/word timestamps from /with-timestamps,
 * and produces frame-accurate 2-3 word caption chunks.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Auto-load .env file if present
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [k, ...v] = trimmed.split('=');
      const key = k.trim();
      if (!process.env[key]) {
        process.env[key] = v.join('=').trim();
      }
    }
  }
}

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error('❌ ELEVENLABS_API_KEY is required in .env or environment');
  process.exit(1);
}
const VOICE_ID = 'WVwVlhKdnZoCuTIoxjYr'; // Caleb clone
const MODEL_ID = 'eleven_v4';

const SCRIPT_WITH_EMOTIONS =
  "[curious] Pernah nggak lo beli matcha lima puluh ribuan di kafe, [frustrated] " +
  "tapi dua jam kemudian kepala lo malah pusing dan lemes? [intrigued] " +
  "Rahasia kotornya: banyak kafe pakai bubuk green tea murah yang dicampur sirup gula rafinasi dan krimer sawit. [sighs] " +
  "Itu bukan energi fokus, itu sugar spike yang bikin lo ngantuk pas kerja. [excited] " +
  "Makanya di Lira, kita whisk pure premium Japanese matcha, [proud] " +
  "di-emulsi murni bareng barista oat milk dan pemanis alami stevia. " +
  "Nol gula pasir, nol sugar crash, fokus clean seharian. [confident] " +
  "Disegel airtight seratus delapan puluh derajat anti-bocor, dingin tahan tujuh hari di kulkas lo. [urgent] " +
  "Limited batch available untuk Sabtu ini. [confident] " +
  "Amankan slot lo sekarang lewat link di bio sebelum sold out!";

const HIGHLIGHT_KEYWORDS = [
  'LIMA PULUH', 'PUSING DAN LEMES', 'RAHASIA KOTORNYA',
  'GREEN TEA MURAH', 'SUGAR SPIKE', 'NGANTUK PAS KERJA',
  'PREMIUM JAPANESE', 'BARISTA OAT MILK', 'ALAMI STEVIA',
  'NOL GULA PASIR', 'NOL SUGAR CRASH', 'FOKUS CLEAN',
  '180 DERAJAT', 'ANTI-BOCOR', 'TUJUH HARI',
  'LIMITED BATCH', 'SABTU INI', 'LINK DI BIO', 'SOLD OUT'
];

async function generateWithAlignment() {
  console.log('🎙️ Calling ElevenLabs /with-timestamps using model eleven_v4...');
  
  const payload = JSON.stringify({
    text: SCRIPT_WITH_EMOTIONS,
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

async function main() {
  const result = await generateWithAlignment();
  
  // 1. Save audio
  const audioBuffer = Buffer.from(result.audio_base64, 'base64');
  const audioOutPath = path.join(__dirname, '../public/assets/voiceover_viral_current.mp3');
  fs.writeFileSync(audioOutPath, audioBuffer);
  console.log(`✓ Audio saved to: ${audioOutPath} (${audioBuffer.length} bytes)`);

  // 2. Parse word alignment from character timestamps
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

  // Filter out any bracket tags like [curious], [pause], etc.
  const words = rawWords.filter(w => !/^\[.*\]$/.test(w.word));
  console.log(`✓ Spoken words extracted: ${words.length}`);

  // 3. Group words into strictly 2 to 3 word chunks
  const chunks = [];
  let i = 0;
  while (i < words.length) {
    const remaining = words.length - i;
    // Prefer 3 words, or 2 if 4 remaining or 2 remaining
    const count = (remaining === 4) ? 2 : (remaining >= 3 ? 3 : remaining);
    const group = words.slice(i, i + count);
    
    // Clean punctuation from display text
    const chunkText = group
      .map(w => w.word.toUpperCase().replace(/[.,:;!?]/g, ''))
      .join(' ')
      .trim();

    const fromSec = group[0].start;
    const toSec = group[group.length - 1].end;

    // Determine if this chunk contains any highlight keywords
    const isHighlight = HIGHLIGHT_KEYWORDS.some(kw => chunkText.includes(kw));

    // Convert seconds to frames at 30 fps
    // Add small buffer to ensure caption stays visible until next word begins
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

  // Ensure consecutive chunks don't overlap awkwardly
  for (let j = 0; j < chunks.length - 1; j++) {
    if (chunks[j].to > chunks[j + 1].from) {
      chunks[j].to = chunks[j + 1].from;
    }
  }

  const jsonOutPath = path.join(__dirname, '../src/aligned_captions.json');
  fs.writeFileSync(jsonOutPath, JSON.stringify(chunks, null, 2), 'utf-8');
  console.log(`✓ Exact aligned caption chunks written to: ${jsonOutPath}`);
  console.log(`✓ Total caption chunks: ${chunks.length}`);

  const totalDurationSec = chunks[chunks.length - 1].endSec + 0.8;
  const totalFrames = Math.ceil(totalDurationSec * 30);
  console.log(`✓ Suggested total duration: ${totalDurationSec.toFixed(2)}s (${totalFrames} frames)`);
}

main().catch(err => {
  console.error('❌ Alignment Error:', err);
  process.exit(1);
});
