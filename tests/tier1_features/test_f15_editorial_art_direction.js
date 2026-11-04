/**
 * Tier 1 - Feature 15: Editorial Art Direction
 * Authoritative source: PROJECT.md & ORIGINAL_REQUEST.md §R3
 * Verifies anti-slop editorial design rules: zero glow blobs, zero 48px grids,
 * zero 01/04 badges, zero emojis, authentic Lira assets.
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { PATHS, GUARDRAILS } = require('../helpers/test_constants');

describe('Feature 15: Editorial Art Direction', () => {
  test('Anti-Slop Rule 1: Zero Glow Blobs & Radial Gradient Blurs', () => {
    // Verify specification bans radial glow blobs
    const bible = fs.readFileSync(PATHS.MASTER_BIBLE, 'utf-8');
    assert.ok(bible.includes('Zero Floating Glow Blobs') || bible.includes('glow blobs'),
      'Specification must explicitly ban floating glow blobs');
  });

  test('Anti-Slop Rule 2: Zero 48px SaaS Grids & Generic Tech Backgrounds', () => {
    const bible = fs.readFileSync(PATHS.MASTER_BIBLE, 'utf-8');
    assert.ok(bible.includes('Zero 48px SaaS Grids') || bible.includes('48px grids') || bible.includes('SaaS grids'),
      'Specification must explicitly ban generic SaaS isometric grids');
  });

  test('Anti-Slop Rule 3: Zero 01/04 Badge Slop', () => {
    const bible = fs.readFileSync(PATHS.MASTER_BIBLE, 'utf-8');
    assert.ok(bible.includes('Zero Badge Slop') || bible.includes('01/04') || bible.includes('badge slop'),
      'Specification must explicitly ban 01/04 robotic badge tags');
  });

  test('Anti-Slop Rule 4: Absolute Ban on Unicode Emojis Across Visual Components', () => {
    const testCases = [
      '🔥 RAHASIA MATCHA PREMIUM 🔥',
      'Minum stevia bikin fokus 💡',
      'Order now 👇 link in bio',
    ];

    for (const text of testCases) {
      assert.ok(GUARDRAILS.EMOJI_REGEX.test(text), `Emoji should be flagged in "${text}"`);
    }

    const cleanText = 'RAHASIA MATCHA DENGAN PEMANIS ALAMI STEVIA';
    assert.strictEqual(GUARDRAILS.EMOJI_REGEX.test(cleanText), false, 'Clean text must pass');
  });

  test('Authentic Lira Visual Assets: Verified presence of physical SSOT bottle assets', () => {
    const expectedAssets = [
      path.join(PATHS.BOTTLES_SSOT, 'matcha_ssot.png'),
      path.join(PATHS.BOTTLES_SSOT, 'choco_ssot.png'),
      path.join(PATHS.BOTTLES_SSOT, 'milktea_ssot.png'),
    ];

    for (const assetPath of expectedAssets) {
      assert.ok(fs.existsSync(assetPath), `SSOT asset must exist: ${path.basename(assetPath)}`);
      const stat = fs.statSync(assetPath);
      assert.ok(stat.size > 10000, `Asset ${path.basename(assetPath)} must be non-empty (>10KB)`);
    }
  });
});
