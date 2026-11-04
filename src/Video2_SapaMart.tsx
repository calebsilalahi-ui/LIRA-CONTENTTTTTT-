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
  OffthreadVideo,
} from 'remotion';

// ============================================================================
// VIDEO 2 — SAPA MART BLACKOUT (31.8s @ 30fps = 954 frames, 1080x1440)
// Timings are aligned to the silence gaps detected in voiceover_sapamart.mp3:
//   0.97 | 4.82–5.44 | 7.23 | 9.02–9.49 | 9.96–10.21 | 16.08–16.48 |
//   21.76–22.12 | 22.60–22.89 | 28.27–28.59 | 29.91–30.14 | 31.55
// ============================================================================

export const SAPA_DURATION = 954;
const FPS = 30;
const sec = (s: number) => Math.round(s * FPS);

// Palette (cinematic premium)
const GOLD = '#F5D061';
const EMERALD = '#A8E05F';
const CRIMSON = '#FF4D54';
const IVORY = '#FAF7F0';
const ACTIVE = '#FFE07D';

// ----------------------------------------------------------------------------
// SCENES
// ----------------------------------------------------------------------------
type LogoStamp = { x: number; y: number; d: number }; // % of frame (center x/y, diameter as % of width)

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
  logosA?: LogoStamp[];
  logosB?: LogoStamp[];
}

const SCENES: SceneConfig[] = [
  {
    id: 1,
    from: 0,
    to: 163,
    frameA: 'assets/pixel/sapa/s1_storefront_a.jpg',
    frameB: 'assets/pixel/sapa/s1_storefront_b.jpg',
    topLeft: 'SAPA MART  •  RETAIL UPDATE',
    topRight: 'SCENE 01 / 06',
    bottomNote: 'LIRA  •  OFFICIAL ANNOUNCEMENT',
    grade: 'contrast(1.08) saturate(1.04) brightness(0.95)',
    lighting:
      'radial-gradient(circle at 50% 30%, rgba(255, 70, 70, 0.10) 0%, rgba(10, 12, 24, 0.30) 75%)',
  },
  {
    id: 2,
    from: 163,
    to: 285,
    frameA: 'assets/pixel/sapa/s2_chiller_a.jpg',
    frameB: 'assets/pixel/sapa/s2_chiller_b.jpg',
    topLeft: 'SAPA MART CHILLER  •  0 STOCK',
    topRight: 'SCENE 02 / 06',
    bottomNote: 'RETAIL SHELVES  •  EMPTY ON PURPOSE',
    grade: 'contrast(1.07) saturate(1.0) brightness(0.96)',
    lighting:
      'radial-gradient(circle at 45% 40%, rgba(220, 240, 255, 0.10) 0%, rgba(10, 14, 22, 0.30) 100%)',
  },
  {
    id: 3,
    from: 285,
    to: 494,
    frameA: 'assets/pixel/sapa/s3_strategy_a.jpg',
    frameB: 'assets/pixel/sapa/s3_strategy_b.jpg',
    topLeft: 'STRATEGIC MOVE  •  FOR REGULARS',
    topRight: 'SCENE 03 / 06',
    bottomNote: 'BUILT FOR THE PEOPLE WHO STAYED',
    grade: 'contrast(1.08) saturate(1.03) brightness(0.95)',
    lighting:
      'radial-gradient(circle at 60% 35%, rgba(255, 200, 120, 0.14) 0%, rgba(8, 8, 12, 0.36) 100%)',
  },
  {
    id: 4,
    from: 494,
    to: 663,
    frameA: 'assets/pixel/sapa/s4_referral_a.jpg',
    frameB: 'assets/pixel/sapa/s4_referral_b.jpg',
    topLeft: 'COMING SOON  •  INSIDER REWARDS',
    topRight: 'SCENE 04 / 06',
    bottomNote: 'SHARE LIRA  •  GET REWARDED',
    grade: 'contrast(1.06) saturate(1.06) brightness(0.98)',
    lighting:
      'linear-gradient(135deg, rgba(255, 220, 145, 0.18) 0%, rgba(168, 224, 95, 0.05) 50%, rgba(10, 12, 10, 0.28) 100%)',
  },
  {
    id: 5,
    from: 663,
    to: 857,
    frameA: 'assets/pixel/sapa/s5_batch_a.jpg',
    frameB: 'assets/pixel/sapa/s5_batch_b.jpg',
    topLeft: 'DIRECT BATCH  •  FRESHLY BREWED',
    topRight: 'SCENE 05 / 06',
    bottomNote: 'MATCHA  •  CHOCO  •  MILK TEA',
    grade: 'contrast(1.07) saturate(1.04) brightness(0.97)',
    lighting:
      'radial-gradient(circle at 68% 30%, rgba(255, 244, 214, 0.16) 0%, rgba(12, 16, 22, 0.24) 100%)',
  },
  {
    id: 6,
    from: 857,
    to: 954,
    frameA: 'assets/pixel/scene_7_ritual_a.jpg',
    frameB: 'assets/pixel/scene_7_ritual_a.jpg',
    topLeft: 'LIMITED WEEKLY SLOTS  •  @DRINKLIRA',
    topRight: 'SCENE 06 / 06',
    bottomNote: 'IG: @DRINKLIRA  •  LINK IN BIO',
    grade: 'contrast(1.06) saturate(1.06) brightness(0.96)',
    lighting:
      'linear-gradient(135deg, rgba(255, 220, 145, 0.16) 0%, rgba(168, 224, 95, 0.05) 50%, rgba(10, 12, 10, 0.34) 100%)',
  },
];

