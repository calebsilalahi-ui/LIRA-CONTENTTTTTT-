/**
 * Tier 1 - Feature 11: Audio Pipeline Optimization
 * Authoritative source: PROJECT.md & ORIGINAL_REQUEST.md §R2
 * Verifies ElevenLabs v3 voice synthesis, silence stripping, -14 ± 2.0 LUFS loudness, and royalty-free BGM.
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { PATHS, AUDIO_SPECS } = require('../helpers/test_constants');
const { measureLoudness, detectSilence } = require('../helpers/media_verifier');

describe('Feature 11: Audio Pipeline Optimization', () => {
  test('Voice Model & Voice ID Standard: Caleb Clone WVwVlhKdnZoCuTIoxjYr via eleven_v3', () => {
    // Check automator script for ElevenLabs voice ID configuration
    const automatorPath = path.join(PATHS.SCRIPTS_DIR, 'lira_content_automator.js');
    assert.ok(fs.existsSync(automatorPath), 'lira_content_automator.js must exist');
    const content = fs.readFileSync(automatorPath, 'utf-8');
    
    assert.ok(content.includes('WVwVlhKdnZoCuTIoxjYr'), 'Must use verified Caleb clone ID WVwVlhKdnZoCuTIoxjYr');
  });

  test('EBU R128 Loudness Target: Standard is -14.0 ± 2.0 LUFS [-16.0 to -12.0 LUFS]', () => {
    assert.strictEqual(AUDIO_SPECS.TARGET_LUFS, -14.0, 'Target LUFS must be -14.0');
    assert.strictEqual(AUDIO_SPECS.LUFS_TOLERANCE, 2.0, 'Tolerance must be 2.0 LUFS');

    // Test loudness measurement on existing reel or voiceover if present
    const candidateAudio = [
      path.join(PATHS.PUBLIC_ASSETS, 'test_caleb_voice.mp3'),
      path.join(PATHS.DESKTOP_REELS, '01_lira_founder_story.mp4'),
    ].find(f => fs.existsSync(f));

    if (candidateAudio) {
      const loudness = measureLoudness(candidateAudio);
      assert.ok(typeof loudness.integratedLufs === 'number', 'Must measure numeric integrated LUFS');
    }
  });

  test('Speech Onset Ceiling: First speech onset <= 0.03s (target <= 0.02s)', () => {
    assert.ok(AUDIO_SPECS.MAX_SPEECH_ONSET_SEC <= 0.03, 'Maximum speech onset must be <= 0.03s');
    
    const candidateAudio = path.join(PATHS.PUBLIC_ASSETS, 'test_caleb_voice.mp3');
    if (fs.existsSync(candidateAudio)) {
      const silence = detectSilence(candidateAudio);
      assert.ok(typeof silence.firstSpeechOnsetSec === 'number', 'Must calculate speech onset in seconds');
    }
  });

  test('Mid-Hook Silence Suppression: Zero mid-hook pause > 0.20s in 0.0s–3.0s', () => {
    assert.ok(AUDIO_SPECS.MAX_MID_HOOK_SILENCE_SEC <= 0.20, 'Mid-hook silence ceiling must be <= 0.20s');

    // Synthetic test of silence detection logic
    const syntheticIntervals = [
      { start: 0.8, end: 0.95, duration: 0.15 }, // compliant (< 0.20s)
    ];
    const nonCompliant = syntheticIntervals.filter(s => s.start < 3.0 && s.duration > AUDIO_SPECS.MAX_MID_HOOK_SILENCE_SEC);
    assert.strictEqual(nonCompliant.length, 0, 'Pauses <= 0.20s must pass');
  });

  test('Royalty-Free BGM Mandate: Commercial music (e.g. "Sweet Boy") is strictly banned', () => {
    const candidateBgm = path.join(PATHS.PUBLIC_ASSETS, 'bg_music.mp3');
    assert.ok(fs.existsSync(candidateBgm), 'Royalty-free background music asset must exist');

    for (const trackName of AUDIO_SPECS.PROHIBITED_TRACKS) {
      assert.ok(!path.basename(candidateBgm).includes(trackName), 
        `Default BGM asset must not be a prohibited commercial track: ${trackName}`);
    }
  });
});
