import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: {
    default: 'robotika24 - Správy zo sveta robotiky a AI',
    template: '%s | robotika24',
  },
  description: 'Najnovšie správy o robotike, umelej inteligencii, dronoch a moderných technológiách. Denne prinášame novinky zo sveta robotov, automatizácie a vývoja.',
  keywords: ['robotika', 'roboty', 'umelá inteligencia', 'AI', 'technológie', 'drony', 'automatizácia', 'humanoidné roboty', 'strojové učenie', 'slovensko'],
  authors: [{ name: 'robotika24' }],
  creator: 'robotika24',
  publisher: 'robotika24',
  metadataBase: new URL('https://robotika24.sk'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'sk_SK',
    url: 'https://robotika24.sk',
    siteName: 'robotika24',
    title: 'robotika24 - Správy zo sveta robotiky a AI',
    description: 'Najnovšie správy o robotike, umelej inteligencii, dronoch a moderných technológiách.',
    images: [{ url: '/logo.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'robotika24 - Správy zo sveta robotiky a AI',
    description: 'Najnovšie správy o robotike, umelej inteligencii a moderných technológiách.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '1254x1254', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  verification: {
    google: '',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk" className={inter.className}>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1548129646460327"
          crossOrigin="anonymous"
        />
        <link rel="sitemap" href="/sitemap.xml" />
      </head>
      <body className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
