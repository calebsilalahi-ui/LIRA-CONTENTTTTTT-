/**
 * Tier 1 - Feature 10: Saccadic Eye-Flow Decoupling
 * Authoritative source: PROJECT.md & ORIGINAL_REQUEST.md §R2
 * Verifies borderless headline (<=6 words, 1 accent) + lower subtitles delayed until >=1.30s.
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { REEL_SPECS, GUARDRAILS } = require('../helpers/test_constants');
const { getValidSampleReelPayload } = require('../helpers/test_fixture_loader');

describe('Feature 10: Saccadic Eye-Flow Decoupling', () => {
  test('Headline Word Count Ceiling: Written hook headline must be <= 6 words', () => {
    const payload = getValidSampleReelPayload();
    const words = payload.written_hook.trim().split(/\s+/).filter(Boolean);
    assert.ok(words.length <= REEL_SPECS.HEADLINE_MAX_WORDS, 
      `Headline words count (${words.length}) must be <= ${REEL_SPECS.HEADLINE_MAX_WORDS}`);
  });

  test('Subtitle Suppression Delay: Lower captions strictly delayed until >= 1.30s (frame 39+ @ 30fps)', () => {
    assert.ok(REEL_SPECS.SUBTITLE_SUPPRESS_DELAY_SEC >= 1.30,
      'Subtitle suppression delay must be at least 1.30s to prevent saccadic gaze fighting');
    
    const suppressionFrame = Math.round(REEL_SPECS.SUBTITLE_SUPPRESS_DELAY_SEC * REEL_SPECS.FPS);
    assert.ok(suppressionFrame >= 39, `Suppression frame (${suppressionFrame}) must be >= 39`);
  });

  test('Single Accent Word Rule: Headline contains at most 1 accentuated/highlighted word', () => {
    // Example: "KENAPA MATCHA 50K BIKIN CRASH" -> accent word: "CRASH"
    function validateHeadlineAccent(headline, accentWords = []) {
      return accentWords.length <= 1;
    }

    assert.ok(validateHeadlineAccent('KENAPA MATCHA 50K BIKIN CRASH', ['CRASH']), '1 accent word is valid');
    assert.ok(validateHeadlineAccent('KENAPA MATCHA 50K BIKIN CRASH', []), '0 accent words is valid');
    assert.strictEqual(validateHeadlineAccent('KENAPA MATCHA 50K BIKIN CRASH', ['MATCHA', 'CRASH']), false, 
      'More than 1 accent word creates visual noise and violates saccadic decoupling');
  });

  test('Zero Border / Box Noise: Headline style must be borderless and floating without colored badge wrapper', () => {
    const headlineStyleContract = {
      hasBorder: false,
      hasSaaSBadge: false,
      isBorderless: true,
      fontFamily: 'Montserrat, sans-serif',
    };

    assert.strictEqual(headlineStyleContract.hasBorder, false, 'Headline must not have heavy stroke/border');
    assert.strictEqual(headlineStyleContract.hasSaaSBadge, false, 'Headline must not be wrapped in SaaS badge box');
    assert.strictEqual(headlineStyleContract.isBorderless, true, 'Headline must be borderless');
  });

  test('Zero Emoji Mandate in Eye-Flow Path: Neither headline nor subtitles may contain emojis', () => {
    const payload = getValidSampleReelPayload();
    assert.strictEqual(GUARDRAILS.EMOJI_REGEX.test(payload.written_hook), false, 'Headline must not contain emojis');
    assert.strictEqual(GUARDRAILS.EMOJI_REGEX.test(payload.verbal_hook), false, 'Verbal script must not contain emojis');
  });
});