// ----------------------------------------------------------------------------
// CAPTIONS — markup: ^gold  ~emerald  !crimson (prefix on a word)
// Each line's words are distributed across [start, end] by character length.
// ----------------------------------------------------------------------------
type LineSize = 'big' | 'small';
interface CaptionLine {
  text: string;
  start: number; // seconds
  end: number; // seconds
  size: LineSize;
}
interface CaptionCard {
  from: number; // seconds
  to: number; // seconds
  lines: CaptionLine[];
}

const CARDS: CaptionCard[] = [
  {
    from: 0,
    to: 2.45,
    lines: [
      { text: 'MULAI ^HARI ^INI,', start: 0.05, end: 0.95, size: 'big' },
      { text: 'stok ~Lira di !Sapa !Mart', start: 1.17, end: 2.45, size: 'small' },
    ],
  },
  {
    from: 2.45,
    to: 5.44,
    lines: [
      { text: 'RESMI !BLACKOUT', start: 2.45, end: 3.4, size: 'big' },
      { text: 'selama ^dua ^minggu ke depan.', start: 3.4, end: 4.82, size: 'small' },
    ],
  },
  {
    from: 5.44,
    to: 9.49,
    lines: [
      { text: 'NYARI ~LIRA ^DI ^SANA?', start: 5.44, end: 7.23, size: 'big' },
      { text: 'lo nggak bakal nemuin !satu !botol pun.', start: 7.42, end: 9.02, size: 'small' },
    ],
  },
  {
    from: 9.49,
    to: 12.79,
    lines: [
      { text: '^KENAPA?', start: 9.49, end: 9.96, size: 'big' },
      { text: 'Karena kita sengaja !tarik !stok ~retail', start: 10.8, end: 12.79, size: 'small' },
    ],
  },
  {
    from: 12.79,
    to: 16.48,
    lines: [
      { text: 'buat fokus ngebangun sesuatu yang', start: 12.79, end: 14.6, size: 'small' },
      { text: '^SPESIAL KHUSUS ~REGULARS!', start: 14.6, end: 16.08, size: 'big' },
    ],
  },
  {
    from: 16.48,
    to: 22.12,
    lines: [
      { text: "Let's just say, ^bentar ^lagi lo bisa", start: 16.48, end: 18.42, size: 'small' },
      { text: 'DAPET ^REWARD & ~KOMISI', start: 18.42, end: 19.71, size: 'big' },
      { text: 'tiap kali ngeracunin ~Lira ke temen lo.', start: 19.71, end: 21.76, size: 'small' },
    ],
  },
  {
    from: 22.12,
    to: 25.4,
    lines: [
      { text: 'TAPI ~TENANG,', start: 22.12, end: 22.6, size: 'big' },
      { text: 'buat yang mau tetep ^nyetok, lo masih bisa order', start: 22.89, end: 25.4, size: 'small' },
    ],
  },
  {
    from: 25.4,
    to: 28.59,
    lines: [
      { text: '^DIRECT ^BATCH ~FRESHLY ~BREWED', start: 25.4, end: 26.86, size: 'big' },
      { text: 'secara ^eksklusif lewat ~bio.', start: 26.86, end: 28.27, size: 'small' },
    ],
  },
  {
    from: 28.59,
    to: 31.8,
    lines: [
      { text: 'SLOT MINGGUAN !TERBATAS.', start: 28.59, end: 29.91, size: 'big' },
      { text: '^Click ^link in ~bio right now.', start: 30.14, end: 31.55, size: 'small' },
    ],
  },
];

