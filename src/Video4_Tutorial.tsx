import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img,
  Audio,
  staticFile,
} from 'remotion';
import { FONT_STYLE, FONT_PIXEL, FONT_SANS } from './fonts';

// ============================================================================
// VIDEO 4 — LIRA SATURDAY LOOP: ORDER & DELIVERY TUTORIAL REEL
// Duration: 1084 frames @ 30fps = 36.13s (Synced to voiceover_tutorial.mp3)
// Canvas: 1080 x 1440 (Standard 4:5 vertical feed ratio)
//
// Adheres strictly to ~/.gemini/config/rules/lira-video-system.md:
// - NO black letterbox bars, edge-to-edge full bleed
// - NO HUD scene blocks ("Scene 1/6", "Lira Labs origin story")
// - Real bottles: clean background cutouts only, zero sticker edits
// - Dynamic eye-tracking captions: borderless, font switching (SF Pro + Silkscreen), popping colors
// - Calm animation pacing (subtle breathing, deliberate pose switches at narrative beats)
// - User privacy standard: C--- / @cxxx
// ============================================================================

export const TUTORIAL_DURATION = 1084;
const FPS = 30;
const sec = (s: number) => Math.round(s * FPS);

// High-Vibrancy Palette
const GOLD = '#FFE566';
const EMERALD = '#39FF88';
const CRIMSON = '#FF2E63';
const CYAN = '#00F0FF';
const IVORY = '#FFFFFF';
const ACTIVE = '#FFF566';

// ----------------------------------------------------------------------------
// DYNAMIC CAPTION DATA (Word-for-word audio sync with speech boundaries)
// ----------------------------------------------------------------------------
type Hl = 'gold' | 'emerald' | 'crimson' | 'cyan' | 'ivory';
type LineSize = 'big' | 'medium' | 'small';

interface CaptionLine {
  text: string;
  start: number; // seconds
  end: number;   // seconds
  size: LineSize;
}

interface DynamicCaptionCard {
  id: string;
  from: number;  // seconds
  to: number;    // seconds
  position: {
    top?: number | string;
    bottom?: number | string;
    left?: number | string;
    right?: number | string;
    width?: number | string;
    align?: 'center' | 'left' | 'right';
  };
  badge?: {
    text: string;
    color: string;
    border: string;
    bg: string;
  };
  glowColor?: string;
  lines: CaptionLine[];
}

const DYNAMIC_CARDS: DynamicCaptionCard[] = [
  // 1. Hook A (0.00s - 3.20s) - Clean wooden desk placement
  {
    id: 's1-hook-a',
    from: 0.0,
    to: 3.25,
    position: {
      top: 1120,
      left: '50%',
      width: 960,
      align: 'center',
    },
    badge: {
      text: 'LIRA SATURDAY LOOP // BATCH GUIDE',
      color: GOLD,
      border: `${GOLD}75`,
      bg: 'rgba(255, 229, 102, 0.16)',
    },
    glowColor: `${GOLD}35`,
    lines: [
      { text: 'Biar lo nggak ^bingung,', start: 0.05, end: 1.40, size: 'big' },
      { text: 'dan nggak kehabisan ~kuota ~batch ~Sabtu ~ini...', start: 1.45, end: 3.10, size: 'medium' },
    ],
  },
  // 2. Hook B (3.30s - 7.15s) - Clean wooden desk placement
  {
    id: 's1-hook-b',
    from: 3.30,
    to: 7.15,
    position: {
      top: 1100,
      left: '50%',
      width: 960,
      align: 'center',
    },
    badge: {
      text: '30-SECOND LOCK-IN PROTOCOL',
      color: CYAN,
      border: `${CYAN}80`,
      bg: 'rgba(0, 240, 255, 0.16)',
    },
    glowColor: `${CYAN}40`,
    lines: [
      { text: 'ini cara ^paling ^gampang', start: 3.35, end: 4.85, size: 'big' },
      { text: 'buat ngunci ~botol ~Lira ~lo', start: 4.90, end: 6.10, size: 'medium' },
      { text: 'dalam ^30 ^DETIK!', start: 6.15, end: 7.10, size: 'big' },
    ],
  },
  // 3. Step 1: Open Instagram & Click Bio Link (7.20s - 10.95s)
  {
    id: 's1-step1',
    from: 7.20,
    to: 10.95,
    position: {
      top: 1100,
      left: '50%',
      width: 960,
      align: 'center',
    },
    badge: {
      text: 'STEP 01 // INSTAGRAM BIO',
      color: EMERALD,
      border: `${EMERALD}80`,
      bg: 'rgba(57, 255, 136, 0.16)',
    },
    glowColor: `${EMERALD}40`,
    lines: [
      { text: '^Pertama, buka profil ^Instagram kita', start: 7.25, end: 9.10, size: 'big' },
      { text: 'dan klik ~link ~di ~bio!', start: 9.15, end: 10.85, size: 'big' },
    ],
  },
  // 4. Step 2: Choose Your Vault / Pack Selection (11.00s - 16.20s) - Framed below form
  {
    id: 's2-step2',
    from: 11.00,
    to: 16.20,
    position: {
      top: 920,
      left: '50%',
      width: 980,
      align: 'center',
    },
    badge: {
      text: 'STEP 02 // PILIH PAKET VAULT',
      color: GOLD,
      border: `${GOLD}80`,
      bg: 'rgba(255, 229, 102, 0.16)',
    },
    glowColor: `${GOLD}35`,
    lines: [
      { text: '^Kedua, pilih paket lo.', start: 11.05, end: 12.60, size: 'medium' },
      { text: 'Mau coba ~4-PACK ~VAULT,', start: 12.65, end: 14.10, size: 'big' },
      { text: 'atau ~Full ~Chiller ~6-PACK yang ^lebih ^hemat?', start: 14.15, end: 16.10, size: 'medium' },
    ],
  },
  // 5. Step 3: Fast Auto-Fill Form & COD (16.25s - 22.30s) - Framed below form
  {
    id: 's3-step3',
    from: 16.25,
    to: 22.30,
    position: {
      top: 920,
      left: '50%',
      width: 980,
      align: 'center',
    },
    badge: {
      text: 'STEP 03 // AUTO-FILL 15 DETIK',
      color: CYAN,
      border: `${CYAN}80`,
      bg: 'rgba(0, 240, 255, 0.16)',
    },
    glowColor: `${CYAN}35`,
    lines: [
      { text: '^Ketiga, isi nama & alamat pengiriman lo', start: 16.35, end: 18.70, size: 'medium' },
      { text: 'di ~Tangerang atau ~Jakarta,', start: 18.75, end: 20.30, size: 'big' },
      { text: 'dan pilih ~varian ~rasa ~favorit ~lo!', start: 20.35, end: 22.20, size: 'medium' },
    ],
  },
  // 6. Step 4 Part 1: Chill at Home on Saturday (22.35s - 26.00s) - On clean driveway asphalt
  {
    id: 's4-chill',
    from: 22.35,
    to: 26.00,
    position: {
      top: 1140,
      left: '50%',
      width: 960,
      align: 'center',
    },
    badge: {
      text: 'STEP 04 // SABTU SANTAI',
      color: EMERALD,
      border: `${EMERALD}80`,
      bg: 'rgba(57, 255, 136, 0.16)',
    },
    glowColor: `${EMERALD}35`,
    lines: [
      { text: '^Terakhir, tinggal ^duduk ^santai', start: 22.45, end: 24.10, size: 'big' },
      { text: 'di rumah pas ~hari ~Sabtu.', start: 24.15, end: 25.85, size: 'big' },
    ],
  },
  // 7. Step 4 Part 2: Gojek Delivery to Gate & COD (26.05s - 32.80s) - On clean driveway asphalt
  {
    id: 's4-delivery',
    from: 26.05,
    to: 32.80,
    position: {
      top: 1120,
      left: '50%',
      width: 960,
      align: 'center',
    },
    badge: {
      text: 'GOSEND INSTANT // COLD CHAIN DELIVERY',
      color: EMERALD,
      border: `${EMERALD}85`,
      bg: 'rgba(57, 255, 136, 0.20)',
    },
    glowColor: `${EMERALD}45`,
    lines: [
      { text: 'Abang ^Gojek bakal anterin ^paket ^dingin lo', start: 26.15, end: 28.70, size: 'big' },
      { text: 'langsung ke ~depan ~pintu,', start: 28.75, end: 30.10, size: 'big' },
      { text: 'dan lo bisa bayar ~Cash ~on ~Delivery di tempat!', start: 30.15, end: 32.65, size: 'medium' },
    ],
  },
  // 8. Outro CTA (32.85s - 36.13s) - Center chest level
  {
    id: 's5-outro',
    from: 32.85,
    to: 36.13,
    position: {
      top: 680,
      left: '50%',
      width: 960,
      align: 'center',
    },
    badge: {
      text: 'BATCH SABTU // LIMITED SLOTS',
      color: GOLD,
      border: `${GOLD}90`,
      bg: 'rgba(255, 229, 102, 0.22)',
    },
    glowColor: `${GOLD}45`,
    lines: [
      { text: '^Simpel ^banget, kan?', start: 32.95, end: 34.05, size: 'big' },
      { text: '~Kunci ~slot ~lo ~sekarang,', start: 34.10, end: 35.05, size: 'big' },
      { text: '^CLICK ^LINK ^IN ^BIO ^RIGHT ^NOW!', start: 35.10, end: 36.10, size: 'big' },
    ],
  },
];

