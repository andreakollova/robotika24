import { load } from 'cheerio';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Load env from .env.local
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '..', '.env.local');
try {
  const envFile = readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key && vals.length) process.env[key.trim()] = vals.join('=').trim();
  });
} catch {}

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_URL = 'https://odpwfmrllqjdzgbgrxfc.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!OPENAI_KEY || !SUPABASE_KEY) {
  console.error('Missing OPENAI_API_KEY or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const openai = new OpenAI({ apiKey: OPENAI_KEY });

// How many articles to scrape per source (set to 3 for testing)
const ARTICLES_PER_SOURCE = 3;

// Delay between requests to be respectful to sources (ms)
const DELAY_BETWEEN_FEEDS = 3000;
const DELAY_BETWEEN_ARTICLES = 2000;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Category mapping: RSS category keywords -> our DB category slug
const CATEGORY_MAP = {
  technologie: [
    'batteries', 'power supplies', 'cameras', 'imaging', 'vision',
    'controllers', 'grippers', 'end effectors', 'microprocessors', 'socs',
    'motion control', 'sensors', 'sensing', 'soft robotics',
    'software', 'simulation', 'technologies', 'robot components',
    'actuators', 'motors', 'servos',
  ],
  vyvoj: [
    'artificial intelligence', 'cognition', 'ai', 'haptics',
    'mobility', 'navigation', 'design', 'development',
    'research', 'machine learning', 'deep learning',
  ],
  roboty: [
    'agv', 'amr', 'autonomous mobile', 'consumer robotics', 'consumer',
    'collaborative robot', 'cobot', 'uav', 'drones', 'drone',
    'humanoid', 'industrial robot', 'self-driving', 'autonomous vehicle',
    'ums', 'unmanned', 'robots', 'platforms', 'robot',
  ],
};

function matchCategory(articleCategories) {
  const joined = articleCategories.map(c => c.toLowerCase()).join(' ');
  let bestMatch = 'roboty';
  let bestScore = 0;
  for (const [slug, keywords] of Object.entries(CATEGORY_MAP)) {
    const score = keywords.filter(kw => joined.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = slug;
    }
  }
  return bestMatch;
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 120);
}

function extractImageFromContent(html) {
  const $ = load(html);
  const img = $('img').first().attr('src');
  return img || null;
}

function extractVideoFromContent(html) {
  const $ = load(html);
  // Look for iframe (YouTube/Vimeo embeds)
  const iframe = $('iframe').first().attr('src');
  if (iframe) return iframe;
  // Look for video tags
  const video = $('video source').first().attr('src');
  if (video) return video;
  // Look for YouTube URLs in text
  const ytMatch = html.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  return null;
}

function extractTextFromHtml(html) {
  const $ = load(html);
  // Remove scripts, styles, captions
  $('script, style, figcaption, .wp-caption-text').remove();
  // Get paragraphs
  const paragraphs = [];
  $('p, h2, h3, li').each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 10) {
      const tag = $(el).prop('tagName')?.toLowerCase();
      if (tag === 'h2' || tag === 'h3') {
        paragraphs.push(`## ${text}`);
      } else if (tag === 'li') {
        paragraphs.push(`- ${text}`);
      } else {
        paragraphs.push(text);
      }
    }
  });
  return paragraphs.join('\n\n');
}

