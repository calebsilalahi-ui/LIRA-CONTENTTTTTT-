import React from 'react';
import { staticFile, Img } from 'remotion';

// Base slide container (1080 x 1350, 4:5 Instagram Carousel standard)
// High-contrast dark luxury obsidian with crisp editorial hierarchy
const containerStyle: React.CSSProperties = {
  width: 1080,
  height: 1350,
  backgroundColor: '#080B0F',
  backgroundImage: `
    radial-gradient(circle at 50% 0%, rgba(37, 211, 102, 0.09) 0%, transparent 60%),
    radial-gradient(circle at 100% 100%, rgba(255, 229, 102, 0.05) 0%, transparent 50%),
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
  `,
  backgroundSize: '100% 100%, 100% 100%, 48px 48px, 48px 48px',
  color: '#FFFFFF',
  fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, sans-serif',
  display: 'flex',
  flexDirection: 'column',
  padding: '64px 68px 52px 68px',
  boxSizing: 'border-box',
  position: 'relative',
  overflow: 'hidden',
};

// Font styles
const SERIF_ITALIC = '"Playfair Display", Georgia, serif';

// Top Editorial Bar
const TopBar: React.FC<{
  category: string;
  categoryColor?: string;
  categoryBg?: string;
  slideNum: string;
}> = ({
  category,
  categoryColor = '#39FF88',
  categoryBg = 'rgba(57, 255, 136, 0.12)',
  slideNum,
}) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    zIndex: 20,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{
        backgroundColor: categoryBg,
        border: `1px solid ${categoryColor}44`,
        color: categoryColor,
        padding: '8px 18px',
        borderRadius: 10,
        fontSize: 16,
        fontWeight: 800,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}>
        {category}
      </div>
      <div style={{
        color: '#6B7280',
        fontSize: 18,
        fontWeight: 700,
        letterSpacing: '0.02em',
      }}>
        @drinklira
      </div>
    </div>
    <div style={{
      color: '#E5E7EB',
      fontSize: 18,
      fontWeight: 800,
      letterSpacing: '0.12em',
      background: 'rgba(255, 255, 255, 0.06)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      padding: '8px 18px',
      borderRadius: 10,
    }}>
      {slideNum}
    </div>
  </div>
);

// Curiosity Swipe Footer (Viral Hook Bridge)
const SwipeFooter: React.FC<{
  bridgeText: string;
  isLast?: boolean;
}> = ({ bridgeText, isLast = false }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 24,
    borderTop: '1px solid rgba(255, 255, 255, 0.09)',
    zIndex: 20,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        backgroundColor: isLast ? '#39FF88' : '#FFE566',
        boxShadow: `0 0 12px ${isLast ? '#39FF88' : '#FFE566'}`,
      }} />
      <span style={{ fontSize: 16, color: '#9CA3AF', fontWeight: 600 }}>
        Lira Cold Batch • Drop Sabtu
      </span>
    </div>

    {/* Dynamic Swipe Pill */}
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      backgroundColor: isLast ? '#39FF88' : 'rgba(255, 255, 255, 0.08)',
      color: isLast ? '#0A0E14' : '#FFFFFF',
      border: isLast ? 'none' : '1px solid rgba(255, 255, 255, 0.16)',
      padding: '10px 22px',
      borderRadius: 30,
      fontWeight: 800,
      fontSize: 16,
      letterSpacing: '0.04em',
    }}>
      <span>{bridgeText}</span>
      <span style={{ fontSize: 20 }}>➔</span>
    </div>
  </div>
);