// ----------------------------------------------------------------------------
// CAPTION PARSING UTILITIES
// Prefix symbols:
//   ^ = Gold Accent
//   ~ = Emerald Accent
//   ! = Crimson Accent
//   * = Cyan Accent
// ----------------------------------------------------------------------------
interface ParsedWord {
  text: string;
  hl: Hl;
  from: number; // frame
  to: number;   // frame
}

const COLOR: Record<Hl, string> = {
  gold: GOLD,
  emerald: EMERALD,
  crimson: CRIMSON,
  cyan: CYAN,
  ivory: IVORY,
};

function parseWordToken(token: string): { word: string; hl: Hl } {
  if (token.startsWith('^')) return { word: token.slice(1), hl: 'gold' };
  if (token.startsWith('~')) return { word: token.slice(1), hl: 'emerald' };
  if (token.startsWith('!')) return { word: token.slice(1), hl: 'crimson' };
  if (token.startsWith('*')) return { word: token.slice(1), hl: 'cyan' };
  return { word: token, hl: 'ivory' };
}

function timeLine(line: CaptionLine): ParsedWord[] {
  const tokens = line.text.split(/\s+/).filter(Boolean);
  const startF = sec(line.start);
  const endF = sec(line.end);
  const total = tokens.length;
  const dur = Math.max(1, endF - startF);
  const step = dur / total;

  return tokens.map((tok, i) => {
    const { word, hl } = parseWordToken(tok);
    return {
      text: word,
      hl,
      from: Math.round(startF + i * step),
      to: Math.round(startF + (i + 1) * step),
    };
  });
}

