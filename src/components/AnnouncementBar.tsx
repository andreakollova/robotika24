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

export default function AnnouncementBar({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;

  return (
    <div className="bg-[#0c1a26] text-white">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/clanok/${article.slug}`}
              className="flex items-center gap-3 shrink-0 group"
            >
              {article.image_url && (
                <img
                  src={article.image_url}
                  alt=""
                  className="w-14 h-10 rounded object-cover shrink-0"
                />
              )}
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-200 group-hover:text-[#cb1e26] transition-colors line-clamp-2 leading-tight max-w-[220px]">
                  {article.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
