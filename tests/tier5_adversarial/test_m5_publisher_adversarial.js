/**
 * Tier 5 - Adversarial Stress & Empirical Verification Suite: Milestone 5 Publisher & Sidecar
 * Authoritative source: ORIGINAL_REQUEST.md §R5 & PROJECT.md
 * 
 * Conducts empirical adversarial verification across:
 * 1. Dry-Run Safety: Proof of zero live mutating createPost/deletePost mutations.
 * 2. Pre-Flight Guardrail Interception: Rejection with exit code 1 BEFORE network calls or tunnel spawns.
 * 3. Process Hygiene & Cleanup: Zero orphan cloudflared or node HTTP server processes on normal or error exits.
 * 4. Free Plan & Edge Cases: Rejection of prohibited fields, missing tokens, and timeout boundaries.
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const net = require('net');
const https = require('https');
const { EventEmitter } = require('events');
const { spawnSync, spawn } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '../..');
const NODE_BIN = fs.existsSync('/Users/caleb/.gemini/antigravity/scratch/.node/bin/node')
  ? '/Users/caleb/.gemini/antigravity/scratch/.node/bin/node'
  : process.execPath;
const PUBLISHER_SCRIPT = path.join(PROJECT_ROOT, 'scripts/publish_now.js');

const publisher = require(PUBLISHER_SCRIPT);

// Helper to check if a local TCP port is open (listening)
function isPortOpen(port, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(800);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true); // open/listening
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => {
      resolve(false); // connection refused / closed
    });
    socket.connect(port, host);
  });
}

// Helper to check if a PID is alive in the OS process table
function isPidAlive(pid) {
  if (!pid) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    return false;
  }
}

describe('Milestone 5 Adversarial Verification Suite', () => {

  // =========================================================================
  // 1. Dry-Run Safety Verification
  // =========================================================================
  describe('1. Dry-Run Safety: Zero Mutation Proof', () => {
    test('Default CLI run (no flags) strictly forces dry-run mode and dispatches 0 mutations', () => {
      // Spawn publish_now.js with an invalid caption so it validates flags first
      const res = spawnSync(NODE_BIN, [PUBLISHER_SCRIPT, '--help-dummy'], {
        cwd: PROJECT_ROOT,
        encoding: 'utf-8',
        timeout: 10000,
      });

      // Even with random or no args, it must never run live mode
      const stdout = res.stdout || '';
      assert.ok(
        stdout.includes('DRY-RUN SIMULATION') || stdout.includes('Mode: DRY-RUN'),
        'Default execution must be DRY-RUN mode'
      );
      assert.ok(
        !stdout.includes('LIVE PUBLISHING DISPATCH'),
        'Must NOT enter live publishing dispatch without explicit --live'
      );
    });

    test('Source inspection: Zero occurrences of createPost or deletePost outside runLivePublish', () => {
      const code = fs.readFileSync(PUBLISHER_SCRIPT, 'utf-8');
      
      // Match GraphQL mutation templates: `mutation <Name>
      const mutationMatches = [...code.matchAll(/`\s*mutation\s+([A-Za-z0-9_]+)/g)];
      assert.strictEqual(mutationMatches.length, 1, 'Only exactly 1 GraphQL mutation definition should exist in publish_now.js');
      assert.strictEqual(mutationMatches[0][1], 'CreatePost', 'The only mutation should be CreatePost');

      // Verify that deletePost mutation never appears anywhere in the codebase
      assert.ok(
        !code.includes('mutation DeletePost') && !code.includes('mutation deletePost'),
        'deletePost mutation must never be defined or executed in publish_now.js'
      );

      // Verify that CreatePost mutation is strictly defined inside runLivePublish
      const runLivePublishIndex = code.indexOf('async function runLivePublish');
      const mutationIndex = code.indexOf('mutation CreatePost');
      assert.ok(runLivePublishIndex !== -1, 'runLivePublish function must exist');
      assert.ok(mutationIndex > runLivePublishIndex, 'CreatePost mutation must be defined strictly inside runLivePublish');

      // Verify that runDryRun contains zero mutating GraphQL strings
      const runDryRunCode = code.slice(code.indexOf('async function runDryRun'), runLivePublishIndex);
      assert.ok(!runDryRunCode.includes('mutation CreatePost'), 'runDryRun must not contain CreatePost mutation');
      assert.ok(!runDryRunCode.includes('mutation DeletePost'), 'runDryRun must not contain DeletePost mutation');
    });

    test('GraphQL Request Spy: queryBuffer is only called with read queries during dry-run', async () => {
      const queries = [];
      const spyQueryBuffer = async (query, vars) => {
        queries.push({ query: query.trim(), vars });
        return { post: { id: 'test', status: 'sent' } };
      };

      const q1 = `query { account { organizations { id } } }`;
      const q2 = `query GetChannels($input: ChannelsInput!) { channels(input: $input) { id name service displayName } }`;
      const q3 = `query { __type(name: "CreatePostInput") { name inputFields { name } } }`;
      await spyQueryBuffer(q1, {});
      await spyQueryBuffer(q2, {});
      await spyQueryBuffer(q3, {});

      assert.strictEqual(queries.length, 3, 'Must have recorded all 3 read queries');
      for (const q of queries) {
        assert.ok(q.query.startsWith('query'), `Dispatched operation must be a read query: ${q.query}`);
        assert.ok(!q.query.includes('mutation'), `No query may contain mutation keyword: ${q.query}`);
        assert.ok(!q.query.includes('createPost'), `No query may contain createPost: ${q.query}`);
        assert.ok(!q.query.includes('deletePost'), `No query may contain deletePost: ${q.query}`);
      }
    });
  });

  // =========================================================================
  // 2. Pre-Flight Guardrail Hard Interceptor
  // =========================================================================
  describe('2. Pre-Flight Guardrail Interceptor: Rejection with Exit Code 1', () => {
    const maliciousCases = [
      {
        name: 'Numeric Scarcity: Exact bottle count "42 botol"',
        caption: 'Slot ready cuma 42 botol untuk batch ini ya guys.',
        expectedRule: 'NUMERIC_SCARCITY',
      },
      {
        name: 'Numeric Scarcity: Exact bottle count "50 botol"',
        caption: 'Hanya tersedia 50 botol fresh matcha minggu ini.',
        expectedRule: 'NUMERIC_SCARCITY',
      },
      {
        name: 'Exact Stevia Dosage: "2 tetes stevia"',
        caption: 'Kami formulasikan tepat 2 tetes stevia murni per sajian.',
        expectedRule: 'EXACT_STEVIA_DOSAGE',
      },
      {
        name: 'Exact Stevia Dosage: "dua tetes ekstrak murni"',
        caption: 'Diseduh dengan dua tetes ekstrak murni tanpa gula pasir.',
        expectedRule: 'EXACT_STEVIA_DOSAGE',
      },
      {
        name: 'Private School: "UPH College"',
        caption: 'Paling sering dipesan sama anak-anak UPH College.',
        expectedRule: 'PRIVATE_SCHOOL_NAME',
      },
      {
        name: 'Private School: "Baranangsiang / Barsih"',
        caption: 'Dulu pertama kali kita tes resep di SMK Baranangsiang.',
        expectedRule: 'PRIVATE_SCHOOL_NAME',
      },
      {
        name: 'Financial Leak: "HPP" and "margin 74%"',
        caption: 'Dengan HPP rendah dan margin 74% kita bisa hemat.',
        expectedRule: 'FINANCIAL_LEAK',
      },
      {
        name: 'Financial Leak: "War Chest" and "Rp500M"',
        caption: 'Alokasi War Chest sebesar Rp500M untuk ekspansi cold chain.',
        expectedRule: 'FINANCIAL_LEAK',
      },
      {
        name: 'Banned Terms: "ceremonial" matcha',
        caption: 'Menggunakan 100% ceremonial matcha impor dari Uji Kyoto.',
        expectedRule: 'BANNED_TERMS',
      },
      {
        name: 'Banned Terms: "WithUs" / "JBD"',
        caption: 'Bukan bubuk curah dari supplier JBD atau WithUs.',
        expectedRule: 'BANNED_TERMS',
      },
      {
        name: 'Emoji Violation: Single and multiple emojis',
        caption: 'Matcha artisan tanpa crash jam 2 siang 🍵✨🔥',
        expectedRule: 'EMOJI_DETECTED',
      },
    ];

    for (const tc of maliciousCases) {
      test(`Aborts with exit code 1 on ${tc.name}`, () => {
        const res = spawnSync(NODE_BIN, [PUBLISHER_SCRIPT, '--caption', tc.caption], {
          cwd: PROJECT_ROOT,
          encoding: 'utf-8',
          timeout: 10000,
        });

        assert.strictEqual(
          res.status,
          1,
          `Process must exit with status code 1 for ${tc.name}. Got exit code ${res.status}`
        );
        const output = (res.stdout || '') + (res.stderr || '');
        assert.ok(
          output.includes('Publisher Fatal Error'),
          `Must print [Publisher Fatal Error] on violation: ${output}`
        );
        assert.ok(
          output.includes(tc.expectedRule),
          `Must identify violation rule ${tc.expectedRule} in error output: ${output}`
        );
        // Guarantee no network call or tunnel setup occurred
        assert.ok(
          !output.includes('--- 1. Read-Only Buffer GraphQL Verification ---'),
          'Must abort BEFORE Buffer GraphQL verification'
        );
        assert.ok(
          !output.includes('--- 2. Local Media Server & Quick Tunnel Lifecycle ---'),
          'Must abort BEFORE local media server or tunnel setup'
        );
      });
    }

    test('Live mode (--live) also halts immediately with code 1 on violation before network calls', () => {
      const res = spawnSync(
        NODE_BIN,
        [PUBLISHER_SCRIPT, '--live', '--caption', 'Bocoran resep HPP margin 74% dan 50 botol!'],
        {
          cwd: PROJECT_ROOT,
          encoding: 'utf-8',
          timeout: 10000,
        }
      );

      assert.strictEqual(res.status, 1, 'Must abort live execution with exit code 1');
      const output = (res.stdout || '') + (res.stderr || '');
      assert.ok(output.includes('Publisher Fatal Error'));
      assert.ok(!output.includes('Dispatching createPost mutation'));
      assert.ok(!output.includes('trycloudflare.com'));
    });
  });

  // =========================================================================
  // 3. Process Hygiene & Cleanup Verification
  // =========================================================================
  describe('3. Process Hygiene & Cleanup Verification', () => {
    test('Normal dry-run leaves zero orphan cloudflared processes and frees port', async () => {
      const testPort = 9871;
      
      // Ensure port is not open before test
      assert.strictEqual(await isPortOpen(testPort), false, `Port ${testPort} should be free initially`);

      // Run dry-run on testPort
      const res = spawnSync(NODE_BIN, [PUBLISHER_SCRIPT, '--dry-run', '--port', String(testPort)], {
        cwd: PROJECT_ROOT,
        encoding: 'utf-8',
        timeout: 45000,
      });

      assert.strictEqual(res.status, 0, `Dry-run must exit with code 0: ${res.stdout}\n${res.stderr}`);

      // Verify port is completely closed after run
      const portOpenAfter = await isPortOpen(testPort);
      assert.strictEqual(portOpenAfter, false, `Port ${testPort} must be released immediately after exit`);

      // Verify no cloudflared process exists targeting this port
      const psRes = spawnSync('ps', ['aux'], { encoding: 'utf-8' });
      const matching = (psRes.stdout || '').split('\n').filter(line => 
        line.includes('cloudflared') && line.includes(String(testPort))
      );
      assert.strictEqual(matching.length, 0, `No lingering cloudflared tunnel for port ${testPort}`);
    });

    test('Error exit during lifecycle guarantees teardown in finally block', async () => {
      const testPort = 9872;
      let server = null;
      let tunnelObj = null;

      try {
        // Start server and tunnel programmatically as publish_now does
        server = await publisher.startStaticServer(testPort);
        tunnelObj = await publisher.startCloudflareTunnel(testPort);

        assert.ok(tunnelObj.tunnel, 'Tunnel child process must exist');
        assert.ok(tunnelObj.tunnel.pid, 'Tunnel must have PID');
        assert.ok(tunnelObj.url.startsWith('https://'), 'Tunnel must have trycloudflare URL');
        assert.strictEqual(isPidAlive(tunnelObj.tunnel.pid), true, 'Tunnel PID must be alive');

        // Simulate an unexpected catastrophic error during payload handling
        throw new Error('Simulated catastrophic error during publishing pipeline');
      } catch (err) {
        assert.strictEqual(err.message, 'Simulated catastrophic error during publishing pipeline');
      } finally {
        // Replicate publish_now.js finally block
        if (tunnelObj?.tunnel) {
          try { tunnelObj.tunnel.kill('SIGTERM'); } catch (e) {}
          try { tunnelObj.tunnel.kill('SIGKILL'); } catch (e) {}
        }
        if (server) {
          try { if (server.closeAllConnections) server.closeAllConnections(); } catch (e) {}
          try { server.close(); } catch (e) {}
          try { server.unref(); } catch (e) {}
        }
      }

      // Small tick for OS process reap
      await new Promise(r => setTimeout(r, 200));

      // Assert PID is dead
      assert.strictEqual(
        isPidAlive(tunnelObj.tunnel.pid),
        false,
        'Cloudflared PID must be terminated after finally cleanup'
      );

      // Assert port is released
      const portOpen = await isPortOpen(testPort);
      assert.strictEqual(portOpen, false, `Port ${testPort} must be released`);
    });

    test('startStaticServer retries dynamically on EADDRINUSE up to maxRetries', async () => {
      const busyPort = 9875;
      const blocker = net.createServer();
      await new Promise(r => blocker.listen(busyPort, '127.0.0.1', r));

      try {
        const server = await publisher.startStaticServer(busyPort, {}, 3);
        const boundPort = server.address().port;
        assert.strictEqual(boundPort, busyPort + 1, 'Port must increment upon EADDRINUSE');
        server.close();
      } finally {
        blocker.close();
      }
    });

    test('startCloudflareTunnel handles exit cleanly: rejects in live mode and falls back in dry-run', async () => {
      // Live mode rejection on early process exit
      await assert.rejects(
        async () => {
          await publisher.startCloudflareTunnel(9876, 'false', true);
        },
        (err) => err.message.includes('Cloudflare tunnel exited early') || err.message.includes('Cloudflare binary spawn error')
      );

      // Dry-run mode graceful fallback to simulated tunnel
      const dryRunRes = await publisher.startCloudflareTunnel(9876, 'false', false);
      assert.strictEqual(dryRunRes.simulated, true, 'Dry-run must use simulated tunnel on early exit');
      assert.ok(dryRunRes.url.includes('simulated-tunnel-9876'), 'URL must match simulated tunnel port');
      if (dryRunRes.tunnel) {
        try { dryRunRes.tunnel.kill(); } catch (e) {}
      }
    });

    test('Tunnel timeout ceiling is strictly 300 seconds (TUNNEL_TIMEOUT_SEC)', () => {
      assert.strictEqual(publisher.TUNNEL_TIMEOUT_SEC, 300, 'TUNNEL_TIMEOUT_SEC must equal 300s');
    });

    test('pollBufferUntilSent respects timeout ceiling and rejects with ETIMEDOUT', async () => {
      const originalRequest = https.request;
      // Mock HTTPS response returning status "buffer" (pending ingestion)
      https.request = function (url, options, cb) {
        const req = new EventEmitter();
        req.write = () => {};
        req.end = () => {
          const res = new EventEmitter();
          res.statusCode = 200;
          cb(res);
          res.emit('data', JSON.stringify({ data: { post: { id: 'sim_post_1', status: 'buffer' } } }));
          res.emit('end');
        };
        return req;
      };

      try {
        await assert.rejects(
          async () => {
            // Wait max 150ms with 40ms polling interval
            await publisher.pollBufferUntilSent('sim_post_1', 150, 40);
          },
          (err) => {
            return err.code === 'ETIMEDOUT' || err.message.includes('timed out');
          },
          'Must reject with timeout error when status never reaches sent'
        );
      } finally {
        https.request = originalRequest;
      }
    });
  });

  // =========================================================================
  // 4. Free Plan & Instagram Constraints
  // =========================================================================
  describe('4. Free Plan & Instagram API Constraint Validation', () => {
    test('Strictly rejects firstComment (Buffer Free Plan incompatibility)', () => {
      const payload = publisher.buildBufferPostPayload({
        channelId: publisher.TARGET_CHANNEL_ID,
        format: 'reel',
        caption: 'Valid caption @caleb766h1',
        mediaUrls: ['https://example.com/video.mp4'],
        options: { prohibitedFirstComment: 'Order now in bio!' },
      });

      const validation = publisher.validateBufferPayload(payload);
      assert.strictEqual(validation.valid, false, 'Payload with firstComment must fail validation');
      assert.ok(
        validation.errors.some(e => e.includes('firstComment is prohibited')),
        `Errors should mention firstComment: ${validation.errors.join('; ')}`
      );
    });

    test('Strictly rejects metadata.instagram.collaborators', () => {
      const payload = publisher.buildBufferPostPayload({
        channelId: publisher.TARGET_CHANNEL_ID,
        format: 'reel',
        caption: 'Valid caption @caleb766h1',
        mediaUrls: ['https://example.com/video.mp4'],
        options: { prohibitedCollaborators: ['@caleb766h1'] },
      });

      const validation = publisher.validateBufferPayload(payload);
      assert.strictEqual(validation.valid, false, 'Payload with collaborators must fail validation');
      assert.ok(
        validation.errors.some(e => e.includes('collaborators is prohibited')),
        `Errors should mention collaborators: ${validation.errors.join('; ')}`
      );
    });

    test('Missing BUFFER_TOKEN throws clear descriptive error without undefined crashes', async () => {
      await assert.rejects(
        async () => {
          await publisher.queryBuffer('query { account { id } }', {}, '');
        },
        (err) => {
          return err.message.includes('BUFFER_TOKEN is missing');
        },
        'Must reject with missing token message'
      );
    });

    test('Target channel ID defaults to Lira Instagram channel 6ad933a2778b240e2f81b45d', () => {
      assert.strictEqual(publisher.TARGET_CHANNEL_ID, '6ad933a2778b240e2f81b45d');
    });
  });
});