// ==========================================
// SLIDE 1: COVER (VIRAL HOOK FRAMEWORK)
// ==========================================
export const CarouselSlide1: React.FC = () => {
  return (
    <div style={containerStyle}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&family=Playfair+Display:ital,wght@1,700;1,900&display=swap"
      />

      <TopBar category="REALITA MINUMAN" categoryColor="#FFE566" categoryBg="rgba(255, 229, 102, 0.12)" slideNum="01 / 04" />

      {/* Main Viral Hook Headline */}
      <div style={{ marginBottom: 28, zIndex: 10 }}>
        <h1 style={{
          fontSize: 56,
          fontWeight: 900,
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          margin: '0 0 16px 0',
        }}>
          Kenapa beli minuman kafe di <span style={{
            fontFamily: SERIF_ITALIC,
            fontStyle: 'italic',
            fontWeight: 900,
            color: '#FF5E7E',
            textDecoration: 'underline wavy #FF5E7E66',
          }}>cup plastik</span> sebenernya ngerugiin lo?
        </h1>
        <p style={{
          fontSize: 22,
          color: '#9CA3AF',
          margin: 0,
          fontWeight: 600,
          lineHeight: 1.4,
        }}>
          Lo bayar 50.000 buat rasa pekat, tapi sistem cup take-away didesain bikin rugi dari detik pertama.
        </p>
      </div>

      {/* Hero Visual Card */}
      <div style={{
        flex: 1,
        borderRadius: 22,
        overflow: 'hidden',
        position: 'relative',
        border: '1.5px solid rgba(255, 255, 255, 0.14)',
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
          background: 'linear-gradient(to top, rgba(8, 11, 15, 0.92) 0%, rgba(8, 11, 15, 0.4) 35%, transparent 60%)',
        }} />

        {/* Floating Comparison Anchor (DO vs DONT hook) */}
        <div style={{
          position: 'absolute',
          bottom: 22,
          left: 22,
          right: 22,
          backgroundColor: 'rgba(15, 20, 28, 0.94)',
          backdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(255, 94, 126, 0.35)',
          borderRadius: 16,
          padding: '18px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ color: '#FF5E7E', fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              DONT: Jebakan Cup Kafe Biasa
            </div>
            <div style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 800, marginTop: 4 }}>
              Es mencair + Tangan tersandera
            </div>
          </div>
          <div style={{
            backgroundColor: '#FFE566',
            color: '#080B0F',
            fontWeight: 900,
            fontSize: 15,
            padding: '10px 18px',
            borderRadius: 10,
            letterSpacing: '0.02em',
          }}>
            3 BUKTI NYATA
          </div>
        </div>
      </div>

      <SwipeFooter bridgeText="MASALAH #1: ES BATU" />
    </div>
  );
};

// ==========================================
// SLIDE 2: PROBLEM 1 (MELTED ICE DILUTION)
// ==========================================
export const CarouselSlide2: React.FC = () => {
  return (
    <div style={containerStyle}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&family=Playfair+Display:ital,wght@1,700;1,900&display=swap"
      />

      <TopBar category="DONT • MASALAH #1" categoryColor="#FF5E7E" categoryBg="rgba(255, 94, 126, 0.12)" slideNum="02 / 04" />

      {/* Main Headline */}
      <div style={{ marginBottom: 26, zIndex: 10 }}>
        <h1 style={{
          fontSize: 52,
          fontWeight: 900,
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          margin: '0 0 12px 0',
        }}>
          Es mencair dalam <span style={{
            fontFamily: SERIF_ITALIC,
            fontStyle: 'italic',
            fontWeight: 900,
            color: '#FFE566',
          }}>15 menit.</span>
        </h1>
        <p style={{
          fontSize: 22,
          color: '#E5E7EB',
          margin: 0,
          fontWeight: 600,
          lineHeight: 1.4,
        }}>
          Minuman 50k lo resmi berubah jadi <span style={{ color: '#FF5E7E', fontWeight: 800 }}>air es hambar berembun</span>.
        </p>
      </div>

      {/* Visual Macro Card */}
      <div style={{
        flex: 1,
        borderRadius: 22,
        overflow: 'hidden',
        position: 'relative',
        border: '1.5px solid rgba(255, 94, 126, 0.3)',
        boxShadow: '0 24px 50px rgba(0, 0, 0, 0.7)',
        backgroundColor: '#12161F',
      }}>
        <Img
          src={staticFile('assets/pixel/carousel_melted_ice.jpg')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(8, 11, 15, 0.92) 0%, rgba(8, 11, 15, 0.3) 40%, transparent 60%)',
        }} />

        {/* Data Infographic Card */}
        <div style={{
          position: 'absolute',
          bottom: 22,
          left: 22,
          right: 22,
          backgroundColor: 'rgba(15, 20, 28, 0.94)',
          backdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(255, 94, 126, 0.35)',
          borderRadius: 16,
          padding: '18px 24px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ color: '#9CA3AF', fontSize: 16, fontWeight: 700 }}>Komposisi Rasa Menit ke-15:</span>
            <span style={{ color: '#FF5E7E', fontSize: 16, fontWeight: 900 }}>70% AIR ES ENCER</span>
          </div>
          {/* Progress bar */}
          <div style={{ height: 12, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: '70%', backgroundColor: '#60A5FA' }} />
            <div style={{ width: '30%', backgroundColor: '#10B981' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 14, color: '#9CA3AF', fontWeight: 600 }}>
            <span>Air es leleh (pengencer rasa)</span>
            <span>Matcha asli tersisa</span>
          </div>
        </div>
      </div>

      <SwipeFooter bridgeText="TAPI BUKAN CUMA ITU..." />
    </div>
  );
};

