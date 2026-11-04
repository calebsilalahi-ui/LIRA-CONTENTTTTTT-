/**
 * Tier 1 - Feature 06: Skill Reconciliation
 * Authoritative source: PROJECT.md & ORIGINAL_REQUEST.md §R1
 * Verifies that /Users/caleb/.gemini/config/skills/lira-video/SKILL.md is reconciled
 * with zero contradictions against the Master Bible.
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const { PATHS, REEL_SPECS, CAROUSEL_SPECS } = require('../helpers/test_constants');

describe('Feature 06: Skill Reconciliation', () => {
  test('Skill File Existence: SKILL.md exists at exact config directory path', () => {
    assert.ok(fs.existsSync(PATHS.SKILL_FILE), `SKILL.md must exist at ${PATHS.SKILL_FILE}`);
  });

  test('Skill Frontmatter Validation: Contains valid YAML frontmatter with name and description', () => {
    const content = fs.readFileSync(PATHS.SKILL_FILE, 'utf-8');
    assert.ok(content.startsWith('---'), 'Skill file must begin with YAML frontmatter delimiter');
    assert.ok(/name:\s*lira-video/i.test(content), 'Skill name must be lira-video');
    assert.ok(/description:/i.test(content), 'Skill must declare description in frontmatter');
  });

  test('Zero Contradictions - Canvas Geometries: Exact 1080x1920 Reels and 1080x1350 Carousels', () => {
    const content = fs.readFileSync(PATHS.SKILL_FILE, 'utf-8');
    assert.ok(content.includes(`${REEL_SPECS.WIDTH} × ${REEL_SPECS.HEIGHT}`) || content.includes(`${REEL_SPECS.WIDTH}×${REEL_SPECS.HEIGHT}`) || content.includes(`${REEL_SPECS.WIDTH}x${REEL_SPECS.HEIGHT}`),
      'Skill must declare exact 1080x1920 Reel dimensions');
    assert.ok(content.includes(`${CAROUSEL_SPECS.WIDTH} × ${CAROUSEL_SPECS.HEIGHT}`) || content.includes(`${CAROUSEL_SPECS.WIDTH}×${CAROUSEL_SPECS.HEIGHT}`) || content.includes(`${CAROUSEL_SPECS.WIDTH}x${CAROUSEL_SPECS.HEIGHT}`),
      'Skill must declare exact 1080x1350 Carousel dimensions');
    assert.ok(content.includes('6 to 8 slides') || content.includes('6–8 slides'),
      'Skill must specify 6 to 8 slides per carousel');
  });

  test('Zero Contradictions - Universal Safe Box: Exactly x:[84,888], y:[288,1248]', () => {
    const content = fs.readFileSync(PATHS.SKILL_FILE, 'utf-8');
    assert.ok(content.includes('84') && content.includes('888') && content.includes('288') && content.includes('1248'),
      'Skill must specify exact safe box coordinates x:[84,888], y:[288,1248]');
  });

  test('Zero Contradictions - Non-Numeric Scarcity & Audio Standards: -14 LUFS, limited batch', () => {
    const content = fs.readFileSync(PATHS.SKILL_FILE, 'utf-8');
    assert.ok(content.includes('-14') && content.includes('LUFS'), 'Skill must specify -14 LUFS audio standard');
    assert.ok(/limited batch|stok terbatas/i.test(content), 'Skill must mandate non-numeric limited batch scarcity');
    assert.ok(/NEVER mention exact numerical bottle counts|no "42 botol"/i.test(content), 
      'Skill must explicitly mandate never mentioning exact numerical bottle counts');
  });
});
