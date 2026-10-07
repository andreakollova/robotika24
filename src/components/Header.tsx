'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const categories = [
  { name: 'Roboty', slug: 'roboty' },
  { name: 'Technologie', slug: 'technologie' },
  { name: 'Vyvoj', slug: 'vyvoj' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0c1a26] shadow-lg shadow-black/10'
          : 'bg-[#0c1a26]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Main header */}
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="robotika24"
              width={200}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/kategoria/${cat.slug}`}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden text-white" id="mobile-menu-btn">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
        </div>

        {/* Category bar - visible when not scrolled */}
        <div
          className={`transition-all duration-300 overflow-hidden ${
            scrolled ? 'max-h-0 opacity-0' : 'max-h-12 opacity-100'
          }`}
        >
          <div className="flex items-center gap-4 py-2 border-t border-white/10 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/kategoria/${cat.slug}`}
                className="text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-[#cb1e26] transition-colors whitespace-nowrap"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
