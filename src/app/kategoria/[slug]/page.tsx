import { supabase } from '@/lib/supabase';
import type { Article } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ArticleCard from '@/components/ArticleCard';
import Sidebar from '@/components/Sidebar';

export const revalidate = 60;

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!category) notFound();

  const { data: articles } = await supabase
    .from('articles')
    .select('*, categories(*)')
    .eq('category_id', category.id)
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  const { data: popular } = await supabase
    .from('articles')
    .select('*, categories(*)')
    .eq('is_published', true)
    .order('views', { ascending: false })
    .limit(5);

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 20px 0' }}>
      <div className="border-b-2 border-[#cb1e26] mb-6">
        <h1 className="text-2xl font-bold text-[#0c1a26] pb-2">{category.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-9">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(articles || []).map((article: Article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          {(!articles || articles.length === 0) && (
            <p className="text-gray-400">Zatial ziadne clanky v tejto kategorii.</p>
          )}
        </div>
        <div className="lg:col-span-3">
          <Sidebar articles={(popular || []) as Article[]} />
        </div>
      </div>
    </div>
  );
}
