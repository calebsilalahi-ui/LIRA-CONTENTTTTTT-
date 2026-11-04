import React, { useMemo } from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

interface PixelSteamProps {
  originX: number; // e.g. 540
  originY: number; // e.g. 700
  color?: string;
  particleCount?: number;
  riseHeight?: number;
  swayAmplitude?: number;
}

interface SteamParticle {
  id: number;
  xOffset: number;
  speed: number;
  swaySpeed: number;
  size: number;
  delay: number;
  maxLife: number;
}

export const PixelSteam: React.FC<PixelSteamProps> = ({
  originX,
  originY,
  color = 'rgba(255, 255, 255, 0.45)',
  particleCount = 18,
  riseHeight = 220,
  swayAmplitude = 24,
}) => {
  const frame = useCurrentFrame();

  const particles = useMemo<SteamParticle[]>(() => {
    return Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      xOffset: ((i % 5) - 2) * 6,
      speed: 1.8 + ((i * 3) % 4) * 0.4,
      swaySpeed: 16 + ((i * 7) % 12),
      size: 6 + (i % 3) * 4,
      delay: Math.floor(i * (70 / particleCount)),
      maxLife: 60 + ((i * 11) % 20),
    }));
  }, [particleCount]);

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      {particles.map((p) => {
        const cycleFrame = (frame + p.delay) % p.maxLife;
        const progress = cycleFrame / p.maxLife; // 0 to 1

        const currentY = originY - progress * riseHeight;
        const swayX = Math.sin((cycleFrame / p.swaySpeed) * Math.PI * 2) * swayAmplitude;
        const currentX = originX + p.xOffset + swayX;

        // Opacity ramps up quickly at start, then fades smoothly as it rises
        const opacity = interpolate(progress, [0, 0.15, 0.65, 1], [0, 0.75, 0.45, 0]);
        // Pixel clusters expand slightly as steam disperses
        const scale = interpolate(progress, [0, 1], [0.8, 1.8]);

        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: currentX,
              top: currentY,
              width: p.size,
              height: p.size,
              backgroundColor: color,
              borderRadius: 2,
              boxShadow: `0 0 6px ${color}`,
              opacity,
              transform: `scale(${scale})`,
            }}
          />
        );
      })}
    </div>
  );
};
