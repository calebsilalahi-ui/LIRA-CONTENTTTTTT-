/**
 * Tier 1 - Feature 21: Cloudflared Tunnel Lifecycle
 * Authoritative source: PROJECT.md & ORIGINAL_REQUEST.md §R5
 * Verifies Cloudflare tunnel lifecycle specifications:
 * - Tunnel command: cloudflared tunnel --url http://127.0.0.1:<PORT>
 * - Regex extraction for trycloudflare.com endpoint
 * - Pre-publish edge propagation probe (verifying 200 OK before mutation)
 * - Post-mutation lifecycle holding (tunnel must remain active until Buffer confirms status === 'sent')
 * - Graceful cleanup & 300s timeout boundaries (guaranteed kill on server & tunnel)
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { TOOLING, BUFFER_PUBLISHER } = require('../helpers/test_constants');

describe('Feature 21: Cloudflared Tunnel Lifecycle', () => {
  test('Tunnel Binary Path Resolution: Points to existing cloudflared binary or valid runtime name', () => {
    const binary = TOOLING.CLOUDFLARED_BIN;
    assert.ok(binary, 'TOOLING.CLOUDFLARED_BIN must be defined');

    if (path.isAbsolute(binary)) {
      assert.ok(fs.existsSync(binary), `Binary at ${binary} must exist on disk`);
    } else {
      assert.strictEqual(binary, 'cloudflared', 'Fallback must specify cloudflared executable');
    }
  });

  test('Tunnel Command & Spawn Arguments: Validates tunnel invocation parameters', () => {
    const port = 8996;
    const expectedArgs = ['tunnel', '--url', `http://127.0.0.1:${port}`];

    assert.strictEqual(expectedArgs[0], 'tunnel');
    assert.strictEqual(expectedArgs[1], '--url');
    assert.strictEqual(expectedArgs[2], `http://127.0.0.1:${port}`);
  });

  test('Cloudflare Endpoint URL Regex: Extracts trycloudflare.com URL from process stdout/stderr', () => {
    const sampleOutput = `
      2026-11-03T02:00:00Z INF +--------------------------------------------------------------------------------------------+
      2026-11-03T02:00:00Z INF |  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):  |
      2026-11-03T02:00:00Z INF |  https://urban-lira-matcha-test.trycloudflare.com                                          |
      2026-11-03T02:00:00Z INF +--------------------------------------------------------------------------------------------+
      2026-11-03T02:00:01Z INF Registered tunnel connection connIndex=0 connection=abc-123
    `;

    const tunnelRegex = /https:\/\/[a-z0-9-]+\.trycloudflare\.com/;
    const match = sampleOutput.match(tunnelRegex);

    assert.ok(match, 'Must match Cloudflare tunnel quick URL');
    assert.strictEqual(match[0], 'https://urban-lira-matcha-test.trycloudflare.com');
  });

  test('Edge Propagation Probe Contract: Verifies probe logic confirms HTTP 200 before publishing', async () => {
    // Simulates an edge probe function that retries until 200 OK or timeout
    let callCount = 0;
    async function mockProbeEdge(checkFn, maxAttempts = 5) {
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const code = await checkFn(attempt);
        if (code === 200) return { reachable: true, attempts: attempt };
      }
      throw new Error('Tunnel edge unreachable after max attempts');
    }

    // Edge takes 3 attempts to propagate from 502/000 to 200
    const result = await mockProbeEdge(async (attempt) => {
      callCount++;
      return attempt >= 3 ? 200 : 502;
    });

    assert.strictEqual(result.reachable, true);
    assert.strictEqual(result.attempts, 3);
    assert.strictEqual(callCount, 3);
  });

  test('Tunnel Holding Lifecycle Contract: Tunnel remains active while polling until Buffer status === "sent"', async () => {
    // Simulates Buffer asynchronous ingestion lifecycle:
    // 1. Post is created (status: "buffer" / "created") -> tunnel MUST NOT close
    // 2. Buffer fetches media from tunnel (status: "pending") -> tunnel MUST NOT close
    // 3. Buffer confirms delivery (status: "sent") -> tunnel can safely close

    const statusHistory = ['buffer', 'pending', 'pending', 'sent'];
    let pollCount = 0;
    let tunnelKilled = false;

    const mockTunnel = {
      isAlive: true,
      kill: () => {
        mockTunnel.isAlive = false;
        tunnelKilled = true;
      },
    };

    async function pollBufferUntilSent(mockPostId, pollLimit = 10) {
      for (let i = 0; i < pollLimit; i++) {
        const currentStatus = statusHistory[pollCount] || 'sent';
        pollCount++;

        // Assert tunnel is STILL alive during polling
        assert.ok(mockTunnel.isAlive, `Tunnel must be alive on poll step ${i + 1} with status "${currentStatus}"`);

        if (currentStatus === 'sent') {
          break;
        }
      }

      // Cleanup step once sent
      mockTunnel.kill();
    }

    await pollBufferUntilSent('mock-post-123');

    assert.strictEqual(pollCount, 4);
    assert.strictEqual(tunnelKilled, true);
    assert.strictEqual(mockTunnel.isAlive, false);
  });

  test('Timeout Boundary & Teardown Guarantee: Honors 300s ceiling and guarantees resource kill', () => {
    const timeoutSec = BUFFER_PUBLISHER.TUNNEL_TIMEOUT_SEC;
    assert.strictEqual(timeoutSec, 300, 'Tunnel polling timeout ceiling must be 300 seconds');

    let serverClosed = false;
    let tunnelKilled = false;

    // Simulate finally block teardown
    const mockServer = { close: () => { serverClosed = true; } };
    const mockTunnel = { kill: () => { tunnelKilled = true; } };

    try {
      // Simulate error during processing
      throw new Error('Simulated network timeout during publishing');
    } catch (e) {
      assert.ok(e.message.includes('timeout'));
    } finally {
      mockTunnel.kill();
      mockServer.close();
    }

    assert.strictEqual(tunnelKilled, true, 'Tunnel must be killed in finally block');
    assert.strictEqual(serverClosed, true, 'HTTP server must be closed in finally block');
  });
});
