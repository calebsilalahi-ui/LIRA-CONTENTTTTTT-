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
import captionsData from './sample_3p_somatic_reel_captions.json';

const { fontFamily: PIXEL_HEADER_FONT } = loadPressStart();
const { fontFamily: PIXEL_SUB_FONT } = loadSilkscreen();
const { fontFamily: SANS_FONT } = loadPlusJakarta();

// ============================================================================
// REEL 17: ULTRA-DYNAMIC 3P SOMATIC SCIENCE REEL (1080x1440, 30fps)
// Duration: 917 frames @ 30fps = 30.56s
// Voiceover & Captions: 100% UNTOUCHED (Exact Caleb VO & timing preserved)
// Visual Upgrades:
// 1. Removed star rating visual hooks (replaced with Somatic Glucose Spike Gauge)
// 2. 2-Frame Living Pixel Animation toggles (Caleb typing/sighing, cup sloshing, bottle shaking)
// 3. Animated 8-bit Zzz sleep motes rising during the 2 PM insulin crash
// 4. Animated falling crystal stevia droplet with radial glow into matcha swirl
// 5. Procedural SceneParticleStream floating motes across all beats (matching 'Working video')
// 6. Swinging brass pendulum clock HUD & live metrics strictly inside Red Box [192, 896] x [202, 1236]
// ============================================================================
export const REEL_17_DURATION = 917;

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

