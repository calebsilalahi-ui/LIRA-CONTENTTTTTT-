import React from 'react';
import { staticFile, Img } from 'remotion';

// Standard 4:5 Instagram Carousel dimensions (1080 x 1350)
const containerStyle: React.CSSProperties = {
  width: 1080,
  height: 1350,
  backgroundColor: '#070A0E',
  backgroundImage: `
    radial-gradient(circle at 50% 0%, rgba(57, 255, 136, 0.12) 0%, transparent 60%),
    radial-gradient(circle at 100% 100%, rgba(255, 229, 102, 0.06) 0%, transparent 50%),
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
  `,
  backgroundSize: '100% 100%, 100% 100%, 48px 48px, 48px 48px',
  color: '#FFFFFF',
  fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, sans-serif',
  display: 'flex',
  flexDirection: 'column',
  padding: '54px 62px 42px 62px',
  boxSizing: 'border-box',
  position: 'relative',
  overflow: 'hidden',
};

const SERIF_ITALIC = '"Playfair Display", Georgia, serif';

const TopBar: React.FC<{
  category: string;
  categoryColor?: string;
  categoryBg?: string;
  slideNum: string;
}> = ({
  category,
  categoryColor = '#39FF88',
  categoryBg = 'rgba(57, 255, 136, 0.14)',
  slideNum,
}) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 20,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{
        backgroundColor: categoryBg,
        border: `1.5px solid ${categoryColor}55`,
        color: categoryColor,
        padding: '8px 18px',
        borderRadius: 10,
        fontSize: 15,
        fontWeight: 800,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}>
        {category}
      </div>
      <div style={{ color: '#9CA3AF', fontSize: 18, fontWeight: 700 }}>
        @drinklira
      </div>
    </div>
    <div style={{
      color: '#FFFFFF',
      fontSize: 17,
      fontWeight: 800,
      letterSpacing: '0.1em',
      background: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.14)',
      padding: '8px 18px',
      borderRadius: 10,
    }}>
      {slideNum}
    </div>
  </div>
);

const SwipeFooter: React.FC<{
  bridgeText: string;
  isLast?: boolean;
}> = ({ bridgeText, isLast = false }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    paddingTop: 16,
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    zIndex: 20,
  }}>
    <div style={{
      color: '#9CA3AF',
      fontSize: 15,
      fontWeight: 700,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
    }}>
      {bridgeText}
    </div>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      color: isLast ? '#FFE566' : '#39FF88',
      fontSize: 16,
      fontWeight: 800,
    }}>
      <span>{isLast ? 'LINK DI BIO' : 'SWIPE NEXT'}</span>
      <span style={{ fontSize: 20 }}>→</span>
    </div>
  </div>
);

