
import { useState } from 'react';
import { useMovieList, useSearchMovies } from '@/hooks/useAnimeQuery';
import MovieCard from '@/components/MovieCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import SEOHead from '@/components/SEOHead';
import { generatePageSEOData } from '@/lib/seo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faArrowTrendUp, faCalendar } from '@fortawesome/free-solid-svg-icons';

export default function MoviePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Use React Query hooks - automatic caching and request deduplication
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

  // Generate SEO data for movie page
  const seoData = generatePageSEOData({
    title: 'Nonton Anime Movie Sub Indo HD Gratis - KanataAnime',
    description: 'Nonton anime movie subtitle Indonesia gratis di KanataAnime. Koleksi lengkap anime movie terbaru dengan kualitas HD 720p tanpa iklan. Streaming anime movie terbaik dengan subtitle Indonesia.',
    keywords: 'nonton anime movie, anime movie sub indo, streaming anime movie, anime movie subtitle indonesia, kanatanime, anime movie gratis, anime movie terbaru, anime movie HD, anime movie tanpa iklan',
    url: '/movie',
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading movies..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">Failed to load movie data</p>
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
    <>
      <SEOHead {...seoData} />
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      {/* Hero Section with Glassmorphism */}
      <section className="relative overflow-hidden py-16 sm:py-20 md:py-24 lg:py-28">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Glass overlay */}
        <div className="absolute inset-0 backdrop-blur-3xl bg-gradient-to-b from-black/30 via-black/20 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title with Glass Effect */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="inline-block">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-yellow-100 to-blue-100 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                  Welcome to
                </span>
                <br />
                <span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(234,179,8,0.5)] animate-pulse">
                  KanataNimeV2 Movie
                </span>
              </h1>
            </div>

            {/* Glass Description Card */}
            <div className="max-w-3xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                <div className="relative glass-card p-6 sm:p-8 rounded-2xl border border-white/10">
                  <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed">
                    Discover and stream your favorite <span className="text-yellow-400 font-semibold">Japanese anime movies</span>,
                    <span className="text-blue-400 font-semibold"> Chinese donghua films</span>, and
                    <span className="text-purple-400 font-semibold"> live-action adaptations</span> in stunning quality.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Glass Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 via-blue-500 to-purple-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>

              {/* Search container */}
              <div className="relative glass-card p-2 rounded-2xl border border-white/20">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for movies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 sm:px-8 py-4 sm:py-5 bg-transparent text-white placeholder-gray-400
                      focus:outline-none text-base sm:text-lg md:text-xl
                      transition-all duration-300"
                  />
                  <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2">
                    <div className="glass-badge p-3 rounded-xl bg-gradient-to-r from-yellow-500/20 to-blue-500/20 border border-white/10">
                      <FontAwesomeIcon icon={faFilm} className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Search Results Section */}
      {searchQuery.trim() && (
        <section className="py-8 sm:py-12 md:py-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Glass Header */}
            <div className="mb-8 sm:mb-10">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-purple-500/20 blur-xl"></div>
                <div className="relative glass-card px-6 py-4 rounded-2xl border border-white/10">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500/20 to-purple-500/20">
                      <FontAwesomeIcon icon={faFilm} className="text-yellow-400 flex-shrink-0 text-[24px]" />
                    </div>
                    <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      Search Results for &quot;{searchQuery}&quot;
                    </span>
                  </h2>
                </div>
              </div>
            </div>

            {searchLoading ? (
              <div className="text-center py-16">
                <div className="glass-card inline-block px-8 py-6 rounded-2xl border border-white/10">
                  <LoadingSpinner size="lg" text="Searching movies..." />
                </div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                {searchResults.map((movie) => (
                  <MovieCard key={movie.slug} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="glass-card inline-block px-8 py-6 rounded-2xl border border-white/10">
                  <p className="text-gray-400 text-base sm:text-lg">No movies found for &quot;{searchQuery}&quot;</p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* All Movies Section */}
      {!searchQuery.trim() && (
        <section className="py-8 sm:py-12 md:py-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Glass Header */}
            <div className="mb-8 sm:mb-10">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-xl"></div>
                <div className="relative glass-card px-6 py-4 rounded-2xl border border-white/10">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                      <FontAwesomeIcon icon={faFilm} className="text-blue-400 flex-shrink-0 text-[24px]" />
                    </div>
                    <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      All Movies
                    </span>
                  </h2>
                </div>
              </div>
            </div>

            {movies.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                  {movies.map((movie) => (
                    <MovieCard key={movie.slug} movie={movie} />
                  ))}
                </div>

                {/* Enhanced Glass Pagination */}
                <div className="flex flex-col sm:flex-row justify-center items-center mt-12 sm:mt-16 gap-4">
                  {/* Previous Button */}
                  <button
                    onClick={() => setCurrentPage(pagination.prevPage || currentPage)}
                    disabled={!pagination.hasPrevPage}
                    className="group relative w-full sm:w-auto overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
                    <div className="relative glass-card px-6 sm:px-8 py-3 sm:py-4 rounded-xl border border-white/20
                      disabled:opacity-50 disabled:cursor-not-allowed
                      group-hover:border-cyan-400/50 transition-all duration-300">
                      <span className="text-white font-medium text-sm sm:text-base bg-gradient-to-r from-white to-cyan-200 bg-clip-text group-hover:text-transparent transition-all">
                        Previous
                      </span>
                    </div>
                  </button>

                  {/* Page Indicator */}
                  <div className="relative group order-first sm:order-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/30 to-blue-500/30 blur-lg"></div>
                    <div className="relative glass-card px-6 py-3 rounded-xl border border-white/20">
                      <span className="text-white font-semibold text-sm sm:text-base">
                        Page <span className="text-yellow-400">{pagination.currentPage}</span> of <span className="text-blue-400">{pagination.totalPages}</span>
                      </span>
                    </div>
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => setCurrentPage(pagination.nextPage || currentPage)}
                    disabled={!pagination.hasNextPage}
                    className="group relative w-full sm:w-auto overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
                    <div className="relative glass-card px-6 sm:px-8 py-3 sm:py-4 rounded-xl border border-white/20
                      disabled:opacity-50 disabled:cursor-not-allowed
                      group-hover:border-blue-400/50 transition-all duration-300">
                      <span className="text-white font-medium text-sm sm:text-base bg-gradient-to-r from-white to-blue-200 bg-clip-text group-hover:text-transparent transition-all">
                        Next
                      </span>
                    </div>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <div className="glass-card inline-block px-8 py-6 rounded-2xl border border-white/10">
                  <p className="text-gray-400 text-base sm:text-lg">No movies found</p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Enhanced Features Section */}
      <section className="py-16 sm:py-20 md:py-24 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white via-yellow-100 to-blue-100 bg-clip-text text-transparent">
                  Why Choose Our Movie Platform?
                </span>
              </h2>
              <div className="h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent rounded-full"></div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-amber-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative glass-card p-8 rounded-2xl border border-white/10 hover:border-yellow-500/30 transition-all duration-500 text-center">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl blur-md opacity-50"></div>
                  <div className="relative bg-gradient-to-br from-yellow-500 to-amber-600 w-20 h-20 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <FontAwesomeIcon icon={faFilm} className="text-white text-[40px]" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                  HD Quality Streaming
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Watch movies in multiple resolutions including 1080p HD for the best viewing experience.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-700/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative glass-card p-8 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all duration-500 text-center">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl blur-md opacity-50"></div>
                  <div className="relative bg-gradient-to-br from-blue-500 to-blue-700 w-20 h-20 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <FontAwesomeIcon icon={faArrowTrendUp} className="text-white text-[40px]" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  Latest Releases
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Stay up to date with the latest movie releases and blockbuster films.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative sm:col-span-2 lg:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative glass-card p-8 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all duration-500 text-center">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-blue-600 rounded-2xl blur-md opacity-50"></div>
                  <div className="relative bg-gradient-to-br from-yellow-400 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <FontAwesomeIcon icon={faCalendar} className="text-white text-[40px]" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                  Extensive Library
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Access thousands of movie titles from classic films to the latest releases.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}