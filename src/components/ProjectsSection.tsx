import { supabase } from '@/lib/supabase';

type Project = {
  id: string;
  title: string;
  image_url: string;
  external_url: string;
  source_name: string;
};

export default async function ProjectsSection() {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(6);

  const projects = (data || []) as Project[];
  if (!projects.length) return null;

  return (
    <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px 48px' }}>
      <div style={{ borderBottom: '2px solid #cb1e26', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0c1a26', paddingBottom: 8 }}>Tipy na projekty</h2>
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
            style={{ display: 'block', textDecoration: 'none' }}
            className="group"
          >
            <div style={{ overflow: 'hidden', borderRadius: 8, aspectRatio: '16/10', marginBottom: 12, backgroundColor: '#f3f4f6' }}>
              <img
                src={project.image_url}
                alt={project.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                className="group-hover:scale-105"
              />
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0c1a26', lineHeight: 1.35 }} className="group-hover:text-[#cb1e26] transition-colors">
              {project.title}
            </h3>
            <span style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, display: 'block' }}>
              {project.source_name} - externý odkaz
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
