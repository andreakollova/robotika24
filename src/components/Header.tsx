'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const categories = [
  { name: 'ROBOTY', slug: 'roboty' },
  { name: 'TECHNOLOGIE', slug: 'technologie' },
  { name: 'VYVOJ', slug: 'vyvoj' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 120);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Main white navbar */}
      <header className="bg-white border-b border-gray-200 relative z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="robotika24"
                width={220}
                height={44}
                className="h-9 w-auto"
                priority
              />
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/kategoria/${cat.slug}`}
                  className="px-4 py-2 text-sm font-bold text-[#0c1a26] hover:text-[#cb1e26] transition-colors tracking-wide"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>

            <button
              className="md:hidden text-[#0c1a26] p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileOpen ? (
                  <path d="M6 6l12 12M6 18L18 6" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="md:hidden border-t border-gray-100 py-2">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/kategoria/${cat.slug}`}
                  className="block px-4 py-3 text-sm font-bold text-[#0c1a26] hover:bg-gray-50"
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
        className={`fixed top-0 left-0 right-0 z-[60] bg-[#0c1a26] shadow-lg transition-transform duration-300 ${
          scrolled ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="robotika24"
                width={180}
                height={36}
                className="h-7 w-auto brightness-0 invert"
              />
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/kategoria/${cat.slug}`}
                  className="px-4 py-2 text-sm font-bold text-gray-300 hover:text-white transition-colors tracking-wide"
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
