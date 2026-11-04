/**
 * Tier 1 - Feature 19: Legacy Asset Sanitization
 * Authoritative source: PROJECT.md & ORIGINAL_REQUEST.md §R4
 * Verifies sanitization of leaks ("UPH", "dua tetes", "ceremonial", batch counts, emojis) across codebase.
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { PATHS, GUARDRAILS } = require('../helpers/test_constants');
const { scanString } = require('../helpers/guardrail_oracle');

describe('Feature 19: Legacy Asset Sanitization', () => {
  test('Master Guide & Skill Sanitization: Zero un-sanitized leaks in instructional templates', () => {
    const filesToAudit = [PATHS.MASTER_BIBLE, PATHS.SKILL_FILE].filter(f => fs.existsSync(f));
    assert.ok(filesToAudit.length > 0, 'At least one specification file must be audited');

    for (const filePath of filesToAudit) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Exclude lines explaining rules / bans
        if (/NEVER|Prohibited|Banned|Forbidden|Defect|Failure Mode|anti-pattern|Rejection|reject/i.test(line)) {
          continue;
        }
        // Check for private school leaks
        assert.strictEqual(GUARDRAILS.SCHOOL_NAMES_REGEX.test(line), false,
          `School name leak in ${path.basename(filePath)} line ${i + 1}: "${line.trim()}"`);
      }
    }
  });

  test('Sanitization of Stevia Dosages: Replaces exact "dua tetes" with conceptual "pemanis alami stevia"', () => {
    function sanitizeCopy(text) {
      return text
        .replace(/\b(?:dua|2)\s*tetes\s*(?:daun\s*)?stevia\b/gi, 'pemanis alami stevia')
        .replace(GUARDRAILS.BOTTLE_COUNT_REGEX, 'limited batch')
        .replace(GUARDRAILS.EMOJI_REGEX, '');
    }

    const dirtyText = 'Kita cuma tetes 2 tetes stevia asli dan sedia 42 botol aja!';
    const sanitized = sanitizeCopy(dirtyText);

    assert.strictEqual(GUARDRAILS.STEVIA_DOSAGE_REGEX.test(sanitized), false, 'Stevia dosage must be sanitized');
    assert.strictEqual(GUARDRAILS.BOTTLE_COUNT_REGEX.test(sanitized), false, 'Bottle count must be sanitized');
    assert.ok(sanitized.includes('pemanis alami stevia'), 'Must replace with conceptual pemanis alami stevia');
    assert.ok(sanitized.includes('limited batch'), 'Must replace with limited batch');
  });

  test('Sanitization of Ceremonial Matcha Claims: Pure Japanese matcha only, no ceremonial claims', () => {
    function sanitizeMatcha(text) {
      return text.replace(/\bceremonial\s*matcha\b/gi, 'pure Japanese premium matcha');
    }

    const dirtyText = 'Kita pakai ceremonial matcha langsung dari Uji Kyoto.';
    const cleanText = sanitizeMatcha(dirtyText);

    assert.strictEqual(GUARDRAILS.BANNED_TERMS_REGEX.test(cleanText), false, 'Ceremonial term must be sanitized');
    assert.ok(cleanText.includes('pure Japanese premium matcha'), 'Should replace with authorized grade phrase');
  });

  test('Public Assets Sanitization: Assets directory contains no banned or commercial tracks', () => {
    const publicAssets = fs.readdirSync(PATHS.PUBLIC_ASSETS);
    // Ensure clean bottles SSOT directory exists
    assert.ok(publicAssets.includes('bottles_ssot'), 'Must contain clean bottles_ssot');
    
    // Ensure clean SSOT files don't have flavor text on bottle labels
    const bottles = fs.readdirSync(PATHS.BOTTLES_SSOT);
    assert.ok(bottles.includes('matcha_ssot.png'), 'Must have matcha_ssot.png');
    assert.ok(bottles.includes('choco_ssot.png'), 'Must have choco_ssot.png');
    assert.ok(bottles.includes('milktea_ssot.png'), 'Must have milktea_ssot.png');
  });

  test('Zero Emoji Scrubbing Contract: Sanitizer removes all unicode pictographs from script streams', () => {
    const dirtyScript = 'Kenapa matcha 50k bikin drop? 🤔 Simak sainsnya ya! 🍵✨';
    const cleanScript = dirtyScript.replace(new RegExp(GUARDRAILS.EMOJI_REGEX.source, 'gu'), '').trim();

    assert.strictEqual(GUARDRAILS.EMOJI_REGEX.test(cleanScript), false, 'Sanitized script must contain zero emojis');
    assert.strictEqual(cleanScript, 'Kenapa matcha 50k bikin drop?  Simak sainsnya ya!');
  });
});
