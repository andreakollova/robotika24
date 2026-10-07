import Image from 'next/image';
import Link from 'next/link';

const categories = [
  { name: 'Roboty', slug: 'roboty' },
  { name: 'Technologie', slug: 'technologie' },
  { name: 'Vyvoj', slug: 'vyvoj' },
];

export default function Footer() {
  return (
    <footer className="bg-[#081018] border-t border-[#1e3a52] mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div>
            <Image src="/logo.png" alt="robotika24" width={180} height={36} className="h-7 w-auto mb-3" />
            <p className="text-gray-500 text-sm max-w-xs">
              Spravodajsky portal o robotike, umelej inteligencii a modernych technologiach.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Kategorie</h3>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/kategoria/${cat.slug}`}
                  className="text-sm text-gray-400 hover:text-[#cb1e26] transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-[#1e3a52] mt-8 pt-6 text-center text-gray-600 text-xs">
          &copy; {new Date().getFullYear()} robotika24. Vsetky prava vyhradene.
        </div>
      </div>
    </footer>
  );
}
