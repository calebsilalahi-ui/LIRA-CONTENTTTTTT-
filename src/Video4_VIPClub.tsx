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
  Easing,
} from 'remotion';
import { FONT_STYLE, FONT_PIXEL, FONT_SANS } from './fonts';

// ============================================================================
// VIDEO 4 — LIRA FAM // INNER CIRCLE (EXCLUSIVE VIP CLUB REEL)
// Duration: 960 frames @ 30fps = 32.00s (Aligned to voiceover_innercircle.mp3)
// Canvas: 1080 x 1440 (Standard 4:5 vertical feed ratio)
//
// Key Revisions per User Directives:
// 1. SCENE CHANGES EVERY ~3 SECONDS: 10 distinct, kinetic visual cuts (90-100f each)
//    - Scene 1 (0-95f): VIP Club Entrance (Caleb at locked door, golden key overhead)
//    - Scene 2 (95-190f): Instagram Invite on Retro Green Phone
//    - Scene 3 (190-285f): Caleb Walking Across Campus with Chilled Lira
//    - Scene 4 (285-380f): Artisan Kitchen Pouring Fresh Matcha & Oat Milk
//    - Scene 5 (380-475f): 2:00 AM Founder Desk & Glowing Green Database
//    - Scene 6 (475-570f): Caleb Running Urgent Morning Delivery with Cold Box
//    - Scene 7 (570-670f): Inside VIP Lounge: Caleb Toasting with Lira Bottle
//    - Scene 8 (670-765f): Inside VIP Lounge: Caleb Open Smile & Inviting Gesture
//    - Scene 9 (765-865f): Hero Pointing Pose: Caleb Directing Focus to Viewer
//    - Scene 10 (865-960f): Community Study Ritual: Students Celebrating Lira
// 2. EVERY CTA IN THE MIDDLE: All badges, cards, drop trackers, and buttons
//    are centered horizontally (left: 50%, translateX(-50%)) in the middle zone.
// 3. WORD-BY-WORD KINETIC CAPTIONS: Words pop in sequentially with spring scale bursts
//    and multi-layer contrast shields so text never washes out.
// ============================================================================

export const VIP_CLUB_DURATION = 960;
const FPS = 30;

// High-Vibrancy Popping Palette
const GOLD = '#FFE566';
const EMERALD = '#39FF88';
const CRIMSON = '#FF2E63';
const CYAN = '#00F0FF';
const IVORY = '#FFFFFF';
const ACTIVE = '#FFF566';

// ----------------------------------------------------------------------------
// 10 SCENE DEFINITIONS (CHANGING EVERY ~3 SECONDS = 90-100 FRAMES)
// ----------------------------------------------------------------------------
interface SceneDef {
  id: number;
  from: number; // frame
  to: number;   // frame
  asset: string;
  grade: string;
  lighting: string;
  tag: string;
  tagColor: string;
  label: string;
}

const SCENES: SceneDef[] = [
  // Scene 1 (0 to 95f = 0.00s to 3.17s) - VIP Club Entrance
  {
    id: 1,
    from: 0,
    to: 95,
    asset: 'assets/pixel/vip_club_entrance_a.jpg',
    grade: 'contrast(1.08) saturate(1.08) brightness(0.98)',
    lighting:
      'radial-gradient(circle at 60% 25%, rgba(255, 229, 102, 0.22) 0%, rgba(57, 255, 136, 0.08) 50%, rgba(6, 10, 8, 0.35) 100%)',
    label: 'VIP ACCESS',
    tag: 'OFFICIAL PASS',
    tagColor: GOLD,
  },
  // Scene 2 (95 to 190f = 3.17s to 6.33s) - Retro Phone Broadcast Channel
  {
    id: 2,
    from: 95,
    to: 190,
    asset: 'assets/pixel/tutorial/s1_phone_a.jpg',
    grade: 'contrast(1.08) saturate(1.08) brightness(0.98)',
    lighting:
      'radial-gradient(circle at 30% 65%, rgba(57, 255, 136, 0.20) 0%, rgba(6, 10, 8, 0.40) 100%)',
    label: 'INVITATION',
    tag: 'ACTIVE LINK',
    tagColor: EMERALD,
  },
  // Scene 3 (190 to 285f = 6.33s to 9.50s) - Caleb Walking Campus
  {
    id: 3,
    from: 190,
    to: 285,
    asset: 'assets/pixel/caleb_walking_drink.jpg',
    grade: 'contrast(1.06) saturate(1.08) brightness(0.98)',
    lighting:
      'linear-gradient(135deg, rgba(255, 240, 180, 0.16) 0%, rgba(57, 255, 136, 0.08) 50%, rgba(10, 12, 10, 0.25) 100%)',
    label: 'RESTRICTED',
    tag: 'REGULARS ONLY',
    tagColor: CRIMSON,
  },
  // Scene 4 (285 to 380f = 9.50s to 12.67s) - Artisan Kitchen Matcha Pouring
  {
    id: 4,
    from: 285,
    to: 380,
    asset: 'assets/pixel/caleb_pouring_matcha.jpg',
    grade: 'contrast(1.08) saturate(1.08) brightness(0.98)',
    lighting:
      'linear-gradient(135deg, rgba(255, 240, 190, 0.18) 0%, rgba(57, 255, 136, 0.10) 60%, rgba(10, 12, 10, 0.25) 100%)',
    label: 'ARTISAN CRAFT',
    tag: 'REAL OAT MILK',
    tagColor: EMERALD,
  },
  // Scene 5 (380 to 475f = 12.67s to 15.83s) - 2 AM Founder Desk Terminal
  {
    id: 5,
    from: 380,
    to: 475,
    asset: 'assets/pixel/insider_caleb_desk_a.jpg',
    grade: 'contrast(1.10) saturate(1.05) brightness(0.95)',
    lighting:
      'radial-gradient(circle at 40% 65%, rgba(57, 255, 136, 0.22) 0%, rgba(6, 8, 12, 0.55) 100%)',
    label: 'TERMINAL',
    tag: 'ALLOCATION ACTIVE',
    tagColor: GOLD,
  },
  // Scene 6 (475 to 570f = 15.83s to 19.00s) - Running Urgent Delivery
  {
    id: 6,
    from: 475,
    to: 570,
    asset: 'assets/pixel/caleb_running_delivery.jpg',
    grade: 'contrast(1.08) saturate(1.08) brightness(0.98)',
    lighting:
      'linear-gradient(135deg, rgba(255, 240, 180, 0.18) 0%, rgba(57, 255, 136, 0.08) 50%, rgba(10, 12, 10, 0.25) 100%)',
    label: 'COLD DROP',
    tag: '24H EARLY',
    tagColor: GOLD,
  },
  // Scene 7 (570 to 670f = 19.00s to 22.33s) - VIP Lounge: Toasting with Lira
  {
    id: 7,
    from: 570,
    to: 670,
    asset: 'assets/pixel/vip_lounge_interior_a.jpg',
    grade: 'contrast(1.08) saturate(1.06) brightness(0.97)',
    lighting:
      'radial-gradient(circle at 60% 45%, rgba(255, 220, 140, 0.16) 0%, rgba(57, 255, 136, 0.08) 60%, rgba(10, 8, 12, 0.35) 100%)',
    label: 'VIP LOUNGE',
    tag: 'UNLOCKED',
    tagColor: CYAN,
  },
  // Scene 8 (670 to 765f = 22.33s to 25.50s) - VIP Lounge: Inviting Gesture
  {
    id: 8,
    from: 670,
    to: 765,
    asset: 'assets/pixel/vip_lounge_interior_b.jpg',
    grade: 'contrast(1.08) saturate(1.06) brightness(0.97)',
    lighting:
      'radial-gradient(circle at 60% 45%, rgba(255, 220, 140, 0.16) 0%, rgba(57, 255, 136, 0.08) 60%, rgba(10, 8, 12, 0.35) 100%)',
    label: 'REWARD PROGRAM',
    tag: 'SELL 3 GET 1',
    tagColor: GOLD,
  },
  // Scene 9 (765 to 865f = 25.50s to 28.83s) - Hero Pointing Pose
  {
    id: 9,
    from: 765,
    to: 865,
    asset: 'assets/pixel/caleb_point_hero.jpg',
    grade: 'contrast(1.08) saturate(1.08) brightness(0.98)',
    lighting:
      'radial-gradient(circle at 50% 50%, rgba(255, 229, 102, 0.20) 0%, rgba(57, 255, 136, 0.10) 50%, rgba(6, 10, 8, 0.35) 100%)',
    label: 'DIRECT ACTION',
    tag: 'DM FAM NOW',
    tagColor: CRIMSON,
  },
  // Scene 10 (865 to 960f = 28.83s to 32.00s) - Community Study Ritual
  {
    id: 10,
    from: 865,
    to: 960,
    asset: 'assets/pixel/scene_7_ritual_a.jpg',
    grade: 'contrast(1.06) saturate(1.06) brightness(0.96)',
    lighting:
      'linear-gradient(135deg, rgba(255, 220, 145, 0.18) 0%, rgba(57, 255, 136, 0.06) 50%, rgba(10, 12, 10, 0.36) 100%)',
    label: 'COMMUNITY',
    tag: 'SLOTS LIMITED',
    tagColor: EMERALD,
  },
];

