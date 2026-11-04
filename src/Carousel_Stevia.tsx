import React from 'react';
import { staticFile, Img } from 'remotion';

// 4:5 Instagram Carousel standard (1080 x 1350)
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
  padding: '56px 64px 44px 64px',
  boxSizing: 'border-box',
  position: 'relative',
  overflow: 'hidden',
};

const SERIF_ITALIC = '"Playfair Display", Georgia, serif';

// Top Bar
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
    marginBottom: 24,
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
      <div style={{
        color: '#9CA3AF',
        fontSize: 18,
        fontWeight: 700,
      }}>
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

// Swipe Footer
const SwipeFooter: React.FC<{
  bridgeText: string;
  isLast?: boolean;
}> = ({ bridgeText, isLast = false }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 18,
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

// ==========================================
// CAROUSEL 1 - SLIDE 1: HOOK (STEVIA VS GULA PASIR)
// ==========================================
export const SteviaSlide1: React.FC = () => (
  <div style={containerStyle}>
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&family=Playfair+Display:ital,wght@1,700;1,900&display=swap"
    />
    <TopBar category="INGREDIENT TRUTH" categoryColor="#39FF88" slideNum="01 / 04" />

    <div style={{ marginBottom: 20, zIndex: 20 }}>
      <h1 style={{
        fontSize: 48,
        fontWeight: 900,
        lineHeight: 1.15,
        letterSpacing: '-0.03em',
        margin: '0 0 12px 0',
      }}>
        Kenapa matcha kafe bikin <span style={{
          fontFamily: SERIF_ITALIC,
          fontStyle: 'italic',
          color: '#FF5E7E',
          textDecoration: 'underline wavy #FF5E7E66',
        }}>crash & ngantuk</span>, tapi Lira bikin fokus 6 jam?
      </h1>
      <p style={{
        fontSize: 20,
        color: '#9CA3AF',
        margin: 0,
        fontWeight: 600,
        lineHeight: 1.35,
      }}>
        Bukan salah matchanya. Ini rahasia formulasi pemanis alami stevia drops vs sirup gula pasir.
      </p>
    </div>

    <div style={{
      flex: 1,
      borderRadius: 22,
      overflow: 'hidden',
      position: 'relative',
      border: '1.5px solid rgba(57, 255, 136, 0.25)',
      boxShadow: '0 24px 50px rgba(0, 0, 0, 0.7)',
      backgroundColor: '#12161F',
    }}>
      <Img
        src={staticFile('assets/pixel/caleb_pouring_matcha.jpg')}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(7, 10, 14, 0.94) 0%, rgba(7, 10, 14, 0.35) 45%, transparent 70%)',
      }} />

      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(12, 17, 24, 0.94)',
        backdropFilter: 'blur(16px)',
        border: '1.5px solid rgba(57, 255, 136, 0.4)',
        borderRadius: 16,
        padding: '18px 22px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <div style={{ color: '#39FF88', fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            ✓ FORMULASI BERSIH
          </div>
          <div style={{ color: '#FFFFFF', fontSize: 21, fontWeight: 800, marginTop: 4 }}>
            Pure Japanese Premium Matcha + Stevia
          </div>
        </div>
        <div style={{
          backgroundColor: '#39FF88',
          color: '#070A0E',
          fontWeight: 900,
          fontSize: 15,
          padding: '10px 18px',
          borderRadius: 10,
        }}>
          0 GULA PASIR
        </div>
      </div>
    </div>

    <SwipeFooter bridgeText="FAKTA #1: PERANGKAP GULA KAFE" />
  </div>
);

