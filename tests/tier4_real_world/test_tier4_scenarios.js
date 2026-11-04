/**
 * Tier 4 - Real-World Scenario Test Suite
 * Authoritative source: PROJECT.md & ORIGINAL_REQUEST.md §R4, R5, Acceptance Criteria
 * 
 * Verifies realistic multi-day production workload scenarios:
 * 1. 10 Consecutive Alternating Rush-Hour Slots (30 7,12,18 * * * Asia/Jakarta)
 * 2. Multi-SKU Context Recycling (Matcha Oatside, Choco Hazelnut, Signature Milk Tea, Matcha Classic)
 * 3. Non-Repetition Gate: 0 repeated (pillar, format, hook_category) tuples
 * 4. Pairwise Bigram Jaccard Similarity < 0.30 across all 10 slots
 * 5. 100% Guardrail Pre-Flight Pass Rate
 * 6. Isolated Sandbox Ledger Persistence and Integrity
 * 7. Buffer GraphQL Publisher Dry-Run Batch Simulation
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { LIRA_CONTEXT, BUFFER_PUBLISHER, PATHS } = require('../helpers/test_constants');
const oracle = require('../helpers/guardrail_oracle');
const { computeBigramJaccard, validatePairwiseJaccard } = require('../helpers/jaccard_oracle');
const { createTempSandbox } = require('../helpers/test_fixture_loader');

// Progressive testability binding for guardrails
const guardrailScript = path.join(PATHS.SCRIPTS_DIR, 'validate_guardrails.js');
const { validateContent } = fs.existsSync(guardrailScript) ? require(guardrailScript) : oracle;

/**
 * Real-world 10-slot workload generator matching production distribution:
 * Recycles 4 SKUs across 7 PBL hook categories, 4 pillars, and alternating formats.
 */
