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
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
        <div className="h-1 w-16 bg-[#cb1e26] rounded mt-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {(articles || []).map((article: Article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          {(!articles || articles.length === 0) && (
            <p className="text-gray-400">Zatial ziadne clanky v tejto kategorii.</p>
          )}
        </div>
        <div>
          <Sidebar articles={(popular || []) as Article[]} />
        </div>
      </div>
    </div>
  );
}
