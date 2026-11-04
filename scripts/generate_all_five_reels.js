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
    id: 'reel_blender_efficiency',
    title: 'The Blender Efficiency Secret',
    script: "[curious] Kenapa di dapur Lira, kita blender konsentrat matchanya bukan dikocok manual? [intrigued] Banyak yang kira bikin matcha premium harus dikocok bambu pelan-pelan. Tapi pas orderan batch mulai numpuk, kita butuh efisiensi dan konsistensi tinggi. [proud] Blender komersial kecepatan tinggi memecah partikel pure Japanese matcha sampai ke level mikro: [excited] konsentrat larut sempurna tanpa gumpalan, dan emulsinya menyatu halus pas dicampur Oatside. Nol gula pasir, cukup pemanis alami stevia drops. [confident] Dari Milk Tea lima belas ribu, Matcha Classic sembilan belas ribu, Choco Hazelnut dua puluh dua ribu, sampai Matcha Oatside dua puluh empat ribu. [urgent] Limited batch available buat drop minggu depan. Amankan botol lo lewat link di bio!",
    highlightKeywords: [
      'BLENDER', 'KONSENTRAT MATCHANYA', 'DIKOCOK MANUAL',
      'ORDERAN BATCH', 'EFISIENSI TINGGI', 'PURE JAPANESE',
      'TANPA GUMPALAN', 'OATSIDE', 'STEVIA DROPS',
      'LIMA BELAS RIBU', 'SEMBILAN BELAS RIBU', 'DUA PULUH DUA RIBU', 'DUA PULUH EMPAT RIBU',
      'LIMITED BATCH', 'LINK DI BIO'
    ]
  },
  {
    id: 'reel_blind_taste_test',
    title: '55k Cafe vs 24k Lira Blind Taste Test',
    script: "[curious] Matcha kafe mall lima puluh lima ribu vs Matcha Oatside Lira dua puluh empat ribu... [intrigued] Cobain tutup mata. Sembilan puluh persen orang ketipu sama gelas plastik dan suasana kafe. Pas dites tutup mata, matcha kafe lima puluh lima ribu rasanya dominan sirup gula pasir. [excited] Pas nyobain Lira: pekat umami Pure Japanese Premium Matcha, manis alami dari daun stevia drops tanpa gula pasir, dan gurihnya Barista Oatside. [proud] Harga jujur tanpa mark-up sewa kafe: Milk Tea lima belas ribu, Matcha Classic sembilan belas ribu, Choco Hazelnut dua puluh dua ribu, dan Matcha Oatside cuma dua puluh empat ribu. [urgent] Cobain sendiri bedanya. Limited batch available di link bio!",
    highlightKeywords: [
      'LIMA PULUH LIMA RIBU', 'DUA PULUH EMPAT RIBU', 'TUTUP MATA',
      'GELAS PLASTIK', 'GULA PASIR', 'PURE JAPANESE',
      'STEVIA DROPS', 'BARISTA OATSIDE', 'HARGA JUJUR',
      'LIMA BELAS RIBU', 'SEMBILAN BELAS RIBU', 'DUA PULUH DUA RIBU', 'DUA PULUH EMPAT RIBU',
      'LIMITED BATCH', 'LINK BIO'
    ]
  },
  {
    id: 'reel_workplace_energy',
    title: 'Workplace Energy Trap vs Lira Clean Focus',
    script: "[curious] Pernah mikir kenapa jam dua siang di kantor lo mendadak lemes dan otak lo nge-lag? [frustrated] Masalahnya bukan di kafein, tapi ada tiga puluh gram sirup gula pasir di segelas minuman kafe yang memicu lonjakan insulin mendadak. [excited] Di Lira, kita eliminasi seratus persen gula pasir: konsentrat Pure Japanese Premium Matcha kaya L-Theanine alami kita blender sampai ekstra halus, dipadu manis alami stevia drops. [proud] Energi fokus stabil enam jam tanpa rasa begah. Pilihan menu lengkap: Milk Tea lima belas ribu, Matcha Classic sembilan belas ribu, Choco Hazelnut dua puluh dua ribu, sampai Matcha Oatside dua puluh empat ribu. [urgent] Stok fokus kerja lo minggu ini. Limited batch available di link bio!",
    highlightKeywords: [
      'JAM DUA SIANG', 'OTAK NGE-LAG', 'TIGA PULUH GRAM',
      'LONJAKAN INSULIN', 'SERATUS PERSEN', 'PURE JAPANESE',
      'L-THEANINE', 'BLENDER EKSTRA HALUS', 'ENAM JAM',
      'LIMA BELAS RIBU', 'SEMBILAN BELAS RIBU', 'DUA PULUH DUA RIBU', 'DUA PULUH EMPAT RIBU',
      'LIMITED BATCH', 'LINK BIO'
    ]
  },
  {
    id: 'reel_price_guess',
    title: 'Tebak Harga Menu Lira Challenge',
    script: "[curious] Tebak berapa harga botol matcha oat pekat ini? [excited] Kalau tebakan lo bener, botolnya gratis buat lo. Rata-rata orang nebak empat puluh lima ribu sampai lima puluh ribu, karena warnanya hijau pekat dan pakai Oatside murni. [proud] Plot twist: Matcha Oatside Lira cuma dua puluh empat ribu! Bahkan varian Matcha Latte Classic kita cuma sembilan belas ribu, Choco Hazelnut dua puluh dua ribu, dan Milk Tea cuma lima belas ribu! [confident] Semuanya diseduh dari Pure Japanese Premium Matcha, konsentrat di-blender halus, tanpa setetes pun gula pasir. [urgent] Dapet kualitas premium tanpa bikin kantong jebol. Amankan batch lo di bio sekarang!",
    highlightKeywords: [
      'TEBAK BERAPA HARGA', 'BOTOLNYA GRATIS', 'LIMA PULUH RIBU',
      'PLOT TWIST', 'DUA PULUH EMPAT RIBU', 'SEMBILAN BELAS RIBU',
      'DUA PULUH DUA RIBU', 'LIMA BELAS RIBU', 'PURE JAPANESE',
      'BLENDER HALUS', 'KUALITAS PREMIUM', 'AMANKAN BATCH'
    ]
  },
  {
    id: 'reel_founder_anti_factory',
    title: 'Why Caleb Rejected Factory Mass Production',
    script: "[curious] Banyak yang nyuruh gue serahin Lira ke pabrik massal biar bisa produksi ribuan botol tiap hari. [thoughtful] Tapi retail dan pabrik nuntut bahan pengawet dan stabilizer kimia biar minumannya tahan berbulan-bulan di gudang. [proud] Gue tolak kompromi itu. Di dapur sendiri, konsentrat Pure Japanese Premium Matcha kita blender kecepatan tinggi biar teksturnya ekstra halus dan fresh, dipadukan pemanis alami stevia drops. [confident] Dibuat jujur buat lo yang cari rasa murni: Milk Tea lima belas ribu, Matcha Classic sembilan belas ribu, Choco Hazelnut dua puluh dua ribu, sampai Matcha Oatside dua puluh empat ribu. [urgent] Limited batch available untuk drop berikutnya. Amankan slot lo di link bio!",
    highlightKeywords: [
      'PABRIK MASSAL', 'RIBUAN BOTOL', 'PENGAWET KIMIA',
      'GUE TOLAK', 'DAPUR SENDIRI', 'PURE JAPANESE',
      'BLENDER KECEPATAN TINGGI', 'STEVIA DROPS', 'RASA MURNI',
      'LIMA BELAS RIBU', 'SEMBILAN BELAS RIBU', 'DUA PULUH DUA RIBU', 'DUA PULUH EMPAT RIBU',
      'LIMITED BATCH', 'LINK DI BIO'
    ]
  }
];

function generateWithAlignment(reel) {
  console.log(`🎙️ Generating VO for: ${reel.title} (${reel.id})...`);
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

  const totalDurationSec = chunks[chunks.length - 1].endSec + 0.8;
  const totalFrames = Math.ceil(totalDurationSec * 30);
  return { durationSec: totalDurationSec, durationFrames: totalFrames };
}

async function main() {
  console.log('========================================================');
  console.log('🚀 GENERATING ELEVENLABS AUDIO & WORD ALIGNMENTS FOR 5 REELS');
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
        status: 'SUCCESS'
      });
      // Small pause between ElevenLabs requests
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
  console.log('🎉 AUDIO GENERATION COMPLETE:');
  console.log('========================================================');
  console.table(summaries);
}

main().catch(console.error);
