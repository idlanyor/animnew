import { useState, useEffect } from 'react';
import { getOngoingAnime, AnimeItem, OngoingPagination } from '@/lib/api';
import AnimeCard from '@/components/AnimeCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendUp, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

export default function OngoingPage() {
  const [animeList, setAnimeList] = useState<AnimeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<OngoingPagination | null>(null);

  const fetchAnime = async (page: number) => {
    try {
      setLoading(true);
      const { anime, pagination: paginationData } = await getOngoingAnime(page);
      setAnimeList(anime);
      setPagination(paginationData);
    } catch (err) {
      setError('Failed to load ongoing anime');
      console.error('Error fetching ongoing anime:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnime(1);
  }, []);

  const goToPage = (page: number) => {
    if (!loading && page > 0) {
      fetchAnime(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading && !pagination) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoadingSpinner size="lg" text="Loading ongoing anime..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FontAwesomeIcon icon={faArrowTrendUp} className="text-blue-400 text-[48px]" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Ongoing Anime
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Stay up to date with the latest episodes of currently airing anime series.
              New episodes are added regularly as they become available.
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
                fetchAnime(1);
              }}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all border border-cyan-400/30 shadow-lg shadow-cyan-500/20"
            >
              Try Again
            </button>
          </div>
        ) : animeList.length > 0 ? (
          <>
            {/* Stats */}
            <div className="mb-8">
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <h3 className="text-2xl font-bold text-blue-400">{animeList.length}+</h3>
                    <p className="text-gray-400">Ongoing Series</p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-green-400">Weekly</h3>
                    <p className="text-gray-400">New Episodes</p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-purple-400">HD</h3>
                    <p className="text-gray-400">Quality Streaming</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Anime Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-12">
              {animeList.map((anime) => (
                <AnimeCard key={anime.slug} anime={anime} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination && (pagination.has_next_page || pagination.has_previous_page) && (
              <div className="flex items-center justify-center gap-4 py-8">
                {/* Previous Button */}
                <button
                  onClick={() => pagination.previous_page && goToPage(pagination.previous_page)}
                  disabled={!pagination.has_previous_page || loading}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 border border-cyan-400/30 shadow-lg shadow-cyan-500/20"
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="text-[20px]" />
                  Previous
                </button>

                {/* Page Info */}
                <div className="bg-gray-800 px-6 py-3 rounded-lg border border-cyan-400/30">
                  <span className="text-white font-bold">
                    Page <span className="text-cyan-400">{pagination.current_page}</span> of{' '}
                    <span className="text-cyan-400">{pagination.last_visible_page}</span>
                  </span>
                </div>

                {/* Next Button */}
                <button
                  onClick={() => pagination.next_page && goToPage(pagination.next_page)}
                  disabled={!pagination.has_next_page || loading}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 border border-cyan-400/30 shadow-lg shadow-cyan-500/20"
                >
                  Next
                  <FontAwesomeIcon icon={faChevronRight} className="text-[20px]" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faArrowTrendUp} className="text-gray-500 mx-auto mb-4 text-[64px]" />
            <p className="text-gray-400 text-xl">No ongoing anime found</p>
          </div>
        )}
      </div>
    </div>
  );
}
