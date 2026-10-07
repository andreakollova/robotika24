import { supabase } from '@/lib/supabase';
import type { Article } from '@/lib/supabase';
import ArticleCard from '@/components/ArticleCard';
import Sidebar from '@/components/Sidebar';
import AnnouncementBar from '@/components/AnnouncementBar';

export const revalidate = 60;

async function getArticles() {
  const { data: all } = await supabase
    .from('articles')
    .select('*, categories(*)')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(30);

  const { data: popularRaw } = await supabase
    .from('articles')
    .select('*, categories(*)')
    .eq('is_published', true)
    .order('views', { ascending: false })
    .limit(10);

  const articles = (all || []) as Article[];
  const allPopular = (popularRaw || []) as Article[];

  // Simple split - no overlaps:
  const announcement = articles.slice(0, 4);       // announcement bar
  const hero = articles[4] || articles[0];          // big hero left
  const heroSide = articles[5] || articles[1];      // hero right
  const heroIds = new Set([hero?.id, heroSide?.id, ...announcement.map(a => a.id)]);

  // Sidebar: most viewed, skip anything already shown
  const popular = allPopular.filter(a => !heroIds.has(a.id)).slice(0, 5);
  const popularIds = new Set(popular.map(a => a.id));

  // Latest tab for sidebar
  const latest = articles.filter(a => !heroIds.has(a.id) && !popularIds.has(a.id)).slice(0, 5);

  // Grid: everything not in hero section (announcement is separate bar so OK to show again in grid)
  const grid = articles.filter(a => a.id !== hero?.id && a.id !== heroSide?.id).slice(0, 18);

  return { announcement, hero, heroSide, grid, popular, latest };
}

export default async function Home() {
  const { announcement, hero, heroSide, grid, popular, latest } = await getArticles();

  return (
    <>
      <AnnouncementBar articles={announcement} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 20px 0' }}>
        {hero && (
          <section style={{ marginBottom: 32 }}>
            <div className="hero-grid">
              <div>
                <ArticleCard article={hero} size="hero" />
              </div>
              {heroSide && (
                <div>
                  <ArticleCard article={heroSide} size="hero" />
                </div>
              )}
              <div>
                <Sidebar articles={popular} latestArticles={latest} />
              </div>
            </div>
          </section>
        )}

        <div style={{ borderBottom: '2px solid #cb1e26', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0c1a26', paddingBottom: 8 }}>Najnovšie správy</h2>
        </div>

        <section className="articles-grid" style={{ marginBottom: 48 }}>
          {grid.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </section>
      </div>
    </>
  );
}
