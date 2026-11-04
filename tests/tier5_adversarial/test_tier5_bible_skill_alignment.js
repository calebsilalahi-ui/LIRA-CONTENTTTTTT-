/**
 * Tier 5 - Adversarial Test Suite: Bible vs Skill Concordance & Alignment
 * Authoritative sources:
 * - /Users/caleb/Desktop/lira reels/LIRA_ULTIMATE_REEL_AND_CAROUSEL_BIBLE.md
 * - /Users/caleb/.gemini/config/skills/lira-video/SKILL.md
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { PATHS, REEL_SPECS, CAROUSEL_SPECS, AUDIO_SPECS, GUARDRAILS } = require('../helpers/test_constants');

describe('Tier 5 Adversarial: Bible & Skill Concordance Verification', () => {
  const biblePath = PATHS.MASTER_BIBLE;
  const skillPath = PATHS.SKILL_FILE;

  test('Document Existence & Integrity: Both Bible and Skill exist and have substantial content', () => {
    assert.ok(fs.existsSync(biblePath), `Master Bible must exist at ${biblePath}`);
    assert.ok(fs.existsSync(skillPath), `Skill file must exist at ${skillPath}`);
    const bibleStat = fs.statSync(biblePath);
    const skillStat = fs.statSync(skillPath);
    assert.ok(bibleStat.size > 20000, `Bible must be substantial (actual: ${bibleStat.size} bytes)`);
    assert.ok(skillStat.size > 8000, `Skill must be substantial (actual: ${skillStat.size} bytes)`);
  });

  const bible = fs.readFileSync(biblePath, 'utf-8');
  const skill = fs.readFileSync(skillPath, 'utf-8');

  test('Concordance - Canvas Resolutions & Aspect Ratios', () => {
    // Reels: 1080x1920, 9:16, 30fps, 22-35s
    assert.match(bible, /1080\s*[×x]\s*1920/);
    assert.match(skill, /1080\s*[×x]\s*1920/);
    assert.match(bible, /9:16/);
    assert.match(skill, /9:16/);
    assert.match(bible, /30(?:\.0)?\s*fps/);
    assert.match(skill, /30(?:\.0)?\s*fps/);
    assert.match(bible, /22s\s*[-–—]\s*35s/);
    assert.match(skill, /22s\s*[-–—]\s*35s/);

    // Carousels: 1080x1350, 4:5, 6-8 slides, JPEG
    assert.match(bible, /1080\s*[×x]\s*1350/);
    assert.match(skill, /1080\s*[×x]\s*1350/);
    assert.match(bible, /4:5/);
    assert.match(skill, /4:5/);
    assert.match(bible, /6\s*(?:to|[-–—])\s*8\s*slides/i);
    assert.match(skill, /6\s*(?:to|[-–—])\s*8\s*slides/i);
    assert.match(bible, /JPEG/i);
    assert.match(skill, /JPEG/i);
  });

  test('Concordance - Universal Safe Box Dimensions & Coordinates', () => {
    // Safe Box: x:[84,888], y:[288,1248]
    const regexSafe = /\[84,\s*888\].*\[288,\s*1248\]/s;
    assert.match(bible, regexSafe);
    assert.match(skill, regexSafe);

    // Coordinate boundaries breakdown
    assert.ok(bible.includes('288') && bible.includes('1248') && bible.includes('888') && bible.includes('84'));
    assert.ok(skill.includes('288') && skill.includes('1248') && skill.includes('888') && skill.includes('84'));
  });

  test('Concordance - Audio Standards & Loudness Engineering', () => {
    // Integrated loudness: -14 ± 2.0 LUFS
    assert.match(bible, /-14\s*(?:±|\+\/-)?\s*2(?:\.0)?\s*LUFS/);
    assert.match(skill, /-14\s*(?:±|\+\/-)?\s*2(?:\.0)?\s*LUFS/);

    // Speech onset: <= 0.02s (max 0.03s)
    assert.match(bible, /<=\s*0\.02s/);
    assert.match(skill, /<=\s*0\.02s/);
    assert.match(bible, /0\.03s/);
    assert.match(skill, /0\.03s/);

    // BGM ducking: -16dB to -18dB, swell +4dB to +6dB
    assert.match(bible, /-16dB\s*to\s*-18dB/);
    assert.match(skill, /-16dB\s*to\s*-18dB/);
    assert.match(bible, /\+4dB\s*to\s*\+6dB/);
    assert.match(skill, /\+4dB\s*to\s*\+6dB/);

    // Dead air limit: 0.20s (6 frames @ 30fps)
    assert.match(bible, /0\.20s/);
    assert.match(skill, /0\.20s/);

    // Voice clone ID: WVwVlhKdnZoCuTIoxjYr via eleven_v3
    assert.match(bible, /WVwVlhKdnZoCuTIoxjYr/);
    assert.match(skill, /WVwVlhKdnZoCuTIoxjYr/);
    assert.match(bible, /eleven_v3|eleven_multilingual_v3/);
    assert.match(skill, /eleven_v3/);
  });

  test('Concordance - 8 Forensic Root Causes & Drop-Off Fixes', () => {
    // Both documents must detail all 8 fixes:
    const requiredConcepts = [
      'Throat-Clearing',
      '0.67s', // zoom clamp freeze
      'Particle', // particle stream spam
      'Saccadic', // saccadic eye-flow decoupling
      '0.02s', // onset latency
      '-14', // loudness
      '7 PBL', // hook taxonomy
      'Seamless', // loop splice
    ];

    for (const concept of requiredConcepts) {
      assert.ok(bible.includes(concept), `Bible missing forensic concept: ${concept}`);
      assert.ok(skill.includes(concept), `Skill missing forensic concept: ${concept}`);
    }
  });

  test('Concordance - 4-Layer Hook Stacking & Hook Taxonomy', () => {
    // 4 layers at Frame 0: Visual, Written, Verbal, Foley
    const layers = ['Visual', 'Written', 'Verbal', 'Foley'];
    for (const layer of layers) {
      assert.ok(bible.includes(layer), `Bible missing layer: ${layer}`);
      assert.ok(skill.includes(layer), `Skill missing layer: ${layer}`);
    }

    // Subtitle delay timing: ~1.40s (frame 42 @ 30fps)
    assert.match(bible, /1\.40s|frame 42/);
    assert.match(skill, /1\.40s|frame 42/);

    // Headline constraints: <= 6 words, exactly 1 accent word
    assert.match(bible, /<=\s*6\s*words/i);
    assert.match(skill, /<=\s*6\s*words/i);

    // 7 PBL Categories:
    const pblCats = [
      'Educational',
      'Comparison',
      'Myth Busting',
      'Storytelling',
      'Random',
      'Authority',
      'Day in the Life',
    ];
    for (const cat of pblCats) {
      assert.ok(bible.includes(cat), `Bible missing PBL category: ${cat}`);
      assert.ok(skill.includes(cat), `Skill missing PBL category: ${cat}`);
    }
  });

  test('Concordance - Carousel Architecture & Re-Serve Mechanics', () => {
    // Slide 2 standalone re-serve hook <= 12 words
    assert.match(bible, /<=\s*12\s*words/i);
    assert.match(skill, /<=\s*12\s*words/i);

    // High-save comparison/cheat sheet on Slide 6 or 7
    assert.match(bible, /Slide 6|Slide 7/i);
    assert.match(skill, /Slide 6|Slide 7/i);

    // Palette: Emerald (#1D4A38), Cream (#FAF7F0), Gold (#D4AF37), Charcoal (#1F2421)
    const colors = ['#1D4A38', '#FAF7F0', '#D4AF37', '#1F2421'];
    for (const c of colors) {
      assert.ok(bible.includes(c), `Bible missing color ${c}`);
      assert.ok(skill.includes(c), `Skill missing color ${c}`);
    }
  });

  test('Concordance - Brand Guardrails & Leak Prevention', () => {
    // Qualitative scarcity only
    assert.match(bible, /limited batch/i);
    assert.match(skill, /limited batch/i);
    assert.match(bible, /stok terbatas/i);
    assert.match(skill, /stok terbatas/i);

    // Banned terms listed (both unhyphenated or intentionally hyphenated to avoid leak scanner triggering)
    const bannedPatterns = [
      /ceremonial|c-e-r-e-m-o-n-i-a-l/i,
      /WithUs|With-Us/i,
      /JBD|J-B-D/i,
      /HPP|H-P-P/i,
      /COGS|C-O-G-S/i,
      /margin/i,
      /74%|74 percent/i,
      /66%|66 percent/i,
      /War Chest|War-Chest/i,
      /CapEx|Cap-Ex/i,
      /UPH|U-P-H/i,
      /Baranangsiang|Baranang-siang/i,
    ];

    for (const pat of bannedPatterns) {
      assert.match(bible, pat, `Bible missing guardrail pattern for: ${pat}`);
      assert.match(skill, pat, `Skill missing guardrail pattern for: ${pat}`);
    }

    // Zero emojis rule
    assert.match(bible, /Zero (?:Unicode )?Emojis/i);
    assert.match(skill, /Zero (?:Unicode )?Emojis/i);
  });

  test('Concordance - Buffer GraphQL Instagram Protocol', () => {
    assert.match(bible, /6ad933a2778b240e2f81b45d/);
    assert.match(skill, /6ad933a2778b240e2f81b45d/);
    assert.match(bible, /shareNow/);
    assert.match(skill, /shareNow/);
    assert.match(bible, /firstComment/);
    assert.match(skill, /firstComment/);
    assert.match(bible, /collaborators/);
    assert.match(skill, /collaborators/);
    assert.match(bible, /cloudflared/i);
    assert.match(skill, /cloudflared/i);
    assert.match(bible, /--dry-run/);
    assert.match(skill, /--dry-run/);
  });

  test('Adversarial Cross-Check: Neither file contains unescaped unicode emojis', () => {
    const emojiRegex = GUARDRAILS.EMOJI_REGEX;
    
    // Check line by line in Bible
    const bibleLines = bible.split('\n');
    const bibleEmojiViolations = [];
    bibleLines.forEach((l, idx) => {
      // Disregard if line explains emoji ban
      if (emojiRegex.test(l) && !/ban on unicode emojis|warning signs|emojis in scripts/i.test(l)) {
        bibleEmojiViolations.push({ line: idx + 1, content: l });
      }
    });

    assert.strictEqual(bibleEmojiViolations.length, 0,
      `Bible contains unescaped emojis: ${JSON.stringify(bibleEmojiViolations)}`);

    // Check line by line in Skill
    const skillLines = skill.split('\n');
    const skillEmojiViolations = [];
    skillLines.forEach((l, idx) => {
      if (emojiRegex.test(l) && !/ban on unicode emojis|emojis in scripts/i.test(l)) {
        skillEmojiViolations.push({ line: idx + 1, content: l });
      }
    });

    assert.strictEqual(skillEmojiViolations.length, 0,
      `Skill contains unescaped emojis: ${JSON.stringify(skillEmojiViolations)}`);
  });
});
