#!/usr/bin/env node
/**
 * LIRA AUTONOMOUS VIRAL SCRIPT GENERATION & ASSET DISCOVERY ENGINE
 * 
 * Core Features:
 * 1. 3P High-Retention Hook Engine (Promise, Proof, Path in 0.0s - 3.0s)
 * 2. Retention Multiplier Open Loop: "Dan yang nomor 3, lo lakuin tiap hari tanpa sadar."
 * 3. 4 SKUs Context Recycling (Matcha Oatside, Choco Hazelnut, Signature Milk Tea, Matcha Classic)
 * 4. 7 PBL Viral Hook Taxonomy (Indonesian street-smart & craft-obsessed tone)
 * 5. Founder Starting Age Accuracy: Age 16 (Grade 10/11 culinary vocational school)
 * 6. Beat-by-Beat Asset Analyzer: Extracts visual requirements and flags missing/improvable assets
 * 7. Autonomous Asset Generation Dispatch Interface (image-generator subagents)
 * 8. Mathematical Similarity Gate: Bigram Jaccard < 0.30 against content_ledger.json
 * 9. Pre-flight Guardrail Validation: validate_guardrails.js integration
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const LEDGER_PATH = path.join(PROJECT_ROOT, 'data/content_ledger.json');
const ASSETS_DIR = path.join(PROJECT_ROOT, 'public/assets');

// Import Guardrail Validator
const { validateContent } = require('./validate_guardrails');

// Import Jaccard helpers from automator
const { computeBigramJaccard, tokenize, getWordBigrams } = require('./lira_content_automator');

/**
 * 4 Lira SKUs Metadata & Key Pain Points
 */
const LIRA_SKUS = {
  MATCHA_OATSIDE: {
    name: 'Matcha Oatside',
    liquidColor: 'Emerald Green',
    coreBenefit: 'Zero Sugar Crash & 4-Hour Alpha Focus',
    ingredients: 'Pure Japanese Matcha, Barista Oat Milk, Natural Stevia Drops',
    painPoint: '2:00 PM Afternoon Sugar Crash & Brain Fog from cafe drinks',
    realAsset: 'bottles_ssot/matcha_ssot.png',
  },
  CHOCO_HAZELNUT: {
    name: 'Choco Hazelnut',
    liquidColor: 'Velvety Dark Cocoa',
    coreBenefit: 'Clean Theobromine Energy & Zero Throat Stickiness',
    ingredients: 'Raw Dark Cocoa Blend, Cold-Pressed Hazelnut Extract, Stevia',
    painPoint: 'Heavy stomach and sticky throat from condensed milk syrups',
    realAsset: 'bottles_ssot/choco_ssot.png',
  },
  SIGNATURE_MILK_TEA: {
    name: 'Signature Milk Tea',
    liquidColor: 'Silky Caramel Tan',
    coreBenefit: '16-Hour Cold-Steeped Antioxidants without Bitterness',
    ingredients: 'Ceylon Tea Leaves, Evaporated Milk Emulsion, Stevia',
    painPoint: 'Syrupy 450-calorie boba sugar bomb fatigue',
    realAsset: 'bottles_ssot/milktea_ssot.png',
  },
  MATCHA_CLASSIC: {
    name: 'Matcha Classic',
    liquidColor: 'Pure Deep Green',
    coreBenefit: 'Authentic First-Harvest Umami Clarity',
    ingredients: 'Pure Japanese Green Tea, Water, Subtle Stevia Balance',
    painPoint: 'The myth that real matcha must taste burnt, harsh, and bitter',
    realAsset: 'bottles_ssot/matcha_ssot.png',
  },
};

/**
 * 7 PBL Hook Archetypes with 3P Framework & Open-Loop Retention Multipliers
 */
