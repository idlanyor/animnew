import { useState, useEffect, memo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchAnimeBySanka, AnimeItem } from '@/lib/api';
import AnimeCard from '@/components/AnimeCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faFilter, faXmark } from '@fortawesome/free-solid-svg-icons';

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [animeList, setAnimeList] = useState<AnimeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(query);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim() || searchTerm.trim().length < 2) {
      setAnimeList([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await searchAnimeBySanka(searchTerm.trim());
      setAnimeList(data);
    } catch (err) {
      setError('Gagal mencari anime');
      console.error('Error searching anime:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery && searchQuery.trim().length >= 2) {
        performSearch(searchQuery);
      } else if (!searchQuery.trim()) {
        setAnimeList([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
    }
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && searchQuery.trim().length >= 2) {
      performSearch(searchQuery);
    }
  };

  const popularSearches = ['Naruto', 'One Piece', 'Jujutsu Kaisen', 'Demon Slayer', 'Attack on Titan', 'Spy x Family'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Title */}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg shadow-purple-500/20">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                Cari Anime
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Temukan anime favoritmu
              </p>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Ketik minimal 2 karakter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3.5 pl-12 pr-12 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-base"
              />
              <FontAwesomeIcon 
                icon={faMagnifyingGlass} 
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${loading ? 'text-purple-500 animate-pulse' : 'text-gray-400'}`} 
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
                </button>
              )}
            </div>
            
            {/* Search Status */}
            <div className="mt-2 text-sm">
              {loading ? (
                <span className="text-purple-500">Mencari...</span>
              ) : searchQuery.length > 0 && searchQuery.length < 2 ? (
                <span className="text-gray-500 dark:text-gray-400">
                  Ketik {2 - searchQuery.length} karakter lagi...
                </span>
              ) : searchQuery && animeList.length > 0 ? (
                <span className="text-green-600 dark:text-green-400">
                  Ditemukan {animeList.length} anime
                </span>
              ) : null}
            </div>
          </form>

          {/* Popular Searches */}
          {!searchQuery && (
            <div className="mt-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Pencarian populer:</p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 border border-gray-200 dark:border-gray-700 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Error State */}
        {error && (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-red-500 text-2xl" />
            </div>
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => performSearch(searchQuery)}
              className="px-5 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full font-medium"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Mencari anime..." />
          </div>
        )}

        {/* Results */}
        {!loading && !error && searchQuery && animeList.length > 0 && (
          <div className="space-y-4">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faFilter} className="text-purple-500 w-4 h-4" />
                <h2 className="font-bold text-gray-800 dark:text-white">
                  Hasil untuk "{searchQuery}"
                </h2>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {animeList.length} anime
              </span>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {animeList.map((anime) => (
                <AnimeCard key={anime.slug} anime={anime} />
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && searchQuery && searchQuery.length >= 2 && animeList.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-400 text-3xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Tidak ditemukan
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Tidak ada anime yang cocok dengan "{searchQuery}"
            </p>
            <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <p>• Coba kata kunci yang berbeda</p>
              <p>• Periksa ejaan pencarian</p>
              <p>• Gunakan judul dalam bahasa Inggris atau Jepang</p>
            </div>
          </div>
        )}

        {/* Initial State */}
        {!loading && !error && !searchQuery && (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-purple-500 text-3xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Mulai Pencarian
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Ketik nama anime di kolom pencarian untuk menemukan anime favoritmu
            </p>
            <div className="inline-flex flex-col gap-2 text-sm text-gray-500 dark:text-gray-400 text-left">
              <p className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 text-xs">✓</span>
                Pencarian langsung saat mengetik
              </p>
              <p className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 text-xs">✓</span>
                Support judul Inggris & Jepang
              </p>
              <p className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 text-xs">✓</span>
                Anime ongoing & complete
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(SearchPage);
