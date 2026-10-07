'use client';

import { useState } from 'react';

export default function OdberPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setStatus(res.ok ? 'success' : 'error');
      setMessage(data.message || data.error);
      if (res.ok) setEmail('');
    } catch {
      setStatus('error');
      setMessage('Nastala chyba. Skúste to znova.');
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '48px 20px 80px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0c1a26', marginBottom: 12 }}>
          Odoberajte novinky zo sveta robotiky
        </h1>
        <p style={{ fontSize: 16, color: '#6b7280', lineHeight: 1.6 }}>
          Prihláste sa na odber a dostanete najnovšie správy o robotike, umelej inteligencii a technológiách priamo do schránky.
        </p>
      </div>

      {status === 'success' ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#f0fdf4', borderRadius: 8, border: '1px solid #bbf7d0' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>✓</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#166534', marginBottom: 8 }}>Ďakujeme!</h2>
          <p style={{ color: '#15803d', fontSize: 14 }}>{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vas@email.sk"
            required
            style={{
              flex: 1, minWidth: 240, padding: '14px 18px', fontSize: 15,
              border: '1px solid #e5e7eb', borderRadius: 24, outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            style={{
              padding: '14px 32px', fontSize: 15, fontWeight: 700,
              color: '#fff', backgroundColor: '#cb1e26', borderRadius: 24,
              border: 'none', cursor: status === 'loading' ? 'wait' : 'pointer',
              opacity: status === 'loading' ? 0.7 : 1,
            }}
          >
            {status === 'loading' ? 'Odosiela sa...' : 'Odoberať'}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p style={{ color: '#dc2626', fontSize: 14, marginTop: 12, textAlign: 'center' }}>{message}</p>
      )}

      <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', marginTop: 16, lineHeight: 1.5 }}>
        Váš email je chránený. Ukladáme iba anonymizovaný hash, nie samotný email.
        Kedykoľvek sa môžete odhlásiť. Viac v{' '}
        <a href="/ochrana-sukromia" style={{ color: '#cb1e26' }}>ochrane súkromia</a>.
      </p>
    </div>
  );
}
