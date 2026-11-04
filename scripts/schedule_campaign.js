#!/usr/bin/env node
/**
 * Lira Automated Campaign Scheduler (11 Multi-Day Posts via Buffer GraphQL)
 * Automatically schedules 6 Reels and 5 Carousels spread from Saturday to Friday.
 */

const { spawnSync } = require('child_process');
const path = require('path');

const posts = [
  // 1. Sat Oct 24 @ 11:30 WIB (UTC: 2026-10-24T04:30:00Z) - Reel
  {
    type: 'reel',
    day: 'Sabtu, 24 Okt (11:30 WIB)',
    dueAt: '2026-10-24T04:30:00Z',
    file: '/Users/caleb/Desktop/lira reels/04_order_tutorial.mp4',
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
      '/Users/caleb/Desktop/lira reels/carousel_sat_drop/slide1.jpg',
      '/Users/caleb/Desktop/lira reels/carousel_sat_drop/slide2.jpg',
      '/Users/caleb/Desktop/lira reels/carousel_sat_drop/slide3.jpg',
      '/Users/caleb/Desktop/lira reels/carousel_sat_drop/slide4.jpg',
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
    slides: [
      '/Users/caleb/Desktop/lira reels/carousel_sun_reset/slide1.jpg',
      '/Users/caleb/Desktop/lira reels/carousel_sun_reset/slide2.jpg',
      '/Users/caleb/Desktop/lira reels/carousel_sun_reset/slide3.jpg',
      '/Users/caleb/Desktop/lira reels/carousel_sun_reset/slide4.jpg',
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
    file: '/Users/caleb/Desktop/lira reels/05_cup_vs_bottle.mp4',
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
    file: '/Users/caleb/Desktop/lira reels/07_matcha_sugar_crash_viral_9x16.mp4',
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
      '/Users/caleb/Desktop/lira reels/carousel_deep_work/slide1.jpg',
      '/Users/caleb/Desktop/lira reels/carousel_deep_work/slide2.jpg',
      '/Users/caleb/Desktop/lira reels/carousel_deep_work/slide3.jpg',
      '/Users/caleb/Desktop/lira reels/carousel_deep_work/slide4.jpg',
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
    file: '/Users/caleb/Desktop/lira reels/06_tiga_tanda_rugi_viral.mp4',
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
      '/Users/caleb/Desktop/lira reels/carousel_finance/slide1.jpg',
      '/Users/caleb/Desktop/lira reels/carousel_finance/slide2.jpg',
      '/Users/caleb/Desktop/lira reels/carousel_finance/slide3.jpg',
      '/Users/caleb/Desktop/lira reels/carousel_finance/slide4.jpg',
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
    file: '/Users/caleb/Desktop/lira reels/01_lira_founder_story.mp4',
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
      '/Users/caleb/Desktop/lira reels/carousel_scarcity/slide1.jpg',
      '/Users/caleb/Desktop/lira reels/carousel_scarcity/slide2.jpg',
      '/Users/caleb/Desktop/lira reels/carousel_scarcity/slide3.jpg',
      '/Users/caleb/Desktop/lira reels/carousel_scarcity/slide4.jpg',
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
    file: '/Users/caleb/Desktop/lira reels/03_referral_leaderboard.mp4',
    caption: `Friday Night Brewing Alert! 🌿✨

Malam ini seluruh batch Sabtu diseduh fresh dengan Pure Japanese Premium Matcha & Barista Oat Milk. Besok pagi kurir instan meluncur langsung ke pintu rumah lo!

Ajak temen kantor atau kosan lo ikutan pesen lewat link di bio buat dapet exclusive rewards & free bottle perks di Lira Fam!

⚡ Limited batch available untuk drop besok pagi. Slot bio link akan ditutup begitu kuota artisan penuh!

#drinklira #fridayalert #batchsabtu #lirafam #matchalatte #cleancaffeine #jakartaselatan`,
  },
];

async function run() {
  console.log('====================================================');
  console.log('🚀 LIRA AUTOMATED MULTI-DAY CAMPAIGN SCHEDULER');
  console.log('====================================================');
  console.log(`Scheduling ${posts.length} posts spanning Sat Oct 24 to Fri Oct 30...`);

  const knownScheduled = {
    0: '6adb88b572cdfa89f2d9e825',
    2: '6adb8b004a4cd45b1965e574',
  };

  const results = [];

  for (let i = 0; i < posts.length; i++) {
    const p = posts[i];
    if (knownScheduled[i]) {
      console.log(`\n----------------------------------------------------`);
      console.log(`[${i + 1}/${posts.length}] ALREADY SCHEDULED: ${p.type.toUpperCase()}: ${p.day}`);
      console.log(`Post ID: ${knownScheduled[i]}`);
      console.log(`----------------------------------------------------`);
      results.push({ item: i + 1, day: p.day, type: p.type, status: `scheduled (${knownScheduled[i]})` });
      continue;
    }

    console.log(`\n----------------------------------------------------`);
    console.log(`[${i + 1}/${posts.length}] Scheduling ${p.type.toUpperCase()}: ${p.day}`);
    console.log(`DueAt (UTC): ${p.dueAt}`);
    console.log(`----------------------------------------------------`);

    let cmdArgs = [];
    if (p.type === 'reel') {
      cmdArgs = [
        path.resolve(__dirname, 'post_reel.js'),
        '--file', p.file,
        '--caption', p.caption,
        '--collaborators', 'caleb766h1',
        '--mode', 'customScheduled',
        '--dueAt', p.dueAt,
      ];
    } else {
      cmdArgs = [
        path.resolve(__dirname, 'post_carousel.js'),
        '--slides', ...p.slides,
        '--caption', p.caption,
        '--collaborators', 'caleb766h1',
        '--mode', 'customScheduled',
        '--dueAt', p.dueAt,
      ];
    }

    console.log(`Executing: node ${cmdArgs[0]} (target: ${p.dueAt})...`);
    const proc = spawnSync('/Users/caleb/.gemini/antigravity/scratch/.node/bin/node', cmdArgs, {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'inherit',
      env: {
        ...process.env,
        PATH: `/Users/caleb/.gemini/antigravity/scratch/.node/bin:/Users/caleb/.local/bin:${process.env.PATH}`,
      },
    });

    if (proc.status !== 0) {
      console.error(`❌ Warning: Item ${i + 1} exited with status ${proc.status}`);
      results.push({ item: i + 1, day: p.day, type: p.type, status: 'failed' });
    } else {
      console.log(`✅ Successfully scheduled Item ${i + 1} (${p.day})`);
      results.push({ item: i + 1, day: p.day, type: p.type, status: 'scheduled' });
    }

    // Brief pause between requests to prevent tunnel or port race conditions
    console.log('Pausing 10s before next schedule job...');
    spawnSync('sleep', ['10']);
  }

  console.log('\n====================================================');
  console.log('🎉 ALL CAMPAIGN POSTS PROCESSED!');
  console.log('====================================================');
  console.table(results);
}

run();
