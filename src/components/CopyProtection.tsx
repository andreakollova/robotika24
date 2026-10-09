'use client';

import { useEffect } from 'react';

export default function CopyProtection() {
  useEffect(() => {
    function handleCopy(e: ClipboardEvent) {
      const selection = window.getSelection()?.toString() || '';
      if (selection.length > 50) {
        // Append source attribution to copied text
        const url = window.location.href;
        const attribution = `\n\nZdroj: robotika24.sk\n${url}\n© robotika24.sk - Všetky práva vyhradené.`;
        e.clipboardData?.setData('text/plain', selection + attribution);
        e.preventDefault();

        // Notify about copy (fire and forget)
        fetch('/api/track-copy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url,
            textLength: selection.length,
            firstWords: selection.substring(0, 100),
          }),
        }).catch(() => {});
      }
    }

    document.addEventListener('copy', handleCopy);
    return () => document.removeEventListener('copy', handleCopy);
  }, []);

  return null;
}
