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
    .limit(20);

  const { data: popular } = await supabase
    .from('articles')
    .select('*, categories(*)')
    .eq('is_published', true)
    .order('views', { ascending: false })
    .limit(5);

  const articles = (all || []) as Article[];

  return {
    announcement: articles.slice(0, 4),
    hero: articles[0],
    heroSide: articles[1],
    grid: articles.slice(2),
    popular: (popular || []) as Article[],
    latest: articles.slice(0, 5),
  };
}

export default async function Home() {
  const { announcement, hero, heroSide, grid, popular, latest } = await getArticles();

  return (
    <>
      <AnnouncementBar articles={announcement} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 20px 0' }}>
        {/* Hero section */}
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

        {/* Divider */}
        <div style={{ borderBottom: '2px solid #cb1e26', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0c1a26', paddingBottom: 8 }}>Najnovšie správy</h2>
        </div>

        {/* Article grid */}
        <section className="articles-grid" style={{ marginBottom: 48 }}>
          {grid.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </section>
      </div>
    </>
  );
}
