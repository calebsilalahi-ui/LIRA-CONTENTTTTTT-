/**
 * Canonical Sample Carousel Deck Data (8 Slides)
 * Fully compliant with:
 * - Slide 1 Hook <= 8 words
 * - Slide 2 Standalone Re-serve Hook <= 12 words & semantically independent
 * - Progressive Middle Slides (Mechanism, Contrast, Deep Dive)
 * - Penultimate High-Save Comparison Sheet with comparisonRows
 * - Closing Action CTA with Saturday Gojek COD Loop & non-numeric qualitative scarcity
 * - Strict guardrails: Zero leaks, zero exact bottle counts, zero emojis
 */

import { CarouselDeckData } from './carouselTypes';

export const SAMPLE_STEVIA_CAROUSEL_DECK: CarouselDeckData = {
  id: 'carousel_stevia_science_8slides',
  title: 'Anatomi Sugar Crash vs Clean Focus',
  pillar: 'Sugar Crash & Stevia Science',
  hookCategory: 'Educational',
  theme: 'emerald',
  slides: [
    {
      slideNumber: 1,
      type: 'hook',
      headline: 'ANATOMI SUGAR CRASH VS CLEAN FOCUS', // 6 words (<= 8 words)
      subhead: 'Kenapa matcha kafe biasa bikin lemas di jam 2 siang?',
      categoryTag: 'SAINS METABOLISME',
      badgeText: 'EDITORIAL BREAKDOWN',
      bottleVariant: 'matcha',
      swipePrompt: 'GESER UNTUK BREAKDOWN SAINS',
    },
    {
      slideNumber: 2,
      type: 'reserve_hook',
      headline: 'DUA JAM SETELAH MINUM GULA CAIR DARAH LO DROP', // 9 words (<= 12 words, 100% standalone)
      subhead: 'Reaksi biologis tubuh saat menerima lonjakan glukosa tinggi dari sirup komersial kafe.',
      categoryTag: 'ALGORITMA RE-SERVE',
      badgeText: 'REAKSI BIOLOGIS',
      bottleVariant: 'matcha',
      keyPoints: [
        'Gula cair instan diserap lambung dalam hitungan menit',
        'Pankreas dipaksa memompa insulin dalam jumlah masif',
        'Gula darah anjlok drastis memicu rasa lelah dan kantuk berat',
      ],
      swipePrompt: 'PELAJARI MEKANISME LENGKAPNYA',
    },
    {
      slideNumber: 3,
      type: 'body',
      headline: 'MEKANISME INSULIN SPIKE PADA GULA CAIR',
      subhead: 'Perbedaan mendasar pemrosesan sirup fruktosa versus energi stabil.',
      categoryTag: 'MEKANISME TUBUH',
      badgeText: 'FAKTA KLINIS',
      keyPoints: [
        'Sirup komersial mengandung fruktosa cair berdensitas tinggi',
        'Reseptor adenosin di otak terblokir sementara lalu memicu kelelahan rebound',
        'Solusinya bukan tambah kafein, tapi eliminasi gula perusak fokus',
      ],
      bodyText: 'Ketika lo minum minuman manis kafe, lo meminjam energi dari masa depan dengan bunga kelelahan ekstrem dua jam berikutnya.',
      swipePrompt: 'LIHAT ALTERNATIF ALAMI',
    },
    {
      slideNumber: 4,
      type: 'body',
      headline: 'SOLUSI ALAMI: DAUN STEVIA MURNI',
      subhead: 'Pemanis alami nol kalori yang tidak memicu lonjakan glukosa darah.',
      categoryTag: 'BAHAN BAKU',
      badgeText: 'KEMURNIAN BAHAN',
      bottleVariant: 'matcha',
      keyPoints: [
        'Ekstrak daun stevia murni dengan glikosida alami berkualitas tinggi',
        'Indeks glikemik nol: tubuh tidak memproduksi lonjakan insulin',
        'Rasa manis bersih yang tidak meninggalkan rasa lengket di tenggorokan',
      ],
      bodyText: 'Lira memadukan pure Japanese green tea dengan barista oat milk dan sentuhan pemanis alami stevia untuk menjaga kurva energi tetap konstan.',
      swipePrompt: 'CEK RASIO FOKUS 6 JAM',
    },
    {
      slideNumber: 5,
      type: 'body',
      headline: 'L-THEANINE & CAFFEINE RATIO FORMULA',
      subhead: 'Sinergi asam amino hijau Jepang untuk fokus tenang tanpa tremor.',
      categoryTag: 'FORMULA ENERGI',
      badgeText: 'SINERGI BIOAKTIF',
      keyPoints: [
        'L-Theanine menembus sawar darah-otak untuk merangsang gelombang alfa',
        'Pelepasan kafein alami secara bertahap selama 6 jam penuh',
        'Bebas dari debar jantung berlebih yang sering muncul dari kopi susu',
      ],
      metricCards: [
        { label: 'DURASI FOKUS', value: '6 JAM', subtext: 'Energi tenang berkelanjutan' },
        { label: 'GLIKEMIK INDEKS', value: '0', subtext: 'Tanpa lonjakan insulin' },
        { label: 'GULA PASIR', value: '0 GRAM', subtext: 'Pemanis alami stevia' },
      ],
      swipePrompt: 'SIMPAN TABEL KOMPARASI',
    },
    {
      slideNumber: 6,
      type: 'high_save',
      headline: 'CHEATSHEET: PANDUAN FOCUS 6 JAM TANPA CRASH',
      subhead: 'Tabel perbandingan objektif minuman kafe umum vs botol dingin Lira.',
      categoryTag: 'CHEAT SHEET',
      badgeText: 'BOOKMARK REFERENCE',
      bottleVariant: 'matcha',
      comparisonRows: [
        { feature: 'Resep Pemanis', cafe: 'Gula Cair Murah', lira: 'Pemanis Alami Stevia' },
        { feature: 'Mobilitas', cafe: 'Bocor & Basah', lira: '180° Anti Bocor' },
        { feature: 'Energy Profile', cafe: 'Crash 2 Jam', lira: 'Fokus Bersih 6 Jam' },
        { feature: 'Kondisi Suhu', cafe: 'Es Meleleh Hambar', lira: 'Chilled Fresh Sealed' },
      ],
      bodyText: 'Simpan postingan ini di koleksi Instagram lo sebagai panduan referensi memilih minuman kerja harian.',
      swipePrompt: 'CARA AMANKAN BATCH',
    },
    {
      slideNumber: 7,
      type: 'routine',
      headline: 'TRANSPARANSI PROSES: SEDUH DINGIN 03:30',
      subhead: 'Standar sanitasi ketat dan ekstraksi lambat sebelum fajar menyingsing.',
      categoryTag: 'CRAFTSMANSHIP',
      badgeText: 'DAPUR PRODUKSI',
      bottleVariant: 'matcha',
      keyPoints: [
        'Penyeduhan batch dingin dimulai pukul 03:30 pagi setiap jadwal produksi',
        'Sterilisasi botol food-grade dengan seal kedap udara',
        'Penyimpanan instan dalam chiller suhu presisi sebelum pengiriman',
      ],
      bodyText: 'Setiap botol diracik solo founder dengan perhatian penuh pada higienitas, tanpa pengawet sintetis dan tanpa sirup komersial.',
      swipePrompt: 'CARA PRE-ORDER SABTU',
    },
    {
      slideNumber: 8,
      type: 'cta',
      headline: 'LIMITED BATCH SABTU: CARA AMANKAN BOTTLE LO',
      subhead: 'Langkah mudah reservasi batch dingin mingguan via kurir Gojek.',
      categoryTag: 'PRE-ORDER RESMI',
      badgeText: 'BATCH MINGGUAN',
      bottleVariant: 'matcha',
      orderSteps: [
        'Klik tautan pre-order di profil bio resmi @drinklira',
        'Pilih varian favorit lo: Matcha Oatside, Choco Hazelnut, Milk Tea',
        'Batch dingin diantar hari Sabtu via Gojek dalam thermal bag dingin',
      ],
      bodyText: 'Limited batch tersedia setiap minggu. Amankan jatah botol lo sebelum kuota batch dingin ditutup.',
      swipePrompt: 'TAP LINK DI BIO',
    },
  ],
};

