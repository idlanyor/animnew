import { memo } from 'react';
import { Link } from 'react-router-dom';
import { MovieItem } from '@/lib/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faHeart as faHeartSolid, faPlay } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { useBookmarks } from '@/contexts/BookmarkContext';

interface MovieCardProps {
  movie: MovieItem;
}

function MovieCard({ movie }: MovieCardProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(movie.slug);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(movie, 'movie');
  };

  return (
    <Link to={`/movie/${movie.slug}`} className="group block">
      <div className="relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg dark:shadow-none transition-all duration-300 group-hover:border-purple-300 dark:group-hover:border-purple-700">
        {/* Image Container */}
        <div className="aspect-[2/3] relative overflow-hidden">
          <img
            src={movie.poster && movie.poster.trim() !== ''
              ? movie.poster
              : `https://placehold.co/300x400/1a1a1a/ffffff?text=${encodeURIComponent(movie.title || 'Movie')}`}
            alt={movie.title || 'Movie'}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

          {/* Play Icon on Hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <FontAwesomeIcon icon={faPlay} className="text-white text-lg ml-0.5" />
            </div>
          </div>

          {/* Type Badge */}
          <div className="absolute top-2 left-2 z-10">
            <span className="px-2 py-0.5 rounded-md bg-purple-500 text-white text-[10px] font-semibold">
              {movie.type}
            </span>
          </div>

          {/* Score Badge */}
          {movie.score && (
            <div className="absolute top-2 right-2 z-10">
              <span className="px-2 py-0.5 rounded-md bg-yellow-500 text-white text-[10px] font-semibold flex items-center gap-1">
                <FontAwesomeIcon icon={faStar} className="w-2.5 h-2.5" />
                {movie.score}
              </span>
            </div>
          )}

          {/* Bottom Info */}
          <div className="absolute bottom-0 left-0 right-0 p-2 z-10">
            <div className="flex items-center justify-between">
              {/* Status/Release */}
              <span className="px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-sm text-white text-[10px]">
                {movie.status || movie.release || 'Movie'}
              </span>
              
              {/* Duration */}
              {movie.duration && (
                <span className="px-2 py-0.5 rounded-md bg-orange-500/90 text-white text-[10px] font-medium">
                  {movie.duration}
                </span>
              )}
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={handleBookmarkClick}
            className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
            style={{ right: movie.score ? '3.5rem' : '0.5rem' }}
            aria-label={bookmarked ? 'Hapus dari favorit' : 'Tambah ke favorit'}
          >
            <FontAwesomeIcon
              icon={bookmarked ? faHeartSolid : faHeartRegular}
              className={`w-3.5 h-3.5 ${bookmarked ? 'text-red-500' : 'text-white'}`}
            />
          </button>
        </div>

        {/* Info Section */}
        <div className="p-2.5">
          <h3 className="font-semibold text-gray-800 dark:text-white text-xs sm:text-sm line-clamp-2 leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {movie.title}
          </h3>
          
          {/* Genres */}
          {movie.genreList && movie.genreList.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {movie.genreList.slice(0, 2).map((genre) => (
                <span
                  key={genre.genreId}
                  className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                >
                  {genre.title}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default memo(MovieCard, (prevProps, nextProps) => {
  return prevProps.movie.slug === nextProps.movie.slug;
});
