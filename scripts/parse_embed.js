const fs = require('fs');

const html = fs.readFileSync('scripts/ig_embed.html', 'utf-8');

const imgUrls = [...html.matchAll(/https:\/\/[^"'\s<>]*(?:fbcdn\.net|cdninstagram\.com)[^"'\s<>]*/g)]
  .map(m => m[0].replace(/&amp;/g, '&'));
const uniqueImgs = [...new Set(imgUrls)].filter(u => !u.includes('/rsrc.php/'));
console.log('Unique content images found:', uniqueImgs.length);
uniqueImgs.forEach((u, i) => console.log(`[Image ${i + 1}] ${u}`));

const captionMatch = html.match(/class="Caption"[^>]*>([\s\S]*?)<\/div>/);
if (captionMatch) {
  console.log('\n--- CAPTION ---');
  console.log(captionMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

// Search for any JSON structures
const jsonMatches = [...html.matchAll(/\{"context":[\s\S]*?\}(?=;<\/script>)/g)];
console.log('\nJSON matches:', jsonMatches.length);
