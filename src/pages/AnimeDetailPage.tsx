'use client';

import { useState, useEffect } from 'react';
import {Link,useParams} from 'react-router-dom';
import { getAnimeDetailBySanka, AnimeDetail } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import SEOHead from '@/components/SEOHead';
import { generateAnimeSEOData } from '@/lib/seo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faCalendar, faClock, faStar, faUsers, faBuilding, faTag } from '@fortawesome/free-solid-svg-icons';

export default function AnimeDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [anime, setAnime] = useState<AnimeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimeDetail = async () => {
      try {
        setLoading(true);
        const data = await getAnimeDetailBySanka(slug);
        setAnime(data);
      } catch (err) {
        setError('Failed to load anime details');
        console.error('Error fetching anime detail:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchAnimeDetail();
    }
  }, [slug]);

  // Generate SEO data when anime data is available
  const seoData = anime ? generateAnimeSEOData({
    title: anime.judul,
    synopsis: anime.synopsis,
    image: anime.gambar,
    slug: slug, // Use slug from URL params
    type: anime.tipe,
    status: anime.status,
    score: anime.skor,
    genres: anime.genre ? anime.genre.split(',').map(g => g.trim()) : [],
    releaseYear: anime.rilis,
  }) : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoadingSpinner size="lg" text="Loading anime details..." />
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error || 'Anime not found'}</p>
          <Link 
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {seoData && <SEOHead {...seoData} />}
      <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10"></div>
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          <img
            src={anime.gambar}
            alt={anime.judul}
            className="w-full h-full object-cover object-center"
          />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {anime.judul}
            </h1>
            {anime.namaJapan && (
              <p className="text-lg text-gray-300 mb-4">{anime.namaJapan}</p>
            )}
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {anime.skor && (
                <div className="flex items-center gap-2 bg-yellow-500 text-black px-3 py-1 rounded-full">
                  <FontAwesomeIcon icon={faStar} className="text-[16px]" />
                  <span className="font-semibold">{anime.skor}</span>
                </div>
              )}
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                {anime.status}
              </span>
              <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                {anime.tipe}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Synopsis */}
            {anime.synopsis && (
              <div className="bg-gray-900 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Synopsis</h2>
                <p className="text-gray-300 leading-relaxed">{anime.synopsis}</p>
              </div>
            )}

            {/* Anime Info */}
            <div className="bg-gray-900 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Anime Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <FontAwesomeIcon icon={faCalendar} className="text-blue-500 text-[20px]" />
                  <span>{anime.rilis}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <FontAwesomeIcon icon={faClock} className="text-green-500 text-[20px]" />
                  <span>{anime.durasi}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <FontAwesomeIcon icon={faBuilding} className="text-purple-500 text-[20px]" />
                  <span>{anime.studio}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <FontAwesomeIcon icon={faUsers} className="text-orange-500 text-[20px]" />
                  <span>{anime.produser}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300 md:col-span-2">
                  <FontAwesomeIcon icon={faTag} className="text-pink-500 text-[20px]" />
                  <span>{anime.totalEpisode}</span>
                </div>
              </div>
              
              {anime.genre && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {anime.genre.split(',').map((genre, index) => (
                      <span 
                        key={index}
                        className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm"
                      >
                        {genre.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Episodes List */}
            {anime.episodes && anime.episodes.length > 0 && (
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Episodes</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {anime.episodes.map((episode, index) => (
                    <Link
                      key={episode.slug}
                      to={`/episode/${episode.slug}`}
                      className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold">
                          {anime.episodes.length - index}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-medium group-hover:text-blue-400 transition-colors line-clamp-2">
                            {episode.judul}
                          </h3>
                          <p className="text-gray-400 text-sm">{episode.tanggal}</p>
                        </div>
                        <FontAwesomeIcon icon={faPlay} className="text-gray-400 group-hover:text-blue-400 transition-colors text-[20px]" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Poster */}
            <div className="bg-gray-900 rounded-lg p-6 mb-8">
              <div className="aspect-[3/4] relative rounded-lg overflow-hidden mb-4">
                <img
                  src={anime.gambar}
                  alt={anime.judul}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Download Links */}
              {(anime.batch || anime.lengkap) && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Download</h3>
                  
                  {anime.batch && (
                    <Link
                      to={`/episode/${anime.batch.slug}`}
                      className="block bg-green-600 hover:bg-green-700 text-white text-center py-3 rounded-lg transition-colors font-medium"
                    >
                      Download Batch
                    </Link>
                  )}
                  
                  {anime.lengkap && (
                    <Link
                      to={`/episode/${anime.lengkap.slug}`}
                      className="block bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg transition-colors font-medium"
                    >
                      Download Complete
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        {anime.recommendations && anime.recommendations.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Recommendations</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {anime.recommendations.map((rec) => (
                <Link
                  key={rec.slug}
                  to={`/anime/${rec.slug}`}
                  className="group"
                >
                  <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105">
                    {/* Neon border effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 -z-10"></div>

                    <div className="relative border border-cyan-500/20 group-hover:border-cyan-500/50 rounded-lg overflow-hidden transition-all duration-300">
                      {/* Poster */}
                      <div className="aspect-[3/4] relative overflow-hidden">
                        <img
                          src={rec.poster}
                          alt={rec.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      {/* Title */}
                      <div className="p-3 bg-gray-900/90">
                        <h3 className="text-white font-medium text-sm line-clamp-2 group-hover:text-cyan-400 transition-colors">
                          {rec.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      </div>
    </>
  );
}