// Reusable Slide Template ensuring NO slide is ever text-only
const SlideTemplate: React.FC<{
  category: string;
  categoryColor?: string;
  categoryBg?: string;
  slideNum: string;
  headline: React.ReactNode;
  subhead: string;
  imageSrc: string;
  badgeText: string;
  badgeSub: string;
  pillText?: string;
  bridgeText: string;
  isLast?: boolean;
}> = ({
  category,
  categoryColor = '#39FF88',
  categoryBg,
  slideNum,
  headline,
  subhead,
  imageSrc,
  badgeText,
  badgeSub,
  pillText,
  bridgeText,
  isLast = false,
}) => (
  <div style={containerStyle}>
    <TopBar category={category} categoryColor={categoryColor} categoryBg={categoryBg} slideNum={slideNum} />

    <div style={{ marginBottom: 18, zIndex: 20 }}>
      <h1 style={{
        fontSize: 44,
        fontWeight: 900,
        lineHeight: 1.15,
        letterSpacing: '-0.025em',
        margin: '0 0 10px 0',
      }}>
        {headline}
      </h1>
      <p style={{
        fontSize: 19,
        color: '#9CA3AF',
        margin: 0,
        fontWeight: 600,
        lineHeight: 1.35,
      }}>
        {subhead}
      </p>
    </div>

    <div style={{
      flex: 1,
      borderRadius: 22,
      overflow: 'hidden',
      position: 'relative',
      border: `1.5px solid ${categoryColor}44`,
      boxShadow: '0 24px 50px rgba(0, 0, 0, 0.7)',
      backgroundColor: '#12161F',
    }}>
      <Img
        src={staticFile(imageSrc)}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(7, 10, 14, 0.95) 0%, rgba(7, 10, 14, 0.35) 50%, transparent 75%)',
      }} />

      <div style={{
        position: 'absolute',
        bottom: 18,
        left: 18,
        right: 18,
        backgroundColor: 'rgba(12, 17, 24, 0.94)',
        backdropFilter: 'blur(16px)',
        border: `1.5px solid ${categoryColor}55`,
        borderRadius: 16,
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <div style={{ color: categoryColor, fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {badgeText}
          </div>
          <div style={{ color: '#FFFFFF', fontSize: 19, fontWeight: 800, marginTop: 4 }}>
            {badgeSub}
          </div>
        </div>
        {pillText && (
          <div style={{
            backgroundColor: categoryColor,
            color: '#070A0E',
            fontWeight: 900,
            fontSize: 14,
            padding: '10px 16px',
            borderRadius: 10,
          }}>
            {pillText}
          </div>
        )}
      </div>
    </div>

    <SwipeFooter bridgeText={bridgeText} isLast={isLast} />
  </div>
);

// ==========================================
// 1. CAROUSEL SATURDAY DROP (Sat Oct 24)
// ==========================================
export const SatDrop_Slide1: React.FC = () => (
  <SlideTemplate
    category="DROP SABTU"
    categoryColor="#FFE566"
    slideNum="01 / 04"
    headline={<>Batch Sabtu Lira: <span style={{ fontFamily: SERIF_ITALIC, fontStyle: 'italic', color: '#FFE566' }}>Freshly Brewed</span> & Siap Dikirim Dingin Hari Ini!</>}
    subhead="Disiapkan manual dengan pure Japanese premium matcha & barista oat milk tanpa es batu pengencer."
    imageSrc="assets/pixel/scene_5_laptop_a.jpg"
    badgeText="FRESH BATCH SATURDAY"
    badgeSub="Diseduh Manual Jumat Malam"
    pillText="DROP HARI INI"
    bridgeText="KENAPA BEDA DARI KAFE BIASA"
  />
);

export const SatDrop_Slide2: React.FC = () => (
  <SlideTemplate
    category="PURE JAPANESE MATCHA"
    categoryColor="#39FF88"
    slideNum="02 / 04"
    headline={<>0 Gula Pasir, 100% Pemanis Alami Stevia Drops.</>}
    subhead="Nol lonjakan insulin, nol afternoon sugar crash. Fokus bersih tenang 6 jam nemenin weekend lo."
    imageSrc="assets/pixel/caleb_pouring_matcha.jpg"
    badgeText="✓ ZERO SUGAR CRASH"
    badgeSub="Ekstrak Daun Stevia Alami"
    pillText="0 CAL SUGAR"
    bridgeText="KEUNGGULAN BOTOL 180°"
  />
);

export const SatDrop_Slide3: React.FC = () => (
  <SlideTemplate
    category="180° LEAKPROOF"
    categoryColor="#39FF88"
    slideNum="03 / 04"
    headline={<>Dibalik 180° di Atas MacBook: 0 Tetes Bocor.</>}
    subhead="Bebas lo lempar ke tas ransel atau tote bag samping laptop. Tahan 7 hari segar di kulkas."
    imageSrc="assets/pixel/cup_struggle/s3_inverted_a.jpg"
    badgeText="✓ MACBOOK SAFE GUARANTEE"
    badgeSub="Tutup Ulir Kedap Udara Rp 34k"
    pillText="ANTI BOCOR"
    bridgeText="CARA AMANKAN SLOT LO"
  />
);

export const SatDrop_Slide4: React.FC = () => (
  <SlideTemplate
    category="LIMITED BATCH"
    categoryColor="#FFE566"
    slideNum="04 / 04"
    headline={<>Slot Batch Sabtu Terbatas. Amankan Botol Lo Sekarang!</>}
    subhead="Kapasitas artisan diseduh manual terbatas tiap minggu. Dikirim dingin via kurir instan."
    imageSrc="assets/pixel/caleb_point_hero.jpg"
    badgeText="BATCH SABTU AKTIF"
    badgeSub="Pesan Lewat Link di Bio"
    pillText="ORDER SEKARANG"
    bridgeText="CRAFTED SOLO BY @CALEB766H1"
    isLast
  />
);

// ==========================================
// 2. CAROUSEL SUNDAY RESET (Sun Oct 25)
// ==========================================
export const SunReset_Slide1: React.FC = () => (
  <SlideTemplate
    category="SUNDAY RESET"
    categoryColor="#39FF88"
    slideNum="01 / 04"
    headline={<>Sunday Reset: Ganti 3 Cangkir Kopi Pahit Dengan <span style={{ fontFamily: SERIF_ITALIC, fontStyle: 'italic', color: '#39FF88' }}>Clean Caffeine</span> Lira.</>}
    subhead="Kenapa matcha premium bikin hari Minggu lo produktif tanpa rasa cemas gelisah jantung deg-degan."
    imageSrc="assets/pixel/insider_caleb_desk_b.jpg"
    badgeText="RESET ENERGI MINGGU"
    badgeSub="Fokus Tenang Tanpa Jitters"
    pillText="CLEAN CAFFEINE"
    bridgeText="RAHASIA L-THEANINE ALAMI"
  />
);

export const SunReset_Slide2: React.FC = () => (
  <SlideTemplate
    category="BIOKIMIA FOCUS"
    categoryColor="#39FF88"
    slideNum="02 / 04"
    headline={<>Kombinasi Sinergis Kafein Bersih + L-Theanine Alami.</>}
    subhead="Matcha melepaskan kafein perlahan selama 6 jam, menstimulasi gelombang otak alfa buat deep work santai."
    imageSrc="assets/pixel/caleb_pouring_matcha.jpg"
    badgeText="✓ ALPHA BRAINWAVES"
    badgeSub="Fokus Stabil Sepanjang Hari"
    pillText="6 JAM STABIL"
    bridgeText="PERBEDAAN DI PENCERNAAN"
  />
);

export const SunReset_Slide3: React.FC = () => (
  <SlideTemplate
    category="PLANT-BASED COMFORT"
    categoryColor="#39FF88"
    slideNum="03 / 04"
    headline={<>Barista Oat Milk: Gurih Creamy Tanpa Bikin Kembung.</>}
    subhead="100% plant-based dan ramah lambung bagi yang intoleransi laktosa susu sapi kafe biasa."
    imageSrc="assets/pixel/caleb_walking_drink.jpg"
    badgeText="✓ DAIRY FREE COMFORT"
    badgeSub="Emulsi Lembut Oat Milk"
    pillText="RAMAH LAMBUNG"
    bridgeText="SIAPIN KULKAS MINGGU INI"
  />
);

export const SunReset_Slide4: React.FC = () => (
  <SlideTemplate
    category="STOCK DI KULKAS"
    categoryColor="#FFE566"
    slideNum="04 / 04"
    headline={<>Siapin Stok Kulkas Lo Buat Menghadapi Hari Senin.</>}
    subhead="Botol Lira di pagi hari, siap nemenin lo kerja dari kosan, kafe, atau kampus tanpa ribet."
    imageSrc="assets/pixel/caleb_point_hero.jpg"
    badgeText="LIMITED BATCH AVAILABLE"
    badgeSub="Amankan Slot Lewat Link di Bio"
    pillText="LINK DI BIO"
    bridgeText="CRAFTED SOLO BY @CALEB766H1"
    isLast
  />
);

// ==========================================
// 3. CAROUSEL DEEP WORK SCIENCE (Mon Oct 26)
// ==========================================
export const DeepWork_Slide1: React.FC = () => (
  <SlideTemplate
    category="MONDAY DEEP WORK"
    categoryColor="#39FF88"
    slideNum="01 / 04"
    headline={<>Biokimia Deep Work: Kenapa <span style={{ fontFamily: SERIF_ITALIC, fontStyle: 'italic', color: '#39FF88' }}>Lira Matcha</span> Jadi Cheat Code Ngoding & Nulis?</>}
    subhead="Solusi nyata buat mahasiswa dan pekerja remote yang butuh konsentrasi tinggi tanpa distracted."
    imageSrc="assets/pixel/scene_5_laptop_a.jpg"
    badgeText="CHEAT CODE PRODUKTIVITAS"
    badgeSub="Solusi Anti Distraksi Kerja"
    pillText="DEEP WORK"
    bridgeText="LONJAKAN VS KETENANGAN"
  />
);

export const DeepWork_Slide2: React.FC = () => (
  <SlideTemplate
    category="BAHAYA GULA PASIR"
    categoryColor="#FF5E7E"
    categoryBg="rgba(255, 94, 126, 0.14)"
    slideNum="02 / 04"
    headline={<>Gula Pasir Kafe Adalah Musuh Terbesar Alur Fokus (Flow State).</>}
    subhead="30g gula memicu lonjakan dopamin palsu 20 menit sebelum tubuh terjun bebas ke jurang brain fog."
    imageSrc="assets/pixel/scene_6_stressed_a.jpg"
    badgeText="PERANGKAP BRAIN FOG"
    badgeSub="Sugar Crash Membunuh Jam Kerja"
    pillText="HINDARI GULA"
    bridgeText="SOLUSI STEVIA LIRA"
  />
);

export const DeepWork_Slide3: React.FC = () => (
  <SlideTemplate
    category="100% STEVIA DROPS"
    categoryColor="#39FF88"
    slideNum="03 / 04"
    headline={<>Manis Alami Tanpa Kalori Gula: 0 Glycemic Spike.</>}
    subhead="Ekstrak daun stevia murni menjaga kestabilan glukosa darah sehingga otak lo tetap tajam konsisten."
    imageSrc="assets/pixel/insider_caleb_desk_a.jpg"
    badgeText="✓ 0 GLYCEMIC INDEX"
    badgeSub="Glukosa Darah Rata & Stabil"
    pillText="FOKUS 6 JAM"
    bridgeText="MULAI SENIN BERSIH"
  />
);

export const DeepWork_Slide4: React.FC = () => (
  <SlideTemplate
    category="DROP MINGGUAN"
    categoryColor="#FFE566"
    slideNum="04 / 04"
    headline={<>Mulai Senin Produktif Dengan Botol Segel Lira.</>}
    subhead="Tutup ulir emas 180° anti-bocor, siap ditaruh tepat di sebelah keyboard laptop lo."
    imageSrc="assets/pixel/caleb_point_hero.jpg"
    badgeText="LIMITED BATCH AVAILABLE"
    badgeSub="Pesan Lewat Link di Bio"
    pillText="AMANKAN SLOT"
    bridgeText="CRAFTED SOLO BY @CALEB766H1"
    isLast
  />
);

// ==========================================
// 4. CAROUSEL FINANCIAL MATH (Wed Oct 28)
// ==========================================
export const Finance_Slide1: React.FC = () => (
  <SlideTemplate
    category="SMART MONEY"
    categoryColor="#FFE566"
    slideNum="01 / 04"
    headline={<>Hemat Rp 560.000 Per Bulan: <span style={{ fontFamily: SERIF_ITALIC, fontStyle: 'italic', color: '#FFE566' }}>Stop Bayar Mahal</span> Buat Air Es Kafe.</>}
    subhead="Perhitungan matematika sederhana buat mahasiswa dan kreator yang sering nongkrong di kafe Jakarta."
    imageSrc="assets/pixel/cup_struggle/s1_typing_cup.jpg"
    badgeText="KALKULATOR HEMAT"
    badgeSub="Stop Pemborosan Kafe 50k"
    pillText="HEMAT 560K"
    bridgeText="BEDAH BIAYA NYATA"
  />
);

export const Finance_Slide2: React.FC = () => (
  <SlideTemplate
    category="REALITA KAFE 50K"
    categoryColor="#FF5E7E"
    categoryBg="rgba(255, 94, 126, 0.14)"
    slideNum="02 / 04"
    headline={<>Bayar Rp 52.000 Tiap Hari = Rp 1.040.000 / Bulan Cuma Buat Minum.</>}
    subhead="Padahal isinya 70% es batu mencair dan sirup gula murah yang bikin lemas di siang hari."
    imageSrc="assets/pixel/carousel_melted_ice.jpg"
    badgeText="PEMBOROSAN KAFE"
    badgeSub="70% Es Batu Mencair & Gula"
    pillText="MAHAL & DILUTE"
    bridgeText="PERBANDINGAN DENGAN LIRA"
  />
);

export const Finance_Slide3: React.FC = () => (
  <SlideTemplate
    category="THE LIRA MATH"
    categoryColor="#39FF88"
    slideNum="03 / 04"
    headline={<>Lira Cuma Rp 24.000: Murni 100% Matcha Jepang & Oat Milk.</>}
    subhead="Tanpa es batu pengencer, diseduh artisan, dan bisa lo minum dingin kapan pun lo mau."
    imageSrc="assets/pixel/caleb_walking_drink.jpg"
    badgeText="✓ NILAI LEBIH TINGGI"
    badgeSub="Rp 24.000 Murni Tanpa Es Batu"
    pillText="HEMAT 54%"
    bridgeText="JOIN THE SMART CREATORS"
  />
);

export const Finance_Slide4: React.FC = () => (
  <SlideTemplate
    category="DROP SABTU"
    categoryColor="#FFE566"
    slideNum="04 / 04"
    headline={<>Upgrade Rutinitas Minum Lo Tanpa Bikin Kantong Jebol.</>}
    subhead="Limited batch available tiap minggu. Pesan batch Sabtu ini sebelum kuota habis!"
    imageSrc="assets/pixel/caleb_point_hero.jpg"
    badgeText="LIMITED BATCH AVAILABLE"
    badgeSub="Drop Batch Sabtu di Link Bio"
    pillText="PESAN SEKARANG"
    bridgeText="CRAFTED SOLO BY @CALEB766H1"
    isLast
  />
);

// ==========================================
// 5. CAROUSEL ARTISAN SCARCITY (Thu Oct 29)
// ==========================================
export const Scarcity_Slide1: React.FC = () => (
  <SlideTemplate
    category="ARTISAN PHILOSOPHY"
    categoryColor="#39FF88"
    slideNum="01 / 04"
    headline={<>Kenapa Batch Sabtu Lira Selalu Cepat Sold Out? <span style={{ fontFamily: SERIF_ITALIC, fontStyle: 'italic', color: '#39FF88' }}>Filosofi Artisan Freshness.</span></>}
    subhead="Alasan kenapa kita menolak produksi massal pabrik dan tetap meracik manual setiap botol."
    imageSrc="assets/pixel/caleb_pouring_matcha.jpg"
    badgeText="ARTISAN BATCH"
    badgeSub="Diseduh Manual Tiap Jumat"
    pillText="FRESH QUALITY"
    bridgeText="STANDAR KUALITAS JEPANG"
  />
);

export const Scarcity_Slide2: React.FC = () => (
  <SlideTemplate
    category="JAPANESE PREMIUM GRADE"
    categoryColor="#39FF88"
    slideNum="02 / 04"
    headline={<>Hanya Menggunakan Pure Japanese Premium Matcha Asli.</>}
    subhead="Bukan bubuk perisa kiloan yang dijual bebas di pasaran. Warna hijau zamrud dan umaminya asli dari alam."
    imageSrc="assets/pixel/insider_caleb_desk_a.jpg"
    badgeText="✓ 100% PURE MATCHA"
    badgeSub="Grade Premium Asli Jepang"
    pillText="UMAMI ALAMI"
    bridgeText="PENGEMASAN KEDAP UDARA"
  />
);

export const Scarcity_Slide3: React.FC = () => (
  <SlideTemplate
    category="180° SEAL STANDARD"
    categoryColor="#39FF88"
    slideNum="03 / 04"
    headline={<>Setiap Botol Diuji Balik 180° Sebelum Dikirim ke Lo.</>}
    subhead="Segel ulir kedap udara menjaga profil rasa tetap kaya dan menjamin nol resiko tumpah di tas ransel."
    imageSrc="assets/pixel/cup_struggle/s3_inverted_a.jpg"
    badgeText="✓ 180° QUALITY TEST"
    badgeSub="0 Tetes Bocor Terjamin"
    pillText="LEAKPROOF"
    bridgeText="AMANKAN SLOT SABTU"
  />
);

export const Scarcity_Slide4: React.FC = () => (
  <SlideTemplate
    category="BATCH DROP ALERT"
    categoryColor="#FFE566"
    slideNum="04 / 04"
    headline={<>Batch Sabtu Sedang Dibuka. Slot Terbatas Lewat Link di Bio!</>}
    subhead="Amankan botol lo sekarang sebelum slot produksi artisan minggu ini ditutup malam ini."
    imageSrc="assets/pixel/cup_struggle/s4_toss_4.jpg"
    badgeText="LIMITED BATCH AVAILABLE"
    badgeSub="Order Sekarang Lewat Link Bio"
    pillText="LINK DI BIO"
    bridgeText="CRAFTED SOLO BY @CALEB766H1"
    isLast
  />
);
