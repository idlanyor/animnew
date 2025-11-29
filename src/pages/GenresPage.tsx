import { useState, useEffect } from 'react';
import { getGenres, getAnimeByGenre, Genre, AnimeItem, OngoingPagination } from '@/lib/api';
import AnimeCard from '@/components/AnimeCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faChevronLeft, faChevronRight, faLayerGroup, faFire } from '@fortawesome/free-solid-svg-icons';

export default function GenresPage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [animeList, setAnimeList] = useState<AnimeItem[]>([]);
  const [pagination, setPagination] = useState<OngoingPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingAnime, setLoadingAnime] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        const data = await getGenres();
        setGenres(data);
      } catch (err) {
        setError('Gagal memuat genre');
        console.error('Error fetching genres:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const fetchAnimeByGenre = async (genreSlug: string, page: number = 1) => {
    try {
      setLoadingAnime(true);
      const { anime, pagination: paginationData } = await getAnimeByGenre(genreSlug, page);
      setAnimeList(anime);
      setPagination(paginationData);
      setSelectedGenre(genreSlug);
    } catch (err) {
      setError(`Gagal memuat anime untuk genre: ${genreSlug}`);
      console.error('Error fetching anime by genre:', err);
    } finally {
      setLoadingAnime(false);
    }
  };

  const goToPage = (page: number) => {
    if (selectedGenre && !loadingAnime && page > 0) {
      fetchAnimeByGenre(selectedGenre, page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <LoadingSpinner size="lg" text="Memuat genre..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
              <FontAwesomeIcon icon={faTag} className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                Genre Anime
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Jelajahi anime berdasarkan genre favoritmu
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {error ? (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => {
                setError(null);
                setLoading(true);
                getGenres().then(data => {
                  setGenres(data);
                  setLoading(false);
                }).catch(() => {
                  setError('Gagal memuat genre');
                  setLoading(false);
                });
              }}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-medium"
            >
              Coba Lagi
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Genre Buttons */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <FontAwesomeIcon icon={faLayerGroup} className="text-amber-500 w-5 h-5" />
                <h2 className="font-bold text-gray-800 dark:text-white">Pilih Genre</h2>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">{genres.length} genre</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <button
                    key={genre.slug}
                    onClick={() => fetchAnimeByGenre(genre.slug, 1)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      selectedGenre === genre.slug 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-500 shadow-md shadow-amber-500/20' 
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-amber-400 dark:hover:border-amber-500'
                    }`}
                  >
                    {genre.judul}
                  </button>
                ))}
              </div>
            </div>

            {/* Anime List */}
            {selectedGenre && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faFire} className="text-orange-500 w-5 h-5" />
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                      {genres.find(g => g.slug === selectedGenre)?.judul}
                    </h2>
                    {pagination && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({pagination.current_page}/{pagination.last_visible_page} halaman)
                      </span>
                    )}
                  </div>
                </div>

                {loadingAnime ? (
                  <div className="flex justify-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                    <LoadingSpinner size="md" text="Memuat anime..." />
                  </div>
                ) : animeList.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {animeList.map((anime) => (
                        <AnimeCard key={anime.slug} anime={anime} />
                      ))}
                    </div>

                    {/* Pagination */}
                    {pagination && (pagination.has_next_page || pagination.has_previous_page) && (
                      <div className="flex items-center justify-center gap-3 pt-6">
                        <button
                          onClick={() => pagination.previous_page && goToPage(pagination.previous_page)}
                          disabled={!pagination.has_previous_page || loadingAnime}
                          className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-amber-400 dark:hover:border-amber-500 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
                        </button>

                        <div className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                          <span className="text-sm font-medium text-gray-800 dark:text-white">
                            <span className="text-amber-600 dark:text-amber-400">{pagination.current_page}</span>
                            <span className="text-gray-400 mx-1">/</span>
                            <span>{pagination.last_visible_page}</span>
                          </span>
                        </div>

                        <button
                          onClick={() => pagination.next_page && goToPage(pagination.next_page)}
                          disabled={!pagination.has_next_page || loadingAnime}
                          className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-amber-400 dark:hover:border-amber-500 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                    <FontAwesomeIcon icon={faTag} className="text-gray-400 text-4xl mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">Tidak ada anime untuk genre ini</p>
                  </div>
                )}
              </div>
            )}

            {/* Initial State */}
            {!selectedGenre && (
              <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <FontAwesomeIcon icon={faTag} className="text-amber-500 text-2xl" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">Pilih genre untuk melihat daftar anime</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Klik salah satu genre di atas</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
