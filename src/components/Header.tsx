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
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-[1280px] mx-auto px-4">
          {/* Top row: logo */}
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="robotika24"
                width={280}
                height={56}
                className="h-12 md:h-14 w-auto"
                priority
              />
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-[#0c1a26] p-2"
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
          <nav className="hidden md:flex items-center gap-0 -mb-px border-t border-gray-100">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={cat.slug}
                className="px-5 py-3 text-[13px] font-bold text-[#0c1a26] hover:text-[#cb1e26] transition-colors uppercase tracking-wide border-b-2 border-transparent hover:border-[#cb1e26]"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="md:hidden border-t border-gray-100 py-2">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={cat.slug}
                  className="block px-4 py-3 text-sm font-bold text-[#0c1a26] hover:bg-gray-50 uppercase"
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
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link href="/">
              <Image
                src="/logo-dark.png"
                alt="robotika24"
                width={200}
                height={40}
                className="h-9 w-auto"
              />
            </Link>
            <nav className="hidden md:flex items-center gap-0">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={cat.slug}
                  className="px-4 py-2 text-[12px] font-bold text-gray-300 hover:text-white transition-colors uppercase tracking-wide"
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
