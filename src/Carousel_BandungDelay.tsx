import React from 'react';
import { staticFile, Img } from 'remotion';

// Standard 4:5 Instagram Carousel dimensions (1080 x 1350)
const containerStyle: React.CSSProperties = {
  width: 1080,
  height: 1350,
  backgroundColor: '#070A0E',
  backgroundImage: `
    radial-gradient(circle at 50% 0%, rgba(57, 255, 136, 0.12) 0%, transparent 60%),
    radial-gradient(circle at 100% 100%, rgba(255, 229, 102, 0.06) 0%, transparent 50%),
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
  `,
  backgroundSize: '100% 100%, 100% 100%, 48px 48px, 48px 48px',
  color: '#FFFFFF',
  fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, sans-serif',
  display: 'flex',
  flexDirection: 'column',
  padding: '54px 62px 42px 62px',
  boxSizing: 'border-box',
  position: 'relative',
  overflow: 'hidden',
};

const SERIF_ITALIC = '"Playfair Display", Georgia, serif';

const TopBar: React.FC<{
  category: string;
  categoryColor?: string;
  categoryBg?: string;
  slideNum: string;
}> = ({
  category,
  categoryColor = '#FFE566',
  categoryBg = 'rgba(255, 229, 102, 0.14)',
  slideNum,
}) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 20,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{
        backgroundColor: categoryBg,
        border: `1.5px solid ${categoryColor}55`,
        color: categoryColor,
        padding: '8px 18px',
        borderRadius: 10,
        fontSize: 15,
        fontWeight: 800,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}>
        {category}
      </div>
      <div style={{ color: '#9CA3AF', fontSize: 18, fontWeight: 700 }}>
        @drinklira
      </div>
    </div>
    <div style={{
      color: '#FFFFFF',
      fontSize: 17,
      fontWeight: 800,
      letterSpacing: '0.1em',
      background: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.14)',
      padding: '8px 18px',
      borderRadius: 10,
    }}>
      {slideNum}
    </div>
  </div>
);

const SwipeFooter: React.FC<{
  bridgeText: string;
  isLast?: boolean;
}> = ({ bridgeText, isLast = false }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    paddingTop: 16,
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    zIndex: 20,
  }}>
    <div style={{
      color: '#9CA3AF',
      fontSize: 15,
      fontWeight: 700,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
    }}>
      {bridgeText}
    </div>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      color: isLast ? '#39FF88' : '#FFE566',
      fontSize: 16,
      fontWeight: 800,
    }}>
      {isLast ? 'LINK DI BIO' : 'GESER ->'}
    </div>
  </div>
);

// ==========================================
// SLIDE 1: COVER HOOK (ANNOUNCEMENT)
// ==========================================
export const BandungDelay_Slide1: React.FC = () => {
  return (
    <div style={containerStyle}>
      <TopBar category="PENGUMUMAN BATCH" slideNum="01 / 04" />

      <div style={{ marginBottom: 16, zIndex: 10 }}>
        <h1 style={{
          fontSize: 48,
          lineHeight: 1.15,
          fontWeight: 900,
          margin: '0 0 10px 0',
          letterSpacing: '-0.02em',
        }}>
          Batch Sabtu Ini <span style={{ color: '#FFE566', fontStyle: 'italic', fontFamily: SERIF_ITALIC }}>Ditunda</span> ke Minggu Depan.
        </h1>
        <p style={{
          color: '#9CA3AF',
          fontSize: 20,
          lineHeight: 1.4,
          margin: 0,
          fontWeight: 500,
        }}>
          Kenapa gak ada pengiriman hari ini? Ini alasan jujur dari dapur Lira.
        </p>
      </div>

      {/* Center Image Container with Pixel Caleb */}
      <div style={{
        flex: 1,
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
        border: '1.5px solid rgba(255, 229, 102, 0.25)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6)',
      }}>
        <Img
          src={staticFile('/assets/pixel/caleb_walking_drink.jpg')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 20%',
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(7, 10, 14, 0.1) 0%, rgba(7, 10, 14, 0.85) 100%)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: 24,
          left: 24,
          right: 24,
          backgroundColor: 'rgba(7, 10, 14, 0.88)',
          border: '1px solid rgba(255, 229, 102, 0.35)',
          borderRadius: 14,
          padding: '16px 20px',
          backdropFilter: 'blur(10px)',
        }}>
          <div style={{ color: '#FFE566', fontSize: 14, fontWeight: 800, letterSpacing: '0.08em', marginBottom: 4 }}>
            DESTINASI: BANDUNG
          </div>
          <div style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 700 }}>
            Agenda Youth in Mission weekend ini. Batch Lira kembali Sabtu depan!
          </div>
        </div>
      </div>

      <SwipeFooter bridgeText="Kenapa ditunda? Geser untuk cerita lengkap" />
    </div>
  );
};

