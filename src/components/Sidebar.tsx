'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Article } from '@/lib/supabase';

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `pred ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `pred ${hours} hod`;
  const days = Math.floor(hours / 24);
  return `pred ${days} ${days === 1 ? 'dňom' : 'dňami'}`;
}

export default function Sidebar({ articles, latestArticles }: { articles: Article[]; latestArticles?: Article[] }) {
  const [tab, setTab] = useState<'popular' | 'latest'>('popular');
  const displayArticles = tab === 'popular' ? articles : (latestArticles || articles);

  return (
    <div>
      <aside style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
          <button
            onClick={() => setTab('popular')}
            style={{
              flex: 1, padding: '12px 16px', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer',
              color: tab === 'popular' ? '#0c1a26' : '#9ca3af',
              borderBottom: tab === 'popular' ? '2px solid #cb1e26' : '2px solid transparent',
              backgroundColor: tab === 'popular' ? '#fff' : '#f9fafb',
            }}
          >
            Najčítanejšie
          </button>
          <button
            onClick={() => setTab('latest')}
            style={{
              flex: 1, padding: '12px 16px', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer',
              color: tab === 'latest' ? '#0c1a26' : '#9ca3af',
              borderBottom: tab === 'latest' ? '2px solid #cb1e26' : '2px solid transparent',
              backgroundColor: tab === 'latest' ? '#fff' : '#f9fafb',
            }}
          >
            Najnovšie
          </button>
        </div>

        <div style={{ padding: 16 }}>
          {displayArticles.map((article, i) => (
            <Link
              key={article.id}
              href={`/clanok/${article.slug}`}
              className="group"
              style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 0', borderBottom: i < displayArticles.length - 1 ? '1px solid #f3f4f6' : 'none', textDecoration: 'none' }}
            >
              <span style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid #d1d5db', fontSize: 13, fontWeight: 700, color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} className="group-hover:border-[#cb1e26] group-hover:text-[#cb1e26] transition-colors">
                {i + 1}
              </span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#0c1a26', lineHeight: 1.35, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const }} className="group-hover:text-[#cb1e26] transition-colors">
                  {article.title}
                </h3>
                <span style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, display: 'block' }}>
                  {timeAgo(article.published_at)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </aside>

      {/* Ad block */}
      <div id="ad-sidebar" style={{ marginTop: 20, border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', backgroundColor: '#f9fafb', textAlign: 'center' as const }}>
        <div style={{ padding: '40px 20px' }}>
          <div style={{ width: '100%', maxWidth: 300, height: 250, margin: '0 auto', backgroundColor: '#e5e7eb', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: 13, fontWeight: 600 }}>
            REKLAMA 300x250
          </div>
        </div>
        <p style={{ fontSize: 10, color: '#d1d5db', padding: '0 0 8px', textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>
          Inzercia
        </p>
      </div>
    </div>
  );
}
