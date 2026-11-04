#!/usr/bin/env node
/**
 * Lira ElevenLabs Voiceover Generator
 * 
 * Connects directly to ElevenLabs API to render scripts using the verified
 * voice clone: `Caleb_Lira_Founder_V1` in a calm, confident Indo-English / Jaksel cadence.
 * 
 * Guardrail Enforcement:
 * - Adheres strictly to /Users/caleb/Downloads/lira_anti_gravity_system_context_guardrails.md
 * - Automatically trims any silence > 0.1s using ffmpeg (per Refinement Standard)
 * - Outputs clean MP3 directly to public/assets/
 * 
 * Usage:
 *   export ELEVENLABS_API_KEY="your-key-here"
 *   node scripts/generate_voiceover_elevenlabs.js --text "Pernah nggak lo sadar..." --out "public/assets/voiceover_reel5.mp3"
 *   node scripts/generate_voiceover_elevenlabs.js --json "src/latest_reel_architecture.json"
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

// Auto-load .env file if present
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

const ELEVEN_API = 'api.elevenlabs.io';
const DEFAULT_MODEL = 'eleven_v4'; // Upgraded to Eleven v4 for maximum emotive expression & natural audio tags
const CLONE_NAME_TARGET = 'Caleb'; // Auto-matches "Caleb" or "Caleb_Lira_Founder_V1"
const FFMPEG = fs.existsSync('/Users/caleb/.local/bin/ffmpeg')
  ? '/Users/caleb/.local/bin/ffmpeg'
  : '/Users/caleb/.gemini/antigravity/scratch/lira-remotion/node_modules/@remotion/compositor-darwin-arm64/ffmpeg';
const LIB_DIR = '/Users/caleb/.gemini/antigravity/scratch/lira-remotion/node_modules/@remotion/compositor-darwin-arm64';

/**
 * Intelligent Auto-Tag Engine for ElevenLabs v4
 * Injects contextual natural language emotion & pacing tags into plain scripts
 * so Caleb's cloned voice sounds dynamic, expressive, and never dull.
 */
function autoTagEmotions(plainText) {
  // If the script already has emotion tags in brackets, keep them as is
  if (/\[[a-zA-Z\s,]+\]/.test(plainText)) {
    return plainText;
  }

  // Split into sentences / major clauses while preserving delimiters
  const sentences = plainText.split(/(?<=[.!?])\s+/);
  const tagged = sentences.map((sentence, idx) => {
    const s = sentence.trim();
    if (!s) return s;

    const lower = s.toLowerCase();

    // 1. Opening hook or questions
    if (idx === 0 || lower.startsWith('pernah') || lower.startsWith('kenapa') || s.endsWith('?')) {
      return `[curious] ${s}`;
    }

    // 2. Pain points, complaints, dilute drink, leaks
    if (
      lower.includes('cair') ||
      lower.includes('hambar') ||
      lower.includes('bocor') ||
      lower.includes('tumpah') ||
      lower.includes('rusak') ||
      lower.includes('rugi') ||
      lower.includes('ribet')
    ) {
      if (lower.includes('udah berubah') || lower.includes('50 ribu') || lower.includes('berbusa')) {
        return `[sighs] ${s}`;
      }
      return `[frustrated] ${s}`;
    }

    // 3. Realization, research, or proof
    if (lower.includes('nggak ngeh') || lower.includes('banyak yang') || lower.includes('riset') || lower.includes('ternyata')) {
      return `[intrigued] ${s}`;
    }

    // 4. Solution, craft, fresh batch, airtight bottle
    if (lower.includes('makanya') || lower.includes('lira') || lower.includes('botol') || lower.includes('craft') || lower.includes('matcha')) {
      if (lower.includes('zero es') || lower.includes('100 persen') || lower.includes('tetes terakhir')) {
        return `[proud] ${s}`;
      }
      return `[excited] ${s}`;
    }

    // 5. Call to action / closing / link in bio
    if (lower.includes('buktiin') || lower.includes('link') || lower.includes('bio') || lower.includes('amankan') || lower.includes('kehabisan')) {
      return `[confident] ${s}`;
    }

    // Default expressive conversational tag
    return `[calm, conversational] ${s}`;
  });

  return tagged.join(' ');
}

