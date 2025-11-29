import { Link, useLocation } from 'react-router-dom';
import { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faPlay,
  faHeart,
  faCheck,
  faFilm
} from '@fortawesome/free-solid-svg-icons';

const bottomNavItems = [
  { href: '/', label: 'Home', icon: faHome },
  { href: '/ongoing', label: 'Ongoing', icon: faPlay },
  { href: '/favorites', label: 'Favorit', icon: faHeart },
  { href: '/complete', label: 'Complete', icon: faCheck },
  { href: '/movie', label: 'Movie', icon: faFilm },
];

function BottomNavigation() {
  const location = useLocation();

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="fixed z-50 w-full max-w-lg -translate-x-1/2 bottom-4 left-1/2 md:hidden px-4">
      <nav className="h-[72px] bg-white/95 dark:bg-gray-900/95 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-2xl backdrop-blur-lg transition-colors duration-300">
        <div className="grid h-full max-w-lg grid-cols-5 mx-auto items-center">
          {bottomNavItems.map((item) => {
            const isActive = isActiveLink(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                className="flex flex-col items-center justify-center gap-1 py-2"
              >
                <div
                  className={`inline-flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 shadow-md shadow-purple-500/30'
                      : 'w-9 h-9 rounded-full'
                  }`}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className={`transition-all duration-300 ${
                      isActive
                        ? 'w-4 h-4 text-white'
                        : 'w-4 h-4 text-gray-500 dark:text-gray-400'
                    }`}
                  />
                </div>
                <span
                  className={`text-[10px] font-medium transition-colors duration-300 ${
                    isActive
                      ? 'text-purple-600 dark:text-purple-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default memo(BottomNavigation);