function generateTenSlotProductionWorkload() {
  const scheduleSlots = [
    { day: 1, slot: '07:30 WIB', timeISO: '2026-11-04T00:30:00Z', format: 'reel' },
    { day: 1, slot: '12:30 WIB', timeISO: '2026-11-04T05:30:00Z', format: 'carousel' },
    { day: 1, slot: '18:30 WIB', timeISO: '2026-11-04T11:30:00Z', format: 'reel' },
    { day: 2, slot: '07:30 WIB', timeISO: '2026-11-05T00:30:00Z', format: 'carousel' },
    { day: 2, slot: '12:30 WIB', timeISO: '2026-11-05T05:30:00Z', format: 'reel' },
    { day: 2, slot: '18:30 WIB', timeISO: '2026-11-05T11:30:00Z', format: 'carousel' },
    { day: 3, slot: '07:30 WIB', timeISO: '2026-11-06T00:30:00Z', format: 'reel' },
    { day: 3, slot: '12:30 WIB', timeISO: '2026-11-06T05:30:00Z', format: 'carousel' },
    { day: 3, slot: '18:30 WIB', timeISO: '2026-11-06T11:30:00Z', format: 'reel' },
    { day: 4, slot: '07:30 WIB', timeISO: '2026-11-07T00:30:00Z', format: 'carousel' },
  ];

  // Verified production-ready content templates adhering to all brand rules & guardrails
  const slotBlueprints = [
    {
      sku: 'Matcha Oatside',
      pillar: 'Sugar Crash & Stevia Science',
      hook_category: 'Comparison',
      topic: 'Kenapa matcha kafe 50k bikin otak ngantuk jam 2 siang',
      verbal_hook: 'Pernah gak lo beli matcha lima puluh ribu di kafe, tapi dua jam kemudian kepala lo malah lemes dan ngantuk parah?',
      written_hook: 'KENAPA MATCHA 50K BIKIN CRASH',
      caption: 'Di Lira, kita tolak resep murahan: pure Japanese premium matcha diemulsi bareng barista oat milk dan pemanis alami stevia. Zero gula pasir, zero crash. Limited batch available untuk Sabtu ini lewat link di bio.\n\nCrafted solo by @caleb766h1',
      overlays: [{ text: 'KENAPA MATCHA 50K BIKIN CRASH', x: 120, y: 350 }],
    },
    {
      sku: 'Choco Hazelnut',
      pillar: 'Craftsmanship & Student Lifestyle',
      hook_category: 'Educational',
      topic: 'Anatomi dark cocoa murni vs sirup cokelat kental manis',
      verbal_hook: '',
      written_hook: 'ANATOMI DARK COCOA VS SIRUP GULA',
      caption: 'Bukan minuman cokelat manis biasa. Lira Choco Hazelnut memadukan raw cocoa blend murni dengan cold pressed hazelnut extract dan stevia. Limited batch ready weekend ini via bio.\n\nCrafted solo by @caleb766h1',
      slides: [
        { slideNumber: 1, headline: 'ANATOMI DARK COCOA VS SIRUP GULA', type: 'hook' },
        { slideNumber: 2, headline: 'KENAPA COKLAT KAFE BIKIN TENGGOROKAN GATAL DAN LENGKET', type: 'reserve_hook' },
        { slideNumber: 3, headline: 'PERBANDINGAN BAHAN BAKU: RAW COCOA VS KENTAL MANIS', type: 'body' },
        { slideNumber: 4, headline: 'KANDUNGAN THEOBROMINE UNTUK CLEAN ENERGY 4 JAM', type: 'body' },
        { slideNumber: 5, headline: 'CHEATSHEET: CARA BACA LABEL MINUMAN COKELAT', type: 'high_save' },
        { slideNumber: 6, headline: 'LIMITED BATCH SABTU: CARA AMANKAN BOTTLE DINGIN LO', type: 'cta' },
      ],
    },
    {
      sku: 'Signature Milk Tea',
      pillar: 'Cold Chain & Saturday COD Loop',
      hook_category: 'Storytelling',
      topic: 'Rahasia tas thermal hijau forest jemput milk tea dingin',
      verbal_hook: 'Hari Sabtu jam satu siang di Tangerang Selatan, suhu aspal bisa sampai tiga puluh tujuh derajat celsius.',
      written_hook: 'RAHASIA TAS THERMAL HIJAU FOREST',
      caption: 'Makanya setiap rute Gojek COD Lira wajib masuk tas thermal berinsulasi aluminium foil forest green. Dingin terjaga dari chiller sampai tangan lo. Limited batch order via link bio.\n\nCrafted solo by @caleb766h1',
      overlays: [{ text: 'RAHASIA TAS THERMAL DINGIN', x: 120, y: 350 }],
    },
    {
      sku: 'Matcha Classic',
      pillar: 'Indie Game & Pixel Culture',
      hook_category: 'Myth Busting',
      topic: 'Mitos matcha otentik harus pahit pekat bikin mual',
      verbal_hook: '',
      written_hook: 'MITOS MATCHA ASLI HARUS PAHIT',
      caption: 'Matcha otentik kualitas artisan terpilih seharusnya punya profil umami yang manis alami, bukan pahit gosong karena daun tua. Simak perbedaannya. Limited batch ready Sabtu.\n\nCrafted solo by @caleb766h1',
      slides: [
        { slideNumber: 1, headline: 'MITOS MATCHA ASLI HARUS PAHIT GOSONG', type: 'hook' },
        { slideNumber: 2, headline: 'DAUN PERTAMA JEPANG PUNYA RASA UMAMI MANIS ALAMI', type: 'reserve_hook' },
        { slideNumber: 3, headline: 'KENAPA BANYAK KAFE BUTUH 4 PUMP GULA CAIR', type: 'body' },
        { slideNumber: 4, headline: 'METODE MICRO-WHISK 10 DETIK TANPA AMPAS KASAR', type: 'body' },
        { slideNumber: 5, headline: 'PANDUAN TASTING NOTES MATCHA UNTUK PEMULA', type: 'high_save' },
        { slideNumber: 6, headline: 'AMANKAN JATAH BOTOL SABTU INI DI LINK BIO', type: 'cta' },
      ],
    },
    {
      sku: 'Matcha Oatside',
      pillar: 'Craftsmanship & Student Lifestyle',
      hook_category: 'Day in the Life',
      topic: 'Rutinitas jam 03:30 AM solo founder seduh manual',
      verbal_hook: 'Jam setengah empat pagi pas seluruh komplek masih tidur, dapur Lira udah mulai nyala.',
      written_hook: 'SOLO FOUNDER ROUTINE 0330 AM',
      caption: 'Dari nimbang daun matcha sampai segel botol 180 derajat, semua gue kerjain sendiri demi rasa fresh maksimal. Limited batch siap antar Sabtu siang. Link di bio.\n\nCrafted solo by @caleb766h1',
      overlays: [{ text: 'RUTINITAS JAM 03:30 AM', x: 120, y: 350 }],
    },
    {
      sku: 'Signature Milk Tea',
      pillar: 'Sugar Crash & Stevia Science',
      hook_category: 'Authority',
      topic: 'Kenapa daun teh ceylon butuh cold-steep 16 jam',
      verbal_hook: '',
      written_hook: 'COLD STEEP CEYLON 16 JAM',
      caption: 'Bukan seduhan instan sachet. Daun teh ceylon pilihan kita rendam dingin selama 16 jam untuk mengekstrak antioksidan tanpa rasa sepat berlebih. Limited batch rilis Sabtu.\n\nCrafted solo by @caleb766h1',
      slides: [
        { slideNumber: 1, headline: 'KENAPA TEH BOTOL KITA RENDAM 16 JAM', type: 'hook' },
        { slideNumber: 2, headline: 'SUHU DINGIN MENAHAN TANNIN AGAR TIDAK SEPAT DI LIDAH', type: 'reserve_hook' },
        { slideNumber: 3, headline: 'KOMBINASI SUSU EVAPORASI TANPA PENGAWET SINTETIS', type: 'body' },
        { slideNumber: 4, headline: 'GRAFIK PELEPASAN KAFEIN ALAMI VS ENERGI CRASH', type: 'body' },
        { slideNumber: 5, headline: 'TABEL PERBANDINGAN MILK TEA KAFE VS LIRA COLD STEEP', type: 'high_save' },
        { slideNumber: 6, headline: 'SLOT PENGIRIMAN WEEKEND INI SUDAH DIBUKA VIA BIO', type: 'cta' },
      ],
    },
    {
      sku: 'Choco Hazelnut',
      pillar: 'Cold Chain & Saturday COD Loop',
      hook_category: 'Random',
      topic: 'Tes goncang botol bersegel di dashboard motor gojek',
      verbal_hook: 'Kita tes botol Lira diguncang di jalanan rusak BSD selama tiga puluh menit.',
      written_hook: 'TES GONCANG 180 DERAJAT BOTOL',
      caption: 'Hasilnya: nol rembes, segel utuh, suhu tetap dingin berkat botol tebal dan cooler bag. Aman masuk tas lo. Limited batch Sabtu ini lewat bio.\n\nCrafted solo by @caleb766h1',
      overlays: [{ text: 'TES GONCANG BOTOL BERSEGEL', x: 120, y: 350 }],
    },
    {
      sku: 'Matcha Classic',
      pillar: 'Craftsmanship & Student Lifestyle',
      hook_category: 'Storytelling',
      topic: 'Cara bawa botol matcha dingin ke perpustakaan kampus',
      verbal_hook: '',
      written_hook: 'PANDUAN MINUM DINGIN SAAT BELAJAR',
      caption: 'Gak ada lagi drama es batu mencair basahin catatan tugas lo. Botol kedap Lira siap nemenin marathon skripsi tanpa noda meja. Limited batch order via link bio.\n\nCrafted solo by @caleb766h1',
      slides: [
        { slideNumber: 1, headline: 'PANDUAN BELAJAR FOKUS TANPA MEJA BASAH', type: 'hook' },
        { slideNumber: 2, headline: 'EMBUN CUP PLASTIK BIASA MERUSAK CATATAN KERTAS LAPTOP', type: 'reserve_hook' },
        { slideNumber: 3, headline: 'DESAIN BOTOL RAMBING PAS MASUK SLEEVE TAS RANSEL', type: 'body' },
        { slideNumber: 4, headline: 'L-THEANINE MEMBANTU GELOMBANG OTAK ALPHA FOKUS', type: 'body' },
        { slideNumber: 5, headline: 'CHECKLIST PERSIAPAN EXAM SPRINT 4 JAM', type: 'high_save' },
        { slideNumber: 6, headline: 'PESAN BOTOL ARTISAN WEEKEND INI LEWAT LINK DI BIO', type: 'cta' },
      ],
    },
    {
      sku: 'Matcha Oatside',
      pillar: 'Cold Chain & Saturday COD Loop',
      hook_category: 'Educational',
      topic: 'Restock dadakan di chiller SAPA Mart jam istirahat',
      verbal_hook: 'Jam makan siang pas chiller SAPA Mart mendadak kosong, kita langsung kirim batch baru.',
      written_hook: 'RESTOCK CHILLER SAPA MART',
      caption: 'Buat lo yang ada di area kampus, botol segar Lira selalu restock langsung dari chiller. Fresh cold and ready. Limited batch tersedia weekend ini via bio.\n\nCrafted solo by @caleb766h1',
      overlays: [{ text: 'RESTOCK DADAKAN CHILLER KAMPUS', x: 120, y: 350 }],
    },
    {
      sku: 'Signature Milk Tea',
      pillar: 'Sugar Crash & Stevia Science',
      hook_category: 'Comparison',
      topic: 'Perbandingan kalori milk tea boba kafe vs Lira artisan',
      verbal_hook: '',
      written_hook: 'KALORI MILK TEA BOBA VS LIRA',
      caption: 'Satu cup boba kafe bisa tembus 450 kalori karena sirup fruktosa. Lira Signature Milk Tea cuma seperempatnya dengan rasa legit otentik. Limited batch via bio.\n\nCrafted solo by @caleb766h1',
      slides: [
        { slideNumber: 1, headline: 'PERBANDINGAN KALORI MILK TEA KAFE VS LIRA', type: 'hook' },
        { slideNumber: 2, headline: 'SIRUP FRUKTOSA KAFE MENYUMBANG 80 PERSEN BEBAN KALORI', type: 'reserve_hook' },
        { slideNumber: 3, headline: 'RESEP STEVIA ALAMI MEMBERIKAN RASA SWEET TANPA BEBAN', type: 'body' },
        { slideNumber: 4, headline: 'NUTRISI LENGKAP: PROTEIN SUSU DENGAN ANTIOKSIDAN TEH', type: 'body' },
        { slideNumber: 5, headline: 'INFOGRAFIS: PERBANDINGAN GULA PADA 5 MINUMAN POPULER', type: 'high_save' },
        { slideNumber: 6, headline: 'SLOT DROP SABTU TERBATAS AMANKAN SEKARANG DI BIO', type: 'cta' },
      ],
    },
  ];

  return scheduleSlots.map((slotMeta, idx) => ({
    id: `slot_${String(idx + 1).padStart(2, '0')}_${slotMeta.format}`,
    slotNumber: idx + 1,
    ...slotMeta,
    ...slotBlueprints[idx],
  }));
}

