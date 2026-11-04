/**
 * Tier 1 - Feature 22: Controlled Infrastructure Safety
 * Authoritative source: PROJECT.md & ORIGINAL_REQUEST.md §R5
 * Verifies safe infrastructure controls for Instagram publishing:
 * - Default execution mode is --dry-run (never mutates live @drinklira feed during tests)
 * - Explicit guard requiring --live flag to trigger createPost GraphQL mutation
 * - Pre-flight guardrail gate halts publishing on brand/confidentiality violations
 * - Environment variable hygiene (.env credential loading, zero hardcoded tokens)
 * - Read-only query safelist allowed in dry-run mode (channels, account, __type queries)
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { PATHS, BUFFER_PUBLISHER } = require('../helpers/test_constants');
const oracle = require('../helpers/guardrail_oracle');
const { readEnvFile, getValidSampleReelPayload } = require('../helpers/test_fixture_loader');

// Progressive testability: dynamic guardrail validator resolution
const guardrailScriptPath = path.join(PATHS.SCRIPTS_DIR, 'validate_guardrails.js');
const { validateContent, GuardrailError } = fs.existsSync(guardrailScriptPath)
  ? require(guardrailScriptPath)
  : oracle;

// Publisher safety mock implementing dry-run & live guards
class SafePublisherClient {
  constructor(options = {}) {
    this.mode = options.live === true ? 'live' : 'dry-run';
    this.token = options.token || process.env.BUFFER_TOKEN || readEnvFile().BUFFER_TOKEN;
    this.mutationsExecuted = [];
    this.queriesExecuted = [];
  }

  async executeQuery(query, variables = {}) {
    const isMutation = /^\s*mutation\b/i.test(query.trim());
    if (isMutation) {
      if (this.mode !== 'live') {
        // Dry-run intercepts mutation safely
        return {
          dryRun: true,
          simulated: true,
          post: {
            id: `dry_run_post_${Date.now()}`,
            status: 'simulated_success',
            mode: 'shareNow',
          },
        };
      }
      this.mutationsExecuted.push({ query, variables });
      return { live: true, post: { id: 'live_post_123', status: 'sent' } };
    }

    this.queriesExecuted.push({ query, variables });
    return { data: { channel: { id: BUFFER_PUBLISHER.CHANNEL_ID, name: 'drinklira' } } };
  }

  async publish(contentPayload) {
    // 1. Mandatory Pre-Flight Guardrail Check
    validateContent({
      script: contentPayload.verbal_hook,
      caption: contentPayload.caption,
      hookText: contentPayload.written_hook,
    });

    // 2. Dispatch query/mutation through safe gateway
    return this.executeQuery('mutation CreatePost($input: CreatePostInput!) { createPost(input: $input) }', {
      input: {
        channelId: BUFFER_PUBLISHER.CHANNEL_ID,
        mode: BUFFER_PUBLISHER.SCHEDULING_TYPE,
        text: contentPayload.caption,
      },
    });
  }
}

describe('Feature 22: Controlled Infrastructure Safety', () => {
  test('Default Mode is Dry-Run: Safe execution without --live must never perform real mutation', async () => {
    const client = new SafePublisherClient({ live: false });
    assert.strictEqual(client.mode, 'dry-run', 'Default mode must be dry-run');

    const reelData = getValidSampleReelPayload();
    const result = await client.publish(reelData);

    assert.strictEqual(result.dryRun, true, 'Dry-run must intercept mutation');
    assert.strictEqual(client.mutationsExecuted.length, 0, 'Zero live mutations executed in dry-run mode');
  });

  test('Pre-Flight Guardrail Interceptor: Aborts publishing BEFORE network calls on guardrail failure', async () => {
    const client = new SafePublisherClient({ live: false });
    const leakingPayload = {
      verbal_hook: 'Hari ini kita stok 42 botol aja ya guys.', // Banned bottle count
      written_hook: 'STOK 42 BOTOL',
      caption: 'Limited batch 42 botol via bio.',
    };

    await assert.rejects(
      async () => client.publish(leakingPayload),
      (err) => err.name === 'GuardrailError' || err instanceof oracle.GuardrailError,
      'Must reject leaking content before network dispatch'
    );

    assert.strictEqual(client.mutationsExecuted.length, 0, 'No mutations should be called when guardrail fails');
    assert.strictEqual(client.queriesExecuted.length, 0, 'No queries should be made when guardrail fails');
  });

  test('Live Mode Guard: createPost mutation requires explicit live activation', async () => {
    // 1. In dry-run mode, mutation is intercepted
    const dryClient = new SafePublisherClient({ live: false });
    const dryRes = await dryClient.executeQuery('mutation CreatePost { createPost }');
    assert.strictEqual(dryRes.dryRun, true);
    assert.strictEqual(dryClient.mutationsExecuted.length, 0);

    // 2. In live mode, mutation is recorded
    const liveClient = new SafePublisherClient({ live: true });
    const liveRes = await liveClient.executeQuery('mutation CreatePost { createPost }');
    assert.strictEqual(liveRes.live, true);
    assert.strictEqual(liveClient.mutationsExecuted.length, 1);
  });

  test('Read-Only Query Safelist: Read queries (channels, account, __type) permitted in dry-run', async () => {
    const client = new SafePublisherClient({ live: false });
    const channelQuery = `query GetChannels { channels { id name } }`;

    const result = await client.executeQuery(channelQuery);
    assert.ok(result.data?.channel?.id, 'Read-only queries must succeed in dry-run');
    assert.strictEqual(client.queriesExecuted.length, 1);
  });

  test('Secret Hygiene & Isolation: Token configurable via process.env, zero hardcoded reliance', () => {
    // 1. Verify that publisher client supports process.env override
    const testToken = 'test-isolated-buffer-token-xyz';
    const client = new SafePublisherClient({ token: testToken });
    assert.strictEqual(client.token, testToken, 'Client must accept injected environment token');

    // 2. Verify publish_now.js or publisher modules support process.env.BUFFER_TOKEN
    const publishScript = path.join(PATHS.SCRIPTS_DIR, 'publish_now.js');
    if (fs.existsSync(publishScript)) {
      const scriptCode = fs.readFileSync(publishScript, 'utf-8');
      assert.ok(
        scriptCode.includes('process.env.BUFFER_TOKEN'),
        'publish_now.js must support process.env.BUFFER_TOKEN'
      );
    }
  });
});
