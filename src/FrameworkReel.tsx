import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { loadFont as loadPressStart } from '@remotion/google-fonts/PressStart2P';
import { loadFont as loadSilkscreen } from '@remotion/google-fonts/Silkscreen';
import { loadFont as loadPlusJakarta } from '@remotion/google-fonts/PlusJakartaSans';

// Manifest and Asset Catalog
import manifestData from './active_reel_manifest.json';
import assetCatalog from '../data/asset_catalog.json';

const { fontFamily: PIXEL_HEADER_FONT } = loadPressStart();
const { fontFamily: PIXEL_SUB_FONT } = loadSilkscreen();
const { fontFamily: SANS_FONT } = loadPlusJakarta();

// Bounding Constants (plan §4.2 Red Box Safe Zone: 1080x1440)
const RED_BOX = { x0: 192, x1: 896, y0: 202, y1: 1236 };

const COLORS = {
  emeraldNeon: '#39FF88',
  cyanFrost: '#5CE1E6',
  hazelnutGold: '#E6A145',
  oatCream: '#FAF7F0',
  gold: '#D4AF37',
  goldBright: '#FFE566',
  crimson: '#FF2E63',
  slateDark: '#0B0F19',
};

export const FRAMEWORK_REEL_DURATION = manifestData.totalFrames || 900;

interface FrameworkReelProps {
  manifest?: typeof manifestData;
}

