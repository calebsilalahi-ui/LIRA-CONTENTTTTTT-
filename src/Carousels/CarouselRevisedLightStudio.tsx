import React from 'react';
import { staticFile, Img } from 'remotion';

// Dimensions: 1080x1350 (4:5)
export const CAROUSEL_WIDTH = 1080;
export const CAROUSEL_HEIGHT = 1350;

const COLORS = {
  bgLight: '#FAF9F5', // Warm eggshell / ivory studio background
  cardWhite: '#FFFFFF',
  textDark: '#1F2421', // Charcoal black
  textMuted: '#5A625D', // Readable muted grey
  emeraldDeep: '#1D4A38', // Lira Emerald
  goldAccent: '#D4AF37', // Brushed gold
  borderLight: 'rgba(31, 36, 33, 0.12)',
  borderEmerald: 'rgba(29, 74, 56, 0.25)',
};

const FONTS = {
  sans: '-apple-system, BlinkMacSystemFont, "Montserrat", "Plus Jakarta Sans", "Inter", sans-serif',
  serifItalic: '"Playfair Display", "Georgia", serif',
};

// Reusable Top Header Bar
const SlideHeader: React.FC<{ slideNumber: number; category?: string }> = ({
  slideNumber,
  category = 'SPECIAL REPORT',
}) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      paddingBottom: 20,
      borderBottom: `1px solid ${COLORS.borderLight}`,
      zIndex: 10,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span
        style={{
          fontFamily: FONTS.sans,
          fontSize: 16,
          fontWeight: 800,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: COLORS.emeraldDeep,
        }}
      >
        @DRINKLIRA
      </span>
      <span style={{ color: COLORS.textMuted, fontSize: 14 }}>•</span>
      <span
        style={{
          fontFamily: FONTS.sans,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: COLORS.textMuted,
        }}
      >
        {category}
      </span>
    </div>

    <div
      style={{
        fontFamily: FONTS.sans,
        fontSize: 15,
        fontWeight: 800,
        letterSpacing: '0.1em',
        color: COLORS.textDark,
        backgroundColor: 'rgba(31, 36, 33, 0.06)',
        padding: '6px 14px',
        borderRadius: 20,
      }}
    >
      {slideNumber} / 8
    </div>
  </div>
);

// Reusable Bottom Footer Bar
const SlideFooter: React.FC<{ prompt?: string; isLast?: boolean }> = ({
  prompt = 'GESER',
  isLast = false,
}) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      paddingTop: 20,
      borderTop: `1px solid ${COLORS.borderLight}`,
      zIndex: 10,
    }}
  >
    <div
      style={{
        fontFamily: FONTS.sans,
        fontSize: 14,
        fontWeight: 600,
        letterSpacing: '0.08em',
        color: COLORS.textMuted,
        textTransform: 'uppercase',
      }}
    >
      COLD CRAFTED FUEL • 0G REFINED SUGAR
    </div>

    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: FONTS.sans,
        fontSize: 14,
        fontWeight: 800,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: isLast ? COLORS.emeraldDeep : COLORS.textDark,
        border: `1.5px solid ${isLast ? COLORS.emeraldDeep : COLORS.textDark}`,
        padding: '8px 18px',
        borderRadius: 9999,
        backgroundColor: isLast ? 'rgba(29, 74, 56, 0.08)' : 'transparent',
      }}
    >
      <span>{isLast ? 'AMANKAN BATCH' : prompt}</span>
      <span>→</span>
    </div>
  </div>
);

// Base Slide Layout Container
const SlideContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      width: CAROUSEL_WIDTH,
      height: CAROUSEL_HEIGHT,
      backgroundColor: COLORS.bgLight,
      color: COLORS.textDark,
      fontFamily: FONTS.sans,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '64px 72px',
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {children}
  </div>
);

// ==========================================
// SLIDE 1: COVER HOOK (100% Pure Pixel Art)
// ==========================================
export const RevisedSlide1: React.FC = () => {
  return (
    <SlideContainer>
      <SlideHeader slideNumber={1} category="EDITORIAL BREAKDOWN" />

      {/* Top 38% Typographic Lockup */}
      <div style={{ marginTop: 20, zIndex: 10 }}>
        <div
          style={{
            fontFamily: FONTS.serifItalic,
            fontStyle: 'italic',
            fontSize: 34,
            color: COLORS.textMuted,
            letterSpacing: '0.04em',
            marginBottom: 8,
          }}
        >
          WHAT A DAILY
        </div>

        <div
          style={{
            fontFamily: FONTS.sans,
            fontSize: 100,
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
            color: COLORS.emeraldDeep,
            textTransform: 'uppercase',
            margin: '0 0 12px 0',
          }}
        >
          MATCHA ASLI
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontFamily: FONTS.serifItalic,
              fontStyle: 'italic',
              fontSize: 34,
              color: COLORS.textMuted,
              letterSpacing: '0.04em',
            }}
          >
            DOES TO YOUR BODY
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 54,
              height: 32,
              border: `1.5px solid ${COLORS.textDark}`,
              borderRadius: 9999,
              fontSize: 18,
              fontWeight: 800,
            }}
          >
            →
          </div>
        </div>
      </div>

      {/* Bottom 62% Hero: 100% Pure Pixel Art Caleb with Plastic Cup vs Sealed Lira Bottle */}
      <div
        style={{
          position: 'relative',
          height: 720,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 16,
        }}
      >
        <div
          style={{
            width: 820,
            height: 660,
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.12)',
            border: `1.5px solid ${COLORS.borderEmerald}`,
          }}
        >
          <Img
            src={staticFile('assets/pixel/carousel_cover_caleb.jpg')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      </div>

      <SlideFooter prompt="GESER UNTUK BREAKDOWN" />
    </SlideContainer>
  );
};

