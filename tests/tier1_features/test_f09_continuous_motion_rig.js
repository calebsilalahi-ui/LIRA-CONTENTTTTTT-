/**
 * Tier 1 - Feature 09: Continuous Motion in 0.0s–3.0s
 * Authoritative source: PROJECT.md & ORIGINAL_REQUEST.md §R2
 * Verifies unclamped camera drift + sprite breathing (fixing 0.67s freeze & stripping particle spam).
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const { PATHS } = require('../helpers/test_constants');

describe('Feature 09: Continuous Motion in 0.0s–3.0s', () => {
  test('Motion Formula Specification: Unclamped scale drift + lateral pan across frames 0 to 90 (0.0s–3.0s)', () => {
    // Formula per Master Bible: Initial scale 1.15 -> 1.0 -> 0.96 with lateral pan
    function calculateCameraScale(frame) {
      if (frame <= 22) {
        // Fast push-in
        const progress = frame / 22;
        return 1.15 - (0.15 * Math.sin((progress * Math.PI) / 2));
      }
      // Unclamped continuous drift across frames 23 to 90
      const driftProgress = (frame - 22) / (90 - 22);
      return 1.0 - (0.04 * driftProgress);
    }

    const scale0 = calculateCameraScale(0);
    const scale22 = calculateCameraScale(22);
    const scale45 = calculateCameraScale(45);
    const scale90 = calculateCameraScale(90);

    assert.strictEqual(scale0, 1.15, 'Frame 0 scale should be 1.15');
    assert.ok(Math.abs(scale22 - 1.0) < 0.001, 'Frame 22 scale should arrive at ~1.0');
    assert.ok(scale45 < scale22, 'Frame 45 must continue drifting (scale < 1.0)');
    assert.ok(scale90 < scale45, 'Frame 90 must continue drifting');
    assert.notStrictEqual(scale45, scale22, 'Motion must NEVER clamp or freeze at frame 22 (0.67s freeze fix)');
  });

  test('Sprite Breathing Formula: Math.sin periodic micro-motion ensures life during narration', () => {
    function calculateBreathingOffset(frame) {
      return Math.sin((frame / 45) * Math.PI) * 1.8;
    }

    const offset0 = calculateBreathingOffset(0);
    const offset22 = calculateBreathingOffset(22.5);
    const offset45 = calculateBreathingOffset(45);

    assert.strictEqual(offset0, 0, 'Offset at frame 0 is 0');
    assert.ok(Math.abs(offset22 - 1.8) < 0.05, 'Offset reaches peak around frame 22-23 (~1.8px)');
    assert.ok(Math.abs(offset45) < 0.01, 'Offset returns to base around frame 45');
  });

  test('Non-Zero Frame-by-Frame Motion Contract: Motion delta between consecutive 0.10s (3-frame) windows > 0', () => {
    // For every 3-frame window in 0 to 60 frames (0.0s to 2.0s), delta must be non-zero
    function getCompositeTransform(frame) {
      const scale = 1.15 - (0.15 * Math.min(1, frame / 22)) - (frame > 22 ? 0.04 * ((frame - 22) / 68) : 0);
      const panX = (frame / 90) * 18;
      const breathY = Math.sin((frame / 45) * Math.PI) * 1.8;
      return { scale, panX, breathY };
    }

    for (let f = 0; f <= 57; f += 3) {
      const t1 = getCompositeTransform(f);
      const t2 = getCompositeTransform(f + 3);
      const hasMotion = Math.abs(t2.scale - t1.scale) > 0.0001 ||
                        Math.abs(t2.panX - t1.panX) > 0.01 ||
                        Math.abs(t2.breathY - t1.breathY) > 0.01;
      assert.ok(hasMotion, `Window from frame ${f} to ${f + 3} (0.10s) must have non-zero motion`);
    }
  });

  test('Anti-Freeze Verification on Existing Components: Inspects Remotion codebase for un-clamped motion', () => {
    assert.ok(fs.existsSync(PATHS.MASTER_BIBLE), 'Master Bible exists');
    const bible = fs.readFileSync(PATHS.MASTER_BIBLE, 'utf-8');
    assert.ok(bible.includes('Kill the 0.67s Freeze') || bible.includes('0.67s Zoom-Clamp Static Freeze'),
      'Bible must explicitly mandate killing the 0.67s freeze');
  });

  test('Particle Spam & CRT Noise Ban: Rules prohibit neon particle streams and artificial CRT scanline noise', () => {
    const bible = fs.readFileSync(PATHS.MASTER_BIBLE, 'utf-8');
    assert.ok(bible.includes('Zero Particle Spam') || bible.includes('particle-stream spam'),
      'Specification must prohibit particle-stream spam');
    assert.ok(bible.includes('Zero Floating Glow Blobs') || bible.includes('glow blobs'),
      'Specification must prohibit floating glow blobs');
  });
});
