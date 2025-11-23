'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MovieItem } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface MovieCardProps {
  movie: MovieItem;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movie/${movie.slug}`} className="group block touch-manipulation">
      <Card className="glass-card overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 group-hover:scale-[1.03] sm:group-hover:scale-105 active:scale-[0.98] sm:active:scale-100">
        {/* Glassmorphism glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="aspect-[2/3] sm:aspect-[3/4] relative overflow-hidden">
          <Image
            src={movie.poster && movie.poster.trim() !== ''
              ? movie.poster
              : `https://placehold.co/300x400/1a1a1a/ffffff?text=${encodeURIComponent(movie.title || 'Movie')}`}
            alt={movie.title || 'Movie'}
            fill
            unoptimized
            className="object-cover group-hover:scale-110 group-hover:brightness-110 transition-all duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
          />

          {/* Gradient overlay for better readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>

          <Badge className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 glass-badge bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1">
            {movie.type}
          </Badge>

          {/* Display score if available */}
          {movie.score && (
            <Badge className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 glass-badge bg-yellow-600 hover:bg-yellow-700 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1">
              <Star className="mr-0.5 sm:mr-1 h-2.5 w-2.5 sm:h-3 sm:w-3" fill="currentColor" />
              {movie.score}
            </Badge>
          )}

          {/* Display status or duration */}
          <Badge variant="secondary" className="absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2 glass-dark text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1">
            {movie.status || movie.release || 'N/A'}
          </Badge>

          {movie.duration && (
            <Badge className="absolute bottom-1.5 sm:bottom-2 right-1.5 sm:right-2 glass-badge bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1">
              {movie.duration}
            </Badge>
          )}
        </div>
        <CardContent className="p-2 sm:p-2.5 md:p-3 glass-card border-t border-white/5">
          <h3 className="text-white font-semibold text-xs sm:text-sm mb-1.5 sm:mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors leading-tight">
            {movie.title}
          </h3>

          {/* Display synopsis if available, otherwise show genres */}
          {movie.synopsis ? (
            <p className="text-gray-300 text-[10px] sm:text-xs mb-1 sm:mb-1.5 line-clamp-2 sm:line-clamp-3 leading-snug">
              {movie.synopsis}
            </p>
          ) : movie.genreList && movie.genreList.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {movie.genreList.slice(0, 2).map((genre) => (
                <Badge key={genre.genreId} variant="secondary" className="glass-badge text-[9px] sm:text-[10px] bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 px-1.5 py-0.5">
                  {genre.title}
                </Badge>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </Link>
  );
}