'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getMovieDetail, MovieDetail } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Play, Calendar, Clock, Star, Building, Tag } from 'lucide-react';

export default function MovieDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        setLoading(true);
        const data = await getMovieDetail(slug);
        setMovie(data);
      } catch (err) {
        setError('Failed to load movie details');
        console.error('Error fetching movie detail:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchMovieDetail();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-black">
        <div className="glass-card px-8 py-6 rounded-2xl border border-white/10">
          <LoadingSpinner size="lg" text="Loading movie details..." />
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-black">
        <div className="text-center">
          <div className="glass-card px-8 py-6 rounded-2xl border border-white/10 mb-6 inline-block">
            <p className="text-red-500 text-xl mb-4">{error || 'Movie not found'}</p>
          </div>
          <Link
            href="/movie"
            className="inline-block group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
            <div className="relative glass-card px-8 py-3 rounded-xl border border-white/20 group-hover:border-yellow-400/50 transition-all duration-300">
              <span className="text-white font-medium bg-gradient-to-r from-white to-yellow-200 bg-clip-text group-hover:text-transparent transition-all">
                Back to Movies
              </span>
            </div>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      {/* Enhanced Hero Section with Glassmorphism */}
      <div className="relative overflow-hidden">
        {/* Background Image with Blur */}
        <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px]">
          <Image
            src={movie.data.poster || `https://placehold.co/800x600/1a1a1a/ffffff?text=${encodeURIComponent(movie.data.title)}`}
            alt={movie.data.title}
            fill
            unoptimized
            className="object-cover object-center"
            priority
          />
          {/* Multi-layer overlay for better glass effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/30"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black"></div>
          <div className="absolute inset-0 backdrop-blur-[2px]"></div>
        </div>

        {/* Glass Content Container */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 sm:p-6 md:p-8 lg:p-12">
          <div className="max-w-7xl mx-auto">
            {/* Title with Glass Background */}
            <div className="relative inline-block mb-4 md:mb-6 max-w-full">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-blue-500/20 to-purple-500/20 blur-2xl"></div>
              <div className="relative glass-card px-6 py-4 rounded-2xl border border-white/10 backdrop-blur-xl">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 bg-gradient-to-r from-white via-yellow-100 to-blue-100 bg-clip-text text-transparent leading-tight">
                  {movie.data.title}
                </h1>
                {movie.data.english && movie.data.english !== movie.data.title && (
                  <p className="text-base md:text-xl text-gray-300 mb-2">{movie.data.english}</p>
                )}
                {movie.data.japanese && (
                  <p className="text-sm md:text-base text-gray-400">{movie.data.japanese}</p>
                )}
              </div>
            </div>

            {/* Enhanced Badges */}
            <div className="flex flex-wrap items-center gap-3">
              {movie.data.score && (
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-amber-600 blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative glass-badge backdrop-blur-md bg-gradient-to-r from-yellow-500/90 to-amber-600/90 border border-yellow-400/30 px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg">
                    <Star size={18} fill="currentColor" className="text-white" />
                    <span className="font-bold text-white text-sm">{movie.data.score.value}</span>
                    <span className="text-xs text-yellow-100 hidden sm:inline">({movie.data.score.users} users)</span>
                  </div>
                </div>
              )}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative glass-badge backdrop-blur-md bg-gradient-to-r from-green-500/90 to-emerald-600/90 border border-green-400/30 px-4 py-2 rounded-xl shadow-lg">
                  <span className="font-semibold text-white text-sm">{movie.data.status}</span>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-600 blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative glass-badge backdrop-blur-md bg-gradient-to-r from-blue-500/90 to-cyan-600/90 border border-blue-400/30 px-4 py-2 rounded-xl shadow-lg">
                  <span className="font-semibold text-white text-sm">{movie.data.type}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Enhanced Movie Info Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative glass-card rounded-2xl p-6 md:p-8 border border-white/10">
                {/* Section Title */}
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                    Movie Information
                  </h2>
                  <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mt-2"></div>
                </div>

                {/* Synopsis */}
                {movie.data.synopsis && movie.data.synopsis.paragraphs.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <div className="w-1 h-6 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>
                      Synopsis
                    </h3>
                    <div className="space-y-3">
                      {movie.data.synopsis.paragraphs.map((paragraph, index) => (
                        <p key={index} className="text-gray-300 leading-relaxed text-justify">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Movie Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {movie.data.duration && (
                    <div className="glass-card p-4 rounded-xl border border-white/10 hover:border-yellow-500/30 transition-all duration-300 group/item">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500/20 to-amber-600/20 group-hover/item:from-yellow-500/30 group-hover/item:to-amber-600/30 transition-all">
                          <Clock className="text-yellow-400" size={20} />
                        </div>
                        <div>
                          <span className="text-gray-400 text-xs font-medium">Duration</span>
                          <p className="text-white font-semibold">{movie.data.duration}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {movie.data.aired && (
                    <div className="glass-card p-4 rounded-xl border border-white/10 hover:border-blue-500/30 transition-all duration-300 group/item">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-600/20 group-hover/item:from-blue-500/30 group-hover/item:to-cyan-600/30 transition-all">
                          <Calendar className="text-blue-400" size={20} />
                        </div>
                        <div>
                          <span className="text-gray-400 text-xs font-medium">Aired</span>
                          <p className="text-white font-semibold">{movie.data.aired}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {movie.data.studios && (
                    <div className="glass-card p-4 rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300 group/item">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 group-hover/item:from-cyan-500/30 group-hover/item:to-blue-600/30 transition-all">
                          <Building className="text-cyan-400" size={20} />
                        </div>
                        <div>
                          <span className="text-gray-400 text-xs font-medium">Studios</span>
                          <p className="text-white font-semibold text-sm">{movie.data.studios}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {movie.data.source && (
                    <div className="glass-card p-4 rounded-xl border border-white/10 hover:border-purple-500/30 transition-all duration-300 group/item">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-600/20 group-hover/item:from-purple-500/30 group-hover/item:to-pink-600/30 transition-all">
                          <Tag className="text-purple-400" size={20} />
                        </div>
                        <div>
                          <span className="text-gray-400 text-xs font-medium">Source</span>
                          <p className="text-white font-semibold">{movie.data.source}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Genres */}
                {movie.data.genreList && movie.data.genreList.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <div className="w-1 h-6 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>
                      Genres
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {movie.data.genreList.map((genre) => (
                        <span
                          key={genre.genreId}
                          className="glass-badge backdrop-blur-sm bg-gradient-to-r from-gray-800/80 to-gray-700/80 border border-white/10 hover:border-cyan-400/30 text-gray-200 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105"
                        >
                          {genre.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Episodes Section */}
            {movie.data.episodeList && movie.data.episodeList.length > 0 && (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative glass-card rounded-2xl p-6 md:p-8 border border-white/10">
                  <div className="mb-6">
                    <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                        <Play className="text-blue-400" size={24} />
                      </div>
                      <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                        Episodes
                      </span>
                      <span className="glass-badge backdrop-blur-sm bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-lg text-sm text-blue-300">
                        {movie.data.episodeList.length}
                      </span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {movie.data.episodeList.map((episode) => (
                      <Link
                        key={episode.episodeId}
                        href={`/movie/watch/${episode.episodeId}`}
                        className="group/ep relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 opacity-0 group-hover/ep:opacity-100 transition-opacity duration-300 blur"></div>
                        <div className="relative glass-card p-3 rounded-xl border border-white/10 group-hover/ep:border-blue-400/50 transition-all duration-300 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Play className="text-gray-400 group-hover/ep:text-blue-400 transition-colors" size={16} />
                            <span className="text-white font-medium text-sm group-hover/ep:text-blue-300">EP {episode.title}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Poster & Watch Section */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-blue-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative glass-card rounded-2xl p-6 border border-white/10">
                {/* Enhanced Poster */}
                <div className="aspect-[3/4] relative rounded-xl overflow-hidden mb-6 group/poster">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                  <Image
                    src={movie.data.poster || `https://placehold.co/300x400/1a1a1a/ffffff?text=${encodeURIComponent(movie.data.title)}`}
                    alt={movie.data.title}
                    fill
                    unoptimized
                    className="object-cover group-hover/poster:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 border-2 border-white/10 rounded-xl group-hover/poster:border-white/20 transition-colors"></div>
                </div>

                {/* Enhanced Watch Button */}
                {movie.data.episodeList && movie.data.episodeList.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <div className="w-1 h-6 bg-gradient-to-b from-yellow-500 to-blue-500 rounded-full"></div>
                      Watch Movie
                    </h3>

                    <Link
                      href={`/movie/watch/${movie.data.episodeList[0].episodeId}`}
                      className="block group/watch relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-blue-500 to-purple-600 opacity-100 group-hover/watch:opacity-100 transition-opacity duration-300 animate-gradient"></div>
                      <div className="relative backdrop-blur-sm bg-gradient-to-r from-yellow-500/90 via-blue-500/90 to-purple-600/90 border border-yellow-400/30 text-white text-center py-4 rounded-xl transition-all duration-300 font-bold text-lg shadow-2xl group-hover/watch:shadow-yellow-500/50 group-hover/watch:scale-[1.02]">
                        <div className="flex items-center justify-center gap-3">
                          <div className="p-2 bg-white/20 rounded-full group-hover/watch:bg-white/30 transition-colors">
                            <Play size={20} fill="currentColor" />
                          </div>
                          <span>Watch Now</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Quick Stats */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative glass-card rounded-2xl p-6 border border-white/10">
                <div className="mb-6">
                  <h3 className="text-lg font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                    Quick Stats
                  </h3>
                  <div className="h-1 w-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mt-2"></div>
                </div>

                <div className="space-y-4">
                  <div className="glass-card p-3 rounded-xl border border-white/5 flex justify-between items-center group/stat hover:border-green-500/30 transition-all">
                    <span className="text-gray-400 text-sm font-medium">Status</span>
                    <span className="text-white font-semibold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      {movie.data.status}
                    </span>
                  </div>

                  <div className="glass-card p-3 rounded-xl border border-white/5 flex justify-between items-center group/stat hover:border-blue-500/30 transition-all">
                    <span className="text-gray-400 text-sm font-medium">Type</span>
                    <span className="text-white font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      {movie.data.type}
                    </span>
                  </div>

                  {movie.data.score && (
                    <div className="glass-card p-3 rounded-xl border border-white/5 flex justify-between items-center group/stat hover:border-yellow-500/30 transition-all">
                      <span className="text-gray-400 text-sm font-medium">Score</span>
                      <span className="text-yellow-400 font-bold flex items-center gap-1.5 text-lg">
                        <Star size={16} fill="currentColor" />
                        {movie.data.score.value}
                      </span>
                    </div>
                  )}

                  <div className="glass-card p-3 rounded-xl border border-white/5 flex justify-between items-center group/stat hover:border-purple-500/30 transition-all">
                    <span className="text-gray-400 text-sm font-medium">Episodes</span>
                    <span className="text-white font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {movie.data.episodes}
                    </span>
                  </div>

                  {movie.data.season && (
                    <div className="glass-card p-3 rounded-xl border border-white/5 flex justify-between items-center group/stat hover:border-cyan-500/30 transition-all">
                      <span className="text-gray-400 text-sm font-medium">Season</span>
                      <span className="text-white font-semibold">{movie.data.season}</span>
                    </div>
                  )}

                  {movie.data.producers && (
                    <div className="glass-card p-3 rounded-xl border border-white/5 flex justify-between items-center group/stat hover:border-blue-500/30 transition-all">
                      <span className="text-gray-400 text-sm font-medium">Producers</span>
                      <span className="text-white text-right text-sm font-medium">{movie.data.producers}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}