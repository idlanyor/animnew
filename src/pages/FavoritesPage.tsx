import { useState, useEffect } from 'react';
import { useBookmarks } from '@/contexts/BookmarkContext';
import { BookmarkItem } from '@/lib/bookmarks';
import AnimeCard from '@/components/AnimeCard';
import MovieCard from '@/components/MovieCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTrash, faFilm, faTv } from '@fortawesome/free-solid-svg-icons';
import { AnimeItem, MovieItem } from '@/lib/api';

export default function FavoritesPage() {
  const { bookmarks, clearAll, refreshBookmarks } = useBookmarks();
  const [activeTab, setActiveTab] = useState<'all' | 'anime' | 'movie'>('all');

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

  const displayedBookmarks = getDisplayedBookmarks();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faHeart} className="h-8 w-8 text-red-500" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Favorites
              </h1>
            </div>
            {bookmarks.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}
          </div>
          <p className="text-gray-400 text-sm md:text-base">
            Total: {bookmarks.length} bookmark{bookmarks.length !== 1 ? 's' : ''}
            {animeBookmarks.length > 0 && ` • ${animeBookmarks.length} anime`}
            {movieBookmarks.length > 0 && ` • ${movieBookmarks.length} movie${movieBookmarks.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-800 pb-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-t-lg font-medium transition-colors duration-200 ${
              activeTab === 'all'
                ? 'bg-gray-800 text-white border-b-2 border-cyan-500'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            Semua ({bookmarks.length})
          </button>
          <button
            onClick={() => setActiveTab('anime')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors duration-200 ${
              activeTab === 'anime'
                ? 'bg-gray-800 text-white border-b-2 border-cyan-500'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <FontAwesomeIcon icon={faTv} className="h-4 w-4" />
            Anime ({animeBookmarks.length})
          </button>
          <button
            onClick={() => setActiveTab('movie')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors duration-200 ${
              activeTab === 'movie'
                ? 'bg-gray-800 text-white border-b-2 border-cyan-500'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <FontAwesomeIcon icon={faFilm} className="h-4 w-4" />
            Movies ({movieBookmarks.length})
          </button>
        </div>

        {/* Content */}
        {displayedBookmarks.length === 0 ? (
          <div className="text-center py-20">
            <FontAwesomeIcon icon={faHeart} className="h-20 w-20 text-gray-700 mb-4" />
            <h2 className="text-2xl font-bold text-gray-500 mb-2">
              {activeTab === 'all'
                ? 'Belum ada bookmark'
                : activeTab === 'anime'
                ? 'Belum ada anime di favorites'
                : 'Belum ada movie di favorites'}
            </h2>
            <p className="text-gray-600">
              Klik ikon hati pada anime atau movie untuk menambahkannya ke favorites
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
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
        )}
      </div>
    </div>
  );
}
