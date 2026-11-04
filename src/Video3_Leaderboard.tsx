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
// VIDEO 3 — REFERRAL LEADERBOARD & REWARDS REEL (33.57s @ 30fps = 1008 frames)
// 1080x1440 (4:5 vertical feed format)
// Mysterious Insider Energy, Calm Animation Pacing, and Font-Switching Captions
// ============================================================================

export const LEADERBOARD_DURATION = 1008;
const FPS = 30;
const sec = (s: number) => Math.round(s * FPS);

// High-Vibrancy Popping Palette
const GOLD = '#FFE566';
const EMERALD = '#39FF88';
const CRIMSON = '#FF2E63';
const CYAN = '#00F0FF';
const IVORY = '#FFFFFF';
const ACTIVE = '#FFF566';

// ----------------------------------------------------------------------------
// SCENE DEFINITIONS (6 Scenes synchronized to voiceover beats)
// ----------------------------------------------------------------------------
interface SceneConfig {
  id: number;
  from: number;
  to: number;
  frameA: string;
  frameB: string;
  topLeft: string;
  topRight: string;
  bottomNote: string;
  grade: string;
  lighting: string;
}

const SCENES: SceneConfig[] = [
  // Scene 1: Late-Night Desk & Glowing Green Spreadsheet (0.00s - 6.17s = 0 - 185f)
  // Split internally: 0-105f is 2:00 AM desk, 106-185f is Sapa Mart blackout callback!
  {
    id: 1,
    from: 0,
    to: 185,
    frameA: 'assets/pixel/insider_caleb_desk_a.jpg',
    frameB: 'assets/pixel/insider_caleb_desk_b.jpg',
    topLeft: 'LIRA LABS  •  ORIGIN STORY',
    topRight: 'SCENE 01 / 06',
    bottomNote: '2:00 AM FOUNDER ROOM  •  GLOWING DATABASE',
    grade: 'contrast(1.06) saturate(1.06) brightness(0.98)',
    lighting:
      'radial-gradient(circle at 35% 70%, rgba(168, 224, 95, 0.18) 0%, rgba(6, 10, 8, 0.35) 100%)',
  },
  // Scene 2: The System Goes Live on Laptop (6.17s - 9.07s = 185 - 272f)
  {
    id: 2,
    from: 185,
    to: 272,
    frameA: 'assets/pixel/insider_caleb_desk_a.jpg',
    frameB: 'assets/pixel/insider_caleb_desk_b.jpg',
    topLeft: 'SYSTEM DEPLOYMENT  •  ONLINE',
    topRight: 'SCENE 02 / 06',
    bottomNote: 'TERMINAL ONLINE  •  LEADERBOARD ENGINE ACTIVE',
    grade: 'contrast(1.10) saturate(1.08) brightness(0.98)',
    lighting:
      'radial-gradient(circle at 35% 70%, rgba(168, 224, 95, 0.22) 0%, rgba(6, 10, 8, 0.35) 100%)',
  },
  // Scene 3: The Automated Referral Leaderboard (9.07s - 15.67s = 272 - 470f)
  {
    id: 3,
    from: 272,
    to: 470,
    frameA: 'assets/pixel/sapa/s3_strategy_empty_room_perfect.png',
    frameB: 'assets/pixel/sapa/s3_strategy_empty_room_perfect.png',
    topLeft: 'LIVE LEADERBOARD  •  AUTOMATED',
    topRight: 'SCENE 03 / 06',
    bottomNote: 'REAL-TIME TRACKING  •  TOP ADVOCATES',
    grade: 'contrast(1.08) saturate(1.02) brightness(0.94)',
    lighting:
      'radial-gradient(circle at 50% 40%, rgba(245, 208, 97, 0.12) 0%, rgba(6, 8, 12, 0.50) 100%)',
  },
  // Scene 4: The 3-Friend Rule & Free Bottle Unlock (15.67s - 25.00s = 470 - 750f)
  {
    id: 4,
    from: 470,
    to: 750,
    frameA: 'assets/pixel/sapa/s4_referral_a.jpg',
    frameB: 'assets/pixel/sapa/s4_referral_b.jpg',
    topLeft: 'REFERRAL RULE  •  3 VALID ORDERS',
    topRight: 'SCENE 04 / 06',
    bottomNote: 'UNLOCK 1 FREE BOTTLE  •  FREE ONGKIR DIRECT',
    grade: 'contrast(1.06) saturate(1.08) brightness(0.98)',
    lighting:
      'linear-gradient(135deg, rgba(255, 220, 145, 0.20) 0%, rgba(168, 224, 95, 0.08) 50%, rgba(10, 12, 10, 0.30) 100%)',
  },
  // Scene 5: No Quota & Stock Your Fridge (25.00s - 29.67s = 750 - 890f)
  {
    id: 5,
    from: 750,
    to: 890,
    frameA: 'assets/pixel/sapa/s5_batch_a.jpg',
    frameB: 'assets/pixel/sapa/s5_batch_b.jpg',
    topLeft: 'UNLIMITED REWARDS  •  FRESH BATCH',
    topRight: 'SCENE 05 / 06',
    bottomNote: 'MATCHA  •  CHOCO  •  MILK TEA (ZERO TEXT ON BOTTLE)',
    grade: 'contrast(1.07) saturate(1.04) brightness(0.97)',
    lighting:
      'radial-gradient(circle at 68% 30%, rgba(255, 244, 214, 0.16) 0%, rgba(12, 16, 22, 0.26) 100%)',
  },
  // Scene 6: Weekly Slots CTA (29.67s - 33.57s = 890 - 1008f)
  {
    id: 6,
    from: 890,
    to: 1008,
    frameA: 'assets/pixel/scene_7_ritual_a.jpg',
    frameB: 'assets/pixel/scene_7_ritual.jpg',
    topLeft: 'CLAIM YOUR REWARD  •  @DRINKLIRA',
    topRight: 'SCENE 06 / 06',
    bottomNote: 'IG: @DRINKLIRA  •  CLICK LINK IN BIO',
    grade: 'contrast(1.06) saturate(1.06) brightness(0.96)',
    lighting:
      'linear-gradient(135deg, rgba(255, 220, 145, 0.18) 0%, rgba(168, 224, 95, 0.06) 50%, rgba(10, 12, 10, 0.36) 100%)',
  },
];

