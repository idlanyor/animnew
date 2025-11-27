
import { useState, useEffect } from 'react';
import { getGenres, getAnimeByGenre, Genre, AnimeItem, OngoingPagination } from '@/lib/api';
import AnimeCard from '@/components/AnimeCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faFilter, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

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
        setError('Failed to load genres');
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
      setError(`Failed to load anime for genre: ${genreSlug}`);
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
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoadingSpinner size="lg" text="Loading genres..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 via-amber-500 to-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FontAwesomeIcon icon={faTag} className="text-yellow-300 text-[48px]" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Anime Genres
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore anime by your favorite genres. From action-packed adventures to heartwarming romances, 
              find the perfect anime that matches your mood.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-xl mb-4">{error}</p>
            <button 
              onClick={() => {
                setError(null);
                setLoading(true);
                getGenres().then(data => {
                  setGenres(data);
                  setLoading(false);
                }).catch(() => {
                  setError('Failed to load genres');
                  setLoading(false);
                });
              }}
              className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-all border border-yellow-400/30 shadow-lg shadow-yellow-500/20"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Genre Buttons */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <FontAwesomeIcon icon={faFilter} className="text-yellow-400" />
                Select a Genre
              </h2>
              <div className="flex flex-wrap gap-3">
                {genres.map((genre) => (
                  <button
                    key={genre.slug}
                    onClick={() => fetchAnimeByGenre(genre.slug, 1)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedGenre === genre.slug ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white border border-yellow-400/30 shadow-lg shadow-yellow-500/20' : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'}`}
                  >
                    {genre.judul}
                  </button>
                ))}
              </div>
            </div>

            {/* Anime List */}
            {selectedGenre && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {genres.find(g => g.slug === selectedGenre)?.judul} Anime
                  </h2>
                </div>

                {loadingAnime ? (
                  <div className="flex justify-center py-12">
                    <LoadingSpinner size="md" text="Loading anime..." />
                  </div>
                ) : animeList.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                      {animeList.map((anime) => (
                        <AnimeCard key={anime.slug} anime={anime} />
                      ))}
                    </div>

                    {/* Pagination Controls */}
                    {pagination && (pagination.has_next_page || pagination.has_previous_page) && (
                      <div className="flex items-center justify-center gap-4 mt-12">
                        {/* Previous Button */}
                        <button
                          onClick={() => pagination.previous_page && goToPage(pagination.previous_page)}
                          disabled={!pagination.has_previous_page || loadingAnime}
                          className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 border border-yellow-400/30 shadow-lg shadow-yellow-500/20"
                        >
                          <FontAwesomeIcon icon={faChevronLeft} className="text-[20px]" />
                          Previous
                        </button>

                        {/* Page Info */}
                        <div className="bg-gray-800 px-6 py-3 rounded-lg border border-yellow-400/30">
                          <span className="text-white font-bold">
                            Page <span className="text-yellow-400">{pagination.current_page}</span> of{' '}
                            <span className="text-yellow-400">{pagination.last_visible_page}</span>
                          </span>
                        </div>

                        {/* Next Button */}
                        <button
                          onClick={() => pagination.next_page && goToPage(pagination.next_page)}
                          disabled={!pagination.has_next_page || loadingAnime}
                          className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 border border-yellow-400/30 shadow-lg shadow-yellow-500/20"
                        >
                          Next
                          <FontAwesomeIcon icon={faChevronRight} className="text-[20px]" />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 bg-gray-900 rounded-lg">
                    <p className="text-gray-400">No anime found for this genre</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}