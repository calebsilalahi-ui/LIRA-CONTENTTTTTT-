import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { loadFont as loadPressStart } from '@remotion/google-fonts/PressStart2P';
import { loadFont as loadSilkscreen } from '@remotion/google-fonts/Silkscreen';
import { loadFont as loadPlusJakarta } from '@remotion/google-fonts/PlusJakartaSans';
import { TikTokCaption } from './TikTokCaption';
import captionsData from './reel_new_12_sapa_mart_comeback_captions.json';

const { fontFamily: PIXEL_HEADER_FONT } = loadPressStart();
const { fontFamily: PIXEL_SUB_FONT } = loadSilkscreen();
const { fontFamily: SANS_FONT } = loadPlusJakarta();

// ============================================================================
// REEL 12: SAPA MART 1-STAR REVIEW COMEBACK
// Visuals: 100% Authentic Full-Bleed Illustrated 16/32-Bit Lira Pixel Art
// Dynamic: Continuous Camera Carries, Whip-Pans, Gravity Tilt, Particle Streams,
//          Swinging Brass Clock, Sleeping Nightcap + Zzz, Spring Bottle Drops,
//          \u2605☆☆☆☆ -> \u2605\u2605\u2605\u2605\u2605 Flip, and Eye-Level TikTokCaption.
// 934 frames @ 30fps = 31.13s | 1080x1440 (3:4 Portrait)
// ============================================================================
export const REEL_12_DURATION = 934;

const COLORS = {
  emeraldNeon: '#39FF88',
  cyanFrost: '#5CE1E6',
  hazelnutGold: '#E6A145',
  oatCream: '#FAF7F0',
  gold: '#D4AF37',
  goldBright: '#FFE566',
  crimson: '#FF2E63',
};

// ============================================================================
// SUB-COMPONENT: 8-BIT PIXEL NIGHTCAP + RISING Zzz ON EMPTY CHILLER SHELF
// ============================================================================
const ChillerNightcapAndZzz: React.FC<{
  frame: number;
  flyProgress: number;
}> = ({ frame, flyProgress }) => {
  if (flyProgress >= 1) return null;

  const bobY = Math.sin(frame * 0.14) * 7;
  const flyX = flyProgress * 260;
  const flyY = -flyProgress * 280;
  const flyRot = flyProgress * 55;
  const opacity = interpolate(flyProgress, [0, 0.75, 1], [1, 0.9, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: 815,
        top: 675,
        transform: `translate(-50%, -50%) translate(${flyX}px, ${bobY + flyY}px) rotate(${flyRot}deg)`,
        opacity,
        pointerEvents: 'none',
        zIndex: 60,
        filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.85))',
      }}
    >
      <svg width="150" height="120" viewBox="0 0 30 24" style={{ shapeRendering: 'crispEdges' }}>
        <rect x="3" y="17" width="20" height="4" fill="#F8FAFC" />
        <rect x="2" y="18" width="22" height="2" fill="#E2E8F0" />
        <rect x="4" y="13" width="18" height="4" fill="#0284C7" />
        <rect x="6" y="9" width="15" height="4" fill="#38BDF8" />
        <rect x="9" y="6" width="13" height="3" fill="#38BDF8" />
        <rect x="14" y="4" width="10" height="3" fill="#0284C7" />
        <rect x="20" y="7" width="6" height="4" fill="#0369A1" />
        <rect x="23" y="10" width="5" height="5" fill="#F8FAFC" />
        <rect x="24" y="9" width="3" height="7" fill="#FFFFFF" />
      </svg>

      {flyProgress < 0.35 &&
        [0, 1, 2].map((i) => {
          const cycle = ((frame * 1.05 + i * 28) % 84) / 84;
          const zY = -20 - cycle * 150;
          const zX = 15 + Math.sin(cycle * Math.PI * 2 + i) * 20 + i * 16;
          const zOp = cycle < 0.15 ? cycle / 0.15 : cycle > 0.8 ? (1 - cycle) / 0.2 : 1;
          const sizes = [32, 25, 18];
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                transform: `translate(${zX}px, ${zY}px)`,
                opacity: zOp,
                fontFamily: PIXEL_HEADER_FONT,
                fontSize: sizes[i],
                color: '#7DD3FC',
                textShadow: '4px 4px 0 #000, -2px -2px 0 #000',
              }}
            >
              Z
            </div>
          );
        })}
    </div>
  );
};

