import { supabase } from '@/lib/supabase';
import type { Article } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ArticleCard from '@/components/ArticleCard';
import CategorySidebar from '@/components/CategorySidebar';

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

  // Most read in this category
  const { data: popular } = await supabase
    .from('articles')
    .select('*, categories(*)')
    .eq('category_id', category.id)
    .eq('is_published', true)
    .order('views', { ascending: false })
    .limit(5);

  // Articles with video in this category
  const { data: withVideo } = await supabase
    .from('articles')
    .select('*, categories(*)')
    .eq('category_id', category.id)
    .eq('is_published', true)
    .not('video_url', 'is', null)
    .order('published_at', { ascending: false })
    .limit(5);

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 20px 0' }}>
      <div style={{ borderBottom: '2px solid #cb1e26', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0c1a26', paddingBottom: 8 }}>{category.name}</h1>
      </div>

      <div className="cat-grid">
        <div>
          <div className="cat-articles">
            {(articles || []).map((article: Article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          {(!articles || articles.length === 0) && (
            <p style={{ color: '#9ca3af' }}>Zatiaľ žiadne články v tejto kategórii.</p>
          )}
        </div>
        <div>
          <CategorySidebar
            popular={(popular || []) as Article[]}
            withVideo={(withVideo || []) as Article[]}
          />
        </div>
      </div>
    </div>
  );
}
