/**
 * Tier 5 Adversarial Test Suite: Guardrail Validator Stress & Fuzzing Suite
 * Authoritative source: ORIGINAL_REQUEST.md §R4 & PROJECT.md
 * 
 * Conducts exhaustive boundary stress and negative fuzz testing across:
 * 1. Numeric Scarcity vs Allowed Multi-Packs / Ranges (False-Positive & False-Negative Boundary)
 * 2. Conceptual Stevia vs Exact Droplet / Metric Dosages
 * 3. Private School & Institution Name Obfuscation
 * 4. Internal Financials, Margins & Capital Reserves
 * 5. Banned Suppliers & Commercial Marketing Claims
 * 6. Unicode Emoji Penetration across Nested Payloads
 * 7. Structural Fuzzing (Corrupted objects, nulls, array variants)
 */

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '../..');
const guardrails = require(path.join(PROJECT_ROOT, 'scripts/validate_guardrails.js'));

describe('Tier 5 Adversarial: Guardrail Validator Stress & Negative Fuzzing', () => {

  // =========================================================================
  // 1. Numeric Scarcity Boundary Stress
  // =========================================================================
  describe('1. Numeric Scarcity Boundary Stress', () => {
    const maliciousBottleCounts = [
      'Hanya ada 42 botol minggu ini',
      'Ready 50 botol fresh matcha',
      'Batch terbatas cuma 100 botol saja',
      'Tersisa 1 botol di kulkas',
      'Stok 0 botol saat ini',
      'Tersedia 150 botol siap antar',
      'Ready 500 botol untuk event',
      'Cuma 50 pcs untuk batch Sabtu',
      'Ready 12 bottle fresh brewed',
      'Buruan pesan 42botol saja',
      'BATCH INI READY 50 BOTOL',
      'Sisa 25 botol di chiller',
    ];

    for (const text of maliciousBottleCounts) {
      test(`Rejects exact count: "${text}"`, () => {
        assert.throws(
          () => guardrails.validateContent({ caption: text }),
          (err) => err instanceof guardrails.GuardrailError && err.violations.some(v => v.rule === 'NUMERIC_SCARCITY')
        );
      });
    }

    const validScarcityTexts = [
      'Limited batch available untuk Sabtu ini lewat bio',
      'Stok terbatas setiap batch fresh brew',
      'Batch terbatas diseduh fresh solo founder',
      'Amankan 4-Pack Vault favorit lo',
      'Paket hemat 6-Pack buat stok seminggu',
      'Bawa 3–4 botol buat temen kantor',
      'Bawa 3-4 botol buat temen kuliah',
      'Harga hemat cuma Rp88.000 per bundle',
      'Mulai jam 03:30 AM sebelum kelas dimulai',
      'Botol segel 180 derajat anti tumpah ke laptop',
      'Modal awal cuma Rp34.000 waktu umur 15 tahun',
      'Kenapa matcha kafe 50k bikin otak ngantuk jam 2 siang',
      'Jumat 18:00 WIB slot pemesanan dibuka',
    ];

    for (const text of validScarcityTexts) {
      test(`Allows compliant non-numeric scarcity / permitted numbers: "${text}"`, () => {
        assert.doesNotThrow(() => guardrails.validateContent({ caption: text }));
      });
    }
  });

  // =========================================================================
  // 2. Conceptual Stevia vs Exact Dosage Stress
  // =========================================================================
  describe('2. Conceptual Stevia vs Exact Dosage Stress', () => {
    const maliciousSteviaDosages = [
      'Kami gunakan tepat 2 tetes stevia per botol',
      'Diformulasikan dengan 1 tetes stevia murni',
      'Cuma butuh 5 tetes stevia untuk rasa manis pas',
      'Diseduh dengan dua tetes ekstrak murni',
      'Tambahkan tiga tetes stevia',
      'Satu tetes stevia sudah cukup manis',
      'Mengandung 5ml stevia cair',
      'Kandungan 3 gram daun stevia kering',
      'Dosis 2g stevia per serving',
      'Ekstrak 0.5 ml daun stevia alami',
      'Resep rahasia: 2 tetes daun stevia',
    ];

    for (const text of maliciousSteviaDosages) {
      test(`Rejects exact stevia dosage: "${text}"`, () => {
        assert.throws(
          () => guardrails.validateContent({ caption: text }),
          (err) => err instanceof guardrails.GuardrailError && err.violations.some(v => v.rule === 'EXACT_STEVIA_DOSAGE')
        );
      });
    }

    const validSteviaTexts = [
      'Pemanis alami stevia tanpa kalori dan tanpa crash',
      'Menggunakan ekstrak daun stevia murni',
      'Natural stevia drops untuk manis yang bersih',
      'Zero gula pasir, zero crash jam 2 siang',
      'Pemanis alami daun stevia yang ramah gula darah',
    ];

    for (const text of validSteviaTexts) {
      test(`Allows conceptual stevia: "${text}"`, () => {
        assert.doesNotThrow(() => guardrails.validateContent({ caption: text }));
      });
    }
  });

  // =========================================================================
  // 3. Private School & Institution Name Obfuscation
  // =========================================================================
  describe('3. Private School & Institution Name Obfuscation', () => {
    const maliciousSchoolTexts = [
      'Paling laku dipesan anak-anak UPH',
      'Banyak mahasiswa UPHC yang repeat order',
      'Pertama kali dijual ke temen UPH College',
      'Dulu belajar masak di Baranangsiang',
      'Alumni SMK Baranangsiang pasti tau rasanya',
      'Waktu sekolah di Barsih kelas 10',
      'uph college kantin favorit',
      'barsih bogor tempat tes resep',
    ];

    for (const text of maliciousSchoolTexts) {
      test(`Rejects private school leak: "${text}"`, () => {
        assert.throws(
          () => guardrails.validateContent({ caption: text }),
          (err) => err instanceof guardrails.GuardrailError && err.violations.some(v => v.rule === 'PRIVATE_SCHOOL_NAME')
        );
      });
    }

    const validSchoolTexts = [
      'Gue mulai resep ini di sekolah kuliner waktu kelas 10',
      'Restock chiller kampus sebelum jam pelajaran dimulai',
      'Cocok buat nemenin marathon skripsi di perpustakaan',
      'Kantin kampus selalu kehabisan botol dingin',
    ];

    for (const text of validSchoolTexts) {
      test(`Allows generic educational context: "${text}"`, () => {
        assert.doesNotThrow(() => guardrails.validateContent({ caption: text }));
      });
    }
  });

  // =========================================================================
  // 4. Financial Leaks & Internal Capital Figures
  // =========================================================================
  describe('4. Financial Leaks & Internal Capital Figures', () => {
    const maliciousFinancialTexts = [
      'Dengan HPP yang rendah kita bisa efisien',
      'Perhitungan COGS per botol sangat terjaga',
      'Margin keuntungan kita mencapai margin 74%',
      'Margin kotor sebesar 74% dipotong operasional',
      'Fee kurir kita potong 20% fee dari total',
      'Alokasi War Chest sebesar Rp500M buat ekspansi',
      'Dana darurat 500M untuk cold chain',
      'Target cadangan CapEx Reserve sebesar Rp21M',
      'Total modal awal 21M dari tabungan',
      'Sisa kas operasional Rp8.6M bulan ini',
      'Cadangan 8.6M untuk stok bahan baku',
      'Persentase margin 66% setelah pajak',
    ];

    for (const text of maliciousFinancialTexts) {
      test(`Rejects financial leak: "${text}"`, () => {
        assert.throws(
          () => guardrails.validateContent({ caption: text }),
          (err) => err instanceof guardrails.GuardrailError && err.violations.some(v => v.rule === 'FINANCIAL_LEAK')
        );
      });
    }
  });

  // =========================================================================
  // 5. Banned Terms & Suppliers
  // =========================================================================
  describe('5. Banned Terms & Suppliers', () => {
    const maliciousBannedTerms = [
      'Kami gunakan 100% ceremonial matcha impor Jepang',
      'Ceremonial grade pilihan dari perkebunan Kyoto',
      'CEREMONIAL MATCHA kualitas tertinggi',
      'Bukan bubuk curah dari supplier WithUs',
      'Kerjasama bareng agensi withus untuk promosi',
      'Bahan bukan dari distributor JBD',
      'Bukan sirup dari Jakarta Bubble Drink',
    ];

    for (const text of maliciousBannedTerms) {
      test(`Rejects banned commercial term: "${text}"`, () => {
        assert.throws(
          () => guardrails.validateContent({ caption: text }),
          (err) => err instanceof guardrails.GuardrailError && err.violations.some(v => v.rule === 'BANNED_TERMS')
        );
      });
    }

    const validProductClaims = [
      'Pure Japanese premium matcha grade tinggi',
      'Teh hijau otentik Jepang pilihan',
      'Artisan matcha dengan profil rasa umami alami',
    ];

    for (const text of validProductClaims) {
      test(`Allows compliant matcha product claims: "${text}"`, () => {
        assert.doesNotThrow(() => guardrails.validateContent({ caption: text }));
      });
    }
  });

  // =========================================================================
  // 6. Unicode Emoji Penetration across Deep Nested Payloads
  // =========================================================================
  describe('6. Unicode Emoji Penetration across Deep Nested Payloads', () => {
    const emojiList = ['🍵', '✨', '🔥', '🚀', '🥤', '💚', '📦', '🌿', '💯', '⚠️', '👨‍💻'];

    for (const emoji of emojiList) {
      test(`Rejects emoji "${emoji}" in caption`, () => {
        assert.throws(
          () => guardrails.validateContent({ caption: `Matcha dingin ${emoji} siap antar` }),
          (err) => err instanceof guardrails.GuardrailError && err.violations.some(v => v.rule === 'EMOJI_DETECTED')
        );
      });

      test(`Rejects emoji "${emoji}" in verbal_hook`, () => {
        assert.throws(
          () => guardrails.validateContent({ verbal_hook: `Pernah gak lo ${emoji} ngantuk jam 2 siang?` }),
          (err) => err instanceof guardrails.GuardrailError && err.violations.some(v => v.rule === 'EMOJI_DETECTED')
        );
      });

      test(`Rejects emoji "${emoji}" in overlays array`, () => {
        assert.throws(
          () => guardrails.validateContent({ overlays: [{ text: `ALERT ${emoji}` }] }),
          (err) => err instanceof guardrails.GuardrailError && err.violations.some(v => v.rule === 'EMOJI_DETECTED')
        );
      });

      test(`Rejects emoji "${emoji}" in carousel slides headline`, () => {
        assert.throws(
          () => guardrails.validateContent({
            slides: [{ slideNumber: 1, headline: `STOP CRASH ${emoji}`, type: 'hook' }]
          }),
          (err) => err instanceof guardrails.GuardrailError && err.violations.some(v => v.rule === 'EMOJI_DETECTED')
        );
      });
    }
  });

  // =========================================================================
  // 7. Structural Fuzzing & Boundary Inputs
  // =========================================================================
  describe('7. Structural Fuzzing & Boundary Inputs', () => {
    test('String input is automatically converted to script payload and validated', () => {
      assert.doesNotThrow(() => guardrails.validateContent('Valid Indonesian caption string @caleb766h1'));

      assert.throws(
        () => guardrails.validateContent('Beli 42 botol sekarang'),
        (err) => err instanceof guardrails.GuardrailError
      );
    });

    test('Null or non-object payload throws GuardrailError gracefully', () => {
      assert.throws(
        () => guardrails.validateContent(null),
        (err) => err instanceof guardrails.GuardrailError
      );
      assert.throws(
        () => guardrails.validateContent(undefined),
        (err) => err instanceof guardrails.GuardrailError
      );
    });

    test('Empty object payload passes without error', () => {
      const res = guardrails.validateContent({});
      assert.strictEqual(res.valid, true);
    });

    test('Overlays array with mixed string and object elements is scanned cleanly', () => {
      const payload = {
        overlays: [
          'Valid string overlay',
          { text: 'Valid object overlay' },
          { text: 'Leaked 50 botol overlay' },
        ],
      };
      assert.throws(
        () => guardrails.validateContent(payload),
        (err) => err instanceof guardrails.GuardrailError && err.violations.some(v => v.field === 'overlays[2]')
      );
    });

    test('checkContentSafe returns soft validation result object without throwing', () => {
      const safeResult = guardrails.checkContentSafe({ caption: 'Valid clean caption' });
      assert.strictEqual(safeResult.valid, true);
      assert.strictEqual(safeResult.violations.length, 0);

      const unsafeResult = guardrails.checkContentSafe({ caption: 'Beli 42 botol di UPH' });
      assert.strictEqual(unsafeResult.valid, false);
      assert.strictEqual(unsafeResult.violations.length, 2);
      assert.ok(unsafeResult.violations.some(v => v.rule === 'NUMERIC_SCARCITY'));
      assert.ok(unsafeResult.violations.some(v => v.rule === 'PRIVATE_SCHOOL_NAME'));
    });
  });
});
