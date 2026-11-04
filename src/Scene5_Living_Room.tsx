import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  Easing,
} from 'remotion';

export const SCENE5_LIVING_DURATION = 192; // 6.0 seconds @ 32 FPS (Perfect seamless loop)

export const Scene5_Living_Room: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 32;

  // =========================================================================
  // 1. ATMOSPHERIC LIGHTING PHYSICS (MULTI-HARMONIC ELECTRICAL FLICKER)
  // =========================================================================

  // --- Warm Tungsten Desk Lamp (Right side: ~85% X, ~35% Y) ---
  // Micro-fluctuations simulating 2:00 AM analog grid voltage hum
  const lampBase = 1.0;
  const lampHarmonic1 = Math.sin(frame * 0.38) * 0.08;
  const lampHarmonic2 = Math.sin(frame * 0.92) * 0.05;
  const lampHarmonic3 = Math.cos(frame * 1.65) * 0.03;
  // Subtle momentary electrical dip on specific late-night frames
  const voltageDip = (frame === 34 || frame === 118 || frame === 162) ? -0.15 : 0;
  const lampIntensity = Math.max(0.65, Math.min(1.25, lampBase + lampHarmonic1 + lampHarmonic2 + lampHarmonic3 + voltageDip));

  // --- Green Laptop Phosphor Screen Glow (Bottom-Left: ~25% X, ~75% Y) ---
  // Pulses as code/spreadsheet data shifts and screen draws
  const screenHarmonic1 = Math.sin(frame * 0.24) * 0.14;
  const screenHarmonic2 = Math.cos(frame * 0.62) * 0.08;
  const screenScanline = (frame % 4 === 0) ? 0.04 : 0;
  const screenIntensity = Math.max(0.7, Math.min(1.3, 1.0 + screenHarmonic1 + screenHarmonic2 + screenScanline));

  // =========================================================================
  // 2. CHARACTER CHOREOGRAPHY: DRINKING LIRA & BREATHING CYCLE
  // =========================================================================

  // Subtle organic torso breathing (continuous 2px cycle)
  const breathY = Math.sin((frame / fps) * Math.PI * 1.0) * 2.2;

  // Left hand typing micro-motions on keyboard
  const typingY = Math.round(Math.sin(frame * 0.7) * 1.5);
  const typingX = Math.round(Math.cos(frame * 0.5) * 1.0);

  // --- The 6-Second Drinking Motion Timeline ---
  // 0.0s – 1.4s (Frames 0 - 45):   Resting & working at laptop
  // 1.4s – 2.5s (Frames 45 - 80):  Arm lifts Lira bottle in smooth curved arc toward mouth
  // 2.5s – 3.9s (Frames 80 - 125): Head tilts back (-15°), bottle tips up (+46°), taking refreshing sip
  // 3.9s – 5.0s (Frames 125 - 160): Bottle lowers back down, head returns forward
  // 5.0s – 6.0s (Frames 160 - 192): Settle into resting posture, resume typing
  
  // Smooth parabolic lift progress [0 -> 1 -> 0]
  const drinkLift = interpolate(
    frame,
    [45, 80, 125, 160],
    [0, 1, 1, 0],
    {
      easing: Easing.bezier(0.33, 1, 0.68, 1),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Arm & Bottle translation and rotation
  const bottleLiftY = -drinkLift * 165;
  const bottleSweepX = drinkLift * 185;
  const bottleTilt = drinkLift * 46;

  // Head tilt kinematics (pivots back during the sip)
  const headTilt = interpolate(
    frame,
    [52, 82, 122, 155],
    [0, -14, -14, 0],
    {
      easing: Easing.inOut(Easing.quad),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );
  const headLiftY = drinkLift * -4;

  // Eye blink (momentary lid close at frame 40 and frame 168)
  const isBlinking = (frame >= 38 && frame <= 42) || (frame >= 166 && frame <= 170);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#090D13',
        overflow: 'hidden',
      }}
    >
      {/* ================= AUDIO AMBIENCE ================= */}
      {/* Quiet late-night lo-fi chill groove */}
      <Audio
        src={staticFile('assets/bg_music.mp3')}
        volume={0.14}
      />
      {/* Subtle mechanical key click during typing (Frame 18 & 175) */}
      {(frame === 18 || frame === 175) && (
        <Audio src={staticFile('assets/sfx/snap.mp3')} volume={0.15} />
      )}
      {/* Smooth, subtle sip cue when bottle touches lips (Frame 82) */}
      {frame === 82 && (
        <Audio src={staticFile('assets/sfx/whoosh.mp3')} volume={0.25} />
      )}

      {/* ================= LAYER 1: INPAINTED CLEAN BACKGROUND ================= */}
      {/* 
        This is the exact artwork plate with the desk, laptop, and background.
        The area behind the bottle is cleanly inpainted so when Caleb lifts the bottle,
        there is genuine background beneath it.
      */}
      <AbsoluteFill>
        <Img
          src={staticFile('assets/pixel/scene5_bg_inpainted.png')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            imageRendering: 'pixelated',
          }}
        />
      </AbsoluteFill>

      {/* ================= LAYER 2: CALEB BODY & TYPING LEFT HAND ================= */}
      {/* Caleb Torso with organic breathing heave */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateY(${breathY}px)`,
          pointerEvents: 'none',
        }}
      >
        {/* Left hand typing micro-movements on the keyboard */}
        <div
          style={{
            position: 'absolute',
            left: 370,
            top: 770,
            width: 200,
            height: 150,
            transform: `translate(${typingX}px, ${typingY}px)`,
            zIndex: 15,
          }}
        >
          <Img
            src={staticFile('assets/pixel/scene5_left_hand.png')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              imageRendering: 'pixelated',
            }}
          />
        </div>

        {/* ================= LAYER 3: CALEB HEAD RIG ================= */}
        {/* 
          Caleb's head pivots backward when sipping from the bottle.
          Origin is anchored right at the neck collar (x: 520, y: 440).
        */}
        <div
          style={{
            position: 'absolute',
            left: 330,
            top: 60,
            width: 320,
            height: 420,
            transform: `translateY(${headLiftY}px) rotate(${headTilt}deg)`,
            transformOrigin: '55% 90%', // Pivots at base of neck!
            zIndex: 20,
          }}
        >
          <Img
            src={staticFile('assets/pixel/scene5_head_alpha.png')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              imageRendering: 'pixelated',
            }}
          />

          {/* Eye Blink Pixel Overlay (Frames 38-42 & 166-170) */}
          {isBlinking && (
            <div
              style={{
                position: 'absolute',
                top: 295,
                left: 172,
                width: 76,
                height: 12,
                backgroundColor: '#1E2620',
                borderRadius: 2,
                zIndex: 22,
              }}
            />
          )}
        </div>
      </div>

      {/* ================= LAYER 4: ARTICULATED RIGHT ARM & LIRA BOTTLE ================= */}
      {/* 
        This is Caleb's right arm holding the Lira Matcha bottle from the screenshot.
        It lifts along a smooth parabolic arc, tilts up to his mouth, holds for the sip,
        and lowers smoothly back to resting position.
      */}
      <div
        style={{
          position: 'absolute',
          left: 135 + bottleSweepX,
          top: 305 + bottleLiftY + breathY * 0.5,
          transform: `rotate(${bottleTilt}deg)`,
          transformOrigin: '25% 85%', // Pivots naturally at the elbow/forearm!
          width: 145,
          height: 340,
          zIndex: 25,
          filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.45))',
        }}
      >
        <Img
          src={staticFile('assets/pixel/scene5_bottle_hand_alpha.png')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            imageRendering: 'pixelated',
          }}
        />
      </div>

      {/* ================= LAYER 5: ATMOSPHERIC LIGHTING OVERLAYS ================= */}

      {/* 5A: Warm Tungsten Desk Lamp Radial Light Cone (Top-Right) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 86% 36%, rgba(255, 195, 75, 0.38) 0%, rgba(255, 160, 45, 0.22) 32%, rgba(230, 120, 25, 0.08) 58%, transparent 80%)',
          mixBlendMode: 'screen',
          opacity: lampIntensity,
          pointerEvents: 'none',
          zIndex: 30,
        }}
      />

      {/* 5B: Laptop Spreadsheet Vibrant Green Phosphor Glow (Bottom-Left) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 26% 76%, rgba(57, 255, 136, 0.36) 0%, rgba(32, 210, 95, 0.20) 36%, rgba(12, 110, 45, 0.06) 65%, transparent 82%)',
          mixBlendMode: 'screen',
          opacity: screenIntensity,
          pointerEvents: 'none',
          zIndex: 30,
        }}
      />

      {/* 5C: Night Window Stars & Distant City Pixel Shimmer (Top-Left) */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 12 }}>
        {/* Star 1 */}
        <div
          style={{
            position: 'absolute',
            left: '12%',
            top: '8%',
            width: 3,
            height: 3,
            backgroundColor: '#D0E8FF',
            boxShadow: '0 0 6px #A0D0FF',
            opacity: 0.4 + Math.sin(frame * 0.12) * 0.5,
          }}
        />
        {/* Star 2 */}
        <div
          style={{
            position: 'absolute',
            left: '21%',
            top: '15%',
            width: 2,
            height: 2,
            backgroundColor: '#FFF0C0',
            boxShadow: '0 0 4px #FFE080',
            opacity: 0.3 + Math.cos(frame * 0.16) * 0.6,
          }}
        />
        {/* City Window 1 */}
        <div
          style={{
            position: 'absolute',
            left: '16%',
            top: '36%',
            width: 4,
            height: 4,
            backgroundColor: '#FFAA33',
            boxShadow: '0 0 6px rgba(255, 170, 51, 0.8)',
            opacity: 0.6 + Math.sin(frame * 0.08 + 1) * 0.35,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
