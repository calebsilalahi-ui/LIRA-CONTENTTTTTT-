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

const REEL = {
  id: 'reel_new_12_sapa_mart_comeback',
  title: 'SAPA Mart 1-Star Review Comeback (@science_in_8bit Style)',
  script: "[curious] Kita dapet review bintang satu gara-gara kulkas SAPA Mart kosong dua minggu. [excited] Tenang, minggu ini Lira resmi balik restock di SAPA Mart! Senin pagi jam tujuh lewat lima belas, giliran Choco Hazelnut yang masuk kulkas. [proud] Lanjut Selasa pagi setengah sembilan, giliran Pure Matcha Oatside dan Milk Tea. Manis alami Stevia murni, zero sugar crash! [urgent] Tapi jatah SAPA Mart limited batch setiap minggu. Telat dikit, langsung ludes! [excited] Lo tim Senin Choco atau Selasa Matcha? Komen di bawah, atau amankan batch Sabtu di bio!",
  highlightKeywords: [
    'BINTANG SATU', 'SAPA MART', 'KOSONG DUA MINGGU',
    'BALIK RESTOCK', 'SENIN PAGI', 'CHOCO HAZELNUT',
    'SELASA PAGI', 'PURE MATCHA OATSIDE', 'MILK TEA',
    'STEVIA MURNI', 'ZERO SUGAR CRASH', 'LIMITED BATCH',
    'LANGSUNG LUDES', 'SENIN CHOCO', 'SELASA MATCHA', 'KOMEN DI BAWAH'
  ]
};

function generateWithAlignment(reel) {
  console.log(`🎙️ Generating Voiceover for: ${reel.title}...`);
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

  const words = rawWords.filter(w => !/^\[.*\]$/.test(w.word)).map((w, idx) => ({
    index: idx,
    word: w.word,
    clean: w.word.toUpperCase().replace(/[.,:;!?]/g, ''),
    start: Number(w.start.toFixed(3)),
    end: Number(w.end.toFixed(3)),
    startFrame: Math.floor(w.start * 30),
    endFrame: Math.ceil(w.end * 30)
  }));

  const wordsOutPath = path.join(__dirname, `../src/${reel.id}_words.json`);
  fs.writeFileSync(wordsOutPath, JSON.stringify(words, null, 2), 'utf-8');
  console.log(`✓ Words saved: ${wordsOutPath} (${words.length} words)`);

  // Print word table for exact beat mapping
  words.forEach(w => {
    console.log(`  [${w.index}] ${w.startFrame}f (${w.start}s) -> ${w.endFrame}f (${w.end}s): ${w.word}`);
  });

  const totalDurationSec = words[words.length - 1].end + 0.8;
  const totalFrames = Math.ceil(totalDurationSec * 30);
  console.log(`\n⏱️ Total Voice Duration: ${totalDurationSec.toFixed(2)}s (${totalFrames} frames @ 30fps)`);
  return { durationSec: totalDurationSec, durationFrames: totalFrames };
}

async function main() {
  try {
    const result = await generateWithAlignment(REEL);
    processAlignment(result, REEL);
  } catch (err) {
    console.error('Error generating audio:', err);
    process.exit(1);
  }
}

main();
