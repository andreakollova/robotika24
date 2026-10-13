const companies: Record<string, { name: string; flag: string; country: string; info: string }> = {
  'EPFL News': {
    name: 'EPFL',
    flag: '🇨🇭',
    country: 'Švajčiarsko',
    info: 'EPFL (École polytechnique fédérale de Lausanne) je jedna z najlepších technických univerzít v Európe. Sídli v Lausanne vo Švajčiarsku a patrí medzi svetových lídrov vo výskume robotiky, umelej inteligencie a nanotechnológií. Na EPFL pôsobí viac ako 380 laboratórií a výskumných skupín.',
  },
  '1X Technologies': {
    name: '1X Technologies',
    flag: '🇳🇴',
    country: 'Nórsko',
    info: '1X Technologies je nórska spoločnosť vyvíjajúca humanoidného robota NEO pre domácnosti. Podporuje ju OpenAI a Samsung. Robot NEO stojí 20 000 dolárov a celá prvá séria 10 000 kusov sa vypredala za päť dní. Firma má sídlo v Moss v Nórsku a výrobnú továreň v Kalifornii.',
  },
  'Comau': {
    name: 'Comau',
    flag: '🇮🇹',
    country: 'Taliansko',
    info: 'Comau je talianska spoločnosť so sídlom v Turíne, špecializujúca sa na priemyselnú automatizáciu a robotiku. Vznikla v roku 1973 a dnes pôsobí vo viac ako 13 krajinách. Comau vyrába priemyselné roboty, kolaboratívne coboty MyCo, exoskelety MATE a automatizačné riešenia pre automobilový, energetický a logistický priemysel.',
  },
  'ABB': {
    name: 'ABB',
    flag: '🇨🇭',
    country: 'Švajčiarsko / Švédsko',
    info: 'ABB je švajčiarsko-švédska nadnárodná korporácia so sídlom v Zürichu. Patrí medzi svetových lídrov v oblasti robotiky, automatizácie a elektrotechniky. ABB má viac ako 105 000 zamestnancov vo vyše 100 krajinách. V robotike je známa svojimi priemyselnými robotmi IRB a kolaboratívnymi robotmi YuMi.',
  },
  'KUKA': {
    name: 'KUKA',
    flag: '🇩🇪',
    country: 'Nemecko',
    info: 'KUKA je nemecký výrobca priemyselných robotov a automatizačných systémov so sídlom v Augsburgu. Firma bola založená v roku 1898 a dnes patrí medzi najväčších výrobcov robotov na svete. Od roku 2016 je súčasťou čínskej skupiny Midea. KUKA roboty sa používajú v automobilovom priemysle, elektronike, logistike a medicíne.',
  },
  'Avular': {
    name: 'Avular',
    flag: '🇳🇱',
    country: 'Holandsko',
    info: 'Avular je holandská robotická spoločnosť z Eindhovenu, ktorá vyvíja autonómne roboty pre vonkajšie prostredie. Jej roboty sa používajú v stavebníctve, údržbe infraštruktúry a poľnohospodárstve. Firma získala ocenenie Tech Hero Award a spolupracuje s firmami ako Heijmans a SGL.',
  },
  'The Robot Report': {
    name: 'The Robot Report',
    flag: '🇺🇸',
    country: 'USA',
    info: 'The Robot Report je americký online spravodajský portál zameraný na robotiku, automatizáciu a umelú inteligenciu. Prináša novinky o najnovších trendoch v robotickom priemysle, recenzie technológií a analýzy trhu.',
  },
  'Interesting Engineering': {
    name: 'Interesting Engineering',
    flag: '🇺🇸',
    country: 'USA',
    info: 'Interesting Engineering je globálny technologický portál so sídlom v USA, ktorý pokrýva inovácie v oblasti inžinierstva, vedy a technológií. Má viac ako 15 miliónov čitateľov mesačne.',
  },
};

export default function CompanyInfo({ sourceName }: { sourceName: string | null }) {
  if (!sourceName) return null;
  const company = companies[sourceName];
  if (!company) return null;

  return (
    <div style={{ marginTop: 32, padding: 20, borderRadius: 12, border: '1px solid var(--border)', backgroundColor: 'var(--bg-secondary)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={{ fontSize: 24 }}>{company.flag}</span>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>O spoločnosti {company.name}</h3>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{company.country}</span>
        </div>
      </div>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
        {company.info}
      </p>
    </div>
  );
}
