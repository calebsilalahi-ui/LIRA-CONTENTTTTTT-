const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const FFMPEG = '/Users/caleb/.local/bin/ffmpeg';
const inputAudio = '/Users/caleb/.gemini/antigravity/brain/f18f0beb-93e2-4242-821c-d5f2f1299248/.user_uploaded/uploaded_media_1792622650081.mp3';
const outputAudio = '/Users/caleb/.gemini/antigravity/scratch/lira-remotion/public/assets/voiceover_cup_vs_bottle_tight.mp3';

// Accurate segment intervals (cutting out dead air & sigh, preserving clean word attacks)
// 1. "Pernah nggak lo sadar kalau beli matcha di cup plastik itu sebenarnya nyusahin hidup?" (0.00s - 4.30s)
// [Cut sigh at 4.30s - 5.60s]
// 2. "Lo dipaksa megang cup-nya terus-terusan," (5.60s - 7.82s)
// 3. "es batunya mencair bikin rasa hambar," (8.19s - 10.31s)
// 4. "dan lo nggak bisa masukin ke dalam tas karena pasti tumpah." (10.65s - 13.60s)
// 5. "Di Lira, kita menolak jualan pakai cup." (13.92s - 16.15s)
// 6. "Seluruh batch Lira sengaja kita kunci di botol tebal dengan tutup segel rapat." (16.48s - 20.40s)
// 7. "Lo bisa lempar botolnya ke dalam tote bag samping laptop," (20.80s - 23.25s)
// 8. "lo simpen di kulkas buat diminum nanti malam, dan rasanya tetap konsisten." (23.55s - 27.46s)
// 9. "100% Oatside murni ketemu premium matcha pekat." (27.70s - 30.65s)
// 10. "We sell convenience and premium taste." (31.10s - 33.30s)
// 11. "Batch dingin Sabtu ini udah dibuka di bio." (33.60s - 35.58s)
// 12. "Click link in bio right now." (35.90s - 37.60s)

const segments = [
  { start: 0.00, end: 4.30 },
  { start: 5.60, end: 7.82 },
  { start: 8.19, end: 10.31 },
  { start: 10.65, end: 13.60 },
  { start: 13.92, end: 16.15 },
  { start: 16.48, end: 20.40 },
  { start: 20.80, end: 23.25 },
  { start: 23.55, end: 27.46 },
  { start: 27.70, end: 30.65 },
  { start: 31.10, end: 33.30 },
  { start: 33.60, end: 35.58 },
  { start: 35.90, end: 37.60 },
];

const filterParts = [];
segments.forEach((seg, i) => {
  filterParts.push(`[0:a]atrim=start=${seg.start}:end=${seg.end},asetpts=PTS-STARTPTS[a${i}]`);
});
const concatInputs = segments.map((_, i) => `[a${i}]`).join('');
const filterComplex = `${filterParts.join(';')};${concatInputs}concat=n=${segments.length}:v=0:a=1[outa]`;

console.log('Trimming and tightening audio with ffmpeg...');
execFileSync(FFMPEG, [
  '-y',
  '-i', inputAudio,
  '-filter_complex', filterComplex,
  '-map', '[outa]',
  '-codec:a', 'libmp3lame',
  '-qscale:a', '2',
  outputAudio
]);

console.log(`✓ Clean tightened audio saved to: ${outputAudio}`);
