import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadPressStart } from '@remotion/google-fonts/PressStart2P';
import { SafeBox } from './components/SafeBox';
import { ContinuousCamera } from './components/ContinuousCamera';
import { DecoupledCaptions, CaptionChunk } from './components/DecoupledCaptions';

loadMontserrat();
loadPressStart();

// 914 frames @ 30fps = 30.47s (strictly within 22s–35s duration window)
export const REEL_14_DURATION = 914;

export interface Reel14Props {
  headline?: string;
  accentWord?: string;
  captions?: CaptionChunk[];
  audioSrc?: string;
}

export const Reel14_ViralEngine: React.FC<Reel14Props> = ({
  headline = 'KENAPA MATCHA 50K BIKIN CRASH',
  accentWord = 'CRASH',
  captions = [],
  audioSrc = staticFile('assets/sample_reel_audio.mp3'),
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Load captions fallback if empty
  const activeCaptions: CaptionChunk[] = captions && captions.length > 0
    ? captions
    : require('./sample_reel_captions.json');

  // Loop Splice: smoothly blend final 20 frames back to Frame 0 pose for seamless visual loop
  const loopTransition = interpolate(frame, [REEL_14_DURATION - 25, REEL_14_DURATION], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Scene timing transitions
  // Scene 1: 0 - 220f (0.0s - 7.3s) - Somatic Hook & Cafe Crash
  // Scene 2: 220 - 450f (7.3s - 15.0s) - Pure Japanese Matcha & Stevia Science (3 SSOT bottles)
  // Scene 3: 450 - 680f (15.0s - 22.6s) - 180° Sealed PET & Forest Green Cooler Bag
  // Scene 4: 680 - 914f (22.6s - 30.48s) - Limited Batch Callout & Seamless Loop

  return (
    <AbsoluteFill style={{ backgroundColor: '#0B0F0E', overflow: 'hidden' }}>
      {/* 1. Continuous Motion Rig Camera Wrapper (Unclamped drift in 0.0s-3.0s and throughout) */}
      <ContinuousCamera enablePan={true} enableBreathing={true}>
        {/* Background Layer: Authentic Retro Pixel Environment */}
        <AbsoluteFill>
          <Img
            src={staticFile('assets/pixel/scene_2_kitchen.jpg')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.68) contrast(1.1)',
            }}
          />
          {/* Subtle warm artisanal vignette */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 35%, rgba(11,15,14,0.75) 100%)',
            }}
          />
        </AbsoluteFill>

        {/* Scene 1: Frame-0 Hook & Product Physical Proof (0 to 230f) */}
        {frame < 230 && (
          <AbsoluteFill>
            {/* Dewy SSOT Matcha Bottle with realistic floating physics */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '52%',
                transform: `translate(-50%, -50%) translateY(${Math.sin((frame / 30) * Math.PI) * 12}px) rotate(${Math.sin((frame / 45) * Math.PI) * 2.5}deg)`,
                zIndex: 15,
                filter: 'drop-shadow(0 20px 35px rgba(0,0,0,0.8))',
              }}
            >
              <Img
                src={staticFile('assets/bottles_ssot/matcha_ssot.png')}
                style={{
                  height: 620,
                  width: 'auto',
                }}
              />
            </div>

            {/* Pixelated Caleb Avatar in bottom left */}
            <div
              style={{
                position: 'absolute',
                left: 100,
                bottom: 220,
                transform: `translateY(${Math.sin((frame / 45) * Math.PI) * 1.8}px)`,
                zIndex: 20,
                filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.8))',
              }}
            >
              <Img
                src={staticFile('assets/pixel/character/caleb_holding_lira.png')}
                style={{
                  height: 380,
                  width: 'auto',
                }}
              />
            </div>
          </AbsoluteFill>
        )}

        {/* Scene 2: 3 SSOT Bottles Alignment (Frames 220 to 460) */}
        {frame >= 220 && frame < 460 && (
          <AbsoluteFill>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 40,
                transform: `translateY(${Math.sin((frame / 35) * Math.PI) * 8}px)`,
                zIndex: 16,
              }}
            >
              {/* Choco Hazelnut SSOT */}
              <div style={{ transform: 'scale(0.88) translateY(20px)', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.85))' }}>
                <Img src={staticFile('assets/bottles_ssot/choco_ssot.png')} style={{ height: 520 }} />
              </div>
              {/* Matcha Oatside SSOT (hero center) */}
              <div style={{ transform: 'scale(1.05)', filter: 'drop-shadow(0 25px 40px rgba(0,0,0,0.9))' }}>
                <Img src={staticFile('assets/bottles_ssot/matcha_ssot.png')} style={{ height: 560 }} />
              </div>
              {/* Signature Milk Tea SSOT */}
              <div style={{ transform: 'scale(0.88) translateY(20px)', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.85))' }}>
                <Img src={staticFile('assets/bottles_ssot/milktea_ssot.png')} style={{ height: 520 }} />
              </div>
            </div>
          </AbsoluteFill>
        )}

        {/* Scene 3: Thermal Cooler Bag SOP & 180° Anti-Leak (Frames 450 to 690) */}
        {frame >= 450 && frame < 690 && (
          <AbsoluteFill>
            {/* Authentic Forest Green Cooler Bag */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) translateY(${Math.sin((frame / 40) * Math.PI) * 6}px)`,
                zIndex: 16,
                filter: 'drop-shadow(0 25px 40px rgba(0,0,0,0.9))',
              }}
            >
              <Img
                src={staticFile('assets/pixel/tutorial/cooler_bag_cutout.png')}
                style={{
                  height: 520,
                  width: 'auto',
                }}
              />
            </div>
            {/* Sealed Bottle Inverted 180° Demo overlay */}
            <div
              style={{
                position: 'absolute',
                right: 140,
                top: '46%',
                transform: `rotate(180deg) translateY(${Math.sin((frame / 25) * Math.PI) * 8}px)`,
                zIndex: 18,
                filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.85))',
              }}
            >
              <Img
                src={staticFile('assets/bottles_ssot/matcha_ssot.png')}
                style={{ height: 380 }}
              />
            </div>
          </AbsoluteFill>
        )}

        {/* Scene 4: Scarcity Callout & Seamless Loop Splice back to Frame 0 (Frames 680 to 914) */}
        {frame >= 680 && (
          <AbsoluteFill>
            {/* Caleb presenting Lira for weekend drop */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '53%',
                transform: `translate(-50%, -50%) scale(${1 - loopTransition * 0.05}) translateY(${Math.sin((frame / 40) * Math.PI) * 10}px)`,
                zIndex: 17,
                filter: 'drop-shadow(0 25px 40px rgba(0,0,0,0.9))',
              }}
            >
              <Img
                src={staticFile('assets/bottles_ssot/matcha_ssot.png')}
                style={{ height: 600 }}
              />
            </div>

            {/* Qualitative Scarcity Badge */}
            <div
              style={{
                position: 'absolute',
                top: '74%',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(29, 74, 56, 0.95)',
                padding: '14px 28px',
                borderRadius: 999,
                border: '1.5px solid #39FF88',
                boxShadow: '0 8px 24px rgba(0,0,0,0.8)',
                zIndex: 35,
              }}
            >
              <span
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 900,
                  fontSize: 24,
                  color: '#FFE566',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                LIMITED BATCH READY SABTU
              </span>
            </div>
          </AbsoluteFill>
        )}
      </ContinuousCamera>

      {/* 2. Universal Safe Box Container (x:[84,888], y:[288,1248]) */}
      <SafeBox>
        {/* Saccadic Decoupled Captions & Headline */}
        <DecoupledCaptions
          headline={headline}
          accentWord={accentWord}
          chunks={activeCaptions}
          suppressUntilFrame={40} // Delayed until 1.33s (>= 1.30s)
          headlineDurationFrames={90} // Headline stays during 0.0s-3.0s hook
        />
      </SafeBox>

      {/* 3. Audio Track (Master mix with -14 LUFS, ducked royalty-free BGM, onset <= 0.02s) */}
      <Audio src={audioSrc} />
    </AbsoluteFill>
  );
};
