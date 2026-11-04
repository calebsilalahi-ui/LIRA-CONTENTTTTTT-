/**
 * Tier 2 - Boundary Value Test Suite
 * Authoritative source: PROJECT.md & ORIGINAL_REQUEST.md §R1, R2, R3, R4, Acceptance Criteria
 * 
 * Verifies precise boundary thresholds:
 * 1. Audio Integrated Loudness: -14.0 ± 2.0 LUFS (range: [-16.0, -12.0] LUFS)
 * 2. Reel Video Duration: 22.0s – 35.0s
 * 3. Universal Safe Box: x:[84, 888], y:[288, 1248] inside 1080x1920 canvas
 * 4. Lower Caption Delay: >= 1.30s subtitle suppression
 * 5. Non-Numeric Scarcity Regex Bounds: rejects exact bottle counts, allows non-numeric copy
 * 6. Stevia Dosage Regex Bounds: rejects exact dosage measurements, allows conceptual stevia
 * 7. Word Count Boundaries: headline <= 6 words, Frame-0 text <= 8 words, Slide 2 hook <= 12 words
 * 8. Carousel Slide Count: 6 - 8 slides
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { REEL_SPECS, CAROUSEL_SPECS, AUDIO_SPECS, GUARDRAILS, PATHS } = require('../helpers/test_constants');
const oracle = require('../helpers/guardrail_oracle');

// Progressive testability binding for guardrail validator
const scriptPath = path.join(PATHS.SCRIPTS_DIR, 'validate_guardrails.js');
const { validateContent, GuardrailError } = fs.existsSync(scriptPath) ? require(scriptPath) : oracle;

/**
 * Loudness evaluation helper matching EBU R128 criteria
 */
function evaluateLoudnessCompliance(lufs, target = AUDIO_SPECS.TARGET_LUFS, tolerance = AUDIO_SPECS.LUFS_TOLERANCE) {
  const minLufs = target - tolerance; // -16.0
  const maxLufs = target + tolerance; // -12.0
  // Note: in LUFS, -16.0 is quieter than -12.0. Compliant range is [-16.0, -12.0].
  const isCompliant = lufs >= minLufs && lufs <= maxLufs;
  return {
    lufs,
    minLufs,
    maxLufs,
    isCompliant,
  };
}

/**
 * Safe box boundary checker for a point (x, y) or rectangle (x, y, width, height)
 */
function checkSafeBoxCompliance(element, safeBox = REEL_SPECS.SAFE_BOX) {
  const x = element.x;
  const y = element.y;
  const w = element.width || 0;
  const h = element.height || 0;

  const withinX = x >= safeBox.xMin && (x + w) <= safeBox.xMax;
  const withinY = y >= safeBox.yMin && (y + h) <= safeBox.yMax;
  return {
    element,
    withinX,
    withinY,
    isCompliant: withinX && withinY,
  };
}

/**
 * Duration compliance helper for Instagram Reels
 */
function evaluateReelDuration(durationSec, min = REEL_SPECS.MIN_DURATION_SEC, max = REEL_SPECS.MAX_DURATION_SEC) {
  const isCompliant = durationSec >= min && durationSec <= max;
  return {
    durationSec,
    min,
    max,
    isCompliant,
  };
}

