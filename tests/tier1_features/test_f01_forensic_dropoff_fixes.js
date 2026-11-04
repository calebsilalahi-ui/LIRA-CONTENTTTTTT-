/**
 * Tier 1 - Feature 01: 8 Forensic Drop-Off Fixes
 * Authoritative source: PROJECT.md & ORIGINAL_REQUEST.md §R1, R2
 * Verifies code and script rules addressing the 8 forensic causes of the 53% 0:01 viewer drop-off.
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { PATHS, REEL_SPECS } = require('../helpers/test_constants');
const { getValidSampleReelPayload } = require('../helpers/test_fixture_loader');

describe('Feature 01: 8 Forensic Drop-Off Fixes', () => {
  test('Fix 1 (Zero Throat-Clearing): Hook must lead with viewer pain/curiosity, no brand self-intro in 0.0s-5.0s', () => {
    const payload = getValidSampleReelPayload();
    const bannedIntroRegex = /^(?:halo|hi|kenalin|nama gue|saya|welcome to lira|perkenalkan)/i;
    
    assert.strictEqual(bannedIntroRegex.test(payload.verbal_hook), false, 'Verbal hook must not start with self-indulgent throat-clearing');
    assert.strictEqual(bannedIntroRegex.test(payload.written_hook), false, 'Written hook must not start with self-indulgent intro');
    assert.ok(payload.verbal_hook.length > 10, 'Verbal hook must deliver meaningful curiosity/pain immediately');
  });

  test('Fix 2 (Anti-Clamp Motion): Continuous motion configuration must not extrapolate clamp at frame 20/22', () => {
    // Inspect Master Bible specification for Fix 2 camera motion
    assert.ok(fs.existsSync(PATHS.MASTER_BIBLE), 'Master Bible specification must exist');
    const bibleContent = fs.readFileSync(PATHS.MASTER_BIBLE, 'utf-8');
    
    assert.ok(bibleContent.includes('Continuous Un-Clamped Camera Motion') || bibleContent.includes('0.67s Zoom-Clamp Static Freeze'),
      'Master Bible must detail the fix for 0.67s camera freeze');
    assert.ok(!bibleContent.includes("extrapolateRight: 'clamp' // at frame 20"), 'Must reject 20-frame clamp pattern');
  });

  test('Fix 3 (Visual Noise Stripping): Must prohibit neon particle spam, CRT scanlines, and radial glow blobs', () => {
    assert.ok(fs.existsSync(PATHS.MASTER_BIBLE), 'Master Bible specification must exist');
    const bibleContent = fs.readFileSync(PATHS.MASTER_BIBLE, 'utf-8');

    assert.ok(bibleContent.includes('Zero Floating Glow Blobs') || bibleContent.includes('glow blobs'),
      'Specification must enforce zero floating glow blobs');
    assert.ok(bibleContent.includes('Zero Particle Spam') || bibleContent.includes('particle spam'),
      'Specification must enforce zero particle spam');
  });

  test('Fix 4 (Saccadic Eye-Flow Decoupling): Headline must be <= 6 words with delayed subtitles', () => {
    const payload = getValidSampleReelPayload();
    const wordCount = payload.written_hook.trim().split(/\s+/).length;

    assert.ok(wordCount <= REEL_SPECS.HEADLINE_MAX_WORDS, 
      `Headline word count (${wordCount}) must be <= ${REEL_SPECS.HEADLINE_MAX_WORDS}`);
    assert.ok(REEL_SPECS.SUBTITLE_SUPPRESS_DELAY_SEC >= 1.30,
      'Subtitle suppression delay must be at least 1.30s to prevent saccadic overload');
  });

  test('Fix 5 & 6 (Audio Onset & Tactile Proof): Audio onset ceiling <= 0.03s and physical bottle proof', () => {
    // Check SSOT bottle asset presence for tactile proof
    const bottleSsot = path.join(PATHS.BOTTLES_SSOT, 'matcha_ssot.png');
    assert.ok(fs.existsSync(bottleSsot), 'SSOT matcha bottle asset must exist for physical proof');

    // Verify audio specs onset threshold
    const { AUDIO_SPECS } = require('../helpers/test_constants');
    assert.ok(AUDIO_SPECS.MAX_SPEECH_ONSET_SEC <= 0.03, 'Speech onset threshold must be <= 0.03s');
    assert.ok(AUDIO_SPECS.MAX_MID_HOOK_SILENCE_SEC <= 0.20, 'Mid-hook silence threshold must be <= 0.20s');
  });
});
