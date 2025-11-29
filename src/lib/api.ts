import axios from 'axios';

// Anime API Configuration
const ANIME_BASE_URL = 'https://backend.ryzumi.vip'
const SANKA_BASE_URL = 'https://www.sankavollerei.com/anime' 

// Anime API instance
const animeApi = axios.create({
  baseURL: ANIME_BASE_URL,
  timeout: 8000, // Reduced from 15s to 8s for better UX
  headers: {
    'Content-Type': 'application/json',
  },
});

// Sanka Vollerei API instance (for movies)
const sankaApi = axios.create({
  baseURL: SANKA_BASE_URL,
  timeout: 8000, // Reduced from 15s to 8s for better UX
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for anime API
animeApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Anime API Error:', error);
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - please try again');
    }
    if (error.response?.status === 404) {
      throw new Error('Data not found');
    }
    if (error.response?.status >= 500) {
      throw new Error('Server error - please try again later');
    }
    throw new Error('Network error - please check your connection');
  }
);

// Add response interceptor for Sanka API
sankaApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Sanka API Error:', error);
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - please try again');
    }
    if (error.response?.status === 404) {
      throw new Error('Data not found');
    }
    if (error.response?.status >= 500) {
      throw new Error('Server error - please try again later');
    }
    throw new Error('Network error - please check your connection');
  }
);

export interface Genre {
  judul: string;
  slug: string;
}

export interface AnimeItem {
  gambar: string;
  judul: string;
  slug: string;
  eps: string[];
  rate: string[];
  // Additional fields from home endpoint
  current_episode?: string;
  release_day?: string;
  newest_release_date?: string;
  episode_count?: string;
  rating?: string;
  last_release_date?: string;
}

export interface AnimeDetail {
  gambar: string;
  judul: string;
  nama: string;
  namaJapan: string;
  skor: string;
  produser: string;
  tipe: string;
  status: string;
  totalEpisode: string;
  durasi: string;
  rilis: string;
  studio: string;
  genre: string;
  episodes: {
    judul: string;
    slug: string;
    tanggal: string;
  }[];
  batch?: {
    judul: string;
    slug: string;
    tanggal: string;
  };
  lengkap?: {
    judul: string;
    slug: string;
    tanggal: string;
  };
  synopsis?: string;
  recommendations?: {
    title: string;
    slug: string;
    poster: string;
  }[];
}

export interface Episode {
  judul: string;
  iframe: string;
  mirror: {
    m360p: { nama: string; content: string }[];
    m480p: { nama: string; content: string }[];
    m720p: { nama: string; content: string }[];
  };
  download: {
    d360pmp4: { nama: string; href: string }[];
    d480pmp4: { nama: string; href: string }[];
    d720pmp4: { nama: string; href: string }[];
  };
}

export interface Schedule {
  day: string;
  anime_list: {
    anime_name: string;
    url: string;
    slug: string;
    poster: string;
  }[];
}

export interface ScheduleResponse {
  status: string;
  creator: string;
  data: Schedule[];
}

// Home page interfaces (Sanka Vollerei API)
export interface OngoingAnimeItem {
  title: string;
  slug: string;
  poster: string;
  current_episode: string;
  release_day: string;
  newest_release_date: string;
  otakudesu_url: string;
}

export interface CompleteAnimeItem {
  title: string;
  slug: string;
  poster: string;
  episode_count: string;
  rating: string;
  last_release_date: string;
  otakudesu_url: string;
}

export interface HomeResponse {
  status: string;
  creator: string;
  data: {
    ongoing_anime: OngoingAnimeItem[];
    complete_anime: CompleteAnimeItem[];
  };
}

// Ongoing anime page interfaces
export interface OngoingPagination {
  current_page: number;
  last_visible_page: number;
  has_next_page: boolean;
  next_page: number | null;
  has_previous_page: boolean;
  previous_page: number | null;
}

export interface OngoingAnimeResponse {
  status: string;
  creator: string;
  data: {
    paginationData: OngoingPagination;
    ongoingAnimeData: OngoingAnimeItem[];
  };
}