// ==========================================
// SLIDE 2: STANDALONE RE-SERVE HOOK (100% Pixel Macro)
// ==========================================
export const RevisedSlide2: React.FC = () => {
  return (
    <SlideContainer>
      <SlideHeader slideNumber={2} category="ALGORITMA IMPRESI 2" />

      {/* Pure Stevia Dropper Macro Pixel Art */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          height: 340,
          marginTop: 10,
          position: 'relative',
        }}
      >
        <div
          style={{
            width: 620,
            height: 330,
            borderRadius: 20,
            overflow: 'hidden',
            border: `1.5px solid ${COLORS.borderEmerald}`,
            boxShadow: '0 16px 36px rgba(0,0,0,0.08)',
          }}
        >
          <Img
            src={staticFile('assets/pixel/stevia_dropper_macro.jpg')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      </div>

      {/* Headline & Research Body */}
      <div style={{ textAlign: 'center', maxWidth: 880, margin: '0 auto', zIndex: 10 }}>
        <h2
          style={{
            fontFamily: FONTS.sans,
            fontSize: 52,
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: COLORS.textDark,
            margin: '0 0 20px 0',
          }}
        >
          Supports 4 Hours of Calm Focus Without The 2 PM Crash
        </h2>

        <p
          style={{
            fontFamily: FONTS.sans,
            fontSize: 22,
            lineHeight: 1.45,
            color: COLORS.textMuted,
            margin: '0 auto 20px auto',
            maxWidth: 820,
          }}
        >
          Riset menunjukkan kombinasi alami L-Theanine dan kafein hijau mengatur pelepasan energi stabil ke otak. Fokus tajam bertahan konstan tanpa debar adrenalin atau rasa lelah mendadak.
        </p>

        {/* 3-Card Bio-Telemetry Data Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, margin: '20px 0 24px 0' }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '16px 14px', borderRadius: 14, border: `1.5px solid ${COLORS.borderEmerald}`, textAlign: 'center', boxShadow: '0 8px 18px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: COLORS.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>L-Theanine Alami</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: COLORS.emeraldDeep, margin: '4px 0' }}>120 mg</div>
            <div style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 1.35 }}>Rangsang gelombang Alpha otak untuk fokus tenang tanpa debar jantung</div>
          </div>
          <div style={{ backgroundColor: '#FFFFFF', padding: '16px 14px', borderRadius: 14, border: `1.5px solid ${COLORS.borderEmerald}`, textAlign: 'center', boxShadow: '0 8px 18px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: COLORS.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Indeks Glikemik</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: COLORS.emeraldDeep, margin: '4px 0' }}>0.0</div>
            <div style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 1.35 }}>Pemanis murni daun stevia, nol beban insulin pada pankreas</div>
          </div>
          <div style={{ backgroundColor: '#FFFFFF', padding: '16px 14px', borderRadius: 14, border: `1.5px solid ${COLORS.borderEmerald}`, textAlign: 'center', boxShadow: '0 8px 18px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: COLORS.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Fokus Produktif</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: COLORS.emeraldDeep, margin: '4px 0' }}>4 - 5 Jam</div>
            <div style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 1.35 }}>Pelepasan energi bertahap tanpa rasa lemas jam 2 siang</div>
          </div>
        </div>

        {/* Minimalist Pill Arrow */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 72,
            height: 38,
            border: `1.5px solid ${COLORS.textDark}`,
            borderRadius: 9999,
            fontSize: 20,
            fontWeight: 800,
            margin: '0 auto 16px auto',
          }}
        >
          →
        </div>

        {/* Pixel Droplet Accents */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, alignItems: 'center' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: COLORS.emeraldDeep }} />
          <div style={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: COLORS.emeraldDeep }} />
          <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: COLORS.emeraldDeep }} />
          <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: COLORS.emeraldDeep }} />
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: COLORS.emeraldDeep }} />
        </div>
      </div>

      <SlideFooter prompt="LIHAT PERBANDINGAN REALISTIS" />
    </SlideContainer>
  );
};

