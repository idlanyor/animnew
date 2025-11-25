'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimeItem } from '@/lib/api';
import { Star, Play, Calendar, Clock, Zap } from 'lucide-react';

interface AnimeCardProps {
  anime: AnimeItem;
}

export default function AnimeCard({ anime }: AnimeCardProps) {
  // Check if this is ongoing or complete anime based on available fields
  const isOngoing = anime.current_episode && anime.release_day;
  const isComplete = anime.episode_count && anime.rating;

  return (
    <Link href={`/anime/${anime.slug}`} className="group block touch-manipulation">
      <div className="relative overflow-hidden rounded-xl transition-all duration-500 group-hover:scale-[1.02] sm:group-hover:scale-105 active:scale-[0.98]">
        {/* Enhanced outer glow with anime theme colors */}
        <div className="absolute -inset-0.5 bg-gradient-to-br from-cyan-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-cyan-500/30 group-hover:via-blue-500/30 group-hover:to-purple-500/30 rounded-xl blur-lg transition-all duration-500 opacity-0 group-hover:opacity-100"></div>

        <div className="relative glass-card overflow-hidden rounded-xl border border-white/10 group-hover:border-cyan-400/30 transition-all duration-500 shadow-2xl">
          {/* Inner glow overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>

          {/* Image section with enhanced effects */}
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src={anime.gambar}
              alt={anime.judul}
              fill
              priority
              className="object-cover group-hover:scale-110 group-hover:brightness-110 transition-all duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            {/* Tech corner accents - more subtle */}
            <div className="absolute top-2 left-2 w-8 h-8 sm:w-10 sm:h-10 border-t-2 border-l-2 border-cyan-400/60 group-hover:border-cyan-400 transition-colors rounded-tl-sm"></div>
            <div className="absolute bottom-2 right-2 w-8 h-8 sm:w-10 sm:h-10 border-b-2 border-r-2 border-cyan-400/60 group-hover:border-cyan-400 transition-colors rounded-br-sm"></div>

            {/* Enhanced play button overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center z-20">
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-400 blur-2xl opacity-60 animate-pulse"></div>
                  <div className="relative glass-badge backdrop-blur-md bg-cyan-500/20 border border-cyan-400/50 p-4 rounded-full">
                    <Play className="text-cyan-400" size={32} fill="currentColor" />
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced rating badge for complete anime */}
            {isComplete && anime.rating && (
              <div className="absolute top-2 right-2 z-20">
                <div className="glass-badge backdrop-blur-md bg-gradient-to-r from-yellow-500/90 to-amber-600/90 border border-yellow-400/30 text-[10px] sm:text-xs px-2 py-1 rounded-lg font-semibold shadow-lg flex items-center gap-1">
                  <Star size={12} fill="currentColor" className="text-white" />
                  <span className="text-white font-bold">{anime.rating}</span>
                </div>
              </div>
            )}

            {/* Enhanced status indicator for ongoing */}
            {isOngoing && (
              <div className="absolute top-2 left-2 z-20">
                <div className="glass-badge backdrop-blur-md bg-gradient-to-r from-cyan-500/90 to-blue-600/90 border border-cyan-400/30 text-[10px] sm:text-xs px-2 py-1 rounded-lg font-semibold shadow-lg flex items-center gap-1 animate-pulse">
                  <Zap size={10} fill="currentColor" className="text-yellow-300" />
                  <span className="text-white font-bold">LIVE</span>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced info section with glassmorphism */}
          <div className="relative p-3 sm:p-4 glass-card border-t border-white/10 backdrop-blur-xl z-10">
            {/* Title with enhanced styling */}
            <h3 className="text-white font-bold text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-400 group-hover:bg-clip-text transition-all duration-300 leading-tight">
              {anime.judul}
            </h3>

            {/* Enhanced info badges */}
            <div className="space-y-2">
              {/* Ongoing Anime Info */}
              {isOngoing && (
                <div className="space-y-1.5">
                  <div className="glass-badge backdrop-blur-sm bg-gradient-to-r from-cyan-600/80 to-blue-600/80 border border-cyan-400/20 text-[10px] sm:text-xs px-2 sm:px-2.5 py-1 inline-flex items-center rounded-lg font-semibold shadow-md">
                    <span className="text-white">{anime.current_episode}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-cyan-300 text-[10px] sm:text-xs font-medium">
                    <Calendar size={12} className="flex-shrink-0" />
                    <span className="truncate">{anime.release_day}</span>
                  </div>
                  {anime.newest_release_date && (
                    <div className="flex items-center gap-1.5 text-gray-400 text-[10px] sm:text-xs">
                      <Clock size={12} className="flex-shrink-0" />
                      <span className="truncate">{anime.newest_release_date}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Complete Anime Info */}
              {isComplete && (
                <div className="space-y-1.5">
                  <div className="glass-badge backdrop-blur-sm bg-gradient-to-r from-emerald-600/80 to-green-600/80 border border-emerald-400/20 text-[10px] sm:text-xs px-2 sm:px-2.5 py-1 inline-flex items-center rounded-lg font-semibold shadow-md">
                    <span className="text-white">{anime.episode_count} EP</span>
                  </div>
                  {anime.last_release_date && (
                    <div className="flex items-center gap-1.5 text-gray-400 text-[10px] sm:text-xs">
                      <Clock size={12} className="flex-shrink-0" />
                      <span className="truncate">Selesai: {anime.last_release_date}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Fallback for old format */}
              {!isOngoing && !isComplete && anime.eps && anime.eps.length > 0 && (
                <div className="glass-badge backdrop-blur-sm bg-gradient-to-r from-blue-600/80 to-blue-700/80 border border-blue-400/20 text-[10px] sm:text-xs px-2 sm:px-2.5 py-1 inline-flex items-center rounded-lg font-semibold shadow-md">
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
