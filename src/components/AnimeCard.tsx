import { memo } from 'react';
import { Link } from 'react-router-dom';
import { AnimeItem } from '@/lib/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faPlay, faCalendar, faClock, faBolt, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { useBookmarks } from '@/contexts/BookmarkContext';

interface AnimeCardProps {
  anime: AnimeItem;
}

function AnimeCard({ anime }: AnimeCardProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(anime.slug);

  // Check if this is ongoing or complete anime based on available fields
  const isOngoing = anime.current_episode && anime.release_day;
  const isComplete = anime.episode_count && anime.rating;

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(anime, 'anime');
  };

  return (
    <Link to={`/anime/${anime.slug}`} className="group block">
      <div className="relative overflow-hidden transition-transform duration-300 group-hover:scale-[1.03]">
        <div className="relative bg-white dark:bg-gray-900 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 group-hover:border-purple-400 dark:group-hover:border-purple-600 shadow-md dark:shadow-sm group-hover:shadow-xl dark:group-hover:shadow-2xl transition-all duration-300">
          {/* Image section */}
          <div className="relative aspect-[3/4] overflow-hidden">
            <img
              src={anime.gambar}
              alt={anime.judul}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
              style={{ contentVisibility: 'auto' }}
            />

            {/* Gradient overlay for readable info */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

            {/* Play button overlay - softened */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <div className="bg-white/95 p-3 rounded-full shadow-md">
                  <FontAwesomeIcon icon={faPlay} className="text-gray-900 text-[22px]" />
                </div>
              </div>
            </div>

            {/* Rating badge for complete anime */}
            {isComplete && anime.rating && (
              <div className="absolute top-3 left-3 z-20">
                <div className="bg-green-400/95 border border-green-500 text-[11px] px-2.5 py-0.5 rounded-xl font-semibold flex items-center gap-2 shadow-sm">
                  <span className="text-black font-bold text-xs">{anime.episode_count} Eps</span>
                </div>
              </div>
            )}
            {isComplete && anime.rating && (
              <div className="absolute top-3 right-3 z-20">
                <div className="bg-yellow-400/95 border border-yellow-500 text-[11px] px-2.5 py-0.5 rounded-xl font-semibold flex items-center gap-2 shadow-sm">
                  <FontAwesomeIcon icon={faStar} className="text-black text-[11px]" />
                  <span className="text-black font-bold text-xs">{anime.rating}</span>
                </div>
              </div>
            )}

            {/* Status indicator for ongoing */}
            {isOngoing && (
              <>
                <div className="absolute top-3 left-3 z-20">
                  <div className="bg-purple-600/95 text-[11px] px-2.5 py-0.5 rounded-xl font-semibold flex items-center gap-2 shadow-sm animate-pulse">
                    <FontAwesomeIcon icon={faBolt} className="text-yellow-300 text-[11px]" />
                    <span className="text-white font-bold text-xs">NEW</span>
                  </div>
                </div>
                <div className="absolute top-3 right-3 z-20">
                  <div className="bg-pink-600/95 text-[11px] px-2.5 py-0.5 rounded-xl font-semibold flex items-center gap-2 shadow-sm">
                    <FontAwesomeIcon icon={faCalendar} className="text-[11px]" />
                    <span className="text-white font-bold text-xs">{anime.release_day}</span>
                  </div>
                </div>
              </>
            )}

            {/* Bookmark button */}
            <button
              onClick={handleBookmarkClick}
              className="absolute bottom-3 right-3 z-20 bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/10 p-2.5 rounded-full transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-400"
              aria-label={bookmarked ? 'Remove from favorites' : 'Add to favorites'}
            >
              <FontAwesomeIcon
                icon={bookmarked ? faHeartSolid : faHeartRegular}
                className={`h-4 w-4 ${bookmarked ? 'text-rose-500' : 'text-white'}`}
              />
            </button>
          </div>

          {/* Info section - glass effect */}
          <div className="relative p-3 sm:p-4 bg-white/95 dark:bg-gray-900/95 border-t border-gray-200 dark:border-gray-700 backdrop-blur-sm">
            {/* Title */}
            <h3
              className="text-gray-800 dark:text-white font-semibold text-sm sm:text-base mb-1 line-clamp-2 leading-tight"
              title={anime.judul}
            >
              {(anime.judul ?? '').length > 10 ? `${anime.judul.slice(0, 15)}...` : anime.judul}
            </h3>

            {/* Info badges */}
            <div className="space-y-2">
              {/* Ongoing Anime Info */}
              {isOngoing && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-1">
                  <div className="bg-purple-600 dark:bg-purple-700/95 text-[11px] sm:text-xs px-2 py-0.5 inline-flex items-center rounded-full font-medium shadow-sm">
                    <span className="text-white text-xs">{anime.current_episode?.replace('Episode ', 'Eps ')}</span>
                  </div>
                  {anime.newest_release_date && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-[11px] sm:text-sm">
                      <FontAwesomeIcon icon={faClock} className="text-[12px]" />
                      <span className="truncate">{anime.newest_release_date}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Complete Anime Info */}
              {isComplete && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-1">
                  {anime.last_release_date && (
                    <div className="flex items-center bg-teal-500 dark:bg-teal-400 hover:bg-teal-600 dark:hover:bg-teal-500 gap-2 text-white dark:text-black rounded-lg p-2 text-[11px] sm:text-sm shadow-sm">
                      <FontAwesomeIcon icon={faClock} className="text-[12px]" />
                      <span className="truncate">Tamat: {anime.last_release_date}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Fallback for old format */}
              {!isOngoing && !isComplete && anime.eps && anime.eps.length > 0 && (
                <div className="bg-pink-600 dark:bg-pink-700/95 text-[11px] sm:text-xs px-2 py-0.5 inline-flex items-center rounded-full font-medium shadow-sm">
                  <span className="text-white text-xs">{anime.eps[0]}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Memoize component to prevent unnecessary re-renders
export default memo(AnimeCard, (prevProps, nextProps) => {
  // Only re-render if anime slug, title, or image changes
  return (
    prevProps.anime.slug === nextProps.anime.slug &&
    prevProps.anime.judul === nextProps.anime.judul &&
    prevProps.anime.gambar === nextProps.anime.gambar
  );
});
