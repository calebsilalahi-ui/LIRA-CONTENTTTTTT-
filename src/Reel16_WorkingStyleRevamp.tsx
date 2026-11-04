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
// REEL 16: WORKING VIDEO FORMAT (REVAMPED WITH CENTER RED SQUARE VISUAL HOOK)
// Matches 'Working video.mp4' (Reel 12) 1:1, plus:
// 1. Primary Visual Hook anchored in the CENTER RED SQUARE at Frame 0
// 2. Actual Lira Bottles with 100% full original stickers (choco.png, matcha.png, milktea.png)
// 3. 4-Layer Hook Stacking, 2 Open Loops, and 1★ -> 5★ Fanfare Flip
// 934 frames @ 30fps = 31.13s | 1080x1440 (3:4 Portrait)
// ============================================================================
export const REEL_16_DURATION = 934;

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
// CENTER RED SQUARE VISUAL HOOK MODAL (Frames 0 - 136)
// Anchored strictly inside x: [18%, 93%], y: [14%, 86%]
// ============================================================================
const CenterHookModal: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  if (frame >= 136) return null;

  // Spring entrance pop at Frame 0
  const popSpring = spring({
    frame,
    fps,
    config: { damping: 9, stiffness: 220, mass: 0.7 },
  });

  // Micro error vibration in sync with 8-bit 1-star buzz
  const buzzShakeX = frame >= 18 && frame < 65 ? Math.sin(frame * 4.2) * 6 : 0;
  const buzzShakeY = frame >= 18 && frame < 65 ? Math.cos(frame * 3.8) * 3 : 0;

  // Exit transition at the tail of Beat 1 (frames 120 -> 136)
  const exitScale = interpolate(frame, [120, 136], [1, 0.4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitOpacity = interpolate(frame, [122, 136], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const scale = popSpring * exitScale;

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '44%',
        transform: `translate(-50%, -50%) translate(${buzzShakeX}px, ${buzzShakeY}px) scale(${scale})`,
        width: 640,
        backgroundColor: 'rgba(11, 15, 25, 0.96)',
        border: '3.5px solid #FF2E63',
        borderRadius: 24,
        padding: '24px 32px',
        boxShadow:
          '0 24px 60px rgba(0, 0, 0, 0.95), 0 0 40px rgba(255, 46, 99, 0.65), inset 0 0 20px rgba(255, 46, 99, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
        zIndex: 800,
        opacity: exitOpacity,
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Top Banner Tag */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          backgroundColor: 'rgba(255, 46, 99, 0.15)',
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
            letterSpacing: '0.12em',
            color: '#FF2E63',
            textTransform: 'uppercase',
          }}
        >
          CRISIS ALERT • SAPA MART RETAIL
        </span>
      </div>

      {/* Big Rating Stars */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
        <span
          style={{
            fontFamily: PIXEL_HEADER_FONT,
            fontSize: 44,
            color: '#FF2E63',
            textShadow: '0 0 16px rgba(255, 46, 99, 0.8), 3px 3px 0 #000',
          }}
        >
          ★
        </span>
        <span
          style={{
            fontFamily: PIXEL_HEADER_FONT,
            fontSize: 44,
            color: '#334155',
            textShadow: '2px 2px 0 #000',
          }}
        >
          ★★★★
        </span>
        <span
          style={{
            fontFamily: PIXEL_HEADER_FONT,
            fontSize: 22,
            color: '#FF2E63',
            marginLeft: 8,
          }}
        >
          1.0
        </span>
      </div>

      {/* Headline Text */}
      <div
        style={{
          fontFamily: `${SANS_FONT}, Inter, sans-serif`,
          fontSize: 32,
          fontWeight: 900,
          color: '#FFFFFF',
          textAlign: 'center',
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          textShadow: '0 4px 12px rgba(0,0,0,0.8)',
        }}
      >
        "KULKAS SAPA MART KOSONG 2 MINGGU?!"
      </div>

      {/* Subtitle / Status */}
      <div
        style={{
          backgroundColor: 'rgba(255, 46, 99, 0.2)',
          border: '1px solid rgba(255, 46, 99, 0.5)',
          color: '#FFE566',
          fontFamily: PIXEL_SUB_FONT,
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: '0.08em',
          padding: '8px 18px',
          borderRadius: 8,
          textAlign: 'center',
          marginTop: 2,
        }}
      >
        STOCKOUT 100% • KITA DAPET REVIEW BINTANG SATU
      </div>
    </div>
  );
};