// Complete anime page interfaces (uses same pagination structure)
export interface CompleteAnimeResponse {
  status: string;
  creator: string;
  data: {
    paginationData: OngoingPagination;
    completeAnimeData: CompleteAnimeItem[];
  };
}

// Genre anime interfaces
export interface GenreInfo {
  name: string;
  slug: string;
  otakudesu_url: string;
}

export interface AnimeWithGenres {
  title: string;
  slug: string;
  poster: string;
  rating: string;
  episode_count: string | null;
  season: string;
  studio: string;
  genres: GenreInfo[];
  synopsis: string;
  otakudesu_url: string;
}

export interface GenreAnimeResponse {
  status: string;
  creator: string;
  data: {
    anime: AnimeWithGenres[];
    pagination: OngoingPagination;
  };
}

// Search anime interfaces
export interface SearchAnimeItem {
  title: string;
  slug: string;
  poster: string;
  genres: GenreInfo[];
  status: string;
  rating: string;
  url: string;
}

export interface SearchAnimeResponse {
  status: string;
  creator: string;
  data: SearchAnimeItem[];
}

// Anime Detail interfaces (Sanka Vollerei API)
export interface SankaAnimeDetailData {
  title: string;
  slug: string;
  japanese_title: string;
  poster: string;
  rating: string;
  produser: string;
  type: string;
  status: string;
  episode_count: string;
  duration: string;
  release_date: string;
  studio: string;
  genres: GenreInfo[];
  synopsis: string;
  batch?: {
    slug: string;
    otakudesu_url: string;
    uploaded_at: string;
  };
  episode_lists: {
    episode: string;
    episode_number: number;
    slug: string;
    otakudesu_url: string;
  }[];
  recommendations: {
    title: string;
    slug: string;
    poster: string;
    otakudesu_url: string;
  }[];
}

export interface SankaAnimeDetailResponse {
  status: string;
  creator: string;
  data: SankaAnimeDetailData;
}

// Movie interfaces (Sanka Vollerei API)
export interface GenreItem {
  title: string;
  genreId: string;
  href: string;
  samehadakuUrl: string;
}

export interface MovieItem {
  title: string;
  poster: string;
  slug: string; // Mapped from animeId
  type: string;
  score: string;
  status: string;
  animeId: string;
  href: string;
  samehadakuUrl: string;
  genreList: GenreItem[];
  // Keep these for backward compatibility
  synopsis?: string;
  release?: string;
  duration?: string;
}

export interface MoviePagination {
  currentPage: number;
  hasPrevPage: boolean;
  prevPage: number | null;
  hasNextPage: boolean;
  nextPage: number | null;
  totalPages: number;
}

export interface SankaMovieResponse {
  status: string;
  creator: string;
  message: string;
  data: {
    animeList: MovieItem[];
  };
  pagination: MoviePagination;
}

export interface SankaSearchResponse {
  creator: string;
  data: MovieItem[];
}

// Update MovieDetail interface to match Sanka Vollerei API response
export interface MovieDetail {
  status: string;
  creator: string;
  message: string;
  data: {
    title: string;
    poster: string;
    score: {
      value: string;
      users: string;
    };
    japanese: string;
    synonyms: string;
    english: string;
    status: string;
    type: string;
    source: string;
    duration: string;
    episodes: number;
    season: string;
    studios: string;
    producers: string;
    aired: string;
    trailer: string;
    synopsis: {
      paragraphs: string[];
      connections: string[];
    };
    genreList: GenreItem[];
    batchList: any[];
    episodeList: {
      title: number;
      episodeId: string;
      href: string;
      samehadakuUrl: string;
    }[];
  };
  pagination: any;
}

export interface ServerResponse {
  status: string;
  creator: string;
  message: string;
  data: {
    url: string;
  };
  pagination: any;
}

