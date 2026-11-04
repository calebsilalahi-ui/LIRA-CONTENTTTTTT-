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

export const OPTION_A_DURATION_32FPS = 128; // Exactly 4.0 seconds @ 32 FPS

export const Compare_OptionA_Layered_32fps: React.FC = () => {
  const frame = useCurrentFrame();

  // 32 FPS Procedural Rigging Engine
  // Phase 1: Frame 0 - 24 (Rest & Grip)
  // Phase 2: Frame 24 - 68 (Active Shaking at 32 FPS physics)
  // Phase 3: Frame 68 - 96 (Lifting to Mouth)
  // Phase 4: Frame 96 - 128 (Sipping & Settling)

  // 1. Shaking Physics (Continuous harmonic oscillation on every frame)
  const isShaking = frame >= 24 && frame < 68;
  const shakeProgress = (frame - 24) / 44;
  const shakeIntensity = isShaking
    ? Math.sin(shakeProgress * Math.PI) * 14
    : 0;

  const shakeY = isShaking ? Math.sin(frame * 1.6) * shakeIntensity : 0;
  const shakeX = isShaking ? Math.cos(frame * 1.6) * (shakeIntensity * 0.4) : 0;
  const shakeRotate = isShaking ? Math.sin(frame * 1.6) * 3 : 0;

  // 2. Lift to Mouth Arc (Frame 68 to 96)
  const liftProgress = interpolate(frame, [68, 92], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });

  // 3. Overall character breathing bob at 32 fps
  const breatheBobY = Math.sin((frame / 16) * Math.PI) * 1.8;

  // Asset selection with layered continuity
  let baseSprite = 'assets/pixel/caleb_action_seq/f1_inspect.jpg';
  if (frame >= 24 && frame < 68) {
    baseSprite = 'assets/pixel/caleb_action_seq/f2_shake.jpg';
  } else if (frame >= 68 && frame < 96) {
    baseSprite = 'assets/pixel/caleb_action_seq/f3_uncap.jpg';
  } else if (frame >= 96) {
    baseSprite = 'assets/pixel/caleb_action_seq/f4_sip.jpg';
  }

  return (
    <AbsoluteFill style={{ backgroundColor: '#070A0F', overflow: 'hidden' }}>
      {/* Background audio track */}
      <Audio
        src={staticFile('assets/bg_music.mp3')}
        volume={0.14}
      />

      {/* Synchronized SFX */}
      {frame >= 24 && frame < 55 && (
        <Audio src={staticFile('assets/sfx/whoosh.mp3')} volume={0.25} />
      )}
      {frame >= 68 && frame < 85 && (
        <Audio src={staticFile('assets/sfx/snap.mp3')} volume={0.6} />
      )}
      {frame >= 96 && frame < 115 && (
        <Audio src={staticFile('assets/sfx/sub_hit.mp3')} volume={0.3} />
      )}

      {/* Main Layered Canvas with 32 FPS Sub-Pixel Motion */}
      <AbsoluteFill
        style={{
          transform: `translate(${shakeX}px, ${shakeY + breatheBobY - liftProgress * 8}px) rotate(${shakeRotate}deg)`,
          transformOrigin: '50% 70%',
        }}
      >
        <Img
          src={staticFile(baseSprite)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </AbsoluteFill>

      {/* Header Comparison Badge */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#070C12',
          border: '2px solid #39FF88',
          boxShadow: '0 8px 32px rgba(57, 255, 136, 0.45)',
          borderRadius: 24,
          padding: '12px 28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          zIndex: 30,
        }}
      >
        <span
          style={{
            color: '#39FF88',
            fontFamily: '"Silkscreen", monospace',
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: '0.1em',
          }}
        >
          OPTION A: LAYERED RIGGING (32 FPS)
        </span>
        <span
          style={{
            color: '#FFFFFF',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Remotion Procedural Springs & Meniscus Math
        </span>
      </div>

      {/* Live Frame Counter for Technical Comparison */}
      <div
        style={{
          position: 'absolute',
          bottom: 90,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(7, 12, 18, 0.94)',
          border: '1.5px solid rgba(57, 255, 136, 0.4)',
          borderRadius: 16,
          padding: '10px 24px',
          color: '#39FF88',
          fontFamily: '"Silkscreen", monospace',
          fontSize: 14,
          fontWeight: 700,
          zIndex: 30,
          backdropFilter: 'blur(8px)',
        }}
      >
        FRAME {frame} / 128 • 32 FPS ACTIVE
      </div>
    </AbsoluteFill>
  );
};
