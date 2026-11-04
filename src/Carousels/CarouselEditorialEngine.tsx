/**
 * Lira Editorial Instagram Carousel Engine
 * Canonical Remotion React component for rendering 1080x1350 (4:5) carousel slides.
 * Strictly adheres to anti-slop guidelines:
 * - Zero glow blobs
 * - Zero 48px SaaS grids
 * - Zero robotic fraction badges
 * - Zero emojis
 * - Authentic SSOT bottle cutouts and cooler bag
 */

import React from 'react';
import { staticFile, Img } from 'remotion';
import { CarouselSlideData, CarouselDeckData } from './carouselTypes';
import { EDITORIAL_COLORS, EDITORIAL_FONTS, SLIDE_DIMENSIONS } from './editorialStyles';

interface CarouselSlideProps {
  slide: CarouselSlideData;
  totalSlides?: number;
  theme?: 'emerald' | 'cream' | 'dark';
}

/**
 * Top Header bar: Brand identifier and subtle editorial topic tag.
 * Anti-slop: NO robotic badge tags!
 */
const EditorialHeader: React.FC<{
  categoryTag?: string;
  badgeText?: string;
  slideNumber: number;
  totalSlides: number;
  isLightBg?: boolean;
}> = ({ categoryTag, isLightBg = false }) => {
  const textColor = isLightBg ? EDITORIAL_COLORS.textPrimaryDark : EDITORIAL_COLORS.textPrimaryLight;
  const mutedTextColor = isLightBg ? EDITORIAL_COLORS.textSecondaryDark : EDITORIAL_COLORS.textSecondaryLight;
  const borderColor = isLightBg ? 'rgba(31, 36, 33, 0.2)' : EDITORIAL_COLORS.borderGold;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingBottom: 24,
        borderBottom: `1px solid ${borderColor}`,
        zIndex: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span
          style={{
            fontFamily: EDITORIAL_FONTS.sans,
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: EDITORIAL_COLORS.brushedGold,
          }}
        >
          @DRINKLIRA
        </span>
        <span style={{ color: mutedTextColor, fontSize: 14 }}>•</span>
        <span
          style={{
            fontFamily: EDITORIAL_FONTS.sans,
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: mutedTextColor,
          }}
        >
          {categoryTag || 'EDITORIAL ARCHIVE'}
        </span>
      </div>

      <div
        style={{
          fontFamily: EDITORIAL_FONTS.sans,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: textColor,
          opacity: 0.85,
        }}
      >
        LIRA ARCHIVE
      </div>
    </div>
  );
};

/**
 * Bottom Footer: Editorial attribution and swipe cue.
 */
const EditorialFooter: React.FC<{
  swipePrompt?: string;
  isLightBg?: boolean;
  isLastSlide?: boolean;
}> = ({ swipePrompt, isLightBg = false, isLastSlide = false }) => {
  const textColor = isLightBg ? EDITORIAL_COLORS.textSecondaryDark : EDITORIAL_COLORS.textSecondaryLight;
  const borderColor = isLightBg ? 'rgba(31, 36, 33, 0.15)' : 'rgba(212, 175, 55, 0.2)';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingTop: 24,
        borderTop: `1px solid ${borderColor}`,
        zIndex: 10,
      }}
    >
      <div
        style={{
          fontFamily: EDITORIAL_FONTS.sans,
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: '0.06em',
          color: textColor,
          textTransform: 'uppercase',
        }}
      >
        SOLO CRAFTED BATCH • BOGOR
      </div>

      <div
        style={{
          fontFamily: EDITORIAL_FONTS.sans,
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: isLastSlide ? EDITORIAL_COLORS.goldHighlight : EDITORIAL_COLORS.brushedGold,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span>{swipePrompt || (isLastSlide ? 'AMANKAN BATCH' : 'GESER')}</span>
        <span>→</span>
      </div>
    </div>
  );
};

/**
 * Slide 1 Renderer: High-Impact Thumb-Stop Hook
 * <= 8-word headline + open curiosity loop + authentic SSOT bottle
 */
