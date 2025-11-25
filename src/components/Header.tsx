'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, Menu, X, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/ongoing', label: 'Ongoing' },
  { href: '/complete', label: 'Complete' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/genres', label: 'Genres' },
  { href: '/movie', label: 'Movie' },
  { href: '/author', label: 'Author' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
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
    <header className="glass-header sticky top-0 z-50 shadow-2xl shadow-cyan-500/20 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-2.5 text-white hover:text-yellow-400 transition-all duration-300 group">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500 blur-lg opacity-0 group-hover:opacity-60 transition-all duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 blur-md opacity-20 animate-pulse"></div>
              <Play className="relative h-7 w-7 sm:h-9 sm:w-9 lg:h-10 lg:w-10 text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
            </div>
            <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]">
              KanataAnimeV2
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2 lg:space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3 py-2 text-sm lg:text-base text-gray-300 hover:text-white transition-all duration-300 group rounded-lg hover:bg-white/5"
              >
                <span className="relative z-10 font-medium">{link.label}</span>
                <span className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-blue-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg blur-sm"></div>
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <input
                type="text"
                placeholder="Search anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="relative glass-input text-white placeholder-gray-400 pl-11 pr-4 py-2.5 w-48 lg:w-64 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400/50 transition-all duration-300 hover:border-cyan-400/30 text-sm lg:text-base"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-cyan-400 transition-colors duration-300" />
            </div>
          </form>

          {/* Mobile menu button */}
          <button
            ref={buttonRef}
            onClick={toggleMenu}
            className="md:hidden relative text-gray-300 hover:text-white h-10 w-10 sm:h-11 sm:w-11 transition-all duration-300 rounded-lg flex items-center justify-center group overflow-hidden"
            aria-label="Toggle menu"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 border border-white/10 rounded-lg group-hover:border-cyan-400/50 transition-colors duration-300"></div>
            {isMenuOpen ? <X className="relative z-10 h-6 w-6 sm:h-6 sm:w-6" /> : <Menu className="relative z-10 h-6 w-6 sm:h-6 sm:w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div ref={menuRef} className="md:hidden pb-4 animate-in slide-in-from-top-2 duration-300">
            <div className="relative mt-3 rounded-xl overflow-hidden">
              {/* Glass background with gradient border */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5"></div>
              <div className="absolute inset-0 border border-white/10 rounded-xl"></div>

              <div className="relative px-3 py-3 space-y-1">
                {navLinks.map((link, index) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group relative flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-300 hover:text-white transition-all duration-300 overflow-hidden"
                    onClick={() => setIsMenuOpen(false)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 rounded-lg transition-colors duration-300"></div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-gradient-to-b from-cyan-400 via-blue-500 to-purple-500 group-hover:h-8 transition-all duration-300 rounded-r-full"></div>
                    <span className="relative z-10 ml-1">{link.label}</span>
                  </Link>
                ))}

                {/* Mobile Search */}
                <div className="pt-2 px-2">
                  <form onSubmit={handleSearch}>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <input
                        type="text"
                        placeholder="Search anime..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="relative w-full glass-input text-white placeholder-gray-400 rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400/50 transition-all duration-300 border border-white/10"
                      />
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-cyan-400 transition-colors duration-300" />
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