// ----------------------------------------------------------------------------
// DYNAMIC EYE-TRACKING CAPTION SYSTEM
// Each card specifies its explicit position and eye focus coordinates!
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
  // 1. Scene 1A: Strategy room callback — a little bit down below center
  {
    id: 's1-spill',
    from: 0.0,
    to: 3.25,
    position: {
      top: 760,
      left: '50%',
      width: 960,
      align: 'center',
    },
    badge: {
      text: 'FOUNDER LOG  •  2:00 AM',
      color: GOLD,
      border: `${GOLD}70`,
      bg: 'rgba(245, 208, 97, 0.16)',
    },
    glowColor: `${GOLD}33`,
    lines: [
      { text: 'Kemarin sempat ^spill,', start: 0.05, end: 1.20, size: 'big' },
      { text: 'kalau ~Lira lagi ngebangun ^sesuatu...', start: 1.25, end: 3.13, size: 'medium' },
    ],
  },
  // 2. Scene 1B: Sapa Mart blackout callback — a little bit down below center
  {
    id: 's1-blackout',
    from: 3.30,
    to: 6.10,
    position: {
      top: 760,
      left: '50%',
      width: 940,
      align: 'center',
    },
    badge: {
      text: 'SAPA MART BLACKOUT CALLBACK',
      color: CRIMSON,
      border: `${CRIMSON}90`,
      bg: 'rgba(255, 77, 84, 0.20)',
    },
    glowColor: `${CRIMSON}40`,
    lines: [
      { text: 'Khusus buat ~regulars,', start: 3.36, end: 4.60, size: 'big' },
      { text: 'pas kita !blackout di !Sapa !Mart.', start: 4.65, end: 6.01, size: 'medium' },
    ],
  },
  // 3. Scene 2: Laptop Terminal Screen — a little bit down below center
  {
    id: 's2-online',
    from: 6.40,
    to: 8.95,
    position: {
      top: 760,
      left: '50%',
      width: 900,
      align: 'center',
    },
    badge: {
      text: 'SYSTEM ONLINE // VER 2.4',
      color: EMERALD,
      border: `${EMERALD}80`,
      bg: 'rgba(168, 224, 95, 0.18)',
    },
    glowColor: `${EMERALD}44`,
    lines: [
      { text: 'Hari ini sistemnya', start: 6.76, end: 7.75, size: 'medium' },
      { text: '~resmi ~nyala!', start: 7.80, end: 8.81, size: 'big' },
    ],
  },
  // 4A. Scene 3: Leaderboard Header — above the live leaderboard card
  {
    id: 's3-header',
    from: 9.04,
    to: 12.00,
    position: {
      top: 150,
      left: '50%',
      width: 960,
      align: 'center',
    },
    badge: {
      text: 'REAL-TIME ADVOCATE ENGINE',
      color: GOLD,
      border: `${GOLD}80`,
      bg: 'rgba(245, 208, 97, 0.20)',
    },
    glowColor: `${GOLD}35`,
    lines: [
      { text: 'Gua bikin ^leaderboard ^otomatis!', start: 9.04, end: 12.00, size: 'big' },
    ],
  },
  // 4B. Scene 3: Leaderboard Footer — below the live ranking card
  {
    id: 's3-footer',
    from: 12.05,
    to: 15.40,
    position: {
      top: 980,
      left: '50%',
      width: 960,
      align: 'center',
    },
    badge: {
      text: 'COMMUNITY TRACKER // TOP REGULARS',
      color: CYAN,
      border: `${CYAN}80`,
      bg: 'rgba(95, 224, 232, 0.16)',
    },
    glowColor: `${CYAN}35`,
    lines: [
      { text: 'Melacak siapa @paling @sering', start: 12.10, end: 13.50, size: 'medium' },
      { text: '~ngeracunin ~Lira ke temannya!', start: 13.55, end: 15.19, size: 'big' },
    ],
  },
  // 5. Scene 4A: The 3 Friends Rule — upper eye zone
  {
    id: 's4-rule-simple',
    from: 15.55,
    to: 17.00,
    position: {
      top: 240,
      left: '50%',
      width: 860,
      align: 'center',
    },
    badge: {
      text: 'RULE ENGINE // STEP 01',
      color: GOLD,
      border: `${GOLD}70`,
      bg: 'rgba(245, 208, 97, 0.15)',
    },
    glowColor: `${GOLD}30`,
    lines: [
      { text: 'Aturannya ^simpel ^banget.', start: 15.75, end: 16.65, size: 'big' },
    ],
  },
  // 6. Scene 4B: 3 Friends Valid Order — above friend avatars
  {
    id: 's4-three-friends',
    from: 17.05,
    to: 20.00,
    position: {
      top: 220,
      left: '50%',
      width: 960,
      align: 'center',
    },
    badge: {
      text: '3 FRIENDS REFERRAL MILESTONE',
      color: CYAN,
      border: `${CYAN}80`,
      bg: 'rgba(95, 224, 232, 0.16)',
    },
    glowColor: `${CYAN}35`,
    lines: [
      { text: 'Setiap ^3 ^teman ^lo,', start: 17.10, end: 18.30, size: 'big' },
      { text: 'yang ~valid ~order lewat referensi lo...', start: 18.35, end: 19.82, size: 'medium' },
    ],
  },
  // 7A. Scene 4C: Golden Bottle Unlock Top Banner
  {
    id: 's4-unlock-top',
    from: 20.10,
    to: 24.80,
    position: {
      top: 150,
      left: '50%',
      width: 960,
      align: 'center',
    },
    badge: {
      text: 'INSTANT REWARD UNLOCKED',
      color: GOLD,
      border: `${GOLD}90`,
      bg: 'rgba(245, 208, 97, 0.22)',
    },
    glowColor: `${GOLD}50`,
    lines: [
      { text: 'Lo otomatis ^unlock', start: 20.17, end: 21.30, size: 'medium' },
      { text: '^1 ^botol ~Lira ^gratis!', start: 21.35, end: 22.80, size: 'big' },
    ],
  },
  // 7B. Scene 4C: Free Ongkir Bottom Stamp
  {
    id: 's4-unlock-bottom',
    from: 22.85,
    to: 24.80,
    position: {
      top: 980,
      left: '50%',
      width: 960,
      align: 'center',
    },
    badge: {
      text: '100% FREE SHIPPING GUARANTEED',
      color: EMERALD,
      border: `${EMERALD}80`,
      bg: 'rgba(168, 224, 95, 0.20)',
    },
    glowColor: `${EMERALD}40`,
    lines: [
      { text: '+ ~free ~ongkir langsung ke rumah lo', start: 22.89, end: 24.67, size: 'big' },
    ],
  },
  // 8. Scene 5A: No Quota — above kitchen counter
  {
    id: 's5-no-quota',
    from: 25.10,
    to: 28.05,
    position: {
      top: 220,
      left: '50%',
      width: 960,
      align: 'center',
    },
    badge: {
      text: 'NO LIMITS  •  ZERO RESTRICTIONS',
      color: CRIMSON,
      border: `${CRIMSON}80`,
      bg: 'rgba(255, 77, 84, 0.18)',
    },
    glowColor: `${CRIMSON}35`,
    lines: [
      { text: '!Nggak !ada !batas !kuota,', start: 25.22, end: 26.35, size: 'big' },
      { text: 'makin banyak lo ^racunin ^teman...', start: 26.40, end: 27.98, size: 'medium' },
    ],
  },
  // 9. Scene 5B: Fridge Full — middle dynamic zone
  {
    id: 's5-fridge-full',
    from: 28.15,
    to: 29.60,
    position: {
      top: 480,
      left: '50%',
      width: 920,
      align: 'center',
    },
    badge: {
      text: 'STACK YOUR REFRIGERATOR',
      color: CYAN,
      border: `${CYAN}80`,
      bg: 'rgba(95, 224, 232, 0.20)',
    },
    glowColor: `${CYAN}45`,
    lines: [
      { text: 'Makin ~penuh ~kulkas ~lo!', start: 28.21, end: 29.37, size: 'big' },
    ],
  },
  // 10. Scene 6A: Ready to Collect Points? — above CTA
  {
    id: 's6-points-ready',
    from: 29.80,
    to: 31.40,
    position: {
      top: 360,
      left: '50%',
      width: 940,
      align: 'center',
    },
    badge: {
      text: 'WEEKLY CYCLE // START TODAY',
      color: GOLD,
      border: `${GOLD}80`,
      bg: 'rgba(245, 208, 97, 0.18)',
    },
    glowColor: `${GOLD}35`,
    lines: [
      { text: 'Mau mulai ngumpulin poin', start: 29.94, end: 30.70, size: 'medium' },
      { text: '^minggu ^ini?', start: 30.75, end: 31.30, size: 'big' },
    ],
  },
];