// ============================================================================
// CENTER RED SQUARE CTA MODAL (Beat 6: Frames 759 - 934)
// Formatted identically to the Center Hook Modal, anchored strictly inside the red box!
// ============================================================================
const CenterCTAModal: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  if (frame < 759) return null;

  // Spring entrance pop at Beat 6 start
  const popSpring = spring({
    frame: frame - 759,
    fps,
    config: { damping: 9, stiffness: 210, mass: 0.7 },
  });

  // Animated star flips (1 to 5 stars)
  const activeStars = Math.min(5, 1 + Math.floor(Math.max(0, frame - 759) / 5));

  // Pulse glow on the gold border
  const glowPulse = Math.sin((frame - 759) * 0.15) * 6 + 26;

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '44%',
        transform: `translate(-50%, -50%) scale(${popSpring})`,
        width: 640,
        backgroundColor: 'rgba(11, 15, 25, 0.96)',
        border: '3.5px solid #FFE566',
        borderRadius: 24,
        padding: '24px 32px',
        boxShadow: `0 24px 60px rgba(0, 0, 0, 0.95), 0 0 ${glowPulse}px rgba(255, 229, 102, 0.7), inset 0 0 20px rgba(255, 229, 102, 0.2)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
        zIndex: 860,
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Top Banner Tag */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          backgroundColor: 'rgba(255, 229, 102, 0.15)',
          border: '1.5px solid #FFE566',
          padding: '6px 16px',
          borderRadius: 9999,
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: '#FFE566',
            boxShadow: '0 0 10px #FFE566',
          }}
        />
        <span
          style={{
            fontFamily: PIXEL_SUB_FONT,
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: '0.12em',
            color: '#FFE566',
            textTransform: 'uppercase',
          }}
        >
          RETAIL COMEBACK • SAPA MART & PRE-ORDER
        </span>
      </div>

      {/* 5-Star Rating Row (Flipping from 1 to 5 Stars!) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
        {[1, 2, 3, 4, 5].map((sIdx) => {
          const lit = sIdx <= activeStars;
          const starPop = spring({
            frame: Math.max(0, frame - (759 + (sIdx - 1) * 5)),
            fps,
            config: { damping: 8, stiffness: 240 },
          });
          return (
            <span
              key={sIdx}
              style={{
                fontFamily: PIXEL_HEADER_FONT,
                fontSize: 38,
                color: lit ? '#FFE566' : '#334155',
                textShadow: lit ? '0 0 16px rgba(255, 229, 102, 0.9), 3px 3px 0 #000' : '2px 2px 0 #000',
                transform: `scale(${lit ? 0.3 + 0.7 * starPop : 0.9})`,
                display: 'inline-block',
              }}
            >
              ★
            </span>
          );
        })}
        <span
          style={{
            fontFamily: PIXEL_HEADER_FONT,
            fontSize: 22,
            color: '#FFE566',
            marginLeft: 8,
          }}
        >
          5.0
        </span>
      </div>

      {/* Headline Text */}
      <div
        style={{
          fontFamily: `${SANS_FONT}, Inter, sans-serif`,
          fontSize: 32,
          fontWeight: 900,
          color: '#FFFFFF',
          textAlign: 'center',
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          textShadow: '0 4px 12px rgba(0,0,0,0.8)',
        }}
      >
        "TIM SENIN CHOCO ATAU SELASA MATCHA?"
      </div>

      {/* Subtitle / Interactive Action Pill */}
      <div
        style={{
          backgroundColor: 'rgba(57, 255, 136, 0.18)',
          border: '1.5px solid #39FF88',
          color: '#39FF88',
          fontFamily: PIXEL_SUB_FONT,
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: '0.08em',
          padding: '8px 20px',
          borderRadius: 8,
          textAlign: 'center',
          marginTop: 2,
          boxShadow: '0 0 14px rgba(57, 255, 136, 0.3)',
        }}
      >
        KOMEN DI BAWAH • AMANKAN BATCH SABTU DI BIO ↓
      </div>
    </div>
  );
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
  opacity?: number;
}> = ({ frame, mode, opacity = 0.85 }) => {
  const particleColors = {
    choco: ['#E6A145', '#D4AF37', '#FAF7F0'],
    matcha: ['#39FF88', '#5CE1E6', '#FFE566'],
    frost: ['#5CE1E6', '#E2E8F0', '#FFFFFF'],
  }[mode];

  const particles = Array.from({ length: 18 }).map((_, i) => {
    const cycle = ((frame * 1.4 + i * 44) % 180) / 180;
    const x = ((i * 61) % 1020) + 30 + Math.sin(cycle * Math.PI * 2 + i) * 22;
    const y = 1440 - cycle * 1440;
    const size = (i % 3) * 3 + 4;
    const color = particleColors[i % particleColors.length];
    const pOp = cycle < 0.1 ? cycle / 0.1 : cycle > 0.85 ? (1 - cycle) / 0.15 : 1;
    return { x, y, size, color, pOp };
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 50,
        opacity,
      }}
    >
      {particles.map((p, idx) => (
        <div
          key={idx}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 10px ${p.color}`,
            opacity: p.pOp,
          }}
        />
      ))}
    </div>
  );
};

