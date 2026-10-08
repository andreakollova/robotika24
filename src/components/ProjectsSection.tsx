import { supabase } from '@/lib/supabase';

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

export default async function ProjectsSection() {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .order('stars', { ascending: false })
    .limit(6);

  const projects = (data || []) as Project[];
  if (!projects.length) return null;

  return (
    <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px 48px' }}>
      <div style={{ borderBottom: '2px solid #cb1e26', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', paddingBottom: 8 }}>Open Source Projekty</h2>
        <a href="/projekty" style={{ fontSize: 13, fontWeight: 600, color: '#cb1e26', textDecoration: 'none', paddingBottom: 8 }}>
          Zobraziť všetky &rarr;
        </a>
      </div>

      <div className="articles-grid">
        {projects.map((project) => (
          <a
            key={project.id}
            href={project.external_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block', textDecoration: 'none', border: '1px solid var(--border)', borderRadius: 10, padding: 16, transition: 'border-color 0.2s' }}
            className="group hover:border-[#cb1e26]"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#cb1e26', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{project.category}</span>
              {project.is_new && (
                <span style={{ fontSize: 9, fontWeight: 700, color: '#fff', backgroundColor: '#cb1e26', padding: '2px 6px', borderRadius: 3, textTransform: 'uppercase' }}>New</span>
              )}
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 6 }} className="group-hover:text-[#cb1e26] transition-colors">
              {project.title}
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.45, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {project.description}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
              {(project.tags || []).slice(0, 3).map((tag) => (
                <span key={tag} style={{ fontSize: 10, color: 'var(--text-tertiary)', backgroundColor: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: 4 }}>{tag}</span>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: 'var(--text-muted)' }}>
              <span>⭐ {project.stars.toLocaleString()}</span>
              {project.license && <span>{project.license}</span>}
              <span style={{ marginLeft: 'auto' }}>growbotics.ai ↗</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
