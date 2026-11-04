import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

interface PulseRadarProps {
  centerX?: number; // default: 540
  centerY?: number; // default: 720
  color?: string;   // default: '#39FF88'
  count?: number;   // default: 4
  maxRadius?: number; // default: 550
  period?: number;  // frames per cycle, default: 50
  lineWidth?: number;
  borderStyle?: 'solid' | 'dashed';
}

export const PulseRadarRings: React.FC<PulseRadarProps> = ({
  centerX = 540,
  centerY = 720,
  color = '#39FF88',
  count = 4,
  maxRadius = 550,
  period = 54,
  lineWidth = 2,
  borderStyle = 'dashed',
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const offset = Math.floor(i * (period / count));
        const cycleFrame = (frame + offset) % period;
        const progress = cycleFrame / period; // 0 to 1

        const radius = interpolate(progress, [0, 1], [30, maxRadius]);
        const opacity = interpolate(progress, [0, 0.2, 0.75, 1], [0.85, 0.65, 0.25, 0]);

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: centerX - radius,
              top: centerY - radius,
              width: radius * 2,
              height: radius * 2,
              borderRadius: '50%',
              border: `${lineWidth}px ${borderStyle} ${color}`,
              boxShadow: `0 0 12px ${color}`,
              opacity,
            }}
          />
        );
      })}
    </div>
  );
};
