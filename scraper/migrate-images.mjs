// Migration: Download all images from Supabase Storage → public/images/
// Then update DB URLs to point to Vercel (/images/filename.jpg)
// Run once: node scraper/migrate-images.mjs
import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
try {
  const envFile = (await import('fs')).readFileSync(resolve(__dirname, '..', '.env.local'), 'utf8');
  envFile.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key && vals.length && !process.env[key.trim()]) process.env[key.trim()] = vals.join('=').trim();
  });
} catch {}

const SUPABASE_URL = 'https://odpwfmrllqjdzgbgrxfc.supabase.co';
const supabase = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const SITE_URL = process.env.SITE_URL || 'https://www.robotika24.sk';
const imgDir = resolve(__dirname, '../public/images');
if (!existsSync(imgDir)) mkdirSync(imgDir, { recursive: true });

async function main() {
  console.log('=== Migrate Images: Supabase Storage → public/images/ ===');

  // 1. Get all articles with Supabase image URLs
  const { data: articles, error } = await supabase
    .from('articles').select('id, slug, image_url')
    .eq('is_published', true);

  if (error) { console.error('DB Error:', error.message); process.exit(1); }

  const toMigrate = articles.filter(a => a.image_url?.includes('supabase.co'));
  console.log(`Found ${toMigrate.length} articles with Supabase images`);

  let ok = 0, fail = 0;
  for (const a of toMigrate) {
    const filename = a.image_url.split('/').pop();
    const localPath = resolve(imgDir, filename);

    try {
      const res = await fetch(a.image_url);
      if (!res.ok) { console.log('FAIL fetch:', filename, res.status); fail++; continue; }

      const buf = Buffer.from(await res.arrayBuffer());
      writeFileSync(localPath, buf);

      // Update DB to use local path
      const newUrl = `/images/${filename}`;
      await supabase.from('articles').update({ image_url: newUrl }).eq('id', a.id);
      console.log('OK:', filename, Math.round(buf.length / 1024) + 'KB');
      ok++;
    } catch (e) {
      console.log('ERR:', filename, e.message);
      fail++;
    }
  }

  // 2. Also migrate IG fallback images
  const fallbacks = ['agility-fallback.jpg', ...Array.from({length: 5}, (_, i) => `agility-fallback-${i+1}.jpg`)];
  for (const name of fallbacks) {
    try {
      const url = `${SUPABASE_URL}/storage/v1/object/public/article-images/${name}`;
      const res = await fetch(url);
      if (res.ok) {
        writeFileSync(resolve(imgDir, name), Buffer.from(await res.arrayBuffer()));
        console.log('Fallback OK:', name);
      }
    } catch {}
  }

  console.log(`\nDone! OK: ${ok}, Failed: ${fail}`);
  console.log('\nNext steps:');
  console.log('1. git add public/images/ && git commit && git push');
  console.log('2. Delete Supabase Storage bucket content');
}

main().catch(console.error);
