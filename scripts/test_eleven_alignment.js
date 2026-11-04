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

const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  console.error('❌ ELEVENLABS_API_KEY is required in .env or environment');
  process.exit(1);
}
const voiceId = process.env.CALEB_VOICE_ID || "WVwVlhKdnZoCuTIoxjYr";

const scriptWithTags = "[curious] Tiga tanda minuman kafe lima puluh ribuan sebenernya ngerugiin lo. [pause] Dan yang ketiga paling sering lo lakuin tanpa sadar. [sighs] Tanda satu: baru lima belas menit di meja, rasa matcha lo udah berubah jadi air tawar dingin karena esnya mencair. [frustrated] Tanda dua: tangan lo tersandera harus megang cup terus seharian, nggak bisa lo masukin ke tote bag atau tas laptop. [intrigued] Tanda tiga: lo bayar mahal cuma buat was-was kopi tumpah ke keyboard laptop kerja lo. [proud] Makanya Lira dibikin murni tanpa es batu, segel kedap udara seratus delapan puluh derajat, dan tahan tujuh hari di kulkas. [confident] Amankan fresh batch Sabtu lo sekarang lewat link di bio sebelum kehabisan!";

const payload = JSON.stringify({
  text: scriptWithTags,
  model_id: "eleven_v4",
  voice_settings: {
    stability: 0.50,
    similarity_boost: 0.85
  }
});

const req = https.request({
  hostname: 'api.elevenlabs.io',
  path: `/v1/text-to-speech/${voiceId}/with-timestamps`,
  method: 'POST',
  headers: {
    'xi-api-key': apiKey,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    if (res.statusCode !== 200) {
      console.error('Error:', res.statusCode, body);
      return;
    }
    const json = JSON.parse(body);
    const audioBuffer = Buffer.from(json.audio_base64, 'base64');
    fs.writeFileSync('/Users/caleb/.gemini/antigravity/scratch/lira-remotion/public/assets/voiceover_aligned.mp3', audioBuffer);
    console.log('Audio saved! Bytes:', audioBuffer.length);
    
    // Parse alignment
    const chars = json.alignment.characters;
    const starts = json.alignment.character_start_times_seconds;
    const ends = json.alignment.character_end_times_seconds;
    
    const words = [];
    let curWord = '';
    let wordStart = null;
    let wordEnd = null;
    
    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];
      if (/\s/.test(c)) {
        if (curWord) {
          words.push({ word: curWord, start: wordStart, end: wordEnd });
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
      words.push({ word: curWord, start: wordStart, end: wordEnd });
    }
    
    console.log('Total words detected:', words.length);
    console.log('Sample words:', words.slice(0, 8));
    
    // Group into 2-3 word chunks
    const chunks = [];
    let i = 0;
    while (i < words.length) {
      // Pick 2 or 3 words (prefer 3 unless remainder or long words)
      const count = (words.length - i === 4) ? 2 : (words.length - i >= 3 ? 3 : words.length - i);
      const group = words.slice(i, i + count);
      const chunkText = group.map(w => w.word.toUpperCase().replace(/[.,:!?]/g, '')).join(' ');
      const fromSec = group[0].start;
      const toSec = group[group.length - 1].end;
      
      chunks.push({
        from: Math.floor(fromSec * 30),
        to: Math.ceil(toSec * 30),
        text: chunkText,
        startSec: fromSec,
        endSec: toSec
      });
      i += count;
    }
    
    fs.writeFileSync('/Users/caleb/.gemini/antigravity/scratch/lira-remotion/src/aligned_captions.json', JSON.stringify(chunks, null, 2));
    console.log('Total 2-3 word chunks generated:', chunks.length);
    console.log('First 5 chunks:');
    chunks.slice(0, 5).forEach(c => console.log(`  [f ${c.from} - ${c.to}] (${(c.endSec - c.startSec).toFixed(2)}s): "${c.text}"`));
  });
});

req.on('error', console.error);
req.write(payload);
req.end();
