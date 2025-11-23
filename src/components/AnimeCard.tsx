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
    <Link href={`/anime/${anime.slug}`} className="group">
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105">
        {/* Neon border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 -z-10"></div>
        <div className="absolute inset-[2px] bg-gray-900 rounded-lg z-0"></div>

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
              <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 shadow-lg border border-yellow-300">
                <Star size={14} fill="currentColor" />
                <span className="text-sm">{anime.rating}</span>
              </div>
            )}

            {/* Status indicator */}
            {isOngoing && (
              <div className="absolute top-3 left-3 bg-gradient-to-r from-cyan-500 to-blue-600 px-2 py-1 rounded text-[10px] font-bold text-white flex items-center gap-1 shadow-lg border border-cyan-300/50">
                <Zap size={10} fill="currentColor" />
                <span>LIVE</span>
              </div>
            )}
          </div>

          {/* Info section with tech style */}
          <div className="p-4 bg-gradient-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-sm">
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
                  <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-3 py-1.5 rounded text-xs font-bold tracking-wider border border-cyan-400/30 shadow-lg shadow-cyan-500/20">
                      {anime.current_episode}
                    </div>
                  </div>
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
                  <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-3 py-1.5 rounded text-xs font-bold tracking-wider border border-emerald-400/30 shadow-lg shadow-emerald-500/20">
                      {anime.episode_count} EP
                    </div>
                  </div>
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
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 rounded text-xs font-bold border border-blue-400/30">
                    {anime.eps[0]}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom decorative line */}
            <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent mt-3"></div>
          </div>
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
      </div>
    </Link>
  );
}
