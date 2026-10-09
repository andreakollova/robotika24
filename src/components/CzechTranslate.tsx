'use client';

import { useEffect } from 'react';

export default function CzechTranslate() {
  useEffect(() => {
    // Only activate on .cz domain
    if (!window.location.hostname.includes('robotika24.cz')) return;

    // Set html lang to cs
    document.documentElement.lang = 'cs';

    // Add Google Translate meta
    const meta = document.createElement('meta');
    meta.name = 'google';
    meta.content = 'notranslate';
    // We actually WANT translate, so we use the translate API

    // Redirect to Google Translate proxy
    const currentUrl = window.location.href.replace('robotika24.cz', 'robotika24.sk');
    const translateUrl = currentUrl
      .replace('https://robotika24.sk', 'https://robotika24-sk.translate.goog')
      .replace('http://robotika24.sk', 'https://robotika24-sk.translate.goog');

    const separator = translateUrl.includes('?') ? '&' : '?';
    window.location.replace(translateUrl + separator + '_x_tr_sl=sk&_x_tr_tl=cs&_x_tr_hl=cs');
  }, []);

  return null;
}
