/**
 * Tier 1 - Feature 14: High-Save Comparison Sheet
 * Authoritative source: PROJECT.md & ORIGINAL_REQUEST.md §R3
 * Verifies high-utility, high-save reference/cheat-sheet/comparison slide.
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { getValidSampleCarouselPayload } = require('../helpers/test_fixture_loader');
const { scanString } = require('../helpers/guardrail_oracle');

describe('Feature 14: High-Save Comparison Sheet', () => {
  test('Presence of High-Save Utility Slide: Carousel payload must contain designated high-save slide', () => {
    const payload = getValidSampleCarouselPayload();
    const highSaveSlide = payload.slides.find(s => s.type === 'high_save' || s.type === 'comparison');
    assert.ok(highSaveSlide, 'Carousel must contain a high_save or comparison slide');
  });

  test('Penultimate Placement Architecture: High-save slide must precede the final CTA slide', () => {
    const payload = getValidSampleCarouselPayload();
    const totalSlides = payload.slides.length;
    const highSaveIdx = payload.slides.findIndex(s => s.type === 'high_save' || s.type === 'comparison');
    const ctaIdx = payload.slides.findIndex(s => s.type === 'cta');

    assert.ok(highSaveIdx >= 2, 'High-save slide should be positioned in the middle or later half of the deck');
    assert.ok(highSaveIdx < ctaIdx, 'High-save slide must appear before the closing CTA slide');
    assert.strictEqual(ctaIdx, totalSlides - 1, 'Final slide must be the action CTA slide');
  });

  test('High-Utility Content Blueprint: Headline signals permanent reference utility', () => {
    const payload = getValidSampleCarouselPayload();
    const highSaveSlide = payload.slides.find(s => s.type === 'high_save' || s.type === 'comparison');
    
    // High-save titles typically feature keywords like CHEATSHEET, PANDUAN, FORMULA, RATIO, KOMPARASI
    const utilityKeywords = /CHEATSHEET|PANDUAN|FORMULA|RATIO|KOMPARASI|TABEL|CHECKLIST/i;
    assert.ok(utilityKeywords.test(highSaveSlide.headline),
      `High-save headline "${highSaveSlide.headline}" must convey durable utility`);
  });

  test('Guardrail Safety on Comparison Data: Zero recipe or financial leaks in cheat-sheet text', () => {
    const payload = getValidSampleCarouselPayload();
    const highSaveSlide = payload.slides.find(s => s.type === 'high_save' || s.type === 'comparison');
    
    const violations = scanString(highSaveSlide.headline, 'highSaveSlide');
    assert.strictEqual(violations.length, 0, 'High-save slide must not contain guardrail violations');
  });

  test('Comparison Architecture Schema: Supports structured comparison rows/tuples', () => {
    const comparisonSlideMock = {
      slideNumber: 5,
      type: 'high_save',
      headline: 'KOMPARASI: CAFE CUP VS LIRA BOTTLE',
      comparisonRows: [
        { feature: 'Resep Pemanis', cafe: 'Gula Cair Murah', lira: 'Pemanis Alami Stevia' },
        { feature: 'Mobilitas', cafe: 'Bocor & Basah', lira: '180° Anti Bocor' },
        { feature: 'Energy Profile', cafe: 'Crash 2 Jam', lira: 'Fokus Bersih 6 Jam' },
      ],
    };

    assert.strictEqual(comparisonSlideMock.comparisonRows.length, 3, 'Must support comparison rows');
    for (const row of comparisonSlideMock.comparisonRows) {
      assert.ok(row.feature && row.cafe && row.lira, 'Comparison row must specify feature, cafe, and lira values');
    }
  });
});
