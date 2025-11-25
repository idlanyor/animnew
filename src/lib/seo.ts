/**
 * SEO Utility Functions for KanataAnime
 * Optimized for Indonesian keywords: nonton anime, streaming anime, anime sub indo, etc.
 */

const BASE_URL = 'https://anime.antidonasi.web.id';
const SITE_NAME = 'KanataAnime';
const DEFAULT_IMAGE = 'https://github.com/AntiDonasi.png';

interface AnimeMetadataProps {
  title: string;
  synopsis?: string;
  image?: string;
  slug: string;
  type?: string;
  status?: string;
  score?: string;
  genres?: string[];
  releaseYear?: string;
}

interface MovieMetadataProps {
  title: string;
  synopsis?: string;
  image?: string;
  slug: string;
  releaseYear?: string;
  score?: string;
  genres?: string[];
}

interface SEOData {
  title: string;
  description: string;
  keywords: string;
  image: string;
  url: string;
  type: string;
  canonical: string;
  structuredData?: object;
}

/**
 * Generate SEO data for anime detail pages
 * Optimized for keywords: nonton anime, streaming anime sub indo, etc.
 */
export function generateAnimeSEOData({
  title,
  synopsis,
  image,
  slug,
  type,
  status,
  score,
  genres,
  releaseYear,
}: AnimeMetadataProps): SEOData {
  const pageTitle = `Nonton ${title} Sub Indo HD`;
  const description = synopsis
    ? `Nonton anime ${title} subtitle Indonesia di ${SITE_NAME}. ${synopsis.slice(0, 120)}... Streaming anime ${type || 'series'} ${status || ''} dengan kualitas HD tanpa iklan.`
    : `Nonton ${title} sub indo gratis di ${SITE_NAME}. Streaming anime subtitle Indonesia dengan kualitas HD 720p tanpa iklan. Download anime batch tersedia.`;

  const keywords = [
    `nonton ${title}`,
    `${title} sub indo`,
    `streaming ${title}`,
    `${title} subtitle indonesia`,
    'nonton anime sub indo',
    'streaming anime',
    'anime sub indo',
    'anime subtitle indonesia',
    'kanatanime',
    'anime tanpa iklan',
    'streaming anime HD',
    ...(genres || []),
  ].join(', ');

  const structuredData = generateAnimeStructuredData({
    title,
    synopsis,
    image,
    slug,
    type,
    status,
    score,
    genres,
    releaseYear,
  });

  return {
    title: pageTitle,
    description,
    keywords,
    image: image || DEFAULT_IMAGE,
    url: `/anime/${slug}`,
    type: 'video.tv_show',
    canonical: `${BASE_URL}/anime/${slug}`,
    structuredData,
  };
}

/**
 * Generate SEO data for movie detail pages
 * Optimized for keywords: nonton anime movie, anime movie sub indo, etc.
 */
export function generateMovieSEOData({
  title,
  synopsis,
  image,
  slug,
  releaseYear,
  score,
  genres,
}: MovieMetadataProps): SEOData {
  const pageTitle = `Nonton ${title} Movie Sub Indo HD`;
  const description = synopsis
    ? `Nonton anime movie ${title} subtitle Indonesia di ${SITE_NAME}. ${synopsis.slice(0, 120)}... Streaming anime movie dengan kualitas HD tanpa iklan.`
    : `Nonton ${title} movie sub indo gratis di ${SITE_NAME}. Streaming anime movie subtitle Indonesia dengan kualitas HD 720p tanpa iklan.`;

  const keywords = [
    `nonton ${title} movie`,
    `${title} movie sub indo`,
    `streaming ${title} movie`,
    `${title} movie subtitle indonesia`,
    'nonton anime movie',
    'anime movie sub indo',
    'streaming anime movie',
    'anime movie subtitle indonesia',
    'kanatanime',
    'anime movie tanpa iklan',
    ...(genres || []),
  ].join(', ');

  const structuredData = generateMovieStructuredData({
    title,
    synopsis,
    image,
    slug,
    releaseYear,
    score,
    genres,
  });

  return {
    title: pageTitle,
    description,
    keywords,
    image: image || DEFAULT_IMAGE,
    url: `/movie/${slug}`,
    type: 'video.movie',
    canonical: `${BASE_URL}/movie/${slug}`,
    structuredData,
  };
}

/**
 * Generate structured data (JSON-LD) for anime
 */
export function generateAnimeStructuredData({
  title,
  synopsis,
  image,
  slug,
  type,
  status,
  score,
  genres,
  releaseYear,
}: AnimeMetadataProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    name: title,
    description: synopsis || `Nonton ${title} sub indo gratis di ${SITE_NAME}`,
    image: image || DEFAULT_IMAGE,
    url: `${BASE_URL}/anime/${slug}`,
    ...(score && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: score,
        bestRating: '10',
        ratingCount: '100',
      },
    }),
    ...(genres && {
      genre: genres,
    }),
    ...(releaseYear && {
      datePublished: releaseYear,
    }),
    inLanguage: 'id-ID',
    subtitleLanguage: 'Indonesian',
    thumbnailUrl: image || DEFAULT_IMAGE,
    ...(status && {
      publishingPrinciples: status === 'Ongoing' ? 'Currently Airing' : 'Completed',
    }),
  };
}

/**
 * Generate structured data (JSON-LD) for movie
 */
export function generateMovieStructuredData({
  title,
  synopsis,
  image,
  slug,
  releaseYear,
  score,
  genres,
}: MovieMetadataProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: title,
    description: synopsis || `Nonton ${title} movie sub indo gratis di ${SITE_NAME}`,
    image: image || DEFAULT_IMAGE,
    url: `${BASE_URL}/movie/${slug}`,
    ...(score && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: score,
        bestRating: '10',
        ratingCount: '100',
      },
    }),
    ...(genres && {
      genre: genres,
    }),
    ...(releaseYear && {
      dateCreated: releaseYear,
    }),
    inLanguage: 'id-ID',
    subtitleLanguage: 'Indonesian',
    thumbnailUrl: image || DEFAULT_IMAGE,
  };
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate SEO data for generic pages
 */
export function generatePageSEOData({
  title,
  description,
  keywords,
  url = '',
  image = DEFAULT_IMAGE,
  type = 'website',
}: {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
  image?: string;
  type?: string;
}): SEOData {
  const pageTitle = title || 'KanataAnime - Nonton Anime Sub Indo HD Gratis Tanpa Iklan';
  const pageDescription = description ||
    'Nonton anime sub indo gratis di KanataAnime. Platform streaming anime terbaik dengan koleksi lengkap anime ongoing, complete dan movie. Streaming anime subtitle Indonesia dengan kualitas HD 720p tanpa iklan.';
  const pageKeywords = keywords ||
    'kanatanime, kanata anime, antidonasi anime, nonton anime, nonton anime sub indo, streaming anime, streaming anime sub indo, anime tanpa iklan, anime gratis, anime sub indo, anime subtitle indonesia, anime ongoing, anime complete, anime movie, anime terbaru, anime terlengkap';

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: pageKeywords,
    image,
    url,
    type,
    canonical: url ? `${BASE_URL}${url}` : BASE_URL,
  };
}

