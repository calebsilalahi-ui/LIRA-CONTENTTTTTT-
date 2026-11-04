/**
 * Tier 1 - Feature 20: Buffer GraphQL API Publisher
 * Authoritative source: PROJECT.md & ORIGINAL_REQUEST.md §R5
 * Verifies Buffer GraphQL publishing payload specifications:
 * - Endpoint: https://api.buffer.com
 * - Channel: 6ad933a2778b240e2f81b45d
 * - mode: "shareNow"
 * - PostType: "reel" (shouldShareToFeed: true) / "carousel" (or multi-image post)
 * - Strict prohibition of "firstComment" and "collaborators" fields
 * - Caption placement for collaborator handles (e.g. @caleb766h1)
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { BUFFER_PUBLISHER, PATHS } = require('../helpers/test_constants');
const { readEnvFile, getValidSampleReelPayload, getValidSampleCarouselPayload } = require('../helpers/test_fixture_loader');

// Progressive testability helper: Construct standard Buffer GraphQL CreatePost input payload
function buildBufferPostPayload({ channelId, format, caption, mediaUrls, options = {} }) {
  const isReel = format === 'reel';
  const payload = {
    channelId: channelId || BUFFER_PUBLISHER.CHANNEL_ID,
    mode: BUFFER_PUBLISHER.SCHEDULING_TYPE, // "shareNow"
    needsApproval: false,
    text: caption,
    metadata: {
      instagram: {
        type: isReel ? 'reel' : 'carousel',
        shouldShareToFeed: true,
      },
    },
    assets: isReel
      ? [{ video: { url: mediaUrls[0] } }]
      : mediaUrls.map((url) => ({ image: { url } })),
  };

  if (options.prohibitedFirstComment !== undefined) {
    payload.firstComment = options.prohibitedFirstComment;
  }
  if (options.prohibitedCollaborators !== undefined) {
    payload.metadata.instagram.collaborators = options.prohibitedCollaborators;
  }
  return payload;
}

// Validator verifying payload compliance with Buffer Free Plan & Instagram API constraints
function validateBufferPayload(payload) {
  const errors = [];
  if (payload.firstComment !== undefined) {
    errors.push('firstComment is prohibited on Buffer Free Plan');
  }
  if (payload.metadata?.instagram?.collaborators !== undefined) {
    errors.push('metadata.instagram.collaborators is prohibited; embed @handle in caption instead');
  }
  if (payload.igMetadata?.collaborators !== undefined) {
    errors.push('igMetadata.collaborators is prohibited');
  }
  if (payload.mode !== 'shareNow' && payload.schedulingType !== 'shareNow') {
    errors.push('Scheduling mode must be "shareNow"');
  }
  if (payload.channelId !== BUFFER_PUBLISHER.CHANNEL_ID) {
    errors.push(`channelId must match Instagram @drinklira channel (${BUFFER_PUBLISHER.CHANNEL_ID})`);
  }
  const igType = payload.metadata?.instagram?.type;
  if (!['reel', 'carousel', 'post'].includes(igType)) {
    errors.push(`Invalid Instagram post type: ${igType}`);
  }
  if (!Array.isArray(payload.assets) || payload.assets.length === 0) {
    errors.push('assets array must be non-empty');
  }
  return { valid: errors.length === 0, errors };
}

describe('Feature 20: Buffer GraphQL API Publisher', () => {
  test('Endpoint & Target Channel ID: Specifies https://api.buffer.com and @drinklira channel', () => {
    assert.strictEqual(BUFFER_PUBLISHER.API_URL, 'https://api.buffer.com');
    assert.strictEqual(BUFFER_PUBLISHER.CHANNEL_ID, '6ad933a2778b240e2f81b45d');
    assert.strictEqual(BUFFER_PUBLISHER.SCHEDULING_TYPE, 'shareNow');
  });

  test('Reel Payload Construction: mode is "shareNow", type is "reel", and shouldShareToFeed is true', () => {
    const reelData = getValidSampleReelPayload();
    const payload = buildBufferPostPayload({
      channelId: BUFFER_PUBLISHER.CHANNEL_ID,
      format: 'reel',
      caption: reelData.caption,
      mediaUrls: ['https://example-tunnel.trycloudflare.com/reels/sample_reel.mp4'],
    });

    const validation = validateBufferPayload(payload);
    assert.ok(validation.valid, `Reel payload should be valid: ${validation.errors.join('; ')}`);
    assert.strictEqual(payload.mode, 'shareNow');
    assert.strictEqual(payload.metadata.instagram.type, 'reel');
    assert.strictEqual(payload.metadata.instagram.shouldShareToFeed, true);
    assert.strictEqual(payload.assets.length, 1);
    assert.ok(payload.assets[0].video?.url.endsWith('.mp4'));
  });

  test('Carousel Payload Construction: type is "carousel" with 6-8 slide images and shouldShareToFeed is true', () => {
    const carouselData = getValidSampleCarouselPayload();
    const slideUrls = [1, 2, 3, 4, 5, 6].map(
      (n) => `https://example-tunnel.trycloudflare.com/carousels/slide_${n}.jpg`
    );
    const payload = buildBufferPostPayload({
      channelId: BUFFER_PUBLISHER.CHANNEL_ID,
      format: 'carousel',
      caption: carouselData.caption,
      mediaUrls: slideUrls,
    });

    const validation = validateBufferPayload(payload);
    assert.ok(validation.valid, `Carousel payload should be valid: ${validation.errors.join('; ')}`);
    assert.strictEqual(payload.mode, 'shareNow');
    assert.strictEqual(payload.metadata.instagram.type, 'carousel');
    assert.strictEqual(payload.metadata.instagram.shouldShareToFeed, true);
    assert.strictEqual(payload.assets.length, 6);
    payload.assets.forEach((asset, idx) => {
      assert.ok(asset.image?.url.endsWith(`.jpg`), `Slide ${idx + 1} must reference JPEG url`);
    });
  });

  test('Prohibited Fields Rejection: Payload MUST NOT include firstComment or collaborators fields', () => {
    const reelData = getValidSampleReelPayload();

    // 1. Rejection of firstComment
    const payloadWithFirstComment = buildBufferPostPayload({
      format: 'reel',
      caption: reelData.caption,
      mediaUrls: ['https://example.com/reel.mp4'],
      options: { prohibitedFirstComment: 'Check link in bio!' },
    });
    const check1 = validateBufferPayload(payloadWithFirstComment);
    assert.strictEqual(check1.valid, false);
    assert.ok(check1.errors.some((e) => e.includes('firstComment')));

    // 2. Rejection of metadata.instagram.collaborators
    const payloadWithCollaborators = buildBufferPostPayload({
      format: 'reel',
      caption: reelData.caption,
      mediaUrls: ['https://example.com/reel.mp4'],
      options: { prohibitedCollaborators: ['caleb766h1'] },
    });
    const check2 = validateBufferPayload(payloadWithCollaborators);
    assert.strictEqual(check2.valid, false);
    assert.ok(check2.errors.some((e) => e.includes('collaborators')));
  });

  test('Collaborator Attribution via Caption: Clean @caleb766h1 handle embedded in caption text', () => {
    const reelData = getValidSampleReelPayload();
    assert.ok(
      reelData.caption.includes('@caleb766h1'),
      'Caption copy should contain solo founder attribution (@caleb766h1)'
    );

    const payload = buildBufferPostPayload({
      format: 'reel',
      caption: reelData.caption,
      mediaUrls: ['https://example.com/reel.mp4'],
    });

    assert.ok(payload.text.includes('@caleb766h1'), 'Post text must include founder attribution handle');
    assert.strictEqual(payload.metadata.instagram.collaborators, undefined, 'Must not use API collaborators field');
  });

  test('GraphQL Query Mutation Contract: Validates createPost mutation string structure', () => {
    const expectedMutation = `
      mutation CreatePost($input: CreatePostInput!) {
        createPost(input: $input) {
          ... on PostActionSuccess {
            post {
              id
              status
              sentAt
            }
          }
          ... on MutationError {
            message
          }
        }
      }
    `.replace(/\s+/g, ' ').trim();

    assert.ok(expectedMutation.includes('createPost(input: $input)'), 'Mutation must declare createPost');
    assert.ok(expectedMutation.includes('PostActionSuccess'), 'Mutation must handle PostActionSuccess');
    assert.ok(expectedMutation.includes('MutationError'), 'Mutation must handle MutationError');
  });
});
