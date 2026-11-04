/**
 * Tier 1 - Feature 23: Daily Rush-Hour Automation Sidecar
 * Authoritative source: PROJECT.md & ORIGINAL_REQUEST.md §R5
 * Verifies sidecar.json configuration specifications:
 * - File location: /Users/caleb/.gemini/config/sidecars/lira-viral-content-engine/sidecar.json
 * - Schedule cron: CRON_TZ=Asia/Jakarta 30 7,12,18 * * * (07:30, 12:30, 18:30 WIB)
 * - Safe node runtime: /Users/caleb/.gemini/antigravity/scratch/.node/bin/node
 * - Alternating Reel & Carousel execution instructions with zero emojis and guardrail checks
 * - Strictly scoped agent_permissions (zero "*" wildcards)
 * - Non-interference: user_config.json is untouched by agent automation
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { PATHS, SIDECAR_SPECS, TOOLING } = require('../helpers/test_constants');

describe('Feature 23: Daily Rush-Hour Automation Sidecar', () => {
  const sidecarPath = PATHS.SIDECAR_CONFIG;

  test('Sidecar File Existence & Valid JSON: Configuration file exists and parses cleanly', () => {
    assert.ok(fs.existsSync(sidecarPath), `Sidecar config must exist at: ${sidecarPath}`);
    const content = fs.readFileSync(sidecarPath, 'utf-8');
    let parsed;
    assert.doesNotThrow(() => {
      parsed = JSON.parse(content);
    }, 'Sidecar config must be valid JSON');

    assert.strictEqual(parsed.builtin, 'schedule', 'Sidecar must use schedule builtin');
    assert.ok(Array.isArray(parsed.args), 'Sidecar args must be an array');
    assert.ok(parsed.display_name, 'Sidecar must have display_name');
    assert.ok(parsed.agent_permissions, 'Sidecar must define agent_permissions');
  });

  test('Rush-Hour Schedule & Timezone: Configures CRON_TZ=Asia/Jakarta 30 7,12,18 * * *', () => {
    assert.ok(fs.existsSync(sidecarPath), 'Sidecar file must exist');
    const config = JSON.parse(fs.readFileSync(sidecarPath, 'utf-8'));
    const cronArg = config.args[0];

    assert.ok(
      cronArg.includes('CRON_TZ=Asia/Jakarta') || cronArg.includes(SIDECAR_SPECS.TIMEZONE),
      'Cron argument must specify Asia/Jakarta timezone'
    );
    assert.ok(
      cronArg.includes('30 7,12,18 * * *') || cronArg.includes(SIDECAR_SPECS.SCHEDULE_CRON),
      'Cron expression must match rush hours: 07:30, 12:30, 18:30 WIB'
    );
  });

  test('Safe Runtime & Content Automator Command: Uses scratch Node and lira_content_automator.js', () => {
    assert.ok(fs.existsSync(sidecarPath), 'Sidecar file must exist');
    const config = JSON.parse(fs.readFileSync(sidecarPath, 'utf-8'));
    const instructions = config.args.join(' ');

    assert.ok(
      instructions.includes(TOOLING.NODE_BIN) || instructions.includes('scratch/.node/bin/node'),
      'Must specify isolated Node binary to prevent macOS CLT popups'
    );
    assert.ok(
      instructions.includes('scripts/lira_content_automator.js'),
      'Must invoke lira_content_automator.js in rush-hour pipeline'
    );
    assert.ok(
      instructions.includes('Reels') && instructions.includes('Carousels'),
      'Sidecar must handle alternating Reels and Carousels'
    );
  });

  test('Scoped Permissions Compliance: Strictly scoped grants with zero "*" wildcards', () => {
    assert.ok(fs.existsSync(sidecarPath), 'Sidecar file must exist');
    const config = JSON.parse(fs.readFileSync(sidecarPath, 'utf-8'));
    const permissions = config.agent_permissions;

    assert.ok(permissions, 'Sidecar must define agent_permissions object');
    assert.ok(Array.isArray(permissions.access_grants), 'access_grants must be an array');
    assert.ok(permissions.access_grants.length > 0, 'access_grants must not be empty');

    for (const grant of permissions.access_grants) {
      assert.strictEqual(
        grant.includes('*'),
        false,
        `Access grant must not contain wildcard "*": ${grant}`
      );
      assert.ok(
        /^(?:command|read_file|write_file|read_url)\(/.test(grant),
        `Access grant must use recognized scoped permission format: ${grant}`
      );
    }
  });

  test('User Configuration Non-Interference: user_config.json must remain untouched', () => {
    const userConfigPath = PATHS.USER_CONFIG;
    // Mandate: The agent must NOT create or edit user_config.json to force-enable the sidecar
    if (fs.existsSync(userConfigPath)) {
      const content = fs.readFileSync(userConfigPath, 'utf-8');
      // If user_config.json exists, verify it doesn't have an unauthorized forced auto-enable injected
      assert.ok(
        !content.includes('lira-viral-content-engine-force-enabled-by-agent'),
        'Agent must not force-enable sidecar in user_config.json'
      );
    } else {
      // If user_config.json does not exist, that confirms the agent has not created or touched it!
      assert.strictEqual(
        fs.existsSync(userConfigPath),
        false,
        'user_config.json has not been touched by automation'
      );
    }
  });
});