// ==========================================
// SLIDE 2: THE CONTEXT & YOUTH IN MISSION
// ==========================================
export const BandungDelay_Slide2: React.FC = () => {
  return (
    <div style={containerStyle}>
      <TopBar category="YOUTH IN MISSION" slideNum="02 / 04" />

      <div style={{ marginBottom: 16, zIndex: 10 }}>
        <h2 style={{
          fontSize: 42,
          lineHeight: 1.18,
          fontWeight: 900,
          margin: '0 0 10px 0',
          letterSpacing: '-0.02em',
        }}>
          Caleb & Tim Ada Agenda <span style={{ color: '#39FF88', fontStyle: 'italic', fontFamily: SERIF_ITALIC }}>Mission</span> ke Bandung
        </h2>
        <p style={{
          color: '#9CA3AF',
          fontSize: 19,
          lineHeight: 1.4,
          margin: 0,
          fontWeight: 500,
        }}>
          Komitmen artisan freshness: kami menolak kompromi kualitas.
        </p>
      </div>

      <div style={{
        flex: 1,
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
        border: '1.5px solid rgba(57, 255, 136, 0.25)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6)',
      }}>
        <Img
          src={staticFile('/assets/pixel/cup_struggle/s4_toss_4.jpg')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 30%',
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(7, 10, 14, 0.15) 0%, rgba(7, 10, 14, 0.92) 100%)',
        }} />

        <div style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          <div style={{
            backgroundColor: 'rgba(7, 10, 14, 0.88)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: 12,
            padding: '14px 18px',
            backdropFilter: 'blur(8px)',
          }}>
            <div style={{ color: '#39FF88', fontSize: 15, fontWeight: 800, marginBottom: 4 }}>
              100% Manual Hand-Brewed di Dapur
            </div>
            <div style={{ color: '#E5E7EB', fontSize: 16, lineHeight: 1.4 }}>
              Setiap botol Lira diseduh tangan sendiri pakai Pure Japanese Premium Matcha & pemanis stevia tanpa pabrik massal.
            </div>
          </div>

          <div style={{
            backgroundColor: 'rgba(7, 10, 14, 0.88)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: 12,
            padding: '14px 18px',
            backdropFilter: 'blur(8px)',
          }}>
            <div style={{ color: '#FFE566', fontSize: 15, fontWeight: 800, marginBottom: 4 }}>
              Zero Rush Brewing
            </div>
            <div style={{ color: '#E5E7EB', fontSize: 16, lineHeight: 1.4 }}>
              Daripada buru-buru dan mengorbankan standar rasa, batch diseduh fresh saat Caleb kembali.
            </div>
          </div>
        </div>
      </div>

      <SwipeFooter bridgeText="Kapan batch berikutnya meluncur?" />
    </div>
  );
};

