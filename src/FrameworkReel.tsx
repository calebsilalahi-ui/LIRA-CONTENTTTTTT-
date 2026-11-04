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
      const startF = manifest.beatFrames[bId] ?? 0;
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

  // Suppress subtitles at Frame 0 until frame 40 (~1.33s) to decouple saccadic eye-flow (plan §2.4 & §4.1)
  const showSubtitles = frame >= 40;

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

        {/* Ambient Floating 8-Bit Emerald/Gold Motes */}
        {Array.from({ length: 16 }, (_, i) => {
          const speed = 0.9 + (i % 3) * 0.3;
          const prog = ((frame * speed + i * 35) % 100) / 100;
          const bx = 210 + ((i * 73) % 660);
          const sx = Math.sin(prog * Math.PI * 2.5 + i) * 22;
          const y = 220 + prog * 980;
          const size = i % 3 === 0 ? 9 : 6;
          const alpha = prog < 0.15 ? prog / 0.15 : prog > 0.85 ? (1 - prog) / 0.15 : 0.85;
          const color = i % 2 === 0 ? '#39FF88' : '#FFE566';
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: bx + sx,
                top: y,
                width: size,
                height: size,
                backgroundColor: color,
                boxShadow: `0 0 10px ${color}, 2px 2px 0 rgba(0,0,0,0.85)`,
                opacity: alpha,
                pointerEvents: 'none',
                zIndex: 40,
              }}
            />
          );
        })}

        {/* ================================================================== */}
        {/* BEAT 1 (00s - 05s): FRAME-0 4-LAYER SUPERHOOK STACK                */}
        {/* ================================================================== */}
        {currentBeat === 'b1_hook' && (
          <div
            style={{
              position: 'absolute',
              left: 540,
              top: 720,
              transform: 'translate(-50%, -50%)',
              width: 640,
              backgroundColor: 'rgba(11, 15, 25, 0.94)',
              border: '3px solid #FF2E63',
              borderRadius: 22,
              padding: '24px 28px',
              boxShadow:
                '0 24px 60px rgba(0,0,0,0.95), 0 0 35px rgba(255, 46, 99, 0.5), inset 0 0 16px rgba(255, 46, 99, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 14,
              zIndex: 70,
              backdropFilter: 'blur(12px)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                backgroundColor: 'rgba(255, 46, 99, 0.18)',
                border: '1.5px solid #FF2E63',
                padding: '6px 16px',
                borderRadius: 9999,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: '#FF2E63',
                  boxShadow: '0 0 10px #FF2E63',
                }}
              />
              <span
                style={{
                  fontFamily: PIXEL_SUB_FONT,
                  fontSize: 13,
                  fontWeight: 800,
                  color: '#FF2E63',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                {manifest.hook_category?.toUpperCase() || 'SOMATIC ALERT'}
              </span>
            </div>

            <div
              style={{
                fontFamily: PIXEL_HEADER_FONT,
                fontSize: 22,
                color: '#FFFFFF',
                textAlign: 'center',
                lineHeight: 1.45,
                textShadow: antiArtifactShadow,
              }}
            >
              {manifest.threeP?.promise || '3 TANDA DI CAFE MERUSAK FOKUS LO'}
            </div>

            <div
              style={{
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: 9999,
                height: 10,
                overflow: 'hidden',
                marginTop: 6,
              }}
            >
              <div
                style={{
                  width: `${interpolate(frame, [0, 90], [25, 95], { extrapolateRight: 'clamp' })}%`,
                  height: '100%',
                  backgroundColor: '#FF2E63',
                  boxShadow: '0 0 12px #FF2E63',
                }}
              />
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* BEAT 2 (05s - 10s): CONTEXT AGITATION & OPEN LOOP 3-ITEM HUD       */}
        {/* ================================================================== */}
        {/* ================================================================== */}
        {/* POINT 1 / BEAT 2                                                   */}
        {/* ================================================================== */}
        {(currentBeat === 'b2_point1' || currentBeat === 'b2_agitation') && (
          <div
            style={{
              position: 'absolute',
              left: 540,
              top: 680,
              transform: 'translate(-50%, -50%)',
              width: 660,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              zIndex: 70,
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(11, 15, 25, 0.95)',
                border: '2px solid #FF2E63',
                borderRadius: 16,
                padding: '16px 28px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                boxShadow: '0 16px 36px rgba(0,0,0,0.95), 0 0 25px rgba(255,46,99,0.4)',
              }}
            >
              <div
                style={{
                  fontFamily: PIXEL_HEADER_FONT,
                  fontSize: 18,
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
                }}
              >
                {manifest.list_items?.[0]?.label || beatConfig?.card || 'CUP PLASTIK GAMPANG TUMPAH'}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* POINT 2 / BEAT 3                                                   */}
        {/* ================================================================== */}
        {(currentBeat === 'b3_point2' || currentBeat === 'b3_proof') && (
          <div
            style={{
              position: 'absolute',
              left: 540,
              top: 680,
              transform: 'translate(-50%, -50%)',
              width: 660,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              zIndex: 70,
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(11, 15, 25, 0.95)',
                border: `2px solid ${COLORS.emeraldNeon}`,
                borderRadius: 16,
                padding: '16px 28px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                boxShadow: '0 16px 36px rgba(0,0,0,0.95), 0 0 25px rgba(57,255,136,0.4)',
              }}
            >
              <div
                style={{
                  fontFamily: PIXEL_HEADER_FONT,
                  fontSize: 18,
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
                }}
              >
                {manifest.list_items?.[1]?.label || beatConfig?.card || 'BOTOL 180° SEALED ANTI BOCOR'}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* POINT 3 / BEAT 4                                                   */}
        {/* ================================================================== */}
        {(currentBeat === 'b4_point3' || currentBeat === 'b4_craft') && (
          <div
            style={{
              position: 'absolute',
              left: 540,
              top: 680,
              transform: 'translate(-50%, -50%)',
              width: 660,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              zIndex: 70,
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(11, 15, 25, 0.95)',
                border: `2px solid ${COLORS.goldBright}`,
                borderRadius: 16,
                padding: '16px 28px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                boxShadow: '0 16px 36px rgba(0,0,0,0.95), 0 0 25px rgba(255,229,102,0.4)',
              }}
            >
              <div
                style={{
                  fontFamily: PIXEL_HEADER_FONT,
                  fontSize: 18,
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
                }}
              >
                {manifest.list_items?.[2]?.label || beatConfig?.card || 'COLD-STEEP & ZERO SUGAR CRASH'}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* COLD CHAIN BEAT (if present in 6-beat legacy structure)             */}
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
        {/* CTA (FINAL BEAT): FANFARE & FLANKING REAL BOTTLES                  */}
        {/* ================================================================== */}
        {(currentBeat === 'b5_cta' || currentBeat === 'b6_cta') && (
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
                top: 660,
                transform: 'translate(-50%, -50%)',
                width: 620,
                backgroundColor: 'rgba(11, 15, 25, 0.95)',
                border: '3px solid #FFE566',
                borderRadius: 20,
                padding: '20px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                boxShadow: '0 20px 50px rgba(0,0,0,0.95), 0 0 35px rgba(255,229,102,0.4)',
              }}
            >
              <div
                style={{
                  fontFamily: PIXEL_HEADER_FONT,
                  fontSize: 18,
                  color: '#FFE566',
                  textAlign: 'center',
                  lineHeight: 1.4,
                  textShadow: antiArtifactShadow,
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
                  letterSpacing: '0.06em',
                }}
              >
                KLIK LINK DI BIO SEKARANG
              </div>
            </div>
          </AbsoluteFill>
        )}

        {/* ================================================================== */}
        {/* UPPER RED BOX: WRITTEN HOOK & TOP CARD HUD                         */}
        {/* Strictly within x:[192, 896], y:[202, 1236]                        */}
        {/* ================================================================== */}
        <div
          style={{
            position: 'absolute',
            top: 230,
            left: 540,
            transform: 'translateX(-50%)',
            width: 680,
            textAlign: 'center',
            zIndex: 90,
          }}
        >
          {/* Frame 0 Written Hook (<= 6 words, 1 accent word) */}
          <div
            style={{
              fontFamily: PIXEL_HEADER_FONT,
              fontSize: 26,
              color: '#FFFFFF',
              lineHeight: 1.4,
              letterSpacing: '0.03em',
              textShadow: antiArtifactShadow,
            }}
          >
            {manifest.written_hook?.pre}{' '}
            <span style={{ color: COLORS.goldBright }}>{manifest.written_hook?.accent}</span>{' '}
            {manifest.written_hook?.post}
          </div>

          {/* Current Beat HUD Card Tag */}
          {beatConfig?.card && (
            <div
              style={{
                display: 'inline-block',
                marginTop: 10,
                backgroundColor: 'rgba(7, 10, 15, 0.9)',
                border: '1.5px solid rgba(255, 255, 255, 0.3)',
                padding: '4px 14px',
                borderRadius: 9999,
                fontFamily: PIXEL_SUB_FONT,
                fontSize: 11,
                color: '#5CE1E6',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {beatConfig.card}
            </div>
          )}
        </div>

        {/* ================================================================== */}
        {/* LOWER RED BOX: DYNAMIC EYE-TRACKING CAPTION STREAM                 */}
        {/* Suppressed until frame 40 (~1.33s), max width 680px, anchored 62% */}
        {/* ================================================================== */}
        {showSubtitles && activeChunk && (
          <div
            style={{
              position: 'absolute',
              top: 1000,
              left: 540,
              transform: 'translateX(-50%)',
              width: 660,
              textAlign: 'center',
              zIndex: 95,
            }}
          >
            <span
              style={{
                fontFamily: PIXEL_HEADER_FONT,
                fontSize: 26,
                color: activeChunk.highlight ? COLORS.goldBright : '#FFFFFF',
                letterSpacing: '0.04em',
                lineHeight: 1.35,
                textTransform: 'uppercase',
                textShadow: antiArtifactShadow,
              }}
            >
              {activeChunk.text}
            </span>
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
