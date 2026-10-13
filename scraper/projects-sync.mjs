// Sync open source robotics projects from Growbotics API to Supabase
// Runs 2x daily, updates stars, adds new projects, marks old ones
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
try {
  const envFile = readFileSync(resolve(__dirname, '..', '.env.local'), 'utf8');
  envFile.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key && vals.length && !process.env[key.trim()]) process.env[key.trim()] = vals.join('=').trim();
  });
} catch {}

const supabase = createClient(
  'https://odpwfmrllqjdzgbgrxfc.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const CATEGORY_MAP = {
  'simulation': 'Simulátor',
  'vision-language-action': 'VLA Model',
  'software': 'Softvér',
  'hardware': 'Hardvér',
  'datasets': 'Datasety',
  'middleware': 'Middleware',
  'drones': 'Drony',
  'manipulation': 'Manipulácia',
  'locomotion': 'Lokomócia',
  'foundation-model': 'AI Model',
  'planning': 'Plánovanie',
  'perception': 'Percepcia',
  'slam': 'SLAM',
};

async function main() {
  console.log('=== Projects Sync from Growbotics ===');
  console.log(`Time: ${new Date().toISOString()}`);

  // Fetch all projects from Growbotics API
  const res = await fetch('https://robotics.growbotics.ai/api/projects', {
    headers: { 'User-Agent': 'robotika24-bot/1.0 (+https://robotika24.sk)' },
  });
  const projects = await res.json();
  console.log(`Fetched ${projects.length} projects from Growbotics`);

  // Get existing projects
  const { data: existing } = await supabase.from('projects').select('external_url');
  const existingUrls = new Set((existing || []).map(p => p.external_url));

  let inserted = 0, updated = 0;

  for (const p of projects) {
    if (p.status !== 'published') continue;

    const githubUrl = p.githubUrl || p.websiteUrl || '';
    const category = CATEGORY_MAP[p.category] || p.categoryLabel || p.category;

    const projectData = {
      title: p.name,
      description: p.shortDescription || p.seoDescription || '',
      category,
      subcategory: p.projectType || '',
      tags: p.tags || [],
      stars: p.stars || 0,
      license: p.license || '',
      external_url: githubUrl,
      image_url: p.imageUrl || null,
      source_name: 'Growbotics',
      is_published: true,
      is_new: isNew(p.createdAt),
    };

    if (existingUrls.has(githubUrl)) {
      // Update stars and is_new
      await supabase.from('projects')
        .update({ stars: projectData.stars, is_new: projectData.is_new, image_url: projectData.image_url })
        .eq('external_url', githubUrl);
      updated++;
    } else {
      await supabase.from('projects').insert(projectData);
      inserted++;
      console.log(`  NEW: ${p.name} (${p.stars} stars)`);
    }
  }

  console.log(`Done! Inserted: ${inserted}, Updated: ${updated}`);
}

function isNew(createdAt) {
  if (!createdAt) return false;
  const diff = Date.now() - new Date(createdAt).getTime();
  return diff < 14 * 24 * 60 * 60 * 1000; // 14 days
}

main().catch(console.error);
