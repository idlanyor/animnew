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
      <Card className="bg-gray-800 border-gray-700 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 active:scale-95 hover:border-blue-500/50">
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
          <Badge className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-[10px] sm:text-xs">
            {movie.type}
          </Badge>

          {/* Display score if available */}
          {movie.score && (
            <Badge className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 bg-yellow-600 hover:bg-yellow-700 text-[10px] sm:text-xs">
              <Star className="mr-0.5 sm:mr-1 h-2.5 w-2.5 sm:h-3 sm:w-3" fill="currentColor" />
              {movie.score}
            </Badge>
          )}

          {/* Display status or duration */}
          <Badge variant="secondary" className="absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2 bg-black/70 hover:bg-black/80 text-[10px] sm:text-xs">
            {movie.status || movie.release || 'N/A'}
          </Badge>

          {movie.duration && (
            <Badge className="absolute bottom-1.5 sm:bottom-2 right-1.5 sm:right-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-[10px] sm:text-xs">
              {movie.duration}
            </Badge>
          )}
        </div>
        <CardContent className="p-2.5 sm:p-3 md:p-4">
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
                <Badge key={genre.genreId} variant="secondary" className="text-[9px] sm:text-xs bg-gray-700 text-gray-300 hover:bg-gray-600">
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