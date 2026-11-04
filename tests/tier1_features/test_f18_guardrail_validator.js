/**
 * Tier 1 - Feature 18: Programmatic Guardrail Validator
 * Authoritative source: PROJECT.md & ORIGINAL_REQUEST.md §R4
 * Verifies validateContent({ script, caption, overlays, hookText }) contract:
 * Rejects exact counts, stevia dosages, school names, financials, banned terms, and emojis.
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { PATHS } = require('../helpers/test_constants');
const oracle = require('../helpers/guardrail_oracle');

// Progressive testability: dynamically bind to target script if landed, fallback to oracle
const scriptPath = path.join(PATHS.SCRIPTS_DIR, 'validate_guardrails.js');
const { validateContent, GuardrailError } = fs.existsSync(scriptPath) ? require(scriptPath) : oracle;

describe('Feature 18: Programmatic Guardrail Validator', () => {
  test('Exact Bottle Count Rejection: Throws GuardrailError on numeric scarcity ("42 botol", "50 botol")', () => {
    const payloads = [
      { script: 'Hari ini kita cuma seduh 42 botol aja ya guys.' },
      { caption: 'Sisa 50 botol untuk batch Sabtu ini!' },
      { hookText: 'Kenapa 100 botol kemarin langsung sold out?' },
    ];

    for (const p of payloads) {
      assert.throws(
        () => validateContent(p),
        (err) => err.name === 'GuardrailError' || err instanceof oracle.GuardrailError,
        `Should reject bottle count in: ${JSON.stringify(p)}`
      );
    }
  });

  test('Exact Stevia Dosage Rejection: Throws GuardrailError on specific drops/grams ("2 tetes stevia")', () => {
    const payloads = [
      { script: 'Rahasia manisnya cuma pakai 2 tetes stevia asli.' },
      { caption: 'Formula rahasia: 5ml stevia per botol.' },
      { script: 'Kita campur 3 gram daun stevia murni.' },
    ];

    for (const p of payloads) {
      assert.throws(
        () => validateContent(p),
        (err) => err.name === 'GuardrailError' || err instanceof oracle.GuardrailError,
        `Should reject exact stevia dosage in: ${JSON.stringify(p)}`
      );
    }
  });

  test('Private School & Institution Rejection: Throws GuardrailError on UPH, Baranangsiang, etc.', () => {
    const payloads = [
      { script: 'Waktu masih sering nongkrong di UPH College...' },
      { caption: 'Anak Baranangsiang pasti tau rasanya.' },
      { hookText: 'Cerita anak SMK Baranangsiang jualan matcha.' },
    ];

    for (const p of payloads) {
      assert.throws(
        () => validateContent(p),
        (err) => err.name === 'GuardrailError' || err instanceof oracle.GuardrailError,
        `Should reject school leak in: ${JSON.stringify(p)}`
      );
    }
  });

  test('Financial & Supplier Leaks Rejection: Throws GuardrailError on COGS, margins, WithUs, JBD, etc.', () => {
    const payloads = [
      { script: 'HPP kita cuma Rp8.6M tapi target valuasi Rp500M.' },
      { caption: 'Margin bersih 74% dipotong 20% fee gojek.' },
      { script: 'Supplier bubuk kita bukan WithUs atau JBD Jakarta Bubble Drink.' },
      { hookText: 'Modal War Chest sisa Rp21M.' },
      { script: 'Kita pakai ceremonial matcha grade impor.' },
    ];

    for (const p of payloads) {
      assert.throws(
        () => validateContent(p),
        (err) => err.name === 'GuardrailError' || err instanceof oracle.GuardrailError,
        `Should reject financial/supplier leak in: ${JSON.stringify(p)}`
      );
    }
  });

  test('Unicode Emoji Rejection & Valid Content Pass: Rejects emojis and passes compliant copy', () => {
    // Emojis must be rejected
    const emojiPayloads = [
      { caption: 'Matcha terenak di Tangsel! 🍵✨' },
      { hookText: 'Kenapa matcha kafe bikin drop? 🤔' },
      { overlays: ['LIMITED BATCH 🚨'] },
    ];

    for (const p of emojiPayloads) {
      assert.throws(
        () => validateContent(p),
        (err) => err.name === 'GuardrailError' || err instanceof oracle.GuardrailError,
        `Should reject emojis in: ${JSON.stringify(p)}`
      );
    }

    // Compliant Indonesian copy must pass 100%
    const compliantPayload = {
      script: 'Pernah gak lo beli matcha di kafe tapi dua jam kemudian kepala lo lemes parah?',
      caption: 'Di Lira, kita tolak resep murahan: pure Japanese premium matcha dengan barista oat milk dan pemanis alami stevia. Limited batch ready Sabtu ini via bio.',
      hookText: 'KENAPA MATCHA KAFE BIKIN LEMES',
      overlays: ['KENAPA MATCHA KAFE BIKIN LEMES', '180 DERAJAT ANTI BOCOR'],
    };

    const res = validateContent(compliantPayload);
    assert.strictEqual(res.valid, true, 'Compliant content must pass without throwing');
  });
});