// ==========================================
// SLIDE 3: RELATABLE CONTRAST (100% Pure Pixel Art)
// ==========================================
export const RevisedSlide3: React.FC = () => {
  return (
    <SlideContainer>
      <SlideHeader slideNumber={3} category="RELATABLE CONTRAST" />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 22,
          margin: 'auto 0',
        }}
      >
        {/* Card 1: Old Habit (Takeaway Cup) */}
        <div
          style={{
            backgroundColor: COLORS.cardWhite,
            border: '1.5px solid rgba(220, 53, 69, 0.35)',
            borderRadius: 18,
            padding: '20px 24px',
            boxShadow: '0 10px 24px rgba(220, 53, 69, 0.06)',
            display: 'grid',
            gridTemplateColumns: '380px 1fr',
            gap: 24,
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: 380,
              height: 250,
              borderRadius: 14,
              overflow: 'hidden',
              border: '1px solid rgba(220, 53, 69, 0.2)',
            }}
          >
            <Img
              src={staticFile('assets/pixel/cup_struggle/s1_typing_cup.jpg')}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div
              style={{
                alignSelf: 'flex-start',
                padding: '4px 12px',
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                color: '#DC3545',
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: '0.08em',
                borderRadius: 4,
                textTransform: 'uppercase',
              }}
            >
              Kebiasaan Lama • Rp 50.000
            </div>

            <div style={{ fontSize: 24, fontWeight: 900, color: COLORS.textDark, lineHeight: 1.2 }}>
              Cup Plastik &amp; 35g Sirup Jagung
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              <div style={{ display: 'flex', gap: 8, fontSize: 14, color: COLORS.textMuted, lineHeight: 1.35 }}>
                <span style={{ color: '#DC3545', fontWeight: 900 }}>•</span>
                <span><strong style={{ color: COLORS.textDark }}>35g Gula Cair:</strong> Insulin spike mendadak memicu crash lemas jam 2 siang</span>
              </div>
              <div style={{ display: 'flex', gap: 8, fontSize: 14, color: COLORS.textMuted, lineHeight: 1.35 }}>
                <span style={{ color: '#DC3545', fontWeight: 900 }}>•</span>
                <span><strong style={{ color: COLORS.textDark }}>70% Es Pengencer:</strong> Mencair dalam 15 menit, rasa matcha jadi hambar</span>
              </div>
              <div style={{ display: 'flex', gap: 8, fontSize: 14, color: COLORS.textMuted, lineHeight: 1.35 }}>
                <span style={{ color: '#DC3545', fontWeight: 900 }}>•</span>
                <span><strong style={{ color: COLORS.textDark }}>Plastik Berembun:</strong> Meja kerja basah kuyup, resiko tumpah di laptop</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: New Habit (Lira Cold Crafted) */}
        <div
          style={{
            backgroundColor: COLORS.cardWhite,
            border: `1.5px solid ${COLORS.emeraldDeep}`,
            borderRadius: 18,
            padding: '20px 24px',
            boxShadow: '0 12px 28px rgba(29, 74, 56, 0.1)',
            display: 'grid',
            gridTemplateColumns: '380px 1fr',
            gap: 24,
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: 380,
              height: 250,
              borderRadius: 14,
              overflow: 'hidden',
              border: `1.5px solid ${COLORS.borderEmerald}`,
            }}
          >
            <Img
              src={staticFile('assets/pixel/cup_struggle/s3_inverted_a.jpg')}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div
              style={{
                alignSelf: 'flex-start',
                padding: '4px 12px',
                backgroundColor: 'rgba(29, 74, 56, 0.1)',
                color: COLORS.emeraldDeep,
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: '0.08em',
                borderRadius: 4,
                textTransform: 'uppercase',
              }}
            >
              Solusi Lira • Rp 22.000
            </div>

            <div style={{ fontSize: 24, fontWeight: 900, color: COLORS.emeraldDeep, lineHeight: 1.2 }}>
              Botol Kedap 180° &amp; Daun Stevia
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              <div style={{ display: 'flex', gap: 8, fontSize: 14, color: COLORS.textMuted, lineHeight: 1.35 }}>
                <span style={{ color: COLORS.emeraldDeep, fontWeight: 900 }}>•</span>
                <span><strong style={{ color: COLORS.textDark }}>0g Refined Sugar:</strong> Manis stevia alami murni, indeks glikemik 0.0 tanpa crash</span>
              </div>
              <div style={{ display: 'flex', gap: 8, fontSize: 14, color: COLORS.textMuted, lineHeight: 1.35 }}>
                <span style={{ color: COLORS.emeraldDeep, fontWeight: 900 }}>•</span>
                <span><strong style={{ color: COLORS.textDark }}>Diseduh Dingin Pekat:</strong> 100% konsentrat tanpa es batu, kental konsisten</span>
              </div>
              <div style={{ display: 'flex', gap: 8, fontSize: 14, color: COLORS.textMuted, lineHeight: 1.35 }}>
                <span style={{ color: COLORS.emeraldDeep, fontWeight: 900 }}>•</span>
                <span><strong style={{ color: COLORS.textDark }}>180° Hermetic Seal:</strong> Tutup ulir gold rapat, aman dilempar bareng MacBook</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SlideFooter prompt="KENAPA GULA KAFE DROP" />
    </SlideContainer>
  );
};

