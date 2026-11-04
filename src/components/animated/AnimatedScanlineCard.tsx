import React from 'react';
import { useCurrentFrame } from 'remotion';

interface AnimatedScanlineCardProps {
  children: React.ReactNode;
  width?: number | string;
  borderColor?: string;
  glowColor?: string;
  backgroundColor?: string;
  style?: React.CSSProperties;
}

export const AnimatedScanlineCard: React.FC<AnimatedScanlineCardProps> = ({
  children,
  width = '90%',
  borderColor = '#39FF88',
  glowColor = 'rgba(57, 255, 136, 0.45)',
  backgroundColor = 'rgba(7, 12, 10, 0.92)',
  style = {},
}) => {
  const frame = useCurrentFrame();

  // Breathing neon glow
  const glowIntensity = 14 + Math.sin(frame / 10) * 8;
  // Rolling scanline vertical position
  const scanlineY = (frame * 3.5) % 300;

  return (
    <div
      style={{
        position: 'relative',
        width,
        backgroundColor,
        border: `2px solid ${borderColor}`,
        boxShadow: `0 8px 32px rgba(0, 0, 0, 0.8), 0 0 ${glowIntensity}px ${glowColor}`,
        borderRadius: 18,
        padding: '20px 26px',
        overflow: 'hidden',
        backdropFilter: 'blur(12px)',
        ...style,
      }}
    >
      {/* Animated subtle CRT rolling scanline */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: scanlineY,
          height: 12,
          background: 'linear-gradient(180deg, transparent, rgba(57, 255, 136, 0.12), transparent)',
          pointerEvents: 'none',
        }}
      />

      {/* Decorative retro corner accents */}
      <div
        style={{
          position: 'absolute',
          top: 6,
          left: 6,
          width: 8,
          height: 8,
          borderTop: `2px solid ${borderColor}`,
          borderLeft: `2px solid ${borderColor}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 6,
          right: 6,
          width: 8,
          height: 8,
          borderTop: `2px solid ${borderColor}`,
          borderRight: `2px solid ${borderColor}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 6,
          left: 6,
          width: 8,
          height: 8,
          borderBottom: `2px solid ${borderColor}`,
          borderLeft: `2px solid ${borderColor}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 6,
          right: 6,
          width: 8,
          height: 8,
          borderBottom: `2px solid ${borderColor}`,
          borderRight: `2px solid ${borderColor}`,
        }}
      />

      {/* Card Content */}
      <div style={{ position: 'relative', zIndex: 10 }}>{children}</div>
    </div>
  );
};