const RenderSlide1Hook: React.FC<{ slide: CarouselSlideData }> = ({ slide }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        paddingTop: 36,
        paddingBottom: 20,
      }}
    >
      {/* Upper Hook Text Block */}
      <div style={{ maxWidth: 880, zIndex: 10 }}>
        <div
          style={{
            display: 'inline-block',
            padding: '6px 14px',
            backgroundColor: 'rgba(212, 175, 55, 0.15)',
            border: `1px solid ${EDITORIAL_COLORS.borderGold}`,
            borderRadius: 4,
            fontFamily: EDITORIAL_FONTS.sans,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: EDITORIAL_COLORS.goldHighlight,
            marginBottom: 24,
          }}
        >
          {slide.badgeText || 'SPECIAL REPORT'}
        </div>

        <h1
          style={{
            fontFamily: EDITORIAL_FONTS.sans,
            fontSize: 66,
            fontWeight: 900,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            color: EDITORIAL_COLORS.textPrimaryLight,
            margin: 0,
            marginBottom: 20,
          }}
        >
          {slide.headline}
        </h1>

        {slide.subhead && (
          <p
            style={{
              fontFamily: EDITORIAL_FONTS.serifItalic,
              fontSize: 28,
              lineHeight: 1.35,
              color: EDITORIAL_COLORS.goldHighlight,
              margin: 0,
              fontStyle: 'italic',
            }}
          >
            "{slide.subhead}"
          </p>
        )}
      </div>

      {/* Hero Visual Anchor: Authentic SSOT bottle cutout */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          marginTop: 20,
          marginBottom: 10,
          height: 520,
        }}
      >
        {/* Subtle physical desk plate shadow */}
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            width: 380,
            height: 36,
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.35)',
            filter: 'blur(16px)',
          }}
        />

        <Img
          src={staticFile('assets/bottles_ssot/matcha_ssot.png')}
          style={{
            height: 500,
            objectFit: 'contain',
            filter: 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.45))',
            zIndex: 5,
          }}
        />
      </div>

      {/* Curiosity Bridge Box */}
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          borderRadius: 8,
          padding: '18px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontFamily: EDITORIAL_FONTS.sans,
            fontSize: 16,
            color: EDITORIAL_COLORS.textSecondaryLight,
            fontWeight: 500,
          }}
        >
          Di dalam slide ini: Analisis biologis kenapa gula pasir kafe bikin fokus lo drop.
        </div>
        <div
          style={{
            fontFamily: EDITORIAL_FONTS.sans,
            fontSize: 14,
            fontWeight: 800,
            color: EDITORIAL_COLORS.brushedGold,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          SWIPE →
        </div>
      </div>
    </div>
  );
};

/**
 * Slide 2 Renderer: Standalone Re-Serve Hook (<= 12 words)
 * Must make 100% complete semantic & grammatical sense on its own on 2nd impression.
 */