// ==========================================
// SLIDE 4: THE MECHANISM (Sugar Spike vs Lira) - FILLED WITH VISUAL DATA
// ==========================================
export const RevisedSlide4: React.FC = () => {
  return (
    <SlideContainer>
      <SlideHeader slideNumber={4} category="MEKANISME METABOLISME" />

      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <h2
          style={{
            fontFamily: FONTS.sans,
            fontSize: 48,
            fontWeight: 900,
            lineHeight: 1.15,
            color: COLORS.textDark,
            margin: '0 0 8px 0',
          }}
        >
          Kenapa Cafe Matcha Bikin Lemas Jam 2 Siang?
        </h2>
        <p
          style={{
            fontFamily: FONTS.sans,
            fontSize: 20,
            color: COLORS.textMuted,
            margin: 0,
          }}
        >
          Bukan karena lo kurang tidur. Tubuh lo sedang mengalami reactive hypoglycemia.
        </p>
      </div>

      {/* Split Comparison Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, margin: '20px 0 auto 0' }}>
        {/* Left: Commercial Cup */}
        <div
          style={{
            backgroundColor: COLORS.cardWhite,
            border: '1.5px solid rgba(220, 53, 69, 0.3)',
            borderRadius: 18,
            padding: '24px 22px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            boxShadow: '0 12px 28px rgba(0,0,0,0.04)',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                color: '#DC3545',
                fontSize: 12,
                fontWeight: 800,
                borderRadius: 4,
                marginBottom: 10,
              }}
            >
              CUP TAKEAWAY (RP 50.000)
            </div>

            <div style={{ fontSize: 24, fontWeight: 800, color: COLORS.textDark, marginBottom: 10 }}>
              35g Sirup Jagung
            </div>

            <ul style={{ paddingLeft: 18, color: COLORS.textMuted, fontSize: 15, lineHeight: 1.45, margin: 0 }}>
              <li>Gula cair diserap instan dalam 10 menit</li>
              <li>Pankreas memompa lonjakan insulin</li>
              <li>Gula darah anjlok curam memicu kantuk</li>
              <li>Es batu mencair, rasa pekat hambar</li>
            </ul>

            {/* VISUAL DATA: Prominent Clean Spike Graph */}
            <div
              style={{
                marginTop: 18,
                backgroundColor: 'rgba(220, 53, 69, 0.03)',
                border: '1.5px solid rgba(220, 53, 69, 0.18)',
                borderRadius: 14,
                padding: '18px 16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 900, color: '#DC3545', letterSpacing: '0.08em' }}>
                  GRAFIK INSULIN &amp; GULA DARAH
                </span>
                <span style={{ fontSize: 12, fontWeight: 900, color: '#DC3545', backgroundColor: 'rgba(220,53,69,0.1)', padding: '3px 8px', borderRadius: 4 }}>
                  PEAK 180 mg/dL
                </span>
              </div>

              {/* Large, Beautiful SVG Spike Curve */}
              <svg width="100%" height="180" viewBox="0 0 340 180" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="redSpikeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#DC3545" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#DC3545" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Baseline normal zone (90 mg/dL) */}
                <line x1="0" y1="110" x2="340" y2="110" stroke="rgba(31,36,33,0.18)" strokeDasharray="4 4" strokeWidth="1.5" />
                <text x="6" y="104" fill="#888" fontSize="11" fontWeight="600" fontFamily={FONTS.sans}>Baseline Normal (90 mg/dL)</text>
                
                {/* Shaded Area */}
                <path d="M 0 110 Q 50 110 90 30 Q 120 15 150 45 Q 185 110 220 150 L 340 150 L 340 180 L 0 180 Z" fill="url(#redSpikeGrad)" />
                {/* Main Spike Line */}
                <path d="M 0 110 Q 50 110 90 30 Q 120 15 150 45 Q 185 110 220 150 L 340 150" fill="none" stroke="#DC3545" strokeWidth="4" strokeLinecap="round" />
                
                {/* Peak callout */}
                <circle cx="120" cy="22" r="5" fill="#DC3545" />
                <text x="132" y="24" fill="#DC3545" fontSize="12" fontWeight="900" fontFamily={FONTS.sans}>SPIKE 180</text>

                {/* Crash callout dot */}
                <circle cx="220" cy="150" r="5.5" fill="#DC3545" />
                <text x="234" y="146" fill="#DC3545" fontSize="12" fontWeight="900" fontFamily={FONTS.sans}>CRASH (&lt;70)</text>
                <text x="234" y="162" fill="#888" fontSize="10" fontWeight="700" fontFamily={FONTS.sans}>Lemas Jam 2</text>
              </svg>

              {/* 3 Clean Metric Badges */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 14 }}>
                <div style={{ backgroundColor: '#FFFFFF', padding: '10px 8px', borderRadius: 8, border: '1px solid rgba(220,53,69,0.15)', textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 700 }}>Total Gula</div>
                  <div style={{ fontSize: 17, fontWeight: 900, color: '#DC3545', marginTop: 2 }}>35g</div>
                  <div style={{ fontSize: 9, color: '#888', marginTop: 1 }}>~7 sdt sirup</div>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', padding: '10px 8px', borderRadius: 8, border: '1px solid rgba(220,53,69,0.15)', textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 700 }}>Peak Insulin</div>
                  <div style={{ fontSize: 17, fontWeight: 900, color: '#DC3545', marginTop: 2 }}>180</div>
                  <div style={{ fontSize: 9, color: '#888', marginTop: 1 }}>mg/dL darurat</div>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', padding: '10px 8px', borderRadius: 8, border: '1px solid rgba(220,53,69,0.15)', textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 700 }}>Fase Crash</div>
                  <div style={{ fontSize: 17, fontWeight: 900, color: '#DC3545', marginTop: 2 }}>Menit 45</div>
                  <div style={{ fontSize: 9, color: '#888', marginTop: 1 }}>lemas jam 2</div>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '12px 16px',
              backgroundColor: 'rgba(220, 53, 69, 0.08)',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 800,
              color: '#DC3545',
              textAlign: 'center',
            }}
          >
            Spike Tinggi → Crash Curam Jam 2 Siang
          </div>
        </div>

        {/* Right: Lira Cold Crafted */}
        <div
          style={{
            backgroundColor: COLORS.cardWhite,
            border: `1.5px solid ${COLORS.emeraldDeep}`,
            borderRadius: 18,
            padding: '24px 22px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            boxShadow: '0 12px 28px rgba(29, 74, 56, 0.08)',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                backgroundColor: 'rgba(29, 74, 56, 0.1)',
                color: COLORS.emeraldDeep,
                fontSize: 12,
                fontWeight: 800,
                borderRadius: 4,
                marginBottom: 10,
              }}
            >
              LIRA COLD CRAFTED (RP 22.000)
            </div>

            <div style={{ fontSize: 24, fontWeight: 800, color: COLORS.emeraldDeep, marginBottom: 10 }}>
              0g Gula • Pemanis Alami Stevia
            </div>

            <ul style={{ paddingLeft: 18, color: COLORS.textMuted, fontSize: 15, lineHeight: 1.45, margin: 0 }}>
              <li>Indeks glikemik nol: bebas lonjakan insulin</li>
              <li>L-Theanine menyeimbangkan kafein alami</li>
              <li>Kurva fokus stabil selama 4 jam penuh</li>
              <li>Diseduh dingin pekat, tanpa es pengencer</li>
            </ul>

            {/* VISUAL DATA: Prominent Clean Stable Curve */}
            <div
              style={{
                marginTop: 18,
                backgroundColor: 'rgba(29, 74, 56, 0.03)',
                border: '1.5px solid rgba(29, 74, 56, 0.22)',
                borderRadius: 14,
                padding: '18px 16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 900, color: COLORS.emeraldDeep, letterSpacing: '0.08em' }}>
                  GRAFIK GLIKEMIK STABIL
                </span>
                <span style={{ fontSize: 12, fontWeight: 900, color: COLORS.emeraldDeep, backgroundColor: 'rgba(29,74,56,0.12)', padding: '3px 8px', borderRadius: 4 }}>
                  STABIL 92 mg/dL
                </span>
              </div>

              {/* Large, Beautiful SVG Steady Curve */}
              <svg width="100%" height="180" viewBox="0 0 340 180" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="greenFlatGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1D4A38" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#1D4A38" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Normal Baseline */}
                <line x1="0" y1="105" x2="340" y2="105" stroke="rgba(29,74,56,0.18)" strokeDasharray="4 4" strokeWidth="1.5" />
                <text x="6" y="96" fill={COLORS.emeraldDeep} fontSize="11" fontWeight="600" fontFamily={FONTS.sans}>Zona Glikemik Optimal (90-95 mg/dL)</text>
                
                {/* Shaded Area */}
                <path d="M 0 102 Q 80 98 170 102 Q 250 98 340 102 L 340 180 L 0 180 Z" fill="url(#greenFlatGrad)" />
                {/* Main Steady Line */}
                <path d="M 0 102 Q 80 98 170 102 Q 250 98 340 102" fill="none" stroke="#1D4A38" strokeWidth="4.5" strokeLinecap="round" />
                
                {/* Sustained Focus callout dot */}
                <circle cx="280" cy="102" r="5.5" fill="#1D4A38" />
                <text x="160" y="80" fill="#1D4A38" fontSize="12" fontWeight="900" fontFamily={FONTS.sans}>FOKUS STABIL 4-5 JAM</text>
                <text x="200" y="126" fill="#5A625D" fontSize="10" fontWeight="700" fontFamily={FONTS.sans}>Zero Crash</text>
              </svg>

              {/* 3 Clean Metric Badges */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 14 }}>
                <div style={{ backgroundColor: '#FFFFFF', padding: '10px 8px', borderRadius: 8, border: '1px solid rgba(29,74,56,0.18)', textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 700 }}>Total Gula</div>
                  <div style={{ fontSize: 17, fontWeight: 900, color: COLORS.emeraldDeep, marginTop: 2 }}>0g</div>
                  <div style={{ fontSize: 9, color: '#5A625D', marginTop: 1 }}>stevia alami</div>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', padding: '10px 8px', borderRadius: 8, border: '1px solid rgba(29,74,56,0.18)', textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 700 }}>Indeks Glikemik</div>
                  <div style={{ fontSize: 17, fontWeight: 900, color: COLORS.emeraldDeep, marginTop: 2 }}>0.0</div>
                  <div style={{ fontSize: 9, color: '#5A625D', marginTop: 1 }}>nol insulin</div>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', padding: '10px 8px', borderRadius: 8, border: '1px solid rgba(29,74,56,0.18)', textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 700 }}>Energi Bersih</div>
                  <div style={{ fontSize: 17, fontWeight: 900, color: COLORS.emeraldDeep, marginTop: 2 }}>4-5 Jam</div>
                  <div style={{ fontSize: 9, color: '#5A625D', marginTop: 1 }}>fokus konstan</div>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '12px 16px',
              backgroundColor: 'rgba(29, 74, 56, 0.08)',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 800,
              color: COLORS.emeraldDeep,
              textAlign: 'center',
            }}
          >
            Kurva Datar → Fokus Tenang Tanpa Crash
          </div>
        </div>
      </div>

      <SlideFooter prompt="LIHAT BUKTI PORTABILITAS" />
    </SlideContainer>
  );
};

