'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MovieItem } from '@/lib/api';
import { Star } from 'lucide-react';

interface MovieCardProps {
  movie: MovieItem;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movie/${movie.slug}`} className="group block touch-manipulation">
      <div className="relative overflow-hidden rounded-xl transition-all duration-500 group-hover:scale-[1.02] sm:group-hover:scale-105 active:scale-[0.98]">
        {/* Enhanced glow effects */}
        <div className="absolute -inset-0.5 bg-gradient-to-br from-cyan-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-cyan-500/30 group-hover:via-blue-500/30 group-hover:to-purple-500/30 rounded-xl blur-lg transition-all duration-500 opacity-0 group-hover:opacity-100"></div>

        <div className="relative glass-card overflow-hidden rounded-xl border border-white/10 group-hover:border-white/20 transition-all duration-500 shadow-2xl">
          {/* Inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>

          <div className="aspect-[2/3] sm:aspect-[3/4] relative overflow-hidden">
            <Image
              src={movie.poster && movie.poster.trim() !== ''
                ? movie.poster
                : `https://placehold.co/300x400/1a1a1a/ffffff?text=${encodeURIComponent(movie.title || 'Movie')}`}
              alt={movie.title || 'Movie'}
              fill
              unoptimized
              className="object-cover group-hover:scale-110 group-hover:brightness-110 transition-all duration-700"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
            />

            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            {/* Type Badge */}
            <div className="absolute top-2 left-2 z-20">
              <div className="glass-badge backdrop-blur-md bg-gradient-to-r from-blue-500/80 to-blue-600/80 border border-white/20 text-[10px] sm:text-xs px-2 py-1 rounded-lg font-semibold shadow-lg">
                {movie.type}
              </div>
            </div>

            {/* Score Badge */}
            {movie.score && (
              <div className="absolute top-2 right-2 z-20">
                <div className="glass-badge backdrop-blur-md bg-gradient-to-r from-yellow-500/90 to-amber-600/90 border border-yellow-400/30 text-[10px] sm:text-xs px-2 py-1 rounded-lg font-semibold shadow-lg flex items-center gap-1">
                  <Star className="h-3 w-3" fill="currentColor" />
                  {movie.score}
                </div>
              </div>
            )}

            {/* Status Badge */}
            <div className="absolute bottom-2 left-2 z-20">
              <div className="glass-badge backdrop-blur-md bg-black/60 border border-white/20 text-[10px] sm:text-xs px-2 py-1 rounded-lg font-medium shadow-lg">
                {movie.status || movie.release || 'N/A'}
              </div>
            </div>

            {/* Duration Badge */}
            {movie.duration && (
              <div className="absolute bottom-2 right-2 z-20">
                <div className="glass-badge backdrop-blur-md bg-gradient-to-r from-yellow-500/80 to-amber-600/80 border border-yellow-400/30 text-[10px] sm:text-xs px-2 py-1 rounded-lg font-semibold shadow-lg">
                  {movie.duration}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Info Section */}
          <div className="relative p-3 sm:p-4 glass-card border-t border-white/10 backdrop-blur-xl">
            <h3 className="text-white font-bold text-xs sm:text-sm mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-400 group-hover:bg-clip-text transition-all duration-300 leading-tight">
              {movie.title}
            </h3>

            {/* Synopsis or Genres */}
            {movie.synopsis ? (
              <p className="text-gray-400 text-[10px] sm:text-xs mb-2 line-clamp-2 sm:line-clamp-3 leading-relaxed">
                {movie.synopsis}
              </p>
            ) : movie.genreList && movie.genreList.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {movie.genreList.slice(0, 2).map((genre) => (
                  <span
                    key={genre.genreId}
                    className="glass-badge backdrop-blur-sm bg-gray-800/50 border border-white/10 text-[9px] sm:text-[10px] text-gray-300 px-2 py-0.5 rounded-md font-medium"
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