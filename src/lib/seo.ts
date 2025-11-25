/**
 * SEO Utility Functions for KanataAnime
 * Optimized for Indonesian keywords: nonton anime, streaming anime, anime sub indo, etc.
 */

import { Metadata } from 'next';

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

/**
 * Generate metadata for anime detail pages
 * Optimized for keywords: nonton anime, streaming anime sub indo, etc.
 */
export function generateAnimeMetadata({
  title,
  synopsis,
  image,
  slug,
  type,
  status,
  score,
  genres,
  releaseYear,
}: AnimeMetadataProps): Metadata {
  const pageTitle = `Nonton ${title} Sub Indo HD - ${SITE_NAME}`;
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

  return {
    title: pageTitle,
    description,
    keywords,
    openGraph: {
      title: pageTitle,
      description,
      url: `${BASE_URL}/anime/${slug}`,
      siteName: SITE_NAME,
      images: [
        {
          url: image || DEFAULT_IMAGE,
          width: 1200,
          height: 630,
          alt: `${title} - Nonton Anime Sub Indo`,
        },
      ],
      locale: 'id_ID',
      type: 'video.tv_show',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: [image || DEFAULT_IMAGE],
    },
    alternates: {
      canonical: `${BASE_URL}/anime/${slug}`,
    },
  };
}

/**
 * Generate metadata for movie detail pages
 * Optimized for keywords: nonton anime movie, anime movie sub indo, etc.
 */
export function generateMovieMetadata({
  title,
  synopsis,
  image,
  slug,
  releaseYear,
  score,
  genres,
}: MovieMetadataProps): Metadata {
  const pageTitle = `Nonton ${title} Movie Sub Indo HD - ${SITE_NAME}`;
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

  return {
    title: pageTitle,
    description,
    keywords,
    openGraph: {
      title: pageTitle,
      description,
      url: `${BASE_URL}/movie/${slug}`,
      siteName: SITE_NAME,
      images: [
        {
          url: image || DEFAULT_IMAGE,
          width: 1200,
          height: 630,
          alt: `${title} Movie - Nonton Anime Movie Sub Indo`,
        },
      ],
      locale: 'id_ID',
      type: 'video.movie',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: [image || DEFAULT_IMAGE],
    },
    alternates: {
      canonical: `${BASE_URL}/movie/${slug}`,
    },
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
 * Helper to inject structured data into head
 */
export function createStructuredDataScript(data: object) {
  return {
    type: 'application/ld+json',
    innerHTML: JSON.stringify(data),
  };
}