/**
 * 6-Slide Compact Deck Option (Alternative within 6-8 range)
 */
export const SAMPLE_CUP_VS_BOTTLE_6SLIDES: CarouselDeckData = {
  id: 'carousel_cup_vs_bottle_6slides',
  title: 'Sweating Cup vs Sealed Bottle',
  pillar: 'Sweating Cup vs 180 Leakproof Bottle',
  hookCategory: 'Comparison',
  theme: 'cream',
  slides: [
    {
      slideNumber: 1,
      type: 'hook',
      headline: 'KENAPA CUP KAFE 50K SELALU BOCOR', // 6 words (<= 8 words)
      subhead: 'Masalah klasik cup takeaway kafe yang bikin meja kerja basah kuyup.',
      categoryTag: 'KOMPARASI DESK',
      badgeText: 'DESK STRUGGLE',
      bottleVariant: 'milktea',
      swipePrompt: 'GESER UNTUK BUKTI NYATA',
    },
    {
      slideNumber: 2,
      type: 'reserve_hook',
      headline: 'KERTAS KERJA DAN LAPTOP LO TERANCAM TUMPAHAN CUP KAFE', // 9 words (<= 12 words, standalone)
      subhead: 'Kondensasi cup plastik tipis selalu merembes ke keyboard dan dokumen penting.',
      categoryTag: 'STANDALONE HOOK',
      badgeText: 'BAHAYA KONDENSASI',
      bottleVariant: 'milktea',
      swipePrompt: 'LIHAT SOLUSI SEALED',
    },
    {
      slideNumber: 3,
      type: 'body',
      headline: 'KELEMAHAN STRUKTURAL CUP TAKEAWAY PLASTIK',
      subhead: 'Tutup cup tipis mudah terbuka saat terkena guncangan di perjalanan.',
      categoryTag: 'ENGINEERING',
      badgeText: 'ANALISIS FISIK',
      keyPoints: [
        'Tutup plastik presisi rendah tidak memiliki ulir pengunci',
        'Uap es mencair menetes terus menerus menciptakan genangan basah',
        'Es batu mencair melarutkan konsentrasi rasa hingga hambar',
      ],
      swipePrompt: 'UJI BOTOL LIRA 180°',
    },
    {
      slideNumber: 4,
      type: 'body',
      headline: 'DESAIN HERMETIS: 180 DERAJAT ANTI BOCOR',
      subhead: 'Botol PET food-grade dengan tutup gold ulir ganda yang aman dibalik.',
      categoryTag: 'SOLUSI LIRA',
      badgeText: 'LEAKPROOF PROOF',
      bottleVariant: 'matcha',
      keyPoints: [
        'Dapat dimasukkan ke dalam tote bag atau ransel tanpa rasa cemas',
        'Aman dibalik 180 derajat di atas meja kerja',
        'Suhu dingin terjaga optimal tanpa es batu pencair rasa',
      ],
      swipePrompt: 'SIMPAN KOMPARASI LENGKAP',
    },
    {
      slideNumber: 5,
      type: 'high_save',
      headline: 'KOMPARASI: CAFE CUP VS LIRA BOTTLE',
      subhead: 'Tabel pembanding teknis antara cup plastik kafe vs botol sealed Lira.',
      categoryTag: 'PANDUAN LENGKAP',
      badgeText: 'HIGH SAVE CHEATSHEET',
      bottleVariant: 'matcha',
      comparisonRows: [
        { feature: 'Resep Pemanis', cafe: 'Gula Cair Murah', lira: 'Pemanis Alami Stevia' },
        { feature: 'Mobilitas', cafe: 'Bocor & Basah', lira: '180° Anti Bocor' },
        { feature: 'Energy Profile', cafe: 'Crash 2 Jam', lira: 'Fokus Bersih 6 Jam' },
        { feature: 'Ketahanan Suhu', cafe: 'Es Meleleh Cepat', lira: 'Thermal Bag Dingin' },
      ],
      swipePrompt: 'PRE-ORDER HARI INI',
    },
    {
      slideNumber: 6,
      type: 'cta',
      headline: 'LIMITED BATCH SABTU: CARA AMANKAN BOTTLE LO',
      subhead: 'Amankan paket botol dingin lo untuk persiapan fokus produktif.',
      categoryTag: 'ORDER GATEWAY',
      badgeText: 'SLOT TERBATAS',
      bottleVariant: 'matcha',
      orderSteps: [
        'Kunjungi link di profil Instagram @drinklira',
        'Pilih varian rasa (Matcha Oatside, Choco Hazelnut, Milk Tea)',
        'Pengantaran batch Sabtu via kurir Gojek langsung ke alamat lo',
      ],
      bodyText: 'Batch dingin diseduh fresh dengan stok terbatas setiap minggu.',
      swipePrompt: 'KLIK LINK DI BIO',
    },
  ],
};
