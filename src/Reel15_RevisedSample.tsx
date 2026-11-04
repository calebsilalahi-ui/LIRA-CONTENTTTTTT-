import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import { ContinuousCamera } from './components/ContinuousCamera';

// 900 frames @ 30fps = 30.0s (strictly within 22s–35s canonical duration)
export const REEL_15_DURATION = 900;

export const Reel15_RevisedSample: React.FC = () => {
  const frame = useCurrentFrame();

  // Loop Splice: smoothly blend final 20 frames back to Frame 0 pose for seamless infinite loop
  const loopTransition = interpolate(frame, [REEL_15_DURATION - 20, REEL_15_DURATION], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Scene Boundaries (30fps):
  // Scene 1 (0 - 210f / 0.0s - 7.0s): Somatic Reality Check (Caleb at desk with Pixel Bottle Inspect -> Active Shake -> Sip)
  // Scene 2 (210 - 420f / 7.0s - 14.0s): 180° Inverted Bottle Leakproof Proof over MacBook (Active Shaking)
  // Scene 3 (420 - 660f / 14.0s - 22.0s): 03:30 AM Artisan Kitchen Cold Extraction (Vortex blend + Stevia Dropper)
  // Scene 4 (660 - 900f / 22.0s - 30.0s): Dark Forest Green Cooler Bag Packing + Saturday Gojek Dispatch

  // Dynamic Scene Index
  const isScene1 = frame < 210;
  const isScene2 = frame >= 210 && frame < 420;
  const isScene3 = frame >= 420 && frame < 660;
  const isScene4 = frame >= 660;

  // Scene transition progress (clean cut with quick 6-frame crossfade)
  const scene2Progress = interpolate(frame, [210, 216], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scene3Progress = interpolate(frame, [420, 426], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scene4Progress = interpolate(frame, [660, 666], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // -------------------------------------------------------------------------
  // Pixel Animation Frame Selectors (Google Flow / High-Tempo Retro Animation)
  // -------------------------------------------------------------------------

  // Scene 1: Caleb Action Sequence
  // 0 - 60: Inspect bottle (f1)
  // 60 - 150: Active vigorous shake (f1 <-> f2 every 5 frames)
  // 150 - 180: Uncap gold cap (f3)
  // 180 - 210: Take a sip (f4)
  const getScene1Asset = () => {
    if (frame < 60) return 'assets/pixel/caleb_action_seq/f1_inspect.jpg';
    if (frame < 150) {
      const toggle = Math.floor((frame - 60) / 5) % 2;
      return toggle === 0 ? 'assets/pixel/caleb_action_seq/f1_inspect.jpg' : 'assets/pixel/caleb_action_seq/f2_shake.jpg';
    }
    if (frame < 180) return 'assets/pixel/caleb_action_seq/f3_uncap.jpg';
    return 'assets/pixel/caleb_action_seq/f4_sip.jpg';
  };

  // Scene 2: 180° Inverted Bottle Leakproof Proof
  // 210 - 250: Steady inverted over MacBook (s3_a)
  // 250 - 380: Active shaking with vibration lines (s3_a <-> s3_b every 6 frames)
  // 380 - 420: Steady lock-in (s3_a)
  const getScene2Asset = () => {
    if (frame >= 250 && frame < 380) {
      const toggle = Math.floor((frame - 250) / 6) % 2;
      return toggle === 0 ? 'assets/pixel/cup_struggle/s3_inverted_a.jpg' : 'assets/pixel/cup_struggle/s3_inverted_b.jpg';
    }
    return 'assets/pixel/cup_struggle/s3_inverted_a.jpg';
  };

  // Scene 3: 03:30 AM Artisan Kitchen Vortex & Stevia Dropper Macro
  // 420 - 540: Kitchen blender vortex (caleb_blender_kitchen)
  // 540 - 660: Pure Stevia dropper macro over emerald swirl (stevia_dropper_macro)
  const getScene3Asset = () => {
    if (frame < 540) return 'assets/pixel/caleb_blender_kitchen.jpg';
    return 'assets/pixel/stevia_dropper_macro.jpg';
  };

  // Scene 4: Dark Forest Green Cooler Bag Packing & Gojek Thumbs-Up
  // 660 - 780: Packing cold bottles into Dark Green Cooler Bag (s3_a <-> s3_b)
  // 780 - 900: Gojek driver dispatch (s4_green_a <-> s4_green_b)
  const getScene4Asset = () => {
    if (frame < 780) {
      const toggle = Math.floor((frame - 660) / 10) % 2;
      return toggle === 0 ? 'assets/pixel/tutorial/s3_cooler_bag_pack_a.jpg' : 'assets/pixel/tutorial/s3_cooler_bag_pack_b.jpg';
    }
    const toggle = Math.floor((frame - 780) / 12) % 2;
    return toggle === 0 ? 'assets/pixel/tutorial/s4_gojek_green_a.jpg' : 'assets/pixel/tutorial/s4_gojek_green_b.jpg';
  };

  return (
    <AbsoluteFill style={{ backgroundColor: '#0B0F0E', overflow: 'hidden' }}>
      {/* ========================================================
          AUDIO MIX (Without VO: Royalty-Free Lo-Fi + Tactile SFX)
          ======================================================== */}
      {/* 1. Ambient Background Track (Chill lo-fi lounge) */}
      <Audio
        src={staticFile('assets/bg_music.mp3')}
        volume={(f) => {
          if (f < 15) return interpolate(f, [0, 15], [0, 0.75]);
          if (f > REEL_15_DURATION - 20) return interpolate(f, [REEL_15_DURATION - 20, REEL_15_DURATION], [0.75, 0.4]);
          return 0.75;
        }}
      />

      {/* 2. Tactile Frame-0 Sub-Hit / Thud */}
      <Sequence from={0} durationInFrames={35}>
        <Audio src={staticFile('assets/sfx/sub_hit.mp3')} volume={0.85} />
      </Sequence>
      <Sequence from={0} durationInFrames={20}>
        <Audio src={staticFile('assets/sfx/snap.mp3')} volume={0.6} />
      </Sequence>

      {/* Shake Foley in Scene 1 */}
      <Sequence from={60} durationInFrames={30}>
        <Audio src={staticFile('assets/sfx/eightbit_portal_shimmer.wav')} volume={0.4} />
      </Sequence>
      <Sequence from={150} durationInFrames={20}>
        <Audio src={staticFile('assets/sfx/snap.mp3')} volume={0.65} />
      </Sequence>

      {/* 3. Scene 2 Transition: Inversion Whoosh + Solid Tap */}
      <Sequence from={210} durationInFrames={30}>
        <Audio src={staticFile('assets/sfx/whoosh.mp3')} volume={0.7} />
      </Sequence>
      <Sequence from={220} durationInFrames={25}>
        <Audio src={staticFile('assets/sfx/thud.mp3')} volume={0.65} />
      </Sequence>

      {/* 4. Scene 3 Transition: Eight-bit Shimmer & Pop */}
      <Sequence from={420} durationInFrames={30}>
        <Audio src={staticFile('assets/sfx/eightbit_portal_shimmer.wav')} volume={0.5} />
      </Sequence>
      <Sequence from={430} durationInFrames={20}>
        <Audio src={staticFile('assets/sfx/eightbit_pop.wav')} volume={0.6} />
      </Sequence>
      <Sequence from={540} durationInFrames={20}>
        <Audio src={staticFile('assets/sfx/snap.mp3')} volume={0.55} />
      </Sequence>

      {/* 5. Scene 4 Transition: Impact & Dispatch */}
      <Sequence from={660} durationInFrames={30}>
        <Audio src={staticFile('assets/sfx/impact.mp3')} volume={0.6} />
      </Sequence>
      <Sequence from={780} durationInFrames={25}>
        <Audio src={staticFile('assets/sfx/snap.mp3')} volume={0.6} />
      </Sequence>

      {/* ========================================================
          VISUAL CAMERA RIG (Ground Camera - strictly scale 1.0, NO ZOOM OUT)
          ======================================================== */}
      <ContinuousCamera enablePan={true} enableBreathing={false}>
        {/* Background Layer: Ambient Studio Depth */}
        <AbsoluteFill>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: '#090D0C',
              background: 'radial-gradient(circle at 50% 45%, #13241C 0%, #080D0B 100%)',
            }}
          />
        </AbsoluteFill>

        {/* ----------------------------------------------------
            SCENE 1: Frame-0 Somatic Hook (0 - 210f / 0.0s - 7.0s)
            100% Pure Pixel Art: Caleb Action Sequence
            ---------------------------------------------------- */}
        {isScene1 && (
          <AbsoluteFill style={{ opacity: 1 - interpolate(frame, [204, 210], [0, 1], { extrapolateRight: 'clamp' }) }}>
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '52%',
                transform: 'translate(-50%, -50%)',
                width: 780,
                height: 720,
                borderRadius: 24,
                overflow: 'hidden',
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.85)',
                border: '2px solid rgba(212, 175, 55, 0.4)',
                zIndex: 15,
              }}
            >
              <Img
                src={staticFile(getScene1Asset())}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />

              {/* Pixel Badge Indicator */}
              <div
                style={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  backgroundColor: 'rgba(11, 15, 14, 0.85)',
                  border: '1px solid rgba(212, 175, 55, 0.6)',
                  color: '#FFE566',
                  padding: '6px 14px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                }}
              >
                {frame < 60 ? 'INSPECT' : frame < 150 ? 'SHAKE' : frame < 180 ? 'UNCAP' : 'SIP'}
              </div>
            </div>
          </AbsoluteFill>
        )}

        {/* ----------------------------------------------------
            SCENE 2: 180° Inverted Bottle Leakproof Proof (210 - 420f)
            100% Pure Pixel Art: Inverted Bottle Shaking over MacBook
            ---------------------------------------------------- */}
        {isScene2 && (
          <AbsoluteFill
            style={{
              opacity: scene2Progress * (1 - interpolate(frame, [414, 420], [0, 1], { extrapolateRight: 'clamp' })),
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '52%',
                transform: 'translate(-50%, -50%)',
                width: 780,
                height: 720,
                borderRadius: 24,
                overflow: 'hidden',
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.85)',
                border: '2px solid rgba(57, 255, 136, 0.4)',
                zIndex: 15,
              }}
            >
              <Img
                src={staticFile(getScene2Asset())}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />

              {/* Status Indicator Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  backgroundColor: 'rgba(11, 15, 14, 0.85)',
                  border: '1px solid #39FF88',
                  color: '#39FF88',
                  padding: '6px 14px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                }}
              >
                {frame >= 250 && frame < 380 ? 'ACTIVE SHAKE' : '180° INVERTED'}
              </div>
            </div>
          </AbsoluteFill>
        )}

        {/* ----------------------------------------------------
            SCENE 3: 03:30 AM Artisan Kitchen Cold Vortex (420 - 660f)
            100% Pure Pixel Art: Kitchen Blender Vortex + Stevia Dropper
            ---------------------------------------------------- */}
        {isScene3 && (
          <AbsoluteFill
            style={{
              opacity: scene3Progress * (1 - interpolate(frame, [654, 660], [0, 1], { extrapolateRight: 'clamp' })),
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '52%',
                transform: 'translate(-50%, -50%)',
                width: 780,
                height: 720,
                borderRadius: 24,
                overflow: 'hidden',
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.85)',
                border: '2px solid rgba(212, 175, 55, 0.4)',
                zIndex: 15,
              }}
            >
              <Img
                src={staticFile(getScene3Asset())}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />

              {/* Status Indicator Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  backgroundColor: 'rgba(11, 15, 14, 0.85)',
                  border: '1px solid #FFE566',
                  color: '#FFE566',
                  padding: '6px 14px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                }}
              >
                {frame < 540 ? '03:30 AM VORTEX' : 'PURE STEVIA EXTRACT'}
              </div>
            </div>
          </AbsoluteFill>
        )}

        {/* ----------------------------------------------------
            SCENE 4: Dark Forest Green Cooler Bag & Gojek Loop (660 - 900f)
            100% Pure Pixel Art: Thermal Foil Packing -> Gojek Thumbs-Up
            ---------------------------------------------------- */}
        {isScene4 && (
          <AbsoluteFill
            style={{
              opacity: scene4Progress * (1 - loopTransition),
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '52%',
                transform: 'translate(-50%, -50%)',
                width: 780,
                height: 720,
                borderRadius: 24,
                overflow: 'hidden',
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.85)',
                border: '2px solid rgba(57, 255, 136, 0.4)',
                zIndex: 15,
              }}
            >
              <Img
                src={staticFile(getScene4Asset())}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />

              {/* Cold Temperature Indicator Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  backgroundColor: 'rgba(11, 15, 14, 0.85)',
                  border: '1px solid #FFE566',
                  color: '#FFE566',
                  padding: '6px 14px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                }}
              >
                {frame < 780 ? 'SUHU 2-4°C TERKUNCI' : 'SATURDAY GOJEK LOOP'}
              </div>
            </div>
          </AbsoluteFill>
        )}
      </ContinuousCamera>

      {/* ========================================================
          OVERLAY TIER 1: UPPER SAFE BOX (y: 288 - 420px)
          Single borderless headline with 1 Electric Gold accent
          ======================================================== */}
      <div
        style={{
          position: 'absolute',
          top: 300,
          left: 84,
          right: 192, // Clear of Instagram right action rail (888px boundary)
          zIndex: 30,
        }}
      >
        {/* Scene 1 Headline */}
        {isScene1 && (
          <div>
            <div
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "Montserrat", sans-serif',
                fontSize: 14,
                fontWeight: 800,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#D4AF37',
                marginBottom: 8,
              }}
            >
              SOMATIC BODY CHECK
            </div>
            <h1
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "Montserrat", sans-serif',
                fontSize: 52,
                fontWeight: 900,
                lineHeight: 1.08,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                margin: 0,
                textShadow: '0 4px 16px rgba(0, 0, 0, 0.95), -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000',
              }}
            >
              KENAPA JAM 2 SIANG LO <span style={{ color: '#FFE566' }}>LEMES</span>?
            </h1>
          </div>
        )}

        {/* Scene 2 Headline */}
        {isScene2 && (
          <div>
            <div
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "Montserrat", sans-serif',
                fontSize: 14,
                fontWeight: 800,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#39FF88',
                marginBottom: 8,
              }}
            >
              TACTILE LEAKPROOF PROOF
            </div>
            <h1
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "Montserrat", sans-serif',
                fontSize: 50,
                fontWeight: 900,
                lineHeight: 1.08,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                margin: 0,
                textShadow: '0 4px 16px rgba(0, 0, 0, 0.95), -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000',
              }}
            >
              TES <span style={{ color: '#FFE566' }}>180 DERAJAT</span> DI ATAS MACBOOK
            </h1>
          </div>
        )}

        {/* Scene 3 Headline */}
        {isScene3 && (
          <div>
            <div
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "Montserrat", sans-serif',
                fontSize: 14,
                fontWeight: 800,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#D4AF37',
                marginBottom: 8,
              }}
            >
              100% PURE JAPANESE GREEN TEA
            </div>
            <h1
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "Montserrat", sans-serif',
                fontSize: 50,
                fontWeight: 900,
                lineHeight: 1.08,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                margin: 0,
                textShadow: '0 4px 16px rgba(0, 0, 0, 0.95), -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000',
              }}
            >
              <span style={{ color: '#FFE566' }}>03:30 AM</span> SOLO KITCHEN CRAFT
            </h1>
          </div>
        )}

        {/* Scene 4 Headline */}
        {isScene4 && (
          <div>
            <div
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "Montserrat", sans-serif',
                fontSize: 14,
                fontWeight: 800,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#39FF88',
                marginBottom: 8,
              }}
            >
              SATURDAY GOJEK DISPATCH
            </div>
            <h1
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "Montserrat", sans-serif',
                fontSize: 50,
                fontWeight: 900,
                lineHeight: 1.08,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                margin: 0,
                textShadow: '0 4px 16px rgba(0, 0, 0, 0.95), -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000',
              }}
            >
              <span style={{ color: '#FFE566' }}>LIMITED BATCH</span> MINGGU INI
            </h1>
          </div>
        )}
      </div>

      {/* ========================================================
          OVERLAY TIER 3: LOWER SAFE BOX (y: 1140 - 1240px)
          Kinetic word prompts inside Instagram safe box
          ======================================================== */}
      <div
        style={{
          position: 'absolute',
          top: 1140,
          left: 84,
          right: 192,
          display: 'flex',
          justifyContent: 'center',
          zIndex: 30,
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(14, 40, 30, 0.94)',
            backdropFilter: 'blur(8px)',
            border: '1.5px solid rgba(212, 175, 55, 0.4)',
            borderRadius: 14,
            padding: '16px 28px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
            textAlign: 'center',
          }}
        >
          {isScene1 && (
            <div
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "Montserrat", sans-serif',
                fontSize: 22,
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '0.04em',
              }}
            >
              35g Gula Kafe vs <span style={{ color: '#FFE566' }}>0g Stevia Lira</span>
            </div>
          )}

          {isScene2 && (
            <div
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "Montserrat", sans-serif',
                fontSize: 22,
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '0.04em',
              }}
            >
              <span style={{ color: '#39FF88' }}>Nol Bocor.</span> Aman Bareng Laptop di Tas.
            </div>
          )}

          {isScene3 && (
            <div
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "Montserrat", sans-serif',
                fontSize: 22,
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '0.04em',
              }}
            >
              Pure Japanese Matcha + <span style={{ color: '#FFE566' }}>Oatside Oat Milk</span>
            </div>
          )}

          {isScene4 && (
            <div
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "Montserrat", sans-serif',
                fontSize: 22,
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '0.04em',
              }}
            >
              Slot Terbatas • Amankan di <span style={{ color: '#FFE566' }}>Bio @drinklira</span>
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