export interface MovieWatch {
  status: string;
  creator: string;
  message: string;
  data: {
    title: string;
    animeId: string;
    poster: string;
    releasedOn: string;
    defaultStreamingUrl: string;
    hasPrevEpisode: boolean;
    prevEpisode: {
      episodeId: string;
      href: string;
    } | null;
    hasNextEpisode: boolean;
    nextEpisode: {
      episodeId: string;
      href: string;
    } | null;
    synopsis: {
      paragraphs: string[];
      connections: string[];
    };
    genreList: GenreItem[];
    server: {
      qualities: {
        title: string;
        serverList: {
          title: string;
          serverId: string;
          href: string;
        }[];
      }[];
    };
    downloadUrl: {
      formats: {
        title: string;
        qualities: {
          title: string;
          urls: {
            title: string;
            url: string;
          }[];
        }[];
      }[];
    };
    recommendedEpisodeList: {
      title: string;
      poster: string;
      releaseDate: string;
      episodeId: string;
      href: string;
      samehadakuUrl: string;
    }[];
    movie: {
      href: string;
      samehadakuUrl: string;
      animeList: {
        title: string;
        poster: string;
        releaseDate: string;
        animeId: string;
        href: string;
        samehadakuUrl: string;
        genreList: GenreItem[];
      }[];
    };
  };
  pagination: any;
}

// Mock data for development/testing
const mockAnimeData: AnimeItem[] = [
  {
    gambar: 'https://placehold.co/300x400/1a1a1a/ffffff?text=Anime+1',
    judul: 'Attack on Titan Final Season',
    slug: 'attack-on-titan-final',
    eps: ['Episode 25'],
    rate: ['9.0']
  },
  {
    gambar: 'https://placehold.co/300x400/1a1a1a/ffffff?text=Anime+2',
    judul: 'Demon Slayer: Kimetsu no Yaiba',
    slug: 'demon-slayer-s3',
    eps: ['Episode 12'],
    rate: ['8.8']
  },
  {
    gambar: 'https://placehold.co/300x400/1a1a1a/ffffff?text=Anime+3',
    judul: 'Jujutsu Kaisen Season 2',
    slug: 'jujutsu-kaisen-s2',
    eps: ['Episode 24'],
    rate: ['8.9']
  },
  {
    gambar: 'https://placehold.co/300x400/1a1a1a/ffffff?text=Anime+4',
    judul: 'One Piece',
    slug: 'one-piece-latest',
    eps: ['Episode 1090'],
    rate: ['9.2']
  },
  {
    gambar: 'https://placehold.co/300x400/1a1a1a/ffffff?text=Anime+5',
    judul: 'My Hero Academia Season 7',
    slug: 'my-hero-academia-s7',
    eps: ['Episode 8'],
    rate: ['8.5']
  },
  {
    gambar: 'https://placehold.co/300x400/1a1a1a/ffffff?text=Anime+6',
    judul: 'Chainsaw Man',
    slug: 'chainsaw-man',
    eps: ['Episode 12'],
    rate: ['8.7']
  }
];

const mockMovieData: MovieItem[] = [
  {
    title: 'Attack on Titan Movie',
    poster: 'https://placehold.co/300x400/1a1a1a/ffffff?text=AOT+Movie',
    slug: 'attack-on-titan-movie',
    animeId: 'attack-on-titan-movie',
    type: 'Movie',
    score: '8.5',
    status: 'Completed',
    href: '/samehadaku/anime/attack-on-titan-movie',
    samehadakuUrl: 'https://v1.samehadaku.how/anime/attack-on-titan-movie/',
    genreList: [
      { title: 'Action', genreId: 'action', href: '/samehadaku/genres/action', samehadakuUrl: 'https://v1.samehadaku.how/genre/action/' },
      { title: 'Drama', genreId: 'drama', href: '/samehadaku/genres/drama', samehadakuUrl: 'https://v1.samehadaku.how/genre/drama/' }
    ],
    synopsis: 'Epic anime movie adaptation',
    release: '2015',
    duration: '2 Jam 0 Menit'
  },
  {
    title: 'Your Name Movie',
    poster: 'https://placehold.co/300x400/1a1a1a/ffffff?text=Your+Name',
    slug: 'your-name-movie',
    animeId: 'your-name-movie',
    type: 'Movie',
    score: '9.2',
    status: 'Completed',
    href: '/samehadaku/anime/your-name-movie',
    samehadakuUrl: 'https://v1.samehadaku.how/anime/your-name-movie/',
    genreList: [
      { title: 'Romance', genreId: 'romance', href: '/samehadaku/genres/romance', samehadakuUrl: 'https://v1.samehadaku.how/genre/romance/' },
      { title: 'Fantasy', genreId: 'fantasy', href: '/samehadaku/genres/fantasy', samehadakuUrl: 'https://v1.samehadaku.how/genre/fantasy/' }
    ],
    synopsis: 'Beautiful romance anime movie',
    release: '2016',
    duration: '1 Jam 46 Menit'
  }
];

