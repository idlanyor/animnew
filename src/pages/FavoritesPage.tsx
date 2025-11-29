import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBookmarks } from '@/contexts/BookmarkContext';
import { useWatchHistory, formatWatchTime, formatRelativeTime } from '@/contexts/WatchHistoryContext';
import { BookmarkItem } from '@/lib/bookmarks';
import AnimeCard from '@/components/AnimeCard';
import MovieCard from '@/components/MovieCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTrash, faFilm, faTv, faHistory, faPlay, faXmark, faClock } from '@fortawesome/free-solid-svg-icons';
import { AnimeItem, MovieItem } from '@/lib/api';

export default function FavoritesPage() {
  const { bookmarks, clearAll, refreshBookmarks } = useBookmarks();
  const { history, removeFromHistory, clearHistory } = useWatchHistory();
  const [activeTab, setActiveTab] = useState<'all' | 'anime' | 'movie' | 'history'>('all');

  useEffect(() => {
    refreshBookmarks();
  }, []);

  const animeBookmarks = bookmarks.filter(b => b.type === 'anime');
  const movieBookmarks = bookmarks.filter(b => b.type === 'movie');

  const getDisplayedBookmarks = (): BookmarkItem[] => {
    switch (activeTab) {
      case 'anime':
        return animeBookmarks;
      case 'movie':
        return movieBookmarks;
      default:
        return bookmarks;
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus semua bookmark?')) {
      clearAll();
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus semua riwayat?')) {
      clearHistory();
    }
  };

  const displayedBookmarks = getDisplayedBookmarks();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 shadow-lg shadow-red-500/20">
                <FontAwesomeIcon icon={faHeart} className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                  Koleksi Saya
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {bookmarks.length} bookmark • {history.length} riwayat
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Semua ({bookmarks.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <FontAwesomeIcon icon={faHistory} className="w-4 h-4" />
              Riwayat ({history.length})
            </button>
            <button
              onClick={() => setActiveTab('anime')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === 'anime'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <FontAwesomeIcon icon={faTv} className="w-4 h-4" />
              Anime ({animeBookmarks.length})
            </button>
            <button
              onClick={() => setActiveTab('movie')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === 'movie'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <FontAwesomeIcon icon={faFilm} className="w-4 h-4" />
              Movie ({movieBookmarks.length})
            </button>
          </div>
        </div>

        {/* Watch History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {/* History Header */}
            {history.length > 0 && (
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                  Lanjutkan Menonton
                </h2>
                <button
                  onClick={handleClearHistory}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full transition-colors"
                >
                  <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                  Hapus Semua
                </button>
              </div>
            )}

            {/* History Grid */}
            {history.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <FontAwesomeIcon icon={faHistory} className="text-gray-400 text-3xl" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  Belum ada riwayat
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Anime yang kamu tonton akan muncul di sini
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {history.map((item) => (
                  <div
                    key={item.episodeSlug}
                    className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden group hover:border-purple-500/50 transition-colors"
                  >
                    <div className="flex gap-3 p-3">
                      {/* Thumbnail */}
                      <Link
                        to={item.type === 'anime' ? `/episode/${item.episodeSlug}` : `/movie/watch/${item.episodeSlug}`}
                        className=""
                      >
                        {/* Progress bar */}
                        {item.progress && item.duration && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800/60">
                            <div
                              className="h-full bg-purple-500"
                              style={{ width: `${Math.min((item.progress / item.duration) * 100, 100)}%` }}
                            />
                          </div>
                        )}
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0 flex flex-col">
                        <Link
                          to={item.type === 'anime' ? `/episode/${item.episodeSlug}` : `/movie/watch/${item.episodeSlug}`}
                          className="font-medium text-gray-800 dark:text-white hover:text-purple-500 dark:hover:text-purple-400 line-clamp-2 text-sm"
                        >
                          {item.title}
                        </Link>
                        
                        {item.episode && (
                          <span className="text-xs text-purple-500 mt-1">
                            {item.episode}
                          </span>
                        )}

                        <div className="mt-auto pt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
                          {item.progress ? (
                            <span>
                              {formatWatchTime(item.progress)}
                              {item.duration && ` / ${formatWatchTime(item.duration)}`}
                            </span>
                          ) : (
                            <span>{formatRelativeTime(item.watchedAt)}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <Link
                            to={item.type === 'anime' ? `/episode/${item.episodeSlug}` : `/movie/watch/${item.episodeSlug}`}
                            className="flex-1 px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white text-xs font-medium rounded-full text-center transition-colors"
                          >
                            {item.progress ? 'Lanjut' : 'Tonton'}
                          </Link>
                          <button
                            onClick={() => removeFromHistory(item.episodeSlug!)}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bookmarks Content */}
        {activeTab !== 'history' && (
          <>
            {displayedBookmarks.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <FontAwesomeIcon icon={faHeart} className="text-gray-400 text-3xl" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {activeTab === 'all'
                    ? 'Belum ada bookmark'
                    : activeTab === 'anime'
                    ? 'Belum ada anime'
                    : 'Belum ada movie'}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Klik ikon hati pada anime atau movie untuk menyimpannya
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Header with clear button */}
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                    {activeTab === 'all' ? 'Semua Bookmark' : activeTab === 'anime' ? 'Anime' : 'Movie'}
                  </h2>
                  <button
                    onClick={handleClearAll}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full transition-colors"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                    Hapus Semua
                  </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {displayedBookmarks.map((bookmark) => (
                    <div key={bookmark.id}>
                      {bookmark.type === 'anime' ? (
                        <AnimeCard anime={bookmark.data as AnimeItem} />
                      ) : (
                        <MovieCard movie={bookmark.data as MovieItem} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
