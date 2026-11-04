#!/usr/bin/env node
/**
 * Lira Multi-Day Campaign Unified Scheduler (11 Posts on Buffer GraphQL)
 * Uses a single persistent Cloudflare tunnel to schedule all 6 Reels and 5 Carousels cleanly.
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const dns = require('dns');
const { spawn, execSync } = require('child_process');

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

const posts = [
  // 1. Sat Oct 24 @ 11:30 WIB (UTC: 2026-10-24T04:30:00Z) - Reel
  {
    type: 'reel',
    day: 'Sabtu, 24 Okt (11:30 WIB)',
    dueAt: '2026-10-24T04:30:00Z',
    file: '04_order_tutorial.mp4',
    knownId: '6adb88b572cdfa89f2d9e825',
    caption: `Buat yang nanya gimana cara pesen Lira buat drop batch Sabtu ini: tonton tutorial 30 detik ini! 📦

1. Klik link di bio (@drinklira)
2. Pilih batch Lira dingin lo
3. Kurir instan Gojek langsung anter ke depan gerbang rumah/kosan lo dalam cooler box dingin dengan kondensasi segar.

Setiap botol diseduh manual fresh dengan Pure Japanese Premium Matcha & Barista Oat Milk tanpa es batu pengencer.

⚡ Limited batch available untuk drop Sabtu ini!
Amankan slot botol lo sekarang sebelum slot ditutup lewat link di bio. 🔗

#drinklira #tutorial #matchalatte #deliveryjakarta #workfromcafe #jakartaselatan #mahasiswajakarta`,
  },

  // 2. Sat Oct 24 @ 18:30 WIB (UTC: 2026-10-24T11:30:00Z) - Carousel
  {
    type: 'carousel',
    day: 'Sabtu, 24 Okt (18:30 WIB)',
    dueAt: '2026-10-24T11:30:00Z',
    slides: [
      'carousel_sat_drop/slide1.jpg',
      'carousel_sat_drop/slide2.jpg',
      'carousel_sat_drop/slide3.jpg',
      'carousel_sat_drop/slide4.jpg',
    ],
    caption: `Batch Sabtu Lira resmi meluncur! 📦✨

Diseduh manual fresh tiap Jumat malam, diformulasikan dengan 100% pemanis alami daun stevia drops dan Pure Japanese Premium Matcha.

0 gram gula pasir. Nol glycemic spike. Tahan 7 hari di kulkas dan diuji dibalik 180° di atas MacBook tanpa bocor satu tetes pun!

⚡ Limited batch available untuk drop Sabtu ini.
Amankan slot botol lo sebelum kuota artisan minggu ini habis lewat link di bio! 🔗

#drinklira #batchsabtu #matchalatte #purematcha #stevia #leakproofbottle #oatmilk #freshbatch`,
  },

  // 3. Sun Oct 25 @ 12:00 WIB (UTC: 2026-10-25T05:00:00Z) - Carousel
  {
    type: 'carousel',
    day: 'Minggu, 25 Okt (12:00 WIB)',
    dueAt: '2026-10-25T05:00:00Z',
    knownId: '6adb8b004a4cd45b1965e574',
    slides: [
      'carousel_sun_reset/slide1.jpg',
      'carousel_sun_reset/slide2.jpg',
      'carousel_sun_reset/slide3.jpg',
      'carousel_sun_reset/slide4.jpg',
    ],
    caption: `Sunday Reset: Ganti 3 cangkir kopi hitam dengan Clean Caffeine Lira. 🌿

Pernah ngerasa jantung deg-degan dan gelisah setelah minum kopi kafe? Itu karena lonjakan kafein mendadak yang memicu kortisol berlebih.

Di Lira, Pure Japanese Premium Matcha mengandung asam amino L-Theanine alami. L-Theanine memperlambat penyerapan kafein di tubuh, menghasilkan gelombang otak alfa: fokus tenang, tajam, dan stabil 6 jam tanpa jitters.

Ditambah 100% barista oat milk yang lembut dan ramah pencernaan.

⚡ Limited batch available untuk pengiriman minggu ini lewat link di bio!

#drinklira #sundayreset #cleancaffeine #ltheanine #fokusseharian #matchajakarta #dairyfree`,
  },

  // 4. Sun Oct 25 @ 19:00 WIB (UTC: 2026-10-25T12:00:00Z) - Reel
  {
    type: 'reel',
    day: 'Minggu, 25 Okt (19:00 WIB)',
    dueAt: '2026-10-25T12:00:00Z',
    file: '05_cup_vs_bottle.mp4',
    caption: `Uji Balik 180° di Atas MacBook: Cup Plastik Kafe vs Botol Segel Lira. 💻👀

Kenapa lo bayar 50 ribu tiap hari cuma buat dapet cup plastik ringkih yang menyiksa?
❌ Es batu mencair bikin tawar dalam 15 menit
❌ Tangan tersandera seharian karena gak bisa masuk tas ransel
❌ Was-was kesenggol tumpah ke keyboard laptop

Solusi Lira: Botol segel ulir Rp 34.000 dengan Pure Japanese Premium Matcha murni tanpa es batu. Dibalik 180 derajat: 0 tetes bocor!

⚡ Limited batch available tiap minggu. Pesan lewat link di bio!

#drinklira #cupvsbottle #antiringkih #laptopfriendly #workfromcafe #solopreneur #matchalovers`,
  },

  // 5. Mon Oct 26 @ 08:30 WIB (UTC: 2026-10-26T01:30:00Z) - Reel
  {
    type: 'reel',
    day: 'Senin, 26 Okt (08:30 WIB)',
    dueAt: '2026-10-26T01:30:00Z',
    file: '07_matcha_sugar_crash_viral_9x16.mp4',
    caption: `Kenapa jam 2 siang di hari Senin lo mendadak lemas dan ngantuk berat? 🥱

Bukan salah matchanya. Ini perangkap 30 gram sirup gula pasir di segelas minuman kafe. Tubuh lo kena sugar spike, diikuti banjir insulin yang bikin otak lo crash pas kerjaan lagi numpuk.

Lira memformulasikan energi bersih tanpa gula pasir: 100% pemanis alami stevia drops + Pure Japanese Premium Matcha. 6 jam fokus stabil tanpa crash.

⚡ Limited batch available! Amankan slot botol lo di link bio.

#drinklira #sugarcrash #stevia #seninsemangat #deepwork #matchajakarta #produktivitas`,
  },

  // 6. Mon Oct 26 @ 18:00 WIB (UTC: 2026-10-26T11:00:00Z) - Carousel
  {
    type: 'carousel',
    day: 'Senin, 26 Okt (18:00 WIB)',
    dueAt: '2026-10-26T11:00:00Z',
    slides: [
      'carousel_deep_work/slide1.jpg',
      'carousel_deep_work/slide2.jpg',
      'carousel_deep_work/slide3.jpg',
      'carousel_deep_work/slide4.jpg',
    ],
    caption: `Biokimia Deep Work: Kenapa Lira Matcha jadi cheat code ngoding & nulis seharian? 💻✨

Fokus bukan soal memforsir tubuh dengan gula berlebih. Fokus sejati butuh glukosa darah yang stabil dan stimulasi saraf yang tenang.

Dengan 0 kalori gula pasir (100% ekstrak stevia murni), otak lo gak akan mengalami roller coaster insulin. Lo bisa masuk flow state berjam-jam tanpa distracted.

Dibalut botol kedap udara 180° anti-bocor yang aman ditaruh tepat di sebelah keyboard laptop.

⚡ Limited batch available lewat link di bio!

#drinklira #deepwork #flowstate #ngodingsantai #workfromanywhere #focusfuel #steviadrops`,
  },

  // 7. Tue Oct 27 @ 12:00 WIB (UTC: 2026-10-27T05:00:00Z) - Reel
  {
    type: 'reel',
    day: 'Selasa, 27 Okt (12:00 WIB)',
    dueAt: '2026-10-27T05:00:00Z',
    file: '06_tiga_tanda_rugi_viral.mp4',
    caption: `3 tanda lo ngerugiin diri sendiri tiap beli minuman kafe 50 ribuan:

1. Es batu mencair bikin rasa matcha pekat berubah jadi air dingin tawar berlendir.
2. Tangan lo tersandera seharian karena cup plastik gak bisa masuk tas ransel samping laptop.
3. Lo bayar mahal cuma buat disuntik 30g sirup gula pasir yang bikin sugar crash di jam deadline.

Lira hadir buat ngebenerin itu semua: Rp 34.000, 180° leakproof, dan murni matcha premium Jepang.

⚡ Limited batch available! Order lewat link di bio sekarang.

#drinklira #3tandarugi #hematuang #mahasiswajakarta #workfromcafe #smartchoice #matchalatte`,
  },

  // 8. Wed Oct 28 @ 12:00 WIB (UTC: 2026-10-28T05:00:00Z) - Carousel
  {
    type: 'carousel',
    day: 'Rabu, 28 Okt (12:00 WIB)',
    dueAt: '2026-10-28T05:00:00Z',
    slides: [
      'carousel_finance/slide1.jpg',
      'carousel_finance/slide2.jpg',
      'carousel_finance/slide3.jpg',
      'carousel_finance/slide4.jpg',
    ],
    caption: `Kalkulator Hemat: Gimana beralih ke Lira bisa hemat Rp 400.000 tiap bulan! 💰📊

Kopi/matcha kafe harian: Rp 52.000 x 20 hari kerja = Rp 1.040.000/bulan.
Lira Artisan Bottled: Rp 34.000 x 20 hari kerja = Rp 680.000/bulan.

Selisih penghematan: Rp 360.000 - Rp 400.000/bulan!
Dan yang lo dapet bukan air es tawar, tapi 100% konsentrat Pure Japanese Premium Matcha & Barista Oat Milk tanpa es batu pengencer.

⚡ Limited batch available untuk order batch minggu ini lewat link di bio!

#drinklira #kalkulatorhemat #smartcreator #hematpangkalcerdas #matchalatte #lifestylejakarta`,
  },

  // 9. Wed Oct 28 @ 19:00 WIB (UTC: 2026-10-28T12:00:00Z) - Reel
  {
    type: 'reel',
    day: 'Rabu, 28 Okt (19:00 WIB)',
    dueAt: '2026-10-28T12:00:00Z',
    file: '01_lira_founder_story.mp4',
    caption: `Cerita dari Meja Belajar Kosan ke Botol Segel Siap Minum. 📖✨

Gue Caleb, 17 tahun, solo founder Lira. Gue ngeracik Lira karena frustrasi pribadi tiap hari ngoding di kafe tapi bayar 50 ribu cuma buat dapet air es dilute dan cup plastik yang nyiksa laptop.

Gue riset formulasi sendiri di dapur: memadukan Pure Japanese Premium Matcha asli dan barista oat milk dengan pemanis alami stevia drops. Dikemas di botol ulir kedap udara seharga Rp 34.000.

Terima kasih buat semua yang udah dukung Lira dari batch pertama!

⚡ Limited batch available untuk drop Sabtu ini via link di bio.

#drinklira #founderstory #solopreneur #ceritafounder #indiebusiness #supportlocalbrand`,
  },

  // 10. Thu Oct 29 @ 18:30 WIB (UTC: 2026-10-29T11:30:00Z) - Carousel
  {
    type: 'carousel',
    day: 'Kamis, 29 Okt (18:30 WIB)',
    dueAt: '2026-10-29T11:30:00Z',
    slides: [
      'carousel_scarcity/slide1.jpg',
      'carousel_scarcity/slide2.jpg',
      'carousel_scarcity/slide3.jpg',
      'carousel_scarcity/slide4.jpg',
    ],
    caption: `Kenapa Batch Sabtu Lira selalu cepat sold out? (Filosofi Artisan Freshness) 🏺🍃

Kita menolak sistem pabrik massal yang mengawetkan minuman berbulan-bulan di gudang. Setiap botol Lira diseduh fresh secara manual tiap Jumat malam dan langsung dikirim dingin hari Sabtu.

Standar kualitas tanpa kompromi:
🍵 Pure Japanese Premium Matcha asli
🌱 100% Pemanis Alami Stevia Drops
🔒 Diuji balik 180° anti-bocor di atas MacBook

⚡ Slot batch Sabtu ini sedang dibuka! Amankan kuota botol lo sebelum penuh lewat link di bio. 🔗

#drinklira #artisanquality #batchsabtu #freshlybrewed #limitedbatch #matchajakarta`,
  },

  // 11. Fri Oct 30 @ 15:00 WIB (UTC: 2026-10-30T08:00:00Z) - Reel
  {
    type: 'reel',
    day: 'Jumat, 30 Okt (15:00 WIB)',
    dueAt: '2026-10-30T08:00:00Z',
    file: '03_referral_leaderboard.mp4',
    caption: `Friday Night Brewing Alert! 🌿✨

Malam ini seluruh batch Sabtu diseduh fresh dengan Pure Japanese Premium Matcha & Barista Oat Milk. Besok pagi kurir instan meluncur langsung ke pintu rumah lo!

Ajak temen kantor atau kosan lo ikutan pesen lewat link di bio buat dapet exclusive rewards & free bottle perks di Lira Fam!

⚡ Limited batch available untuk drop besok pagi. Slot bio link akan ditutup begitu kuota artisan penuh!

#drinklira #fridayalert #batchsabtu #lirafam #matchalatte #cleancaffeine #jakartaselatan`,
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

// Start Static HTTP Server serving the Desktop folder
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
    console.log('[Tunnel] Starting persistent Cloudflare tunnel for campaign...');
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

// Wait for tunnel edge to return 200 OK via curl
// Wait for tunnel edge to return 200 OK via non-blocking https.get
function verifyTunnelEdge(url) {
  return new Promise((resolve, reject) => {
    const probeUrl = `${url}/carousel_sat_drop/slide1.jpg`;
    console.log(`[Tunnel] Verifying edge connectivity (non-blocking): ${probeUrl}`);
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
  console.log('🚀 LIRA UNIFIED MULTI-DAY CAMPAIGN SCHEDULER');
  console.log('====================================================');

  // Step 1: Verify Channel
  console.log('\n[1/3] Verifying Buffer Instagram Channel...');
  const channel = await getInstagramChannel();
  console.log(`✓ Connected Instagram: @${channel.displayName} (ID: ${channel.id})`);

  // Step 2: Start persistent server & tunnel
  console.log('\n[2/3] Setting up unified media delivery endpoint...');
  const server = await startStaticServer();
  const { tunnel, url: tunnelUrl } = await startCloudflareTunnel();

  try {
    await verifyTunnelEdge(tunnelUrl);
    console.log(`✓ Tunnel is globally active: ${tunnelUrl}\n`);

    // Step 3: Schedule all items sequentially
    console.log('[3/3] Scheduling 11 Multi-Day Posts via Buffer GraphQL...');
    const results = [];

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

    for (let i = 0; i < posts.length; i++) {
      const p = posts[i];
      console.log(`\n----------------------------------------------------`);
      console.log(`[${i + 1}/${posts.length}] ${p.type.toUpperCase()}: ${p.day}`);
      console.log(`Scheduled DueAt: ${p.dueAt}`);

      if (p.knownId) {
        console.log(`✓ Already confirmed scheduled on Buffer (Post ID: ${p.knownId})`);
        results.push({
          item: i + 1,
          day: p.day,
          type: p.type,
          postId: p.knownId,
          status: 'scheduled',
        });
        continue;
      }

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

      console.log(`Submitting to Buffer API with co-author @caleb766h1...`);
      const resp = await queryBuffer(createMutation, { input });
      const postResult = resp.createPost;

      if (postResult.message) {
        console.error(`❌ Buffer Error for Item ${i + 1}: ${postResult.message}`);
        results.push({
          item: i + 1,
          day: p.day,
          type: p.type,
          postId: null,
          status: `failed: ${postResult.message}`,
        });
      } else {
        const createdPost = postResult.post;
        console.log(`✅ SUCCESS! Post ID: ${createdPost.id} | Status: ${createdPost.status}`);
        results.push({
          item: i + 1,
          day: p.day,
          type: p.type,
          postId: createdPost.id,
          status: createdPost.status,
        });
      }

      // Small pause to allow Buffer's crawler to request media
      console.log('Waiting 5s for Buffer asset ingestion...');
      await new Promise(r => setTimeout(r, 5000));
    }

    console.log('\n====================================================');
    console.log('⏳ Allowing 15s final buffer for background asset downloads...');
    await new Promise(r => setTimeout(r, 15000));

    console.log('\n====================================================');
    console.log('🎉 COMPLETE CAMPAIGN SCHEDULE RESULTS:');
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
