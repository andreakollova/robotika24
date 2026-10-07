import { supabase } from '@/lib/supabase';
import type { Article } from '@/lib/supabase';
import ArticleCard from '@/components/ArticleCard';
import Sidebar from '@/components/Sidebar';
import AnnouncementBar from '@/components/AnnouncementBar';

export const revalidate = 60;

async function getArticles() {
  // Get latest 30 articles
  const { data: all } = await supabase
    .from('articles')
    .select('*, categories(*)')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(30);

  // Get most viewed (for sidebar)
  const { data: popularRaw } = await supabase
    .from('articles')
    .select('*, categories(*)')
    .eq('is_published', true)
    .order('views', { ascending: false })
    .limit(10);

  const articles = (all || []) as Article[];
  const allPopular = (popularRaw || []) as Article[];

  // Distribute articles so none repeats:
  // - Announcement bar: articles 0-3
  // - Hero left: article 4
  // - Hero right: article 5
  // - Sidebar Najčítanejšie: top 5 by views (excluding hero)
  // - Sidebar Najnovšie: articles 6-10
  // - Grid: everything after article 5 that's not in sidebar

  const announcement = articles.slice(0, 4);
  const hero = articles[4];
  const heroSide = articles[5];

  const heroIds = new Set([
    ...announcement.map(a => a.id),
    hero?.id,
    heroSide?.id,
  ]);

  // Popular: exclude articles already used in hero/announcement
  const popular = allPopular.filter(a => !heroIds.has(a.id)).slice(0, 5);
  const sidebarIds = new Set(popular.map(a => a.id));

  // Latest tab: articles not used anywhere else
  const latestForTab = articles
    .filter(a => !heroIds.has(a.id) && !sidebarIds.has(a.id))
    .slice(0, 5);

  // Grid: all remaining articles
  const usedIds = new Set([...heroIds, ...sidebarIds, ...latestForTab.map(a => a.id)]);
  const grid = articles.filter(a => !heroIds.has(a.id));

  return { announcement, hero, heroSide, grid, popular, latest: latestForTab };
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
