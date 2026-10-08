export const metadata = {
  title: 'Odoberajte novinky zo sveta robotiky - Newsletter robotika24',
  description: 'Prihláste sa na odber najnovších správ o robotike, umelej inteligencii a moderných technológiách. Novinky priamo do vášho e-mailu.',
  alternates: { canonical: '/odber' },
};

export default function OdberLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
