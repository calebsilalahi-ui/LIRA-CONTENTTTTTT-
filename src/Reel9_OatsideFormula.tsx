import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  Easing,
  Sequence,
} from 'remotion';
import { TikTokCaption } from './TikTokCaption';
import captionsData from './reel_new_09_oatside_formula_captions.json';

export const REEL_9_DURATION = 827; // 27.57s @ 30fps

export const Reel9_OatsideFormula: React.FC = () => {
  const frame = useCurrentFrame();

  // Subtle natural breathing cycle for character presence
  const breathe = Math.sin((frame / 45) * Math.PI) * 0.012;

  // Scene Boundaries
  const isScene1 = frame < 140;
  const isScene2 = frame >= 140 && frame < 320;
  const isScene3 = frame >= 320 && frame < 518;
  const isScene4 = frame >= 518 && frame < 676;
  const isScene5 = frame >= 676;

  // Camera Motion Curves (onetake & hyperframes principles)
  // Hook Zoom in Frame 0-22
  const hookZoom = interpolate(frame, [0, 22], [1.16, 1.0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Scene 1 Failure Glitch Micro-shake (Frame 82 - 135)
  const isFailedFlash = frame >= 82 && frame < 140;
  const failShakeX = isFailedFlash ? Math.sin(frame * 4.2) * 4 : 0;
  const failShakeY = isFailedFlash ? Math.cos(frame * 3.8) * 3 : 0;

  // Scene 2 Lateral Pan
  const s2PanX = interpolate(frame, [140, 320], [0, -35], {
    easing: Easing.linear,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Scene 3 Continuous Push-in
  const s3Zoom = interpolate(frame, [320, 518], [1.0, 1.09], {
    easing: Easing.out(Easing.quad),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Scene 4 Blender High-Speed Vibration
  const isBlenderPhase = frame >= 518 && frame < 608;
  const isDropperPhase = frame >= 608 && frame < 676;
  const blenderShake = isBlenderPhase ? Math.sin(frame * 6) * 2.5 : 0;

  // Stevia Droplet Fall Animation
  const dropletY = interpolate(frame, [630, 646], [0, 55], {
    easing: Easing.in(Easing.quad),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const dropletOpacity = interpolate(frame, [630, 642, 646], [1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Flash Transition Opacity
  const flashAt320 = interpolate(frame, [320, 326], [0.45, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#070A0F', overflow: 'hidden' }}>
      {/* ============================================================== */}
      {/* 1. AUDIO ENGINE: NARRATION, BACKGROUND MUSIC & TACTILE SFX     */}
      {/* ============================================================== */}
      {/* Main Narration Audio (100% UNTOUCHED) */}
      <Audio src={staticFile('assets/reel_new_09_oatside_formula.mp3')} volume={1.0} />

      {/* Lo-Fi Background Music with dynamic ducking */}
      <Audio
        src={staticFile('assets/bg_music.mp3')}
        volume={(f) =>
          interpolate(f, [0, 30, 770, 827], [0.07, 0.12, 0.12, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
        }
      />

      {/* Tactile SFX Layering for Kinetic Impact */}
      {/* Frame 0: Hook Sub-Thud */}
      <Sequence from={0} durationInFrames={30}>
        <Audio src={staticFile('assets/sfx/sub_hit.mp3')} volume={0.85} />
      </Sequence>

      {/* Frame 82: Scratch on "Eksperimen Gagal Gue" */}
      <Sequence from={82} durationInFrames={30}>
        <Audio src={staticFile('assets/sfx/scratch.mp3')} volume={0.7} />
      </Sequence>

      {/* Frame 140: Camera Glide Whoosh into Plant Milks */}
      <Sequence from={140} durationInFrames={25}>
        <Audio src={staticFile('assets/sfx/whoosh.mp3')} volume={0.65} />
      </Sequence>

      {/* Frame 320: Snap on "Pasangan Emas: Oatside Barista" */}
      <Sequence from={320} durationInFrames={25}>
        <Audio src={staticFile('assets/sfx/snap.mp3')} volume={0.8} />
      </Sequence>

      {/* Frame 518: Blender High-Speed Activation */}
      <Sequence from={518} durationInFrames={30}>
        <Audio src={staticFile('assets/sfx/whoosh.mp3')} volume={0.75} />
      </Sequence>

      {/* Frame 638: Stevia Droplet Impact Ping */}
      <Sequence from={638} durationInFrames={25}>
        <Audio src={staticFile('assets/sfx/snap.mp3')} volume={0.6} />
      </Sequence>

      {/* Frame 765: Tactile Thud on Founder Smirk / CTA */}
      <Sequence from={765} durationInFrames={30}>
        <Audio src={staticFile('assets/sfx/thud.mp3')} volume={0.75} />
      </Sequence>

      {/* ============================================================== */}
      {/* 2. DYNAMIC SCENE RENDERING (ANTI-SLOP & KINETIC CARRY)         */}
      {/* ============================================================== */}

      {/* SCENE 1: THE LATE-NIGHT KITCHEN LAB & FAILURE FLASH (0 - 140) */}
      {isScene1 && (
        <AbsoluteFill
          style={{
            transform: `scale(${hookZoom}) translate(${failShakeX}px, ${failShakeY}px)`,
          }}
        >
          {/* Base Kitchen Visual before Frame 82; Failure Glitch after Frame 82 */}
          <Img
            src={
              isFailedFlash
                ? staticFile('assets/pixel/scene_6_stressed_a.jpg')
                : staticFile('assets/pixel/scene_2_kitchen_a.jpg')
            }
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Minimalist Editorial HUD Header (No Clunky Blue Box) */}
          <div
            style={{
              position: 'absolute',
              top: 75,
              left: 60,
              right: 60,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textShadow: '0 4px 18px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,0.8)',
              zIndex: 800,
            }}
          >
            <div
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 16,
                fontWeight: 800,
                color: isFailedFlash ? '#F87171' : '#A7F3D0',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: 6,
                backgroundColor: 'rgba(5, 10, 15, 0.75)',
                padding: '4px 14px',
                borderRadius: 99,
                border: isFailedFlash ? '1px solid #EF4444' : '1px solid rgba(52, 211, 153, 0.4)',
              }}
            >
              {isFailedFlash ? '6 FAILED TRIALS' : 'LIRA R&D LAB // BATCH #09'}
            </div>
            <div
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 34,
                fontWeight: 900,
                color: '#FFFFFF',
                letterSpacing: '0.02em',
                textAlign: 'center',
                lineHeight: 1.15,
              }}
            >
              FORMULA <span style={{ color: '#39FF88', textShadow: '0 0 20px rgba(57,255,136,0.6)' }}>MATCHA OATSIDE</span> 24K
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* SCENE 2: THE PLANT MILK CURDLE & ODOR STRUGGLE (140 - 320) */}
      {isScene2 && (
        <AbsoluteFill
          style={{
            transform: `scale(${1 + breathe}) translateX(${s2PanX}px)`,
          }}
        >
          {/* Split view showing separated watery testing & Caleb analyzing */}
          <Img
            src={staticFile('assets/pixel/story_cup_water_damage.jpg')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Minimalist Editorial Floating Warning Flags */}
          <div
            style={{
              position: 'absolute',
              top: 80,
              left: 50,
              right: 50,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 800,
            }}
          >
            <div
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 15,
                fontWeight: 800,
                color: '#F87171',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                padding: '6px 16px',
                borderRadius: 99,
                border: '1px solid rgba(248, 113, 113, 0.5)',
                marginBottom: 8,
              }}
            >
              PLANT MILK ELIMINATION LOG
            </div>
          </div>

          {/* Pinned Real-World Failure Cards */}
          {frame >= 180 && (
            <div
              style={{
                position: 'absolute',
                top: 220,
                left: 55,
                backgroundColor: 'rgba(15, 23, 42, 0.92)',
                borderLeft: '4px solid #EF4444',
                borderRadius: 8,
                padding: '10px 16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.85)',
                zIndex: 820,
              }}
            >
              <div style={{ fontSize: 13, color: '#94A3B8', fontWeight: 700 }}>ALMOND MILK TRIAL</div>
              <div style={{ fontSize: 18, color: '#F87171', fontWeight: 900 }}>{'\u2716'} MISAH / WATER SEPARATED</div>
            </div>
          )}

          {frame >= 250 && (
            <div
              style={{
                position: 'absolute',
                top: 320,
                right: 55,
                backgroundColor: 'rgba(15, 23, 42, 0.92)',
                borderLeft: '4px solid #F59E0B',
                borderRadius: 8,
                padding: '10px 16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.85)',
                zIndex: 820,
              }}
            >
              <div style={{ fontSize: 13, color: '#94A3B8', fontWeight: 700 }}>SOY MILK TRIAL</div>
              <div style={{ fontSize: 18, color: '#FCD34D', fontWeight: 900 }}>{'\u2716'} CHALKY / OVERPOWERS AROMA</div>
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* SCENE 3: THE GOLDEN PAIRING (320 - 518) */}
      {isScene3 && (
        <AbsoluteFill style={{ transform: `scale(${s3Zoom})` }}>
          <Img
            src={staticFile('assets/pixel/caleb_pouring_matcha.jpg')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Seamless Gold Flash transition on entry */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: '#34D399',
              opacity: flashAt320,
              pointerEvents: 'none',
              zIndex: 900,
            }}
          />

          {/* Minimalist Editorial Recipe Header */}
          <div
            style={{
              position: 'absolute',
              top: 75,
              left: 50,
              right: 50,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textShadow: '0 4px 18px rgba(0,0,0,0.95)',
              zIndex: 800,
            }}
          >
            <div
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 15,
                fontWeight: 800,
                color: '#FCD34D',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                backgroundColor: 'rgba(15, 23, 42, 0.82)',
                padding: '5px 16px',
                borderRadius: 99,
                border: '1px solid rgba(252, 211, 77, 0.5)',
                marginBottom: 8,
              }}
            >
              THE GOLDEN PAIRING DISCOVERY
            </div>
            <div
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 32,
                fontWeight: 900,
                color: '#FFFFFF',
                textAlign: 'center',
                lineHeight: 1.2,
              }}
            >
              OATSIDE BARISTA <span style={{ color: '#FCD34D' }}>+</span> PURE JAPANESE MATCHA
            </div>
          </div>

          {/* Tactile Recipe Spec Tag (Grounding in Notebook SSOT) */}
          <div
            style={{
              position: 'absolute',
              bottom: 120,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(7, 10, 15, 0.88)',
              border: '1.5px solid rgba(52, 211, 153, 0.5)',
              borderRadius: 16,
              padding: '12px 28px',
              display: 'flex',
              gap: 24,
              boxShadow: '0 15px 40px rgba(0,0,0,0.95)',
              zIndex: 800,
            }}
          >
            <div>
              <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 800, letterSpacing: '0.08em' }}>MATCHA CONCENTRATE</div>
              <div style={{ fontSize: 20, color: '#34D399', fontWeight: 900 }}>3g Pure Uji + 45ml</div>
            </div>
            <div style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.15)' }} />
            <div>
              <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 800, letterSpacing: '0.08em' }}>BARISTA OAT BASE</div>
              <div style={{ fontSize: 20, color: '#FCD34D', fontWeight: 900 }}>180ml Oatside</div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* SCENE 4: BLENDER EMULSIFICATION & STEVIA DROPPER MACRO (518 - 676) */}
      {isScene4 && (
        <AbsoluteFill
          style={{
            transform: `scale(${1 + breathe}) translate(${blenderShake}px, ${blenderShake * 0.5}px)`,
          }}
        >
          {/* Cut 1 (518 - 608): High Speed Blender Kitchen */}
          {isBlenderPhase && (
            <Img
              src={staticFile('assets/pixel/caleb_blender_kitchen.jpg')}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}

          {/* Cut 2 (608 - 676): Extreme Macro Stevia Dropper */}
          {isDropperPhase && (
            <AbsoluteFill>
              <Img
                src={staticFile('assets/pixel/stevia_dropper_macro.jpg')}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Animated Falling Crystal Stevia Droplet */}
              <div
                style={{
                  position: 'absolute',
                  top: '46%',
                  left: '50%',
                  width: 14,
                  height: 20,
                  backgroundColor: '#FFFFFF',
                  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                  boxShadow: '0 0 16px rgba(255,255,255,0.95), 0 0 30px rgba(52,211,153,0.8)',
                  transform: `translate(-50%, ${dropletY}px)`,
                  opacity: dropletOpacity,
                  zIndex: 850,
                }}
              />
            </AbsoluteFill>
          )}

          {/* Minimalist Top Tag */}
          <div
            style={{
              position: 'absolute',
              top: 75,
              left: 50,
              right: 50,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textShadow: '0 4px 18px rgba(0,0,0,0.95)',
              zIndex: 800,
            }}
          >
            <div
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 15,
                fontWeight: 800,
                color: '#34D399',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                padding: '5px 16px',
                borderRadius: 99,
                border: '1px solid rgba(52, 211, 153, 0.5)',
                marginBottom: 8,
              }}
            >
              {isBlenderPhase ? 'HIGH-SPEED VORTEX EMULSIFICATION' : '100% PURE STEVIA EXTRACT'}
            </div>
            <div
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 32,
                fontWeight: 900,
                color: '#FFFFFF',
                textAlign: 'center',
                lineHeight: 1.2,
              }}
            >
              {isBlenderPhase ? (
                <>CREAMY GURIH NUTTY <span style={{ color: '#39FF88' }}>HALUS</span></>
              ) : (
                <>MANIS ALAMI <span style={{ color: '#34D399' }}>0g GULA PASIR</span></>
              )}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* SCENE 5: ZERO SUGAR PROOF -> REFRESHING SIP -> FOUNDER SMIRK CTA (676 - 827) */}
      {isScene5 && (
        <AbsoluteFill style={{ transform: `scale(${1 + breathe})` }}>
          {/* Dynamic 3-Part Climax */}
          {frame < 718 ? (
            /* Sub-beat A (676 - 718): Zero Sugar Science Chart */
            <Img
              src={staticFile('assets/pixel/stevia_vs_sugar_science.jpg')}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : frame < 765 ? (
            /* Sub-beat B (718 - 765): Caleb Refreshing Sip */
            <Img
              src={staticFile('assets/pixel/caleb_action_seq/f4_sip.jpg')}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            /* Sub-beat C (765 - 827): Caleb Lower Bottle & Confident Smirk */
            <Img
              src={staticFile('assets/pixel/caleb_action_seq/f5_smirk.jpg')}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}

          {/* Top Headline */}
          <div
            style={{
              position: 'absolute',
              top: 75,
              left: 50,
              right: 50,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textShadow: '0 4px 18px rgba(0,0,0,0.95)',
              zIndex: 800,
            }}
          >
            <div
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 15,
                fontWeight: 800,
                color: '#39FF88',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                padding: '5px 16px',
                borderRadius: 99,
                border: '1px solid rgba(57, 255, 136, 0.5)',
                marginBottom: 8,
              }}
            >
              {frame < 765 ? 'PREMIUM FOCUS FUEL' : 'DIRECT-TO-CONSUMER DROP'}
            </div>
            <div
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 32,
                fontWeight: 900,
                color: '#FFFFFF',
                textAlign: 'center',
              }}
            >
              {frame < 765 ? (
                <>SEGAR PREMIUM <span style={{ color: '#39FF88' }}>TANPA KOMPROMI</span></>
              ) : (
                <>LIMITED BATCH <span style={{ color: '#FFE566' }}>24K</span></>
              )}
            </div>
          </div>

          {/* High-Converting Bottom CTA Badge at Final Climax */}
          {frame >= 765 && (
            <div
              style={{
                position: 'absolute',
                bottom: 110,
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(7, 10, 15, 0.92)',
                border: '2px solid #39FF88',
                borderRadius: 20,
                padding: '14px 28px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 20px 50px rgba(0,0,0,0.95), 0 0 30px rgba(57,255,136,0.25)',
                zIndex: 850,
              }}
            >
              <div
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: 22,
                  fontWeight: 900,
                  color: '#39FF88',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                CEK LINK DI BIO SEKARANG
              </div>
              <div
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#94A3B8',
                  letterSpacing: '0.06em',
                  marginTop: 4,
                  textTransform: 'uppercase',
                }}
              >
                @DRINKLIRA • COLD-PRESSED & SEALED IN 250ML ALMOND
              </div>
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* ============================================================== */}
      {/* 3. DYNAMIC TIKTOK-STYLE CAPTIONS (EYE-LEVEL READABILITY)       */}
      {/* ============================================================== */}
      <TikTokCaption
        currentFrame={frame}
        chunks={captionsData}
        topPercentage={58}
        fontSize={62}
        highlightColor="#FFE566"
      />
    </AbsoluteFill>
  );
};
