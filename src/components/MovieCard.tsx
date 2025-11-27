import { Link } from 'react-router-dom';
import { MovieItem } from '@/lib/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { useBookmarks } from '@/contexts/BookmarkContext';

interface MovieCardProps {
  movie: MovieItem;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(movie.slug);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(movie, 'movie');
  };
  return (
    <Link to={`/movie/${movie.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-lg transition-transform duration-200 group-hover:scale-[1.02]">
        <div className="relative bg-gray-900 overflow-hidden rounded-lg border border-gray-800 group-hover:border-gray-700 transition-colors duration-200">
          <div className="aspect-[2/3] sm:aspect-[3/4] relative overflow-hidden">
            <img
              src={movie.poster && movie.poster.trim() !== ''
                ? movie.poster
                : `https://placehold.co/300x400/1a1a1a/ffffff?text=${encodeURIComponent(movie.title || 'Movie')}`}
              alt={movie.title || 'Movie'}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Simple gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

            {/* Type Badge */}
            <div className="absolute top-2 left-2 z-20">
              <div className="bg-blue-600 border border-blue-700 text-[10px] sm:text-xs px-2 py-0.5 rounded font-semibold">
                {movie.type}
              </div>
            </div>

            {/* Score Badge */}
            {movie.score && (
              <div className="absolute top-2 right-2 z-20">
                <div className="bg-yellow-500 border border-yellow-600 text-[10px] sm:text-xs px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                  <FontAwesomeIcon icon={faStar} className="h-3 w-3 text-white" />
                  <span className="text-white">{movie.score}</span>
                </div>
              </div>
            )}

            {/* Status Badge */}
            <div className="absolute bottom-2 left-2 z-20">
              <div className="bg-gray-800 border border-gray-700 text-[10px] sm:text-xs px-2 py-0.5 rounded">
                {movie.status || movie.release || 'N/A'}
              </div>
            </div>

            {/* Duration Badge */}
            {movie.duration && (
              <div className="absolute bottom-2 right-2 z-20">
                <div className="bg-orange-600 border border-orange-700 text-[10px] sm:text-xs px-2 py-0.5 rounded font-semibold">
                  {movie.duration}
                </div>
              </div>
            )}

            {/* Bookmark button */}
            <button
              onClick={handleBookmarkClick}
              className="absolute top-2 left-2 z-20 bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-white/20 p-2 rounded-full transition-all duration-200 hover:scale-110"
              aria-label={bookmarked ? 'Remove from favorites' : 'Add to favorites'}
            >
              <FontAwesomeIcon
                icon={bookmarked ? faHeartSolid : faHeartRegular}
                className={`h-4 w-4 ${bookmarked ? 'text-red-500' : 'text-white'}`}
              />
            </button>
          </div>

          {/* Info Section */}
          <div className="relative p-2 sm:p-3 bg-gray-900 border-t border-gray-800">
            <h3 className="text-white font-semibold text-xs sm:text-sm mb-1.5 line-clamp-2 leading-tight">
              {movie.title}
            </h3>

            {/* Synopsis or Genres */}
            {movie.synopsis ? (
              <p className="text-gray-400 text-[10px] sm:text-xs mb-1 line-clamp-2 leading-relaxed">
                {movie.synopsis}
              </p>
            ) : movie.genreList && movie.genreList.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {movie.genreList.slice(0, 2).map((genre) => (
                  <span
                    key={genre.genreId}
                    className="bg-gray-800 border border-gray-700 text-[9px] sm:text-[10px] text-gray-300 px-1.5 py-0.5 rounded"
                  >
                    {genre.title}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}
