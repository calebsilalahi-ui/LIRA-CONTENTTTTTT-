import { execFileSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const ASSETS_DIR = '/Users/caleb/.gemini/antigravity/scratch/lira-remotion/public/assets';
const FFMPEG = '/Users/caleb/.gemini/antigravity/scratch/lira-remotion/node_modules/@remotion/compositor-darwin-arm64/ffmpeg';
const LIB_DIR = '/Users/caleb/.gemini/antigravity/scratch/lira-remotion/node_modules/@remotion/compositor-darwin-arm64';

const inputMp3 = path.join(ASSETS_DIR, 'voiceover_tofu.mp3');
const out24sMp3 = path.join(ASSETS_DIR, 'voiceover_tofu_24s.mp3');

// Each beat in the 745-frame (24.83s) composition starts at:
// Beat 1: 0.0s (dur 3.0s)   - "Tepat setahun yang lalu, pas temen-temen seumuran gue masih tidur pules" (0.05s -> 4.32s = 4.27s)
// Beat 2: 3.0s (dur 3.0s)   - "alarm gue udah bunyi jam setengah empat pagi di dapur kecil ini." (4.55s -> 7.55s = 3.00s)
// Beat 3: 6.0s (dur 3.0s)   - "Gue masih anak sekolah kejuruan, dan jujur" (9.45s -> 12.31s = 2.86s) + "gue nggak punya backup plan sama sekali." (12.87s -> 14.73s = 1.86s) -> total 4.72s
// Beat 4: 9.0s (dur 3.0s)   - "Gue cuma muak lihat minuman kafe 50 ribuan yang isinya cuma perisa sama krimer nabati." (15.22s -> 20.20s = 4.98s)
// Beat 5: 12.0s (dur 3.0s)  - "Tapi ngejalanin brand sendiri sambil ngejar tugas sekolah itu brutal." (20.75s -> 24.75s = 4.00s)
// Beat 6: 15.0s (dur 3.0s)  - "Sering banget gue stres mikirin tugas sambil nge-seal botol Lira." (25.25s -> 28.18s = 2.93s)
// Beat 7: 18.0s (dur 3.0s)  - "Fast forward hari ini:" (28.64s -> 29.63s = 0.99s) + "Lira nemenin ritual fokus kalian." (30.08s -> 31.92s = 1.84s) -> total 2.83s
// Beat 8: 21.0s (dur 3.83s) - "Mau lihat gimana anak SMA scale brand ini dari nol?" (32.28s -> 34.71s = 2.43s) + "Follow me and click link in bio." (35.09s -> 36.70s = 1.61s) -> total 4.04s

const filterComplex = [
  // Beat 1: 4.27s -> fit into 2.88s (atempo=1.48)
  `[0:a]atrim=start=0.05:end=4.32,asetpts=PTS-STARTPTS,atempo=1.48,apad=whole_dur=3.0[b1]`,
  // Beat 2: 3.00s -> fit into 2.92s (atempo=1.04)
  `[0:a]atrim=start=4.55:end=7.55,asetpts=PTS-STARTPTS,atempo=1.04,apad=whole_dur=3.0[b2]`,
  // Beat 3: concat 9.45..12.31 and 12.87..14.73 (4.72s) -> fit into 2.90s (atempo=1.62)
  `[0:a]atrim=start=9.45:end=12.31,asetpts=PTS-STARTPTS[b3a]`,
  `[0:a]atrim=start=12.87:end=14.73,asetpts=PTS-STARTPTS[b3b]`,
  `[b3a][b3b]concat=n=2:v=0:a=1,atempo=1.62,apad=whole_dur=3.0[b3]`,
  // Beat 4: 15.22..20.20 (4.98s) -> fit into 2.92s (atempo=1.70)
  `[0:a]atrim=start=15.22:end=20.20,asetpts=PTS-STARTPTS,atempo=1.70,apad=whole_dur=3.0[b4]`,
  // Beat 5: 20.75..24.75 (4.00s) -> fit into 2.90s (atempo=1.38)
  `[0:a]atrim=start=20.75:end=24.75,asetpts=PTS-STARTPTS,atempo=1.38,apad=whole_dur=3.0[b5]`,
  // Beat 6: 25.25..28.18 (2.93s) -> fit into 2.90s (atempo=1.02)
  `[0:a]atrim=start=25.25:end=28.18,asetpts=PTS-STARTPTS,atempo=1.02,apad=whole_dur=3.0[b6]`,
  // Beat 7: concat 28.64..29.63 and 30.08..31.92 (2.83s) -> fit into 2.90s (atempo=1.0)
  `[0:a]atrim=start=28.64:end=29.63,asetpts=PTS-STARTPTS[b7a]`,
  `[0:a]atrim=start=30.08:end=31.92,asetpts=PTS-STARTPTS[b7b]`,
  `[b7a][b7b]concat=n=2:v=0:a=1,apad=whole_dur=3.0[b7]`,
  // Beat 8: concat 32.28..34.71 and 35.09..36.70 (4.04s) -> fit into 3.75s (atempo=1.08)
  `[0:a]atrim=start=32.28:end=34.71,asetpts=PTS-STARTPTS[b8a]`,
  `[0:a]atrim=start=35.09:end=36.70,asetpts=PTS-STARTPTS[b8b]`,
  `[b8a][b8b]concat=n=2:v=0:a=1,atempo=1.08,apad=whole_dur=3.833[b8]`,
  // Concat all 8 beats -> exact 24.833s (745 frames at 30fps)
  `[b1][b2][b3][b4][b5][b6][b7][b8]concat=n=8:v=0:a=1[outa]`,
].join(';');

execFileSync(
  FFMPEG,
  [
    '-y',
    '-i',
    inputMp3,
    '-filter_complex',
    filterComplex,
    '-map',
    '[outa]',
    '-codec:a',
    'libmp3lame',
    '-b:a',
    '192k',
    out24sMp3,
  ],
  {
    env: { ...process.env, DYLD_LIBRARY_PATH: LIB_DIR },
    stdio: 'inherit',
  }
);

console.log('Generated beat-synced 24.8s voiceover:', out24sMp3);
