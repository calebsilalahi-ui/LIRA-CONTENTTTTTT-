import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  Easing,
} from 'remotion';
import { TikTokCaption } from './TikTokCaption';
import captionsData from './reel_new_10_friday_night_brewing_captions.json';

export const REEL_10_DURATION = 832; // 27.73s @ 30fps (<30s)

export const Reel10_FridayNightBrewing: React.FC = () => {
  const frame = useCurrentFrame();
  const qFrame = Math.floor(frame / 3) * 3;

  const isScene1 = frame < 140;
  const isScene2 = frame >= 140 && frame < 325;
  const isScene3 = frame >= 325 && frame < 525;
  const isScene4 = frame >= 525 && frame < 685;
  const isScene5 = frame >= 685;

  const hookZoom = interpolate(frame, [0, 20], [1.12, 1.0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const breathe = Math.sin((qFrame / 40) * Math.PI) * 0.015;

  return (
    <AbsoluteFill style={{ backgroundColor: '#070A0F', overflow: 'hidden' }}>
      {/* AUDIO ENGINE */}
      <Audio src={staticFile('assets/reel_new_10_friday_night_brewing.mp3')} volume={1.0} />
      <Audio
        src={staticFile('assets/bg_music.mp3')}
        volume={(f) =>
          interpolate(f, [0, 30, 780, 832], [0.06, 0.13, 0.13, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
        }
      />

      {/* SCENE 1: HOOK (10 PM Kitchen Lights On) */}
      {isScene1 && (
        <AbsoluteFill style={{ transform: `scale(${hookZoom})` }}>
          <Img
            src={staticFile('assets/pixel/insider_caleb_desk_a.jpg')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          <div
            style={{
              position: 'absolute',
              top: 70,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 860,
              backgroundColor: '#0F172A',
              border: '2.5px solid #FCD34D',
              borderRadius: 20,
              padding: '16px 24px',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.95)',
              zIndex: 850,
            }}
          >
            <div
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 27,
                fontWeight: 900,
                color: '#FCD34D',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                lineHeight: 1.3,
              }}
            >
              JAM 22:00: DIBALIK LAYAR BATCH SABTU LIRA
            </div>
            <div
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 16,
                fontWeight: 700,
                color: '#94A3B8',
                letterSpacing: '0.08em',
                marginTop: 6,
                textTransform: 'uppercase',
              }}
            >
              KOMITMEN ARTISAN • DIBIKIN FRESH JUMAT MALAM
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* SCENE 2: PRECISION WEIGHING */}
      {isScene2 && (
        <AbsoluteFill style={{ transform: `scale(${1 + breathe})` }}>
          <Img
            src={staticFile('assets/pixel/scene_2_kitchen.jpg')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              top: 75,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 840,
              backgroundColor: '#0F172A',
              border: '2px solid #34D399',
              borderRadius: 18,
              padding: '14px 22px',
              textAlign: 'center',
              boxShadow: '0 15px 40px rgba(0,0,0,0.9)',
              zIndex: 850,
            }}
          >
            <div
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 23,
                fontWeight: 900,
                color: '#34D399',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              PURE JAPANESE MATCHA • TIMBANG DIGITAL PRESISI PER BOTOL
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* SCENE 3: BLENDER EFFICIENCY & STEVIA */}
      {isScene3 && (
        <AbsoluteFill style={{ transform: `scale(${1 + breathe})` }}>
          <Img
            src={staticFile('assets/pixel/caleb_blender_kitchen.jpg')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              top: 75,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 840,
              backgroundColor: '#0F172A',
              border: '2px solid #39FF88',
              borderRadius: 18,
              padding: '14px 22px',
              textAlign: 'center',
              boxShadow: '0 15px 40px rgba(0,0,0,0.9)',
              zIndex: 850,
            }}
          >
            <div
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 24,
                fontWeight: 900,
                color: '#39FF88',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              BLENDER HIGH SPEED • MIKRO EMULSI + STEVIA DROPS ALAMI
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* SCENE 4: ROWS OF FRESH BOTTLES & PRICING */}
      {isScene4 && (
        <AbsoluteFill style={{ transform: `scale(${1 + breathe})` }}>
          <Img
            src={staticFile('assets/pixel/s5_batch_a.jpg')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          <div
            style={{
              position: 'absolute',
              top: 70,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 880,
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              border: '2px solid #39FF88',
              borderRadius: 20,
              padding: '16px 20px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.95)',
              zIndex: 850,
            }}
          >
            <div
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 22,
                fontWeight: 900,
                color: '#FFFFFF',
                textAlign: 'center',
                marginBottom: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              4 PILIHAN RASA ARTISAN LIRA
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ backgroundColor: '#1E293B', padding: '10px 14px', borderRadius: 12, borderLeft: '4px solid #FCD34D' }}>
                <div style={{ fontSize: 13, color: '#94A3B8', fontWeight: 700 }}>SIGNATURE BREW</div>
                <div style={{ fontSize: 19, color: '#FCD34D', fontWeight: 900 }}>MILK TEA</div>
              </div>
              <div style={{ backgroundColor: '#1E293B', padding: '10px 14px', borderRadius: 12, borderLeft: '4px solid #34D399' }}>
                <div style={{ fontSize: 13, color: '#94A3B8', fontWeight: 700 }}>PURE JAPANESE</div>
                <div style={{ fontSize: 19, color: '#34D399', fontWeight: 900 }}>MATCHA CLASSIC</div>
              </div>
              <div style={{ backgroundColor: '#1E293B', padding: '10px 14px', borderRadius: 12, borderLeft: '4px solid #F87171' }}>
                <div style={{ fontSize: 13, color: '#94A3B8', fontWeight: 700 }}>DARK ROASTED</div>
                <div style={{ fontSize: 19, color: '#F87171', fontWeight: 900 }}>CHOCO HAZELNUT</div>
              </div>
              <div style={{ backgroundColor: '#1E293B', padding: '10px 14px', borderRadius: 12, borderLeft: '4px solid #39FF88' }}>
                <div style={{ fontSize: 13, color: '#94A3B8', fontWeight: 700 }}>BARISTA OAT</div>
                <div style={{ fontSize: 19, color: '#39FF88', fontWeight: 900 }}>MATCHA OATSIDE</div>
              </div>
            </div>
            <div
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 13,
                fontWeight: 700,
                color: '#38BDF8',
                textAlign: 'center',
                marginTop: 10,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              100% STEVIA ALAMI • 0g GULA PASIR • LIMITED BATCH
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* SCENE 5: RUSHING DELIVERY & CTA */}
      {isScene5 && (
        <AbsoluteFill style={{ transform: `scale(${1 + breathe})` }}>
          <Img
            src={staticFile('assets/pixel/caleb_running_delivery.jpg')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          <div
            style={{
              position: 'absolute',
              top: 70,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 860,
              backgroundColor: '#0F172A',
              border: '2.5px solid #39FF88',
              borderRadius: 20,
              padding: '16px 24px',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.95)',
              zIndex: 850,
            }}
          >
            <div
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 27,
                fontWeight: 900,
                color: '#39FF88',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              KUOTA BATCH SANGAT TERBATAS!
            </div>
            <div
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 16,
                fontWeight: 700,
                color: '#FFFFFF',
                marginTop: 6,
                textTransform: 'uppercase',
              }}
            >
              AMANKAN JATAH PENGIRIMAN LO VIA LINK DI BIO
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* DYNAMIC TIKTOK SUBTITLES */}
      <TikTokCaption
        currentFrame={frame}
        chunks={captionsData}
        topPercentage={56}
        fontSize={62}
        highlightColor="#FFE566"
      />
    </AbsoluteFill>
  );
};
