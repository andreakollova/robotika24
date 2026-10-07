const categories = [
  {
    name: 'Inteligencia',
    leader: 'Claude Opus 4.6',
    runner: 'Claude Sonnet 4.6',
    color: '#D97757',
  },
  {
    name: 'Rýchlosť',
    leader: 'Gemini 2.5 Flash',
    runner: 'Mercury 2',
    color: '#4285F4',
  },
  {
    name: 'Latencia',
    leader: 'Gemini 2.5 Flash-Lite',
    runner: 'North Mini Code',
    color: '#34A853',
  },
  {
    name: 'Cena za úlohu',
    leader: 'GPT-6 Luna (low)',
    runner: 'Granite 4.2 3B',
    color: '#10A37F',
  },
];

export default function AIModelsWidget() {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', marginTop: 20 }}>
      <div style={{ backgroundColor: '#f8fafc', padding: '16px 16px 8px' }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: '#cb1e26', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
          AI Modely
        </p>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0c1a26', lineHeight: 1.3, marginBottom: 4 }}>
          Lídri v kategóriách
        </h3>
      </div>

      <div style={{ padding: '8px 16px 16px' }}>
        {categories.map((cat) => (
          <div key={cat.name} style={{ padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: cat.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#0c1a26' }}>{cat.name}</span>
            </div>
            <p style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.4, margin: 0 }}>
              <span style={{ fontWeight: 600, color: '#374151' }}>{cat.leader}</span> a {cat.runner}
            </p>
          </div>
        ))}
      </div>

      <a
        href="https://artificialanalysis.ai/leaderboards/models"
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'block', padding: '10px 16px', borderTop: '1px solid #f3f4f6', fontSize: 11, color: '#9ca3af', textDecoration: 'none', textAlign: 'center' }}
      >
        Zdroj: artificialanalysis.ai
      </a>
    </div>
  );
}