const SCRIPT_TEMPLATES = [
  {
    category: 'Somatic Science',
    pillar: 'Sugar Crash & Stevia Science',
    skuKey: 'MATCHA_OATSIDE',
    promise: 'Stop the 2:00 PM afternoon sugar crash and unlock 4 hours of clean focus',
    proof: 'Blood sugar glycemic index data & natural stevia receptor kinetics tested since age 16',
    path: 'Switching from refined cafe syrups to pure matcha emulsified with stevia',
    verbalHookTemplate: 'Ini 3 tanda tubuh lo udah kecanduan gula tersembunyi dari matcha kafe lima puluh ribu. Dan yang nomor tiga, lo minum tiap jam dua siang tanpa sadar.',
    writtenHook: '3 TANDA GULA KAFE MERUSAK FOKUS LO',
    beat2Agitation: 'Pas jam dua siang kepala lo mendadak berat dan lemes, itu bukan karena lo kurang tidur. Sirup jagung kafe bikin insulin lo melonjak tajam, lalu nge-drop drastis ke titik nol.',
    beat3Proof: 'Liat bedanya sama botol Lira ini. Diseduh dingin tanpa sesendok pun gula pasir, cuma pakai ekstrak daun stevia murni yang nol glikemik.',
    beat4Craft: 'Gue whisk daun matcha pilihan langsung bareng oat milk barista. Rasa manisnya bersih, energi stabil empat jam tanpa ada rasa lemes.',
    beat5Logistics: 'Setiap botol meluncur dalam cooler bag thermal forest green berinsulasi aluminium foil biar suhunya kekunci dingin dua sampai empat derajat celsius pas Gojek COD Sabtu siang.',
    beat6CTA: 'Limited batch diseduh fresh weekend ini. Amankan botol dingin lo sekarang via link di bio sebelum kehabisan.',
    loopBackCloser: 'Makanya jangan heran kalau lo ngerasain...',
    requiredAssets: [
      { name: 'CenterHookModal', path: 'src/Reel16_WorkingStyleRevamp.tsx', type: 'code_component' },
      { name: 'SteviaScienceVisual', path: 'public/assets/pixel/stevia_vs_sugar_science.png', type: 'pixel_art' },
      { name: 'MatchaRealBottle', path: 'public/assets/bottles_ssot/matcha_ssot.png', type: 'ssot_cutout' },
      { name: 'ChasenWhiskAsset', path: 'public/assets/pixel/tools/chasen_whisk.png', type: 'pixel_art' },
      { name: 'ForestCoolerBag', path: 'public/assets/pixel/tutorial/cooler_bag_cutout.png', type: 'pixel_art' },
    ],
  },
  {
    category: 'Polarizing Comparison',
    pillar: 'Craftsmanship & Student Lifestyle',
    skuKey: 'MATCHA_OATSIDE',
    promise: 'Never ruin your study desk or waste Rp50.000 on watery melted ice again',
    proof: '180-degree inverted bottle stress test directly over an active MacBook keyboard',
    path: 'Replacing sweating flimsy plastic takeout cups with an industrial double-sealed PET bottle',
    verbalHookTemplate: '3 alasan kenapa beli minuman cup plastik kafe lima puluh ribu itu buang-buang duit. Dan alasan nomor tiga, berisiko bikin laptop lo konslet.',
    writtenHook: '3 ALASAN CUP 50K BUANG DUIT',
    beat2Agitation: 'Baru lima belas menit ditaruh di meja belajar, es batunya udah mencair jadi air tawar dingin. Catatan tugas basah kuyup, dan cup-nya gak bisa lo masukin tas ransel.',
    beat3Proof: 'Bandingin sama botol Lira ini. Segel tutup ganda presisi, mau lo balik seratus delapan puluh derajat di atas keyboard MacBook pun gak bakal netes satu tetes pun.',
    beat4Craft: 'Gue rancang botol ini dari pengalaman sendiri waktu umur 16 tahun sering tumpah di tas. Botol ramping, kedap udara, dinginnya tahan seharian.',
    beat5Logistics: 'Diantar rute COD Sabtu pakai tas thermal hijau forest Lira berinsulasi tebal, sampai ke tangan lo dalam kondisi super fresh.',
    beat6CTA: 'Stok terbatas setiap rilis batch mingguan. Klik link di bio buat amanin kuota botol lo sekarang.',
    loopBackCloser: 'Biar lo gak perlu ngalamin lagi...',
    requiredAssets: [
      { name: 'MeltedIceMacro', path: 'public/assets/pixel/carousel_melted_ice.png', type: 'pixel_art' },
      { name: 'InvertedBottleScene', path: 'public/assets/pixel/cup_struggle/s3_inverted_a.png', type: 'pixel_art' },
      { name: 'CalebFounderDesk', path: 'public/assets/pixel/scene_5_laptop_a.jpg', type: 'pixel_art' },
      { name: 'ForestCoolerBag', path: 'public/assets/pixel/tutorial/cooler_bag_cutout.png', type: 'pixel_art' },
    ],
  },
  {
    category: 'Myth Busting',
    pillar: 'Indie Game & Pixel Culture',
    skuKey: 'MATCHA_CLASSIC',
    promise: 'Taste real authentic Japanese green tea umami without choking on burnt bitterness',
    proof: 'First-harvest tea chemistry vs commercial low-grade culinary powder exposed',
    path: 'Micro-whisking pure green tea without artificial flavorings or corn syrups',
    verbalHookTemplate: '3 mitos matcha kafe yang bikin lo salah paham bertahun-tahun. Dan mitos nomor tiga, bikin lo bayar mahal cuma buat sirup jagung kental manis.',
    writtenHook: '3 KEBOHONGAN MATCHA KAFE MALL',
    beat2Agitation: 'Banyak yang mikir matcha asli Jepang itu wajib pahit pekat sampai bikin mual. Padahal rasa pahit gosong itu tanda daun tua kualitas rendah yang ditutup gula cair empat pump.',
    beat3Proof: 'Matcha otentik yang bener punya karakter umami yang gurih dan manis alami di ujung lidah. Lira Classic gak butuh pengawet kimia buat buktiin rasanya.',
    beat4Craft: 'Tiap porsi gue seduh manual pakai takaran presisi dan chasen bambu mikro, disaring halus biar teksturnya selembut sutra di tenggorokan.',
    beat5Logistics: 'Disimpan di chiller dingin khusus dan dikirim via cooler bag berinsulasi foil hijau forest pas rute Sabtu.',
    beat6CTA: 'Limited batch ready buat weekend ini. Order langsung lewat tautan di bio sebelum slot ditutup.',
    loopBackCloser: 'Pahami faktanya sekarang, karena...',
    requiredAssets: [
      { name: 'ChasenWhiskAsset', path: 'public/assets/pixel/tools/chasen_whisk.png', type: 'pixel_art' },
      { name: 'MatchaRealBottle', path: 'public/assets/bottles_ssot/matcha_ssot.png', type: 'ssot_cutout' },
      { name: 'CalebBlenderKitchen', path: 'public/assets/pixel/caleb_blender_kitchen.png', type: 'pixel_art' },
      { name: 'ForestCoolerBag', path: 'public/assets/pixel/tutorial/cooler_bag_cutout.png', type: 'pixel_art' },
    ],
  },
  {
    category: 'Storytelling & Bootstrap',
    pillar: 'Craftsmanship & Student Lifestyle',
    skuKey: 'CHOCO_HAZELNUT',
    promise: 'How a student-crafted bottle beat commercial sugary cafe drinks with zero shortcuts',
    proof: 'Solo-brewing daily in a home kitchen since age 16 starting with Rp34.000',
    path: 'Raw dark cocoa cold extraction combined with pure stevia',
    verbalHookTemplate: '3 hal gila yang gue pelajarin waktu mulai brand minuman ini di umur 16 tahun. Dan yang nomor tiga, bikin temen-temen sekolah gue gak nyangka.',
    writtenHook: 'MULAI DARI UMUR 16 TAHUN',
    beat2Agitation: 'Waktu awal mulai dari modal tiga puluh empat ribu, gue kesel liat minuman cokelat botolan di pasaran isinya cuma air, perisa buatan, sama tumpukan gula rafinasi.',
    beat3Proof: 'Gue putusin buat racik Choco Hazelnut sendiri: perpaduan raw dark cocoa murni sama ekstrak hazelnut panggang. Gak bikin seret dan energinya tahan lama.',
    beat4Craft: 'Dari nyuci botol steril sampai nempel segel kedap udara, semua gue kerjain sendiri di dapur rumah dengan standar higienis tanpa kompromi.',
    beat5Logistics: 'Biar kualitas tetep prima, pengiriman kita kumpulin satu rute tiap Sabtu pakai cooler bag berinsulasi dingin.',
    beat6CTA: 'Stok terbatas tiap minggu. Cobain botol dingin artisan ini lewat link bio sekarang.',
    loopBackCloser: 'Semua dimulai dari satu hal...',
    requiredAssets: [
      { name: 'CalebCharacterTurnaround', path: 'public/assets/pixel/character/caleb_character_turnaround.png', type: 'pixel_art' },
      { name: 'ChocoRealBottle', path: 'public/assets/bottles_ssot/choco_ssot.png', type: 'ssot_cutout' },
      { name: 'CalebInspectBottle', path: 'public/assets/pixel/caleb_action_seq/f1_inspect.jpg', type: 'pixel_art' },
      { name: 'ForestCoolerBag', path: 'public/assets/pixel/tutorial/cooler_bag_cutout.png', type: 'pixel_art' },
    ],
  },
  {
    category: 'Pattern Interrupt',
    pillar: 'Cold Chain & Saturday COD Loop',
    skuKey: 'SIGNATURE_MILK_TEA',
    promise: 'Extreme proof that high-grade cold-craft doesn’t spill, leak, or go stale',
    proof: '180-degree upside-down suspension and aggressive shake tests',
    path: '16-hour Ceylon cold steeping inside commercial leakproof PET bottles',
    verbalHookTemplate: '3 tes ekstrem buat buktiin botol minuman beneran anti-bocor di jalanan. Dan tes nomor tiga, gue lakuin persis di atas MacBook yang lagi nyala.',
    writtenHook: '3 UJI KETAHANAN SEGEL MACBOOK',
    beat2Agitation: 'Lo pernah bawa cup minuman di motor atau mobil, terus tiba-tiba tutupnya copot dan tumpah ke tas atau jok? Itu mimpi buruk paling nyebelin.',
    beat3Proof: 'Botol Lira Signature Milk Tea ini diuji guncang di dashboard motor selama tiga puluh menit. Nol bocor, nol rembes, segel tetep rapat sempurna.',
    beat4Craft: 'Dalemnya bukan teh instan sachet, tapi daun teh ceylon pilihan yang di-cold-steep selama 16 jam penuh buat dapetin aroma teh legit tanpa rasa sepat.',
    beat5Logistics: 'Siap meluncur tiap Sabtu siang langsung ke depan pager rumah lo bareng Gojek dan cooler bag thermal forest green.',
    beat6CTA: 'Limited batch rilis Sabtu ini. Amankan jatah botol lo sekarang di link bio.',
    loopBackCloser: 'Inilah hasil dari...',
    requiredAssets: [
      { name: 'InvertedBottleScene', path: 'public/assets/pixel/cup_struggle/s3_inverted_a.png', type: 'pixel_art' },
      { name: 'MilkteaRealBottle', path: 'public/assets/bottles_ssot/milktea_ssot.png', type: 'ssot_cutout' },
      { name: 'GojekGateScene', path: 'public/assets/pixel/tutorial/s4_gojek_a.jpg', type: 'pixel_art' },
      { name: 'ForestCoolerBag', path: 'public/assets/pixel/tutorial/cooler_bag_cutout.png', type: 'pixel_art' },
    ],
  },
  {
    category: 'Authority / Exposé',
    pillar: 'Sugar Crash & Stevia Science',
    skuKey: 'MATCHA_OATSIDE',
    promise: 'The unvarnished truth about commercial cafe beverage labels and industrial syrups',
    proof: '0g refined sugar contrast and clean label formula',
    path: 'Learning to decode commercial beverage labels and choosing whole-food cold-brew',
    verbalHookTemplate: '3 rahasia kotor industri minuman kafe mall yang gak bakal dibongkar ke lo. Dan rahasia nomor tiga, lo konsumsi tiap hari tanpa lo sadari.',
    writtenHook: '3 RAHASIA GELAP MINUMAN BOTOL',
    beat2Agitation: 'Banyak brand botolan ngeklaim sehat, tapi pas lo balik botolnya, bahan pertamanya sirup fruktosa dan pengawet buatan biar tahan enam bulan di rak toko.',
    beat3Proof: 'Di Lira, prinsip kita jelas: kalau bahan itu gak berani gue minum sendiri tiap hari, haram hukumnya masuk ke botol lo. Nol pengawet sintetis, nol gula pasir.',
    beat4Craft: 'Kita cuma pakai tiga komponen jujur: matcha Jepang asli, susu gandum barista, dan tetesan stevia murni. Bersih, otentik, dan beneran berkhasiat.',
    beat5Logistics: 'Karena tanpa bahan kimia pengawet, botol wajib selalu dingin dan cuma kita lepas pas fresh batch mingguan.',
    beat6CTA: 'Fresh batch terbatas siap kirim weekend ini. Amankan slot pesanan lo lewat bio.',
    loopBackCloser: 'Biar lo paham kenapa...',
    requiredAssets: [
      { name: 'SteviaScienceVisual', path: 'public/assets/pixel/stevia_vs_sugar_science.png', type: 'pixel_art' },
      { name: 'MatchaRealBottle', path: 'public/assets/bottles_ssot/matcha_ssot.png', type: 'ssot_cutout' },
      { name: 'CalebFounderDesk', path: 'public/assets/pixel/scene_5_laptop_a.jpg', type: 'pixel_art' },
      { name: 'ForestCoolerBag', path: 'public/assets/pixel/tutorial/cooler_bag_cutout.png', type: 'pixel_art' },
    ],
  },
  {
    category: 'Day in the Life',
    pillar: 'Cold Chain & Saturday COD Loop',
    skuKey: 'CHOCO_HAZELNUT',
    promise: 'Real artisan discipline: how true cold-craft is brewed and delivered fresh weekly',
    proof: '03:30 AM kitchen prep SOP and temperature-locked delivery loop',
    path: 'Following the 03:30 AM wake-up grind to cold-chain doorstep delivery',
    verbalHookTemplate: '3 aturan ketat di dapur Lira tiap jam 03:30 pagi sebelum subuh. Dan aturan nomor tiga, yang bikin rasa dingin botolnya tahan sampai 7 hari.',
    writtenHook: '3 ATURAN KETAT JAM 03:30 AM',
    beat2Agitation: 'Bikin minuman artisan tanpa pengawet sintetis itu gak gampang. Salah suhu dua derajat aja pas proses seduh, rasa segarnya bisa rusak seketika.',
    beat3Proof: 'Makanya jam setengah empat pagi pas komplek masih sepi, gue udah sterilisasi meja dan mulai timbang bahan dengan timbangan digital presisi.',
    beat4Craft: 'Choco Hazelnut ini diemulsi perlahan sampai teksturnya velvety dan smooth, langsung masuk chiller bersuhu konstan dua derajat celsius.',
    beat5Logistics: 'Pas Sabtu siang, semua botol pindah ke tas thermal hijau forest Lira berinsulasi tebal, siap dikirim via Gojek ke rumah lo.',
    beat6CTA: 'Limited batch diseduh fresh minggu ini. Pesan langsung lewat link bio sebelum kehabisan.',
    loopBackCloser: 'Dan semua dedikasi ini balik lagi ke...',
    requiredAssets: [
      { name: 'CalebBlenderKitchen', path: 'public/assets/pixel/caleb_blender_kitchen.png', type: 'pixel_art' },
      { name: 'ChocoRealBottle', path: 'public/assets/bottles_ssot/choco_ssot.png', type: 'ssot_cutout' },
      { name: 'CoolerBagPackingScene', path: 'public/assets/pixel/tutorial/cooler_bag_cutout.png', type: 'pixel_art' },
      { name: 'GojekGateScene', path: 'public/assets/pixel/tutorial/s4_gojek_a.jpg', type: 'pixel_art' },
    ],
  },
];

