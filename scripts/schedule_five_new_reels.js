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

const REEL_POSTS = [
  // 1. Reel 1: Sabtu, 24 Okt @ 11:30 WIB (UTC: 2026-10-24T04:30:00Z)
  {
    itemNum: 1,
    day: 'Sabtu, 24 Okt (11:30 WIB)',
    dueAt: '2026-10-24T04:30:00Z',
    file: 'reel_new_01_blender_efficiency.mp4',
    caption: `Rahasia tekstur Lira: Kenapa kita blender konsentrat matchanya bukan dikocok manual? 🍵⚡

Banyak yang ngira bikin matcha artisan wajib dikocok bambu pelan-pelan. Tapi pas orderan batch mulai numpuk, kita butuh efisiensi dan konsistensi tinggi.

Dengan blender kecepatan tinggi, partikel Pure Japanese Premium Matcha pecah sampai ke level mikro: konsentrat larut sempurna tanpa gumpalan, dan menyatu lembut pas dicampur Oatside oat milk.

Nol sirup gula pasir, murni manis alami dari daun stevia drops:
🌿 Milk Tea: Rp 15.000
🍵 Matcha Latte Classic: Rp 19.000
🍫 Choco Hazelnut: Rp 22.000
🥛 Matcha Oatside: Rp 24.000

⚡ Limited batch available buat drop berikutnya!
Amankan botol lo sekarang sebelum closed via link di bio (@drinklira). 🔗

Crafted solo by @caleb766h1 🌿

#drinklira #blenderartisan #purematcha #stevia #matchaoatside #cleancaffeine #workfromcafe #jakartaselatan`,
  },

  // 2. Reel 2: Minggu, 25 Okt @ 19:00 WIB (UTC: 2026-10-25T12:00:00Z)
  {
    itemNum: 2,
    day: 'Minggu, 25 Okt (19:00 WIB)',
    dueAt: '2026-10-25T12:00:00Z',
    file: 'reel_new_02_blind_taste_test.mp4',
    caption: `Matcha kafe mall 55k vs Matcha Oatside Lira 24k: Coba tes tutup mata! 👀🍵

Sembilan puluh persen orang ketipu sama suasana kafe dan gelas plastik. Pas diuji rasa tutup mata, matcha kafe 55 ribu rasanya dominan sirup gula pasir dan krimer.

Pas nyobain Lira: pekat umami Pure Japanese Premium Matcha asli terasa di lidah, gurihnya Barista Oatside, dan manis murni dari ekstrak daun stevia drops tanpa gula pasir.

Harga jujur tanpa beban sewa tempat kafe:
🧋 Milk Tea: Rp 15.000
🍵 Matcha Latte Classic: Rp 19.000
🍫 Choco Hazelnut: Rp 22.000
🥛 Matcha Oatside: Rp 24.000

⚡ Limited batch available untuk order minggu ini!
Cobain sendiri bedanya via link di bio (@drinklira). 🔗

Crafted solo by @caleb766h1 🌿

#drinklira #blindtastetest #hargajujur #matchaoatside #stevia #purematcha #jakartaculinary #antigulapasir`,
  },

  // 3. Reel 3: Senin, 26 Okt @ 08:30 WIB (UTC: 2026-10-26T01:30:00Z)
  {
    itemNum: 3,
    day: 'Senin, 26 Okt (08:30 WIB)',
    dueAt: '2026-10-26T01:30:00Z',
    file: 'reel_new_03_workplace_energy.mp4',
    caption: `Kenapa jam 2 siang di kantor otak lo mendadak lemes dan nge-lag? 🥱💻

Bukan salah kafeinnya. Ini efek 30 gram sirup gula pasir di segelas minuman manis kafe yang memicu lonjakan insulin mendadak, bikin fokus lo drop pas jam kerja lagi numpuk.

Di Lira, kita eliminasi 100% gula pasir:
🍵 Pure Japanese Premium Matcha kaya L-Theanine alami
⚡ Konsentrat di-blender halus biar larut sempurna
🌱 100% Pemanis alami stevia drops (0g gula, 0 crash)
🔋 6 jam fokus tenang & stabil seharian

Pilihan menu Lira:
🧋 Milk Tea: Rp 15.000
🍵 Matcha Classic: Rp 19.000
🍫 Choco Hazelnut: Rp 22.000
🥛 Matcha Oatside: Rp 24.000

⚡ Limited batch available buat nemenin deep work lo minggu ini!
Amankan slot botol lo lewat link di bio (@drinklira). 🔗

Crafted solo by @caleb766h1 🌿

#drinklira #deepwork #seninsemangat #fokustanpacrash #stevia #purematcha #mahasiswajakarta #workfromcafe`,
  },

  // 4. Reel 4: Selasa, 27 Okt @ 12:00 WIB (UTC: 2026-10-27T05:00:00Z)
  {
    itemNum: 4,
    day: 'Selasa, 27 Okt (12:00 WIB)',
    dueAt: '2026-10-27T05:00:00Z',
    file: 'reel_new_04_price_guess.mp4',
    caption: `Tebak berapa harga botol matcha oat pekat ini? Kalau bener, botolnya gratis! 🎁👀

Orang-orang sering nebak 45 ribu sampai 50 ribu karena warna matchanya pekat dan pakai Barista Oatside murni.

Plot twist: Matcha Oatside Lira cuma Rp 24.000!
Bahkan varian lainnya jauh lebih terjangkau:
🧋 Milk Tea: Rp 15.000
🍵 Matcha Latte Classic: Rp 19.000
🍫 Choco Hazelnut: Rp 22.000
🥛 Matcha Oatside: Rp 24.000

Dibuat fresh dari Pure Japanese Premium Matcha, konsentrat di-blender halus, tanpa setetes pun gula pasir (100% stevia drops).

⚡ Limited batch available untuk slot drop minggu ini!
Dapet kualitas premium tanpa boncos via link di bio (@drinklira). 🔗

Crafted solo by @caleb766h1 🌿

#drinklira #tebakharga #matchaoatside #plottwist #purematcha #hargamahasiswa #jakartaselatan #workfromcafe`,
  },

  // 5. Reel 5: Rabu, 28 Okt @ 19:00 WIB (UTC: 2026-10-28T12:00:00Z)
  {
    itemNum: 5,
    day: 'Rabu, 28 Okt (19:00 WIB)',
    dueAt: '2026-10-28T12:00:00Z',
    file: 'reel_new_05_founder_anti_factory.mp4',
    caption: `Kenapa gue menolak produksi Lira di pabrik massal? 🏭🚫

Banyak yang nyuruh gue serahin resep Lira ke pabrik biar bisa kirim ribuan botol tiap hari ke minimarket.

Tapi pabrik dan retail nuntut bahan pengawet dan stabilizer kimia biar minumannya tahan berbulan-bulan di rak toko. Gue nolak kompromi itu.

Di dapur sendiri, konsentrat Pure Japanese Premium Matcha di-blender kecepatan tinggi biar ekstra halus dan fresh, dipadukan pemanis alami daun stevia drops.

Diseduh jujur buat lo yang cari rasa murni:
🧋 Milk Tea: Rp 15.000
🍵 Matcha Classic: Rp 19.000
🍫 Choco Hazelnut: Rp 22.000
🥛 Matcha Oatside: Rp 24.000

⚡ Limited batch available untuk pengiriman batch Sabtu!
Amankan jatah botol lo sekarang sebelum form ditutup via link di bio (@drinklira). 🔗

Crafted solo by @caleb766h1 🌿

#drinklira #founderstory #solopreneur #artisanbatch #purematcha #stevia #matchajakarta #supportlocal`,
  },
];

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

