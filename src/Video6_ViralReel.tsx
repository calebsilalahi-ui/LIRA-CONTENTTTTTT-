import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Montserrat';
import alignedCaptions from './aligned_captions.json';

// Load TikTok Classic heavy bold font
const { fontFamily: TIKTOK_FONT } = loadFont();

export const VIRAL_REEL_DURATION = 1220; // 40.67s @ 30fps

interface CaptionChunk {
  from: number;
  to: number;
  text: string;
  highlight?: boolean;
}

const CAPTIONS: CaptionChunk[] = alignedCaptions as CaptionChunk[];

export const Video6_ViralReel: React.FC = () => {
  const frame = useCurrentFrame();

  // 10 FPS Stepping (Indie-game aesthetic)
  const qFrame = Math.floor(frame / 3) * 3;
  const qStep = Math.floor(frame / 3);

  // Hook-Stacked TOFU -> MOFU -> BOFU Scene Allocation
  // Scene 1 (TOFU - Hook Stack: Relatable 2-Hour Crash): f 0 - 200
  // Scene 2 (MOFU 1 - Problem Hook Stack: Sugar Spike Proof): f 200 - 558
  // Scene 3 (MOFU 2 - Craft Hook Stack: Pure Premium Matcha & Stevia): f 558 - 890
  // Scene 4 (BOFU 1 - Tactile Hook Stack: 180° Inverted Bottle Leakproof): f 890 - 1052
  // Scene 5 (BOFU 2 - Scarcity CTA Hook Stack: Limited Batch Available): f 1052 - 1220

  const isScene1 = frame < 200;
  const isScene2 = frame >= 200 && frame < 558;
  const isScene3 = frame >= 558 && frame < 890;
  const isScene4 = frame >= 890 && frame < 1052;
  const isScene5 = frame >= 1052;

  // Active 2-3 Word Caption directly matching Caleb's voice timing
  const activeCaption = CAPTIONS.find((c) => frame >= c.from && frame < c.to);

  // Subtle breathing scale
  const breathe = Math.sin((qFrame / 40) * Math.PI) * 0.015;

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0E14', overflow: 'hidden' }}>
      {/* ------------------------------------------------------------------ */}
      {/* AUDIO ENGINE                                                       */}
      {/* ------------------------------------------------------------------ */}
      {/* Voiceover (ElevenLabs Caleb Clone v4 - Frame Aligned) */}
      <Audio src={staticFile('assets/voiceover_viral_current.mp3')} volume={1.0} />

      {/* Royalty-Free BGM (Lowered to 0.13 for optimal balance) */}
      <Audio
        src={staticFile('assets/bg_music.mp3')}
        volume={(f) =>
          interpolate(f, [0, 30, 1170, 1220], [0.06, 0.13, 0.13, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
        }
      />

      {/* ------------------------------------------------------------------ */}
      {/* VISUAL SCENES (10 FPS Stepped Animation)                           */}
      {/* ------------------------------------------------------------------ */}

      {/* SCENE 1: TOFU PATTERN INTERRUPT HOOK (f 0 - 200) */}
      {isScene1 && (
        <AbsoluteFill>
          <Img
            src={staticFile('assets/pixel/scene_6_stressed_a.jpg')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${1.0 + breathe})`,
            }}
          />

          {/* Written Hook Stack Card (Top Center) */}
          <div
            style={{
              position: 'absolute',
              top: 75,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 840,
              backgroundColor: '#0F172A',
              border: '2.5px solid #FFE566',
              borderRadius: 20,
              padding: '16px 24px',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.92)',
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
              KENAPA MATCHA 50K DI KAFE BIKIN LEMES & CRASH?
            </div>
            <div
              style={{
                marginTop: 6,
                fontSize: 14,
                color: '#94A3B8',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              THE 2-HOUR AFTERNOON CRASH PHENOMENON
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* SCENE 2: MOFU PART 1 — PROBLEM HOOK STACK & SUGAR SPIKE PROOF (f 200 - 558) */}
      {isScene2 && (
        <AbsoluteFill>
          <Img
            src={
              qStep % 4 < 2
                ? staticFile('assets/pixel/cup_struggle/s1_typing_cup.jpg')
                : staticFile('assets/pixel/cup_struggle/s1_typing_cup_b.jpg')
            }
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${1.02 + breathe})`,
            }}
          />

          {/* Top Written Hook Pill */}
          <div
            style={{
              position: 'absolute',
              top: 70,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(220, 38, 38, 0.95)',
              border: '2px solid #FFFFFF',
              borderRadius: 30,
              padding: '10px 24px',
              color: '#FFFFFF',
              fontSize: 16,
              fontWeight: 900,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontFamily: 'Inter, system-ui, sans-serif',
              boxShadow: '0 12px 30px rgba(0,0,0,0.85)',
              zIndex: 850,
            }}
          >
            RAHASIA KOTOR MATCHA KAFE: SUGAR SPIKE
          </div>

          {/* Static Google Search Proof Popup (Hard cut, NO animation) */}
          {frame >= 230 && frame < 520 && (
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
                zIndex: 800,
              }}
            >
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 2, fontWeight: 900, fontSize: 16 }}>
                  <span style={{ color: '#4285F4' }}>G</span>
                  <span style={{ color: '#EA4335' }}>o</span>
                  <span style={{ color: '#FBBC05' }}>o</span>
                  <span style={{ color: '#4285F4' }}>g</span>
                  <span style={{ color: '#34A853' }}>l</span>
                  <span style={{ color: '#EA4335' }}>e</span>
                </div>
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
                  <span>efek gula berlebih & krimer pada matcha latte</span>
                  <span style={{ color: '#9CA3AF', fontSize: 12 }}>google.com</span>
                </div>
              </div>
              <div style={{ padding: '16px 22px', backgroundColor: '#FFFFFF' }}>
                <div style={{ fontSize: 13, color: '#DC2626', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em', marginBottom: 6 }}>
                  Hasil Penelusuran Teratas
                </div>
                <div style={{ fontSize: 18, color: '#111827', fontWeight: 800, lineHeight: 1.35 }}>
                  Sirup gula sederhana & krimer sintetis memicu{' '}
                  <span style={{ color: '#DC2626', backgroundColor: '#FEE2E2', padding: '1px 6px', borderRadius: 4 }}>
                    Sugar Spike drastis
                  </span>{' '}
                  diikuti Sugar Crash dalam 1 - 2 jam.
                </div>
                <div style={{ fontSize: 13, color: '#6B7280', marginTop: 6, lineHeight: 1.4 }}>
                  Menyebabkan rasa lemas mendadak, kantuk berat, dan penurunan fokus tajam saat jam kerja atau kuliah.
                </div>
              </div>
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* SCENE 3: MOFU PART 2 — CRAFT HOOK STACK: PURE PREMIUM MATCHA & STEVIA (f 558 - 890) */}
      {isScene3 && (
        <AbsoluteFill>
          {/* Visual: Caleb Hand-Whisking & Pouring Pure Emerald Matcha */}
          <Img
            src={staticFile('assets/pixel/caleb_pouring_matcha.jpg')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${1.0 + breathe})`,
            }}
          />

          {/* Top Written Hook Pill 1: Premium Japanese Matcha */}
          <div
            style={{
              position: 'absolute',
              top: '8%',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(15, 23, 42, 0.94)',
              border: '2px solid #39FF88',
              borderRadius: 30,
              padding: '10px 24px',
              color: '#39FF88',
              fontSize: 17,
              fontWeight: 900,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontFamily: 'Inter, system-ui, sans-serif',
              boxShadow: '0 12px 30px rgba(0,0,0,0.85)',
              zIndex: 800,
            }}
          >
            PURE JAPANESE PREMIUM MATCHA • BARISTA OAT MILK
          </div>

          {/* Written Hook Pill 2: Stevia Substitute (Hard cut) */}
          <div
            style={{
              position: 'absolute',
              top: '15%',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(15, 23, 42, 0.94)',
              border: '2px solid #FFE566',
              borderRadius: 24,
              padding: '8px 20px',
              color: '#FFE566',
              fontSize: 15,
              fontWeight: 900,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontFamily: 'Inter, system-ui, sans-serif',
              boxShadow: '0 10px 25px rgba(0,0,0,0.85)',
              zIndex: 800,
            }}
          >
            PEMANIS ALAMI STEVIA DROPS • ZERO GULA PASIR
          </div>
        </AbsoluteFill>
      )}

      {/* SCENE 4: BOFU PART 1 — TACTILE HOOK STACK: 180° AIRTIGHT LEAKPROOF (f 890 - 1052) */}
      {isScene4 && (
        <AbsoluteFill>
          {/* Visual: Sealed Green Matcha Bottle Inverted 180° over Keyboard */}
          <Img
            src={
              qStep % 4 < 2
                ? staticFile('assets/pixel/cup_struggle/s3_inverted_a.jpg')
                : staticFile('assets/pixel/cup_struggle/s3_inverted_b.jpg')
            }
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${1.02 + breathe})`,
            }}
          />

          {/* Static Leakproof Badge */}
          <div
            style={{
              position: 'absolute',
              top: '12%',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(15, 23, 42, 0.94)',
              border: '2.5px solid #39FF88',
              borderRadius: 30,
              padding: '12px 28px',
              color: '#39FF88',
              fontSize: 18,
              fontWeight: 900,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: 'Inter, system-ui, sans-serif',
              boxShadow: '0 12px 30px rgba(0,0,0,0.85)',
              zIndex: 800,
            }}
          >
            180° AIRTIGHT SEAL TEST • DINGIN TAHAN 7 HARI
          </div>
        </AbsoluteFill>
      )}

      {/* SCENE 5: BOFU PART 2 — SCARCITY CTA HOOK STACK: LIMITED BATCH AVAILABLE (f 1052 - 1220) */}
      {isScene5 && (
        <AbsoluteFill>
          {/* Visual: Caleb Pointing Hero Pose Holding Cold Green Matcha Bottle */}
          <Img
            src={staticFile('assets/pixel/caleb_point_hero.jpg')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${1.0 + breathe})`,
            }}
          />

          {/* Punchy Scarcity CTA Card (Hard cut, frame 1060+) */}
          {frame >= 1060 && (
            <div
              style={{
                position: 'absolute',
                bottom: 80,
                left: 56,
                right: 56,
                backgroundColor: 'rgba(15, 23, 42, 0.96)',
                border: '2.5px solid #39FF88',
                borderRadius: 24,
                padding: '24px 28px',
                textAlign: 'center',
                boxShadow: '0 20px 60px rgba(0,0,0,0.92)',
                fontFamily: 'Inter, system-ui, sans-serif',
                zIndex: 800,
              }}
            >
              <div
                style={{
                  fontSize: 27,
                  fontWeight: 900,
                  color: '#39FF88',
                  marginBottom: 6,
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                }}
              >
                LIMITED BATCH AVAILABLE • DROP SABTU
              </div>
              <div style={{ fontSize: 17, color: '#FFFFFF', fontWeight: 700, lineHeight: 1.35 }}>
                Pure Premium Matcha & Stevia • Amankan Slot di Link Bio!
              </div>
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TIKTOK CLASSIC CAPTION ENGINE (56% DOWN CENTER, VOICE-ALIGNED)     */}
      {/* ------------------------------------------------------------------ */}
      {activeCaption && (
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
              fontFamily: `${TIKTOK_FONT}, Montserrat, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
              fontSize: activeCaption.highlight ? 72 : 64,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              color: activeCaption.highlight ? '#FFE566' : '#FFFFFF',
              /* Clean 16-point perimeter outline eliminates WebkitTextStroke miter artifacts & ugly internal lines */
              textShadow: `
                -3px -3px 0 #000,  3px -3px 0 #000, -3px  3px 0 #000,  3px  3px 0 #000,
                -4px  0px 0 #000,  4px  0px 0 #000,  0px -4px 0 #000,  0px  4px 0 #000,
                -2px -4px 0 #000,  2px -4px 0 #000, -2px  4px 0 #000,  2px  4px 0 #000,
                -4px -2px 0 #000,  4px -2px 0 #000, -4px  2px 0 #000,  4px  2px 0 #000,
                0px  6px 18px rgba(0, 0, 0, 0.95),
                0px 10px 30px rgba(0, 0, 0, 0.75)
              `,
              lineHeight: 1.15,
              padding: '6px 16px',
              display: 'inline-block',
            }}
          >
            {activeCaption.text.replace(/\[.*?\]/g, '').trim()}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
