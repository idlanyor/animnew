import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://anime.antidonasi.web.id'),
  title: 'KanataAnime - Nonton Anime Sub Indo HD Gratis Tanpa Iklan | Streaming Anime Terbaru',
  description: 'Nonton anime sub indo gratis di KanataAnime. Platform streaming anime terbaik dengan koleksi lengkap anime ongoing, complete dan movie. Streaming anime subtitle Indonesia dengan kualitas HD 720p tanpa iklan. Anime terbaru update setiap hari!',
  keywords: [
    // Brand keywords
    'kanatanime', 'kanata anime', 'antidonasi anime',
    // Primary Indonesian keywords
    'nonton anime', 'nonton anime sub indo', 'streaming anime', 'streaming anime sub indo',
    'anime tanpa iklan', 'anime gratis', 'anime sub indo', 'anime subtitle indonesia',
    // Anime types
    'anime ongoing', 'anime complete', 'anime movie', 'anime terbaru', 'anime terlengkap',
    'anime ongoing sub indo', 'anime complete sub indo', 'anime movie sub indo',
    // Quality keywords
    'streaming anime HD', 'nonton anime HD', 'anime 720p', 'anime kualitas HD',
    // Action keywords
    'download anime', 'watch anime online', 'streaming anime gratis', 'nonton anime online',
    'situs nonton anime', 'website anime', 'web streaming anime',
    // Genre & category
    'anime action', 'anime romance', 'anime comedy', 'anime slice of life',
    'anime isekai', 'anime fantasy', 'anime shounen', 'anime seinen',
    // Additional long-tail keywords
    'nonton anime gratis tanpa iklan', 'streaming anime subtitle indonesia',
    'anime indonesia', 'anime sub indonesia', 'jadwal anime', 'otaku indonesia'
  ].join(', '),
  authors: [
    { name: 'Roy Antidonasi' },
    { name: 'Fatih Firdaus' },
    { name: 'Sandika' },
    { name: 'Antidonasi Team' }
  ],
  creator: 'Roy',
  publisher: 'KanataAnime - Antidonasi',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: 'Entertainment',
  openGraph: {
    title: 'KanataAnime - Nonton Anime Sub Indo HD Gratis Tanpa Iklan',
    description: 'Nonton anime sub indo gratis di KanataAnime. Platform streaming anime terbaik dengan koleksi lengkap anime ongoing, complete dan movie. Streaming anime subtitle Indonesia dengan kualitas HD 720p tanpa iklan.',
    url: 'https://anime.antidonasi.web.id',
    siteName: 'KanataAnime - Streaming Anime Sub Indo',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: 'https://github.com/AntiDonasi.png',
        width: 1200,
        height: 630,
        alt: 'KanataAnime - Nonton Anime Sub Indo Gratis',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KanataAnime - Nonton Anime Sub Indo HD Gratis',
    description: 'Platform streaming anime terbaik dengan koleksi lengkap anime ongoing, complete dan movie. Nonton anime subtitle Indonesia dengan kualitas HD tanpa iklan.',
    images: ['https://github.com/AntiDonasi.png'],
    creator: '@kanatanime',
    site: '@kanatanime',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '0nBADJaiM7ztL3VIqSAU8Xwk9mQVQVh_QfMpZPsGnss',
  },
  alternates: {
    canonical: 'https://anime.antidonasi.web.id',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://anime.antidonasi.web.id/#website',
        url: 'https://anime.antidonasi.web.id',
        name: 'KanataAnime - Nonton Anime Sub Indo',
        description: 'Platform streaming anime terbaik dengan koleksi lengkap anime ongoing, complete dan movie subtitle Indonesia',
        publisher: {
          '@id': 'https://anime.antidonasi.web.id/#organization',
        },
        potentialAction: [
          {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://anime.antidonasi.web.id/search?q={search_term_string}',
            },
            'query-input': 'required name=search_term_string',
          },
        ],
        inLanguage: 'id-ID',
      },
      {
        '@type': 'Organization',
        '@id': 'https://anime.antidonasi.web.id/#organization',
        name: 'KanataAnime',
        alternateName: 'Antidonasi Anime',
        url: 'https://anime.antidonasi.web.id',
        logo: {
          '@type': 'ImageObject',
          url: 'https://github.com/AntiDonasi.png',
          width: 512,
          height: 512,
        },
        image: {
          '@type': 'ImageObject',
          url: 'https://github.com/AntiDonasi.png',
        },
        description: 'Platform streaming anime sub indo gratis dengan kualitas HD tanpa iklan',
        sameAs: [
          'https://github.com/AntiDonasi',
        ],
      },
      {
        '@type': 'WebPage',
        '@id': 'https://anime.antidonasi.web.id/#webpage',
        url: 'https://anime.antidonasi.web.id',
        name: 'KanataAnime - Nonton Anime Sub Indo HD Gratis Tanpa Iklan',
        isPartOf: {
          '@id': 'https://anime.antidonasi.web.id/#website',
        },
        about: {
          '@id': 'https://anime.antidonasi.web.id/#organization',
        },
        description: 'Nonton anime sub indo gratis di KanataAnime. Platform streaming anime terbaik dengan koleksi lengkap anime ongoing, complete dan movie',
        inLanguage: 'id-ID',
      },
    ],
  };

  return (
    <html lang="id">
      <head>
        <link rel="icon" href="https://github.com/AntiDonasi.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className={`${inter.className} bg-black min-h-screen`}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

