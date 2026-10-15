// AutoStore news scraper for robotika24
// AutoStore is a Norwegian automated storage and retrieval company from Nedre Vats
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import sharp from 'sharp';
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
const USER_AGENT = 'robotika24-bot/1.0 (+https://robotika24.sk)';

function slugify(t) { return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 60); }
function stripHtml(h) { return (h || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }

async function articleExists(url) {
  const { data } = await supabase.from('articles').select('id').eq('source_url', url).limit(1);
  return data && data.length > 0;
}

async function writeArticle(title, content, sourceUrl) {
  const prompt = `Na základe faktov napíš VLASTNÝ slovenský spravodajský článok VLASTNÝMI SLOVAMI. NIKDY nekopíruj ani neprekladaj pôvodný text - prepíš ho úplne od začiatku na základe faktov.

KRITICKÉ PRAVIDLÁ:
- V EXCERPTE raz krátko spomeni pôvod firmy. V nadpise ani v texte článku krajinu neopakuj.
- NIKDY nepoužívaj dvojbodku v nadpise ani v podnadpisoch (## ). Vždy píš plynulé vety.
- NADPIS: 10-14 slov, zaujímavý, s konkrétnym faktom. Plynulá veta bez dvojbodky.
- EXCERPT: 6-8 viet s **bold** na dôležitých slovách. Každá veta musí končiť bodkou.
- CONTENT: Vlastný článok s ## nadpismi. Kľúčové pojmy boldni. Píš VLASTNÝMI slovami, nie preklad.
- NIKDY NEPREKLADAJ mená ľudí a názvy firiem/technológií.
- DIAKRITIKA JE POVINNÁ v KAŽDOM slove.
- Nikdy nepoužívaj dlhé pomlčky. Vždy iba krátku pomlčku -.

Vráť VÝHRADNE JSON: {"title":"...","excerpt":"...","content":"..."}

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

// Custom image URL overrides for specific articles
const IMAGE_OVERRIDES = {
  'autostore-advances-the-path-toward-autonomy-with-fall-2026-product-announcement':
    'https://www.autostoresystem.com/hs-fs/hubfs/02%20Website/Fall%202026%20Product%20Annoucement_Placeholder%20files/Web%20page%20Images/Fall%2026%20PA_Press%20release_(Post%20body)%20CubeExplore_Placeholder.jpg?width=1340&height=1004&name=Fall%2026%20PA_Press%20release_(Post%20body)%20CubeExplore_Placeholder.jpg',
};

async function scrapeArticlePage(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
  });
  if (!res.ok) return null;
  const html = await res.text();
  const $ = load(html);

  let imageUrl = $('meta[property="og:image"]').attr('content') || null;
  const title = ($('meta[property="og:title"]').attr('content') || $('title').text() || '').replace(/\s*[|\-].*AutoStore.*$/i, '');
  const desc = $('meta[property="og:description"]').attr('content') || '';
  const date = $('meta[property="article:published_time"]').attr('content') || '';

  // Check for image override
  const urlSlug = url.split('/').pop();
  if (IMAGE_OVERRIDES[urlSlug]) imageUrl = IMAGE_OVERRIDES[urlSlug];

  const paragraphs = [];
  $('article p, .blog-post-body p, .post-body p').each((_, el) => {
    const text = $(el).text().trim();
    if (text.length > 20) paragraphs.push(text);
  });
  if (paragraphs.length === 0) {
    $('p').each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 30 && !text.includes('cookie') && !text.includes('Subscribe') && !text.includes('Contact')) paragraphs.push(text);
    });
  }

  return { title: title.trim(), desc: desc.trim(), date, imageUrl, content: paragraphs.join('\n\n').substring(0, 4000) };
}

async function main() {
  console.log('=== AutoStore Scraper ===');
  console.log(`Time: ${new Date().toISOString()}`);

  // Fetch from RSS
  const res = await fetch('https://www.autostoresystem.com/news/rss.xml', { headers: { 'User-Agent': USER_AGENT } });
  const xml = await res.text();
  const $ = load(xml, { xml: true });
  const rssItems = [];
  $('item').each((_, el) => {
    const title = $(el).find('title').text().trim();
    const link = $(el).find('link').text().trim();
    const date = $(el).find('pubDate').text().trim();
    const desc = stripHtml($(el).find('description').text());
    if (title && link) rssItems.push({ title, link, date, desc });
  });
  console.log(`Fetched ${rssItems.length} articles from RSS`);

  const { data: cat } = await supabase.from('categories').select('id').eq('slug', 'priemysel').single();
  const categoryId = cat?.id;

  const urlArgs = process.argv.slice(2).filter(a => a.startsWith('http'));
  const limitArg = process.argv.slice(2).find(a => !a.startsWith('http'));
  const limit = limitArg ? parseInt(limitArg) : 5;

  let items = urlArgs.length > 0
    ? urlArgs.map(url => ({ link: url, title: '', date: '', desc: '' }))
    : rssItems;

  let inserted = 0;
  const insertedArticles = [];

  for (const item of items) {
    if (inserted >= limit) break;
    if (await articleExists(item.link)) { console.log(`  SKIP: ${(item.title || item.link).substring(0, 50)}`); continue; }

    console.log(`  Scraping: ${(item.title || item.link.split('/').pop()).substring(0, 50)}...`);
    const page = await scrapeArticlePage(item.link);
    if (!page || (!page.content && !page.desc)) { console.log('  SKIP (no content)'); continue; }

    let imageUrl = page.imageUrl;
    if (!imageUrl) { console.log('  SKIP (no image)'); continue; }

    await new Promise(r => setTimeout(r, 3000));

    console.log(`  Writing article...`);
    try {
      const article = await writeArticle(page.title || item.title, page.content || item.desc, item.link);
      const slug = slugify(article.title) + '-' + Date.now().toString(36);

      try {
        const imgRes = await fetch(imageUrl, { redirect: 'follow' });
        if (imgRes.ok) {
          const rawBuf = Buffer.from(await imgRes.arrayBuffer());
          const buf = await sharp(rawBuf).resize(800, 500, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 70 }).toBuffer();
          const storagePath = slug.substring(0, 80) + '.jpg';
          const { error: upErr } = await supabase.storage.from('article-images').upload(storagePath, buf, { contentType: 'image/jpeg', upsert: true });
          if (!upErr) {
            imageUrl = `${SUPABASE_URL}/storage/v1/object/public/article-images/${storagePath}`;
            console.log('  Image uploaded (' + Math.round(buf.length / 1024) + 'KB)');
          }
        }
      } catch (imgErr) { console.error('  Image error:', imgErr.message); }

      await supabase.from('articles').insert({
        title: article.title, slug, excerpt: article.excerpt, content: article.content,
        image_url: imageUrl, category_id: categoryId,
        author: inserted % 2 === 0 ? 'Martin Kováč' : 'Simona Hrušková',
        source_url: item.link, source_name: 'AutoStore',
        is_featured: inserted < 2, is_published: true,
        published_at: new Date(item.date || page.date || Date.now()).toISOString(),
      });
      console.log(`  OK: ${article.title.substring(0, 60)}`);
      insertedArticles.push({ title: article.title, slug, imageUrl });
      inserted++;
    } catch (err) { console.error(`  Error: ${err.message}`); }
    await new Promise(r => setTimeout(r, 3000));
  }

  if (SLACK_WEBHOOK && insertedArticles.length > 0) {
    const siteUrl = process.env.SITE_URL || 'https://robotika24.sk';
    const igSecret = process.env.IG_PUBLISH_SECRET || 'r24igpub';
    const blocks = [{ type: 'header', text: { type: 'plain_text', text: `AutoStore - ${inserted} nových článkov` } }, { type: 'divider' }];
    for (const art of insertedArticles) {
      const articleUrl = `${siteUrl}/clanok/${art.slug}`;
      const igUrl = `${siteUrl}/api/ig-publish?slug=${art.slug}&token=${igSecret}`;
      if (art.imageUrl) blocks.push({ type: 'image', image_url: art.imageUrl, alt_text: art.title, title: { type: 'plain_text', text: art.title } });
      blocks.push({ type: 'section', text: { type: 'mrkdwn', text: `*<${articleUrl}|${art.title}>*` } });
      blocks.push({ type: 'actions', elements: [
        { type: 'button', text: { type: 'plain_text', text: 'Instagram', emoji: true }, url: igUrl, style: 'primary' },
        { type: 'button', text: { type: 'plain_text', text: 'Otvoriť', emoji: true }, url: articleUrl },
      ]});
      blocks.push({ type: 'divider' });
    }
    await fetch(SLACK_WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ blocks }) }).catch(() => {});
    console.log('\nSlack sent!');
  }

  console.log(`\nDone! Inserted: ${inserted}`);
}

main().catch(console.error);
