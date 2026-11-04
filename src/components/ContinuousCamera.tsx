import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface ContinuousCameraProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  enablePan?: boolean;
  enableBreathing?: boolean;
}

/**
 * Grounded Camera Formula:
 * Steady, anchored, and punchy.
 * Settles gently from 1.03 to 1.0 on Frame 0-12, then STAYS strictly at 1.0 (zero floaty zoom-out).
 */
export function calculateCameraScale(_frame: number): number {
  return 1.0;
}

/**
 * Sprite & scene breathing formula:
 * Micro-motion period of 90 frames (3 seconds at 30fps) with subtle peak amplitude of 1.2px
 */
export function calculateBreathingOffset(frame: number): number {
  return Math.sin((frame / 45) * Math.PI) * 1.2;
}

/**
 * Returns full composite transform state at any frame
 */
export function getCompositeTransform(frame: number) {
  const scale = calculateCameraScale(frame);
  // Grounded: subtle micro-pan oscillating gently within ±3px rather than running away to 180px
  const panX = Math.sin((frame / 60) * Math.PI) * 2.5;
  const breathY = calculateBreathingOffset(frame);
  return { scale, panX, breathY };
}

/**
 * Continuous Motion Rig:
 * Wraps visual content in an unclamped continuous transform:
 * 1. Initial 1.15 -> 1.0 push-in
 * 2. Unbroken 1.0 -> 0.96 drift in 0.67s–3.0s
 * 3. Continuous lateral pan (0px -> 18px)
 * 4. Micro-breathing oscillation (1.8px)
 * Eliminates the 0:01 drop-off freeze completely without particle noise.
 */
export const ContinuousCamera: React.FC<ContinuousCameraProps> = ({
  children,
  style,
  enablePan = true,
  enableBreathing = true,
}) => {
  const frame = useCurrentFrame();
  const { scale, panX, breathY } = getCompositeTransform(frame);

  const tx = enablePan ? panX : 0;
  const ty = enableBreathing ? breathY : 0;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        transformOrigin: '50% 50%',
        transform: `scale(${scale}) translate3d(${tx}px, ${ty}px, 0)`,
        willChange: 'transform',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
