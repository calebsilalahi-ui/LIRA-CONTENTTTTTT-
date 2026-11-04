import React, { useMemo } from 'react';
import { useCurrentFrame } from 'remotion';

interface FloatingParticlesProps {
  count?: number;
  primaryColor?: string;
  accentColor?: string;
  speedMultiplier?: number;
}

interface ParticleData {
  id: number;
  startX: number;
  startY: number;
  driftRangeX: number;
  riseSpeed: number;
  size: number;
  isAccent: boolean;
  phase: number;
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  count = 28,
  primaryColor = '#39FF88',
  accentColor = '#FFE566',
  speedMultiplier = 1.0,
}) => {
  const frame = useCurrentFrame();

  const particles = useMemo<ParticleData[]>(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      startX: ((i * 47) + 33) % 1080,
      startY: ((i * 61) + 85) % 1440,
      driftRangeX: 20 + (i % 5) * 8,
      riseSpeed: (0.7 + (i % 4) * 0.4) * speedMultiplier,
      size: 4 + (i % 3) * 2,
      isAccent: i % 4 === 0,
      phase: (i * 1.3),
    }));
  }, [count, speedMultiplier]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {particles.map((p) => {
        // Continuous upward rise looping within 1440px canvas
        const currentY = (p.startY - (frame * p.riseSpeed * 1.5)) % 1440;
        const normalizedY = currentY < 0 ? currentY + 1440 : currentY;

        // Gentle horizontal drift
        const driftX = Math.sin((frame / 20) + p.phase) * p.driftRangeX;
        const currentX = (p.startX + driftX) % 1080;

        // Twinkle pulse
        const twinkle = 0.4 + 0.5 * Math.abs(Math.sin((frame / 15) + p.phase));
        const color = p.isAccent ? accentColor : primaryColor;

        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: currentX,
              top: normalizedY,
              width: p.size,
              height: p.size,
              backgroundColor: color,
              borderRadius: p.size > 4 ? 2 : 1,
              boxShadow: `0 0 8px ${color}`,
              opacity: twinkle,
            }}
          />
        );
      })}
    </div>
  );
};