const mockMovieDetailData: MovieDetail = {
  status: 'success',
  creator: 'Sanka Vollerei',
  message: '',
  data: {
    title: 'Attack on Titan Movie',
    poster: 'https://placehold.co/300x400/1a1a1a/ffffff?text=AOT+Movie',
    score: {
      value: '8.5',
      users: '1000'
    },
    japanese: 'サンプル映画',
    synonyms: '',
    english: 'Attack on Titan Movie',
    status: 'Completed',
    type: 'Movie',
    source: 'Manga',
    duration: '2 hr. 0 min.',
    episodes: 1,
    season: 'Summer 2024',
    studios: 'Sample Studio',
    producers: 'Sample Producer',
    aired: 'Jun 1, 2024',
    trailer: '',
    synopsis: {
      paragraphs: ['Epic anime movie adaptation of the popular series'],
      connections: []
    },
    genreList: [
      { title: 'Action', genreId: 'action', href: '/samehadaku/genres/action', samehadakuUrl: 'https://v1.samehadaku.how/genre/action/' },
      { title: 'Drama', genreId: 'drama', href: '/samehadaku/genres/drama', samehadakuUrl: 'https://v1.samehadaku.how/genre/drama/' }
    ],
    batchList: [],
    episodeList: [
      {
        title: 1,
        episodeId: 'attack-on-titan-movie-episode-01',
        href: '/samehadaku/episode/attack-on-titan-movie-episode-01',
        samehadakuUrl: 'https://v1.samehadaku.how/attack-on-titan-movie-episode-01/'
      }
    ]
  },
  pagination: null
};

// Helper functions to map home data to AnimeItem
const mapOngoingToAnimeItem = (anime: OngoingAnimeItem): AnimeItem => ({
  gambar: anime.poster,
  judul: anime.title,
  slug: anime.slug,
  eps: [anime.current_episode],
  rate: [],
  current_episode: anime.current_episode,
  release_day: anime.release_day,
  newest_release_date: anime.newest_release_date
});

const mapCompleteToAnimeItem = (anime: CompleteAnimeItem): AnimeItem => ({
  gambar: anime.poster,
  judul: anime.title,
  slug: anime.slug,
  eps: [`${anime.episode_count} Episode`],
  rate: [anime.rating],
  episode_count: anime.episode_count,
  rating: anime.rating,
  last_release_date: anime.last_release_date
});

const mapGenreAnimeToAnimeItem = (anime: AnimeWithGenres): AnimeItem => ({
  gambar: anime.poster,
  judul: anime.title,
  slug: anime.slug,
  eps: anime.episode_count ? [`${anime.episode_count} Episode`] : ['? Episode'],
  rate: anime.rating ? [anime.rating] : [],
  episode_count: anime.episode_count || undefined,
  rating: anime.rating || undefined
});

const mapSearchAnimeToAnimeItem = (anime: SearchAnimeItem): AnimeItem => ({
  gambar: anime.poster,
  judul: anime.title,
  slug: anime.slug,
  eps: [anime.status],
  rate: anime.rating ? [anime.rating] : [],
  rating: anime.rating || undefined
});

const mapSankaAnimeDetailToAnimeDetail = (data: SankaAnimeDetailData): AnimeDetail => ({
  gambar: data.poster,
  judul: data.title,
  nama: data.title,
  namaJapan: data.japanese_title,
  skor: data.rating,
  produser: data.produser,
  tipe: data.type,
  status: data.status,
  totalEpisode: data.episode_count,
  durasi: data.duration,
  rilis: data.release_date,
  studio: data.studio,
  genre: data.genres.map(g => g.name).join(', '),
  episodes: data.episode_lists.map(ep => ({
    judul: ep.episode,
    slug: ep.slug,
    tanggal: ''
  })),
  batch: data.batch ? {
    judul: `${data.title} Batch`,
    slug: data.batch.slug,
    tanggal: data.batch.uploaded_at
  } : undefined,
  synopsis: data.synopsis,
  recommendations: data.recommendations.map(rec => ({
    title: rec.title,
    slug: rec.slug,
    poster: rec.poster
  }))
});

