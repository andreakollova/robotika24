const categories = [
  {
    name: 'Inteligencia',
    leader: 'Claude Opus 4.6',
    leaderDomain: 'anthropic.com',
    runner: 'Claude Sonnet 4.6',
    runnerDomain: 'anthropic.com',
    color: '#D97757',
  },
  {
    name: 'Rýchlosť',
    leader: 'Gemini 2.5 Flash',
    leaderDomain: 'deepmind.google',
    runner: 'Mercury 2',
    runnerDomain: 'inceptionlabs.ai',
    color: '#4285F4',
  },
  {
    name: 'Latencia',
    leader: 'Gemini 2.5 Flash-Lite',
    leaderDomain: 'deepmind.google',
    runner: 'North Mini Code',
    runnerDomain: 'north.app',
    color: '#34A853',
  },
  {
    name: 'Cena za úlohu',
    leader: 'GPT-6 Luna',
    leaderDomain: 'openai.com',
    runner: 'Granite 4.2 3B',
    runnerDomain: 'ibm.com',
    color: '#10A37F',
  },
];

function Logo({ domain }: { domain: string }) {
  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
      alt=""
      style={{ width: 22, height: 22, borderRadius: 4, objectFit: 'contain', flexShrink: 0 }}
    />
  );
}

export default function AIModelsWidget() {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', marginTop: 20 }}>
      <div style={{ backgroundColor: '#f8fafc', padding: '16px 16px 12px' }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: '#cb1e26', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
          AI Modely
        </p>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0c1a26', lineHeight: 1.3 }}>
          Lídri v kategóriách
        </h3>
      </div>

      <div style={{ padding: '4px 16px 12px' }}>
        {categories.map((cat) => (
          <div key={cat.name} style={{ padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: cat.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#0c1a26' }}>{cat.name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Logo domain={cat.leaderDomain} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#0c1a26' }}>{cat.leader}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 2 }}>
              <Logo domain={cat.runnerDomain} />
              <span style={{ fontSize: 12, color: '#6b7280' }}>{cat.runner}</span>
            </div>
          </div>
        ))}
      </div>

      <a href="https://artificialanalysis.ai/leaderboards/models" target="_blank" rel="noopener noreferrer"
        style={{ display: 'block', padding: '10px 16px', borderTop: '1px solid #e5e7eb', fontSize: 11, color: '#9ca3af', textDecoration: 'none', textAlign: 'center' }}>
        Zdroj: artificialanalysis.ai
      </a>
    </div>
  );
}