// ==========================================
// CAROUSEL 1 - SLIDE 2: THE SUGAR SPIKE TRAP (WITH PIXEL CALEB STRESSED)
// ==========================================
export const SteviaSlide2: React.FC = () => (
  <div style={containerStyle}>
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&family=Playfair+Display:ital,wght@1,700;1,900&display=swap"
    />
    <TopBar category="THE PROBLEM" categoryColor="#FF5E7E" categoryBg="rgba(255, 94, 126, 0.14)" slideNum="02 / 04" />

    <div style={{ marginBottom: 20, zIndex: 20 }}>
      <h1 style={{
        fontSize: 44,
        fontWeight: 900,
        lineHeight: 1.15,
        letterSpacing: '-0.02em',
        margin: '0 0 10px 0',
      }}>
        30 Gram Gula Pasir Tersembunyi: Lonjakan Glukosa & Sugar Crash.
      </h1>
      <p style={{
        fontSize: 19,
        color: '#9CA3AF',
        margin: 0,
        fontWeight: 600,
        lineHeight: 1.35,
      }}>
        Kafe menyiram sirup gula masif buat menutupi matcha murah yang pahit. Ini yang terjadi ke tubuh lo:
      </p>
    </div>

    {/* Visual Image Area: Caleb Stressed at Desk */}
    <div style={{
      flex: 1,
      borderRadius: 22,
      overflow: 'hidden',
      position: 'relative',
      border: '1.5px solid rgba(255, 94, 126, 0.35)',
      boxShadow: '0 24px 50px rgba(0, 0, 0, 0.7)',
      backgroundColor: '#12161F',
    }}>
      <Img
        src={staticFile('assets/pixel/scene_6_stressed_a.jpg')}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(7, 10, 14, 0.95) 0%, rgba(7, 10, 14, 0.4) 55%, transparent 80%)',
      }} />

      {/* Floating Insight Card */}
      <div style={{
        position: 'absolute',
        bottom: 18,
        left: 18,
        right: 18,
        backgroundColor: 'rgba(12, 17, 24, 0.94)',
        backdropFilter: 'blur(16px)',
        border: '1.5px solid rgba(255, 94, 126, 0.4)',
        borderRadius: 16,
        padding: '18px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: '#FF5E7E', fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            SIKLUS SUGAR CRASH
          </div>
          <div style={{
            backgroundColor: 'rgba(255, 94, 126, 0.15)',
            color: '#FF5E7E',
            fontSize: 12,
            fontWeight: 800,
            padding: '4px 10px',
            borderRadius: 6,
          }}>
            INSULIN ROLLERCOASTER
          </div>
        </div>
        <div style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 700, lineHeight: 1.35 }}>
          <span style={{ color: '#FF5E7E', fontWeight: 800 }}>Jam ke-2:</span> Insulin banjir menekan gula darah jatuh. Otak mendadak lemas, kepala berat, dan daya fokus ambyar pas kerjaan numpuk.
        </div>
      </div>
    </div>

    <SwipeFooter bridgeText="SOLUSI LIRA: NATURAL STEVIA" />
  </div>
);

// ==========================================
// CAROUSEL 1 - SLIDE 3: THE CLEAN STEVIA FORMULATION (WITH PIXEL CALEB AT DESK)
// ==========================================
export const SteviaSlide3: React.FC = () => (
  <div style={containerStyle}>
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&family=Playfair+Display:ital,wght@1,700;1,900&display=swap"
    />
    <TopBar category="THE LIRA FORMULA" categoryColor="#39FF88" slideNum="03 / 04" />

    <div style={{ marginBottom: 20, zIndex: 20 }}>
      <h1 style={{
        fontSize: 44,
        fontWeight: 900,
        lineHeight: 1.15,
        letterSpacing: '-0.02em',
        margin: '0 0 10px 0',
      }}>
        Solusi Lira: Pure Japanese Premium Matcha & Pemanis Alami Stevia.
      </h1>
      <p style={{
        fontSize: 19,
        color: '#9CA3AF',
        margin: 0,
        fontWeight: 600,
        lineHeight: 1.35,
      }}>
        Kita menolak resep gula murahan. Lira mengombinasikan 3 bahan premium tanpa kompromi:
      </p>
    </div>

    {/* Visual Image Area: Caleb Focused at Desk with Matcha Bottle */}
    <div style={{
      flex: 1,
      borderRadius: 22,
      overflow: 'hidden',
      position: 'relative',
      border: '1.5px solid rgba(57, 255, 136, 0.3)',
      boxShadow: '0 24px 50px rgba(0, 0, 0, 0.7)',
      backgroundColor: '#12161F',
    }}>
      <Img
        src={staticFile('assets/pixel/insider_caleb_desk_a.jpg')}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(7, 10, 14, 0.95) 0%, rgba(7, 10, 14, 0.35) 55%, transparent 80%)',
      }} />

      {/* 3 Pillars Summary Overlay */}
      <div style={{
        position: 'absolute',
        bottom: 18,
        left: 18,
        right: 18,
        backgroundColor: 'rgba(12, 17, 24, 0.94)',
        backdropFilter: 'blur(16px)',
        border: '1.5px solid rgba(57, 255, 136, 0.4)',
        borderRadius: 16,
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}>
        <div style={{ color: '#39FF88', fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          ✓ 3 PILAR ENERGI BERSIH LIRA
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '10px 12px', borderRadius: 10 }}>
            <div style={{ color: '#39FF88', fontSize: 13, fontWeight: 800 }}>100% Stevia Drops</div>
            <div style={{ color: '#D1D5DB', fontSize: 13, fontWeight: 600, marginTop: 2 }}>Zero gula pasir & zero glycemic spike.</div>
          </div>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '10px 12px', borderRadius: 10 }}>
            <div style={{ color: '#39FF88', fontSize: 13, fontWeight: 800 }}>Pure Premium Matcha</div>
            <div style={{ color: '#D1D5DB', fontSize: 13, fontWeight: 600, marginTop: 2 }}>Grade Jepang asli, umami alami & l-theanine.</div>
          </div>
        </div>
      </div>
    </div>

    <SwipeFooter bridgeText="LIMITED BATCH SABTU INI" />
  </div>
);

