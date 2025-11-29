import { useState } from 'react';
import { useMovieList, useSearchMovies } from '@/hooks/useAnimeQuery';
import MovieCard from '@/components/MovieCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import SEOHead from '@/components/SEOHead';
import { generatePageSEOData } from '@/lib/seo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faSearch, faChevronLeft, faChevronRight, faClapperboard, faStar, faGlobe } from '@fortawesome/free-solid-svg-icons';

export default function MoviePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: movieData, isLoading, isError } = useMovieList(currentPage);
  const { data: searchResults = [], isLoading: searchLoading } = useSearchMovies(searchQuery, {
    enabled: searchQuery.length >= 2,
  });

  const movies = movieData?.movies || [];
  const pagination = movieData?.pagination || {
    currentPage: 1,
    hasPrevPage: false,
    prevPage: null,
    hasNextPage: false,
    nextPage: null,
    totalPages: 1
  };

  const seoData = generatePageSEOData({
    title: 'Nonton Anime Movie Sub Indo HD Gratis - KanataAnime',
    description: 'Nonton anime movie subtitle Indonesia gratis di KanataAnime. Koleksi lengkap anime movie terbaru dengan kualitas HD 720p tanpa iklan.',
    keywords: 'nonton anime movie, anime movie sub indo, streaming anime movie, anime movie subtitle indonesia',
    url: '/movie',
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <LoadingSpinner size="lg" text="Memuat movie..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="text-center bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
          <p className="text-red-500 mb-4">Gagal memuat data movie</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full font-medium"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead {...seoData} />
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/20">
                  <FontAwesomeIcon icon={faFilm} className="text-white text-xl" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                    Anime Movie
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Koleksi film anime terlengkap
                  </p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-md w-full">
                <input
                  type="text"
                  placeholder="Cari movie..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-11 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 dark:focus:border-purple-500"
                />
                <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Search Results */}
          {searchQuery.trim() && (
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faSearch} className="text-purple-500 w-5 h-5" />
                <h2 className="font-bold text-gray-800 dark:text-white">
                  Hasil pencarian "{searchQuery}"
                </h2>
              </div>

              {searchLoading ? (
                <div className="flex justify-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                  <LoadingSpinner size="md" text="Mencari..." />
                </div>
              ) : searchResults.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {searchResults.map((movie) => (
                    <MovieCard key={movie.slug} movie={movie} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                  <FontAwesomeIcon icon={faFilm} className="text-gray-400 text-4xl mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">Tidak ditemukan movie untuk "{searchQuery}"</p>
                </div>
              )}
            </div>
          )}

          {/* All Movies */}
          {!searchQuery.trim() && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 text-center">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <FontAwesomeIcon icon={faClapperboard} className="text-purple-500 w-5 h-5" />
                  </div>
                  <p className="text-xl font-bold text-gray-800 dark:text-white">{movies.length}+</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Movie</p>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 text-center">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                    <FontAwesomeIcon icon={faStar} className="text-yellow-500 w-5 h-5" />
                  </div>
                  <p className="text-xl font-bold text-gray-800 dark:text-white">HD</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Kualitas</p>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 text-center">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <FontAwesomeIcon icon={faGlobe} className="text-blue-500 w-5 h-5" />
                  </div>
                  <p className="text-xl font-bold text-gray-800 dark:text-white">Sub Indo</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Subtitle</p>
                </div>
              </div>

              {/* Page Info */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Halaman <span className="font-medium text-purple-600 dark:text-purple-400">{pagination.currentPage}</span> dari {pagination.totalPages}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {movies.length} movie
                </p>
              </div>

              {/* Movies Grid */}
              {movies.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {movies.map((movie) => (
                      <MovieCard key={movie.slug} movie={movie} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {(pagination.hasPrevPage || pagination.hasNextPage) && (
                    <div className="flex items-center justify-center gap-3 pt-4">
                      <button
                        onClick={() => setCurrentPage(pagination.prevPage || currentPage)}
                        disabled={!pagination.hasPrevPage}
                        className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-purple-400 dark:hover:border-purple-500 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
                      </button>

                      <div className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <span className="text-sm font-medium text-gray-800 dark:text-white">
                          <span className="text-purple-600 dark:text-purple-400">{pagination.currentPage}</span>
                          <span className="text-gray-400 mx-1">/</span>
                          <span>{pagination.totalPages}</span>
                        </span>
                      </div>

                      <button
                        onClick={() => setCurrentPage(pagination.nextPage || currentPage)}
                        disabled={!pagination.hasNextPage}
                        className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-purple-400 dark:hover:border-purple-500 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <FontAwesomeIcon icon={faFilm} className="text-gray-400 text-2xl" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">Tidak ada movie ditemukan</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
