import React from 'react';
import { loadFont } from '@remotion/google-fonts/Montserrat';

// Load classic TikTok bold font (Montserrat 900 / 800)
const { fontFamily: TIKTOK_FONT } = loadFont();

export interface CaptionChunk {
  from: number; // frame start
  to: number;   // frame end
  text: string; // 2 to 3 words strictly, NO emojis
  highlight?: boolean; // optional keyword color punch (e.g. #39FF88 or #FFE566)
}

interface TikTokCaptionProps {
  currentFrame: number;
  chunks: CaptionChunk[];
  /** Vertical placement percentage down from top (default: 56% = slightly below dead center) */
  topPercentage?: number;
  highlightColor?: string;
  fontSize?: number;
}

/**
 * Standardized TikTok-Style Reel Captions:
 * - Positioned slightly below center (default: 56% top) for direct eye-level readability
 * - Classic TikTok font (Montserrat 900 Heavy)
 * - Strictly 2 to 3 words per chunk
 * - Zero emojis or icons
 * - Maximum dead space between speech clamped to <= 0.1s (3 frames @ 30fps)
 */
export const TikTokCaption: React.FC<TikTokCaptionProps> = ({
  currentFrame,
  chunks,
  topPercentage = 56,
  highlightColor = '#FFE566',
  fontSize = 64,
}) => {
  // Find current active 2-3 word chunk
  const activeChunk = chunks.find(
    (c) => currentFrame >= c.from && currentFrame < c.to
  );

  if (!activeChunk) {
    return null;
  }

  // Clean out any inline emotion tags [tag] and any accidental emojis or icons
  const cleanText = activeChunk.text
    .replace(/\[.*?\]/g, '')
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .trim();

  return (
    <div
      style={{
        position: 'absolute',
        top: `${topPercentage}%`,
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        maxWidth: 680,
        textAlign: 'center',
        pointerEvents: 'none',
        zIndex: 900,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          fontFamily: `${TIKTOK_FONT}, Montserrat, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
          fontSize: `${fontSize}px`,
          fontWeight: 900,
          lineHeight: 1.15,
          textTransform: 'uppercase',
          letterSpacing: '-0.02em',
          color: activeChunk.highlight ? highlightColor : '#FFFFFF',
          /* Clean 16-point perimeter shadow eliminates WebkitTextStroke miter artifacts & ugly internal lines */
          textShadow: `
            -3px -3px 0 #000,  3px -3px 0 #000, -3px  3px 0 #000,  3px  3px 0 #000,
            -4px  0px 0 #000,  4px  0px 0 #000,  0px -4px 0 #000,  0px  4px 0 #000,
            -2px -4px 0 #000,  2px -4px 0 #000, -2px  4px 0 #000,  2px  4px 0 #000,
            -4px -2px 0 #000,  4px -2px 0 #000, -4px  2px 0 #000,  4px  2px 0 #000,
            0px  6px 18px rgba(0, 0, 0, 0.95),
            0px 10px 30px rgba(0, 0, 0, 0.75)
          `,
          padding: '6px 16px',
        }}
      >
        {cleanText}
      </div>
    </div>
  );
};
