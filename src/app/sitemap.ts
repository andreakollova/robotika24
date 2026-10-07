import { supabase } from '@/lib/supabase';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  const { data: categories } = await supabase
    .from('categories')
    .select('slug');

  const baseUrl = 'https://robotika24.sk';

  const articleUrls = (articles || []).map((a) => ({
    url: `${baseUrl}/clanok/${a.slug}`,
    lastModified: new Date(a.published_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const categoryUrls = (categories || []).map((c) => ({
    url: `${baseUrl}/kategoria/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'hourly', priority: 1 },
    ...categoryUrls,
    ...articleUrls,
  ];
}