// ----------------------------------------------------------------------------
// WORD-BY-WORD TIMED CAPTION DATA
// ----------------------------------------------------------------------------
type WordType = 'normal' | 'gold' | 'emerald' | 'crimson' | 'cyan';

interface TimedWord {
  text: string;
  from: number; // frame
  to: number;   // frame
  type: WordType;
}

interface CaptionLine {
  words: TimedWord[];
  size: 'big' | 'medium' | 'small';
}

interface CaptionGroup {
  id: string;
  from: number; // frame
  to: number;   // frame
  badge?: {
    text: string;
    color: string;
    border: string;
    bg: string;
  };
  glowColor?: string;
  lines: CaptionLine[];
}

const CAPTION_GROUPS: CaptionGroup[] = [
  // 1. Hook A (0 to 95 frames = 0.00s to 3.17s)
  {
    id: 's1-open-door',
    from: 0,
    to: 95,
    badge: {
      text: 'EXCLUSIVE VIP // BROADCAST CHANNEL',
      color: GOLD,
      border: `${GOLD}80`,
      bg: 'rgba(255, 229, 102, 0.16)',
    },
    glowColor: `${GOLD}40`,
    lines: [
      {
        size: 'big',
        words: [
          { text: 'Hari', from: 2, to: 11, type: 'normal' },
          { text: 'ini', from: 11, to: 20, type: 'normal' },
          { text: 'kita', from: 20, to: 29, type: 'normal' },
          { text: 'resmi', from: 29, to: 38, type: 'normal' },
          { text: 'BUKA', from: 38, to: 52, type: 'gold' },
          { text: 'PINTU', from: 52, to: 68, type: 'gold' },
        ],
      },
      {
        size: 'big',
        words: [
          { text: 'buat', from: 68, to: 76, type: 'normal' },
          { text: 'LIRA', from: 76, to: 82, type: 'emerald' },
          { text: 'FAM', from: 82, to: 88, type: 'emerald' },
          { text: 'INNER', from: 88, to: 92, type: 'gold' },
          { text: 'CIRCLE', from: 92, to: 95, type: 'gold' },
        ],
      },
    ],
  },
  // 2. Broadcast Channel (95 to 190 frames = 3.17s to 6.33s)
  {
    id: 's2-instagram',
    from: 95,
    to: 190,
    badge: {
      text: 'BROADCAST CHANNEL INVITATION',
      color: EMERALD,
      border: `${EMERALD}80`,
      bg: 'rgba(57, 255, 136, 0.16)',
    },
    glowColor: `${EMERALD}40`,
    lines: [
      {
        size: 'big',
        words: [
          { text: 'di', from: 100, to: 112, type: 'normal' },
          { text: 'broadcast', from: 112, to: 126, type: 'normal' },
          { text: 'channel', from: 126, to: 138, type: 'normal' },
        ],
      },
      {
        size: 'big',
        words: [
          { text: 'INSTAGRAM', from: 138, to: 160, type: 'cyan' },
          { text: 'kita!', from: 160, to: 185, type: 'normal' },
        ],
      },
    ],
  },
  // 3. Restricted Entry (190 to 285 frames = 6.33s to 9.50s)
  {
    id: 's3-restricted',
    from: 190,
    to: 285,
    badge: {
      text: 'RESTRICTED ENTRY // REGULARS ONLY',
      color: CRIMSON,
      border: `${CRIMSON}90`,
      bg: 'rgba(255, 46, 99, 0.20)',
    },
    glowColor: `${CRIMSON}50`,
    lines: [
      {
        size: 'medium',
        words: [
          { text: 'Tapi', from: 190, to: 199, type: 'normal' },
          { text: 'channel', from: 199, to: 209, type: 'normal' },
          { text: 'ini...', from: 209, to: 220, type: 'normal' },
        ],
      },
      {
        size: 'big',
        words: [
          { text: 'ENGGAK', from: 221, to: 236, type: 'crimson' },
          { text: 'BUAT', from: 236, to: 248, type: 'crimson' },
          { text: 'SEMUA', from: 248, to: 262, type: 'crimson' },
          { text: 'ORANG.', from: 262, to: 285, type: 'crimson' },
        ],
      },
    ],
  },
  // 4. Batch Allocation (285 to 380 frames = 9.50s to 12.67s)
  {
    id: 's4-doyan',
    from: 285,
    to: 380,
    badge: {
      text: 'FRESH BATCH ALLOCATION',
      color: EMERALD,
      border: `${EMERALD}80`,
      bg: 'rgba(57, 255, 136, 0.16)',
    },
    glowColor: `${EMERALD}40`,
    lines: [
      {
        size: 'medium',
        words: [
          { text: 'Ini', from: 286, to: 294, type: 'normal' },
          { text: 'tempat', from: 294, to: 304, type: 'normal' },
          { text: 'khusus', from: 304, to: 314, type: 'normal' },
          { text: 'buat', from: 314, to: 324, type: 'normal' },
          { text: 'lo', from: 324, to: 334, type: 'normal' },
        ],
      },
      {
        size: 'big',
        words: [
          { text: 'yang', from: 334, to: 342, type: 'normal' },
          { text: 'beneran', from: 342, to: 354, type: 'normal' },
          { text: 'DOYAN', from: 354, to: 366, type: 'gold' },
          { text: 'LIRA,', from: 366, to: 380, type: 'emerald' },
        ],
      },
    ],
  },
  // 5. Weekly Batch Out (380 to 475 frames = 12.67s to 15.83s)
  {
    id: 's5-kehabisan',
    from: 380,
    to: 475,
    badge: {
      text: 'GUARANTEED BATCH ACCESS',
      color: GOLD,
      border: `${GOLD}80`,
      bg: 'rgba(255, 229, 102, 0.16)',
    },
    glowColor: `${GOLD}40`,
    lines: [
      {
        size: 'medium',
        words: [
          { text: 'dan', from: 381, to: 390, type: 'normal' },
          { text: 'enggak', from: 390, to: 400, type: 'normal' },
          { text: 'mau', from: 400, to: 410, type: 'normal' },
        ],
      },
      {
        size: 'big',
        words: [
          { text: 'KEHABISAN', from: 410, to: 428, type: 'gold' },
          { text: 'BATCH', from: 428, to: 442, type: 'gold' },
          { text: 'mingguan', from: 442, to: 456, type: 'normal' },
          { text: 'lagi!', from: 456, to: 475, type: 'gold' },
        ],
      },
    ],
  },
  // 6. 24h Early Access (475 to 570 frames = 15.83s to 19.00s)
  {
    id: 's6-early',
    from: 475,
    to: 570,
    badge: {
      text: 'PRIVILEGE // 24H HEAD START',
      color: GOLD,
      border: `${GOLD}80`,
      bg: 'rgba(255, 229, 102, 0.16)',
    },
    glowColor: `${GOLD}40`,
    lines: [
      {
        size: 'big',
        words: [
          { text: 'Begitu', from: 476, to: 486, type: 'normal' },
          { text: 'lo', from: 486, to: 496, type: 'normal' },
          { text: 'join,', from: 496, to: 506, type: 'normal' },
          { text: 'lo', from: 506, to: 516, type: 'normal' },
          { text: 'dapet', from: 516, to: 526, type: 'normal' },
        ],
      },
      {
        size: 'big',
        words: [
          { text: 'AKSES', from: 526, to: 540, type: 'gold' },
          { text: '24', from: 540, to: 552, type: 'gold' },
          { text: 'JAM', from: 552, to: 562, type: 'gold' },
          { text: 'awal!', from: 562, to: 570, type: 'normal' },
        ],
      },
    ],
  },
  // 7. Fresh Batch Drop (570 to 670 frames = 19.00s to 22.33s)
  {
    id: 's7-freshdrop',
    from: 570,
    to: 670,
    badge: {
      text: 'FRESH DROP PRIVILEGE',
      color: EMERALD,
      border: `${EMERALD}80`,
      bg: 'rgba(57, 255, 136, 0.16)',
    },
    glowColor: `${EMERALD}40`,
    lines: [
      {
        size: 'medium',
        words: [
          { text: 'tiap', from: 571, to: 585, type: 'normal' },
          { text: 'kali', from: 585, to: 598, type: 'normal' },
          { text: 'FRESH', from: 598, to: 615, type: 'emerald' },
          { text: 'BATCH', from: 615, to: 630, type: 'emerald' },
        ],
      },
      {
        size: 'big',
        words: [
          { text: 'kita', from: 630, to: 645, type: 'normal' },
          { text: 'drop...', from: 645, to: 670, type: 'normal' },
        ],
      },
    ],
  },
  // 8. Sell 3 Get 1 Free (670 to 765 frames = 22.33s to 25.50s)
  {
    id: 's8-sell3get1',
    from: 670,
    to: 765,
    badge: {
      text: 'VIP REWARD PROGRAM',
      color: CYAN,
      border: `${CYAN}80`,
      bg: 'rgba(0, 240, 255, 0.16)',
    },
    glowColor: `${CYAN}40`,
    lines: [
      {
        size: 'medium',
        words: [
          { text: 'plus', from: 671, to: 684, type: 'normal' },
          { text: 'akses', from: 684, to: 698, type: 'normal' },
          { text: 'penuh', from: 698, to: 712, type: 'normal' },
        ],
      },
      {
        size: 'big',
        words: [
          { text: 'SELL', from: 712, to: 724, type: 'cyan' },
          { text: '3', from: 724, to: 734, type: 'cyan' },
          { text: 'GET', from: 734, to: 744, type: 'cyan' },
          { text: '1', from: 744, to: 754, type: 'cyan' },
          { text: 'FREE!', from: 754, to: 765, type: 'gold' },
        ],
      },
    ],
  },
  // 9. Enter Circle Call (765 to 865 frames = 25.50s to 28.83s)
  {
    id: 's9-entercircle',
    from: 765,
    to: 865,
    badge: {
      text: 'CLAIM YOUR SPOT // VIP PASS',
      color: EMERALD,
      border: `${EMERALD}80`,
      bg: 'rgba(57, 255, 136, 0.16)',
    },
    glowColor: `${EMERALD}40`,
    lines: [
      {
        size: 'big',
        words: [
          { text: 'Kalau', from: 766, to: 778, type: 'normal' },
          { text: 'lo', from: 778, to: 788, type: 'normal' },
          { text: 'mau', from: 788, to: 798, type: 'normal' },
          { text: 'masuk', from: 798, to: 808, type: 'normal' },
        ],
      },
      {
        size: 'big',
        words: [
          { text: 'ke', from: 808, to: 818, type: 'normal' },
          { text: 'CIRCLE', from: 818, to: 835, type: 'gold' },
          { text: 'dalam', from: 835, to: 848, type: 'normal' },
          { text: 'LIRA,', from: 848, to: 865, type: 'emerald' },
        ],
      },
    ],
  },
  // 10. Final CTA Action (865 to 960 frames = 28.83s to 32.00s)
  {
    id: 's10-cta',
    from: 865,
    to: 960,
    badge: {
      text: 'INSTANT ACCESS // LIMITED SLOTS',
      color: GOLD,
      border: `${GOLD}80`,
      bg: 'rgba(255, 229, 102, 0.16)',
    },
    glowColor: `${GOLD}40`,
    lines: [
      {
        size: 'big',
        words: [
          { text: 'DM', from: 866, to: 878, type: 'crimson' },
          { text: 'FAM,', from: 878, to: 894, type: 'crimson' },
          { text: 'click', from: 894, to: 906, type: 'normal' },
          { text: 'LINK', from: 906, to: 920, type: 'gold' },
        ],
      },
      {
        size: 'big',
        words: [
          { text: 'di', from: 920, to: 930, type: 'normal' },
          { text: 'bio', from: 930, to: 940, type: 'normal' },
          { text: 'SEKARANG', from: 940, to: 950, type: 'gold' },
          { text: 'JUGA!', from: 950, to: 960, type: 'gold' },
        ],
      },
    ],
  },
];

