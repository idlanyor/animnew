import { Link } from 'react-router-dom';
import { AnimeItem } from '@/lib/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faPlay, faCalendar, faClock, faBolt, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { useBookmarks } from '@/contexts/BookmarkContext';

interface AnimeCardProps {
  anime: AnimeItem;
}

export default function AnimeCard({ anime }: AnimeCardProps) {
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
      <div className="relative overflow-hidden rounded-lg transition-transform duration-200 group-hover:scale-[1.02]">
        <div className="relative bg-gray-900 overflow-hidden rounded-lg border border-gray-800 group-hover:border-gray-700 transition-colors duration-200">
          {/* Image section */}
          <div className="relative aspect-[3/4] overflow-hidden">
            <img
              src={anime.gambar}
              alt={anime.judul}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Simple gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

            {/* Simple play button overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center z-10">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-white/90 p-3 rounded-full">
                  <FontAwesomeIcon icon={faPlay} className="text-gray-900 text-[24px]" />
                </div>
              </div>
            </div>

            {/* Rating badge for complete anime */}
            {isComplete && anime.rating && (
              <div className="absolute top-2 right-2 z-20">
                <div className="bg-yellow-500 border border-yellow-600 text-[10px] sm:text-xs px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                  <FontAwesomeIcon icon={faStar} className="text-white text-[10px]" />
                  <span className="text-white font-bold">{anime.rating}</span>
                </div>
              </div>
            )}

            {/* Status indicator for ongoing */}
            {isOngoing && (
              <div className="absolute top-2 left-2 z-20">
                <div className="bg-cyan-600 border border-cyan-700 text-[10px] sm:text-xs px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                  <FontAwesomeIcon icon={faBolt} className="text-yellow-300 text-[10px]" />
                  <span className="text-white font-bold">LIVE</span>
                </div>
              </div>
            )}

            {/* Bookmark button */}
            <button
              onClick={handleBookmarkClick}
              className="absolute bottom-2 right-2 z-20 bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-white/20 p-2 rounded-full transition-all duration-200 hover:scale-110"
              aria-label={bookmarked ? 'Remove from favorites' : 'Add to favorites'}
            >
              <FontAwesomeIcon
                icon={bookmarked ? faHeartSolid : faHeartRegular}
                className={`h-4 w-4 ${bookmarked ? 'text-red-500' : 'text-white'}`}
              />
            </button>
          </div>

          {/* Info section */}
          <div className="relative p-2 sm:p-3 bg-gray-900 border-t border-gray-800">
            {/* Title */}
            <h3 className="text-white font-semibold text-xs sm:text-sm mb-1.5 line-clamp-2 leading-tight">
              {anime.judul}
            </h3>

            {/* Info badges */}
            <div className="space-y-1">
              {/* Ongoing Anime Info */}
              {isOngoing && (
                <div className="space-y-1">
                  <div className="bg-cyan-700 text-[10px] sm:text-xs px-1.5 py-0.5 inline-flex items-center rounded font-medium">
                    <span className="text-white">{anime.current_episode}</span>
                  </div>
                  <div className="flex items-center gap-1 text-cyan-400 text-[10px] sm:text-xs">
                    <FontAwesomeIcon icon={faCalendar} className="text-[10px]" />
                    <span className="truncate">{anime.release_day}</span>
                  </div>
                  {anime.newest_release_date && (
                    <div className="flex items-center gap-1 text-gray-400 text-[10px] sm:text-xs">
                      <FontAwesomeIcon icon={faClock} className="text-[10px]" />
                      <span className="truncate">{anime.newest_release_date}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Complete Anime Info */}
              {isComplete && (
                <div className="space-y-1">
                  <div className="bg-emerald-700 text-[10px] sm:text-xs px-1.5 py-0.5 inline-flex items-center rounded font-medium">
                    <span className="text-white">{anime.episode_count} EP</span>
                  </div>
                  {anime.last_release_date && (
                    <div className="flex items-center gap-1 text-gray-400 text-[10px] sm:text-xs">
                      <FontAwesomeIcon icon={faClock} className="text-[10px]" />
                      <span className="truncate">Selesai: {anime.last_release_date}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Fallback for old format */}
              {!isOngoing && !isComplete && anime.eps && anime.eps.length > 0 && (
                <div className="bg-blue-700 text-[10px] sm:text-xs px-1.5 py-0.5 inline-flex items-center rounded font-medium">
                  <span className="text-white">{anime.eps[0]}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
