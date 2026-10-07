'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const categories = [
  { name: 'Novinky', slug: '/' },
  { name: 'Technológie', slug: '/kategoria/technologie' },
  { name: 'Development', slug: '/kategoria/vyvoj' },
  { name: 'Roboty', slug: '/kategoria/roboty' },
  { name: 'Projekty', slug: '/projekty' },
  { name: 'App', slug: '/app' },
];

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function FlagSK() {
  return (
    <img
      src="https://flagcdn.com/w40/sk.png"
      srcSet="https://flagcdn.com/w80/sk.png 2x"
      width="28"
      height="18"
      alt="SK"
      style={{ borderRadius: 2, display: 'block', objectFit: 'cover' }}
    />
  );
}

function FlagCZ() {
  return (
    <img
      src="https://flagcdn.com/w40/cz.png"
      srcSet="https://flagcdn.com/w80/cz.png 2x"
      width="28"
      height="18"
      alt="CZ"
      style={{ borderRadius: 2, display: 'block', objectFit: 'cover' }}
    />
  );
}

function LangSelector() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ display: 'flex', alignItems: 'center', gap: 0, padding: 4, cursor: 'pointer', background: 'none', border: 'none' }}
      >
        <FlagSK />
      </button>
      {open && (
        <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 100, overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, color: '#0c1a26', fontWeight: 600, fontSize: 13, borderBottom: '1px solid #f3f4f6', cursor: 'default' }}>
            <FlagSK /> Slovensko
          </div>
          <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, color: '#9ca3af', fontSize: 13, cursor: 'default' }}>
            <FlagCZ /> Česko
          </div>
        </div>
      )}
    </div>
  );
}

function PulsingDot() {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', width: 7, height: 7, flexShrink: 0 }}>
      <span style={{
        position: 'absolute', inset: 0, borderRadius: '50%', backgroundColor: '#22c55e', opacity: 0.75,
        animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      }} />
      <span style={{ position: 'relative', display: 'inline-flex', width: 7, height: 7, borderRadius: '50%', backgroundColor: '#22c55e' }} />
      <style>{`@keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }`}</style>
    </span>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [latestTitle, setLatestTitle] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 160);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/latest-title')
      .then(r => r.json())
      .then(d => { if (d.title) setLatestTitle(d.title); })
      .catch(() => {});
  }, []);

  const subscribeBtn = (dark?: boolean) => (
    <Link href="/odber" style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '9px 22px', fontSize: 13, fontWeight: 700, color: '#fff',
      backgroundColor: '#cb1e26', borderRadius: 24, textDecoration: 'none',
      whiteSpace: 'nowrap' as const,
    }} className="hover:bg-[#e0242d] transition-colors">
      <BellIcon />
      Odoberať
    </Link>
  );

  return (
    <>
      {/* Top announcement bar - centered text with pulsing dot */}
      {latestTitle && (
        <div style={{ backgroundColor: '#f3f4f6', padding: '9px 20px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <PulsingDot />
            <p style={{ color: '#374151', fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, margin: 0 }}>
              {latestTitle}
            </p>
          </div>
        </div>
      )}

      {/* Main white navbar - taller, bigger logo */}
      <header style={{ backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 88 }}>
          {/* Logo - bigger */}
          <Link href="/" style={{ flexShrink: 0 }}>
            <Image src="/logo.png" alt="robotika24" width={280} height={56} style={{ height: 60, width: 'auto' }} priority />
          </Link>

          {/* Nav + actions */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 0 }}>
            {categories.map((cat) => (
              <Link key={cat.slug} href={cat.slug} style={{ padding: '8px 14px', fontSize: 13, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.04em', textDecoration: 'none', whiteSpace: 'nowrap' as const }} className="text-[#0c1a26] hover:text-[#cb1e26] transition-colors">
                {cat.name}
              </Link>
            ))}

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 16 }}>
              <button onClick={() => setSearchOpen(!searchOpen)} style={{ color: '#6b7280', cursor: 'pointer', background: 'none', border: 'none', padding: 4 }} className="hover:text-[#cb1e26] transition-colors">
                <SearchIcon />
              </button>
              <LangSelector />
              {subscribeBtn()}
            </div>
          </div>

          {/* Mobile button */}
          <button className="md:hidden" style={{ color: '#0c1a26', padding: 8, background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setMobileOpen(!mobileOpen)}>
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? <path d="M6 6l16 16M6 22L22 6" /> : <path d="M4 14h20M4 7h20M4 21h20" />}
            </svg>
          </button>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div style={{ borderTop: '1px solid #f3f4f6', padding: '12px 20px', maxWidth: 1280, margin: '0 auto' }}>
            <form action="/hladanie" method="GET" style={{ display: 'flex', gap: 8 }}>
              <input name="q" type="text" placeholder="Hľadať články..." style={{ flex: 1, padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: 4, fontSize: 14, outline: 'none' }} autoFocus />
              <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#cb1e26', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                Hľadať
              </button>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden" style={{ borderTop: '1px solid #f3f4f6', padding: '8px 0' }}>
            {categories.map((cat) => (
              <Link key={cat.slug} href={cat.slug} style={{ display: 'block', padding: '12px 20px', fontSize: 14, fontWeight: 700, color: '#0c1a26', textTransform: 'uppercase' as const, textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Sticky dark navbar - same bigger logo */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 60,
        backgroundColor: '#0c1a26', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.3)',
        transform: scrolled ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.3s ease',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 80 }}>
          <Link href="/" style={{ flexShrink: 0 }}>
            <Image src="/logo-dark.png" alt="robotika24" width={280} height={56} style={{ height: 52, width: 'auto' }} />
          </Link>
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 0 }}>
            {categories.map((cat) => (
              <Link key={cat.slug} href={cat.slug} style={{ padding: '8px 14px', fontSize: 13, fontWeight: 700, color: '#d1d5db', textTransform: 'uppercase' as const, letterSpacing: '0.04em', textDecoration: 'none', whiteSpace: 'nowrap' as const }} className="hover:text-white transition-colors">
                {cat.name}
              </Link>
            ))}
            {subscribeBtn(true)}
          </div>
        </div>
      </div>
    </>
  );
}
