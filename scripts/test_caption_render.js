const puppeteer = require('/Users/caleb/.gemini/antigravity/scratch/lira-remotion/node_modules/puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 600 });
  
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=swap" rel="stylesheet">
    <style>
      body { background: #333; display: flex; flex-direction: column; gap: 40px; padding: 40px; align-items: center; justify-content: center; }
      .title { color: #aaa; font-family: sans-serif; font-size: 18px; margin-bottom: 8px; }
      
      /* Old cranky way */
      .old-way {
        font-family: 'Montserrat', sans-serif;
        font-size: 64px;
        font-weight: 900;
        text-transform: uppercase;
        color: #FFFFFF;
        text-shadow:
          -3px -3px 0 #000,
           3px -3px 0 #000,
          -3px  3px 0 #000,
           3px  3px 0 #000,
           0px  4px 12px rgba(0, 0, 0, 0.95),
           0px  8px 24px rgba(0, 0, 0, 0.75);
        -webkit-text-stroke: 2.5px #000000;
      }

      /* Clean SVG text with round linejoin */
      .svg-box text {
        font-family: 'Montserrat', sans-serif;
        font-weight: 900;
        text-transform: uppercase;
        stroke: #000000;
        stroke-width: 12px;
        stroke-linejoin: round;
        stroke-linecap: round;
        paint-order: stroke fill;
        fill: #FFFFFF;
        filter: drop-shadow(0px 6px 12px rgba(0,0,0,0.8));
      }

      /* Clean CSS with multiple drop-shadows and paint-order */
      .css-clean {
        font-family: 'Montserrat', sans-serif;
        font-size: 64px;
        font-weight: 900;
        text-transform: uppercase;
        color: #FFFFFF;
        -webkit-text-stroke: 3px #000000;
        paint-order: stroke fill;
        filter: drop-shadow(0 4px 6px rgba(0,0,0,0.9));
      }
      
      /* Pure multi-shadow (no text-stroke at all) */
      .shadow-only {
        font-family: 'Montserrat', sans-serif;
        font-size: 64px;
        font-weight: 900;
        text-transform: uppercase;
        color: #FFFFFF;
        text-shadow:
          -2px -2px 0 #000,  2px -2px 0 #000, -2px  2px 0 #000,  2px  2px 0 #000,
          -3px  0px 0 #000,  3px  0px 0 #000,  0px -3px 0 #000,  0px  3px 0 #000,
          0 5px 12px rgba(0,0,0,0.9);
      }
    </style>
  </head>
  <body>
    <div>
      <div class="title">1. CURRENT (Notice the extra lines / spikes inside A, R, B):</div>
      <div class="old-way">UDAH BERUBAH JADI</div>
    </div>
    <div>
      <div class="title">2. SVG TEXT (stroke-linejoin: round, paint-order: stroke fill):</div>
      <div class="svg-box">
        <svg width="850" height="90" viewBox="0 0 850 90">
          <text x="50%" y="70" text-anchor="middle" font-size="64">UDAH BERUBAH JADI</text>
        </svg>
      </div>
    </div>
    <div>
      <div class="title">3. PURE MULTI-SHADOW (No text-stroke):</div>
      <div class="shadow-only">UDAH BERUBAH JADI</div>
    </div>
  </body>
  </html>
  `;
  
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: '/Users/caleb/.gemini/antigravity/brain/f18f0beb-93e2-4242-821c-d5f2f1299248/caption_comparison.png' });
  await browser.close();
  console.log('Saved caption_comparison.png');
})();
