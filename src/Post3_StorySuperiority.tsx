import React from 'react';
import { staticFile, Img } from 'remotion';

export const StorySuperiorityClean: React.FC<{ imageSrc?: string }> = ({ imageSrc = 'assets/pixel/cup_struggle/s3_inverted_a.jpg' }) => {
  return (
    <div style={{
      width: 1080,
      height: 1920,
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#0A0E14',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: '#FFFFFF',
    }}>
      {/* Background Pixel-Art Image (Inverted 180° Bottle Over Pristine Dry Keyboard) */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}>
        <Img
          src={staticFile(imageSrc)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
      </div>

      {/* Subtle Cinematic Vignette for Text Readability */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 500,
        background: 'linear-gradient(to bottom, rgba(10, 14, 20, 0.95) 0%, rgba(10, 14, 20, 0.75) 50%, transparent 100%)',
        zIndex: 10,
      }} />

      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 600,
        background: 'linear-gradient(to top, rgba(10, 14, 20, 0.95) 0%, rgba(10, 14, 20, 0.8) 55%, transparent 100%)',
        zIndex: 10,
      }} />

      {/* Top Header Tag & Hook */}
      <div style={{
        position: 'absolute',
        top: 90,
        left: 56,
        right: 56,
        zIndex: 20,
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          backgroundColor: 'rgba(57, 255, 136, 0.22)',
          border: '1.5px solid #39FF88',
          color: '#39FF88',
          padding: '8px 20px',
          borderRadius: 30,
          fontSize: 18,
          fontWeight: 800,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: 16,
          backdropFilter: 'blur(12px)',
        }}>
          <span>180° ANTI-BOCOR TEST</span>
        </div>

        <h1 style={{
          fontSize: 44,
          fontWeight: 900,
          lineHeight: 1.22,
          color: '#FFFFFF',
          margin: 0,
          textShadow: '0 4px 20px rgba(0,0,0,0.85)',
          letterSpacing: '-0.02em',
        }}>
          Dibalik 180° persis di atas MacBook keyboard. Zero tetes, zero was-was.
        </h1>
      </div>

      {/* Bottom Solution Caption Card */}
      <div style={{
        position: 'absolute',
        bottom: 90,
        left: 56,
        right: 56,
        zIndex: 20,
        backgroundColor: 'rgba(15, 23, 36, 0.92)',
        backdropFilter: 'blur(20px)',
        border: '1.5px solid rgba(57, 255, 136, 0.35)',
        borderRadius: 24,
        padding: '32px 34px',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.75)',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          backgroundColor: 'rgba(57, 255, 136, 0.15)',
          color: '#39FF88',
          border: '1px solid rgba(57, 255, 136, 0.4)',
          padding: '6px 16px',
          borderRadius: 16,
          fontSize: 16,
          fontWeight: 800,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          marginBottom: 16,
        }}>
          <span>CRAFTED FOR REAL LIFE</span>
        </div>

        <p style={{
          fontSize: 26,
          fontWeight: 800,
          lineHeight: 1.4,
          color: '#FFFFFF',
          margin: '0 0 12px 0',
        }}>
          Ini standar botol Lira. <span style={{ color: '#FFE566' }}>Dilempar ke tas samping laptop tetep aman 100%.</span>
        </p>

        <p style={{
          fontSize: 18,
          fontWeight: 600,
          color: '#9CA3AF',
          margin: 0,
          lineHeight: 1.4,
        }}>
          Tahan 7 hari di kulkas, 100% konsentrat murni tanpa es batu. Amankan slot batch Sabtu via link di bio!
        </p>
      </div>
    </div>
  );
};

export const StorySuperiorityRaw: React.FC<{ imageSrc?: string }> = ({ imageSrc = 'assets/pixel/cup_struggle/s3_inverted_a.jpg' }) => {
  return (
    <div style={{
      width: 1080,
      height: 1920,
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#0A0E14',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}>
        <Img
          src={staticFile(imageSrc)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
      </div>
    </div>
  );
};