export const FrameworkReel: React.FC<FrameworkReelProps> = ({ manifest: propManifest }) => {
  const manifest = propManifest || manifestData;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Unbroken continuous camera drift across all frames (plan §5.3 Layer 1)
  const cameraDriftScale = interpolate(frame, [0, manifest.totalFrames], [1.04, 0.98], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cameraPanY = interpolate(frame, [0, manifest.totalFrames], [6, -6], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cameraPanX = interpolate(frame, [0, manifest.totalFrames], [-8, 12], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Living pixel animation toggles (plan §5.3 Layer 3)
  const poseToggleMed = Math.floor(frame / 10) % 2 === 0;
  const poseToggleFast = Math.floor(frame / 6) % 2 === 0;

  // Determine active beat dynamically from manifest.beatFrames and manifest.beats
  let currentBeat = manifest.beats?.[0]?.id || 'b1_hook';
  if (manifest.beatFrames && Array.isArray(manifest.beats)) {
    for (let i = manifest.beats.length - 1; i >= 0; i--) {
      const bId = manifest.beats[i].id;
      const startF = (manifest.beatFrames as Record<string, number>)?.[bId] ?? 0;
      if (frame >= startF) {
        currentBeat = bId;
        break;
      }
    }
  }

  const beatConfig = manifest.beats?.find((b: any) => b.id === currentBeat) || manifest.beats?.[0];

  // Resolve background scenes from assetCatalog
  const sceneDef = assetCatalog.scenes.find((s: any) => s.id === beatConfig?.scene) || assetCatalog.scenes[0];
  const activeFrameSrc =
    sceneDef.frames.length > 1
      ? poseToggleMed
        ? sceneDef.frames[0]
        : sceneDef.frames[1]
      : sceneDef.frames[0];

  // Active Caption Chunk from Word-Level Alignment
  const activeChunk = manifest.captions?.find(
    (chunk: any) => frame >= chunk.fromFrame && frame < chunk.toFrame
  );

  // Subtitles active from start of voiceover
  const showSubtitles = frame >= 2;

  // Seamless Loop overlay on final 15 frames
  const loopOpacity = interpolate(frame, [manifest.totalFrames - 15, manifest.totalFrames], [0, 0.95], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Bottle image based on SKU
  const skuBottle =
    manifest.sku === 'Choco Hazelnut'
      ? 'assets/bottles_ssot/choco_ssot.png'
      : manifest.sku === 'Signature Milk Tea'
      ? 'assets/bottles_ssot/milktea_ssot.png'
      : 'assets/bottles_ssot/matcha_ssot.png';

  // 16-point anti-artifact shadow barrier for crisp legibility
  const antiArtifactShadow = [
    '-3px -3px 0 #000',
    '3px -3px 0 #000',
    '-3px 3px 0 #000',
    '3px 3px 0 #000',
    '0 6px 20px rgba(0, 0, 0, 0.95)',
    '0 0 25px rgba(57, 255, 136, 0.35)',
  ].join(', ');

  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1440,
        backgroundColor: '#070A0F',
        overflow: 'hidden',
      }}
    >
      {/* Master Pre-Mixed Multi-Track Audio (VO + Ducked Lo-Fi BGM + SFX) */}
      <Audio src={staticFile(manifest.audioMaster || 'assets/emotional_somatic_master.mp3')} volume={1.0} />

      {/* 1. Master Camera Rig with continuous drift (never clamps/freezes) */}
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          transform: `scale(${cameraDriftScale}) translate(${cameraPanX}px, ${cameraPanY}px)`,
          transformOrigin: '50% 50%',
        }}
      >
        {/* Dynamic Scene Background */}
        <AbsoluteFill>
          <Img
            src={staticFile(activeFrameSrc)}
            style={{
              width: '1080px',
              height: '1440px',
              objectFit: 'cover',
              filter: 'contrast(1.06) saturate(1.05)',
            }}
          />
        </AbsoluteFill>

        {/* ================================================================== */}
        {/* BEAT 4: OPEN LOOP 1 / SCIENCE (MINIMALIST EDITORIAL - ZERO SLOP)   */}
        {/* ================================================================== */}
        {(currentBeat === 'b4_loop1' || sceneDef.id === 'sugar_vs_stevia_chart') && (
          <AbsoluteFill
            style={{
              backgroundColor: '#070A0F',
              backgroundImage:
                'radial-gradient(circle at 50% 32%, rgba(15, 38, 25, 0.45) 0%, rgba(7, 10, 15, 0.98) 75%)',
              zIndex: 60,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingTop: 160,
            }}
          >
            {/* Minimalist Brand Eyebrow */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '6px 18px',
                borderRadius: 9999,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: COLORS.goldBright,
                  boxShadow: '0 0 8px #FFE566',
                }}
              />
              <span
                style={{
                  fontFamily: SANS_FONT,
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#FAF7F0',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                }}
              >
                EFEK METABOLISME OTAK
              </span>
            </div>

            {/* Clean Editorial Title */}
            <div
              style={{
                fontFamily: PIXEL_HEADER_FONT,
                fontSize: 22,
                fontWeight: 900,
                color: '#FFFFFF',
                textAlign: 'center',
                lineHeight: 1.35,
                marginBottom: 28,
                textShadow: antiArtifactShadow,
              }}
            >
              STEVIA MURNI <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 18 }}>VS</span> GULA PASIR
            </div>

            {/* Two Side-by-Side Minimalist Cards */}
            <div
              style={{
                display: 'flex',
                gap: 20,
                width: 820,
                justifyContent: 'center',
              }}
            >
              {/* CARD 1: STEVIA ALAMI */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(10, 20, 15, 0.88)',
                  border: '2px solid rgba(57, 255, 136, 0.45)',
                  borderRadius: 20,
                  padding: '20px',
                  boxShadow: '0 20px 45px rgba(0,0,0,0.9), 0 0 30px rgba(57, 255, 136, 0.15)',
                  backdropFilter: 'blur(12px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <span style={{ fontFamily: SANS_FONT, fontSize: 15, fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.04em' }}>
                    STEVIA ALAMI
                  </span>
                  <span style={{ fontFamily: PIXEL_SUB_FONT, fontSize: 11, fontWeight: 700, color: COLORS.emeraldNeon, backgroundColor: 'rgba(57, 255, 136, 0.15)', padding: '3px 8px', borderRadius: 6 }}>
                    0g GULA
                  </span>
                </div>

                {/* Minimalist SVG Graph: Smooth flat steady energy curve */}
                <div style={{ width: '100%', height: 90, position: 'relative', marginTop: 4 }}>
                  <svg width="100%" height="100%" viewBox="0 0 320 90" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#39FF88" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#39FF88" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <line x1="0" y1="50" x2="320" y2="50" stroke="rgba(255,255,255,0.12)" strokeDasharray="4 4" strokeWidth="1.5" />
                    <path d="M 0,50 Q 80,47 160,49 T 320,49 L 320,90 L 0,90 Z" fill="url(#emeraldGrad)" />
                    <path d="M 0,50 Q 80,47 160,49 T 320,49" fill="none" stroke="#39FF88" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>

                <div style={{ textAlign: 'center', width: '100%' }}>
                  <div style={{ fontFamily: SANS_FONT, fontSize: 14, fontWeight: 800, color: '#FAF7F0', marginBottom: 2 }}>
                    Fokus Stabil 6+ Jam
                  </div>
                  <div style={{ fontFamily: SANS_FONT, fontSize: 11, color: 'rgba(250, 247, 240, 0.65)', lineHeight: 1.3 }}>
                    Tanpa lonjakan insulin & brain fog
                  </div>
                </div>
              </div>

              {/* CARD 2: GULA PASIR (CUP KAFE) */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(22, 10, 14, 0.88)',
                  border: '2px solid rgba(255, 46, 99, 0.45)',
                  borderRadius: 20,
                  padding: '20px',
                  boxShadow: '0 20px 45px rgba(0,0,0,0.9), 0 0 30px rgba(255, 46, 99, 0.15)',
                  backdropFilter: 'blur(12px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <span style={{ fontFamily: SANS_FONT, fontSize: 15, fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.04em' }}>
                    CUP KAFE
                  </span>
                  <span style={{ fontFamily: PIXEL_SUB_FONT, fontSize: 11, fontWeight: 700, color: COLORS.crimson, backgroundColor: 'rgba(255, 46, 99, 0.15)', padding: '3px 8px', borderRadius: 6 }}>
                    ~25g GULA
                  </span>
                </div>

                {/* Minimalist SVG Graph: Spike and Crash */}
                <div style={{ width: '100%', height: 90, position: 'relative', marginTop: 4 }}>
                  <svg width="100%" height="100%" viewBox="0 0 320 90" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="crimsonGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF2E63" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#FF2E63" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <line x1="0" y1="50" x2="320" y2="50" stroke="rgba(255,255,255,0.12)" strokeDasharray="4 4" strokeWidth="1.5" />
                    <path d="M 0,50 Q 50,12 90,12 Q 130,12 170,60 Q 210,85 260,78 L 320,68 L 320,90 L 0,90 Z" fill="url(#crimsonGrad)" />
                    <path d="M 0,50 Q 50,12 90,12 Q 130,12 170,60 Q 210,85 260,78 L 320,68" fill="none" stroke="#FF2E63" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>

                <div style={{ textAlign: 'center', width: '100%' }}>
                  <div style={{ fontFamily: SANS_FONT, fontSize: 14, fontWeight: 800, color: '#FAF7F0', marginBottom: 2 }}>
                    Sugar Crash 45 Mnt
                  </div>
                  <div style={{ fontFamily: SANS_FONT, fontSize: 11, color: 'rgba(250, 247, 240, 0.65)', lineHeight: 1.3 }}>
                    Gula darah anjlok, lemas & ngantuk
                  </div>
                </div>
              </div>
            </div>
          </AbsoluteFill>
        )}

        {/* ================================================================== */}
        {/* POINT 1 / BODY 1 (BEAT 3)                                          */}
        {/* ================================================================== */}
        {(currentBeat === 'b3_body1' || currentBeat === 'b2_point1') && (
          <div
            style={{
              position: 'absolute',
              left: 540,
              top: 210,
              transform: 'translateX(-50%)',
              zIndex: 90,
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(7, 10, 15, 0.94)',
                border: '3px solid #FF2E63',
                borderRadius: 18,
                padding: '12px 28px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                boxShadow: '0 20px 45px rgba(0,0,0,0.95), 0 0 30px rgba(255,46,99,0.4)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div
                style={{
                  fontFamily: PIXEL_HEADER_FONT,
                  fontSize: 20,
                  color: '#FF2E63',
                }}
              >
                #1
              </div>
              <div
                style={{
                  fontFamily: PIXEL_SUB_FONT,
                  fontSize: 18,
                  color: '#FFFFFF',
                  letterSpacing: '0.05em',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                }}
              >
                {manifest.list_items?.[0]?.label || beatConfig?.card || 'CUP PLASTIK RAWAN BOCOR'}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* POINT 2 / BODY 2 (BEAT 5)                                          */}
        {/* ================================================================== */}
        {(currentBeat === 'b5_body2' || currentBeat === 'b3_point2' || currentBeat === 'b3_proof') && (
          <div
            style={{
              position: 'absolute',
              left: 540,
              top: 210,
              transform: 'translateX(-50%)',
              zIndex: 90,
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(7, 10, 15, 0.94)',
                border: `3px solid ${COLORS.emeraldNeon}`,
                borderRadius: 18,
                padding: '12px 28px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                boxShadow: '0 20px 45px rgba(0,0,0,0.95), 0 0 30px rgba(57,255,136,0.4)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div
                style={{
                  fontFamily: PIXEL_HEADER_FONT,
                  fontSize: 20,
                  color: COLORS.emeraldNeon,
                }}
              >
                #2
              </div>
              <div
                style={{
                  fontFamily: PIXEL_SUB_FONT,
                  fontSize: 18,
                  color: '#FFFFFF',
                  letterSpacing: '0.05em',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                }}
              >
                {manifest.list_items?.[1]?.label || beatConfig?.card || 'BOTOL 180° SEALED ANTI BOCOR'}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* POINT 3 / BODY 3 (BEAT 7)                                          */}
        {/* ================================================================== */}
        {(currentBeat === 'b7_body3' || currentBeat === 'b4_point3' || currentBeat === 'b4_craft') && (
          <div
            style={{
              position: 'absolute',
              left: 540,
              top: 210,
              transform: 'translateX(-50%)',
              zIndex: 90,
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(7, 10, 15, 0.94)',
                border: `3px solid ${COLORS.goldBright}`,
                borderRadius: 18,
                padding: '12px 28px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                boxShadow: '0 20px 45px rgba(0,0,0,0.95), 0 0 30px rgba(255,229,102,0.4)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div
                style={{
                  fontFamily: PIXEL_HEADER_FONT,
                  fontSize: 20,
                  color: COLORS.goldBright,
                }}
              >
                #3
              </div>
              <div
                style={{
                  fontFamily: PIXEL_SUB_FONT,
                  fontSize: 18,
                  color: '#FFFFFF',
                  letterSpacing: '0.05em',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                }}
              >
                {manifest.list_items?.[2]?.label || beatConfig?.card || 'COLD-STEEP & ZERO SUGAR CRASH'}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* COLD CHAIN BEAT (if present in legacy structure)                    */}
        {/* ================================================================== */}
        {currentBeat === 'b5_coldchain' && (
          <div
            style={{
              position: 'absolute',
              left: 540,
              top: 720,
              transform: 'translate(-50%, -50%)',
              width: 660,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 70,
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(7, 10, 15, 0.94)',
                border: `3px solid ${COLORS.cyanFrost}`,
                borderRadius: 16,
                padding: '12px 24px',
                fontFamily: PIXEL_SUB_FONT,
                fontSize: 16,
                color: COLORS.cyanFrost,
                letterSpacing: '0.08em',
                boxShadow: '0 12px 28px rgba(0,0,0,0.9), 0 0 20px rgba(92,225,230,0.4)',
                textAlign: 'center',
              }}
            >
              ❄ SUHU 2-4°C TERKUNCI • SABTU DISPATCH
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* CTA (FINAL BEAT): BEAT 8 (OR LEGACY b5_cta / b6_cta)               */}
        {/* ================================================================== */}
        {(currentBeat === 'b8_cta' || currentBeat === 'b5_cta' || currentBeat === 'b6_cta') && (
          <AbsoluteFill style={{ zIndex: 75 }}>
            {/* Flanking real bottles inside Red Box bounds (x:[192, 896], y:[202, 1236]) */}
            <div
              style={{
                position: 'absolute',
                left: 270,
                top: 1020,
                transform: `translate(-50%, -50%) rotate(-6deg)`,
                width: 140,
                height: 280,
                filter: 'drop-shadow(0 16px 28px rgba(0,0,0,0.95)) drop-shadow(0 0 18px rgba(255,229,102,0.45))',
              }}
            >
              <Img src={staticFile(manifest.sku === 'Signature Milk Tea' ? 'assets/bottles_ssot/milktea_ssot.png' : 'assets/bottles_ssot/choco_ssot.png')} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>

            <div
              style={{
                position: 'absolute',
                left: 810,
                top: 1020,
                transform: `translate(-50%, -50%) rotate(6deg)`,
                width: 140,
                height: 280,
                filter: 'drop-shadow(0 16px 28px rgba(0,0,0,0.95)) drop-shadow(0 0 18px rgba(57,255,136,0.45))',
              }}
            >
              <Img src={staticFile(manifest.sku === 'Choco Hazelnut' ? 'assets/bottles_ssot/choco_ssot.png' : 'assets/bottles_ssot/matcha_ssot.png')} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>

            {/* Center Scarcity CTA Badge */}
            <div
              style={{
                position: 'absolute',
                left: 540,
                top: 210,
                transform: 'translateX(-50%)',
                width: 660,
                backgroundColor: 'rgba(7, 10, 15, 0.94)',
                border: '3px solid #FFE566',
                borderRadius: 20,
                padding: '16px 28px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 20px 50px rgba(0,0,0,0.95), 0 0 35px rgba(255,229,102,0.4)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div
                style={{
                  fontFamily: PIXEL_HEADER_FONT,
                  fontSize: 20,
                  color: '#FFE566',
                  textAlign: 'center',
                  lineHeight: 1.35,
                  textShadow: antiArtifactShadow,
                  textTransform: 'uppercase',
                }}
              >
                {beatConfig?.card || 'MINUMAN ANTI TUMPAH DI LAPTOP'}
              </div>
              <div
                style={{
                  fontFamily: PIXEL_SUB_FONT,
                  fontSize: 14,
                  color: '#FFFFFF',
                  textAlign: 'center',
                  letterSpacing: '0.08em',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                }}
              >
                KLIK LINK DI BIO SEKARANG
              </div>
            </div>
          </AbsoluteFill>
        )}

        {/* ================================================================== */}
        {/* TOP VISUAL HOOK: BEAT 1 (HOOK)                                     */}
        {/* Bold, eye-catching, high-contrast banner at top safe zone          */}
        {/* ================================================================== */}
        {currentBeat === 'b1_hook' && (
          <div
            style={{
              position: 'absolute',
              top: 210,
              left: 540,
              transform: 'translateX(-50%)',
              width: 780,
              backgroundColor: 'rgba(7, 10, 15, 0.94)',
              border: '3.5px solid #FFE566',
              borderRadius: 20,
              padding: '14px 28px',
              textAlign: 'center',
              boxShadow:
                '0 20px 50px rgba(0,0,0,0.95), 0 0 35px rgba(255, 229, 102, 0.5), inset 0 0 15px rgba(255, 229, 102, 0.15)',
              backdropFilter: 'blur(12px)',
              zIndex: 90,
            }}
          >
            <div
              style={{
                fontFamily: PIXEL_HEADER_FONT,
                fontSize: 30,
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1.3,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                textShadow: antiArtifactShadow,
              }}
            >
              {manifest.written_hook?.pre}{' '}
              <span style={{ color: COLORS.goldBright, textShadow: '0 0 20px rgba(255,229,102,0.8)' }}>
                {manifest.written_hook?.accent}
              </span>{' '}
              {manifest.written_hook?.post}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TOP VISUAL HOOK: BEAT 2 (LEAD)                                     */}
        {/* High-impact visual hook for the lead, zero meta labels              */}
        {/* ================================================================== */}
        {currentBeat === 'b2_lead' && (
          <div
            style={{
              position: 'absolute',
              top: 210,
              left: 540,
              transform: 'translateX(-50%)',
              width: 760,
              backgroundColor: 'rgba(7, 10, 15, 0.94)',
              border: '3.5px solid #FF2E63',
              borderRadius: 20,
              padding: '14px 28px',
              textAlign: 'center',
              boxShadow:
                '0 20px 50px rgba(0,0,0,0.95), 0 0 35px rgba(255, 46, 99, 0.5), inset 0 0 15px rgba(255, 46, 99, 0.15)',
              backdropFilter: 'blur(12px)',
              zIndex: 90,
            }}
          >
            <div
              style={{
                fontFamily: PIXEL_HEADER_FONT,
                fontSize: 26,
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1.3,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                textShadow: antiArtifactShadow,
              }}
            >
              {beatConfig?.card || 'KENAPA INI BAHAYA BUAT LAPTOP LO'}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* DYNAMIC EYE-TRACKING CAPTION STREAM                                */}
        {/* Anchored at top: 680 across all beats as requested                 */}
        {/* ================================================================== */}
        {showSubtitles && activeChunk && (
          <div
            style={{
              position: 'absolute',
              top: 680,
              left: 540,
              transform: 'translateX(-50%)',
              maxWidth: 760,
              textAlign: 'center',
              zIndex: 95,
            }}
          >
            <div
              style={{
                display: 'inline-block',
                backgroundColor: 'rgba(7, 10, 15, 0.88)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 14,
                padding: '8px 24px',
                boxShadow: '0 12px 30px rgba(0,0,0,0.95)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span
                style={{
                  fontFamily: PIXEL_HEADER_FONT,
                  fontSize: 26,
                  fontWeight: 900,
                  color: activeChunk.highlight ? COLORS.goldBright : '#FFFFFF',
                  letterSpacing: '0.04em',
                  lineHeight: 1.3,
                  textTransform: 'uppercase',
                  textShadow: antiArtifactShadow,
                }}
              >
                {activeChunk.text}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Seamless Infinite Loop Splice Overlay (Final 15 Frames) */}
      {frame >= manifest.totalFrames - 15 && (
        <AbsoluteFill
          style={{
            backgroundColor: '#070A0F',
            opacity: loopOpacity,
            pointerEvents: 'none',
            zIndex: 999,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
