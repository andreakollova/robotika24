// Save article image - two versions:
// 1. Small for web (public/images/) - 800x500 q70
// 2. Large for IG (public/ig-images/) - 1600x1000 q90, deleted after IG publish
import sharp from 'sharp';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const imgDir = resolve(__dirname, '../public/images');
const igDir = resolve(__dirname, '../public/ig-images');
if (!existsSync(imgDir)) mkdirSync(imgDir, { recursive: true });
if (!existsSync(igDir)) mkdirSync(igDir, { recursive: true });

export async function saveArticleImage(imageUrl, slug) {
  try {
    const res = await fetch(imageUrl, { redirect: 'follow' });
    if (!res.ok) return null;

    const rawBuf = Buffer.from(await res.arrayBuffer());
    if (rawBuf.length < 5000) return null;

    const filename = slug.substring(0, 80) + '.jpg';

    // Web version - small, optimized
    const webBuf = await sharp(rawBuf)
      .resize(800, 500, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 70 })
      .toBuffer();
    writeFileSync(resolve(imgDir, filename), webBuf);

    // IG version - large, high quality
    const igBuf = await sharp(rawBuf)
      .resize(1600, 1000, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 90 })
      .toBuffer();
    writeFileSync(resolve(igDir, filename), igBuf);

    console.log(`  Image saved: web ${Math.round(webBuf.length / 1024)}KB, IG ${Math.round(igBuf.length / 1024)}KB`);

    return `/images/${filename}`;
  } catch (err) {
    console.error('  Image save error:', err.message);
    return null;
  }
}
