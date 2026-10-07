const companies = [
  { name: 'Figure', raised: '$1.9B', valuation: '$39B', color: '#3B82F6', width: 100 },
  { name: 'Neura Robotics', raised: '$1.7B', valuation: '$7.0B', color: '#34D399', width: 89 },
  { name: 'XPeng Robotics', raised: '$1.0B', valuation: '$6.0B', color: '#8B5CF6', width: 53 },
  { name: 'Galbot', raised: '$964M', valuation: '$2.9B', color: '#8B5CF6', width: 51 },
  { name: 'Apptronik', raised: '$950M', valuation: '$5.5B', color: '#3B82F6', width: 50 },
  { name: 'Rhoda', raised: '$680M', valuation: '$1.7B', color: '#8B5CF6', width: 36 },
  { name: 'Agility', raised: '$570M', valuation: '$2.5B', color: '#60A5FA', width: 30 },
];

export default function FundingWidget() {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', marginTop: 20 }}>
      <div style={{ backgroundColor: '#f8fafc', padding: '16px 16px 8px' }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: '#cb1e26', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
          Humanoidná robotika
        </p>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0c1a26', lineHeight: 1.3, marginBottom: 4 }}>
          Najfinancovanejšie firmy
        </h3>
        <p style={{ fontSize: 11, color: '#9ca3af' }}>VC investície od 2020</p>
      </div>

      <div style={{ padding: '12px 16px' }}>
        {companies.map((c) => (
          <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#374151', width: 80, textAlign: 'right', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {c.name}
            </span>
            <div style={{ flex: 1, height: 14, backgroundColor: '#f3f4f6', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${c.width}%`, height: '100%', backgroundColor: c.color, borderRadius: 3 }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#0c1a26', width: 45, flexShrink: 0 }}>
              {c.raised}
            </span>
          </div>
        ))}
      </div>

      <a
        href="https://dealroom.co/resources/humanoid-robotics/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'block', padding: '10px 16px', borderTop: '1px solid #f3f4f6', fontSize: 11, color: '#9ca3af', textDecoration: 'none', textAlign: 'center' }}
      >
        Zdroj: dealroom.co - Humanoid sector
      </a>
    </div>
  );
}