const mockMovieWatchData: MovieWatch = {
  status: "success",
  creator: "Sanka Vollerei",
  message: "",
  data: {
    title: "Sample Movie Episode 01 Sub Indo",
    animeId: "sample-movie",
    poster: "https://placehold.co/300x400/1a1a1a/ffffff?text=Movie+Poster",
    releasedOn: "1 day ago",
    defaultStreamingUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    hasPrevEpisode: false,
    prevEpisode: null,
    hasNextEpisode: false,
    nextEpisode: null,
    synopsis: {
      paragraphs: ["This is a sample movie synopsis. The story follows an epic adventure."],
      connections: []
    },
    genreList: [
      { title: 'Action', genreId: 'action', href: '/samehadaku/genres/action', samehadakuUrl: 'https://v1.samehadaku.how/genre/action/' }
    ],
    server: {
      qualities: [
        {
          title: "720p",
          serverList: [
            { title: "Server 1", serverId: "server-1", href: "/samehadaku/server/server-1" }
          ]
        }
      ]
    },
    downloadUrl: {
      formats: [
        {
          title: "MP4",
          qualities: [
            {
              title: "720p",
              urls: [
                { title: "Download 1", url: "#" }
              ]
            }
          ]
        }
      ]
    },
    recommendedEpisodeList: [],
    movie: {
      href: "/samehadaku/movies",
      samehadakuUrl: "https://v1.samehadaku.how/anime-movie/",
      animeList: []
    }
  },
  pagination: null
};


// API Functions with fallback to mock data
export const getGenres = async (): Promise<Genre[]> => {
  try {
    const response = await animeApi.get('/genre');
    return response.data;
  } catch (error) {
    console.warn('Using mock genre data due to API error:', error);
    return [
      { judul: 'Action', slug: 'action' },
      { judul: 'Adventure', slug: 'adventure' },
      { judul: 'Comedy', slug: 'comedy' },
      { judul: 'Drama', slug: 'drama' },
      { judul: 'Fantasy', slug: 'fantasy' },
      { judul: 'Romance', slug: 'romance' },
      { judul: 'Sci-Fi', slug: 'sci-fi' },
      { judul: 'Thriller', slug: 'thriller' }
    ];
  }
};

export const getSchedule = async (): Promise<Schedule[]> => {
  try {
    const response = await sankaApi.get<ScheduleResponse>('/schedule');
    if (response.data && response.data.status === 'success' && response.data.data) {
      return response.data.data;
    }
    console.warn('Invalid response format, using mock schedule data');
    return [];
  } catch (error) {
    console.warn('Using mock schedule data due to API error:', error);
    return [
      {
        day: 'Senin',
        anime_list: [
          { anime_name: 'Attack on Titan', slug: 'attack-on-titan', url: '/anime/attack-on-titan', poster: '' },
          { anime_name: 'Demon Slayer', slug: 'demon-slayer', url: '/anime/demon-slayer', poster: '' }
        ]
      },
      {
        day: 'Selasa',
        anime_list: [
          { anime_name: 'Jujutsu Kaisen', slug: 'jujutsu-kaisen', url: '/anime/jujutsu-kaisen', poster: '' },
          { anime_name: 'One Piece', slug: 'one-piece', url: '/anime/one-piece', poster: '' }
        ]
      }
    ];
  }
};

export const getHomeData = async (): Promise<{ ongoing: AnimeItem[]; complete: AnimeItem[] }> => {
  try {
    const response = await sankaApi.get<HomeResponse>('/home');
    if (response.data && response.data.status === 'success' && response.data.data) {
      const ongoing = response.data.data.ongoing_anime.slice(0, 12).map(mapOngoingToAnimeItem); // Limit to 12 items
      const complete = response.data.data.complete_anime.slice(0, 8).map(mapCompleteToAnimeItem); // Limit to 8 items
      return { ongoing, complete };
    }
    console.warn('Invalid response format, using mock data');
    return { ongoing: mockAnimeData.slice(0, 12), complete: mockAnimeData.slice(0, 8) };
  } catch (error) {
    console.warn('Using mock anime data due to API error:', error);
    return { ongoing: mockAnimeData.slice(0, 12), complete: mockAnimeData.slice(0, 8) };
  }
};