/**
 * Step 2: Analyze Script Assets
 * Inspects all required visual assets across all beats.
 * Checks if the file exists on disk. If missing, formats an autonomous subagent generation request.
 */
function resolveAssetFile(relPath) {
  const fullPath = path.resolve(PROJECT_ROOT, relPath);
  if (fs.existsSync(fullPath)) return { exists: true, resolvedPath: fullPath, relPath };

  // Check alternative image extensions (.jpg, .jpeg, .png)
  const ext = path.extname(relPath);
  const baseWithoutExt = relPath.slice(0, -ext.length);
  const alts = ext === '.png' ? ['.jpg', '.jpeg'] : ext === '.jpg' ? ['.png', '.jpeg'] : ['.png', '.jpg'];

  for (const alt of alts) {
    const altRel = baseWithoutExt + alt;
    const altFull = path.resolve(PROJECT_ROOT, altRel);
    if (fs.existsSync(altFull)) {
      return { exists: true, resolvedPath: altFull, relPath: altRel };
    }
  }

  return { exists: false, resolvedPath: fullPath, relPath };
}

function analyzeScriptAssets(scriptTemplate) {
  const analysis = {
    scriptCategory: scriptTemplate.category,
    writtenHook: scriptTemplate.writtenHook,
    existingAssets: [],
    missingAssets: [],
    improvableAssets: [],
  };

  for (const asset of scriptTemplate.requiredAssets) {
    const res = resolveAssetFile(asset.path);

    if (res.exists) {
      analysis.existingAssets.push({
        name: asset.name,
        path: res.relPath,
        fullPath: res.resolvedPath,
        type: asset.type,
      });
    } else {
      analysis.missingAssets.push({
        name: asset.name,
        path: asset.path,
        fullPath: res.resolvedPath,
        type: asset.type,
        generationPrompt: generateAssetPrompt(asset.name, scriptTemplate),
      });
    }
  }

  return analysis;
}

