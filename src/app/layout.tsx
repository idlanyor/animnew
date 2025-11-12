import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://anime.antidonasi.web.id'),
  title: 'KanataAnimeV2 - Watch Anime Online Free HD',
  description: 'Platform streaming anime terbaik dengan koleksi lengkap anime ongoing dan complete. Nonton anime subtitle Indonesia dengan kualitas HD tanpa iklan.',
  keywords: 'anime, streaming, watch anime, anime online, otaku, nonton anime, anime subtitle indonesia, anime streaming, anime terbaru, anime ongoing, anime complete',
  authors: [
    { name: 'Roy Antidonasi' },
    { name: 'Fatih Firdaus' },
    { name: 'Sandika' },
    { name: 'Antidonasi Team' }
  ],
  creator: 'Roy',
  publisher: 'Antidonasi',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'KanataAnimeV2 - Watch Anime Online Free HD',
    description: 'Platform streaming anime terbaik dengan koleksi lengkap anime ongoing dan complete. Nonton anime subtitle Indonesia dengan kualitas HD tanpa iklan.',
    url: 'https://kanatanime.vercel.app',
    siteName: 'KanataAnime',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: 'https://github.com/AntiDonasi.png',
        width: 800,
        height: 600,
        alt: 'KanataAnime Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KanataAnimeV2 - Watch Anime Online Free HD',
    description: 'Platform streaming anime terbaik dengan koleksi lengkap anime ongoing dan complete',
    images: ['https://github.com/AntiDonasi.png'],
  },
  robots: {
    index: true,
    follow: true,
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
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://github.com/AntiDonasi.png" />
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

