import React from 'react';
import { useCurrentFrame } from 'remotion';

export interface CaptionChunk {
  from: number;     // start frame
  to: number;       // end frame
  text: string;     // chunk text (2-3 words)
  highlight?: boolean;
  startSec?: number;
  endSec?: number;
}

export interface DecoupledCaptionsProps {
  headline: string;
  accentWord?: string;
  chunks: CaptionChunk[];
  suppressUntilFrame?: number; // default: 42 (1.40s) or 39 (1.30s)
  headlineDurationFrames?: number; // frames headline stays visible (e.g. 90 frames / 3.0s or full hook)
}

// 16-point perimeter anti-artifact shadow barrier (STRICTLY NO WebkitTextStroke)
export const ANTI_ARTIFACT_SHADOW = [
  '-2px -2px 0 #000',
  '2px -2px 0 #000',
  '-2px 2px 0 #000',
  '2px 2px 0 #000',
  '-3px 0 0 #000',
  '3px 0 0 #000',
  '0 -3px 0 #000',
  '0 3px 0 #000',
  '-1px -3px 0 #000',
  '1px -3px 0 #000',
  '-1px 3px 0 #000',
  '1px 3px 0 #000',
  '-3px -1px 0 #000',
  '3px -1px 0 #000',
  '-3px 1px 0 #000',
  '3px 1px 0 #000',
  '0 4px 16px rgba(0, 0, 0, 0.95)',
  '0 0 24px rgba(0, 0, 0, 0.85)',
].join(', ');

export const ACCENT_GLOW_SHADOW = [
  '-2px -2px 0 #000',
  '2px -2px 0 #000',
  '-2px 2px 0 #000',
  '2px 2px 0 #000',
  '0 4px 16px rgba(0, 0, 0, 0.95)',
  '0 0 24px rgba(57, 255, 136, 0.6)',
].join(', ');

/**
 * Strips any emoji characters from text
 */
export function sanitizeNoEmoji(text: string): string {
  if (!text) return '';
  return text.replace(
    /(?:\p{Extended_Pictographic}|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]|\uD83E[\uDD00-\uDDFF])/gu,
    ''
  ).trim();
}

/**
 * Decoupled Captions Component:
 * Eliminates saccadic eye fatigue by separating the upper Frame-0 headline
 * from the center/lower subtitles with a >=1.30s suppression delay.
 */
export const DecoupledCaptions: React.FC<DecoupledCaptionsProps> = ({
  headline,
  accentWord,
  chunks = [],
  suppressUntilFrame = 40, // 1.33s @ 30fps
  headlineDurationFrames = 90, // Visible during 0.0s - 3.0s hook
}) => {
  const frame = useCurrentFrame();

  const cleanHeadline = sanitizeNoEmoji(headline);
  const words = cleanHeadline.split(/\s+/).filter(Boolean);

  // Identify active subtitle chunk (delayed until suppressUntilFrame)
  const isSubtitleActive = frame >= suppressUntilFrame;
  const currentChunk = isSubtitleActive
    ? chunks.find((c) => frame >= c.from && frame <= c.to)
    : null;

  const showHeadline = frame <= headlineDurationFrames;

  return (
    <>
      {/* 1. Frame-0 Upper Safe-Box Headline */}
      {showHeadline && (
        <div
          style={{
            position: 'absolute',
            top: 24, // Inside SafeBox (288 + 24 = 312px canvas Y)
            left: '50%',
            transform: 'translateX(-50%)',
            width: '92%',
            maxWidth: 740,
            textAlign: 'center',
            zIndex: 40,
            pointerEvents: 'none',
          }}
        >
          <h1
            style={{
              margin: 0,
              padding: 0,
              fontFamily: "'Montserrat', 'Inter', sans-serif",
              fontWeight: 900,
              fontSize: 48,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: '#FFFFFF',
              textShadow: ANTI_ARTIFACT_SHADOW,
              border: 'none',
              background: 'none',
            }}
          >
            {words.map((w, idx) => {
              const cleanWord = w.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
              const isAccent = accentWord && cleanWord === accentWord.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
              return (
                <span
                  key={idx}
                  style={{
                    color: isAccent ? '#FFE566' : '#FFFFFF',
                    textShadow: isAccent ? ACCENT_GLOW_SHADOW : ANTI_ARTIFACT_SHADOW,
                    marginRight: idx < words.length - 1 ? '0.28em' : 0,
                    display: 'inline-block',
                  }}
                >
                  {w}
                </span>
              );
            })}
          </h1>
        </div>
      )}

      {/* 2. Lower Word-by-Word Kinetic Subtitles (Delayed until >= 1.30s) */}
      {isSubtitleActive && currentChunk && (
        <div
          style={{
            position: 'absolute',
            top: '56%', // Inside SafeBox: 56% down safe box (y ≈ 825px canvas Y)
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '92%',
            maxWidth: 740,
            textAlign: 'center',
            zIndex: 45,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              fontFamily: "'Montserrat', 'Inter', sans-serif",
              fontWeight: 900,
              fontSize: 54,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: currentChunk.highlight ? '#FFE566' : '#FFFFFF',
              textShadow: currentChunk.highlight ? ACCENT_GLOW_SHADOW : ANTI_ARTIFACT_SHADOW,
            }}
          >
            {sanitizeNoEmoji(currentChunk.text)}
          </div>
        </div>
      )}
    </>
  );
};
