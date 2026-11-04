import React from 'react';
import { staticFile, Img } from 'remotion';

/**
 * 1 TEST CAROUSEL SLIDE DEMONSTRATING REFINED STANDARDS:
 * 1. 4:5 Vertical Portrait (1080 x 1350)
 * 2. High-contrast editorial typography (Sans-Serif + Serif Contrast)
 * 3. Clear DO vs DONT anchor badge
 * 4. Curiosity swipe bridge leading to Slide 2
 * 5. Zero emojis or cartoon stickers
 * 6. Authentic brand storytelling grounded in the Lira Brand Bible
 */
export const TestCarouselSlideRefined: React.FC = () => {
  return (
    <div
      style={{
        width: 1080,
        height: 1350,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#0A0E14',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        color: '#FFFFFF',
      }}
    >
      {/* Background Visual (Sweating Cup Dilution & Caleb Desk) */}
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
            filter: 'brightness(0.55) contrast(1.15)',
          }}
        />
      </div>

      {/* Dark Editorial Gradient Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(10, 14, 20, 0.92) 0%, rgba(10, 14, 20, 0.4) 40%, rgba(10, 14, 20, 0.95) 90%)',
        }}
      />

      {/* Slide Header: Brand Handle & Slide Counter */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 64,
          right: 64,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 20,
        }}
      >
        <span
          style={{
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: '0.12em',
            color: '#9CA3AF',
            textTransform: 'uppercase',
          }}
        >
          @DRINKLIRA • BRAND BIBLE INSIGHTS
        </span>
        <span
          style={{
            fontSize: 18,
            fontWeight: 700,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '6px 14px',
            borderRadius: 20,
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          01 / 04
        </span>
      </div>

      {/* Main Content Area */}
      <div
        style={{
          position: 'absolute',
          top: 150,
          left: 64,
          right: 64,
          zIndex: 20,
        }}
      >
        {/* DO vs DONT Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'rgba(239, 68, 68, 0.18)',
            border: '1.5px solid #EF4444',
            color: '#F87171',
            padding: '8px 20px',
            borderRadius: 30,
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 28,
            backdropFilter: 'blur(10px)',
          }}
        >
          DONT • JEBAKAN CUP KAFE BIASA
        </div>

        {/* High-Contrast Editorial Headline (Sans + Serif Italic Contrast) */}
        <h1
          style={{
            fontSize: 66,
            fontWeight: 900,
            lineHeight: 1.12,
            letterSpacing: '-0.03em',
            color: '#FFFFFF',
            margin: '0 0 24px 0',
            textShadow: '0 4px 20px rgba(0,0,0,0.85)',
          }}
        >
          Kenapa beli minuman kafe di{' '}
          <span
            style={{
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              fontWeight: 400,
              color: '#FFE566',
            }}
          >
            cup plastik
          </span>{' '}
          sebenernya ngerugiin lo?
        </h1>

        <p
          style={{
            fontSize: 24,
            fontWeight: 500,
            lineHeight: 1.5,
            color: '#D1D5DB',
            maxWidth: 820,
            margin: 0,
          }}
        >
          Bayar 50 ribu bukan buat minumannya, tapi buat nahan rasa was-was cup berembun yang umurnya cuma 15 menit.
        </p>
      </div>

      {/* Key Insight Card (Proof Anchor) */}
      <div
        style={{
          position: 'absolute',
          bottom: 160,
          left: 64,
          right: 64,
          backgroundColor: 'rgba(15, 23, 42, 0.88)',
          border: '1.5px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 20,
          padding: '24px 28px',
          backdropFilter: 'blur(16px)',
          zIndex: 20,
        }}
      >
        <div style={{ fontSize: 14, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
          REALITA MINUMAN TAKEAWAY
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.4 }}>
          70% volume cup adalah es batu pengencer rasa. Begitu mencair di meja tugas, uang 50k lo berubah jadi air hambar.
        </div>
      </div>

      {/* Bottom Curiosity Swipe Bridge */}
      <div
        style={{
          position: 'absolute',
          bottom: 56,
          left: 64,
          right: 64,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 20,
          borderTop: '1px solid rgba(255, 255, 255, 0.15)',
          paddingTop: 18,
        }}
      >
        <span
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: '#9CA3AF',
            letterSpacing: '0.04em',
          }}
        >
          SWIPE KE KANAN
        </span>

        <span
          style={{
            fontSize: 17,
            fontWeight: 800,
            color: '#39FF88',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          MASALAH #1: DILUSI RASA ➔
        </span>
      </div>
    </div>
  );
};