// ----------------------------------------------------------------------------
// SCENE 1 PHONE OVERLAY: RETRO PIXEL INSTAGRAM UI & CLICK
// ----------------------------------------------------------------------------
const PhoneScreenModal: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  // Active during frames 215 to 330 (7.15s to 11.00s)
  const age = frame - 215;
  if (age < 0 || frame >= 330) return null;

  const cardPop = spring({
    frame: age,
    fps,
    config: { damping: 15, stiffness: 160 },
  });

  // Cursor movement: slides in at frame 235, reaches bio link at frame 270, clicks at frame 275
  const cursorProgress = interpolate(frame, [235, 272], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cursorX = interpolate(cursorProgress, [0, 1], [600, 520]);
  const cursorY = interpolate(cursorProgress, [0, 1], [360, 245]);

  // Click pulse & click state
  const isClicked = frame >= 275;
  const clickAge = frame - 275;
  const clickPulse = isClicked
    ? interpolate(clickAge, [0, 6, 15], [1.0, 0.94, 1.0], { extrapolateRight: 'clamp' })
    : 1.0;
  const ringScale = isClicked
    ? interpolate(clickAge, [0, 20], [0.8, 2.2], { extrapolateRight: 'clamp' })
    : 0;
  const ringOpacity = isClicked
    ? interpolate(clickAge, [0, 20], [1, 0], { extrapolateRight: 'clamp' })
    : 0;

  return (
    <div
      style={{
        position: 'absolute',
        top: 140,
        left: '50%',
        width: 680,
        transform: `translateX(-50%) scale(${cardPop})`,
        zIndex: 55,
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(10, 14, 12, 0.96)',
          backdropFilter: 'blur(20px)',
          borderRadius: 28,
          border: `2px solid ${EMERALD}90`,
          boxShadow: `0 30px 80px rgba(0,0,0,0.95), 0 0 50px ${EMERALD}30`,
          padding: '24px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Instagram Profile Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: '50%',
              padding: 3,
              background: `linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                overflow: 'hidden',
                backgroundColor: '#FAF7F0',
              }}
            >
              <Img
                src={staticFile('assets/lira_logo.jpg')}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: IVORY, fontSize: 26, fontWeight: 900, fontFamily: FONT_SANS }}>
                drinklira
              </span>
              <span style={{ color: EMERALD, fontSize: 18 }}>●</span>
            </div>
            <div style={{ display: 'flex', gap: 14, fontSize: 16, color: 'rgba(255,255,255,0.7)', fontFamily: FONT_SANS }}>
              <span><b>8</b> posts</span>
              <span><b>77</b> followers</span>
              <span><b>1</b> following</span>
            </div>
          </div>
        </div>

        {/* Bio Copy */}
        <div style={{ color: 'rgba(255,255,255,0.88)', fontSize: 17, lineHeight: 1.4, fontFamily: FONT_SANS }}>
          <div><b>Lira</b></div>
          <div>Weekend Pre-Order available</div>
          <div style={{ color: 'rgba(255,255,255,0.6)' }}>Built solo by @caleb766h1</div>
          <div style={{ color: GOLD, fontWeight: 700, marginTop: 4 }}>ORDER LIRA LINK IN BIO</div>
        </div>

        {/* Bio Link Row (The exact target to click) */}
        <div
          style={{
            position: 'relative',
            backgroundColor: isClicked ? 'rgba(57, 255, 136, 0.28)' : 'rgba(57, 255, 136, 0.14)',
            border: `2px solid ${isClicked ? EMERALD : `${EMERALD}80`}`,
            borderRadius: 14,
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transform: `scale(${clickPulse})`,
            boxShadow: isClicked ? `0 0 30px ${EMERALD}60` : 'none',
            transition: 'background-color 0.15s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                color: isClicked ? ACTIVE : EMERALD,
                fontSize: 22,
                fontWeight: 900,
                fontFamily: FONT_PIXEL,
                letterSpacing: 1,
              }}
            >
              bit.ly/DrinkLira
            </span>
          </div>

          <div
            style={{
              backgroundColor: isClicked ? EMERALD : `${EMERALD}30`,
              color: isClicked ? '#060606' : EMERALD,
              borderRadius: 8,
              padding: '6px 14px',
              fontSize: 14,
              fontWeight: 800,
              fontFamily: FONT_PIXEL,
            }}
          >
            {isClicked ? 'OPENING...' : 'CLICK LINK'}
          </div>

          {/* Ripple Click Effect */}
          {isClicked && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '60%',
                width: 60,
                height: 60,
                borderRadius: '50%',
                border: `3px solid ${EMERALD}`,
                transform: `translate(-50%, -50%) scale(${ringScale})`,
                opacity: ringOpacity,
                pointerEvents: 'none',
              }}
            />
          )}
        </div>
      </div>

      {/* Pixel Hand Cursor Animation */}
      <div
        style={{
          position: 'absolute',
          top: cursorY,
          left: cursorX,
          pointerEvents: 'none',
          zIndex: 70,
          transform: `scale(${isClicked ? 0.9 : 1.0})`,
          filter: `drop-shadow(0 6px 14px rgba(0,0,0,0.8))`,
        }}
      >
        <span style={{ fontSize: 24, color: '#FFFFFF', fontWeight: 900 }}>[SELECT]</span>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// SCENE 2 PACK SELECTION CARD: 4-PACK VAULT & 6-PACK CHILLER
// Showing 2 Choco + 2 Matcha bottles side-by-side as requested!
// ----------------------------------------------------------------------------
const PackSelectionCard: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  // Active during frames 330 to 486 (11.00s to 16.20s)
  const age = frame - 330;
  if (age < 0 || frame >= 486) return null;

  const cardSpring = spring({
    frame: age,
    fps,
    config: { damping: 15, stiffness: 150 },
  });

  // Checkbox auto-checks at frame 380 (approx 12.67s when voiceover mentions 4-Pack Vault)
  const isChecked4Pack = frame >= 375;
  const checkAge = frame - 375;
  const checkPop = isChecked4Pack
    ? spring({ frame: checkAge, fps, config: { damping: 12, stiffness: 200 } })
    : 1.0;

  return (
    <div
      style={{
        position: 'absolute',
        top: 130,
        left: '50%',
        width: 960,
        transform: `translateX(-50%) scale(${cardSpring})`,
        zIndex: 55,
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(10, 14, 12, 0.96)',
          backdropFilter: 'blur(24px)',
          borderRadius: 28,
          border: `2px solid ${GOLD}80`,
          boxShadow: `0 32px 85px rgba(0,0,0,0.92), 0 0 55px ${GOLD}25`,
          padding: '24px 30px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {/* Form Title Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `1px solid ${GOLD}30`,
            paddingBottom: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                overflow: 'hidden',
                backgroundColor: '#FAF7F0',
                border: `1.5px solid ${GOLD}`,
              }}
            >
              <Img
                src={staticFile('assets/lira_logo.jpg')}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <div style={{ color: IVORY, fontSize: 24, fontWeight: 900, fontFamily: FONT_PIXEL }}>
                LIRA SATURDAY LOOP
              </div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, fontFamily: FONT_SANS }}>
                Batch Pre-Order Form • Tally.so
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(255, 229, 102, 0.16)',
              border: `1px solid ${GOLD}70`,
              borderRadius: 8,
              padding: '6px 14px',
              color: GOLD,
              fontSize: 15,
              fontWeight: 800,
              fontFamily: FONT_PIXEL,
            }}
          >
            SELECT PACK ●
          </div>
        </div>

        {/* 4-PACK VAULT OPTION (Selected & Highlighted) */}
        <div
          style={{
            backgroundColor: isChecked4Pack ? 'rgba(57, 255, 136, 0.12)' : 'rgba(255, 255, 255, 0.04)',
            border: isChecked4Pack ? `2px solid ${EMERALD}` : '1.5px solid rgba(255, 255, 255, 0.10)',
            borderRadius: 20,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: isChecked4Pack ? `0 10px 30px ${EMERALD}25` : 'none',
            transform: `scale(${isChecked4Pack ? checkPop : 1.0})`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Checkbox */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                backgroundColor: isChecked4Pack ? EMERALD : 'transparent',
                border: `2px solid ${isChecked4Pack ? EMERALD : 'rgba(255,255,255,0.4)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#060606',
                fontSize: 22,
                fontWeight: 900,
                boxShadow: isChecked4Pack ? `0 0 16px ${EMERALD}` : 'none',
              }}
            >
              {isChecked4Pack ? '✓' : ''}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: IVORY, fontSize: 24, fontWeight: 900, fontFamily: FONT_PIXEL }}>
                  4-PACK VAULT
                </span>
                <span
                  style={{
                    backgroundColor: `${EMERALD}25`,
                    color: EMERALD,
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontSize: 13,
                    fontWeight: 800,
                    fontFamily: FONT_PIXEL,
                  }}
                >
                  SAVE 4K
                </span>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, fontFamily: FONT_SANS }}>
                2 Choco Hazelnut + 2 Matcha Oatside
              </div>
              <div style={{ color: GOLD, fontSize: 22, fontWeight: 900, fontFamily: FONT_PIXEL }}>
                Rp88.000
              </div>
            </div>
          </div>

          {/* Real Bottle Lineup: 2 Choco + 2 Matcha (clean transparent cutouts) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 120 }}>
            <Img
              src={staticFile('assets/choco.png')}
              style={{ height: 110, objectFit: 'contain', filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.6))' }}
            />
            <Img
              src={staticFile('assets/choco.png')}
              style={{ height: 110, objectFit: 'contain', filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.6))' }}
            />
            <Img
              src={staticFile('assets/matcha.png')}
              style={{ height: 110, objectFit: 'contain', filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.6))' }}
            />
            <Img
              src={staticFile('assets/matcha.png')}
              style={{ height: 110, objectFit: 'contain', filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.6))' }}
            />
          </div>
        </div>

        {/* 6-PACK FULL CHILLER OPTION */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1.5px solid rgba(255, 255, 255, 0.10)',
            borderRadius: 20,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                border: '2px solid rgba(255,255,255,0.3)',
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: IVORY, fontSize: 24, fontWeight: 900, fontFamily: FONT_PIXEL }}>
                  FULL CHILLER 6-PACK
                </span>
                <span
                  style={{
                    backgroundColor: `${GOLD}25`,
                    color: GOLD,
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontSize: 13,
                    fontWeight: 800,
                    fontFamily: FONT_PIXEL,
                  }}
                >
                  SAVE 7K
                </span>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, fontFamily: FONT_SANS }}>
                2 Choco + 2 Matcha + 2 Milk Tea
              </div>
              <div style={{ color: GOLD, fontSize: 22, fontWeight: 900, fontFamily: FONT_PIXEL }}>
                Rp115.000
              </div>
            </div>
          </div>

          {/* 6 Bottles Mini Preview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 100 }}>
            <Img src={staticFile('assets/choco.png')} style={{ height: 90, objectFit: 'contain' }} />
            <Img src={staticFile('assets/matcha.png')} style={{ height: 90, objectFit: 'contain' }} />
            <Img src={staticFile('assets/milktea.png')} style={{ height: 90, objectFit: 'contain' }} />
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, fontFamily: FONT_PIXEL }}>+3</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// SCENE 3 AUTO-FILL FORM CARD: 15-SECOND QUICK FORM + COD BADGE
// Auto-types: C--- / @cxxx, Delivery Address, Variant, and COD Payment
// ----------------------------------------------------------------------------
const AutoFillFormCard: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  // Active during frames 486 to 669 (16.20s to 22.30s)
  const age = frame - 486;
  if (age < 0 || frame >= 669) return null;

  const cardSpring = spring({
    frame: age,
    fps,
    config: { damping: 15, stiffness: 150 },
  });

  // Typewriter progressions
  // Name types from age 5 to 35
  const fullTextName = 'C---  •  @cxxx';
  const nameChars = Math.min(fullTextName.length, Math.floor(interpolate(age, [5, 30], [0, fullTextName.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })));
  const typedName = fullTextName.slice(0, nameChars);

  // Address types from age 35 to 70
  const fullTextAddr = 'Gading Serpong, Tangerang / Jakarta Barat';
  const addrChars = Math.min(fullTextAddr.length, Math.floor(interpolate(age, [35, 65], [0, fullTextAddr.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })));
  const typedAddr = fullTextAddr.slice(0, addrChars);

  // Variant types from age 70 to 105
  const fullTextVariant = '2x Matcha Latte Oatside + 2x Choco Hazelnut';
  const variantChars = Math.min(fullTextVariant.length, Math.floor(interpolate(age, [70, 100], [0, fullTextVariant.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })));
  const typedVariant = fullTextVariant.slice(0, variantChars);

  // COD Toggle activates at age 105 (around frame 590 / 19.67s)
  const isCodActive = age >= 105;
  const codAge = age - 105;
  const codPop = isCodActive
    ? spring({ frame: codAge, fps, config: { damping: 12, stiffness: 220 } })
    : 1.0;

  return (
    <div
      style={{
        position: 'absolute',
        top: 130,
        left: '50%',
        width: 960,
        transform: `translateX(-50%) scale(${cardSpring})`,
        zIndex: 55,
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(10, 14, 12, 0.96)',
          backdropFilter: 'blur(24px)',
          borderRadius: 28,
          border: `2px solid ${CYAN}80`,
          boxShadow: `0 32px 85px rgba(0,0,0,0.92), 0 0 55px ${CYAN}25`,
          padding: '24px 30px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `1px solid ${CYAN}30`,
            paddingBottom: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: IVORY, fontSize: 22, fontWeight: 900, fontFamily: FONT_PIXEL }}>
              AUTO-FILL ORDER PROTOCOL
            </span>
          </div>
          <span
            style={{
              backgroundColor: `${CYAN}20`,
              color: CYAN,
              border: `1px solid ${CYAN}70`,
              borderRadius: 6,
              padding: '4px 12px',
              fontSize: 14,
              fontWeight: 800,
              fontFamily: FONT_PIXEL,
            }}
          >
            15 SECONDS ●
          </span>
        </div>

        {/* Field 1: Name & IG Handle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, fontFamily: FONT_SANS, fontWeight: 700 }}>
            Full Name & IG Handle *
          </span>
          <div
            style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: `1.5px solid ${nameChars > 0 ? EMERALD : 'rgba(255,255,255,0.15)'}`,
              borderRadius: 12,
              padding: '12px 18px',
              color: IVORY,
              fontSize: 20,
              fontWeight: 800,
              fontFamily: FONT_PIXEL,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>{typedName}{nameChars > 0 && nameChars < fullTextName.length ? '❚' : ''}</span>
            {nameChars === fullTextName.length && <span style={{ color: EMERALD }}>✓</span>}
          </div>
        </div>

        {/* Field 2: Delivery Address (Tangerang / Jakarta via GoSend) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, fontFamily: FONT_SANS, fontWeight: 700 }}>
            Exact Delivery Address (For GoSend) *
          </span>
          <div
            style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: `1.5px solid ${addrChars > 0 ? EMERALD : 'rgba(255,255,255,0.15)'}`,
              borderRadius: 12,
              padding: '12px 18px',
              color: IVORY,
              fontSize: 18,
              fontWeight: 700,
              fontFamily: FONT_SANS,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>{typedAddr}{addrChars > 0 && addrChars < fullTextAddr.length ? '❚' : ''}</span>
            {addrChars === fullTextAddr.length && <span style={{ color: EMERALD }}>✓</span>}
          </div>
        </div>

        {/* Field 3: Favorite Variants */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, fontFamily: FONT_SANS, fontWeight: 700 }}>
            Selected Variants *
          </span>
          <div
            style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: `1.5px solid ${variantChars > 0 ? EMERALD : 'rgba(255,255,255,0.15)'}`,
              borderRadius: 12,
              padding: '12px 18px',
              color: GOLD,
              fontSize: 18,
              fontWeight: 800,
              fontFamily: FONT_PIXEL,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>{typedVariant}{variantChars > 0 && variantChars < fullTextVariant.length ? '❚' : ''}</span>
            {variantChars === fullTextVariant.length && <span style={{ color: EMERALD }}>✓</span>}
          </div>
        </div>

        {/* Field 4: Cash On Delivery (COD) Badge */}
        <div
          style={{
            backgroundColor: isCodActive ? 'rgba(57, 255, 136, 0.20)' : 'rgba(255,255,255,0.05)',
            border: `2px solid ${isCodActive ? EMERALD : 'rgba(255,255,255,0.2)'}`,
            borderRadius: 16,
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transform: `scale(${isCodActive ? codPop : 1.0})`,
            boxShadow: isCodActive ? `0 0 25px ${EMERALD}40` : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ color: GOLD, fontSize: 16, fontWeight: 900 }}>[COD]</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: isCodActive ? ACTIVE : IVORY, fontSize: 18, fontWeight: 900, fontFamily: FONT_PIXEL }}>
                PAYMENT METHOD: CASH ON DELIVERY (COD)
              </span>
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, fontFamily: FONT_SANS }}>
                Bayar tunai di tempat saat kurir GoSend tiba
              </span>
            </div>
          </div>

          <div
            style={{
              backgroundColor: isCodActive ? EMERALD : 'rgba(255,255,255,0.2)',
              color: isCodActive ? '#060606' : 'rgba(255,255,255,0.6)',
              borderRadius: 8,
              padding: '6px 14px',
              fontSize: 14,
              fontWeight: 900,
              fontFamily: FONT_PIXEL,
            }}
          >
            {isCodActive ? '✓ ENABLED' : 'OPTIONAL'}
          </div>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// SCENE 4 FLOATING BADGES: GOSEND INSTANT & COD ACTIVE
