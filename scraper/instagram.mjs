import sharp from 'sharp';
import { readFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const W = 1086;
const H = 1448;

// Wrap text into lines that fit within maxWidth (approximate char count)
function wrapText(text, maxChars) {
  const words = text.split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length > maxChars && current) {
      lines.push(current.trim());
      current = word;
    } else {
      current = current ? current + ' ' + word : word;
    }
  }
  if (current.trim()) lines.push(current.trim());
  return lines;
}

function createTextSvg(text, { color = '#ffffff', fontSize = 48, maxWidth = 900, y = 0, fontWeight = '700', align = 'start' }) {
  const maxChars = Math.floor(maxWidth / (fontSize * 0.52));
  const lines = wrapText(text, maxChars);
  const lineHeight = fontSize * 1.25;
  const totalHeight = lines.length * lineHeight;
  const anchor = align === 'center' ? 'middle' : 'start';
  const xPos = align === 'center' ? W / 2 : (W - maxWidth) / 2;

  const textElements = lines.map((line, i) =>
    `<text x="${xPos}" y="${y + i * lineHeight + fontSize}" font-family="Inter, -apple-system, sans-serif" font-size="${fontSize}" font-weight="${fontWeight}" fill="${color}" text-anchor="${anchor}">${escapeXml(line)}</text>`
  ).join('\n');

  return { svg: textElements, height: totalHeight };
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Generate slide 1: template + article image behind + title in lower third
async function generateSlide1(articleImage, title, theme) {
  const templatePath = resolve(__dirname, `templates/${theme}/slide1.png`);
  const template = sharp(templatePath);
  const color = theme === 'modry' ? '#ffffff' : '#0c1a26';

  // Download article image
  let articleImg = null;
  try {
    const imgRes = await fetch(articleImage, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
    });
    if (imgRes.ok && imgRes.headers.get('content-type')?.startsWith('image')) {
      const imgBuf = Buffer.from(await imgRes.arrayBuffer());
      articleImg = await sharp(imgBuf)
        .resize(W - 120, H - 380, { fit: 'cover', position: 'center' })
        .toBuffer();
    }
  } catch {};

  // Create title SVG overlay
  const titleLines = wrapText(title, 22);
  const lineHeight = 52;
  const titleStartY = H - 200 - (titleLines.length * lineHeight);

  const titleSvg = titleLines.map((line, i) =>
    `<text x="70" y="${titleStartY + i * lineHeight + 44}" font-family="Inter, -apple-system, sans-serif" font-size="44" font-weight="800" fill="${color}">${escapeXml(line)}</text>`
  ).join('\n');

  const svgOverlay = Buffer.from(`<svg width="${W}" height="${H}">
    <defs>
      <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0.5" stop-color="${theme === 'modry' ? '#0c1a26' : '#ffffff'}" stop-opacity="0"/>
        <stop offset="1" stop-color="${theme === 'modry' ? '#0c1a26' : '#ffffff'}" stop-opacity="0.85"/>
      </linearGradient>
    </defs>
    <rect x="60" y="130" width="${W - 120}" height="${H - 330}" rx="8" fill="none"/>
    <rect x="0" y="${H - 400}" width="${W}" height="400" fill="url(#fade)"/>
    ${titleSvg}
  </svg>`);

  const composites = [];
  if (articleImg) composites.push({ input: articleImg, top: 150, left: 60 });
  composites.push({ input: svgOverlay, top: 0, left: 0 });

  return sharp(templatePath)
    .composite(composites)
    .png()
    .toBuffer();
}

// Generate slide 2: template + excerpt text
async function generateSlide2(excerpt, theme) {
  const templatePath = resolve(__dirname, `templates/${theme}/slide2.png`);
  const color = theme === 'modry' ? '#ffffff' : '#0c1a26';

  const lines = wrapText(excerpt, 28);
  const lineHeight = 40;
  const startY = 200;

  const textSvg = lines.map((line, i) =>
    `<text x="70" y="${startY + i * lineHeight + 34}" font-family="Inter, -apple-system, sans-serif" font-size="34" font-weight="500" fill="${color}">${escapeXml(line)}</text>`
  ).join('\n');

  const svgOverlay = Buffer.from(`<svg width="${W}" height="${H}">${textSvg}</svg>`);

  return sharp(templatePath)
    .composite([{ input: svgOverlay, top: 0, left: 0 }])
    .png()
    .toBuffer();
}

// Slide 3 is just the template as-is
async function generateSlide3(theme) {
  const templatePath = resolve(__dirname, `templates/${theme}/slide3.png`);
  return readFileSync(templatePath);
}

// Main export
export async function generateCarousel(article, postIndex) {
  const theme = postIndex % 2 === 0 ? 'modry' : 'biely';
  const outputDir = resolve(__dirname, '../public/ig');
  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

  const slug = article.slug || 'post';
  const prefix = `${outputDir}/${slug}`;

  console.log(`  IG: Generating ${theme} carousel for: ${article.title.substring(0, 50)}...`);

  try {
    const slide1 = await generateSlide1(article.image_url, article.title, theme);
    const slide2 = await generateSlide2(article.excerpt || article.title, theme);
    const slide3 = await generateSlide3(theme);

    const { writeFileSync } = await import('fs');
    writeFileSync(`${prefix}-1.png`, slide1);
    writeFileSync(`${prefix}-2.png`, slide2);
    writeFileSync(`${prefix}-3.png`, slide3);

    console.log(`  IG: Saved 3 slides to /public/ig/${slug}-*.png`);
    return { theme, slides: [`${prefix}-1.png`, `${prefix}-2.png`, `${prefix}-3.png`] };
  } catch (err) {
    console.error(`  IG: Error generating carousel: ${err.message}`);
    return null;
  }
}
