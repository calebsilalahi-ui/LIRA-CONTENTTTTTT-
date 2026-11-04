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

// ============================================================================
// MINI PIXEL BOTTLE ICON (For HUD & Centered CTA Card)
// ============================================================================
const PixelLiraBottle: React.FC<{
  flavor: 'matcha' | 'choco';
  scale?: number;
  tilt?: number;
}> = ({ flavor, scale = 1, tilt = 0 }) => {
  const liquidColor = flavor === 'matcha' ? '#5f7326' : '#4a3222';
  const highlightColor = flavor === 'matcha' ? '#7b9432' : '#634430';

  return (
    <div
      style={{
        transform: `scale(${scale}) rotate(${tilt}deg)`,
        display: 'inline-block',
        filter: 'drop-shadow(0 6px 0px rgba(0,0,0,0.55))',
      }}
    >
      <svg width="64" height="120" viewBox="0 0 16 30" shapeRendering="crispEdges">
        <rect x="5" y="1" width="6" height="3" fill="#e1c49b" />
        <rect x="4" y="1" width="1" height="3" fill="#141312" />
        <rect x="11" y="1" width="1" height="3" fill="#141312" />
        <rect x="5" y="0" width="6" height="1" fill="#141312" />
        <rect x="5" y="4" width="6" height="2" fill="#f6f3ed" opacity="0.85" />
        <rect x="4" y="4" width="1" height="2" fill="#141312" />
        <rect x="11" y="4" width="1" height="2" fill="#141312" />
        <rect x="2" y="6" width="1" height="22" fill="#141312" />
        <rect x="13" y="6" width="1" height="22" fill="#141312" />
        <rect x="3" y="5" width="2" height="1" fill="#141312" />
        <rect x="11" y="5" width="2" height="1" fill="#141312" />
        <rect x="3" y="28" width="10" height="1" fill="#141312" />
        <rect x="3" y="6" width="10" height="22" fill={liquidColor} />
        <rect x="4" y="7" width="1" height="19" fill={highlightColor} />
        <rect x="3" y="12" width="10" height="9" fill="#f6f3ed" />
        <rect x="3" y="12" width="10" height="1" fill="#141312" />
        <rect x="3" y="20" width="10" height="1" fill="#141312" />
        <rect x="6" y="15" width="4" height="2" fill="#5f7326" />
        <rect x="5" y="17" width="6" height="1" fill="#7c5d49" />
      </svg>
    </div>
  );
};

// ============================================================================
// SCENE DATA FOR EACH 3-SECOND NARRATIVE BEAT
// ============================================================================
interface BeatConfig {
  id: number;
  from: number;
  duration: number;
  location: string;
  statusText: string;
  statusColor: string;
  bgAccent: string;
  image: string;
  FloatingBadge: string;
  badgeBg: string;
  badgeColor: string;
  subBadge?: string;
  emotionLabel: string;
  dialogue: string;
}