// ----------------------------------------------------------------------------
const GojekDeliveryBadges: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  // Active during frames 669 to 984 (22.30s to 32.80s)
  const age = frame - 669;
  if (age < 0 || frame >= 984) return null;

  const badgePop = spring({
    frame: age,
    fps,
    config: { damping: 14, stiffness: 160 },
  });

  const pulse = Math.sin((age / 12) * Math.PI) * 0.03 + 1.0;

  return (
    <div
      style={{
        position: 'absolute',
        top: 140,
        left: '50%',
        width: 960,
        transform: `translateX(-50%) scale(${badgePop})`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 55,
      }}
    >
      {/* Badge 1: GoSend Instant */}
      <div
        style={{
          backgroundColor: 'rgba(10, 14, 12, 0.92)',
          backdropFilter: 'blur(20px)',
          border: `2px solid ${EMERALD}`,
          borderRadius: 16,
          padding: '12px 22px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          boxShadow: `0 12px 30px rgba(0,0,0,0.8), 0 0 25px ${EMERALD}30`,
        }}
      >
        <span style={{ color: EMERALD, fontSize: 16, fontWeight: 900 }}>[INSTANT]</span>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: EMERALD, fontSize: 18, fontWeight: 900, fontFamily: FONT_PIXEL }}>
            GOSEND INSTANT
          </span>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontFamily: FONT_SANS }}>
            Delivered Cold Every Saturday
          </span>
        </div>
      </div>

      {/* Badge 2: COD Active */}
      <div
        style={{
          backgroundColor: 'rgba(10, 14, 12, 0.92)',
          backdropFilter: 'blur(20px)',
          border: `2px solid ${GOLD}`,
          borderRadius: 16,
          padding: '12px 22px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          transform: `scale(${pulse})`,
          boxShadow: `0 12px 30px rgba(0,0,0,0.8), 0 0 25px ${GOLD}30`,
        }}
      >
        <span style={{ color: GOLD, fontSize: 16, fontWeight: 900 }}>[COD]</span>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: GOLD, fontSize: 18, fontWeight: 900, fontFamily: FONT_PIXEL }}>
            COD AVAILABLE
          </span>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontFamily: FONT_SANS }}>
            Bayar Tunai di Pintu Rumah
          </span>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// SCENE 5 OUTRO CTA BUTTON OVERLAY
