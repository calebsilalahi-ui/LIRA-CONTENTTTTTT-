import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img,
  Audio,
  staticFile,
} from 'remotion';

export const Video1_TOFU_Poster: React.FC<{ useAllPosters?: boolean }> = ({ useAllPosters = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 7.5 fps frame quantization for authentic stop-motion texture
  const qFrame = Math.floor(frame / 4) * 4;

  // Global subtle handheld camera drift
  const camX = interpolate(qFrame % 20, [0, 10, 20], [-2, 2, -2]);
  const camY = interpolate(qFrame % 16, [0, 8, 16], [1, -2, 1]);

  const beat2Poster = 'assets/poster_hand.png'; // Choco Hazelnut Hand Poster
  const beat3Poster = useAllPosters ? 'assets/poster_milktea.png' : 'assets/poster_hand.png';
  const beat5Poster = useAllPosters ? 'assets/poster_matcha.png' : 'assets/poster_hand.png';
  const beat6Poster = useAllPosters ? 'assets/poster_sapa_split.png' : 'assets/poster_hand.png';
  const beat7Poster = useAllPosters ? 'assets/poster_milktea.png' : 'assets/poster_hand.png';
  const beat8Poster = useAllPosters ? 'assets/poster_sapa_split.png' : 'assets/poster_hand.png';

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#121110',
        fontFamily: 'Inter, sans-serif',
        overflow: 'hidden',
        transform: `translate(${camX}px, ${camY}px)`,
      }}
    >
      {/* ================= AUDIO ENGINE ================= */}
      {/* 1. Main ElevenLabs Voiceover */}
      <Audio src={staticFile('assets/voiceover_tofu.mp3')} volume={1.0} />

      {/* 2. Ducked Background Beat */}
      <Audio src={staticFile('assets/bg_music.mp3')} volume={0.18} />

      {/* 3. 3-Second Synchronized SFX Triggers */}
      <Sequence from={0} durationInFrames={90}>
        <Audio src={staticFile('assets/sfx/alarm.mp3')} volume={0.65} />
      </Sequence>
      <Sequence from={90} durationInFrames={90}>
        <Audio src={staticFile('assets/sfx/thud.mp3')} volume={0.75} />
      </Sequence>
      <Sequence from={180} durationInFrames={90}>
        <Audio src={staticFile('assets/sfx/shutter.mp3')} volume={0.7} />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <Audio src={staticFile('assets/sfx/scratch.mp3')} volume={0.6} />
      </Sequence>
      <Sequence from={360} durationInFrames={90}>
        <Audio src={staticFile('assets/sfx/snap.mp3')} volume={0.75} />
      </Sequence>
      <Sequence from={450} durationInFrames={90}>
        <Audio src={staticFile('assets/sfx/sub_hit.mp3')} volume={0.8} />
      </Sequence>
      <Sequence from={540} durationInFrames={90}>
        <Audio src={staticFile('assets/sfx/whoosh.mp3')} volume={0.7} />
      </Sequence>
      <Sequence from={630} durationInFrames={115}>
        <Audio src={staticFile('assets/sfx/impact.mp3')} volume={0.85} />
      </Sequence>

      {/* ================= VISUAL ENGINE (STATE CHANGE EVERY 3 SECONDS) ================= */}

      {/* -------------------------------------------------------------
          BEAT 1 [0:00 - 0:03 | Frame 0 - 90]: THE 03:30 ALARM
          Voice: "Tepat setahun yang lalu, pas temen-temen seumuran gue masih tidur pulas..."
      ------------------------------------------------------------- */}
      <Sequence from={0} durationInFrames={90}>
        {(() => {
          const pulse = interpolate(qFrame % 14, [0, 7, 14], [1, 1.05, 1]);
          return (
            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
              <div
                style={{
                  position: 'absolute',
                  top: 140,
                  backgroundColor: '#7c5d49',
                  color: '#ffffff',
                  padding: '12px 28px',
                  borderRadius: 24,
                  fontSize: 26,
                  fontWeight: 800,
                  letterSpacing: 2,
                }}
              >
                03:30 AM PROTOCOL
              </div>

              {/* Pulsing Alarm UI */}
              <div
                style={{
                  width: 860,
                  padding: '50px 36px',
                  backgroundColor: '#1c1a17',
                  borderRadius: 36,
                  border: '3px solid #7c5d49',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transform: `scale(${pulse})`,
                  boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 50px rgba(124,93,73,0.35)',
                }}
              >
                <span style={{ fontSize: 28, color: '#e1c49b', letterSpacing: 4, fontWeight: 700 }}>
                  ALARM • SAAT LAIN TIDUR PULES
                </span>
                <span style={{ fontSize: 160, fontWeight: 900, color: '#ffffff', margin: '10px 0', lineHeight: 1 }}>
                  03:30
                </span>
                <div
                  style={{
                    backgroundColor: '#5f7326',
                    color: '#ffffff',
                    padding: '12px 28px',
                    borderRadius: 14,
                    fontSize: 26,
                    fontWeight: 800,
                  }}
                >
                  DAPUR SUBUT LIRA
                </div>
              </div>

              <div
                style={{
                  position: 'absolute',
                  bottom: 150,
                  backgroundColor: '#e1c49b',
                  color: '#121110',
                  padding: '16px 36px',
                  borderRadius: 10,
                  fontSize: 34,
                  fontWeight: 900,
                  transform: 'rotate(-2.5deg)',
                }}
              >
                MASIH PADA TIDUR PULES.
              </div>
            </AbsoluteFill>
          );
        })()}
      </Sequence>

      {/* -------------------------------------------------------------
          BEAT 2 [0:03 - 0:06 | Frame 90 - 180]: THE HAND POSTER SLAM
          Voice: "...alarm gue udah bunyi jam setengah empat pagi di dapur kecil ini."
      ------------------------------------------------------------- */}
      <Sequence from={90} durationInFrames={90}>
        {(() => {
          const s2Frame = qFrame - 90;
          const drop = spring({ frame: s2Frame, fps, config: { damping: 11, stiffness: 180 } });
          const tilt = interpolate(s2Frame, [0, 90], [-4, -1]);

          return (
            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#7c5d49' }}>
              <div
                style={{
                  position: 'absolute',
                  top: 130,
                  backgroundColor: '#121110',
                  color: '#ffffff',
                  padding: '12px 30px',
                  borderRadius: 10,
                  fontSize: 32,
                  fontWeight: 900,
                }}
              >
                DAPUR KECIL • HANDMADE BATCH
              </div>

              {/* Poster Card with Hand Aesthetic */}
              <div
                style={{
                  width: 720,
                  height: 1060,
                  borderRadius: 24,
                  overflow: 'hidden',
                  border: '6px solid #ffffff',
                  boxShadow: '0 40px 90px rgba(0,0,0,0.7)',
                  transform: `scale(${drop}) rotate(${tilt}deg)`,
                }}
              >
                <Img
                  src={staticFile(beat2Poster)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div
                style={{
                  position: 'absolute',
                  bottom: 120,
                  backgroundColor: '#5f7326',
                  color: '#ffffff',
                  padding: '16px 36px',
                  borderRadius: 30,
                  fontSize: 32,
                  fontWeight: 900,
                  transform: 'rotate(2deg)',
                }}
              >
                BUKAN PRODUK PABRIK
              </div>
            </AbsoluteFill>
          );
        })()}
      </Sequence>

      {/* -------------------------------------------------------------
          BEAT 3 [0:06 - 0:09 | Frame 180 - 270]: SEKOLAH KEJURUAN & NO BACKUP PLAN
          Voice: "Gue masih anak sekolah kejuruan, dan jujur... gue nggak punya backup plan sama sekali."
      ------------------------------------------------------------- */}
      <Sequence from={180} durationInFrames={90}>
        {(() => {
          const s3Frame = qFrame - 180;
          const zoom = interpolate(s3Frame, [0, 90], [1, 1.12]);

          return (
            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#121110' }}>
              {/* Cropped Zoom on Hand Gripping the Bottle */}
              <div
                style={{
                  width: 760,
                  height: 980,
                  borderRadius: 28,
                  overflow: 'hidden',
                  border: '4px solid #7c5d49',
                  transform: `scale(${zoom})`,
                  boxShadow: '0 30px 80px rgba(0,0,0,0.85)',
                }}
              >
                <Img
                  src={staticFile(beat3Poster)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 35%' }}
                />
              </div>

              {/* Stamped Badges */}
              <div
                style={{
                  position: 'absolute',
                  top: 140,
                  backgroundColor: '#ffffff',
                  color: '#121110',
                  padding: '14px 34px',
                  borderRadius: 12,
                  fontSize: 34,
                  fontWeight: 900,
                  transform: 'rotate(-2deg)',
                }}
              >
                SEKOLAH KEJURUAN • ACCOUNTING
              </div>

              <div
                style={{
                  position: 'absolute',
                  bottom: 130,
                  backgroundColor: '#b91c1c',
                  color: '#ffffff',
                  padding: '16px 36px',
                  borderRadius: 30,
                  fontSize: 32,
                  fontWeight: 900,
                  boxShadow: '0 15px 35px rgba(185,28,28,0.5)',
                }}
              >
                NO BACKUP PLAN SAMA SEKALI
              </div>
            </AbsoluteFill>
          );
        })()}
      </Sequence>

      {/* -------------------------------------------------------------
          BEAT 4 [0:09 - 0:12 | Frame 270 - 360]: 50K MALL DRINK AGITATION
          Voice: "Gue cuma muak lihat minuman kafe 50 ribuan yang isinya cuma perisa sama krimer nabati."
      ------------------------------------------------------------- */}
      <Sequence from={270} durationInFrames={90}>
        {(() => {
          const s4Frame = qFrame - 270;
          const shake = s4Frame % 8 === 0 ? 4 : -4;

          return (
            <AbsoluteFill style={{ padding: '140px 50px', justifyContent: 'center', alignItems: 'center' }}>
              <div
                style={{
                  width: '100%',
                  maxWidth: 920,
                  backgroundColor: '#1c1a17',
                  border: '3px solid #ff5c5c',
                  borderRadius: 32,
                  padding: '44px 40px',
                  transform: `translateY(${shake}px)`,
                  boxShadow: '0 25px 70px rgba(255,92,92,0.25)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 32, fontWeight: 900, color: '#ff5c5c' }}>KAFE MALL (50K+)</span>
                  <span style={{ backgroundColor: '#ff5c5c', color: '#ffffff', padding: '8px 18px', borderRadius: 8, fontSize: 22, fontWeight: 900 }}>
                    OVERPRICED
                  </span>
                </div>

                <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ fontSize: 38, fontWeight: 800, color: '#999999', textDecoration: 'line-through' }}>
                    ✕ Bubuk Perisa Kiloan
                  </div>
                  <div style={{ fontSize: 38, fontWeight: 800, color: '#999999', textDecoration: 'line-through' }}>
                    ✕ Krimer Nabati Murahan
                  </div>
                  <div style={{ fontSize: 38, fontWeight: 800, color: '#999999', textDecoration: 'line-through' }}>
                    ✕ 80% Isinya Sirup Gula
                  </div>
                </div>
              </div>

              <div
                style={{
                  position: 'absolute',
                  bottom: 130,
                  backgroundColor: '#ff5c5c',
                  color: '#ffffff',
                  padding: '16px 36px',
                  borderRadius: 10,
                  fontSize: 34,
                  fontWeight: 900,
                  transform: 'rotate(-1.5deg)',
                }}
              >
                GUE MUAK LIHATNYA.
              </div>
            </AbsoluteFill>
          );
        })()}
      </Sequence>

      {/* -------------------------------------------------------------
          BEAT 5 [0:12 - 0:15 | Frame 360 - 450]: LIRA'S UNCOMPROMISING STANDARD
          Voice: "...Tapi ngejalanin brand sendiri sambil ngejar tugas sekolah itu brutal."
      ------------------------------------------------------------- */}
      <Sequence from={360} durationInFrames={90}>
        {(() => {
          const s5Frame = qFrame - 360;
          const pop = spring({ frame: s5Frame, fps, config: { damping: 12 } });

          return (
            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#5f7326' }}>
              <div
                style={{
                  position: 'absolute',
                  top: 130,
                  backgroundColor: '#ffffff',
                  color: '#5f7326',
                  padding: '12px 30px',
                  borderRadius: 10,
                  fontSize: 34,
                  fontWeight: 900,
                }}
              >
                STANDAR BERAT LIRA
              </div>

              {/* Hand Poster Framed in Crisp Brand Border */}
              <div
                style={{
                  width: 660,
                  height: 940,
                  borderRadius: 24,
                  overflow: 'hidden',
                  border: '6px solid #e1c49b',
                  boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
                  transform: `scale(${pop}) rotate(2deg)`,
                }}
              >
                <Img
                  src={staticFile(beat5Poster)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div
                style={{
                  position: 'absolute',
                  bottom: 120,
                  backgroundColor: '#121110',
                  color: '#ffffff',
                  padding: '16px 36px',
                  borderRadius: 30,
                  fontSize: 32,
                  fontWeight: 900,
                  border: '2px solid #e1c49b',
                }}
              >
                100% OATSIDE • PREMIUM MATCHA
              </div>
            </AbsoluteFill>
          );
        })()}
      </Sequence>

      {/* -------------------------------------------------------------
          BEAT 6 [0:15 - 0:18 | Frame 450 - 540]: THE FOUNDER REALITY (TUGAS X BOTOL)
          Voice: "Sering banget gue stress mikirin tugas sambil nge-seal botol Lira."
      ------------------------------------------------------------- */}
      <Sequence from={450} durationInFrames={90}>
        {(() => {
          const s6Frame = qFrame - 450;
          const tilt = interpolate(s6Frame % 16, [0, 8, 16], [-3, 3, -3]);

          return (
            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#121110' }}>
              <div
                style={{
                  position: 'absolute',
                  top: 140,
                  backgroundColor: '#7c5d49',
                  color: '#ffffff',
                  padding: '12px 28px',
                  borderRadius: 10,
                  fontSize: 32,
                  fontWeight: 900,
                }}
              >
                TUGAS SEKOLAH x SEAL BOTOL
              </div>

              {/* Split Aesthetic Composition */}
              <div
                style={{
                  width: 740,
                  height: 900,
                  borderRadius: 24,
                  overflow: 'hidden',
                  border: '4px solid #7c5d49',
                  transform: `rotate(${tilt}deg)`,
                  boxShadow: '0 30px 70px rgba(0,0,0,0.8)',
                }}
              >
                <Img
                  src={staticFile(beat6Poster)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 50%' }}
                />
              </div>

              <div
                style={{
                  position: 'absolute',
                  bottom: 130,
                  width: 880,
                  textAlign: 'center',
                  backgroundColor: '#1c1a17',
                  border: '2px solid rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  padding: '18px 24px',
                  borderRadius: 20,
                  fontSize: 34,
                  fontWeight: 900,
                }}
              >
                "Stress mikirin tugas sambil nge-seal botol."
              </div>
            </AbsoluteFill>
          );
        })()}
      </Sequence>

      {/* -------------------------------------------------------------
          BEAT 7 [0:18 - 0:21 | Frame 540 - 630]: FAST FORWARD // RITUAL FOKUS
          Voice: "Fast forward hari ini: Lira nemenin ritual fokus kalian."
      ------------------------------------------------------------- */}
      <Sequence from={540} durationInFrames={90}>
        {(() => {
          const s7Frame = qFrame - 540;
          const pop = spring({ frame: s7Frame, fps, config: { damping: 12 } });

          return (
            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#7c5d49' }}>
              <div
                style={{
                  position: 'absolute',
                  top: 120,
                  backgroundColor: '#ffffff',
                  color: '#7c5d49',
                  padding: '14px 34px',
                  borderRadius: 12,
                  fontSize: 36,
                  fontWeight: 900,
                  transform: 'rotate(-2deg)',
                }}
              >
                FAST FORWARD // HARI INI
              </div>

              {/* Full Hero Poster Reveal */}
              <div
                style={{
                  width: 720,
                  height: 1040,
                  borderRadius: 28,
                  overflow: 'hidden',
                  border: '6px solid #ffffff',
                  transform: `scale(${pop})`,
                  boxShadow: '0 35px 80px rgba(0,0,0,0.6)',
                }}
              >
                <Img
                  src={staticFile(beat7Poster)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div
                style={{
                  position: 'absolute',
                  bottom: 120,
                  backgroundColor: '#5f7326',
                  color: '#ffffff',
                  padding: '14px 32px',
                  borderRadius: 30,
                  fontSize: 30,
                  fontWeight: 800,
                }}
              >
                RITUAL FOKUS & BELAJAR KALIAN
              </div>
            </AbsoluteFill>
          );
        })()}
      </Sequence>

      {/* -------------------------------------------------------------
          BEAT 8 [0:21 - 0:24.8 | Frame 630 - 745]: CLIMAX & PUNCHY DIRECT CTA
          Voice: "Mau lihat gimana anak SMA scale brand ini dari nol? Follow me and click link in bio."
      ------------------------------------------------------------- */}
      <Sequence from={630} durationInFrames={115}>
        {(() => {
          const s8Frame = qFrame - 630;
          const punch = spring({ frame: s8Frame, fps, config: { damping: 10, stiffness: 200 } });

          return (
            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#5f7326' }}>
              <div
                style={{
                  position: 'absolute',
                  top: 130,
                  backgroundColor: '#ffffff',
                  color: '#5f7326',
                  padding: '14px 36px',
                  borderRadius: 12,
                  fontSize: 36,
                  fontWeight: 900,
                  fontFamily: 'Handelson One, sans-serif',
                  transform: 'rotate(-2deg)',
                }}
              >
                ANAK SMA SCALE DARI NOL
              </div>

              {/* Centered Poster Card with Dynamic Pulse */}
              <div
                style={{
                  width: 680,
                  height: 940,
                  borderRadius: 24,
                  overflow: 'hidden',
                  border: '6px solid #e1c49b',
                  transform: `scale(${punch})`,
                  boxShadow: '0 35px 80px rgba(0,0,0,0.7)',
                }}
              >
                <Img
                  src={staticFile(beat8Poster)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Direct Punchy CTA Banner */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 110,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <div
                  style={{
                    backgroundColor: '#121110',
                    color: '#ffffff',
                    padding: '22px 46px',
                    borderRadius: 44,
                    fontSize: 34,
                    fontWeight: 900,
                    boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    border: '3px solid #e1c49b',
                  }}
                >
                  <span>FOLLOW ME & CLICK LINK IN BIO</span>
                  <span style={{ color: '#e1c49b' }}>→</span>
                </div>
                <span style={{ color: '#e1c49b', fontSize: 26, fontWeight: 800, letterSpacing: 2 }}>
                  @DRINKLIRA
                </span>
              </div>
            </AbsoluteFill>
          );
        })()}
      </Sequence>
    </AbsoluteFill>
  );
};