// ============================================================================
// SUB-COMPONENT: BRASS BREW CLOCK HUD (SWINGING PENDULUM + DIGIT READOUT)
// Anchored strictly inside the red box (right: 205px, top: 220px, x: [795, 875])
// ============================================================================
const FloatingBrewClockHUD: React.FC<{
  frame: number;
  gravityTiltDeg: number;
}> = ({ frame, gravityTiltDeg }) => {
  const swing = Math.sin((frame / 14) * Math.PI) * 7.5;
  const isBeat1 = frame < 136;
  const isBeat2 = frame >= 136 && frame < 255;
  const isBeat3 = frame >= 255 && frame < 387;
  const isBeat4 = frame >= 387 && frame < 601;
  const isBeat5 = frame >= 601 && frame < 759;
  const isBeat6 = frame >= 759;

  let counterColor = COLORS.crimson;
  let counterLabel = 'SOLD OUT';
  let shiftTag = 'EMPTY 2 WKS';

  if (isBeat2) {
    counterColor = COLORS.goldBright;
    counterLabel = 'RESTOCK';
    shiftTag = 'BATCH BARU';
  } else if (isBeat3) {
    counterColor = COLORS.hazelnutGold;
    counterLabel = '07:15 AM';
    shiftTag = 'SHIFT 1: CHOCO';
  } else if (isBeat4) {
    counterColor = COLORS.emeraldNeon;
    counterLabel = '08:30 AM';
    shiftTag = 'SHIFT 2: GREEN';
  } else if (isBeat5) {
    counterColor = COLORS.crimson;
    counterLabel = 'LIMITED';
    shiftTag = 'SOLD OUT FAST';
  } else if (isBeat6) {
    counterColor = COLORS.goldBright;
    counterLabel = 'BATCH SABTU';
    shiftTag = 'PO OPEN NOW';
  }

  return (
    <div
      style={{
        position: 'absolute',
        right: 205,
        top: 220,
        transform: `rotate(${gravityTiltDeg * 0.7}deg)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 850,
        pointerEvents: 'none',
      }}
    >
      {/* Clock Face */}
      <div
        style={{
          width: 76,
          height: 76,
          borderRadius: '50%',
          backgroundColor: '#FAF7F0',
          border: '4px solid #D4AF37',
          outline: '3px solid #000',
          boxShadow: '0 12px 28px rgba(0,0,0,0.85), inset 0 0 10px rgba(212,175,55,0.4)',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ position: 'absolute', top: 4, width: 3, height: 6, backgroundColor: '#000' }} />
        <div style={{ position: 'absolute', bottom: 4, width: 3, height: 6, backgroundColor: '#000' }} />
        <div style={{ position: 'absolute', left: 4, width: 6, height: 3, backgroundColor: '#000' }} />
        <div style={{ position: 'absolute', right: 4, width: 6, height: 3, backgroundColor: '#000' }} />

        {/* Hour Hand (3:30 position) */}
        <div
          style={{
            position: 'absolute',
            width: 4,
            height: 19,
            backgroundColor: '#000',
            top: 19,
            left: 36,
            transformOrigin: 'bottom center',
            transform: 'rotate(105deg)',
          }}
        />
        {/* Minute Hand */}
        <div
          style={{
            position: 'absolute',
            width: 2.5,
            height: 26,
            backgroundColor: '#000',
            top: 12,
            left: 37,
            transformOrigin: 'bottom center',
            transform: 'rotate(180deg)',
          }}
        />
        {/* Pivot */}
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: '#D4AF37',
            border: '2px solid #000',
            zIndex: 10,
          }}
        />
      </div>

      {/* Swinging Pendulum */}
      <div
        style={{
          width: 3.5,
          height: 42,
          backgroundColor: '#D4AF37',
          outline: '2px solid #000',
          transformOrigin: 'top center',
          transform: `rotate(${swing}deg)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            backgroundColor: '#FFE566',
            border: '3px solid #D4AF37',
            outline: '2px solid #000',
            boxShadow: '0 0 10px rgba(255,229,102,0.75)',
          }}
        />
      </div>

      {/* Live Digital Quota & Shift Readout */}
      <div
        style={{
          marginTop: 6,
          backgroundColor: 'rgba(7, 10, 15, 0.94)',
          border: `2.5px solid ${counterColor}`,
          borderRadius: 8,
          padding: '4px 8px',
          boxShadow: `0 6px 18px rgba(0,0,0,0.9), 0 0 12px ${counterColor}44`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <span
          style={{
            fontFamily: PIXEL_HEADER_FONT,
            fontSize: 11,
            color: counterColor,
            whiteSpace: 'nowrap',
          }}
        >
          {counterLabel}
        </span>
        <span
          style={{
            fontFamily: PIXEL_SUB_FONT,
            fontSize: 9,
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
// SUB-COMPONENT: SLEEK FLOATING TOP GLASSMORPHIC CARD (BEATS 2 - 5)
// Anchored strictly inside the red box (top: 222px, left: 480px, width: 640px)
// ============================================================================
const TopLiraGlassCard: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // In Beat 1, CenterHookModal is hero in the red box.
  // In Beat 6, CenterCTAModal is hero in the red box.
  if (frame < 136 || frame >= 759) return null;

  const isBeat2 = frame >= 136 && frame < 255;
  const isBeat3 = frame >= 255 && frame < 387;
  const isBeat4 = frame >= 387 && frame < 601;
  const isBeat5 = frame >= 601 && frame < 759;

  let borderColor = COLORS.goldBright;
  let tagText = 'OFFICIAL RETAIL UPDATE • @DRINKLIRA';
  let headlineText = 'LIRA RESMI BALIK RESTOCK DI SAPA MART!';
  let subText = 'CATCH IT WHILE IT LASTS • FRESH BATCH';

  if (isBeat3) {
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
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 220,
        left: 490,
        transform: 'translateX(-50%)',
        width: 560,
        backgroundColor: 'rgba(7, 10, 15, 0.94)',
        border: `2.5px solid ${borderColor}`,
        boxShadow: `0 16px 40px rgba(0, 0, 0, 0.92), 0 0 28px ${borderColor}40`,
        borderRadius: 18,
        padding: '10px 18px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        zIndex: 850,
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Top Row: Pulsing Dot + Silkscreen Tag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: borderColor,
            boxShadow: `0 0 10px ${borderColor}`,
          }}
        />
        <span
          style={{
            color: borderColor,
            fontFamily: PIXEL_SUB_FONT,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.08em',
          }}
        >
          {tagText}
        </span>
      </div>

      {/* Main Bold Headline */}
      <div
        style={{
          color: '#FFFFFF',
          fontFamily: `${SANS_FONT}, Inter, sans-serif`,
          fontSize: 20,
          fontWeight: 900,
          letterSpacing: '-0.01em',
          textAlign: 'center',
          lineHeight: 1.15,
        }}
      >
        {headlineText}
      </div>

      {/* Sub-caption line */}
      <div
        style={{
          color: '#CBD5E1',
          fontFamily: `${SANS_FONT}, Inter, sans-serif`,
          fontSize: 12,
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
// USES ACTUAL LIRA BOTTLES WITH COMPLETE ORIGINAL STICKERS INTACT:
// choco.png, matcha.png, milktea.png!
// ============================================================================
const SapaChillerShelfBottles: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
  mode: 'choco' | 'mixed';
  depleteCount: number;
  gravityTiltDeg: number;
}> = ({ frame, fps, startFrame, mode, depleteCount, gravityTiltDeg }) => {
  // Slots on the middle chiller shelf: using authentic full-sticker bottles
  const slots = [
    {
      x: 736,
      y: 632,
      delay: 0,
      src: mode === 'choco' ? 'assets/choco.png' : 'assets/choco.png',
    },
    {
      x: 792,
      y: 638,
      delay: 4,
      src: mode === 'choco' ? 'assets/choco.png' : 'assets/matcha.png',
    },
    {
      x: 850,
      y: 644,
      delay: 8,
      src: mode === 'choco' ? 'assets/choco.png' : 'assets/milktea.png',
    },
    {
      x: 910,
      y: 650,
      delay: 12,
      src: mode === 'choco' ? 'assets/choco.png' : 'assets/matcha.png',
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
        {mode === 'choco' ? 'CHOCO IN STOCK' : 'LIMITED BATCH'}
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
              width: 76,
              height: 144,
              transform: `translate(-50%, -50%) scale(${scale * squashX}, ${
                scale * squashY
              }) rotate(${gravityTiltDeg * 0.9 - flyOutProgress * 35}deg)`,
              zIndex: 50 + idx,
              filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.85))',
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
// MAIN COMPOSITION: REEL 16 (WORKING STYLE REVAMP)
// ============================================================================
export const Reel16_WorkingStyleRevamp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Organic breathing cycle
  const breathe = Math.sin((frame / 42) * Math.PI) * 0.014;
  // 2-frame pixel-art pose toggle on beats
  const poseToggle = Math.floor(frame / 18) % 2 === 0;

  // --------------------------------------------------------------------------
  // CONTINUOUS CAMERA CARRIES, WHIP-PANS, ZOOM & GRAVITY TILT
  // --------------------------------------------------------------------------
  const hookZoom = interpolate(frame, [0, 22], [1.12, 1.0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Beat 1 1-Star Error Shake
  const errorShakeX = frame >= 18 && frame < 55 ? Math.sin(frame * 4.2) * 5 : 0;
  const errorShakeY = frame >= 18 && frame < 55 ? Math.cos(frame * 3.8) * 3 : 0;

  // Whip-Pan transitions at Beat boundaries
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

  // Beat 3 Chiller Close-Up Zoom Carry
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

  const chillerPanX = chillerZoomWeight * -185;
  const chillerPanY = chillerZoomWeight * 45;
  const chillerScale = 1.0 + chillerZoomWeight * 0.22;

  // Gravity Tilt in Beat 5B Scarcity Rush
  const gravityTiltDeg = interpolate(
    frame,
    [685, 715, 742, 759],
    [0, -9.5, -9.5, 0],
    {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Stevia droplet falling animation in Beat 4B
  const steviaCycle = Math.max(0, frame - 516);
  const steviaDropY = interpolate(steviaCycle % 48, [0, 40], [0, 240], {
    easing: Easing.in(Easing.quad),
  });
  const steviaDropOp = interpolate(steviaCycle % 48, [0, 6, 36, 44], [0, 1, 1, 0]);

  // Nightcap flying away in Beat 3
  const nightcapFly = interpolate(frame, [255, 290], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Composite camera transforms
  const totalScale = (hookZoom + breathe) * chillerScale;
  const totalPanX = errorShakeX + whipOffsetX + chillerPanX;
  const totalPanY = errorShakeY + chillerPanY;

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
        {/* BEAT 6 (759 - 934f): 5-STAR HERO POINT + ACTUAL LIRA BOTTLES     */}
        {/* Full original stickers: choco.png and matcha.png                 */}
        {/* ---------------------------------------------------------------- */}
        {frame >= 759 && (
          <AbsoluteFill>
            <Img
              src={staticFile('assets/pixel/caleb_point_hero.jpg')}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Flanking Actual Lira Bottles (choco.png & matcha.png with complete original stickers) */}
            {[
              {
                src: 'assets/choco.png',
                x: 270,
                y: 1025,
                rot: -6,
                label: 'SENIN: CHOCO',
                color: COLORS.hazelnutGold,
              },
              {
                src: 'assets/matcha.png',
                x: 815,
                y: 1025,
                rot: 6,
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
                      width: 130,
                      height: 260,
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

      {/* ================================================================== */}
      {/* 2B. CRITICAL UPGRADE: VISUAL HOOK ANCHORED IN CENTER RED SQUARE    */}
      {/* ================================================================== */}
      <CenterHookModal frame={frame} fps={fps} />

      {/* ================================================================== */}
      {/* 2C. CRITICAL UPGRADE: CTA MODAL ANCHORED IN CENTER RED SQUARE      */}
      {/* Formatted identically to the hook modal, flipping 1★ to 5★ in Beat 6*/}
      {/* ================================================================== */}
      <CenterCTAModal frame={frame} fps={fps} />

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
      {/* 3. LIRA SIGNATURE HUD: TOP GLASS CARD + CLOCK (BOTH IN RED BOX)    */}
      {/* ================================================================== */}
      <TopLiraGlassCard frame={frame} fps={fps} />

      <FloatingBrewClockHUD frame={frame} gravityTiltDeg={gravityTiltDeg} />

      {/* ================================================================== */}
      {/* 4. EYE-LEVEL BORDERLESS TIKTOK CAPTIONS (Inside Red Box)          */}
      {/* ================================================================== */}
      <TikTokCaption
        currentFrame={frame}
        chunks={captionsData}
        topPercentage={frame < 136 ? 76 : frame >= 759 ? 78 : 58}
        fontSize={60}
        highlightColor="#FFE566"
      />
    </AbsoluteFill>
  );
};
