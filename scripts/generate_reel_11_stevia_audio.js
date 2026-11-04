const https = require('https');
const fs = require('fs');
const path = require('path');

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

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = 'WVwVlhKdnZoCuTIoxjYr'; // Caleb clone
const MODEL_ID = 'eleven_v4';

const REEL = {
  id: 'reel_new_11_stevia_truth',
  title: 'Kebenaran Stevia & Kasus Viral',
  script: "[curious] Gara-gara kasus stevia palsu yang lagi viral, banyak yang nanya: Lira beneran pake stevia asli? [excited] Gini: stevia asli dari daun steviol alami, manisnya lewat tanpa naikin insulin atau bikin gemuk. [frustrated] Tapi brand nakal bohong dan nyampur kental manis biar murah. [proud] Di Lira, pemanis alami stevia ekstrak murni plus Pure Japanese Matcha dan Oatside. Zero sugar crash! [urgent] Mau amankan batch segar Sabtu ini? Komen ORDER di bawah sekarang!",
  highlightKeywords: [
    'KASUS STEVIA', 'STEVIA PALSU', 'DAUN STEVIOL ALAMI',
    'TANPA NAIKIN INSULIN', 'BRAND NAKAL BOHONG', 'KENTAL MANIS',
    'PEMANIS ALAMI STEVIA', 'PURE JAPANESE MATCHA',
    'ZERO SUGAR CRASH', 'BATCH SEGAR', 'KOMEN ORDER'
  ]
};


function generateWithAlignment(reel) {
  console.log(`🎙️ Generating Voiceover (<30s) for: ${reel.title}...`);
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
  const audioOutPath = path.join(__dirname, `../public/assets/${reel.id}.mp3`);
  fs.writeFileSync(audioOutPath, audioBuffer);
  console.log(`✓ Audio saved: ${audioOutPath} (${audioBuffer.length} bytes)`);

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

  // Filter out any emotion tags like [curious], [excited], etc.
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

  const totalDurationSec = chunks[chunks.length - 1].endSec + 0.6;
  const totalFrames = Math.ceil(totalDurationSec * 30);
  console.log(`\n⏱️ Total Voice Duration: ${totalDurationSec.toFixed(2)}s (${totalFrames} frames @ 30fps)`);
  if (totalDurationSec < 30) {
    console.log(`🎉 SUCCESS: Under 30 seconds limit!`);
  } else {
    console.warn(`⚠️ WARNING: Exceeds 30 seconds!`);
  }
  return { durationSec: totalDurationSec, durationFrames: totalFrames };
}

async function main() {
  try {
    const result = await generateWithAlignment(REEL);
    const timing = processAlignment(result, REEL);
    console.log('Done generating Stevia voiceover and synchronized captions!');
  } catch (err) {
    console.error('Error generating audio:', err);
    process.exit(1);
  }
}

main();
