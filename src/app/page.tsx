import { supabase } from '@/lib/supabase';
import type { Article } from '@/lib/supabase';
import ArticleCard from '@/components/ArticleCard';
import Sidebar from '@/components/Sidebar';
import AnnouncementBar from '@/components/AnnouncementBar';
import ProjectsSection from '@/components/ProjectsSection';
import AdBlock from '@/components/AdBlock';

export const revalidate = 60;

async function getArticles() {
  const { data: all } = await supabase
    .from('articles')
    .select('*, categories(*)')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(30);

  const { data: popularRaw } = await supabase
    .from('articles')
    .select('*, categories(*)')
    .eq('is_published', true)
    .order('views', { ascending: false })
    .limit(10);

  const articles = (all || []) as Article[];
  const allPopular = (popularRaw || []) as Article[];

  const announcement = articles.slice(0, 4);
  const hero = articles[4] || articles[0];
  const heroSide = articles[5] || articles[1];
  const heroIds = new Set([hero?.id, heroSide?.id]);

  const popular = allPopular.filter(a => !heroIds.has(a.id)).slice(0, 5);
  const latest = articles.filter(a => !heroIds.has(a.id)).slice(0, 5);
  const grid = articles.filter(a => !heroIds.has(a.id)).slice(0, 20);

  return { announcement, hero, heroSide, grid, popular, latest };
}

export default async function Home() {
  const { announcement, hero, heroSide, grid, popular, latest } = await getArticles();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'robotika24',
    url: 'https://robotika24.sk',
    description: 'Slovenský spravodajský portál o robotike, umelej inteligencii a moderných technológiách.',
    inLanguage: 'sk',
    publisher: {
      '@type': 'Organization',
      name: 'robotika24',
      logo: { '@type': 'ImageObject', url: 'https://robotika24.sk/logo.png' },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AnnouncementBar articles={announcement} />

      <div style={{ maxWidth: 1280, margin: '0 auto' }} className="px-5 sm:px-5 pt-6">
        {/* Hero cards - full width, side by side */}
        {hero && (
          <section style={{ marginBottom: 24 }}>
            <div className="hero-cards">
              <ArticleCard article={hero} size="hero" />
              {heroSide && <ArticleCard article={heroSide} size="hero" />}
            </div>
          </section>
        )}

        {/* Divider */}
        <div style={{ borderBottom: '2px solid #cb1e26', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0c1a26', paddingBottom: 8 }}>Najnovšie správy</h2>
        </div>

        {/* Grid + Sidebar */}
        <div className="content-layout">
          <section className="articles-grid">
            {grid.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </section>
          <aside>
            <Sidebar articles={popular} latestArticles={latest} />
          </aside>
        </div>
      </div>

      {/* Newsletter CTA */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '24px 28px', border: '1px solid var(--border)', borderRadius: 12, flexWrap: 'wrap' }}>
          <img src="/mascot-small.png" alt="robotika24" style={{ width: 56, height: 56, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Odoberajte novinky zo sveta robotiky</p>
            <p style={{ fontSize: 13, color: 'var(--text-tertiary)', margin: '4px 0 0' }}>Najnovšie správy priamo do vášho e-mailu.</p>
          </div>
          <a href="/odber" style={{ padding: '10px 24px', fontSize: 13, fontWeight: 700, color: '#fff', backgroundColor: '#cb1e26', borderRadius: 24, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Odoberať
          </a>
        </div>
      </section>

      <ProjectsSection />
    </>
  );
}