type Hl = 'gold' | 'emerald' | 'crimson' | 'ivory';
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
  ivory: IVORY,
};

// Mouth/pose activity: speech segments (seconds)
const SPEECH: [number, number][] = [
  [0.0, 0.97],
  [1.17, 4.82],
  [5.44, 7.23],
  [7.42, 9.02],
  [9.49, 9.96],
  [10.21, 16.08],
  [16.48, 21.76],
  [22.12, 22.6],
  [22.89, 28.27],
  [28.59, 29.91],
  [30.14, 31.55],
];

// ----------------------------------------------------------------------------
// TRANSITIONS — optical dissolve + horizontal light-leak sweep (no flashing)
// ----------------------------------------------------------------------------
const TRANSITIONS = [
  { frame: 163, color: 'rgba(255, 90, 90, 0.20)' },
  { frame: 285, color: 'rgba(245, 208, 97, 0.22)' },
  { frame: 494, color: 'rgba(168, 224, 95, 0.22)' },
  { frame: 663, color: 'rgba(255, 244, 214, 0.22)' },
  { frame: 857, color: 'rgba(245, 208, 97, 0.26)' },
];

const TransitionOverlay: React.FC<{ frame: number }> = ({ frame }) => {
  const t = TRANSITIONS.find((x) => frame >= x.frame - 7 && frame <= x.frame + 8);
  if (!t) return null;
  const progress = interpolate(frame, [t.frame - 7, t.frame, t.frame + 8], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const sweepX = interpolate(frame, [t.frame - 7, t.frame + 8], [-40, 140], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill
      style={{
        zIndex: 90,
        pointerEvents: 'none',
        backgroundColor: `rgba(8, 8, 7, ${progress * 0.52})`,
        backgroundImage: `radial-gradient(ellipse at ${sweepX}% 48%, ${t.color} 0%, transparent 62%)`,
      }}
    />
  );
};

// ----------------------------------------------------------------------------
// GLASS PILL (shared premium UI element)
// ----------------------------------------------------------------------------
const GlassPill: React.FC<{
  dot: string;
  label: string;
  tag: string;
  tagColor: string;
  style?: React.CSSProperties;
}> = ({ dot, label, tag, tagColor, style }) => (
  <div
    style={{
      backgroundColor: 'rgba(12, 12, 11, 0.84)',
      backdropFilter: 'blur(12px)',
      border: `1px solid ${tagColor}66`,
      borderRadius: 8,
      boxShadow: '0 14px 36px rgba(0, 0, 0, 0.75)',
      padding: '10px 22px',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      ...style,
    }}
  >
    <span
      style={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        backgroundColor: dot,
        boxShadow: `0 0 12px ${dot}`,
      }}
    />
    <span style={{ fontSize: 26, fontWeight: 800, letterSpacing: 3, color: IVORY }}>{label}</span>
    <span
      style={{
        backgroundColor: `${tagColor}29`,
        color: tagColor,
        border: `1px solid ${tagColor}66`,
        borderRadius: 4,
        padding: '3px 10px',
        fontSize: 17,
        fontWeight: 700,
        letterSpacing: 2,
      }}
    >
      {tag}
    </span>
  </div>
);

