'use client';

import { useState, useEffect } from 'react';
import { getMovieList, searchMovies, MovieItem, MoviePagination } from '@/lib/api';
import MovieCard from '@/components/MovieCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Film, TrendingUp, Calendar } from 'lucide-react';

export default function MoviePage() {
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [searchResults, setSearchResults] = useState<MovieItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<MoviePagination>({
    currentPage: 1,
    hasPrevPage: false,
    prevPage: null,
    hasNextPage: false,
    nextPage: null,
    totalPages: 1
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch movies from Sanka Vollerei API with pagination
        const result = await getMovieList({ page: currentPage });
        setMovies(result.movies);
        setPagination(result.pagination);

      } catch (err) {
        setError('Failed to load movie data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  // Live search effect - using Sanka Vollerei API
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const searchMoviesAPI = async () => {
      try {
        setSearchLoading(true);
        const results = await searchMovies(searchQuery);
        setSearchResults(results);
      } catch (err) {
        console.error('Error searching movies:', err);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    };

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(searchMoviesAPI, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading movies..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-yellow-500 via-amber-500 to-blue-600 py-12 sm:py-16 md:py-20">
        <div className="absolute inset-0 bg-opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Welcome to <span className="text-yellow-200 block sm:inline mt-2 sm:mt-0">KanataNimeV2 Movie</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-2 leading-relaxed">
            Discover and stream your favorite Japanese anime movies, Chinese donghua films,
            and live-action anime adaptations in stunning quality. From classic anime
            masterpieces to the latest releases, explore our curated collection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="mb-4 sm:mb-8 w-full">
              <div className="relative max-w-2xl mx-auto">
                <input
                  type="text"
                  placeholder="Search for movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-gray-800 to-gray-900
                    border-2 border-yellow-500/30 rounded-xl text-white
                    placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-yellow-500
                    focus:border-yellow-500 focus:shadow-[0_0_15px_rgba(234,179,8,0.35)]
                    transition-all duration-300 ease-in-out
                    text-base sm:text-lg backdrop-blur-sm
                    hover:border-yellow-500/50 hover:shadow-[0_0_10px_rgba(234,179,8,0.2)]
                    touch-manipulation"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Search Results Section */}
      {searchQuery.trim() && (
        <section className="py-8 sm:py-12 md:py-16 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
                <Film className="text-yellow-400 flex-shrink-0" size={24} />
                <span className="line-clamp-1">Search Results for &quot;{searchQuery}&quot;</span>
              </h2>
            </div>

            {searchLoading ? (
              <div className="text-center py-12">
                <LoadingSpinner size="lg" text="Searching movies..." />
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                {searchResults.map((movie) => (
                  <MovieCard key={movie.slug} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-sm sm:text-base">No movies found for &quot;{searchQuery}&quot;</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* All Movies Section */}
      {!searchQuery.trim() && (
        <section className="py-8 sm:py-12 md:py-16 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
                <Film className="text-blue-400 flex-shrink-0" size={24} />
                All Movies
              </h2>
            </div>

            {movies.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                  {movies.map((movie) => (
                    <MovieCard key={movie.slug} movie={movie} />
                  ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex flex-col sm:flex-row justify-center items-center mt-8 sm:mt-12 gap-3 sm:gap-4">
                  <button
                    onClick={() => setCurrentPage(pagination.prevPage || currentPage)}
                    disabled={!pagination.hasPrevPage}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-yellow-500 to-blue-600 hover:from-yellow-600 hover:to-blue-700 disabled:bg-gray-600 disabled:from-gray-600 disabled:to-gray-600
                      disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm sm:text-base
                      font-medium touch-manipulation active:scale-95"
                  >
                    Previous
                  </button>

                  <span className="text-white px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-blue-600/20 rounded-lg text-sm sm:text-base font-medium order-first sm:order-none border border-yellow-500/30">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage(pagination.nextPage || currentPage)}
                    disabled={!pagination.hasNextPage}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-yellow-500 to-blue-600 hover:from-yellow-600 hover:to-blue-700 disabled:bg-gray-600 disabled:from-gray-600 disabled:to-gray-600
                      disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm sm:text-base
                      font-medium touch-manipulation active:scale-95"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-sm sm:text-base">No movies found</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8 sm:mb-12">
            Why Choose Our Movie Platform?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-yellow-500 to-amber-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Film className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">HD Quality Streaming</h3>
              <p className="text-gray-400">
                Watch movies in multiple resolutions including 1080p HD for the best viewing experience.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Latest Releases</h3>
              <p className="text-gray-400">
                Stay up to date with the latest movie releases and blockbuster films.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-yellow-400 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Extensive Library</h3>
              <p className="text-gray-400">
                Access thousands of movie titles from classic films to the latest releases.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}