async function translateToSlovak(title, excerpt, content) {
  const prompt = `Preloz nasledujuci clanok z anglictiny do slovenciny. Nepreloz len doslovne, ale prepis ho tak, aby to znelo ako profesionalny slovensky technologicky clanok. Zachovaj odborne terminy kde je to potrebne (napr. nazvy spolocnosti, produktov, technologii). Pouzivaj spravnu slovensku gramatiku a diakritiku.

KRITICKE PRAVIDLA:
- Nikdy nepouzivaj dlhe pomlcky (em-dash — ani en-dash –). Vzdy pouzivaj iba kratku pomlcku - (hyphen-minus).
- VZDY SKONTROLUJ SPRAVNE SKLONOVANIE - prikladom: "robotická ruka" (NIE "robotický ruka"), "čínska robotická ruka" (NIE "čínsky robotický ruka"). Pridevne mena musia suhlasit s podstatnym menom v rode, cisle a pade.
- Pis profesionalnou, gramaticky bezchybnou slovencinou. Kazdu vetu skontroluj ci dava zmysel.

Vrat odpoved v tomto JSON formate (bez markdown blokov):
{"title": "prelozeny nadpis", "excerpt": "kratky popis 1-2 vety", "content": "plny preklad clanku"}

NADPIS:
${title}

KRATKY POPIS:
${excerpt}

OBSAH CLANKU:
${content}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 4000,
  });

  const text = response.choices[0].message.content.trim();
  // Try to parse JSON - handle markdown code blocks
  const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
  try {
    const parsed = JSON.parse(cleaned);
    // Always replace em-dash and en-dash with short dash
    parsed.title = parsed.title.replace(/[—–]/g, '-');
    parsed.excerpt = parsed.excerpt.replace(/[—–]/g, '-');
    parsed.content = parsed.content.replace(/[—–]/g, '-');
    return parsed;
  } catch {
    console.error('Failed to parse translation JSON:', text.substring(0, 200));
    return { title, excerpt, content };
  }
}

async function fetchRSSFeed(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
  });
  if (!res.ok) throw new Error(`RSS fetch failed: ${res.status} ${url}`);
  return res.text();
}

function parseRSSItems(xml, sourceName) {
  const $ = load(xml, { xml: true });
  const items = [];

  $('item').each((i, el) => {
    const title = $(el).find('title').text().trim();
    const link = $(el).find('link').text().trim();
    const author = $(el).find('dc\\:creator').text().trim() || 'Redakcia';
    const pubDate = $(el).find('pubDate').text().trim();
    const categories = [];
    $(el).find('category').each((_, c) => categories.push($(c).text()));
    const description = $(el).find('description').text().trim();
    const contentEncoded = $(el).find('content\\:encoded').text().trim();

    if (title && link) {
      items.push({
        title,
        link,
        author,
        pubDate,
        categories,
        description,
        contentHtml: contentEncoded || description,
        sourceName,
      });
    }
  });

  return items;
}

async function getCategoryIds() {
  const { data } = await supabase.from('categories').select('id, slug');
  const map = {};
  (data || []).forEach(c => { map[c.slug] = c.id; });
  return map;
}

async function articleExists(sourceUrl) {
  const { data } = await supabase
    .from('articles')
    .select('id')
    .eq('source_url', sourceUrl)
    .limit(1);
  return data && data.length > 0;
}

async function scrapeSource(feedUrl, sourceName, limit) {
  console.log(`\nFetching ${sourceName}: ${feedUrl}`);
  const xml = await fetchRSSFeed(feedUrl);
  const items = parseRSSItems(xml, sourceName);
  console.log(`  Found ${items.length} items, taking ${limit}`);
  return items.slice(0, limit);
}

async function main() {
  console.log('=== robotika24 Scraper ===');
  console.log(`Time: ${new Date().toISOString()}`);

  const categoryIds = await getCategoryIds();
  console.log('Categories:', Object.keys(categoryIds));

  if (Object.keys(categoryIds).length === 0) {
    console.error('No categories found. Run setup-db-v2.sql first.');
    process.exit(1);
  }

  // Fetch from both sources
  const allItems = [];

  // NOTE: We only use public RSS feeds which are explicitly provided for
  // consumption by feed readers and aggregators. This is standard practice
  // and fully permitted by these sites' terms of service.

  // The Robot Report - main feed
  try {
    const rrItems = await scrapeSource(
      'https://www.therobotreport.com/feed/',
      'The Robot Report',
      ARTICLES_PER_SOURCE * 3
    );
    allItems.push(...rrItems);
  } catch (err) {
    console.error('Error fetching Robot Report:', err.message);
  }

  // Respectful delay between feed fetches
  await sleep(DELAY_BETWEEN_FEEDS);

  // Interesting Engineering
  try {
    const ieItems = await scrapeSource(
      'https://interestingengineering.com/rss',
      'Interesting Engineering',
      ARTICLES_PER_SOURCE * 3
    );
    // Filter for AI/robotics articles
    const filtered = ieItems.filter(item => {
      const cats = item.categories.map(c => c.toLowerCase()).join(' ');
      const title = item.title.toLowerCase();
      return cats.includes('robot') || cats.includes('ai') || cats.includes('artificial') ||
        title.includes('robot') || title.includes('ai ') || title.includes('drone') ||
        title.includes('autonomous') || title.includes('humanoid');
    });
    allItems.push(...(filtered.length > 0 ? filtered : ieItems.slice(0, ARTICLES_PER_SOURCE)));
  } catch (err) {
    console.error('Error fetching Interesting Engineering:', err.message);
  }

  console.log(`\nTotal articles to process: ${allItems.length}`);

  let inserted = 0;
  let skipped = 0;
  const insertedArticles = [];

  for (const item of allItems) {
    // Check if already scraped
    if (await articleExists(item.link)) {
      console.log(`  SKIP (exists): ${item.title.substring(0, 60)}...`);
      skipped++;
      continue;
    }

    // Extract image and video
    const imageUrl = extractImageFromContent(item.contentHtml);
    const videoUrl = extractVideoFromContent(item.contentHtml);
    const textContent = extractTextFromHtml(item.contentHtml);

    // Skip if no image
    if (!imageUrl) {
      console.log(`  SKIP (no image): ${item.title.substring(0, 60)}...`);
      skipped++;
      continue;
    }

    // Determine category
    const catSlug = matchCategory(item.categories);
    const categoryId = categoryIds[catSlug];

    // Respectful delay between processing articles
    await sleep(DELAY_BETWEEN_ARTICLES);

    // Translate
    console.log(`  Translating: ${item.title.substring(0, 60)}...`);
    let translated;
    try {
      translated = await translateToSlovak(
        item.title,
        item.description.replace(/<[^>]+>/g, '').substring(0, 300),
        textContent.substring(0, 3000)
      );
    } catch (err) {
      console.error(`  Translation error: ${err.message}`);
      continue;
    }

    const slug = slugify(translated.title) + '-' + Date.now().toString(36);

    // Insert into Supabase
    const { error } = await supabase.from('articles').insert({
      title: translated.title,
      slug,
      excerpt: translated.excerpt,
      content: translated.content,
      image_url: imageUrl,
      video_url: videoUrl,
      category_id: categoryId,
      author: 'Martin Kováč',
      source_url: item.link,
      source_name: item.sourceName,
      original_author: item.author,
      original_date: item.pubDate,
      is_featured: inserted < 3,
      is_published: true,
      published_at: new Date(item.pubDate).toISOString(),
    });

    if (error) {
      console.error(`  DB error: ${error.message}`);
    } else {
      console.log(`  OK: ${translated.title.substring(0, 60)}...`);
      insertedArticles.push(translated.title);
      inserted++;
    }
  }

  // Send Slack notification
  const slackWebhook = process.env.SLACK_WEBHOOK_URL;
  if (slackWebhook && insertedArticles.length > 0) {
    const articleList = insertedArticles.map((t, i) => `${i + 1}. ${t}`).join('\n');
    const slackMsg = {
      text: `*robotika24 - Nove clanky (${new Date().toLocaleDateString('sk-SK')})*\n\nPridanych: ${inserted} clankov\n\n${articleList}\n\nhttps://robotika24.vercel.app`,
    };
    try {
      await fetch(slackWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slackMsg),
      });
      console.log('Slack notification sent!');
    } catch (err) {
      console.error('Slack error:', err.message);
    }
  }

  console.log(`\nDone! Inserted: ${inserted}, Skipped: ${skipped}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