// ----------------------------------------------------------------------------
const OutroCtaOverlay: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  // Active during frames 984 to 1084 (32.80s to 36.13s)
  const age = frame - 984;
  if (age < 0) return null;

  const ctaSpring = spring({
    frame: age,
    fps,
    config: { damping: 14, stiffness: 160 },
  });
  const pulse = Math.sin((age / 10) * Math.PI) * 0.03 + 1.0;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 90,
        left: '50%',
        transform: `translateX(-50%) scale(${ctaSpring * pulse})`,
        width: 960,
        zIndex: 65,
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(12, 12, 11, 0.94)',
          backdropFilter: 'blur(24px)',
          borderRadius: 24,
          border: `2.5px solid ${GOLD}`,
          boxShadow: `0 32px 85px rgba(0,0,0,0.92), 0 0 55px ${GOLD}40, inset 0 1px 0 rgba(255,255,255,0.18)`,
          padding: '28px 36px',
          display: 'flex',
          alignItems: 'center',
          gap: 28,
        }}
      >
        <div
          style={{
            width: 116,
            height: 116,
            borderRadius: '50%',
            overflow: 'hidden',
            border: `3px solid ${GOLD}`,
            boxShadow: `0 8px 25px rgba(0,0,0,0.65), 0 0 24px ${GOLD}40`,
            backgroundColor: '#FAF7F0',
            flexShrink: 0,
          }}
        >
          <Img
            src={staticFile('assets/lira_logo.jpg')}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.08)' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
          <span
            style={{
              backgroundColor: `${GOLD}22`,
              color: GOLD,
              border: `1px solid ${GOLD}80`,
              borderRadius: 6,
              padding: '4px 14px',
              fontSize: 17,
              fontWeight: 800,
              fontFamily: FONT_PIXEL,
              letterSpacing: 2,
            }}
          >
            BATCH SABTU // KUOTA TERBATAS ●
          </span>
          <div
            style={{
              background: `linear-gradient(135deg, ${GOLD} 0%, #E0B445 100%)`,
              color: '#0A0A09',
              padding: '12px 24px',
              borderRadius: 8,
              fontSize: 28,
              fontWeight: 900,
              fontFamily: FONT_PIXEL,
              letterSpacing: 1.5,
              boxShadow: `0 8px 24px ${GOLD}50`,
            }}
          >
            CLICK LINK IN BIO RIGHT NOW
          </div>
          <div style={{ display: 'flex', gap: 14, fontSize: 20, fontWeight: 700, letterSpacing: 2 }}>
            <span style={{ color: EMERALD, fontWeight: 900, fontFamily: FONT_PIXEL }}>@DRINKLIRA</span>
            <span style={{ color: `${GOLD}80` }}>•</span>
            <span style={{ color: 'rgba(250,247,240,0.85)', fontFamily: FONT_SANS }}>bit.ly/DrinkLira</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// SCENE CONFIGURATION & ASSETS