/**
 * Generates high-detail 16/32-bit pixel art prompt for missing assets
 */
function generateAssetPrompt(assetName, scriptTemplate) {
  const skuMeta = LIRA_SKUS[scriptTemplate.skuKey] || LIRA_SKUS.MATCHA_OATSIDE;

  switch (assetName) {
    case 'ChasenWhiskAsset':
      return {
        role: 'Chasen Whisk Pixel Artist',
        aspectRatio: '3:4',
        dimensions: '1080x1440',
        prompt: `Generate a high-detail 16/32-bit indie-game pixel art asset in 3:4 portrait aspect ratio (1080x1440):
'Artisan Japanese Bamboo Chasen Whisking Vibrant Matcha in Ceramic Chawan'
Composition:
- POV close-up looking slightly downward onto a clean artisan wooden counter.
- In the center sits a handcrafted dark charcoal/slate ceramic matcha bowl (chawan).
- Inside the bowl is a rich, vibrant emerald-green ceremonial matcha liquid being actively micro-whisked into silky, dense micro-foam!
- A finely carved traditional bamboo whisk (chasen) with curled bamboo tines is held by a hand or dynamically suspended mid-whisk, whipping up fine matcha froth bubbles with subtle pixel motion sparkles.
- Next to the chawan on the counter: a small bamboo tea scoop (chashaku) resting with a dusting of vivid green matcha powder, and a sealed clear Lira bottle with gold screw cap and circular cream Lira logo (zero text on bottle).
- Warm, atmospheric lighting with rich depth, tactile indie-game pixel aesthetic.`,
      };

    case 'MeltedIceMacro':
      return {
        role: 'Melted Ice Macro Artist',
        aspectRatio: '3:4',
        dimensions: '1080x1440',
        prompt: `Generate a dramatic 16/32-bit pixel art macro shot (3:4 portrait, 1080x1440):
'Frustrating Reality: 50k Cafe Plastic Cup Melted Into Watery Pale Liquid'
Composition:
- Extreme close-up of a clear commercial takeaway cup sitting on a study desk next to an open notebook and MacBook edge.
- The drink is 85% transparent, half-melted ice cubes floating in pale washed-out colored water.
- Heavy water beads condensating down the plastic sides, forming a messy puddle soaking directly into lecture notes!
- High contrast, moody dramatic lighting, tactile pixel art.`,
      };

    case 'SteviaScienceVisual':
      return {
        role: 'Stevia Science Visual Artist',
        aspectRatio: '3:4',
        dimensions: '1080x1440',
        prompt: `Generate a high-detail 3:4 portrait (1080x1440) pixel art scene in signature 16/32-bit indie-game pixel art style:
'Scientific Comparison: Natural Stevia Leaf vs Cafe Refined Sugar Spike'
Composition:
- Split comparison visual in retro game UI HUD style:
- Left Column: Fresh vibrant green Stevia leaf sitting on wooden tray glowing with soft green outline, labeled 'STEVIA ALAMI'. Flat green line graph below showing perfectly stable blood sugar (Zero Glycemic Index).
- Right Column: A sweating commercial clear plastic cafe takeout cup with dome lid and bag of white refined sugar spilling, with a jagged red spike curve graph showing extreme insulin crash.
- Dark moody background with subtle neon grid lines.`,
      };

    default:
      return {
        role: `${assetName} Pixel Artist`,
        aspectRatio: '3:4',
        dimensions: '1080x1440',
        prompt: `Generate a detailed 16/32-bit indie-game pixel art scene (3:4 portrait, 1080x1440) for ${assetName} featuring ${skuMeta.name} (${skuMeta.liquidColor} liquid, circular cream Lira logo, zero text on bottle). Warm lighting, tactile artisan composition.`,
      };
  }
}

