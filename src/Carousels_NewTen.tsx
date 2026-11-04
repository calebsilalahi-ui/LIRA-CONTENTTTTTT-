import React from 'react';
import { staticFile, Img } from 'remotion';

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
  padding: '50px 60px 40px 60px',
  boxSizing: 'border-box',
  position: 'relative',
  overflow: 'hidden',
};

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
    marginBottom: 18,
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
    marginTop: 'auto',
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
      gap: 8,
      color: isLast ? '#070A0E' : '#39FF88',
      background: isLast ? '#39FF88' : 'rgba(57, 255, 136, 0.14)',
      border: '1.5px solid #39FF88',
      padding: '8px 18px',
      borderRadius: 10,
      fontSize: 15,
      fontWeight: 800,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
    }}>
      {isLast ? 'PESAN DI BIO' : 'GESER ➔'}
    </div>
  </div>
);

/* =========================================================================
   CAROUSEL 11: ANATOMI BOTOL LIRA
   ========================================================================= */

export const Anatomi_Slide1: React.FC = () => (
  <div style={containerStyle}>
    <TopBar category="BIOLOGI & ARTISAN" slideNum="01 / 04" />
    <h1 style={{ fontSize: 44, fontWeight: 900, lineHeight: 1.15, marginBottom: 12 }}>
      ANATOMI BOTOL LIRA:<br />
      <span style={{ color: '#39FF88' }}>DARI DAUN JEPANG KE MEJA KERJA.</span>
    </h1>
    <p style={{ fontSize: 20, color: '#CBD5E1', lineHeight: 1.4, marginBottom: 20 }}>
      Kenapa rasanya bisa sepekat kafe mall tanpa setetes pun gula pasir? Ini breakdown transparan bahan baku kami.
    </p>
    <div style={{ flex: 1, borderRadius: 20, overflow: 'hidden', border: '2px solid rgba(57, 255, 136, 0.3)', position: 'relative' }}>
      <Img src={staticFile('assets/pixel/caleb_blender_kitchen.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, backgroundColor: 'rgba(15,23,42,0.92)', border: '1.5px solid #39FF88', borderRadius: 14, padding: '12px 18px' }}>
        <div style={{ color: '#39FF88', fontWeight: 800, fontSize: 16 }}>DAPUR ARTISAN CALEB</div>
        <div style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 700 }}>Konsentrat murni di-blender kecepatan tinggi untuk tekstur mikro halus.</div>
      </div>
    </div>
    <SwipeFooter bridgeText="Komponen 1: Pure Japanese Matcha" />
  </div>
);

export const Anatomi_Slide2: React.FC = () => (
  <div style={containerStyle}>
    <TopBar category="BAHAN BAKU" slideNum="02 / 04" />
    <h1 style={{ fontSize: 38, fontWeight: 900, lineHeight: 1.2, marginBottom: 12 }}>
      KOMPONEN 1 & 2:<br />
      <span style={{ color: '#34D399' }}>PURE JAPANESE MATCHA & BLENDER MIKRO.</span>
    </h1>
    <p style={{ fontSize: 19, color: '#CBD5E1', lineHeight: 1.4, marginBottom: 18 }}>
      Diimpor murni langsung dari perkebunan Jepang tanpa pemalsuan tepung pewarna. Diolah dengan blender komersial agar konsentratnya larut tanpa residu berpasir.
    </p>
    <div style={{ flex: 1, borderRadius: 20, overflow: 'hidden', border: '2px solid rgba(52, 211, 153, 0.4)', position: 'relative' }}>
      <Img src={staticFile('assets/pixel/caleb_pouring_matcha.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, backgroundColor: 'rgba(15,23,42,0.92)', border: '1.5px solid #34D399', borderRadius: 14, padding: '12px 18px' }}>
        <div style={{ color: '#34D399', fontWeight: 800, fontSize: 16 }}>HASIL EKSTRAKSI SEMPURNA</div>
        <div style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 700 }}>Kaya klorofil alami & L-Theanine penenang fokus 6 jam kerja.</div>
      </div>
    </div>
    <SwipeFooter bridgeText="Komponen 3 & 4: Stevia & Oatside" />
  </div>
);

