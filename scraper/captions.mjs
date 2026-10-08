// Instagram caption templates for robotika24 posts
// Format: Kategoria | Nazov clanku + rotujuci popis + hashtags

const descriptions = [
  `Prinasame vam najnovsie poznatky zo sveta robotiky a automatizacie.
Cely clanok najdete na nasom webe, odkaz je v profile.`,

  `Aktualny pohlad na vyvoj v oblasti robotiky a umelej inteligencie.
Podrobnosti si precitajte na robotika24.sk, odkaz najdete v profile.`,

  `Technologie, ktore menia sposob, akym pracujeme a zijeme.
Viac informacii najdete v clanku na nasom webe, odkaz je v profile.`,

  `Sledujte s nami trendy, ktore formuju buducnost robotiky.
Cely clanok je dostupny na nasom webe, odkaz najdete v profile.`,

  `Prehlad najdolezitejsich noviniek z oblasti robotiky na jednom mieste.
Cely clanok si mozete precitat na nasom webe, odkaz najdete v profile.`,

  `Odborny pohlad na riesenia, ktore posuvaju hranice modernych technologii.
Viac sa dozviete v clanku na nasom webe, odkaz je v profile.`,

  `Ako robotika a umela inteligencia ovplyvnuju priemysel a kazdodenny zivot.
Podrobnosti najdete na nasom webe, odkaz je dostupny v profile.`,

  `Zostan informovani o vyvoji, ktory formuje technologicku buducnost.
Cely clanok najdete na robotika24.sk, odkaz je v profile.`,
];

const hashtags = [
  '#robotika24 #robotika #automatizacia #technologie #inovacie',
  '#robotika24 #umelainteligencia #robotika #technologie #priemysel',
  '#robotika24 #inovacie #automatizacia #AI #buducnost',
  '#robotika24 #robotika #technologie #trendy #inovacie',
  '#robotika24 #robotika #novinky #technologie #automatizacia',
  '#robotika24 #inovacie #robotika #AI #vyskum',
  '#robotika24 #umelainteligencia #priemysel #technologie #digitalizacia',
  '#robotika24 #technologie #robotika #buducnost #inovacie',
];

// Category slug to display name
const categoryNames = {
  roboty: 'Roboty',
  technologie: 'Technologie',
  vyvoj: 'Development',
};

// Build caption: Kategoria | Nazov clanku \n\n popis \n\n hashtags
export function getArticleCaption(index, title, categorySlug) {
  const cat = categoryNames[categorySlug] || 'Technologie';
  const desc = descriptions[index % descriptions.length];
  const tags = hashtags[index % hashtags.length];
  return `${cat} | ${title}\n\n${desc}\n\n${tags}`;
}

// Glossary post captions
export const glossaryCaptions = [
  `Novy pojem z nasho slovnicka robotiky! Uloz si to na neskor alebo posli kamosovi.
#robotika24 #robotika #vzdelavanie #technologie #slovnicek`,

  `Vies co to znamena? Pozri nase vysvetlenie!
#robotika24 #robotika #slovnicek #technologie #ucimesa`,

  `Dnesny pojem zo sveta robotiky. Vedel si to?
#robotika24 #robotika #vzdelavanie #pojmy #technologie`,
];

// Get caption for glossary post: "Vieš, čo je to... Term?" + rotujúci popis
export function getGlossaryCaption(index, termEN) {
  const desc = glossaryCaptions[index % glossaryCaptions.length];
  return `Vieš, čo je to... ${termEN}?\n\n${desc}`;
}
