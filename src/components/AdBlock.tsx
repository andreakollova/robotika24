'use client';

import { useEffect, useRef } from 'react';

export default function AdBlock({ format = 'rectangle' }: { format?: 'rectangle' | 'vertical' | 'horizontal' }) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      pushed.current = true;
    } catch {}
  }, []);

  // In-article ad for horizontal format (inside articles)
  if (format === 'horizontal') {
    return (
      <div style={{ textAlign: 'center' }}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', textAlign: 'center' }}
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client="ca-pub-1548129646460327"
          data-ad-slot="1657914139"
        />
        <p style={{ fontSize: 10, color: '#d1d5db', marginTop: 4, textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>
          Inzercia
        </p>
      </div>
    );
  }

  // Display ad for sidebar (rectangle/vertical)
  return (
    <div style={{ textAlign: 'center' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-1548129646460327"
        data-ad-slot="7872977851"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <p style={{ fontSize: 10, color: '#d1d5db', marginTop: 4, textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>
        Inzercia
      </p>
    </div>
  );
}
