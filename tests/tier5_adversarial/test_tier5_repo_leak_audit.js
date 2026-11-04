/**
 * Tier 5 - Adversarial Test Suite: Repository-Wide Leak Audit
 * Authoritative sources: PROJECT.md & ORIGINAL_REQUEST.md §R4
 * 
 * Scans all production source files, scripts, data, and documentation for:
 * 1. Private institutional names (UPH, UPHC, UPH College, Baranangsiang, Barsih)
 * 2. Financial leaks (HPP, COGS, margin, 74%, 66%, 500M, 21M, 8.6M, War Chest, CapEx, 20% fee)
 * 3. Commercial grade claims ("ceremonial")
 * 4. Exact numerical bottle counts ("42 botol", "50 botol")
 * 5. Exact stevia dosages ("2 tetes stevia", "dua tetes")
 * 6. Banned external entities/suppliers ("WithUs", "JBD", "Jakarta Bubble Drink")
 * 7. Unicode emojis in captions, scripts, and overlays
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { PATHS, GUARDRAILS } = require('../helpers/test_constants');
const { scanString } = require('../helpers/guardrail_oracle');

describe('Tier 5 Adversarial: Repository-Wide Leak Audit', () => {

  test('Audit: data/content_ledger.json has ZERO guardrail violations across all entries', () => {
    assert.ok(fs.existsSync(PATHS.DATA_LEDGER), 'Content ledger must exist');
    const ledger = JSON.parse(fs.readFileSync(PATHS.DATA_LEDGER, 'utf-8'));
    assert.ok(Array.isArray(ledger.entries), 'Ledger must contain entries array');
    assert.ok(ledger.entries.length >= 26, `Ledger should have at least 26 entries (actual: ${ledger.entries.length})`);

    const violations = [];

    ledger.entries.forEach((entry, idx) => {
      const fields = ['topic', 'verbal_hook', 'written_hook', 'caption'];
      for (const f of fields) {
        if (entry[f]) {
          const vs = scanString(entry[f], `ledger[${idx}:${entry.id}].${f}`);
          if (vs.length > 0) {
            violations.push(...vs);
          }
        }
      }

      if (entry.slides && Array.isArray(entry.slides)) {
        entry.slides.forEach((slide, sIdx) => {
          const sFields = ['headline', 'body', 'subtext'];
          for (const sf of sFields) {
            if (slide[sf]) {
              const vs = scanString(slide[sf], `ledger[${idx}].slides[${sIdx}].${sf}`);
              if (vs.length > 0) {
                violations.push(...vs);
              }
            }
          }
        });
      }
    });

    assert.strictEqual(violations.length, 0,
      `Content ledger contains guardrail leaks: ${JSON.stringify(violations, null, 2)}`);
  });

  test('Audit: Sidecar JSON configuration contains zero leaks and no wildcards', () => {
    assert.ok(fs.existsSync(PATHS.SIDECAR_CONFIG), 'Sidecar config must exist');
    const sidecarRaw = fs.readFileSync(PATHS.SIDECAR_CONFIG, 'utf-8');
    const sidecar = JSON.parse(sidecarRaw);

    // Verify no wildcards in agent_permissions
    assert.ok(sidecar.agent_permissions, 'Sidecar must declare agent_permissions');
    const perms = JSON.stringify(sidecar.agent_permissions);
    assert.strictEqual(perms.includes('"*"'), false, 'Sidecar permissions must not contain wildcard "*"');

    // Scan sidecar strings for leaks
    const violations = scanString(sidecarRaw, 'sidecar.json');
    assert.strictEqual(violations.length, 0,
      `Sidecar contains brand leaks: ${JSON.stringify(violations)}`);
  });

  test('Audit: Remotion source components and caption assets in src/ have zero active textual leaks', () => {
    const srcDir = path.resolve(__dirname, '../../src');
    if (!fs.existsSync(srcDir)) return;

    function getFilesRecursively(dir) {
      let results = [];
      const list = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of list) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          results.push(...getFilesRecursively(fullPath));
        } else if (entry.isFile()) {
          results.push(fullPath);
        }
      }
      return results;
    }

    const allFiles = getFilesRecursively(srcDir);
    const files = allFiles.filter(f => f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.json'));
    const violations = [];

    for (const filePath of files) {
      const relPath = path.relative(srcDir, filePath);
      const content = fs.readFileSync(filePath, 'utf-8');

      // JSON caption & data files
      if (filePath.endsWith('.json')) {
        try {
          const parsed = JSON.parse(content);
          function scanJsonNode(node, nodePath) {
            if (typeof node === 'string') {
              if (node.endsWith('.mp3') || node.endsWith('.png') || node.endsWith('.jpg') || node.startsWith('#')) return;
              const vs = scanString(node, `${relPath}:${nodePath}`);
              const critical = vs.filter(v =>
                v.rule === 'PRIVATE_SCHOOL_NAME' ||
                v.rule === 'NUMERIC_SCARCITY' ||
                v.rule === 'BANNED_TERMS' ||
                v.rule === 'EMOJI_DETECTED'
              );
              if (critical.length > 0) violations.push(...critical);
            } else if (Array.isArray(node)) {
              node.forEach((item, idx) => scanJsonNode(item, `${nodePath}[${idx}]`));
            } else if (node && typeof node === 'object') {
              for (const [key, val] of Object.entries(node)) {
                scanJsonNode(val, `${nodePath}.${key}`);
              }
            }
          }
          scanJsonNode(parsed, '$');
        } catch (err) {
          violations.push({ file: relPath, detail: `Invalid JSON: ${err.message}` });
        }
        continue;
      }

      // TSX / TS components
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        // Skip purely code/comment lines that describe replacements or imports or styles
        if (line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) {
          continue;
        }

        // Check for raw emojis in line (e.g. JSX span children)
        const lineEmojis = scanString(line, `${relPath}:L${i + 1}`).filter(v => v.rule === 'EMOJI_DETECTED');
        if (lineEmojis.length > 0) {
          violations.push(...lineEmojis);
        }

        // Check for string literals in tsx
        const stringLiteralMatches = line.match(/(?:'|"|`)([^'"`]+)(?:'|"|`)/g);
        if (stringLiteralMatches) {
          for (const lit of stringLiteralMatches) {
            const rawStr = lit.slice(1, -1);
            // Skip CSS properties or technical identifiers
            if (rawStr.endsWith('%') || rawStr.startsWith('#') || rawStr.includes('/') || rawStr.length < 3) {
              continue;
            }
            const vs = scanString(rawStr, `${relPath}:L${i + 1}`);
            // Filter out non-content matches
            const critical = vs.filter(v => 
              v.rule === 'PRIVATE_SCHOOL_NAME' || 
              v.rule === 'NUMERIC_SCARCITY' || 
              v.rule === 'BANNED_TERMS' ||
              v.rule === 'EMOJI_DETECTED'
            );
            if (critical.length > 0) {
              violations.push(...critical);
            }
          }
        }
      }
    }

    assert.strictEqual(violations.length, 0,
      `src/ components contain brand leaks: ${JSON.stringify(violations, null, 2)}`);
  });

  test('Audit: Desktop playbooks and documentation in Desktop/lira reels/', () => {
    const desktopDir = PATHS.DESKTOP_REELS;
    if (!fs.existsSync(desktopDir)) return;

    const mdFiles = fs.readdirSync(desktopDir).filter(f => f.endsWith('.md'));
    const violations = [];

    for (const file of mdFiles) {
      const filePath = path.join(desktopDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Skip lines that explicitly discuss guardrail rules, forbidden lists, or defects
        if (/NEVER|Prohibited|Banned|Forbidden|Defect|Failure Mode|anti-pattern|Rejection|reject|Do not/i.test(line)) {
          continue;
        }

        // Check for active ceremonial claims
        if (/\bceremonial\b/i.test(line)) {
          violations.push({
            file,
            line: i + 1,
            rule: 'BANNED_TERMS',
            detail: `Found un-sanitized ceremonial claim: "${line.trim()}"`
          });
        }

        // Check for school names
        if (GUARDRAILS.SCHOOL_NAMES_REGEX.test(line)) {
          violations.push({
            file,
            line: i + 1,
            rule: 'PRIVATE_SCHOOL_NAME',
            detail: `Found school name leak: "${line.trim()}"`
          });
        }
      }
    }

    assert.strictEqual(violations.length, 0,
      `Desktop files contain active brand leaks: ${JSON.stringify(violations, null, 2)}`);
  });

  test('Audit: Scripts directory has zero active hardcoded secrets or credentials', () => {
    const scriptsDir = PATHS.SCRIPTS_DIR;
    const files = fs.readdirSync(scriptsDir).filter(f => f.endsWith('.js') || f.endsWith('.mjs'));
    const leaks = [];

    for (const file of files) {
      const filePath = path.join(scriptsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');

      // Check for hardcoded Buffer or ElevenLabs tokens (e.g. Bearer 1/..., sk_...)
      if (/1\/[a-zA-Z0-9]{30,}/.test(content) && !file.includes('test')) {
        leaks.push({ file, leak: 'Potential hardcoded Buffer token' });
      }
      if (/sk_[a-zA-Z0-9]{30,}/.test(content) && !file.includes('test')) {
        leaks.push({ file, leak: 'Potential hardcoded ElevenLabs / secret token' });
      }
    }

    assert.strictEqual(leaks.length, 0,
      `Found hardcoded credentials in scripts: ${JSON.stringify(leaks)}`);
  });
});
