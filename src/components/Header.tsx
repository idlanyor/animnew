'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, Menu, X, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
    <>
      {/* Backdrop overlay for mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <header className="bg-gray-900 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors">
            <Play className="h-8 w-8 text-yellow-500" />
            <span className="text-xl font-bold">KanataAnimeV2</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/ongoing" className="text-gray-300 hover:text-white transition-colors">
              Ongoing
            </Link>
            <Link href="/complete" className="text-gray-300 hover:text-white transition-colors">
              Complete
            </Link>
            <Link href="/schedule" className="text-gray-300 hover:text-white transition-colors">
              Schedule
            </Link>
            <Link href="/genres" className="text-gray-300 hover:text-white transition-colors">
              Genres
            </Link>
            <Link href="/movie" className="text-gray-300 hover:text-white transition-colors">
              Movie
            </Link>
            <Link href="/author" className="text-gray-300 hover:text-white transition-colors">
              Author
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-800 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 w-64"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </form>

          {/* Mobile menu button */}
          <button
            ref={buttonRef}
            onClick={toggleMenu}
            className="md:hidden text-gray-300 hover:text-white transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div ref={menuRef} className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800 rounded-lg mt-2">
              <Link
                href="/"
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/ongoing"
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Ongoing
              </Link>
              <Link
                href="/complete"
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Complete
              </Link>
              <Link
                href="/schedule"
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Schedule
              </Link>
              <Link
                href="/genres"
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Genres
              </Link>
              <Link
                href="/movie"
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Movie
              </Link>
              <Link
                href="/author"
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Author
              </Link>
              
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="px-3 py-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search anime..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 w-full"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </header>
    </>
  );
}