// ----------------------------------------------------------------------------
interface SceneDef {
  id: number;
  from: number; // frame
  to: number;   // frame
  frameA: string;
  frameB: string;
  grade: string;
  lighting: string;
}

const SCENES: SceneDef[] = [
  // Scene 1: Hook & Bio Link (0 to 330 frames = 0.00s to 11.00s)
  {
    id: 1,
    from: 0,
    to: 330,
    frameA: 'assets/pixel/tutorial/s1_phone_a.jpg',
    frameB: 'assets/pixel/tutorial/s1_phone_b.jpg',
    grade: 'contrast(1.08) saturate(1.08) brightness(0.98)',
    lighting:
      'radial-gradient(circle at 30% 65%, rgba(57, 255, 136, 0.18) 0%, rgba(6, 10, 8, 0.40) 100%)',
  },
  // Scene 2 & 3: Order Form Selection & Auto-fill (330 to 669 frames = 11.00s to 22.30s)
  {
    id: 2,
    from: 330,
    to: 669,
    frameA: 'assets/pixel/insider_caleb_desk_a.jpg',
    frameB: 'assets/pixel/insider_caleb_desk_b.jpg',
    grade: 'contrast(1.10) saturate(1.05) brightness(0.95)',
    lighting:
      'radial-gradient(circle at 50% 40%, rgba(255, 229, 102, 0.12) 0%, rgba(6, 8, 12, 0.60) 100%)',
  },
  // Scene 4: Saturday Gojek Delivery to House Gate (669 to 984 frames = 22.30s to 32.80s)
  {
    id: 3,
    from: 669,
    to: 984,
    frameA: 'assets/pixel/tutorial/s4_gojek_a.jpg',
    frameB: 'assets/pixel/tutorial/s4_gojek_b.jpg',
    grade: 'contrast(1.06) saturate(1.08) brightness(0.98)',
    lighting:
      'linear-gradient(135deg, rgba(255, 240, 180, 0.15) 0%, rgba(57, 255, 136, 0.06) 50%, rgba(10, 12, 10, 0.30) 100%)',
  },
  // Scene 5: Outro Ritual Showcase & CTA (984 to 1084 frames = 32.80s to 36.13s)
  {
    id: 4,
    from: 984,
    to: 1084,
    frameA: 'assets/pixel/scene_7_ritual_a.jpg',
    frameB: 'assets/pixel/scene_7_ritual_a.jpg',
    grade: 'contrast(1.06) saturate(1.06) brightness(0.96)',
    lighting:
      'linear-gradient(135deg, rgba(255, 220, 145, 0.18) 0%, rgba(57, 255, 136, 0.06) 50%, rgba(10, 12, 10, 0.36) 100%)',
  },
];

