import Link from 'next/link';
import type { Article } from '@/lib/supabase';

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `pred ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `pred ${hours} hod`;
  const days = Math.floor(hours / 24);
  return `pred ${days} ${days === 1 ? 'dnom' : 'dnami'}`;
}

export default function ArticleCard({
  article,
  size = 'normal',
}: {
  article: Article;
  size?: 'large' | 'normal' | 'small';
}) {
  const categoryName = article.categories?.name;

  if (size === 'large') {
    return (
      <Link href={`/clanok/${article.slug}`} className="group block">
        <div className="relative overflow-hidden rounded-lg aspect-[16/9]">
          {article.image_url && (
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            {categoryName && (
              <span className="inline-block bg-[#cb1e26] text-white text-xs font-bold uppercase px-2 py-1 rounded mb-3">
                {categoryName}
              </span>
            )}
            <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-2">
              {article.title}
            </h2>
            <p className="text-gray-300 text-sm line-clamp-2">{article.excerpt}</p>
            <div className="flex items-center gap-3 mt-3 text-gray-400 text-xs">
              <span>{article.author}</span>
              <span>-</span>
              <span>{timeAgo(article.published_at)}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (size === 'small') {
    return (
      <Link href={`/clanok/${article.slug}`} className="group flex gap-3 items-start">
        {article.image_url && (
          <img
            src={article.image_url}
            alt={article.title}
            className="w-20 h-20 rounded object-cover shrink-0 group-hover:opacity-80 transition-opacity"
          />
        )}
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 leading-tight group-hover:text-[#cb1e26] transition-colors line-clamp-3">
            {article.title}
          </h3>
          <span className="text-xs text-gray-500 mt-1 block">{timeAgo(article.published_at)}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/clanok/${article.slug}`} className="group block">
      <div className="overflow-hidden rounded-lg aspect-[16/10] mb-3">
        {article.image_url && (
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
      </div>
      {categoryName && (
        <span className="text-[#cb1e26] text-xs font-bold uppercase">{categoryName}</span>
      )}
      <h3 className="text-lg font-bold text-gray-900 leading-tight mt-1 group-hover:text-[#cb1e26] transition-colors line-clamp-3">
        {article.title}
      </h3>
      <p className="text-gray-500 text-sm mt-1 line-clamp-2">{article.excerpt}</p>
      <div className="flex items-center gap-2 mt-2 text-gray-400 text-xs">
        <span>{article.author}</span>
        <span>-</span>
        <span>{timeAgo(article.published_at)}</span>
      </div>
    </Link>
  );
}
