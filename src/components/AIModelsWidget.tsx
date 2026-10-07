const models = [
  { category: 'Inteligencia', name: 'Claude Opus 4.6', domain: 'anthropic.com' },
  { category: 'Rýchlosť', name: 'Gemini 2.5 Flash', domain: 'deepmind.google' },
  { category: 'Latencia', name: 'Gemini Flash-Lite', domain: 'deepmind.google' },
  { category: 'Najlacnejší', name: 'GPT-6 Luna', domain: 'openai.com' },
];

export default function AIModelsWidget() {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', marginTop: 20 }}>
      <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid #f3f4f6' }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#cb1e26', textTransform: 'uppercase', letterSpacing: '0.08em' }}>AI Modely</span>
        <p style={{ fontSize: 13, color: '#374151', margin: '4px 0 0' }}>Najlepšie v každej kategórii</p>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {models.map((m) => (
            <tr key={m.category} style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: '8px 12px', width: 32 }}>
                <img src={`https://www.google.com/s2/favicons?domain=${m.domain}&sz=64`} alt="" style={{ width: 20, height: 20, borderRadius: 4 }} />
              </td>
              <td style={{ padding: '8px 0' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0c1a26' }}>{m.name}</div>
              </td>
              <td style={{ padding: '8px 12px', fontSize: 11, color: '#9ca3af', textAlign: 'right', whiteSpace: 'nowrap' }}>{m.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <a href="https://artificialanalysis.ai/leaderboards/models" target="_blank" rel="noopener noreferrer"
        style={{ display: 'block', padding: '8px', fontSize: 10, color: '#9ca3af', textDecoration: 'none', textAlign: 'center' }}>
        artificialanalysis.ai
      </a>
    </div>
  );
}
