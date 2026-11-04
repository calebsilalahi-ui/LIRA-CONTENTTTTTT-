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

export const CALEB_PUPPET_DURATION = 160; // 5.0 seconds @ 32 FPS

export const Caleb_Puppet_Rig: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 32;

  // =========================================================================
  // 1. PROCEDURAL CINEMATOGRAPHY & AMBIENT BREATHING
  // =========================================================================
  // Slow cinematic camera push-in
  const cameraZoom = interpolate(frame, [0, 160], [1.0, 1.06], {
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
  });
  const cameraBobY = Math.sin(frame * 0.05) * 2;

  // Natural organic breathing (affects torso and carries through to head)
  const breathY = Math.sin((frame / fps) * Math.PI * 1.5) * 4;

  // =========================================================================
  // 2. PHASE TIMELINES (@ 32 FPS)
  // Phase 1 (0 - 30):   Idle on desk -> Hand reaches & grips bottle
  // Phase 2 (30 - 75):  Lift & Vigorous Mixing Shake (Harmonic Pumping)
  // Phase 3 (75 - 100): The Pop & Uncap (Twist & Cap fly-off)
  // Phase 4 (100 - 132): Lift to Lips, Head Tilts Back & Drink
  // Phase 5 (132 - 160): Lower Bottle, Head Returns & Confident Smirk
  // =========================================================================

  // --- ARM & BOTTLE TRAJECTORY ---
  // Lift trajectory from desk (Phase 1 -> 2)
  const armLift = interpolate(frame, [15, 30], [80, 0], {
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Vigorous shake oscillation (Phase 2: Frames 30 - 75)
  const isShaking = frame >= 30 && frame <= 75;
  const shakeWeight = interpolate(frame, [30, 36, 68, 75], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shakeY = Math.sin((frame - 30) * 1.55) * 34 * shakeWeight;
  const shakeX = Math.cos((frame - 30) * 1.2) * 8 * shakeWeight;
  const shakeTilt = Math.sin((frame - 30) * 1.4) * 8 * shakeWeight;

  // Sip lift & tilt trajectory (Phase 4: Frames 100 - 132)
  const isSipping = frame >= 100 && frame <= 132;
  const sipProgress = interpolate(frame, [100, 114, 126, 134], [0, 1, 1, 0], {
    easing: Easing.bezier(0.25, 1, 0.5, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const sipLiftY = -sipProgress * 95;
  const sipTilt = sipProgress * 42;
  const sipShiftX = -sipProgress * 40;

  // Smirk settle spring (Phase 5: Frames 134 - 160)
  const smirkSpring = spring({
    frame: frame - 134,
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  const smirkTilt = interpolate(smirkSpring, [0, 1], [0, 3]);

  // Combined Arm & Bottle position
  const bottlePosY = armLift + shakeY + sipLiftY;
  const bottlePosX = shakeX + sipShiftX;
  const bottleAngle = shakeTilt + sipTilt;

  // --- CAP UNCAP PHYSICS (Phase 3: Frames 76 - 100) ---
  const uncapProgress = interpolate(frame, [77, 90], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const capY = -uncapProgress * 110;
  const capX = Math.sin(uncapProgress * Math.PI) * 20;
  const capRot = -uncapProgress * 540;
  const capFade = interpolate(frame, [77, 80, 96, 104], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // --- HEAD & NECK KINEMATICS ---
  // Head tilts with breathing, reacts to shake inertia, tilts back on sip, nods on smirk
  const headAnticipation = interpolate(frame, [0, 20], [3, 0], {
    easing: Easing.out(Easing.quad),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const headShakeInertia = -shakeY * 0.12; // Secondary action lag!
  const headSipTiltBack = -sipProgress * 22; // Pivots neck backward during sip!
  const headAngle = headAnticipation + headShakeInertia + headSipTiltBack + smirkTilt;
  const headY = breathY + Math.abs(headShakeInertia) * 0.5;

  // --- LIQUID FILL LEVEL (Lowers slightly during sip) ---
  const liquidLevel = interpolate(frame, [110, 130], [100, 78], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // --- GLASSES & BOTTLE LENS GLINT (Phase 5) ---
  const glintScale = interpolate(frame, [140, 146, 154], [0, 1.5, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#090D13',
        overflow: 'hidden',
        transform: `scale(${cameraZoom}) translateY(${cameraBobY}px)`,
        transformOrigin: '50% 50%',
      }}
    >
      {/* ================= AUDIO CHOREOGRAPHY ================= */}
      <Audio
        src={staticFile('assets/bg_music.mp3')}
        volume={0.16}
      />
      {frame === 30 && <Audio src={staticFile('assets/sfx/whoosh.mp3')} volume={0.5} />}
      {frame === 77 && <Audio src={staticFile('assets/sfx/snap.mp3')} volume={0.8} />}
      {frame === 138 && <Audio src={staticFile('assets/sfx/sub_hit.mp3')} volume={0.5} />}

      {/* ================= LAYER 1: STATIC ROOM BACKGROUND PLATE ================= */}
      {/* Rock-solid, absolutely zero flicker or ghosting */}
      <AbsoluteFill>
        <Img
          src={staticFile('assets/pixel/scene_5_laptop_a.jpg')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.8)',
          }}
        />
      </AbsoluteFill>

      {/* ================= LAYER 2: CALEB CHARACTER RIG ================= */}
      {/* 
        This is a TRUE 2D PUPPET RIG.
        Every body part is a discrete, persistent layer with real pivot points!
      */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 896,
          height: 1200,
          pointerEvents: 'none',
        }}
      >
        {/* 2A: Caleb Lower Torso & Desk Anchor */}
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            left: 275,
            width: 345,
            height: 380,
            zIndex: 10,
          }}
        >
          <Img
            src={staticFile('assets/pixel/character/rig_legs.png')}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* 2B: Caleb Core Torso (Breathing & Weight Shift) */}
        <div
          style={{
            position: 'absolute',
            bottom: 310 + breathY,
            left: 315,
            width: 265,
            height: 420,
            transformOrigin: '50% 90%',
            zIndex: 12,
          }}
        >
          <Img
            src={staticFile('assets/pixel/character/rig_torso_core.png')}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* 2C: Caleb Left Arm (Resting naturally on desk near keyboard) */}
        <div
          style={{
            position: 'absolute',
            bottom: 310 + breathY * 0.5,
            left: 215,
            width: 155,
            height: 350,
            transform: 'rotate(-4deg)',
            transformOrigin: '80% 20%',
            zIndex: 14,
          }}
        >
          <Img
            src={staticFile('assets/pixel/character/rig_arm_left.png')}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* 2D: Caleb Head & Neck Pivot (Tilted back when drinking, nodding on smirk) */}
        <div
          style={{
            position: 'absolute',
            bottom: 620 + headY,
            left: 330,
            width: 240,
            height: 230,
            transform: `rotate(${headAngle}deg)`,
            transformOrigin: '50% 90%', // Pivots precisely from the neck base!
            zIndex: 20,
            filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4))',
          }}
        >
          <Img
            src={staticFile('assets/pixel/character/rig_head.png')}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />

          {/* Glasses glint ping during smirk */}
          {glintScale > 0 && (
            <div
              style={{
                position: 'absolute',
                top: 90,
                left: 105,
                transform: `scale(${glintScale}) rotate(45deg)`,
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 4,
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 0 12px #39FF88, 0 0 6px #FFFFFF',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: -8,
                  left: 8,
                  width: 4,
                  height: 20,
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 0 12px #39FF88, 0 0 6px #FFFFFF',
                }}
              />
            </div>
          )}
        </div>

        {/* 2E: Caleb Right Arm (Shoulder Pivot -> Forearm -> Hand) */}
        <div
          style={{
            position: 'absolute',
            bottom: 330 + breathY,
            left: 520,
            width: 160,
            height: 360,
            transform: `rotate(${interpolate(bottlePosY, [-95, 0, 80], [-28, -4, 12])}deg)`,
            transformOrigin: '20% 15%', // Shoulder joint!
            zIndex: 15,
          }}
        >
          <Img
            src={staticFile('assets/pixel/character/rig_arm_right.png')}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* 2F: Hand Holding Lira Bottle Rig */}
        {/* The bottle and hand are mechanically parented together */}
        <div
          style={{
            position: 'absolute',
            bottom: 370 - bottlePosY,
            left: 510 + bottlePosX,
            transform: `rotate(${bottleAngle}deg)`,
            transformOrigin: '30% 75%', // Pivot at the wrist!
            width: 140,
            height: 240,
            zIndex: 25,
            filter: 'drop-shadow(0 12px 24px rgba(0, 0, 0, 0.55))',
          }}
        >
          {/* Transparent Lira Bottle Body */}
          <div
            style={{
              position: 'absolute',
              top: 40,
              left: 20,
              width: 94,
              height: 160,
              overflow: 'hidden',
              borderRadius: '8px 8px 12px 12px',
            }}
          >
            <Img
              src={staticFile('assets/pixel/rig_bottle_body.png')}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />

            {/* Dynamic Matcha Liquid Fill Level */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: `${liquidLevel}%`,
                backgroundColor: 'rgba(28, 120, 56, 0.25)',
                transition: 'height 0.1s linear',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Gold Bottle Cap (Attached when sealed, pops off in Phase 3!) */}
          {frame < 77 && (
            <div
              style={{
                position: 'absolute',
                top: 18,
                left: 42,
                width: 50,
                height: 25,
                zIndex: 30,
              }}
            >
              <Img
                src={staticFile('assets/pixel/rig_bottle_cap.png')}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          )}

          {/* Caleb's Hand Cutout Clamping over the Bottle */}
          <div
            style={{
              position: 'absolute',
              top: 55,
              left: 0,
              width: 92,
              height: 160,
              zIndex: 32,
            }}
          >
            <Img
              src={staticFile('assets/pixel/character/caleb_hand_clean_cutout.png')}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* 2G: Flying Gold Cap on Uncap Pop (Phase 3: Frames 77 - 100) */}
        {capFade > 0 && (
          <div
            style={{
              position: 'absolute',
              bottom: 370 - bottlePosY + 140 - capY,
              left: 510 + bottlePosX + 42 + capX,
              transform: `rotate(${capRot}deg)`,
              width: 50,
              height: 25,
              opacity: capFade,
              zIndex: 40,
              pointerEvents: 'none',
              filter: 'drop-shadow(0 0 8px rgba(229, 184, 66, 0.8))',
            }}
          >
            <Img
              src={staticFile('assets/pixel/rig_bottle_cap.png')}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        )}
      </div>

      {/* ================= LAYER 3: SECONDARY MOTION GRAPHICS ================= */}

      {/* 3A: Vigorous Shake Speed Lines & Vibration (Phase 2) */}
      {isShaking && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {[...Array(5)].map((_, i) => {
            const lineX = 520 + (i - 2) * 35;
            const lineY = 650 + Math.sin(frame * 0.9 + i) * 50;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: lineX,
                  top: lineY,
                  width: 3,
                  height: 35,
                  backgroundColor: '#39FF88',
                  boxShadow: '0 0 10px #39FF88',
                  borderRadius: 2,
                  opacity: (frame + i) % 2 === 0 ? 0.8 : 0.2,
                }}
              />
            );
          })}
        </div>
      )}

      {/* 3B: Green Matcha Aroma Sparkles on Cap Pop (Phase 3) */}
      {frame >= 78 && frame <= 104 && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 45 }}>
          {[...Array(5)].map((_, i) => {
            const life = (frame - 78 - i * 4) / 18;
            if (life < 0 || life > 1) return null;
            const spY = 600 - life * 110;
            const spX = 550 + Math.sin(life * Math.PI * 2 + i) * 30;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: spX,
                  top: spY,
                  width: 8,
                  height: 8,
                  backgroundColor: '#39FF88',
                  borderRadius: '50%',
                  boxShadow: '0 0 10px #39FF88',
                  transform: `scale(${Math.sin(life * Math.PI)})`,
                  opacity: 1 - life,
                }}
              />
            );
          })}
        </div>
      )}

      {/* ================= LAYER 4: MOTION BEAT HUD OVERLAY ================= */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(7, 12, 18, 0.94)',
          border: '1.5px solid #39FF88',
          boxShadow: '0 8px 32px rgba(57, 255, 136, 0.4)',
          borderRadius: 20,
          padding: '12px 28px',
          textAlign: 'center',
          zIndex: 50,
          backdropFilter: 'blur(8px)',
        }}
      >
        <div
          style={{
            color: '#39FF88',
            fontFamily: '"Silkscreen", monospace',
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: '0.08em',
            marginBottom: 4,
          }}
        >
          {frame < 30 && 'ACT 1: REACH & ANTICIPATION'}
          {frame >= 30 && frame < 75 && 'ACT 2: VIGOROUS MIXING SHAKE'}
          {frame >= 75 && frame < 100 && 'ACT 3: TACTILE GOLD CAP POP'}
          {frame >= 100 && frame < 132 && 'ACT 4: 42° PREMIUM SIP'}
          {frame >= 132 && 'ACT 5: FOUNDER CONFIDENT SMIRK'}
        </div>
        <div
          style={{
            color: '#A0B4C8',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Articulated 2D Puppet Rig • Frame {frame} / {CALEB_PUPPET_DURATION} (@ 32 FPS)
        </div>
      </div>
    </AbsoluteFill>
  );
};
