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

const REELS = [
  {
    id: 'reel_new_06_laptop_spill',
    title: 'The Laptop Spill Nightmare',
    script: "[curious] Pernah gak cup plastik kafe lo tumpah ke keyboard laptop pas lagi asik kerja? [frustrated] Momen horor itu yang bikin gue trauma sama cup takeaway tipis bertutup longgar. [excited] Makanya botol Lira kita desain beda: botol silinder kokoh dengan seal gold cap kedap udara. Dibalik seratus delapan puluh derajat pun dijamin anti bocor dan aman dilempar ke tas! [proud] Konsentrat Pure Japanese Premium Matcha murni, tanpa gula pasir. [urgent] Kerja tenang tanpa drama tumpah. Limited batch di link bio!",
    highlightKeywords: [
      'CUP PLASTIK KAFE', 'KEYBOARD LAPTOP', 'MOMEN HOROR',
      'SEAL GOLD CAP', 'SERATUS DELAPAN PULUH DERAJAT', 'ANTI BOCOR',
      'DILEMPAR KE TAS', 'PURE JAPANESE', 'TANPA GULA PASIR',
      'LIMITED BATCH', 'LINK BIO'
    ]
  },
  {
    id: 'reel_new_07_myth_no_sugar',
    title: 'Mitos Matcha Enak Harus Manis Gula',
    script: "[curious] Siapa bilang matcha enak harus ditimbun sirup gula berlebihan? [intrigued] Kafe mall biasa masukin puluhan gram gula pasir cuma buat nutupin rasa matcha yang hambar. [excited] Padahal kalau pakai Pure Japanese Premium Matcha asli, gurih umaminya udah kaya banget. Di dapur Lira, konsentrat murninya kita blender kecepatan tinggi dipadu tetesan stevia alami nol gula pasir. [proud] Manisnya pas, enteng di badan, dan nol sugar crash. [urgent] Rasain matcha jujur sekarang. Amankan batch lo di bio!",
    highlightKeywords: [
      'GULA BERLEBIHAN', 'PULUHAN GRAM', 'PURE JAPANESE',
      'GURIH UMAMINYA', 'BLENDER KECEPATAN TINGGI', 'STEVIA ALAMI',
      'NOL GULA PASIR', 'ENTENG DI BADAN', 'NOL SUGAR CRASH',
      'MATCHA JUJUR', 'AMANKAN BATCH'
    ]
  },
  {
    id: 'reel_new_08_pure_japanese_matcha',
    title: 'Kenapa Kami Pakai Pure Japanese Matcha',
    script: "[curious] Kenapa warna matcha Lira bisa sehijau zamrud pekat gini tanpa setetes pun pewarna kimia? [thoughtful] Banyak bubuk di pasaran yang kusam kecokelatan karena oplosan tepung. [excited] Lira cuma pakai Pure Japanese Premium Matcha langsung dari perkebunan Jepang, tinggi klorofil dan L-Theanine alami. [proud] Di dapur, konsentratnya kita blender kecepatan tinggi biar larut mikro tanpa gumpalan, dipadu stevia drops alami. [urgent] Fokus tenang seharian tanpa deg-degan. Limited batch available di link bio!",
    highlightKeywords: [
      'SEHIJAU ZAMRUD', 'TANPA PEWARNA', 'PURE JAPANESE',
      'PERKEBUNAN JEPANG', 'L-THEANINE', 'BLENDER KECEPATAN TINGGI',
      'LARUT MIKRO', 'STEVIA DROPS', 'FOKUS TENANG',
      'LIMITED BATCH', 'LINK BIO'
    ]
  },
  {
    id: 'reel_new_09_oatside_formula',
    title: 'Perjalanan Menemukan Barista Oatside Formula',
    script: "[curious] Bikin racikan Matcha Oatside yang seimbang ternyata butuh banyak eksperimen gagal. [frustrated] Gue sempat coba berbagai susu nabati: ada yang pas diblender misah, ada yang nutup aroma matcha. [excited] Sampai akhirnya nemuin pasangan emas: Oatside Barista dipadukan sama konsentrat Pure Japanese Premium Matcha hasil blender kecepatan tinggi kita. [proud] Creamy, gurih nutty, dengan manis alami stevia drops nol gula pasir. [urgent] Sensasi segar premium tanpa kompromi. Cek link di bio!",
    highlightKeywords: [
      'MATCHA OATSIDE', 'EKSPERIMEN GAGAL', 'PASANGAN EMAS',
      'OATSIDE BARISTA', 'PURE JAPANESE', 'BLENDER KECEPATAN TINGGI',
      'GURIH NUTTY', 'STEVIA DROPS', 'NOL GULA PASIR',
      'SEGAR PREMIUM', 'CEK LINK DI BIO'
    ]
  },
  {
    id: 'reel_new_10_friday_night_brewing',
    title: 'Dapur Lira Jumat Malam: Dibalik Layar Batch Sabtu',
    script: "[curious] Kenapa lampu dapur Lira masih nyala terang sampai larut malam sebelum hari drop? [intrigued] Karena komitmen artisan: setiap botol diseduh segar langsung dengan tangan Caleb. [excited] Timbangan presisi Pure Japanese Premium Matcha, konsentrat di-blender kecepatan tinggi jadi emulsi mikro halus, dipadu tetesan stevia alami, lalu disegel rapat dengan gold cap. [proud] Bukan produk pabrik massal, ini seduhan jujur buat lo. [urgent] Kuota batch sangat terbatas. Amankan jatah lo di bio sekarang!",
    highlightKeywords: [
      'LAMPU DAPUR LIRA', 'KOMITMEN ARTISAN', 'DISEDUH SEGAR',
      'PURE JAPANESE', 'BLENDER KECEPATAN TINGGI', 'EMULSI MIKRO',
      'STEVIA ALAMI', 'DISEGEL RAPAT', 'BUKAN PRODUK PABRIK',
      'SANGAT TERBATAS', 'LINK BIO SEKARANG'
    ]
  }
];

function generateWithAlignment(reel) {
  console.log(`🎙️ Generating Short VO (<30s) for: ${reel.title} (${reel.id})...`);
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
  return { durationSec: totalDurationSec, durationFrames: totalFrames };
}

async function main() {
  console.log('========================================================');
  console.log('🚀 GENERATING SHORT VO (<30s, NO PRICES) FOR REELS 6 - 10');
  console.log('========================================================');

  const summaries = [];

  for (const reel of REELS) {
    try {
      const result = await generateWithAlignment(reel);
      const timing = processAlignment(result, reel);
      summaries.push({
        id: reel.id,
        title: reel.title,
        frames: timing.durationFrames,
        sec: timing.durationSec.toFixed(2),
        under30s: timing.durationSec < 30 ? '✅ YES' : '❌ NO',
        status: 'SUCCESS'
      });
      await new Promise(r => setTimeout(r, 1500));
    } catch (err) {
      console.error(`❌ Failed ${reel.id}:`, err);
      summaries.push({
        id: reel.id,
        title: reel.title,
        status: `ERROR: ${err.message}`
      });
    }
  }

  console.log('\n========================================================');
  console.log('🎉 REWORKED ELEVENLABS SUMMARY (<30s & NO PRICES):');
  console.log('========================================================');
  console.table(summaries);
}

main().catch(console.error);
