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
    <header className="glass-header sticky top-0 z-50 shadow-2xl shadow-cyan-500/10">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-1.5 sm:space-x-2 text-white hover:text-yellow-400 transition-all duration-300 group">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500 blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              <Play className="relative h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
            </div>
            <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text">
              KanataAnimeV2
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm lg:text-base text-gray-300 hover:text-white transition-all duration-300 group"
              >
                <span className="relative z-10">{link.label}</span>
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
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
                className="glass-input text-white placeholder-gray-400 pl-10 pr-4 w-48 lg:w-64 focus-visible:ring-2 focus-visible:ring-yellow-500/50 transition-all duration-300 hover:ring-1 hover:ring-cyan-500/30"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </form>

          {/* Mobile menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-white hover:bg-white/10 h-9 w-9 sm:h-10 sm:w-10 transition-all duration-300"
              >
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="glass-dark border-gray-700/50 text-white w-[280px] sm:w-[350px]">
              <SheetHeader className="border-b border-gray-700/50 pb-4">
                <SheetTitle className="text-white text-left flex items-center gap-2">
                  <div className="h-8 w-1 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
                  Menu
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300 py-3 px-4 rounded-lg group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="flex items-center gap-3">
                      <span className="h-1.5 w-1.5 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {link.label}
                    </span>
                  </Link>
                ))}

                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="pt-4 border-t border-gray-700/50">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search anime..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="glass-input text-white placeholder-gray-400 pl-10 pr-4 w-full focus-visible:ring-2 focus-visible:ring-yellow-500/50"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </form>
              </div>
            </SheetContent>
          </Sheet>
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

