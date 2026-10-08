'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem('cookie-consent', 'accepted');
    setVisible(false);
  }

  function decline() {
    localStorage.setItem('cookie-consent', 'declined');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 70,
      backgroundColor: 'var(--card-bg)', borderTop: '1px solid var(--border)',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
      padding: '20px 0',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1, minWidth: 280 }}>
          Táto stránka používa cookies na zabezpečenie funkčnosti webu a zobrazovanie reklám.
          Viac informácií nájdete v{' '}
          <Link href="/cookies" style={{ color: '#cb1e26', textDecoration: 'underline' }}>zásadách používania cookies</Link>
          {' '}a{' '}
          <Link href="/ochrana-sukromia" style={{ color: '#cb1e26', textDecoration: 'underline' }}>ochrane súkromia</Link>.
        </p>
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          <button
            onClick={decline}
            style={{
              padding: '10px 24px', fontSize: 13, fontWeight: 700,
              color: 'var(--text-tertiary)', backgroundColor: 'var(--bg-tertiary)',
              borderRadius: 24, border: 'none', cursor: 'pointer',
            }}
          >
            Odmietnuť
          </button>
          <button
            onClick={accept}
            style={{
              padding: '10px 24px', fontSize: 13, fontWeight: 700,
              color: '#fff', backgroundColor: '#cb1e26',
              borderRadius: 24, border: 'none', cursor: 'pointer',
            }}
          >
            Súhlasím
          </button>
        </div>
      </div>
    </div>
  );
}
