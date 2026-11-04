import fs from 'fs';
import path from 'path';

const ttfPath = path.resolve('public/fonts/Silkscreen-Regular.ttf');
const buf = fs.readFileSync(ttfPath);
const b64 = buf.toString('base64');

const fontFace = `@font-face {
  font-family: 'Silkscreen';
  src: url('data:font/truetype;charset=utf-8;base64,${b64}') format('truetype');
  font-weight: 400 900;
  font-style: normal;
  font-display: block;
}`;

const out = `// Auto-generated offline fonts
export const FONT_STYLE = \`${fontFace}\`;
export const FONT_PIXEL = '"Silkscreen", monospace';
export const FONT_SANS = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Helvetica Neue", Arial, sans-serif';
`;

fs.writeFileSync(path.resolve('src/fonts.ts'), out);
console.log('src/fonts.ts written successfully, bytes:', out.length);
