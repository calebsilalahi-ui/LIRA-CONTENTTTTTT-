/**
 * Lira Editorial Instagram Carousel - Anti-Slop Design System
 * Grounded in /design-taste-frontend, Master Bible §6.4 & SKILL.md §5.2
 * 
 * BANNED PATTERNS (Anti-Slop):
 * - NO radial glow blobs or neon diffuse shadows
 * - NO 48px isometric or tech grid overlays
 * - NO robotic fraction slide badge tags
 * - NO unicode emojis
 * 
 * APPROVED CANONICAL PALETTE:
 * - Matcha Emerald: #1D4A38
 * - Deep Forest:    #0E281E
 * - Oat Cream:      #FAF7F0
 * - Warm Ivory:     #F4EEE1
 * - Brushed Gold:   #D4AF37
 * - Dark Charcoal:  #1F2421
 * - Slate Charcoal: #2C3531
 */

import React from 'react';

export const EDITORIAL_COLORS = {
  matchaEmerald: '#1D4A38',
  emeraldDeep: '#0E281E',
  emeraldSoft: '#295B47',
  oatCream: '#FAF7F0',
  ivoryWarm: '#F4EEE1',
  brushedGold: '#D4AF37',
  goldMuted: '#C29B27',
  goldHighlight: '#F3E5AB',
  darkCharcoal: '#1F2421',
  charcoalSoft: '#2C3531',
  borderCharcoal: 'rgba(31, 36, 33, 0.12)',
  borderGold: 'rgba(212, 175, 55, 0.35)',
  borderEmerald: 'rgba(29, 74, 56, 0.25)',
  textPrimaryLight: '#FAF7F0',
  textSecondaryLight: '#D2DDD8',
  textPrimaryDark: '#1F2421',
  textSecondaryDark: '#55605B',
  subtlePaperTexture: '#F7F3EB',
} as const;

export const EDITORIAL_FONTS = {
  sans: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Plus Jakarta Sans", "Inter", "Helvetica Neue", sans-serif',
  serif: '"Playfair Display", "Didot", "Bodoni MT", Georgia, serif',
  serifItalic: '"Playfair Display", Georgia, serif',
  mono: '"SF Mono", "Menlo", monospace',
} as const;

export const SLIDE_DIMENSIONS = {
  width: 1080,
  height: 1350,
  paddingHorizontal: 80,
  paddingVertical: 72,
} as const;

export const baseContainerStyle: React.CSSProperties = {
  width: SLIDE_DIMENSIONS.width,
  height: SLIDE_DIMENSIONS.height,
  position: 'relative',
  overflow: 'hidden',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: `${SLIDE_DIMENSIONS.paddingVertical}px ${SLIDE_DIMENSIONS.paddingHorizontal}px`,
  fontFamily: EDITORIAL_FONTS.sans,
};