const RenderSlide2ReserveHook: React.FC<{ slide: CarouselSlideData }> = ({ slide }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        paddingTop: 36,
        paddingBottom: 20,
      }}
    >
      <div>
        <div
          style={{
            display: 'inline-block',
            padding: '6px 14px',
            backgroundColor: 'rgba(212, 175, 55, 0.15)',
            border: `1px solid ${EDITORIAL_COLORS.borderGold}`,
            borderRadius: 4,
            fontFamily: EDITORIAL_FONTS.sans,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: EDITORIAL_COLORS.goldHighlight,
            marginBottom: 20,
          }}
        >
          {slide.badgeText || 'ALGORITMA IMPRESI 2'}
        </div>

        <h2
          style={{
            fontFamily: EDITORIAL_FONTS.sans,
            fontSize: 54,
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: EDITORIAL_COLORS.textPrimaryLight,
            margin: 0,
            marginBottom: 20,
          }}
        >
          {slide.headline}
        </h2>

        {slide.subhead && (
          <p
            style={{
              fontFamily: EDITORIAL_FONTS.serif,
              fontSize: 24,
              lineHeight: 1.4,
              color: EDITORIAL_COLORS.goldHighlight,
              margin: 0,
              marginBottom: 36,
            }}
          >
            {slide.subhead}
          </p>
        )}
      </div>

      {/* 3 Biological Truth Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, zIndex: 10 }}>
        {slide.keyPoints?.map((point, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 20,
              backgroundColor: 'rgba(14, 40, 30, 0.7)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              borderRadius: 8,
              padding: '24px 28px',
            }}
          >
            <div
              style={{
                fontFamily: EDITORIAL_FONTS.serifItalic,
                fontSize: 32,
                fontWeight: 700,
                color: EDITORIAL_COLORS.brushedGold,
                lineHeight: 1,
              }}
            >
              0{idx + 1}.
            </div>
            <div
              style={{
                fontFamily: EDITORIAL_FONTS.sans,
                fontSize: 22,
                fontWeight: 500,
                lineHeight: 1.35,
                color: EDITORIAL_COLORS.textPrimaryLight,
              }}
            >
              {point}
            </div>
          </div>
        ))}
      </div>

      {/* Standalone Takeaway Pill */}
      <div
        style={{
          borderLeft: `4px solid ${EDITORIAL_COLORS.brushedGold}`,
          paddingLeft: 20,
          marginTop: 20,
        }}
      >
        <span
          style={{
            fontFamily: EDITORIAL_FONTS.sans,
            fontSize: 18,
            fontWeight: 600,
            color: EDITORIAL_COLORS.textSecondaryLight,
            lineHeight: 1.4,
          }}
        >
          Inilah alasan kenapa Lira membuang 100% gula pasir dan menggantinya dengan pemanis alami stevia nol glikemik.
        </span>
      </div>
    </div>
  );
};

/**
 * Slide 3-5 Renderer: Mechanism, Contrast & Formula Deep Dives
 */
