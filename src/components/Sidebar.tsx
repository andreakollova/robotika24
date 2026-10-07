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
    <aside className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Tab header */}
      <div className="flex border-b border-gray-200">
        <div className="flex-1 px-4 py-3 text-sm font-bold text-[#0c1a26] border-b-2 border-[#cb1e26] bg-white">
          Najcitanejsie
        </div>
        <div className="flex-1 px-4 py-3 text-sm font-bold text-gray-400 bg-gray-50">
          Najnovsie
        </div>
      </div>

      {/* Articles list */}
      <div className="p-4">
        {articles.map((article, i) => (
          <Link
            key={article.id}
            href={`/clanok/${article.slug}`}
            className="flex gap-3 items-start group py-3 border-b border-gray-100 last:border-0 first:pt-0"
          >
            <span className="w-7 h-7 rounded-full border-2 border-gray-300 text-[13px] font-bold text-gray-500 flex items-center justify-center shrink-0 group-hover:border-[#cb1e26] group-hover:text-[#cb1e26] transition-colors">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-[13px] font-bold text-[#0c1a26] leading-tight group-hover:text-[#cb1e26] transition-colors line-clamp-3">
                {article.title}
              </h3>
              <span className="text-[11px] text-gray-400 mt-1 block">
                {timeAgo(article.published_at)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
