/**
 * Tier 5 Adversarial Test Suite: Audio Pipeline Edge Cases & Broadcast Standards
 * Authoritative source: ORIGINAL_REQUEST.md §R2 & PROJECT.md
 * 
 * Verifies:
 * 1. Physical rendered sample reel audio verification (EBU R128 & silence detection)
 * 2. Master audio asset verification (sample_reel_audio.mp3)
 * 3. Acoustic onset latency boundary stress (<= 0.03s hard ceiling)
 * 4. Mid-hook silence pause boundary stress (ceiling <= 0.20s in 0.0s-3.0s)
 * 5. EBU R128 integrated loudness boundary tolerance (-14 ± 2.0 LUFS)
 * 6. Royalty-free BGM mandate on production Reel14 engine vs legacy asset audit
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '../..');
const { measureLoudness, detectSilence, probeMedia } = require('../helpers/media_verifier');
const { AUDIO_SPECS, PATHS } = require('../helpers/test_constants');

describe('Tier 5 Adversarial: Audio Pipeline Edge Cases & Broadcast Standards', () => {

  const sampleReelPath = path.join(PROJECT_ROOT, 'out/sample_reel_1080x1920.mp4');
  const masterAudioPath = path.join(PROJECT_ROOT, 'public/assets/sample_reel_audio.mp3');
  const defaultBgmPath = path.join(PROJECT_ROOT, 'public/assets/bg_music.mp3');

  // =========================================================================
  // 1. Physical Rendered Sample Reel Audio Verification
  // =========================================================================
  describe('1. Rendered Sample Reel Audio Verification', () => {
    test('Sample reel MP4 exists and contains valid AAC audio stream', () => {
      assert.ok(fs.existsSync(sampleReelPath), `Sample reel must exist at ${sampleReelPath}`);
      const probe = probeMedia(sampleReelPath);

      assert.strictEqual(probe.hasAudio, true, 'Sample reel must have audio stream');
      assert.strictEqual(probe.audioCodec, 'aac', 'Audio codec must be AAC');
    });

    test('EBU R128 Loudness on rendered reel: Integrated loudness is strictly within -14 ± 2.0 LUFS', () => {
      const loudness = measureLoudness(sampleReelPath);

      assert.ok(typeof loudness.integratedLufs === 'number', 'Must measure numeric integrated LUFS');
      assert.ok(
        loudness.integratedLufs >= -16.0 && loudness.integratedLufs <= -12.0,
        `Measured LUFS ${loudness.integratedLufs} must be within [-16.0, -12.0] LUFS`
      );
      assert.strictEqual(loudness.isCompliant, true, 'Loudness compliance flag must be true');
    });

    test('First speech onset on rendered reel: strictly <= 0.03s (0:01 drop-off elimination)', () => {
      const silence = detectSilence(sampleReelPath);

      assert.ok(typeof silence.firstSpeechOnsetSec === 'number');
      assert.ok(
        silence.firstSpeechOnsetSec <= AUDIO_SPECS.MAX_SPEECH_ONSET_SEC,
        `First speech onset ${silence.firstSpeechOnsetSec}s must be <= ${AUDIO_SPECS.MAX_SPEECH_ONSET_SEC}s`
      );
      assert.strictEqual(silence.isOnsetCompliant, true);
    });

    test('Zero mid-hook pauses > 0.20s in 0.0s–3.0s on rendered reel', () => {
      const silence = detectSilence(sampleReelPath);

      assert.strictEqual(
        silence.midHookSilences.length,
        0,
        `Detected mid-hook pauses > 0.20s in 0-3s: ${JSON.stringify(silence.midHookSilences)}`
      );
      assert.strictEqual(silence.isMidHookCompliant, true);
    });
  });

  // =========================================================================
  // 2. Master Audio Asset Conformance
  // =========================================================================
  describe('2. Master Audio Asset Conformance', () => {
    test('Master voiceover audio file exists and has valid audio specs', () => {
      assert.ok(fs.existsSync(masterAudioPath), `Master audio asset must exist at ${masterAudioPath}`);
      const probe = probeMedia(masterAudioPath);

      assert.strictEqual(probe.hasAudio, true);
      assert.ok(probe.duration >= 20.0, `Audio duration ${probe.duration}s must be >= 20s`);
    });

    test('Master voiceover loudness satisfies broadcast standards', () => {
      const loudness = measureLoudness(masterAudioPath);
      assert.ok(typeof loudness.integratedLufs === 'number');
      assert.ok(loudness.integratedLufs <= -12.0, 'Master dialogue should not clip above -12 LUFS');
    });

    test('Master voiceover silence onset satisfies <= 0.03s standard', () => {
      const silence = detectSilence(masterAudioPath);
      assert.ok(
        silence.firstSpeechOnsetSec <= AUDIO_SPECS.MAX_SPEECH_ONSET_SEC,
        `Master voiceover onset ${silence.firstSpeechOnsetSec}s must be <= 0.03s`
      );
    });
  });

  // =========================================================================
  // 3. Acoustic Onset Latency Boundary Hardening (Synthetic Oracles)
  // =========================================================================
  describe('3. Acoustic Onset Latency Boundary Hardening', () => {
    function evaluateOnsetCompliance(onsetSec, maxCeiling = 0.03) {
      return onsetSec <= maxCeiling;
    }

    test('Onset at 0.00s (instantaneous) is compliant', () => {
      assert.strictEqual(evaluateOnsetCompliance(0.000), true);
    });

    test('Onset at 0.02s (target ceiling) is compliant', () => {
      assert.strictEqual(evaluateOnsetCompliance(0.020), true);
    });

    test('Onset at 0.03s (hard ceiling) is compliant', () => {
      assert.strictEqual(evaluateOnsetCompliance(0.030), true);
    });

    test('Onset at 0.031s (exceeding hard ceiling) is NON-compliant', () => {
      assert.strictEqual(evaluateOnsetCompliance(0.031), false);
    });

    test('Onset at 0.050s (legacy 50ms freeze delay) is NON-compliant', () => {
      assert.strictEqual(evaluateOnsetCompliance(0.050), false);
    });
  });

  // =========================================================================
  // 4. Mid-Hook Silence Dead Air Elimination (Synthetic Oracles)
  // =========================================================================
  describe('4. Mid-Hook Silence Dead Air Elimination', () => {
    function evaluateMidHookPauses(intervals, maxDuration = 0.20, hookWindowSec = 3.0) {
      return intervals.filter(i => i.start < hookWindowSec && i.duration > maxDuration);
    }

    test('Pause of 0.15s at 1.5s (within 0-3s hook window) is compliant', () => {
      const intervals = [{ start: 1.5, end: 1.65, duration: 0.15 }];
      const violations = evaluateMidHookPauses(intervals);
      assert.strictEqual(violations.length, 0);
    });

    test('Pause of 0.20s exactly at 1.0s is compliant (on the boundary)', () => {
      const intervals = [{ start: 1.0, end: 1.20, duration: 0.20 }];
      const violations = evaluateMidHookPauses(intervals);
      assert.strictEqual(violations.length, 0);
    });

    test('Pause of 0.21s at 1.0s (exceeding 0.20s in hook window) is NON-compliant', () => {
      const intervals = [{ start: 1.0, end: 1.21, duration: 0.21 }];
      const violations = evaluateMidHookPauses(intervals);
      assert.strictEqual(violations.length, 1);
    });

    test('Pause of 0.40s at 4.5s (outside 0-3s hook window) is compliant', () => {
      const intervals = [{ start: 4.5, end: 4.90, duration: 0.40 }];
      const violations = evaluateMidHookPauses(intervals);
      assert.strictEqual(violations.length, 0);
    });
  });

  // =========================================================================
  // 5. EBU R128 Integrated Loudness Boundary Tolerance
  // =========================================================================
  describe('5. EBU R128 Integrated Loudness Boundary Tolerance', () => {
    function evaluateLufsCompliance(lufs, target = -14.0, tol = 2.0) {
      const min = target - tol;
      const max = target + tol;
      return lufs >= min && lufs <= max;
    }

    test('Exact target -14.0 LUFS is compliant', () => {
      assert.strictEqual(evaluateLufsCompliance(-14.0), true);
    });

    test('Lower bound -16.0 LUFS is compliant', () => {
      assert.strictEqual(evaluateLufsCompliance(-16.0), true);
    });

    test('Upper bound -12.0 LUFS is compliant', () => {
      assert.strictEqual(evaluateLufsCompliance(-12.0), true);
    });

    test('Too quiet at -16.1 LUFS is NON-compliant', () => {
      assert.strictEqual(evaluateLufsCompliance(-16.1), false);
    });

    test('Too loud at -11.9 LUFS is NON-compliant', () => {
      assert.strictEqual(evaluateLufsCompliance(-11.9), false);
    });
  });

  // =========================================================================
  // 6. Royalty-Free BGM Mandate & Commercial Music Audit
  // =========================================================================
  describe('6. Royalty-Free BGM Mandate & Commercial Music Audit', () => {
    test('Default BGM asset exists and has valid audio duration', () => {
      assert.ok(fs.existsSync(defaultBgmPath), `Default BGM must exist at ${defaultBgmPath}`);
      const probe = probeMedia(defaultBgmPath);
      assert.strictEqual(probe.hasAudio, true);
    });

    test('Production Reel14_ViralEngine strictly references 100% royalty-free audio mix', () => {
      const reel14Code = fs.readFileSync(path.join(PROJECT_ROOT, 'src/Reel14_ViralEngine.tsx'), 'utf-8');
      for (const track of AUDIO_SPECS.PROHIBITED_TRACKS) {
        assert.ok(
          !reel14Code.includes(track),
          `Reel14_ViralEngine must not reference prohibited commercial track "${track}"`
        );
      }
    });

    test('Empirical Audit: Zero residual commercial audio files and zero commercial references in components', () => {
      // Confirm zero presence of commercial audio in public/assets/
      const assetFiles = fs.readdirSync(PATHS.PUBLIC_ASSETS);
      const residualCommercialAssets = assetFiles.filter(f =>
        f.toLowerCase().includes('sweet_boy') || f.toLowerCase().includes('malcolm_todd')
      );

      // Confirm zero legacy components in src/ reference commercial tracks
      const srcFiles = fs.readdirSync(path.join(PROJECT_ROOT, 'src')).filter(f => f.endsWith('.tsx'));
      const legacyReferencingFiles = [];
      for (const file of srcFiles) {
        const content = fs.readFileSync(path.join(PROJECT_ROOT, 'src', file), 'utf-8');
        if (content.includes('malcolm_todd_sweet_boy') || content.includes('sweet_boy')) {
          legacyReferencingFiles.push(file);
        }
      }

      assert.strictEqual(residualCommercialAssets.length, 0, 'No residual commercial assets should exist on disk');
      assert.strictEqual(legacyReferencingFiles.length, 0, 'No components should reference commercial audio assets');
    });
  });
});
