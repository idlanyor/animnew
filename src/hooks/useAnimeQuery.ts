import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  getGenres,
  getSchedule,
  getHomeData,
  getOngoingAnime,
  getCompleteAnime,
  getAnimeByGenre,
  searchAnimeBySanka,
  getAnimeDetailBySanka,
  getEpisode,
  getMirrorEpisode,
  getNonce,
  getIframe,
  getMovieList,
  getMovieDetail,
  getMovieWatch,
  getServerUrl,
  searchMovies,
  Genre,
  Schedule,
  AnimeItem,
  AnimeDetail,
  Episode,
  MovieItem,
  MovieDetail,
  MovieWatch,
  OngoingPagination,
  MoviePagination,
} from '../lib/api';

// Query Keys - for cache management and invalidation
export const animeQueryKeys = {
  all: ['anime'] as const,
  genres: () => [...animeQueryKeys.all, 'genres'] as const,
  schedule: () => [...animeQueryKeys.all, 'schedule'] as const,
  home: () => [...animeQueryKeys.all, 'home'] as const,
  ongoing: (page: number) => [...animeQueryKeys.all, 'ongoing', page] as const,
  complete: (page: number) => [...animeQueryKeys.all, 'complete', page] as const,
  byGenre: (slug: string, page: number) => [...animeQueryKeys.all, 'genre', slug, page] as const,
  search: (query: string) => [...animeQueryKeys.all, 'search', query] as const,
  detail: (slug: string) => [...animeQueryKeys.all, 'detail', slug] as const,
  episode: (slug: string) => [...animeQueryKeys.all, 'episode', slug] as const,
  mirrorEpisode: (slug: string) => [...animeQueryKeys.all, 'mirror-episode', slug] as const,
  nonce: () => [...animeQueryKeys.all, 'nonce'] as const,
  iframe: (content: string, nonce: string) => [...animeQueryKeys.all, 'iframe', content, nonce] as const,
};

export const movieQueryKeys = {
  all: ['movie'] as const,
  list: (page: number) => [...movieQueryKeys.all, 'list', page] as const,
  detail: (animeId: string) => [...movieQueryKeys.all, 'detail', animeId] as const,
  watch: (episodeId: string) => [...movieQueryKeys.all, 'watch', episodeId] as const,
  server: (serverId: string) => [...movieQueryKeys.all, 'server', serverId] as const,
  search: (query: string) => [...movieQueryKeys.all, 'search', query] as const,
};

// Genres Hook - Cache for 1 hour (genres rarely change)
export const useGenres = (options?: Omit<UseQueryOptions<Genre[], Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery<Genre[], Error>({
    queryKey: animeQueryKeys.genres(),
    queryFn: getGenres,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    ...options,
  });
};

// Schedule Hook - Cache for 1 hour
export const useSchedule = (options?: Omit<UseQueryOptions<Schedule[], Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery<Schedule[], Error>({
    queryKey: animeQueryKeys.schedule(),
    queryFn: getSchedule,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000,
    ...options,
  });
};

