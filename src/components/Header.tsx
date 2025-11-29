import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faBars, faXmark, faPlay } from '@fortawesome/free-solid-svg-icons';
import ThemeToggle from './ThemeToggle';
import SearchModal from './SearchModal';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/ongoing', label: 'Ongoing' },
  { href: '/complete', label: 'Complete' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/genres', label: 'Genres' },
  { href: '/movie', label: 'Movie' },
  { href: '/favorites', label: 'Favorites' },
  { href: '/author', label: 'Author' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false); // Close mobile menu after search

      // Remove focus from search input
      const searchInputs = document.querySelectorAll('input[type="text"]');
      searchInputs.forEach(input => (input as HTMLInputElement).blur());
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className="glass-effect-ultra sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 shadow-lg shadow-black/5 dark:shadow-black/20 transition-colors duration-300">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-orange-500/5 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 relative">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-gray-900 dark:text-white hover:text-yellow-400 transition-all duration-300 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
              <FontAwesomeIcon icon={faPlay} className="relative h-6 w-6 sm:h-7 sm:w-7 text-yellow-500 drop-shadow-glow group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-gray-900 via-purple-600 to-gray-900 dark:from-white dark:via-purple-300 dark:to-white bg-clip-text text-transparent group-hover:from-yellow-400 group-hover:via-orange-400 group-hover:to-yellow-400 transition-all duration-300">
              KanataAnimeV2
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = isActiveLink(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`relative px-3 py-1.5 text-sm lg:text-base transition-all duration-300 rounded-full group ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white shadow-md shadow-purple-500/30' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="relative z-10 font-medium">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-3">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 rounded-lg opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-300"></div>
                <input
                  type="text"
                  placeholder="Search anime..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="relative glass-effect-strong text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 pl-10 pr-3 py-2 w-40 lg:w-52 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 text-sm lg:text-base bg-gray-100/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-600"
                />
                <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400 group-focus-within:text-purple-400 transition-colors duration-300" />
              </div>
            </form>

            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden relative text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white h-9 w-9 sm:h-10 sm:w-10 transition-all duration-300 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700 hover:border-purple-500/50 hover:bg-purple-500/10"
              aria-label="Search"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile menu button */}
            <button
              ref={buttonRef}
              onClick={toggleMenu}
              className="md:hidden relative text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white h-9 w-9 sm:h-10 sm:w-10 transition-all duration-300 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700 hover:border-purple-500/50 hover:bg-purple-500/10 group overflow-hidden"
              aria-label="Toggle menu"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              {isMenuOpen ? <FontAwesomeIcon icon={faXmark} className="relative h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 rotate-0 hover:rotate-90" /> : <FontAwesomeIcon icon={faBars} className="relative h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div ref={menuRef} className="md:hidden pb-3 animate-in slide-in-from-top-2 duration-300">
            <div className="mt-2 rounded-lg bg-white/95 dark:bg-gray-900/95 border border-gray-200 dark:border-gray-700 shadow-2xl glass-effect-ultra">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-orange-500/5 rounded-lg pointer-events-none"></div>
              <div className="relative px-2 py-2 space-y-1">
                {navLinks.map((link, index) => {
                  const isActive = isActiveLink(link.href);
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`mobile-nav-link flex items-center px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white shadow-md shadow-purple-500/30'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {link.label}
                    </Link>
                  );
                })}

              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}

