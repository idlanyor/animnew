import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://anime.antidonasi.web.id';
  const currentDate = new Date();

  // Static pages with optimized SEO priorities
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/ongoing`,
      lastModified: currentDate,
      changeFrequency: 'hourly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/complete`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/movie`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/schedule`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/genres`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/author`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // Note: In production, you would fetch actual anime/movie data here
  // Example:
  // const animePages = await fetchAnimeList();
  // const animeUrls = animePages.map(anime => ({
  //   url: `${baseUrl}/anime/${anime.slug}`,
  //   lastModified: anime.updatedAt,
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.8,
  // }));
  //
  // return [...staticPages, ...animeUrls];

  return staticPages;
}