// ==========================================
// SLIDE 3: PROBLEM 2 (ZERO MOBILITY)
// ==========================================
export const CarouselSlide3: React.FC = () => {
  return (
    <div style={containerStyle}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&family=Playfair+Display:ital,wght@1,700;1,900&display=swap"
      />

      <TopBar category="DONT • MASALAH #2" categoryColor="#FF9F43" categoryBg="rgba(255, 159, 67, 0.12)" slideNum="03 / 04" />

      {/* Main Headline */}
      <div style={{ marginBottom: 26, zIndex: 10 }}>
        <h1 style={{
          fontSize: 52,
          fontWeight: 900,
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          margin: '0 0 12px 0',
        }}>
          Zero mobilitas. <span style={{
            fontFamily: SERIF_ITALIC,
            fontStyle: 'italic',
            fontWeight: 900,
            color: '#FF6B6B',
          }}>Tangan tersandera.</span>
        </h1>
        <p style={{
          fontSize: 22,
          color: '#E5E7EB',
          margin: 0,
          fontWeight: 600,
          lineHeight: 1.4,
        }}>
          Harus dipegang terus seharian. Gabisa masuk tas, ransel, apalagi samping laptop.
        </p>
      </div>

      {/* Visual Hazard Card */}
      <div style={{
        flex: 1,
        borderRadius: 22,
        overflow: 'hidden',
        position: 'relative',
        border: '1.5px solid rgba(255, 107, 107, 0.3)',
        boxShadow: '0 24px 50px rgba(0, 0, 0, 0.7)',
        backgroundColor: '#12161F',
      }}>
        <Img
          src={staticFile('assets/pixel/cup_struggle/s2_totebag_tilt.jpg')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(8, 11, 15, 0.92) 0%, rgba(8, 11, 15, 0.3) 40%, transparent 60%)',
        }} />

        {/* Hazard Callout */}
        <div style={{
          position: 'absolute',
          bottom: 22,
          left: 22,
          right: 22,
          backgroundColor: 'rgba(15, 20, 28, 0.94)',
          backdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(255, 75, 114, 0.45)',
          borderRadius: 16,
          padding: '18px 24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{
              backgroundColor: '#FF4B72',
              color: '#FFFFFF',
              borderRadius: 8,
              padding: '6px 14px',
              fontSize: 13,
              fontWeight: 900,
              letterSpacing: '0.06em',
            }}>
              RESIKO 99%
            </div>
            <div style={{ color: '#FFFFFF', fontSize: 19, fontWeight: 800 }}>
              Satu senggolan = Laptop basah & catatan hancur
            </div>
          </div>
          <p style={{ color: '#9CA3AF', fontSize: 15, margin: 0, lineHeight: 1.35, fontWeight: 600 }}>
            Lid plastik gampang copot, lubang sedotan bocor, dan embun bikin tote bag basah kuyup.
          </p>
        </div>
      </div>

      <SwipeFooter bridgeText="SOLUSI LIRA DI SEBELAH" />
    </div>
  );
};