// ==========================================
// SLIDE 3: NEXT BATCH SCHEDULE & PERKS
// ==========================================
export const BandungDelay_Slide3: React.FC = () => {
  return (
    <div style={containerStyle}>
      <TopBar category="JADWAL RESMI DROP" slideNum="03 / 04" />

      <div style={{ marginBottom: 16, zIndex: 10 }}>
        <h2 style={{
          fontSize: 42,
          lineHeight: 1.18,
          fontWeight: 900,
          margin: '0 0 10px 0',
          letterSpacing: '-0.02em',
        }}>
          Next Batch Drop: <span style={{ color: '#39FF88', fontStyle: 'italic', fontFamily: SERIF_ITALIC }}>Sabtu Depan</span>
        </h2>
        <p style={{
          color: '#9CA3AF',
          fontSize: 19,
          lineHeight: 1.4,
          margin: 0,
          fontWeight: 500,
        }}>
          Kuota artisan dibuka lebih banyak & ada prioritas khusus buat lo.
        </p>
      </div>

      <div style={{
        flex: 1,
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
        border: '1.5px solid rgba(57, 255, 136, 0.25)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6)',
      }}>
        <Img
          src={staticFile('/assets/pixel/scene_2_kitchen_a.jpg')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 40%',
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(7, 10, 14, 0.2) 0%, rgba(7, 10, 14, 0.94) 100%)',
        }} />

        <div style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}>
          <div style={{
            backgroundColor: 'rgba(7, 10, 14, 0.9)',
            border: '1px solid rgba(57, 255, 136, 0.3)',
            borderRadius: 12,
            padding: '12px 16px',
            backdropFilter: 'blur(8px)',
          }}>
            <div style={{ color: '#39FF88', fontSize: 16, fontWeight: 800 }}>
              Double Batch Allocation
            </div>
            <div style={{ color: '#D1D5DB', fontSize: 15 }}>
              Slot disiapkan lebih banyak biar yang belum kebagian minggu ini langsung aman.
            </div>
          </div>

          <div style={{
            backgroundColor: 'rgba(7, 10, 14, 0.9)',
            border: '1px solid rgba(255, 229, 102, 0.3)',
            borderRadius: 12,
            padding: '12px 16px',
            backdropFilter: 'blur(8px)',
          }}>
            <div style={{ color: '#FFE566', fontSize: 16, fontWeight: 800 }}>
              Early Priority Waitlist
            </div>
            <div style={{ color: '#D1D5DB', fontSize: 15 }}>
              Yang daftar via link bio dapat notifikasi prioritas sebelum kuota ditutup.
            </div>
          </div>

          <div style={{
            backgroundColor: 'rgba(7, 10, 14, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 12,
            padding: '12px 16px',
            backdropFilter: 'blur(8px)',
          }}>
            <div style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 800 }}>
              Fresh Friday Night Brew
            </div>
            <div style={{ color: '#D1D5DB', fontSize: 15 }}>
              Diseduh Jumat malam, diantar dingin Sabtu pagi dengan kurir Gojek cooler box.
            </div>
          </div>
        </div>
      </div>

      <SwipeFooter bridgeText="Cara amankan kuota botol lo sekarang" />
    </div>
  );
};

// ==========================================
// SLIDE 4: CALL TO ACTION & PRE-ORDER
// ==========================================
export const BandungDelay_Slide4: React.FC = () => {
  return (
    <div style={containerStyle}>
      <TopBar category="PRE-ORDER AKTIF" slideNum="04 / 04" />

      <div style={{ marginBottom: 16, zIndex: 10 }}>
        <h2 style={{
          fontSize: 42,
          lineHeight: 1.18,
          fontWeight: 900,
          margin: '0 0 10px 0',
          letterSpacing: '-0.02em',
        }}>
          Amankan Botol Lo <span style={{ color: '#39FF88', fontStyle: 'italic', fontFamily: SERIF_ITALIC }}>Sekarang</span> Lewat Bio
        </h2>
        <p style={{
          color: '#9CA3AF',
          fontSize: 19,
          lineHeight: 1.4,
          margin: 0,
          fontWeight: 500,
        }}>
          Form pre-order untuk drop Sabtu depan sudah dibuka resmi.
        </p>
      </div>

      <div style={{
        flex: 1,
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
        border: '1.5px solid rgba(57, 255, 136, 0.35)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6)',
      }}>
        <Img
          src={staticFile('/assets/pixel/caleb_point_hero.jpg')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 20%',
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(7, 10, 14, 0.15) 0%, rgba(7, 10, 14, 0.9) 100%)',
        }} />

        <div style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          backgroundColor: 'rgba(7, 10, 14, 0.92)',
          border: '1.5px solid #39FF88',
          borderRadius: 16,
          padding: '18px 22px',
          backdropFilter: 'blur(10px)',
          textAlign: 'center',
        }}>
          <div style={{ color: '#FFE566', fontSize: 14, fontWeight: 800, letterSpacing: '0.08em', marginBottom: 6 }}>
            LANGKAH MUDAH
          </div>
          <div style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 800, marginBottom: 8 }}>
            Tap Link di Bio @drinklira
          </div>
          <div style={{ color: '#9CA3AF', fontSize: 15, lineHeight: 1.4 }}>
            Pilih botol lo & masukkan alamat pengiriman. Sampai ketemu di Bandung, dan sampai jumpa di batch Sabtu depan!
          </div>
        </div>
      </div>

      <SwipeFooter bridgeText="Sampai ketemu di batch Sabtu depan!" isLast={true} />
    </div>
  );
};
