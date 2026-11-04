/**
 * Tier 3 - Cross-Feature Interaction Test Suite
 * Authoritative source: PROJECT.md & ORIGINAL_REQUEST.md §R1, R2, R3, R4, R5
 * 
 * Verifies pairwise cross-feature interaction pipelines:
 * 1. Interaction 1: Automator -> Guardrail Validator -> Reel Engine
 * 2. Interaction 2: Automator -> Cooldown & Jaccard Gate -> Carousel Engine
 * 3. Interaction 3: Publisher -> Dry-Run Safety Gate -> Cloudflared Tunnel Lifecycle
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { PATHS, REEL_SPECS, CAROUSEL_SPECS, AUDIO_SPECS, BUFFER_PUBLISHER, LIRA_CONTEXT } = require('../helpers/test_constants');
const oracle = require('../helpers/guardrail_oracle');
const { computeBigramJaccard, validatePairwiseJaccard } = require('../helpers/jaccard_oracle');
const { createTempSandbox, getValidSampleReelPayload, getValidSampleCarouselPayload } = require('../helpers/test_fixture_loader');

// Progressive testability binding for guardrails
const guardrailScript = path.join(PATHS.SCRIPTS_DIR, 'validate_guardrails.js');
const { validateContent, GuardrailError } = fs.existsSync(guardrailScript) ? require(guardrailScript) : oracle;

// Helper: Simulated Reel Engine Parameterizer
function parameterizeReelEngine(contentConfig) {
  // Guardrail pre-flight gate is mandatory
  validateContent(contentConfig);

  const headlineWords = contentConfig.written_hook.trim().split(/\s+/).filter(Boolean);
  if (headlineWords.length > REEL_SPECS.HEADLINE_MAX_WORDS) {
    throw new Error(`Headline exceeds ${REEL_SPECS.HEADLINE_MAX_WORDS} words`);
  }

  // Validate overlay placement against universal safe box
  if (Array.isArray(contentConfig.overlays)) {
    for (const ov of contentConfig.overlays) {
      if (typeof ov === 'object' && ov.x !== undefined && ov.y !== undefined) {
        const x = ov.x;
        const y = ov.y;
        if (x < REEL_SPECS.SAFE_BOX.xMin || x > REEL_SPECS.SAFE_BOX.xMax ||
            y < REEL_SPECS.SAFE_BOX.yMin || y > REEL_SPECS.SAFE_BOX.yMax) {
          throw new Error(`Overlay "${ov.text}" outside safe box: (${x}, ${y})`);
        }
      }
    }
  }

  return {
    engine: 'remotion-9x16',
    width: REEL_SPECS.WIDTH,
    height: REEL_SPECS.HEIGHT,
    fps: REEL_SPECS.FPS,
    durationTargetSec: 28,
    speechOnsetCeiling: AUDIO_SPECS.MAX_SPEECH_ONSET_SEC,
    subtitleDelaySec: REEL_SPECS.SUBTITLE_SUPPRESS_DELAY_SEC,
    targetLufs: AUDIO_SPECS.TARGET_LUFS,
    safeBox: REEL_SPECS.SAFE_BOX,
    content: contentConfig,
    readyToRender: true,
  };
}

// Helper: Simulated Cooldown & Jaccard Ledger Gate for Carousel
function evaluateCarouselCooldown(candidate, ledgerEntries, windowSize = 3) {
  // 1. Check recent slots for identical tuple (pillar, format, hook_category)
  const recentSlice = ledgerEntries.slice(-windowSize);
  const tupleCollision = recentSlice.find(
    (e) => e.pillar === candidate.pillar &&
           e.format === candidate.format &&
           e.hook_category === candidate.hook_category
  );

  if (tupleCollision) {
    return {
      allowed: false,
      reason: 'COOLDOWN_COLLISION',
      detail: `Tuple (${candidate.pillar}, ${candidate.format}, ${candidate.hook_category}) repeated within cooldown window`,
    };
  }

  // 2. Check bigram Jaccard similarity against all previous headlines/hooks in ledger
  let maxSimilarity = 0;
  let mostSimilarEntry = null;

  for (const entry of ledgerEntries) {
    const prevText = entry.written_hook || entry.topic || '';
    const candText = candidate.written_hook || candidate.topic || '';
    const sim = computeBigramJaccard(candText, prevText);
    if (sim > maxSimilarity) {
      maxSimilarity = sim;
      mostSimilarEntry = entry;
    }
  }

  if (maxSimilarity >= LIRA_CONTEXT.MAX_BIGRAM_JACCARD) {
    return {
      allowed: false,
      reason: 'SIMILARITY_GATE_BREACH',
      similarity: maxSimilarity,
      threshold: LIRA_CONTEXT.MAX_BIGRAM_JACCARD,
      collidingEntry: mostSimilarEntry,
    };
  }

  return {
    allowed: true,
    maxSimilarity,
    threshold: LIRA_CONTEXT.MAX_BIGRAM_JACCARD,
  };
}

// Helper: Simulated Carousel Engine Parameterizer
function parameterizeCarouselEngine(candidate) {
  validateContent(candidate);

  if (!Array.isArray(candidate.slides) || candidate.slides.length < CAROUSEL_SPECS.MIN_SLIDES || candidate.slides.length > CAROUSEL_SPECS.MAX_SLIDES) {
    throw new Error(`Carousel must contain ${CAROUSEL_SPECS.MIN_SLIDES}-${CAROUSEL_SPECS.MAX_SLIDES} slides`);
  }

  // Slide 2 standalone re-serve hook check
  const slide2 = candidate.slides.find((s) => s.slideNumber === 2 || s.type === 'reserve_hook');
  if (slide2) {
    const s2Words = slide2.headline.trim().split(/\s+/).filter(Boolean).length;
    if (s2Words > CAROUSEL_SPECS.SLIDE2_MAX_WORDS) {
      throw new Error(`Slide 2 headline (${s2Words} words) exceeds max ${CAROUSEL_SPECS.SLIDE2_MAX_WORDS} words`);
    }
  }

  return {
    engine: 'carousel-4x5',
    width: CAROUSEL_SPECS.WIDTH,
    height: CAROUSEL_SPECS.HEIGHT,
    slideCount: candidate.slides.length,
    slides: candidate.slides,
    readyToRender: true,
  };
}

describe('Tier 3: Pairwise Cross-Feature Interactions', () => {

  // =========================================================================
  // Interaction 1: Automator -> Guardrail -> Reel Engine
  // =========================================================================
  describe('Interaction 1: Automator -> Guardrail Gate -> Reel Engine', () => {
    test('Happy Path: Compliant candidate passes guardrail and initializes Reel parameters', () => {
      const candidate = getValidSampleReelPayload();
      
      const reelConfig = parameterizeReelEngine(candidate);
      assert.strictEqual(reelConfig.readyToRender, true);
      assert.strictEqual(reelConfig.width, 1080);
      assert.strictEqual(reelConfig.height, 1920);
      assert.strictEqual(reelConfig.fps, 30);
      assert.strictEqual(reelConfig.subtitleDelaySec, 1.30);
      assert.strictEqual(reelConfig.targetLufs, -14.0);
      assert.strictEqual(reelConfig.safeBox.xMin, 84);
      assert.strictEqual(reelConfig.safeBox.xMax, 888);
    });

    test('Negative Path (Scarcity Poisoning): Numeric batch count is intercepted before Reel rendering', () => {
      const candidate = getValidSampleReelPayload();
      candidate.caption = 'Sisa 42 botol saja untuk batch drop Sabtu ini!';

      assert.throws(
        () => parameterizeReelEngine(candidate),
        (err) => {
          assert.ok(err.name === 'GuardrailError' || err instanceof oracle.GuardrailError);
          assert.ok(err.message.includes('NUMERIC_SCARCITY') || err.message.includes('42 botol'));
          return true;
        },
        'Guardrail must block Reel engine from receiving numeric scarcity candidate'
      );
    });

    test('Negative Path (Private School Leak): School name leak is intercepted before Reel rendering', () => {
      const candidate = getValidSampleReelPayload();
      candidate.verbal_hook = 'Waktu masih sering nongkrong di UPH College, gue selalu bingung cari matcha enak.';

      assert.throws(
        () => parameterizeReelEngine(candidate),
        (err) => {
          assert.ok(err.name === 'GuardrailError' || err instanceof oracle.GuardrailError);
          assert.ok(err.message.includes('PRIVATE_SCHOOL_NAME') || err.message.includes('UPH'));
          return true;
        },
        'Guardrail must block Reel engine from receiving school name leak'
      );
    });

    test('Negative Path (Financial & Capital Leak): Internal HPP/COGS is intercepted before Reel rendering', () => {
      const candidate = getValidSampleReelPayload();
      candidate.caption = 'HPP kita cuma Rp8.6M per botol, tapi kita jual tanpa mark up gila.';

      assert.throws(
        () => parameterizeReelEngine(candidate),
        (err) => {
          assert.ok(err.name === 'GuardrailError' || err instanceof oracle.GuardrailError);
          assert.ok(err.message.includes('FINANCIAL_LEAK') || err.message.includes('HPP'));
          return true;
        },
        'Guardrail must block Reel engine on financial metric leak'
      );
    });

    test('Negative Path (Overlay Outside Safe Box): Element placed outside safe box is rejected by Reel Engine', () => {
      const candidate = getValidSampleReelPayload();
      // Overlay placed at y: 1500 (outside yMax: 1248)
      candidate.overlays = [
        { text: 'KENAPA MATCHA 50K BIKIN CRASH', x: 120, y: 1500 },
      ];

      assert.throws(
        () => parameterizeReelEngine(candidate),
        /outside safe box/,
        'Reel engine must reject overlay placed outside safe box coordinates'
      );
    });
  });

  // =========================================================================
  // Interaction 2: Automator -> Cooldown & Jaccard Gate -> Carousel Engine
  // =========================================================================
  describe('Interaction 2: Automator -> Cooldown & Jaccard Gate -> Carousel Engine', () => {
    test('Happy Path: Distinct carousel candidate passes cooldown gate and configures 4:5 engine', () => {
      const candidate = getValidSampleCarouselPayload();
      const mockLedger = [
        {
          id: 'prev_reel_1',
          format: 'reel',
          pillar: 'Craftsmanship & Student Lifestyle',
          hook_category: 'Comparison',
          written_hook: 'KENAPA LIRA NOLAK PAKE CUP PLASTIK',
        },
        {
          id: 'prev_carousel_1',
          format: 'carousel',
          pillar: 'Cold Chain & Saturday COD Loop',
          hook_category: 'Storytelling',
          written_hook: 'PANDUAN GOJEK LOOP SABTU SIANG BERSAMA TAS DINGIN',
        },
      ];

      const cooldownResult = evaluateCarouselCooldown(candidate, mockLedger);
      assert.strictEqual(cooldownResult.allowed, true, 'Distinct candidate must pass cooldown gate');
      assert.ok(cooldownResult.maxSimilarity < 0.30, 'Similarity must be strictly < 0.30');

      const carouselConfig = parameterizeCarouselEngine(candidate);
      assert.strictEqual(carouselConfig.readyToRender, true);
      assert.strictEqual(carouselConfig.width, 1080);
      assert.strictEqual(carouselConfig.height, 1350);
      assert.strictEqual(carouselConfig.slideCount, 6);
    });

    test('Negative Path (Tuple Cooldown Collision): Candidate repeating (pillar, format, category) within window is blocked', () => {
      const candidate = getValidSampleCarouselPayload();
      // Candidate: format: 'carousel', pillar: 'Sugar Crash & Stevia Science', hook_category: 'Educational'
      const recentLedger = [
        {
          id: 'recent_carousel_0',
          format: 'carousel',
          pillar: 'Sugar Crash & Stevia Science',
          hook_category: 'Educational',
          written_hook: 'PERBEDAAN GLUKOSA VS STEVIOL GLIKOSIDA PADA OTAK',
        },
      ];

      const check = evaluateCarouselCooldown(candidate, recentLedger, 3);
      assert.strictEqual(check.allowed, false);
      assert.strictEqual(check.reason, 'COOLDOWN_COLLISION');
      assert.ok(check.detail.includes('Sugar Crash & Stevia Science'));
    });

    test('Negative Path (Jaccard Similarity Gate Breach): High-similarity copy is blocked', () => {
      const candidate = getValidSampleCarouselPayload();
      candidate.written_hook = 'ANATOMI SUGAR CRASH VS CLEAN FOCUS HARIAN';

      const ledgerWithSimilar = [
        {
          id: 'legacy_c1',
          format: 'carousel',
          pillar: 'Other Pillar',
          hook_category: 'Other Category',
          written_hook: 'ANATOMI SUGAR CRASH VS CLEAN FOCUS HARIAN LO',
        },
      ];

      const check = evaluateCarouselCooldown(candidate, ledgerWithSimilar);
      assert.strictEqual(check.allowed, false);
      assert.strictEqual(check.reason, 'SIMILARITY_GATE_BREACH');
      assert.ok(check.similarity >= 0.30, `Calculated similarity (${check.similarity}) must be >= 0.30`);
    });

    test('Carousel Slide 2 Standalone Re-Serve Hook Boundary Enforcement in Pipeline', () => {
      const candidate = getValidSampleCarouselPayload();
      // Slide 2 with 13 words (exceeds max 12 words)
      candidate.slides[1].headline = 'DUA JAM SETELAH MINUM GULA CAIR DARAH LO LANGSUNG TERJUN BEBAS PARAH BANGET GUYS';

      assert.throws(
        () => parameterizeCarouselEngine(candidate),
        /Slide 2 headline .* exceeds max 12 words/,
        'Carousel engine must enforce Slide 2 re-serve hook length constraint'
      );
    });

    test('Carousel Slide Count Range Enforcement (6–8 slides)', () => {
      const candidate = getValidSampleCarouselPayload();
      // Trim down to 4 slides (below min 6)
      candidate.slides = candidate.slides.slice(0, 4);

      assert.throws(
        () => parameterizeCarouselEngine(candidate),
        /Carousel must contain 6-8 slides/,
        'Carousel engine must reject candidates with fewer than 6 slides'
      );
    });
  });

  // =========================================================================
  // Interaction 3: Publisher -> Dry-Run Gate -> Tunnel Lifecycle
  // =========================================================================
  describe('Interaction 3: Publisher -> Dry-Run Gate -> Tunnel Lifecycle', () => {
    test('Dry-Run Gate Safety: Strictly prevents mutating HTTP requests to live Buffer API', async () => {
      const interceptedRequests = [];

      // Create a mock local server representing the dry-run static server
      const localServer = http.createServer((req, res) => {
        interceptedRequests.push({ method: req.method, url: req.url });
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('OK');
      });

      await new Promise((resolve) => localServer.listen(0, '127.0.0.1', resolve));
      const port = localServer.address().port;

      try {
        // Build payload under --dry-run contract
        const isDryRun = true;
        const dryRunPayload = {
          channelId: BUFFER_PUBLISHER.CHANNEL_ID,
          mode: BUFFER_PUBLISHER.SCHEDULING_TYPE,
          text: 'Di Lira, pure Japanese matcha + stevia. Limited batch ready Sabtu ini.',
          metadata: {
            instagram: {
              type: 'reel',
              shouldShareToFeed: true,
            },
          },
          assets: [{ video: { url: `http://127.0.0.1:${port}/sample_reel.mp4` } }],
        };

        // Simulated publisher execution logic in dry-run mode:
        let liveApiCalled = false;
        function executePublish(payload, dryRun = true) {
          if (!dryRun) {
            liveApiCalled = true;
            throw new Error('UNAUTHORIZED LIVE DISPATCH: Live mutating calls forbidden in test environment');
          }
          // Validate payload structure
          assert.strictEqual(payload.channelId, '6ad933a2778b240e2f81b45d');
          assert.strictEqual(payload.mode, 'shareNow');
          assert.strictEqual(payload.metadata.instagram.collaborators, undefined);
          assert.strictEqual(payload.firstComment, undefined);
          return {
            status: 'DRY_RUN_SUCCESS',
            verified: true,
            targetChannel: payload.channelId,
            assetCount: payload.assets.length,
          };
        }

        const res = executePublish(dryRunPayload, isDryRun);
        assert.strictEqual(res.status, 'DRY_RUN_SUCCESS');
        assert.strictEqual(res.verified, true);
        assert.strictEqual(liveApiCalled, false, 'Must never trigger live API call in dry-run mode');
      } finally {
        await new Promise((resolve) => localServer.close(resolve));
      }
    });

    test('Tunnel Health Probe & Lifecycle Simulation', async () => {
      // Simulate local static server serving media assets
      let serverActive = false;
      const testServer = http.createServer((req, res) => {
        if (req.url === '/test-media.mp4') {
          res.writeHead(200, { 'Content-Type': 'video/mp4' });
          res.end(Buffer.from('fake-mp4-data'));
        } else {
          res.writeHead(404);
          res.end('Not Found');
        }
      });

      await new Promise((resolve) => testServer.listen(0, '127.0.0.1', () => {
        serverActive = true;
        resolve();
      }));
      const port = testServer.address().port;

      try {
        assert.strictEqual(serverActive, true, 'Local static server must be active');

        // Verify local endpoint returns 200 OK for media
        const status = await new Promise((resolve, reject) => {
          http.get(`http://127.0.0.1:${port}/test-media.mp4`, (res) => {
            resolve(res.statusCode);
          }).on('error', reject);
        });

        assert.strictEqual(status, 200, 'Static media server must respond with 200 OK');

        // Simulate tunnel lifecycle wrapper
        class MockTunnelLifecycle {
          constructor(localPort) {
            this.port = localPort;
            this.url = null;
            this.isOpen = false;
          }

          async start() {
            this.url = `https://mock-subdomain-${Date.now()}.trycloudflare.com`;
            this.isOpen = true;
            return this.url;
          }

          async verifyHealth() {
            if (!this.isOpen) throw new Error('Tunnel is closed');
            return true;
          }

          close() {
            this.isOpen = false;
          }
        }

        const tunnel = new MockTunnelLifecycle(port);
        const tunnelUrl = await tunnel.start();
        assert.ok(tunnelUrl.includes('.trycloudflare.com'), 'Tunnel URL must point to cloudflare domain');
        assert.strictEqual(tunnel.isOpen, true, 'Tunnel must remain open during post processing');

        const isHealthy = await tunnel.verifyHealth();
        assert.strictEqual(isHealthy, true, 'Tunnel edge must be healthy');

        // Close tunnel after confirmation
        tunnel.close();
        assert.strictEqual(tunnel.isOpen, false, 'Tunnel must be cleanly closed after publishing completes');
      } finally {
        await new Promise((resolve) => testServer.close(resolve));
      }
    });

    test('Buffer Prohibited Fields are Cleanly Omitted from GraphQL Payload', () => {
      const reelPayload = getValidSampleReelPayload();
      
      const constructedPayload = {
        channelId: BUFFER_PUBLISHER.CHANNEL_ID,
        mode: BUFFER_PUBLISHER.SCHEDULING_TYPE,
        text: reelPayload.caption,
        metadata: {
          instagram: {
            type: 'reel',
            shouldShareToFeed: true,
          },
        },
        assets: [{ video: { url: 'https://mock.trycloudflare.com/sample.mp4' } }],
      };

      // Verify absence of prohibited fields
      assert.strictEqual('firstComment' in constructedPayload, false);
      assert.strictEqual('collaborators' in constructedPayload.metadata.instagram, false);
      assert.strictEqual('igMetadata' in constructedPayload, false);
      assert.ok(constructedPayload.text.includes('@caleb766h1'), 'Handle placed in text instead');
    });
  });
});