const BEATS: BeatConfig[] = [
  {
    id: 1,
    from: 0,
    duration: 90,
    location: 'KAMAR TIDUR • 03:30 AM',
    statusText: 'ALARM RINGING',
    statusColor: '#ff5c5c',
    bgAccent: '#131826',
    image: 'assets/pixel/scene_1_bedroom.jpg',
    FloatingBadge: 'ALARM 03:30 BUNYI!',
    badgeBg: '#b91c1c',
    badgeColor: '#ffffff',
    subBadge: 'Zzz... Temen Lain Masih Tidur Pules',
    emotionLabel: 'SLEEPY / WAKING UP',
    dialogue: '"Tepat setahun lalu, pas temen-temen seumuran gue masih tidur pules..."',
  },
  {
    id: 2,
    from: 90,
    duration: 90,
    location: 'DAPUR PUTIH • 03:35 AM',
    statusText: 'BREWING LIRA',
    statusColor: '#5f7326',
    bgAccent: '#252825',
    image: 'assets/pixel/scene_2_kitchen.jpg',
    FloatingBadge: 'DAPUR KECIL PUTIH • FRESH BATCH',
    badgeBg: '#f6f3ed',
    badgeColor: '#141312',
    subBadge: 'Lira Matcha & Choco Ready on Kitchen Slab',
    emotionLabel: 'DETERMINED @ 03:30 AM',
    dialogue: '"...alarm gue udah bunyi jam setengah empat pagi di dapur kecil ini."',
  },
  {
    id: 3,
    from: 180,
    duration: 90,
    location: 'SEKOLAH KEJURUAN • CAMPUS',
    statusText: 'NO BACKUP PLAN',
    statusColor: '#e1c49b',
    bgAccent: '#261f18',
    image: 'assets/pixel/scene_3_campus.jpg',
    FloatingBadge: 'ANAK SEKOLAH KEJURUAN',
    badgeBg: '#7c5d49',
    badgeColor: '#ffffff',
    subBadge: 'NO BACKUP PLAN SAMA SEKALI!',
    emotionLabel: 'ALL-IN FOUNDER',
    dialogue: '"Gue masih anak sekolah kejuruan, dan jujur... gue ga punya backup plan sama sekali."',
  },
  {
    id: 4,
    from: 270,
    duration: 90,
    location: 'KAFE ORANG LAIN • 50K+',
    statusText: 'REJECT FAKE DRINK',
    statusColor: '#ff5c5c',
    bgAccent: '#261717',
    image: 'assets/pixel/scene_4_cafe.jpg',
    FloatingBadge: 'MINUMAN KAFE 50 RIBUAN?!',
    badgeBg: '#b91c1c',
    badgeColor: '#ffffff',
    subBadge: 'Isinya Cuma Perisa + Krimer Nabati!',
    emotionLabel: 'MUAK / DISGUSTED',
    dialogue: '"Gue cuma muak lihat minuman kafe 50 ribuan yang isinya cuma perisa sama krimer nabati."',
  },
  {
    id: 5,
    from: 360,
    duration: 90,
    location: 'MEJA KERJA • GREEN LAPTOP',
    statusText: 'BUILDING BRAND',
    statusColor: '#7b9432',
    bgAccent: '#1c2416',
    image: 'assets/pixel/scene_5_laptop.jpg',
    FloatingBadge: 'NGEJALANIN BRAND x TUGAS SEKOLAH',
    badgeBg: '#5f7326',
    badgeColor: '#ffffff',
    subBadge: '\u2605 100% OATSIDE + PREMIUM MATCHA',
    emotionLabel: 'LOCKED IN TYPING',
    dialogue: '"Tapi ngejalanin brand sendiri sambil ngejar tugas sekolah itu brutal."',
  },
  {
    id: 6,
    from: 450,
    duration: 90,
    location: 'MEJA BELAJAR x BOTTLING',
    statusText: 'OVERWHELMED',
    statusColor: '#5ce1e6',
    bgAccent: '#241a16',
    image: 'assets/pixel/scene_6_stressed.jpg',
    FloatingBadge: 'STRESS TUGAS x NGE-SEAL BOTOL LIRA!',
    badgeBg: '#b91c1c',
    badgeColor: '#ffffff',
    subBadge: 'Tumpukan PR Besok vs Orderan Botol Lira',
    emotionLabel: 'FRUSTRATED / HANDS UP!',
    dialogue: '"Sering banget gue stress mikirin tugas sambil nge-seal botol Lira."',
  },
  {
    id: 7,
    from: 540,
    duration: 90,
    location: 'FAST FORWARD • HARI INI',
    statusText: 'RITUAL FOKUS',
    statusColor: '#ffeb3b',
    bgAccent: '#242015',
    image: 'assets/pixel/scene_7_ritual.jpg',
    FloatingBadge: 'FAST FORWARD HARI INI: RITUAL FOKUS!',
    badgeBg: '#5f7326',
    badgeColor: '#ffffff',
    subBadge: 'Lira Nemenin Ritual Fokus & Belajar Kalian',
    emotionLabel: 'PROUD FOUNDER',
    dialogue: '"Fast forward hari ini: Lira nemenin ritual fokus kalian!"',
  },
  {
    id: 8,
    from: 630,
    duration: 115,
    location: '@DRINKLIRA • SCALE FROM 0',
    statusText: 'JOIN THE JOURNEY',
    statusColor: '#e1c49b',
    bgAccent: '#1a2212',
    image: 'assets/pixel/scene_7_ritual.jpg',
    FloatingBadge: 'ANAK SMA SCALE BRAND DARI NOL',
    badgeBg: '#e1c49b',
    badgeColor: '#141312',
    emotionLabel: '\u2605 CLICK LINK IN BIO',
    dialogue: '"Mau lihat gimana anak SMA scale brand ini dari nol? Follow me & click link in bio!"',
  },
];

