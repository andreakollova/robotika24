import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import { Analytics } from "@vercel/analytics/next";
import PageTracker from "@/components/PageTracker";
import AuthGate from "@/components/AuthGate";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: {
    default: 'robotika24.sk - Správy zo sveta robotiky, AI a automatizácie na Slovensku',
    template: '%s | robotika24.sk',
  },
  description: 'Najnovšie správy o robotike, umelej inteligencii, humanoidných robotoch a automatizácii v slovenčine. Denne prinášame novinky, analýzy a rozhovory zo sveta robotov, dronov a moderných technológií pre slovenských čitateľov.',
  keywords: [
    'robotika', 'roboty', 'umelá inteligencia', 'AI', 'humanoidné roboty',
    'automatizácia', 'drony', 'strojové učenie', 'priemyselné roboty',
    'Boston Dynamics', 'Figure', 'Tesla Optimus', 'robotika Slovensko',
    'novinky robotika', 'technológie Slovensko', 'AI novinky', 'robotické ramená',
    'autonomné vozidlá', 'coboty', 'ROS', 'simulácia robotov',
  ],
  authors: [{ name: 'robotika24' }],
  creator: 'robotika24',
  publisher: 'robotika24',
  metadataBase: new URL('https://robotika24.sk'),
  alternates: {
    canonical: '/',
    languages: {
      'sk-SK': 'https://robotika24.sk',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'sk_SK',
    url: 'https://robotika24.sk',
    siteName: 'robotika24',
    title: 'robotika24.sk - Správy zo sveta robotiky a AI',
    description: 'Najnovšie správy o robotike, umelej inteligencii a moderných technológiách v slovenčine.',
    images: [{ url: '/logo.png', width: 1200, height: 630 }],
    countryName: 'Slovakia',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'robotika24.sk - Správy zo sveta robotiky a AI',
    description: 'Najnovšie správy o robotike, umelej inteligencii a moderných technológiách v slovenčine.',
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
  other: {
    'geo.region': 'SK',
    'geo.placename': 'Slovensko',
    'content-language': 'sk',
    'distribution': 'Slovakia',
    'rating': 'general',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk" className={inter.className}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'analytics_storage': 'denied',
            'wait_for_update': 500,
          });
          gtag('set', 'ads_data_redaction', true);
          gtag('set', 'url_passthrough', true);
        `}} />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1548129646460327"
          crossOrigin="anonymous"
        />
        <link rel="sitemap" href="/sitemap.xml" />
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.classList.add('dark')}}catch(e){}})()` }} />
        <meta name="geo.region" content="SK" />
        <meta name="geo.placename" content="Slovensko" />
        <link rel="alternate" hrefLang="sk" href="https://robotika24.sk" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'NewsMediaOrganization',
              name: 'robotika24',
              url: 'https://robotika24.sk',
              logo: {
                '@type': 'ImageObject',
                url: 'https://robotika24.sk/logo.png',
              },
              sameAs: ['https://www.instagram.com/robotika24.sk/'],
              description: 'Slovenský spravodajský portál o robotike, umelej inteligencii a moderných technológiách.',
              foundingDate: '2025',
              areaServed: {
                '@type': 'Country',
                name: 'Slovakia',
              },
              inLanguage: 'sk',
              publisher: {
                '@type': 'Organization',
                name: 'DRIXTON s.r.o.',
                email: 'studio@drixton.com',
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col w-full overflow-x-hidden">
        <Header />
        <main className="flex-1 w-full overflow-x-hidden">{children}</main>
        <Footer />
        <CookieBanner />
        <PageTracker />
        <Analytics />
      </body>
    </html>
  );
}