// ==========================================
// SLIDE 5: 180° INVERTED BOTTLE TEST (Pure Pixel Art)
// ==========================================
export const RevisedSlide5: React.FC = () => {
  return (
    <SlideContainer>
      <SlideHeader slideNumber={5} category="UJI FISIK PORTABILITAS" />

      <div style={{ marginTop: 20, marginBottom: 16 }}>
        <h2
          style={{
            fontFamily: FONTS.sans,
            fontSize: 50,
            fontWeight: 900,
            lineHeight: 1.15,
            color: COLORS.textDark,
            margin: '0 0 10px 0',
          }}
        >
          Tes 180 Derajat di Atas MacBook Nyala
        </h2>
        <p
          style={{
            fontFamily: FONTS.sans,
            fontSize: 22,
            color: COLORS.textMuted,
            margin: 0,
          }}
        >
          Tutup ulir gold presisi. Dibolak-balik di atas keyboard, nol tetes tumpah.
        </p>
      </div>

      {/* Visual: Inverted Bottle Pixel Proof */}
      <div
        style={{
          height: 640,
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
          border: `1px solid ${COLORS.borderLight}`,
          position: 'relative',
        }}
      >
        <Img
          src={staticFile('assets/pixel/cup_struggle/s3_inverted_a.jpg')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Verification Stamp Banner */}
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: 24,
            right: 24,
            backgroundColor: 'rgba(31, 36, 33, 0.88)',
            backdropFilter: 'blur(10px)',
            borderRadius: 12,
            padding: '18px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#FFFFFF',
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700 }}>
            Cup takeaway bocor di tas. Botol Lira aman bareng laptop.
          </div>
          <div
            style={{
              backgroundColor: '#39FF88',
              color: '#000000',
              padding: '6px 14px',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 900,
              letterSpacing: '0.1em',
            }}
          >
            LEAKPROOF 180°
          </div>
        </div>
      </div>

      {/* 3-Badge Physical Proof Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, margin: '16px 0 10px 0' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '14px 12px', borderRadius: 12, border: `1.5px solid ${COLORS.borderEmerald}`, textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: COLORS.emeraldDeep }}>TUTUP ULIR GOLD</div>
          <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 3 }}>Kedap cairan 100% tanpa celah bocor</div>
        </div>
        <div style={{ backgroundColor: '#FFFFFF', padding: '14px 12px', borderRadius: 12, border: `1.5px solid ${COLORS.borderEmerald}`, textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: COLORS.emeraldDeep }}>ZERO EMBUN TAS</div>
          <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 3 }}>Bebas rembesan basah ke dokumen kerja</div>
        </div>
        <div style={{ backgroundColor: '#FFFFFF', padding: '14px 12px', borderRadius: 12, border: `1.5px solid ${COLORS.borderEmerald}`, textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: COLORS.emeraldDeep }}>MACBOOK SAFE</div>
          <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 3 }}>Aman ditaruh bareng laptop di totebag</div>
        </div>
      </div>

      <SlideFooter prompt="LIHAT PROSES SEDUH 03:30 AM" />
    </SlideContainer>
  );
};

// ==========================================
// SLIDE 6: ARTISAN KITCHEN CRAFT (03:30 AM Pixel Art)
// ==========================================
export const RevisedSlide6: React.FC = () => {
  return (
    <SlideContainer>
      <SlideHeader slideNumber={6} category="TRANSPARANSI PRODUKSI" />

      <div style={{ marginTop: 20, marginBottom: 16 }}>
        <h2
          style={{
            fontFamily: FONTS.sans,
            fontSize: 50,
            fontWeight: 900,
            lineHeight: 1.15,
            color: COLORS.textDark,
            margin: '0 0 10px 0',
          }}
        >
          Diseduh Jam 03:30 Pagi Sebelum Kuliah
        </h2>
        <p
          style={{
            fontFamily: FONTS.sans,
            fontSize: 22,
            color: COLORS.textMuted,
            margin: 0,
          }}
        >
          Setiap batch diracik solo dari bahan murni: Oatside oat milk + Japanese green tea extract.
        </p>
      </div>

      {/* Visual: Kitchen Blender Craft */}
      <div
        style={{
          height: 640,
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
          border: `1px solid ${COLORS.borderLight}`,
          position: 'relative',
        }}
      >
        <Img
          src={staticFile('assets/pixel/caleb_blender_kitchen.jpg')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: 24,
            right: 24,
            backgroundColor: 'rgba(29, 74, 56, 0.92)',
            backdropFilter: 'blur(10px)',
            borderRadius: 12,
            padding: '18px 24px',
            color: '#FAF7F0',
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
            Vortex Ekstraksi Dingin
          </div>
          <div style={{ fontSize: 15, color: '#D2DDD8', lineHeight: 1.4 }}>
            Tanpa sirup jagung toko roti, tanpa pengental kimiawi, tanpa pewarna tambahan.
          </div>
        </div>
      </div>

      {/* 3-Badge Artisan Transparency Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, margin: '16px 0 10px 0' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '14px 12px', borderRadius: 12, border: `1.5px solid ${COLORS.borderEmerald}`, textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: COLORS.emeraldDeep }}>03:30 AM BREW</div>
          <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 3 }}>Batch segar mingguan sebelum jam kuliah</div>
        </div>
        <div style={{ backgroundColor: '#FFFFFF', padding: '14px 12px', borderRadius: 12, border: `1.5px solid ${COLORS.borderEmerald}`, textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: COLORS.emeraldDeep }}>OATSIDE BARISTA</div>
          <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 3 }}>Gurih alami oat tanpa krimer nabati toko</div>
        </div>
        <div style={{ backgroundColor: '#FFFFFF', padding: '14px 12px', borderRadius: 12, border: `1.5px solid ${COLORS.borderEmerald}`, textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: COLORS.emeraldDeep }}>100% PURE UJI</div>
          <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 3 }}>Antioksidan EGCG utuh tanpa sirup perasa</div>
        </div>
      </div>

      <SlideFooter prompt="SIMPAN TABEL CONTEKAN" />
    </SlideContainer>
  );
};

// ==========================================
// SLIDE 7: HIGH-SAVE REFERENCE GUIDE (Matrix)
// ==========================================
export const RevisedSlide7: React.FC = () => {
  const rows = [
    { param: 'Gula Tambahan', cafe: '35g - 45g Sirup Jagung', lira: '0g (100% Pemanis Alami Stevia)' },
    { param: 'Stabilitas Fokus', cafe: 'Spike 30m, lalu crash lemas', lira: '4 Jam Tenang & Konstan' },
    { param: 'Portabilitas', cafe: 'Cup plastik gampang tumpah', lira: '180° Sealed Leakproof Bottle' },
    { param: 'Ketahanan Rasa', cafe: 'Es cair hambar dlm 15 menit', lira: 'Kental dingin dari awal-akhir' },
    { param: 'Formula Susu', cafe: 'Susu sapi / krimer pabrik', lira: 'Barista Grade Oatside Oat Milk' },
  ];

  return (
    <SlideContainer>
      <SlideHeader slideNumber={7} category="PANDUAN BELANJA HARIAN" />

      <div style={{ marginTop: 20, marginBottom: 16 }}>
        <h2
          style={{
            fontFamily: FONTS.sans,
            fontSize: 50,
            fontWeight: 900,
            lineHeight: 1.15,
            color: COLORS.textDark,
            margin: '0 0 10px 0',
          }}
        >
          Panduan Memilih Minuman Fokus
        </h2>
        <p
          style={{
            fontFamily: FONTS.sans,
            fontSize: 22,
            color: COLORS.textMuted,
            margin: 0,
          }}
        >
          Simpan slide ini sebagai contekan sebelum lo beli kopi atau matcha harian.
        </p>
      </div>

      {/* Clean Table Grid */}
      <div
        style={{
          backgroundColor: COLORS.cardWhite,
          borderRadius: 16,
          border: `1.5px solid ${COLORS.borderLight}`,
          overflow: 'hidden',
          boxShadow: '0 12px 24px rgba(0,0,0,0.04)',
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1.4fr 1.5fr',
            backgroundColor: 'rgba(31, 36, 33, 0.06)',
            padding: '18px 24px',
            borderBottom: `1.5px solid ${COLORS.borderLight}`,
            fontSize: 14,
            fontWeight: 900,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: COLORS.textDark,
          }}
        >
          <div>Parameter</div>
          <div>Cafe Takeaway</div>
          <div style={{ color: COLORS.emeraldDeep }}>Lira Cold Crafted</div>
        </div>

        {rows.map((r, i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1.4fr 1.5fr',
              padding: '20px 24px',
              borderBottom: i < rows.length - 1 ? `1px solid ${COLORS.borderLight}` : 'none',
              backgroundColor: i % 2 === 1 ? 'rgba(250, 249, 245, 0.7)' : '#FFFFFF',
              fontSize: 18,
              lineHeight: 1.35,
            }}
          >
            <div style={{ fontWeight: 800, color: COLORS.textDark }}>{r.param}</div>
            <div style={{ color: COLORS.textMuted }}>{r.cafe}</div>
            <div style={{ fontWeight: 800, color: COLORS.emeraldDeep }}>{r.lira}</div>
          </div>
        ))}
      </div>

      {/* 3-Badge KPI Matrix Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 16 }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '16px 14px', borderRadius: 12, border: `1.5px solid ${COLORS.borderEmerald}`, textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: COLORS.emeraldDeep }}>0g GULA TAMBAHAN</div>
          <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>Indeks Glikemik 0.0 • Bebas Lemas Jam 2 Siang</div>
        </div>
        <div style={{ backgroundColor: '#FFFFFF', padding: '16px 14px', borderRadius: 12, border: `1.5px solid ${COLORS.borderEmerald}`, textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: COLORS.emeraldDeep }}>180° SEAL LEAKPROOF</div>
          <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>Tutup Ulir Gold • Zero Leak di Dalam Tas</div>
        </div>
        <div style={{ backgroundColor: '#FFFFFF', padding: '16px 14px', borderRadius: 12, border: `1.5px solid ${COLORS.borderEmerald}`, textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: COLORS.emeraldDeep }}>4 JAM FOKUS TENANG</div>
          <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>L-Theanine Alami • Energi Bersih Konstan</div>
        </div>
      </div>

      {/* Quality Verification Checklist */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 18,
          padding: '12px 18px',
          backgroundColor: 'rgba(31, 36, 33, 0.04)',
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 700,
          color: COLORS.textMuted,
          marginBottom: 16,
        }}
      >
        <span>✓ Barista Grade Oatside</span>
        <span>•</span>
        <span>✓ Pure Japanese Matcha Extract</span>
        <span>•</span>
        <span>✓ Cold Chain 2-4°C</span>
        <span>•</span>
        <span>✓ Diseduh Segar Tiap Batch</span>
      </div>

      {/* Bookmark Callout Banner */}
      <div
        style={{
          backgroundColor: 'rgba(29, 74, 56, 0.08)',
          border: `1px solid ${COLORS.borderEmerald}`,
          borderRadius: 12,
          padding: '16px 24px',
          textAlign: 'center',
          fontSize: 17,
          fontWeight: 700,
          color: COLORS.emeraldDeep,
        }}
      >
        Tekan ikon Bookmark di kanan bawah buat contekan belanja lo
      </div>

      <SlideFooter prompt="AMANKAN BATCH MINGGU INI" />
    </SlideContainer>
  );
};