const RenderSlideBody: React.FC<{ slide: CarouselSlideData }> = ({ slide }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        paddingTop: 36,
        paddingBottom: 20,
      }}
    >
      <div>
        <div
          style={{
            display: 'inline-block',
            padding: '6px 14px',
            backgroundColor: 'rgba(212, 175, 55, 0.15)',
            border: `1px solid ${EDITORIAL_COLORS.borderGold}`,
            borderRadius: 4,
            fontFamily: EDITORIAL_FONTS.sans,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: EDITORIAL_COLORS.goldHighlight,
            marginBottom: 20,
          }}
        >
          {slide.badgeText || 'ANALISIS SAINS'}
        </div>

        <h2
          style={{
            fontFamily: EDITORIAL_FONTS.sans,
            fontSize: 52,
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: EDITORIAL_COLORS.textPrimaryLight,
            margin: 0,
            marginBottom: 18,
          }}
        >
          {slide.headline}
        </h2>

        {slide.subhead && (
          <p
            style={{
              fontFamily: EDITORIAL_FONTS.serif,
              fontSize: 24,
              lineHeight: 1.4,
              color: EDITORIAL_COLORS.goldHighlight,
              margin: 0,
              marginBottom: 32,
            }}
          >
            {slide.subhead}
          </p>
        )}
      </div>

      {/* Metrics Row (if present) */}
      {slide.metricCards && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {slide.metricCards.map((metric, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'rgba(14, 40, 30, 0.85)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: 8,
                padding: '24px 20px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: EDITORIAL_FONTS.sans,
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  color: EDITORIAL_COLORS.brushedGold,
                  marginBottom: 10,
                  textTransform: 'uppercase',
                }}
              >
                {metric.label}
              </div>
              <div
                style={{
                  fontFamily: EDITORIAL_FONTS.sans,
                  fontSize: 38,
                  fontWeight: 900,
                  color: '#FFFFFF',
                  marginBottom: 8,
                }}
              >
                {metric.value}
              </div>
              {metric.subtext && (
                <div
                  style={{
                    fontFamily: EDITORIAL_FONTS.sans,
                    fontSize: 13,
                    color: EDITORIAL_COLORS.textSecondaryLight,
                    lineHeight: 1.3,
                  }}
                >
                  {metric.subtext}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Key Points List */}
      {slide.keyPoints && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {slide.keyPoints.map((point, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 8,
                padding: '20px 24px',
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: EDITORIAL_COLORS.brushedGold,
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  fontFamily: EDITORIAL_FONTS.sans,
                  fontSize: 20,
                  fontWeight: 500,
                  lineHeight: 1.35,
                  color: EDITORIAL_COLORS.textPrimaryLight,
                }}
              >
                {point}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Body Callout Paragraph */}
      {slide.bodyText && (
        <div
          style={{
            backgroundColor: 'rgba(14, 40, 30, 0.65)',
            borderLeft: `4px solid ${EDITORIAL_COLORS.brushedGold}`,
            padding: '20px 24px',
            borderRadius: '0 8px 8px 0',
          }}
        >
          <p
            style={{
              fontFamily: EDITORIAL_FONTS.sans,
              fontSize: 19,
              fontWeight: 500,
              lineHeight: 1.45,
              color: EDITORIAL_COLORS.textSecondaryLight,
              margin: 0,
            }}
          >
            {slide.bodyText}
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * Slide 6 Renderer: High-Save Reference Sheet / Comparison Matrix
 * Bookmark Magnet with clean editorial typography and structured rows.
 */
const RenderSlideHighSave: React.FC<{ slide: CarouselSlideData }> = ({ slide }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        paddingTop: 36,
        paddingBottom: 20,
      }}
    >
      <div>
        <div
          style={{
            display: 'inline-block',
            padding: '6px 14px',
            backgroundColor: 'rgba(212, 175, 55, 0.15)',
            border: `1px solid ${EDITORIAL_COLORS.borderGold}`,
            borderRadius: 4,
            fontFamily: EDITORIAL_FONTS.sans,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: EDITORIAL_COLORS.goldHighlight,
            marginBottom: 20,
          }}
        >
          {slide.badgeText || 'HIGH-SAVE REFERENCE SHEET'}
        </div>

        <h2
          style={{
            fontFamily: EDITORIAL_FONTS.sans,
            fontSize: 48,
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: EDITORIAL_COLORS.textPrimaryLight,
            margin: 0,
            marginBottom: 16,
          }}
        >
          {slide.headline}
        </h2>

        {slide.subhead && (
          <p
            style={{
              fontFamily: EDITORIAL_FONTS.serif,
              fontSize: 22,
              lineHeight: 1.35,
              color: EDITORIAL_COLORS.goldHighlight,
              margin: 0,
              marginBottom: 28,
            }}
          >
            {slide.subhead}
          </p>
        )}
      </div>

      {/* Comparison Table Matrix */}
      <div
        style={{
          border: '1px solid rgba(212, 175, 55, 0.35)',
          borderRadius: 8,
          overflow: 'hidden',
          backgroundColor: 'rgba(14, 40, 30, 0.85)',
        }}
      >
        {/* Table Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '220px 1fr 1fr',
            backgroundColor: 'rgba(212, 175, 55, 0.15)',
            borderBottom: '1px solid rgba(212, 175, 55, 0.35)',
            padding: '16px 20px',
          }}
        >
          <div
            style={{
              fontFamily: EDITORIAL_FONTS.sans,
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: EDITORIAL_COLORS.goldHighlight,
            }}
          >
            ASPEK
          </div>
          <div
            style={{
              fontFamily: EDITORIAL_FONTS.sans,
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#9CA3AF',
            }}
          >
            KAFE BIASA
          </div>
          <div
            style={{
              fontFamily: EDITORIAL_FONTS.sans,
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: EDITORIAL_COLORS.brushedGold,
            }}
          >
            LIRA BOTOL SEALED
          </div>
        </div>

        {/* Table Body Rows */}
        {slide.comparisonRows?.map((row, idx) => (
          <div
            key={idx}
            style={{
              display: 'grid',
              gridTemplateColumns: '220px 1fr 1fr',
              padding: '20px',
              borderBottom:
                idx === (slide.comparisonRows?.length || 0) - 1
                  ? 'none'
                  : '1px solid rgba(255, 255, 255, 0.08)',
              backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontFamily: EDITORIAL_FONTS.sans,
                fontSize: 16,
                fontWeight: 700,
                color: EDITORIAL_COLORS.goldHighlight,
              }}
            >
              {row.feature}
            </div>
            <div
              style={{
                fontFamily: EDITORIAL_FONTS.sans,
                fontSize: 16,
                fontWeight: 500,
                color: '#D1D5DB',
                lineHeight: 1.3,
              }}
            >
              {row.cafe}
            </div>
            <div
              style={{
                fontFamily: EDITORIAL_FONTS.sans,
                fontSize: 17,
                fontWeight: 700,
                color: '#FFFFFF',
                lineHeight: 1.3,
              }}
            >
              {row.lira}
            </div>
          </div>
        ))}
      </div>

      {/* Save Magnet Callout Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(212, 175, 55, 0.12)',
          border: `1px solid ${EDITORIAL_COLORS.borderGold}`,
          borderRadius: 8,
          padding: '18px 24px',
          marginTop: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 6,
              backgroundColor: EDITORIAL_COLORS.brushedGold,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              color: EDITORIAL_COLORS.emeraldDeep,
              fontSize: 18,
            }}
          >
            S
          </div>
          <div
            style={{
              fontFamily: EDITORIAL_FONTS.sans,
              fontSize: 16,
              fontWeight: 600,
              color: EDITORIAL_COLORS.textPrimaryLight,
            }}
          >
            Simpan postingan ini sebagai contekan harian saat lo butuh energi fokus bebas crash.
          </div>
        </div>

        <div
          style={{
            fontFamily: EDITORIAL_FONTS.sans,
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: EDITORIAL_COLORS.goldHighlight,
            flexShrink: 0,
          }}
        >
          BOOKMARK
        </div>
      </div>
    </div>
  );
};

/**
 * Slide 7 Renderer: Operational Transparency / 03:30 AM Routine
 */
const RenderSlideRoutine: React.FC<{ slide: CarouselSlideData }> = ({ slide }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        paddingTop: 36,
        paddingBottom: 20,
      }}
    >
      <div>
        <div
          style={{
            display: 'inline-block',
            padding: '6px 14px',
            backgroundColor: 'rgba(212, 175, 55, 0.15)',
            border: `1px solid ${EDITORIAL_COLORS.borderGold}`,
            borderRadius: 4,
            fontFamily: EDITORIAL_FONTS.sans,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: EDITORIAL_COLORS.goldHighlight,
            marginBottom: 20,
          }}
        >
          {slide.badgeText || 'TRANSPARANSI PRODUKSI'}
        </div>

        <h2
          style={{
            fontFamily: EDITORIAL_FONTS.sans,
            fontSize: 50,
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: EDITORIAL_COLORS.textPrimaryLight,
            margin: 0,
            marginBottom: 16,
          }}
        >
          {slide.headline}
        </h2>

        {slide.subhead && (
          <p
            style={{
              fontFamily: EDITORIAL_FONTS.serif,
              fontSize: 22,
              lineHeight: 1.35,
              color: EDITORIAL_COLORS.goldHighlight,
              margin: 0,
              marginBottom: 32,
            }}
          >
            {slide.subhead}
          </p>
        )}
      </div>

      {/* Routine Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {slide.keyPoints?.map((point, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 20,
              backgroundColor: 'rgba(14, 40, 30, 0.75)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              borderRadius: 8,
              padding: '24px 28px',
            }}
          >
            <div
              style={{
                fontFamily: EDITORIAL_FONTS.sans,
                fontSize: 14,
                fontWeight: 800,
                color: EDITORIAL_COLORS.brushedGold,
                backgroundColor: 'rgba(212, 175, 55, 0.15)',
                padding: '6px 12px',
                borderRadius: 4,
                letterSpacing: '0.1em',
              }}
            >
              TAHAP 0{idx + 1}
            </div>
            <div
              style={{
                fontFamily: EDITORIAL_FONTS.sans,
                fontSize: 21,
                fontWeight: 500,
                lineHeight: 1.35,
                color: EDITORIAL_COLORS.textPrimaryLight,
              }}
            >
              {point}
            </div>
          </div>
        ))}
      </div>

      {slide.bodyText && (
        <div
          style={{
            borderLeft: `4px solid ${EDITORIAL_COLORS.brushedGold}`,
            paddingLeft: 20,
            marginTop: 20,
          }}
        >
          <p
            style={{
              fontFamily: EDITORIAL_FONTS.sans,
              fontSize: 18,
              lineHeight: 1.45,
              color: EDITORIAL_COLORS.textSecondaryLight,
              margin: 0,
            }}
          >
            {slide.bodyText}
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * Slide 8 Renderer: Action CTA & Saturday Gojek COD Loop
 * Non-numeric limited batch call to action + thermal cooler bag asset
 */
const RenderSlideCTA: React.FC<{ slide: CarouselSlideData }> = ({ slide }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        paddingTop: 36,
        paddingBottom: 20,
      }}
    >
      <div>
        <div
          style={{
            display: 'inline-block',
            padding: '6px 14px',
            backgroundColor: 'rgba(212, 175, 55, 0.15)',
            border: `1px solid ${EDITORIAL_COLORS.borderGold}`,
            borderRadius: 4,
            fontFamily: EDITORIAL_FONTS.sans,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: EDITORIAL_COLORS.goldHighlight,
            marginBottom: 20,
          }}
        >
          {slide.badgeText || 'CARA AMANKAN BATCH'}
        </div>

        <h2
          style={{
            fontFamily: EDITORIAL_FONTS.sans,
            fontSize: 50,
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: EDITORIAL_COLORS.textPrimaryLight,
            margin: 0,
            marginBottom: 16,
          }}
        >
          {slide.headline}
        </h2>

        {slide.subhead && (
          <p
            style={{
              fontFamily: EDITORIAL_FONTS.serif,
              fontSize: 22,
              lineHeight: 1.35,
              color: EDITORIAL_COLORS.goldHighlight,
              margin: 0,
              marginBottom: 28,
            }}
          >
            {slide.subhead}
          </p>
        )}
      </div>

      {/* Visual Props: Thermal Cooler Bag + Authentic Bottle Cutout */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 32,
          height: 320,
          position: 'relative',
        }}
      >
        <Img
          src={staticFile('assets/pixel/tutorial/cooler_bag_cutout.png')}
          style={{
            height: 280,
            objectFit: 'contain',
            filter: 'drop-shadow(0 16px 28px rgba(0, 0, 0, 0.4))',
          }}
        />
        <Img
          src={staticFile('assets/bottles_ssot/matcha_ssot.png')}
          style={{
            height: 300,
            objectFit: 'contain',
            filter: 'drop-shadow(0 16px 28px rgba(0, 0, 0, 0.45))',
          }}
        />
      </div>

      {/* 3 Step Action Blueprint */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {slide.orderSteps?.map((step, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              backgroundColor: 'rgba(14, 40, 30, 0.85)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: 8,
              padding: '16px 22px',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: EDITORIAL_COLORS.brushedGold,
                color: EDITORIAL_COLORS.emeraldDeep,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: EDITORIAL_FONTS.sans,
                fontSize: 16,
                fontWeight: 900,
                flexShrink: 0,
              }}
            >
              {idx + 1}
            </div>
            <div
              style={{
                fontFamily: EDITORIAL_FONTS.sans,
                fontSize: 19,
                fontWeight: 600,
                color: EDITORIAL_COLORS.textPrimaryLight,
                lineHeight: 1.3,
              }}
            >
              {step}
            </div>
          </div>
        ))}
      </div>

      {/* Scarcity Banner: Strictly Non-Numeric Scarcity */}
      <div
        style={{
          backgroundColor: 'rgba(212, 175, 55, 0.18)',
          border: `1.5px solid ${EDITORIAL_COLORS.brushedGold}`,
          borderRadius: 8,
          padding: '18px 24px',
          textAlign: 'center',
          marginTop: 10,
        }}
      >
        <span
          style={{
            fontFamily: EDITORIAL_FONTS.sans,
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: EDITORIAL_COLORS.goldHighlight,
          }}
        >
          LIMITED BATCH MINGGU INI • KLIK LINK DI BIO @DRINKLIRA
        </span>
      </div>
    </div>
  );
};

/**
 * Universal Slide Dispatcher
 */
export const CarouselSlideView: React.FC<CarouselSlideProps> = ({
  slide,
  totalSlides = 8,
}) => {
  const isLast = slide.slideNumber === totalSlides;

  // Background styling: quiet luxury dark emerald backdrop with zero glow blobs or grids
  const containerStyle: React.CSSProperties = {
    ...SLIDE_DIMENSIONS,
    position: 'relative',
    backgroundColor: EDITORIAL_COLORS.emeraldDeep,
    color: EDITORIAL_COLORS.textPrimaryLight,
    fontFamily: EDITORIAL_FONTS.sans,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: `${SLIDE_DIMENSIONS.paddingVertical}px ${SLIDE_DIMENSIONS.paddingHorizontal}px`,
    boxSizing: 'border-box',
    overflow: 'hidden',
  };

  return (
    <div style={containerStyle}>
      <EditorialHeader
        categoryTag={slide.categoryTag}
        badgeText={slide.badgeText}
        slideNumber={slide.slideNumber}
        totalSlides={totalSlides}
      />

      <div style={{ flex: 1, position: 'relative', zIndex: 5 }}>
        {slide.type === 'hook' && <RenderSlide1Hook slide={slide} />}
        {slide.type === 'reserve_hook' && <RenderSlide2ReserveHook slide={slide} />}
        {slide.type === 'body' && <RenderSlideBody slide={slide} />}
        {(slide.type === 'high_save' || slide.type === 'comparison') && (
          <RenderSlideHighSave slide={slide} />
        )}
        {slide.type === 'routine' && <RenderSlideRoutine slide={slide} />}
        {slide.type === 'cta' && <RenderSlideCTA slide={slide} />}
      </div>

      <EditorialFooter
        swipePrompt={slide.swipePrompt}
        isLastSlide={isLast}
      />
    </div>
  );
};

/**
 * Full Deck Wrapper Component (can render any specific slide by 1-based index)
 */
export const CarouselEditorialEngine: React.FC<{
  deck?: CarouselDeckData;
  slideIndex?: number;
}> = ({ deck, slideIndex = 1 }) => {
  const activeDeck = deck || require('./sampleCarouselData').SAMPLE_STEVIA_CAROUSEL_DECK;
  const targetSlide =
    activeDeck.slides.find((s: CarouselSlideData) => s.slideNumber === slideIndex) ||
    activeDeck.slides[0];

  return (
    <CarouselSlideView
      slide={targetSlide}
      totalSlides={activeDeck.slides.length}
      theme={activeDeck.theme}
    />
  );
};

export const EditorialSlide1: React.FC = () => <CarouselEditorialEngine slideIndex={1} />;
export const EditorialSlide2: React.FC = () => <CarouselEditorialEngine slideIndex={2} />;
export const EditorialSlide3: React.FC = () => <CarouselEditorialEngine slideIndex={3} />;
export const EditorialSlide4: React.FC = () => <CarouselEditorialEngine slideIndex={4} />;
export const EditorialSlide5: React.FC = () => <CarouselEditorialEngine slideIndex={5} />;
export const EditorialSlide6: React.FC = () => <CarouselEditorialEngine slideIndex={6} />;
export const EditorialSlide7: React.FC = () => <CarouselEditorialEngine slideIndex={7} />;
export const EditorialSlide8: React.FC = () => <CarouselEditorialEngine slideIndex={8} />;

