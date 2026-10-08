// Daily stats report from Vercel Analytics → Slack at 20:00
// Usage: node scraper/daily-stats.mjs
// Requires: VERCEL_API_TOKEN, VERCEL_PROJECT_ID, SLACK_WEBHOOK_URL
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load env
try {
  const envFile = readFileSync(resolve(__dirname, '..', '.env.local'), 'utf8');
  envFile.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key && vals.length && !process.env[key.trim()]) process.env[key.trim()] = vals.join('=').trim();
  });
} catch {}

const VERCEL_TOKEN = process.env.VERCEL_API_TOKEN;
const VERCEL_PROJECT = process.env.VERCEL_PROJECT_ID;
const VERCEL_TEAM = process.env.VERCEL_TEAM_ID || '';
const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK_URL;

async function main() {
  console.log('=== robotika24 Daily Stats ===');
  console.log(`Time: ${new Date().toISOString()}`);

  if (!VERCEL_TOKEN || !VERCEL_PROJECT) {
    console.error('Missing VERCEL_API_TOKEN or VERCEL_PROJECT_ID');
    process.exit(1);
  }

  // Today range
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const todayEnd = now.toISOString();

  const teamParam = VERCEL_TEAM ? `&teamId=${VERCEL_TEAM}` : '';

  // Fetch page views from Vercel Web Analytics
  const url = `https://api.vercel.com/v1/web/insights?projectId=${VERCEL_PROJECT}&from=${todayStart}&to=${todayEnd}&environment=production${teamParam}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
  });

  let views = 0;
  let visitors = 0;
  let topPages = [];

  if (res.ok) {
    const data = await res.json();
    views = data.pageViews || data.totalPageViews || 0;
    visitors = data.visitors || data.uniqueVisitors || 0;
    topPages = (data.topPages || data.pages || []).slice(0, 5);
  } else {
    // Fallback: try analytics data API
    const altUrl = `https://api.vercel.com/v1/analytics?projectId=${VERCEL_PROJECT}&from=${encodeURIComponent(todayStart)}&to=${encodeURIComponent(todayEnd)}${teamParam}`;
    const altRes = await fetch(altUrl, {
      headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
    });
    if (altRes.ok) {
      const altData = await altRes.json();
      views = altData.pageViews || altData.totalViews || 0;
      visitors = altData.visitors || altData.uniques || 0;
    } else {
      console.log('Analytics API response:', res.status, await res.text().catch(() => ''));
      console.log('Alt API response:', altRes.status, await altRes.text().catch(() => ''));
    }
  }

  const dateStr = now.toLocaleDateString('sk-SK', { day: 'numeric', month: 'long', year: 'numeric' });

  let text = `*robotika24 - Denná štatistika*\n${dateStr}\n\n`;
  text += `👁 Zobrazenia stránok: *${views.toLocaleString('sk-SK')}*\n`;
  text += `👤 Unikátni návštevníci: *${visitors.toLocaleString('sk-SK')}*\n`;

  if (topPages.length > 0) {
    text += `\n*Top stránky:*\n`;
    topPages.forEach((p, i) => {
      text += `${i + 1}. ${p.path || p.page || p.url} - ${p.views || p.count || 0} zobrazení\n`;
    });
  }

  console.log(text);

  if (SLACK_WEBHOOK) {
    await fetch(SLACK_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    console.log('Slack notification sent!');
  }
}

main().catch(console.error);