// ==========================================
// SLIDE 8: ACTION CTA & SATURDAY GOJEK DISPATCH (Pure Pixel Art)
// ==========================================
export const RevisedSlide8: React.FC = () => {
  return (
    <SlideContainer>
      <SlideHeader slideNumber={8} category="BATCH SATURDAY DISPATCH" />

      <div style={{ marginTop: 20, marginBottom: 16 }}>
        <h2
          style={{
            fontFamily: FONTS.sans,
            fontSize: 50,
            fontWeight: 900,
            lineHeight: 1.15,
            color: COLORS.textDark,
            margin: '0 0 10px 0',
          }}
        >
          Dingin. Kental. Siap Nemenin Deep Work Lo.
        </h2>
        <p
          style={{
            fontFamily: FONTS.sans,
            fontSize: 22,
            color: COLORS.textMuted,
            margin: 0,
          }}
        >
          Diseduh segar tiap minggu. Dikirim dingin via Gojek sampai meja lo.
        </p>
      </div>

      {/* Hero Visual: 100% Pure Pixel Art Gojek Driver with Forest Green Cooler Bag */}
      <div
        style={{
          height: 600,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: 780,
            height: 540,
            borderRadius: 20,
            backgroundColor: COLORS.cardWhite,
            border: `1.5px solid ${COLORS.borderEmerald}`,
            boxShadow: '0 20px 40px rgba(29, 74, 56, 0.08)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Img
            src={staticFile('assets/pixel/tutorial/s4_gojek_green_a.jpg')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />

          {/* Status Badge */}
          <div
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: '0.1em',
              color: '#000000',
              backgroundColor: '#39FF88',
              padding: '6px 14px',
              borderRadius: 6,
            }}
          >
            SUHU 2-4°C TERKUNCI
          </div>
        </div>
      </div>

      {/* 3-Badge Fulfillment Guarantee Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, margin: '14px 0 10px 0' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '14px 12px', borderRadius: 12, border: `1.5px solid ${COLORS.borderEmerald}`, textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: COLORS.emeraldDeep }}>COOLER BAG INSULASI</div>
          <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 3 }}>Suhu 2-4°C terjaga aluminium foil</div>
        </div>
        <div style={{ backgroundColor: '#FFFFFF', padding: '14px 12px', borderRadius: 12, border: `1.5px solid ${COLORS.borderEmerald}`, textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: COLORS.emeraldDeep }}>GOJEK DISPATCH</div>
          <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 3 }}>Pengiriman dingin langsung ke meja</div>
        </div>
        <div style={{ backgroundColor: '#FFFFFF', padding: '14px 12px', borderRadius: 12, border: `1.5px solid ${COLORS.borderEmerald}`, textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: COLORS.emeraldDeep }}>LIMITED BATCH</div>
          <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 3 }}>Slot produksi mingguan eksklusif</div>
        </div>
      </div>

      {/* Strictly Non-Numeric Scarcity Callout */}
      <div
        style={{
          backgroundColor: COLORS.emeraldDeep,
          borderRadius: 12,
          padding: '18px 24px',
          textAlign: 'center',
          color: '#FAF7F0',
          marginBottom: 10,
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          LIMITED BATCH FRESH TIAP MINGGU
        </div>
        <div style={{ fontSize: 15, color: '#D2DDD8', marginTop: 4 }}>
          Pesan sekarang via link di bio @drinklira sebelum kuota pengiriman ditutup.
        </div>
      </div>

      <SlideFooter prompt="AMANKAN BATCH SEKARANG" isLast={true} />
    </SlideContainer>
  );
};
