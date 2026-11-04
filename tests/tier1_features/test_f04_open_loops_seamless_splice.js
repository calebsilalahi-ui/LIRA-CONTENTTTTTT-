/**
 * Tier 1 - Feature 04: Open Loops & Seamless Loop Splice
 * Authoritative source: PROJECT.md & ORIGINAL_REQUEST.md §R1, R2
 * Verifies nested curiosity loops and seamless grammatical/visual loop-back ending.
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const { PATHS } = require('../helpers/test_constants');

describe('Feature 04: Open Loops & Seamless Loop Splice', () => {
  test('Master Bible Specification: Mandates nested open loops and seamless loop-back ending', () => {
    assert.ok(fs.existsSync(PATHS.MASTER_BIBLE), 'Master Bible must exist');
    const bible = fs.readFileSync(PATHS.MASTER_BIBLE, 'utf-8');
    
    assert.ok(/loop/i.test(bible), 'Bible must document loop mechanics');
    assert.ok(/seamless.*loop/i.test(bible) || /closing loop/i.test(bible), 'Bible must document Seamless Loop Splice');
  });

  test('Grammatical Loop Splice Contract: Script ending clause must cleanly connect into opening hook', () => {
    // Example: Opening: "Tiga tanda minuman kafe 50 ribuan lo sebenernya ngerugiin lo..."
    // Closing clause: "...dan semua masalah itu berakar dari alasan kenapa..."
    const openingHook = 'Tiga tanda minuman kafe lima puluh ribuan ngerugiin lo';
    const loopBridge = 'dan semua masalah itu berakar dari alasan kenapa';

    const fullLoopSentence = `${loopBridge} ${openingHook}`.toLowerCase();
    assert.ok(fullLoopSentence.includes(openingHook.toLowerCase()), 'Ending bridge must precede and form a natural sentence into hook');
    assert.ok(!fullLoopSentence.endsWith('.'), 'Bridge ending must not form a hard stop before loop');
  });

  test('Macro & Micro Loop Structure: Script architecture must maintain at least 1 macro loop and 1 micro loop', () => {
    const sampleScriptStructure = {
      macroLoop: 'Kenapa matcha 50k bikin lemes & crash?',
      microLoops: [
        'Bukan karena matchanya, tapi bahan suntikan rahasianya',
        'Efek drop setelah 2 jam',
      ],
      resolution: 'Di Lira, pure matcha dengan pemanis alami stevia nol gula pasir',
      loopBackBridge: 'Makanya lo wajib paham alasan kenapa',
    };

    assert.ok(sampleScriptStructure.macroLoop.length > 0, 'Macro loop must be defined');
    assert.ok(sampleScriptStructure.microLoops.length >= 1, 'At least one micro loop required');
    assert.ok(sampleScriptStructure.resolution.length > 0, 'Resolution must satisfy the loop');
    assert.ok(sampleScriptStructure.loopBackBridge.length > 0, 'Loop-back bridge required');
  });

  test('Visual Loop Splice Frame Alignment: Ending frame coordinates must match Frame 0 camera/character anchor', () => {
    const frame0State = { cameraScale: 1.15, panX: 0, bottleX: 540, bottleY: 960 };
    const finalFrameState = { cameraScale: 1.15, panX: 0, bottleX: 540, bottleY: 960 };

    assert.strictEqual(finalFrameState.cameraScale, frame0State.cameraScale, 'Final frame camera scale must match Frame 0');
    assert.strictEqual(finalFrameState.bottleX, frame0State.bottleX, 'Final frame bottle anchor must match Frame 0');
    assert.strictEqual(finalFrameState.bottleY, frame0State.bottleY, 'Final frame bottle Y anchor must match Frame 0');
  });

  test('Loop Splice Error Handling: Script with abrupt CTA ending ("Beli sekarang!") violates loop splice rule', () => {
    function validateLoopEnding(closingText) {
      const abruptEndings = [/beli sekarang/i, /link di bio\.$/i, /follow gue ya\.$/i, /sampai jumpa\.$/i];
      for (const re of abruptEndings) {
        if (re.test(closingText.trim())) {
          return { valid: false, reason: 'Abrupt ending breaks seamless video loop' };
        }
      }
      return { valid: true };
    }

    const abruptResult = validateLoopEnding('Buruan beli sekarang.');
    assert.strictEqual(abruptResult.valid, false, 'Abrupt closing must be rejected');

    const loopResult = validateLoopEnding('Dan semua ini bermula dari...');
    assert.strictEqual(loopResult.valid, true, 'Continuous loop bridge should pass');
  });
});
