import React from 'react';
import { staticFile, Img } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Montserrat';

const { fontFamily: TIKTOK_FONT } = loadFont();

/**
 * 1 TEST SCENE DEMONSTRATING REFINED STANDARDS:
 * 1. Caption placed slightly down the center (56% top, natural eye line)
 * 2. TikTok classic font (Montserrat 900 Heavy, uppercase, white with dark stroke)
 * 3. Strictly 2 to 3 words at a time ("MINUMAN KAFE 50K")
 * 4. Zero emojis and icons
 * 5. Static un-animated real Google Search screenshot proof
 * 6. Visual B-roll: Sweating plastic cup ruining desk assignment paper
 */
export const TestSceneRefined: React.FC = () => {
  return (
    <div
      style={{
        width: 1080,
        height: 1440,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#0A0E14',
      }}
    >
      {/* Background Visual B-Roll (Sweating Cup Struggle Desk POV) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
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

      {/* Subtle Dark Vignette for Visual Focus */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.7) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Static Real Google Search Screenshot Pop-up (NO Animation, Hard Cut) */}
      <div
        style={{
          position: 'absolute',
          top: '14%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 780,
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.85)',
          border: '1.5px solid rgba(255, 255, 255, 0.2)',
          overflow: 'hidden',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
          pointerEvents: 'none',
          zIndex: 800,
        }}
      >
        {/* Google Mobile Browser Header */}
        <div
          style={{
            backgroundColor: '#F8F9FA',
            padding: '12px 20px',
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {/* Mini Google Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, fontWeight: 900, fontSize: 16 }}>
            <span style={{ color: '#4285F4' }}>G</span>
            <span style={{ color: '#EA4335' }}>o</span>
            <span style={{ color: '#FBBC05' }}>o</span>
            <span style={{ color: '#4285F4' }}>g</span>
            <span style={{ color: '#34A853' }}>l</span>
            <span style={{ color: '#EA4335' }}>e</span>
          </div>

          {/* Search Query Pill */}
          <div
            style={{
              flex: 1,
              backgroundColor: '#FFFFFF',
              border: '1px solid #D1D5DB',
              borderRadius: 24,
              padding: '6px 16px',
              fontSize: 14,
              color: '#1F2937',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>berapa menit es batu kafe mencair</span>
            <span style={{ color: '#9CA3AF', fontSize: 12 }}>google.com</span>
          </div>
        </div>

        {/* Featured Answer Snippet */}
        <div style={{ padding: '16px 22px', backgroundColor: '#FFFFFF' }}>
          <div style={{ fontSize: 13, color: '#4B5563', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em', marginBottom: 6 }}>
            Hasil Penelusuran Teratas
          </div>
          <div style={{ fontSize: 18, color: '#111827', fontWeight: 800, lineHeight: 1.35 }}>
            Es batu dalam cup plastik mulai mencair signifikan dalam <span style={{ color: '#DC2626', backgroundColor: '#FEE2E2', padding: '1px 6px', borderRadius: 4 }}>10 - 15 menit</span> pada suhu ruang.
          </div>
          <div style={{ fontSize: 13, color: '#6B7280', marginTop: 6, lineHeight: 1.4 }}>
            Melarutkan hingga 50% konsentrasi rasa minuman asli dan mengubahnya menjadi air tawar dingin.
          </div>
        </div>
      </div>

      {/* REFINED CAPTION: 56% Down the Center, TikTok Classic Font, 2-3 Words Strictly */}
      <div
        style={{
          position: 'absolute',
          top: '56%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '92%',
          maxWidth: 960,
          textAlign: 'center',
          pointerEvents: 'none',
          zIndex: 900,
        }}
      >
        <div
          style={{
            fontFamily: `${TIKTOK_FONT}, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
            fontSize: 70,
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            color: '#FFFFFF',
            textShadow: `
              -3px -3px 0 #000,
               3px -3px 0 #000,
              -3px  3px 0 #000,
               3px  3px 0 #000,
               0px  4px 14px rgba(0, 0, 0, 0.95),
               0px  8px 26px rgba(0, 0, 0, 0.8)
            `,
            WebkitTextStroke: '2.5px #000000',
            lineHeight: 1.15,
            padding: '6px 16px',
            display: 'inline-block',
          }}
        >
          MINUMAN KAFE 50K
        </div>
      </div>
    </div>
  );
};
