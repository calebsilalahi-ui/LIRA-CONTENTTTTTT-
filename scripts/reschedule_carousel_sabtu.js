#!/usr/bin/env node
/**
 * Reschedule Saturday Carousel to 6:30 AM WIB (2026-10-23T23:30:00Z)
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const dns = require('dns');
const { spawn } = require('child_process');

try {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
} catch (e) {}

const directAgent = new https.Agent({
  lookup: (hostname, options, callback) => {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    dns.resolve4(hostname, (err, addrs) => {
      if (err) return callback(err);
      if (!addrs || addrs.length === 0) return callback(new Error('No IPv4 resolved'));
      if (options && options.all) {
        callback(null, addrs.map(a => ({ address: a, family: 4 })));
      } else {
        callback(null, addrs[0], 4);
      }
    });
  }
});
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [k, ...v] = trimmed.split('=');
      if (!process.env[k.trim()]) {
        process.env[k.trim()] = v.join('=').trim();
      }
    }
  }
}

const BUFFER_TOKEN = process.env.BUFFER_TOKEN || process.env.BUFFER_ACCESS_TOKEN || '';
const BUFFER_API = 'https://api.buffer.com';
const CLOUDFLARED_BIN = '/Users/caleb/.gemini/antigravity/scratch/bin/cloudflared';
const PORT = 8996;
const BASE_DIR = '/Users/caleb/Desktop/lira reels';

const OLD_POST_ID = '6adbce2d0b5343d0704ef91d';
const TARGET_DUE_AT = '2026-10-23T23:30:00.000Z'; // 06:30 WIB on Saturday Oct 24
const SLIDES = [
  'carousel_bandung_delay/slide1.jpg',
  'carousel_bandung_delay/slide2.jpg',
  'carousel_bandung_delay/slide3.jpg',
  'carousel_bandung_delay/slide4.jpg',
];

const CAPTION = `PENGUMUMAN RESMI: Batch Sabtu Ini Ditunda ke Minggu Depan 📦🙏

Kenapa gak ada pengiriman Lira hari ini?
Weekend ini, Caleb & tim berangkat ke Bandung untuk agenda Youth in Mission.

Karena setiap botol Lira diseduh manual fresh pake tangan sendiri di dapur (Pure Japanese Premium Matcha + 100% pemanis alami daun stevia drops tanpa pabrik massal), gue menolak kompromi kualitas dengan brewing buru-buru.

🗓️ JADWAL DROP BATCH RESMI:
Next drop meluncur Sabtu depan! Kuota artisan dibuka lebih banyak dan yang udah masuk list bakal dapet akses prioritas lebih awal.

⚡ Limited batch available untuk drop Sabtu depan!
Amankan slot botol lo sekarang sebelum kuota ditutup via link di bio (@drinklira). 🔗

Sampai ketemu di Bandung, dan sampai jumpa di batch Sabtu depan! 🌿✨

#drinklira #pengumuman #youthinmission #bandung #artisanmatcha #purematcha #stevia #limitedbatch`;

function queryBuffer(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query, variables });
    const req = https.request(BUFFER_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BUFFER_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.errors && json.errors.length > 0) {
            reject(new Error(`Buffer API Error: ${json.errors[0].message}`));
          } else {
            resolve(json.data);
          }
        } catch (err) {
          reject(new Error(`Failed to parse Buffer response: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function getInstagramChannel() {
  const orgData = await queryBuffer(`query {
    account {
      organizations {
        id
        name
      }
    }
  }`);

  const orgId = orgData.account.organizations[0]?.id;
  if (!orgId) throw new Error('No organization found in Buffer account.');

  const channelsData = await queryBuffer(`query GetChannels($input: ChannelsInput!) {
    channels(input: $input) {
      id
      name
      service
      displayName
    }
  }`, { input: { organizationId: orgId } });

  const igChannel = channelsData.channels.find(
    c => c.service === 'instagram' && (c.name.toLowerCase().includes('lira') || c.displayName.toLowerCase().includes('lira'))
  ) || channelsData.channels.find(c => c.service === 'instagram');

  if (!igChannel) throw new Error('No connected Instagram account found in Buffer.');
  return igChannel;
}

function startStaticServer() {
  const mimeTypes = {
    '.mp4': 'video/mp4',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
  };

  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const safePath = path.normalize(decodeURIComponent(req.url.split('?')[0])).replace(/^(\.\.[\/\\])+/, '');
      const filePath = path.join(BASE_DIR, safePath);

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const stat = fs.statSync(filePath);
        res.writeHead(200, {
          'Content-Type': mimeTypes[ext] || 'application/octet-stream',
          'Content-Length': stat.size,
          'Access-Control-Allow-Origin': '*',
          'Accept-Ranges': 'bytes',
        });
        fs.createReadStream(filePath).pipe(res);
        console.log(`[HTTP Server] 200 OK: ${req.url} (${stat.size} bytes)`);
      } else {
        res.writeHead(404);
        res.end('Not Found');
        console.log(`[HTTP Server] 404 Not Found: ${req.url}`);
      }
    });

    server.listen(PORT, '127.0.0.1', () => {
      console.log(`[HTTP Server] Serving files at http://127.0.0.1:${PORT}`);
      resolve(server);
    });
  });
}

function startCloudflareTunnel() {
  return new Promise((resolve, reject) => {
    console.log('[Tunnel] Starting persistent Cloudflare tunnel...');
    const tunnel = spawn(CLOUDFLARED_BIN, ['tunnel', '--url', `http://127.0.0.1:${PORT}`]);

    let url = '';
    let registered = false;

    const checkDone = () => {
      if (url && registered) {
        console.log(`[Tunnel] Endpoint ready & registered: ${url}`);
        resolve({ tunnel, url });
      }
    };

    const parseOutput = (data) => {
      const text = data.toString();
      const match = text.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
      if (match && !url) {
        url = match[0];
        console.log(`[Tunnel] Endpoint URL: ${url}`);
        checkDone();
      }
      if (text.includes('Registered tunnel connection')) {
        registered = true;
        checkDone();
      }
    };

    tunnel.stdout.on('data', parseOutput);
    tunnel.stderr.on('data', parseOutput);

    tunnel.on('error', (err) => {
      if (!url) reject(err);
    });

    setTimeout(() => {
      if (!url) {
        tunnel.kill();
        reject(new Error('Tunnel timeout.'));
      } else if (!registered) {
        resolve({ tunnel, url });
      }
    }, 18000);
  });
}

function verifyTunnelEdge(url) {
  return new Promise((resolve, reject) => {
    const probeUrl = `${url}/carousel_bandung_delay/slide1.jpg`;
    console.log(`[Tunnel] Verifying probe: ${probeUrl}`);
    let attempts = 0;
    const maxAttempts = 25;

    const check = () => {
      attempts++;
      const req = https.get(probeUrl, { agent: directAgent }, (res) => {
        if (res.statusCode === 200) {
          console.log(`✓ Probe success (Status 200 OK)`);
          resolve();
        } else {
          if (attempts >= maxAttempts) {
            reject(new Error(`Probe status ${res.statusCode}`));
          } else {
            setTimeout(check, 2000);
          }
        }
      });

      req.on('error', (err) => {
        if (attempts >= maxAttempts) {
          reject(new Error(`Probe error: ${err.message}`));
        } else {
          setTimeout(check, 2000);
        }
      });
    };

    setTimeout(check, 3000);
  });
}

async function run() {
  console.log('====================================================');
  console.log('🔄 RESCHEDULING CAROUSEL SABTU TO 6:30 AM WIB');
  console.log('Target UTC:', TARGET_DUE_AT);
  console.log('Target WIB: Sabtu, 24 Okt 2026 @ 06:30 WIB');
  console.log('====================================================');

  const channel = await getInstagramChannel();
  console.log(`✓ Channel: @${channel.displayName} (${channel.id})`);

  const server = await startStaticServer();
  const { tunnel, url: tunnelUrl } = await startCloudflareTunnel();

  try {
    await verifyTunnelEdge(tunnelUrl);
    console.log(`✓ Tunnel live: ${tunnelUrl}\n`);

    const assets = SLIDES.map(slide => ({
      image: { url: `${tunnelUrl}/${slide}` },
    }));

    const igMetadata = {
      type: 'post',
      shouldShareToFeed: true,
      collaborators: ['caleb766h1'],
    };

    // Try editPost first
    console.log('Attempting editPost on', OLD_POST_ID, '...');
    const editMutation = `mutation EditPost($input: EditPostInput!) {
      editPost(input: $input) {
        ... on PostActionSuccess {
          post {
            id
            status
            dueAt
          }
        }
        ... on MutationError {
          message
        }
      }
    }`;

    const editInput = {
      id: OLD_POST_ID,
      schedulingType: 'automatic',
      mode: 'customScheduled',
      dueAt: TARGET_DUE_AT,
      text: CAPTION,
      metadata: {
        instagram: igMetadata,
      },
      assets,
    };

    let updatedPost = null;
    const editResp = await queryBuffer(editMutation, { input: editInput });
    if (editResp.editPost && editResp.editPost.post) {
      updatedPost = editResp.editPost.post;
      console.log('✅ editPost SUCCESS!', updatedPost);
    } else {
      console.log('editPost message:', editResp.editPost?.message || 'failed');
      console.log('Falling back to delete + createPost...');

      // Delete old post
      const deleteMutation = `mutation DeletePost($input: DeletePostInput!) {
        deletePost(input: $input) {
          ... on PostActionSuccess {
            post {
              id
            }
          }
          ... on MutationError {
            message
          }
        }
      }`;
      try {
        const delResp = await queryBuffer(deleteMutation, { input: { id: OLD_POST_ID } });
        console.log('Delete result:', delResp);
      } catch (err) {
        console.warn('Delete warning:', err.message);
      }

      // Create new post
      const createMutation = `mutation CreatePost($input: CreatePostInput!) {
        createPost(input: $input) {
          ... on PostActionSuccess {
            post {
              id
              status
              dueAt
            }
          }
          ... on MutationError {
            message
          }
        }
      }`;

      const createInput = {
        channelId: channel.id,
        schedulingType: 'automatic',
        mode: 'customScheduled',
        dueAt: TARGET_DUE_AT,
        needsApproval: false,
        text: CAPTION,
        metadata: {
          instagram: igMetadata,
        },
        assets,
      };

      const createResp = await queryBuffer(createMutation, { input: createInput });
      if (createResp.createPost && createResp.createPost.post) {
        updatedPost = createResp.createPost.post;
        console.log('✅ createPost SUCCESS!', updatedPost);
      } else {
        throw new Error('createPost failed: ' + JSON.stringify(createResp));
      }
    }

    console.log('\nWaiting 10s for asset processing...');
    await new Promise(r => setTimeout(r, 10000));

    // Verify post
    console.log('\n--- VERIFYING POST IN BUFFER ---');
    const verifyResp = await queryBuffer(`query GetPost($id: PostId!) {
      post(input: { id: $id }) {
        id
        status
        dueAt
        text
      }
    }`, { id: updatedPost.id });

    console.log('Verified Post Data:', JSON.stringify(verifyResp.post, null, 2));
    console.log('\n🎉 SUCCESS! Saturday Carousel is now scheduled for:');
    console.log('Post ID:', verifyResp.post.id);
    console.log('DueAt (UTC):', verifyResp.post.dueAt);
    console.log('Status:', verifyResp.post.status);

  } finally {
    console.log('\n[Cleanup] Closing tunnel & server...');
    tunnel.kill('SIGKILL');
    server.close();
    console.log('Done.');
    process.exit(0);
  }
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
