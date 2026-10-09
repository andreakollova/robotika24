// 1X Technologies Stories scraper
// Photos ONLY from Press Gallery (https://www.1x.tech/press), NEVER from articles
// Credit: "Courtesy of 1X"
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
try {
  const envFile = readFileSync(resolve(__dirname, '..', '.env.local'), 'utf8');
  envFile.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key && vals.length) process.env[key.trim()] = vals.join('=').trim();
  });
} catch {}

const supabase = createClient('https://odpwfmrllqjdzgbgrxfc.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK_URL;
const LIMIT = parseInt(process.argv[2] || '10');

// Press Gallery photos - use these instead of article images
const PRESS_PHOTOS = {
  neo: 'https://cdn.sanity.io/images/qka6yvsc/production/27d9416b8c38cb79b87d0eddec3c39e501c75a64-3006x1686.jpg?w=1440',
  neo_gamma: 'https://cdn.sanity.io/images/qka6yvsc/production/32aad1c5c00b8a98d984852682f6e3c04976a78c-1920x1079.png?w=1440',
  neo_beta: 'https://cdn.sanity.io/images/qka6yvsc/production/20b2f06046b824f97eeb29126876f33e76314a34-3840x2160.png?w=1440',
  eve: 'https://cdn.sanity.io/images/qka6yvsc/production/efda54ece424abb58c7bd887ea0a263fc730f12c-2480x1460.png?w=1440',
};

function slugify(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').substring(0, 60);
}

function stripHtml(html) {
  return (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

async function articleExists(sourceUrl) {
  const { data } = await supabase.from('articles').select('id').eq('source_url', sourceUrl).limit(1);
  return data && data.length > 0;
}

function pickPressPhoto(title, text) {
  const combined = (title + ' ' + text).toLowerCase();
  if (combined.includes('neo gamma')) return PRESS_PHOTOS.neo_gamma;
  if (combined.includes('neo beta')) return PRESS_PHOTOS.neo_beta;
  if (combined.includes('eve')) return PRESS_PHOTOS.eve;
  return PRESS_PHOTOS.neo; // default to NEO
}

async function writeArticle(title, content) {
  const prompt = `Na základe nasledujúcich faktov napíš VLASTNÝ slovenský spravodajský článok. NEPREKLÁDAJ doslovne, napíš to ako novinár.

PRAVIDLÁ:
- NADPIS: Zaujímavý, konkrétny, novinársky - 10-14 slov. Obsahuje konkrétny fakt alebo číslo. Píš ako novinár denníka SME. Žiadne klišé (revolúcia, budúcnosť). Žiadne dvojbodky.
- EXCERPT: 6-8 viet, do 800 znakov. Dôležité slová VŽDY **bold**. Správna slovenská diakritika.
- CONTENT: Vlastný článok s ## nadpismi. Kľúčové pojmy boldni. Píš informatívne a zaujímavo.
- NIKDY NEPREKLADAJ mená ľudí a názvy firiem/technológií.
- DIAKRITIKA JE POVINNÁ v KAŽDOM slove.

Na konci obsahu VŽDY pridaj:

## Zdroj
Zdroj: 1X Technologies
Ilustračná fotografia: Courtesy of 1X
Spracovanie: Redakcia robotika24

Vráť JSON (bez markdown blokov):
{"title": "nadpis 10-14 slov", "excerpt": "6-8 viet s **boldmi**", "content": "vlastný článok s ## nadpismi a zdrojom"}

FAKTY NA SPRACOVANIE:
Nadpis: ${title}
Obsah: ${content}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.4,
    max_tokens: 8000,
  });

  const text = response.choices[0].message.content.trim().replace(/```json\s*/g, '').replace(/```\s*/g, '');
  const parsed = JSON.parse(text);
  parsed.title = parsed.title.replace(/[—–:]/g, '');
  parsed.excerpt = parsed.excerpt.replace(/[—–]/g, '-');
  parsed.content = parsed.content.replace(/[—–]/g, '-');
  return parsed;
}

async function getCategoryId() {
  const { data } = await supabase.from('categories').select('id').eq('slug', 'roboty').single();
  return data?.id;
}

async function main() {
  console.log('=== 1X Technologies Scraper ===');
  console.log(`Time: ${new Date().toISOString()}`);
  console.log(`Target: ${LIMIT} articles\n`);

  // Fetch stories page
  const res = await fetch('https://www.1x.tech/discover/category/stories', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
  });
  const html = await res.text();

  // Extract story links and titles from HTML
  const storyMatches = [...html.matchAll(/href="\/discover\/([\w-]+)"[^>]*>([^<]*)</g)];
  const stories = [];
  const seen = new Set();

  for (const m of storyMatches) {
    const slug = m[1];
    if (seen.has(slug) || slug === 'category' || slug.includes('stories')) continue;
    seen.add(slug);
    const url = `https://www.1x.tech/discover/${slug}`;
    stories.push({ slug, url, title: m[2].trim() || slug });
  }

  console.log(`Found ${stories.length} stories\n`);

  const categoryId = await getCategoryId();
  let inserted = 0;
  const insertedArticles = [];

  for (const story of stories) {
    if (inserted >= LIMIT) break;
    if (await articleExists(story.url)) {
      console.log(`  SKIP (exists): ${story.title.substring(0, 50)}...`);
      continue;
    }

    // Fetch story content
    console.log(`  Fetching: ${story.title.substring(0, 50)}...`);
    try {
      const storyRes = await fetch(story.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
      });
      const storyHtml = await storyRes.text();
      const textContent = stripHtml(storyHtml).substring(0, 4000);

      // Pick press gallery photo
      const imageUrl = pickPressPhoto(story.title, textContent);

      console.log(`  Writing article...`);
      const article = await writeArticle(story.title, textContent);
      const articleSlug = slugify(article.title) + '-' + Date.now().toString(36);

      const { error } = await supabase.from('articles').insert({
        title: article.title,
        slug: articleSlug,
        excerpt: article.excerpt,
        content: article.content,
        image_url: imageUrl,
        category_id: categoryId,
        author: inserted % 2 === 0 ? 'Martin Kováč' : 'Simona Hrušková',
        source_url: story.url,
        source_name: '1X Technologies',
        is_featured: inserted < 2,
        is_published: true,
        published_at: new Date().toISOString(),
      });

      if (error) {
        console.error(`  DB error: ${error.message}`);
      } else {
        console.log(`  OK: ${article.title.substring(0, 60)}...`);
        insertedArticles.push({ title: article.title, slug: articleSlug, imageUrl });
        inserted++;
      }
    } catch (err) {
      console.error(`  Error: ${err.message}`);
    }

    await new Promise(r => setTimeout(r, 2000));
  }

  // Slack notification
  if (SLACK_WEBHOOK && insertedArticles.length > 0) {
    const siteUrl = process.env.SITE_URL || 'https://robotika24.sk';
    const igSecret = process.env.IG_PUBLISH_SECRET || 'r24igpub2026';

    const blocks = [
      { type: 'header', text: { type: 'plain_text', text: `1X Technologies - ${inserted} nových článkov` } },
      { type: 'divider' },
    ];

    for (const art of insertedArticles) {
      const articleUrl = `${siteUrl}/clanok/${art.slug}`;
      const igUrl = `${siteUrl}/api/ig-publish?slug=${art.slug}&token=${igSecret}`;
      if (art.imageUrl) {
        blocks.push({ type: 'image', image_url: art.imageUrl, alt_text: art.title, title: { type: 'plain_text', text: art.title } });
      }
      blocks.push({ type: 'section', text: { type: 'mrkdwn', text: `*<${articleUrl}|${art.title}>*` } });
      blocks.push({ type: 'actions', elements: [
        { type: 'button', text: { type: 'plain_text', text: 'Instagram' }, url: igUrl, style: 'primary' },
        { type: 'button', text: { type: 'plain_text', text: 'Otvoriť' }, url: articleUrl },
      ]});
      blocks.push({ type: 'divider' });
    }

    try {
      await fetch(SLACK_WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ blocks }) });
      console.log('\nSlack notification sent!');
    } catch {}
  }

  console.log(`\nDone! Inserted: ${inserted}`);
}

main().catch(console.error);
