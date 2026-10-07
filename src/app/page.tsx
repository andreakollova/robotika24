import { supabase } from '@/lib/supabase';
import type { Article } from '@/lib/supabase';
import ArticleCard from '@/components/ArticleCard';
import Sidebar from '@/components/Sidebar';

export const revalidate = 60;

async function getArticles() {
  const { data: featured } = await supabase
    .from('articles')
    .select('*, categories(*)')
    .eq('is_featured', true)
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(3);

  const { data: latest } = await supabase
    .from('articles')
    .select('*, categories(*)')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(12);

  const { data: popular } = await supabase
    .from('articles')
    .select('*, categories(*)')
    .eq('is_published', true)
    .order('views', { ascending: false })
    .limit(5);

  return {
    featured: (featured || []) as Article[],
    latest: (latest || []) as Article[],
    popular: (popular || []) as Article[],
  };
}

export default async function Home() {
  const { featured, latest, popular } = await getArticles();

  const hero = featured[0];
  const sideFeatured = featured.slice(1, 3);
  const gridArticles = latest.filter((a) => !featured.some((f) => f.id === a.id));

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Hero section */}
      {hero && (
        <section className="mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <ArticleCard article={hero} size="large" />
            </div>
            <div className="flex flex-col gap-5">
              {sideFeatured.map((article) => (
                <ArticleCard key={article.id} article={article} size="normal" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main content + sidebar */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold">Najnovsie spravy</h2>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {gridArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>

        <div>
          <Sidebar articles={popular} />
        </div>
      </section>
    </div>
  );
}
