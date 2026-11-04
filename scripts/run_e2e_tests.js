#!/usr/bin/env node
/**
 * Lira Viral Content Engine - Unified E2E Test Runner
 * Authoritative source: PROJECT.md § Architecture, Milestones M0-TEST & M6
 * 
 * Supports:
 *   --tier <1|2|3|4|all>   Filter execution to specific test tier
 *   --summary              Display structured test summary table
 *   --filter <pattern>     Filter test files by regex/substring pattern
 *   --feature <number>     Filter specifically to Feature N in Tier 1
 *   --help                 Display runner usage
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const NODE_BIN = fs.existsSync('/Users/caleb/.gemini/antigravity/scratch/.node/bin/node')
  ? '/Users/caleb/.gemini/antigravity/scratch/.node/bin/node'
  : process.execPath;

// Test Tiers Directory Mapping
const TIER_CONFIG = {
  1: {
    name: 'Tier 1: Feature Coverage (F01–F24)',
    dir: path.join(PROJECT_ROOT, 'tests/tier1_features'),
    pattern: /^test_f\d{2}_.*\.js$/,
  },
  2: {
    name: 'Tier 2: Boundary & Corner Cases',
    dir: path.join(PROJECT_ROOT, 'tests/tier2_boundaries'),
    pattern: /^test_.*\.js$/,
  },
  3: {
    name: 'Tier 3: Pairwise Cross-Feature Interactions',
    dir: path.join(PROJECT_ROOT, 'tests/tier3_cross_feature'),
    pattern: /^test_.*\.js$/,
  },
  4: {
    name: 'Tier 4: Real-World Workload Scenarios',
    dir: path.join(PROJECT_ROOT, 'tests/tier4_real_world'),
    pattern: /^test_.*\.js$/,
  },
};

// Parse Command-Line Arguments
function parseArgs(args) {
  const options = {
    tier: 'all',
    summary: false,
    filter: null,
    feature: null,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--summary' || arg === '-s') {
      options.summary = true;
    } else if (arg === '--tier' || arg === '-t') {
      options.tier = args[++i];
    } else if (arg.startsWith('--tier=')) {
      options.tier = arg.split('=')[1];
    } else if (arg === '--filter' || arg === '-f') {
      options.filter = args[++i];
    } else if (arg.startsWith('--filter=')) {
      options.filter = arg.split('=')[1];
    } else if (arg === '--feature') {
      options.feature = args[++i];
    } else if (arg.startsWith('--feature=')) {
      options.feature = arg.split('=')[1];
    }
  }

  return options;
}

function showHelp() {
  console.log(`
Lira Viral Content Engine - Unified Test Runner

Usage:
  node scripts/run_e2e_tests.js [options]

Options:
  --tier <1|2|3|4|all>   Run tests from a specific tier (default: all)
  --summary              Display structured test summary table
  --filter <pattern>     Filter test files by filename substring or regex
  --feature <number>     Run specific feature test (e.g. 18 or f18)
  --help, -h             Show this help message

Examples:
  node scripts/run_e2e_tests.js --tier 1
  node scripts/run_e2e_tests.js --tier all --summary
  node scripts/run_e2e_tests.js --feature 18
  node scripts/run_e2e_tests.js --filter guardrail
`);
}

// Discover Test Files
function discoverTestFiles(options) {
  const activeTiers = [];

  if (options.tier === 'all') {
    activeTiers.push(1, 2, 3, 4);
  } else {
    const t = parseInt(options.tier, 10);
    if (!TIER_CONFIG[t]) {
      console.error(`Error: Unknown tier "${options.tier}". Allowed: 1, 2, 3, 4, all`);
      process.exit(1);
    }
    activeTiers.push(t);
  }

  const plannedFiles = [];

  for (const tierNum of activeTiers) {
    const config = TIER_CONFIG[tierNum];
    if (!fs.existsSync(config.dir)) {
      continue;
    }

    const files = fs.readdirSync(config.dir).sort();
    for (const file of files) {
      if (!config.pattern.test(file)) continue;

      // Apply feature filter if specified
      if (options.feature) {
        const featNum = String(options.feature).padStart(2, '0').replace(/^f/i, '');
        const targetToken = `f${featNum}`;
        if (!file.toLowerCase().includes(targetToken)) {
          continue;
        }
      }

      // Apply regex/substring filter if specified
      if (options.filter) {
        const regex = new RegExp(options.filter, 'i');
        if (!regex.test(file)) {
          continue;
        }
      }

      plannedFiles.push({
        tier: tierNum,
        tierName: config.name,
        filename: file,
        fullPath: path.join(config.dir, file),
      });
    }
  }

  return plannedFiles;
}

// Execute a single test file using Node's native runner
function executeTestFile(testItem) {
  const startTime = Date.now();
  const proc = spawnSync(NODE_BIN, ['--test', testItem.fullPath], {
    cwd: PROJECT_ROOT,
    encoding: 'utf-8',
    env: { ...process.env, NODE_ENV: 'test' },
  });

  const durationMs = Date.now() - startTime;
  const rawOutput = (proc.stdout || '') + (proc.stderr || '');
  const cleanOutput = rawOutput.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '');
  const passed = proc.status === 0;

  // Parse test counts from Node test runner output
  // Matches: "ℹ tests 5\nℹ pass 5\nℹ fail 0"
  let testsCount = 0;
  let passCount = 0;
  let failCount = 0;

  const testsMatch = cleanOutput.match(/tests\s+(\d+)/i);
  const passMatch = cleanOutput.match(/pass\s+(\d+)/i);
  const failMatch = cleanOutput.match(/fail\s+(\d+)/i);

  if (testsMatch) testsCount = parseInt(testsMatch[1], 10);
  if (passMatch) passCount = parseInt(passMatch[1], 10);
  if (failMatch) failCount = parseInt(failMatch[1], 10);

  // If node:test output didn't have footer, count checkmarks
  if (testsCount === 0) {
    const checks = (cleanOutput.match(/✔ /g) || []).length;
    passCount = checks;
    testsCount = checks;
  }

  return {
    ...testItem,
    passed,
    exitCode: proc.status,
    durationMs,
    testsCount,
    passCount,
    failCount,
    output: rawOutput,
  };
}

// Print Summary Table
function printSummaryTable(results) {
  console.log('\n' + '='.repeat(88));
  console.log('                        LIRA E2E TEST EXECUTION SUMMARY');
  console.log('='.repeat(88));

  const formatRow = (cols, widths) =>
    cols.map((col, i) => String(col).padEnd(widths[i])).join(' | ');

  const widths = [8, 44, 8, 10, 8];
  console.log(formatRow(['Tier', 'Suite / File', 'Status', 'Pass/Total', 'Duration'], widths));
  console.log('-'.repeat(88));

  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;
  let totalDurationMs = 0;

  for (const res of results) {
    totalTests += res.testsCount;
    totalPassed += res.passCount;
    totalFailed += res.failCount;
    totalDurationMs += res.durationMs;

    const statusStr = res.passed ? '✓ PASS' : '✖ FAIL';
    const countStr = `${res.passCount}/${res.testsCount}`;
    const durStr = `${res.durationMs}ms`;

    console.log(formatRow([`Tier ${res.tier}`, res.filename, statusStr, countStr, durStr], widths));
  }

  console.log('='.repeat(88));
  console.log(`Total Suites:   ${results.length}`);
  console.log(`Total Tests:    ${totalTests}`);
  console.log(`Passed Tests:   ${totalPassed}`);
  console.log(`Failed Tests:   ${totalFailed}`);
  console.log(`Total Duration: ${(totalDurationMs / 1000).toFixed(2)}s`);
  console.log('='.repeat(88) + '\n');
}

// Main Execution
function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    showHelp();
    process.exit(0);
  }

  console.log(`[Lira E2E Test Runner] Node runtime: ${NODE_BIN}`);
  console.log(`[Lira E2E Test Runner] Selected Tier: ${options.tier}`);

  const testFiles = discoverTestFiles(options);

  if (testFiles.length === 0) {
    console.log(`\nNo test files found for tier: ${options.tier} (directory may not exist yet or no matching filter)`);
    process.exit(0);
  }

  console.log(`[Lira E2E Test Runner] Discovered ${testFiles.length} test suites. Executing...\n`);

  const results = [];
  let allPassed = true;

  for (const item of testFiles) {
    process.stdout.write(`• Running [Tier ${item.tier}] ${item.filename} ... `);
    const result = executeTestFile(item);
    results.push(result);

    if (result.passed) {
      console.log(`✓ PASS (${result.passCount} tests, ${result.durationMs}ms)`);
    } else {
      console.log(`✖ FAIL (${result.failCount} failed, ${result.durationMs}ms)`);
      allPassed = false;
      console.error('\n' + '-'.repeat(60));
      console.error(`FAILURE OUTPUT: ${item.filename}`);
      console.error('-'.repeat(60));
      console.error(result.output);
      console.error('-'.repeat(60) + '\n');
    }
  }

  if (options.summary || !allPassed) {
    printSummaryTable(results);
  }

  if (allPassed) {
    const totalCount = results.reduce((acc, r) => acc + r.testsCount, 0);
    console.log(`\n✓ SUCCESS: All ${results.length} suites passed (${totalCount} tests).`);
    process.exit(0);
  } else {
    console.error(`\n✖ FAILURE: One or more test suites failed.`);
    process.exit(1);
  }
}

main();
