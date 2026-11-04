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
import captionsData from './reel_new_13_saturday_cod_loop_captions.json';

const { fontFamily: PIXEL_HEADER_FONT } = loadPressStart();
const { fontFamily: PIXEL_SUB_FONT } = loadSilkscreen();
const { fontFamily: SANS_FONT } = loadPlusJakarta();

// ============================================================================
// REEL 13 (BOFU): THE SATURDAY GOJEK COD LOOP & COOLER BAG SOP
// Frameworks:
//   1. Drunk Grandma Simplicity (1. What You Buy -> 2. How It Arrives -> 3. How You Pay)
//   2. High-Stakes Kinetic Tension (Countdown to Friday 18:00 WIB Cutoff)
//   3. Skin-in-the-Game Offer (Forest Green Aluminum-Foil Cooler Bag + Rp 1.000 Garansi COD)
// 1332 frames @ 30fps = 44.40s | 1080x1440 (3:4 Portrait)
// ============================================================================
export const REEL_13_DURATION = 1332;

const COLORS = {
  emeraldNeon: '#39FF88',
  cyanFrost: '#5CE1E6',
  hazelnutGold: '#E6A145',
  oatCream: '#FAF7F0',
  gold: '#D4AF37',
  goldBright: '#FFE566',
  crimson: '#FF2E63',
  forestGreen: '#2E5A27',
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
      : ['#E0F2FE', '#7DD3FC', '#39FF88', '#FFFFFF'];

  return (
    <AbsoluteFill style={{ opacity, pointerEvents: 'none', zIndex: 48 }}>
      {Array.from({ length: 26 }, (_, i) => {
        const speed = 1.45 + (i % 5) * 0.25;
        const progress = ((frame * speed + i * 19) % 100) / 100;
        const baseX = 120 + ((i * 83) % 840);
        const swayX = Math.sin(progress * Math.PI * 2.4 + i) * 40;
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
// SUB-COMPONENT: FLOATING 8-BIT POCKET WATCH HUD (FRIDAY 18:00 CUTOFF & SAT COD)
// ============================================================================
const FloatingCutoffClockHUD: React.FC<{
  frame: number;
  gravityTiltDeg: number;
}> = ({ frame, gravityTiltDeg }) => {
  const pendulumAngle = Math.sin(frame * 0.22) * 15 + gravityTiltDeg * 1.25;

  const isSpinning =
    (frame >= 218 && frame < 246) ||
    (frame >= 460 && frame < 488) ||
    (frame >= 752 && frame < 780) ||
    (frame >= 914 && frame < 942) ||
    (frame >= 1168 && frame < 1196);

  const minuteHandDeg = isSpinning
    ? frame * 32
    : frame < 224
    ? 330 // 17:55 approaching 18:00
    : frame < 465
    ? 0 // 18:00
    : frame < 758
    ? 180 // 22:30 Friday brew
    : frame < 1174
    ? 0 // 10:00 Saturday
    : 0; // 18:00 Friday cutoff

  const hourHandDeg = isSpinning
    ? frame * 7
    : frame < 465
    ? 180 // 18:00
    : frame < 758
    ? 300 // 22:00
    : frame < 1174
    ? 300 // 10:00 AM
    : 180; // 18:00

  let counterLabel = 'FRI 18:00';
  let counterColor = COLORS.crimson;
  let shiftTag = 'PO CUTOFF!';

  if (frame >= 224 && frame < 465) {
    counterLabel = 'STEP 1 / 3';
    counterColor = COLORS.goldBright;
    shiftTag = 'PILIH VAULT';
  } else if (frame >= 465 && frame < 758) {
    counterLabel = '2°C - 4°C';
    counterColor = COLORS.cyanFrost;
    shiftTag = 'FOIL COOLER';
  } else if (frame >= 758 && frame < 918) {
    counterLabel = 'SAT 10-12';
    counterColor = COLORS.emeraldNeon;
    shiftTag = 'GOSEND LOOP';
  } else if (frame >= 918 && frame < 1174) {
    counterLabel = 'RP 1.000';
    counterColor = COLORS.goldBright;
    shiftTag = 'GARANSI COD';
  } else if (frame >= 1174) {
    counterLabel = 'FRI 18:00';
    counterColor = COLORS.goldBright;
    shiftTag = 'LOCK BIO NOW';
  }

  return (
    <div
      style={{
        position: 'absolute',
        right: 34,
        top: 196,
        width: 148,
        height: 215,
        zIndex: 75,
        pointerEvents: 'none',
        filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.92))',
      }}
    >
      {/* Brass Chain */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          width: 8,
          height: 44,
          transform: 'translateX(-50%)',
          backgroundColor: COLORS.gold,
          borderLeft: '2px solid #000',
          borderRight: '2px solid #000',
        }}
      />

      {/* Swinging Pendulum */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 96,
          width: 6,
          height: 68,
          backgroundColor: COLORS.gold,
          transformOrigin: 'top center',
          transform: `translateX(-50%) rotate(${pendulumAngle}deg)`,
          border: '2px solid #000',
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: -15,
            left: '50%',
            width: 30,
            height: 30,
            borderRadius: '50%',
            backgroundColor: COLORS.goldBright,
            border: '3.5px solid #000',
            transform: 'translateX(-50%)',
          }}
        />
      </div>

      {/* Pocket Watch Face */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 40,
          width: 108,
          height: 108,
          borderRadius: '50%',
          backgroundColor: '#FAF7F0',
          border: '6px solid #000',
          boxShadow: `inset 0 0 0 6px ${COLORS.gold}`,
          transform: 'translateX(-50%)',
        }}
      >
        {[0, 90, 180, 270].map((deg) => (
          <div
            key={deg}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 5,
              height: 12,
              backgroundColor: '#000',
              transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-36px)`,
            }}
          />
        ))}
        {/* Hour Hand */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 6,
            height: 26,
            backgroundColor: '#143322',
            transformOrigin: 'bottom center',
            transform: `translate(-50%, -100%) rotate(${hourHandDeg}deg)`,
          }}
        />
        {/* Minute Hand */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 4,
            height: 36,
            backgroundColor: '#5C3A21',
            transformOrigin: 'bottom center',
            transform: `translate(-50%, -100%) rotate(${minuteHandDeg}deg)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: '#000',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      {/* Digital Status Readout */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(7, 10, 15, 0.96)',
          border: `2.5px solid ${counterColor}`,
          borderRadius: 10,
          padding: '6px 10px',
          whiteSpace: 'nowrap',
          textAlign: 'center',
          boxShadow: '0 6px 18px rgba(0,0,0,0.9)',
        }}
      >
        <div
          style={{
            fontFamily: PIXEL_HEADER_FONT,
            fontSize: 12,
            color: counterColor,
            letterSpacing: '0.03em',
          }}
        >
          {counterLabel}
        </div>
        <div
          style={{
            fontFamily: PIXEL_SUB_FONT,
            fontSize: 10,
            color: '#E2E8F0',
            marginTop: 2,
          }}
        >
          {shiftTag}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SUB-COMPONENT: BEAT 2 — STEP 1 VAULT BUNDLE CARDS (4-PACK 88K & 6-PACK 115K)
// ============================================================================
const Step1VaultBundlesOverlay: React.FC<{
  frame: number;
  fps: number;
}> = ({ frame, fps }) => {
  if (frame < 224 || frame >= 465) return null;

  const card1Pop = spring({
    frame: Math.max(0, frame - 295),
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.7 },
  });

  const card2Pop = spring({
    frame: Math.max(0, frame - 365),
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.7 },
  });

  const isCard2Active = frame >= 365;

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: 68,
        transform: 'translateX(-50%)',
        width: 980,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 18,
        zIndex: 66,
        pointerEvents: 'none',
      }}
    >
      {/* OPSI A: 4-PACK VAULT (Rp 88.000 + FREE COOLER BAG) */}
      <div
        style={{
          backgroundColor: 'rgba(7, 11, 16, 0.94)',
          border: `3px solid ${!isCard2Active ? COLORS.emeraldNeon : 'rgba(57, 255, 136, 0.55)'}`,
          borderRadius: 20,
          padding: '16px 18px',
          boxShadow: !isCard2Active
            ? `0 18px 42px rgba(0,0,0,0.92), 0 0 28px ${COLORS.emeraldNeon}40`
            : '0 14px 30px rgba(0,0,0,0.85)',
          transform: `scale(${interpolate(card1Pop, [0, 1], [0.85, !isCard2Active ? 1.03 : 0.98])})`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              backgroundColor: 'rgba(57, 255, 136, 0.18)',
              border: `1.5px solid ${COLORS.emeraldNeon}`,
              color: COLORS.emeraldNeon,
              fontFamily: PIXEL_SUB_FONT,
              fontSize: 13,
              fontWeight: 700,
              padding: '3px 9px',
              borderRadius: 6,
            }}
          >
            OPSI A • HEMAT 4K
          </span>
          <span
            style={{
              fontFamily: PIXEL_HEADER_FONT,
              fontSize: 20,
              color: COLORS.goldBright,
            }}
          >
            Rp88K
          </span>
        </div>

        <div>
          <div
            style={{
              fontFamily: SANS_FONT,
              fontSize: 25,
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '-0.01em',
            }}
          >
            4-PACK VAULT
          </div>
          <div
            style={{
              fontFamily: SANS_FONT,
              fontSize: 15,
              fontWeight: 700,
              color: '#CBD5E1',
              marginTop: 2,
            }}
          >
            2 Choco Hazelnut + 2 Matcha Oatside
          </div>
        </div>

        {/* Bottles + Free Cooler Bag Mini Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: 12,
            padding: '8px 12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Img src={staticFile('assets/bottles_ssot/choco_ssot.png')} style={{ height: 64, objectFit: 'contain' }} />
            <Img src={staticFile('assets/bottles_ssot/choco_ssot.png')} style={{ height: 64, objectFit: 'contain' }} />
            <Img src={staticFile('assets/bottles_ssot/matcha_ssot.png')} style={{ height: 64, objectFit: 'contain' }} />
            <Img src={staticFile('assets/bottles_ssot/matcha_ssot.png')} style={{ height: 64, objectFit: 'contain' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Img
              src={staticFile('assets/pixel/tutorial/cooler_bag_cutout.png')}
              style={{ height: 58, objectFit: 'contain' }}
            />
            <span
              style={{
                fontFamily: PIXEL_SUB_FONT,
                fontSize: 12,
                color: COLORS.emeraldNeon,
                fontWeight: 700,
                lineHeight: 1.15,
              }}
            >
              +FREE
              <br />
              BAG!
            </span>
          </div>
        </div>
      </div>

      {/* OPSI B: 6-PACK CHILLER (Rp 115.000 + FREE COOLER BAG) */}
      <div
        style={{
          backgroundColor: 'rgba(7, 11, 16, 0.94)',
          border: `3px solid ${isCard2Active ? COLORS.goldBright : 'rgba(255, 229, 102, 0.45)'}`,
          borderRadius: 20,
          padding: '16px 18px',
          boxShadow: isCard2Active
            ? `0 18px 42px rgba(0,0,0,0.92), 0 0 28px ${COLORS.goldBright}45`
            : '0 14px 30px rgba(0,0,0,0.85)',
          transform: `scale(${interpolate(card2Pop, [0, 1], [0.92, isCard2Active ? 1.04 : 0.97])})`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              backgroundColor: 'rgba(255, 229, 102, 0.2)',
              border: `1.5px solid ${COLORS.goldBright}`,
              color: COLORS.goldBright,
              fontFamily: PIXEL_SUB_FONT,
              fontSize: 13,
              fontWeight: 700,
              padding: '3px 9px',
              borderRadius: 6,
            }}
          >
            OPSI B • HEMAT 7K
          </span>
          <span
            style={{
              fontFamily: PIXEL_HEADER_FONT,
              fontSize: 20,
              color: COLORS.emeraldNeon,
            }}
          >
            Rp115K
          </span>
        </div>

        <div>
          <div
            style={{
              fontFamily: SANS_FONT,
              fontSize: 25,
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '-0.01em',
            }}
          >
            FULL CHILLER 6-PACK
          </div>
          <div
            style={{
              fontFamily: SANS_FONT,
              fontSize: 15,
              fontWeight: 700,
              color: '#CBD5E1',
              marginTop: 2,
            }}
          >
            2 Choco + 2 Matcha + 2 Milk Tea
          </div>
        </div>

        {/* 6 Bottles + Free Cooler Bag Mini Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: 12,
            padding: '8px 12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Img src={staticFile('assets/bottles_ssot/choco_ssot.png')} style={{ height: 60, objectFit: 'contain' }} />
            <Img src={staticFile('assets/bottles_ssot/choco_ssot.png')} style={{ height: 60, objectFit: 'contain' }} />
            <Img src={staticFile('assets/bottles_ssot/matcha_ssot.png')} style={{ height: 60, objectFit: 'contain' }} />
            <Img src={staticFile('assets/bottles_ssot/matcha_ssot.png')} style={{ height: 60, objectFit: 'contain' }} />
            <Img src={staticFile('assets/bottles_ssot/milktea_ssot.png')} style={{ height: 60, objectFit: 'contain' }} />
            <Img src={staticFile('assets/bottles_ssot/milktea_ssot.png')} style={{ height: 60, objectFit: 'contain' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Img
              src={staticFile('assets/pixel/tutorial/cooler_bag_cutout.png')}
              style={{ height: 58, objectFit: 'contain' }}
            />
            <span
              style={{
                fontFamily: PIXEL_SUB_FONT,
                fontSize: 12,
                color: COLORS.goldBright,
                fontWeight: 700,
                lineHeight: 1.15,
              }}
            >
              +FREE
              <br />
              BAG!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SUB-COMPONENT: BEAT 3 — COOLER BAG SOP CALLOUT BADGES (ALUMINUM FOIL + 2-4°C)
// ============================================================================
const Step2CoolerBagBadges: React.FC<{
  frame: number;
  fps: number;
}> = ({ frame, fps }) => {
  if (frame < 465 || frame >= 758) return null;

  const badge1Pop = spring({
    frame: Math.max(0, frame - 480),
    fps,
    config: { damping: 12, stiffness: 190 },
  });

  const badge2Pop = spring({
    frame: Math.max(0, frame - 620),
    fps,
    config: { damping: 12, stiffness: 190 },
  });

  const isSealed = frame >= 625;

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: 72,
        transform: 'translateX(-50%)',
        width: 960,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 18,
        zIndex: 66,
        pointerEvents: 'none',
      }}
    >
      {/* Badge 1: Forest Green Bag + Aluminum Foil Lining */}
      <div
        style={{
          flex: 1,
          backgroundColor: 'rgba(7, 12, 16, 0.94)',
          border: `2.5px solid ${COLORS.emeraldNeon}`,
          borderRadius: 18,
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          boxShadow: '0 14px 32px rgba(0,0,0,0.9)',
          transform: `scale(${badge1Pop})`,
        }}
      >
        <Img
          src={staticFile('assets/pixel/tutorial/cooler_bag_cutout.png')}
          style={{ height: 74, objectFit: 'contain' }}
        />
        <div>
          <div
            style={{
              fontFamily: PIXEL_SUB_FONT,
              fontSize: 13,
              color: COLORS.emeraldNeon,
              fontWeight: 700,
            }}
          >
            ✓ FREE TIAP 4-PACK / 6-PACK
          </div>
          <div
            style={{
              fontFamily: SANS_FONT,
              fontSize: 20,
              fontWeight: 900,
              color: '#FFFFFF',
              marginTop: 2,
            }}
          >
            LAPISAN ALUMINIUM FOIL
          </div>
          <div
            style={{
              fontFamily: SANS_FONT,
              fontSize: 14,
              fontWeight: 700,
              color: '#94A3B8',
            }}
          >
            Bagmart Size S • Cold Crafted Fuel
          </div>
        </div>
      </div>

      {/* Badge 2: Cold Chain Locked (2-4°C Chiller State) */}
      <div
        style={{
          flex: 1,
          backgroundColor: 'rgba(7, 12, 16, 0.94)',
          border: `2.5px solid ${isSealed ? COLORS.cyanFrost : 'rgba(92, 225, 230, 0.45)'}`,
          borderRadius: 18,
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          boxShadow: isSealed
            ? `0 14px 32px rgba(0,0,0,0.9), 0 0 26px ${COLORS.cyanFrost}45`
            : '0 14px 32px rgba(0,0,0,0.85)',
          transform: `scale(${frame >= 620 ? badge2Pop : 0.92})`,
          opacity: frame >= 580 ? 1 : 0.75,
        }}
      >
        <div
          style={{
            width: 62,
            height: 62,
            borderRadius: 14,
            backgroundColor: 'rgba(92, 225, 230, 0.16)',
            border: `2px solid ${COLORS.cyanFrost}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            flexShrink: 0,
          }}
        >
         
        </div>
        <div>
          <div
            style={{
              fontFamily: PIXEL_SUB_FONT,
              fontSize: 13,
              color: COLORS.cyanFrost,
              fontWeight: 700,
            }}
          >
            {isSealed ? 'SUHU TERKUNCI 2°C–4°C' : 'FRESH BREW JUMAT MALAM'}
          </div>
          <div
            style={{
              fontFamily: SANS_FONT,
              fontSize: 20,
              fontWeight: 900,
              color: '#FFFFFF',
              marginTop: 2,
            }}
          >
            TAHAN 2–3 MINGGU DI KULKAS
          </div>
          <div
            style={{
              fontFamily: SANS_FONT,
              fontSize: 14,
              fontWeight: 700,
              color: '#94A3B8',
            }}
          >
            Dingin Awet Sampai Pagar Rumah
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SUB-COMPONENT: BEAT 4 — STEP 3 GOJEK COD LOOP + RP 1.000 GARANSI BADGES
// ============================================================================
const Step3GojekCodBadges: React.FC<{
  frame: number;
  fps: number;
}> = ({ frame, fps }) => {
  if (frame < 758 || frame >= 1174) return null;

  const isCodPhase = frame >= 918;
  const isGaransiPhase = frame >= 1070;

  const popA = spring({
    frame: Math.max(0, frame - 770),
    fps,
    config: { damping: 12, stiffness: 185 },
  });

  const popB = spring({
    frame: Math.max(0, frame - 922),
    fps,
    config: { damping: 12, stiffness: 195 },
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: 68,
        transform: 'translateX(-50%)',
        width: 960,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 18,
        zIndex: 66,
        pointerEvents: 'none',
      }}
    >
      {/* Left Card: Product Transfer via Form + Saturday 10-12 Dispatch */}
      <div
        style={{
          backgroundColor: 'rgba(7, 11, 16, 0.95)',
          border: `2.5px solid ${!isCodPhase ? COLORS.emeraldNeon : 'rgba(57, 255, 136, 0.6)'}`,
          borderRadius: 18,
          padding: '14px 18px',
          boxShadow: '0 16px 36px rgba(0,0,0,0.92)',
          transform: `scale(${popA})`,
        }}
      >
        <div
          style={{
            fontFamily: PIXEL_SUB_FONT,
            fontSize: 13,
            color: COLORS.emeraldNeon,
            fontWeight: 700,
          }}
        >
          1. HARGA BOTOL DI FORM
        </div>
        <div
          style={{
            fontFamily: SANS_FONT,
            fontSize: 21,
            fontWeight: 900,
            color: '#FFFFFF',
            marginTop: 4,
          }}
        >
          TRANSFER BCA / SEABANK
        </div>
        <div
          style={{
            fontFamily: SANS_FONT,
            fontSize: 14,
            fontWeight: 700,
            color: '#CBD5E1',
            marginTop: 4,
          }}
        >
          Dikirim Sabtu Pagi (10:00–12:00 WIB)
        </div>
      </div>

      {/* Right Card: Ongkir + Rp 1.000 Garansi Paid COD to Gojek Driver */}
      <div
        style={{
          backgroundColor: 'rgba(7, 11, 16, 0.95)',
          border: `3px solid ${isCodPhase ? COLORS.goldBright : 'rgba(255, 229, 102, 0.45)'}`,
          borderRadius: 18,
          padding: '14px 18px',
          boxShadow: isCodPhase
            ? `0 16px 38px rgba(0,0,0,0.95), 0 0 28px ${COLORS.goldBright}45`
            : '0 14px 30px rgba(0,0,0,0.85)',
          transform: `scale(${isCodPhase ? popB : 0.94})`,
        }}
      >
        <div
          style={{
            fontFamily: PIXEL_SUB_FONT,
            fontSize: 13,
            color: COLORS.goldBright,
            fontWeight: 700,
          }}
        >
          {isGaransiPhase ? 'GARANSI RP 1.000 AKTIF!' : '2. ONGKIR BAYAR DI TUJUAN'}
        </div>
        <div
          style={{
            fontFamily: SANS_FONT,
            fontSize: 21,
            fontWeight: 900,
            color: '#FFFFFF',
            marginTop: 4,
          }}
        >
          {isGaransiPhase ? 'BOCOR / ANGET? GANTI 100%!' : 'COD TUNAI KE DRIVER GOJEK'}
        </div>
        <div
          style={{
            fontFamily: SANS_FONT,
            fontSize: 14,
            fontWeight: 700,
            color: COLORS.emeraldNeon,
            marginTop: 4,
          }}
        >
          Ongkir + Rp 1.000 Garansi Dingin Aman
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SUB-COMPONENT: BEAT 5 — HERO COOLER BAG + BOTTLES CTA FOOTER
// ============================================================================
const Beat5HeroCoolerCta: React.FC<{
  frame: number;
  fps: number;
}> = ({ frame, fps }) => {
  if (frame < 1174) return null;

  const pop = spring({
    frame: frame - 1174,
    fps,
    config: { damping: 12, stiffness: 175 },
  });

  const pulse = 1 + Math.sin((frame - 1174) * 0.22) * 0.025;

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: 62,
        transform: `translateX(-50%) scale(${pop * pulse})`,
        width: 960,
        backgroundColor: 'rgba(7, 11, 16, 0.95)',
        border: `3px solid ${COLORS.goldBright}`,
        borderRadius: 24,
        padding: '18px 26px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: `0 24px 60px rgba(0,0,0,0.95), 0 0 38px ${COLORS.goldBright}40`,
        zIndex: 68,
        pointerEvents: 'none',
      }}
    >
      {/* Left: Forest Green Cooler Bag + 3 SSOT Bottles */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Img
          src={staticFile('assets/pixel/tutorial/cooler_bag_cutout.png')}
          style={{
            height: 118,
            objectFit: 'contain',
            filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.85))',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Img src={staticFile('assets/bottles_ssot/matcha_ssot.png')} style={{ height: 98, objectFit: 'contain' }} />
          <Img src={staticFile('assets/bottles_ssot/choco_ssot.png')} style={{ height: 98, objectFit: 'contain' }} />
          <Img src={staticFile('assets/bottles_ssot/milktea_ssot.png')} style={{ height: 98, objectFit: 'contain' }} />
        </div>
      </div>

      {/* Right: Cutoff CTA Copy */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
        <span
          style={{
            backgroundColor: 'rgba(255, 46, 99, 0.22)',
            border: `1.5px solid ${COLORS.crimson}`,
            color: '#FF8FA3',
            fontFamily: PIXEL_SUB_FONT,
            fontSize: 13,
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: 6,
          }}
        >
          TUTUP JUMAT JAM 18:00 WIB
        </span>
        <div
          style={{
            background: `linear-gradient(135deg, ${COLORS.goldBright} 0%, #E6A145 100%)`,
            color: '#070A0F',
            fontFamily: PIXEL_HEADER_FONT,
            fontSize: 19,
            padding: '12px 20px',
            borderRadius: 12,
            boxShadow: `0 6px 20px ${COLORS.goldBright}50`,
          }}
        >
          {'\u25B6'} KLIK LINK DI BIO
        </div>
        <div
          style={{
            fontFamily: SANS_FONT,
            fontSize: 16,
            fontWeight: 800,
            color: COLORS.emeraldNeon,
          }}
        >
          @drinklira • bit.ly/DrinkLira
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SUB-COMPONENT: TOP FLOATING LIRA GLASSMORPHIC STATUS CARD
// ============================================================================
const TopLiraGlassCard: React.FC<{
  frame: number;
  fps: number;
}> = ({ frame, fps }) => {
  let tagText = 'LIRA SATURDAY LOOP • CUTOFF JUMAT 18:00 WIB';
  let headlineText = 'CARA PESEN STOK KULKAS LIRA (3 LANGKAH SIMPEL)';
  let subText = 'DISPATCH SABTU PAGI • FREE COOLER BAG • ONGKIR COD';
  let accentColor = COLORS.goldBright;
  let showStepIndicator = true;
  let activeStep = 0;

  if (frame >= 224 && frame < 465) {
    tagText = 'LANGKAH 1 • APA YANG LO BELI (LINK DI BIO)';
    headlineText = '4-PACK VAULT (88K) ATAU 6-PACK CHILLER (115K)';
    subText = 'HEMAT SAMPAI RP 7.000 + GRATIS COOLER BAG HIJAU LIRA';
    accentColor = COLORS.emeraldNeon;
    activeStep = 1;
  } else if (frame >= 465 && frame < 758) {
    tagText = 'LANGKAH 2 • COOLER BAG SOP (COLD CRAFTED FUEL)';
    headlineText = 'TAS THERMAL HIJAU LIRA BERLAPIS ALUMINIUM FOIL';
    subText = 'DISEDUH FRESH JUMAT MALAM • TERKUNCI DINGIN SAMPAI PAGAR';
    accentColor = COLORS.cyanFrost;
    activeStep = 2;
  } else if (frame >= 758 && frame < 1174) {
    tagText = 'LANGKAH 3 • SATURDAY GOJEK COD LOOP (10:00–12:00)';
    headlineText = 'ONGKIR + GARANSI RP 1.000 BAYAR TUNAI DI TEMPAT!';
    subText = 'HARGA BOTOL TRANSFER DI FORM • BOCOR/ANGET GANTI 100%';
    accentColor = COLORS.goldBright;
    activeStep = 3;
  } else if (frame >= 1174) {
    tagText = 'PRE-ORDER BATCH SABTU DITUTUP JUMAT 18:00 WIB!';
    headlineText = 'AMANKAN SLOT VAULT LO LEWAT LINK DI BIO SEKARANG';
    subText = 'KUOTA MINGGUAN TERBATAS • @DRINKLIRA';
    accentColor = COLORS.goldBright;
    showStepIndicator = false;
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 42,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 950,
        backgroundColor: 'rgba(7, 10, 15, 0.93)',
        border: `2.5px solid ${accentColor}`,
        borderRadius: 22,
        padding: '15px 26px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.92)',
        zIndex: 80,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 5,
      }}
    >
      {/* Top Row: Tag + 1-2-3 Step Pills */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 11,
              height: 11,
              borderRadius: '50%',
              backgroundColor: accentColor,
              boxShadow: `0 0 12px ${accentColor}`,
            }}
          />
          <span
            style={{
              fontFamily: PIXEL_SUB_FONT,
              fontSize: 14,
              fontWeight: 700,
              color: accentColor,
              letterSpacing: '0.06em',
            }}
          >
            {tagText}
          </span>
        </div>

        {showStepIndicator ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {[
              { step: 1, label: '1. BELI' },
              { step: 2, label: '2. COOLER' },
              { step: 3, label: '3. COD' },
            ].map((s) => {
              const isCurrent = activeStep === s.step;
              const isDone = activeStep > s.step;
              return (
                <span
                  key={s.step}
                  style={{
                    fontFamily: PIXEL_SUB_FONT,
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 5,
                    backgroundColor: isCurrent
                      ? accentColor
                      : isDone
                      ? 'rgba(57, 255, 136, 0.2)'
                      : 'rgba(255,255,255,0.08)',
                    color: isCurrent ? '#070A0F' : isDone ? COLORS.emeraldNeon : '#94A3B8',
                  }}
                >
                  {s.label}
                </span>
              );
            })}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 4 }}>
            {[0, 1, 2, 3, 4].map((i) => {
              const starPop = spring({
                frame: Math.max(0, frame - (1176 + i * 4)),
                fps,
                config: { damping: 10, stiffness: 220 },
              });
              return (
                <span
                  key={i}
                  style={{
                    fontFamily: SANS_FONT,
                    fontSize: 20,
                    color: COLORS.goldBright,
                    transform: `scale(${interpolate(starPop, [0, 1], [0.5, 1.15])})`,
                    textShadow: '0 0 10px rgba(255,229,102,0.8)',
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
          fontFamily: SANS_FONT,
          fontSize: 27,
          fontWeight: 900,
          color: '#FFFFFF',
          textAlign: 'center',
          letterSpacing: '-0.01em',
          lineHeight: 1.15,
          textShadow: '0 4px 14px rgba(0,0,0,0.8)',
        }}
      >
        {headlineText}
      </div>

      {/* Sub-label */}
      <div
        style={{
          fontFamily: SANS_FONT,
          fontSize: 14,
          fontWeight: 700,
          color: '#CBD5E1',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}
      >
        {subText}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPOSITION: LiraSaturdayCodLoop
// ============================================================================
export const Reel13_SaturdayCodLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --------------------------------------------------------------------------
  // 1. SELECT ILLUSTRATED PIXEL-ART SCENE PLATE (WITH 5-FPS A/B TOGGLE)
  // --------------------------------------------------------------------------
  const toggleB = Math.floor(frame / 6) % 2 === 1;

  let currentPlate = toggleB
    ? 'assets/pixel/tutorial/s1_phone_b.jpg'
    : 'assets/pixel/tutorial/s1_phone_a.jpg';

  if (frame >= 224 && frame < 465) {
    // Beat 2: Step 1 What You Buy (4-Pack Vault 88k & 6-Pack Chiller 115k)
    currentPlate = toggleB
      ? 'assets/pixel/s5_batch_b.jpg'
      : 'assets/pixel/s5_batch_a.jpg';
  } else if (frame >= 465 && frame < 758) {
    // Beat 3: Step 2 Cooler Bag SOP (Packing into Foil-Lined Forest Green Bag -> Sealing Flap)
    // Before 625f: predominantly Frame A (lowering cold bottles into foil lining) with subtle A/B life
    // After 625f ("Diseduh fresh Jumat malam, suhunya terkunci dingin"): Frame B (sealing the thermal flap)
    if (frame < 605) {
      currentPlate = 'assets/pixel/tutorial/s3_cooler_bag_pack_a.jpg';
    } else if (frame < 635) {
      currentPlate = toggleB
        ? 'assets/pixel/tutorial/s3_cooler_bag_pack_b.jpg'
        : 'assets/pixel/tutorial/s3_cooler_bag_pack_a.jpg';
    } else {
      currentPlate = 'assets/pixel/tutorial/s3_cooler_bag_pack_b.jpg';
    }
  } else if (frame >= 758 && frame < 1174) {
    // Beat 4: Step 3 Saturday Gojek COD Loop at Gate with Forest Green Cooler Bag
    currentPlate = toggleB
      ? 'assets/pixel/tutorial/s4_gojek_green_b.jpg'
      : 'assets/pixel/tutorial/s4_gojek_green_a.jpg';
  } else if (frame >= 1174) {
    // Beat 5: Friday 18:00 Cutoff & Link in Bio Hero CTA
    currentPlate =
      frame >= 1250
        ? 'assets/pixel/tutorial/s1_phone_b.jpg'
        : 'assets/pixel/caleb_point_hero.jpg';
  }

  // --------------------------------------------------------------------------
  // 2. DYNAMIC CAMERA ENGINE (CRASH-ZOOM, WHIP-PANS, CLOSE-UP CARRY, -8.5° TILT)
  // --------------------------------------------------------------------------
  const openingZoom = interpolate(frame, [0, 18], [1.36, 1.09], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Close-up zoom carry onto the Foil-Lined Green Cooler Bag (Beat 3) & Gojek Driver (Beat 4B)
  const coolerFocusWeight =
    interpolate(frame, [465, 495], [0, 1], {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }) *
    interpolate(frame, [745, 765], [1, 0], {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

  const gojekFocusWeight =
    interpolate(frame, [915, 940], [0, 1], {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }) *
    interpolate(frame, [1160, 1180], [1, 0], {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

  // Whole-Stage -8.5° Kinetic Gravity Tilt during Beat 4B (918f - 1174f: COD & Rp1,000 Garansi Rush)
  const tiltIn = interpolate(frame, [916, 940], [0, 1], {
    easing: Easing.out(Easing.back(1.4)),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const tiltOut = interpolate(frame, [1160, 1182], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const tiltWeight = Math.max(0, tiltIn - tiltOut);
  const gravityTiltDeg = -8.5 * tiltWeight;

  // Whip-Pan Impulses at Beat Transitions (224f, 465f, 758f, 918f, 1174f)
  const whipFrames = [224, 465, 758, 918, 1174];
  let whipOffsetX = 0;
  let whipScaleBoost = 0;
  for (const wf of whipFrames) {
    if (Math.abs(frame - wf) <= 8) {
      const dist = (frame - wf) / 8;
      whipOffsetX += Math.sin(dist * Math.PI) * 52;
      whipScaleBoost = Math.max(whipScaleBoost, (1 - Math.abs(dist)) * 0.16);
    }
  }

  const driftX =
    Math.sin(frame * 0.055) * 16 +
    whipOffsetX -
    coolerFocusWeight * 18 -
    gojekFocusWeight * 24;
  const driftY =
    Math.cos(frame * 0.045) * 12 -
    coolerFocusWeight * 22 -
    gojekFocusWeight * 16;

  const totalScale =
    openingZoom +
    coolerFocusWeight * 0.11 +
    gojekFocusWeight * 0.12 +
    tiltWeight * 0.24 +
    whipScaleBoost +
    Math.sin(frame * 0.04) * 0.015;

  // --------------------------------------------------------------------------
  // 3. PARTICLE STREAM MODE
  // --------------------------------------------------------------------------
  const particleMode: 'choco' | 'matcha' | 'frost' =
    frame < 224
      ? 'matcha'
      : frame < 465
      ? 'choco'
      : 'frost';

  return (
    <AbsoluteFill style={{ backgroundColor: '#070A0F', overflow: 'hidden' }}>
      {/* ================================================================== */}
      {/* AUDIO ENGINE: VOICEOVER + DUCKED BGM + 8-BIT CHIPTUNE SFX          */}
      {/* ================================================================== */}
      <Audio src={staticFile('assets/reel_new_13_saturday_cod_loop.mp3')} volume={1.0} />
      <Audio
        src={staticFile('assets/bg_music.mp3')}
        volume={(f) =>
          interpolate(f, [0, 30, 1280, REEL_13_DURATION], [0.05, 0.09, 0.09, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
        }
      />

      {/* Beat 1 Opening Crash Zoom + Friday 18:00 Cutoff Alert */}
      <Sequence from={0} durationInFrames={35}>
        <Audio src={staticFile('assets/sfx/impact.mp3')} volume={0.45} />
      </Sequence>
      <Sequence from={6} durationInFrames={40}>
        <Audio src={staticFile('assets/sfx/eightbit_1star_buzz.wav')} volume={0.42} />
      </Sequence>

      {/* Beat 2 Whip-Pan + Bundle Pops */}
      <Sequence from={220} durationInFrames={25}>
        <Audio src={staticFile('assets/sfx/whoosh.mp3')} volume={0.48} />
      </Sequence>
      <Sequence from={222} durationInFrames={35}>
        <Audio src={staticFile('assets/sfx/eightbit_clock_spin.wav')} volume={0.45} />
      </Sequence>
      {[296, 315, 366, 385].map((popFrame, idx) => (
        <Sequence key={`b2-pop-${idx}`} from={popFrame} durationInFrames={15}>
          <Audio src={staticFile('assets/sfx/eightbit_pop.wav')} volume={0.5} />
        </Sequence>
      ))}

      {/* Beat 3 Whip-Pan + Foil Cooler Bag Shimmer + Flap Lock Snap */}
      <Sequence from={461} durationInFrames={25}>
        <Audio src={staticFile('assets/sfx/whoosh.mp3')} volume={0.48} />
      </Sequence>
      <Sequence from={465} durationInFrames={55}>
        <Audio src={staticFile('assets/sfx/eightbit_portal_shimmer.wav')} volume={0.48} />
      </Sequence>
      <Sequence from={622} durationInFrames={20}>
        <Audio src={staticFile('assets/sfx/snap.mp3')} volume={0.55} />
      </Sequence>
      <Sequence from={625} durationInFrames={20}>
        <Audio src={staticFile('assets/sfx/eightbit_pop.wav')} volume={0.5} />
      </Sequence>

      {/* Beat 4A & 4B Whip-Pan + -8.5° Gravity Tilt + COD Garansi Chime */}
      <Sequence from={754} durationInFrames={25}>
        <Audio src={staticFile('assets/sfx/whoosh.mp3')} volume={0.48} />
      </Sequence>
      <Sequence from={758} durationInFrames={35}>
        <Audio src={staticFile('assets/sfx/eightbit_clock_spin.wav')} volume={0.45} />
      </Sequence>
      <Sequence from={915} durationInFrames={25}>
        <Audio src={staticFile('assets/sfx/impact.mp3')} volume={0.45} />
      </Sequence>
      <Sequence from={918} durationInFrames={35}>
        <Audio src={staticFile('assets/sfx/eightbit_pop.wav')} volume={0.52} />
      </Sequence>
      <Sequence from={1070} durationInFrames={25}>
        <Audio src={staticFile('assets/sfx/eightbit_pop.wav')} volume={0.52} />
      </Sequence>

      {/* Beat 5 5-Star Fanfare + Final Cutoff CTA */}
      <Sequence from={1170} durationInFrames={25}>
        <Audio src={staticFile('assets/sfx/whoosh.mp3')} volume={0.48} />
      </Sequence>
      <Sequence from={1174} durationInFrames={70}>
        <Audio src={staticFile('assets/sfx/eightbit_5star_fanfare.wav')} volume={0.62} />
      </Sequence>

      {/* ================================================================== */}
      {/* FULL-BLEED ANIMATED PIXEL-ART WORLD STAGE                          */}
      {/* ================================================================== */}
      <AbsoluteFill
        style={{
          transform: `translate(${driftX}px, ${driftY}px) scale(${totalScale}) rotate(${gravityTiltDeg}deg)`,
          transformOrigin: 'center center',
        }}
      >
        <Img
          src={staticFile(currentPlate)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'contrast(1.06) saturate(1.08)',
          }}
        />

        {/* Subtle Vignette for HUD & Caption Readability */}
        <AbsoluteFill
          style={{
            background:
              'linear-gradient(180deg, rgba(5,8,12,0.52) 0%, rgba(5,8,12,0.06) 26%, rgba(5,8,12,0.12) 66%, rgba(5,8,12,0.68) 100%)',
            pointerEvents: 'none',
          }}
        />
      </AbsoluteFill>

      {/* ================================================================== */}
      {/* PROCEDURAL PIXEL PARTICLE STREAM                                   */}
      {/* ================================================================== */}
      <SceneParticleStream frame={frame} mode={particleMode} opacity={0.82} />

      {/* ================================================================== */}
      {/* FLOATING 8-BIT POCKET WATCH HUD (FRIDAY 18:00 CUTOFF & SAT COD)    */}
      {/* ================================================================== */}
      <FloatingCutoffClockHUD frame={frame} gravityTiltDeg={gravityTiltDeg} />

      {/* ================================================================== */}
      {/* BEAT-SPECIFIC INTERACTIVE CARDS & COOLER BAG SOP BADGES            */}
      {/* ================================================================== */}
      <Step1VaultBundlesOverlay frame={frame} fps={fps} />
      <Step2CoolerBagBadges frame={frame} fps={fps} />
      <Step3GojekCodBadges frame={frame} fps={fps} />
      <Beat5HeroCoolerCta frame={frame} fps={fps} />

      {/* ================================================================== */}
      {/* TOP FLOATING LIRA GLASSMORPHIC STATUS CARD                         */}
      {/* ================================================================== */}
      <TopLiraGlassCard frame={frame} fps={fps} />

      {/* ================================================================== */}
      {/* SIGNATURE EYE-LEVEL BORDERLESS TIKTOK CAPTION (58% DOWN-CENTER)    */}
      {/* ================================================================== */}
      <TikTokCaption
        currentFrame={frame}
        chunks={captionsData.map((c) => ({
          from: c.startFrame,
          to: c.endFrame,
          text: c.text,
          highlight: c.highlight,
        }))}
        topPercentage={58}
      />
    </AbsoluteFill>
  );
};