export const Anatomi_Slide3: React.FC = () => (
  <div style={containerStyle}>
    <TopBar category="FORMULASI SEHAT" slideNum="03 / 04" />
    <h1 style={{ fontSize: 38, fontWeight: 900, lineHeight: 1.2, marginBottom: 12 }}>
      KOMPONEN 3 & 4:<br />
      <span style={{ color: '#FFE566' }}>100% STEVIA DROPS & OATSIDE BARISTA.</span>
    </h1>
    <p style={{ fontSize: 19, color: '#CBD5E1', lineHeight: 1.4, marginBottom: 18 }}>
      Kafe mall memasukkan 35g sirup gula pasir. Di Lira, rasa manis murni berasal dari tetesan daun stevia 0g kalori, dipadu gurihnya susu Barista Oatside.
    </p>
    <div style={{ flex: 1, borderRadius: 20, overflow: 'hidden', border: '2px solid rgba(255, 229, 102, 0.4)', position: 'relative' }}>
      <Img src={staticFile('assets/pixel/s5_batch_a.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, backgroundColor: 'rgba(15,23,42,0.92)', border: '1.5px solid #FFE566', borderRadius: 14, padding: '12px 18px' }}>
        <div style={{ color: '#FFE566', fontWeight: 800, fontSize: 16 }}>ZERO SUGAR CRASH</div>
        <div style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 700 }}>Energi stabil seharian tanpa lonjakan gula darah dan kantuk jam 2 siang.</div>
      </div>
    </div>
    <SwipeFooter bridgeText="Packaging: Botol PET 180° Anti Bocor" />
  </div>
);

