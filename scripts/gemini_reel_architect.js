#!/usr/bin/env node
/**
 * Lira Gemini Reel Architect & Script Engine
 * 
 * Implements the 7-Pillar Video Architecture & Hook Stacks Framework:
 * 1. Editing Style
 * 2. Topic
 * 3. Format
 * 4. Hooks (Verbal Hook + Visual Hook + Written Hook)
 * 5. CTA
 * 6. Value (SOPs, experiences, client results, stories, mistakes, frameworks, opinions, beliefs)
 * 7. Script Angle
 * 
 * Captions & Pacing Constraints:
 * - Positioned 56% down the center (direct eye-level)
 * - TikTok classic font (bold, sans-serif)
 * - Strictly 2 to 3 words per chunk
 * - Zero emojis and icons
 * - Dead space clamped to <= 0.1s (3 frames @ 30fps)
 * - Un-animated static popups using real screenshots from Google / camera roll
 * 
 * Usage:
 *   node scripts/gemini_reel_architect.js \
 *     --topic "Kenapa cup plastik bikin bangkrut" \
 *     --angle "Contrarian founder confession" \
 *     --format "Reaction + Shot changes"
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Parse CLI flags
function parseArgs() {
  const args = process.argv.slice(2);
  const params = {
    topic: 'Kenapa cup plastik kafe sebenernya ngerugiin lo',
    angle: 'Contrarian tactile comparison & student crunch-time survival',
    format: 'Voiceover + B-roll shot changes + real Google screenshots',
    output: '',
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--topic' && args[i + 1]) params.topic = args[++i];
    if (args[i] === '--angle' && args[i + 1]) params.angle = args[++i];
    if (args[i] === '--format' && args[i + 1]) params.format = args[++i];
    if (args[i] === '--output' && args[i + 1]) params.output = args[++i];
    if (args[i] === '--key' && args[i + 1]) process.env.GEMINI_API_KEY = args[++i];
  }

  return params;
}

const SYSTEM_PROMPT = `You are the Lead Creative Director and Video Architect for LIRA (@drinklira), an Indonesian artisan bottled matcha and oat beverage brand founded by Caleb (17yo Indonesian student founder).

Every video reel you create MUST strictly follow the 7-Part Video Architecture and the 3-Layer Hook Stack Framework.

### THE 7-PART VIDEO ARCHITECTURE:
1. EDITING STYLE: Fast-paced, punchy, 10 FPS retro indie-game pixel art visuals paired with real-world Google search screenshots. Zero dead space (> 0.1 seconds of silence/pause is immediately cut out).
2. TOPIC: The core problem, contrarian realization, or viral thesis.
3. FORMAT: Select from: Voiceover, Talking back and forth, Reactions, Shot changes, Angle changes, Multitasking, Visuals, Greenscreen, Interview, Clone.
4. HOOKS (THE HOOK STACK - 0:00 to 0:03):
   - Verbal Hook: Spoken sentence immediately out loud at 0:00 (e.g., "Not to flex, but I'm pretty fucking good at social media marketing" or "Gua matiin Lira di minimarket").
   - Visual Hook: What is displayed on screen at 0:00 (b-roll shot, social proof, clone, physical inverted bottle test).
   - Written Hook: High-contrast on-screen text hook at 0:00 (e.g. "If I had to start my Instagram from scratch").
5. VALUE: Core substance delivered through: SOPs, personal founder experiences, customer results, authentic stories, costly mistakes, actionable frameworks, unfiltered opinions, and beliefs.
6. SCRIPT ANGLE: The emotional resonance and unique perspective (e.g. college student desk survival, tactile anti-bocor mobility).
7. CTA: Low-friction direct action (e.g., "Batch Sabtu dibuka di bio. Amankan slot sebelum full").

### CRITICAL PRODUCTION RULES:
- CAPTION ENGINE: Captions are placed slightly down the center (56% down from top) so viewers directly see and read them.
- CAPTION CHUNKS: Strictly 2 to 3 words per chunk.
- ZERO EMOJIS & ICONS: Stop using emojis and icons. Use real screenshotted images from Google instead (e.g., Google search queries, Google Maps pins, Google review ratings, verified articles).
- STATIC POPUPS: Any on-screen popups MUST be 100% static and un-animated (no spring/bounce/zoom). Hard cut in, hard cut out.
- PACING: Cut out all dead space. Max pause between speech is strictly 0.1 seconds.

Output the script formatted in clear JSON with:
{
  "editingStyle": "...",
  "topic": "...",
  "format": "...",
  "hookStack": {
    "verbalHook": "...",
    "visualHook": "...",
    "writtenHook": "..."
  },
  "scriptAngle": "...",
  "valuePillars": ["...", "..."],
  "cta": "...",
  "scenes": [
    {
      "sceneIndex": 1,
      "timeRange": "0:00 - 0:03",
      "visualDescription": "...",
      "staticPopup": "Real Google search screenshot: 'es kopi kafe mencair berapa menit'",
      "spokenAudio": "...",
      "captionChunks2to3Words": [
        { "text": "Pernah nggak lo", "highlight": false },
        { "text": "sadar kalau beli", "highlight": false },
        { "text": "cup plastik kafe", "highlight": true }
      ]
    }
  ]
}`;

async function callGemini(promptText) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('\n⚠️ No GEMINI_API_KEY detected in environment.');
    console.warn('To use the live Gemini API, export GEMINI_API_KEY="your_api_key" or pass --key "your_api_key".');
    console.warn('Generating architecture template locally based on your framework...\n');
    return null;
  }

  const payload = JSON.stringify({
    contents: [
      {
        role: 'user',
        parts: [{ text: `${SYSTEM_PROMPT}\n\nTask: Generate a full Lira Reel script for:\nTopic: ${promptText.topic}\nAngle: ${promptText.angle}\nFormat: ${promptText.format}` }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      responseMimeType: "application/json",
    }
  });

  return new Promise((resolve, reject) => {
    const req = https.request(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error) {
            reject(new Error(json.error.message));
          } else {
            const textResponse = json.candidates[0]?.content?.parts[0]?.text;
            resolve(JSON.parse(textResponse));
          }
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
  const params = parseArgs();
  console.log('======================================================');
  console.log('⚡ LIRA 7-PART REEL ARCHITECT (GEMINI LLM ENGINE)');
  console.log('======================================================');
  console.log(`Topic:  ${params.topic}`);
  console.log(`Angle:  ${params.angle}`);
  console.log(`Format: ${params.format}`);
  console.log('------------------------------------------------------');

  let result;
  try {
    result = await callGemini(params);
  } catch (err) {
    console.error('Gemini API call failed:', err.message);
  }

  if (!result) {
    // Fallback baseline architecture conforming 100% to the framework
    result = {
      editingStyle: "10 FPS retro indie-game pixel art, kinetic camera snap, zero dead space (> 0.1s cut)",
      topic: params.topic,
      format: params.format,
      hookStack: {
        verbalHook: "Jujur, lo bayar lima puluh ribu cuma buat megang cup basah seharian?",
        visualHook: "First-person POV b-roll: Cold sweating cup creating soggy water ring ruining assignment notes on MacBook desk.",
        writtenHook: "Kenapa beli cup plastik sebenernya ngerugiin lo"
      },
      scriptAngle: params.angle,
      valuePillars: [
        "SOP / Design: 100% sealed airtight bottle vs disposable dome cup",
        "Cost / Dilution mistake: 70% of takeaway cup volume is melting ice water within 15 minutes",
        "Framework: Real-life mobility test (tote bag toss beside laptop with zero leakage)"
      ],
      cta: "Batch Sabtu ready di bio. Slot terbatas sebelum closed.",
      captionsPlacement: "top: 56% (slightly below center, direct eye line)",
      captionsFont: "Montserrat / TikTok classic bold sans, 2 to 3 words per chunk, zero emojis",
      scenes: [
        {
          sceneIndex: 1,
          timeRange: "0:00 - 0:03",
          visualDescription: "Caleb POV at college desk looking at sweating plastic cup.",
          staticPopup: "Real Google Search screenshot: 'berapa menit es batu kafe mencair'",
          spokenAudio: "Pernah nggak lo sadar kalau beli cup plastik kafe nyusahin hidup?",
          captionChunks2to3Words: [
            { "text": "Pernah nggak lo", "highlight": false },
            { "text": "sadar kalau beli", "highlight": false },
            { "text": "cup plastik kafe", "highlight": true },
            { "text": "nyusahin hidup?", "highlight": true }
          ]
        },
        {
          sceneIndex: 2,
          timeRange: "0:03 - 0:12",
          visualDescription: "Macro close-up of water droplet pooling next to laptop keyboard.",
          staticPopup: "Real Google Review screenshot: 'cup bocor di tas laptop rusak'",
          spokenAudio: "Es mencair lima belas menit. Rasa kopi hilang, tinggal air tawar.",
          captionChunks2to3Words: [
            { "text": "Es mencair dalam", "highlight": false },
            { "text": "lima belas menit.", "highlight": true },
            { "text": "Rasa minuman hilang,", "highlight": false },
            { "text": "tinggal air tawar.", "highlight": true }
          ]
        },
        {
          sceneIndex: 3,
          timeRange: "0:12 - 0:24",
          visualDescription: "Tactile proof: Caleb turns sealed Lira Matcha bottle 180° directly over open MacBook keyboard.",
          staticPopup: "Real camera roll screenshot of clean dry study desk.",
          spokenAudio: "Makanya Lira seratus persen pakai botol segel rapat. Dibalik di atas laptop tetap aman.",
          captionChunks2to3Words: [
            { "text": "Makanya Lira pakai", "highlight": false },
            { "text": "botol segel rapat.", "highlight": true },
            { "text": "Dibalik seratus delapan puluh", "highlight": false },
            { "text": "derajat di atas laptop,", "highlight": true },
            { "text": "zero tetes bocor.", "highlight": true }
          ]
        },
        {
          sceneIndex: 4,
          timeRange: "0:24 - 0:32",
          visualDescription: "Caleb drops bottle into canvas tote bag and slings over shoulder, smiling confidently.",
          staticPopup: "Real Google Maps search screenshot of delivery radius Tangerang.",
          spokenAudio: "Tahan tujuh hari di kulkas. Amankan batch Sabtu di link bio sekarang.",
          captionChunks2to3Words: [
            { "text": "Tahan tujuh hari", "highlight": false },
            { "text": "di kulkas.", "highlight": true },
            { "text": "Amankan batch Sabtu", "highlight": true },
            { "text": "di link bio.", "highlight": false }
          ]
        }
      ]
    };
  }

  const outputPath = params.output || path.join(__dirname, '../src/latest_reel_architecture.json');
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');
  console.log(`✅ Architecture generated and saved to: ${outputPath}`);
  console.log('\nPreview Hook Stack:');
  console.log(`• Verbal Hook:  "${result.hookStack?.verbalHook}"`);
  console.log(`• Visual Hook:  "${result.hookStack?.visualHook}"`);
  console.log(`• Written Hook: "${result.hookStack?.writtenHook}"`);
}

main().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
