import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  Easing,
  spring,
} from 'remotion';
import { TikTokCaption } from './TikTokCaption';
import captionsData from './reel_new_11_stevia_truth_captions.json';

// Total video duration: 816 frames = 27.20 seconds @ 30fps (<30s)
export const REEL_11_DURATION = 816;

export const Reel11_SteviaTruth: React.FC = () => {
  const frame = useCurrentFrame();
  const qFrame = Math.floor(frame / 3) * 3;

  // Scene timing thresholds (derived from voiceover timestamps)
  const isScene1 = frame < 175;                    // Hook: Kasus Stevia Viral (0 - 5.8s)
  const isScene2 = frame >= 175 && frame < 355;   // Science: Daun Steviol 0 Kalori (5.8 - 11.8s)
  const isScene3 = frame >= 355 && frame < 540;   // Industry Secret: Brand Nakal & Cafe (11.8 - 18.0s)
  const isScene4 = frame >= 540 && frame < 680;   // Formulation: Stevia Murni di Dapur (18.0 - 22.6s)
  const isScene5 = frame >= 680;                   // Direct Order CTA: Komen ORDER (22.6 - 27.2s)

  // Pattern interrupt camera snap-in on opening frame
  const hookZoom = interpolate(frame, [0, 20], [1.14, 1.0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Natural organic breathing cycle
  const breathe = Math.sin((qFrame / 40) * Math.PI) * 0.015;

  // Comment sticker bounce animation
  const ctaSpring = spring({
    frame: frame - 685,
    fps: 30,
    config: { damping: 11, stiffness: 180, mass: 0.6 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#070A0F', overflow: 'hidden' }}>
      {/* ======================================================== */}
      {/* 1. AUDIO ENGINE */}
      {/* ======================================================== */}
      <Audio src={staticFile('assets/reel_new_11_stevia_truth.mp3')} volume={1.0} />
      <Audio
        src={staticFile('assets/bg_music.mp3')}
        volume={(f) =>
          interpolate(f, [0, 30, 770, 816], [0.06, 0.11, 0.11, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
        }
      />

      {/* ======================================================== */}
      {/* SCENE 1: HOOK (Kasus Stevia Viral - 0 to 5.8s) */}
      {/* ======================================================== */}
      {isScene1 && (
        <AbsoluteFill style={{ transform: `scale(${hookZoom})` }}>
          <Img
            src={staticFile('assets/pixel/scene_5_laptop_a.jpg')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Viral Breaking News Badge */}
          <div
            style={{
              position: 'absolute',
              top: 80,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(7, 10, 15, 0.92)',
              border: '2px solid #FF2E63',
              boxShadow: '0 8px 32px rgba(255, 46, 99, 0.45)',
              padding: '16px 28px',
              borderRadius: 16,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              zIndex: 30,
              backdropFilter: 'blur(10px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#FF2E63',
                  boxShadow: '0 0 12px #FF2E63',
                }}
              />
              <span
                style={{
                  color: '#FF2E63',
                  fontFamily: '"Silkscreen", monospace',
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                }}
              >
                KASUS VIRAL DI INDONESIA
              </span>
            </div>
            <div
              style={{
                color: '#FFFFFF',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                textAlign: 'center',
              }}
            >
              "STEVIA PALSU BOHONGI PUBLIK"
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ======================================================== */}
      {/* SCENE 2: THE SCIENCE (Daun Steviol Alami vs Gula - 5.8 to 11.8s) */}
      {/* ======================================================== */}
      {isScene2 && (
        <AbsoluteFill>
          <Img
            src={staticFile('assets/pixel/stevia_vs_sugar_science.jpg')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${1.02 + breathe})`,
            }}
          />

          {/* Sleek Top Status Pill */}
          <div
            style={{
              position: 'absolute',
              top: 28,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(5, 14, 9, 0.92)',
              border: '1.5px solid #39FF88',
              boxShadow: '0 4px 20px rgba(57, 255, 136, 0.35)',
              borderRadius: 30,
              padding: '8px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              zIndex: 30,
              backdropFilter: 'blur(8px)',
            }}
          >
            <span
              style={{
                color: '#39FF88',
                fontFamily: '"Silkscreen", monospace',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.08em',
              }}
            >
              100% DAUN STEVIOL ALAMI • 0 KALORI
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* ======================================================== */}
      {/* SCENE 3: INDUSTRY SECRET (Brand Nakal & Cafe - 11.8 to 18.0s) */}
      {/* ======================================================== */}
      {isScene3 && (
        <AbsoluteFill>
          <Img
            src={staticFile('assets/pixel/scene_4_cafe.jpg')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Cafe Warning Card */}
          <div
            style={{
              position: 'absolute',
              top: 85,
              left: 50,
              right: 50,
              backgroundColor: 'rgba(20, 6, 8, 0.94)',
              border: '2px solid #FF2E63',
              boxShadow: '0 12px 40px rgba(255, 46, 99, 0.35)',
              borderRadius: 20,
              padding: '24px 28px',
              backdropFilter: 'blur(12px)',
              zIndex: 30,
            }}
          >
            <div
              style={{
                color: '#FF2E63',
                fontFamily: '"Silkscreen", monospace',
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: '0.08em',
                marginBottom: 10,
              }}
            >
              RAHASIA DIET KAFE BIASA:
            </div>
            <div
              style={{
                color: '#FFFFFF',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontSize: 22,
                fontWeight: 800,
                lineHeight: 1.3,
                marginBottom: 12,
              }}
            >
              Oplosan Kental Manis & Maltodekstrin
            </div>
            <div
              style={{
                color: '#FFB8C6',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              Murah buat penjual, tapi bikin gula darah jebol dan jam 2 siang lemes parah.
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ======================================================== */}
      {/* SCENE 4: LIRA FORMULATION (Stevia Murni di Dapur - 18.0 to 22.6s) */}
      {/* ======================================================== */}
      {isScene4 && (
        <AbsoluteFill>
          <Img
            src={
              frame < 605
                ? staticFile('assets/pixel/stevia_dropper_macro.jpg')
                : staticFile('assets/pixel/caleb_pouring_matcha.jpg')
            }
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${1.03 + breathe})`,
            }}
          />

          {/* Artisan Formula Badge */}
          <div
            style={{
              position: 'absolute',
              top: 80,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(5, 14, 9, 0.94)',
              border: '2px solid #39FF88',
              boxShadow: '0 10px 36px rgba(57, 255, 136, 0.4)',
              borderRadius: 18,
              padding: '18px 30px',
              textAlign: 'center',
              zIndex: 30,
              backdropFilter: 'blur(10px)',
            }}
          >
            <div
              style={{
                color: '#39FF88',
                fontFamily: '"Silkscreen", monospace',
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: '0.1em',
                marginBottom: 6,
              }}
            >
              FORMULA ARTISAN LIRA
            </div>
            <div
              style={{
                color: '#FFFFFF',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontSize: 21,
                fontWeight: 800,
              }}
            >
              {frame < 605
                ? 'Pemanis Alami Stevia Murni (Zero Kalori)'
                : 'Uji Pure Japanese Matcha + Oatside'}
            </div>
            <div
              style={{
                color: '#FFE566',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontSize: 15,
                fontWeight: 700,
                marginTop: 6,
              }}
            >
              Zero Sugar Crash • Clean Energy Seharian
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ======================================================== */}
      {/* SCENE 5: DIRECT ORDER CTA (Komen ORDER - 22.6 to 27.2s) */}
      {/* ======================================================== */}
      {isScene5 && (
        <AbsoluteFill>
          <Img
            src={staticFile('assets/pixel/caleb_point_hero.jpg')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${1.02 + breathe})`,
            }}
          />

          {/* Glowing Comment Sticker Box */}
          <div
            style={{
              position: 'absolute',
              top: 90,
              left: '50%',
              transform: `translateX(-50%) scale(${Math.min(1.0, ctaSpring)})`,
              backgroundColor: '#070C12',
              border: '3px solid #39FF88',
              boxShadow: '0 16px 48px rgba(57, 255, 136, 0.55), 0 0 24px rgba(57, 255, 136, 0.3)',
              borderRadius: 24,
              padding: '24px 36px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              zIndex: 40,
            }}
          >
            <div
              style={{
                color: '#39FF88',
                fontFamily: '"Silkscreen", monospace',
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: '0.12em',
              }}
            >
              BATCH SEGAR SABTU INI
            </div>
            <div
              style={{
                backgroundColor: '#39FF88',
                color: '#070C12',
                fontFamily: '"Silkscreen", monospace',
                fontSize: 28,
                fontWeight: 900,
                padding: '12px 28px',
                borderRadius: 14,
                boxShadow: '0 4px 16px rgba(57, 255, 136, 0.5)',
                letterSpacing: '0.08em',
              }}
            >
              KOMEN "ORDER"
            </div>
            <div
              style={{
                color: '#E0E8F0',
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              Link batch langsung dikirim ke DM kamu!
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ======================================================== */}
      {/* 2. DYNAMIC SUBTITLE CAPTION ENGINE */}
      {/* ======================================================== */}
      <TikTokCaption currentFrame={frame} chunks={captionsData} />
    </AbsoluteFill>
  );
};
