import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
  locale?: string;
  canonical?: string;
  structuredData?: object;
  noIndex?: boolean;
}

const BASE_URL = 'https://anime.antidonasi.web.id';
const SITE_NAME = 'KanataAnime';
const DEFAULT_IMAGE = 'https://github.com/AntiDonasi.png';

export default function SEOHead({
  title,
  description,
  keywords,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  siteName = SITE_NAME,
  locale = 'id_ID',
  canonical,
  structuredData,
  noIndex = false,
}: SEOProps) {
  const fullTitle = title ? `${title} - ${SITE_NAME}` : SITE_NAME;
  const fullUrl = url ? `${BASE_URL}${url}` : BASE_URL;
  const canonicalUrl = canonical || fullUrl;

  useEffect(() => {
    // Update document title
    if (title) {
      document.title = fullTitle;
    }
  }, [title, fullTitle]);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={image} />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@kanatanime" />
      <meta name="twitter:site" content="@kanatanime" />
      
      {/* Additional Meta Tags */}
      <meta name="author" content="Roy Antidonasi, Fatih Firdaus, Sandika, Antidonasi Team" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}