interface TimedWord {
  text: string;
  from: number; // frame
  hl: Hl;
}

function timeLine(line: CaptionLine): TimedWord[] {
  const raw = line.text.split(' ').filter(Boolean);
  const parsed = raw.map((w) => {
    let hl: Hl = 'ivory';
    let t = w;
    if (w.startsWith('^')) {
      hl = 'gold';
      t = w.slice(1);
    } else if (w.startsWith('~')) {
      hl = 'emerald';
      t = w.slice(1);
    } else if (w.startsWith('!')) {
      hl = 'crimson';
      t = w.slice(1);
    } else if (w.startsWith('@')) {
      hl = 'cyan';
      t = w.slice(1);
    }
    return { text: t, hl };
  });

  const weights = parsed.map((p) => p.text.length + 1.5);
  const total = weights.reduce((a, b) => a + b, 0);
  const span = line.end - line.start;
  let acc = 0;
  return parsed.map((p, i) => {
    const from = sec(line.start + (acc / total) * span);
    acc += weights[i];
    return { ...p, from };
  });
}

const COLOR: Record<Hl, string> = {
  gold: GOLD,
  emerald: EMERALD,
  crimson: CRIMSON,
  cyan: CYAN,
  ivory: IVORY,
};

// ----------------------------------------------------------------------------
// SPEECH RHYTHM (for character mouth / idle animations)
// ----------------------------------------------------------------------------
const SPEECH: [number, number][] = [
  [0.05, 3.13],
  [3.36, 6.01],
  [6.76, 8.81],
  [9.04, 15.19],
  [15.75, 16.65],
  [17.10, 19.82],
  [20.17, 24.67],
  [25.22, 27.98],
  [28.21, 29.37],
  [29.94, 31.30],
  [31.76, 33.57],
];

