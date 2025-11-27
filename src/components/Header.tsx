import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faBars, faXmark, faPlay } from '@fortawesome/free-solid-svg-icons';

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
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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
    <header className="glass-header sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors duration-300 group">
            <FontAwesomeIcon icon={faPlay} className="h-6 w-6 sm:h-7 sm:w-7 text-yellow-500" />
            <span className="text-base sm:text-lg lg:text-xl font-bold text-white">
              KanataAnimeV2
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="relative px-2 py-1.5 text-sm lg:text-base text-gray-300 hover:text-white transition-colors duration-300 rounded-lg hover:bg-white/5"
              >
                <span className="relative z-10 font-medium">{link.label}</span>
                <span className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input text-white placeholder-gray-400 pl-10 pr-3 py-2 w-40 lg:w-52 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all duration-300 text-sm lg:text-base"
              />
              <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </form>

          {/* Mobile menu button */}
          <button
            ref={buttonRef}
            onClick={toggleMenu}
            className="md:hidden text-gray-300 hover:text-white h-9 w-9 sm:h-10 sm:w-10 transition-colors duration-300 rounded-lg flex items-center justify-center border border-white/10 hover:border-white/20"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FontAwesomeIcon icon={faXmark} className="h-5 w-5 sm:h-6 sm:w-6" /> : <FontAwesomeIcon icon={faBars} className="h-5 w-5 sm:h-6 sm:w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div ref={menuRef} className="md:hidden pb-3 animate-in slide-in-from-top-2 duration-300">
            <div className="mt-2 rounded-lg bg-gray-900/95 border border-white/10">
              <div className="px-2 py-2 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300 hover:bg-white/5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{link.label}</span>
                  </Link>
                ))}

                {/* Mobile Search */}
                <div className="pt-1 px-2">
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search anime..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full glass-input text-white placeholder-gray-400 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all duration-300 border border-white/10"
                      />
                      <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

