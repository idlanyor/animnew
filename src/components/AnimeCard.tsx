'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimeItem } from '@/lib/api';
import { Star, Play, Calendar, Clock, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AnimeCardProps {
  anime: AnimeItem;
}

export default function AnimeCard({ anime }: AnimeCardProps) {
  const isOngoing = anime.current_episode && anime.release_day;
  const isComplete = anime.episode_count && anime.rating;

  return (
    <Link href={`/anime/${anime.slug}`} className="group">
      <Card className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-700 overflow-hidden transition-all duration-300 transform hover:scale-105 hover:border-cyan-500/50">
        {/* Neon border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 -z-10"></div>

        {/* Scanline effect */}
        <div className="absolute inset-0 z-10 pointer-events-none opacity-10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-pulse"></div>
        </div>

        {/* Content container */}
        <div className="relative z-20">
          {/* Image section with holographic effect */}
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src={anime.gambar}
              alt={anime.judul}
              fill
              priority
              className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-125"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Holographic overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Corner accent */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyan-400 opacity-70"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-cyan-400 opacity-70"></div>

            {/* Play button overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-400 blur-xl opacity-70"></div>
                  <Play className="relative text-cyan-400" size={48} fill="currentColor" />
                </div>
              </div>
            </div>

            {/* Rating badge for complete anime */}
            {isComplete && anime.rating && (
              <Badge className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:from-yellow-500 hover:to-amber-600 border-yellow-300">
                <Star size={14} fill="currentColor" className="mr-1" />
                {anime.rating}
              </Badge>
            )}

            {/* Status indicator */}
            {isOngoing && (
              <Badge className="absolute top-3 left-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-cyan-300/50">
                <Zap size={10} fill="currentColor" className="mr-1" />
                LIVE
              </Badge>
            )}
          </div>

          {/* Info section with tech style */}
          <CardContent className="p-4 bg-gradient-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-sm">
            {/* Decorative line */}
            <div className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent mb-3 opacity-50"></div>

            {/* Title with fixed height */}
            <div className="h-[2.5rem] mb-3 overflow-hidden">
              <h3 className="text-white font-bold text-sm line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-500 transition-all duration-300 tracking-wide leading-tight">
                {anime.judul}
              </h3>
            </div>

            {/* Info section with fixed height */}
            <div className="h-[4.5rem]">
              {/* Ongoing Anime Info */}
              {isOngoing && (
                <div className="space-y-2">
                  <Badge className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 border-cyan-400/30 shadow-lg shadow-cyan-500/20">
                    {anime.current_episode}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-cyan-300 text-xs font-medium">
                    <Calendar size={12} />
                    <span className="tracking-wide">{anime.release_day}</span>
                  </div>
                  {anime.newest_release_date && (
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                      <Clock size={12} />
                      <span>{anime.newest_release_date}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Complete Anime Info */}
              {isComplete && (
                <div className="space-y-2">
                  <Badge className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 border-emerald-400/30 shadow-lg shadow-emerald-500/20">
                    {anime.episode_count} EP
                  </Badge>
                  {anime.last_release_date && (
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                      <Clock size={12} />
                      <span>Selesai: {anime.last_release_date}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Fallback for old format */}
              {!isOngoing && !isComplete && anime.eps && anime.eps.length > 0 && (
                <Badge className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-blue-400/30">
                  {anime.eps[0]}
                </Badge>
              )}
            </div>

            {/* Bottom decorative line */}
            <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent mt-3"></div>
          </CardContent>
        </div>

        {/* Tech grid pattern overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(0deg, transparent 24%, rgba(6, 182, 212, 0.3) 25%, rgba(6, 182, 212, 0.3) 26%, transparent 27%, transparent 74%, rgba(6, 182, 212, 0.3) 75%, rgba(6, 182, 212, 0.3) 76%, transparent 77%, transparent),
              linear-gradient(90deg, transparent 24%, rgba(6, 182, 212, 0.3) 25%, rgba(6, 182, 212, 0.3) 26%, transparent 27%, transparent 74%, rgba(6, 182, 212, 0.3) 75%, rgba(6, 182, 212, 0.3) 76%, transparent 77%, transparent)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </Card>
    </Link>
  );
}