// ==========================================
// CAROUSEL 1 - SLIDE 4: BOFU SCARCITY & CTA
// ==========================================
export const SteviaSlide4: React.FC = () => (
  <div style={containerStyle}>
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&family=Playfair+Display:ital,wght@1,700;1,900&display=swap"
    />
    <TopBar category="DROP SABTU" categoryColor="#FFE566" categoryBg="rgba(255, 229, 102, 0.14)" slideNum="04 / 04" />

    <div style={{ marginBottom: 20, zIndex: 20 }}>
      <h1 style={{
        fontSize: 48,
        fontWeight: 900,
        lineHeight: 1.15,
        letterSpacing: '-0.03em',
        margin: '0 0 12px 0',
      }}>
        Fokus Bersih Tanpa Sugar Crash Mulai Sabtu Ini.
      </h1>
      <p style={{
        fontSize: 20,
        color: '#9CA3AF',
        margin: 0,
        fontWeight: 600,
        lineHeight: 1.35,
      }}>
        Setiap botol Lira diseduh manual fresh tiap Jumat malam, disegel rapat 180° anti-bocor, dan siap nemenin lo produktif seharian.
      </p>
    </div>

    <div style={{
      flex: 1,
      borderRadius: 22,
      overflow: 'hidden',
      position: 'relative',
      border: '1.5px solid rgba(255, 229, 102, 0.35)',
      boxShadow: '0 24px 50px rgba(0, 0, 0, 0.7)',
      backgroundColor: '#12161F',
    }}>
      <Img
        src={staticFile('assets/pixel/caleb_point_hero.jpg')}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(7, 10, 14, 0.94) 0%, rgba(7, 10, 14, 0.3) 50%, transparent 70%)',
      }} />

      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(12, 17, 24, 0.94)',
        backdropFilter: 'blur(16px)',
        border: '1.5px solid rgba(255, 229, 102, 0.4)',
        borderRadius: 16,
        padding: '18px 22px',
      }}>
        <div style={{
          color: '#FFE566',
          fontSize: 13,
          fontWeight: 900,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: 4,
        }}>
          LIMITED BATCH AVAILABLE
        </div>
        <div style={{ color: '#FFFFFF', fontSize: 21, fontWeight: 900, marginBottom: 12 }}>
          Drop Batch Sabtu Ini Lewat Link di Bio!
        </div>
        <div style={{
          backgroundColor: '#39FF88',
          color: '#070A0E',
          fontWeight: 900,
          fontSize: 16,
          padding: '12px 18px',
          borderRadius: 12,
          textAlign: 'center',
          letterSpacing: '0.04em',
        }}>
          AMANKAN SLOT DI LINK BIO →
        </div>
      </div>
    </div>

    <SwipeFooter bridgeText="CRAFTED SOLO BY @CALEB766H1" isLast />
  </div>
);
