// Comau press release scraper for robotika24
// Comau is an Italian industrial robotics company - always mention this in articles
// Permission granted to scrape from https://www.comau.com/en/media-and-news/press-release/
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { load } from 'cheerio';

const __dirname = dirname(fileURLToPath(import.meta.url));
try {
  const envFile = readFileSync(resolve(__dirname, '..', '.env.local'), 'utf8');
  envFile.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key && vals.length && !process.env[key.trim()]) process.env[key.trim()] = vals.join('=').trim();
  });
} catch {}

const SUPABASE_URL = 'https://odpwfmrllqjdzgbgrxfc.supabase.co';
const supabase = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK_URL;
const LIMIT = parseInt(process.argv[2] || '10');
const USER_AGENT = 'robotika24-bot/1.0 (+https://robotika24.sk; studio@drixton.com)';

function slugify(t) { return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 60); }
function stripHtml(h) { return (h || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }

async function articleExists(url) {
  const { data } = await supabase.from('articles').select('id').eq('source_url', url).limit(1);
  return data && data.length > 0;
}

async function writeArticle(title, content, sourceUrl) {
  const prompt = `Na základe faktov napíš VLASTNÝ slovenský článok o talianskej robotickej firme Comau.

KRITICKÉ PRAVIDLÁ:
- VŽDY v texte jasne uveď že Comau je talianska robotická firma (napr. "Talianska robotická spoločnosť Comau..." alebo "Firma Comau so sídlom v Turíne...").
- NADPIS: 10-14 slov, zaujímavý, s konkrétnym faktom. Dvojbodku použi ak je názov firmy/produktu a za ním popis. Píš ako novinár denníka SME.
- EXCERPT: 6-8 viet s **bold** na dôležitých slovách (firmy, technológie, čísla). Každá veta musí končiť bodkou.
- CONTENT: Plný článok s ## nadpismi pre sekcie. Kľúčové pojmy boldni.
- NIKDY NEPREKLADAJ mená ľudí a názvy firiem/technológií.
- DIAKRITIKA JE POVINNÁ v KAŽDOM slove.
- Správne skloňovanie: "robotická ruka" (nie "robotický ruka").
- Nikdy nepoužívaj dlhé pomlčky (em-dash — ani en-dash –). Vždy iba krátku pomlčku -.

Na konci obsahu VŽDY pridaj:

## Zdroj
Zdroj: Comau
Originál: ${sourceUrl}
Spracovanie: Redakcia robotika24

Vráť VÝHRADNE JSON bez iného textu: {"title":"...","excerpt":"...","content":"..."}

Fakty:
${title}
${content}`;

  const res = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  });
  const text = res.content[0].text.trim().replace(/```json\s*/g, '').replace(/```\s*/g, '');
  const parsed = JSON.parse(text);
  parsed.title = parsed.title.replace(/[—–]/g, '-');
  parsed.excerpt = parsed.excerpt.replace(/[—–]/g, '-');
  parsed.content = parsed.content.replace(/[—–]/g, '-');
  return parsed;
}

// Scrape a single Comau article page
async function scrapeArticlePage(url) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) return null;
  const html = await res.text();
  const $ = load(html);

  // Get OG image
  let imageUrl = $('meta[property="og:image"]').attr('content') || null;

  // Get article text
  const paragraphs = [];
  $('.entry-content p, .post-content p, article p, .press-release-content p').each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 20) paragraphs.push(text);
  });

  // Fallback: all p tags in main content area
  if (paragraphs.length === 0) {
    $('main p, .content p, .page-content p').each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length > 20) paragraphs.push(text);
    });
  }

  return { imageUrl, content: paragraphs.join('\n\n').substring(0, 4000) };
}

// Scrape from RSS feed
async function fetchFromRSS() {
  console.log('Fetching Comau RSS feed...');
  const res = await fetch('https://www.comau.com/en/feed/', { headers: { 'User-Agent': USER_AGENT } });
  const xml = await res.text();
  const $ = load(xml, { xml: true });
  const items = [];
  $('item').each((_, el) => {
    const title = $(el).find('title').text().trim();
    const link = $(el).find('link').text().trim();
    const date = $(el).find('pubDate').text().trim();
    const desc = stripHtml($(el).find('description').text());
    if (title && link && link.includes('comau.com')) {
      items.push({ title, link, date, desc });
    }
  });
  console.log(`  Found ${items.length} items in RSS`);
  return items;
}