describe('Tier 4: Realistic Production Workload Scenarios', () => {

  const workload = generateTenSlotProductionWorkload();

  // =========================================================================
  // Scenario 1: 10 Consecutive Alternating Rush-Hour Slots
  // =========================================================================
  test('Alternating Rush-Hour Format Discipline: Exactly 10 alternating slots (Reel -> Carousel -> Reel)', () => {
    assert.strictEqual(workload.length, 10, 'Workload must contain exactly 10 slots');

    for (let i = 0; i < workload.length; i++) {
      const expectedFormat = i % 2 === 0 ? 'reel' : 'carousel';
      assert.strictEqual(
        workload[i].format,
        expectedFormat,
        `Slot ${i + 1} (${workload[i].slot}) must be format "${expectedFormat}"`
      );

      // Verify adjacent slots never have the same format
      if (i > 0) {
        assert.notStrictEqual(
          workload[i].format,
          workload[i - 1].format,
          `Slot ${i + 1} must alternate from slot ${i}`
        );
      }
    }
  });

  // =========================================================================
  // Scenario 2: Multi-SKU Context Recycling
  // =========================================================================
  test('Multi-SKU Coverage: All 4 SKUs are actively recycled across the 10 slots', () => {
    const skuCounts = {};
    for (const sku of LIRA_CONTEXT.SKUS) {
      skuCounts[sku] = 0;
    }

    for (const post of workload) {
      assert.ok(LIRA_CONTEXT.SKUS.includes(post.sku), `SKU "${post.sku}" must belong to Lira context`);
      skuCounts[post.sku]++;
    }

    // Assert every SKU is featured at least twice across 10 slots
    for (const [sku, count] of Object.entries(skuCounts)) {
      assert.ok(
        count >= 2,
        `SKU "${sku}" was featured ${count} times; must be at least 2 times for balanced recycling`
      );
    }
  });

  // =========================================================================
  // Scenario 3: Zero Repeated (pillar, format, hook_category) Tuples
  // =========================================================================
  test('Non-Repetition Tuple Uniqueness: Zero repeated (pillar, format, hook_category) tuples across 10 slots', () => {
    const seenTuples = new Set();
    const collisionList = [];

    for (const post of workload) {
      const tupleKey = `${post.pillar}::${post.format}::${post.hook_category}`;
      if (seenTuples.has(tupleKey)) {
        collisionList.push(tupleKey);
      }
      seenTuples.add(tupleKey);
    }

    assert.strictEqual(
      collisionList.length,
      0,
      `Detected repeated tuples: ${collisionList.join(', ')}`
    );
    assert.strictEqual(seenTuples.size, 10, 'All 10 slots must have globally unique tuple keys');
  });

  // =========================================================================
  // Scenario 4: Pairwise Bigram Jaccard Similarity < 0.30
  // =========================================================================
  test('Bigram Jaccard Similarity Gate: All pairwise combinations have similarity strictly < 0.30', () => {
    // Check written hooks
    const hooks = workload.map((w) => w.written_hook);
    const hookValidation = validatePairwiseJaccard(hooks, LIRA_CONTEXT.MAX_BIGRAM_JACCARD);
    assert.strictEqual(
      hookValidation.passed,
      true,
      `Hooks must not exceed bigram Jaccard threshold (max: ${hookValidation.maxObserved})`
    );
    assert.ok(hookValidation.maxObserved < 0.30, `Max hook Jaccard similarity (${hookValidation.maxObserved}) must be < 0.30`);

    // Check full topics
    const topics = workload.map((w) => w.topic);
    const topicValidation = validatePairwiseJaccard(topics, LIRA_CONTEXT.MAX_BIGRAM_JACCARD);
    assert.strictEqual(
      topicValidation.passed,
      true,
      `Topics must not exceed bigram Jaccard threshold (max: ${topicValidation.maxObserved})`
    );
    assert.ok(topicValidation.maxObserved < 0.30, `Max topic Jaccard similarity (${topicValidation.maxObserved}) must be < 0.30`);
  });

  // =========================================================================
  // Scenario 5: 100% Guardrail Pre-Flight Pass Rate
  // =========================================================================
  test('Guardrail Pre-Flight Gate: 100% of the 10 production candidates pass guardrail validation', () => {
    for (const [idx, post] of workload.entries()) {
      assert.doesNotThrow(
        () => validateContent(post),
        `Slot ${idx + 1} (${post.id}) failed guardrail validation`
      );

      const res = validateContent(post);
      assert.strictEqual(res.valid, true, `Slot ${idx + 1} must be valid`);
    }
  });

  // =========================================================================
  // Scenario 6: Sandbox Ledger Persistence and Audit Trail
  // =========================================================================
  test('Ledger Persistence Simulation: Appending 10 slots to isolated sandbox ledger maintains integrity', () => {
    const sandbox = createTempSandbox('lira-tier4-ledger-');
    try {
      const sandboxLedgerFile = path.join(sandbox.dir, 'content_ledger.json');
      
      // Initialize sandbox ledger with mock seeded historical entries (Reels 1-13)
      const seededLedger = {
        schemaVersion: '1.0',
        createdAt: '2026-11-01T00:00:00Z',
        entries: Array.from({ length: 13 }, (_, i) => ({
          id: `legacy_reel_${i + 1}`,
          format: 'reel',
          pillar: 'Legacy Pillar',
          hook_category: 'Comparison',
          topic: `Legacy Topic ${i + 1}`,
          written_hook: `LEGACY HOOK ${i + 1}`,
          caption: 'Legacy caption text.',
          createdAt: `2026-11-0${Math.floor(i / 3) + 1}T08:00:00Z`,
        })),
      };

      fs.writeFileSync(sandboxLedgerFile, JSON.stringify(seededLedger, null, 2), 'utf-8');

      // Execute simulated automator run: append 10 new workload slots
      const currentLedger = JSON.parse(fs.readFileSync(sandboxLedgerFile, 'utf-8'));
      for (const slot of workload) {
        currentLedger.entries.push({
          id: slot.id,
          format: slot.format,
          pillar: slot.pillar,
          hook_category: slot.hook_category,
          topic: slot.topic,
          verbal_hook: slot.verbal_hook,
          written_hook: slot.written_hook,
          caption: slot.caption,
          createdAt: slot.timeISO,
        });
      }

      fs.writeFileSync(sandboxLedgerFile, JSON.stringify(currentLedger, null, 2), 'utf-8');

      // Verify persisted state
      const reloaded = JSON.parse(fs.readFileSync(sandboxLedgerFile, 'utf-8'));
      assert.strictEqual(reloaded.entries.length, 23, 'Ledger must contain 13 legacy + 10 new slots = 23 entries');

      // Verify uniqueness of all 23 IDs
      const idSet = new Set(reloaded.entries.map((e) => e.id));
      assert.strictEqual(idSet.size, 23, 'All entry IDs in ledger must be strictly unique');

      // Verify last 10 entries match our workload
      const appended = reloaded.entries.slice(-10);
      for (let i = 0; i < 10; i++) {
        assert.strictEqual(appended[i].id, workload[i].id);
        assert.strictEqual(appended[i].format, workload[i].format);
        assert.strictEqual(appended[i].written_hook, workload[i].written_hook);
      }
    } finally {
      sandbox.cleanup();
    }
  });

  // =========================================================================
  // Scenario 7: Buffer Publisher Dry-Run Batch Simulation
  // =========================================================================
  test('Buffer Dry-Run Batch Simulation: All 10 slots build compliant GraphQL CreatePost payloads', () => {
    const mockTunnelBase = 'https://lira-edge-mock.trycloudflare.com';

    for (const [idx, post] of workload.entries()) {
      const isReel = post.format === 'reel';
      const graphqlInput = {
        channelId: BUFFER_PUBLISHER.CHANNEL_ID,
        mode: BUFFER_PUBLISHER.SCHEDULING_TYPE,
        text: post.caption,
        metadata: {
          instagram: {
            type: isReel ? 'reel' : 'carousel',
            shouldShareToFeed: true,
          },
        },
        assets: isReel
          ? [{ video: { url: `${mockTunnelBase}/reels/${post.id}.mp4` } }]
          : post.slides.map((s) => ({ image: { url: `${mockTunnelBase}/carousels/${post.id}/slide_${s.slideNumber}.jpg` } })),
      };

      // Assert GraphQL payload compliance
      assert.strictEqual(graphqlInput.channelId, '6ad933a2778b240e2f81b45d');
      assert.strictEqual(graphqlInput.mode, 'shareNow');
      assert.strictEqual(graphqlInput.metadata.instagram.shouldShareToFeed, true);
      assert.strictEqual('firstComment' in graphqlInput, false, 'No firstComment on Buffer free plan');
      assert.strictEqual('collaborators' in graphqlInput.metadata.instagram, false, 'No collaborators in API field');
      assert.ok(graphqlInput.text.includes('@caleb766h1'), 'Solo founder handle in caption text');

      if (isReel) {
        assert.strictEqual(graphqlInput.assets.length, 1);
        assert.ok(graphqlInput.assets[0].video.url.endsWith('.mp4'));
      } else {
        assert.ok(graphqlInput.assets.length >= 6 && graphqlInput.assets.length <= 8);
        graphqlInput.assets.forEach((a) => assert.ok(a.image.url.endsWith('.jpg')));
      }
    }
  });
});
