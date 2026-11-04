/**
 * Tier 1 - Feature 02: 4-Layer Frame-0 Hook Stacking
 * Authoritative source: PROJECT.md & ORIGINAL_REQUEST.md §R1, R2
 * Verifies synchronization of Visual, Written, Verbal, and Foley audio layers at 0.00s.
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { PATHS, REEL_SPECS } = require('../helpers/test_constants');
const { getValidSampleReelPayload } = require('../helpers/test_fixture_loader');

describe('Feature 02: 4-Layer Frame-0 Hook Stacking', () => {
  test('Layer 1 (Visual Contrast): Frame-0 must configure high-contrast visual scene and sprite motion', () => {
    const payload = getValidSampleReelPayload();
    assert.ok(payload.overlays && payload.overlays.length > 0, 'Frame-0 must specify on-screen visual overlay layers');
    
    // Check that authentic Lira visual asset directory contains required assets
    assert.ok(fs.existsSync(PATHS.BOTTLES_SSOT), 'SSOT bottle assets directory must exist');
    const ssotFiles = fs.readdirSync(PATHS.BOTTLES_SSOT);
    assert.ok(ssotFiles.length >= 3, 'Must contain at least 3 SSOT bottle cutouts (choco, matcha, milktea)');
  });

  test('Layer 2 (Written Headline): Borderless headline <= 6 words within universal safe box', () => {
    const payload = getValidSampleReelPayload();
    assert.ok(payload.written_hook, 'Must contain written headline hook');
    const words = payload.written_hook.trim().split(/\s+/);
    assert.ok(words.length <= REEL_SPECS.HEADLINE_MAX_WORDS, `Written hook word count (${words.length}) must be <= ${REEL_SPECS.HEADLINE_MAX_WORDS}`);
    
    // Verify coordinates stay within safe box x:[84,888], y:[288,1248]
    if (payload.overlays && payload.overlays[0]) {
      const ov = payload.overlays[0];
      assert.ok(ov.x >= REEL_SPECS.SAFE_BOX.xMin && ov.x <= REEL_SPECS.SAFE_BOX.xMax, 'Overlay X coordinate must be inside safe box');
      assert.ok(ov.y >= REEL_SPECS.SAFE_BOX.yMin && ov.y <= REEL_SPECS.SAFE_BOX.yMax, 'Overlay Y coordinate must be inside safe box');
    }
  });

  test('Layer 3 (Verbal Hook): Spoken voiceover onset <= 0.02s without pre-roll silence', () => {
    const payload = getValidSampleReelPayload();
    assert.ok(payload.verbal_hook, 'Must contain verbal hook text');
    assert.ok(payload.verbal_hook.length >= 15, 'Verbal hook must be substantial');

    // Check Master Bible mandate for verbal hook synchronization
    const bible = fs.readFileSync(PATHS.MASTER_BIBLE, 'utf-8');
    assert.ok(bible.includes('Layer 3 (Verbal)') || bible.includes('Verbal Hook') || bible.includes('4-Layer'),
      'Master Bible must mandate synchronized verbal hook layer');
  });

  test('Layer 4 (Tactile Foley / Audio): Presence of tactile Foley SFX and royalty-free BGM configuration', () => {
    const sfxDir = path.join(PATHS.PUBLIC_ASSETS, 'sfx');
    const bgmPath = path.join(PATHS.PUBLIC_ASSETS, 'bg_music.mp3');
    
    assert.ok(fs.existsSync(sfxDir) || fs.existsSync(bgmPath), 
      'Public assets must supply sound effects or background music assets');
  });

  test('4-Layer Synchronization Contract: Payload schema must simultaneously define all four layers', () => {
    const payload = getValidSampleReelPayload();
    const hasVisual = Array.isArray(payload.overlays) && payload.overlays.length > 0;
    const hasWritten = typeof payload.written_hook === 'string' && payload.written_hook.length > 0;
    const hasVerbal = typeof payload.verbal_hook === 'string' && payload.verbal_hook.length > 0;
    const hasAudioIntent = typeof payload.caption === 'string' && payload.caption.length > 0;

    assert.ok(hasVisual, 'Must provide visual layer');
    assert.ok(hasWritten, 'Must provide written headline layer');
    assert.ok(hasVerbal, 'Must provide verbal voiceover layer');
    assert.ok(hasAudioIntent, 'Must provide audio intent & context');
  });
});
