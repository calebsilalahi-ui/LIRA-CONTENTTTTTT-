import React from 'react';
import { AbsoluteFill } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Montserrat';

const { fontFamily: TIKTOK_FONT, waitUntilDone } = loadFont();

export const TestCaption: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#222', justifyContent: 'center', alignItems: 'center', gap: 40 }}>
      {/* Option A: Current (with WebkitTextStroke) */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: '#aaa', fontSize: 24, marginBottom: 10 }}>Option A (Current WebkitTextStroke):</div>
        <div
          style={{
            fontFamily: `${TIKTOK_FONT}, Montserrat, -apple-system, sans-serif`,
            fontSize: 64,
            fontWeight: 900,
            textTransform: 'uppercase',
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
          }}
        >
          UDAH BERUBAH JADI
        </div>
      </div>

      {/* Option B: Pure CSS Clean Multi-Shadow (NO WebkitTextStroke) */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: '#aaa', fontSize: 24, marginBottom: 10 }}>Option B (Pure Multi-Shadow, No WebkitTextStroke):</div>
        <div
          style={{
            fontFamily: `${TIKTOK_FONT}, Montserrat, -apple-system, sans-serif`,
            fontSize: 64,
            fontWeight: 900,
            textTransform: 'uppercase',
            color: '#FFFFFF',
            textShadow: `
              -3px -3px 0 #000,  3px -3px 0 #000, -3px  3px 0 #000,  3px  3px 0 #000,
              -4px  0px 0 #000,  4px  0px 0 #000,  0px -4px 0 #000,  0px  4px 0 #000,
              -2px -4px 0 #000,  2px -4px 0 #000, -2px  4px 0 #000,  2px  4px 0 #000,
              -4px -2px 0 #000,  4px -2px 0 #000, -4px  2px 0 #000,  4px  2px 0 #000,
              0px  6px 16px rgba(0, 0, 0, 0.95)
            `,
          }}
        >
          UDAH BERUBAH JADI
        </div>
      </div>

      {/* Option C: SVG Text with round linejoin */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: '#aaa', fontSize: 24, marginBottom: 10 }}>Option C (SVG Text round stroke):</div>
        <svg width="900" height="100" viewBox="0 0 900 100">
          <text
            x="50%"
            y="75"
            textAnchor="middle"
            fontFamily={`${TIKTOK_FONT}, Montserrat, -apple-system, sans-serif`}
            fontSize="64"
            fontWeight="900"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="10"
            strokeLinejoin="round"
            strokeLinecap="round"
            paintOrder="stroke fill"
            style={{
              textTransform: 'uppercase',
              filter: 'drop-shadow(0px 6px 16px rgba(0,0,0,0.95))',
            }}
          >
            UDAH BERUBAH JADI
          </text>
        </svg>
      </div>

      {/* Option D: Arial Black / Impact standard TikTok font */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: '#aaa', fontSize: 24, marginBottom: 10 }}>Option D (Arial Black / Impact classic multi-shadow):</div>
        <div
          style={{
            fontFamily: '"Arial Black", "Impact", "Montserrat", sans-serif',
            fontSize: 64,
            fontWeight: 900,
            textTransform: 'uppercase',
            color: '#FFFFFF',
            textShadow: `
              -3px -3px 0 #000,  3px -3px 0 #000, -3px  3px 0 #000,  3px  3px 0 #000,
              -4px  0px 0 #000,  4px  0px 0 #000,  0px -4px 0 #000,  0px  4px 0 #000,
              0px  6px 16px rgba(0, 0, 0, 0.95)
            `,
          }}
        >
          UDAH BERUBAH JADI
        </div>
      </div>
    </AbsoluteFill>
  );
};
