import { useState, memo } from 'react';
import { useOngoingAnime } from '@/hooks/useAnimeQuery';
import AnimeCard from '@/components/AnimeCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faChevronRight, faChevronLeft, faClock, faTv, faCalendarWeek } from '@fortawesome/free-solid-svg-icons';

function OngoingPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = useOngoingAnime(currentPage);

  const animeList = data?.anime || [];
  const pagination = data?.pagination || null;

  const goToPage = (page: number) => {
    if (page > 0) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isLoading && !pagination) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <LoadingSpinner size="lg" text="Memuat anime ongoing..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
              <FontAwesomeIcon icon={faPlay} className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                Anime Ongoing
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Anime yang sedang tayang minggu ini
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {isError ? (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <p className="text-red-500 mb-4">Gagal memuat anime ongoing</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium"
            >
              Coba Lagi
            </button>
          </div>
        ) : animeList.length > 0 ? (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <FontAwesomeIcon icon={faTv} className="text-blue-500 w-5 h-5" />
                </div>
                <p className="text-xl font-bold text-gray-800 dark:text-white">{animeList.length}+</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Sedang Tayang</p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <FontAwesomeIcon icon={faCalendarWeek} className="text-green-500 w-5 h-5" />
                </div>
                <p className="text-xl font-bold text-gray-800 dark:text-white">Weekly</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Update</p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <FontAwesomeIcon icon={faClock} className="text-purple-500 w-5 h-5" />
                </div>
                <p className="text-xl font-bold text-gray-800 dark:text-white">Sub Indo</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Tercepat</p>
              </div>
            </div>

            {/* Page Info */}
            {pagination && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Halaman <span className="font-medium text-blue-600 dark:text-blue-400">{pagination.current_page}</span> dari {pagination.last_visible_page}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {animeList.length} anime
                </p>
              </div>
            )}

            {/* Anime Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {animeList.map((anime) => {
                const restructuredAnime = {
                  ...anime,
                  current_episode: anime.current_episode?.replace('Total', '').trim()
                }
                return <AnimeCard key={anime.slug} anime={restructuredAnime} />
              })}
            </div>

            {/* Pagination */}
            {pagination && (pagination.has_next_page || pagination.has_previous_page) && (
              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => pagination.previous_page && goToPage(pagination.previous_page)}
                  disabled={!pagination.has_previous_page || isLoading}
                  className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-400 dark:hover:border-blue-500 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
                </button>

                <div className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-800 dark:text-white">
                    <span className="text-blue-600 dark:text-blue-400">{pagination.current_page}</span>
                    <span className="text-gray-400 mx-1">/</span>
                    <span>{pagination.last_visible_page}</span>
                  </span>
                </div>

                <button
                  onClick={() => pagination.next_page && goToPage(pagination.next_page)}
                  disabled={!pagination.has_next_page || isLoading}
                  className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-400 dark:hover:border-blue-500 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <FontAwesomeIcon icon={faPlay} className="text-gray-400 text-2xl" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">Tidak ada anime ongoing</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(OngoingPage);
