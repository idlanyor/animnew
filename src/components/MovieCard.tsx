'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MovieItem } from '@/lib/api';

interface MovieCardProps {
  movie: MovieItem;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movie/${movie.slug}`} className="group block touch-manipulation">
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 active:scale-95">
        <div className="aspect-[2/3] sm:aspect-[3/4] relative overflow-hidden">
          <Image
            src={movie.poster && movie.poster.trim() !== ''
              ? movie.poster
              : `https://placehold.co/300x400/1a1a1a/ffffff?text=${encodeURIComponent(movie.title || 'Movie')}`}
            alt={movie.title || 'Movie'}
            fill
            unoptimized
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
          />
          <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-semibold">
            {movie.type}
          </div>

          {/* Display score if available */}
          {movie.score && (
            <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 bg-yellow-600 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-bold flex items-center gap-0.5 sm:gap-1">
              ⭐ {movie.score}
            </div>
          )}

          {/* Display status or duration */}
          <div className="absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2 bg-black bg-opacity-70 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs">
            {movie.status || movie.release || 'N/A'}
          </div>

          {movie.duration && (
            <div className="absolute bottom-1.5 sm:bottom-2 right-1.5 sm:right-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs">
              {movie.duration}
            </div>
          )}
        </div>
        <div className="p-2.5 sm:p-3 md:p-4">
          <h3 className="text-white font-semibold text-xs sm:text-sm mb-1.5 sm:mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors leading-tight">
            {movie.title}
          </h3>

          {/* Display synopsis if available, otherwise show genres */}
          {movie.synopsis ? (
            <p className="text-gray-400 text-[10px] sm:text-xs mb-1.5 sm:mb-2 line-clamp-2 sm:line-clamp-3 leading-snug">
              {movie.synopsis}
            </p>
          ) : movie.genreList && movie.genreList.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {movie.genreList.slice(0, 2).map((genre) => (
                <span key={genre.genreId} className="text-[9px] sm:text-xs bg-gray-700 text-gray-300 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                  {genre.title}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}