// ----------------------------------------------------------------------------
// SCENE RENDERER (2-frame living pixel animation + grade + steady dolly)
// ----------------------------------------------------------------------------
const PixelScene: React.FC<{ scene: SceneConfig; frame: number; talking: boolean }> = ({
  scene,
  frame,
  talking,
}) => {
  const local = frame - scene.from;
  const len = scene.to - scene.from;
  // In Scene 3 when UGC appears, switch background to the clean room plate so Caleb foreground stands on bottom-left
  const isUGCScene = scene.id === 3 && frame >= 375;
  const poseB = !isUGCScene && (talking && Math.floor(local / 18) % 2 === 1);
  const src = isUGCScene
    ? 'assets/pixel/sapa/s3_strategy_empty_room_perfect.png'
    : poseB
    ? scene.frameB
    : scene.frameA;
  const logos = poseB ? scene.logosB : scene.logosA;
  const dolly = interpolate(local, [0, len], [1.0, 1.035], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#0a0a09' }}>
      <AbsoluteFill
        style={{
          transform: `scale(${dolly})`,
          transformOrigin: 'center center',
        }}
      >
        <Img
          src={staticFile(src)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            imageRendering: 'pixelated',
            filter: scene.grade,
          }}
        />
        {(logos || []).map((l, i) => (
          <Img
            key={i}
            src={staticFile('assets/lira_logo.jpg')}
            style={{
              position: 'absolute',
              left: `${l.x - l.d / 2}%`,
              top: `calc(${l.y}% - ${(l.d / 2) * 10.8}px)`,
              width: `${l.d}%`,
              aspectRatio: '1 / 1',
              borderRadius: '50%',
              objectFit: 'cover',
              filter: scene.grade,
            }}
          />
        ))}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: scene.lighting, pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

// ----------------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------------
export const Video2_SapaMart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / FPS;

  const scene = SCENES.find((s) => frame >= s.from && frame < s.to) || SCENES[SCENES.length - 1];
  const local = frame - scene.from;
  const talking = SPEECH.some(([a, b]) => t >= a && t <= b);
  const isUGCActive = scene.id === 3 && frame >= 375;

  const card = CARDS.find((c) => t >= c.from && t < c.to) || CARDS[CARDS.length - 1];

  // Gentle optical lens settle on every cut
  const settle = spring({ frame: local, fps, config: { damping: 26, stiffness: 110, mass: 1 } });
  const settleScale = interpolate(settle, [0, 1], [1.018, 1.0]);

  // SCENE 1 — Sapa Mart blackout (store lights dim on "BLACKOUT", ~2.5s)
  const blackoutStart = sec(2.5);
  const blackoutDim =
    scene.id === 1
      ? interpolate(frame, [blackoutStart, blackoutStart + 3, blackoutStart + 5, blackoutStart + 14], [0, 0.35, 0.12, 0.5], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 0;
  const hookZoom =
    scene.id === 1
      ? interpolate(frame, [0, 45, 163], [1.07, 1.025, 1.0], { extrapolateRight: 'clamp' })
      : 1;

  // SCENE 4 — reward badge floats in on "DAPET REWARD & KOMISI" (~18.4s)
  const rewardStart = sec(18.3);
  const rewardSpring = spring({
    frame: frame - rewardStart,
    fps,
    config: { damping: 20, stiffness: 120 },
  });
  const rewardFloat = interpolate((frame - rewardStart) % 60, [0, 30, 60], [0, -6, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#080807',
        overflow: 'hidden',
        fontFamily: 'Inter, "Helvetica Neue", sans-serif',
      }}
    >
      {/* ================= AUDIO ================= */}
      <Audio src={staticFile('assets/voiceover_sapamart.mp3')} volume={1.0} />
      <Audio src={staticFile('assets/bg_music.mp3')} volume={0.13} />
      <Sequence from={0} durationInFrames={60}>
        <Audio src={staticFile('assets/sfx/sub_hit.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={blackoutStart} durationInFrames={40}>
        <Audio src={staticFile('assets/sfx/snap.mp3')} volume={0.45} />
      </Sequence>
      <Sequence from={161} durationInFrames={50}>
        <Audio src={staticFile('assets/sfx/whoosh.mp3')} volume={0.45} />
      </Sequence>
      <Sequence from={283} durationInFrames={50}>
        <Audio src={staticFile('assets/sfx/shutter.mp3')} volume={0.45} />
      </Sequence>
      <Sequence from={492} durationInFrames={50}>
        <Audio src={staticFile('assets/sfx/whoosh.mp3')} volume={0.42} />
      </Sequence>
      <Sequence from={rewardStart} durationInFrames={40}>
        <Audio src={staticFile('assets/sfx/snap.mp3')} volume={0.4} />
      </Sequence>
      <Sequence from={661} durationInFrames={50}>
        <Audio src={staticFile('assets/sfx/whoosh.mp3')} volume={0.45} />
      </Sequence>
      <Sequence from={855} durationInFrames={70}>
        <Audio src={staticFile('assets/sfx/impact.mp3')} volume={0.5} />
      </Sequence>

      {/* ================= SCENE LAYER ================= */}
      <AbsoluteFill style={{ transform: `scale(${settleScale * hookZoom})` }}>
        <PixelScene scene={scene} frame={frame} talking={talking} />

        {/* Scene 1: blackout dim of the red Sapa Mart storefront */}
        {scene.id === 1 && blackoutDim > 0 && (
          <AbsoluteFill
            style={{
              backgroundColor: `rgba(4, 4, 8, ${blackoutDim})`,
              pointerEvents: 'none',
            }}
          />
        )}
      </AbsoluteFill>

      {/* Scene 1: glass status pills */}
      {scene.id === 1 && (
        <div style={{ position: 'absolute', top: 108, right: 48, zIndex: 40 }}>
          {frame < blackoutStart ? (
            <GlassPill dot={EMERALD} label="SAPA MART" tag="IN STOCK" tagColor={EMERALD} />
          ) : (
            <GlassPill
              dot={CRIMSON}
              label="BLACKOUT"
              tag="14 DAYS"
              tagColor={CRIMSON}
              style={{
                opacity: interpolate(frame, [blackoutStart, blackoutStart + 8], [0, 1], {
                  extrapolateRight: 'clamp',
                }),
              }}
            />
          )}
        </div>
      )}

      {/* Scene 2: stock counter pill */}
      {scene.id === 2 && (
        <div style={{ position: 'absolute', top: 108, right: 48, zIndex: 40 }}>
          <GlassPill dot={CRIMSON} label="LIRA STOCK" tag="0 BOTTLES" tagColor={CRIMSON} />
        </div>
      )}

      {/* Scene 3: UGC Phone Mockup (Caleb points at regular customer reviews) */}
      {scene.id === 3 && frame >= 375 && (
        <Sequence from={375} durationInFrames={494 - 375}>
          {(() => {
            const ugcAge = frame - 375;
            const popSpring = spring({
              frame: ugcAge,
              fps,
              config: { damping: 14, stiffness: 160, mass: 0.75 },
            });
            const floatY = Math.sin((ugcAge / 14) * Math.PI) * 4;

            return (
              <>
                {/* Foreground Caleb on Bottom-Left pointing up-right directly to the center UGC video */}
                <Img
                  src={staticFile('assets/pixel/character/caleb_holding_transparent.png')}
                  style={{
                    position: 'absolute',
                    bottom: 60,
                    left: 14,
                    height: 590,
                    zIndex: 44,
                    transform: `translateY(${floatY}px) scale(${interpolate(popSpring, [0, 1], [0.92, 1])})`,
                    transformOrigin: 'bottom left',
                    opacity: interpolate(ugcAge, [0, 5], [0, 1], { extrapolateRight: 'clamp' }),
                    filter: 'drop-shadow(0 22px 38px rgba(0,0,0,0.92))',
                    imageRendering: 'pixelated',
                  }}
                />

                {/* Centered UGC Phone Mockup */}
                <div
                  style={{
                    position: 'absolute',
                    top: 100,
                    left: '50%',
                    width: 440,
                    height: 780,
                    zIndex: 42,
                    transform: `translateX(-50%) translateY(${floatY}px) scale(${interpolate(popSpring, [0, 1], [0.88, 1])})`,
                    transformOrigin: 'center center',
                    opacity: interpolate(ugcAge, [0, 5], [0, 1], { extrapolateRight: 'clamp' }),
                  }}
                >
                  {/* Phone chassis */}
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      borderRadius: 36,
                      overflow: 'hidden',
                      backgroundColor: '#0c0c0b',
                      border: '6px solid #22201d',
                      boxShadow:
                        '0 28px 70px rgba(0,0,0,0.92), 0 0 35px rgba(245, 208, 97, 0.28)',
                    }}
                  >
                    {/* UGC Video content */}
                    <OffthreadVideo
                      src={staticFile('assets/ugc_regulars_highlight.mp4')}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />

                    {/* Top glass pill indicator on phone */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 14,
                        left: 14,
                        zIndex: 10,
                        backgroundColor: 'rgba(8, 8, 7, 0.82)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 16,
                        padding: '5px 12px',
                        border: '1px solid rgba(245, 208, 97, 0.45)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        boxShadow: '0 4px 14px rgba(0,0,0,0.6)',
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: EMERALD,
                          boxShadow: `0 0 8px ${EMERALD}`,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 900,
                          letterSpacing: 1.2,
                          color: IVORY,
                          fontFamily: 'monospace',
                        }}
                      >
                        COMMUNITY UGC
                      </span>
                    </div>

                    {/* Glass glare highlight */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background:
                          'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 40%)',
                        pointerEvents: 'none',
                      }}
                    />
                  </div>
                </div>
              </>
            );
          })()}
        </Sequence>
      )}

      {/* Scene 4: reward / commission badge */}
      {scene.id === 4 && frame >= rewardStart && (
        <div
          style={{
            position: 'absolute',
            top: 150,
            left: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            zIndex: 40,
            opacity: interpolate(frame - rewardStart, [0, 8], [0, 1], { extrapolateRight: 'clamp' }),
            transform: `translateY(${rewardFloat}px) scale(${interpolate(rewardSpring, [0, 1], [0.9, 1])})`,
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(12, 12, 11, 0.86)',
              backdropFilter: 'blur(16px)',
              borderRadius: 14,
              border: `1.5px solid ${GOLD}99`,
              boxShadow: `0 22px 50px rgba(0,0,0,0.8), 0 0 30px ${GOLD}2e`,
              padding: '16px 30px',
              display: 'flex',
              alignItems: 'center',
              gap: 18,
            }}
          >
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: '50%',
                background: `radial-gradient(circle at 35% 35%, #FFF1B8 0%, ${GOLD} 45%, #B98A1E 100%)`,
                border: '2px solid #FFF1B8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                fontWeight: 900,
                color: '#5A3E06',
              }}
            >
              L
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 30, fontWeight: 900, letterSpacing: 2, color: GOLD }}>
                +REWARD  •  +KOMISI
              </span>
              <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 3, color: IVORY }}>
                REFERRAL PROGRAM  •  COMING SOON
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Scene 6: luxury centered CTA */}
      {scene.id === 6 &&
        (() => {
          const cta = spring({ frame: local, fps, config: { damping: 22, stiffness: 120 } });
          const breath = interpolate(local % 60, [0, 30, 60], [1, 1.012, 1]);
          const op = interpolate(local, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
          return (
            <div
              style={{
                position: 'absolute',
                top: 640,
                left: 0,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                zIndex: 65,
                opacity: op,
                transform: `scale(${cta * breath})`,
              }}
            >
              <div
                style={{
                  backgroundColor: 'rgba(12, 12, 11, 0.88)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 18,
                  border: `1.5px solid ${GOLD}94`,
                  boxShadow: `0 28px 68px rgba(0,0,0,0.88), 0 0 42px ${GOLD}29, inset 0 1px 0 rgba(255,255,255,0.12)`,
                  padding: '24px 36px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 26,
                  maxWidth: 940,
                }}
              >
                <div
                  style={{
                    width: 112,
                    height: 112,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: `2.5px solid ${GOLD}`,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.65), 0 0 20px rgba(168,224,95,0.25)',
                    backgroundColor: '#f7f5ee',
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
                      backgroundColor: `${CRIMSON}26`,
                      color: CRIMSON,
                      border: `1px solid ${CRIMSON}80`,
                      borderRadius: 5,
                      padding: '4px 12px',
                      fontSize: 18,
                      fontWeight: 800,
                      letterSpacing: 3,
                    }}
                  >
                    SLOT MINGGUAN TERBATAS
                  </span>
                  <div
                    style={{
                      background: `linear-gradient(135deg, ${GOLD} 0%, #E0B445 100%)`,
                      color: '#0A0A09',
                      padding: '10px 22px',
                      borderRadius: 8,
                      fontSize: 29,
                      fontWeight: 900,
                      letterSpacing: 1.5,
                      boxShadow: `0 8px 22px ${GOLD}47`,
                    }}
                  >
                    CLICK LINK IN BIO RIGHT NOW
                  </div>
                  <div style={{ display: 'flex', gap: 12, fontSize: 20, fontWeight: 700, letterSpacing: 3 }}>
                    <span style={{ color: EMERALD, fontWeight: 800 }}>@DRINKLIRA</span>
                    <span style={{ color: `${GOLD}80` }}>•</span>
                    <span style={{ color: 'rgba(250,247,240,0.85)' }}>EXCLUSIVE DIRECT BATCH</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      {/* ================= CINEMATIC VIGNETTE + READABILITY GRADIENT ================= */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 50% 44%, rgba(255, 235, 190, 0.04) 0%, rgba(0,0,0,0) 52%, rgba(6, 6, 5, 0.62) 100%)',
          pointerEvents: 'none',
          zIndex: 45,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(8,8,7,0.78) 0%, rgba(8,8,7,0.18) 11%, rgba(8,8,7,0) 22%, rgba(8,8,7,0) 56%, rgba(8,8,7,0.72) 79%, rgba(8,8,7,0.95) 100%)',
          pointerEvents: 'none',
          zIndex: 50,
        }}
      />

      {/* ================= LETTERBOX BARS ================= */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 84,
          backgroundColor: 'rgba(8, 8, 7, 0.88)',
          backdropFilter: 'blur(14px)',
          borderBottom: '1px solid rgba(245, 208, 97, 0.24)',
          zIndex: 55,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 76,
          backgroundColor: 'rgba(8, 8, 7, 0.92)',
          backdropFilter: 'blur(14px)',
          borderTop: '1px solid rgba(245, 208, 97, 0.22)',
          zIndex: 55,
        }}
      />

      {/* ================= HEADER ================= */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 48,
          right: 48,
          height: 84,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 60,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: scene.id <= 2 ? CRIMSON : EMERALD,
              boxShadow: `0 0 10px ${scene.id <= 2 ? CRIMSON : EMERALD}`,
            }}
          />
          <span style={{ color: IVORY, fontSize: 21, fontWeight: 700, letterSpacing: 3 }}>
            {scene.topLeft}
          </span>
        </div>
        <div
          style={{
            backgroundColor: 'rgba(245, 208, 97, 0.12)',
            color: GOLD,
            border: '1px solid rgba(245, 208, 97, 0.38)',
            borderRadius: 6,
            padding: '6px 16px',
            fontSize: 19,
            fontWeight: 800,
            letterSpacing: 2.5,
          }}
        >
          {scene.topRight}
        </div>
      </div>

      {/* ================= F-PATTERN WORD-BY-WORD CAPTIONS ================= */}
      <div
        style={{
          position: 'absolute',
          bottom: 94,
          left: isUGCActive ? 260 : 48,
          right: 48,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 14,
          zIndex: 60,
        }}
      >
        {card.lines.map((line, li) => {
          const words = timeLine(line);
          if (frame < words[0].from) return null;
          const isBig = line.size === 'big';
          const content = words.map((w, wi) => {
            if (frame < w.from) return null;
            const age = frame - w.from;
            const pop = spring({ frame: age, fps, config: { damping: 20, stiffness: 190, mass: 0.65 } });
            const next = words[wi + 1];
            const speakingThisLine = t <= line.end + 0.15;
            const isActive = speakingThisLine && (!next || frame < next.from);
            const color = isActive ? ACTIVE : COLOR[w.hl];
            const opacity = interpolate(age, [0, 2], [0, 1], { extrapolateRight: 'clamp' });
            return isBig ? (
              <span
                key={wi}
                style={{
                  display: 'inline-block',
                  fontSize: 86,
                  fontWeight: 900,
                  lineHeight: 0.96,
                  letterSpacing: -1.5,
                  textTransform: 'uppercase',
                  color,
                  opacity,
                  WebkitTextStroke: '1.5px rgba(8, 8, 7, 0.85)',
                  textShadow: isActive
                    ? '0 10px 30px rgba(0,0,0,0.95), 0 2px 8px rgba(0,0,0,0.95), 0 0 24px rgba(245,208,97,0.28)'
                    : '0 10px 28px rgba(0,0,0,0.92), 0 2px 6px rgba(0,0,0,0.95)',
                  transform: `translateY(${interpolate(pop, [0, 1], [10, 0])}px) scale(${interpolate(pop, [0, 1], [0.92, 1])})`,
                  transformOrigin: 'bottom left',
                }}
              >
                {w.text}
              </span>
            ) : (
              <span
                key={wi}
                style={{
                  display: 'inline-block',
                  fontSize: 42,
                  fontWeight: 800,
                  lineHeight: 1.15,
                  color,
                  opacity,
                  textShadow: '0 4px 14px rgba(0,0,0,0.9)',
                  transform: `scale(${interpolate(pop, [0, 1], [0.94, 1])})`,
                }}
              >
                {w.text}
              </span>
            );
          });

          return isBig ? (
            <div
              key={li}
              style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', columnGap: 18, rowGap: 6, maxWidth: 984 }}
            >
              {content}
            </div>
          ) : (
            <div
              key={li}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                columnGap: 14,
                rowGap: 4,
                maxWidth: 984,
                backgroundColor: 'rgba(12, 12, 11, 0.82)',
                backdropFilter: 'blur(14px)',
                borderLeft: `5px solid ${GOLD}`,
                borderTop: '1px solid rgba(255,255,255,0.08)',
                borderRight: '1px solid rgba(255,255,255,0.08)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '0 10px 10px 0',
                padding: '12px 26px',
                boxShadow: '0 16px 40px rgba(0,0,0,0.82)',
                minHeight: 68,
              }}
            >
              {content}
            </div>
          );
        })}
      </div>

      {/* ================= FOOTER ================= */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 48,
          right: 48,
          height: 76,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 60,
        }}
      >
        <span style={{ fontSize: 19, fontWeight: 700, color: 'rgba(245, 208, 97, 0.9)', letterSpacing: 3 }}>
          {scene.bottomNote}
        </span>
        <div
          style={{
            width: 260,
            height: 6,
            borderRadius: 3,
            backgroundColor: 'rgba(250, 247, 240, 0.14)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${(frame / SAPA_DURATION) * 100}%`,
              height: '100%',
              borderRadius: 3,
              background: `linear-gradient(90deg, ${CRIMSON} 0%, ${GOLD} 60%, ${EMERALD} 100%)`,
            }}
          />
        </div>
      </div>

      <TransitionOverlay frame={frame} />
    </AbsoluteFill>
  );
};