// Process specific URLs passed as arguments
async function fetchFromURLs(urls) {
  const items = [];
  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
      const html = await res.text();
      const $ = load(html);
      const title = $('meta[property="og:title"]').attr('content') || $('title').text() || '';
      const date = $('meta[property="article:published_time"]').attr('content') || new Date().toISOString();
      const desc = $('meta[property="og:description"]').attr('content') || '';
      items.push({ title: title.trim(), link: url, date, desc: desc.trim() });
    } catch (e) {
      console.error(`  Error fetching ${url}: ${e.message}`);
    }
  }
  return items;
}

async function main() {
  console.log('=== Comau Scraper for robotika24 ===');
  console.log(`Time: ${new Date().toISOString()}`);

  const { data: cat } = await supabase.from('categories').select('id').eq('slug', 'priemysel').single();
  const categoryId = cat?.id;

  // Check for specific URLs in arguments
  const urlArgs = process.argv.slice(2).filter(a => a.startsWith('http'));
  const limitArg = process.argv.slice(2).find(a => !a.startsWith('http'));

  let allItems;
  if (urlArgs.length > 0) {
    allItems = await fetchFromURLs(urlArgs);
  } else {
    allItems = await fetchFromRSS();
  }

  const limit = limitArg ? parseInt(limitArg) : LIMIT;
  let inserted = 0;
  const insertedArticles = [];

  for (const item of allItems) {
    if (inserted >= limit) break;
    if (await articleExists(item.link)) { console.log(`  SKIP (exists): ${item.title.substring(0, 50)}`); continue; }

    // Scrape article page for image and full text
    console.log(`  Scraping: ${item.title.substring(0, 50)}...`);
    const pageData = await scrapeArticlePage(item.link);
    const textContent = pageData?.content || item.desc;
    let imageUrl = pageData?.imageUrl;

    if (!imageUrl) { console.log('  SKIP (no image)'); continue; }

    await new Promise(r => setTimeout(r, 3000));

    // Write article
    console.log(`  Writing article...`);
    try {
      const article = await writeArticle(item.title, textContent, item.link);
      const slug = slugify(article.title) + '-' + Date.now().toString(36);

      // Upload image to Supabase Storage
      try {
        const imgRes = await fetch(imageUrl, { redirect: 'follow' });
        if (imgRes.ok) {
          const ct = imgRes.headers.get('content-type') || 'image/jpeg';
          const ext = ct.includes('webp') ? 'webp' : ct.includes('png') ? 'png' : 'jpg';
          const buf = Buffer.from(await imgRes.arrayBuffer());
          const storagePath = slug.substring(0, 80) + '.' + ext;
          const { error: upErr } = await supabase.storage.from('article-images').upload(storagePath, buf, { contentType: ct, upsert: true });
          if (!upErr) {
            imageUrl = `${SUPABASE_URL}/storage/v1/object/public/article-images/${storagePath}`;
            console.log('  Image uploaded to Storage');
          }
        }
      } catch (imgErr) { console.error('  Image upload error:', imgErr.message); }

      await supabase.from('articles').insert({
        title: article.title, slug, excerpt: article.excerpt, content: article.content,
        image_url: imageUrl, category_id: categoryId,
        author: inserted % 2 === 0 ? 'Martin Kováč' : 'Simona Hrušková',
        source_url: item.link, source_name: 'Comau',
        is_featured: inserted < 2, is_published: true,
        published_at: new Date(item.date || Date.now()).toISOString(),
      });
      console.log(`  OK: ${article.title.substring(0, 60)}`);
      insertedArticles.push({ title: article.title, slug, imageUrl });
      inserted++;
    } catch (err) { console.error(`  Error: ${err.message}`); }
    await new Promise(r => setTimeout(r, 3000));
  }

  // Slack notification
  if (SLACK_WEBHOOK && insertedArticles.length > 0) {
    const siteUrl = process.env.SITE_URL || 'https://robotika24.sk';
    const blocks = [{ type: 'header', text: { type: 'plain_text', text: `Comau - ${inserted} nových článkov` } }, { type: 'divider' }];
    for (const art of insertedArticles) {
      const url = siteUrl + '/clanok/' + art.slug;
      if (art.imageUrl) blocks.push({ type: 'image', image_url: art.imageUrl, alt_text: art.title, title: { type: 'plain_text', text: art.title } });
      blocks.push({ type: 'section', text: { type: 'mrkdwn', text: `*<${url}|${art.title}>*` } });
      blocks.push({ type: 'divider' });
    }
    await fetch(SLACK_WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ blocks }) }).catch(() => {});
    console.log('\nSlack sent!');
  }

  console.log(`\nDone! Inserted: ${inserted}`);
}

main().catch(console.error);
