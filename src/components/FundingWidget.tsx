const companies = [
  { name: 'Figure', raised: '$1.9B', logo: 'https://logo.clearbit.com/figure.ai' },
  { name: 'Neura Robotics', raised: '$1.7B', logo: 'https://logo.clearbit.com/neurarobotics.com' },
  { name: 'XPeng Robotics', raised: '$1.0B', logo: 'https://logo.clearbit.com/xpeng.com' },
  { name: 'Galbot', raised: '$964M', logo: 'https://logo.clearbit.com/galbot.com' },
  { name: 'Apptronik', raised: '$950M', logo: 'https://logo.clearbit.com/apptronik.com' },
  { name: 'Rhoda', raised: '$680M', logo: 'https://logo.clearbit.com/rhodarobotics.com' },
  { name: 'Agility', raised: '$570M', logo: 'https://logo.clearbit.com/agilityrobotics.com' },
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
      <div>
        {companies.map((c) => (
          <div key={c.name} style={{ display: 'flex', alignItems: 'center', padding: '10px 14px', borderBottom: '1px solid #f3f4f6', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, overflow: 'hidden', flexShrink: 0, backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={c.logo} alt={c.name} style={{ width: 32, height: 32, objectFit: 'contain' }} onError={(e) => { (e.target as HTMLImageElement).src = `https://www.google.com/s2/favicons?domain=${c.logo.split('/').pop()}&sz=128`; }} />
            </div>
            <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: '#0c1a26' }}>{c.name}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#374151', whiteSpace: 'nowrap' }}>{c.raised}</span>
          </div>
        ))}
      </div>
      <a href="https://dealroom.co/resources/humanoid-robotics/" target="_blank" rel="noopener noreferrer"
        style={{ display: 'block', padding: '8px', fontSize: 10, color: '#9ca3af', textDecoration: 'none', textAlign: 'center' }}>
        dealroom.co
      </a>
    </div>
  );
}