// ----------------------------------------------------------------------------
// KINETIC WORD COMPONENT (With Spring Scale & Multi-Layer Outline Shield)
// ----------------------------------------------------------------------------
const KineticWord: React.FC<{
  word: TimedWord;
  frame: number;
}> = ({ word, frame }) => {
  if (frame < word.from) return null;

  const wordAge = frame - word.from;
  const wordPop = spring({
    frame: wordAge,
    fps: 30,
    config: { damping: 16, stiffness: 220, mass: 0.5 },
  });

  const isCurrentlySpoken = frame >= word.from && frame <= word.to;

  let color = IVORY;
  let fontFamily = FONT_SANS;
  let textTransform: 'none' | 'uppercase' = 'none';
  let activeGlowColor = 'rgba(255, 255, 255, 0.4)';

  if (word.type === 'gold') {
    color = GOLD;
    fontFamily = FONT_PIXEL;
    textTransform = 'uppercase';
    activeGlowColor = GOLD;
  } else if (word.type === 'emerald') {
    color = EMERALD;
    fontFamily = FONT_PIXEL;
    textTransform = 'uppercase';
    activeGlowColor = EMERALD;
  } else if (word.type === 'crimson') {
    color = CRIMSON;
    fontFamily = FONT_PIXEL;
    textTransform = 'uppercase';
    activeGlowColor = CRIMSON;
  } else if (word.type === 'cyan') {
    color = CYAN;
    fontFamily = FONT_PIXEL;
    textTransform = 'uppercase';
    activeGlowColor = CYAN;
  }

  if (isCurrentlySpoken) {
    color = ACTIVE;
    activeGlowColor = ACTIVE;
  }

  const finalScale = isCurrentlySpoken ? wordPop * 1.08 : wordPop;

  const multiLayerShadow = [
    '-2px -2px 0 #000',
    '2px -2px 0 #000',
    '-2px 2px 0 #000',
    '2px 2px 0 #000',
    '0 4px 16px rgba(0, 0, 0, 0.98)',
    '0 2px 6px rgba(0, 0, 0, 0.95)',
    `0 0 24px ${activeGlowColor}`,
  ].join(', ');

  return (
    <span
      style={{
        display: 'inline-block',
        fontFamily,
        color,
        textTransform,
        marginRight: '0.28em',
        transform: `scale(${finalScale})`,
        transformOrigin: 'center bottom',
        textShadow: multiLayerShadow,
        WebkitTextStroke: '1px rgba(0, 0, 0, 0.85)',
        letterSpacing: fontFamily === FONT_PIXEL ? '0.04em' : '-0.02em',
      }}
    >
      {word.text}
    </span>
  );
};