/**
 * Step 1: Generate Full 6-Beat Script & Verify Guardrails
 */
function generateScript(templateIndex = 0) {
  const template = SCRIPT_TEMPLATES[templateIndex % SCRIPT_TEMPLATES.length];
  const skuMeta = LIRA_SKUS[template.skuKey];

  const fullScript = {
    id: `script_${Date.now()}_${template.category.toLowerCase().replace(/[\s/]+/g, '_')}`,
    createdAt: new Date().toISOString(),
    format: 'reel',
    category: template.category,
    pillar: template.pillar,
    sku: skuMeta.name,
    framework: '3P (Promise, Proof, Path) + Open Loop',
    promise: template.promise,
    proof: template.proof,
    path: template.path,
    written_hook: template.writtenHook,
    verbal_hook: template.verbalHookTemplate,
    topic: template.promise,
    caption: `${template.writtenHook}\n\nDi Lira, kita tolak resep murahan: ${skuMeta.ingredients}. Nol pengawet sintetis, nol gula pasir rafinasi. Limited batch available untuk rute Gojek COD Sabtu ini via link di bio.\n\nCrafted solo by @caleb766h1`,
    beats: [
      {
        beatNumber: 1,
        timeRange: '00.00s - 05.00s',
        name: 'Superhook & 4-Layer Hook Stack',
        visual: 'CenterDiagnosticHUD / Somatic Spike Gauge or 180° Inverted Bottle dead center in Red Box (x:[192,896], y:[202,1236]) - NO star ratings',
        verbalText: template.verbalHookTemplate,
        writtenText: template.writtenHook,
        sfx: 'Sub-bass hit + retro diagnostic alert chime',
      },
      {
        beatNumber: 2,
        timeRange: '05.00s - 10.00s',
        name: 'Agitation & Context Expansion',
        visual: 'TopLiraGlassCard (left: 215px, width: 560px) + FloatingBrewClockHUD (right: 200px) inside Red Box',
        verbalText: template.beat2Agitation,
        writtenText: 'KENAPA BIKIN CRASH',
        sfx: 'Subtle clock tick + glitch chime',
      },
      {
        beatNumber: 3,
        timeRange: '10.00s - 16.00s',
        name: 'Physical Proof & Real Bottle Contrast',
        visual: `Real photo bottle (${skuMeta.realAsset}) with 100% full original stickers on chiller shelf`,
        verbalText: template.beat3Proof,
        writtenText: 'BUKTI BOTOL REAL',
        sfx: 'Cold bottle clink + glass resonance',
      },
      {
        beatNumber: 4,
        timeRange: '16.00s - 22.00s',
        name: 'Founder Craft & Science',
        visual: 'Pixelated Caleb crafting in artisan kitchen with pixel tools (2-frame living sprite toggles)',
        verbalText: template.beat4Craft,
        writtenText: 'SOLO CRAFT DARI UMUR 16',
        sfx: 'Whisk frothing or gentle stir sound',
      },
      {
        beatNumber: 5,
        timeRange: '22.00s - 27.00s',
        name: 'Cold-Chain Delivery Reality',
        visual: 'Forest Green aluminum-foil cooler bag hand-off at Gojek gate (2-frame driver thumbs-up toggle)',
        verbalText: template.beat5Logistics,
        writtenText: 'THERMAL FOIL COOLER BAG',
        sfx: 'Velcro peel + scooter idle sound',
      },
      {
        beatNumber: 6,
        timeRange: '27.00s - 31.00s',
        name: 'Fanfare CTA & Seamless Loop Splice',
        visual: 'Flanking real bottles (x:270, x:815) + CenterActionModal (Saturday dispatch CTA, zero star ratings)',
        verbalText: `${template.beat6CTA} ${template.loopBackCloser}`,
        writtenText: 'LIMITED BATCH SABTU',
        sfx: 'Tactile chime + subtle whoosh',
      },
    ],
  };

  // Programmatic Guardrail Validation
  validateContent(fullScript);

  return fullScript;
}

