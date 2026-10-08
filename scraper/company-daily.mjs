// Publish one "Poznas tuto firmu?" company post to IG every other day
// Usage: node scraper/company-daily.mjs
import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { generateCompanyCarousel } from './instagram.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load env
try {
  const envFile = readFileSync(resolve(__dirname, '..', '.env.local'), 'utf8');
  envFile.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key && vals.length) process.env[key.trim()] = vals.join('=').trim();
  });
} catch {}

const SUPABASE_URL = 'https://odpwfmrllqjdzgbgrxfc.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const IG_TOKEN = process.env.IG_ACCESS_TOKEN;
const IG_ACCOUNT = process.env.IG_BUSINESS_ACCOUNT;
const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK_URL;

const supabase = SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

const STATE_FILE = resolve(__dirname, '../.company-state.json');

function loadState() {
  try { return JSON.parse(readFileSync(STATE_FILE, 'utf8')); }
  catch { return { index: 0 }; }
}

function saveState(state) {
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

// Companies with text and logo - only these get posted
const companies = [
  { slug: 'figure', name: 'Figure', logo: 'figure.png',
    description: '**Figure AI** patrí medzi najsledovanejšie spoločnosti v oblasti humanoidných robotov. Založil ju v roku **2022** **Brett Adcock**, ktorý predtým vybudoval aj firmu **Archer Aviation** vyvíjajúcu elektrické lietajúce taxíky. Srdcom jej robotov je vlastný model umelej inteligencie **Helix**, ktorý dokáže naraz ovládať až dvoch robotov. Do apríla **2026** firma dodala vyše **350 robotov Figure 03** a dnes vyrába jedného za každú hodinu. Namiesto klasického predaja ponúka roboty v prenájme približne za **1 000 dolárov** mesačne, vrátane údržby a aktualizácií softvéru. Najväčšiu pozornosť si získala, keď jej robot vystúpil v **Bielom dome** a privítal hostí z **45 krajín** v **11 jazykoch**.' },
  { slug: 'neura', name: 'NEURA Robotics', logo: 'neura.jpg',
    description: '**NEURA Robotics** je nemecká firma, ktorá sa snaží dokázať, že aj Európa môže konkurovať USA a Číne v oblasti humanoidných robotov. Sídli v meste **Metzingen** a najnovšiu generáciu svojho humanoida **4NE1** predstavila na veľtrhu **CES 2026** v Las Vegas. Firma tvrdí, že robot zvládne žehliť, vykladať umývačku riadu či prenášať predmety až do **100 kg**, a to bez programovania pre každé nové prostredie. O „mozog" robota sa stará platforma **NVIDIA GR00T**, otvorený model umelej inteligencie pre humanoidné zručnosti. Výkonný riaditeľ **David Reger** vyhlásil, že firma robí pre robotiku to, čo iPhone urobil pre smartfóny. Prvé dodávky robota sa očakávajú na konci roka **2026**, zatiaľ si ho možno len rezervovať.' },
  { slug: 'xpeng', name: 'XPeng', logo: 'XPeng-Logo.png',
    description: '**XPeng** je čínsky výrobca elektromobilov, ktorý svoje skúsenosti z automobilového priemyslu využíva aj pri stavbe humanoidných robotov. Jeho robot **IRON** sa preslávil, keď ho prezentujúci priamo na pódiu rozrezali, aby dokázali, že v ňom nie je človek. Meria približne **1,73 metra**, váži okolo **70 kilogramov** a má viac ako **60 kĺbov**, ľudskú chrbticu aj umelé svaly. Poháňajú ho tri vlastné AI čipy **Turing** s celkovým výkonom **2 250 biliónov** operácií za sekundu. V septembri **2026** firma spustila výrobné linky a prvý hotový IRON z nich samostatne odišiel po vlastných nohách. Hromadná výroba má začať do konca roka **2026** a prvé roboty budú pracovať v predajniach a areáloch XPengu.' },
  { slug: 'galbot', name: 'Galbot', logo: 'galbot.webp',
    description: '**Galbot** je čínsky startup z Pekingu, ktorý patrí medzi najrýchlejšie rastúce robotické firmy na svete. Založil ho profesor Pekinskej univerzity **Wang He** a jeho robot **G1** má namiesto nôh kolesá, pretože firma uprednostňuje šikovné ruky pred chôdzou. Vďaka umelej inteligencii dokáže robot rozoznať a manipulovať s **5 000 druhmi** tovaru, pričom jeho nasadenie do nového obchodu trvá len jeden deň. Firma prevádzkuje aj plne autonómne predajne **Galbot Store**, ktoré obsluhujú výlučne roboty G1 a fungujú vo viac ako **30 mestách**. Spolupracuje s gigantmi ako **CATL**, **Bosch**, **Toyota** či **Hyundai** a získala objednávky na tisíce robotov. Jej hodnota sa odhaduje na približne **3 miliardy dolárov** a celkovo už získala vyše miliardy dolárov od investorov.' },
  { slug: 'apptronik', name: 'Apptronik', logo: 'apptronik.png',
    description: '**Apptronik** je americká firma z texaského Austinu, ktorá vyvíja humanoidného robota **Apollo**. Vznikla v roku **2016** ako spin-off Texaskej univerzity a jej korene siahajú k práci na humanoidovi **Valkyrie** pre NASA. Apollo meria približne **173 centimetrov**, unesie až **25 kilogramov** a na batériu pracuje **štyri hodiny**. Robot nasadzujú firmy ako **Mercedes-Benz**, **GXO Logistics** či **Jabil** v továrňach a skladoch. Na umelej inteligencii pre budúce generácie robotov spolupracuje s **Google DeepMind** a využíva modely **Gemini Robotics**. Vo februári **2026** získala **520 miliónov dolárov** a jej hodnota stúpla na viac ako **5,5 miliardy**, teda zhruba trojnásobok oproti predchádzajúcemu roku.' },
  { slug: 'rhoda', name: 'Rhoda AI', logo: 'rhoda.png',
    description: '**Rhoda AI** je mladá americká firma z Palo Alta, ktorá na trénovanie robotov používa netradičný prístup. Namiesto toho, aby ich ľudia učili diaľkovým ovládaním, sa jej roboty učia z miliónov verejne dostupných videí na internete. Jej systém **FutureVision** sleduje okolie, predpovedá, čo sa stane v ďalšom okamihu, a tieto predpovede premieňa na pohyb, pričom sa aktualizuje každých pár stoviek milisekúnd. Firma sa vyvíjala v utajení v rámci investičného fondu **Khosla Ventures**. Na verejnosť vystúpila v marci **2026** s investíciou **450 miliónov dolárov**, čo je jedno z najväčších kôl svojho druhu v histórii robotiky. Svoju technológiu už úspešne otestovala v továrni popredného výrobcu automobilov.' },
  { slug: 'agility', name: 'Agility', logo: 'agility.png',
    description: '**Agility** je americká firma, ktorá vyvinula humanoida **Digit**, jedného z prvých komerčne nasadených robotov tohto typu. Pôvodne niesla názov Agility Robotics, no v marci **2026** sa premenovala, aby naznačila expanziu za hranice skladovej logistiky. Medzi jej platiacich zákazníkov patria **Amazon**, **GXO Logistics**, **Schaeffler**, **Toyota** či **Mercado Libre**. V sklade GXO v americkej Georgii jej robot Digit premiestnil už viac ako **100 000 prepraviek**. Firma má zazmluvnené objednávky v hodnote **300 miliónov dolárov** na novú, piatu generáciu robota Digit, ktorá má prísť koncom roka **2026**. Agility sa zároveň chystá vstúpiť na burzu prostredníctvom fúzie so špeciálnou akvizičnou spoločnosťou.' },
  { slug: 'unitree', name: 'Unitree Robotics', logo: 'unitree.webp',
    description: '**Unitree** je čínska firma z mesta Chang-čou, ktorá sa preslávila najmä cenovo dostupnými robotmi. Jej zakladateľ **Wang Xingxing** si dodnes drží kontrolu nad firmou, ktorá v roku **2025** zvýšila tržby o **335 %**. Predaj humanoidov po prvý raz prekonal tržby zo štvornohých robotov a stal sa jej najväčším biznisom. V auguste **2026** vstúpila ako prvý výrobca humanoidov na burzu v pevninskej Číne a jej akcie hneď v prvý deň vyleteli o **629 %** nad emisnú cenu. Investícia spoločnosti **Meituan** sa jej tak zhodnotila viac ako **70-násobne**. Podľa firmy dokáže jej najnovší humanoid vyskočiť z miesta do výšky **2 metrov** a bežať rýchlosťou až **12,66 metra za sekundu**.' },
  { slug: '1x', name: '1X Technologies', logo: '1x.jpg',
    description: '**1X** je firma s nórskymi koreňmi, ktorá na rozdiel od väčšiny konkurencie cieli priamo do domácností. Podporuje ju **OpenAI** a jej robot **NEO** stojí **20 000 dolárov**, prípadne si ho možno predplatiť za **499 dolárov** mesačne. Meria **1,65 metra**, váži necelých **30 kilogramov** a je navrhnutý tak, aby pracoval čo najtichšie. Celá prvoročná produkcia **10 000 kusov** sa podľa firmy vypredala za **päť dní**. Jej továreň v Kalifornii má do konca roka **2027** vyrábať viac ako **100 000 robotov** ročne. Firma však priznáva, že pri zložitejších domácich prácach bude robotovi spočiatku na diaľku pomáhať vyškolený človek.' },
  { slug: 'boston-dynamics', name: 'Boston Dynamics', logo: 'boston-dynamics.png',
    description: '**Boston Dynamics** je americká firma, ktorú pozná takmer každý vďaka virálnym videám tancujúcich a skákajúcich robotov. Na humanoidovi **Atlas** pracuje už od roku **2011**, keď vznikol ako projekt pre americkú vojenskú agentúru **DARPA**. V minulosti ju vlastnil **Google**, neskôr japonský **SoftBank** a od roku **2021** patrí automobilke **Hyundai**. Finálna verzia Atlasu predstavená na **CES 2026** unesie až **50 kg** a dosiahne do vzdialenosti približne **2,3 metra**. Celá výroba na rok **2026** je už vopred rozobraná a roboty smerujú do Hyundai a **Google DeepMind**. Hyundai a Boston Dynamics plánujú postaviť továreň, ktorá vyrobí až **30 000 humanoidov** ročne.' },
  { slug: 'agibot', name: 'AgiBot', logo: 'agibot.webp',
    description: '**AgiBot** je čínska firma zo Šanghaja, ktorá sa v krátkom čase stala svetovou jednotkou vo výrobe humanoidov. Podľa analytikov dodala v roku **2025** najviac humanoidných robotov na svete. V marci **2026** vyrobila svojho **10 000.** robota, pričom prvých tisíc jej trvalo takmer dva roky. Skok z **5 000** na **10 000** kusov však zvládla len za **tri mesiace**. Pre porovnanie, americké firmy **Tesla**, **Agility** a **Figure** mali v tom čase dodaných dokopy len okolo **150 robotov**. Tisíce jej humanoidov už pracujú v Číne, Severnej Amerike, Európe aj na Blízkom východe.' },
  { slug: 'tesla-optimus', name: 'Tesla Optimus', logo: 'tesla-optimus.png',
    description: '**Tesla** **Elona Muska** vyvíja humanoida **Optimus**, ktorého považuje za jeden z najdôležitejších produktov svojej budúcnosti. V máji **2026** prestavala výrobné linky na modely S a X v továrni **Fremont** na výrobu robotov. Optimus sa skladá z viac ako **10 000 unikátnych** súčiastok, z ktorých žiadna dovtedy neprešla hromadnou výrobou. Musk priznal, že novú verziu **V3** nechce ukazovať predčasne, pretože konkurenti analyzujú videá snímku po snímke a všetko kopírujú. Sám upozornil, že výroba bude spočiatku pomalá a jej tempo je nemožné presne predpovedať. V Texase zároveň stavia druhú továreň na Optimusy, ktorá má začať vyrábať okolo leta **2027**.' },
];

async function uploadAndPublish(slides, caption, slugPrefix) {
  const imageUrls = [];
  for (let i = 0; i < slides.length; i++) {
    const buf = readFileSync(slides[i]);
    const name = `company-${slugPrefix}-${i + 1}-${Date.now()}.png`;
    await supabase.storage.from('ig-assets').upload(name, buf, { contentType: 'image/png', upsert: true });
    const { data } = supabase.storage.from('ig-assets').getPublicUrl(name);
    imageUrls.push(data.publicUrl);
  }

  // Create carousel children
  const childIds = [];
  for (const url of imageUrls) {
    const res = await fetch(`https://graph.facebook.com/v21.0/${IG_ACCOUNT}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: url, is_carousel_item: true, access_token: IG_TOKEN }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    childIds.push(data.id);
  }

  // Create carousel
  const carRes = await fetch(`https://graph.facebook.com/v21.0/${IG_ACCOUNT}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ media_type: 'CAROUSEL', children: childIds.join(','), caption, access_token: IG_TOKEN }),
  });
  const carData = await carRes.json();
  if (carData.error) throw new Error(carData.error.message);

  await new Promise(r => setTimeout(r, 5000));

  // Publish
  const pubRes = await fetch(`https://graph.facebook.com/v21.0/${IG_ACCOUNT}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ creation_id: carData.id, access_token: IG_TOKEN }),
  });
  const pubData = await pubRes.json();
  if (pubData.error) throw new Error(pubData.error.message);
  return pubData.id;
}

async function main() {
  console.log('=== robotika24 Company Post ===');
  console.log(`Time: ${new Date().toISOString()}`);

  const state = loadState();
  const idx = state.index % companies.length;
  const company = companies[idx];

  // Verify logo exists
  const logoPath = resolve(__dirname, `templates/poznasfirmu/loga/${company.logo}`);
  if (!existsSync(logoPath)) {
    console.log(`SKIP: Logo not found for ${company.name} (${company.logo})`);
    state.index++;
    saveState(state);
    return;
  }

  if (!company.description || company.description.length < 50) {
    console.log(`SKIP: No description for ${company.name}`);
    state.index++;
    saveState(state);
    return;
  }

  console.log(`Publishing: ${company.name} (${idx + 1}/${companies.length})`);

  // Generate carousel
  const result = await generateCompanyCarousel(company);
  if (!result) {
    console.error('Carousel generation failed');
    return;
  }

  const caption = `Poznáš túto firmu? ${company.name}\n\n${company.description.replace(/\*\*/g, '').substring(0, 500)}\n\n#robotika24 #robotika #humanoidnéroboty #technológie #${company.slug.replace(/-/g, '')}`;

  if (!IG_TOKEN || !IG_ACCOUNT) {
    console.log('[DRY RUN] Would publish:', company.name);
    console.log('Caption:', caption.substring(0, 100) + '...');
  } else {
    try {
      const postId = await uploadAndPublish(result.slides, caption, company.slug);
      console.log(`Published! Post ID: ${postId}`);
    } catch (err) {
      console.error(`Publish error: ${err.message}`);
    }
  }

  // Notify Slack
  if (SLACK_WEBHOOK) {
    try {
      await fetch(SLACK_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `*Poznáš túto firmu?* ${company.name} - publikované na Instagram`,
        }),
      });
    } catch {}
  }

  state.index++;
  saveState(state);
  console.log('Done!');
}

main().catch(console.error);
