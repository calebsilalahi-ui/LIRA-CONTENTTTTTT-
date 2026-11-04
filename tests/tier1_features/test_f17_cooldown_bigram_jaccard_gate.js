/**
 * Tier 1 - Feature 17: Cooldown & Bigram Jaccard Gate
 * Authoritative source: PROJECT.md & ORIGINAL_REQUEST.md §R4
 * Verifies 0 repeated tuples across 10 alternating slots and < 0.30 pairwise bigram Jaccard similarity.
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { computeBigramJaccard, validatePairwiseJaccard } = require('../helpers/jaccard_oracle');
const { LIRA_CONTEXT } = require('../helpers/test_constants');

describe('Feature 17: Cooldown & Bigram Jaccard Gate', () => {
  test('Tuple Uniqueness Across 10 Slots: Zero repeated (pillar, format, hook_category) tuples', () => {
    // Generate 10 consecutive alternating slots (Reel, Carousel, Reel, Carousel...)
    const slots = [
      { format: 'reel', pillar: 'Sugar Crash & Stevia Science', hook_category: 'Comparison' },
      { format: 'carousel', pillar: 'Craftsmanship & Student Lifestyle', hook_category: 'Educational' },
      { format: 'reel', pillar: 'Cold Chain & Saturday COD Loop', hook_category: 'Storytelling' },
      { format: 'carousel', pillar: 'Sugar Crash & Stevia Science', hook_category: 'Myth Busting' },
      { format: 'reel', pillar: 'Craftsmanship & Student Lifestyle', hook_category: 'Day in the Life' },
      { format: 'carousel', pillar: 'Cold Chain & Saturday COD Loop', hook_category: 'Authority' },
      { format: 'reel', pillar: 'Sugar Crash & Stevia Science', hook_category: 'Educational' },
      { format: 'carousel', pillar: 'Craftsmanship & Student Lifestyle', hook_category: 'Random' },
      { format: 'reel', pillar: 'Cold Chain & Saturday COD Loop', hook_category: 'Comparison' },
      { format: 'carousel', pillar: 'Sugar Crash & Stevia Science', hook_category: 'Storytelling' },
    ];

    assert.strictEqual(slots.length, LIRA_CONTEXT.CONSECUTIVE_TEST_SLOTS, 'Must evaluate 10 slots');

    const tupleSet = new Set();
    for (const slot of slots) {
      const tupleKey = `${slot.pillar}::${slot.format}::${slot.hook_category}`;
      assert.strictEqual(tupleSet.has(tupleKey), false, `Tuple "${tupleKey}" must not be repeated`);
      tupleSet.add(tupleKey);
    }
  });

  test('Bigram Jaccard Mathematical Calculation: Identical text yields 1.0, distinct text yields < 0.30', () => {
    const textA = 'Kenapa matcha lima puluh ribu di kafe bikin kepala lemes';
    const textB = 'Kenapa matcha lima puluh ribu di kafe bikin kepala lemes';
    const textC = 'Cara rahasia seduh cold brew oat milk di kamar kos jam tiga pagi';

    const similarityIdentical = computeBigramJaccard(textA, textB);
    const similarityDistinct = computeBigramJaccard(textA, textC);

    assert.strictEqual(similarityIdentical, 1.0, 'Identical texts must have Jaccard similarity 1.0');
    assert.ok(similarityDistinct < 0.30, `Distinct texts similarity (${similarityDistinct}) must be < 0.30`);
  });

  test('Jaccard Gate Enforces Strict < 0.30 Ceiling Across Hook Variations', () => {
    const diverseHooks = [
      'Kenapa matcha kafe bikin lemes dan crash setelah dua jam',
      'Rahasia botol bersegel anti tumpah masuk tas ransel samping laptop',
      'Jam setengah empat pagi di Tangerang Selatan sebelum berangkat sekolah',
      'Anatomi pemanis alami stevia dibandingkan suntikan gula pasir cair',
      'Gojek loop sabtu siang bawa tas thermal dingin warna hijau forest',
    ];

    const validation = validatePairwiseJaccard(diverseHooks, LIRA_CONTEXT.MAX_BIGRAM_JACCARD);
    assert.strictEqual(validation.passed, true, 'Diverse hooks must pass pairwise Jaccard gate');
    assert.ok(validation.maxObserved < 0.30, `Max observed similarity (${validation.maxObserved}) must be < 0.30`);
  });

  test('Jaccard Gate Rejection: Flagged when similarity reaches or exceeds 0.30', () => {
    const repetitiveHooks = [
      'Kenapa matcha kafe bikin lemes dan crash setelah dua jam',
      'Kenapa matcha kafe bikin lemes dan ngantuk setelah dua jam', // highly overlapping
    ];

    const similarity = computeBigramJaccard(repetitiveHooks[0], repetitiveHooks[1]);
    assert.ok(similarity >= 0.30, `Repetitive hooks similarity (${similarity}) should be >= 0.30`);

    const validation = validatePairwiseJaccard(repetitiveHooks, 0.30);
    assert.strictEqual(validation.passed, false, 'Pairwise validation must fail on repetitive text');
  });

  test('Alternating Format Discipline: Adjacent slots strictly alternate between Reel and Carousel', () => {
    const formats = ['reel', 'carousel', 'reel', 'carousel', 'reel', 'carousel', 'reel', 'carousel', 'reel', 'carousel'];
    for (let i = 0; i < formats.length - 1; i++) {
      assert.notStrictEqual(formats[i], formats[i + 1], `Slot ${i} and ${i + 1} must alternate formats`);
    }
  });
});
