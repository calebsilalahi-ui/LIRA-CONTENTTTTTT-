import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  staticFile,
  useCurrentFrame,
} from 'remotion';

export const OPTION_C_DURATION_32FPS = 128; // Exactly 4.0 seconds @ 32 FPS

export const Compare_OptionC_ClassicTwos_32fps: React.FC = () => {
  const frame = useCurrentFrame();

  // Option C: Classic 2D Animation on "Twos" (Discrete keyframes stepped at 8-16 fps on a 32 fps timeline)
  // Step frame: quantize frame by 2 or 3 to give authentic retro pixel-art stepping
  const qFrame = Math.floor(frame / 2) * 2;

  let activeSprite = 'assets/pixel/scene_5_laptop_a.jpg';
  let actionName = '1. TYPING ON LAPTOP';

  if (frame < 24) {
    activeSprite = 'assets/pixel/scene_5_laptop_a.jpg';
    actionName = '1. TYPING ON LAPTOP';
  } else if (frame < 48) {
    activeSprite = 'assets/pixel/caleb_action_seq/f1_inspect.jpg';
    actionName = '2. GRIPPING BOTTLE';
  } else if (frame < 80) {
    // Alternating on twos (every 2 frames at 32 fps = 16 fps shake)
    const shakeStep = Math.floor(frame / 2) % 2 === 0;
    activeSprite = shakeStep
      ? 'assets/pixel/caleb_action_seq/f2_shake.jpg'
      : 'assets/pixel/caleb_action_seq/f1_inspect.jpg';
    actionName = '3. 16 FPS SHAKE (ON TWOS)';
  } else if (frame < 104) {
    activeSprite = 'assets/pixel/caleb_action_seq/f3_uncap.jpg';
    actionName = '4. UNSEAL CAP';
  } else {
    activeSprite = 'assets/pixel/caleb_action_seq/f4_sip.jpg';
    actionName = '5. SIP REFRESHMENT';
  }

  // Camera tracking runs at full 32 FPS
  const cameraZoom = 1.0 + (frame / 128) * 0.04;

  return (
    <AbsoluteFill style={{ backgroundColor: '#070A0F', overflow: 'hidden' }}>
      {/* Background audio track */}
      <Audio
        src={staticFile('assets/bg_music.mp3')}
        volume={0.14}
      />

      {/* Synchronized SFX */}
      {frame >= 48 && frame < 75 && (
        <Audio src={staticFile('assets/sfx/whoosh.mp3')} volume={0.25} />
      )}
      {frame >= 80 && frame < 95 && (
        <Audio src={staticFile('assets/sfx/snap.mp3')} volume={0.6} />
      )}
      {frame >= 104 && frame < 120 && (
        <Audio src={staticFile('assets/sfx/sub_hit.mp3')} volume={0.3} />
      )}

      {/* Main Canvas */}
      <AbsoluteFill
        style={{
          transform: `scale(${cameraZoom})`,
          transformOrigin: '50% 60%',
        }}
      >
        <Img
          src={staticFile(activeSprite)}
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
          border: '2px solid #FFE566',
          boxShadow: '0 8px 32px rgba(255, 229, 102, 0.45)',
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
            color: '#FFE566',
            fontFamily: '"Silkscreen", monospace',
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: '0.1em',
          }}
        >
          OPTION C: CLASSIC ON TWOS (32 FPS)
        </span>
        <span
          style={{
            color: '#FFFFFF',
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Traditional 16 Keyframes / Stepped Arcade Poses
        </span>
      </div>

      {/* Live Action Tracker */}
      <div
        style={{
          position: 'absolute',
          bottom: 90,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(7, 12, 18, 0.94)',
          border: '1.5px solid rgba(255, 229, 102, 0.4)',
          borderRadius: 16,
          padding: '10px 24px',
          color: '#FFE566',
          fontFamily: '"Silkscreen", monospace',
          fontSize: 14,
          fontWeight: 700,
          zIndex: 30,
          backdropFilter: 'blur(8px)',
        }}
      >
        {actionName} • FRAME {frame} / 128
      </div>
    </AbsoluteFill>
  );
};
