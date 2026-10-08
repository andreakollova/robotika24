const models = [
  { category: 'Inteligencia', name: 'Claude Opus 4.6', domain: 'anthropic.com' },
  { category: 'Rýchlosť', name: 'Gemini 2.5 Flash', domain: 'deepmind.google' },
  { category: 'Latencia', name: 'Gemini Flash-Lite', domain: 'deepmind.google' },
  { category: 'Najlacnejší', name: 'GPT-6 Luna', domain: 'openai.com' },
];

export default function AIModelsWidget() {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', marginTop: 20 }}>
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #f3f4f6' }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#cb1e26', textTransform: 'uppercase', letterSpacing: '0.08em' }}>AI Modely</span>
        <p style={{ fontSize: 13, color: '#374151', margin: '6px 0 0', lineHeight: 1.4 }}>Aktuálne najlepšie modely v daných kategóriách</p>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {models.map((m) => (
            <tr key={m.category} style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: '10px 14px', width: 40 }}>
                <img src={`https://www.google.com/s2/favicons?domain=${m.domain}&sz=128`} alt="" style={{ width: 28, height: 28, borderRadius: 6, display: 'block' }} />
              </td>
              <td style={{ padding: '10px 0' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0c1a26' }}>{m.name}</div>
              </td>
              <td style={{ padding: '10px 14px', fontSize: 11, color: '#9ca3af', textAlign: 'right', whiteSpace: 'nowrap' }}>{m.category}</td>
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
