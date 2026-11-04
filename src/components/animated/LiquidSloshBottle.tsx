import React from 'react';
import { useCurrentFrame, interpolate, staticFile, Img } from 'remotion';

interface LiquidSloshBottleProps {
  width?: number;
  height?: number;
  tiltAngle?: number;
  shakeIntensity?: number;
}

export const LiquidSloshBottle: React.FC<LiquidSloshBottleProps> = ({
  width = 280,
  height = 540,
  tiltAngle = 0,
  shakeIntensity = 0,
}) => {
  const frame = useCurrentFrame();

  // Natural fluid slosh wave inside the bottle
  const sloshWave = Math.sin(frame / 6) * (6 + shakeIntensity * 12);
  const bottleSway = tiltAngle + Math.sin(frame / 12) * 1.5;

  // Real-time condensation sparkle
  const sparkleOpacity = interpolate(
    Math.sin(frame / 8),
    [-1, 1],
    [0.3, 0.95]
  );

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        transform: `rotate(${bottleSway}deg)`,
        transformOrigin: 'bottom center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        filter: 'drop-shadow(0 16px 36px rgba(0, 0, 0, 0.65))',
      }}
    >
      {/* Bottle Silhouette / Real PET Bottle Asset */}
      <Img
        src={staticFile('assets/pixel/caleb_point_hero.jpg')}
        style={{
          display: 'none', // just to ensure asset reference if needed
        }}
      />

      {/* Procedural Pixel Bottle Body */}
      <div
        style={{
          position: 'relative',
          width: '80%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '40px 40px 24px 24px',
          border: '3px solid rgba(255, 255, 255, 0.5)',
          overflow: 'hidden',
          backdropFilter: 'blur(4px)',
          boxShadow: 'inset 0 0 16px rgba(255, 255, 255, 0.3)',
        }}
      >
        {/* Gold Screw Cap */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '25%',
            width: '50%',
            height: 38,
            backgroundColor: '#D4AF37',
            borderRadius: '6px 6px 0 0',
            borderBottom: '2px solid #8C7320',
            boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.6)',
            zIndex: 15,
          }}
        />

        {/* Dynamic Matcha Liquid Layer */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: -20,
            right: -20,
            height: '78%',
            backgroundColor: '#1E4E38',
            transform: `rotate(${sloshWave}deg)`,
            transformOrigin: 'top center',
            transition: 'transform 0.05s linear',
            boxShadow: 'inset 0 8px 16px rgba(57, 255, 136, 0.35)',
          }}
        >
          {/* Surface Meniscus Foam / Swirl */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 12,
              backgroundColor: '#357A59',
              borderRadius: '50%',
              opacity: 0.85,
            }}
          />
        </div>

        {/* Circular Lira Cream Logo */}
        <div
          style={{
            position: 'absolute',
            top: '46%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 100,
            height: 100,
            borderRadius: '50%',
            backgroundColor: '#FAF7F0',
            border: '3px double #1E4E38',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)',
            zIndex: 20,
          }}
        >
          <span
            style={{
              color: '#1E4E38',
              fontFamily: 'serif',
              fontStyle: 'italic',
              fontWeight: 900,
              fontSize: 26,
              letterSpacing: '-0.02em',
            }}
          >
            Lira
          </span>
        </div>

        {/* Glass Specular Glint & Condensation Beads */}
        <div
          style={{
            position: 'absolute',
            top: 50,
            left: 12,
            width: 8,
            height: '70%',
            backgroundColor: 'rgba(255, 255, 255, 0.45)',
            borderRadius: 4,
            opacity: sparkleOpacity,
            zIndex: 25,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            right: 18,
            width: 6,
            height: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.65)',
            borderRadius: '50%',
            opacity: sparkleOpacity,
            zIndex: 25,
          }}
        />
      </div>
    </div>
  );
};
