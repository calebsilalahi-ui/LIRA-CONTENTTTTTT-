#!/usr/bin/env node
/**
 * Generate Highly Emotional, Conversational Caleb Founder Voiceover with Timestamp Alignment
 * Voice: Caleb clone (WVwVlhKdnZoCuTIoxjYr)
 * Settings: High dynamism, low stability (0.32), style exaggeration (0.35) for real emotion.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');
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

const VOICE_ID = 'WVwVlhKdnZoCuTIoxjYr'; // Caleb founder clone
// eleven_multilingual_v2 provides the highest emotional expression and style boost support
const MODEL_ID = 'eleven_multilingual_v2';

const SCRIPT_TEXT = 
  "Pernah gak lo ngerasa... pas jam dua siang, kepala lo mendadak lemes, berat, dan susah banget fokus? " +
  "Banyak yang ngira itu kurang tidur. Padahal bukan! " +
  "Itu efek gula tersembunyi dari matcha kafe lima puluh ribuan yang lo minum tadi siang. Gula cair murah bikin insulin lo melonjak tajam, terus nge-drop drastis ke titik nol! " +
  "Bandingin sama botol Lira ini: pure matcha Jepang murni, barista oat milk, dan pemanis alami stevia. Nol gula pasir, nol crash, energi fokus empat jam penuh! " +
  "Segel rapat seratus delapan puluh derajat anti bocor. Limited batch diseduh fresh weekend ini lewat link di bio sebelum kehabisan!";

const HIGHLIGHT_KEYWORDS = [
  'JAM DUA SIANG', 'LEMES', 'SUSAH FOKUS', 'KURANG TIDUR', 'PADAHAL BUKAN',
  'GULA TERSEMBUNYI', 'LIMA PULUH RIBU', 'INSULIN MELONJAK', 'TITIK NOL',
  'BOTOL LIRA', 'PURE MATCHA', 'NOL GULA PASIR', 'NOL CRASH', '4 JAM PENUH',
  '180 DERAJAT', 'LIMITED BATCH', 'LINK DI BIO'
];

async function generateVoice() {
  console.log('🎙️ Calling ElevenLabs API with high-emotion settings (stability: 0.32, style: 0.35)...');

  const payload = JSON.stringify({
    text: SCRIPT_TEXT,
    model_id: MODEL_ID,
    voice_settings: {
      stability: 0.32,
      similarity_boost: 0.78,
      style: 0.35,
      use_speaker_boost: true
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
          return reject(new Error(`ElevenLabs API HTTP ${res.statusCode}: ${data}`));
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
  const result = await generateVoice();
  console.log('✓ Received ElevenLabs voice synthesis with timestamps!');

  const audioBuffer = Buffer.from(result.audio_base64, 'base64');
  const rawPath = path.join(PROJECT_ROOT, 'public/assets/emotional_somatic_raw.mp3');
  fs.writeFileSync(rawPath, audioBuffer);
  console.log(`✓ Raw emotional VO saved: ${rawPath} (${audioBuffer.length} bytes)`);

  // Parse word-by-word timestamps
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

  // Create clean, seamless 2-3 word caption chunks (zero gaps between chunks!)
  const chunks = [];
  let i = 0;
  while (i < rawWords.length) {
    const remaining = rawWords.length - i;
    const count = (remaining === 4) ? 2 : (remaining >= 3 ? 3 : remaining);
    const group = rawWords.slice(i, i + count);

    const chunkText = group
      .map(w => w.word.toUpperCase().replace(/[.,:;!?]/g, ''))
      .join(' ')
      .trim();

    const fromSec = group[0].start;
    const toSec = group[group.length - 1].end;

    const isHighlight = HIGHLIGHT_KEYWORDS.some(kw => chunkText.includes(kw));

    chunks.push({
      text: chunkText,
      highlight: isHighlight,
      startSec: Number(fromSec.toFixed(3)),
      endSec: Number(toSec.toFixed(3)),
      fromFrame: Math.floor(fromSec * 30),
      toFrame: Math.ceil(toSec * 30)
    });

    i += count;
  }

  // Fill gaps between consecutive chunks so subtitles NEVER flicker/disappear mid-sentence
  for (let j = 0; j < chunks.length - 1; j++) {
    // If the gap to next chunk is small (< 0.4s), extend current chunk to touch the next chunk
    if (chunks[j + 1].startSec - chunks[j].endSec < 0.4) {
      chunks[j].endSec = chunks[j + 1].startSec;
      chunks[j].toFrame = chunks[j + 1].fromFrame;
    }
  }

  const captionsOutPath = path.join(PROJECT_ROOT, 'src/emotional_somatic_captions.json');
  fs.writeFileSync(captionsOutPath, JSON.stringify(chunks, null, 2), 'utf-8');
  console.log(`✓ Seamless Captions JSON saved: ${captionsOutPath} (${chunks.length} chunks)`);

  const totalDuration = chunks[chunks.length - 1].endSec + 0.6;
  const totalFrames = Math.ceil(totalDuration * 30);
  console.log(`⏱️ Voice duration: ${totalDuration.toFixed(2)}s (${totalFrames} frames)`);

  // Now, PRE-MIX BGM WITH FFMPEG so BGM IS 100% CLEAR, AUDIBLE, AND GROOVY!
  // Normalizing VO to -14 LUFS, and mixing BGM at -15 dB with slight sidechain/ducking
  const bgmPath = path.join(PROJECT_ROOT, 'public/assets/bg_music.mp3');
  const masterAudioOutPath = path.join(PROJECT_ROOT, 'public/assets/emotional_somatic_master.mp3');

  const ffmpegBin = fs.existsSync('/Users/caleb/.local/bin/ffmpeg') ? '/Users/caleb/.local/bin/ffmpeg' : 'ffmpeg';
  
  console.log('🎵 Pre-mixing Voiceover with audible, groovy Lo-Fi BGM using FFmpeg...');
  const mixFilter = 
    `[0:a]volume=1.2,loudnorm=I=-14:TP=-1.5:LRA=11[vo];` +
    `[1:a]aloop=loop=-1:size=2e+09,volume=0.45[bgm];` +
    `[vo][bgm]amix=inputs=2:duration=first:dropout_transition=2[out]`;

  const mixRes = spawnSync(ffmpegBin, [
    '-y',
    '-i', rawPath,
    '-i', bgmPath,
    '-filter_complex', mixFilter,
    '-map', '[out]',
    '-c:a', 'libmp3lame',
    '-b:a', '192k',
    masterAudioOutPath
  ], { stdio: 'inherit' });

  if (mixRes.status !== 0) {
    throw new Error('FFmpeg audio pre-mix failed');
  }

  console.log(`✓ Mastered Audio with CLEAR BGM saved: ${masterAudioOutPath}`);
  console.log('\n🎉 Audio and captions synthesis completely successful!');
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