// ----------------------------------------------------------------------------
// GLASS STATUS PILL COMPONENT (Top-Right HUD)
// ----------------------------------------------------------------------------
const GlassPill: React.FC<{
  dot: string;
  label: string;
  tag: string;
  tagColor?: string;
}> = ({ dot, label, tag, tagColor = GOLD }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 16px',
      borderRadius: 999,
      backgroundColor: 'rgba(8, 12, 16, 0.88)',
      border: '1.5px solid rgba(255, 255, 255, 0.14)',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
    }}
  >
    <div
      style={{
        width: 8,
        height: 8,
        borderRadius: 999,
        backgroundColor: dot,
        boxShadow: `0 0 10px ${dot}`,
      }}
    />
    <span
      style={{
        fontFamily: FONT_PIXEL,
        fontSize: 12,
        color: '#E2E8F0',
        letterSpacing: 1.2,
      }}
    >
      {label}
    </span>
    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>•</span>
    <span
      style={{
        fontFamily: FONT_PIXEL,
        fontSize: 12,
        color: tagColor,
        letterSpacing: 1.2,
        textShadow: `0 0 8px ${tagColor}`,
      }}
    >
      {tag}
    </span>
  </div>
);

// ============================================================================
// MAIN COMPOSITION
// ============================================================================
export const Video4_VIPClub: React.FC = () => {
  const frame = useCurrentFrame();

  // Active scene (changes every ~3 seconds)
  const scene =
    SCENES.find((s) => frame >= s.from && frame < s.to) ?? SCENES[SCENES.length - 1];

  // Local frame within current scene
  const localFrame = frame - scene.from;

  // 1. First 3 Seconds Pattern Interruption: Micro-Crash Zoom
  const hookZoom = interpolate(frame, [0, 20], [1.14, 1.0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 2. Continuous Fluid Camera Tracking Push-In per Scene
  const scenePush = interpolate(localFrame, [0, scene.to - scene.from], [1.0, 1.04], {
    extrapolateRight: 'clamp',
  });

  // Natural human breathing rhythm & subtle horizontal camera drift
  const breathe = Math.sin((frame / 50) * Math.PI) * 2.0;
  const driftX = Math.sin((frame / 120) * Math.PI) * 3.0;

  // Scene transition white flash sweep at major unlocks (Scene 1->2 at f95, Scene 6->7 at f570)
  const isMajorTransition =
    (frame >= 93 && frame <= 100) || (frame >= 568 && frame <= 576);
  const transitionFlash = isMajorTransition ? 0.6 : 0;

  // 3. Dynamic Audio Ducking: Background music ducks during speech (-17dB), swells during pauses (+5dB)
  const isDialoguePause =
    (frame >= 90 && frame < 98) ||
    (frame >= 185 && frame < 193) ||
    (frame >= 280 && frame < 288) ||
    (frame >= 375 && frame < 383) ||
    (frame >= 470 && frame < 478) ||
    (frame >= 565 && frame < 573) ||
    (frame >= 665 && frame < 673) ||
    (frame >= 760 && frame < 768) ||
    frame >= 948;

  const bgMusicVolume = isDialoguePause ? 0.28 : 0.14;

  // Active caption group
  const activeGroup = CAPTION_GROUPS.find(
    (g) => frame >= g.from && frame < g.to
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#060606', overflow: 'hidden' }}>
      {/* Offline Font Definition */}
      <style dangerouslySetInnerHTML={{ __html: FONT_STYLE }} />

      {/* ================= AUDIO CHANNELS & DYNAMIC DUCKING ================= */}
      {/* 1. Voiceover (Master dialogue audio) */}
      <Audio
        src={staticFile('assets/voiceover_innercircle.mp3')}
        volume={1.0}
      />

      {/* 2. Ambient Lo-Fi Background Music (Dynamic Ducking) */}
      <Audio
        src={staticFile('assets/bg_music.mp3')}
        volume={bgMusicVolume}
        loop
      />

      {/* 3. Tactile Foley & SFX Synchronized to Every Scene Cut (~3 seconds) */}
      {/* Scene 1 (f0): Pattern Interruption Sub-Thud + Whoosh */}
      <Sequence from={0} durationInFrames={35}>
        <Audio src={staticFile('assets/sfx/sub_hit.mp3')} volume={0.7} />
      </Sequence>
      <Sequence from={1} durationInFrames={40}>
        <Audio src={staticFile('assets/sfx/whoosh.mp3')} volume={0.5} />
      </Sequence>
      {/* Scene 2 (f95): Snap on Phone Invitation */}
      <Sequence from={95} durationInFrames={30}>
        <Audio src={staticFile('assets/sfx/snap.mp3')} volume={0.6} />
      </Sequence>
      {/* Scene 3 (f190): Alarm Caution on Restricted Access */}
      <Sequence from={190} durationInFrames={35}>
        <Audio src={staticFile('assets/sfx/alarm.mp3')} volume={0.4} />
      </Sequence>
      {/* Scene 4 (f285): Sub-hit on Artisan Pouring */}
      <Sequence from={285} durationInFrames={35}>
        <Audio src={staticFile('assets/sfx/sub_hit.mp3')} volume={0.5} />
      </Sequence>
      {/* Scene 5 (f380): Mechanical Click on Database */}
      <Sequence from={380} durationInFrames={30}>
        <Audio src={staticFile('assets/sfx/snap.mp3')} volume={0.55} />
      </Sequence>
      {/* Scene 6 (f475): Thud on Running Delivery */}
      <Sequence from={475} durationInFrames={35}>
        <Audio src={staticFile('assets/sfx/thud.mp3')} volume={0.55} />
      </Sequence>
      {/* Scene 7 (f570): Padlock Unlock & Flash Sweep into VIP Lounge */}
      <Sequence from={570} durationInFrames={30}>
        <Audio src={staticFile('assets/sfx/snap.mp3')} volume={0.75} />
      </Sequence>
      <Sequence from={572} durationInFrames={40}>
        <Audio src={staticFile('assets/sfx/whoosh.mp3')} volume={0.55} />
      </Sequence>
      {/* Scene 8 (f670): Sub-hit on Buy 3 Get 1 Free */}
      <Sequence from={670} durationInFrames={35}>
        <Audio src={staticFile('assets/sfx/sub_hit.mp3')} volume={0.5} />
      </Sequence>
      {/* Scene 9 (f765): Impact on Hero Pointing Pose */}
      <Sequence from={765} durationInFrames={40}>
        <Audio src={staticFile('assets/sfx/impact.mp3')} volume={0.6} />
      </Sequence>
      {/* Scene 10 (f865): Final Impact on Community Ritual CTA */}
      <Sequence from={865} durationInFrames={45}>
        <Audio src={staticFile('assets/sfx/impact.mp3')} volume={0.6} />
      </Sequence>

      {/* ================= VISUAL SCENE BACKGROUND ================= */}
      <AbsoluteFill
        style={{
          filter: scene.grade,
          transform: `scale(${hookZoom * scenePush}) translate(${driftX}px, ${breathe}px)`,
          imageRendering: 'pixelated',
        }}
      >
        <Img
          src={staticFile(scene.asset)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            imageRendering: 'pixelated',
          }}
        />

        {/* Cinematic Atmospheric Lighting Wash */}
        <AbsoluteFill
          style={{
            background: scene.lighting,
            mixBlendMode: 'screen',
            pointerEvents: 'none',
          }}
        />

        {/* Scene 1: Floating Golden Key Radiant Halo & Orbiting Sparkle Stars */}
        {scene.id === 1 && (
          <div
            style={{
              position: 'absolute',
              top: '5%',
              left: '42%',
              width: 220,
              height: 120,
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: -20,
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(255, 229, 102, 0.35) 0%, rgba(255, 200, 50, 0.10) 45%, transparent 70%)',
                opacity: Math.sin((frame / 16) * Math.PI) * 0.2 + 0.8,
                mixBlendMode: 'screen',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 20 + Math.sin((frame / 12) * Math.PI) * 8,
                left: 10 + Math.cos((frame / 12) * Math.PI) * 12,
                color: GOLD,
                fontSize: 16,
                textShadow: `0 0 12px ${GOLD}`,
                opacity: Math.sin((frame / 8) * Math.PI) * 0.3 + 0.7,
              }}
            >
              ✦
            </div>
            <div
              style={{
                position: 'absolute',
                top: 40 + Math.cos((frame / 15) * Math.PI) * 10,
                right: 15 + Math.sin((frame / 15) * Math.PI) * 10,
                color: '#FFF8B0',
                fontSize: 14,
                textShadow: `0 0 10px ${GOLD}`,
                opacity: Math.cos((frame / 10) * Math.PI) * 0.3 + 0.7,
              }}
            >
              •
            </div>
          </div>
        )}
      </AbsoluteFill>

      {/* Transition Flash Sweep */}
      {transitionFlash > 0 && (
        <AbsoluteFill
          style={{
            backgroundColor: `rgba(255, 255, 255, ${transitionFlash})`,
            pointerEvents: 'none',
            zIndex: 35,
          }}
        />
      )}

      {/* ================= HUD STATUS PILL (TOP-RIGHT) ================= */}
      <div style={{ position: 'absolute', top: 54, right: 48, zIndex: 40 }}>
        <GlassPill
          dot={scene.tagColor}
          label={scene.label}
          tag={scene.tag}
          tagColor={scene.tagColor}
        />
      </div>

      {/* ================= EVERY CTA IS CENTERED IN THE MIDDLE ================= */}
      {/* Scene 1 (0-95f): Centered VIP Broadcast Channel Card */}
      {scene.id === 1 && (
        <div
          style={{
            position: 'absolute',
            top: 130,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 42,
            width: 720,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: 'rgba(8, 12, 18, 0.92)',
              border: `2px solid ${GOLD}`,
              borderRadius: 14,
              padding: '12px 28px',
              boxShadow: `0 0 35px ${GOLD}35, 0 10px 30px rgba(0,0,0,0.85)`,
              backdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div>
              <div style={{ fontFamily: FONT_PIXEL, fontSize: 12, color: GOLD, letterSpacing: 1.5 }}>
                EXCLUSIVE BROADCAST CHANNEL
              </div>
              <div style={{ fontFamily: FONT_SANS, fontSize: 18, fontWeight: 900, color: '#FFFFFF' }}>
                Lira Fam // Inner Circle
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scene 2 (95-190f): Centered Instagram Invitation Access Badge */}
      {scene.id === 2 && (
        <div
          style={{
            position: 'absolute',
            top: 130,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 42,
            width: 720,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: 'rgba(8, 14, 20, 0.94)',
              border: `2px solid ${EMERALD}`,
              borderRadius: 14,
              padding: '12px 28px',
              boxShadow: `0 0 35px ${EMERALD}40`,
              backdropFilter: 'blur(12px)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontFamily: FONT_PIXEL, fontSize: 12, color: EMERALD, letterSpacing: 1.5 }}>
              BROADCAST INVITATION ACTIVE
            </div>
            <div style={{ fontFamily: FONT_SANS, fontSize: 18, fontWeight: 900, color: '#FFFFFF', marginTop: 2 }}>
              Instagram: @drinklira
            </div>
          </div>
        </div>
      )}

      {/* Scene 3 (190-285f): Centered Restricted Access Warning */}
      {scene.id === 3 && (
        <div
          style={{
            position: 'absolute',
            top: 130,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 42,
            width: 720,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: 'rgba(20, 6, 12, 0.95)',
              border: `2px solid ${CRIMSON}`,
              borderRadius: 14,
              padding: '12px 28px',
              boxShadow: `0 0 40px ${CRIMSON}50`,
              backdropFilter: 'blur(12px)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontFamily: FONT_PIXEL, fontSize: 12, color: CRIMSON, letterSpacing: 1.5 }}>
              RESTRICTED ENTRY // NOT FOR EVERYONE
            </div>
            <div style={{ fontFamily: FONT_SANS, fontSize: 18, fontWeight: 900, color: '#FFFFFF', marginTop: 2 }}>
              Reserved Exclusively for Regulars
            </div>
          </div>
        </div>
      )}

      {/* Scene 4 (285-380f): Centered Small-Batch Craft Tracker */}
      {scene.id === 4 && (
        <div
          style={{
            position: 'absolute',
            top: 130,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 42,
            width: 720,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: 'rgba(8, 16, 12, 0.94)',
              border: `2px solid ${EMERALD}`,
              borderRadius: 14,
              padding: '12px 28px',
              boxShadow: `0 0 35px ${EMERALD}40`,
              backdropFilter: 'blur(12px)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontFamily: FONT_PIXEL, fontSize: 12, color: EMERALD, letterSpacing: 1.5 }}>
              ARTISAN CRAFT // 100% REAL INGREDIENTS
            </div>
            <div style={{ fontFamily: FONT_SANS, fontSize: 18, fontWeight: 900, color: '#FFFFFF', marginTop: 2 }}>
              Fresh Brewed Every Saturday
            </div>
          </div>
        </div>
      )}

      {/* Scene 5 (380-475f): Centered Weekly Drop Tracker with Authentic Real Bottles */}
      {scene.id === 5 && (
        <div
          style={{
            position: 'absolute',
            top: 130,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 42,
            width: 680,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: 'rgba(8, 12, 18, 0.94)',
              border: `2px solid ${GOLD}`,
              borderRadius: 14,
              padding: '14px 24px',
              boxShadow: `0 0 35px ${GOLD}35`,
              backdropFilter: 'blur(12px)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontFamily: FONT_PIXEL, fontSize: 12, color: GOLD, letterSpacing: 1.5, marginBottom: 8 }}>
              WEEKLY DROP TRACKER
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Img src={staticFile('assets/matcha.png')} style={{ height: 100, objectFit: 'contain' }} />
                <span style={{ fontFamily: FONT_PIXEL, fontSize: 10, color: EMERALD, marginTop: 4 }}>MATCHA</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Img src={staticFile('assets/choco.png')} style={{ height: 100, objectFit: 'contain' }} />
                <span style={{ fontFamily: FONT_PIXEL, fontSize: 10, color: GOLD, marginTop: 4 }}>CHOCO</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Img src={staticFile('assets/milktea.png')} style={{ height: 100, objectFit: 'contain' }} />
                <span style={{ fontFamily: FONT_PIXEL, fontSize: 10, color: CYAN, marginTop: 4 }}>MILK TEA</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scene 6 (475-570f): Centered 24h Early Access Window */}
      {scene.id === 6 && (
        <div
          style={{
            position: 'absolute',
            top: 130,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 42,
            width: 720,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: 'rgba(8, 12, 18, 0.95)',
              border: `2px solid ${GOLD}`,
              borderRadius: 14,
              padding: '14px 28px',
              boxShadow: `0 0 35px ${GOLD}40`,
              backdropFilter: 'blur(12px)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontFamily: FONT_PIXEL, fontSize: 12, color: GOLD, letterSpacing: 1.5 }}>
              INNER CIRCLE PRIVILEGE
            </div>
            <div style={{ fontFamily: FONT_SANS, fontSize: 19, fontWeight: 900, color: '#FFFFFF', marginTop: 2 }}>
              24-Hour Head Start Access
            </div>
            <div style={{ fontFamily: FONT_PIXEL, fontSize: 11, color: EMERALD, marginTop: 4 }}>
              T-24:00:00 VIP RESERVATION WINDOW
            </div>
          </div>
        </div>
      )}

      {/* Scene 7 (570-670f): Centered VIP Lounge Welcome Banner */}
      {scene.id === 7 && (
        <div
          style={{
            position: 'absolute',
            top: 130,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 42,
            width: 720,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: 'rgba(8, 16, 24, 0.94)',
              border: `2px solid ${CYAN}`,
              borderRadius: 14,
              padding: '14px 28px',
              boxShadow: `0 0 35px ${CYAN}40`,
              backdropFilter: 'blur(12px)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontFamily: FONT_PIXEL, fontSize: 12, color: CYAN, letterSpacing: 1.5 }}>
              WELCOME TO INNER CIRCLE
            </div>
            <div style={{ fontFamily: FONT_SANS, fontSize: 19, fontWeight: 900, color: '#FFFFFF', marginTop: 2 }}>
              Exclusive Members-Only Lounge
            </div>
          </div>
        </div>
      )}

      {/* Scene 8 (670-765f): Centered Sell 3 Get 1 Free Banner */}
      {scene.id === 8 && (
        <div
          style={{
            position: 'absolute',
            top: 130,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 42,
            width: 720,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: 'rgba(8, 14, 22, 0.95)',
              border: `2px solid ${GOLD}`,
              borderRadius: 14,
              padding: '14px 28px',
              boxShadow: `0 0 35px ${GOLD}40`,
              backdropFilter: 'blur(12px)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontFamily: FONT_PIXEL, fontSize: 12, color: GOLD, letterSpacing: 1.5 }}>
              AUTOMATIC MEMBER REWARD
            </div>
            <div style={{ fontFamily: FONT_SANS, fontSize: 20, fontWeight: 900, color: '#FFFFFF', marginTop: 2 }}>
              SELL 3 → GET 1 FREE
            </div>
          </div>
        </div>
      )}

      {/* Scene 9 (765-865f): Centered Primary CTA: DM "FAM" */}
      {scene.id === 9 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 45,
            width: 820,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
          }}
        >
          {/* Eyebrow badge */}
          <div
            style={{
              background: 'rgba(10, 14, 22, 0.96)',
              border: `2px solid ${CRIMSON}`,
              borderRadius: 999,
              padding: '8px 24px',
              fontFamily: FONT_PIXEL,
              fontSize: 13,
              color: '#FF6B6B',
              letterSpacing: 2,
              boxShadow: `0 0 30px ${CRIMSON}60`,
              textTransform: 'uppercase',
            }}
          >
            CLAIM YOUR SPOT // VIP PASS
          </div>

          {/* Big Center Instagram DM Card */}
          <div
            style={{
              background: 'rgba(8, 12, 20, 0.96)',
              border: `3px solid ${GOLD}`,
              borderRadius: 22,
              padding: '24px 36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 20,
              width: '100%',
              boxShadow: `0 0 50px ${GOLD}60, 0 20px 40px rgba(0,0,0,0.9)`,
              backdropFilter: 'blur(16px)',
              transform: `scale(${1 + Math.sin(frame / 6) * 0.02})`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 16, color: GOLD, fontWeight: 900 }}>[DM]</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontFamily: FONT_PIXEL, fontSize: 13, color: GOLD, letterSpacing: 1.5 }}>
                  DM INSTAGRAM @DRINKLIRA
                </span>
                <span style={{ fontFamily: FONT_SANS, fontSize: 16, color: '#FFFFFF', fontWeight: 800 }}>
                  Ketik pesan rahasia:
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  background: 'rgba(0,0,0,0.85)',
                  border: `2.5px solid ${GOLD}`,
                  borderRadius: 12,
                  padding: '12px 28px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: `0 0 25px ${GOLD}35 inset`,
                }}
              >
                <span style={{ fontFamily: FONT_PIXEL, fontSize: 28, color: GOLD, fontWeight: 900, letterSpacing: 2 }}>
                  "FAM"
                </span>
                <span
                  style={{
                    fontFamily: FONT_PIXEL,
                    fontSize: 28,
                    color: GOLD,
                    opacity: Math.floor((frame / 8) % 2) === 0 ? 1 : 0,
                  }}
                >
                  |
                </span>
              </div>
              <div
                style={{
                  background: `linear-gradient(135deg, ${GOLD}, #FFA000)`,
                  color: '#000000',
                  fontFamily: FONT_PIXEL,
                  fontSize: 15,
                  padding: '14px 24px',
                  borderRadius: 12,
                  fontWeight: 900,
                  letterSpacing: 1,
                  boxShadow: `0 0 25px ${GOLD}90`,
                }}
              >
                SEND →
              </div>
            </div>
          </div>

          {/* Quick alternative pill */}
          <div
            style={{
              background: 'rgba(10, 14, 22, 0.94)',
              border: `1.5px solid ${EMERALD}80`,
              borderRadius: 999,
              padding: '8px 24px',
              fontFamily: FONT_PIXEL,
              fontSize: 11,
              color: EMERALD,
              letterSpacing: 1.5,
              boxShadow: `0 0 20px ${EMERALD}40`,
            }}
          >
            ATAU CLICK LINK IN BIO
          </div>
        </div>
      )}

      {/* Scene 10 (865-960f): Dead-Center Hero CTAs ("Click link in bio" & "DM 'FAM'") */}
      {scene.id === 10 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 45,
            width: 860,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 18,
          }}
        >
          {/* Eyebrow badge */}
          <div
            style={{
              background: 'rgba(10, 14, 22, 0.96)',
              border: `2px solid ${EMERALD}`,
              borderRadius: 999,
              padding: '8px 26px',
              fontFamily: FONT_PIXEL,
              fontSize: 13,
              color: EMERALD,
              letterSpacing: 2,
              boxShadow: `0 0 30px ${EMERALD}50`,
            }}
          >
            JOIN LIRA FAM // LIMITED SPOTS
          </div>

          {/* 1. Primary Giant Centered Button: CLICK LINK IN BIO */}
          <div
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #10B981, #059669)',
              border: `3.5px solid #6EE7B7`,
              borderRadius: 22,
              padding: '22px 36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 18,
              boxShadow: `0 0 55px rgba(52, 211, 153, 0.8), 0 20px 45px rgba(0,0,0,0.9)`,
              transform: `scale(${1 + Math.sin(frame / 6) * 0.03})`,
            }}
          >
            <span
              style={{
                fontFamily: FONT_SANS,
                fontSize: 32,
                fontWeight: 900,
                color: '#FFFFFF',
                letterSpacing: 2,
                textTransform: 'uppercase',
                textShadow: '0 4px 12px rgba(0,0,0,0.85)',
              }}
            >
              CLICK LINK IN BIO
            </span>
          </div>

          {/* "OR" Divider with retro styling */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, width: '60%' }}>
            <div style={{ flex: 1, height: 2, background: 'rgba(255, 229, 102, 0.4)' }} />
            <div
              style={{
                background: 'rgba(10, 14, 22, 0.95)',
                border: '1px solid rgba(255, 229, 102, 0.5)',
                borderRadius: 999,
                padding: '3px 14px',
                fontFamily: FONT_PIXEL,
                fontSize: 11,
                color: GOLD,
                letterSpacing: 2,
              }}
            >
              ATAU
            </div>
            <div style={{ flex: 1, height: 2, background: 'rgba(255, 229, 102, 0.4)' }} />
          </div>

          {/* 2. Secondary Centered Button: DM "FAM" */}
          <div
            style={{
              width: '100%',
              background: 'rgba(10, 14, 24, 0.95)',
              border: `2.5px solid ${GOLD}`,
              borderRadius: 20,
              padding: '18px 32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              boxShadow: `0 0 40px ${GOLD}50, 0 16px 36px rgba(0,0,0,0.85)`,
              backdropFilter: 'blur(16px)',
            }}
          >
            <span
              style={{
                fontFamily: FONT_SANS,
                fontSize: 26,
                fontWeight: 900,
                color: GOLD,
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              DM "FAM" KE @DRINKLIRA
            </span>
          </div>
        </div>
      )}

      {/* ================= DYNAMIC WORD-BY-WORD POP CAPTION SYSTEM ================= */}
      {/* Centered in lower portion of video canvas (top: 1070px), borderless, floating directly on video */}
      {activeGroup && (
        <div
          style={{
            position: 'absolute',
            top: 1070,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 980,
            textAlign: 'center',
            zIndex: 50,
          }}
        >
          {/* Badge */}
          {activeGroup.badge && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 18px',
                borderRadius: 999,
                backgroundColor: activeGroup.badge.bg,
                border: `1.5px solid ${activeGroup.badge.border}`,
                color: activeGroup.badge.color,
                fontFamily: FONT_PIXEL,
                fontSize: 13,
                letterSpacing: 1.5,
                marginBottom: 16,
                boxShadow: `0 0 22px ${activeGroup.glowColor || 'rgba(255,255,255,0.2)'}`,
              }}
            >
              {activeGroup.badge.text}
            </div>
          )}

          {/* Caption Lines with Word-by-Word Reveal */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {activeGroup.lines.map((line, lIdx) => {
              const fontSize =
                line.size === 'big' ? 38 : line.size === 'medium' ? 30 : 22;
              const lineHeight = line.size === 'big' ? 1.25 : 1.3;

              return (
                <div
                  key={lIdx}
                  style={{
                    fontSize,
                    lineHeight,
                    fontWeight: 800,
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'baseline',
                  }}
                >
                  {line.words.map((word, wIdx) => (
                    <KineticWord
                      key={wIdx}
                      word={word}
                      frame={frame}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
