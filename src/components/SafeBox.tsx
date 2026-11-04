import React from 'react';

export interface SafeBoxProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  debug?: boolean;
}

export const SAFE_BOX = {
  xMin: 84,
  xMax: 888,
  yMin: 288,
  yMax: 1248,
  width: 804,  // 888 - 84
  height: 960, // 1248 - 288
};

/**
 * Universal Safe Box for 1080x1920 (9:16) Instagram Reels.
 * Obscured hazard zones:
 * - Top (y: 0–288): Search bar, profile info, audio pill
 * - Bottom (y: 1248–1920): Account handle, caption description, audio track marquee disc
 * - Right (x: 888–1080): Like, comment, share, bookmark action buttons
 * - Left (x: 0–84): Edge margin
 *
 * All headlines, sprites, and subtitles MUST remain strictly inside this box.
 */
export const SafeBox: React.FC<SafeBoxProps> = ({ children, style, debug = false }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE_BOX.xMin,
        top: SAFE_BOX.yMin,
        width: SAFE_BOX.width,
        height: SAFE_BOX.height,
        boxSizing: 'border-box',
        overflow: 'visible',
        pointerEvents: 'none',
        border: debug ? '2px dashed rgba(57, 255, 136, 0.4)' : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
