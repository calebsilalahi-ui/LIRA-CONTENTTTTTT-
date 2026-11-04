/**
 * Tier 1 - Feature 13: Standalone Slide 2 Re-serve Hook
 * Authoritative source: PROJECT.md & ORIGINAL_REQUEST.md §R3
 * Verifies Slide 2 conversion hook (<=12 words) engineered for Instagram 2nd feed impressions.
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { CAROUSEL_SPECS, GUARDRAILS } = require('../helpers/test_constants');
const { getValidSampleCarouselPayload } = require('../helpers/test_fixture_loader');

describe('Feature 13: Standalone Slide 2 Re-serve Hook', () => {
  test('Slide 2 Word Count Ceiling: Re-serve hook must be <= 12 words', () => {
    const payload = getValidSampleCarouselPayload();
    const slide2 = payload.slides.find(s => s.slideNumber === 2);
    assert.ok(slide2, 'Slide 2 must exist in carousel slides');
    
    const words = slide2.headline.trim().split(/\s+/).filter(Boolean);
    assert.ok(words.length <= CAROUSEL_SPECS.SLIDE2_MAX_WORDS,
      `Slide 2 word count (${words.length}) must be <= ${CAROUSEL_SPECS.SLIDE2_MAX_WORDS}`);
  });

  test('Standalone Semantic Independence: Slide 2 must function as an independent entry point', () => {
    // Slide 2 should not start with continuation pronouns like "Maka dari itu...", "Dan...", "Lalu..."
    const dependentOpenerRegex = /^(?:dan|maka dari itu|lalu|seperti yang tadi dibilang)\b/i;
    
    const payload = getValidSampleCarouselPayload();
    const slide2 = payload.slides.find(s => s.slideNumber === 2);
    assert.strictEqual(dependentOpenerRegex.test(slide2.headline), false,
      'Slide 2 must not rely on a dangling continuation conjunction from Slide 1');
  });

  test('Designated Slide Type: Slide 2 schema defines type "reserve_hook"', () => {
    const payload = getValidSampleCarouselPayload();
    const slide2 = payload.slides.find(s => s.slideNumber === 2);
    assert.strictEqual(slide2.type, 'reserve_hook', 'Slide 2 type must be designated as reserve_hook');
  });

  test('Rejection of Excessive Slide 2 Length: Enforces <= 12 words validation gate', () => {
    function validateSlide2Headline(headline) {
      const words = headline.trim().split(/\s+/).filter(Boolean);
      return words.length <= CAROUSEL_SPECS.SLIDE2_MAX_WORDS;
    }

    const validHook = 'DUA JAM SETELAH MINUM GULA CAIR DARAH LO DROP'; // 9 words
    assert.ok(validateSlide2Headline(validHook), '9 words hook should pass');

    const invalidHook = 'DUA JAM SETELAH MINUM GULA CAIR DARAH LO DROP PARAH SAMPAI KEPALA PUSING BANGET'; // 14 words
    assert.strictEqual(validateSlide2Headline(invalidHook), false, '14 words hook should fail');
  });

  test('Zero Emoji Mandate on Slide 2: Re-serve hook must contain zero unicode emojis', () => {
    const payload = getValidSampleCarouselPayload();
    const slide2 = payload.slides.find(s => s.slideNumber === 2);
    assert.strictEqual(GUARDRAILS.EMOJI_REGEX.test(slide2.headline), false,
      'Slide 2 headline must not contain emojis');
  });
});
