import { saveArticleImage } from './save-image.mjs';
// Avular news scraper for robotika24
// Avular is a Dutch autonomous robotics company from Eindhoven
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { load } from 'cheerio';

const __dirname = dirname(fileURLToPath(import.meta.url));
const savedUrl = await saveArticleImage(imageUrl, slug);
      if (savedUrl) imageUrl = savedUrl;

      await supabase.from('articles').insert({
        title: article.title, slug, excerpt: article.excerpt, content: article.content,
        image_url: imageUrl, category_id: categoryId,
        author: inserted % 2 === 0 ? 'Martin Kováč' : 'Simona Hrušková',
        source_url: item.link, source_name: 'Avular',
        is_featured: inserted < 2, is_published: true,
        published_at: new Date(page.date || Date.now()).toISOString(),
      });
      console.log(`  OK: ${article.title.substring(0, 60)}`);
      insertedArticles.push({ title: article.title, slug, imageUrl });
      inserted++;
    } catch (err) { console.error(`  Error: ${err.message}`); }
    await new Promise(r => setTimeout(r, 3000 + Math.random() * 4000));
  }

  if (SLACK_WEBHOOK && insertedArticles.length > 0) {
    const siteUrl = process.env.SITE_URL || 'https://robotika24.sk';
    const igSecret = process.env.IG_PUBLISH_SECRET || 'r24igpub';
    const blocks = [{ type: 'header', text: { type: 'plain_text', text: `Avular - ${inserted} nových článkov` } }, { type: 'divider' }];
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