/**
 * Validate Jaccard Similarity Against History
 */
function verifyLedgerSimilarity(candidateHookText) {
  if (!fs.existsSync(LEDGER_PATH)) return { passed: true, maxSimilarity: 0.0 };

  const ledger = JSON.parse(fs.readFileSync(LEDGER_PATH, 'utf-8'));
  const existingHooks = (ledger.entries || [])
    .map((e) => e.written_hook || e.verbal_hook)
    .filter(Boolean);

  let maxSim = 0.0;
  for (const pastHook of existingHooks) {
    const sim = computeBigramJaccard(candidateHookText, pastHook);
    if (sim > maxSim) maxSim = sim;
  }

  return {
    passed: maxSim < 0.30,
    maxSimilarity: maxSim,
    threshold: 0.30,
  };
}

module.exports = {
  LIRA_SKUS,
  SCRIPT_TEMPLATES,
  generateScript,
  analyzeScriptAssets,
  generateAssetPrompt,
  verifyLedgerSimilarity,
};

// CLI execution test
if (require.main === module) {
  console.log('===============================================================');
  console.log('⚡ LIRA 3P SCRIPT GENERATION & ASSET DISCOVERY ENGINE');
  console.log('===============================================================\n');

  const sampleScript = generateScript(0);
  console.log(`[Generated Script ID]: ${sampleScript.id}`);
  console.log(`[Category]:            ${sampleScript.category} (${sampleScript.sku})`);
  console.log(`[Written Hook]:        "${sampleScript.written_hook}"`);
  console.log(`[Verbal 3P Hook]:      "${sampleScript.verbal_hook}"\n`);

  console.log('--- 6 BEATS BREAKDOWN ---');
  sampleScript.beats.forEach((b) => {
    console.log(`Beat ${b.beatNumber} (${b.timeRange}) [${b.name}]:`);
    console.log(`  Spoken:  "${b.verbalText}"`);
    console.log(`  Visual:  ${b.visual}\n`);
  });

  const assetAnalysis = analyzeScriptAssets(SCRIPT_TEMPLATES[0]);
  console.log('--- ASSET ANALYSIS ---');
  console.log(`Existing Assets Found: ${assetAnalysis.existingAssets.length}`);
  assetAnalysis.existingAssets.forEach((a) => console.log(`  ✓ ${a.name} -> ${a.path}`));

  console.log(`Missing Assets to Generate: ${assetAnalysis.missingAssets.length}`);
  assetAnalysis.missingAssets.forEach((m) => {
    console.log(`  ⚠️  MISSING: ${m.name} -> Requires image-generator subagent`);
    console.log(`     Prompt Role: "${m.generationPrompt.role}"`);
  });

  const jaccardCheck = verifyLedgerSimilarity(sampleScript.written_hook);
  console.log(`\n[Jaccard Gate Check]: ${jaccardCheck.passed ? 'PASSED' : 'FAILED'} (Max Sim: ${jaccardCheck.maxSimilarity.toFixed(4)} < 0.30)`);
  console.log('\n✅ 3P Script Generator initialized and operational.');
}
