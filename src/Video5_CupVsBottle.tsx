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
// VIDEO 5 — CUP VS BOTTLE: 10 FPS AUTHENTIC RETRO ANIMATION EDITION
// Duration: 989 frames @ 30fps = 32.966s (Tight audio cut, pauses > 0.3s trimmed)
// Canvas: 1080 x 1440 (Edge-to-edge full bleed, 0 black letterbox bars)
//
// 10 FPS Retro Stop-Motion / Indie-Game Architecture:
// - Global 10 FPS visual stepping (qFrame = Math.floor(frame / 3) * 3)
// - True 10 FPS frame-by-frame character animation across all scenes
// - Scene 1: Active 10 FPS typing & water condensation dripping
// - Scene 2: Active 10 FPS danger wobble & liquid sloshing
// - Scene 3: Active 10 FPS 180° inverted bottle shaking over keyboard
// - Scene 4: 6-frame dynamic 10 FPS toss sequence (poise -> windup -> swing -> dive -> land -> carry)
// - Captions burned in strictly 2 to 3 words at a time with 10 FPS spring pop
// ============================================================================

export const CUP_VS_BOTTLE_DURATION = 989;

// High-Vibrancy Palette
const GOLD = '#FFE566';
const EMERALD = '#39FF88';
const CRIMSON = '#FF2E63';
const CYAN = '#00F0FF';
const IVORY = '#FFFFFF';

// ----------------------------------------------------------------------------
// DYNAMIC 2-3 WORD CAPTION DATA (Audio-synced speech boundaries)
// ----------------------------------------------------------------------------
interface WordChunk {
  from: number; // frame
  to: number;   // frame
  text: string;
  highlight?: 'gold' | 'emerald' | 'crimson' | 'cyan' | 'ivory';
  emphasis?: boolean;
}

const CAPTION_CHUNKS: WordChunk[] = [
  // Scene 1: Typing Struggle (f 0 - 129)
  { from: 0, to: 37, text: 'Pernah nggak lo', highlight: 'ivory' },
  { from: 37, to: 72, text: 'sadar kalau beli', highlight: 'ivory' },
  { from: 72, to: 103, text: 'matcha di cup', highlight: 'gold' },
  { from: 103, to: 129, text: 'plastik nyusahin hidup?', highlight: 'crimson', emphasis: true },

  // Scene 2: Totebag Tilt & Watery Ice (f 129 - 347)
  { from: 129, to: 160, text: 'Lo dipaksa megang', highlight: 'ivory' },
  { from: 160, to: 195, text: 'cup-nya terus-terusan,', highlight: 'gold' },
  { from: 195, to: 226, text: 'es batunya mencair', highlight: 'cyan' },
  { from: 226, to: 259, text: 'bikin rasa hambar,', highlight: 'crimson', emphasis: true },
  { from: 259, to: 288, text: 'dan lo nggak', highlight: 'ivory' },
  { from: 288, to: 318, text: 'bisa masukin tas', highlight: 'gold' },
  { from: 318, to: 347, text: 'karena pasti tumpah.', highlight: 'crimson', emphasis: true },

  // Scene 3: Inverted 180° Bottle Over MacBook (f 347 - 532)
  { from: 347, to: 381, text: 'Di Lira, kita', highlight: 'ivory' },
  { from: 381, to: 414, text: 'menolak jualan cup.', highlight: 'emerald', emphasis: true },
  { from: 414, to: 456, text: 'Seluruh batch Lira', highlight: 'gold' },
  { from: 456, to: 495, text: 'dikunci di botol', highlight: 'emerald' },
  { from: 495, to: 532, text: 'tutup segel rapat.', highlight: 'emerald', emphasis: true },

  // Scene 4: Totebag Toss & Shoulder Carry (f 532 - 723)
  { from: 532, to: 570, text: 'Lo bisa lempar', highlight: 'gold' },
  { from: 570, to: 605, text: 'botol ke totebag,', highlight: 'emerald', emphasis: true },
  { from: 605, to: 648, text: 'simpen di kulkas', highlight: 'cyan' },
  { from: 648, to: 684, text: 'buat nanti malam,', highlight: 'ivory' },
  { from: 684, to: 723, text: 'rasanya tetap konsisten.', highlight: 'gold', emphasis: true },

  // Scene 5: Oatside + Matcha Consistency & Saturday Batch CTA (f 723 - 989)
  { from: 723, to: 765, text: '100% Oatside murni', highlight: 'gold', emphasis: true },
  { from: 765, to: 811, text: 'ketemu matcha pekat.', highlight: 'emerald', emphasis: true },
  { from: 811, to: 877, text: 'Convenience & taste.', highlight: 'gold', emphasis: true },
  { from: 877, to: 937, text: 'Batch Sabtu dibuka!', highlight: 'emerald', emphasis: true },
  { from: 937, to: 989, text: 'CLICK LINK IN BIO!', highlight: 'emerald', emphasis: true },
];