// ============================================================================
// SUB-COMPONENT: PROCEDURAL PARTICLE STREAM OVER THE ILLUSTRATED SCENE
// ============================================================================
const SceneParticleStream: React.FC<{
  frame: number;
  mode: 'choco' | 'matcha' | 'frost';
  opacity: number;
}> = ({ frame, mode, opacity }) => {
  if (opacity <= 0.02) return null;

  const palette =
    mode === 'choco'
      ? ['#FFE566', '#E6A145', '#D4AF37', '#FDE68A']
      : mode === 'matcha'
      ? ['#39FF88', '#5CE1E6', '#A7F3D0', '#FFE566']
      : ['#E0F2FE', '#7DD3FC', '#39FF88', '#FFE566'];

  return (
    <AbsoluteFill style={{ opacity, pointerEvents: 'none', zIndex: 48 }}>
      {Array.from({ length: 26 }, (_, i) => {
        const speed = 1.4 + (i % 5) * 0.25;
        const progress = ((frame * speed + i * 17) % 100) / 100;
        const baseX = 140 + ((i * 83) % 800);
        const swayX = Math.sin(progress * Math.PI * 2.4 + i) * 42;
        const y = 180 + progress * 1080;
        const size = i % 4 === 0 ? 14 : i % 2 === 0 ? 10 : 7;
        const alpha =
          progress < 0.12
            ? progress / 0.12
            : progress > 0.85
            ? (1 - progress) / 0.15
            : 0.9;
        const color = palette[i % palette.length];

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: baseX + swayX,
              top: y,
              width: size,
              height: size,
              backgroundColor: color,
              boxShadow: `0 0 12px ${color}, 2px 2px 0 rgba(0,0,0,0.8)`,
              opacity: alpha,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ============================================================================
// SUB-COMPONENT: HANGING BRASS BREW CLOCK & SWINGING PENDULUM + 42/WK COUNTER
// ============================================================================
const FloatingBrewClockHUD: React.FC<{
  frame: number;
  gravityTiltDeg: number;
}> = ({ frame, gravityTiltDeg }) => {
  const pendulumAngle = Math.sin(frame * 0.22) * 15 + gravityTiltDeg * 1.25;

  const isSpinning =
    (frame >= 134 && frame < 166) ||
    (frame >= 253 && frame < 285) ||
    (frame >= 385 && frame < 418) ||
    (frame >= 600 && frame < 630);

  const minuteHandDeg = isSpinning
    ? frame * 30
    : frame < 255
    ? 90
    : frame < 387
    ? 90
    : 180;

  const hourHandDeg = isSpinning
    ? frame * 7
    : frame < 255
    ? 105 // 03:30
    : frame < 387
    ? 217 // 07:15 MON
    : 255; // 08:30 TUE

  let counterLabel = '00 / 42';
  let counterColor = COLORS.crimson;
  let shiftTag = 'EMPTY 2 WKS';

  if (frame >= 136 && frame < 255) {
    counterLabel = '42 / WK';
    counterColor = COLORS.goldBright;
    shiftTag = 'RESTOCKING';
  } else if (frame >= 255 && frame < 387) {
    counterLabel = 'MON 07:15';
    counterColor = COLORS.hazelnutGold;
    shiftTag = 'CHOCO DROP';
  } else if (frame >= 387 && frame < 601) {
    counterLabel = 'TUE 08:30';
    counterColor = COLORS.emeraldNeon;
    shiftTag = 'GREEN DROP';
  } else if (frame >= 601 && frame < 759) {
    const left = Math.max(
      2,
      Math.round(
        interpolate(frame, [620, 748], [42, 2], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      )
    );
    counterLabel = `${String(left).padStart(2, '0')} LEFT!`;
    counterColor = left < 16 ? COLORS.crimson : COLORS.goldBright;
    shiftTag = '42 CAP RUSH';
  } else if (frame >= 759) {
    counterLabel = '42 / WK';
    counterColor = COLORS.emeraldNeon;
    shiftTag = 'IN STOCK';
  }

  return (
    <div
      style={{
        position: 'absolute',
        right: 36,
        top: 205,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 820,
        pointerEvents: 'none',
        filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.85))',
      }}
    >
      {/* Brass Chain */}
      <div
        style={{
          width: 8,
          height: 36,
          backgroundImage:
            'repeating-linear-gradient(180deg, #D4AF37 0px, #D4AF37 6px, #785A28 6px, #785A28 12px)',
          borderLeft: '2px solid #000',
          borderRight: '2px solid #000',
        }}
      />

      {/* Watch Crown */}
      <div
        style={{
          width: 28,
          height: 14,
          border: '4px solid #D4AF37',
          borderRadius: '8px 8px 0 0',
          marginBottom: -3,
          backgroundColor: '#0F172A',
        }}
      />

      {/* Brass Pocket Watch Dial */}
      <div
        style={{
          position: 'relative',
          width: 104,
          height: 104,
          borderRadius: '50%',
          backgroundColor: '#FAF7F0',
          border: '8px solid #D4AF37',
          outline: '4px solid #000',
          boxShadow: 'inset 0 0 14px rgba(124,93,73,0.45)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ position: 'absolute', top: 5, width: 5, height: 10, backgroundColor: '#0F172A' }} />
        <div style={{ position: 'absolute', bottom: 5, width: 5, height: 10, backgroundColor: '#0F172A' }} />
        <div style={{ position: 'absolute', left: 5, width: 10, height: 5, backgroundColor: '#0F172A' }} />
        <div style={{ position: 'absolute', right: 5, width: 10, height: 5, backgroundColor: '#0F172A' }} />

        {/* Hour Hand */}
        <div
          style={{
            position: 'absolute',
            width: 7,
            height: 26,
            backgroundColor: '#1D4A38',
            bottom: '50%',
            left: 'calc(50% - 3.5px)',
            transformOrigin: 'bottom center',
            transform: `rotate(${hourHandDeg}deg)`,
            borderRadius: 2,
          }}
        />

        {/* Minute Hand */}
        <div
          style={{
            position: 'absolute',
            width: 5,
            height: 36,
            backgroundColor: '#7C5D49',
            bottom: '50%',
            left: 'calc(50% - 2.5px)',
            transformOrigin: 'bottom center',
            transform: `rotate(${minuteHandDeg}deg)`,
            borderRadius: 2,
          }}
        />

        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: '#D4AF37',
            border: '3px solid #000',
            zIndex: 5,
          }}
        />
      </div>

      {/* Swinging Brass Pendulum */}
      <div
        style={{
          transformOrigin: 'top center',
          transform: `rotate(${pendulumAngle}deg)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: -2,
        }}
      >
        <div style={{ width: 5, height: 40, backgroundColor: '#D4AF37', border: '2px solid #000' }} />
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            backgroundColor: '#FFE566',
            border: '4px solid #D4AF37',
            outline: '3px solid #000',
            boxShadow: '0 0 14px rgba(255,229,102,0.75)',
          }}
        />
      </div>

      {/* Live Digital Quota & Shift Readout */}
      <div
        style={{
          marginTop: 10,
          backgroundColor: 'rgba(7, 10, 15, 0.94)',
          border: `3px solid ${counterColor}`,
          borderRadius: 10,
          padding: '6px 12px',
          boxShadow: `0 6px 18px rgba(0,0,0,0.9), 0 0 14px ${counterColor}44`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
        }}
      >
        <span
          style={{
            fontFamily: PIXEL_HEADER_FONT,
            fontSize: 13,
            color: counterColor,
            whiteSpace: 'nowrap',
          }}
        >
          {counterLabel}
        </span>
        <span
          style={{
            fontFamily: PIXEL_SUB_FONT,
            fontSize: 10,
            color: '#CBD5E1',
            letterSpacing: '0.06em',
            whiteSpace: 'nowrap',
          }}
        >
          {shiftTag}
        </span>
      </div>
    </div>
  );
};

// ============================================================================
// SUB-COMPONENT: SLEEK FLOATING TOP GLASSMORPHIC CARD + STAR RATING FLIP
// (Matches Reel 9, Reel 10, Reel 11 Top Cards 1:1!)
// ============================================================================
const TopLiraGlassCard: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const isBeat1 = frame < 136;
  const isBeat2 = frame >= 136 && frame < 255;
  const isBeat3 = frame >= 255 && frame < 387;
  const isBeat4 = frame >= 387 && frame < 601;
  const isBeat5 = frame >= 601 && frame < 759;
  const isBeat6 = frame >= 759;

  let borderColor = COLORS.crimson;
  let tagText = 'SAPA MART REVIEW ALERT • 1.0 BINTANG';
  let headlineText = '"KULKAS SAPA MART KOSONG 2 MINGGU?!"';
  let subText = 'BANDUNG TRIP BLACKOUT BERAKHIR';

  if (isBeat2) {
    borderColor = COLORS.goldBright;
    tagText = 'OFFICIAL RETAIL UPDATE • @DRINKLIRA';
    headlineText = 'LIRA RESMI BALIK RESTOCK DI SAPA MART!';
    subText = 'CATCH IT WHILE IT LASTS • FRESH BATCH';
  } else if (isBeat3) {
    borderColor = COLORS.hazelnutGold;
    tagText = 'SHIFT 1 • SENIN PAGI JAM 07:15';
    headlineText = 'CHOCO MONDAY: DOUBLE HAZELNUT DROP';
    subText = 'DARK COCOA + ROASTED HAZELNUT • BREWED 03:30';
  } else if (isBeat4) {
    borderColor = COLORS.emeraldNeon;
    tagText = 'SHIFT 2 • SELASA PAGI JAM 08:30';
    headlineText = 'TUESDAY GREEN: MATCHA OATSIDE & MILK TEA';
    subText = '100% EKSTRAK STEVIA ALAMI • 0G GULA PASIR';
  } else if (isBeat5) {
    borderColor = COLORS.crimson;
    tagText = 'STRICT CONSIGNMENT QUOTA • SAPA MART';
    headlineText = 'DIKUNCI CUMA LIMITED BATCH / MINGGU!';
    subText = 'TELAT DIKIT = LANGSUNG LUDES DI KULKAS';
  } else if (isBeat6) {
    borderColor = COLORS.goldBright;
    tagText = 'SAPA MART REVIEW UPDATED • 5.0 BINTANG';
    headlineText = 'TIM SENIN CHOCO ATAU SELASA MATCHA?';
    subText = 'KOMEN DI BAWAH • PO BATCH SABTU DI BIO';
  }

  // Star count (1 star in Beat 1, flips 1->5 stars in Beat 6)
  const showStars = isBeat1 || isBeat6;
  const activeStars = isBeat1
    ? 1
    : Math.min(5, 1 + Math.floor(Math.max(0, frame - 759) / 6));

  const hookShakeX =
    frame >= 18 && frame < 62 ? Math.sin(frame * 3.8) * 5 : 0;

  return (
    <div
      style={{
        position: 'absolute',
        top: 44,
        left: '50%',
        transform: `translateX(-50%) translateX(${hookShakeX}px)`,
        width: 920,
        backgroundColor: 'rgba(7, 10, 15, 0.92)',
        border: `2.5px solid ${borderColor}`,
        boxShadow: `0 16px 40px rgba(0, 0, 0, 0.92), 0 0 28px ${borderColor}40`,
        borderRadius: 20,
        padding: '14px 26px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        zIndex: 850,
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Top Row: Pulsing Dot + Silkscreen Tag + Optional 5-Star Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 11,
            height: 11,
            borderRadius: '50%',
            backgroundColor: borderColor,
            boxShadow: `0 0 12px ${borderColor}`,
          }}
        />
        <span
          style={{
            color: borderColor,
            fontFamily: PIXEL_SUB_FONT,
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: '0.1em',
          }}
        >
          {tagText}
        </span>

        {showStars && (
          <div style={{ display: 'flex', gap: 4, marginLeft: 6 }}>
            {[1, 2, 3, 4, 5].map((sIdx) => {
              const lit = sIdx <= activeStars;
              const pop =
                isBeat6 && lit
                  ? spring({
                      frame: Math.max(0, frame - (759 + (sIdx - 1) * 6)),
                      fps,
                      config: { damping: 9, stiffness: 220 },
                    })
                  : 1;
              return (
                <span
                  key={sIdx}
                  style={{
                    fontFamily: PIXEL_HEADER_FONT,
                    fontSize: 18,
                    color: lit
                      ? isBeat1
                        ? COLORS.crimson
                        : COLORS.goldBright
                      : '#334155',
                    transform: `scale(${0.3 + 0.7 * pop})`,
                    display: 'inline-block',
                  }}
                >
                  {'\u2605'}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Bold Headline */}
      <div
        style={{
          color: '#FFFFFF',
          fontFamily: `${SANS_FONT}, Inter, sans-serif`,
          fontSize: 25,
          fontWeight: 900,
          letterSpacing: '-0.01em',
          textAlign: 'center',
          lineHeight: 1.2,
        }}
      >
        {headlineText}
      </div>

      {/* Sub-caption line */}
      <div
        style={{
          color: '#CBD5E1',
          fontFamily: `${SANS_FONT}, Inter, sans-serif`,
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        {subText}
      </div>
    </div>
  );
};

// ============================================================================
// SUB-COMPONENT: DYNAMIC CHILLER SHELF BOTTLE OVERLAY (Beats 3 & 5B)
// Places clean SSOT bottles directly onto the SAPA Mart Chiller in s2_chiller_a.jpg!
// ============================================================================
const SapaChillerShelfBottles: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
  mode: 'choco' | 'mixed';
  depleteCount: number;
  gravityTiltDeg: number;
}> = ({ frame, fps, startFrame, mode, depleteCount, gravityTiltDeg }) => {
  // Coordinates aligned strictly to the empty middle LIRA shelf in s2_chiller_a/b.jpg
  const slots = [
    {
      x: 736,
      y: 632,
      delay: 0,
      src:
        mode === 'choco'
          ? 'assets/bottles_ssot/choco_ssot.png'
          : 'assets/bottles_ssot/choco_ssot.png',
    },
    {
      x: 792,
      y: 638,
      delay: 4,
      src:
        mode === 'choco'
          ? 'assets/bottles_ssot/choco_ssot.png'
          : 'assets/bottles_ssot/matcha_ssot.png',
    },
    {
      x: 850,
      y: 644,
      delay: 8,
      src:
        mode === 'choco'
          ? 'assets/bottles_ssot/choco_ssot.png'
          : 'assets/bottles_ssot/milktea_ssot.png',
    },
    {
      x: 910,
      y: 650,
      delay: 12,
      src:
        mode === 'choco'
          ? 'assets/bottles_ssot/choco_ssot.png'
          : 'assets/bottles_ssot/matcha_ssot.png',
    },
  ];

  return (
    <>
      {/* Shelf-talker strip neatly covering the red SOLD OUT sign on the middle shelf */}
      <div
        style={{
          position: 'absolute',
          left: 816,
          top: 736,
          transform: 'translate(-50%, -50%) rotate(6deg)',
          backgroundColor: mode === 'choco' ? '#3E2723' : '#0E291E',
          border: `3.5px solid ${
            mode === 'choco' ? COLORS.hazelnutGold : COLORS.emeraldNeon
          }`,
          padding: '6px 14px',
          boxShadow: '4px 4px 0 #000',
          fontFamily: PIXEL_HEADER_FONT,
          fontSize: 13,
          color: COLORS.oatCream,
          whiteSpace: 'nowrap',
          zIndex: 55,
        }}
      >
        {mode === 'choco' ? 'CHOCO IN STOCK' : '42/WK RESTOCK'}
      </div>

      {slots.map((s, idx) => {
        const isDepleted = idx < depleteCount;
        const dropSpring = spring({
          frame: Math.max(0, frame - (startFrame + s.delay)),
          fps,
          config: { damping: 10, stiffness: 170, mass: 0.65 },
        });

        const flyOutProgress = isDepleted
          ? interpolate(frame, [685 + idx * 10, 706 + idx * 10], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
          : 0;

        const squashY = interpolate(dropSpring, [0, 0.6, 0.85, 1], [0.4, 1.15, 0.94, 1]);
        const squashX = interpolate(dropSpring, [0, 0.6, 0.85, 1], [1.25, 0.9, 1.05, 1]);
        const dropY = interpolate(dropSpring, [0, 1], [-120, 0]);
        const flyX = -flyOutProgress * 420;
        const flyY = -flyOutProgress * 80;
        const scale = dropSpring * (1 - flyOutProgress);

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: s.x + flyX,
              top: s.y + dropY + flyY,
              width: 74,
              height: 142,
              transform: `translate(-50%, -50%) scale(${scale * squashX}, ${
                scale * squashY
              }) rotate(${gravityTiltDeg * 0.9 - flyOutProgress * 35}deg)`,
              zIndex: 50 + idx,
              filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.85))',
            }}
          >
            <Img
              src={staticFile(s.src)}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        );
      })}
    </>
  );
};

// ============================================================================
// MAIN COMPOSITION: REEL 12 SAPA MART COMEBACK
// ============================================================================
export const Reel12_SapaMartComeback: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Organic breathing cycle (matches LIRA_VIDEO_CREATION_SYSTEM.md)
  const breathe = Math.sin((frame / 42) * Math.PI) * 0.014;
  // 2-frame pixel-art pose toggle on beats
  const poseToggle = Math.floor(frame / 18) % 2 === 0;

  // --------------------------------------------------------------------------
  // CONTINUOUS CAMERA CARRIES, WHIP-PANS, ZOOM & GRAVITY TILT (@onetake)
  // --------------------------------------------------------------------------
  // Opening Hook Crash Zoom (0 -> 22f)
  const hookZoom = interpolate(frame, [0, 22], [1.16, 1.0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Beat 1 1-Star Error Shake (18 -> 55f)
  const errorShakeX = frame >= 18 && frame < 55 ? Math.sin(frame * 4.2) * 5 : 0;
  const errorShakeY = frame >= 18 && frame < 55 ? Math.cos(frame * 3.8) * 3 : 0;

  // Whip-Pan transitions at Beat boundaries (136f, 255f, 387f, 516f, 601f, 685f, 759f)
  const whipBoundaries = [136, 255, 387, 516, 601, 685, 759];
  let whipOffsetX = 0;
  let whipFlash = 0;
  for (const b of whipBoundaries) {
    if (frame >= b - 6 && frame < b + 10) {
      whipOffsetX += interpolate(
        frame,
        [b - 6, b, b + 10],
        [0, b % 2 === 0 ? -75 : 75, 0],
        { easing: Easing.inOut(Easing.cubic) }
      );
      whipFlash = Math.max(
        whipFlash,
        interpolate(frame, [b - 2, b, b + 6], [0, 0.35, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      );
    }
  }

  // Beat 3 Chiller Close-Up Zoom Carry (255 -> 387f: focuses onto SAPA Mart chiller shelves)
  const chillerZoomWeight =
    interpolate(frame, [252, 278], [0, 1], {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }) -
    interpolate(frame, [378, 395], [0, 1], {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

  // Beat 5B Whole-Stage Gravity Tilt (685 -> 758f: "Telat dikit, langsung ludes!")
  const tiltWeight =
    interpolate(frame, [685, 704], [0, 1], {
      easing: Easing.out(Easing.back(1.5)),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }) -
    interpolate(frame, [748, 766], [0, 1], {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

  const gravityTiltDeg = tiltWeight * -9.5;
  // Ensure scale >= 1.24 during -9.5deg rotation and whip-pans so zero black edges ever show
  const whipScaleBoost = Math.abs(whipOffsetX) > 1 ? 0.16 : 0;
  const totalScale =
    hookZoom +
    breathe +
    chillerZoomWeight * 0.28 +
    tiltWeight * 0.25 +
    whipScaleBoost;
  const totalPanX =
    errorShakeX +
    whipOffsetX -
    chillerZoomWeight * 135;
  const totalPanY = errorShakeY - chillerZoomWeight * 25;

  // Nightcap fly-off when Choco Monday restock hits
  const nightcapFly = interpolate(frame, [250, 276], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Stevia droplet fall in Sub-Beat 4B (516 -> 601f)
  const steviaDropY = interpolate(frame, [535, 565], [0, 95], {
    easing: Easing.in(Easing.quad),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const steviaDropOp = interpolate(frame, [535, 558, 566], [1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Bottle depletion during Beat 5B Scarcity Rush (685 -> 758f)
  const depleteCount =
    frame >= 685 && frame < 759
      ? Math.min(4, Math.floor((frame - 685) / 12) + 1)
      : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#070A0F', overflow: 'hidden' }}>
      {/* ================================================================== */}
      {/* 1. AUDIO ENGINE: CALEB VOICEOVER + LOFI GROOVE + 8-BIT & FOLEY SFX */}
      {/* ================================================================== */}
      <Audio
        src={staticFile('assets/reel_new_12_sapa_mart_comeback.mp3')}
        volume={1.0}
      />

      <Audio
        src={staticFile('assets/bg_music.mp3')}
        volume={(f) =>
          interpolate(f, [0, 25, 890, 934], [0.08, 0.13, 0.13, 0.05], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
        }
      />

      {/* Synchronized Tactile + 8-Bit SFX */}
      <Sequence from={0} durationInFrames={25}>
        <Audio src={staticFile('assets/sfx/sub_hit.mp3')} volume={0.8} />
      </Sequence>
      <Sequence from={18} durationInFrames={20}>
        <Audio src={staticFile('assets/sfx/eightbit_1star_buzz.wav')} volume={0.65} />
      </Sequence>
      <Sequence from={136} durationInFrames={25}>
        <Audio src={staticFile('assets/sfx/eightbit_clock_spin.wav')} volume={0.6} />
      </Sequence>
      <Sequence from={255} durationInFrames={25}>
        <Audio src={staticFile('assets/sfx/eightbit_pop.wav')} volume={0.75} />
      </Sequence>
      <Sequence from={268} durationInFrames={25}>
        <Audio src={staticFile('assets/sfx/eightbit_portal_shimmer.wav')} volume={0.6} />
      </Sequence>
      <Sequence from={387} durationInFrames={25}>
        <Audio src={staticFile('assets/sfx/eightbit_clock_spin.wav')} volume={0.65} />
      </Sequence>
      <Sequence from={402} durationInFrames={25}>
        <Audio src={staticFile('assets/sfx/eightbit_portal_shimmer.wav')} volume={0.6} />
      </Sequence>
      <Sequence from={516} durationInFrames={25}>
        <Audio src={staticFile('assets/sfx/snap.mp3')} volume={0.75} />
      </Sequence>
      <Sequence from={601} durationInFrames={25}>
        <Audio src={staticFile('assets/sfx/whoosh.mp3')} volume={0.7} />
      </Sequence>
      <Sequence from={685} durationInFrames={25}>
        <Audio src={staticFile('assets/sfx/impact.mp3')} volume={0.75} />
      </Sequence>
      <Sequence from={759} durationInFrames={30}>
        <Audio src={staticFile('assets/sfx/eightbit_5star_fanfare.wav')} volume={0.8} />
      </Sequence>

      {/* ================================================================== */}
      {/* 2. DYNAMIC ILLUSTRATED PIXEL-ART WORLD STAGE (CONTINUOUS CAMERA)   */}
      {/* ================================================================== */}
      <AbsoluteFill
        style={{
          transform: `translate(${totalPanX}px, ${totalPanY}px) scale(${totalScale}) rotate(${gravityTiltDeg}deg)`,
          transformOrigin: '50% 52%',
        }}
      >
        {/* ---------------------------------------------------------------- */}
        {/* BEAT 1 (0 - 136f): SAPA MART EMPTY CHILLER + SLEEPING NIGHTCAP   */}
        {/* ---------------------------------------------------------------- */}
        {frame < 136 && (
          <AbsoluteFill>
            <Img
              src={staticFile(
                poseToggle
                  ? 'assets/pixel/sapa/s2_chiller_a.jpg'
                  : 'assets/pixel/sapa/s2_chiller_b.jpg'
              )}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'contrast(1.06) brightness(0.92)',
              }}
            />
            <ChillerNightcapAndZzz frame={frame} flyProgress={0} />
          </AbsoluteFill>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* BEAT 2 (136 - 255f): SAPA MART STOREFRONT COMEBACK CRATE         */}
        {/* ---------------------------------------------------------------- */}
        {frame >= 136 && frame < 255 && (
          <AbsoluteFill>
            <Img
              src={staticFile(
                poseToggle
                  ? 'assets/pixel/sapa/s1_storefront_a.jpg'
                  : 'assets/pixel/sapa/s1_storefront_b.jpg'
              )}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'contrast(1.06) saturate(1.08)',
              }}
            />
            <SceneParticleStream frame={frame} mode="choco" opacity={0.75} />
          </AbsoluteFill>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* BEAT 3 (255 - 387f): SHIFT 1 — CHOCO MONDAY 07:15 AM RESTOCK     */}
        {/* ---------------------------------------------------------------- */}
        {frame >= 255 && frame < 387 && (
          <AbsoluteFill>
            <Img
              src={staticFile('assets/pixel/sapa/s2_chiller_b.jpg')}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'contrast(1.06) saturate(1.08)',
              }}
            />
            <ChillerNightcapAndZzz frame={frame} flyProgress={nightcapFly} />
            <SapaChillerShelfBottles
              frame={frame}
              fps={fps}
              startFrame={258}
              mode="choco"
              depleteCount={0}
              gravityTiltDeg={0}
            />
            <SceneParticleStream frame={frame} mode="choco" opacity={0.95} />
          </AbsoluteFill>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* BEAT 4A (387 - 516f): SHIFT 2 — TUESDAY GREEN (MATCHA & MILK TEA)*/}
        {/* ---------------------------------------------------------------- */}
        {frame >= 387 && frame < 516 && (
          <AbsoluteFill>
            <Img
              src={staticFile(
                frame < 452
                  ? 'assets/pixel/caleb_pouring_matcha.jpg'
                  : poseToggle
                  ? 'assets/pixel/sapa/s5_batch_a.jpg'
                  : 'assets/pixel/sapa/s5_batch_b.jpg'
              )}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            {/* Floating Pixel Callout Pills on the Counter Lineup */}
            {[
              {
                label: 'PURE MATCHA OATSIDE',
                x: 245,
                y: 1185,
                color: COLORS.emeraldNeon,
                d: 4,
              },
              {
                label: 'SIGNATURE MILK TEA',
                x: 785,
                y: 1185,
                color: COLORS.goldBright,
                d: 10,
              },
            ].map((tag, i) => {
              const pop = spring({
                frame: Math.max(0, frame - (392 + tag.d)),
                fps,
                config: { damping: 11, stiffness: 180 },
              });
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: tag.x,
                    top: tag.y + Math.sin(frame * 0.14 + i) * 5,
                    transform: `translate(-50%, -50%) scale(${pop})`,
                    backgroundColor: 'rgba(7, 10, 15, 0.94)',
                    border: `2.5px solid ${tag.color}`,
                    borderRadius: 14,
                    padding: '10px 18px',
                    fontFamily: PIXEL_SUB_FONT,
                    fontSize: 15,
                    color: tag.color,
                    boxShadow: `0 12px 24px rgba(0,0,0,0.9), 0 0 16px ${tag.color}44`,
                    whiteSpace: 'nowrap',
                    zIndex: 55,
                  }}
                >
                  {tag.label}
                </div>
              );
            })}
            <SceneParticleStream frame={frame} mode="matcha" opacity={0.95} />
          </AbsoluteFill>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* BEAT 4B (516 - 601f): PURE STEVIA DROPPER MACRO (0G SUGAR CRASH) */}
        {/* ---------------------------------------------------------------- */}
        {frame >= 516 && frame < 601 && (
          <AbsoluteFill>
            <Img
              src={staticFile('assets/pixel/stevia_dropper_macro.jpg')}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Animated Falling Crystal Stevia Droplet */}
            <div
              style={{
                position: 'absolute',
                left: '49.5%',
                top: `calc(53% + ${steviaDropY}px)`,
                width: 24,
                height: 34,
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                background:
                  'radial-gradient(circle at 35% 35%, #FFFFFF, #39FF88 65%, #059669)',
                boxShadow: '0 0 24px #39FF88, 0 0 40px #FFFFFF',
                opacity: steviaDropOp,
                transform: 'translate(-50%, -50%)',
                zIndex: 60,
              }}
            />
            <SceneParticleStream frame={frame} mode="matcha" opacity={0.85} />
          </AbsoluteFill>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* BEAT 5A (601 - 685f): CALEB RUNNING COOLER BOX (42 BOTTLES CAP)  */}
        {/* ---------------------------------------------------------------- */}
        {frame >= 601 && frame < 685 && (
          <AbsoluteFill>
            <Img
              src={staticFile('assets/pixel/caleb_running_delivery.jpg')}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `translateX(${interpolate(
                  frame,
                  [601, 685],
                  [-28, 28]
                )}px) translateY(${Math.abs(Math.sin(frame * 0.45)) * -10}px)`,
              }}
            />
            <SceneParticleStream frame={frame} mode="frost" opacity={0.9} />
          </AbsoluteFill>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* BEAT 5B (685 - 759f): SAPA CHILLER -9.5° GRAVITY TILT RUSH       */}
        {/* ---------------------------------------------------------------- */}
        {frame >= 685 && frame < 759 && (
          <AbsoluteFill>
            <Img
              src={staticFile('assets/pixel/sapa/s2_chiller_a.jpg')}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <SapaChillerShelfBottles
              frame={frame}
              fps={fps}
              startFrame={650}
              mode="mixed"
              depleteCount={depleteCount}
              gravityTiltDeg={gravityTiltDeg}
            />
            <SceneParticleStream frame={frame} mode="frost" opacity={0.9} />
          </AbsoluteFill>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* BEAT 6 (759 - 934f): 5-STAR HERO POINT + CHOCO & MATCHA LINEUP   */}
        {/* ---------------------------------------------------------------- */}
        {frame >= 759 && (
          <AbsoluteFill>
            <Img
              src={staticFile('assets/pixel/caleb_point_hero.jpg')}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Flanking Clean SSOT Choco (Monday) & Milk Tea/Matcha (Tuesday) Bottles */}
            {[
              {
                src: 'assets/bottles_ssot/choco_ssot.png',
                x: 155,
                y: 1055,
                rot: -8,
                label: 'SENIN: CHOCO',
                color: COLORS.hazelnutGold,
              },
              {
                src: 'assets/bottles_ssot/matcha_ssot.png',
                x: 925,
                y: 1055,
                rot: 8,
                label: 'SELASA: MATCHA',
                color: COLORS.emeraldNeon,
              },
            ].map((b, idx) => {
              const pop = spring({
                frame: Math.max(0, frame - (762 + idx * 6)),
                fps,
                config: { damping: 11, stiffness: 180 },
              });
              return (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    left: b.x,
                    top: b.y + Math.sin(frame * 0.15 + idx) * 6,
                    transform: `translate(-50%, -50%) scale(${pop}) rotate(${b.rot}deg)`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    zIndex: 60,
                  }}
                >
                  <div
                    style={{
                      width: 145,
                      height: 295,
                      filter: `drop-shadow(0 16px 26px rgba(0,0,0,0.92)) drop-shadow(0 0 18px ${b.color}55)`,
                    }}
                  >
                    <Img
                      src={staticFile(b.src)}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>
                  <div
                    style={{
                      marginTop: -8,
                      backgroundColor: 'rgba(7, 10, 15, 0.94)',
                      border: `2.5px solid ${b.color}`,
                      borderRadius: 10,
                      padding: '5px 12px',
                      fontFamily: PIXEL_SUB_FONT,
                      fontSize: 13,
                      color: b.color,
                      boxShadow: '0 6px 14px rgba(0,0,0,0.9)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {b.label}
                  </div>
                </div>
              );
            })}

            <SceneParticleStream frame={frame} mode="matcha" opacity={0.85} />
          </AbsoluteFill>
        )}
      </AbsoluteFill>

      {/* Subtle Kinetic Whip-Flash Overlay on Scene Carries */}
      {whipFlash > 0.01 && (
        <AbsoluteFill
          style={{
            backgroundColor: `rgba(255, 245, 200, ${whipFlash})`,
            pointerEvents: 'none',
            zIndex: 750,
          }}
        />
      )}

      {/* ================================================================== */}
      {/* 3. LIRA SIGNATURE HUD: TOP GLASS CARD + HANGING CLOCK + CTA PILL   */}
      {/* ================================================================== */}
      <TopLiraGlassCard frame={frame} fps={fps} />

      <FloatingBrewClockHUD frame={frame} gravityTiltDeg={gravityTiltDeg} />

      {/* Bottom Interactive CTA Pill in Beat 6 (Matches Reel 9 & Reel 11) */}
      {frame >= 759 && (
        <div
          style={{
            position: 'absolute',
            bottom: 72,
            left: '50%',
            transform: `translateX(-50%) scale(${spring({
              frame: frame - 759,
              fps,
              config: { damping: 11, stiffness: 180 },
            })})`,
            backgroundColor: 'rgba(7, 10, 15, 0.94)',
            border: '2.5px solid #39FF88',
            borderRadius: 20,
            padding: '14px 30px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow:
              '0 20px 50px rgba(0,0,0,0.95), 0 0 30px rgba(57,255,136,0.3)',
            zIndex: 860,
          }}
        >
          <div
            style={{
              fontFamily: `${SANS_FONT}, Inter, sans-serif`,
              fontSize: 22,
              fontWeight: 900,
              color: '#39FF88',
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
            }}
          >
            KOMEN: TIM SENIN CHOCO / SELASA MATCHA?
          </div>
          <div
            style={{
              fontFamily: PIXEL_SUB_FONT,
              fontSize: 13,
              color: '#FFE566',
              letterSpacing: '0.06em',
              marginTop: 5,
            }}
          >
            KEHABISAN DI SAPA MART? PO BATCH SABTU DI BIO @DRINKLIRA ↓
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* 4. EYE-LEVEL BORDERLESS TIKTOK CAPTIONS (Matches All Lira Reels)   */}
      {/* ================================================================== */}
      <TikTokCaption
        currentFrame={frame}
        chunks={captionsData}
        topPercentage={58}
        fontSize={62}
        highlightColor="#FFE566"
      />
    </AbsoluteFill>
  );
};