function parseArgs() {
  const args = process.argv.slice(2);
  const params = {
    text: '',
    jsonPath: '',
    out: path.join(__dirname, '../public/assets/voiceover_elevenlabs.mp3'),
    voiceId: '',
    model: DEFAULT_MODEL,
    autoTag: true,
    listVoices: false,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--text' && args[i + 1]) params.text = args[++i];
    if (args[i] === '--json' && args[i + 1]) params.jsonPath = args[++i];
    if (args[i] === '--out' && args[i + 1]) params.out = args[++i];
    if (args[i] === '--voice-id' && args[i + 1]) params.voiceId = args[++i];
    if (args[i] === '--model' && args[i + 1]) params.model = args[++i];
    if (args[i] === '--no-auto-tag') params.autoTag = false;
    if (args[i] === '--list-voices') params.listVoices = true;
    if (args[i] === '--key' && args[i + 1]) process.env.ELEVENLABS_API_KEY = args[++i];
  }

  return params;
}

// Fetch list of voices from ElevenLabs account
function getVoices(apiKey) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: ELEVEN_API,
      path: '/v1/voices',
      method: 'GET',
      headers: {
        'xi-api-key': apiKey,
      },
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.detail) {
            reject(new Error(typeof json.detail === 'string' ? json.detail : JSON.stringify(json.detail)));
          } else {
            resolve(json.voices || []);
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Generate TTS from ElevenLabs
function textToSpeech(apiKey, voiceId, text, outPath, modelId = DEFAULT_MODEL) {
  return new Promise((resolve, reject) => {
    // eleven_v4 utilizes stability & similarity_boost, and natural bracket tags in text
    const isV4 = modelId.startsWith('eleven_v4');
    const voiceSettings = isV4
      ? {
          stability: 0.50,        // Natural expressive conversational variance
          similarity_boost: 0.85, // High fidelity to Caleb's original voice clone
        }
      : {
          stability: 0.50,
          similarity_boost: 0.85,
          style: 0.05,
          use_speaker_boost: true,
        };

    const payload = JSON.stringify({
      text: text,
      model_id: modelId,
      voice_settings: voiceSettings,
    });

    const fileStream = fs.createWriteStream(outPath);

    const req = https.request({
      hostname: ELEVEN_API,
      path: `/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    }, (res) => {
      if (res.statusCode !== 200) {
        let errBody = '';
        res.on('data', c => errBody += c);
        res.on('end', () => reject(new Error(`ElevenLabs API HTTP ${res.statusCode}: ${errBody}`)));
        return;
      }

      res.pipe(fileStream);
      fileStream.on('finish', () => fileStream.close(() => resolve(outPath)));
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

// Trim silences exceeding 0.1s using ffmpeg silenceremove
function trimDeadSpace(inputMp3, outputMp3) {
  const absInput = path.resolve(inputMp3);
  const absOutput = path.resolve(outputMp3);
  const tmpOut = absOutput.replace(/\.mp3$/, '_tight.mp3');

  try {
    execFileSync(
      FFMPEG,
      [
        '-y',
        '-i', absInput,
        '-af', 'silenceremove=start_periods=1:start_duration=0.05:start_threshold=-45dB:detection=peak,silenceremove=stop_periods=-1:stop_duration=0.10:stop_threshold=-40dB:detection=peak',
        '-codec:a', 'libmp3lame',
        '-b:a', '192k',
        tmpOut,
      ],
      {
        env: { ...process.env, DYLD_LIBRARY_PATH: LIB_DIR },
        stdio: 'ignore',
      }
    );

    if (fs.existsSync(tmpOut)) {
      fs.renameSync(tmpOut, absOutput);
      console.log(`✓ Dead space trimmed: silences > 0.1s cut successfully.`);
    }
  } catch (err) {
    console.log(`[Warning] Silence trim failed (${err.message}), using raw voiceover.`);
  }
}

async function main() {
  const params = parseArgs();
  const apiKey = process.env.ELEVENLABS_API_KEY || process.env.XI_API_KEY;

  console.log('========================================================');
  console.log('🎙️ LIRA ELEVENLABS VOICE ENGINE (CALEB CLONE V1)');
  console.log('========================================================');

  if (!apiKey) {
    console.log('❌ ELEVENLABS_API_KEY not found in environment.\n');
    console.log('To connect ElevenLabs:');
    console.log('1. Get your API Key from https://elevenlabs.io -> Profile -> API Keys');
    console.log('2. Export it in your terminal or add it to .env:');
    console.log('   export ELEVENLABS_API_KEY="your-api-key"');
    console.log('3. Run this script again.');
    console.log('\nCommand example:');
    console.log('  node scripts/generate_voiceover_elevenlabs.js --list-voices --key "your-key"');
    process.exit(1);
  }

  // Handle voice listing
  const voices = await getVoices(apiKey);
  if (params.listVoices) {
    console.log('\nAvailable Voices in your ElevenLabs account:');
    voices.forEach(v => {
      console.log(`• "${v.name}" -> ID: ${v.voice_id} (Category: ${v.category})`);
    });
    return;
  }

  // Resolve voice ID
  let targetVoiceId = params.voiceId;
  if (!targetVoiceId) {
    const matched = voices.find(v => v.name.toLowerCase().includes('caleb') || v.name === CLONE_NAME_TARGET);
    if (matched) {
      targetVoiceId = matched.voice_id;
      console.log(`✓ Auto-detected voice clone: "${matched.name}" (ID: ${targetVoiceId})`);
    } else if (voices.length > 0) {
      targetVoiceId = voices[0].voice_id;
      console.log(`[Info] "${CLONE_NAME_TARGET}" not found by exact name. Using: "${voices[0].name}" (ID: ${targetVoiceId})`);
    } else {
      throw new Error('No voices found in your ElevenLabs account.');
    }
  }

  // Resolve text to speak
  let textToSpeak = params.text;
  if (!textToSpeak && params.jsonPath && fs.existsSync(params.jsonPath)) {
    const json = JSON.parse(fs.readFileSync(params.jsonPath, 'utf-8'));
    if (json.scenes && Array.isArray(json.scenes)) {
      textToSpeak = json.scenes.map(s => s.spokenAudio).filter(Boolean).join(' ');
    }
  }

  if (!textToSpeak) {
    console.log('❌ No text provided. Pass --text "Your script here" or --json "path/to/script.json"');
    process.exit(1);
  }

  // Apply auto emotion tags for v4 if enabled
  if (params.autoTag && params.model.startsWith('eleven_v4')) {
    const rawLen = textToSpeak.length;
    textToSpeak = autoTagEmotions(textToSpeak);
    console.log(`✓ Auto-tagged emotions for Eleven v4 (${rawLen} chars -> ${textToSpeak.length} chars)`);
  }

  console.log(`\nModel: ${params.model}`);
  console.log(`Generating voiceover for text (${textToSpeak.length} chars)...`);
  console.log(`Script with tags:\n"${textToSpeak}"\n`);
  
  await textToSpeech(apiKey, targetVoiceId, textToSpeak, params.out, params.model);
  console.log(`✓ Raw audio saved to: ${params.out}`);

  // Apply dead space cutoff (<= 0.1s)
  trimDeadSpace(params.out, params.out);

  console.log('\n🎉 VOICEOVER GENERATION COMPLETE!');
  console.log(`Final Audio File: ${params.out}`);
}

main().catch(err => {
  console.error('\n❌ Voiceover Generation Failed:', err.message);
  process.exit(1);
});
