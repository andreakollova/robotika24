export const metadata = {
  title: 'O nás',
  description: 'robotika24 je slovenský spravodajský portál zameraný na robotiku, umelú inteligenciu a moderné technológie. Denne prinášame novinky zo sveta robotov.',
  alternates: { canonical: '/o-nas' },
};

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 20px 80px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 24 }}>O nás</h1>

      <div style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.8 }}>
        <p style={{ fontSize: 18, color: 'var(--text-primary)', fontWeight: 500, marginBottom: 24 }}>
          robotika24 je slovenský spravodajský portál zameraný na robotiku, umelú inteligenciu a moderné technológie.
        </p>

        <p>
          Každý deň prinášame preložené a upravené články z najlepších svetových zdrojov, aby slovenskí čitatelia mali prístup k aktuálnym informáciám zo sveta robotov, automatizácie, dronov a AI - v slovenskom jazyku.
        </p>

        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginTop: 32, marginBottom: 12 }}>Naša redakcia</h2>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 20 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flex: 1, minWidth: 280 }}>
            <img src="/author.jpg" alt="Martin Kováč" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Martin Kováč</h3>
              <p style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>Šéfredaktor. Zameriava sa na priemyselnú robotiku, autonómne vozidlá a spotrebiteľské technológie.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flex: 1, minWidth: 280 }}>
            <img src="/author2.jpg" alt="Simona Hrušková" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Simona Hrušková</h3>
              <p style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>Redaktorka. Pokrýva výskum, vývoj a prepojenie robotiky so vzdelávaním a zdravotníctvom.</p>
            </div>
          </div>
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginTop: 32, marginBottom: 12 }}>Zdroje</h2>
        <p>
          Naše články vychádzajú z overených zahraničných zdrojov vrátane The Robot Report a Interesting Engineering.
          Pri každom článku uvádzame pôvodný zdroj a autora.
        </p>

        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginTop: 32, marginBottom: 12 }}>Kontakt</h2>
        <p>
          Prevádzkovateľ: <strong>DRIXTON s.r.o.</strong><br />
          E-mail: <a href="mailto:studio@drixton.com" style={{ color: '#cb1e26' }}>studio@drixton.com</a>
        </p>
      </div>
    </div>
  );
}
