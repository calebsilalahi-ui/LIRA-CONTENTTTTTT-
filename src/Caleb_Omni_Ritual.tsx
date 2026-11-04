import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  spring,
  Easing,
} from 'remotion';

export const CALEB_OMNI_DURATION = 160; // 5.0 seconds @ 32 FPS

export const Caleb_Omni_Ritual: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 32;

  // =========================================================================
  // 1. TIMELINE PHASES (32 FPS):
  // Phase 1 (0 - 30):   Inspect & Grip (Anticipation)
  // Phase 2 (30 - 75):  Vigorous Mixing Shake (Harmonic High-Frequency Motion)
  // Phase 3 (75 - 102): Pop & Uncap (Tactile Twist & Cap Separation)
  // Phase 4 (102 - 134): Lift, Tilt & Sip (Head tilts back, bottle raises to lips)
  // Phase 5 (134 - 160): Lower & Confident Smirk (Direct camera eye contact)
  // =========================================================================

  // --- Dynamic Camera Subtle Push-In (Cinematic Handheld feel) ---
  const camScale = interpolate(frame, [0, 160], [1.0, 1.05], {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });
  const camBobY = Math.sin(frame * 0.08) * 3;

  // --- Organic Breathing & Body Weight Shift ---
  const breathY = Math.sin((frame / fps) * Math.PI * 1.5) * 5;

  // --- Phase 2 Shake Oscillation (Harmonic Shake Physics) ---
  const isShaking = frame >= 30 && frame <= 75;
  const shakeProgress = interpolate(frame, [30, 42, 65, 75], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shakeOscY = Math.sin((frame - 30) * 1.35) * 26 * shakeProgress;
  const shakeOscX = Math.cos((frame - 30) * 1.1) * 8 * shakeProgress;
  const shakeRot = Math.sin((frame - 30) * 1.25) * 7 * shakeProgress;

  // --- Phase 3 Cap Twist & Pop Physics ---
  const uncapProgress = interpolate(frame, [78, 92], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const capY = -uncapProgress * 80;
  const capRotate = -uncapProgress * 360;
  const capOpacity = interpolate(frame, [78, 80, 102, 110], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // --- Phase 4 Sip & Head Tilt Back Physics ---
  const sipTiltBack = interpolate(frame, [102, 115, 126, 134], [0, -16, -16, 0], {
    easing: Easing.inOut(Easing.quad),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const sipBottleLift = interpolate(frame, [102, 114, 126, 134], [0, -45, -45, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const sipBottleAngle = interpolate(frame, [102, 115, 126, 134], [0, 38, 38, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // --- Phase 5 Confident Smirk Spring ---
  const smirkSpring = spring({
    frame: frame - 134,
    fps,
    config: { damping: 12, stiffness: 100 },
  });
  const smirkHeadTilt = interpolate(smirkSpring, [0, 1], [0, 3]);

  // --- Pose Cross-Dissolves (Smooth Morphing between Key Character Poses) ---
  // Pose 1: Inspect (0 - 32)
  const p1Opacity = interpolate(frame, [26, 34], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Pose 2: Shake (30 - 78)
  const p2Opacity = interpolate(frame, [28, 34, 72, 78], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Pose 3: Uncap (74 - 104)
  const p3Opacity = interpolate(frame, [74, 80, 98, 104], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Pose 4: Sip (100 - 136)
  const p4Opacity = interpolate(frame, [100, 106, 130, 136], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Pose 5: Smirk (132 - 160)
  const p5Opacity = interpolate(frame, [132, 138], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Combined character Y offset & rotation (Synthesizing human posture adjustments)
  const characterY = breathY + shakeOscY * 0.4 + sipBottleLift * 0.3;
  const characterX = shakeOscX * 0.4;
  const characterRotate = shakeRot * 0.3 + sipTiltBack + smirkHeadTilt;

  // Glint ping on bottle & glasses during smirk
  const glintScale = interpolate(frame, [140, 146, 154], [0, 1.4, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0A0E14',
        overflow: 'hidden',
        transform: `scale(${camScale}) translateY(${camBobY}px)`,
        transformOrigin: '50% 50%',
      }}
    >
      {/* ================= AUDIO CHOREOGRAPHY ================= */}
      {/* Chill Background Beat */}
      <Audio
        src={staticFile('assets/bg_music.mp3')}
        volume={0.16}
      />
      {/* Shake Whoosh on initiation */}
      {frame === 31 && <Audio src={staticFile('assets/sfx/whoosh.mp3')} volume={0.6} />}
      {/* Pop Snap on Uncap (Frame 80) */}
      {frame === 80 && <Audio src={staticFile('assets/sfx/snap.mp3')} volume={0.8} />}
      {/* Satisfying Sub-Hit on Smirk Lock-In (Frame 138) */}
      {frame === 138 && <Audio src={staticFile('assets/sfx/sub_hit.mp3')} volume={0.5} />}

      {/* ================= LAYER 1: STATIC ROOM BACKGROUND ================= */}
      <AbsoluteFill>
        <Img
          src={staticFile('assets/pixel/scene_5_laptop_a.jpg')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.85)',
          }}
        />
      </AbsoluteFill>

      {/* ================= LAYER 2: CHOREOGRAPHED CHARACTER POSES ================= */}
      {/* The container translates and tilts with the organic physical motion curves */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translate(${characterX}px, ${characterY}px) rotate(${characterRotate}deg)`,
          transformOrigin: '50% 75%',
        }}
      >
        {/* Frame 1: Inspect / Anticipation */}
        {p1Opacity > 0 && (
          <div style={{ position: 'absolute', inset: 0, opacity: p1Opacity }}>
            <Img
              src={staticFile('assets/pixel/caleb_action_seq/f1_inspect.jpg')}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Frame 2: Active Shaking with Motion Blur */}
        {p2Opacity > 0 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: p2Opacity,
              transform: `scale(${1 + Math.abs(shakeRot) * 0.008})`,
            }}
          >
            <Img
              src={staticFile('assets/pixel/caleb_action_seq/f2_shake.jpg')}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Frame 3: Uncapping Bottle */}
        {p3Opacity > 0 && (
          <div style={{ position: 'absolute', inset: 0, opacity: p3Opacity }}>
            <Img
              src={staticFile('assets/pixel/caleb_action_seq/f3_uncap.jpg')}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Frame 4: Drinking / Savoring */}
        {p4Opacity > 0 && (
          <div style={{ position: 'absolute', inset: 0, opacity: p4Opacity }}>
            <Img
              src={staticFile('assets/pixel/caleb_action_seq/f4_sip.jpg')}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Frame 5: Lower Bottle & Confident Smirk */}
        {p5Opacity > 0 && (
          <div style={{ position: 'absolute', inset: 0, opacity: p5Opacity }}>
            <Img
              src={staticFile('assets/pixel/caleb_action_seq/f5_smirk.jpg')}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}
      </div>

      {/* ================= LAYER 3: PROCEDURAL PARTICLES & SECONDARY PHYSICS ================= */}

      {/* 3A: Vigor Shake Speed Lines & Condensation Beads (Phase 2) */}
      {isShaking && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {[...Array(6)].map((_, i) => {
            const lineX = 480 + (i - 2.5) * 45;
            const lineY = 620 + Math.sin(frame * 0.8 + i) * 60;
            const lineH = 30 + (i % 3) * 20;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: lineX,
                  top: lineY,
                  width: 3,
                  height: lineH,
                  backgroundColor: 'rgba(57, 255, 136, 0.65)',
                  boxShadow: '0 0 8px #39FF88',
                  borderRadius: 2,
                  opacity: (frame + i) % 2 === 0 ? 0.9 : 0.2,
                }}
              />
            );
          })}
        </div>
      )}

      {/* 3B: Uncap Gold Seal Pop (Phase 3) */}
      {capOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            left: 540,
            top: 520,
            transform: `translateY(${capY}px) rotate(${capRotate}deg)`,
            opacity: capOpacity,
            zIndex: 35,
            pointerEvents: 'none',
          }}
        >
          {/* Gold Cap Icon */}
          <div
            style={{
              width: 36,
              height: 20,
              backgroundColor: '#E5B842',
              borderRadius: '4px 4px 2px 2px',
              border: '2px solid #8F6915',
              boxShadow: '0 0 12px rgba(229, 184, 66, 0.8)',
            }}
          />
        </div>
      )}

      {/* 3C: Fresh Matcha Aroma Sparkles Rising on Uncap (Frames 80 - 105) */}
      {frame >= 80 && frame <= 108 && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 35 }}>
          {[...Array(4)].map((_, i) => {
            const sparkleLife = (frame - 80 - i * 6) / 20;
            if (sparkleLife < 0 || sparkleLife > 1) return null;
            const spY = 560 - sparkleLife * 120;
            const spX = 530 + Math.sin(sparkleLife * Math.PI * 2 + i) * 25;
            const spScale = Math.sin(sparkleLife * Math.PI);
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: spX,
                  top: spY,
                  width: 10,
                  height: 10,
                  backgroundColor: '#39FF88',
                  borderRadius: '50%',
                  boxShadow: '0 0 10px #39FF88',
                  transform: `scale(${spScale})`,
                  opacity: 1 - sparkleLife,
                }}
              />
            );
          })}
        </div>
      )}

      {/* 3D: Glasses & Bottle Glint Ping on Smirk (Phase 5) */}
      {glintScale > 0 && (
        <div
          style={{
            position: 'absolute',
            left: 495,
            top: 365,
            transform: `scale(${glintScale}) rotate(45deg)`,
            zIndex: 40,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              width: 24,
              height: 4,
              backgroundColor: '#FFFFFF',
              boxShadow: '0 0 16px #39FF88, 0 0 8px #FFFFFF',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: -10,
              left: 10,
              width: 4,
              height: 24,
              backgroundColor: '#FFFFFF',
              boxShadow: '0 0 16px #39FF88, 0 0 8px #FFFFFF',
            }}
          />
        </div>
      )}

      {/* ================= LAYER 4: LIVE ANIMATION BEAT HUD ================= */}
      <div
        style={{
          position: 'absolute',
          top: 70,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(7, 12, 18, 0.92)',
          border: '1.5px solid #39FF88',
          boxShadow: '0 8px 30px rgba(57, 255, 136, 0.35)',
          borderRadius: 18,
          padding: '12px 24px',
          textAlign: 'center',
          zIndex: 50,
          backdropFilter: 'blur(8px)',
        }}
      >
        <div
          style={{
            color: '#39FF88',
            fontFamily: '"Silkscreen", monospace',
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: '0.08em',
            marginBottom: 4,
          }}
        >
          {frame < 30 && 'ACT 1: ANTICIPATE & GRIP'}
          {frame >= 30 && frame < 75 && 'ACT 2: VIGOROUS MIXING SHAKE'}
          {frame >= 75 && frame < 102 && 'ACT 3: THE POP & UNCAP'}
          {frame >= 102 && frame < 134 && 'ACT 4: REFRESHING PREMIUM SIP'}
          {frame >= 134 && 'ACT 5: FOUNDER CONFIDENT SMIRK'}
        </div>
        <div
          style={{
            color: '#A0B4C8',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Programmatic Character Movement • Frame {frame} / {CALEB_OMNI_DURATION} (32 FPS)
        </div>
      </div>
    </AbsoluteFill>
  );
};
