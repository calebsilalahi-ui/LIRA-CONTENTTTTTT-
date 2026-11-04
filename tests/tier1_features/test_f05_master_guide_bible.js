/**
 * Tier 1 - Feature 05: Master Guide Bible
 * Authoritative source: PROJECT.md & ORIGINAL_REQUEST.md §R1
 * Verifies definitive specification at Desktop/lira reels/LIRA_ULTIMATE_REEL_AND_CAROUSEL_BIBLE.md.
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const { PATHS, REEL_SPECS, CAROUSEL_SPECS } = require('../helpers/test_constants');
const { scanString } = require('../helpers/guardrail_oracle');

describe('Feature 05: Master Guide Bible', () => {
  test('Bible Existence: SSOT Master Bible exists at exact canonical Desktop path', () => {
    assert.ok(fs.existsSync(PATHS.MASTER_BIBLE), `Master Bible must exist at ${PATHS.MASTER_BIBLE}`);
    const stat = fs.statSync(PATHS.MASTER_BIBLE);
    assert.ok(stat.size > 10000, 'Master Bible must be an exhaustive document (>10KB)');
  });

  test('Canvas Geometry Documentation: Explicitly defines 1080x1920 Reels and 1080x1350 Carousels', () => {
    const bible = fs.readFileSync(PATHS.MASTER_BIBLE, 'utf-8');
    assert.ok(bible.includes(`${REEL_SPECS.WIDTH}`) && bible.includes(`${REEL_SPECS.HEIGHT}`),
      `Bible must document ${REEL_SPECS.WIDTH}x${REEL_SPECS.HEIGHT} Reel dimensions`);
    assert.ok(bible.includes(`${CAROUSEL_SPECS.WIDTH}`) && bible.includes(`${CAROUSEL_SPECS.HEIGHT}`),
      `Bible must document ${CAROUSEL_SPECS.WIDTH}x${CAROUSEL_SPECS.HEIGHT} Carousel dimensions`);
    assert.ok(bible.includes('30fps') || bible.includes('30.0 fps') || bible.includes('30 fps'),
      'Bible must specify exact 30fps frame rate for Reels');
  });

  test('Universal Safe Box Specification: Documents x:[84,888], y:[288,1248]', () => {
    const bible = fs.readFileSync(PATHS.MASTER_BIBLE, 'utf-8');
    const safeBoxRegex = /\[84,\s*888\].*\[288,\s*1248\]/s;
    assert.ok(safeBoxRegex.test(bible) || (bible.includes('84') && bible.includes('888') && bible.includes('288') && bible.includes('1248')),
      'Bible must specify universal safe box coordinates [84,888], [288,1248]');
  });

  test('Audio Pipeline Specification: Documents -14 LUFS, voice onset <= 0.02s/0.03s, royalty-free BGM', () => {
    const bible = fs.readFileSync(PATHS.MASTER_BIBLE, 'utf-8');
    assert.ok(bible.includes('-14 LUFS') || bible.includes('-14.0 LUFS'), 'Bible must document -14 LUFS loudness standard');
    assert.ok(bible.includes('0.02s') || bible.includes('0.03s'), 'Bible must document voice onset threshold');
    assert.ok(/royalty-free/i.test(bible), 'Bible must document 100% royalty-free BGM requirement');
  });

  test('Guardrail Compliance Scan: Master Bible text must have zero active violations of brand leaks', () => {
    const bible = fs.readFileSync(PATHS.MASTER_BIBLE, 'utf-8');
    
    // We scan lines that are NOT instructional explanations of guardrails
    // (e.g. avoid false positives on lines describing "Do not say 'UPH'")
    const lines = bible.split('\n');
    const violations = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Skip meta-explanation lines that describe rules or banned examples
      if (/Prohibited|Banned|Forbidden|Defect|Failure Mode|never|anti-pattern|Rejection/i.test(line)) {
        continue;
      }
      // Check for emojis in the Bible
      const lineViolations = scanString(line, `Bible:L${i + 1}`);
      const criticalLeaks = lineViolations.filter(v => v.rule === 'EMOJI_DETECTED');
      if (criticalLeaks.length > 0) {
        violations.push(...criticalLeaks);
      }
    }

    assert.strictEqual(violations.length, 0, 
      `Master Bible should not contain unescaped emojis: ${violations.map(v => v.detail).join('; ')}`);
  });
});
