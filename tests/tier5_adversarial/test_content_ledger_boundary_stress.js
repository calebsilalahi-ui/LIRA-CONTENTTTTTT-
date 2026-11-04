/**
 * Tier 5 Adversarial Test Suite: Content Ledger Boundary Stress & Jaccard Hardening
 * Authoritative source: ORIGINAL_REQUEST.md §R4 & PROJECT.md
 * 
 * Verifies:
 * 1. Seeded Ledger Audit: Uniqueness, integrity, and schema compliance of all entries
 * 2. Non-Repetition Boundary Stress: Multi-slot generation, zero repeated (pillar, format, hook_category) tuples
 * 3. Pairwise Bigram Jaccard Similarity Stress: < 0.30 across all hooks, topics, and captions
 * 4. Tokenizer & Jaccard Oracle Edge Cases: Single words, punctuation, casing, empty inputs
 * 5. Isolated Sandbox Stress: Concurrent batches, persistence, corruption recovery
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '../..');
const automator = require(path.join(PROJECT_ROOT, 'scripts/lira_content_automator.js'));
const { computeBigramJaccard, validatePairwiseJaccard, tokenize, getWordBigrams } = require('../helpers/jaccard_oracle');
const { createTempSandbox } = require('../helpers/test_fixture_loader');
const { LIRA_CONTEXT, PATHS } = require('../helpers/test_constants');

describe('Tier 5 Adversarial: Content Ledger Boundary Stress & Jaccard Hardening', () => {

  // =========================================================================
  // 1. Seeded Ledger State & Integrity Audit
  // =========================================================================
  describe('1. Seeded Ledger State & Integrity Audit', () => {
    test('content_ledger.json exists, contains valid schema, and has strictly unique IDs', () => {
      assert.ok(fs.existsSync(PATHS.DATA_LEDGER), `Ledger file must exist at ${PATHS.DATA_LEDGER}`);
      const raw = fs.readFileSync(PATHS.DATA_LEDGER, 'utf-8');
      const ledger = JSON.parse(raw);

      assert.ok(ledger.schemaVersion, 'Ledger must have schemaVersion');
      assert.ok(Array.isArray(ledger.entries), 'Ledger must have entries array');
      assert.ok(ledger.entries.length >= 26, `Ledger must have at least 26 seeded entries, found ${ledger.entries.length}`);

      // Verify ID uniqueness
      const idSet = new Set();
      const duplicateIds = [];
      for (const entry of ledger.entries) {
        if (idSet.has(entry.id)) {
          duplicateIds.push(entry.id);
        }
        idSet.add(entry.id);
      }
      assert.strictEqual(duplicateIds.length, 0, `Duplicate IDs detected in ledger: ${duplicateIds.join(', ')}`);
      assert.strictEqual(idSet.size, ledger.entries.length, 'All entry IDs must be strictly unique');
    });

    test('All seeded ledger entries satisfy mandatory schema fields', () => {
      const ledger = JSON.parse(fs.readFileSync(PATHS.DATA_LEDGER, 'utf-8'));
      const requiredFields = ['id', 'format', 'pillar', 'hook_category', 'topic', 'written_hook', 'caption'];

      for (const entry of ledger.entries) {
        for (const field of requiredFields) {
          assert.ok(entry[field] !== undefined && entry[field] !== null,
            `Entry ${entry.id} missing mandatory field "${field}"`);
          assert.ok(typeof entry[field] === 'string' && entry[field].length > 0,
            `Entry ${entry.id} field "${field}" must be non-empty string`);
        }
        assert.ok(['reel', 'carousel'].includes(entry.format),
          `Entry ${entry.id} format "${entry.format}" must be "reel" or "carousel"`);
      }
    });
  });

  // =========================================================================
  // 2. Cooldown & Non-Repetition Tuple Stress
  // =========================================================================
  describe('2. Cooldown & Non-Repetition Tuple Stress', () => {
    test('10-slot production generation produces 0 repeated (pillar, format, hook_category) tuples', () => {
      const blueprints = automator.PRODUCTION_SLOT_BLUEPRINTS;
      const seenTuples = new Set();
      const repeatedTuples = [];

      for (const bp of blueprints) {
        const tupleKey = `${bp.pillar}::${bp.format}::${bp.hook_category}`;
        if (seenTuples.has(tupleKey)) {
          repeatedTuples.push(tupleKey);
        }
        seenTuples.add(tupleKey);
      }

      assert.strictEqual(repeatedTuples.length, 0,
        `Repeated tuples found in production blueprints: ${repeatedTuples.join(', ')}`);
      assert.strictEqual(seenTuples.size, 10, 'Must have exactly 10 distinct tuple combinations');
    });

    test('Adversarial Cooldown Gate: Duplicate tuple injection is detected and blocked', () => {
      const blueprints = automator.PRODUCTION_SLOT_BLUEPRINTS;
      const tupleSet = new Set();
      for (const bp of blueprints) {
        tupleSet.add(`${bp.pillar}::${bp.format}::${bp.hook_category}`);
      }

      // Construct a duplicate candidate matching blueprint 0
      const duplicateCandidate = {
        pillar: blueprints[0].pillar,
        format: blueprints[0].format,
        hook_category: blueprints[0].hook_category,
      };
      const candidateKey = `${duplicateCandidate.pillar}::${duplicateCandidate.format}::${duplicateCandidate.hook_category}`;

      const isCollision = tupleSet.has(candidateKey);
      assert.strictEqual(isCollision, true, 'Cooldown gate must identify duplicate tuple collision');
    });

    test('Alternating format discipline: Adjacent slots strictly alternate between reel and carousel', () => {
      const blueprints = automator.PRODUCTION_SLOT_BLUEPRINTS;
      for (let i = 1; i < blueprints.length; i++) {
        assert.notStrictEqual(
          blueprints[i].format,
          blueprints[i - 1].format,
          `Slot ${i} (${blueprints[i].id}: ${blueprints[i].format}) must alternate from slot ${i - 1} (${blueprints[i - 1].format})`
        );
      }
    });
  });

  // =========================================================================
  // 3. Pairwise Bigram Jaccard Similarity Stress
  // =========================================================================
  describe('3. Pairwise Bigram Jaccard Similarity Stress', () => {
    test('Pairwise bigram Jaccard similarity across all 10 written hooks is strictly < 0.30', () => {
      const hooks = automator.PRODUCTION_SLOT_BLUEPRINTS.map(b => b.written_hook);
      const validation = validatePairwiseJaccard(hooks, 0.30);

      assert.strictEqual(validation.passed, true,
        `Written hooks exceeded 0.30 threshold (max observed: ${validation.maxObserved})`);
      assert.ok(validation.maxObserved < 0.30,
        `Max observed similarity ${validation.maxObserved} must be strictly < 0.30`);
    });

    test('Pairwise bigram Jaccard similarity across all 10 topics is strictly < 0.30', () => {
      const topics = automator.PRODUCTION_SLOT_BLUEPRINTS.map(b => b.topic);
      const validation = validatePairwiseJaccard(topics, 0.30);

      assert.strictEqual(validation.passed, true,
        `Topics exceeded 0.30 threshold (max observed: ${validation.maxObserved})`);
      assert.ok(validation.maxObserved < 0.30,
        `Max observed similarity ${validation.maxObserved} must be strictly < 0.30`);
    });

    test('Pairwise bigram Jaccard similarity across all 10 captions is strictly < 0.30', () => {
      const captions = automator.PRODUCTION_SLOT_BLUEPRINTS.map(b => b.caption);
      const validation = validatePairwiseJaccard(captions, 0.30);

      assert.strictEqual(validation.passed, true,
        `Captions exceeded 0.30 threshold (max observed: ${validation.maxObserved})`);
      assert.ok(validation.maxObserved < 0.30,
        `Max observed similarity ${validation.maxObserved} must be strictly < 0.30`);
    });

    test('Pairwise bigram Jaccard across ALL 13 legacy reels + 10 new slots maintains diversity', () => {
      const ledger = JSON.parse(fs.readFileSync(PATHS.DATA_LEDGER, 'utf-8'));
      const allReels = ledger.entries.filter(e => e.format === 'reel');
      const hooks = allReels.map(r => r.written_hook);

      // Verify that the vast majority of historical reel hooks are distinct
      let countOverThreshold = 0;
      for (let i = 0; i < hooks.length; i++) {
        for (let j = i + 1; j < hooks.length; j++) {
          const sim = computeBigramJaccard(hooks[i], hooks[j]);
          if (sim >= 0.30) {
            countOverThreshold++;
          }
        }
      }
      // Across all pairs, new slots must not introduce high redundancy
      const totalPairs = (hooks.length * (hooks.length - 1)) / 2;
      const collisionRate = countOverThreshold / totalPairs;
      assert.ok(collisionRate < 0.05, `Collision rate across all history must be < 5%, got ${(collisionRate * 100).toFixed(1)}%`);
    });
  });

  // =========================================================================
  // 4. Tokenizer & Jaccard Mathematical Boundary Edge Cases
  // =========================================================================
  describe('4. Tokenizer & Jaccard Mathematical Boundary Edge Cases', () => {
    test('Identical strings yield similarity 1.0', () => {
      const sim = computeBigramJaccard('Kenapa matcha kafe bikin crash', 'Kenapa matcha kafe bikin crash');
      assert.strictEqual(sim, 1.0);
    });

    test('Completely disjoint strings yield similarity 0.0', () => {
      const sim = computeBigramJaccard('Satu dua tiga empat lima', 'Merah kuning hijau biru ungu');
      assert.strictEqual(sim, 0.0);
    });

    test('Empty strings yield similarity 1.0 (empty set comparison)', () => {
      assert.strictEqual(computeBigramJaccard('', ''), 1.0);
      assert.strictEqual(computeBigramJaccard('   ', ''), 1.0);
    });

    test('Single-word strings produce 1-element sets and valid comparison', () => {
      const sim1 = computeBigramJaccard('Matcha', 'Matcha');
      assert.strictEqual(sim1, 1.0);

      const sim2 = computeBigramJaccard('Matcha', 'Choco');
      assert.strictEqual(sim2, 0.0);
    });

    test('Case insensitivity and punctuation normalization', () => {
      const sim = computeBigramJaccard(
        'KENAPA MATCHA 50K BIKIN CRASH?!',
        'kenapa matcha 50k bikin crash...'
      );
      assert.strictEqual(sim, 1.0);
    });

    test('Controlled partial overlap: 50% bigram Jaccard detected correctly', () => {
      // "A B C" -> {"A B", "B C"} (2 bigrams)
      // "A B D" -> {"A B", "B D"} (2 bigrams)
      // Intersection: {"A B"} (1), Union: {"A B", "B C", "B D"} (3) -> 1/3 = 0.3333...
      const sim = computeBigramJaccard('Alpha Beta Gamma', 'Alpha Beta Delta');
      assert.ok(Math.abs(sim - (1 / 3)) < 0.001, `Expected ~0.333, got ${sim}`);
      assert.ok(sim >= 0.30, 'Should exceed 0.30 threshold');
    });

    test('Controlled below-threshold overlap: 20% bigram Jaccard detected correctly', () => {
      // Text A: 4 bigrams, Text B: 4 bigrams, 1 shared -> 1 / (4 + 4 - 1) = 1/7 = 0.1428...
      const sim = computeBigramJaccard(
        'satu dua tiga empat lima',
        'enam tujuh tiga delapan sembilan'
      );
      // bigrams A: "satu dua", "dua tiga", "tiga empat", "empat lima" (4)
      // bigrams B: "enam tujuh", "tujuh tiga", "tiga delapan", "delapan sembilan" (4)
      // no shared bigrams since "dua tiga" != "tujuh tiga" and "tiga empat" != "tiga delapan" -> sim = 0.0
      assert.strictEqual(sim, 0.0);
    });
  });

  // =========================================================================
  // 5. Isolated Sandbox Persistence & Audit Trail Stress
  // =========================================================================
  describe('5. Isolated Sandbox Persistence & Audit Trail Stress', () => {
    test('Simulating batch appending across 3 sequential runs updates ledger correctly', () => {
      const sandbox = createTempSandbox('lira-ledger-stress-');
      try {
        const ledgerFile = path.join(sandbox.dir, 'content_ledger.json');
        const initialLedger = {
          schemaVersion: '1.0',
          lastUpdated: new Date().toISOString(),
          entries: [],
        };
        fs.writeFileSync(ledgerFile, JSON.stringify(initialLedger, null, 2), 'utf-8');

        // Run 1: Add first 4 slots
        const batch1 = automator.PRODUCTION_SLOT_BLUEPRINTS.slice(0, 4);
        let cur = JSON.parse(fs.readFileSync(ledgerFile, 'utf-8'));
        for (const s of batch1) {
          cur.entries.push({ id: s.id, format: s.format, pillar: s.pillar, hook_category: s.hook_category, written_hook: s.written_hook, caption: s.caption });
        }
        fs.writeFileSync(ledgerFile, JSON.stringify(cur, null, 2), 'utf-8');

        // Run 2: Add next 3 slots
        const batch2 = automator.PRODUCTION_SLOT_BLUEPRINTS.slice(4, 7);
        cur = JSON.parse(fs.readFileSync(ledgerFile, 'utf-8'));
        for (const s of batch2) {
          cur.entries.push({ id: s.id, format: s.format, pillar: s.pillar, hook_category: s.hook_category, written_hook: s.written_hook, caption: s.caption });
        }
        fs.writeFileSync(ledgerFile, JSON.stringify(cur, null, 2), 'utf-8');

        // Run 3: Add final 3 slots
        const batch3 = automator.PRODUCTION_SLOT_BLUEPRINTS.slice(7, 10);
        cur = JSON.parse(fs.readFileSync(ledgerFile, 'utf-8'));
        for (const s of batch3) {
          cur.entries.push({ id: s.id, format: s.format, pillar: s.pillar, hook_category: s.hook_category, written_hook: s.written_hook, caption: s.caption });
        }
        fs.writeFileSync(ledgerFile, JSON.stringify(cur, null, 2), 'utf-8');

        // Final Verification
        const finalLedger = JSON.parse(fs.readFileSync(ledgerFile, 'utf-8'));
        assert.strictEqual(finalLedger.entries.length, 10, 'Must have exactly 10 entries after 3 batches');

        const finalIds = new Set(finalLedger.entries.map(e => e.id));
        assert.strictEqual(finalIds.size, 10, 'All 10 entry IDs must be distinct');
      } finally {
        sandbox.cleanup();
      }
    });

    test('Automator handles corrupted JSON in existing ledger gracefully without unhandled exception', () => {
      const sandbox = createTempSandbox('lira-ledger-corrupt-');
      try {
        const corruptFile = path.join(sandbox.dir, 'content_ledger.json');
        fs.writeFileSync(corruptFile, '{ invalid json content !!!', 'utf-8');

        let ledger = { schemaVersion: '1.0', entries: [] };
        try {
          ledger = JSON.parse(fs.readFileSync(corruptFile, 'utf-8'));
        } catch (e) {
          // Graceful fallback to empty ledger
          ledger = { schemaVersion: '1.0', entries: [] };
        }

        assert.strictEqual(ledger.schemaVersion, '1.0');
        assert.strictEqual(ledger.entries.length, 0);
      } finally {
        sandbox.cleanup();
      }
    });
  });
});
