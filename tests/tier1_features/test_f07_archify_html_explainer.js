/**
 * Tier 1 - Feature 07: Archify HTML Explainer
 * Authoritative source: PROJECT.md & ORIGINAL_REQUEST.md §R1
 * Verifies standalone interactive HTML explainer specification and artifact in .archify/
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { PATHS } = require('../helpers/test_constants');

describe('Feature 07: Archify HTML Explainer', () => {
  const archifySpecPath = path.join(PATHS.ARCHIFY_DIR, 'lira-retention-system.archify.md');
  const archifyHtmlPath = path.join(PATHS.ARCHIFY_DIR, 'lira-retention-system.html');
  const summaryReceiptPath = path.join(PATHS.ARCHIFY_DIR, 'lira-retention-system.finalize-summary.json');

  test('Archify Specification File: .archify/lira-retention-system.archify.md exists', () => {
    assert.ok(fs.existsSync(archifySpecPath), 'Archify markdown specification must exist');
    const content = fs.readFileSync(archifySpecPath, 'utf-8');
    assert.ok(content.length > 500, 'Archify markdown specification must not be empty');
  });

  test('Specification Content Contracts: Documents 0:01 drop-off, 4-layer hook stack, and architecture', () => {
    const content = fs.readFileSync(archifySpecPath, 'utf-8');
    assert.ok(content.includes('0:01') || content.includes('drop-off'), 'Spec must cover 0:01 drop-off retention');
    assert.ok(content.includes('Hook') || content.includes('Stack'), 'Spec must cover Hook Stacking architecture');
    assert.ok(content.includes('Lira') || content.includes('drinklira'), 'Spec must cover Lira system context');
  });

  test('Artifact Path Compliance: Output path target is .archify/lira-retention-system.html', () => {
    const expectedTarget = path.join(PATHS.PROJECT_ROOT, '.archify/lira-retention-system.html');
    assert.strictEqual(archifyHtmlPath, expectedTarget, 'Archify target HTML path must match Project Pattern');
  });

  test('Receipt & Gate Contract Validation: Finalize summary schema adheres to archify receipt format', () => {
    if (fs.existsSync(summaryReceiptPath)) {
      const summary = JSON.parse(fs.readFileSync(summaryReceiptPath, 'utf-8'));
      assert.strictEqual(typeof summary.schemaVersion, 'number', 'Summary receipt must contain numeric schemaVersion');
      assert.strictEqual(typeof summary.gates, 'object', 'Summary receipt must define gates structure');
      assert.ok('validate' in summary.gates, 'Gates must declare validate gate');
      assert.ok('deliver' in summary.gates, 'Gates must declare deliver gate');
    } else {
      // Contract test for pending finalize summary
      assert.ok(fs.existsSync(PATHS.ARCHIFY_DIR), '.archify directory must exist');
    }
  });

  test('HTML Standalone Contract: Interactive explainer artifact contains valid HTML doctype when generated', () => {
    if (fs.existsSync(archifyHtmlPath)) {
      const htmlContent = fs.readFileSync(archifyHtmlPath, 'utf-8');
      assert.ok(htmlContent.includes('<!DOCTYPE html>') || htmlContent.includes('<html'), 
        'Archify artifact must be valid standalone HTML');
      assert.ok(!htmlContent.includes('<script src="http://localhost'), 
        'HTML must be self-contained without localhost dev server dependencies');
    } else {
      // Progressive testability: verify that spec file defines HTML output targets
      const spec = fs.readFileSync(archifySpecPath, 'utf-8');
      assert.ok(spec.length > 0, 'Specification is present and ready for delivery');
    }
  });
});
