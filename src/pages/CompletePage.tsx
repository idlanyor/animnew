import { useState, memo } from 'react';
import { useCompleteAnime } from '@/hooks/useAnimeQuery';
import AnimeCard from '@/components/AnimeCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faChevronRight, faChevronLeft, faFilm, faList, faStar } from '@fortawesome/free-solid-svg-icons';

function CompletePage() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = useCompleteAnime(currentPage);

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
        <LoadingSpinner size="lg" text="Memuat anime complete..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/20">
              <FontAwesomeIcon icon={faCheckCircle} className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                Anime Complete
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Anime yang sudah tamat, siap marathon
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {isError ? (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <p className="text-red-500 mb-4">Gagal memuat anime complete</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium"
            >
              Coba Lagi
            </button>
          </div>
        ) : animeList.length > 0 ? (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <FontAwesomeIcon icon={faFilm} className="text-green-500 w-5 h-5" />
                </div>
                <p className="text-xl font-bold text-gray-800 dark:text-white">{animeList.length}+</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Judul Tamat</p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <FontAwesomeIcon icon={faList} className="text-blue-500 w-5 h-5" />
                </div>
                <p className="text-xl font-bold text-gray-800 dark:text-white">Full</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Episode</p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <FontAwesomeIcon icon={faStar} className="text-yellow-500 w-5 h-5" />
                </div>
                <p className="text-xl font-bold text-gray-800 dark:text-white">HD</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Kualitas</p>
              </div>
            </div>

            {/* Page Info */}
            {pagination && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Halaman <span className="font-medium text-green-600 dark:text-green-400">{pagination.current_page}</span> dari {pagination.last_visible_page}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {animeList.length} anime
                </p>
              </div>
            )}

            {/* Anime Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {animeList.map((anime) => (
                <AnimeCard key={anime.slug} anime={anime} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && (pagination.has_next_page || pagination.has_previous_page) && (
              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => pagination.previous_page && goToPage(pagination.previous_page)}
                  disabled={!pagination.has_previous_page || isLoading}
                  className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-green-400 dark:hover:border-green-500 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
                </button>

                <div className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-800 dark:text-white">
                    <span className="text-green-600 dark:text-green-400">{pagination.current_page}</span>
                    <span className="text-gray-400 mx-1">/</span>
                    <span>{pagination.last_visible_page}</span>
                  </span>
                </div>

                <button
                  onClick={() => pagination.next_page && goToPage(pagination.next_page)}
                  disabled={!pagination.has_next_page || isLoading}
                  className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-green-400 dark:hover:border-green-500 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <FontAwesomeIcon icon={faCheckCircle} className="text-gray-400 text-2xl" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">Tidak ada anime complete</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(CompletePage);