// ==========================================
// SLIDE 4: THE SOLUTION (VIRAL "DO" FRAMEWORK)
// ==========================================
export const CarouselSlide4: React.FC = () => {
  return (
    <div style={containerStyle}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&family=Playfair+Display:ital,wght@1,700;1,900&display=swap"
      />

      <TopBar category="VIRAL DO • SOLUSI LIRA" categoryColor="#39FF88" categoryBg="rgba(57, 255, 136, 0.15)" slideNum="04 / 04" />

      {/* Headline */}
      <div style={{ marginBottom: 20, zIndex: 10 }}>
        <h1 style={{
          fontSize: 48,
          fontWeight: 900,
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          margin: '0 0 10px 0',
        }}>
          Botol bersegel rapat. <span style={{
            fontFamily: SERIF_ITALIC,
            fontStyle: 'italic',
            fontWeight: 900,
            color: '#39FF88',
          }}>Crafted for real life.</span>
        </h1>
        <p style={{
          fontSize: 20,
          color: '#9CA3AF',
          margin: 0,
          fontWeight: 600,
        }}>
          Kenapa kami milih botol segel kedap udara daripada cup biasa:
        </p>
      </div>

      {/* Visual Dual Comparison Proof */}
      <div style={{
        display: 'flex',
        gap: 18,
        height: 380,
        marginBottom: 20,
      }}>
        {/* Inverted Bottle Proof */}
        <div style={{
          flex: 1,
          borderRadius: 18,
          overflow: 'hidden',
          position: 'relative',
          border: '1.5px solid rgba(57, 255, 136, 0.35)',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5)',
        }}>
          <Img
            src={staticFile('assets/pixel/cup_struggle/s3_inverted_a.jpg')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            backgroundColor: 'rgba(10, 14, 20, 0.92)',
            padding: '6px 14px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 800,
            color: '#39FF88',
            border: '1px solid rgba(57, 255, 136, 0.3)',
          }}>
            180° ANTI-BOCOR DI ATAS MACBOOK
          </div>
        </div>

        {/* Toss & Go Proof */}
        <div style={{
          flex: 1,
          borderRadius: 18,
          overflow: 'hidden',
          position: 'relative',
          border: '1.5px solid rgba(255, 229, 102, 0.25)',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5)',
        }}>
          <Img
            src={staticFile('assets/pixel/cup_struggle/s4_toss_4.jpg')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            backgroundColor: 'rgba(10, 14, 20, 0.92)',
            padding: '6px 14px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 800,
            color: '#FFE566',
            border: '1px solid rgba(255, 229, 102, 0.3)',
          }}>
            LEMPAR KE TOTE BAG & JALAN
          </div>
        </div>
      </div>

      {/* 3 Pillars of Superior Value */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 12 }}>
        <div style={{
          backgroundColor: 'rgba(18, 24, 34, 0.85)',
          border: '1px solid rgba(57, 255, 136, 0.25)',
          borderRadius: 14,
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}>
          <div style={{ fontSize: 24, color: '#39FF88' }}>✓</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: '#FFFFFF' }}>100% Murni Tanpa Es Pengencer</div>
            <div style={{ fontSize: 15, color: '#9CA3AF', fontWeight: 500 }}>100% Oatside murni + premium matcha, pekat sampai tegukan terakhir.</div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'rgba(18, 24, 34, 0.85)',
          border: '1px solid rgba(57, 255, 136, 0.25)',
          borderRadius: 14,
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}>
          <div style={{ fontSize: 24, color: '#39FF88' }}>✓</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: '#FFFFFF' }}>Tahan 7 Hari di Kulkas</div>
            <div style={{ fontSize: 15, color: '#9CA3AF', fontWeight: 500 }}>Simpan dingin buat stok belajar tengah malam tanpa khawatir basi.</div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'rgba(18, 24, 34, 0.85)',
          border: '1px solid rgba(57, 255, 136, 0.25)',
          borderRadius: 14,
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}>
          <div style={{ fontSize: 24, color: '#39FF88' }}>✓</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: '#FFFFFF' }}>Dilempar ke Totebag Samping Laptop? Aman!</div>
            <div style={{ fontSize: 15, color: '#9CA3AF', fontWeight: 500 }}>Bebas ribet, bebas tangan tersandera megang cup basah.</div>
          </div>
        </div>
      </div>

      {/* High-Converting CTA Box */}
      <div style={{
        marginTop: 4,
        backgroundColor: '#39FF88',
        borderRadius: 14,
        padding: '16px 22px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 10px 30px rgba(57, 255, 136, 0.35)',
      }}>
        <div>
          <div style={{ color: '#0A0E14', fontSize: 13, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Batch Sabtu Terbatas • Fresh Brew
          </div>
          <div style={{ color: '#0A0E14', fontSize: 22, fontWeight: 900 }}>
            Amankan Batch Dingin di Link Bio
          </div>
        </div>
        <div style={{
          backgroundColor: '#0A0E14',
          color: '#39FF88',
          fontWeight: 900,
          padding: '10px 18px',
          borderRadius: 10,
          fontSize: 16,
        }}>
          ORDER SEKARANG ➔
        </div>
      </div>

      <SwipeFooter bridgeText="KLIK LINK DI BIO" isLast={true} />
    </div>
  );
};