function startCloudflareTunnel() {
  return new Promise((resolve, reject) => {
    console.log('[Tunnel] Starting persistent Cloudflare tunnel for Reels...');
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

function verifyTunnelEdge(url) {
  return new Promise((resolve, reject) => {
    const probeUrl = `${url}/reel_new_01_blender_efficiency.mp4`;
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
  console.log('🚀 SCHEDULING 5 BRAND NEW REELS TO BUFFER');
  console.log('====================================================');

  const channel = await getInstagramChannel();
  console.log(`✓ Connected Instagram: @${channel.displayName} (ID: ${channel.id})`);

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

    for (let i = 0; i < REEL_POSTS.length; i++) {
      const p = REEL_POSTS[i];
      console.log(`\n----------------------------------------------------`);
      console.log(`[${i + 1}/${REEL_POSTS.length}] Scheduling Reel #${p.itemNum}: ${p.day}`);
      console.log(`DueAt: ${p.dueAt}`);
      console.log(`File: ${p.file}`);

      const videoUrl = `${tunnelUrl}/${p.file}`;
      const assets = [{ video: { url: videoUrl } }];
      const igMetadata = {
        type: 'reel',
        shouldShareToFeed: true,
        collaborators: ['caleb766h1'],
      };

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

      console.log(`Dispatching to Buffer GraphQL API with co-author @caleb766h1...`);
      const resp = await queryBuffer(createMutation, { input });
      const postResult = resp.createPost;

      if (postResult.message) {
        console.error(`❌ Buffer Error: ${postResult.message}`);
        results.push({
          item: p.itemNum,
          day: p.day,
          file: p.file,
          postId: null,
          status: `failed: ${postResult.message}`,
        });
      } else {
        const createdPost = postResult.post;
        console.log(`✅ SUCCESS! Post ID: ${createdPost.id} | Status: ${createdPost.status}`);
        results.push({
          item: p.itemNum,
          day: p.day,
          file: p.file,
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
    console.log('🎉 5 REELS SCHEDULE RESULTS:');
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
