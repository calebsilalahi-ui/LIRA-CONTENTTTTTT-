import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  Easing,
} from 'remotion';
import { TikTokCaption } from './TikTokCaption';
import captionsData from './reel_blind_taste_test_captions.json';

export const REEL_2_DURATION = 1162; // 38.72s @ 30fps

export const Reel2_BlindTasteTest: React.FC = () => {
  const frame = useCurrentFrame();

  const qFrame = Math.floor(frame / 3) * 3;

  const isScene1 = frame < 180;
  const isScene2 = frame >= 180 && frame < 450;
  const isScene3 = frame >= 450 && frame < 750;
  const isScene4 = frame >= 750 && frame < 1000;
  const isScene5 = frame >= 1000;

  const hookZoom = interpolate(frame, [0, 20], [1.12, 1.0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const breathe = Math.sin((qFrame / 40) * Math.PI) * 0.015;

  return (
    <AbsoluteFill style={{ backgroundColor: '#070A0F', overflow: 'hidden' }}>
      {/* AUDIO ENGINE */}
      <Audio src={staticFile('assets/reel_blind_taste_test.mp3')} volume={1.0} />
      <Audio
        src={staticFile('assets/bg_music.mp3')}
        volume={(f) =>
          interpolate(f, [0, 30, 1115, 1162], [0.06, 0.13, 0.13, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
        }
      />

      {/* SCENE 1: HOOK (Comparison: 55k Cafe Cup vs 24k Lira Bottle) */}
      {isScene1 && (
        <AbsoluteFill style={{ transform: `scale(${hookZoom})` }}>
          <Img
            src={staticFile('assets/pixel/carousel_cover_caleb.jpg')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          <div
            style={{
              position: 'absolute',
              top: 70,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 860,
              backgroundColor: '#0F172A',
              border: '2.5px solid #FFE566',
              borderRadius: 20,
              padding: '16px 24px',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.95)',
              zIndex: 850,
            }}
          >
            <div
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 27,
                fontWeight: 900,
                color: '#FFE566',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                lineHeight: 1.3,
              }}
            >
              55K MATCHA KAFE VS 24K MATCHA OATSIDE LIRA
            </div>
            <div
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 16,
                fontWeight: 700,
                color: '#94A3B8',
                letterSpacing: '0.08em',
                marginTop: 6,
                textTransform: 'uppercase',
              }}
            >
              UJI RASA TUTUP MATA • BUKTI KUALITAS DAUN ASLI
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* SCENE 2: THE KAFE DECEPTION (Sweet Syrup Reality) */}
      {isScene2 && (
        <AbsoluteFill>
          <Img
            src={staticFile('assets/pixel/scene_4_cafe_b.jpg')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${1.0 + breathe})`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 85,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(15, 23, 42, 0.94)',
              border: '2px solid #FF2E63',
              borderRadius: 16,
              padding: '14px 28px',
              boxShadow: '0 15px 40px rgba(0,0,0,0.9)',
              zIndex: 850,
            }}
          >
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 23,
                fontWeight: 900,
                color: '#FF2E63',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              KAFE MALL: DOMINAN SIRUP GULA & BIAYA SEWA
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* SCENE 3: LIRA EMERALD UMAMI CRAFT */}
      {isScene3 && (
        <AbsoluteFill>
          <Img
            src={staticFile('assets/pixel/caleb_pouring_matcha.jpg')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${1.0 + breathe})`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 85,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 800,
              backgroundColor: 'rgba(7, 10, 15, 0.95)',
              border: '2px solid #39FF88',
              borderRadius: 18,
              padding: '16px 24px',
              textAlign: 'center',
              boxShadow: '0 20px 45px rgba(0,0,0,0.95)',
              zIndex: 850,
            }}
          >
            <div
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 23,
                fontWeight: 900,
                color: '#39FF88',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              PURE JAPANESE PREMIUM MATCHA + BARISTA OATSIDE
            </div>
            <div
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 16,
                fontWeight: 700,
                color: '#CBD5E1',
                marginTop: 6,
              }}
            >
              100% Ekstrak Daun Stevia Alami • 0g Gula Pasir
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* SCENE 4: REAL PRICE COMPARISON MATRIX */}
      {isScene4 && (
        <AbsoluteFill>
          <Img
            src={staticFile('assets/pixel/caleb_point_hero.jpg')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${1.0 + breathe})`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 75,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 860,
              backgroundColor: 'rgba(15, 23, 42, 0.96)',
              border: '2.5px solid #39FF88',
              borderRadius: 20,
              padding: '18px 24px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.98)',
              zIndex: 850,
            }}
          >
            <div
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 22,
                fontWeight: 900,
                color: '#39FF88',
                textAlign: 'center',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: 12,
              }}
            >
              HARGA JUJUR TANPA MARK-UP SEWA KAFE
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px 18px',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <div
                style={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  padding: '10px 14px',
                  borderRadius: 12,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: 17, fontWeight: 700, color: '#F1F5F9' }}>Milk Tea</span>
                <span style={{ fontSize: 20, fontWeight: 900, color: '#39FF88' }}>Rp 15.000</span>
              </div>
              <div
                style={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  padding: '10px 14px',
                  borderRadius: 12,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: 17, fontWeight: 700, color: '#F1F5F9' }}>Matcha Classic</span>
                <span style={{ fontSize: 20, fontWeight: 900, color: '#39FF88' }}>Rp 19.000</span>
              </div>
              <div
                style={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  padding: '10px 14px',
                  borderRadius: 12,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: 17, fontWeight: 700, color: '#F1F5F9' }}>Choco Hazelnut</span>
                <span style={{ fontSize: 20, fontWeight: 900, color: '#39FF88' }}>Rp 22.000</span>
              </div>
              <div
                style={{
                  backgroundColor: 'rgba(57, 255, 136, 0.12)',
                  border: '1px solid #39FF88',
                  padding: '10px 14px',
                  borderRadius: 12,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: 17, fontWeight: 800, color: '#FFFFFF' }}>Matcha Oatside</span>
                <span style={{ fontSize: 20, fontWeight: 900, color: '#FFE566' }}>Rp 24.000</span>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* SCENE 5: SCARCITY CTA */}
      {isScene5 && (
        <AbsoluteFill>
          <Img
            src={staticFile('assets/pixel/insider_caleb_desk_b.jpg')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${1.0 + breathe})`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 90,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 820,
              backgroundColor: '#0F172A',
              border: '2.5px solid #FFE566',
              borderRadius: 22,
              padding: '20px 28px',
              textAlign: 'center',
              boxShadow: '0 25px 60px rgba(0,0,0,0.98)',
              zIndex: 850,
            }}
          >
            <div
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 28,
                fontWeight: 900,
                color: '#FFE566',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              LIMITED BATCH AVAILABLE
            </div>
            <div
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 18,
                fontWeight: 700,
                color: '#F8FAFC',
                marginTop: 8,
              }}
            >
              Buktikan Sendiri Rasanya Lewat Link di Bio (@drinklira)
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* TIKTOK WORD-BY-WORD CAPTION */}
      <TikTokCaption
        currentFrame={frame}
        chunks={captionsData}
        topPercentage={56}
        fontSize={62}
        highlightColor="#FFE566"
      />
    </AbsoluteFill>
  );
};
