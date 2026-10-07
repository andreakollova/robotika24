'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const categories = [
  { name: 'Novinky', slug: '/', isHome: true },
  { name: 'Technologie', slug: '/kategoria/technologie' },
  { name: 'Development', slug: '/kategoria/vyvoj' },
  { name: 'Roboty', slug: '/kategoria/roboty' },
  { name: 'Projekty', slug: '/projekty' },
  { name: 'App', slug: '/app' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 140);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Main white navbar */}
      <header style={{ backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px' }}>
          {/* Top row: logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0' }}>
            <Link href="/">
              <Image
                src="/logo.png"
                alt="robotika24"
                width={280}
                height={56}
                style={{ height: 56, width: 'auto' }}
                priority
              />
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden"
              style={{ color: '#0c1a26', padding: 8 }}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileOpen ? (
                  <path d="M6 6l16 16M6 22L22 6" />
                ) : (
                  <path d="M4 14h20M4 7h20M4 21h20" />
                )}
              </svg>
            </button>
          </div>

          {/* Nav row: categories */}
          <nav className="hidden md:flex" style={{ borderTop: '1px solid #f3f4f6', gap: 0 }}>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={cat.slug}
                style={{
                  padding: '12px 20px',
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#0c1a26',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.05em',
                  borderBottom: '2px solid transparent',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap' as const,
                }}
                className="hover:text-[#cb1e26] hover:border-b-[#cb1e26] transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="md:hidden" style={{ borderTop: '1px solid #f3f4f6', padding: '8px 0' }}>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={cat.slug}
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#0c1a26',
                    textTransform: 'uppercase' as const,
                  }}
                  onClick={() => setMobileOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Sticky dark navbar on scroll */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 60,
          backgroundColor: '#0c1a26',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.3)',
          transform: scrolled ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.3s ease',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
            <Link href="/">
              <Image
                src="/logo-dark.png"
                alt="robotika24"
                width={200}
                height={40}
                style={{ height: 36, width: 'auto' }}
              />
            </Link>
            <nav className="hidden md:flex" style={{ display: 'flex', gap: 0 }}>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={cat.slug}
                  style={{
                    padding: '8px 16px',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#d1d5db',
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.05em',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap' as const,
                  }}
                  className="hover:text-white transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
