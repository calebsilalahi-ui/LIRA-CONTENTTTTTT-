/**
 * Lira Editorial Instagram Carousel Engine - Type Definitions
 * Authoritative standards: PROJECT.md §Feature 12-15 & ORIGINAL_REQUEST.md §R3
 * Strictly 4:5 vertical portrait: 1080 x 1350 px
 */

export type CarouselSlideType =
  | 'hook'          // Slide 1: Scroll-stopping hook (<= 8 words)
  | 'reserve_hook'  // Slide 2: Independent conversion hook (<= 12 words)
  | 'body'          // Slides 3-5: Mechanism, contrast, deep-dive micro-loops
  | 'comparison'    // High-utility comparison matrix
  | 'high_save'     // High-save cheat sheet / reference guide
  | 'routine'       // Operational transparency (03:30 AM craft, cold chain)
  | 'cta';          // Closing action / Saturday Gojek COD Loop order steps

export interface ComparisonRow {
  feature: string;
  cafe: string;
  lira: string;
}

export interface MetricCard {
  label: string;
  value: string;
  subtext?: string;
}

export interface CarouselSlideData {
  slideNumber: number;
  type: CarouselSlideType;
  headline: string;
  subhead?: string;
  bodyText?: string;
  categoryTag?: string;
  keyPoints?: string[];
  comparisonRows?: ComparisonRow[];
  metricCards?: MetricCard[];
  orderSteps?: string[];
  bottleVariant?: 'matcha' | 'choco' | 'milktea';
  heroAsset?: string;
  badgeText?: string;
  swipePrompt?: string;
}

export interface CarouselDeckData {
  id: string;
  title: string;
  pillar: string;
  hookCategory: string;
  theme?: 'emerald' | 'cream' | 'dark';
  slides: CarouselSlideData[];
}
