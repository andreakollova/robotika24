const companies = [
  { name: 'Figure', raised: '$1.9B', logo: 'https://logo.clearbit.com/figure.ai' },
  { name: 'Neura Robotics', raised: '$1.7B', logo: 'https://logo.clearbit.com/neurarobotics.com' },
  { name: 'XPeng Robotics', raised: '$1.0B', logo: 'https://logo.clearbit.com/xpeng.com' },
  { name: 'Galbot', raised: '$964M', logo: 'https://logo.clearbit.com/galbot.com' },
  { name: 'Apptronik', raised: '$950M', logo: 'https://logo.clearbit.com/apptronik.com' },
  { name: 'Rhoda', raised: '$680M', logo: 'https://logo.clearbit.com/rhoda.ai' },
  { name: 'Agility', raised: '$570M', logo: 'https://logo.clearbit.com/agilityrobotics.com' },
];

export default function FundingWidget() {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ backgroundColor: '#f8fafc', padding: '16px 16px 12px' }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: '#cb1e26', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
          Humanoidná robotika
        </p>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0c1a26', lineHeight: 1.3, marginBottom: 6 }}>
          Najfinancovanejšie firmy
        </h3>
        <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.4, margin: 0 }}>
          Humanoidná robotika dosiahla v roku 2026 rekordných <span style={{ fontWeight: 700, color: '#0c1a26' }}>$11 miliárd</span> - historické maximum.
        </p>
      </div>

      <div style={{ padding: '4px 16px 12px' }}>
        {companies.map((c) => (
          <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid #f3f4f6' }}>
            <img
              src={c.logo}
              alt={c.name}
              style={{ width: 24, height: 24, borderRadius: 4, objectFit: 'contain', backgroundColor: '#f9fafb', flexShrink: 0 }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#0c1a26', flex: 1 }}>
              {c.name}
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#374151', flexShrink: 0 }}>
              {c.raised}
            </span>
          </div>
        ))}
      </div>

      <a
        href="https://dealroom.co/resources/humanoid-robotics/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'block', padding: '10px 16px', borderTop: '1px solid #e5e7eb', fontSize: 11, color: '#9ca3af', textDecoration: 'none', textAlign: 'center' }}
      >
        Zdroj: dealroom.co - Humanoid sector
      </a>
    </div>
  );
}