// Home Data Hook - Cache for 5 minutes (frequently updated)
export const useHomeData = (options?: Omit<UseQueryOptions<{ ongoing: AnimeItem[]; complete: AnimeItem[] }, Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery<{ ongoing: AnimeItem[]; complete: AnimeItem[] }, Error>({
    queryKey: animeQueryKeys.home(),
    queryFn: getHomeData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

// Ongoing Anime Hook - Cache per page
export const useOngoingAnime = (
  page: number = 1,
  options?: Omit<UseQueryOptions<{ anime: AnimeItem[]; pagination: OngoingPagination }, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<{ anime: AnimeItem[]; pagination: OngoingPagination }, Error>({
    queryKey: animeQueryKeys.ongoing(page),
    queryFn: () => getOngoingAnime(page),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000,
    ...options,
  });
};

// Complete Anime Hook - Cache per page
export const useCompleteAnime = (
  page: number = 1,
  options?: Omit<UseQueryOptions<{ anime: AnimeItem[]; pagination: OngoingPagination }, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<{ anime: AnimeItem[]; pagination: OngoingPagination }, Error>({
    queryKey: animeQueryKeys.complete(page),
    queryFn: () => getCompleteAnime(page),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    ...options,
  });
};

// Anime by Genre Hook
export const useAnimeByGenre = (
  genreSlug: string,
  page: number = 1,
  options?: Omit<UseQueryOptions<{ anime: AnimeItem[]; pagination: OngoingPagination }, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<{ anime: AnimeItem[]; pagination: OngoingPagination }, Error>({
    queryKey: animeQueryKeys.byGenre(genreSlug, page),
    queryFn: () => getAnimeByGenre(genreSlug, page),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000,
    enabled: !!genreSlug, // Only run if genreSlug is provided
    ...options,
  });
};

// Search Anime Hook - Only cache for 2 minutes
export const useSearchAnime = (
  query: string,
  options?: Omit<UseQueryOptions<AnimeItem[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<AnimeItem[], Error>({
    queryKey: animeQueryKeys.search(query),
    queryFn: () => searchAnimeBySanka(query),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
    enabled: query.length >= 2, // Only search if query is at least 2 characters
    ...options,
  });
};

// Anime Detail Hook - Cache for 15 minutes
export const useAnimeDetail = (
  slug: string,
  options?: Omit<UseQueryOptions<AnimeDetail, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<AnimeDetail, Error>({
    queryKey: animeQueryKeys.detail(slug),
    queryFn: () => getAnimeDetailBySanka(slug),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000,
    enabled: !!slug,
    ...options,
  });
};

// Episode Hook - Cache for 10 minutes
export const useEpisode = (
  slug: string,
  options?: Omit<UseQueryOptions<Episode, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Episode, Error>({
    queryKey: animeQueryKeys.episode(slug),
    queryFn: () => getEpisode(slug),
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
    enabled: !!slug,
    ...options,
  });
};

// Mirror Episode Hook
export const useMirrorEpisode = (
  slug: string,
  options?: Omit<UseQueryOptions<Episode, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Episode, Error>({
    queryKey: animeQueryKeys.mirrorEpisode(slug),
    queryFn: () => getMirrorEpisode(slug),
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
    enabled: !!slug,
    ...options,
  });
};

// Nonce Hook - Short cache (1 minute)
export const useNonce = (options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery<string, Error>({
    queryKey: animeQueryKeys.nonce(),
    queryFn: getNonce,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 2 * 60 * 1000,
    ...options,
  });
};

// Iframe Hook
export const useIframe = (
  content: string,
  nonce: string,
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<string, Error>({
    queryKey: animeQueryKeys.iframe(content, nonce),
    queryFn: () => getIframe(content, nonce),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!content && !!nonce,
    ...options,
  });
};

// Movie List Hook
export const useMovieList = (
  page: number = 1,
  options?: Omit<UseQueryOptions<{ movies: MovieItem[]; pagination: MoviePagination }, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<{ movies: MovieItem[]; pagination: MoviePagination }, Error>({
    queryKey: movieQueryKeys.list(page),
    queryFn: () => getMovieList({ page }),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    ...options,
  });
};

// Movie Detail Hook
export const useMovieDetail = (
  animeId: string,
  options?: Omit<UseQueryOptions<MovieDetail, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<MovieDetail, Error>({
    queryKey: movieQueryKeys.detail(animeId),
    queryFn: () => getMovieDetail(animeId),
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!animeId,
    ...options,
  });
};

// Movie Watch Hook
export const useMovieWatch = (
  episodeId: string,
  options?: Omit<UseQueryOptions<MovieWatch, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<MovieWatch, Error>({
    queryKey: movieQueryKeys.watch(episodeId),
    queryFn: () => getMovieWatch(episodeId),
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
    enabled: !!episodeId,
    ...options,
  });
};

// Server URL Hook
export const useServerUrl = (
  serverId: string,
  options?: Omit<UseQueryOptions<string, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<string, Error>({
    queryKey: movieQueryKeys.server(serverId),
    queryFn: () => getServerUrl(serverId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!serverId,
    ...options,
  });
};

// Search Movies Hook
export const useSearchMovies = (
  query: string,
  options?: Omit<UseQueryOptions<MovieItem[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<MovieItem[], Error>({
    queryKey: movieQueryKeys.search(query),
    queryFn: () => searchMovies(query),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: query.length >= 2,
    ...options,
  });
};
