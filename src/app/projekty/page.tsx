import { supabase } from '@/lib/supabase';

export const metadata = {
  title: 'Open Source Robotické Projekty',
  description: 'Prehľad najlepších open source projektov z oblasti robotiky. Hardware, softvér, simulátory a datasety pre robotiku.',
  alternates: { canonical: '/projekty' },
};

export const revalidate = 60;

type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  tags: string[];
  stars: number;
  license: string;
  external_url: string;
  source_name: string;
  is_new: boolean;
};

export default async function ProjektyPage() {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .order('stars', { ascending: false });

  const projects = (data || []) as Project[];

  // Group by category
  const categories = [...new Set(projects.map(p => p.category))];

  return (
    <div className="max-w-[1280px] mx-auto px-4 pt-6 pb-20">
      <div className="border-b-2 border-[#cb1e26] mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] pb-2">Open Source Projekty</h1>
        <p className="text-sm text-[var(--text-tertiary)] pb-3">
          {projects.length} projektov z komunity robotiky
        </p>
      </div>

      {categories.map((cat) => {
        const catProjects = projects.filter(p => p.category === cat);
        return (
          <section key={cat} className="mb-10">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              {cat}
              <span className="text-xs font-normal text-[var(--text-muted)]">({catProjects.length})</span>
            </h2>
            <div className="articles-grid">
              {catProjects.map((project) => (
                <a
                  key={project.id}
                  href={project.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'block', textDecoration: 'none', border: '1px solid var(--border)', borderRadius: 10, padding: 16, transition: 'border-color 0.2s' }}
                  className="group hover:border-[#cb1e26]"
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{project.subcategory}</span>
                    {project.is_new && (
                      <span style={{ fontSize: 9, fontWeight: 700, color: '#fff', backgroundColor: '#cb1e26', padding: '2px 6px', borderRadius: 3, textTransform: 'uppercase' }}>New</span>
                    )}
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 6 }} className="group-hover:text-[#cb1e26] transition-colors">
                    {project.title}
                  </h3>
                  <p style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.45, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {project.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                    {(project.tags || []).slice(0, 4).map((tag) => (
                      <span key={tag} style={{ fontSize: 10, color: 'var(--text-tertiary)', backgroundColor: 'var(--border-light)', padding: '2px 8px', borderRadius: 4 }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, color: 'var(--text-muted)' }}>
                    <span>⭐ {project.stars.toLocaleString()}</span>
                    {project.license && <span>{project.license}</span>}
                    <span style={{ marginLeft: 'auto' }}>growbotics.ai ↗</span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
