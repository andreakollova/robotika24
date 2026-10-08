const companies = [
  { name: 'Figure', raised: '$1.9B', domain: 'figure.ai' },
  { name: 'Neura Robotics', raised: '$1.7B', domain: 'neurarobotics.com' },
  { name: 'XPeng Robotics', raised: '$1.0B', domain: 'xpeng.com' },
  { name: 'Galbot', raised: '$964M', domain: 'galbot.com' },
  { name: 'Apptronik', raised: '$950M', domain: 'apptronik.com' },
  { name: 'Rhoda', raised: '$680M', domain: 'rhodarobotics.com' },
  { name: 'Agility', raised: '$570M', domain: 'agilityrobotics.com' },
];

export default function FundingWidget() {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #f3f4f6' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#cb1e26', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Humanoidná robotika</span>
          <span style={{ fontSize: 11, color: '#9ca3af' }}>2026</span>
        </div>
        <p style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: 1.4 }}>
          V súčasnosti tento sektor dosiahol rekordných <strong>$11 mld</strong>
        </p>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {companies.map((c) => (
            <tr key={c.name} style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: '10px 14px', width: 40 }}>
                <img src={`https://www.google.com/s2/favicons?domain=${c.domain}&sz=128`} alt="" style={{ width: 28, height: 28, borderRadius: 6, display: 'block' }} />
              </td>
              <td style={{ padding: '10px 0', fontSize: 14, fontWeight: 500, color: '#0c1a26' }}>{c.name}</td>
              <td style={{ padding: '10px 14px', fontSize: 14, fontWeight: 700, color: '#374151', textAlign: 'right' }}>{c.raised}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <a href="https://dealroom.co/resources/humanoid-robotics/" target="_blank" rel="noopener noreferrer"
        style={{ display: 'block', padding: '8px', fontSize: 10, color: '#9ca3af', textDecoration: 'none', textAlign: 'center' }}>
        dealroom.co
      </a>
    </div>
  );
}