// ----------------------------------------------------------------------------
// MAIN VIDEO COMPONENT
// ----------------------------------------------------------------------------
export const Video4_Tutorial: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Active scene
  const scene =
    SCENES.find((s) => frame >= s.from && frame < s.to) ?? SCENES[SCENES.length - 1];

  // Deliberate pose transitions (no rapid word-by-word twitching!)
  let isFrameB = false;
  if (scene.id === 1) {
    // 0 to 120f: Frame A (Caleb holding retro green phone, smiling)
    // 121 to 330f: Frame B (Caleb talks with energized open smile)
    isFrameB = frame >= 120;
  } else if (scene.id === 2) {
    // Form view: subtle background switch
    isFrameB = frame >= 486;
  } else if (scene.id === 3) {
    // 669 to 780f: Frame A (Gojek rider arrives holding cooler box)
    // 781 to 984f: Frame B (Gojek rider enthusiastically gives thumbs-up!)
    isFrameB = frame >= 780;
  } else if (scene.id === 4) {
    isFrameB = frame >= 1030;
  }

  const asset = isFrameB ? scene.frameB : scene.frameA;

  // Natural human breathing rhythm (3.3 seconds per breath, calm & cinematic)
  const breathe = Math.sin((frame / 50) * Math.PI) * 1.8;
  const driftX = Math.sin((frame / 120) * Math.PI) * 2;

  // Hook zoom on Scene 1
  const hookZoom = interpolate(frame, [0, 40], [1.05, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#060606', overflow: 'hidden' }}>
      {/* Offline Font Definition */}
      <style dangerouslySetInnerHTML={{ __html: FONT_STYLE }} />

      {/* ================= AUDIO CHANNELS ================= */}
      {/* 1. Voiceover (Master audio recorded by Caleb) */}
      <Audio
        src={staticFile('assets/voiceover_tutorial.mp3')}
        volume={1.0}
      />

      {/* 2. Ambient Lo-Fi Background Music (Ducked under speech) */}
      <Audio
        src={staticFile('assets/bg_music.mp3')}
        volume={0.16}
        loop
      />

      {/* 3. Sound Effects synchronized to key moments */}
      {/* Start Whoosh */}
      <Sequence from={1} durationInFrames={40}>
        <Audio src={staticFile('assets/sfx/whoosh.mp3')} volume={0.45} />
      </Sequence>
      {/* Click / Snap on Bio Link (frame 275) */}
      <Sequence from={275} durationInFrames={30}>
        <Audio src={staticFile('assets/sfx/snap.mp3')} volume={0.65} />
      </Sequence>
      {/* Sub hit on 4-pack vault card entrance (frame 330) */}
      <Sequence from={330} durationInFrames={40}>
        <Audio src={staticFile('assets/sfx/sub_hit.mp3')} volume={0.5} />
      </Sequence>
      {/* Snap on 4-pack checkbox check (frame 375) */}
      <Sequence from={375} durationInFrames={30}>
        <Audio src={staticFile('assets/sfx/snap.mp3')} volume={0.55} />
      </Sequence>
      {/* Shutter / auto-fill tick (frame 486) */}
      <Sequence from={486} durationInFrames={35}>
        <Audio src={staticFile('assets/sfx/shutter.mp3')} volume={0.4} />
      </Sequence>
      {/* Thud on Gojek arrival (frame 669) */}
      <Sequence from={669} durationInFrames={40}>
        <Audio src={staticFile('assets/sfx/thud.mp3')} volume={0.5} />
      </Sequence>
      {/* Final Outro Impact (frame 984) */}
      <Sequence from={984} durationInFrames={45}>
        <Audio src={staticFile('assets/sfx/impact.mp3')} volume={0.5} />
      </Sequence>

      {/* ================= VISUAL SCENE BACKGROUND ================= */}
      <AbsoluteFill
        style={{
          filter: scene.grade,
          transform: `scale(${hookZoom}) translate(${driftX}px, ${breathe}px)`,
          imageRendering: 'pixelated',
        }}
      >
        <Img
          src={staticFile(asset)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            imageRendering: 'pixelated',
          }}
        />

        {/* Cinematic Lighting Wash */}
        <AbsoluteFill
          style={{
            background: scene.lighting,
            mixBlendMode: 'screen',
            pointerEvents: 'none',
          }}
        />

        {/* Glowing green phone screen pulse in Scene 1 */}
        {scene.id === 1 && (
          <AbsoluteFill
            style={{
              background:
                'radial-gradient(circle at 28% 50%, rgba(57, 255, 136, 0.22) 0%, rgba(57, 255, 136, 0.05) 45%, rgba(0,0,0,0) 70%)',
              opacity: Math.sin((frame / 16) * Math.PI) * 0.12 + 0.88,
              mixBlendMode: 'screen',
              pointerEvents: 'none',
            }}
          />
        )}
      </AbsoluteFill>

      {/* ================= INTERACTIVE OVERLAYS ================= */}
      {/* Scene 1: Instagram Profile & Click on Bio Link */}
      <PhoneScreenModal frame={frame} />

      {/* Scene 2: 4-Pack Vault & 6-Pack Selection Card */}
      <PackSelectionCard frame={frame} />

      {/* Scene 3: Fast Auto-Fill Form & COD */}
      <AutoFillFormCard frame={frame} />

      {/* Scene 4: Saturday Gojek Delivery Badges */}
      <GojekDeliveryBadges frame={frame} />

      {/* Scene 5: Outro Call-To-Action Button */}
      <OutroCtaOverlay frame={frame} />

      {/* ================= DYNAMIC EYE-TRACKING CAPTION SYSTEM ================= */}
      {DYNAMIC_CARDS.map((card) => {
        const fromFrame = sec(card.from);
        const toFrame = sec(card.to);
        if (frame < fromFrame || frame > toFrame) return null;

        const cardAge = frame - fromFrame;
        const cardPop = spring({
          frame: cardAge,
          fps,
          config: { damping: 16, stiffness: 180, mass: 0.7 },
        });

        const posStyle: React.CSSProperties = {
          position: 'absolute',
          top: card.position.top,
          bottom: card.position.bottom,
          left: card.position.left,
          right: card.position.right,
          width: card.position.width ?? 960,
          transform:
            card.position.left === '50%'
              ? `translateX(-50%) scale(${cardPop})`
              : `scale(${cardPop})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems:
            card.position.align === 'center'
              ? 'center'
              : card.position.align === 'right'
              ? 'flex-end'
              : 'flex-start',
          zIndex: 60,
          pointerEvents: 'none',
        };

        return (
          <div key={card.id} style={posStyle}>
            {/* Optional Context Badge */}
            {card.badge && (
              <div
                style={{
                  backgroundColor: card.badge.bg,
                  border: `1.5px solid ${card.badge.border}`,
                  color: card.badge.color,
                  padding: '6px 18px',
                  borderRadius: 10,
                  fontSize: 16,
                  fontWeight: 900,
                  fontFamily: FONT_PIXEL,
                  letterSpacing: 2,
                  marginBottom: 10,
                  boxShadow: `0 8px 24px rgba(0,0,0,0.6), 0 0 20px ${card.glowColor ?? `${card.badge.color}35`}`,
                }}
              >
                {card.badge.text}
              </div>
            )}

            {/* Subtitle Lines with Font Switching: Inter (sans) + Silkscreen (pixel accent) */}
            {card.lines.map((line, li) => {
              const words = timeLine(line);
              if (frame < words[0].from) return null;

              const isBig = line.size === 'big';
              const isMed = line.size === 'medium';

              return (
                <div
                  key={li}
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent:
                      card.position.align === 'center'
                        ? 'center'
                        : card.position.align === 'right'
                        ? 'flex-end'
                        : 'flex-start',
                    alignItems: 'baseline',
                    gap: isBig ? 14 : isMed ? 10 : 8,
                    lineHeight: 1.25,
                    padding: '2px 8px',
                  }}
                >
                  {words.map((w, wi) => {
                    if (frame < w.from) return null;
                    const age = frame - w.from;
                    const pop = spring({
                      frame: age,
                      fps,
                      config: { damping: 18, stiffness: 220, mass: 0.5 },
                    });
                    const next = words[wi + 1];
                    const speakingThisLine = t <= line.end + 0.15;
                    const isActive = speakingThisLine && (!next || frame < next.from);
                    const isAccent = w.hl !== 'ivory';
                    const baseColor = isAccent ? COLOR[w.hl] : '#FFFFFF';
                    const color = isActive ? (isAccent ? COLOR[w.hl] : ACTIVE) : baseColor;
                    const opacity = interpolate(age, [0, 2], [0, 1], {
                      extrapolateRight: 'clamp',
                    });

                    // Font switching: FONT_SANS for clean natural words, FONT_PIXEL for retro pixel accents!
                    const fontFam = isAccent ? FONT_PIXEL : FONT_SANS;
                    const fontSize = isBig
                      ? isAccent ? 44 : 52
                      : isMed
                      ? isAccent ? 34 : 40
                      : isAccent ? 26 : 30;
                    const fontWeight = isAccent ? 700 : 800;
                    const letterSpacing = isAccent ? 1.5 : -0.5;

                    return (
                      <span
                        key={wi}
                        style={{
                          display: 'inline-block',
                          fontFamily: fontFam,
                          fontSize,
                          fontWeight,
                          letterSpacing,
                          color,
                          opacity,
                          transform: `scale(${pop})`,
                          textShadow: isAccent
                            ? `0 0 24px ${COLOR[w.hl]}80, 0 4px 16px rgba(0,0,0,0.98), 0 2px 4px rgba(0,0,0,0.95)`
                            : isActive
                            ? `0 0 25px ${ACTIVE}88, 0 4px 16px rgba(0,0,0,0.98), 0 2px 4px rgba(0,0,0,0.95)`
                            : `0 4px 16px rgba(0,0,0,0.98), 0 2px 6px rgba(0,0,0,0.95)`,
                        }}
                      >
                        {w.text}
                      </span>
                    );
                  })}
                </div>
              );
            })}
          </div>
        );
      })}

      {/* ================= CINEMATIC VIGNETTE & EDGES ================= */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 50% 46%, rgba(255, 235, 190, 0.03) 0%, rgba(0,0,0,0) 50%, rgba(6, 6, 6, 0.65) 100%)',
          pointerEvents: 'none',
          zIndex: 45,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(8,8,8,0.75) 0%, rgba(8,8,8,0.15) 10%, rgba(8,8,8,0) 20%, rgba(8,8,8,0) 60%, rgba(8,8,8,0.65) 85%, rgba(8,8,8,0.92) 100%)',
          pointerEvents: 'none',
          zIndex: 48,
        }}
      />
    </AbsoluteFill>
  );
};
