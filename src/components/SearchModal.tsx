import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faXmark, faSpinner, faPlay, faFilm } from '@fortawesome/free-solid-svg-icons';
import { searchAnimeBySanka, AnimeItem } from '@/lib/api';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AnimeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setHasSearched(true);
      try {
        const data = await searchAnimeBySanka(query);
        setResults(data.slice(0, 8)); // Limit to 8 results
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      handleClose();
    }
  };

  const handleClose = useCallback(() => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
    onClose();
  }, [onClose]);

  const handleResultClick = () => {
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
        onTouchEnd={handleClose}
      />

      {/* Modal */}
      <div className="relative flex flex-col items-center pt-[8vh] sm:pt-[10vh] px-4 pointer-events-none">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in slide-in-from-top-4 duration-300 pointer-events-auto">
          {/* Search Input */}
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-center border-b border-gray-200 dark:border-gray-700">
              <FontAwesomeIcon 
                icon={faMagnifyingGlass} 
                className="ml-4 text-gray-400 w-5 h-5" 
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari anime..."
                className="flex-1 px-4 py-4 text-base sm:text-lg bg-transparent text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none"
              />
              {loading ? (
                <FontAwesomeIcon 
                  icon={faSpinner} 
                  className="mr-2 text-purple-500 w-5 h-5 animate-spin" 
                />
              ) : query ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="mr-2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
                </button>
              ) : null}
              {/* Close button for mobile */}
              <button
                type="button"
                onClick={handleClose}
                className="mr-3 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-full"
              >
                Tutup
              </button>
            </div>
          </form>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {/* Loading State */}
            {loading && (
              <div className="p-8 text-center">
                <FontAwesomeIcon icon={faSpinner} className="text-purple-500 w-8 h-8 animate-spin mb-3" />
                <p className="text-gray-500 dark:text-gray-400">Mencari...</p>
              </div>
            )}

            {/* Results List */}
            {!loading && results.length > 0 && (
              <div className="py-2">
                <p className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Hasil Pencarian
                </p>
                {results.map((anime) => (
                  <Link
                    key={anime.slug}
                    to={`/anime/${anime.slug}`}
                    onClick={handleResultClick}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="w-12 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                      <img
                        src={anime.gambar}
                        alt={anime.judul}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-800 dark:text-white truncate">
                        {anime.judul}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        {anime.current_episode && (
                          <span className="text-xs px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                            {anime.current_episode}
                          </span>
                        )}
                        {anime.rating && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ⭐ {anime.rating}
                          </span>
                        )}
                      </div>
                    </div>
                    <FontAwesomeIcon icon={faPlay} className="text-gray-400 w-4 h-4" />
                  </Link>
                ))}

                {/* View All Results */}
                <button
                  onClick={handleSubmit}
                  className="w-full px-4 py-3 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 font-medium transition-colors"
                >
                  Lihat semua hasil untuk "{query}"
                </button>
              </div>
            )}

            {/* No Results */}
            {!loading && hasSearched && results.length === 0 && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-400 w-6 h-6" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">Tidak ditemukan</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
                  Coba kata kunci lain
                </p>
              </div>
            )}

            {/* Initial State */}
            {!loading && !hasSearched && (
              <div className="p-6">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                  Pencarian Cepat
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Naruto', 'One Piece', 'Jujutsu', 'Demon Slayer', 'Attack on Titan'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px]">ESC</kbd>
                tutup
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px]">↵</kbd>
                cari
              </span>
            </div>
            <span>Powered by KanataAnime</span>
          </div>
        </div>
      </div>
    </div>
  );
}