export const getOngoingAnime = async (page: number = 1): Promise<{ anime: AnimeItem[]; pagination: OngoingPagination }> => {
  try {
    const response = await sankaApi.get<OngoingAnimeResponse>(`/ongoing-anime?page=${page}`);
    if (response.data && response.data.status === 'success' && response.data.data) {
      const anime = response.data.data.ongoingAnimeData.slice(0, 24).map(mapOngoingToAnimeItem); // Limit to 24 items per page
      return {
        anime,
        pagination: response.data.data.paginationData
      };
    }
    console.warn('Invalid response format, using mock data');
    return {
      anime: mockAnimeData.slice(0, 24),
      pagination: {
        current_page: 1,
        last_visible_page: 1,
        has_next_page: false,
        next_page: null,
        has_previous_page: false,
        previous_page: null
      }
    };
  } catch (error) {
    console.warn('Using mock anime data due to API error:', error);
    return {
      anime: mockAnimeData.slice(0, 24),
      pagination: {
        current_page: 1,
        last_visible_page: 1,
        has_next_page: false,
        next_page: null,
        has_previous_page: false,
        previous_page: null
      }
    };
  }
};

export const getCompleteAnime = async (page: number = 1): Promise<{ anime: AnimeItem[]; pagination: OngoingPagination }> => {
  try {
    const response = await sankaApi.get<CompleteAnimeResponse>(`/complete-anime/${page}`);
    if (response.data && response.data.status === 'success' && response.data.data) {
      const anime = response.data.data.completeAnimeData.slice(0, 24).map(mapCompleteToAnimeItem); // Limit to 24 items per page
      return {
        anime,
        pagination: response.data.data.paginationData
      };
    }
    console.warn('Invalid response format, using mock data');
    return {
      anime: mockAnimeData.slice(0, 24),
      pagination: {
        current_page: 1,
        last_visible_page: 1,
        has_next_page: false,
        next_page: null,
        has_previous_page: false,
        previous_page: null
      }
    };
  } catch (error) {
    console.warn('Using mock anime data due to API error:', error);
    return {
      anime: mockAnimeData.slice(0, 24),
      pagination: {
        current_page: 1,
        last_visible_page: 1,
        has_next_page: false,
        next_page: null,
        has_previous_page: false,
        previous_page: null
      }
    };
  }
};

export const getAnimeByGenre = async (genreSlug: string, page: number = 1): Promise<{ anime: AnimeItem[]; pagination: OngoingPagination }> => {
  try {
    const response = await sankaApi.get<GenreAnimeResponse>(`/genre/${genreSlug}?page=${page}`);
    if (response.data && response.data.status === 'success' && response.data.data) {
      const anime = response.data.data.anime.map(mapGenreAnimeToAnimeItem);
      return {
        anime,
        pagination: response.data.data.pagination
      };
    }
    console.warn('Invalid response format, using mock data');
    return {
      anime: mockAnimeData.slice(0, 24),
      pagination: {
        current_page: 1,
        last_visible_page: 1,
        has_next_page: false,
        next_page: null,
        has_previous_page: false,
        previous_page: null
      }
    };
  } catch (error) {
    console.warn('Using mock anime data due to API error:', error);
    return {
      anime: mockAnimeData.slice(0, 24),
      pagination: {
        current_page: 1,
        last_visible_page: 1,
        has_next_page: false,
        next_page: null,
        has_previous_page: false,
        previous_page: null
      }
    };
  }
};

export const searchAnimeBySanka = async (query: string): Promise<AnimeItem[]> => {
  try {
    const response = await sankaApi.get<SearchAnimeResponse>(`/search/${query}`);
    if (response.data && response.data.status === 'success' && response.data.data) {
      return response.data.data.map(mapSearchAnimeToAnimeItem);
    }
    console.warn('Invalid response format, returning empty array');
    return [];
  } catch (error) {
    console.warn('Error searching anime via Sanka API:', error);
    return [];
  }
};