export const Video5_CupVsBottle: React.FC = () => {
  const frame = useCurrentFrame();

  // ==========================================================================
  // 10 FPS RETRO ANIMATION ENGINE
  // Quantizes the 30fps container into authentic 10 FPS stepped motion
  // (Every visual property updates strictly every 3 physical frames = 10 fps)
  // ==========================================================================
  const qFrame = Math.floor(frame / 3) * 3;
  const qStep = Math.floor(frame / 3); // Discrete 10 FPS integer tick

  // Active 2-3 word caption chunk
  const activeChunk =
    CAPTION_CHUNKS.find((c) => frame >= c.from && frame < c.to) ||
    CAPTION_CHUNKS[CAPTION_CHUNKS.length - 1];

  const chunkLocal = qFrame - activeChunk.from;
  const chunkSpring = spring({
    frame: Math.max(0, chunkLocal),
    fps: 10, // 10 FPS stepped spring physics!
    config: { damping: 14, stiffness: 220, mass: 0.6 },
  });

  const chunkScale = interpolate(chunkSpring, [0, 1], [0.88, 1.0]);
  const chunkOpacity = chunkLocal < 0 ? 0 : 1;

  // Scene determination (based on qFrame)
  const isScene1 = qFrame < 129; // 0.00s - 4.30s (typing struggle)
  const isScene2 = qFrame >= 129 && qFrame < 347; // 4.30s - 11.59s (totebag almost spill)
  const isScene3 = qFrame >= 347 && qFrame < 532; // 11.59s - 17.74s (180° inverted bottle)
  const isScene4 = qFrame >= 532 && qFrame < 723; // 17.74s - 24.10s (6-frame 10 FPS toss)
  const isScene5 = qFrame >= 723; // 24.10s - 32.97s (taste consistency + CTA)

  // --------------------------------------------------------------------------
  // SCENE 1: DYNAMIC ZOOM SYSTEM (0 - 129)
  // 0 - 37: Wide establishing shot (scale 1.0)
  // 37 - 72: Stepped push-in (scale 1.05)
  // 72 - 103: Punch-in on stressed face & cup (scale 1.14)
  // 103 - 129: HARD PUNCH-IN on dripping water condensation & grimace (scale 1.22)
  // --------------------------------------------------------------------------
  const s1Local = qFrame;
  let s1Scale = 1.0;
  let s1Origin = '50% 50%';
  if (s1Local < 37) {
    s1Scale = 1.0;
  } else if (s1Local < 72) {
    s1Scale = 1.05;
  } else if (s1Local < 103) {
    s1Scale = 1.14;
    s1Origin = '55% 45%';
  } else {
    s1Scale = 1.22;
    s1Origin = '60% 45%'; // Tightly on Caleb's frowning face & sweaty cup
  }
  const isTypingFrameB = qStep % 3 === 1 || qStep % 3 === 2;

  // --------------------------------------------------------------------------
  // SCENE 2: DYNAMIC ZOOM SYSTEM (129 - 347)
  // 129 - 195: Punch-Out to wide shot of bag & laptop (scale 1.02)
  // 195 - 259: Punch-In on watery melting iced drink (scale 1.15)
  // 259 - 300: Snap Punch-Out showing whole bag mouth (scale 1.04)
  // 300 - 347: DRAMATIC CLIMAX PUNCH-IN on 40° tilted lid about to spill! (scale 1.26)
  // --------------------------------------------------------------------------
  const s2Local = qFrame - 129;
  let s2Zoom = 1.02;
  let s2Origin = '50% 50%';
  if (s2Local < 66) {
    s2Zoom = 1.02;
  } else if (s2Local < 130) {
    s2Zoom = 1.15;
    s2Origin = '55% 35%'; // Focusing on watery ice cubes & sweating cup
  } else if (s2Local < 171) {
    s2Zoom = 1.04; // Quick pull back showing open bag
  } else {
    s2Zoom = 1.26; // Climax punch-in on tilted spilling rim
    s2Origin = '52% 40%';
  }
  const isSloshingFrameB = s2Local > 130 && qStep % 2 === 1;
  const dangerPulse =
    s2Local > 140
      ? (qStep % 3 === 0 ? 0.32 : qStep % 3 === 1 ? 0.18 : 0.06)
      : 0;

  // --------------------------------------------------------------------------
  // SCENE 3: DYNAMIC ZOOM SYSTEM (347 - 532)
  // 347 - 414: Snap Punch-Out wide showing dry pristine MacBook keyboard (scale 1.02)
  // 414 - 456: Punch-In on sealed Lira bottle (scale 1.12)
  // 456 - 532: MACRO EXTREME PUNCH-IN on inverted gold cap right above keyboard! (scale 1.28)
  // --------------------------------------------------------------------------
  const s3Local = qFrame - 347;
  let s3Zoom = 1.02;
  let s3Origin = '50% 50%';
  if (s3Local < 67) {
    s3Zoom = 1.02;
  } else if (s3Local < 109) {
    s3Zoom = 1.12;
  } else {
    s3Zoom = 1.28; // Macro close-up on upside-down gold cap over dry keys
    s3Origin = '50% 68%';
  }
  const isShaking = s3Local >= 90;
  const shakeFrameB = isShaking && qStep % 2 === 1;
  const shakeOffsetY = isShaking ? (qStep % 2 === 1 ? -4 : 4) : 0;

  // --------------------------------------------------------------------------
  // SCENE 4: DYNAMIC ZOOM SYSTEM (532 - 723)
  // 532 - 570: Wide shot showing Caleb & tote bag (scale 1.0)
  // 570 - 605: Dynamic PUNCH-IN tracking the bottle flying into bag! (scale 1.18)
  // 605 - 648: Snap PUNCH-OUT as Caleb grabs tote bag (scale 1.02)
  // 648 - 723: Confident PUNCH-IN on Caleb carrying bag with proud smirk (scale 1.15)
  // --------------------------------------------------------------------------
  const s4Local = qFrame - 532;
  let s4Zoom = 1.0;
  let s4Origin = '50% 50%';
  let tossAsset = 's4_toss_1.jpg';

  if (s4Local < 24) {
    tossAsset = 's4_toss_1.jpg';
    s4Zoom = 1.0;
  } else if (s4Local < 38) {
    tossAsset = 's4_toss_1b.jpg'; // windup
    s4Zoom = 1.06;
  } else if (s4Local < 50) {
    tossAsset = 's4_toss_2.jpg';  // arm swing forward, bottle flying
    s4Zoom = 1.16;
    s4Origin = '42% 60%'; // Track bottle trajectory toward tote bag
  } else if (s4Local < 65) {
    tossAsset = 's4_toss_2b.jpg'; // bottle diving into bag
    s4Zoom = 1.20;
    s4Origin = '38% 65%'; // Focus right on tote bag opening
  } else if (s4Local < 92) {
    tossAsset = 's4_toss_3.jpg';  // landed inside totebag with impact stars
    s4Zoom = 1.04;
  } else {
    tossAsset = 's4_toss_4.jpg';  // Caleb lifting bag over shoulder, confident smirk
    s4Zoom = 1.15;
    s4Origin = '50% 32%'; // Focus on Caleb's confident face and shoulder bag
  }
  const carryHeadBob = s4Local >= 92 && qStep % 4 >= 2 ? -3 : 0;

  // --------------------------------------------------------------------------
  // SCENE 5: DYNAMIC ZOOM SYSTEM (723 - 989)
  // 723 - 765: MACRO PUNCH-IN on rich pure Japanese premium matcha swirl into oat milk (scale 1.24)
  // 765 - 811: Stepped PUNCH-OUT revealing full kitchen slab & Oatside carton (scale 1.06)
  // 811 - 877: PUNCH-IN on Caleb's hero presentation pose (scale 1.12)
  // 877 - 989: Smooth pull-back for floating CTA card (scale 1.0)
  // --------------------------------------------------------------------------
  const s5Local = qFrame - 723;
  let s5Zoom = 1.0;
  let s5Origin = '50% 50%';
  const isCalebHero = s5Local >= 87;

  if (s5Local < 42) {
    s5Zoom = 1.24;
    s5Origin = '50% 65%'; // Macro on marble counter matcha swirl
  } else if (s5Local < 87) {
    s5Zoom = 1.06;
  } else if (s5Local < 154) {
    s5Zoom = 1.12;
    s5Origin = '50% 45%'; // Focus on Caleb hero pointing & bottle
  } else {
    s5Zoom = 1.0; // Wide for floating Saturday Batch card
  }

  // CTA Card stepped 10 FPS spring entrance
  const ctaLocal = qFrame - 877;
  const ctaSpring =
    ctaLocal >= 0
      ? spring({
          frame: ctaLocal,
          fps: 10, // 10 FPS stepped physics!
          config: { damping: 14, stiffness: 200, mass: 0.7 },
        })
      : 0;
  const ctaScale = interpolate(ctaSpring, [0, 1], [0.85, 1.0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0A0A08',
        overflow: 'hidden',
        fontFamily: FONT_SANS,
      }}
    >
      <style>{FONT_STYLE}</style>

      {/* ==================================================================== */}
      {/* AUDIO ENGINE (TIGHT POLISHED VOICEOVER + DUCKED BGM + TACTILE SFX)   */}
      {/* Audio plays continuously at full fidelity                           */}
      {/* ==================================================================== */}
      <Audio
        src={staticFile('assets/voiceover_cup_vs_bottle_tight.mp3')}
        volume={1.0}
      />
      <Audio src={staticFile('assets/bg_music.mp3')} volume={0.12} />

      {/* Tension / Spill alarm at frame 130 */}
      <Sequence from={130} durationInFrames={60}>
        <Audio src={staticFile('assets/sfx/alarm.mp3')} volume={0.35} />
      </Sequence>
      {/* Vinyl stop / Transition snap at frame 345 */}
      <Sequence from={345} durationInFrames={45}>
        <Audio src={staticFile('assets/sfx/scratch.mp3')} volume={0.45} />
      </Sequence>
      {/* Watertight seal snap at frame 456 */}
      <Sequence from={456} durationInFrames={40}>
        <Audio src={staticFile('assets/sfx/snap.mp3')} volume={0.55} />
      </Sequence>
      {/* Whoosh toss throw at frame 570 */}
      <Sequence from={570} durationInFrames={45}>
        <Audio src={staticFile('assets/sfx/whoosh.mp3')} volume={0.5} />
      </Sequence>
      {/* Tactile totebag thud landing at frame 597 */}
      <Sequence from={597} durationInFrames={45}>
        <Audio src={staticFile('assets/sfx/thud.mp3')} volume={0.65} />
      </Sequence>
      {/* Settle impact / Shimmer at frame 723 */}
      <Sequence from={723} durationInFrames={50}>
        <Audio src={staticFile('assets/sfx/impact.mp3')} volume={0.4} />
      </Sequence>

      {/* ==================================================================== */}
      {/* VISUAL ENGINE (10 FPS RETRO ANIMATION ACROSS ALL SCENES)             */}
      {/* ==================================================================== */}

      {/* SCENE 1: ACTIVE 10 FPS TYPING & CONDENSATION DRIP (0 - 129) */}
      {isScene1 && (
        <AbsoluteFill style={{ transform: `scale(${s1Scale})`, transformOrigin: s1Origin }}>
          <Img
            src={staticFile(
              isTypingFrameB
                ? 'assets/pixel/cup_struggle/s1_typing_cup_b.jpg'
                : 'assets/pixel/cup_struggle/s1_typing_cup.jpg'
            )}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              imageRendering: 'pixelated',
              filter: 'contrast(1.08) saturate(1.02) brightness(0.96)',
            }}
          />
          {/* Subtle condensation dripping & vignette */}
          <AbsoluteFill
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(10, 10, 14, 0.45) 100%)',
              pointerEvents: 'none',
            }}
          />
        </AbsoluteFill>
      )}

      {/* SCENE 2: ACTIVE 10 FPS TOTEBAG TILT & SLOSHING PANIC (129 - 347) */}
      {isScene2 && (
        <AbsoluteFill style={{ transform: `scale(${s2Zoom})`, transformOrigin: s2Origin }}>
          <Img
            src={staticFile(
              isSloshingFrameB
                ? 'assets/pixel/cup_struggle/s2_totebag_tilt_b.jpg'
                : 'assets/pixel/cup_struggle/s2_totebag_tilt.jpg'
            )}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              imageRendering: 'pixelated',
              filter: 'contrast(1.10) saturate(1.05) brightness(0.94)',
            }}
          />
          {/* 10 FPS Stepped danger warning pulse on bag tilt */}
          <AbsoluteFill
            style={{
              backgroundColor: `rgba(255, 46, 99, ${dangerPulse})`,
              pointerEvents: 'none',
            }}
          />
          <AbsoluteFill
            style={{
              background:
                'radial-gradient(circle at 50% 50%, transparent 45%, rgba(12, 10, 14, 0.4) 100%)',
              pointerEvents: 'none',
            }}
          />
        </AbsoluteFill>
      )}

      {/* SCENE 3: ACTIVE 10 FPS INVERTED 180° BOTTLE SHAKE OVER MACBOOK (347 - 532) */}
      {isScene3 && (
        <AbsoluteFill style={{ transform: `scale(${s3Zoom}) translateY(${shakeOffsetY}px)`, transformOrigin: s3Origin }}>
          <Img
            src={staticFile(
              shakeFrameB
                ? 'assets/pixel/cup_struggle/s3_inverted_b.jpg'
                : 'assets/pixel/cup_struggle/s3_inverted_a.jpg'
            )}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              imageRendering: 'pixelated',
              filter: 'contrast(1.09) saturate(1.06) brightness(0.97)',
            }}
          />
          {/* Crisp tactile emerald satisfaction overlay */}
          <AbsoluteFill
            style={{
              background:
                'radial-gradient(circle at 50% 40%, rgba(57, 255, 136, 0.08) 0%, transparent 60%)',
              pointerEvents: 'none',
            }}
          />
          {/* Watertight guarantee badge */}
          {s3Local >= 70 && (
            <div
              style={{
                position: 'absolute',
                top: 180,
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(10, 24, 16, 0.88)',
                border: `2px solid ${EMERALD}`,
                boxShadow: `0 0 25px ${EMERALD}50`,
                borderRadius: 40,
                padding: '12px 28px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <span style={{ color: EMERALD, fontSize: 16, fontWeight: 900 }}>[SEALED]</span>
              <span
                style={{
                  fontFamily: FONT_PIXEL,
                  fontSize: 24,
                  fontWeight: 700,
                  color: EMERALD,
                  letterSpacing: 2,
                }}
              >
                100% SEALED // ZERO LEAK
              </span>
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* SCENE 4: 6-FRAME 10 FPS DYNAMIC TOSS SEQUENCE (532 - 723) */}
      {isScene4 && (
        <AbsoluteFill style={{ transform: `scale(${s4Zoom}) translateY(${carryHeadBob}px)`, transformOrigin: s4Origin }}>
          <Img
            src={staticFile(`assets/pixel/cup_struggle/${tossAsset}`)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              imageRendering: 'pixelated',
              filter: 'contrast(1.08) saturate(1.04) brightness(0.97)',
            }}
          />
          <AbsoluteFill
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(10, 12, 16, 0.35) 100%)',
              pointerEvents: 'none',
            }}
          />
          {/* Action indicator badge during carry */}
          {s4Local >= 93 && (
            <div
              style={{
                position: 'absolute',
                top: 180,
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(20, 26, 18, 0.85)',
                border: `2px solid ${GOLD}`,
                boxShadow: `0 0 20px ${GOLD}40`,
                borderRadius: 40,
                padding: '10px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span style={{ color: GOLD, fontSize: 16, fontWeight: 900 }}>[BAG]</span>
              <span
                style={{
                  fontFamily: FONT_PIXEL,
                  fontSize: 22,
                  fontWeight: 700,
                  color: GOLD,
                  letterSpacing: 2,
                }}
              >
                TOTEBAG READY // GRAB & GO
              </span>
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* SCENE 5: TASTE CONSISTENCY & SATURDAY BATCH CTA (723 - 989) */}
      {isScene5 && (
        <AbsoluteFill style={{ transform: `scale(${s5Zoom})`, transformOrigin: s5Origin }}>
          <Img
            src={staticFile(
              isCalebHero
                ? 'assets/pixel/caleb_point_hero.jpg'
                : 'assets/pixel/caleb_pouring_matcha.jpg'
            )}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              imageRendering: 'pixelated',
              filter: 'contrast(1.08) saturate(1.06) brightness(0.97)',
            }}
          />
          <AbsoluteFill
            style={{
              background:
                'radial-gradient(circle at 50% 45%, transparent 40%, rgba(8, 10, 14, 0.48) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Saturday Batch Drop Floating CTA Card (frame 877 - 989) */}
          {qFrame >= 877 && (
            <div
              style={{
                position: 'absolute',
                top: 130,
                left: '50%',
                transform: `translateX(-50%) scale(${ctaScale})`,
                width: 900,
                backgroundColor: 'rgba(12, 18, 14, 0.94)',
                border: `2px solid ${EMERALD}`,
                borderRadius: 24,
                padding: '26px 36px',
                boxShadow: `0 16px 50px rgba(0,0,0,0.8), 0 0 35px ${EMERALD}45`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 20,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  backgroundColor: `${EMERALD}20`,
                  padding: '6px 16px',
                  borderRadius: 20,
                  border: `1px solid ${EMERALD}60`,
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: EMERALD,
                    boxShadow: `0 0 10px ${EMERALD}`,
                  }}
                />
                <span
                  style={{
                    fontFamily: FONT_PIXEL,
                    fontSize: 20,
                    fontWeight: 700,
                    color: EMERALD,
                    letterSpacing: 2,
                  }}
                >
                  BATCH SABTU DIBUKA
                </span>
              </div>

              <div
                style={{
                  fontSize: 48,
                  fontWeight: 900,
                  color: IVORY,
                  letterSpacing: -0.5,
                  textAlign: 'center',
                  lineHeight: 1.15,
                }}
              >
                Amankan Kuota Dingin Lo!
              </div>

              <div
                style={{
                  fontSize: 26,
                  color: '#D4DDD6',
                  textAlign: 'center',
                  fontWeight: 500,
                }}
              >
                100% Oatside murni • Premium Kyoto Matcha • Sealed tightly
              </div>

              {/* Link in Bio Button (Clean CTA without emojis) */}
              <div
                style={{
                  marginTop: 10,
                  backgroundColor: EMERALD,
                  color: '#08140B',
                  fontFamily: FONT_PIXEL,
                  fontSize: 28,
                  fontWeight: 800,
                  letterSpacing: 2,
                  padding: '18px 48px',
                  borderRadius: 50,
                  boxShadow: `0 0 30px ${EMERALD}80`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <span>CLICK LINK IN BIO</span>
              </div>
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* ==================================================================== */}
      {/* TIKTOK CLASSIC CAPTION ENGINE (CENTER-DOWN 56%, 2-3 WORDS AT A TIME) */}
      {/* ==================================================================== */}
      <div
        style={{
          position: 'absolute',
          top: '56%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '92%',
          maxWidth: 960,
          textAlign: 'center',
          pointerEvents: 'none',
          zIndex: 900,
        }}
      >
        <div
          style={{
            fontFamily: `${FONT_SANS}, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
            fontSize: activeChunk.emphasis ? 72 : 64,
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            color:
              activeChunk.highlight === 'emerald'
                ? EMERALD
                : activeChunk.highlight === 'gold'
                ? GOLD
                : activeChunk.highlight === 'crimson'
                ? CRIMSON
                : activeChunk.highlight === 'cyan'
                ? CYAN
                : IVORY,
            textShadow: `
              -3px -3px 0 #000,
               3px -3px 0 #000,
              -3px  3px 0 #000,
               3px  3px 0 #000,
               0px  4px 12px rgba(0, 0, 0, 0.95),
               0px  8px 24px rgba(0, 0, 0, 0.75)
            `,
            WebkitTextStroke: '2.5px #000000',
            lineHeight: 1.15,
            padding: '6px 16px',
            display: 'inline-block',
          }}
        >
          {activeChunk.text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim()}
        </div>
      </div>
    </AbsoluteFill>
  );
};
