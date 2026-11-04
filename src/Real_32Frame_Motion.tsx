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

export const REAL_32_MOTION_DURATION = 64; // 2.0 seconds @ 32 FPS (64 unique frames)

export const Real_32Frame_Motion: React.FC = () => {
  const frame = useCurrentFrame();

  // ========================================================
  // REAL 32 FPS CONTINUOUS SPATIAL TRAJECTORY
  // Every single frame has a distinctly different X, Y, and Angle!
  // ========================================================

  // Phase 1: Lifting the bottle from desk to chest (Frames 0 to 32)
  // Phase 2: Toasting forward toward camera with 3D scale-up (Frames 32 to 64)

  // 1. Arm & Bottle Vertical Motion (Smooth cubic bezier curve across 32 frames)
  const bottleY = interpolate(frame, [0, 32, 48, 64], [180, 0, -40, -30], {
    easing: Easing.bezier(0.22, 1, 0.36, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 2. Arm & Bottle Horizontal Sweep Arc (Parabolic arc trajectory)
  const bottleX = interpolate(frame, [0, 16, 32, 64], [60, -20, 0, 10], {
    easing: Easing.bezier(0.22, 1, 0.36, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 3. Dynamic Bottle Rotation (Tilts back during lift, settles straight)
  const bottleRotate = interpolate(frame, [0, 14, 32, 48, 64], [-22, 12, 0, 8, 4], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 4. Bottle 3D Depth Scale (Moves closer to camera in Phase 2)
  const bottleScale = interpolate(frame, [32, 54], [1.0, 1.35], {
    easing: Easing.out(Easing.back(1.5)),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 5. Caleb Head & Torso Reaction (Anticipates motion, tilts head, breathes)
  const headTilt = interpolate(frame, [0, 18, 36, 64], [-3, 4, 0, -2], {
    easing: Easing.inOut(Easing.quad),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bodyBobY = Math.sin((frame / 32) * Math.PI * 2) * 4;

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0E14', overflow: 'hidden' }}>
      {/* Background Audio & Toast SFX */}
      <Audio
        src={staticFile('assets/bg_music.mp3')}
        volume={0.14}
      />
      {frame >= 32 && frame < 50 && (
        <Audio src={staticFile('assets/sfx/snap.mp3')} volume={0.7} />
      )}

      {/* Layer 1: Static Background Plate (Rock solid, 0% flicker) */}
      <AbsoluteFill>
        <Img
          src={staticFile('assets/pixel/scene_5_laptop_a.jpg')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.7) blur(2px)',
          }}
        />
      </AbsoluteFill>

      {/* Layer 2: Caleb Body Sprite (Smooth sub-pixel breathing & head tilt) */}
      <div
        style={{
          position: 'absolute',
          bottom: -40 + bodyBobY,
          left: '50%',
          transform: `translateX(-50%) rotate(${headTilt}deg)`,
          transformOrigin: '50% 90%',
          width: 580,
          height: 1100,
          zIndex: 10,
        }}
      >
        <Img
          src={staticFile('assets/pixel/character/caleb_front_clean.png')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </div>

      {/* Layer 3: Arm & Lira Bottle moving across 32 unique positional frames */}
      <div
        style={{
          position: 'absolute',
          bottom: 340 - bottleY,
          left: 540 + bottleX,
          transform: `rotate(${bottleRotate}deg) scale(${bottleScale})`,
          transformOrigin: '20% 90%',
          width: 220,
          height: 480,
          zIndex: 20,
          filter: 'drop-shadow(0 12px 24px rgba(0, 0, 0, 0.6))',
        }}
      >
        <Img
          src={staticFile('assets/pixel/pixel_bottle_matcha.png')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </div>

      {/* Live Technical Overlay Showing Actual Frame Coordinates */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#070C12',
          border: '2px solid #39FF88',
          boxShadow: '0 8px 32px rgba(57, 255, 136, 0.45)',
          borderRadius: 20,
          padding: '14px 28px',
          textAlign: 'center',
          zIndex: 40,
        }}
      >
        <div
          style={{
            color: '#39FF88',
            fontFamily: '"Silkscreen", monospace',
            fontSize: 16,
            fontWeight: 700,
            marginBottom: 6,
          }}
        >
          TRUE 32 FPS CONTINUOUS MOTION
        </div>
        <div
          style={{
            color: '#FFFFFF',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Frame {frame} / 64 • Y: {Math.round(bottleY)}px • Angle: {bottleRotate.toFixed(1)}° • Scale: {bottleScale.toFixed(2)}x
        </div>
      </div>

      {/* Bottom explanation */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(7, 12, 18, 0.94)',
          border: '1.5px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 16,
          padding: '10px 24px',
          color: '#E0E8F0',
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontSize: 14,
          fontWeight: 700,
          zIndex: 40,
        }}
      >
        Watch Caleb's Arm & Bottle Lift Continuously Every Single Frame
      </div>
    </AbsoluteFill>
  );
};