export const getAnimeDetailBySanka = async (slug: string): Promise<AnimeDetail> => {
  try {
    const response = await sankaApi.get<SankaAnimeDetailResponse>(`/anime/${slug}`);
    if (response.data && response.data.status === 'success' && response.data.data) {
      return mapSankaAnimeDetailToAnimeDetail(response.data.data);
    }
    throw new Error('Invalid response format');
  } catch (error) {
    console.warn('Error fetching anime detail from Sanka API:', error);
    throw error;
  }
};

export const getAnimeList = async (params?: {
  type?: 'ongoing' | 'complete';
  genre?: string;
  search?: string;
  page?: number;
}): Promise<AnimeItem[]> => {
  try {
    const response = await animeApi.get('/anime', { params });
    return response.data;
  } catch (error) {
    console.warn('Using mock anime data due to API error:', error);
    
    // Filter mock data based on params
    let filteredData = [...mockAnimeData];
    
    if (params?.search) {
      const searchTerm = params.search.toLowerCase();
      filteredData = filteredData.filter(anime => 
        anime.judul.toLowerCase().includes(searchTerm)
      );
    }
    
    // Simulate pagination
    const page = params?.page || 1;
    const itemsPerPage = 12;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return filteredData.slice(startIndex, endIndex);
  }
};

export const getAnimeDetail = async (slug: string): Promise<AnimeDetail> => {
  try {
    const response = await animeApi.get(`/anime/${slug}`);
    return response.data;
  } catch (error) {
    console.warn('Using mock anime detail due to API error:', error);
    
    // Return mock detail data
    return {
      gambar: 'https://placehold.co/300x400/1a1a1a/ffffff?text=Anime+Detail',
      judul: 'Sample Anime Title',
      nama: 'Sample Anime',
      namaJapan: 'サンプルアニメ',
      skor: '8.5',
      produser: 'Sample Studio',
      tipe: 'TV',
      status: 'Ongoing',
      totalEpisode: '24',
      durasi: '24 min',
      rilis: '2024',
      studio: 'Sample Animation Studio',
      genre: 'Action, Adventure, Drama',
      episodes: [
        { judul: 'Episode 1: Beginning', slug: 'sample-ep-1', tanggal: '2024-01-01' },
        { judul: 'Episode 2: Journey', slug: 'sample-ep-2', tanggal: '2024-01-08' },
        { judul: 'Episode 3: Challenge', slug: 'sample-ep-3', tanggal: '2024-01-15' }
      ],
      batch: {
        judul: 'Sample Anime Batch',
        slug: 'sample-batch',
        tanggal: '2024-06-01'
      }
    };
  }
};

export const getEpisode = async (slug: string): Promise<Episode> => {
  try {
    const response = await animeApi.get(`/episode/${slug}`);
    return response.data;
  } catch (error) {
    console.warn('Using mock episode data due to API error:', error);
    
    return {
      judul: 'Sample Episode',
      iframe: '',
      mirror: {
        m360p: [{ nama: 'Server 1', content: 'sample-content-360' }],
        m480p: [{ nama: 'Server 1', content: 'sample-content-480' }],
        m720p: [{ nama: 'Server 1', content: 'sample-content-720' }]
      },
      download: {
        d360pmp4: [{ nama: 'Download 360p', href: '#' }],
        d480pmp4: [{ nama: 'Download 480p', href: '#' }],
        d720pmp4: [{ nama: 'Download 720p', href: '#' }]
      }
    };
  }
};

export const getMirrorEpisode = async (slug: string): Promise<Episode> => {
  try {
    const response = await animeApi.get(`/mirror/episode/${slug}`);
    return response.data;
  } catch (error) {
    console.warn('Using mock mirror episode data due to API error:', error);
    return getEpisode(slug); // Fallback to regular episode
  }
};

export const getNonce = async (): Promise<string> => {
  try {
    const response = await animeApi.get('/nonce');
    return response.data;
  } catch (error) {
    console.warn('Using mock nonce due to API error:', error);
    return 'mock-nonce-token';
  }
};

