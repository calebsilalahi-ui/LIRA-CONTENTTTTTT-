import React, { useEffect, useRef, useState } from 'react';
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
  delayRender,
  continueRender,
} from 'remotion';

function loadHtmlImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

// ============================================================================
// SCENE 3 PIXEL-ACCURATE MODERN OFFICE BUILDING CANVAS ENGINE:
// 1. Replaces classical cupola/pediment & institutional frieze (y: 12..338)
//    with a sleek 16-bit Pixel-Art Modern Glass & Limestone Office Tower
//    (stopping cleanly above Caleb's hair at y=342 so zero hair pixels are touched).
// 2. Replaces the pink/blue institutional sign (y: 488..546) and the two blue
//    door plaques (y: 614..684) using exact color-key sign detection (Blue > 115
//    or Pink/White sign pixels) so it 100% removes all signage while NEVER
//    touching Caleb's tan face, olive cardigan, or green bottle!
// 3. Recolors the background brick facade into sleek modern architectural stone/steel.
// 4. Stamps the Official Circular Lira Logo onto the bottle in Caleb's hand.
// 5. Animates Caleb's eyes, eyebrows, talking mouth, and 6fps walking/breathing motion!
// ============================================================================
const Scene3OfficeCanvas: React.FC<{
  localFrame: number;
  poseStep: number;
  isTalking: boolean;
}> = ({ localFrame, poseStep, isTalking }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [assets, setAssets] = useState<{
    campusImg: HTMLImageElement;
    logoImg: HTMLImageElement;
  } | null>(null);
  const [handle] = useState(() => delayRender('Loading Scene 3 Office Canvas assets'));

  useEffect(() => {
    let mounted = true;
    Promise.all([
      loadHtmlImage(staticFile('assets/pixel/scene_3_campus.jpg')),
      loadHtmlImage(staticFile('assets/lira_logo.jpg')),
    ])
      .then(([campusImg, logoImg]) => {
        if (mounted) {
          setAssets({ campusImg, logoImg });
          continueRender(handle);
        }
      })
      .catch((err) => {
        console.error(err);
        continueRender(handle);
      });
    return () => {
      mounted = false;
    };
  }, [handle]);

  useEffect(() => {
    if (!assets || !canvasRef.current) return;
    const W = 1024;
    const H = 1024;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const off = document.createElement('canvas');
    off.width = W;
    off.height = H;
    const offCtx = off.getContext('2d')!;
    offCtx.drawImage(assets.campusImg, 0, 0, W, H);
    const srcData = offCtx.getImageData(0, 0, W, H);
    const campus = srcData.data;

    const logoSize = 50;
    const logoCan = document.createElement('canvas');
    logoCan.width = logoSize;
    logoCan.height = logoSize;
    const logoCtx = logoCan.getContext('2d')!;
    logoCtx.drawImage(assets.logoImg, 0, 0, logoSize, logoSize);
    const logo = logoCtx.getImageData(0, 0, logoSize, logoSize).data;

    const outImgData = ctx.createImageData(W, H);
    const out = outImgData.data;
    out.set(campus);

    const getPx = (buf: Uint8ClampedArray, x: number, y: number) => {
      const idx = (y * W + x) * 4;
      return [buf[idx], buf[idx + 1], buf[idx + 2]];
    };
    const setPx = (
      buf: Uint8ClampedArray,
      x: number,
      y: number,
      r: number,
      g: number,
      b: number
    ) => {
      if (x < 0 || x >= W || y < 0 || y >= H) return;
      const idx = (y * W + x) * 4;
      buf[idx] = r;
      buf[idx + 1] = g;
      buf[idx + 2] = b;
      buf[idx + 3] = 255;
    };
    const fillRect = (
      buf: Uint8ClampedArray,
      x0: number,
      y0: number,
      w: number,
      h: number,
      r: number,
      g: number,
      b: number
    ) => {
      for (let y = y0; y < y0 + h; y++) {
        for (let x = x0; x < x0 + w; x++) {
          setPx(buf, x, y, r, g, b);
        }
      }
    };

    // 1. Replace classical dome/cupola & triangular pediment (x: 245..780, y: 12..300) with matching morning sky
    for (let y = 12; y <= 300; y++) {
      const [sr, sg, sb] = getPx(campus, 230, y);
      for (let x = 245; x <= 780; x++) {
        setPx(out, x, y, sr, sg, sb);
      }
    }

    // 2. Draw Sleek Modern Glass & Limestone Office Tower Upper Floors (x: 266..758, y: 132..336)
    fillRect(out, 258, 126, 508, 14, 34, 28, 26); // Flat modern roof overhang outline
    fillRect(out, 262, 130, 500, 8, 138, 142, 146); // Modern steel roof trim
    fillRect(out, 268, 140, 488, 196, 34, 28, 26); // Upper office tower outline
    fillRect(out, 272, 144, 480, 188, 218, 212, 202); // Architectural limestone facade

    // Vertical pilasters aligned with the lower building columns
    for (const px of [272, 350, 428, 506, 584, 662, 736]) {
      fillRect(out, px, 144, 16, 188, 232, 224, 212);
      fillRect(out, px + 13, 144, 3, 188, 182, 174, 162);
    }

    // Reflective blue-teal modern office curtain-wall windows
    for (const wx of [292, 370, 448, 526, 604, 682]) {
      fillRect(out, wx - 3, 156, 54, 122, 34, 28, 26);
      fillRect(out, wx, 159, 48, 116, 62, 92, 114);
      fillRect(out, wx + 4, 163, 14, 108, 90, 128, 154);
      fillRect(out, wx + 22, 163, 6, 108, 124, 164, 188);
      fillRect(out, wx - 3, 214, 54, 5, 34, 28, 26);
      fillRect(out, wx + 8, 172, 32, 4, 248, 224, 168);
      fillRect(out, wx + 8, 230, 32, 4, 248, 224, 168);
    }

    // Clean Unmarked Limestone Frieze (replaces institutional text at y: 290..334)
    fillRect(out, 268, 290, 488, 44, 34, 28, 26);
    fillRect(out, 272, 294, 480, 36, 228, 220, 208);
    fillRect(out, 292, 302, 140, 20, 204, 196, 184);
    fillRect(out, 444, 302, 136, 20, 204, 196, 184);
    fillRect(out, 592, 302, 140, 20, 204, 196, 184);

    // 3. Transform the reddish-brown university brick walls into sleek modern cool limestone/concrete office walls!
    // 3. Transform warm red-brick university walls into sleek modern limestone/concrete office facade
    // (Only affects warm terracotta/brick pixels outside Caleb's bounding silhouette)
    for (let y = 335; y <= 735; y++) {
      for (let x = 0; x < W; x++) {
        // Skip Caleb's silhouette region
        const insideCalebHead = x >= 245 && x <= 430 && y >= 340 && y <= 525;
        const insideCalebBody = x >= 215 && x <= 525 && y > 500 && y <= 980;
        if (insideCalebHead || insideCalebBody) continue;

        const [r, g, b] = getPx(out, x, y);
        // Recolor warm terracotta brick to cool modern architectural stone/concrete
        if (r > 115 && g > 60 && g < 165 && b < 130 && r - g > 22 && r - b > 35) {
          const lum = Math.round(0.35 * r + 0.45 * g + 0.2 * b);
          setPx(out, x, y, lum + 32, lum + 32, lum + 34);
        }
      }
    }

    // 4. Color-key remove the pink/blue institutional banner (x: 340..634, y: 488..548)
    //    WITHOUT touching Caleb's jawline, neck/shoulder, or bottle!
    for (let y = 488; y <= 548; y++) {
      for (let x = 340; x <= 634; x++) {
        // Skip Caleb's exact bottle cap & neck (x: 482..514, y: 515..537) and bottle shoulder (x: 477..519, y > 537)
        if (x >= 482 && x <= 514 && y >= 515 && y <= 537) continue;
        if (x >= 477 && x <= 519 && y > 537) continue;

        const [r, g, b] = getPx(campus, x, y);
        // Protect Caleb's dark pixel outline, warm tan skin (r > g > b+18), cream collar, and olive cardigan (g > r)
        const isDarkOutline = r < 68 && g < 60 && b < 60;
        const isTanSkin = r > 110 && g > 70 && r > g + 15 && g > b + 18 && b < 130;
        const isCreamCollar = r > 200 && g > 185 && b > 140 && r > b + 25 && x < 365;
        const isOliveSweater = g > r && b < 85;
        if (isDarkOutline || isTanSkin || isCreamCollar || isOliveSweater) continue;

        // Detect any sign pixel (blue/cyan background, pink ribbon triangle, or white text/border)
        const isSignPixel =
          b > 88 ||
          (r > 145 && b > 80 && r - g > 20) ||
          (r > 165 && g > 160 && b > 150);
        if (isSignPixel) {
          if (x < 382) {
            // Behind Caleb's right neck/jaw: fill with shaded architectural limestone wall
            setPx(out, x, y, 188, 178, 164);
          } else if (y <= 496 || y >= 540 || x <= 388 || x >= 620) {
            setPx(out, x, y, 36, 34, 34); // Dark steel canopy frame
          } else if (y >= 502 && y <= 534 && ((x >= 394 && x <= 480) || (x >= 516 && x <= 612))) {
            setPx(out, x, y, 76, 104, 124); // Tinted canopy glass
          } else {
            setPx(out, x, y, 56, 66, 76); // Brushed steel mullion
          }
        }
      }
    }

    // 5. Cleanly replace the two small blue plaques by the entrance doors (y: 614..684)
    for (let y = 614; y <= 684; y++) {
      for (let x = 382; x <= 632; x++) {
        if (x > 422 && x < 576) continue;
        // Skip Caleb's olive cardigan & dark outline on the left (x <= 416)
        const [r, g, b] = getPx(campus, x, y);
        if (x <= 416 && (g >= r || (r < 65 && g < 65 && b < 65))) continue;

        if (b > 95 || (x >= 584 && x <= 624 && y >= 620 && y <= 680)) {
          const isMortar = y % 20 < 3;
          if (isMortar) {
            setPx(out, x, y, 178, 166, 150);
          } else {
            setPx(out, x, y, 214, 202, 184);
          }
        }
      }
    }

    // 6. Stamp the Official Circular Lira Logo onto the bottle in Caleb's right hand!
    // Exact bottle label center in scene_3_campus.jpg (1024x1024): (496, 582), radius 18
    // Fits 100% between left bottle outline (x=477) and right finger outline (x=515)!
    const labelCenterX = 496;
    const labelCenterY = 582;
    const labelRadius = 18;
    for (let dy = -labelRadius; dy <= labelRadius; dy++) {
      for (let dx = -labelRadius; dx <= labelRadius; dx++) {
        const pxX = labelCenterX + dx;
        const pxY = labelCenterY + dy;
        if (pxX >= 515) continue;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= labelRadius) {
          const lx = Math.min(
            logoSize - 1,
            Math.max(
              0,
              Math.round(((dx + labelRadius) / (2 * labelRadius)) * (logoSize - 1))
            )
          );
          const ly = Math.min(
            logoSize - 1,
            Math.max(
              0,
              Math.round(((dy + labelRadius) / (2 * labelRadius)) * (logoSize - 1))
            )
          );
          const lIdx = (ly * logoSize + lx) * 4;
          if (dist >= labelRadius - 1.5) {
            setPx(out, pxX, pxY, 32, 48, 18);
          } else {
            setPx(
              out,
              pxX,
              pxY,
              logo[lIdx],
              logo[lIdx + 1],
              logo[lIdx + 2]
            );
          }
        }
      }
    }

    // 7. Animate Caleb's Talking Pixel Mouth & Expressive Eyes/Eyebrows!
    // Exact mouth center in scene_3_campus.jpg (1024x1024): x = 367..387, y = 506..517
    if (isTalking) {
      fillRect(out, 367, 506, 20, 11, 28, 18, 16); // Dark mouth outline
      fillRect(out, 370, 508, 14, 3, 248, 245, 238); // Upper teeth
      fillRect(out, 370, 511, 14, 3, 92, 28, 28); // Mouth interior
      fillRect(out, 372, 514, 10, 2, 212, 96, 92); // Tongue
    }

    // Periodic natural eye blink (every 45 frames for 4 frames)
    // Left eye pupil: x = 336..356, y = 466..482 | Right eye pupil: x = 386..406, y = 466..482
    if (localFrame % 45 >= 41) {
      fillRect(out, 334, 466, 24, 16, 214, 152, 106); // Left eyelid
      fillRect(out, 334, 474, 24, 4, 28, 20, 18); // Closed lash line
      fillRect(out, 386, 466, 22, 16, 214, 152, 106); // Right eyelid
      fillRect(out, 386, 474, 22, 4, 28, 20, 18);
    }

    ctx.putImageData(outImgData, 0, 0);
  }, [assets, localFrame, poseStep, isTalking]);

  // Smooth, steady cinematic push-in (no bouncing or tilting)
  const smoothScale = interpolate(localFrame, [0, 198], [1.0, 1.035], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#0a0a09' }}>
      <canvas
        ref={canvasRef}
        width={1024}
        height={1024}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          imageRendering: 'pixelated',
          transform: `scale(${smoothScale})`,
          filter: 'contrast(1.06) saturate(1.04) brightness(0.97)',
        }}
      />
      {/* Cinematic Morning Golden-Hour Sunbeam & Architectural Shadow Grade */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(135deg, rgba(255, 214, 140, 0.16) 0%, rgba(255, 190, 105, 0.05) 45%, rgba(10, 14, 22, 0.28) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================================================
// PIXEL-ACCURATE CANVAS ANIMATOR FOR SCENES 2, 6, 7 & 8 (100% SEAMLESS & STEADY)
// ============================================================================
const PixelCharacterCanvasScene: React.FC<{
  src: string;
  sceneType: 'kitchen' | 'stressed' | 'ritual';
  localFrame: number;
  poseStep: number;
  isTalking: boolean;
}> = ({ src, sceneType, localFrame, poseStep, isTalking }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [handle] = useState(() => delayRender(`Loading ${sceneType} canvas image`));

  useEffect(() => {
    let mounted = true;
    loadHtmlImage(src)
      .then((loaded) => {
        if (mounted) {
          setImgEl(loaded);
          continueRender(handle);
        }
      })
      .catch((err) => {
        console.error(err);
        continueRender(handle);
      });
    return () => {
      mounted = false;
    };
  }, [src, handle]);

  useEffect(() => {
    if (!imgEl || !canvasRef.current) return;
    const W = imgEl.naturalWidth || 1024;
    const H = imgEl.naturalHeight || 1024;
    const canvas = canvasRef.current;
    if (canvas.width !== W) canvas.width = W;
    if (canvas.height !== H) canvas.height = H;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const off = document.createElement('canvas');
    off.width = W;
    off.height = H;
    const offCtx = off.getContext('2d')!;
    offCtx.drawImage(imgEl, 0, 0, W, H);
    const baseData = offCtx.getImageData(0, 0, W, H);
    const srcPx = baseData.data;

    const outImgData = ctx.createImageData(W, H);
    const out = outImgData.data;
    out.set(srcPx);

    const setPx = (
      buf: Uint8ClampedArray,
      x: number,
      y: number,
      r: number,
      g: number,
      b: number
    ) => {
      if (x < 0 || x >= W || y < 0 || y >= H) return;
      const idx = (y * W + x) * 4;
      buf[idx] = r;
      buf[idx + 1] = g;
      buf[idx + 2] = b;
      buf[idx + 3] = 255;
    };
    const fillRect = (
      buf: Uint8ClampedArray,
      x0: number,
      y0: number,
      w: number,
      h: number,
      r: number,
      g: number,
      b: number
    ) => {
      for (let y = Math.round(y0); y < Math.round(y0 + h); y++) {
        for (let x = Math.round(x0); x < Math.round(x0 + w); x++) {
          setPx(buf, x, y, r, g, b);
        }
      }
    };

    if (sceneType === 'kitchen') {
      // Scene 2 (896x1200):
      // Exact mouth center: x = 612..638, y = 347..359
      if (isTalking) {
        fillRect(out, 612, 347, 26, 13, 28, 18, 16);
        fillRect(out, 615, 349, 20, 3, 248, 245, 238);
        fillRect(out, 615, 352, 20, 4, 92, 28, 28);
        fillRect(out, 618, 356, 14, 3, 212, 96, 92);
      }
      // Natural eye blink every 60 frames
      if (localFrame % 60 >= 56) {
        fillRect(out, 572, 280, 28, 22, 208, 142, 96);
        fillRect(out, 572, 292, 28, 4, 28, 18, 16);
        fillRect(out, 646, 280, 28, 22, 208, 142, 96);
        fillRect(out, 646, 292, 28, 4, 28, 18, 16);
      }
    } else if (sceneType === 'stressed') {
      // Scene 6 (1024x1024):
      // Open stressed mouth is at x = 477..546, y = 398..440
      if (!isTalking) {
        // Partially clench teeth on alternating syllables for natural stressed talking
        fillRect(out, 480, 412, 64, 16, 248, 245, 238);
        fillRect(out, 480, 419, 64, 3, 28, 18, 16);
        fillRect(out, 477, 428, 70, 14, 208, 142, 96);
        fillRect(out, 480, 428, 64, 4, 28, 18, 16);
      }
    } else if (sceneType === 'ritual') {
      // Scene 7 & 8 (1024x1024):
      // Big smile is at x = 485..542, y = 336..356
      if (isTalking) {
        fillRect(out, 492, 344, 42, 12, 28, 18, 16);
        fillRect(out, 495, 345, 36, 6, 92, 28, 28);
        fillRect(out, 500, 350, 26, 5, 218, 102, 98);
      }
      // Happy eye blink every 60 frames
      if (localFrame % 60 >= 56) {
        fillRect(out, 464, 280, 28, 24, 214, 152, 106);
        fillRect(out, 464, 292, 28, 4, 28, 18, 16);
        fillRect(out, 536, 280, 28, 24, 214, 152, 106);
        fillRect(out, 536, 292, 28, 4, 28, 18, 16);
      }
    }

    ctx.putImageData(outImgData, 0, 0);
  }, [imgEl, sceneType, localFrame, poseStep, isTalking]);

  // Smooth, steady cinematic dolly push-in (zero shaking, bouncing, or rotation jitter)
  const smoothScale = interpolate(localFrame, [0, 140], [1.0, 1.032], {
    extrapolateRight: 'clamp',
  });

  const sceneGradeFilter =
    sceneType === 'kitchen'
      ? 'contrast(1.07) saturate(1.04) brightness(0.97)'
      : sceneType === 'stressed'
      ? 'contrast(1.1) saturate(0.96) brightness(0.94)'
      : 'contrast(1.06) saturate(1.06) brightness(0.98)';

  const sceneLightingOverlay =
    sceneType === 'kitchen'
      ? 'radial-gradient(circle at 68% 36%, rgba(255, 244, 214, 0.14) 0%, rgba(12, 16, 22, 0.24) 100%)'
      : sceneType === 'stressed'
      ? 'radial-gradient(circle at 50% 42%, rgba(255, 190, 140, 0.10) 0%, rgba(8, 8, 12, 0.42) 100%)'
      : 'linear-gradient(135deg, rgba(255, 220, 145, 0.18) 0%, rgba(168, 224, 95, 0.06) 50%, rgba(10, 12, 10, 0.28) 100%)';

  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#0a0a09' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          imageRendering: 'pixelated',
          transform: `scale(${smoothScale})`,
          filter: sceneGradeFilter,
        }}
      />
      <AbsoluteFill
        style={{
          background: sceneLightingOverlay,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================================================
// WORD-BY-WORD F-PATTERN CAPTION DATA (SYNCED TO 37S VOICEOVER)
// ============================================================================
interface TimedWord {
  text: string;
  from: number;
  highlight?: 'yellow' | 'lime' | 'red' | 'white';
}

interface CaptionCardConfig {
  id: number;
  from: number;
  to: number;
  topLeft: string;
  topRight: string;
  primaryWords: TimedWord[];
  secondaryWords: TimedWord[];
  bottomNote: string;
}

const CAPTION_CARDS: CaptionCardConfig[] = [
  {
    id: 1,
    from: 0,
    to: 55,
    topLeft: '03:30 WIB  •  ONE YEAR AGO',
    topRight: 'SCENE 01 / 08',
    primaryWords: [
      { text: 'TEPAT', from: 2, highlight: 'white' },
      { text: 'SETAHUN', from: 14, highlight: 'yellow' },
      { text: 'YANG', from: 26, highlight: 'white' },
      { text: 'LALU,', from: 35, highlight: 'lime' },
    ],
    secondaryWords: [
      { text: 'Saat', from: 8 },
      { text: 'umur', from: 18 },
      { text: 'gue', from: 26 },
      { text: 'masih', from: 34 },
      { text: '16', from: 40, highlight: 'yellow' },
      { text: 'tahun...', from: 46 },
    ],
    bottomNote: 'LIRA  •  THE FOUNDER DOCUMENTARY',
  },
  {
    id: 2,
    from: 55,
    to: 134,
    topLeft: '03:30 AM PROTOCOL',
    topRight: 'SCENE 01 / 08',
    primaryWords: [
      { text: 'PAS', from: 56, highlight: 'white' },
      { text: 'TEMEN', from: 64, highlight: 'yellow' },
      { text: 'SEUMURAN', from: 78, highlight: 'yellow' },
      { text: 'GUE', from: 94, highlight: 'white' },
    ],
    secondaryWords: [
      { text: 'masih', from: 103 },
      { text: 'TIDUR', from: 112, highlight: 'red' },
      { text: 'PULAS...', from: 121, highlight: 'yellow' },
    ],
    bottomNote: '03:30 AM  •  BUILT FROM ZERO',
  },
  {
    id: 3,
    from: 134,
    to: 252,
    topLeft: 'HOME KITCHEN  •  03:35 WIB',
    topRight: 'SCENE 02 / 08',
    primaryWords: [
      { text: 'ALARM', from: 136, highlight: 'red' },
      { text: 'UDAH', from: 150, highlight: 'white' },
      { text: 'BUNYI', from: 162, highlight: 'yellow' },
      { text: '03:30', from: 178, highlight: 'lime' },
      { text: 'PAGI', from: 192, highlight: 'lime' },
    ],
    secondaryWords: [
      { text: 'di', from: 198 },
      { text: 'dapur', from: 205, highlight: 'yellow' },
      { text: 'kecil', from: 214, highlight: 'yellow' },
      { text: 'rumah.', from: 222 },
    ],
    bottomNote: 'SMALL-BATCH CRAFT  •  REAL INGREDIENTS',
  },
  {
    id: 4,
    from: 252,
    to: 352,
    topLeft: 'AGE 17  •  HIGH SCHOOL FOUNDER',
    topRight: 'SCENE 03 / 08',
    primaryWords: [
      { text: 'PAS', from: 256, highlight: 'white' },
      { text: 'MULAI,', from: 266, highlight: 'white' },
      { text: 'GUE', from: 278, highlight: 'white' },
      { text: 'MASIH', from: 290, highlight: 'yellow' },
      { text: 'ANAK', from: 304, highlight: 'lime' },
      { text: 'SMA', from: 316, highlight: 'lime' },
    ],
    secondaryWords: [
      { text: 'bawa', from: 320 },
      { text: 'botol', from: 326 },
      { text: 'Lira', from: 332, highlight: 'lime' },
      { text: 'sendiri.', from: 338 },
    ],
    bottomNote: 'BOOTSTRAPPED  •  INDEPENDENT',
  },
  {
    id: 5,
    from: 352,
    to: 450,
    topLeft: 'NO SAFETY NET  •  ALL IN',
    topRight: 'SCENE 03 / 08',
    primaryWords: [
      { text: 'TEKANAN', from: 354, highlight: 'white' },
      { text: 'LUMAYAN', from: 368, highlight: 'yellow' },
      { text: 'KARENA', from: 382, highlight: 'white' },
      { text: 'GA', from: 396, highlight: 'red' },
      { text: 'ADA', from: 405, highlight: 'red' },
    ],
    secondaryWords: [
      { text: 'BACKUP', from: 414, highlight: 'yellow' },
      { text: 'PLAN', from: 423, highlight: 'yellow' },
      { text: 'sama', from: 431 },
      { text: 'sekali.', from: 438, highlight: 'red' },
    ],
    bottomNote: 'NO PLAN B  •  FULL COMMITMENT',
  },
  {
    id: 6,
    from: 450,
    to: 535,
    topLeft: 'THE INDUSTRY PROBLEM',
    topRight: 'SCENE 04 / 08',
    primaryWords: [
      { text: 'GUE', from: 455, highlight: 'white' },
      { text: 'CUMA', from: 464, highlight: 'white' },
      { text: 'MUAK', from: 474, highlight: 'red' },
      { text: 'LIHAT', from: 488, highlight: 'white' },
      { text: 'MINUMAN', from: 498, highlight: 'yellow' },
    ],
    secondaryWords: [
      { text: 'kafe', from: 508 },
      { text: '50', from: 515, highlight: 'red' },
      { text: 'RIBUAN...', from: 520, highlight: 'yellow' },
    ],
    bottomNote: '50K CAFE DRINKS  •  OVERPRICED HYPE',
  },
  {
    id: 7,
    from: 535,
    to: 618,
    topLeft: 'ARTIFICIAL SYRUP & CREAMER',
    topRight: 'SCENE 04 / 08',
    primaryWords: [
      { text: 'YANG', from: 538, highlight: 'white' },
      { text: 'ISINYA', from: 548, highlight: 'white' },
      { text: 'CUMA', from: 560, highlight: 'yellow' },
      { text: 'PERISA', from: 572, highlight: 'red' },
    ],
    secondaryWords: [
      { text: 'sama', from: 583 },
      { text: 'KRIMER', from: 591, highlight: 'red' },
      { text: 'NABATI!', from: 600, highlight: 'yellow' },
    ],
    bottomNote: 'LIRA STANDARD  •  100% OATSIDE & PURE MATCHA',
  },
  {
    id: 8,
    from: 618,
    to: 752,
    topLeft: 'LATE NIGHT DESK  •  FOUNDER LIFE',
    topRight: 'SCENE 05 / 08',
    primaryWords: [
      { text: 'TAPI', from: 622, highlight: 'white' },
      { text: 'JALANIN', from: 634, highlight: 'yellow' },
      { text: 'BRAND', from: 652, highlight: 'lime' },
      { text: 'SENDIRI', from: 668, highlight: 'lime' },
    ],
    secondaryWords: [
      { text: 'sambil', from: 672 },
      { text: 'kejar', from: 684 },
      { text: 'tugas', from: 698, highlight: 'yellow' },
      { text: 'sekolah', from: 712 },
      { text: 'itu', from: 724 },
      { text: 'BRUTAL.', from: 732, highlight: 'red' },
    ],
    bottomNote: 'STUDENT BY DAY  •  FOUNDER BY NIGHT',
  },
  {
    id: 9,
    from: 752,
    to: 856,
    topLeft: 'THE GRIND  •  HOMEWORK vs BOTTLING',
    topRight: 'SCENE 06 / 08',
    primaryWords: [
      { text: 'SERING', from: 756, highlight: 'white' },
      { text: 'STRESS', from: 774, highlight: 'red' },
      { text: 'MIKIRIN', from: 792, highlight: 'white' },
      { text: 'TUGAS', from: 806, highlight: 'yellow' },
    ],
    secondaryWords: [
      { text: 'sambil', from: 812 },
      { text: 'NGE-SEAL', from: 822, highlight: 'lime' },
      { text: 'botol', from: 832 },
      { text: 'LIRA!', from: 840, highlight: 'lime' },
    ],
    bottomNote: 'EVERY BOTTLE SEALED BY HAND',
  },
  {
    id: 10,
    from: 856,
    to: 966,
    topLeft: 'FAST FORWARD  •  PRESENT DAY',
    topRight: 'SCENE 07 / 08',
    primaryWords: [
      { text: 'FAST', from: 859, highlight: 'yellow' },
      { text: 'FORWARD:', from: 870, highlight: 'yellow' },
      { text: 'LIRA', from: 896, highlight: 'lime' },
      { text: 'NEMENIN', from: 912, highlight: 'white' },
    ],
    secondaryWords: [
      { text: 'RITUAL', from: 922, highlight: 'yellow' },
      { text: 'FOKUS', from: 930, highlight: 'lime' },
      { text: 'kalian!', from: 942, highlight: 'white' },
    ],
    bottomNote: 'CRAFTED FOR DEEP WORK & FOCUS',
  },
  {
    id: 11,
    from: 966,
    to: 1048,
    topLeft: 'BUILDING IN PUBLIC  •  DAY ONE',
    topRight: 'SCENE 08 / 08',
    primaryWords: [
      { text: 'LIHAT', from: 972, highlight: 'white' },
      { text: 'ANAK', from: 990, highlight: 'yellow' },
      { text: 'SMA', from: 1002, highlight: 'yellow' },
      { text: 'SCALE', from: 1014, highlight: 'lime' },
    ],
    secondaryWords: [
      { text: 'brand', from: 1023 },
      { text: 'ini', from: 1030 },
      { text: 'dari', from: 1035 },
      { text: 'NOL?', from: 1040, highlight: 'yellow' },
    ],
    bottomNote: 'DOCUMENTING EVERY CHAPTER',
  },
  {
    id: 12,
    from: 1048,
    to: 1110,
    topLeft: 'LIRA  •  @DRINKLIRA',
    topRight: 'JOIN THE RITUAL',
    primaryWords: [
      { text: 'FOLLOW', from: 1051, highlight: 'lime' },
      { text: '&', from: 1062, highlight: 'white' },
      { text: 'CLICK', from: 1068, highlight: 'yellow' },
      { text: 'LINK', from: 1075, highlight: 'yellow' },
      { text: 'IN', from: 1081, highlight: 'white' },
      { text: 'BIO!', from: 1084, highlight: 'lime' },
    ],
    secondaryWords: [
      { text: 'Experience', from: 1056 },
      { text: 'Lira', from: 1066, highlight: 'lime' },
      { text: 'Today.', from: 1076, highlight: 'yellow' },
    ],
    bottomNote: 'IG: @DRINKLIRA  •  LINK IN BIO',
  },
];

// ============================================================================
// CINEMATIC OPTICAL FILM DISSOLVE & ANAMORPHIC LIGHT-LEAK TRANSITION ENGINE
// ============================================================================
const TRANSITION_FRAMES = [
  { frame: 134, type: 'warm_flare' },
  { frame: 252, type: 'gold_flare' },
  { frame: 450, type: 'cool_dissolve' },
  { frame: 618, type: 'emerald_flare' },
  { frame: 752, type: 'deep_dissolve' },
  { frame: 856, type: 'fastforward' },
  { frame: 966, type: 'gold_flare' },
];

const SceneTransitionOverlay: React.FC<{ frame: number }> = ({ frame }) => {
  const activeTrans = TRANSITION_FRAMES.find(
    (t) => frame >= t.frame - 7 && frame <= t.frame + 8
  );
  if (!activeTrans) return null;

  const progress = interpolate(
    frame,
    [activeTrans.frame - 7, activeTrans.frame, activeTrans.frame + 8],
    [0, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const sweepX = interpolate(
    frame,
    [activeTrans.frame - 7, activeTrans.frame + 8],
    [-40, 140],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  if (activeTrans.type === 'fastforward') {
    const badgeOpacity = interpolate(progress, [0, 0.4, 1], [0, 0.96, 1]);
    return (
      <AbsoluteFill
        style={{
          zIndex: 90,
          pointerEvents: 'none',
          backgroundColor: `rgba(8, 8, 7, ${progress * 0.58})`,
          backgroundImage: `radial-gradient(ellipse at ${sweepX}% 50%, rgba(245, 208, 97, ${progress * 0.32}) 0%, transparent 65%)`,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            opacity: badgeOpacity,
            backgroundColor: 'rgba(12, 12, 11, 0.92)',
            backdropFilter: 'blur(16px)',
            color: '#F5D061',
            padding: '18px 44px',
            borderRadius: 10,
            border: '1.5px solid rgba(245, 208, 97, 0.65)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 35px rgba(245, 208, 97, 0.18)',
            fontSize: 34,
            fontWeight: 800,
            fontFamily: 'Inter, "Helvetica Neue", sans-serif',
            letterSpacing: 6,
            textTransform: 'uppercase',
          }}
        >
          FAST FORWARD  •  TODAY
        </div>
      </AbsoluteFill>
    );
  }

  const flareColor =
    activeTrans.type === 'emerald_flare'
      ? 'rgba(168, 224, 95, 0.24)'
      : activeTrans.type === 'cool_dissolve'
      ? 'rgba(180, 205, 230, 0.16)'
      : 'rgba(245, 208, 97, 0.24)';

  // Smooth optical cinema fade + subtle horizontal anamorphic light-leak sweep
  return (
    <AbsoluteFill
      style={{
        zIndex: 90,
        pointerEvents: 'none',
        backgroundColor: `rgba(8, 8, 7, ${progress * 0.52})`,
        backgroundImage: `radial-gradient(ellipse at ${sweepX}% 48%, ${flareColor} 0%, transparent 62%)`,
      }}
    />
  );
};

// ============================================================================
// MAIN REMOTION COMPONENT (1080x1440 CINEMATIC PREMIUM EDITION)
// ============================================================================
export const Video1_TOFU_37s: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calm, natural character pose & mouth pacing (no rapid jitter)
  const poseStep = Math.floor(frame / 18); // switches pose calmly every 0.6s
  const talkStep = Math.floor(frame / 4); // natural syllabic mouth speed

  const isSilentPause =
    (frame >= 130 && frame <= 135) ||
    (frame >= 228 && frame <= 255) ||
    (frame >= 346 && frame <= 352) ||
    (frame >= 370 && frame <= 384) ||
    (frame >= 442 && frame <= 455) ||
    (frame >= 606 && frame <= 621) ||
    (frame >= 742 && frame <= 756) ||
    (frame >= 845 && frame <= 858) ||
    (frame >= 889 && frame <= 896) ||
    (frame >= 956 && frame <= 968) ||
    (frame >= 1041 && frame <= 1050);
  const isTalking = !isSilentPause && talkStep % 2 === 0;

  const sceneIndex =
    frame < 134
      ? 1
      : frame < 252
      ? 2
      : frame < 450
      ? 3
      : frame < 618
      ? 4
      : frame < 752
      ? 5
      : frame < 856
      ? 6
      : frame < 966
      ? 7
      : 8;

  const sceneStartFrame =
    sceneIndex === 1
      ? 0
      : sceneIndex === 2
      ? 134
      : sceneIndex === 3
      ? 252
      : sceneIndex === 4
      ? 450
      : sceneIndex === 5
      ? 618
      : sceneIndex === 6
      ? 752
      : sceneIndex === 7
      ? 856
      : 966;

  const localFrame = frame - sceneStartFrame;

  const activeCard =
    CAPTION_CARDS.find((c) => frame >= c.from && frame < c.to) ||
    CAPTION_CARDS[CAPTION_CARDS.length - 1];

  // Smooth optical lens settle on scene cut (1.018 -> 1.0, zero camera shake)
  const sceneEnterSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 26, stiffness: 110, mass: 1.0 },
  });
  const transitionCamScale = interpolate(sceneEnterSpring, [0, 1], [1.018, 1.0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#080807',
        overflow: 'hidden',
        fontFamily: 'Inter, "Helvetica Neue", sans-serif',
      }}
    >
      {/* ================= AUDIO ENGINE (37.0s NATURAL VOICEOVER + BALANCED TRANSITION SFX) ================= */}
      <Audio src={staticFile('assets/voiceover_tofu_37s.mp3')} volume={1.0} />
      <Audio src={staticFile('assets/bg_music.mp3')} volume={0.14} />

      <Sequence from={0} durationInFrames={95}>
        <Audio src={staticFile('assets/sfx/alarm.mp3')} volume={0.45} />
      </Sequence>
      <Sequence from={132} durationInFrames={50}>
        <Audio src={staticFile('assets/sfx/whoosh.mp3')} volume={0.45} />
      </Sequence>
      <Sequence from={250} durationInFrames={50}>
        <Audio src={staticFile('assets/sfx/shutter.mp3')} volume={0.45} />
      </Sequence>
      <Sequence from={448} durationInFrames={55}>
        <Audio src={staticFile('assets/sfx/scratch.mp3')} volume={0.45} />
      </Sequence>
      <Sequence from={616} durationInFrames={50}>
        <Audio src={staticFile('assets/sfx/snap.mp3')} volume={0.45} />
      </Sequence>
      <Sequence from={750} durationInFrames={55}>
        <Audio src={staticFile('assets/sfx/thud.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={854} durationInFrames={55}>
        <Audio src={staticFile('assets/sfx/whoosh.mp3')} volume={0.5} />
      </Sequence>
      <Sequence from={964} durationInFrames={70}>
        <Audio src={staticFile('assets/sfx/impact.mp3')} volume={0.5} />
      </Sequence>

      {/* ================= FULL-BLEED 1080x1440 LIVING PIXEL SCENE ENGINE ================= */}
      <AbsoluteFill
        style={{
          transform: `scale(${transitionCamScale})`,
        }}
      >
        {/* SCENE 1: 03:30 AM BEDROOM + CINEMATIC PULL-BACK HOOK */}
        {sceneIndex === 1 &&
          (() => {
            const hookZoom = interpolate(localFrame, [0, 42, 134], [1.07, 1.025, 1.0], {
              extrapolateRight: 'clamp',
            });

            const showJoltFrameB =
              localFrame >= 18 && (localFrame < 54 || poseStep % 2 === 1);

            const redPulse = interpolate(localFrame % 36, [0, 18, 36], [0.08, 0.2, 0.08]);

            return (
              <AbsoluteFill>
                <AbsoluteFill
                  style={{
                    transform: `scale(${hookZoom})`,
                  }}
                >
                  <Img
                    src={staticFile(
                      showJoltFrameB
                        ? 'assets/pixel/scene_1_bedroom_b.jpg'
                        : 'assets/pixel/scene_1_bedroom.jpg'
                    )}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      imageRendering: 'pixelated',
                      filter: 'contrast(1.08) saturate(1.02) brightness(0.94)',
                    }}
                  />
                  {/* Moody midnight moonlight + warm crimson alarm clock rim light */}
                  <AbsoluteFill
                    style={{
                      background: `radial-gradient(circle at 22% 68%, rgba(255, 48, 48, ${redPulse}) 0%, rgba(10, 16, 32, 0.28) 68%)`,
                      pointerEvents: 'none',
                    }}
                  />
                </AbsoluteFill>

                {/* Refined Glassmorphic 03:30 AM Timecode Pill */}
                {localFrame < 95 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 108,
                      right: 48,
                      backgroundColor: 'rgba(12, 12, 11, 0.84)',
                      backdropFilter: 'blur(12px)',
                      color: '#FAF7F0',
                      border: '1px solid rgba(245, 208, 97, 0.45)',
                      borderRadius: 8,
                      boxShadow: '0 14px 36px rgba(0, 0, 0, 0.75)',
                      padding: '10px 22px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      zIndex: 40,
                    }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: '#FF5A5F',
                        boxShadow: '0 0 12px #FF5A5F',
                      }}
                    />
                    <span
                      style={{
                        fontSize: 26,
                        fontWeight: 800,
                        letterSpacing: 3,
                        color: '#FAF7F0',
                      }}
                    >
                      03:30 AM
                    </span>
                    <span
                      style={{
                        backgroundColor: 'rgba(245, 208, 97, 0.16)',
                        color: '#F5D061',
                        border: '1px solid rgba(245, 208, 97, 0.4)',
                        borderRadius: 4,
                        padding: '3px 10px',
                        fontSize: 17,
                        fontWeight: 700,
                        letterSpacing: 2,
                      }}
                    >
                      DAY ONE
                    </span>
                  </div>
                )}
              </AbsoluteFill>
            );
          })()}

        {/* SCENE 2: WHITE KITCHEN SLAB WITH OFFICIAL LIRA BOTTLES */}
        {sceneIndex === 2 && (
          <PixelCharacterCanvasScene
            src={staticFile('assets/pixel/scene_2_kitchen_a.jpg')}
            sceneType="kitchen"
            localFrame={localFrame}
            poseStep={poseStep}
            isTalking={isTalking}
          />
        )}

        {/* SCENE 3: MODERN OFFICE BUILDING EXTERIOR (Zero Signage, Official Lira Logo!) */}
        {sceneIndex === 3 && (
          <Scene3OfficeCanvas
            localFrame={localFrame}
            poseStep={poseStep}
            isTalking={isTalking}
          />
        )}

        {/* SCENE 4: OVERPRICED 50K CAFE WITH BARISTA HANDING CUP */}
        {sceneIndex === 4 &&
          (() => {
            const useFrameB = poseStep % 2 === 1;
            const smoothScale = interpolate(localFrame, [0, 168], [1.0, 1.032], {
              extrapolateRight: 'clamp',
            });

            return (
              <AbsoluteFill style={{ transform: `scale(${smoothScale})` }}>
                <Img
                  src={staticFile(
                    useFrameB
                      ? 'assets/pixel/scene_4_cafe_b.jpg'
                      : 'assets/pixel/scene_4_cafe.jpg'
                  )}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    imageRendering: 'pixelated',
                    filter: 'contrast(1.07) saturate(0.95) brightness(0.95)',
                  }}
                />
                <AbsoluteFill
                  style={{
                    background:
                      'radial-gradient(circle at 50% 45%, transparent 45%, rgba(10, 12, 16, 0.32) 100%)',
                    pointerEvents: 'none',
                  }}
                />
              </AbsoluteFill>
            );
          })()}

        {/* SCENE 5: WORKING & TYPING ON GREEN LAPTOP */}
        {sceneIndex === 5 &&
          (() => {
            const typingFrameB = Math.floor(localFrame / 9) % 2 === 1;
            const smoothScale = interpolate(localFrame, [0, 134], [1.0, 1.032], {
              extrapolateRight: 'clamp',
            });

            return (
              <AbsoluteFill>
                <AbsoluteFill
                  style={{
                    transform: `scale(${smoothScale})`,
                  }}
                >
                  <Img
                    src={staticFile(
                      typingFrameB
                        ? 'assets/pixel/scene_5_laptop.jpg'
                        : 'assets/pixel/scene_5_laptop_a.jpg'
                    )}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      imageRendering: 'pixelated',
                      filter: 'contrast(1.08) saturate(1.04) brightness(0.95)',
                    }}
                  />
                  {/* Keep the official circular Lira bottle logos in the lower-left foreground */}
                  <Img
                    src={staticFile('assets/pixel/scene_5_laptop_a.jpg')}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      imageRendering: 'pixelated',
                      filter: 'contrast(1.08) saturate(1.04) brightness(0.95)',
                      clipPath: 'polygon(0% 62%, 34% 62%, 34% 100%, 0% 100%)',
                    }}
                  />
                </AbsoluteFill>

                {/* Warm desk key light + soft emerald laptop screen bloom */}
                <AbsoluteFill
                  style={{
                    background:
                      'radial-gradient(circle at 42% 68%, rgba(168, 224, 95, 0.14) 0%, rgba(255, 195, 115, 0.06) 42%, rgba(8, 10, 12, 0.35) 100%)',
                    pointerEvents: 'none',
                  }}
                />
              </AbsoluteFill>
            );
          })()}

        {/* SCENE 6: STRESSED HANDS UP WITH HOMEWORK & BOTTLE SEALING */}
        {sceneIndex === 6 && (
          <PixelCharacterCanvasScene
            src={staticFile('assets/pixel/scene_6_stressed_a.jpg')}
            sceneType="stressed"
            localFrame={localFrame}
            poseStep={poseStep}
            isTalking={isTalking}
          />
        )}

        {/* SCENE 7 & 8: FAST FORWARD FOCUS RITUAL & CENTERED CTA */}
        {(sceneIndex === 7 || sceneIndex === 8) && (
          <PixelCharacterCanvasScene
            src={staticFile('assets/pixel/scene_7_ritual_a.jpg')}
            sceneType="ritual"
            localFrame={localFrame}
            poseStep={poseStep}
            isTalking={isTalking}
          />
        )}
      </AbsoluteFill>

      {/* ================= GLOBAL CINEMATIC OPTICAL VIGNETTE & WARM ANAMORPHIC BLOOM ================= */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 50% 44%, rgba(255, 235, 190, 0.04) 0%, rgba(0, 0, 0, 0.0) 52%, rgba(6, 6, 5, 0.62) 100%)',
          pointerEvents: 'none',
          zIndex: 45,
        }}
      />

      {/* ================= CINEMATIC DEPTH GRADIENT FOR EDITORIAL READABILITY ================= */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(8,8,7,0.78) 0%, rgba(8,8,7,0.18) 11%, rgba(8,8,7,0.0) 22%, rgba(8,8,7,0.0) 56%, rgba(8,8,7,0.72) 79%, rgba(8,8,7,0.95) 100%)',
          pointerEvents: 'none',
          zIndex: 50,
        }}
      />

      {/* ================= TOP & BOTTOM CINEMA LETTERBOX MATTE BARS ================= */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 84,
          backgroundColor: 'rgba(8, 8, 7, 0.88)',
          backdropFilter: 'blur(14px)',
          borderBottom: '1px solid rgba(245, 208, 97, 0.24)',
          zIndex: 55,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 76,
          backgroundColor: 'rgba(8, 8, 7, 0.92)',
          backdropFilter: 'blur(14px)',
          borderTop: '1px solid rgba(245, 208, 97, 0.22)',
          zIndex: 55,
          pointerEvents: 'none',
        }}
      />

      {/* ================= LUXURY CENTERED CTA CARD (SCENE 8: Frames 966 - 1110) ================= */}
      {sceneIndex === 8 &&
        (() => {
          const ctaSpring = spring({
            frame: localFrame,
            fps,
            config: { damping: 22, stiffness: 120 },
          });
          const ctaBreath = interpolate(localFrame % 60, [0, 30, 60], [1, 1.012, 1]);
          const ctaOpacity = interpolate(localFrame, [0, 12], [0, 1], {
            extrapolateRight: 'clamp',
          });

          return (
            <div
              style={{
                position: 'absolute',
                top: 660,
                left: 0,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                zIndex: 65,
                opacity: ctaOpacity,
                transform: `scale(${ctaSpring * ctaBreath})`,
              }}
            >
              <div
                style={{
                  backgroundColor: 'rgba(12, 12, 11, 0.88)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 18,
                  border: '1.5px solid rgba(245, 208, 97, 0.58)',
                  boxShadow:
                    '0 28px 68px rgba(0, 0, 0, 0.88), 0 0 42px rgba(245, 208, 97, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
                  padding: '24px 38px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 28,
                  maxWidth: 920,
                }}
              >
                <div
                  style={{
                    width: 108,
                    height: 108,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2.5px solid #F5D061',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.65), 0 0 20px rgba(168, 224, 95, 0.25)',
                    backgroundColor: '#f7f5ee',
                    flexShrink: 0,
                  }}
                >
                  <Img
                    src={staticFile('assets/lira_logo.jpg')}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: 'scale(1.08)',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #F5D061 0%, #E0B445 100%)',
                      color: '#0A0A09',
                      padding: '10px 24px',
                      borderRadius: 8,
                      fontSize: 31,
                      fontWeight: 900,
                      letterSpacing: 2,
                      boxShadow: '0 8px 22px rgba(245, 208, 97, 0.28)',
                    }}
                  >
                    FOLLOW & CLICK LINK IN BIO
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      fontSize: 22,
                      fontWeight: 700,
                      color: '#FAF7F0',
                      letterSpacing: 3,
                    }}
                  >
                    <span style={{ color: '#A8E05F', fontWeight: 800 }}>@DRINKLIRA</span>
                    <span style={{ color: 'rgba(245, 208, 97, 0.5)' }}>•</span>
                    <span style={{ color: 'rgba(250, 247, 240, 0.85)' }}>
                      THE FOCUS RITUAL
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      {/* ================= EDITORIAL TOP CINEMA HEADER BAR ================= */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 48,
          right: 48,
          height: 84,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 60,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#A8E05F',
              boxShadow: '0 0 10px rgba(168, 224, 95, 0.8)',
              display: 'inline-block',
            }}
          />
          <span
            style={{
              color: '#FAF7F0',
              fontSize: 21,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: 'uppercase',
            }}
          >
            {activeCard.topLeft}
          </span>
        </div>

        <div
          style={{
            backgroundColor: 'rgba(245, 208, 97, 0.12)',
            color: '#F5D061',
            border: '1px solid rgba(245, 208, 97, 0.38)',
            borderRadius: 6,
            padding: '6px 16px',
            fontSize: 19,
            fontWeight: 800,
            letterSpacing: 2.5,
          }}
        >
          {activeCard.topRight}
        </div>
      </div>

      {/* ================= F-PATTERN WORD-BY-WORD CINEMA CAPTION ENGINE ================= */}
      <div
        style={{
          position: 'absolute',
          bottom: 94,
          left: 48,
          right: 48,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 14,
          zIndex: 60,
        }}
      >
        {/* PRIMARY HEADLINE WORDS (WORD-BY-WORD POP-UP) */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'baseline',
            columnGap: 18,
            rowGap: 6,
            maxWidth: 984,
          }}
        >
          {activeCard.primaryWords.map((word, idx) => {
            if (frame < word.from) return null;

            const wordAge = frame - word.from;
            const popSpring = spring({
              frame: wordAge,
              fps,
              config: { damping: 20, stiffness: 190, mass: 0.65 },
            });
            const scale = interpolate(popSpring, [0, 1], [0.92, 1]);
            const translateY = interpolate(popSpring, [0, 1], [10, 0]);
            const opacity = interpolate(wordAge, [0, 5], [0, 1], {
              extrapolateRight: 'clamp',
            });

            const nextWord = activeCard.primaryWords[idx + 1];
            const isCurrentActiveWord = !nextWord || frame < nextWord.from;

            // Premium Luxury Cinema Palette
            const colorMap = {
              yellow: '#F5D061', // Warm Champagne Gold
              lime: '#A8E05F',   // Lira Matcha Emerald
              red: '#FF5A5F',    // Cinema Crimson
              white: '#FAF7F0',  // Warm Ivory
            };
            const baseColor = colorMap[word.highlight || 'white'];
            const displayColor = isCurrentActiveWord ? '#FFE07D' : baseColor;

            return (
              <span
                key={idx}
                style={{
                  display: 'inline-block',
                  fontFamily: '"Inter", "Helvetica Neue", "Arial Black", sans-serif',
                  fontSize: 86,
                  fontWeight: 900,
                  lineHeight: 0.96,
                  letterSpacing: -1.5,
                  textTransform: 'uppercase',
                  color: displayColor,
                  opacity,
                  WebkitTextStroke: '1.5px rgba(8, 8, 7, 0.85)',
                  textShadow: isCurrentActiveWord
                    ? '0 10px 30px rgba(0, 0, 0, 0.95), 0 2px 8px rgba(0, 0, 0, 0.95), 0 0 24px rgba(245, 208, 97, 0.28)'
                    : '0 10px 28px rgba(0, 0, 0, 0.92), 0 2px 6px rgba(0, 0, 0, 0.95)',
                  transform: `translateY(${translateY}px) scale(${scale})`,
                  transformOrigin: 'bottom left',
                }}
              >
                {word.text}
              </span>
            );
          })}
        </div>

        {/* SECONDARY F-PATTERN READING BAR (FROSTED DARK GLASS) */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            columnGap: 14,
            rowGap: 4,
            backgroundColor: 'rgba(12, 12, 11, 0.82)',
            backdropFilter: 'blur(14px)',
            borderLeft: '5px solid #F5D061',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '0 10px 10px 0',
            padding: '12px 26px',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.82)',
            minHeight: 68,
          }}
        >
          {activeCard.secondaryWords.map((word, idx) => {
            if (frame < word.from) return null;

            const wordAge = frame - word.from;
            const popSpring = spring({
              frame: wordAge,
              fps,
              config: { damping: 20, stiffness: 190, mass: 0.65 },
            });
            const scale = interpolate(popSpring, [0, 1], [0.94, 1]);
            const opacity = interpolate(wordAge, [0, 5], [0, 1], {
              extrapolateRight: 'clamp',
            });

            const nextWord = activeCard.secondaryWords[idx + 1];
            const isCurrentWord = !nextWord || frame < nextWord.from;

            const colorMap = {
              yellow: '#F5D061',
              lime: '#A8E05F',
              red: '#FF5A5F',
              white: '#FAF7F0',
            };
            const wordColor = isCurrentWord
              ? '#FFE07D'
              : colorMap[word.highlight || 'white'];

            return (
              <span
                key={idx}
                style={{
                  display: 'inline-block',
                  fontSize: 42,
                  fontWeight: 800,
                  lineHeight: 1.15,
                  letterSpacing: 0.2,
                  color: wordColor,
                  opacity,
                  textShadow: '0 4px 14px rgba(0, 0, 0, 0.9)',
                  transform: `scale(${scale})`,
                }}
              >
                {word.text}
              </span>
            );
          })}
        </div>
      </div>

      {/* ================= BOTTOM LETTERBOX FOOTER & CINEMA TIMELINE BAR ================= */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 48,
          right: 48,
          height: 76,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 60,
        }}
      >
        <span
          style={{
            fontSize: 19,
            fontWeight: 700,
            color: 'rgba(245, 208, 97, 0.9)',
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}
        >
          {activeCard.bottomNote}
        </span>

        <div
          style={{
            width: 260,
            height: 6,
            borderRadius: 3,
            backgroundColor: 'rgba(250, 247, 240, 0.14)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${(frame / 1110) * 100}%`,
              height: '100%',
              borderRadius: 3,
              background: 'linear-gradient(90deg, #A8E05F 0%, #F5D061 100%)',
            }}
          />
        </div>
      </div>

      {/* ================= SCENE TRANSITION VISUAL OVERLAY ================= */}
      <SceneTransitionOverlay frame={frame} />
    </AbsoluteFill>
  );
};


