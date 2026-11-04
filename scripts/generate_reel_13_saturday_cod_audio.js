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
  id: 'reel_new_13_saturday_cod_loop',
  title: 'BOFU: The Saturday Gojek COD Loop & Cooler Bag SOP',
  script:
    "[curious] Masih bingung cara pesen Lira buat stok kulkas seminggu? Ini sistem Saturday Loop kita sebelum form ditutup Jumat jam enam sore! [excited] Pertama, klik link di bio dan pilih paket lo: Four-Pack Vault delapan puluh delapan ribu, atau Six-Pack seratus lima belas ribu yang paling hemat. [proud] Kedua, tiap paket Vault langsung dapet gratis Cooler Bag hijau Lira berlapis aluminium foil. Diseduh fresh Jumat malam, suhunya terkunci dingin sampai depan pagar rumah lo! [confident] Ketiga, harga botol ditransfer pas isi form. Sabtu pagi jam sepuluh sampai dua belas siang, kurir Gojek nganter ke rumah. Ongkir plus garansi seribu perak tinggal bayar tunai di tempat! Bocor atau gak dingin di jalan? Kita ganti seratus persen. [urgent] Ingat, pre-order ditutup rapat Jumat jam enam sore. Klik link di bio sekarang!",
  highlightKeywords: [
    'SATURDAY LOOP', 'JUMAT JAM ENAM SORE', 'LINK DI BIO',
    'FOUR-PACK VAULT', 'DELAPAN PULUH DELAPAN', 'SIX-PACK', 'SERATUS LIMA BELAS',
    'GRATIS COOLER BAG', 'ALUMINIUM FOIL', 'FRESH JUMAT MALAM',
    'TERKUNCI DINGIN', 'KURIR GOJEK', 'GARANSI SERIBU PERAK',
    'BAYAR TUNAI', 'GANTI SERATUS PERSEN', 'KLIK LINK DI BIO'
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

function buildCaptions(words) {
  const highlightSet = new Set([
    'SATURDAY', 'LOOP', 'JUMAT', 'ENAM', 'SORE', 'LINK', 'BIO',
    'FOUR-PACK', 'VAULT', 'DELAPAN', 'PULUH', 'SIX-PACK', 'SERATUS', 'HEMAT',
    'GRATIS', 'COOLER', 'BAG', 'HIJAU', 'ALUMINIUM', 'FOIL', 'FRESH',
    'DINGIN', 'PAGAR', 'GOJEK', 'ONGKIR', 'GARANSI', 'SERIBU', 'PERAK',
    'TUNAI', 'TEMPAT', 'BOCOR', 'GANTI', 'PERSEN', 'PRE-ORDER', 'SEKARANG'
  ]);

  const chunks = [];
  let i = 0;
  while (i < words.length) {
    // Group 2 to 3 words per chunk
    let size = 3;
    if (i + 2 < words.length) {
      const len3 = words[i].clean.length + words[i + 1].clean.length + words[i + 2].clean.length;
      if (len3 > 19 || /[.!?]$/.test(words[i + 1].word)) {
        size = 2;
      }
    } else {
      size = words.length - i;
    }
    if (/[,;:!?]$/.test(words[i].word) && words[i].clean.length >= 7) {
      size = 2;
    }
    const slice = words.slice(i, i + size);
    const text = slice.map(w => w.clean).join(' ');
    const highlighted = slice.some(w => highlightSet.has(w.clean));
    chunks.push({
      text,
      startFrame: slice[0].startFrame,
      endFrame: slice[slice.length - 1].endFrame,
      highlight: highlighted
    });
    i += size;
  }

  // Close tiny gaps between consecutive chunks so captions never flicker
  for (let j = 0; j < chunks.length - 1; j++) {
    if (chunks[j + 1].startFrame - chunks[j].endFrame <= 6) {
      chunks[j].endFrame = chunks[j + 1].startFrame;
    }
  }
  return chunks;
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

  const captions = buildCaptions(words);
  const captionsOutPath = path.join(__dirname, `../src/${reel.id}_captions.json`);
  fs.writeFileSync(captionsOutPath, JSON.stringify(captions, null, 2), 'utf-8');
  console.log(`✓ Captions saved: ${captionsOutPath} (${captions.length} chunks)`);

  words.forEach(w => {
    console.log(`  [${w.index}] ${w.startFrame}f (${w.start}s) -> ${w.endFrame}f (${w.end}s): ${w.word}`);
  });

  const totalDurationSec = words[words.length - 1].end + 0.8;
  const totalFrames = Math.ceil(totalDurationSec * 30);
  console.log(`\n⏱️ Total Voice Duration: ${totalDurationSec.toFixed(2)}s (${totalFrames} frames @ 30fps)`);
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
