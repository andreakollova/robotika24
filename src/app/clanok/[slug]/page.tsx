import { supabase } from '@/lib/supabase';
import type { Article } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ArticleSidebar from '@/components/ArticleSidebar';
import ShareLinks from '@/components/ShareLinks';
import AboutAuthor from '@/components/AboutAuthor';

export const revalidate = 60;

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: article } = await supabase
    .from('articles')
    .select('*, categories(*)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (!article) notFound();

  // Increment views
  await supabase
    .from('articles')
    .update({ views: (article as Article).views + 1 })
    .eq('id', article.id);

  const { data: related } = await supabase
    .from('articles')
    .select('*, categories(*)')
    .eq('is_published', true)
    .neq('id', article.id)
    .order('published_at', { ascending: false })
    .limit(5);

  const a = article as Article;
  const categoryName = a.categories?.name;
  const articleUrl = `https://robotika24.sk/clanok/${a.slug}`;

  return (
    <div className="max-w-7xl mx-auto px-4 pt-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <article className="lg:col-span-2">
          {categoryName && (
            <Link
              href={`/kategoria/${a.categories?.slug}`}
              className="inline-block bg-[#cb1e26] text-white text-xs font-bold uppercase px-2 py-1 rounded mb-4"
            >
              {categoryName}
            </Link>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
            {a.title}
          </h1>
          <div className="flex items-center gap-3 text-gray-500 text-sm mb-2">
            <span>{a.author}</span>
            <span>-</span>
            <span>
              {new Date(a.published_at).toLocaleDateString('sk-SK', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          <ShareLinks url={articleUrl} title={a.title} />

          {a.image_url && (
            <div className="rounded-lg overflow-hidden mb-2">
              <img src={a.image_url} alt={a.title} className="w-full aspect-video object-cover" />
            </div>
          )}

          {a.source_name && a.source_url && (
            <p className="text-xs text-gray-400 mb-6">
              Zdroj:{' '}
              <a
                href={a.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-[#cb1e26] transition-colors underline"
              >
                {a.source_name}
              </a>
              {a.original_author && ` - ${a.original_author}`}
              {a.original_date && ` | ${new Date(a.original_date).toLocaleDateString('sk-SK')}`}
            </p>
          )}

          {a.video_url && (
            <div className="mb-8 rounded-lg overflow-hidden aspect-video">
              <iframe
                src={a.video_url}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          )}

          {a.excerpt && (
            <p className="text-lg text-gray-600 leading-relaxed mb-6 font-medium border-l-4 border-[#cb1e26] pl-4">
              {a.excerpt}
            </p>
          )}

          {a.content && (
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-[15px]">
              {a.content.split('\n').map((line, i) => {
                if (line.startsWith('## ')) {
                  return (
                    <h2 key={i} className="text-xl font-bold text-gray-900 mt-8 mb-3">
                      {line.replace('## ', '')}
                    </h2>
                  );
                }
                if (line.startsWith('- ')) {
                  return (
                    <p key={i} className="pl-4 mb-1">
                      <span className="text-[#cb1e26] mr-2">-</span>
                      {line.replace('- ', '')}
                    </p>
                  );
                }
                if (line.trim()) {
                  return <p key={i} className="mb-4">{line}</p>;
                }
                return null;
              })}
            </div>
          )}

          {!a.content && (
            <p className="text-gray-400 italic">Plny obsah clanku bude dostupny coskoro.</p>
          )}

          {a.source_name && a.source_url && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500">
                Tento clanok bol povodne publikovany na{' '}
                <a
                  href={a.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#cb1e26] hover:underline font-medium"
                >
                  {a.source_name}
                </a>
                . Preklad a uprava: {a.author}, robotika24.
              </p>
            </div>
          )}

          <div className="mt-8">
            <ShareLinks url={articleUrl} title={a.title} />
          </div>

          <AboutAuthor authorName={a.author} />
        </article>

        <div>
          <ArticleSidebar articles={(related || []) as Article[]} />
        </div>
      </div>
    </div>
  );
}
