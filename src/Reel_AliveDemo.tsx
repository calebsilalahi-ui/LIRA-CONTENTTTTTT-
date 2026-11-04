import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  staticFile,
  useCurrentFrame,
} from 'remotion';

export const ALIVE_DEMO_DURATION = 180; // 6.0 seconds @ 30fps

export const Reel_AliveDemo: React.FC = () => {
  const frame = useCurrentFrame();

  // Animation timeline state
  // 0 - 30:   Caleb typing on laptop (scene_5_laptop_a.jpg)
  // 30 - 60:  Caleb picks up & inspects green Lira bottle (f1_inspect.jpg)
  // 60 - 105: Caleb vigorously shakes the bottle (f2_shake alternating at 10 FPS with vibration)
  // 105 - 140: Caleb twists off gold cap (f3_uncap.jpg)
  // 140 - 170: Caleb tilts head & takes a deep sip (f4_sip.jpg)
  // 170 - 180: Caleb lowers bottle, satisfied & energized (f1_inspect.jpg)

  let activeImage = 'assets/pixel/scene_5_laptop_a.jpg';
  let shakeY = 0;
  let shakeX = 0;
  let actionLabel = '1. CODING AT DESK';

  if (frame < 30) {
    activeImage = 'assets/pixel/scene_5_laptop_a.jpg';
    actionLabel = 'CALEB CODING AT DESK';
  } else if (frame < 60) {
    activeImage = 'assets/pixel/caleb_action_seq/f1_inspect.jpg';
    actionLabel = 'PICKS UP LIRA MATCHA';
  } else if (frame < 105) {
    // Rapid 10 FPS alternating shake sequence with vertical momentum
    const isShakeFrame = Math.floor(frame / 3) % 2 === 0;
    activeImage = isShakeFrame
      ? 'assets/pixel/caleb_action_seq/f2_shake.jpg'
      : 'assets/pixel/caleb_action_seq/f1_inspect.jpg';
    shakeY = isShakeFrame ? -6 : 4;
    shakeX = isShakeFrame ? 2 : -2;
    actionLabel = 'SHAKING BOTTLE TO MIX';
  } else if (frame < 140) {
    activeImage = 'assets/pixel/caleb_action_seq/f3_uncap.jpg';
    actionLabel = 'UNSEALING GOLD CAP';
  } else if (frame < 170) {
    activeImage = 'assets/pixel/caleb_action_seq/f4_sip.jpg';
    actionLabel = 'SIPPING FRESH MATCHA';
  } else {
    activeImage = 'assets/pixel/caleb_action_seq/f1_inspect.jpg';
    actionLabel = 'CLEAN ENERGY RESTORED';
  }

  // Subtle organic breathing cycle (not frozen)
  const breatheY = Math.sin((frame / 20) * Math.PI) * 1.5;

  return (
    <AbsoluteFill style={{ backgroundColor: '#070A0F', overflow: 'hidden' }}>
      {/* 1. Groovy Background Track */}
      <Audio
        src={staticFile('assets/bg_music.mp3')}
        volume={0.14}
      />

      {/* 2. Tactile Sound Effects Synchronized to Physical Actions */}
      {/* Whoosh / Shaking sound effect starting at frame 62 */}
      {frame >= 60 && frame < 95 && (
        <Audio
          src={staticFile('assets/sfx/whoosh.mp3')}
          volume={0.25}
        />
      )}

      {/* Unseal Cap Click at frame 105 */}
      {frame >= 105 && frame < 125 && (
        <Audio
          src={staticFile('assets/sfx/snap.mp3')}
          volume={0.6}
        />
      )}

      {/* Sip / Energy impact at frame 140 */}
      {frame >= 140 && frame < 165 && (
        <Audio
          src={staticFile('assets/sfx/sub_hit.mp3')}
          volume={0.3}
        />
      )}

      {/* 3. The Animated Character Canvas */}
      <AbsoluteFill
        style={{
          transform: `translate(${shakeX}px, ${shakeY + breatheY}px)`,
        }}
      >
        <Img
          src={staticFile(activeImage)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </AbsoluteFill>

      {/* 4. Action Tracker Indicator (Clean & Minimal) */}
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
          alignItems: 'center',
          gap: 12,
          zIndex: 30,
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: '#39FF88',
            boxShadow: '0 0 10px #39FF88',
          }}
        />
        <span
          style={{
            color: '#39FF88',
            fontFamily: '"Silkscreen", monospace',
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: '0.08em',
          }}
        >
          {actionLabel}
        </span>
      </div>

      {/* 5. Bottom Status Banner */}
      <div
        style={{
          position: 'absolute',
          bottom: 90,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(7, 12, 18, 0.94)',
          border: '1.5px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 16,
          padding: '10px 24px',
          color: '#E0E8F0',
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: '-0.01em',
          zIndex: 30,
          backdropFilter: 'blur(8px)',
        }}
      >
        Caleb & Lira Moving in Scene • Zero Fake Overlays
      </div>
    </AbsoluteFill>
  );
};
