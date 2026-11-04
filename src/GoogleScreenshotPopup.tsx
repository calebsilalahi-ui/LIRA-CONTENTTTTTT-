import React from 'react';
import { staticFile, Img } from 'remotion';

interface GoogleScreenshotPopupProps {
  currentFrame: number;
  from: number; // frame appearance
  to: number;   // frame disappearance
  imageSrc: string; // path relative to public/ or external URL
  top?: number | string;
  left?: number | string;
  width?: number | string;
  captionTitle?: string;
}

/**
 * Static Google Screenshot Pop-up Component:
 * - Strictly un-animated (instant hard cut appearance, 0 spring/zoom/bounce)
 * - Showcases real screenshots (Google Search, Maps, review ratings, real UI proof)
 * - Crisp borders and clean drop-shadow to ground it naturally in the video
 */
export const GoogleScreenshotPopup: React.FC<GoogleScreenshotPopupProps> = ({
  currentFrame,
  from,
  to,
  imageSrc,
  top = '22%',
  left = '50%',
  width = 720,
  captionTitle,
}) => {
  // Hard cut: visible only strictly between [from, to)
  if (currentFrame < from || currentFrame >= to) {
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: top,
        left: left,
        transform: 'translateX(-50%)',
        width: typeof width === 'number' ? `${width}px` : width,
        zIndex: 850,
        pointerEvents: 'none',
        // Static rendering: ZERO css transition, ZERO scale animation, ZERO spring
      }}
    >
      <div
        style={{
          borderRadius: 16,
          overflow: 'hidden',
          backgroundColor: '#0F172A',
          border: '2px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85)',
        }}
      >
        {captionTitle && (
          <div
            style={{
              padding: '10px 16px',
              backgroundColor: '#1E293B',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 16,
              fontWeight: 700,
              color: '#94A3B8',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            <span>{captionTitle}</span>
          </div>
        )}
        <Img
          src={imageSrc.startsWith('http') ? imageSrc : staticFile(imageSrc)}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
          }}
        />
      </div>
    </div>
  );
};
