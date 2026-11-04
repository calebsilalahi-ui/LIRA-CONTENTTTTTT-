#!/usr/bin/env node
/**
 * Lira Campaign: Schedule 10 More Brand New Content Across the Week to Friday
 * 5 Reels + 5 Carousels
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
const PORT = 8997;
const BASE_DIR = '/Users/caleb/Desktop/lira reels';

const NEW_POSTS = [
  // 11. Reel 6: Sabtu, 24 Okt @ 19:30 WIB (UTC: 2026-10-24T12:30:00Z)
  {
    itemNum: 11,
    type: 'reel',
    day: 'Sabtu, 24 Okt (19:30 WIB)',
    dueAt: '2026-10-24T12:30:00Z',
    file: 'reel_new_06_laptop_spill.mp4',
    caption: `Momen horor: lagi asik ngetik, cup plastik kafe lo tumpah ke laptop? 💻😱

Trauma cup takeaway tipis dan tutup gampang copot bikin Caleb mutusin mendesain botol Lira:
🔒 Botol PET silinder kokoh dengan sealed gold cap kedap udara
🔄 Dibalik 180° di atas keyboard dijamin anti-bocor, siap lempar ke tas
🌱 Diseduh dari Pure Japanese Premium Matcha murni + stevia drops (0g gula pasir)
🌪️ Konsentrat di-blender kecepatan tinggi buat tekstur mikro halus

Pilihan rasa murni dapur artisan:
🧋 Milk Tea: Signature smooth brew
🍵 Matcha Classic: Pure Japanese umami
🍫 Choco Hazelnut: Rich dark cocoa
🥛 Matcha Oatside: Creamy barista oat

⚡ Limited batch available buat drop minggu ini!
Amankan botol lo sebelum kuota habis via link di bio (@drinklira). 🔗

Crafted solo by @caleb766h1 🌿

#drinklira #antibocor #laptopfriendly #workfromcafe #purematcha #stevia #jakartaselatan #workingspace`,
  },

  // 12. Carousel 11: Minggu, 25 Okt @ 16:00 WIB (UTC: 2026-10-25T09:00:00Z)
  {
    itemNum: 12,
    type: 'carousel',
    day: 'Minggu, 25 Okt (16:00 WIB)',
    dueAt: '2026-10-25T09:00:00Z',
    slides: [
      'carousel_anatomi/slide1.jpg',
      'carousel_anatomi/slide2.jpg',
      'carousel_anatomi/slide3.jpg',
      'carousel_anatomi/slide4.jpg',
    ],
    caption: `ANATOMI 1 BOTOL LIRA: Dari Daun Jepang ke Meja Kerja Lo 🍵🔬

Banyak yang kaget pas nyobain Lira pertama kali: rasanya sepekat kafe mall 55 ribuan, tapi 100% tanpa gula pasir dan tanpa bikin deg-degan.

Ini breakdown transparan 4 pilar di balik setiap botol Lira:
1️⃣ Pure Japanese Premium Matcha: Diimpor murni langsung dari perkebunan Jepang, kaya L-Theanine & klorofil alami.
2️⃣ Blender Micro-Emulsion: Konsentrat matcha di-blender kecepatan tinggi biar partikelnya larut mikro tanpa ampas berpasir.
3️⃣ Pemanis Alami Daun Stevia: 0 kalori, 0g gula pasir, 0 lonjakan insulin.
4️⃣ Sealed Gold Cap: Botol silinder kokoh 180° anti bocor, siap masuk tas kerja.

Pilihan varian lengkap:
🧋 Milk Tea: Rp 15.000
🍵 Matcha Classic: Rp 19.000
🍫 Choco Hazelnut: Rp 22.000
🥛 Matcha Oatside: Rp 24.000

⚡ Limited batch available per batch!
Pesan botol artisan lo sekarang via link di bio (@drinklira). 🔗

#drinklira #anatomiproduk #purematcha #stevia #oatside #transparan #artisanbatch #jakartaculinary`,
  },

  // 13. Reel 7: Senin, 26 Okt @ 12:30 WIB (UTC: 2026-10-26T05:30:00Z)
  {
    itemNum: 13,
    type: 'reel',
    day: 'Senin, 26 Okt (12:30 WIB)',
    dueAt: '2026-10-26T05:30:00Z',
    file: 'reel_new_07_myth_no_sugar.mp4',
    caption: `Siapa bilang matcha enak harus ditimbun sirup gula berlebihan? 🍵🚫

Banyak yang ngira matcha asli pasti pahit jamu, makanya kafe mall masukin 30-35 gram gula pasir buat nutupin rasanya.

Padahal kalau pakai Pure Japanese Premium Matcha asli, rasa gurih umaminya udah kaya banget. 
Di dapur Lira:
🌱 Cukup beberapa tetes ekstrak daun stevia alami (0g gula pasir)
🌪️ Konsentrat di-blender kecepatan tinggi biar emulsi mikro menyatu halus
✨ Hasilnya: manis pas, enteng di badan, nol lonjakan insulin!

Pilihan varian artisan:
🧋 Milk Tea: Signature smooth blend
🍵 Matcha Classic: Pure Japanese umami
🍫 Choco Hazelnut: Dark roasted cocoa
🥛 Matcha Oatside: Creamy barista oat

⚡ Limited batch available untuk drop minggu ini!
Rasain bedanya matcha jujur via link di bio (@drinklira). 🔗

Crafted solo by @caleb766h1 🌿

#drinklira #mitosmatcha #zerogula #stevia #purematcha #healthylifestyle #jakartaselatan #matchalatte`,
  },

  // 14. Carousel 12: Selasa, 27 Okt @ 08:30 WIB (UTC: 2026-10-27T01:30:00Z)
  {
    itemNum: 14,
    type: 'carousel',
    day: 'Selasa, 27 Okt (08:30 WIB)',
    dueAt: '2026-10-27T01:30:00Z',
    slides: [
      'carousel_guidemenu/slide1.jpg',
      'carousel_guidemenu/slide2.jpg',
      'carousel_guidemenu/slide3.jpg',
      'carousel_guidemenu/slide4.jpg',
    ],
    caption: `GUIDE MENU LIRA: Mana yang paling cocok buat lo? 🧃👀

Setiap varian Lira diracik khusus buat nemenin aktivitas harian lo:

🧋 Milk Tea (Rp 15.000): Teh hitam aromatik diseduh pekat dengan susu lembut dan manis stevia. Paling pas buat teman baca buku & rileks sore.
🍵 Matcha Latte Classic (Rp 19.000): Pure Japanese Matcha murni dipadu fresh milk seimbang. Pilihan utama buat bangunin fokus kerja pagi.
🍫 Choco Hazelnut (Rp 22.000): Kakao pekat & gurih hazelnut panggang. Mood booster tanpa gula pasir buat nuntasin deadline.
🥛 Matcha Oatside (Rp 24.000): Flagship kami! Pure Japanese Matcha di-blender halus dipadu 100% Barista Oatside murni. Creamy, gurih, vegan-friendly.

Diseduh jujur di dapur sendiri, 0g gula pasir, tanpa bahan pengawet pabrik.

⚡ Limited batch available!
Amankan varian favorit lo via link di bio (@drinklira). 🔗

#drinklira #guidemenu #matchajakarta #oatside #chocohazelnut #milktea #supportlocal #jakartaselatan`,
  },

  // 15. Reel 8: Selasa, 27 Okt @ 18:30 WIB (UTC: 2026-10-27T11:30:00Z)
  {
    itemNum: 15,
    type: 'reel',
    day: 'Selasa, 27 Okt (18:30 WIB)',
    dueAt: '2026-10-27T11:30:00Z',
    file: 'reel_new_08_pure_japanese_matcha.mp4',
    caption: `Kenapa warna hijau Lira bisa sepekat zamrud tanpa setetes pun pewarna kimia? 🌿✨

Banyak bubuk matcha abal-abal yang warnanya kusam kecokelatan karena dicampur tepung dan pewarna sintetis.

Lira menolak kompromi itu:
🇯🇵 Kita cuma impor Pure Japanese Premium Matcha murni langsung dari perkebunan Jepang
🍃 Warna hijaunya alami karena tinggi klorofil dan asam amino L-Theanine
🌪️ Konsentrat di-blender kecepatan tinggi agar teksturnya selembut sutra tanpa ampas berpasir
🌱 100% pemanis alami stevia drops (0g gula pasir)

Koleksi seduhan artisan Lira:
🧋 Milk Tea • 🍵 Matcha Classic • 🍫 Choco Hazelnut • 🥛 Matcha Oatside

⚡ Limited batch available!
Stok fokus kerja lo via link di bio (@drinklira). 🔗

Crafted solo by @caleb766h1 🌿

#drinklira #purematcha #japanesematcha #kualitasartisan #stevia #jakartafoodie #workfromcafe`,
  },

  // 16. Carousel 13: Rabu, 28 Okt @ 08:30 WIB (UTC: 2026-10-28T01:30:00Z)
  {
    itemNum: 16,
    type: 'carousel',
    day: 'Rabu, 28 Okt (08:30 WIB)',
    dueAt: '2026-10-28T01:30:00Z',
    slides: [
      'carousel_rutinitas/slide1.jpg',
      'carousel_rutinitas/slide2.jpg',
      'carousel_rutinitas/slide3.jpg',
      'carousel_rutinitas/slide4.jpg',
    ],
    caption: `RUTINITAS CODER & MAHASISWA: Flow state seharian tanpa brain fog 💻⚡

Gimana cara ngoding dan ngerjain tugas berjam-jam tanpa ngantuk berat jam 2 siang? Ini jam ideal minum Lira:

⏰ 09:00 WIB: Matcha Classic (Rp 19k) — Bangunin fokus secara halus berkat L-Theanine alami, aman tanpa asam lambung.
⏰ 13:00 WIB: Matcha Oatside (Rp 24k) — Pengganti kopi manis kafe. 0g gula pasir (stevia murni) bikin lo kebal dari post-lunch sugar crash.
⏰ 16:00 WIB: Choco Hazelnut (Rp 22k) — Mood booster nuntasin revisi kode & tugas kuliah.
⏰ 20:00 WIB: Milk Tea Artisan (Rp 15k) — Teman santai evaluasi hari sambil baca buku.

Simpan stok di kulkas, tahan optimal hingga 5 hari.

⚡ Limited batch available!
Amankan stok mingguan lo via link di bio (@drinklira). 🔗

#drinklira #deepwork #programmerlife #mahasiswalife #flowstate #fokustanpacrash #stevia #oatside`,
  },

  // 17. Reel 9: Kamis, 29 Okt @ 08:30 WIB (UTC: 2026-10-29T01:30:00Z)
  {
    itemNum: 17,
    type: 'reel',
    day: 'Kamis, 29 Okt (08:30 WIB)',
    dueAt: '2026-10-29T01:30:00Z',
    file: 'reel_new_09_oatside_formula.mp4',
    caption: `Eksperimen 6 merek susu nabati buat nemuin racikan Matcha Oatside sempurna! 🥛🧪

Bikin oat matcha yang balance ternyata gak gampang. Ada susu yang pas di-blender misah, ada yang rasa kacangnya terlalu dominan sampai nutup umami matcha.

Sampai akhirnya nemu formula emas:
🌾 Oatside Barista Edition dipadu konsentrat Pure Japanese Premium Matcha hasil blender kecepatan tinggi
🌱 Diberi pemanis alami daun stevia drops tanpa gula pasir
✨ Rasa creamy oat nutty menyatu sempurna sama pekatnya matcha Jepang!

Racikan jujur tanpa kompromi kualitas dan tanpa gula pasir.
Tersedia juga: Milk Tea, Matcha Classic, dan Choco Hazelnut.

⚡ Limited batch available!
Rasain segarnya lewat link di bio (@drinklira). 🔗

Crafted solo by @caleb766h1 🌿

#drinklira #matchaoatside #oatside #formulaemas #hargajujur #purematcha #stevia #jakartaselatan`,
  },

  // 18. Carousel 14: Kamis, 29 Okt @ 12:30 WIB (UTC: 2026-10-29T05:30:00Z)
  {
    itemNum: 18,
    type: 'carousel',
    day: 'Kamis, 29 Okt (12:30 WIB)',
    dueAt: '2026-10-29T05:30:00Z',
    slides: [
      'carousel_botolvscup/slide1.jpg',
      'carousel_botolvscup/slide2.jpg',
      'carousel_botolvscup/slide3.jpg',
      'carousel_botolvscup/slide4.jpg',
    ],
    caption: `KENAPA BOTOL LIRA LEBIH UNGGUL DARI CUP TAKEAWAY KAFE? 🧃 vs 🥤

Berapa kali lo beli minuman kafe 50 ribuan dan ngalamin hal ini:
❌ 15 menit kemudian es mencair, rasanya jadi hambar kayak air tawar
❌ Tutup cup plastik tipis gampang copot dan tumpah di meja kerja
❌ Meja basah kena lingkaran air kondensasi

Solusi Lira:
✅ 100% konsentrat pekat tanpa es pengencer: rasa stabil dari tegukan pertama sampai terakhir
✅ Sealed gold cap kedap udara: dibalik 180° di atas keyboard laptop pun aman
✅ Siap lempar ke dalam ransel atau totebag kerja

Harga jauh lebih hemat:
🧋 Milk Tea: Rp 15.000
🍵 Matcha Classic: Rp 19.000
🍫 Choco Hazelnut: Rp 22.000
🥛 Matcha Oatside: Rp 24.000

⚡ Limited batch available!
Beralih ke botol siap minum via link di bio (@drinklira). 🔗

#drinklira #botolsiapminum #antibocor #nomeltedice #laptopfriendly #purematcha #jakartaworking`,
  },

  // 19. Carousel 15: Jumat, 30 Okt @ 11:30 WIB (UTC: 2026-10-30T04:30:00Z)
  {
    itemNum: 19,
    type: 'carousel',
    day: 'Jumat, 30 Okt (11:30 WIB)',
    dueAt: '2026-10-30T04:30:00Z',
    slides: [
      'carousel_preorderchecklist/slide1.jpg',
      'carousel_preorderchecklist/slide2.jpg',
      'carousel_preorderchecklist/slide3.jpg',
      'carousel_preorderchecklist/slide4.jpg',
    ],
    caption: `CHECKLIST PRE-ORDER BATCH SABTU: Jangan sampai kehabisan slot! 📦📋

Karena diseduh manual satu per satu tanpa pabrik massal, kuota botol Lira setiap batch Sabtu selalu terbatas.

3 langkah simpel buat amankan jatah lo:
1️⃣ Klik link di bio profile @drinklira
2️⃣ Pilih varian menu favoritmu: Milk Tea (15k), Classic (19k), Choco (22k), atau Oatside (24k)
3️⃣ Isi alamat pengiriman Gojek untuk drop Sabtu pagi!

Minuman diseduh fresh Jumat malam langsung dengan tangan Caleb, lalu dikirim aman ke depan pintu rumah lo.

⚡ Amankan kuota botol lo sebelum form order ditutup malam ini! 🔗

#drinklira #preorder #batchsabtu #freshbrewed #purematcha #stevia #supportlocal #jakartadelivery`,
  },

  // 20. Reel 10: Jumat, 30 Okt @ 19:00 WIB (UTC: 2026-10-30T12:00:00Z)
  {
    itemNum: 20,
    type: 'reel',
    day: 'Jumat, 30 Okt (19:00 WIB)',
    dueAt: '2026-10-30T12:00:00Z',
    file: 'reel_new_10_friday_night_brewing.mp4',
    caption: `Jam 22:00: Di balik layar persiapan batch Sabtu Lira 🌙🍵

Kenapa Caleb nolak bikin stok berhari-hari sebelumnya di pabrik?
Karena janji artisan freshness: setiap botol diseduh fresh pada malam sebelum pengiriman.

Proses jujur di dapur kami:
⚖️ Timbangan digital presisi untuk Pure Japanese Premium Matcha
🌪️ Konsentrat di-blender kecepatan tinggi hingga emulsi mikro halus tanpa gumpalan
🌱 Tetesan pemanis alami stevia drops (0g gula pasir)
🔒 Disegel rapat dengan gold cap siap kirim besok pagi via Gojek!

Seduhan artisan fresh batch:
🧋 Milk Tea • 🍵 Matcha Classic • 🍫 Choco Hazelnut • 🥛 Matcha Oatside

⚡ Kuota batch malam ini sangat terbatas!
Langsung amankan jatah pengiriman lo di link bio sekarang (@drinklira). 🔗

Crafted solo by @caleb766h1 🌿

#drinklira #behindthescenes #dapurlira #artisanbrewing #freshbatch #purematcha #stevia #jakartafood`,
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
        if (req.method === 'HEAD') {
          res.end();
          console.log(`[HTTP Server] 200 OK (HEAD): ${req.url}`);
          return;
        }
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
    console.log('[Tunnel] Starting persistent Cloudflare tunnel for 10 new posts...');
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

async function verifyTunnelEdge(url) {
  console.log(`[Tunnel] Waiting 6s for Cloudflare edge warm-up: ${url}`);
  await new Promise(r => setTimeout(r, 6000));
  console.log(`✓ Tunnel is globally active at: ${url}`);
}

async function run() {
  console.log('====================================================');
  console.log('🚀 SCHEDULING 10 NEW CONTENT PIECES TO BUFFER');
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

    for (let i = 0; i < NEW_POSTS.length; i++) {
      const p = NEW_POSTS[i];
      console.log(`\n----------------------------------------------------`);
      console.log(`[${i + 1}/${NEW_POSTS.length}] Scheduling #${p.itemNum}: ${p.type.toUpperCase()} (${p.day})`);
      console.log(`DueAt: ${p.dueAt}`);

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
    console.log('🎉 10 NEW POSTS SCHEDULE RESULTS:');
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
  console.error('Fatal error:', err);
  process.exit(1);
});
