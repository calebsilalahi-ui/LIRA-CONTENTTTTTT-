import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { loadFont as loadPressStart } from '@remotion/google-fonts/PressStart2P';
import { loadFont as loadSilkscreen } from '@remotion/google-fonts/Silkscreen';
import captionsData from './sample_3p_somatic_reel_captions.json';

const { fontFamily: PIXEL_FONT } = loadPressStart();
const { fontFamily: PIXEL_SUB_FONT } = loadSilkscreen();

// 914 frames @ 30fps = 30.48s (Canonical 22s–35s sweet spot)
export const SCIENCE8BIT_DURATION = 914;

export const Reel_Science8Bit_Somatic: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Continuous subtle camera drift across all 914 frames (never freezes)
  const cameraDriftScale = interpolate(frame, [0, SCIENCE8BIT_DURATION], [1.04, 0.98], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cameraPanY = interpolate(frame, [0, SCIENCE8BIT_DURATION], [8, -8], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Hanging Brass Pendulum Clock Animation (swings rhythmically like in reference video)
  const pendulumAngle = Math.sin((frame / 16) * Math.PI) * 14; // ±14 degrees

  // Floating 8-Bit Emerald & Golden Motes (matches @science_in_8bit floating particles)
  const motes = Array.from({ length: 18 }, (_, i) => {
    const speed = 0.8 + (i % 3) * 0.35;
    const progress = ((frame * speed + i * 45) % 100) / 100;
    const baseX = 120 + ((i * 57) % 840);
    const swayX = Math.sin(progress * Math.PI * 3 + i) * 25;
    const y = 1600 - progress * 1100; // floats upward
    const size = i % 4 === 0 ? 10 : i % 2 === 0 ? 7 : 5;
    const alpha =
      progress < 0.15
        ? progress / 0.15
        : progress > 0.85
        ? (1 - progress) / 0.15
        : 0.85;
    const color = i % 2 === 0 ? '#39FF88' : '#FFE566';
    return { x: baseX + swayX, y, size, alpha, color };
  });

  // Narrative Beat Intervals (synchronized with spoken audio in sample_3p_somatic_reel_captions.json)
  // Beat 1 (0 - 280f / 0.0s - 9.3s): Somatic Hook - 2 PM Crash & Coffee Deception
  // Beat 2 (280 - 504f / 9.3s - 16.8s): Insulin Drop vs Brain Fog Wave
  // Beat 3 (504 - 732f / 16.8s - 24.4s): Real SSOT Lira Matcha & 180° Leakproof Proof
  // Beat 4 (732 - 914f / 24.4s - 30.48s): Forest Green Cooler Bag & Saturday Batch
  const isBeat1 = frame < 280;
  const isBeat2 = frame >= 280 && frame < 504;
  const isBeat3 = frame >= 504 && frame < 732;
  const isBeat4 = frame >= 732;

  // Active Caption Chunk from Word-Level Timestamps
  const currentSec = frame / 30;
  const activeChunk = captionsData.find(
    (chunk) => currentSec >= chunk.startSec && currentSec <= chunk.endSec
  );

  // Seamless loop opacity for the final 15 frames
  const loopOpacity = interpolate(frame, [SCIENCE8BIT_DURATION - 15, SCIENCE8BIT_DURATION], [0, 0.95], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: '#050A08',
        overflow: 'hidden',
      }}
    >
      {/* 1. Master Camera Rig with continuous drift */}
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          transform: `scale(${cameraDriftScale}) translateY(${cameraPanY}px)`,
          transformOrigin: 'center center',
        }}
      >
        {/* Deep Atmospheric Mystical Tea Room Gradient (matches @science_in_8bit burgundy/plum but in Lira deep forest green) */}
        <AbsoluteFill
          style={{
            background: 'radial-gradient(circle at 50% 48%, #0F2A1E 0%, #08150F 55%, #030806 100%)',
          }}
        />

        {/* 4 Retro Pixel Wall Lanterns (like in @science_in_8bit frame_01.jpg) */}
        <div style={{ position: 'absolute', top: 480, left: 75, width: 22, height: 42, backgroundColor: '#FFE566', boxShadow: '0 0 35px #FFE566, 0 0 70px rgba(255, 229, 102, 0.45)', borderRadius: 4 }} />
        <div style={{ position: 'absolute', top: 480, right: 75, width: 22, height: 42, backgroundColor: '#FFE566', boxShadow: '0 0 35px #FFE566, 0 0 70px rgba(255, 229, 102, 0.45)', borderRadius: 4 }} />
        <div style={{ position: 'absolute', top: 1380, left: 75, width: 22, height: 42, backgroundColor: '#FFE566', boxShadow: '0 0 35px #FFE566, 0 0 70px rgba(255, 229, 102, 0.45)', borderRadius: 4 }} />
        <div style={{ position: 'absolute', top: 1380, right: 75, width: 22, height: 42, backgroundColor: '#FFE566', boxShadow: '0 0 35px #FFE566, 0 0 70px rgba(255, 229, 102, 0.45)', borderRadius: 4 }} />

        {/* Floating 8-Bit Emerald Tea Motes & Gold Frost Sparkles */}
        {motes.map((m, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: m.x,
              top: m.y,
              width: m.size,
              height: m.size,
              backgroundColor: m.color,
              boxShadow: `0 0 10px ${m.color}, 2px 2px 0 rgba(0,0,0,0.8)`,
              opacity: m.alpha,
              pointerEvents: 'none',
              zIndex: 30,
            }}
          />
        ))}

        {/* ----------------------------------------------------
            SWINGING BRASS PENDULUM CLOCK (Identical to @science_in_8bit)
            Hangs from top-center down to y: 480px, swinging rhythmically
            ---------------------------------------------------- */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transformOrigin: 'top center',
            transform: `translateX(-50%) rotate(${pendulumAngle}deg)`,
            zIndex: 40,
          }}
        >
          {/* Thin brass chain / thread */}
          <div style={{ width: 3, height: 420, backgroundColor: '#D4AF37', boxShadow: '0 0 6px rgba(212, 175, 55, 0.6)' }} />
          
          {/* Golden Pocket Watch / Clock Face */}
          <div
            style={{
              width: 78,
              height: 78,
              borderRadius: '50%',
              backgroundColor: '#FAF7F0',
              border: '4px solid #D4AF37',
              boxShadow: '0 0 25px rgba(212, 175, 55, 0.8), inset 0 0 10px rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {/* Clock hour & minute hands */}
            <div
              style={{
                position: 'absolute',
                width: 3,
                height: 22,
                backgroundColor: '#1E293B',
                top: 17,
                transformOrigin: 'bottom center',
                transform: `rotate(${frame * 2.5}deg)`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: 2,
                height: 28,
                backgroundColor: '#FF2E63',
                top: 11,
                transformOrigin: 'bottom center',
                transform: `rotate(${frame * 6}deg)`,
              }}
            />
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#D4AF37', zIndex: 5 }} />
          </div>

          {/* Hanging Pendulum Weight */}
          <div style={{ width: 2, height: 40, backgroundColor: '#D4AF37' }} />
          <div style={{ width: 16, height: 16, backgroundColor: '#D4AF37', transform: 'rotate(45deg)', boxShadow: '0 0 12px #FFE566' }} />
        </div>

        {/* ----------------------------------------------------
            CENTER HYPNOTIC VISUAL STAGE (x:[140, 940], y:[500, 1300])
            Unified aesthetic arena matching @science_in_8bit
            ---------------------------------------------------- */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 920,
            transform: 'translate(-50%, -50%)',
            width: 820,
            height: 820,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20,
          }}
        >
          {/* BEAT 1: 0 - 280f (0 - 9.3s): Caleb at Study Desk + 2 PM Sleepy Fog */}
          {isBeat1 && (
            <div style={{ position: 'relative', width: 780, height: 780, borderRadius: 32, overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.95), 0 0 35px rgba(57, 255, 136, 0.25)', border: '2px solid rgba(57, 255, 136, 0.4)' }}>
              <Img
                src={staticFile('assets/pixel/scene_5_laptop_a.jpg')}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {/* Floating Zzz Motes (like in reference video nostrils sleeping) */}
              {frame >= 30 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 140,
                    right: 220,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    zIndex: 25,
                  }}
                >
                  <span style={{ fontFamily: PIXEL_FONT, fontSize: 24, color: '#5CE1E6', opacity: Math.sin(frame / 8) * 0.5 + 0.5 }}>Z</span>
                  <span style={{ fontFamily: PIXEL_FONT, fontSize: 18, color: '#5CE1E6', marginLeft: 16, opacity: Math.cos(frame / 8) * 0.5 + 0.5 }}>z</span>
                  <span style={{ fontFamily: PIXEL_FONT, fontSize: 14, color: '#5CE1E6', marginLeft: 28 }}>z</span>
                </div>
              )}
              {/* Retro 8-bit Clock Banner */}
              <div
                style={{
                  position: 'absolute',
                  top: 24,
                  left: 24,
                  backgroundColor: 'rgba(5, 10, 8, 0.9)',
                  border: '1.5px solid #FFE566',
                  borderRadius: 8,
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#FF2E63', boxShadow: '0 0 8px #FF2E63' }} />
                <span style={{ fontFamily: PIXEL_FONT, fontSize: 14, color: '#FFE566', letterSpacing: '0.08em' }}>
                  02:00 PM CRASH
                </span>
              </div>
            </div>
          )}

          {/* BEAT 2: 280 - 504f (9.3 - 16.8s): Insulin Spike vs Zero-Crash Alpha Wave */}
          {isBeat2 && (
            <div
              style={{
                width: 780,
                height: 780,
                borderRadius: 32,
                backgroundColor: 'rgba(8, 20, 14, 0.95)',
                border: '2px solid rgba(212, 175, 55, 0.5)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.95), inset 0 0 30px rgba(0,0,0,0.8)',
                padding: 40,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                zIndex: 25,
              }}
            >
              {/* Top Graph: Cafe 50k Insulin Spike & Crash */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontFamily: PIXEL_FONT, fontSize: 13, color: '#FF2E63' }}>
                    CAFE 50K: GULA SIRUP
                  </span>
                  <span style={{ fontFamily: PIXEL_FONT, fontSize: 12, color: '#FF2E63' }}>
                    INSULIN CRASH ▼
                  </span>
                </div>
                {/* Red Jagged Crash Wave (SVG) */}
                <svg width="700" height="120" style={{ overflow: 'visible' }}>
                  <path
                    d="M 0 100 Q 150 -10, 280 20 T 420 110 L 700 115"
                    fill="none"
                    stroke="#FF2E63"
                    strokeWidth="4"
                    strokeDasharray="8 4"
                  />
                  {/* Pulsing Red Spike Node */}
                  <circle cx="280" cy="20" r="8" fill="#FF2E63" style={{ filter: 'drop-shadow(0 0 10px #FF2E63)' }} />
                </svg>
              </div>

              {/* Dividing Retro Line */}
              <div style={{ width: '100%', height: 2, backgroundColor: 'rgba(212, 175, 55, 0.3)' }} />

              {/* Bottom Graph: Lira Matcha Stable Alpha Energy */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontFamily: PIXEL_FONT, fontSize: 13, color: '#39FF88' }}>
                    LIRA MATCHA: STEVIA + OAT
                  </span>
                  <span style={{ fontFamily: PIXEL_FONT, fontSize: 12, color: '#39FF88' }}>
                    ALPHA FOCUS 4 JAM ▲
                  </span>
                </div>
                {/* Clean Emerald Sustained Wave (SVG) */}
                <svg width="700" height="100" style={{ overflow: 'visible' }}>
                  <path
                    d="M 0 50 Q 180 35, 350 45 T 700 48"
                    fill="none"
                    stroke="#39FF88"
                    strokeWidth="5"
                  />
                  {/* Glowing Green Node with ripple */}
                  <circle cx="350" cy="45" r="9" fill="#39FF88" style={{ filter: 'drop-shadow(0 0 12px #39FF88)' }} />
                </svg>
              </div>
            </div>
          )}

          {/* BEAT 3: 504 - 732f (16.8 - 24.4s): Real SSOT Lira Bottle & 180° Inverted Proof */}
          {isBeat3 && (
            <div style={{ position: 'relative', width: 780, height: 780, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {frame < 660 ? (
                // 100% Real Authentic Lira Matcha PET Bottle Cutout with authentic condensation
                <div
                  style={{
                    transform: `translateY(${Math.sin((frame / 20) * Math.PI) * 12}px)`,
                    filter: 'drop-shadow(0 30px 45px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 35px rgba(57, 255, 136, 0.4))',
                  }}
                >
                  <Img src={staticFile('assets/bottles_ssot/matcha_ssot.png')} style={{ height: 680 }} />
                </div>
              ) : (
                // 180° Inverted Bottle Leakproof Proof over MacBook Keyboard
                <div style={{ width: 780, height: 780, borderRadius: 32, overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.95)', border: '2px solid #39FF88' }}>
                  <Img
                    src={staticFile('assets/pixel/cup_struggle/s3_inverted_a.jpg')}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>
          )}

          {/* BEAT 4: 732 - 914f (24.4 - 30.48s): Forest Green Cooler Bag + Saturday Drop */}
          {isBeat4 && (
            <div style={{ position: 'relative', width: 780, height: 780, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div
                style={{
                  transform: `translateY(${Math.sin((frame / 25) * Math.PI) * 10}px)`,
                  filter: 'drop-shadow(0 30px 50px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 30px rgba(255, 229, 102, 0.4))',
                }}
              >
                <Img src={staticFile('assets/pixel/tutorial/cooler_bag_cutout.png')} style={{ height: 640 }} />
              </div>
            </div>
          )}
        </div>

        {/* ----------------------------------------------------
            TOP RETRO HEADER (x:[100, 980], y: 280px)
            Borderless, Crisp 8-Bit Font (PressStart2P) - @science_in_8bit Style
            ---------------------------------------------------- */}
        <div
          style={{
            position: 'absolute',
            top: 280,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 880,
            textAlign: 'center',
            zIndex: 90,
          }}
        >
          <div
            style={{
              fontFamily: PIXEL_FONT,
              fontSize: 34,
              color: '#FFFFFF',
              lineHeight: 1.45,
              letterSpacing: '0.04em',
              textShadow:
                '-3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000, 0 6px 20px rgba(0,0,0,0.95)',
            }}
          >
            {frame < 280 ? (
              <>
                KENAPA OTAK LO <span style={{ color: '#FFE566' }}>CRASH</span> JAM 2 SIANG?
              </>
            ) : frame < 504 ? (
              <>
                INSULIN DROP <span style={{ color: '#FF2E63' }}>KE TITIK NOL</span>
              </>
            ) : frame < 732 ? (
              <>
                MATCHA MURNI <span style={{ color: '#39FF88' }}>ZERO CRASH</span>
              </>
            ) : (
              <>
                LIMITED BATCH <span style={{ color: '#FFE566' }}>READY SABTU</span>
              </>
            )}
          </div>
        </div>

        {/* ----------------------------------------------------
            LOWER DYNAMIC CAPTION STREAM (x:[100, 980], y: 1420px)
            Strictly 1-Stream, Borderless Retro Pixel Typography
            Synchronized Word-for-Word with Caleb's Voiceover
            ---------------------------------------------------- */}
        {activeChunk && (
          <div
            style={{
              position: 'absolute',
              top: 1420,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 880,
              textAlign: 'center',
              zIndex: 95,
            }}
          >
            <span
              style={{
                fontFamily: PIXEL_FONT,
                fontSize: 32,
                color: activeChunk.highlight ? '#FFE566' : '#FFFFFF',
                letterSpacing: '0.05em',
                lineHeight: 1.35,
                textTransform: 'uppercase',
                textShadow:
                  '-3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000, 0 6px 18px rgba(0,0,0,0.95)',
              }}
            >
              {activeChunk.text}
            </span>
          </div>
        )}
      </div>

      {/* Audio Track: Caleb Founder Voiceover Clone */}
      <Audio src={staticFile('assets/sample_reel_audio.mp3')} volume={1.0} />

      {/* Ambient Lo-Fi Background Music: Ducked cleanly to -16dB */}
      <Audio
        src={staticFile('assets/bg_music.mp3')}
        volume={(f) => {
          if (f < 15) return interpolate(f, [0, 15], [0, 0.14]);
          if (f > SCIENCE8BIT_DURATION - 20) return interpolate(f, [SCIENCE8BIT_DURATION - 20, SCIENCE8BIT_DURATION], [0.14, 0.05]);
          return 0.14;
        }}
      />

      {/* Seamless Infinite Loop Splice Overlay */}
      {frame >= SCIENCE8BIT_DURATION - 15 && (
        <AbsoluteFill
          style={{
            backgroundColor: '#050A08',
            opacity: loopOpacity,
            pointerEvents: 'none',
          }}
        />
      )}
    </AbsoluteFill>
  );
};
