import Link from 'next/link';
import type { Article } from '@/lib/supabase';
import AdBlock from '@/components/AdBlock';

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `pred ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `pred ${hours} hod`;
  const days = Math.floor(hours / 24);
  return `pred ${days} ${days === 1 ? 'dňom' : 'dňami'}`;
}

export default function ArticleSidebar({ articles }: { articles: Article[] }) {
  return (
    <div>
      {/* Ad block top */}
      <div style={{ marginBottom: 24 }}>
        <AdBlock format="rectangle" />
      </div>

      {/* Related articles */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ borderBottom: '2px solid #cb1e26', marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0c1a26', paddingBottom: 8 }}>Súvisiace články</h3>
        </div>
        <div>
          {articles.map((article, i) => (
            <Link
              key={article.id}
              href={`/clanok/${article.slug}`}
              className="group"
              style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 0', borderBottom: i < articles.length - 1 ? '1px solid #f3f4f6' : 'none', textDecoration: 'none' }}
            >
              {article.image_url && (
                <img src={article.image_url} alt={article.title} style={{ width: 80, height: 56, borderRadius: 4, objectFit: 'cover', flexShrink: 0 }} />
              )}
              <div style={{ minWidth: 0, flex: 1 }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0c1a26', lineHeight: 1.35, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const }} className="group-hover:text-[#cb1e26] transition-colors">
                  {article.title}
                </h4>
                <span style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, display: 'block' }}>
                  {timeAgo(article.published_at)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Ad block bottom */}
      <AdBlock format="vertical" />
    </div>
  );
}