// ============================================================================
// MAIN REEL COMPOSITION (745 Frames / 24.8s @ 30fps)
// ============================================================================
export const Video1_TOFU: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Quantize to 10fps for authentic retro pixel-art animation feel
  const qFrame = Math.floor(frame / 3) * 3;

  const activeBeat =
    BEATS.find((b) => frame >= b.from && frame < b.from + b.duration) || BEATS[BEATS.length - 1];
  const localFrame = frame - activeBeat.from;
  const localQFrame = qFrame - activeBeat.from;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: activeBeat.bgAccent,
        fontFamily: '"Courier New", Courier, monospace',
        overflow: 'hidden',
      }}
    >
      {/* ================= AUDIO ENGINE ================= */}
      <Audio src={staticFile('assets/voiceover_tofu.mp3')} volume={1.0} />
      <Audio src={staticFile('assets/bg_music.mp3')} volume={0.16} />

      <Sequence from={0} durationInFrames={90}>
        <Audio src={staticFile('assets/sfx/alarm.mp3')} volume={0.65} />
      </Sequence>
      <Sequence from={90} durationInFrames={90}>
        <Audio src={staticFile('assets/sfx/thud.mp3')} volume={0.75} />
      </Sequence>
      <Sequence from={180} durationInFrames={90}>
        <Audio src={staticFile('assets/sfx/shutter.mp3')} volume={0.7} />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <Audio src={staticFile('assets/sfx/scratch.mp3')} volume={0.6} />
      </Sequence>
      <Sequence from={360} durationInFrames={90}>
        <Audio src={staticFile('assets/sfx/snap.mp3')} volume={0.75} />
      </Sequence>
      <Sequence from={450} durationInFrames={90}>
        <Audio src={staticFile('assets/sfx/sub_hit.mp3')} volume={0.8} />
      </Sequence>
      <Sequence from={540} durationInFrames={90}>
        <Audio src={staticFile('assets/sfx/whoosh.mp3')} volume={0.7} />
      </Sequence>
      <Sequence from={630} durationInFrames={115}>
        <Audio src={staticFile('assets/sfx/impact.mp3')} volume={0.85} />
      </Sequence>

      {/* =====================================================================
          RETRO PIXEL GRID BACKDROP
      ===================================================================== */}
      <AbsoluteFill
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(225,196,155,0.05) 50%, transparent 50%), linear-gradient(rgba(225,196,155,0.05) 50%, transparent 50%)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* =====================================================================
          TOP RPG HUD STATUS BAR (Dynamic Location & Emotion Per Scene)
      ===================================================================== */}
      <div
        style={{
          position: 'absolute',
          top: 56,
          left: 44,
          right: 44,
          height: 112,
          backgroundColor: '#141312',
          border: '6px solid #e1c49b',
          padding: '0 26px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 10px 0 rgba(0,0,0,0.65)',
          zIndex: 30,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: '#e1c49b', fontSize: 22, fontWeight: 900, letterSpacing: 1 }}>
            {activeBeat.location}
          </span>
          <span style={{ color: activeBeat.statusColor, fontSize: 25, fontWeight: 900 }}>
            {activeBeat.statusText}
          </span>
        </div>

        {/* Emotion & Lira Inventory Slot */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            backgroundColor: '#26201d',
            border: '4px solid #5f7326',
            padding: '10px 16px',
          }}
        >
          <span style={{ color: '#ffffff', fontSize: 20, fontWeight: 900 }}>
            {activeBeat.emotionLabel}
          </span>
          <div style={{ width: 20, height: 20, backgroundColor: '#5f7326', border: '2px solid #fff' }} />
          <div style={{ width: 20, height: 20, backgroundColor: '#7c5d49', border: '2px solid #fff' }} />
        </div>
      </div>

      {/* =====================================================================
          MAIN PIXEL ART SCENE VIEWPORT (Changes Room & Action Every 3 Seconds)
      ===================================================================== */}
      {BEATS.map((beat) => {
        const bFrame = frame - beat.from;
        const bQFrame = qFrame - beat.from;

        // Scene-specific camera animation
        const popIn = spring({
          frame: Math.max(0, bFrame),
          fps,
          config: { damping: 14, stiffness: 160 },
        });

        // Alarm shake in Beat 1, Stress shake in Beat 6, Cafe reject shake in Beat 4
        let shakeX = 0;
        let shakeY = 0;
        if (beat.id === 1) {
          shakeX = bQFrame % 6 === 0 ? -5 : 5;
          shakeY = bQFrame % 6 === 0 ? 3 : -3;
        } else if (beat.id === 4 && bFrame < 45) {
          shakeX = bQFrame % 6 === 0 ? -6 : 6;
        } else if (beat.id === 6) {
          shakeX = bQFrame % 6 === 0 ? -7 : 7;
          shakeY = bQFrame % 9 === 0 ? -5 : 5;
        }

        // Slow cinematic pixel zoom
        const kenBurnsScale = interpolate(bFrame, [0, beat.duration], [1.02, 1.09], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        // Typing bounce in Beat 5
        const typingBounce = beat.id === 5 ? (bQFrame % 6 === 0 ? -4 : 4) : 0;

        // Pixel Curtain Wipe on first 9 frames of each beat
        const wipeProgress = interpolate(bFrame, [0, 9], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <Sequence key={beat.id} from={beat.from} durationInFrames={beat.duration}>
            <AbsoluteFill>
              {/* Framed Pixel Art Canvas */}
              <div
                style={{
                  position: 'absolute',
                  top: 196,
                  left: 44,
                  right: 44,
                  height: 1180,
                  backgroundColor: '#141312',
                  border: '8px solid #e1c49b',
                  boxShadow: '0 18px 0 rgba(0,0,0,0.7)',
                  overflow: 'hidden',
                  transform: `translate(${shakeX}px, ${shakeY + typingBounce}px)`,
                }}
              >
                <Img
                  src={staticFile(beat.image)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center center',
                    imageRendering: 'pixelated',
                    transform: `scale(${kenBurnsScale})`,
                  }}
                />

                {/* CRT / Pixel Scanline Subtle Texture */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 2px, transparent 2px, transparent 6px)',
                    pointerEvents: 'none',
                  }}
                />

                {/* BEAT 1 OVERLAY: Floating Zzz & Flashing 03:30 Alarm Ring */}
                {beat.id === 1 && (
                  <>
                    <div
                      style={{
                        position: 'absolute',
                        top: 160 + (bQFrame % 18 === 0 ? -12 : 0),
                        right: 110,
                        backgroundColor: '#141312',
                        border: '5px solid #e1c49b',
                        padding: '10px 20px',
                        color: '#e1c49b',
                        fontSize: 32,
                        fontWeight: 900,
                        boxShadow: '6px 6px 0 #000',
                      }}
                    >
                      Zzz... 03:30 AM
                    </div>
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 130,
                        left: 36,
                        backgroundColor: bQFrame % 6 === 0 ? '#ef4444' : '#991b1b',
                        border: '5px solid #ffffff',
                        padding: '10px 22px',
                        color: '#ffffff',
                        fontSize: 28,
                        fontWeight: 900,
                        boxShadow: '6px 6px 0 #141312',
                        transform: `rotate(${bQFrame % 6 === 0 ? -4 : 4}deg)`,
                      }}
                    >
                      BEEP! BEEP! 03:30!
                    </div>
                  </>
                )}

                {/* BEAT 2 OVERLAY: White Kitchen Slab & Lira Indicator */}
                {beat.id === 2 && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 125,
                      right: 36,
                      backgroundColor: '#5f7326',
                      border: '5px solid #ffffff',
                      padding: '10px 22px',
                      color: '#ffffff',
                      fontSize: 26,
                      fontWeight: 900,
                      boxShadow: '6px 6px 0 #141312',
                    }}
                  >
                    ✓ 100% OATSIDE ON KITCHEN SLAB
                  </div>
                )}

                {/* BEAT 3 OVERLAY: Vocational School Stamp */}
                {beat.id === 3 && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 125,
                      right: 36,
                      backgroundColor: '#b91c1c',
                      border: '5px solid #ffffff',
                      padding: '12px 24px',
                      color: '#ffffff',
                      fontSize: 28,
                      fontWeight: 900,
                      boxShadow: '6px 6px 0 #141312',
                      transform: 'rotate(-2deg)',
                    }}
                  >
                    PLAN B: TIDAK ADA!
                  </div>
                )}

                {/* BEAT 4 OVERLAY: 50K Cafe Warning Stamp */}
                {beat.id === 4 && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 120,
                      right: 36,
                      backgroundColor: '#141312',
                      border: '5px solid #ff5c5c',
                      padding: '12px 22px',
                      color: '#ff5c5c',
                      fontSize: 28,
                      fontWeight: 900,
                      boxShadow: '6px 6px 0 #000',
                      transform: 'rotate(-2deg)',
                    }}
                  >
                    TOLAK KRIMER & PERISA!
                  </div>
                )}

                {/* BEAT 5 OVERLAY: Green Laptop Typing Status */}
                {beat.id === 5 && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 120,
                      right: 36,
                      backgroundColor: '#141312',
                      border: '5px solid #7b9432',
                      padding: '10px 22px',
                      color: '#a3e635',
                      fontSize: 26,
                      fontWeight: 900,
                      boxShadow: '6px 6px 0 #000',
                    }}
                  >
                    TYPING: LIRA OPS + TUGAS SMA...
                  </div>
                )}

                {/* BEAT 6 OVERLAY: Frustrated Hands Up Badges */}
                {beat.id === 6 && (
                  <>
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 125,
                        left: 28,
                        backgroundColor: '#f6f3ed',
                        border: '5px solid #141312',
                        padding: '10px 18px',
                        color: '#141312',
                        fontSize: 25,
                        fontWeight: 900,
                        boxShadow: '6px 6px 0 #141312',
                        transform: 'rotate(-2deg)',
                      }}
                    >
                      TUGAS NUMPUK!
                    </div>
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 125,
                        right: 28,
                        backgroundColor: '#5f7326',
                        border: '5px solid #141312',
                        padding: '10px 18px',
                        color: '#ffffff',
                        fontSize: 25,
                        fontWeight: 900,
                        boxShadow: '6px 6px 0 #141312',
                        transform: 'rotate(2deg)',
                      }}
                    >
                      SEAL BOTOL LIRA!
                    </div>
                  </>
                )}

                {/* Top Floating Narrative Banner Inside Viewport (Beats 1 - 7) */}
                {beat.id !== 8 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 26,
                      left: 28,
                      right: 28,
                      display: 'flex',
                      justifyContent: 'center',
                      transform: `scale(${popIn})`,
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: beat.badgeBg,
                        color: beat.badgeColor,
                        border: '5px solid #141312',
                        padding: '12px 26px',
                        fontSize: 28,
                        fontWeight: 900,
                        boxShadow: '8px 8px 0px #141312',
                        textAlign: 'center',
                      }}
                    >
                      {beat.FloatingBadge}
                    </div>
                  </div>
                )}

                {/* Bottom Sub-Banner Inside Viewport (Beats 1 - 7) */}
                {beat.id !== 8 && beat.subBadge && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 26,
                      left: 28,
                      right: 28,
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: 'rgba(20, 19, 18, 0.92)',
                        color: '#e1c49b',
                        border: '4px solid #e1c49b',
                        padding: '10px 24px',
                        fontSize: 24,
                        fontWeight: 900,
                        boxShadow: '6px 6px 0px #000000',
                        textAlign: 'center',
                      }}
                    >
                      {beat.subBadge}
                    </div>
                  </div>
                )}

                {/* ===============================================================
                    BEAT 8: CENTERED CTA OVERLAY (Caleb Visible Above + Centered CTA)
                =============================================================== */}
                {beat.id === 8 && (
                  <AbsoluteFill
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(20,19,18,0.05) 0%, rgba(20,19,18,0.35) 48%, rgba(20,19,18,0.88) 75%)',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      padding: '0 36px 38px 36px',
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        maxWidth: 850,
                        backgroundColor: 'rgba(20, 19, 18, 0.96)',
                        border: '8px solid #e1c49b',
                        padding: '30px 32px',
                        boxShadow: '0 20px 0px #000000',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        transform: `scale(${popIn})`,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 22,
                          marginBottom: 16,
                        }}
                      >
                        <PixelLiraBottle flavor="matcha" scale={0.95} tilt={-8} />
                        <div
                          style={{
                            backgroundColor: '#7c5d49',
                            border: '4px solid #e1c49b',
                            padding: '10px 22px',
                            color: '#ffffff',
                            fontSize: 25,
                            fontWeight: 900,
                          }}
                        >
                          {'\u2605'} ANAK SMA SCALE DARI NOL
                        </div>
                        <PixelLiraBottle flavor="choco" scale={0.95} tilt={8} />
                      </div>

                      {/* Pulsing Centered CTA Button */}
                      <div
                        style={{
                          backgroundColor: '#5f7326',
                          border: '6px solid #ffffff',
                          padding: '22px 40px',
                          boxShadow: '10px 10px 0px #000000',
                          transform: `translateY(${bQFrame % 12 === 0 ? -6 : 0}px) scale(${
                            bQFrame % 12 === 0 ? 1.04 : 1
                          })`,
                          marginBottom: 16,
                        }}
                      >
                        <span
                          style={{
                            color: '#ffffff',
                            fontSize: 36,
                            fontWeight: 900,
                            letterSpacing: 1,
                          }}
                        >
                          {'\u25B6'} FOLLOW & CLICK LINK IN BIO
                        </span>
                      </div>

                      <div
                        style={{
                          color: '#e1c49b',
                          fontSize: 26,
                          fontWeight: 900,
                          letterSpacing: 2,
                        }}
                      >
                        IG: @DRINKLIRA • 100% OATSIDE
                      </div>
                    </div>
                  </AbsoluteFill>
                )}

                {/* Retro 16-Bit Block Wipe Transition Between Rooms */}
                {wipeProgress > 0 && (
                  <AbsoluteFill
                    style={{
                      backgroundColor: '#141312',
                      opacity: wipeProgress,
                    }}
                  />
                )}
              </div>
            </AbsoluteFill>
          </Sequence>
        );
      })}

      {/* =====================================================================
          BOTTOM 16-BIT RPG DIALOGUE BOX (SYNCED TO VOICEOVER)
      ===================================================================== */}
      <div
        style={{
          position: 'absolute',
          bottom: 56,
          left: 44,
          right: 44,
          height: 440,
          backgroundColor: '#141312',
          border: '8px solid #e1c49b',
          padding: '28px 34px',
          boxShadow: '0 16px 0 rgba(0,0,0,0.75)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 30,
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 18,
            }}
          >
            <div
              style={{
                backgroundColor: '#7c5d49',
                color: '#ffffff',
                padding: '8px 20px',
                fontSize: 24,
                fontWeight: 900,
                border: '3px solid #e1c49b',
              }}
            >
              CALEB • FOUNDER @DRINKLIRA
            </div>
            <span style={{ color: '#e1c49b', fontSize: 22, fontWeight: 900 }}>
              SCENE {activeBeat.id}/8
            </span>
          </div>

          {/* Typewriter RPG Dialogue Text */}
          <div
            style={{
              color: '#ffffff',
              fontSize: 38,
              fontWeight: 900,
              lineHeight: 1.38,
            }}
          >
            {activeBeat.dialogue.slice(
              0,
              Math.max(
                12,
                Math.floor(
                  interpolate(localFrame, [0, Math.min(42, activeBeat.duration - 10)], [0, activeBeat.dialogue.length], {
                    extrapolateRight: 'clamp',
                  })
                )
              )
            )}
            {localQFrame % 12 === 0 ? ' ▋' : ''}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '3px solid rgba(225,196,155,0.25)',
            paddingTop: 14,
          }}
        >
          <span style={{ color: '#7b9432', fontSize: 24, fontWeight: 900 }}>
            [100% OATSIDE • PREMIUM MATCHA & CHOCO]
          </span>
          <span
            style={{
              color: '#e1c49b',
              fontSize: 26,
              fontWeight: 900,
              transform: `translateY(${qFrame % 12 === 0 ? 4 : 0}px)`,
            }}
          >
            ▼ NEXT
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
