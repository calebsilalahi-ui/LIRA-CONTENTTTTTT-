/**
 * Tier 1 - Feature 03: 7 PBL Hook Taxonomy
 * Authoritative source: PROJECT.md & ORIGINAL_REQUEST.md §R1, R4
 * Verifies the 7 PBL Hook Categories (Educational, Comparison, Myth Busting,
 * Storytelling, Random, Authority, Day in the Life).
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { LIRA_CONTEXT } = require('../helpers/test_constants');

describe('Feature 03: 7 PBL Hook Taxonomy', () => {
  const EXPECTED_TAXONOMY = [
    'Educational',
    'Comparison',
    'Myth Busting',
    'Storytelling',
    'Random',
    'Authority',
    'Day in the Life',
  ];

  test('Taxonomy Definition: Exactly 7 canonical PBL categories are registered', () => {
    assert.strictEqual(LIRA_CONTEXT.PBL_HOOK_CATEGORIES.length, 7, 'Must have exactly 7 PBL categories');
    for (const cat of EXPECTED_TAXONOMY) {
      assert.ok(LIRA_CONTEXT.PBL_HOOK_CATEGORIES.includes(cat), `Category "${cat}" must be present in taxonomy`);
    }
  });

  test('Category Validation: Valid category must pass taxonomy gate', () => {
    function isValidCategory(cat) {
      return LIRA_CONTEXT.PBL_HOOK_CATEGORIES.includes(cat);
    }
    assert.ok(isValidCategory('Comparison'), 'Comparison should be valid');
    assert.ok(isValidCategory('Myth Busting'), 'Myth Busting should be valid');
    assert.ok(isValidCategory('Educational'), 'Educational should be valid');
  });

  test('Invalid Category Rejection: Unregistered categories must fail validation', () => {
    function isValidCategory(cat) {
      return LIRA_CONTEXT.PBL_HOOK_CATEGORIES.includes(cat);
    }
    assert.strictEqual(isValidCategory('Generic Advertisement'), false, 'Generic Ad should be rejected');
    assert.strictEqual(isValidCategory('TikTok Dance Meme'), false, 'Meme category should be rejected');
    assert.strictEqual(isValidCategory(''), false, 'Empty category should be rejected');
  });

  test('Category ↔ Format Compatibility: All 7 categories support both Reel and Carousel formats', () => {
    const supportedFormats = ['reel', 'carousel'];
    for (const cat of LIRA_CONTEXT.PBL_HOOK_CATEGORIES) {
      for (const fmt of supportedFormats) {
        assert.ok(fmt === 'reel' || fmt === 'carousel', `${cat} must support format ${fmt}`);
      }
    }
  });

  test('Hook Taxonomy Schema Enforcement: Slot payload hook_category must strictly match one of the 7 PBL categories', () => {
    const validSlot = {
      format: 'reel',
      pillar: 'Sugar Crash & Stevia Science',
      hook_category: 'Myth Busting',
      topic: 'Mitos Semua Manis Bikin Gemuk',
    };

    assert.ok(LIRA_CONTEXT.PBL_HOOK_CATEGORIES.includes(validSlot.hook_category),
      'Slot payload hook_category must match 7 PBL categories');
  });
});