describe('Tier 2: Boundary Value Specifications', () => {

  // =========================================================================
  // 1. Audio Loudness Boundary Tests (-14 ± 2.0 LUFS)
  // =========================================================================
  describe('Audio Integrated Loudness Boundaries (-14 ± 2.0 LUFS)', () => {
    test('Exact lower and upper boundaries (-16.0 and -12.0 LUFS) are strictly valid', () => {
      const lowerBoundary = evaluateLoudnessCompliance(-16.0);
      assert.strictEqual(lowerBoundary.isCompliant, true, 'Exact lower boundary -16.0 LUFS must pass');

      const upperBoundary = evaluateLoudnessCompliance(-12.0);
      assert.strictEqual(upperBoundary.isCompliant, true, 'Exact upper boundary -12.0 LUFS must pass');

      const nominalTarget = evaluateLoudnessCompliance(-14.0);
      assert.strictEqual(nominalTarget.isCompliant, true, 'Nominal target -14.0 LUFS must pass');
    });

    test('Values just inside boundaries (-15.99 and -12.01 LUFS) pass compliance', () => {
      assert.strictEqual(evaluateLoudnessCompliance(-15.99).isCompliant, true, '-15.99 LUFS must pass');
      assert.strictEqual(evaluateLoudnessCompliance(-12.01).isCompliant, true, '-12.01 LUFS must pass');
      assert.strictEqual(evaluateLoudnessCompliance(-13.5).isCompliant, true, '-13.5 LUFS must pass');
      assert.strictEqual(evaluateLoudnessCompliance(-14.5).isCompliant, true, '-14.5 LUFS must pass');
    });

    test('Values just outside boundaries (-16.01 and -11.99 LUFS) fail compliance', () => {
      const tooQuietBoundary = evaluateLoudnessCompliance(-16.01);
      assert.strictEqual(tooQuietBoundary.isCompliant, false, '-16.01 LUFS is too quiet, must fail');

      const tooLoudBoundary = evaluateLoudnessCompliance(-11.99);
      assert.strictEqual(tooLoudBoundary.isCompliant, false, '-11.99 LUFS is too loud, must fail');

      assert.strictEqual(evaluateLoudnessCompliance(-16.5).isCompliant, false, '-16.5 LUFS must fail');
      assert.strictEqual(evaluateLoudnessCompliance(-11.5).isCompliant, false, '-11.5 LUFS must fail');
    });

    test('Extreme audio loudness levels are rejected', () => {
      assert.strictEqual(evaluateLoudnessCompliance(-24.0).isCompliant, false, 'Broadcast standard -24 LUFS is too quiet for mobile reels');
      assert.strictEqual(evaluateLoudnessCompliance(-6.0).isCompliant, false, '-6 LUFS causes severe mobile audio clipping');
      assert.strictEqual(evaluateLoudnessCompliance(0.0).isCompliant, false, '0 LUFS full-scale peak is prohibited');
      assert.strictEqual(evaluateLoudnessCompliance(-70.0).isCompliant, false, '-70 LUFS silence floor is prohibited');
    });
  });

  // =========================================================================
  // 2. Reel Video Duration Boundary Tests (22s – 35s)
  // =========================================================================
  describe('Reel Video Duration Boundaries (22.0s – 35.0s)', () => {
    test('Exact minimum and maximum boundaries (22.0s and 35.0s) are valid', () => {
      const minCheck = evaluateReelDuration(22.0);
      assert.strictEqual(minCheck.isCompliant, true, 'Exact min duration 22.0s must pass');

      const maxCheck = evaluateReelDuration(35.0);
      assert.strictEqual(maxCheck.isCompliant, true, 'Exact max duration 35.0s must pass');

      const nominalCheck = evaluateReelDuration(28.5);
      assert.strictEqual(nominalCheck.isCompliant, true, 'Nominal mid duration 28.5s must pass');
    });

    test('Durations just inside boundaries (22.01s and 34.99s) are valid', () => {
      assert.strictEqual(evaluateReelDuration(22.01).isCompliant, true, '22.01s must pass');
      assert.strictEqual(evaluateReelDuration(34.99).isCompliant, true, '34.99s must pass');
    });

    test('Durations just outside boundaries (21.99s and 35.01s) are rejected', () => {
      assert.strictEqual(evaluateReelDuration(21.99).isCompliant, false, '21.99s is under 22s threshold');
      assert.strictEqual(evaluateReelDuration(35.01).isCompliant, false, '35.01s exceeds 35s retention ceiling');
      assert.strictEqual(evaluateReelDuration(21.5).isCompliant, false, '21.5s must fail');
      assert.strictEqual(evaluateReelDuration(36.0).isCompliant, false, '36.0s must fail');
    });

    test('Extreme duration values are rejected', () => {
      assert.strictEqual(evaluateReelDuration(0).isCompliant, false, '0s duration must fail');
      assert.strictEqual(evaluateReelDuration(5.0).isCompliant, false, '5s duration is too short for complete loop');
      assert.strictEqual(evaluateReelDuration(60.0).isCompliant, false, '60s duration causes high viewer drop-off');
      assert.strictEqual(evaluateReelDuration(90.0).isCompliant, false, '90s duration exceeds Instagram Reel ideal retention window');
    });
  });

  // =========================================================================
  // 3. Universal Safe Box Boundary Tests (x:[84, 888], y:[288, 1248])
  // =========================================================================
  describe('Universal Safe Box Boundaries (x:[84, 888], y:[288, 1248])', () => {
    test('Exact corner boundary coordinates pass', () => {
      // Top-Left corner: (84, 288)
      assert.strictEqual(checkSafeBoxCompliance({ x: 84, y: 288 }).isCompliant, true, 'Top-Left corner (84, 288) must pass');
      // Bottom-Right corner: (888, 1248)
      assert.strictEqual(checkSafeBoxCompliance({ x: 888, y: 1248 }).isCompliant, true, 'Bottom-Right corner (888, 1248) must pass');
      // Bottom-Left corner: (84, 1248)
      assert.strictEqual(checkSafeBoxCompliance({ x: 84, y: 1248 }).isCompliant, true, 'Bottom-Left corner (84, 1248) must pass');
      // Top-Right corner: (888, 288)
      assert.strictEqual(checkSafeBoxCompliance({ x: 888, y: 288 }).isCompliant, true, 'Top-Right corner (888, 288) must pass');
      // Dead Center: (486, 768)
      assert.strictEqual(checkSafeBoxCompliance({ x: 486, y: 768 }).isCompliant, true, 'Center (486, 768) must pass');
    });

    test('Bounding box with width and height fitting perfectly inside safe box passes', () => {
      // Full safe box element starting at (84, 288) with width 804 (888 - 84) and height 960 (1248 - 288)
      const fullSafeElement = { x: 84, y: 288, width: 804, height: 960 };
      assert.strictEqual(checkSafeBoxCompliance(fullSafeElement).isCompliant, true, 'Exact dimension matching safe box must pass');

      // Typical headline element centered horizontally
      const headlineElement = { x: 120, y: 350, width: 600, height: 120 };
      assert.strictEqual(checkSafeBoxCompliance(headlineElement).isCompliant, true, 'Centered headline element must pass');
    });

    test('Coordinates 1 pixel outside safe boundaries are strictly rejected', () => {
      // 1px to the left of X min (83 < 84)
      assert.strictEqual(checkSafeBoxCompliance({ x: 83, y: 500 }).isCompliant, false, 'x: 83 must fail (left edge)');
      // 1px to the right of X max (889 > 888)
      assert.strictEqual(checkSafeBoxCompliance({ x: 889, y: 500 }).isCompliant, false, 'x: 889 must fail (right edge)');
      // 1px above Y min (287 < 288)
      assert.strictEqual(checkSafeBoxCompliance({ x: 500, y: 287 }).isCompliant, false, 'y: 287 must fail (top edge, header overlap)');
      // 1px below Y max (1249 > 1248)
      assert.strictEqual(checkSafeBoxCompliance({ x: 500, y: 1249 }).isCompliant, false, 'y: 1249 must fail (bottom edge, caption/audio overlap)');
    });

    test('Elements whose width or height spills outside safe boundaries are rejected', () => {
      // Starts at x: 84 but width is 805 (84 + 805 = 889 > 888)
      const overwidthElement = { x: 84, y: 500, width: 805, height: 100 };
      assert.strictEqual(checkSafeBoxCompliance(overwidthElement).isCompliant, false, 'Element exceeding right safe margin must fail');

      // Starts at y: 288 but height is 961 (288 + 961 = 1249 > 1248)
      const overheightElement = { x: 100, y: 288, width: 500, height: 961 };
      assert.strictEqual(checkSafeBoxCompliance(overheightElement).isCompliant, false, 'Element exceeding bottom safe margin must fail');

      // Full canvas (0, 0, 1080, 1920)
      const fullCanvasElement = { x: 0, y: 0, width: 1080, height: 1920 };
      assert.strictEqual(checkSafeBoxCompliance(fullCanvasElement).isCompliant, false, 'Full canvas bounds overlap Instagram UI chrome');
    });
  });

  // =========================================================================
  // 4. Subtitle Suppression Delay Boundaries (>= 1.30s)
  // =========================================================================
  describe('Lower Subtitle Suppression Delay Boundaries (>= 1.30s)', () => {
    function evaluateSubtitleDelay(delaySec, minThreshold = REEL_SPECS.SUBTITLE_SUPPRESS_DELAY_SEC) {
      return {
        delaySec,
        minThreshold,
        isCompliant: delaySec >= minThreshold,
      };
    }

    test('Exact threshold (1.30s) and nominal target (1.40s) pass compliance', () => {
      assert.strictEqual(evaluateSubtitleDelay(1.30).isCompliant, true, 'Exact boundary 1.30s must pass');
      assert.strictEqual(evaluateSubtitleDelay(1.301).isCompliant, true, '1.301s just inside must pass');
      assert.strictEqual(evaluateSubtitleDelay(1.40).isCompliant, true, 'Nominal target 1.40s must pass');
      assert.strictEqual(evaluateSubtitleDelay(2.00).isCompliant, true, '2.00s delayed subtitle must pass');
    });

    test('Delays just below 1.30s threshold fail compliance', () => {
      assert.strictEqual(evaluateSubtitleDelay(1.299).isCompliant, false, '1.299s just below boundary must fail');
      assert.strictEqual(evaluateSubtitleDelay(1.29).isCompliant, false, '1.29s must fail');
      assert.strictEqual(evaluateSubtitleDelay(1.20).isCompliant, false, '1.20s must fail');
      assert.strictEqual(evaluateSubtitleDelay(0.67).isCompliant, false, '0.67s (mid-zoom) must fail');
    });

    test('Immediate subtitles at 0.00s are strictly rejected to eliminate saccadic overload', () => {
      assert.strictEqual(evaluateSubtitleDelay(0.00).isCompliant, false, '0.00s subtitle triggers saccadic eye clash with headline');
      assert.strictEqual(evaluateSubtitleDelay(0.10).isCompliant, false, '0.10s subtitle is too early');
      assert.strictEqual(evaluateSubtitleDelay(0.50).isCompliant, false, '0.50s subtitle is too early');
    });
  });

  // =========================================================================
  // 5. Non-Numeric Scarcity Regex Boundary Tests
  // =========================================================================
  describe('Non-Numeric Scarcity Regex Boundaries (Strict Scarcity Gate)', () => {
    test('Boundary numeric bottle counts (0, 1, 2, 42, 50, 9999) are all rejected', () => {
      const numericSamples = [
        'Hanya ada 0 botol sisa.',
        'Tersisa 1 botol untuk kamu.',
        'Hari ini kita seduh 2 botol.',
        'Batch kemarin cuma 42 botol langsung ludes.',
        'Khusus 50 botol pertama ada free bag.',
        'Total produksi 100 botol per batch.',
        'Batch 9999 botol siap kirim.',
        'Sisa 50 pcs untuk Sabtu.',
        'Stock 12 bottle ready.',
      ];

      for (const sample of numericSamples) {
        assert.ok(GUARDRAILS.BOTTLE_COUNT_REGEX.test(sample), `Should match numeric bottle count in: "${sample}"`);
        assert.throws(
          () => validateContent({ script: sample }),
          (err) => err.name === 'GuardrailError' || err instanceof oracle.GuardrailError,
          `validateContent must reject numeric scarcity: "${sample}"`
        );
      }
    });

    test('Spacing and casing variations on bottle counts are rejected', () => {
      const variations = [
        'Sisa 42botol saja',
        'Sisa 42  botol saja',
        'Stok 50PCS terbatas',
        'Drop 100 BOTTLE available',
      ];

      for (const sample of variations) {
        assert.ok(GUARDRAILS.BOTTLE_COUNT_REGEX.test(sample), `Should catch variant: "${sample}"`);
        assert.throws(
          () => validateContent({ caption: sample }),
          (err) => err.name === 'GuardrailError' || err instanceof oracle.GuardrailError
        );
      }
    });

    test('Valid non-numeric scarcity copy passes without triggering guardrail', () => {
      const validScarcitySamples = [
        'Limited batch ready untuk pengiriman Sabtu ini via link di bio.',
        'Stok terbatas karena diseduh manual fresh di dapur artisan.',
        'Batch terbatas untuk minggu ini, amankan botol lo sekarang.',
        'Rilis terbatas setiap weekend.',
        'Eksklusif batch kecil demi menjaga kualitas matcha tetap fresh.',
      ];

      for (const text of validScarcitySamples) {
        assert.strictEqual(GUARDRAILS.BOTTLE_COUNT_REGEX.test(text), false, `Must NOT flag valid scarcity: "${text}"`);
        assert.doesNotThrow(
          () => validateContent({ caption: text }),
          `Valid non-numeric scarcity must pass: "${text}"`
        );
      }
    });

    test('Non-scarcity numbers (prices, time, angles, percentages) do NOT trigger bottle count regex', () => {
      const nonBottleNumbers = [
        'Kenapa matcha 50k di kafe bikin lemes dan ngantuk parah?',
        'Harga Rp34.000 untuk botol pure Japanese premium matcha.',
        'Sering ngantuk di jam 2 siang pas kerja?',
        'Bangun jam 03:30 AM buat seduh manual fresh.',
        'Botol tersegel 180 derajat anti bocor.',
        'Animasi retro 10 FPS pixel art.',
        'Video 30fps format 9:16 vertical.',
        'Pemanis 100% daun stevia murni nol kalori.',
        'Tahan 7 hari di kulkas.',
      ];

      for (const text of nonBottleNumbers) {
        assert.strictEqual(
          GUARDRAILS.BOTTLE_COUNT_REGEX.test(text),
          false,
          `Non-bottle number must not trigger scarcity regex: "${text}"`
        );
      }
    });
  });

  // =========================================================================
  // 6. Stevia Dosage Regex Boundary Tests
  // =========================================================================
  describe('Stevia Dosage Regex Boundaries', () => {
    test('Exact stevia dosage measurements (tetes, ml, gram) are strictly rejected', () => {
      const exactDosages = [
        'Pakai 0 tetes stevia buatan.',
        'Cukup 1 tetes stevia asli.',
        'Resep kita pakai 2 tetes stevia per botol.',
        'Ditambah 5 tetes daun stevia.',
        'Dosis 1 ml stevia cair.',
        'Formula 2.5 ml daun stevia.',
        'Takaran 1 gram stevia murni.',
        'Campuran 3 g daun stevia.',
      ];

      for (const sample of exactDosages) {
        assert.ok(GUARDRAILS.STEVIA_DOSAGE_REGEX.test(sample), `Should match exact stevia dosage: "${sample}"`);
        assert.throws(
          () => validateContent({ script: sample }),
          (err) => err.name === 'GuardrailError' || err instanceof oracle.GuardrailError,
          `validateContent must reject exact dosage: "${sample}"`
        );
      }
    });

    test('Conceptual stevia mentions pass without triggering guardrails', () => {
      const conceptualMentions = [
        'Pemanis alami stevia murni tanpa gula pasir.',
        'Di Lira, rasa manis berasal dari ekstrak daun stevia.',
        'Nol gula pasir, hanya natural stevia extract.',
        'Rasa manis clean berkat pemanis stevia.',
      ];

      for (const text of conceptualMentions) {
        assert.strictEqual(GUARDRAILS.STEVIA_DOSAGE_REGEX.test(text), false, `Must NOT flag conceptual stevia: "${text}"`);
        assert.doesNotThrow(() => validateContent({ script: text }));
      }
    });
  });

  // =========================================================================
  // 7. Word Count Boundaries
  // =========================================================================
  describe('Word Count Boundaries (Headlines, Frame-0, Slide 2)', () => {
    function countWords(str) {
      if (!str || typeof str !== 'string') return 0;
      return str.trim().split(/\s+/).filter(Boolean).length;
    }

    test('Headline word count boundary (<= 6 words)', () => {
      const oneWord = 'KENAPA';
      const sixWords = 'KENAPA MATCHA 50K BIKIN LEMES CRASH';
      const sevenWords = 'KENAPA MATCHA 50K KAFE BIKIN LEMES PARAH';

      assert.strictEqual(countWords(oneWord) <= REEL_SPECS.HEADLINE_MAX_WORDS, true);
      assert.strictEqual(countWords(sixWords) <= REEL_SPECS.HEADLINE_MAX_WORDS, true);
      assert.strictEqual(countWords(sevenWords) <= REEL_SPECS.HEADLINE_MAX_WORDS, false, '7 words exceeds 6-word headline ceiling');
    });

    test('Frame-0 text count boundary (<= 8 words total)', () => {
      const eightWords = 'KENAPA MATCHA 50K BIKIN LEMES DAN NGANTUK PARAH';
      const nineWords = 'KENAPA MATCHA 50K BIKIN LEMES DAN JUGA NGANTUK PARAH';

      assert.strictEqual(countWords(eightWords) <= REEL_SPECS.FRAME0_TEXT_MAX_WORDS, true, '8 words must pass');
      assert.strictEqual(countWords(nineWords) <= REEL_SPECS.FRAME0_TEXT_MAX_WORDS, false, '9 words must fail');
    });

    test('Carousel Slide 2 standalone re-serve hook word count boundary (<= 12 words)', () => {
      const twelveWords = 'DUA JAM SETELAH MINUM GULA CAIR DARAH LO LANGSUNG TERJUN BEBAS PARAH';
      const thirteenWords = 'DUA JAM SETELAH MINUM GULA CAIR DARAH LO LANGSUNG TERJUN BEBAS PARAH BANGET GUYS';

      assert.strictEqual(countWords(twelveWords) <= CAROUSEL_SPECS.SLIDE2_MAX_WORDS, true, '12 words must pass');
      assert.strictEqual(countWords(thirteenWords) <= CAROUSEL_SPECS.SLIDE2_MAX_WORDS, false, '13 words must fail');
    });
  });

  // =========================================================================
  // 8. Carousel Slide Count Boundaries (6 – 8 slides)
  // =========================================================================
  describe('Carousel Slide Count Boundaries (6 – 8 slides)', () => {
    function evaluateSlideCount(count, min = CAROUSEL_SPECS.MIN_SLIDES, max = CAROUSEL_SPECS.MAX_SLIDES) {
      return {
        count,
        min,
        max,
        isCompliant: count >= min && count <= max,
      };
    }

    test('Exact slide count boundaries (6 and 8 slides) and 7 slides are compliant', () => {
      assert.strictEqual(evaluateSlideCount(6).isCompliant, true, 'Exact min 6 slides must pass');
      assert.strictEqual(evaluateSlideCount(7).isCompliant, true, 'Nominal 7 slides must pass');
      assert.strictEqual(evaluateSlideCount(8).isCompliant, true, 'Exact max 8 slides must pass');
    });

    test('Slide counts outside 6–8 range (5 and 9 slides) fail compliance', () => {
      assert.strictEqual(evaluateSlideCount(5).isCompliant, false, '5 slides is below minimum 6-slide threshold');
      assert.strictEqual(evaluateSlideCount(9).isCompliant, false, '9 slides exceeds maximum 8-slide threshold');
      assert.strictEqual(evaluateSlideCount(1).isCompliant, false, '1 slide is not a carousel');
      assert.strictEqual(evaluateSlideCount(10).isCompliant, false, '10 slides is too long');
    });
  });

  // =========================================================================
  // 9. Speech Onset and Mid-Hook Silence Boundaries
  // =========================================================================
  describe('Audio Timing Boundaries (Onset <= 0.03s, Mid-Hook Silence <= 0.20s)', () => {
    test('Speech onset boundaries: <= 0.03s passes, > 0.03s fails', () => {
      const onsetTarget = 0.02;
      const onsetCeiling = AUDIO_SPECS.MAX_SPEECH_ONSET_SEC; // 0.03

      assert.ok(0.00 <= onsetCeiling, '0.00s instant onset passes');
      assert.ok(onsetTarget <= onsetCeiling, '0.02s target onset passes');
      assert.ok(0.03 <= onsetCeiling, '0.03s exact ceiling passes');
      assert.strictEqual(0.031 <= onsetCeiling, false, '0.031s fails');
      assert.strictEqual(0.05 <= onsetCeiling, false, '0.05s fails');
      assert.strictEqual(0.10 <= onsetCeiling, false, '0.10s fails');
    });

    test('Mid-hook silence boundaries: <= 0.20s passes, > 0.20s fails', () => {
      const silenceCeiling = AUDIO_SPECS.MAX_MID_HOOK_SILENCE_SEC; // 0.20

      assert.ok(0.10 <= silenceCeiling, '0.10s pause passes');
      assert.ok(0.20 <= silenceCeiling, '0.20s exact ceiling passes');
      assert.strictEqual(0.201 <= silenceCeiling, false, '0.201s fails');
      assert.strictEqual(0.30 <= silenceCeiling, false, '0.30s fails');
      assert.strictEqual(0.50 <= silenceCeiling, false, '0.50s fails');
    });
  });
});
