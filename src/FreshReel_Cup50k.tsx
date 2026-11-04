import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadPressStart } from '@remotion/google-fonts/PressStart2P';
import { TikTokCaption } from './TikTokCaption';
import captionsData from './fresh_cup50k_captions.json';

const { fontFamily: MONTSERRAT_FONT } = loadMontserrat();
const { fontFamily: PIXEL_FONT } = loadPressStart();

// 1130 frames @ 30fps = 37.67s
export const FRESH_CUP50K_DURATION = 1130;

export const FreshReel_Cup50k: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Continuous subtle camera drift across all 1130 frames (never freezes)
  const cameraDriftScale = interpolate(frame, [0, FRESH_CUP50K_DURATION], [1.08, 0.98], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cameraPanX = interpolate(frame, [0, FRESH_CUP50K_DURATION], [-15, 15], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cameraPanY = interpolate(frame, [0, FRESH_CUP50K_DURATION], [10, -10], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Scene Boundaries
  // Beat 1 (0 - 180f / 0s - 6s): Plastic Cup Struggle & Laptop Danger Hook
  // Beat 2 (180 - 420f / 6s - 14s): Melted Ice & Water Damage on Notes
  // Beat 3 (420 - 690f / 14s - 23s): 180° Inverted Bottle Leakproof Test over MacBook
  // Beat 4 (690 - 900f / 23s - 30s): 0g Sugar & Pure Stevia Cold Extract Proof
  // Beat 5 & 6 (900 - 1130f / 30s - 37.67s): Forest Green Cooler Bag + Saturday COD Loop + Loop Splice
  const isBeat1 = frame < 180;
  const isBeat2 = frame >= 180 && frame < 420;
  const isBeat3 = frame >= 420 && frame < 690;
  const isBeat4 = frame >= 690 && frame < 900;
  const isBeat5 = frame >= 900;

  // Seamless Loop Splice (last 20 frames blend towards Frame 0)
  const loopOpacity = interpolate(frame, [FRESH_CUP50K_DURATION - 20, FRESH_CUP50K_DURATION], [0, 0.95], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#070A0E', overflow: 'hidden' }}>
      {/* 1. Master Camera Wrapper with continuous drift */}
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          transform: `scale(${cameraDriftScale}) translate(${cameraPanX}px, ${cameraPanY}px)`,
          transformOrigin: 'center center',
        }}
      >
        {/* BEAT 1: Sweating Plastic Cup Frustration (0 - 180f) */}
        {isBeat1 && (
          <AbsoluteFill>
            <Img
              src={staticFile('assets/pixel/cup_struggle/s1_typing_cup.jpg')}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Pulsing warning aura on Frame 18-90 */}
            {frame >= 18 && frame < 130 && (
              <div
                style={{
                  position: 'absolute',
                  top: '46%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'rgba(255, 46, 99, 0.22)',
                  border: '2.5px solid #FF2E63',
                  borderRadius: 16,
                  padding: '12px 28px',
                  boxShadow: '0 0 30px rgba(255, 46, 99, 0.65)',
                  zIndex: 25,
                }}
              >
                <span
                  style={{
                    fontFamily: PIXEL_FONT,
                    color: '#FFE566',
                    fontSize: 18,
                    letterSpacing: '0.05em',
                  }}
                >
                  ⚠️ RISIKO KONSLET LAPTOP
                </span>
              </div>
            )}
          </AbsoluteFill>
        )}

        {/* BEAT 2: Melted Ice Water Damage (180 - 420f) */}
        {isBeat2 && (
          <AbsoluteFill>
            <Img
              src={staticFile('assets/pixel/story_cup_water_damage.jpg')}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Water damage callout card */}
            <div
              style={{
                position: 'absolute',
                bottom: 220,
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(11, 15, 25, 0.88)',
                border: '1.5px solid rgba(255, 255, 255, 0.25)',
                borderRadius: 14,
                padding: '12px 24px',
                zIndex: 25,
                backdropFilter: 'blur(10px)',
              }}
            >
              <span
                style={{
                  fontFamily: MONTSERRAT_FONT,
                  fontWeight: 800,
                  fontSize: 22,
                  color: '#FF4A6E',
                  textTransform: 'uppercase',
                }}
              >
                ES MENCAIR = AIR TAWAR 50K
              </span>
            </div>
          </AbsoluteFill>
        )}

        {/* BEAT 3: 180° Inverted Bottle Leakproof Proof (420 - 690f) */}
        {isBeat3 && (
          <AbsoluteFill>
            {/* 2-Frame Dynamic Toggle between A (steady) and B (shaking over MacBook) */}
            <Img
              src={
                Math.floor((frame - 420) / 6) % 2 === 0
                  ? staticFile('assets/pixel/cup_struggle/s3_inverted_a.jpg')
                  : staticFile('assets/pixel/cup_struggle/s3_inverted_b.jpg')
              }
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Leakproof Verification Badge */}
            <div
              style={{
                position: 'absolute',
                top: '26%',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(29, 74, 56, 0.95)',
                border: '2px solid #39FF88',
                borderRadius: 999,
                padding: '10px 24px',
                boxShadow: '0 0 25px rgba(57, 255, 136, 0.5)',
                zIndex: 30,
              }}
            >
              <span
                style={{
                  fontFamily: MONTSERRAT_FONT,
                  fontWeight: 900,
                  fontSize: 22,
                  color: '#39FF88',
                  letterSpacing: '0.08em',
                }}
              >
                ✓ 180° ZERO REMBES DI MACBOOK
              </span>
            </div>
          </AbsoluteFill>
        )}

        {/* BEAT 4: 0g Sugar & Cold Extract Proof (690 - 900f) */}
        {isBeat4 && (
          <AbsoluteFill>
            <Img
              src={staticFile('assets/pixel/scene_2_kitchen.jpg')}
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }}
            />
            {/* Floating SSOT Real Bottles Triad */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 36,
                transform: `translateY(${Math.sin((frame / 30) * Math.PI) * 8}px)`,
                zIndex: 20,
              }}
            >
              <Img src={staticFile('assets/bottles_ssot/choco_ssot.png')} style={{ height: 480, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.9))' }} />
              <Img src={staticFile('assets/bottles_ssot/matcha_ssot.png')} style={{ height: 530, transform: 'scale(1.08)', filter: 'drop-shadow(0 25px 40px rgba(0,0,0,0.95))' }} />
              <Img src={staticFile('assets/bottles_ssot/milktea_ssot.png')} style={{ height: 480, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.9))' }} />
            </div>
            {/* Zero Sugar Badge */}
            <div
              style={{
                position: 'absolute',
                bottom: 240,
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(11, 15, 25, 0.92)',
                border: '1.5px solid #39FF88',
                borderRadius: 14,
                padding: '12px 28px',
                zIndex: 35,
              }}
            >
              <span style={{ fontFamily: MONTSERRAT_FONT, fontWeight: 900, fontSize: 24, color: '#FFFFFF' }}>
                NOL GULA PASIR • <span style={{ color: '#FFE566' }}>STEVIA ALAMI</span>
              </span>
            </div>
          </AbsoluteFill>
        )}

        {/* BEAT 5 & 6: Forest Cooler Bag + Qualitative Scarcity (900 - 1130f) */}
        {isBeat5 && (
          <AbsoluteFill>
            <Img
              src={staticFile('assets/pixel/scene_2_kitchen.jpg')}
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.65)' }}
            />
            {/* Authentic Forest Green Cooler Bag */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '48%',
                transform: `translate(-50%, -50%) translateY(${Math.sin((frame / 35) * Math.PI) * 6}px)`,
                zIndex: 20,
                filter: 'drop-shadow(0 25px 40px rgba(0,0,0,0.9))',
              }}
            >
              <Img src={staticFile('assets/pixel/tutorial/cooler_bag_cutout.png')} style={{ height: 500 }} />
            </div>

            {/* Scarcity Banner */}
            <div
              style={{
                position: 'absolute',
                bottom: 220,
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(29, 74, 56, 0.96)',
                border: '2px solid #39FF88',
                borderRadius: 999,
                padding: '14px 32px',
                zIndex: 35,
                boxShadow: '0 8px 30px rgba(0,0,0,0.85)',
              }}
            >
              <span
                style={{
                  fontFamily: MONTSERRAT_FONT,
                  fontWeight: 900,
                  fontSize: 24,
                  color: '#FFE566',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                LIMITED BATCH READY SABTU
              </span>
            </div>
          </AbsoluteFill>
        )}
      </div>

      {/* Frame 0 - 90 Upper Safe Box Headline Hook */}
      {frame < 95 && (
        <div
          style={{
            position: 'absolute',
            top: 290,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 860,
            textAlign: 'center',
            zIndex: 90,
          }}
        >
          <div
            style={{
              fontFamily: MONTSERRAT_FONT,
              fontWeight: 900,
              fontSize: 52,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 8px 24px rgba(0,0,0,0.95)',
            }}
          >
            3 ALASAN CUP 50K{' '}
            <span style={{ color: '#FFE566' }}>BUANG DUIT</span>
          </div>
        </div>
      )}

      {/* Synchronized 2-3 Word Kinetic Pop Subtitles */}
      <TikTokCaption
        currentFrame={frame}
        chunks={captionsData}
        topPercentage={56}
        fontSize={62}
        highlightColor="#FFE566"
      />

      {/* Audio Track */}
      <Audio src={staticFile('assets/fresh_cup50k_master.mp3')} volume={1.0} />

      {/* Seamless loop overlay */}
      {frame >= FRESH_CUP50K_DURATION - 20 && (
        <AbsoluteFill
          style={{
            backgroundColor: '#070A0E',
            opacity: loopOpacity,
            pointerEvents: 'none',
          }}
        />
      )}
    </AbsoluteFill>
  );
};
