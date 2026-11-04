import React from 'react';
import { staticFile, Img } from 'remotion';

// 4:5 Instagram Carousel standard (1080 x 1350)
const containerStyle: React.CSSProperties = {
  width: 1080,
  height: 1350,
  backgroundColor: '#070A0E',
  backgroundImage: `
    radial-gradient(circle at 50% 0%, rgba(255, 184, 0, 0.12) 0%, transparent 60%),
    radial-gradient(circle at 100% 100%, rgba(57, 255, 136, 0.06) 0%, transparent 50%),
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
  categoryColor = '#FFB800',
  categoryBg = 'rgba(255, 184, 0, 0.14)',
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
      color: isLast ? '#FFE566' : '#FFB800',
      fontSize: 16,
      fontWeight: 800,
    }}>
      <span>{isLast ? 'LINK DI BIO' : 'SWIPE NEXT'}</span>
      <span style={{ fontSize: 20 }}>→</span>
    </div>
  </div>
);

// ==========================================
// CAROUSEL 2 - SLIDE 1: HOOK (FOUNDER ORIGIN)
// ==========================================
export const FounderSlide1: React.FC = () => (
  <div style={containerStyle}>
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&family=Playfair+Display:ital,wght@1,700;1,900&display=swap"
    />
    <TopBar category="FOUNDER STORY" categoryColor="#FFB800" slideNum="01 / 04" />

    <div style={{ marginBottom: 20, zIndex: 20 }}>
      <h1 style={{
        fontSize: 48,
        fontWeight: 900,
        lineHeight: 1.15,
        letterSpacing: '-0.03em',
        margin: '0 0 12px 0',
      }}>
        Gue bikin Lira karena <span style={{
          fontFamily: SERIF_ITALIC,
          fontStyle: 'italic',
          color: '#FF5E7E',
          textDecoration: 'underline wavy #FF5E7E66',
        }}>kesel bayar 50k</span> cuma buat dapet air es dilute.
      </h1>
      <p style={{
        fontSize: 20,
        color: '#9CA3AF',
        margin: 0,
        fontWeight: 600,
        lineHeight: 1.35,
      }}>
        Sebagai mahasiswa yang ngoding dan nulis tiap hari di depan laptop, cup plastik kafe itu jebakan terbesar.
      </p>
    </div>

    <div style={{
      flex: 1,
      borderRadius: 22,
      overflow: 'hidden',
      position: 'relative',
      border: '1.5px solid rgba(255, 184, 0, 0.25)',
      boxShadow: '0 24px 50px rgba(0, 0, 0, 0.7)',
      backgroundColor: '#12161F',
    }}>
      <Img
        src={staticFile('assets/pixel/scene_5_laptop_a.jpg')}
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
        border: '1.5px solid rgba(255, 184, 0, 0.4)',
        borderRadius: 16,
        padding: '18px 22px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <div style={{ color: '#FFB800', fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            ORIGIN STORY
          </div>
          <div style={{ color: '#FFFFFF', fontSize: 21, fontWeight: 800, marginTop: 4 }}>
            Dari Meja Belajar ke Botol Segel Siap Minum
          </div>
        </div>
        <div style={{
          backgroundColor: '#FFB800',
          color: '#070A0E',
          fontWeight: 900,
          fontSize: 15,
          padding: '10px 18px',
          borderRadius: 10,
        }}>
          SOLO FOUNDER
        </div>
      </div>
    </div>

    <SwipeFooter bridgeText="KENAPA CUP PLASTIK NGERUGIIN LO" />
  </div>
);

// ==========================================
// CAROUSEL 2 - SLIDE 2: THE CUP PLASTIC DILEMMA (WITH PIXEL CALEB STRUGGLE)
// ==========================================
export const FounderSlide2: React.FC = () => (
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
        Cup Plastik Bukan Didesain Buat Lo Yang Bawa Laptop.
      </h1>
      <p style={{
        fontSize: 19,
        color: '#9CA3AF',
        margin: 0,
        fontWeight: 600,
        lineHeight: 1.35,
      }}>
        Es mencair mengencerkan rasa, satu tangan tersandera, dan cemas tumpah ke keyboard:
      </p>
    </div>

    {/* Visual Image Area: Caleb Annoyed at Desk with Sweating Cup */}
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
        src={staticFile('assets/pixel/cup_struggle/s1_typing_cup.jpg')}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(7, 10, 14, 0.95) 0%, rgba(7, 10, 14, 0.35) 55%, transparent 80%)',
      }} />

      {/* 3 Cup Frustrations Overlay */}
      <div style={{
        position: 'absolute',
        bottom: 18,
        left: 18,
        right: 18,
        backgroundColor: 'rgba(12, 17, 24, 0.94)',
        backdropFilter: 'blur(16px)',
        border: '1.5px solid rgba(255, 94, 126, 0.4)',
        borderRadius: 16,
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}>
        <div style={{ color: '#FF5E7E', fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          3 PENYIKSAAN CUP PLASTIK KAFE
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 700 }}>
            • <span style={{ color: '#FF5E7E' }}>15 Menit:</span> Es mencair total, matcha pekat 50k jadi air tawar dingin.
          </div>
          <div style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 700 }}>
            • <span style={{ color: '#FF5E7E' }}>Tersandera:</span> Gak bisa masuk tas ransel, tangan harus megang terus.
          </div>
          <div style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 700 }}>
            • <span style={{ color: '#FF5E7E' }}>Bahaya Laptop:</span> Kondensasi air becek dan resiko senggolan maut.
          </div>
        </div>
      </div>
    </div>

    <SwipeFooter bridgeText="LAHIRNYA BOTOL SEGEL LIRA" />
  </div>
);

// ==========================================
// CAROUSEL 2 - SLIDE 3: THE BOTTLE & RP 34K GENESIS (INVERTED BOTTLE PROOF)
// ==========================================
export const FounderSlide3: React.FC = () => (
  <div style={containerStyle}>
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&family=Playfair+Display:ital,wght@1,700;1,900&display=swap"
    />
    <TopBar category="THE PROTOTYPE" categoryColor="#39FF88" slideNum="03 / 04" />

    <div style={{ marginBottom: 20, zIndex: 20 }}>
      <h1 style={{
        fontSize: 44,
        fontWeight: 900,
        lineHeight: 1.15,
        letterSpacing: '-0.02em',
        margin: '0 0 10px 0',
      }}>
        Lahirnya Botol Segel 180° Anti-Bocor Seharga Rp 34 Ribu.
      </h1>
      <p style={{
        fontSize: 19,
        color: '#9CA3AF',
        margin: 0,
        fontWeight: 600,
        lineHeight: 1.35,
      }}>
        Gue racik sendiri: murni pure Japanese premium matcha & barista oat milk tanpa es batu pengencer.
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
        src={staticFile('assets/pixel/cup_struggle/s3_inverted_a.jpg')}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(7, 10, 14, 0.94) 0%, rgba(7, 10, 14, 0.3) 45%, transparent 70%)',
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
      }}>
        <div style={{ color: '#39FF88', fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
          ✓ 180° INVERTED PROOF
        </div>
        <div style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 800 }}>
          Dibalik 180° di atas MacBook: 0 Tetes Bocor. Tahan 7 hari di kulkas.
        </div>
      </div>
    </div>

    <SwipeFooter bridgeText="BATCH SABTU SIAP DIORDER" />
  </div>
);

// ==========================================
// CAROUSEL 2 - SLIDE 4: BOFU SCARCITY & SATURDAY DROP (WITH CALEB TOTEBAG TOSS)
// ==========================================
export const FounderSlide4: React.FC = () => (
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
        Disiapkan Fresh Jumat Malam. Dikirim Dingin Hari Sabtu.
      </h1>
      <p style={{
        fontSize: 20,
        color: '#9CA3AF',
        margin: 0,
        fontWeight: 600,
        lineHeight: 1.35,
      }}>
        Bebas lo lempar ke tote bag samping laptop. Slot produksi manual terbatas tiap minggu.
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
        src={staticFile('assets/pixel/cup_struggle/s4_toss_4.jpg')}
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
          AMANKAN SLOT BOTOL LO SEKARANG →
        </div>
      </div>
    </div>

    <SwipeFooter bridgeText="CRAFTED SOLO BY @CALEB766H1" isLast />
  </div>
);