// ============================================================================
// 1. PROCEDURAL SCENE PARTICLE STREAM (Floating 8-Bit Motes from Working Video)
// ============================================================================
const SceneParticleStream: React.FC<{
  frame: number;
  mode: 'cafe' | 'crash' | 'matcha' | 'frost';
  opacity: number;
}> = ({ frame, mode, opacity }) => {
  if (opacity <= 0.02) return null;

  const palette =
    mode === 'cafe'
      ? ['#FFE566', '#E6A145', '#D4AF37', '#FDE68A']
      : mode === 'crash'
      ? ['#FF2E63', '#FDA4AF', '#F43F5E', '#FFE566']
      : mode === 'matcha'
      ? ['#39FF88', '#5CE1E6', '#A7F3D0', '#FFE566']
      : ['#E0F2FE', '#7DD3FC', '#39FF88', '#FFE566'];

  return (
    <AbsoluteFill style={{ opacity, pointerEvents: 'none', zIndex: 45 }}>
      {Array.from({ length: 24 }, (_, i) => {
        const speed = 1.3 + (i % 4) * 0.25;
        const progress = ((frame * speed + i * 19) % 100) / 100;
        const baseX = 200 + ((i * 79) % 680);
        const swayX = Math.sin(progress * Math.PI * 2.4 + i) * 36;
        const y = 200 + progress * 1020;
        const size = i % 3 === 0 ? 12 : i % 2 === 0 ? 8 : 6;
        const alpha =
          progress < 0.12
            ? progress / 0.12
            : progress > 0.85
            ? (1 - progress) / 0.15
            : 0.85;
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
              boxShadow: `0 0 10px ${color}, 2px 2px 0 rgba(0,0,0,0.8)`,
              opacity: alpha,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ============================================================================
// 2. ANIMATED RISING 8-BIT Zzz SLEEP PARTICLES (Beat 2: Afternoon Fatigue)
// ============================================================================
const RisingSleepZzz: React.FC<{ frame: number }> = ({ frame }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: 420,
        top: 600,
        pointerEvents: 'none',
        zIndex: 65,
      }}
    >
      {[0, 1, 2].map((i) => {
        const cycle = ((frame * 1.1 + i * 28) % 84) / 84;
        const zY = -cycle * 160;
        const zX = Math.sin(cycle * Math.PI * 2 + i) * 24 + i * 18;
        const zOp = cycle < 0.15 ? cycle / 0.15 : cycle > 0.8 ? (1 - cycle) / 0.2 : 0.95;
        const sizes = [34, 26, 18];
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
// 3. CENTER SOMATIC GLUCOSE SPIKE GAUGE (Beat 1: Frames 0 - 145)
// Replaces the 1-star rating modal with a dynamic biometric diagnostic scan
// ============================================================================
const CenterSomaticDiagnosticHUD: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  if (frame >= 145) return null;

  // Snappy spring entrance
  const popSpring = spring({
    frame,
    fps,
    config: { damping: 9, stiffness: 220, mass: 0.7 },
  });

  // Micro Error Vibration in sync with warning alert
  const buzzShakeX = frame >= 18 && frame < 65 ? Math.sin(frame * 4.2) * 6 : 0;
  const buzzShakeY = frame >= 18 && frame < 65 ? Math.cos(frame * 3.8) * 3 : 0;

  // Exit transition at the tail of Beat 1 (frames 130 -> 145)
  const exitScale = interpolate(frame, [130, 145], [1, 0.4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitOpacity = interpolate(frame, [132, 145], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const scale = popSpring * exitScale;

  // Animated Glucose Spike Meter surge
  const spikeFill = interpolate(frame, [15, 60], [25, 96], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const currentGlucose = Math.round(
    interpolate(frame, [15, 60], [90, 180], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '42%',
        transform: `translate(-50%, -50%) translate(${buzzShakeX}px, ${buzzShakeY}px) scale(${scale})`,
        width: 650,
        backgroundColor: 'rgba(11, 15, 25, 0.95)',
        border: '3.5px solid #FF2E63',
        borderRadius: 24,
        padding: '24px 30px',
        boxShadow:
          '0 24px 60px rgba(0, 0, 0, 0.95), 0 0 40px rgba(255, 46, 99, 0.55), inset 0 0 20px rgba(255, 46, 99, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
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
          SOMATIC ALERT • 50K CAFE ADDICTION
        </span>
      </div>

      {/* Dynamic Glucose Spike Gauge */}
      <div
        style={{
          width: '100%',
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          border: '2px solid rgba(255, 46, 99, 0.6)',
          borderRadius: 14,
          padding: '12px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          boxShadow: 'inset 0 0 16px rgba(0,0,0,0.8)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              fontFamily: PIXEL_SUB_FONT,
              fontSize: 11,
              color: '#94A3B8',
              letterSpacing: '0.08em',
            }}
          >
            GLUCOSE SURGE:
          </span>
          <span
            style={{
              fontFamily: PIXEL_HEADER_FONT,
              fontSize: 14,
              color: currentGlucose >= 140 ? '#FF2E63' : '#FFE566',
              textShadow: '0 0 10px rgba(255, 46, 99, 0.8)',
            }}
          >
            {currentGlucose} mg/dL {currentGlucose >= 160 ? '⚡ SPIKE!' : ''}
          </span>
        </div>

        {/* Progress Bar with Gradient */}
        <div
          style={{
            width: '100%',
            height: 14,
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            borderRadius: 7,
            overflow: 'hidden',
            border: '1px solid rgba(255, 46, 99, 0.4)',
          }}
        >
          <div
            style={{
              width: `${spikeFill}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #39FF88 0%, #FFE566 45%, #FF2E63 100%)',
              boxShadow: '0 0 12px #FF2E63',
              transition: 'width 0.05s ease',
            }}
          />
        </div>

        {/* Metric Badges Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          <span style={{ fontFamily: PIXEL_SUB_FONT, fontSize: 10, color: '#FF2E63' }}>
            ▲ 35g SIRUP JAGUNG
          </span>
          <span style={{ fontFamily: PIXEL_SUB_FONT, fontSize: 10, color: '#FFE566' }}>
            ▼ PEAK INSULIN 45m
          </span>
          <span style={{ fontFamily: PIXEL_SUB_FONT, fontSize: 10, color: '#39FF88' }}>
            0g SERAT ALAMI
          </span>
        </div>
      </div>

      {/* 3P Main Headline */}
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
        "3 TANDA GULA KAFE MERUSAK FOKUS LO"
      </div>

      {/* Retention Multiplier Open Loop Pill */}
      <div
        style={{
          backgroundColor: 'rgba(255, 229, 102, 0.15)',
          border: '1.5px solid #FFE566',
          color: '#FFE566',
          fontFamily: PIXEL_SUB_FONT,
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: '0.08em',
          padding: '8px 18px',
          borderRadius: 8,
          textAlign: 'center',
          boxShadow: '0 0 14px rgba(255, 229, 102, 0.3)',
        }}
      >
        DAN YANG NOMOR 3, LO LAKUIN TIAP HARI ↓
      </div>
    </div>
  );
};

// ============================================================================
// 4. RETRO BRASS SWINGING CLOCK HUD (Inside Red Box: top: 220px, right: 205px)
// Built with authentic spinning hands and pendulum motion like Working Video
// ============================================================================
const FloatingBrewClockHUD: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const isSpinning =
    (frame >= 140 && frame < 175) ||
    (frame >= 275 && frame < 310) ||
    (frame >= 500 && frame < 535) ||
    (frame >= 660 && frame < 695);

  const minuteHandDeg = isSpinning
    ? frame * 28
    : frame < 280
    ? 0 // 02:00 PM
    : frame < 460
    ? 90 // 02:15 PM
    : frame < 668
    ? 180 // 03:30 AM
    : 0;

  const hourHandDeg = isSpinning
    ? frame * 7
    : frame < 280
    ? 60 // 02:00
    : frame < 460
    ? 68 // 02:15
    : frame < 668
    ? 105 // 03:30
    : 0;

  const pendulumAngle = Math.sin(frame * 0.2) * 14;

  let timeString = '02:00 PM';
  let dateString = 'SUGAR CRASH';
  let dotColor = '#FF2E63';
  let stateText = 'CRASH ZONE';

  if (frame >= 145 && frame < 280) {
    timeString = '02:00 PM';
    dateString = 'TANDA #3';
    dotColor = '#FF2E63';
    stateText = 'CRASH ZONE';
  } else if (frame >= 280 && frame < 460) {
    timeString = '02:15 PM';
    dateString = 'INSULIN ZERO';
    dotColor = '#FFE566';
    stateText = 'DROP DRASTIS';
  } else if (frame >= 460 && frame < 668) {
    timeString = '03:30 AM';
    dateString = 'SOLO BREW';
    dotColor = '#39FF88';
    stateText = '0G GULA PASIR';
  } else if (frame >= 668 && frame < 763) {
    timeString = '180° TEST';
    dateString = 'AIRTIGHT';
    dotColor = '#5CE1E6';
    stateText = 'BONE DRY';
  } else if (frame >= 763) {
    timeString = 'SABTU COD';
    dateString = '2-4°C CHILLED';
    dotColor = '#39FF88';
    stateText = 'LIMITED BATCH';
  }

  const pulse = Math.sin(frame * 0.15) * 0.5 + 0.5;

  return (
    <div
      style={{
        position: 'absolute',
        top: 220,
        right: 205,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 850,
        filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.85))',
      }}
    >
      {/* Brass Pocket Watch Dial */}
      <div
        style={{
          position: 'relative',
          width: 78,
          height: 78,
          borderRadius: '50%',
          backgroundColor: '#FAF7F0',
          border: '5px solid #D4AF37',
          outline: '2.5px solid #000',
          boxShadow: 'inset 0 0 10px rgba(124,93,73,0.4)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Hour Hand */}
        <div
          style={{
            position: 'absolute',
            width: 4,
            height: 20,
            backgroundColor: '#1D4A38',
            bottom: '50%',
            left: 'calc(50% - 2px)',
            transformOrigin: 'bottom center',
            transform: `rotate(${hourHandDeg}deg)`,
            borderRadius: 2,
          }}
        />
        {/* Minute Hand */}
        <div
          style={{
            position: 'absolute',
            width: 3,
            height: 28,
            backgroundColor: '#7C5D49',
            bottom: '50%',
            left: 'calc(50% - 1.5px)',
            transformOrigin: 'bottom center',
            transform: `rotate(${minuteHandDeg}deg)`,
            borderRadius: 1,
          }}
        />
        {/* Center Pivot Pin */}
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: '#D4AF37',
            border: '1px solid #000',
            zIndex: 10,
          }}
        />
      </div>

      {/* Swinging Pendulum Bob */}
      <div
        style={{
          width: 3,
          height: 24,
          backgroundColor: '#D4AF37',
          transformOrigin: 'top center',
          transform: `rotate(${pendulumAngle}deg)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            backgroundColor: '#FFE566',
            border: '2px solid #D4AF37',
            boxShadow: '0 2px 6px rgba(0,0,0,0.6)',
            marginBottom: -4,
          }}
        />
      </div>

      {/* Status Box Below Watch */}
      <div
        style={{
          marginTop: 6,
          backgroundColor: 'rgba(10, 15, 26, 0.94)',
          border: `2px solid ${dotColor}`,
          borderRadius: 8,
          padding: '4px 8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          boxShadow: `0 4px 12px rgba(0,0,0,0.8), 0 0 10px ${dotColor}35`,
        }}
      >
        <span
          style={{
            fontFamily: PIXEL_SUB_FONT,
            fontSize: 8,
            color: dotColor,
            fontWeight: 800,
          }}
        >
          {stateText}
        </span>
        <span
          style={{
            fontFamily: PIXEL_HEADER_FONT,
            fontSize: 9,
            color: '#FFFFFF',
          }}
        >
          {timeString}
        </span>
      </div>
    </div>
  );
};

// ============================================================================
// 5. TOP GLASS CARD BANNER (Beats 2, 3, 4, 5) Strictly Inside Red Box
// left: '50%', width: 660, top: 220
// ============================================================================
const TopLiraGlassCard: React.FC<{ frame: number }> = ({ frame }) => {
  if (frame < 145 || frame >= 763) return null;

  let borderColor = COLORS.emeraldNeon;
  let tagText = 'SCIENCE • ZERO CRASH';
  let headlineText = 'INSULIN DROP VS STEVIA MURNI';
  let subText = '0G GULA PASIR • 4 JAM ENERGI STABIL';

  if (frame >= 145 && frame < 280) {
    borderColor = COLORS.crimson;
    tagText = 'TANDA #3: 02:00 PM COLLAPSE';
    headlineText = 'CUP BUNGKUS BASAH & SIRUP JAGUNG';
    subText = '70% ES PENGENGER • 35G GULA PEKAT';
  } else if (frame >= 280 && frame < 460) {
    borderColor = COLORS.goldBright;
    tagText = 'REACTIVE HYPOGLYCEMIA';
    headlineText = 'INSULIN COLLAPSE JAM 2 SIANG';
    subText = 'BUKAN KURANG TIDUR • GULA DARAH ANJLOK';
  } else if (frame >= 460 && frame < 668) {
    borderColor = COLORS.emeraldNeon;
    tagText = '100% ARTISAN CRAFT';
    headlineText = 'PURE JAPANESE MATCHA & OATSIDE';
    subText = 'EKSTRAK STEVIA MURNI • NOL INDEKS GLIKEMIK';
  } else if (frame >= 668 && frame < 763) {
    borderColor = COLORS.cyanFrost;
    tagText = '180° INVERTED STRESS TEST';
    headlineText = 'SEALED BOTTLE DI ATAS MACBOOK';
    subText = 'BONE DRY • ZERO LEAKS DI DALAM TAS';
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 220,
        left: 215,
        width: 560,
        backgroundColor: 'rgba(10, 15, 26, 0.94)',
        border: `2.5px solid ${borderColor}`,
        borderRadius: 18,
        padding: '10px 18px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        zIndex: 840,
        boxShadow: `0 16px 36px rgba(0,0,0,0.9), 0 0 24px ${borderColor}30`,
        backdropFilter: 'blur(12px)',
      }}
    >
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
            fontFamily: PIXEL_SUB_FONT,
            fontSize: 11,
            color: borderColor,
            fontWeight: 800,
            letterSpacing: '0.1em',
          }}
        >
          {tagText}
        </span>
      </div>

      <div
        style={{
          fontFamily: `${SANS_FONT}, Inter, sans-serif`,
          fontSize: 20,
          fontWeight: 900,
          color: '#FFFFFF',
          letterSpacing: '-0.02em',
          textAlign: 'center',
        }}
      >
        {headlineText}
      </div>

      <div
        style={{
          fontFamily: PIXEL_SUB_FONT,
          fontSize: 10,
          color: '#94A3B8',
          letterSpacing: '0.06em',
          textAlign: 'center',
        }}
      >
        {subText}
      </div>
    </div>
  );
};

// ============================================================================
// 6. CENTER ACTION DISPATCH CTA (Beat 6: Frames 763 - 917)
// High-converting artisan dispatch card (NO 5-star ratings!)
// ============================================================================
const Center3PActionModal: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  if (frame < 763) return null;

  const popSpring = spring({
    frame: frame - 763,
    fps,
    config: { damping: 10, stiffness: 190 },
  });

  const arrowBounce = Math.sin(frame * 0.25) * 5;

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '44%',
        transform: `translate(-50%, -50%) scale(${popSpring})`,
        width: 650,
        backgroundColor: 'rgba(10, 15, 26, 0.96)',
        border: '3.5px solid #39FF88',
        borderRadius: 24,
        padding: '24px 30px',
        boxShadow:
          '0 24px 60px rgba(0, 0, 0, 0.95), 0 0 40px rgba(57, 255, 136, 0.45)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
        zIndex: 800,
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Top Banner Tag */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          backgroundColor: 'rgba(57, 255, 136, 0.15)',
          border: '1.5px solid #39FF88',
          padding: '6px 16px',
          borderRadius: 9999,
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: '#39FF88',
            boxShadow: '0 0 10px #39FF88',
          }}
        />
        <span
          style={{
            fontFamily: PIXEL_SUB_FONT,
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: '0.12em',
            color: '#39FF88',
            textTransform: 'uppercase',
          }}
        >
          SATURDAY COLD DISPATCH • LIMITED BATCH
        </span>
      </div>

      {/* Main Headline */}
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
        "AMANKAN JATAH BOTOL DINGIN SABTU INI"
      </div>

      {/* Context Badge */}
      <div
        style={{
          fontFamily: PIXEL_SUB_FONT,
          fontSize: 11,
          color: '#FFE566',
          letterSpacing: '0.08em',
          textAlign: 'center',
        }}
      >
        KUOTA PENGIRIMAN MINGGUAN DIBUKA VIA BIO
      </div>

      {/* CTA Pill with Bouncing Arrow */}
      <div
        style={{
          backgroundColor: 'rgba(57, 255, 136, 0.22)',
          border: '2px solid #39FF88',
          color: '#39FF88',
          fontFamily: PIXEL_SUB_FONT,
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: '0.08em',
          padding: '10px 24px',
          borderRadius: 10,
          textAlign: 'center',
          marginTop: 4,
          boxShadow: '0 0 18px rgba(57, 255, 136, 0.4)',
          transform: `translateY(${arrowBounce}px)`,
        }}
      >
        PESAN SEKARANG • RUTE GOJEK COD ↓
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPOSITION: REEL 17
// ============================================================================
export const Reel17_Dynamic3PSomatic: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Organic continuous camera drift (never clamped or frozen)
  const breathe = Math.sin((frame / 40) * Math.PI) * 0.015;
  const initialPunch = interpolate(frame, [0, 25], [1.14, 1.0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const continuousDrift = interpolate(frame, [25, REEL_17_DURATION], [1.0, 1.05], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const lateralPan = interpolate(frame, [0, REEL_17_DURATION], [0, 16], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const totalScale = initialPunch * continuousDrift + breathe;

  // Error buzz shake at Beat 1 (frames 18-55)
  const errorShakeX = frame >= 18 && frame < 55 ? Math.sin(frame * 4.2) * 5 : 0;
  const errorShakeY = frame >= 18 && frame < 55 ? Math.cos(frame * 3.8) * 3 : 0;

  // 2-frame pixel art breathing & animation toggle
  const poseToggleFast = Math.floor(frame / 8) % 2 === 0;
  const poseToggleMed = Math.floor(frame / 12) % 2 === 0;

  // Stevia droplet fall in Beat 3 (frames 480 -> 540)
  const steviaDropY = interpolate(frame, [495, 530], [0, 110], {
    easing: Easing.in(Easing.quad),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const steviaDropOp = interpolate(frame, [495, 525, 532], [1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#070A0F', overflow: 'hidden' }}>
      {/* ================================================================== */}
      {/* 1. AUDIO ENGINE: CALEB 3P VOICEOVER + DUCKED BGM + SFX (100% UNTOUCHED) */}
      {/* ================================================================== */}
      <Audio
        src={staticFile('assets/sample_3p_somatic_reel.mp3')}
        volume={1.0}
      />

      <Audio
        src={staticFile('assets/bg_music.mp3')}
        volume={(f) =>
          interpolate(f, [0, 30, 870, REEL_17_DURATION], [0.08, 0.12, 0.12, 0.05], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
        }
      />

      {/* Frame-locked SFX */}
      <Sequence from={0} durationInFrames={25}>
        <Audio src={staticFile('assets/sfx/sub_hit.mp3')} volume={0.85} />
      </Sequence>
      <Sequence from={145} durationInFrames={25}>
        <Audio src={staticFile('assets/sfx/eightbit_clock_spin.wav')} volume={0.65} />
      </Sequence>
      <Sequence from={280} durationInFrames={25}>
        <Audio src={staticFile('assets/sfx/impact.mp3')} volume={0.75} />
      </Sequence>
      <Sequence from={460} durationInFrames={25}>
        <Audio src={staticFile('assets/sfx/snap.mp3')} volume={0.75} />
      </Sequence>
      <Sequence from={668} durationInFrames={25}>
        <Audio src={staticFile('assets/sfx/whoosh.mp3')} volume={0.7} />
      </Sequence>
      <Sequence from={763} durationInFrames={35}>
        <Audio src={staticFile('assets/sfx/eightbit_portal_shimmer.wav')} volume={0.85} />
      </Sequence>

      {/* ================================================================== */}
      {/* 2. DYNAMIC VISUAL WORLD STAGE (LIVING PIXEL ANIMATIONS & CUTS)     */}
      {/* ================================================================== */}
      <AbsoluteFill
        style={{
          transform: `translate(${errorShakeX + lateralPan}px, ${errorShakeY}px) scale(${totalScale})`,
          transformOrigin: '50% 50%',
        }}
      >
        {/* ---------------------------------------------------------------- */}
        {/* BEAT 1 (0 - 145f): Caleb Frustrated Desk Typing & Condensation   */}
        {/* Living 2-frame character animation: typing vs groaning sigh      */}
        {/* ---------------------------------------------------------------- */}
        {frame < 145 && (
          <AbsoluteFill>
            <Img
              src={staticFile(
                poseToggleMed
                  ? 'assets/pixel/cup_struggle/s1_typing_cup.jpg'
                  : 'assets/pixel/cup_struggle/s1_typing_cup_b.jpg'
              )}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'contrast(1.06) brightness(0.92)',
              }}
            />
            <SceneParticleStream frame={frame} mode="cafe" opacity={0.75} />
          </AbsoluteFill>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* BEAT 1.5 (145 - 280f): Dangerous Cup Totebag Slosh & Tilt        */}
        {/* Living 2-frame cup slosh toggle over open laptop                 */}
        {/* ---------------------------------------------------------------- */}
        {frame >= 145 && frame < 280 && (
          <AbsoluteFill>
            <Img
              src={staticFile(
                poseToggleFast
                  ? 'assets/pixel/cup_struggle/s2_totebag_tilt.jpg'
                  : 'assets/pixel/cup_struggle/s2_totebag_tilt_b.jpg'
              )}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'contrast(1.08) saturate(1.1)',
              }}
            />
            <SceneParticleStream frame={frame} mode="crash" opacity={0.8} />
          </AbsoluteFill>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* BEAT 2 (280 - 460f): Sugar Crash Science + Rising 8-Bit Zzz      */}
        {/* ---------------------------------------------------------------- */}
        {frame >= 280 && frame < 460 && (
          <AbsoluteFill>
            <Img
              src={staticFile('assets/pixel/stevia_vs_sugar_science.jpg')}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'contrast(1.08) saturate(1.1)',
              }}
            />
            {/* Animated rising 8-bit Zzz sleep particles */}
            <RisingSleepZzz frame={frame} />
            <SceneParticleStream frame={frame} mode="crash" opacity={0.85} />
          </AbsoluteFill>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* BEAT 3 (460 - 668f): Stevia Dropper Macro + Shaking Cold Bottle   */}
        {/* ---------------------------------------------------------------- */}
        {frame >= 460 && frame < 668 && (
          <AbsoluteFill>
            {frame < 540 ? (
              // Extreme Macro Dropper with Animated Falling Stevia Droplet
              <AbsoluteFill>
                <Img
                  src={staticFile('assets/pixel/stevia_dropper_macro.jpg')}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {/* Animated Falling Crystal Stevia Droplet */}
                <div
                  style={{
                    position: 'absolute',
                    left: '50.2%',
                    top: `calc(52% + ${steviaDropY}px)`,
                    width: 22,
                    height: 32,
                    borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                    background:
                      'radial-gradient(circle at 35% 35%, #FFFFFF, #39FF88 65%, #059669)',
                    boxShadow: '0 0 24px #39FF88, 0 0 40px #FFFFFF',
                    opacity: steviaDropOp,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 60,
                  }}
                />
                <SceneParticleStream frame={frame} mode="matcha" opacity={0.9} />
              </AbsoluteFill>
            ) : (
              // Caleb Actively Shaking the Cold Sealed Lira Bottle
              <AbsoluteFill>
                <Img
                  src={staticFile(
                    poseToggleFast
                      ? 'assets/pixel/caleb_action_seq/f1_inspect.jpg'
                      : 'assets/pixel/caleb_action_seq/f2_shake.jpg'
                  )}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {/* Real Photo Bottle Cutout with 100% full original stickers */}
                <div
                  style={{
                    position: 'absolute',
                    left: 810,
                    top: 650,
                    width: 110,
                    height: 220,
                    transform: `translate(-50%, -50%) rotate(${Math.sin(frame * 0.2) * 4}deg)`,
                    zIndex: 65,
                    filter:
                      'drop-shadow(0 16px 28px rgba(0,0,0,0.9)) drop-shadow(0 0 20px rgba(57,255,136,0.45))',
                  }}
                >
                  <Img
                    src={staticFile('assets/matcha.png')}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
                <SceneParticleStream frame={frame} mode="matcha" opacity={0.9} />
              </AbsoluteFill>
            )}
          </AbsoluteFill>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* BEAT 4 (668 - 763f): 180° Inverted Bottle Leakproof Stress Test   */}
        {/* ---------------------------------------------------------------- */}
        {frame >= 668 && frame < 763 && (
          <AbsoluteFill>
            <Img
              src={staticFile(
                poseToggleFast
                  ? 'assets/pixel/cup_struggle/s3_inverted_a.jpg'
                  : 'assets/pixel/cup_struggle/s3_inverted_b.jpg'
              )}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'contrast(1.08) saturate(1.1)',
              }}
            />
            {/* Leakproof Badge */}
            <div
              style={{
                position: 'absolute',
                left: 540,
                bottom: 260,
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(7, 10, 15, 0.94)',
                border: `3px solid ${COLORS.emeraldNeon}`,
                borderRadius: 14,
                padding: '10px 24px',
                fontFamily: PIXEL_SUB_FONT,
                fontSize: 16,
                color: COLORS.emeraldNeon,
                letterSpacing: '0.08em',
                boxShadow: '0 12px 28px rgba(0,0,0,0.9), 0 0 16px rgba(57,255,136,0.4)',
                zIndex: 65,
                whiteSpace: 'nowrap',
              }}
            >
              ✓ 180° HERMETIC SEAL • ZERO DRIPS BONE DRY
            </div>
            <SceneParticleStream frame={frame} mode="frost" opacity={0.9} />
          </AbsoluteFill>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* BEAT 5 & 6 (763 - 917f): Gojek Hand-off & Hero Founder Point      */}
        {/* ---------------------------------------------------------------- */}
        {frame >= 763 && (
          <AbsoluteFill>
            {frame < 815 ? (
              // Gojek Hand-off with Dark Forest Green Cooler Bag
              <AbsoluteFill>
                <Img
                  src={staticFile(
                    poseToggleMed
                      ? 'assets/pixel/tutorial/s4_gojek_green_a.jpg'
                      : 'assets/pixel/tutorial/s4_gojek_green_b.jpg'
                  )}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'contrast(1.06) saturate(1.08)',
                  }}
                />
                <SceneParticleStream frame={frame} mode="frost" opacity={0.85} />
              </AbsoluteFill>
            ) : (
              // Caleb Hero Point with Flanking Real Cold Bottles
              <AbsoluteFill>
                <Img
                  src={staticFile('assets/pixel/caleb_point_hero.jpg')}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'contrast(1.06) saturate(1.08)',
                  }}
                />

                {/* Flanking Real Bottles Inside Red Box (x:[192, 896], y:[202, 1236]) */}
                {[
                  {
                    src: 'assets/choco.png',
                    x: 270,
                    y: 1025,
                    rot: -6,
                    label: 'CHOCO HAZELNUT',
                    color: COLORS.hazelnutGold,
                  },
                  {
                    src: 'assets/matcha.png',
                    x: 815,
                    y: 1025,
                    rot: 6,
                    label: 'MATCHA OATSIDE',
                    color: COLORS.emeraldNeon,
                  },
                ].map((b, idx) => {
                  const pop = spring({
                    frame: Math.max(0, frame - (818 + idx * 6)),
                    fps,
                    config: { damping: 11, stiffness: 180 },
                  });
                  return (
                    <div
                      key={idx}
                      style={{
                        position: 'absolute',
                        left: b.x,
                        top: b.y + Math.sin(frame * 0.15 + idx) * 5,
                        transform: `translate(-50%, -50%) scale(${pop}) rotate(${b.rot}deg)`,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        zIndex: 65,
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
                          marginTop: -6,
                          backgroundColor: 'rgba(7, 10, 15, 0.94)',
                          border: `1.5px solid ${b.color}`,
                          borderRadius: 6,
                          padding: '4px 10px',
                          color: b.color,
                          fontFamily: PIXEL_SUB_FONT,
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          whiteSpace: 'nowrap',
                          boxShadow: `0 4px 10px rgba(0,0,0,0.8), 0 0 10px ${b.color}40`,
                        }}
                      >
                        {b.label}
                      </div>
                    </div>
                  );
                })}
                <SceneParticleStream frame={frame} mode="frost" opacity={0.8} />
              </AbsoluteFill>
            )}
          </AbsoluteFill>
        )}
      </AbsoluteFill>

      {/* ================================================================== */}
      {/* 3. FOREGROUND HUD & MODALS (STRICTLY INSIDE RED BOX SAFE ZONE)     */}
      {/* ================================================================== */}
      <CenterSomaticDiagnosticHUD frame={frame} fps={fps} />
      <TopLiraGlassCard frame={frame} />
      <FloatingBrewClockHUD frame={frame} fps={fps} />
      <Center3PActionModal frame={frame} fps={fps} />

      {/* ================================================================== */}
      {/* 4. DYNAMIC TIKTOK KINETIC CAPTIONS (START AFTER HOOK ABSORPTION)   */}
      {/* ================================================================== */}
      {frame >= 40 && frame < 763 && (
        <TikTokCaption
          currentFrame={frame}
          chunks={captionsData}
          topPercentage={58}
          fontSize={54}
        />
      )}
    </AbsoluteFill>
  );
};
