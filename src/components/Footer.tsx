import Image from 'next/image';
import Link from 'next/link';

const categories = [
  { name: 'Roboty', slug: 'roboty' },
  { name: 'Technologie', slug: 'technologie' },
  { name: 'Vyvoj', slug: 'vyvoj' },
];

export default function Footer() {
  return (
    <footer className="bg-[#0c1a26] mt-16">
      {/* Top accent line */}
      <div className="h-1 bg-[#cb1e26]" />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Image
              src="/logo.png"
              alt="robotika24"
              width={200}
              height={40}
              className="h-8 w-auto brightness-0 invert mb-4"
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              Spravodajsky portal o robotike, umelej inteligencii a modernych technologiach.
              Denne prinasame najnovsie spravy zo sveta robotov.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 pb-2 border-b border-gray-700">
              Kategorie
            </h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/kategoria/${cat.slug}`}
                  className="block text-sm text-gray-400 hover:text-[#cb1e26] transition-colors py-1"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 pb-2 border-b border-gray-700">
              Informacie
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-400 py-1">O nas</p>
              <p className="text-sm text-gray-400 py-1">Kontakt</p>
              <p className="text-sm text-gray-400 py-1">Ochrana sukromia</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} robotika24. Vsetky prava vyhradene.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-500 hover:text-white transition-colors">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