export const Anatomi_Slide4: React.FC = () => (
  <div style={containerStyle}>
    <TopBar category="PACKAGING & HARGA" slideNum="04 / 04" />
    <h1 style={{ fontSize: 38, fontWeight: 900, lineHeight: 1.2, marginBottom: 12 }}>
      SEALED GOLD CAP:<br />
      <span style={{ color: '#39FF88' }}>180° ANTI BOCOR, HARGA JUJUR.</span>
    </h1>
    <p style={{ fontSize: 19, color: '#CBD5E1', lineHeight: 1.4, marginBottom: 18 }}>
      Botol silinder PET premium siap masuk totebag kerja. Tanpa es batu yang mencair jadi air tawar.
    </p>
    <div style={{ flex: 1, backgroundColor: '#0F172A', borderRadius: 20, border: '2px solid #39FF88', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
        <div style={{ backgroundColor: '#1E293B', padding: '14px 18px', borderRadius: 14, borderLeft: '5px solid #FCD34D' }}>
          <div style={{ fontSize: 15, color: '#94A3B8', fontWeight: 700 }}>MILK TEA</div>
          <div style={{ fontSize: 24, color: '#FCD34D', fontWeight: 900 }}>Rp 15.000</div>
        </div>
        <div style={{ backgroundColor: '#1E293B', padding: '14px 18px', borderRadius: 14, borderLeft: '5px solid #34D399' }}>
          <div style={{ fontSize: 15, color: '#94A3B8', fontWeight: 700 }}>MATCHA CLASSIC</div>
          <div style={{ fontSize: 24, color: '#34D399', fontWeight: 900 }}>Rp 19.000</div>
        </div>
        <div style={{ backgroundColor: '#1E293B', padding: '14px 18px', borderRadius: 14, borderLeft: '5px solid #F87171' }}>
          <div style={{ fontSize: 15, color: '#94A3B8', fontWeight: 700 }}>CHOCO HAZELNUT</div>
          <div style={{ fontSize: 24, color: '#F87171', fontWeight: 900 }}>Rp 22.000</div>
        </div>
        <div style={{ backgroundColor: '#1E293B', padding: '14px 18px', borderRadius: 14, borderLeft: '5px solid #39FF88' }}>
          <div style={{ fontSize: 15, color: '#94A3B8', fontWeight: 700 }}>MATCHA OATSIDE</div>
          <div style={{ fontSize: 24, color: '#39FF88', fontWeight: 900 }}>Rp 24.000</div>
        </div>
      </div>
      <div style={{ textAlign: 'center', color: '#CBD5E1', fontSize: 16 }}>
        Limited batch artisan per batch. Order via link di bio (@drinklira).
      </div>
    </div>
    <SwipeFooter bridgeText="Dapatkan botol artisan lo" isLast />
  </div>
);

/* =========================================================================
   CAROUSEL 12: GUIDE VARIAN MENU LIRA
   ========================================================================= */

export const GuideMenu_Slide1: React.FC = () => (
  <div style={containerStyle}>
    <TopBar category="MENU GUIDE" slideNum="01 / 04" />
    <h1 style={{ fontSize: 44, fontWeight: 900, lineHeight: 1.15, marginBottom: 12 }}>
      PANDUAN VARIAN LIRA:<br />
      <span style={{ color: '#FFE566' }}>MANA YANG PAS BUAT GAYA LO?</span>
    </h1>
    <p style={{ fontSize: 20, color: '#CBD5E1', lineHeight: 1.4, marginBottom: 20 }}>
      Setiap botol diseduh dengan fungsi spesifik: dari teman kerja maraton sampai mood booster manis alami 0g gula pasir.
    </p>
    <div style={{ flex: 1, borderRadius: 20, overflow: 'hidden', border: '2px solid rgba(255, 229, 102, 0.3)', position: 'relative' }}>
      <Img src={staticFile('assets/pixel/s5_batch_b.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, backgroundColor: 'rgba(15,23,42,0.92)', border: '1.5px solid #FFE566', borderRadius: 14, padding: '12px 18px' }}>
        <div style={{ color: '#FFE566', fontWeight: 800, fontSize: 16 }}>PILIHAN LENGKAP ARTISAN</div>
        <div style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 700 }}>4 varian andalan diseduh fresh per batch, rentang harga Rp 15k–Rp 24k.</div>
      </div>
    </div>
    <SwipeFooter bridgeText="Varian 1 & 2: Milk Tea & Classic" />
  </div>
);

export const GuideMenu_Slide2: React.FC = () => (
  <div style={containerStyle}>
    <TopBar category="DAILY DRINK" slideNum="02 / 04" />
    <h1 style={{ fontSize: 38, fontWeight: 900, lineHeight: 1.2, marginBottom: 14 }}>
      MILK TEA (15K) &<br />
      <span style={{ color: '#34D399' }}>MATCHA CLASSIC (19K).</span>
    </h1>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 18 }}>
      <div style={{ backgroundColor: '#1E293B', padding: '16px 20px', borderRadius: 16, borderLeft: '5px solid #FCD34D' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#FCD34D' }}>MILK TEA ARTISAN</span>
          <span style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF' }}>Rp 15.000</span>
        </div>
        <p style={{ margin: 0, fontSize: 16, color: '#CBD5E1', lineHeight: 1.4 }}>
          Teh hitam pilihan diseduh pekat dengan susu lembut dan manis stevia alami. Teman baca buku dan rileks sore.
        </p>
      </div>
      <div style={{ backgroundColor: '#1E293B', padding: '16px 20px', borderRadius: 16, borderLeft: '5px solid #34D399' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#34D399' }}>MATCHA LATTE CLASSIC</span>
          <span style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF' }}>Rp 19.000</span>
        </div>
        <p style={{ margin: 0, fontSize: 16, color: '#CBD5E1', lineHeight: 1.4 }}>
          Pure Japanese Matcha murni dipadu fresh milk seimbang. Pilihan utama buat lo yang butuh fokus stabil tiap pagi.
        </p>
      </div>
    </div>
    <div style={{ flex: 1, borderRadius: 18, overflow: 'hidden', border: '1.5px solid rgba(52, 211, 153, 0.3)' }}>
      <Img src={staticFile('assets/pixel/caleb_walking_drink.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
    <SwipeFooter bridgeText="Varian 3 & 4: Choco & Oatside" />
  </div>
);

export const GuideMenu_Slide3: React.FC = () => (
  <div style={containerStyle}>
    <TopBar category="PREMIUM SELECTION" slideNum="03 / 04" />
    <h1 style={{ fontSize: 38, fontWeight: 900, lineHeight: 1.2, marginBottom: 14 }}>
      CHOCO HAZELNUT (22K) &<br />
      <span style={{ color: '#39FF88' }}>MATCHA OATSIDE (24K).</span>
    </h1>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 18 }}>
      <div style={{ backgroundColor: '#1E293B', padding: '16px 20px', borderRadius: 16, borderLeft: '5px solid #F87171' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#F87171' }}>CHOCO HAZELNUT</span>
          <span style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF' }}>Rp 22.000</span>
        </div>
        <p style={{ margin: 0, fontSize: 16, color: '#CBD5E1', lineHeight: 1.4 }}>
          Kakao pekat dipadukan aroma hazelnut panggang gurih. Manis legit daun stevia alami tanpa rasa bersalah.
        </p>
      </div>
      <div style={{ backgroundColor: '#1E293B', padding: '16px 20px', borderRadius: 16, borderLeft: '5px solid #39FF88' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#39FF88' }}>MATCHA OATSIDE (FLAGSHIP)</span>
          <span style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF' }}>Rp 24.000</span>
        </div>
        <p style={{ margin: 0, fontSize: 16, color: '#CBD5E1', lineHeight: 1.4 }}>
          Pure Japanese Matcha hasil blender kecepatan tinggi dipadukan 100% Barista Oatside murni. Creamy, gurih, vegan-friendly.
        </p>
      </div>
    </div>
    <div style={{ flex: 1, borderRadius: 18, overflow: 'hidden', border: '1.5px solid rgba(57, 255, 136, 0.3)' }}>
      <Img src={staticFile('assets/pixel/carousel_cover_caleb.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
    <SwipeFooter bridgeText="Cara Order & Batasan Batch" />
  </div>
);

export const GuideMenu_Slide4: React.FC = () => (
  <div style={containerStyle}>
    <TopBar category="PEMESANAN" slideNum="04 / 04" />
    <h1 style={{ fontSize: 40, fontWeight: 900, lineHeight: 1.2, marginBottom: 14 }}>
      AMANKAN VARIAN LO:<br />
      <span style={{ color: '#39FF88' }}>KUOTA BATCH TERBATAS.</span>
    </h1>
    <p style={{ fontSize: 20, color: '#CBD5E1', lineHeight: 1.4, marginBottom: 20 }}>
      Karena diseduh fresh menggunakan tangan sendiri tanpa pengawet pabrik, kapasitas produksi per batch kami batasi ketat.
    </p>
    <div style={{ flex: 1, borderRadius: 20, overflow: 'hidden', border: '2px solid rgba(57, 255, 136, 0.4)', position: 'relative' }}>
      <Img src={staticFile('assets/pixel/caleb_point_hero.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, backgroundColor: 'rgba(15,23,42,0.94)', border: '2px solid #39FF88', borderRadius: 16, padding: '16px 20px', textAlign: 'center' }}>
        <div style={{ color: '#39FF88', fontWeight: 900, fontSize: 20 }}>KLIK LINK DI BIO (@DRINKLIRA)</div>
        <div style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 700, marginTop: 4 }}>Pilih varian favoritmu sekarang sebelum form order ditutup!</div>
      </div>
    </div>
    <SwipeFooter bridgeText="Pesan varian favorit lo" isLast />
  </div>
);

/* =========================================================================
   CAROUSEL 13: 5 RUTINITAS MAHASISWA & CODER
   ========================================================================= */

export const Rutinitas_Slide1: React.FC = () => (
  <div style={containerStyle}>
    <TopBar category="DEEP WORK GUIDE" slideNum="01 / 04" />
    <h1 style={{ fontSize: 42, fontWeight: 900, lineHeight: 1.15, marginBottom: 12 }}>
      RUTINITAS CODER & STUDENT:<br />
      <span style={{ color: '#39FF88' }}>FLOW STATE TANPA BRAIN FOG.</span>
    </h1>
    <p style={{ fontSize: 20, color: '#CBD5E1', lineHeight: 1.4, marginBottom: 20 }}>
      Gimana caranya ngerjain tugas & coding seharian tanpa lemes jam 2 siang? Ini jam ideal minum Lira.
    </p>
    <div style={{ flex: 1, borderRadius: 20, overflow: 'hidden', border: '2px solid rgba(57, 255, 136, 0.3)', position: 'relative' }}>
      <Img src={staticFile('assets/pixel/scene_5_laptop_a.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, backgroundColor: 'rgba(15,23,42,0.92)', border: '1.5px solid #39FF88', borderRadius: 14, padding: '12px 18px' }}>
        <div style={{ color: '#39FF88', fontWeight: 800, fontSize: 16 }}>PRODUCTIVITY TIMELINE</div>
        <div style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 700 }}>Ritual harian para builders & high performers.</div>
      </div>
    </div>
    <SwipeFooter bridgeText="Jadwal Pagi & Siang: 09:00 - 13:00" />
  </div>
);

export const Rutinitas_Slide2: React.FC = () => (
  <div style={containerStyle}>
    <TopBar category="TIMELINE HARIAN" slideNum="02 / 04" />
    <h1 style={{ fontSize: 38, fontWeight: 900, lineHeight: 1.2, marginBottom: 16 }}>
      09:00 SPRINT AWAL &<br />
      <span style={{ color: '#FCD34D' }}>13:00 ANTI-CRASH WINDOW.</span>
    </h1>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 18 }}>
      <div style={{ backgroundColor: '#1E293B', padding: '16px 20px', borderRadius: 16, borderLeft: '5px solid #34D399' }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#34D399', marginBottom: 4 }}>09:00 WIB — MATCHA CLASSIC (19K)</div>
        <div style={{ fontSize: 16, color: '#CBD5E1', lineHeight: 1.4 }}>
          L-Theanine murni dari daun Jepang membangunkan fokus secara halus tanpa debar jantung atau perih di lambung.
        </div>
      </div>
      <div style={{ backgroundColor: '#1E293B', padding: '16px 20px', borderRadius: 16, borderLeft: '5px solid #FCD34D' }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#FCD34D', marginBottom: 4 }}>13:00 WIB — MATCHA OATSIDE (24K)</div>
        <div style={{ fontSize: 16, color: '#CBD5E1', lineHeight: 1.4 }}>
          Pengganti kopi bergula. Nol gula pasir (100% stevia) memastikan lo terbebas dari ngantuk berat pasca makan siang.
        </div>
      </div>
    </div>
    <div style={{ flex: 1, borderRadius: 18, overflow: 'hidden', border: '1.5px solid rgba(252, 211, 77, 0.3)' }}>
      <Img src={staticFile('assets/pixel/scene_3_campus.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
    <SwipeFooter bridgeText="Jadwal Sore & Malam: 16:00 - 20:00" />
  </div>
);

export const Rutinitas_Slide3: React.FC = () => (
  <div style={containerStyle}>
    <TopBar category="SORE & MALAM" slideNum="03 / 04" />
    <h1 style={{ fontSize: 38, fontWeight: 900, lineHeight: 1.2, marginBottom: 16 }}>
      16:00 CODE SPRINT &<br />
      <span style={{ color: '#F87171' }}>20:00 CHILL RESET.</span>
    </h1>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 18 }}>
      <div style={{ backgroundColor: '#1E293B', padding: '16px 20px', borderRadius: 16, borderLeft: '5px solid #F87171' }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#F87171', marginBottom: 4 }}>16:00 WIB — CHOCO HAZELNUT (22K)</div>
        <div style={{ fontSize: 16, color: '#CBD5E1', lineHeight: 1.4 }}>
          Reward mood booster buat nuntasin revisi kode & deadline. Gurih kakao dan hazelnut bikin otak rileks.
        </div>
      </div>
      <div style={{ backgroundColor: '#1E293B', padding: '16px 20px', borderRadius: 16, borderLeft: '5px solid #38BDF8' }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#38BDF8', marginBottom: 4 }}>20:00 WIB — MILK TEA ARTISAN (15K)</div>
        <div style={{ fontSize: 16, color: '#CBD5E1', lineHeight: 1.4 }}>
          Kenyamanan klasik santai malam sambil evaluasi to-do list besok.
        </div>
      </div>
    </div>
    <div style={{ flex: 1, borderRadius: 18, overflow: 'hidden', border: '1.5px solid rgba(248, 113, 113, 0.3)' }}>
      <Img src={staticFile('assets/pixel/insider_caleb_desk_b.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
    <SwipeFooter bridgeText="Stok Mingguan di Kulkas Lo" />
  </div>
);

export const Rutinitas_Slide4: React.FC = () => (
  <div style={containerStyle}>
    <TopBar category="ORDER ROUTINE" slideNum="04 / 04" />
    <h1 style={{ fontSize: 38, fontWeight: 900, lineHeight: 1.2, marginBottom: 12 }}>
      SIMPAN DI KULKAS:<br />
      <span style={{ color: '#39FF88' }}>SIAP KERJA KAPAN SAJA.</span>
    </h1>
    <p style={{ fontSize: 19, color: '#CBD5E1', lineHeight: 1.4, marginBottom: 18 }}>
      Botol PET silinder bersegel rapat. Diseduh fresh, tanpa bahan pengawet kimia, tahan optimal di kulkas hingga 5 hari.
    </p>
    <div style={{ flex: 1, borderRadius: 20, overflow: 'hidden', border: '2px solid rgba(57, 255, 136, 0.4)', position: 'relative' }}>
      <Img src={staticFile('assets/pixel/s2_chiller_a.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, backgroundColor: 'rgba(15,23,42,0.94)', border: '2px solid #39FF88', borderRadius: 16, padding: '16px 20px', textAlign: 'center' }}>
        <div style={{ color: '#39FF88', fontWeight: 900, fontSize: 20 }}>STOK FOKUS MINGGUAN LO SEKARANG</div>
        <div style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 700, marginTop: 4 }}>Amankan kuota batch Sabtu via link di bio (@drinklira)</div>
      </div>
    </div>
    <SwipeFooter bridgeText="Pesan stok mingguan lo" isLast />
  </div>
);

/* =========================================================================
   CAROUSEL 14: BOTOL SIAP MINUM VS CUP TAKEAWAY KAFE
   ========================================================================= */

export const BotolVsCup_Slide1: React.FC = () => (
  <div style={containerStyle}>
    <TopBar category="HEAD TO HEAD" slideNum="01 / 04" />
    <h1 style={{ fontSize: 44, fontWeight: 900, lineHeight: 1.15, marginBottom: 12 }}>
      KENAPA BOTOL LIRA<br />
      <span style={{ color: '#39FF88' }}>LEBIH UNGGUL DARI CUP KAFE?</span>
    </h1>
    <p style={{ fontSize: 20, color: '#CBD5E1', lineHeight: 1.4, marginBottom: 20 }}>
      Kita semua pernah bayar 55 ribu cuma buat dapet es batu mencair dan tutup cup yang rawan tumpah di atas laptop.
    </p>
    <div style={{ flex: 1, borderRadius: 20, overflow: 'hidden', border: '2px solid rgba(57, 255, 136, 0.3)', position: 'relative' }}>
      <Img src={staticFile('assets/pixel/carousel_cover_caleb.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, backgroundColor: 'rgba(15,23,42,0.92)', border: '1.5px solid #39FF88', borderRadius: 14, padding: '12px 18px' }}>
        <div style={{ color: '#39FF88', fontWeight: 800, fontSize: 16 }}>PERBANDINGAN REALISTIS</div>
        <div style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 700 }}>Kenyamanan botol artisan vs drama cup takeaway sekali pakai.</div>
      </div>
    </div>
    <SwipeFooter bridgeText="Masalah 1 & 2: Es Batu & Tutup Copot" />
  </div>
);

export const BotolVsCup_Slide2: React.FC = () => (
  <div style={containerStyle}>
    <TopBar category="DRAMA CUP KAFE" slideNum="02 / 04" />
    <h1 style={{ fontSize: 38, fontWeight: 900, lineHeight: 1.2, marginBottom: 14 }}>
      CUP PLASTIK KAFE:<br />
      <span style={{ color: '#FF6B6B' }}>ES MENCAIR & RAWAN BOCOR.</span>
    </h1>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
      <div style={{ backgroundColor: '#1E293B', padding: '12px 18px', borderRadius: 14, borderLeft: '4px solid #FF6B6B' }}>
        <div style={{ color: '#FF6B6B', fontWeight: 800, fontSize: 16 }}>70% ES PENGENCER</div>
        <div style={{ color: '#CBD5E1', fontSize: 15 }}>Setelah 15 menit, rasa matcha pekat berubah jadi air tawar dingin.</div>
      </div>
      <div style={{ backgroundColor: '#1E293B', padding: '12px 18px', borderRadius: 14, borderLeft: '4px solid #FF6B6B' }}>
        <div style={{ color: '#FF6B6B', fontWeight: 800, fontSize: 16 }}>TUTUP TIPIS RAWAN TERTUMPAH</div>
        <div style={{ color: '#CBD5E1', fontSize: 15 }}>Mustahil dimasukkan ke ransel atau tas laptop tanpa risiko bencana.</div>
      </div>
    </div>
    <div style={{ flex: 1, borderRadius: 18, overflow: 'hidden', border: '1.5px solid rgba(255, 107, 107, 0.4)' }}>
      <Img src={staticFile('assets/pixel/carousel_melted_ice.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
    <SwipeFooter bridgeText="Solusi Lira: Botol Silinder Sealed" />
  </div>
);

export const BotolVsCup_Slide3: React.FC = () => (
  <div style={containerStyle}>
    <TopBar category="SOLUSI LIRA" slideNum="03 / 04" />
    <h1 style={{ fontSize: 38, fontWeight: 900, lineHeight: 1.2, marginBottom: 14 }}>
      SOLUSI BOTOL LIRA:<br />
      <span style={{ color: '#39FF88' }}>180° ANTI BOCOR, RASA TETAP PEKAT.</span>
    </h1>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
      <div style={{ backgroundColor: '#1E293B', padding: '12px 18px', borderRadius: 14, borderLeft: '4px solid #39FF88' }}>
        <div style={{ color: '#39FF88', fontWeight: 800, fontSize: 16 }}>✓ TANPA ES PENGENCER</div>
        <div style={{ color: '#CBD5E1', fontSize: 15 }}>100% konsentrat matcha murni + susu Oatside. Rasa pekat sampai tetes terakhir.</div>
      </div>
      <div style={{ backgroundColor: '#1E293B', padding: '12px 18px', borderRadius: 14, borderLeft: '4px solid #39FF88' }}>
        <div style={{ color: '#39FF88', fontWeight: 800, fontSize: 16 }}>✓ GOLD CAP SEALED KEDAP UDARA</div>
        <div style={{ color: '#CBD5E1', fontSize: 15 }}>Dibalik 180° di atas keyboard laptop pun aman. Tinggal lempar ke tas.</div>
      </div>
    </div>
    <div style={{ flex: 1, borderRadius: 18, overflow: 'hidden', border: '1.5px solid rgba(57, 255, 136, 0.4)' }}>
      <Img src={staticFile('assets/pixel/cup_struggle/s3_inverted_a.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
    <SwipeFooter bridgeText="Bandingkan Harganya: 24k vs 55k" />
  </div>
);

export const BotolVsCup_Slide4: React.FC = () => (
  <div style={containerStyle}>
    <TopBar category="VALUE & HARGA" slideNum="04 / 04" />
    <h1 style={{ fontSize: 38, fontWeight: 900, lineHeight: 1.2, marginBottom: 12 }}>
      KUALITAS LEBIH TINGGI,<br />
      <span style={{ color: '#39FF88' }}>HARGA JAUH LEBIH JUJUR.</span>
    </h1>
    <p style={{ fontSize: 19, color: '#CBD5E1', lineHeight: 1.4, marginBottom: 18 }}>
      Di kafe lo bayar Rp 55.000 buat es batu dan sewa mall. Di Lira, Matcha Oatside cuma Rp 24.000!
    </p>
    <div style={{ flex: 1, backgroundColor: '#0F172A', borderRadius: 20, border: '2px solid #39FF88', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
        <div style={{ backgroundColor: '#1E293B', padding: '14px 18px', borderRadius: 14, borderLeft: '5px solid #FCD34D' }}>
          <div style={{ fontSize: 15, color: '#94A3B8', fontWeight: 700 }}>MILK TEA</div>
          <div style={{ fontSize: 24, color: '#FCD34D', fontWeight: 900 }}>Rp 15.000</div>
        </div>
        <div style={{ backgroundColor: '#1E293B', padding: '14px 18px', borderRadius: 14, borderLeft: '5px solid #34D399' }}>
          <div style={{ fontSize: 15, color: '#94A3B8', fontWeight: 700 }}>MATCHA CLASSIC</div>
          <div style={{ fontSize: 24, color: '#34D399', fontWeight: 900 }}>Rp 19.000</div>
        </div>
        <div style={{ backgroundColor: '#1E293B', padding: '14px 18px', borderRadius: 14, borderLeft: '5px solid #F87171' }}>
          <div style={{ fontSize: 15, color: '#94A3B8', fontWeight: 700 }}>CHOCO HAZELNUT</div>
          <div style={{ fontSize: 24, color: '#F87171', fontWeight: 900 }}>Rp 22.000</div>
        </div>
        <div style={{ backgroundColor: '#1E293B', padding: '14px 18px', borderRadius: 14, borderLeft: '5px solid #39FF88' }}>
          <div style={{ fontSize: 15, color: '#94A3B8', fontWeight: 700 }}>MATCHA OATSIDE</div>
          <div style={{ fontSize: 24, color: '#39FF88', fontWeight: 900 }}>Rp 24.000</div>
        </div>
      </div>
      <div style={{ textAlign: 'center', color: '#CBD5E1', fontSize: 16 }}>
        Limited batch artisan. Order sekarang via link di bio (@drinklira).
      </div>
    </div>
    <SwipeFooter bridgeText="Beralih ke botol Lira sekarang" isLast />
  </div>
);

/* =========================================================================
   CAROUSEL 15: PRE-ORDER CHECKLIST CARA AMANKAN BATCH
   ========================================================================= */

export const PreorderChecklist_Slide1: React.FC = () => (
  <div style={containerStyle}>
    <TopBar category="ORDER GUIDE" slideNum="01 / 04" />
    <h1 style={{ fontSize: 44, fontWeight: 900, lineHeight: 1.15, marginBottom: 12 }}>
      CHECKLIST PRE-ORDER:<br />
      <span style={{ color: '#39FF88' }}>CARA AMANKAN KUOTA BATCH SABTU.</span>
    </h1>
    <p style={{ fontSize: 20, color: '#CBD5E1', lineHeight: 1.4, marginBottom: 20 }}>
      Batch artisan Lira selalu cepat sold out karena diseduh segar satu per satu. Ikuti 3 langkah mudah ini biar gak kehabisan.
    </p>
    <div style={{ flex: 1, borderRadius: 20, overflow: 'hidden', border: '2px solid rgba(57, 255, 136, 0.3)', position: 'relative' }}>
      <Img src={staticFile('assets/pixel/tutorial/s1_phone_a.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, backgroundColor: 'rgba(15,23,42,0.92)', border: '1.5px solid #39FF88', borderRadius: 14, padding: '12px 18px' }}>
        <div style={{ color: '#39FF88', fontWeight: 800, fontSize: 16 }}>TUTORIAL CEPAT</div>
        <div style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 700 }}>Hanya butuh 60 detik untuk amankan botol lo.</div>
      </div>
    </div>
    <SwipeFooter bridgeText="Langkah 1: Klik Link di Bio" />
  </div>
);

export const PreorderChecklist_Slide2: React.FC = () => (
  <div style={containerStyle}>
    <TopBar category="LANGKAH 1 & 2" slideNum="02 / 04" />
    <h1 style={{ fontSize: 38, fontWeight: 900, lineHeight: 1.2, marginBottom: 14 }}>
      LANGKAH 1 & 2:<br />
      <span style={{ color: '#34D399' }}>PILIH VARIAN & JUMLAH BOTOL.</span>
    </h1>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 18 }}>
      <div style={{ backgroundColor: '#1E293B', padding: '16px 20px', borderRadius: 16, borderLeft: '5px solid #39FF88' }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#39FF88', marginBottom: 4 }}>1. BUKA LINK DI BIO (@DRINKLIRA)</div>
        <div style={{ fontSize: 16, color: '#CBD5E1', lineHeight: 1.4 }}>
          Klik tautan resmi pemesanan di bio profil kami untuk masuk ke form order batch Sabtu.
        </div>
      </div>
      <div style={{ backgroundColor: '#1E293B', padding: '16px 20px', borderRadius: 16, borderLeft: '5px solid #FCD34D' }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#FCD34D', marginBottom: 4 }}>2. TENTUKAN MENU FAVORITMU</div>
        <div style={{ fontSize: 16, color: '#CBD5E1', lineHeight: 1.4 }}>
          Pilih Milk Tea (15k), Classic (19k), Choco (22k), atau Oatside (24k). Rekomendasi: pesan paket 3–4 botol untuk stok seminggu.
        </div>
      </div>
    </div>
    <div style={{ flex: 1, borderRadius: 18, overflow: 'hidden', border: '1.5px solid rgba(52, 211, 153, 0.3)' }}>
      <Img src={staticFile('assets/pixel/tutorial/s1_phone_b.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
    <SwipeFooter bridgeText="Langkah 3: Pengiriman Instan Sabtu Pagi" />
  </div>
);

export const PreorderChecklist_Slide3: React.FC = () => (
  <div style={containerStyle}>
    <TopBar category="PENGIRIMAN" slideNum="03 / 04" />
    <h1 style={{ fontSize: 38, fontWeight: 900, lineHeight: 1.2, marginBottom: 14 }}>
      LANGKAH 3:<br />
      <span style={{ color: '#FFE566' }}>PENGIRIMAN GOJEK SABTU PAGI.</span>
    </h1>
    <div style={{ backgroundColor: '#1E293B', padding: '16px 20px', borderRadius: 16, borderLeft: '5px solid #FFE566', marginBottom: 18 }}>
      <div style={{ fontSize: 18, fontWeight: 800, color: '#FFE566', marginBottom: 4 }}>PENGANTARAN LANGSUNG KE DEPAN PINTU</div>
      <div style={{ fontSize: 16, color: '#CBD5E1', lineHeight: 1.4 }}>
        Diseduh segar Jumat malam, lalu dikirim via kurir Gojek langsung ke alamat rumah/kosan lo Sabtu pagi dalam boks insulated aman.
      </div>
    </div>
    <div style={{ flex: 1, borderRadius: 18, overflow: 'hidden', border: '1.5px solid rgba(255, 229, 102, 0.4)' }}>
      <Img src={staticFile('assets/pixel/tutorial/s4_gojek_a.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
    <SwipeFooter bridgeText="Slot Kuota Sangat Terbatas" />
  </div>
);

export const PreorderChecklist_Slide4: React.FC = () => (
  <div style={containerStyle}>
    <TopBar category="KUOTA ARTISAN" slideNum="04 / 04" />
    <h1 style={{ fontSize: 38, fontWeight: 900, lineHeight: 1.2, marginBottom: 12 }}>
      SLOT BATCH TERBATAS:<br />
      <span style={{ color: '#39FF88' }}>AMANKAN BOTOL LO HARI INI.</span>
    </h1>
    <p style={{ fontSize: 19, color: '#CBD5E1', lineHeight: 1.4, marginBottom: 18 }}>
      Begitu kuota mingguan terpenuhi, form order otomatis ditutup sampai batch minggu depannya.
    </p>
    <div style={{ flex: 1, borderRadius: 20, overflow: 'hidden', border: '2px solid rgba(57, 255, 136, 0.4)', position: 'relative' }}>
      <Img src={staticFile('assets/pixel/caleb_running_delivery.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, backgroundColor: 'rgba(15,23,42,0.94)', border: '2px solid #39FF88', borderRadius: 16, padding: '16px 20px', textAlign: 'center' }}>
        <div style={{ color: '#39FF88', fontWeight: 900, fontSize: 20 }}>KLIK LINK DI BIO (@DRINKLIRA) SEKARANG</div>
        <div style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 700, marginTop: 4 }}>Amankan slot pengiriman batch Sabtu sebelum ditutup!</div>
      </div>
    </div>
    <SwipeFooter bridgeText="Amankan kuota botol lo" isLast />
  </div>
);
