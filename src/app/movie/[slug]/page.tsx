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
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoadingSpinner size="lg" text="Loading movie details..." />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error || 'Movie not found'}</p>
          <Link
            href="/movie"
            className="bg-gradient-to-r from-yellow-500 to-blue-600 hover:from-yellow-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10"></div>
        <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden">
          <Image
            src={movie.data.poster || `https://placehold.co/800x600/1a1a1a/ffffff?text=${encodeURIComponent(movie.data.title)}`}
            alt={movie.data.title}
            fill
            unoptimized
            className="object-cover object-center"
            priority
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 sm:p-6 md:p-8 lg:p-12">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 md:mb-4 leading-tight">
              {movie.data.title}
            </h1>
            {movie.data.english && movie.data.english !== movie.data.title && (
              <p className="text-base md:text-lg text-gray-300 mb-2 md:mb-3 line-clamp-1">{movie.data.english}</p>
            )}
            {movie.data.japanese && (
              <p className="text-sm md:text-base text-gray-400 mb-3 md:mb-4 line-clamp-1">{movie.data.japanese}</p>
            )}

            <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4 md:mb-6">
              {movie.data.score && (
                <div className="flex items-center gap-2 bg-yellow-500 text-black px-3 py-1 rounded-full">
                  <Star size={16} fill="currentColor" />
                  <span className="font-semibold text-sm">{movie.data.score.value}</span>
                  <span className="text-xs hidden sm:inline">({movie.data.score.users} users)</span>
                </div>
              )}
              <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-sm">
                {movie.data.status}
              </span>
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-sm">
                {movie.data.type}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Movie Info */}
            <div className="bg-gray-900 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Movie Information</h2>

              {/* Synopsis */}
              {movie.data.synopsis && movie.data.synopsis.paragraphs.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Synopsis</h3>
                  {movie.data.synopsis.paragraphs.map((paragraph, index) => (
                    <p key={index} className="text-gray-300 leading-relaxed mb-3">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {/* Movie Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {movie.data.duration && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <Clock className="text-yellow-500" size={20} />
                    <div>
                      <span className="text-gray-400 text-sm">Duration</span>
                      <p className="text-white">{movie.data.duration}</p>
                    </div>
                  </div>
                )}
                {movie.data.aired && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <Calendar className="text-blue-500" size={20} />
                    <div>
                      <span className="text-gray-400 text-sm">Aired</span>
                      <p className="text-white">{movie.data.aired}</p>
                    </div>
                  </div>
                )}
                {movie.data.studios && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <Building className="text-blue-400" size={20} />
                    <div>
                      <span className="text-gray-400 text-sm">Studios</span>
                      <p className="text-white">{movie.data.studios}</p>
                    </div>
                  </div>
                )}
                {movie.data.source && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <Tag className="text-yellow-400" size={20} />
                    <div>
                      <span className="text-gray-400 text-sm">Source</span>
                      <p className="text-white">{movie.data.source}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Genres */}
              {movie.data.genreList && movie.data.genreList.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.data.genreList.map((genre) => (
                      <span
                        key={genre.genreId}
                        className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm"
                      >
                        {genre.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Episodes */}
              {movie.data.episodeList && movie.data.episodeList.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Episodes ({movie.data.episodeList.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {movie.data.episodeList.map((episode) => (
                      <Link
                        key={episode.episodeId}
                        href={`/movie/watch/${episode.episodeId}`}
                        className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors text-center group"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Play className="text-gray-400 group-hover:text-blue-400 transition-colors" size={16} />
                          <span>Episode {episode.title}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Poster */}
            <div className="bg-gray-900 rounded-lg p-6 mb-8">
              <div className="aspect-[3/4] relative rounded-lg overflow-hidden mb-4">
                <Image
                  src={movie.data.poster || `https://placehold.co/300x400/1a1a1a/ffffff?text=${encodeURIComponent(movie.data.title)}`}
                  alt={movie.data.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>

              {/* Watch Button */}
              {movie.data.episodeList && movie.data.episodeList.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Watch Movie</h3>

                  <Link
                    href={`/movie/watch/${movie.data.episodeList[0].episodeId}`}
                    className="block bg-gradient-to-r from-yellow-500 to-blue-600 hover:from-yellow-600 hover:to-blue-700 text-white text-center py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <Play size={20} />
                    Watch Now
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className="text-white">{movie.data.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Type</span>
                  <span className="text-white">{movie.data.type}</span>
                </div>
                {movie.data.score && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Score</span>
                    <span className="text-yellow-500 font-semibold flex items-center gap-1">
                      <Star size={14} fill="currentColor" />
                      {movie.data.score.value}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Episodes</span>
                  <span className="text-white">{movie.data.episodes}</span>
                </div>
                {movie.data.season && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Season</span>
                    <span className="text-white">{movie.data.season}</span>
                  </div>
                )}
                {movie.data.producers && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Producers</span>
                    <span className="text-white text-right text-sm">{movie.data.producers}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}