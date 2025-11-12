'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchAnimeBySanka, AnimeItem } from '@/lib/api';
import AnimeCard from '@/components/AnimeCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Search } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [animeList, setAnimeList] = useState<AnimeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(query);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim() || searchTerm.trim().length < 3) {
      setAnimeList([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await searchAnimeBySanka(searchTerm.trim());
      setAnimeList(data);
    } catch (err) {
      setError('Failed to search anime');
      console.error('Error searching anime:', err);
    } finally {
      setLoading(false);
    }
  };

  // Debounce effect for live search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery && searchQuery.trim().length >= 3) {
        performSearch(searchQuery);
      } else if (!searchQuery.trim()) {
        setAnimeList([]);
      }
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
    }
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && searchQuery.trim().length >= 3) {
      performSearch(searchQuery);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Search className="text-pink-200" size={48} />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Search Anime
              </h1>
            </div>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="Type at least 3 characters to search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-lg pl-12 pr-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500 border border-pink-400/30 shadow-lg shadow-pink-500/20"
                />
                <Search className={`absolute left-4 top-4 h-6 w-6 ${loading ? 'text-pink-400 animate-pulse' : 'text-gray-400'}`} />
              </div>
              <p className="text-gray-400 text-sm mb-6 text-center">
                {loading ? (
                  <span className="text-pink-400 animate-pulse">Searching...</span>
                ) : searchQuery.length > 0 && searchQuery.length < 3 ? (
                  `Type ${3 - searchQuery.length} more character${3 - searchQuery.length > 1 ? 's' : ''} to start searching...`
                ) : (
                  'Live search - results appear as you type'
                )}
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <Search className="mx-auto mb-2" size={48} />
              <p className="text-lg font-semibold">{error}</p>
            </div>
            <button
              onClick={() => performSearch(searchQuery)}
              className="bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all border border-pink-400/30 shadow-lg shadow-pink-500/20"
            >
              Try Again
            </button>
          </div>
        ) : searchQuery && animeList.length > 0 ? (
          <>
            {/* Results Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Search Results for &quot;{searchQuery}&quot;
              </h2>
              <p className="text-gray-400">
                Found {animeList.length} anime{animeList.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {animeList.map((anime) => (
                <AnimeCard key={anime.slug} anime={anime} />
              ))}
            </div>
          </>
        ) : searchQuery ? (
          <div className="text-center py-12">
            <Search className="text-gray-500 mx-auto mb-4" size={64} />
            <h2 className="text-xl font-semibold text-white mb-2">
              No results found for &quot;{searchQuery}&quot;
            </h2>
            <p className="text-gray-400 mb-6">
              Try searching with different keywords or check your spelling.
            </p>
            <div className="space-y-2 text-gray-400 text-sm">
              <p>• Try using different keywords</p>
              <p>• Check for typos in your search</p>
              <p>• Use the English or Japanese title</p>
              <p>• Try searching for the genre instead</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="text-gray-500 mx-auto mb-4" size={64} />
            <h2 className="text-xl font-semibold text-white mb-2">
              Live Search Ready
            </h2>
            <p className="text-gray-400 mb-4">
              Type at least 3 characters in the search box above to find your favorite anime.
            </p>
            <div className="space-y-2 text-gray-400 text-sm">
              <p>• Search updates automatically as you type</p>
              <p>• Works with both English and Japanese titles</p>
              <p>• Shows both ongoing and completed anime</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoadingSpinner size="lg" text="Loading search..." />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}

