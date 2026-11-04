#!/usr/bin/env node
/**
 * Lira Campaign Updater: Schedule Replacements for Post #2, #5, #7
 * - Post #2: Bandung Delay Announcement Carousel (Sat Oct 24 @ 18:30 WIB)
 * - Post #5: Minimarket Blackout / Contrarian Move Reel (Mon Oct 26 @ 08:30 WIB)
 * - Post #7: Secret Society / Inner Circle Reel (Tue Oct 27 @ 12:00 WIB)
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
const PORT = 8995;
const BASE_DIR = '/Users/caleb/Desktop/lira reels';

const updatedPosts = [
  // 1. Post #2: Sat Oct 24 @ 18:30 WIB (UTC: 2026-10-24T11:30:00Z) - Carousel
  {
    itemNum: 2,
    type: 'carousel',
    day: 'Sabtu, 24 Okt (18:30 WIB)',
    dueAt: '2026-10-24T11:30:00Z',
    slides: [
      'carousel_bandung_delay/slide1.jpg',
      'carousel_bandung_delay/slide2.jpg',
      'carousel_bandung_delay/slide3.jpg',
      'carousel_bandung_delay/slide4.jpg',
    ],
    caption: `PENGUMUMAN RESMI: Batch Sabtu Ini Ditunda ke Minggu Depan 📦🙏

Kenapa gak ada pengiriman Lira hari ini?
Weekend ini, Caleb & tim berangkat ke Bandung untuk agenda Youth in Mission.

Karena setiap botol Lira diseduh manual fresh pake tangan sendiri di dapur (Pure Japanese Premium Matcha + 100% pemanis alami daun stevia drops tanpa pabrik massal), gue menolak kompromi kualitas dengan brewing buru-buru.

🗓️ JADWAL DROP BATCH RESMI:
Next drop meluncur Sabtu depan! Kuota artisan dibuka lebih banyak dan yang udah masuk list bakal dapet akses prioritas lebih awal.

⚡ Limited batch available untuk drop Sabtu depan!
Amankan slot botol lo sekarang sebelum kuota ditutup via link di bio (@drinklira). 🔗

Sampai ketemu di Bandung, dan sampai jumpa di batch Sabtu depan! 🌿✨

#drinklira #pengumuman #youthinmission #bandung #artisanmatcha #purematcha #stevia #limitedbatch`,
  },

  // 2. Post #5: Mon Oct 26 @ 08:30 WIB (UTC: 2026-10-26T01:30:00Z) - Reel
  {
    itemNum: 5,
    type: 'reel',
    day: 'Senin, 26 Okt (08:30 WIB)',
    dueAt: '2026-10-26T01:30:00Z',
    file: '02_sapa_mart_blackout.mp4',
    caption: `Kenapa gue resmi nolak masuk etalase minimarket? 🏪🚫

Banyak yang nanya kenapa Lira nggak dijual di kulkas supermarket biar gampang dibeli tiap hari. 

Jawabannya simpel: retail nuntut umur simpan minimal 6 bulan. Artinya kita harus nambah pengawet kimia dan nurunin kualitas teh.

Gue nolak kompromi itu. Lira diformulasikan buat lo yang pengen rasa fresh-brewed murni:
🍵 Pure Japanese Premium Matcha asli
🌱 100% Ekstrak Daun Stevia Alami (0g gula pasir)
🔒 180° Anti-bocor aman di samping laptop

Setiap botol diseduh fresh dan dikirim langsung dari dapur ke depan pintu rumah lo.

⚡ Limited batch available untuk drop Sabtu depan!
Amankan kuota botol lo sebelum form ditutup via link di bio. 🔗

#drinklira #founderstory #solopreneur #freshbrewed #purematcha #stevia #jakartaselatan #workfromcafe`,
  },

  // 3. Post #7: Tue Oct 27 @ 12:00 WIB (UTC: 2026-10-27T05:00:00Z) - Reel
  {
    itemNum: 7,
    type: 'reel',
    day: 'Selasa, 27 Okt (12:00 WIB)',
    dueAt: '2026-10-27T05:00:00Z',
    file: '04_lira_fam_inner_circle.mp4',
    caption: `Menu rahasia Lira yang gak pernah dipajang di feed publik... 🤫✨

Tiap minggu, kita cuma seduh batch terbatas di dapur artisan. Slotnya sering habis sebelum kita sempet posting pengumuman resmi.

Kenapa? Karena anak-anak Lira Fam yang udah pernah ngerasain Pure Japanese Premium Matcha dingin tanpa gula pasir langsung repeat order buat stok deep work seminggu.

Di Lira:
❌ Nol sirup gula pasir pengundang kantuk
❌ Nol es batu mencair yang bikin tawar
✅ 100% pemanis alami stevia drops + Barista Oat Milk murni

⚡ Limited batch available untuk slot drop Sabtu depan!
Cek link di bio (@drinklira) buat akses kuota artisan lo sebelum ditutup. 🔗

#drinklira #lirafam #secretvault #deepwork #cleancaffeine #matchalatte #mahasiswajakarta #workfromcafe`,
  },
];

// GraphQL Helper
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
          if (json.errors) {
            reject(new Error(`Buffer GraphQL Errors: ${JSON.stringify(json.errors)}`));
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

// Find Instagram channel for drinklira
async function getInstagramChannel() {
  const orgData = await queryBuffer(`query {
    account {
      organizations {
        id
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

// Start Static HTTP Server serving Desktop media
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
      console.log(`[HTTP Server] Serving all campaign media at http://127.0.0.1:${PORT}`);
      resolve(server);
    });
  });
}

// Start persistent Cloudflare tunnel
function startCloudflareTunnel() {
  return new Promise((resolve, reject) => {
    console.log('[Tunnel] Starting persistent Cloudflare tunnel for campaign updates...');
    const tunnel = spawn(CLOUDFLARED_BIN, ['tunnel', '--url', `http://127.0.0.1:${PORT}`]);

    let url = '';
    let registered = false;

    const checkDone = () => {
      if (url && registered) {
        console.log(`[Tunnel] Public HTTPS endpoint ready & registered at edge: ${url}`);
        resolve({ tunnel, url });
      }
    };

    const parseOutput = (data) => {
      const text = data.toString();
      const match = text.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
      if (match && !url) {
        url = match[0];
        console.log(`[Tunnel] Public HTTPS endpoint generated: ${url}`);
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
        reject(new Error('Timed out waiting for Cloudflare tunnel URL (30s).'));
      } else if (!registered) {
        resolve({ tunnel, url });
      }
    }, 18000);
  });
}

// Wait for tunnel edge to return 200 OK via non-blocking https.get
function verifyTunnelEdge(url) {
  return new Promise((resolve, reject) => {
    const probeUrl = `${url}/carousel_bandung_delay/slide1.jpg`;
    console.log(`[Tunnel] Verifying edge connectivity: ${probeUrl}`);
    let attempts = 0;
    const maxAttempts = 25;

    const check = () => {
      attempts++;
      const req = https.get(probeUrl, { agent: directAgent }, (res) => {
        if (res.statusCode === 200) {
          console.log(`✓ Tunnel edge verified reachable on attempt ${attempts} (Status 200 OK)`);
          resolve();
        } else {
          console.log(`[Tunnel Probe] Attempt ${attempts}/${maxAttempts}: Status ${res.statusCode}, retrying...`);
          if (attempts >= maxAttempts) {
            reject(new Error(`Tunnel edge returned status ${res.statusCode}`));
          } else {
            setTimeout(check, 2000);
          }
        }
      });

      req.on('error', (err) => {
        console.log(`[Tunnel Probe] Attempt ${attempts}/${maxAttempts}: ${err.message}, retrying...`);
        if (attempts >= maxAttempts) {
          reject(new Error(`Tunnel edge probe error: ${err.message}`));
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
  console.log('🚀 LIRA CAMPAIGN UPDATER: POSTS #2, #5, #7');
  console.log('====================================================');

  // Step 1: Channel Check
  const channel = await getInstagramChannel();
  console.log(`✓ Connected Instagram: @${channel.displayName} (ID: ${channel.id})`);

  // Step 2: Server & Tunnel
  const server = await startStaticServer();
  const { tunnel, url: tunnelUrl } = await startCloudflareTunnel();

  try {
    await verifyTunnelEdge(tunnelUrl);
    console.log(`✓ Tunnel is globally active: ${tunnelUrl}\n`);

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

    const results = [];

    for (let i = 0; i < updatedPosts.length; i++) {
      const p = updatedPosts[i];
      console.log(`\n----------------------------------------------------`);
      console.log(`[${i + 1}/${updatedPosts.length}] Scheduling Replacement Post #${p.itemNum}: ${p.type.toUpperCase()}`);
      console.log(`Day: ${p.day} (DueAt: ${p.dueAt})`);

      let assets = [];
      let igMetadata = {
        shouldShareToFeed: true,
        collaborators: ['caleb766h1'],
      };

      if (p.type === 'reel') {
        igMetadata.type = 'reel';
        const videoUrl = `${tunnelUrl}/${p.file}`;
        assets = [{ video: { url: videoUrl } }];
      } else {
        igMetadata.type = 'post';
        assets = p.slides.map(slide => ({
          image: { url: `${tunnelUrl}/${slide}` },
        }));
      }

      const input = {
        channelId: channel.id,
        schedulingType: 'automatic',
        mode: 'customScheduled',
        dueAt: p.dueAt,
        needsApproval: false,
        text: p.caption,
        metadata: {
          instagram: igMetadata,
        },
        assets,
      };

      console.log(`Dispatching to Buffer with co-author @caleb766h1...`);
      const resp = await queryBuffer(createMutation, { input });
      const postResult = resp.createPost;

      if (postResult.message) {
        console.error(`❌ Buffer Error: ${postResult.message}`);
        results.push({
          item: p.itemNum,
          day: p.day,
          type: p.type,
          postId: null,
          status: `failed: ${postResult.message}`,
        });
      } else {
        const createdPost = postResult.post;
        console.log(`✅ SUCCESS! Post ID: ${createdPost.id} | Status: ${createdPost.status}`);
        results.push({
          item: p.itemNum,
          day: p.day,
          type: p.type,
          postId: createdPost.id,
          status: createdPost.status,
        });
      }

      console.log('Waiting 5s for Buffer asset ingestion...');
      await new Promise(r => setTimeout(r, 5000));
    }

    console.log('\n====================================================');
    console.log('⏳ Allowing 15s final buffer for background asset downloads...');
    await new Promise(r => setTimeout(r, 15000));

    console.log('\n====================================================');
    console.log('🎉 REPLACEMENT SCHEDULE RESULTS:');
    console.log('====================================================');
    console.table(results);

  } finally {
    console.log('\n[Cleanup] Tearing down tunnel and HTTP server...');
    tunnel.kill('SIGKILL');
    server.close();
    console.log('✓ Cleanup complete. Exiting.');
    process.exit(0);
  }
}

run().catch(err => {
  console.error('Fatal Error:', err);
  process.exit(1);
});