export const getIframe = async (content: string, nonce: string): Promise<string> => {
  try {
    const response = await animeApi.get('/getIframe', {
      params: { content, nonce }
    });
    return response.data;
  } catch (error) {
    console.warn('Using mock iframe due to API error:', error);
    return 'https://www.youtube.com/embed/dQw4w9WgXcQ'; // Mock iframe URL
  }
};

// MOVIE API Functions
export const getMovieList = async (params?: {
  page?: number;
}): Promise<{ movies: MovieItem[]; pagination: MoviePagination }> => {
  try {
    const page = params?.page || 1;
    const response = await sankaApi.get<SankaMovieResponse>(`/samehadaku/movies?page=${page}`);

    if (response.data && response.data.status === 'success' && response.data.data?.animeList) {
      // Map animeId to slug for backward compatibility
      const movies = response.data.data.animeList.map(movie => ({
        ...movie,
        slug: movie.animeId // Use animeId as slug
      }));

      return {
        movies,
        pagination: response.data.pagination
      };
    }

    return {
      movies: mockMovieData,
      pagination: {
        currentPage: 1,
        hasPrevPage: false,
        prevPage: null,
        hasNextPage: false,
        nextPage: null,
        totalPages: 1
      }
    };
  } catch (error) {
    console.error('Error fetching movie list from Sanka Vollerei:', error);
    return {
      movies: mockMovieData,
      pagination: {
        currentPage: 1,
        hasPrevPage: false,
        prevPage: null,
        hasNextPage: false,
        nextPage: null,
        totalPages: 1
      }
    };
  }
};

export const getMovieDetail = async (animeId: string): Promise<MovieDetail> => {
  try {
    const response = await sankaApi.get<MovieDetail>(`/samehadaku/anime/${animeId}`);

    if (response.data && response.data.status === 'success') {
      return response.data;
    }
    console.log('Using mock data for movie detail');
    return mockMovieDetailData;
  } catch (error) {
    console.error('Error fetching movie detail from Sanka Vollerei:', error);
    return mockMovieDetailData;
  }
};

export const getMovieWatch = async (episodeId: string): Promise<MovieWatch> => {
  try {
    console.log('Fetching episode data for episodeId:', episodeId);
    const response = await sankaApi.get<MovieWatch>(`/samehadaku/episode/${episodeId}`);
    console.log('Episode response:', response.data);

    if (response.data && response.data.status === 'success') {
      return response.data;
    }
    console.log('Using mock data for episode');
    return mockMovieWatchData;
  } catch (error) {
    console.error('Error fetching episode from Sanka Vollerei:', error);
    return mockMovieWatchData;
  }
};

// GET SERVER URL API Function
export const getServerUrl = async (serverId: string): Promise<string> => {
  try {
    console.log('Fetching server URL for serverId:', serverId);
    const response = await sankaApi.get<ServerResponse>(`/samehadaku/server/${serverId}`);
    console.log('Server response:', response.data);

    if (response.data && response.data.status === 'success' && response.data.data?.url) {
      return response.data.data.url;
    }
    console.log('Failed to get server URL, using default');
    return '';
  } catch (error) {
    console.error('Error fetching server URL from Sanka Vollerei:', error);
    return '';
  }
};

// MOVIE SEARCH API Function (Sanka Vollerei - Samehadaku)
export const searchMovies = async (query: string): Promise<MovieItem[]> => {
  try {
    const response = await sankaApi.get(`/samehadaku/search`, {
      params: { q: query }
    });

    if (response.data && response.data.status === 'success' && response.data.data?.animeList) {
      // Map animeId to slug for consistency
      return response.data.data.animeList.map((item: MovieItem) => ({
        ...item,
        slug: item.animeId
      }));
    }
    return [];
  } catch (error) {
    console.error('Error searching movies from Sanka Vollerei:', error);
    return [];
  }
};

// ANIME SEARCH API Function (Backend Ryzumi - for regular anime)
export const searchAnime = async (query: string): Promise<AnimeItem[]> => {
  try {
    const response = await animeApi.get('/anime', {
      params: { search: query }
    });

    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('Error searching anime:', error);
    return [];
  }
};

// Export both API instances for potential direct use
export { animeApi, sankaApi };
export default animeApi; // Keep anime as default for backward compatibility

