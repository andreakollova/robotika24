const models = [
  { category: 'Inteligencia', name: 'Claude Opus 4.6', logo: 'https://www.google.com/s2/favicons?domain=anthropic.com&sz=128' },
  { category: 'Rýchlosť', name: 'Gemini 2.5 Flash', logo: 'https://www.google.com/s2/favicons?domain=deepmind.google&sz=128' },
  { category: 'Latencia', name: 'Gemini Flash-Lite', logo: 'https://www.google.com/s2/favicons?domain=deepmind.google&sz=128' },
  { category: 'Najlacnejší', name: 'GPT-6 Luna', logo: 'https://www.google.com/s2/favicons?domain=openai.com&sz=128' },
];

export default function AIModelsWidget() {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', marginTop: 20 }}>
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #f3f4f6' }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#cb1e26', textTransform: 'uppercase', letterSpacing: '0.08em' }}>AI Modely</span>
        <p style={{ fontSize: 13, color: '#374151', margin: '6px 0 0', lineHeight: 1.4 }}>Aktuálne najlepšie modely v daných kategóriách</p>
      </div>
      <div>
        {models.map((m) => (
          <div key={m.category} style={{ display: 'flex', alignItems: 'center', padding: '10px 14px', borderBottom: '1px solid #f3f4f6', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, overflow: 'hidden', flexShrink: 0, backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={m.logo} alt={m.name} style={{ width: 32, height: 32, objectFit: 'contain' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0c1a26' }}>{m.name}</div>
            </div>
            <span style={{ fontSize: 11, color: '#9ca3af', whiteSpace: 'nowrap' }}>{m.category}</span>
          </div>
        ))}
      </div>
      <a href="https://artificialanalysis.ai/leaderboards/models" target="_blank" rel="noopener noreferrer"
        style={{ display: 'block', padding: '8px', fontSize: 10, color: '#9ca3af', textDecoration: 'none', textAlign: 'center' }}>
        artificialanalysis.ai
      </a>
    </div>
  );
}
