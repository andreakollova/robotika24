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
    heroSide: articles.slice(1, 3),
    grid: articles.slice(3),
    popular: (popular || []) as Article[],
  };
}

export default async function Home() {
  const { announcement, hero, heroSide, grid, popular } = await getArticles();

  return (
    <>
      {/* Dark announcement bar with latest articles */}
      <AnnouncementBar articles={announcement} />

      <div className="max-w-7xl mx-auto px-4 mt-6">
        {/* Hero section: big article + 2 side articles */}
        {hero && (
          <section className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Big hero */}
              <div className="lg:col-span-5">
                <ArticleCard article={hero} size="hero" />
              </div>

              {/* Main large article - center */}
              {heroSide[0] && (
                <div className="lg:col-span-4">
                  <ArticleCard article={heroSide[0]} size="hero" />
                </div>
              )}

              {/* Sidebar popular */}
              <div className="lg:col-span-3">
                <Sidebar articles={popular} />
              </div>
            </div>
          </section>
        )}

        {/* Divider */}
        <div className="border-b-2 border-[#cb1e26] mb-6">
          <h2 className="text-lg font-bold text-[#0c1a26] pb-2">Najnovsie spravy</h2>
        </div>

        {/* Article grid - 3 columns like SportNet */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 mb-12">
          {grid.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </section>
      </div>
    </>
  );
}
