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
      <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid #f3f4f6' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#cb1e26', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Humanoidná robotika</span>
          <span style={{ fontSize: 11, color: '#9ca3af' }}>2026</span>
        </div>
        <p style={{ fontSize: 13, color: '#374151', margin: 0 }}>
          Sektor dosiahol rekordných <strong>$11 mld</strong>
        </p>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {companies.map((c) => (
            <tr key={c.name} style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: '8px 12px', width: 32 }}>
                <img src={`https://www.google.com/s2/favicons?domain=${c.domain}&sz=64`} alt="" style={{ width: 20, height: 20, borderRadius: 4 }} />
              </td>
              <td style={{ padding: '8px 0', fontSize: 13, fontWeight: 500, color: '#0c1a26' }}>{c.name}</td>
              <td style={{ padding: '8px 12px', fontSize: 13, fontWeight: 700, color: '#374151', textAlign: 'right' }}>{c.raised}</td>
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