// ----------------------------------------------------------------------------
// SCENE RENDERER (Pixel Art Backgrounds + Deliberate Narrative Pacing)
// ----------------------------------------------------------------------------
const PixelScene: React.FC<{
  scene: SceneConfig;
  frame: number;
  talking: boolean;
}> = ({ scene, frame }) => {
  // Deliberate narrative pose changes (calm, intentional beats — NOT rapid 5-frame twitching!):
  let isB = false;

  if (scene.id === 1) {
    // 0 to 75f: Frame A (Caleb focused at glowing spreadsheet, smirking knowingly)
    // 76 to 105f: Frame B (Caleb looks toward viewer with confident smirk)
    // 106 to 185f: Flashback cut to Sapa Mart blackout
    isB = frame >= 76 && frame < 106;
  } else if (scene.id === 2) {
    // 185 to 225f: Frame A (looking at laptop terminal booting)
    // 226 to 272f: Frame B (Caleb proudly toasts bottle as system goes live!)
    isB = frame >= 226;
  } else if (scene.id === 4) {
    // 470 to 585f: Frame A (explaining rule)
    // 586 to 604f: Frame B (clinking bottles)
    isB = frame >= 586 && frame < 605;
  } else if (scene.id === 5) {
    // 750 to 820f: Frame A (holding milk tea bottle)
    // 821 to 890f: Frame B (packing into box)
    isB = frame >= 821;
  } else if (scene.id === 6) {
    // 890 to 950f: Frame A
    // 951 to 1008f: Frame B (toast to viewer)
    isB = frame >= 951;
  }

  // In Scene 1: switch to Sapa Mart Storefront between frames 106 and 185
  let asset = isB ? scene.frameB : scene.frameA;
  if (scene.id === 1 && frame >= 106) {
    asset = 'assets/pixel/sapa/s1_storefront_a.jpg';
  }

  // Natural human breathing rhythm (3.3 seconds per breath, calm & cinematic)
  const breathe = Math.sin((frame / 50) * Math.PI) * 1.8;
  const driftX = Math.sin((frame / 120) * Math.PI) * 2;

  return (
    <AbsoluteFill
      style={{
        filter: scene.grade,
        transform: `translate(${driftX}px, ${breathe}px)`,
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

      {/* Atmospheric glowing green spreadsheet pulse on late-night desk */}
      {scene.id <= 2 && (
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(circle at 35% 70%, rgba(168, 224, 95, 0.22) 0%, rgba(168, 224, 95, 0.05) 45%, rgba(0,0,0,0) 70%)',
            opacity: Math.sin((frame / 18) * Math.PI) * 0.12 + 0.88,
            mixBlendMode: 'screen',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Sapa Mart blackout dramatic red vignette alert */}
      {scene.id === 1 && frame >= 106 && (
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(255, 77, 84, 0.20) 0%, rgba(20, 0, 0, 0.45) 100%)',
            mixBlendMode: 'multiply',
            pointerEvents: 'none',
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// ----------------------------------------------------------------------------
// INTERACTIVE LEADERBOARD CARD COMPONENT (Scene 3 centerpiece)
// ----------------------------------------------------------------------------
const LeaderboardCard: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const age = frame - 272;
  if (age < 0) return null;

  const cardSpring = spring({
    frame: age,
    fps,
    config: { damping: 15, stiffness: 150, mass: 0.8 },
  });

  const pulse = Math.sin((frame / 12) * Math.PI) * 0.03 + 1.0;

  const ranks = [
    {
      rank: 1,
      badge: '#1 TOP ADVOCATE',
      avatarColor: '#F5D061',
      name: 'S---',
      handle: '@sxxx',
      score: '18 BOTTLES',
      reward: '6 BOTTLES UNLOCKED',
      rewardBg: `${GOLD}22`,
      rewardColor: GOLD,
    },
    {
      rank: 2,
      badge: '#2 REGULAR VIP',
      avatarColor: '#E0E0E0',
      name: 'D---',
      handle: '@dxxx',
      score: '12 BOTTLES',
      reward: '4 BOTTLES UNLOCKED',
      rewardBg: 'rgba(224, 224, 224, 0.18)',
      rewardColor: '#E0E0E0',
    },
    {
      rank: 3,
      badge: '#3 COMMUNITY',
      avatarColor: '#CD7F32',
      name: 'V---',
      handle: '@vxxx',
      score: '9 BOTTLES',
      reward: '3 BOTTLES UNLOCKED',
      rewardBg: 'rgba(205, 127, 50, 0.20)',
      rewardColor: '#E6A16A',
    },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: 350,
        left: '50%',
        width: 880,
        transform: `translateX(-50%) scale(${cardSpring})`,
        zIndex: 50,
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(12, 14, 18, 0.94)',
          backdropFilter: 'blur(24px)',
          borderRadius: 24,
          border: `2px solid ${GOLD}88`,
          boxShadow: `0 32px 80px rgba(0,0,0,0.92), 0 0 50px ${GOLD}26, inset 0 1px 0 rgba(255,255,255,0.15)`,
          padding: '24px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* Top Header of Card */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `1px solid ${GOLD}30`,
            paddingBottom: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: EMERALD,
                boxShadow: `0 0 12px ${EMERALD}`,
                transform: `scale(${pulse})`,
              }}
            />
            <span style={{ color: IVORY, fontSize: 22, fontWeight: 900, letterSpacing: 2 }}>
              COMMUNITY LEADERBOARD
            </span>
          </div>
          <div
            style={{
              backgroundColor: 'rgba(168, 224, 95, 0.16)',
              border: `1px solid ${EMERALD}70`,
              borderRadius: 6,
              padding: '4px 12px',
              color: EMERALD,
              fontSize: 15,
              fontWeight: 800,
              letterSpacing: 2,
            }}
          >
            AUTO-SYNCED ●
          </div>
        </div>

        {/* 3 Rank Rows */}
        {ranks.map((r, i) => {
          const rowAge = age - i * 5;
          const rowPop = spring({
            frame: Math.max(0, rowAge),
            fps,
            config: { damping: 14, stiffness: 180 },
          });

          return (
            <div
              key={r.rank}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: i === 0 ? 'rgba(245, 208, 97, 0.10)' : 'rgba(255, 255, 255, 0.04)',
                border: i === 0 ? `1.5px solid ${GOLD}60` : '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14,
                padding: '12px 18px',
                transform: `scale(${rowPop})`,
                boxShadow: i === 0 ? `0 8px 24px ${GOLD}20` : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {/* Avatar with Ring */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    border: `2px solid ${r.avatarColor}`,
                    backgroundColor: '#1E232A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    fontWeight: 900,
                    color: r.avatarColor,
                    boxShadow: `0 0 14px ${r.avatarColor}40`,
                  }}
                >
                  {r.rank === 1 ? '#1' : r.rank === 2 ? '#2' : '#3'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: IVORY, fontSize: 21, fontWeight: 800, letterSpacing: 0.5 }}>
                      {r.name}
                    </span>
                    <span style={{ color: 'rgba(250,247,240,0.5)', fontSize: 15, fontWeight: 500 }}>
                      {r.handle}
                    </span>
                  </div>
                  <span
                    style={{
                      color: r.rewardColor,
                      fontSize: 13,
                      fontWeight: 800,
                      letterSpacing: 1.5,
                      textTransform: 'uppercase',
                    }}
                  >
                    {r.badge}
                  </span>
                </div>
              </div>

              {/* Score & Reward Pill */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                <span style={{ color: GOLD, fontSize: 22, fontWeight: 900, letterSpacing: 1 }}>
                  {r.score}
                </span>
                <span
                  style={{
                    backgroundColor: r.rewardBg,
                    color: r.rewardColor,
                    padding: '3px 10px',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 800,
                    letterSpacing: 1,
                  }}
                >
                  {r.reward}
                </span>
              </div>
            </div>
          );
        })}

        {/* Live Active Tracker Bar */}
        <div
          style={{
            backgroundColor: 'rgba(168, 224, 95, 0.08)',
            border: `1px solid ${EMERALD}50`,
            borderRadius: 12,
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ color: IVORY, fontSize: 16, fontWeight: 700, letterSpacing: 1 }}>
            YOUR CODE: <span style={{ color: GOLD, fontWeight: 900 }}>#REGULAR-01</span>
          </span>
          <span style={{ color: EMERALD, fontSize: 16, fontWeight: 800, letterSpacing: 1 }}>
            TRACKING 3/3 FRIENDS...
          </span>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// 3-FRIENDS REFERRAL FLOW & GOLDEN BOTTLE UNLOCK (Scene 4 centerpiece)
// ----------------------------------------------------------------------------
const ReferralFlow: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();

  // Phase 1: 3 Friends appear (470f - 605f)
  // Phase 2: Golden Bottle Unlock! (605f - 750f)
  const isPhase2 = frame >= 605;

  if (!isPhase2) {
    const age = frame - 470;
    const friends = [
      { name: 'C---', handle: '@cxxx', state: 'ORDERED [OK]', icon: '', delay: 10 },
      { name: 'A---', handle: '@axxx', state: 'ORDERED [OK]', icon: '', delay: 22 },
      { name: 'M---', handle: '@mxxx', state: 'VALID ORDER [OK]', icon: '', delay: 34 },
    ];

    return (
      <div
        style={{
          position: 'absolute',
          top: 480,
          left: '50%',
          width: 960,
          transform: 'translateX(-50%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 24,
          zIndex: 50,
        }}
      >
        {friends.map((f, i) => {
          const friendAge = Math.max(0, age - f.delay);
          const pop = spring({
            frame: friendAge,
            fps,
            config: { damping: 14, stiffness: 170, mass: 0.7 },
          });

          return (
            <div
              key={i}
              style={{
                flex: 1,
                backgroundColor: 'rgba(12, 14, 18, 0.90)',
                backdropFilter: 'blur(20px)',
                borderRadius: 20,
                border: `2px solid ${EMERALD}80`,
                boxShadow: `0 24px 60px rgba(0,0,0,0.85), 0 0 30px ${EMERALD}30`,
                padding: '24px 18px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                transform: `scale(${pop})`,
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(168, 224, 95, 0.15)',
                  border: `2.5px solid ${EMERALD}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 34,
                  boxShadow: `0 0 20px ${EMERALD}40`,
                }}
              >
                {f.icon}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <span style={{ color: IVORY, fontSize: 22, fontWeight: 800 }}>{f.name}</span>
                <span style={{ color: 'rgba(250,247,240,0.5)', fontSize: 16 }}>{f.handle}</span>
              </div>
              <div
                style={{
                  backgroundColor: 'rgba(168, 224, 95, 0.20)',
                  border: `1.5px solid ${EMERALD}`,
                  borderRadius: 8,
                  padding: '6px 14px',
                  color: EMERALD,
                  fontSize: 16,
                  fontWeight: 900,
                  letterSpacing: 1.5,
                  boxShadow: `0 0 14px ${EMERALD}35`,
                }}
              >
                {f.state}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Phase 2: Golden Bottle Unlock animation! (605f - 750f)
  const unlockAge = frame - 605;
  const bottleSpring = spring({
    frame: unlockAge,
    fps,
    config: { damping: 13, stiffness: 140, mass: 0.9 },
  });
  const raysAngle = (unlockAge * 1.5) % 360;
  const floatY = Math.sin((unlockAge / 14) * Math.PI) * 6;

  return (
    <div
      style={{
        position: 'absolute',
        top: 360,
        left: '50%',
        width: 800,
        height: 480,
        transform: `translateX(-50%) translateY(${floatY}px)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 52,
      }}
    >
      {/* Golden Rotating Lightburst */}
      <div
        style={{
          position: 'absolute',
          width: 540,
          height: 540,
          borderRadius: '50%',
          background: `conic-gradient(from ${raysAngle}deg, ${GOLD}00 0deg, ${GOLD}40 25deg, ${GOLD}00 50deg, ${GOLD}35 75deg, ${GOLD}00 100deg, ${GOLD}40 125deg, ${GOLD}00 150deg, ${GOLD}35 175deg, ${GOLD}00 200deg, ${GOLD}40 225deg, ${GOLD}00 250deg, ${GOLD}35 275deg, ${GOLD}00 300deg, ${GOLD}40 325deg, ${GOLD}00 360deg)`,
          filter: 'blur(16px)',
          transform: `scale(${interpolate(bottleSpring, [0, 1], [0.6, 1])})`,
          opacity: interpolate(unlockAge, [0, 10], [0, 0.9], { extrapolateRight: 'clamp' }),
        }}
      />

      {/* Hero Bottle (Clean Lira Bottle — official circular logo, ZERO flavor text!) */}
      <div
        style={{
          position: 'relative',
          width: 220,
          height: 400,
          transform: `scale(${bottleSpring})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: 'drop-shadow(0 25px 45px rgba(0,0,0,0.95)) drop-shadow(0 0 40px rgba(245,208,97,0.65))',
        }}
      >
        <Img
          src={staticFile('assets/pixel/matcha_zero_text.png')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            imageRendering: 'auto',
          }}
        />

        {/* Golden Unlock Stamp */}
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            backgroundColor: GOLD,
            color: '#0A0A09',
            padding: '8px 18px',
            borderRadius: 8,
            fontSize: 19,
            fontWeight: 900,
            letterSpacing: 2,
            boxShadow: `0 8px 24px ${GOLD}80`,
            transform: 'rotate(-3deg)',
            border: '2px solid #FFF',
            whiteSpace: 'nowrap',
          }}
        >
          FREE BOTTLE UNLOCKED
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// SCENE 6 HERO CTA CARD (Single unified CTA container)
// ----------------------------------------------------------------------------
const FinalCtaCard: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const age = frame - 945; // starts around 31.5s
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
        top: 560,
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
              letterSpacing: 2.5,
            }}
          >
            SLOT MINGGUAN TERBATAS ●
          </span>
          <div
            style={{
              background: `linear-gradient(135deg, ${GOLD} 0%, #E0B445 100%)`,
              color: '#0A0A09',
              padding: '12px 24px',
              borderRadius: 8,
              fontSize: 30,
              fontWeight: 900,
              letterSpacing: 1.5,
              boxShadow: `0 8px 24px ${GOLD}50`,
            }}
          >
            CLICK LINK IN BIO RIGHT NOW
          </div>
          <div style={{ display: 'flex', gap: 14, fontSize: 20, fontWeight: 700, letterSpacing: 2 }}>
            <span style={{ color: EMERALD, fontWeight: 900 }}>@DRINKLIRA</span>
            <span style={{ color: `${GOLD}80` }}>•</span>
            <span style={{ color: 'rgba(250,247,240,0.85)' }}>AUTOMATED REFERRAL SYSTEM</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// MAIN VIDEO COMPONENT
// ----------------------------------------------------------------------------
export const Video3_Leaderboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Active scene
  const scene =
    SCENES.find((s) => frame >= s.from && frame < s.to) ?? SCENES[SCENES.length - 1];

  // Talking state
  const talking = SPEECH.some(([start, end]) => t >= start && t <= end);

  // Hook zoom on Scene 1
  const hookZoom = interpolate(frame, [0, 40], [1.06, 1.0], {
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
        src={staticFile('assets/voiceover_leaderboard.mp3')}
        volume={1.0}
      />

      {/* 2. Ambient Lo-Fi Background Music (Ducked under speech) */}
      <Audio
        src={staticFile('assets/bg_music.mp3')}
        volume={0.16}
        loop
      />

      {/* 3. Sound Effects synchronized to key video moments */}
      {/* Scene 1 Whoosh start */}
      <Sequence from={1} durationInFrames={40}>
        <Audio src={staticFile('assets/sfx/whoosh.mp3')} volume={0.45} />
      </Sequence>
      {/* Sapa Mart blackout impact (frame 101) */}
      <Sequence from={101} durationInFrames={50}>
        <Audio src={staticFile('assets/sfx/impact.mp3')} volume={0.5} />
      </Sequence>
      {/* System online terminal beep / sub hit (frame 185) */}
      <Sequence from={185} durationInFrames={45}>
        <Audio src={staticFile('assets/sfx/sub_hit.mp3')} volume={0.6} />
      </Sequence>
      {/* Leaderboard card slam (frame 272) */}
      <Sequence from={272} durationInFrames={50}>
        <Audio src={staticFile('assets/sfx/thud.mp3')} volume={0.55} />
      </Sequence>
      {/* 3 Friends pop SFX */}
      <Sequence from={480} durationInFrames={30}>
        <Audio src={staticFile('assets/sfx/snap.mp3')} volume={0.4} />
      </Sequence>
      <Sequence from={492} durationInFrames={30}>
        <Audio src={staticFile('assets/sfx/snap.mp3')} volume={0.45} />
      </Sequence>
      <Sequence from={504} durationInFrames={30}>
        <Audio src={staticFile('assets/sfx/snap.mp3')} volume={0.5} />
      </Sequence>
      {/* Golden Bottle Unlock impact (frame 605) */}
      <Sequence from={605} durationInFrames={60}>
        <Audio src={staticFile('assets/sfx/impact.mp3')} volume={0.65} />
      </Sequence>
      {/* Batch whoosh (frame 750) */}
      <Sequence from={750} durationInFrames={45}>
        <Audio src={staticFile('assets/sfx/whoosh.mp3')} volume={0.45} />
      </Sequence>
      {/* Final CTA Impact (frame 945) */}
      <Sequence from={945} durationInFrames={60}>
        <Audio src={staticFile('assets/sfx/impact.mp3')} volume={0.6} />
      </Sequence>

      {/* ================= SCENE LAYER ================= */}
      <AbsoluteFill style={{ transform: `scale(${hookZoom})` }}>
        <PixelScene scene={scene} frame={frame} talking={talking} />
      </AbsoluteFill>

      {/* ================= SPECIAL INTERACTIVE HUD LAYERS ================= */}
      {/* Scene 3: The Live Leaderboard UI */}
      {scene.id === 3 && <LeaderboardCard frame={frame} />}

      {/* Scene 4: 3-Friends Referral & Golden Bottle Unlock */}
      {scene.id === 4 && <ReferralFlow frame={frame} />}

      {/* Scene 6: Final CTA Card */}
      {scene.id === 6 && <FinalCtaCard frame={frame} />}

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
          width: card.position.width ?? 920,
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

                    // Font switching: FONT_SANS for clean natural words, FONT_PIXEL for retro pixel accent words!
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
