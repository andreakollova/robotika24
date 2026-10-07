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

export default function Sidebar({ articles }: { articles: Article[] }) {
  return (
    <aside className="bg-gray-50 rounded-lg p-5 border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-bold text-gray-900">Najcitanejsie</h2>
        <div className="h-px flex-1 bg-gray-200" />
      </div>
      <div className="space-y-4">
        {articles.map((article, i) => (
          <Link
            key={article.id}
            href={`/clanok/${article.slug}`}
            className="flex gap-3 items-start group"
          >
            <span className="text-2xl font-black text-[#cb1e26] w-8 shrink-0">{i + 1}</span>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 leading-tight group-hover:text-[#cb1e26] transition-colors line-clamp-3">
                {article.title}
              </h3>
              <span className="text-xs text-gray-400 mt-1 block">
                {timeAgo(article.published_at)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
