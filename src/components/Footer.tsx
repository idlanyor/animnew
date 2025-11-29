import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faHeart, faFilm, faArrowTrendUp, faCalendar, faStar } from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
  return (
    <footer className="relative bg-gray-100 dark:bg-gray-950 border-t border-gray-200 dark:border-white/10 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <div className="mb-4">
              <Link to="/" className="inline-flex items-center space-x-2 text-gray-900 dark:text-white hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                <FontAwesomeIcon icon={faPlay} className="h-8 w-8 text-cyan-500 dark:text-cyan-400" />
                <span className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                  KanataAnimeV2
                </span>
              </Link>
            </div>

            <div className="glass-card p-4 rounded-lg border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-transparent mb-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">
                Platform streaming anime terbaik dengan koleksi lengkap anime ongoing dan complete.
                Nikmati pengalaman menonton anime dengan kualitas HD dan subtitle Indonesia.
              </p>
              <div className="flex items-center text-gray-500 text-sm">
                <span>Made with</span>
                <FontAwesomeIcon icon={faHeart} className="h-3 w-3 mx-1.5 text-red-500" />
                <span>for anime lovers</span>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-2">
              <div className="glass-card p-3 rounded-lg border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-transparent hover:border-cyan-400/30 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-cyan-500/20">
                    <FontAwesomeIcon icon={faArrowTrendUp} className="text-cyan-500 dark:text-cyan-400 h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Ongoing</p>
                    <p className="text-gray-900 dark:text-white font-bold text-sm">1000+</p>
                  </div>
                </div>
              </div>
              <div className="glass-card p-3 rounded-lg border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-transparent hover:border-purple-400/30 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-purple-500/20">
                    <FontAwesomeIcon icon={faStar} className="text-purple-500 dark:text-purple-400 h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Complete</p>
                    <p className="text-gray-900 dark:text-white font-bold text-sm">5000+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="mb-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                Quick Links
              </h3>
              <div className="h-0.5 w-8 bg-cyan-500"></div>
            </div>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Home', icon: faFilm },
                { href: '/ongoing', label: 'Ongoing Anime', icon: faArrowTrendUp },
                { href: '/complete', label: 'Complete Anime', icon: faStar },
                { href: '/schedule', label: 'Schedule', icon: faCalendar },
                { href: '/movie', label: 'Movie', icon: faFilm },
                { href: '/genres', label: 'Genres', icon: faStar },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="group flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
                  >
                    <FontAwesomeIcon icon={link.icon} className="h-3 w-3" />
                    <span className="text-sm">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <div className="mb-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                Categories
              </h3>
              <div className="h-0.5 w-8 bg-blue-500"></div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { genre: 'action', label: 'Action', color: 'bg-red-500/20 hover:bg-red-500/30' },
                { genre: 'romance', label: 'Romance', color: 'bg-pink-500/20 hover:bg-pink-500/30' },
                { genre: 'comedy', label: 'Comedy', color: 'bg-yellow-500/20 hover:bg-yellow-500/30' },
                { genre: 'drama', label: 'Drama', color: 'bg-purple-500/20 hover:bg-purple-500/30' },
                { genre: 'fantasy', label: 'Fantasy', color: 'bg-cyan-500/20 hover:bg-cyan-500/30' },
                { genre: 'adventure', label: 'Adventure', color: 'bg-green-500/20 hover:bg-green-500/30' },
              ].map((category) => (
                <Link
                  key={category.genre}
                  to={`/genres?genre=${category.genre}`}
                  className={`${category.color} border border-gray-300 dark:border-white/10 px-2.5 py-1 rounded text-xs font-medium text-gray-700 dark:text-white transition-colors`}
                >
                  {category.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative">
          <div className="h-px bg-gray-200 dark:bg-white/10 mb-4"></div>
          <div className="glass-card p-4 rounded-lg border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-transparent">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                © 2025 <span className="text-cyan-500 dark:text-cyan-400 font-semibold">KanataAnimeV2</span>. All rights reserved.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 dark:text-gray-400 text-sm">Powered by</span>
                <div className="bg-cyan-500/20 border border-cyan-500/30 dark:border-cyan-400/30 px-2.5 py-0.5 rounded">
                  <span className="text-cyan-600 dark:text-cyan-400 text-sm font-semibold">Antidonasi Team</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

