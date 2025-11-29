'use client';

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAnimeDetailBySanka, AnimeDetail } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import SEOHead from '@/components/SEOHead';
import { generateAnimeSEOData } from '@/lib/seo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faCalendar, faClock, faStar, faUsers, faBuilding, faTag, faArrowLeft, faListOl, faHeart, faBookmark, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { useBookmarks } from '@/contexts/BookmarkContext';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <LoadingSpinner size="lg" text="Loading anime details..." />
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error || 'Anime not found'}</p>
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
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
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        {/* Hero Section with Backdrop */}
        <div className="relative min-h-[450px] md:min-h-[400px]">
          {/* Backdrop Image */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={anime.gambar}
              alt={anime.judul}
              className="w-full h-full object-cover object-center blur-sm scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-gray-50 dark:to-black"></div>
          </div>

          {/* Content */}
          <div className="relative max-w-7xl mx-auto px-4 pt-6 pb-8">
            {/* Back Button */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-white bg-black/30 hover:bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full mb-6 text-sm z-10"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>Kembali</span>
            </Link>

            {/* Main Info Card */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
              <div className="flex-shrink-0 mx-auto md:mx-0 z-10">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-50"></div>
                  <img
                    src={anime.gambar}
                    alt={anime.judul}
                    className="relative w-40 sm:w-48 md:w-52 rounded-xl shadow-2xl"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left z-10">
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                  {anime.judul}
                </h1>
                {anime.namaJapan && (
                  <p className="text-white/70 mb-4 text-sm md:text-base">{anime.namaJapan}</p>
                )}

                {/* Badges */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-5">
                  {anime.skor && (
                    <div className="flex items-center gap-1.5 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
                      <FontAwesomeIcon icon={faStar} className="text-xs" />
                      <span>{anime.skor}</span>
                    </div>
                  )}
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {anime.status}
                  </span>
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {anime.tipe}
                  </span>
                  {anime.totalEpisode && (
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                      {anime.totalEpisode}
                    </span>
                  )}
                </div>

                {/* Quick Info */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-white/80 text-sm mb-6">
                  {anime.studio && (
                    <div className="flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faBuilding} className="text-purple-400" />
                      <span>{anime.studio}</span>
                    </div>
                  )}
                  {anime.rilis && (
                    <div className="flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faCalendar} className="text-blue-400" />
                      <span>{anime.rilis}</span>
                    </div>
                  )}
                  {anime.durasi && (
                    <div className="flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faClock} className="text-green-400" />
                      <span>{anime.durasi}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {anime.episodes && anime.episodes.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <Link
                      to={`/episode/${anime.episodes[anime.episodes.length - 1].slug}`}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-full shadow-lg shadow-purple-500/30"
                    >
                      <FontAwesomeIcon icon={faPlay} />
                      <span>Tonton Sekarang</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Synopsis */}
              {anime.synopsis && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
                    Sinopsis
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base">{anime.synopsis}</p>
                </div>
              )}

              {/* Episodes List */}
              {anime.episodes && anime.episodes.length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                      <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></span>
                      Daftar Episode
                    </h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                      {anime.episodes.length} Episode
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
                    {[...anime.episodes].reverse().map((episode) => (
                      <Link
                        key={episode.slug}
                        to={`/episode/${episode.slug}`}
                        className="group flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-gray-100 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                          <FontAwesomeIcon icon={faPlay} className="text-white text-sm" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-gray-800 dark:text-white font-medium text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400 truncate">
                            {episode.judul}
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">{episode.tanggal}</p>
                        </div>
                        <FontAwesomeIcon icon={faChevronRight} className="text-gray-400 group-hover:text-purple-500 text-sm" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Info Card */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></span>
                  Informasi
                </h2>
                <div className="space-y-3">
                  {anime.tipe && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Tipe</span>
                      <span className="text-gray-800 dark:text-white font-medium text-sm">{anime.tipe}</span>
                    </div>
                  )}
                  {anime.status && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Status</span>
                      <span className="text-gray-800 dark:text-white font-medium text-sm">{anime.status}</span>
                    </div>
                  )}
                  {anime.rilis && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Rilis</span>
                      <span className="text-gray-800 dark:text-white font-medium text-sm">{anime.rilis}</span>
                    </div>
                  )}
                  {anime.studio && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Studio</span>
                      <span className="text-gray-800 dark:text-white font-medium text-sm">{anime.studio}</span>
                    </div>
                  )}
                  {anime.durasi && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Durasi</span>
                      <span className="text-gray-800 dark:text-white font-medium text-sm">{anime.durasi}</span>
                    </div>
                  )}
                  {anime.produser && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Produser</span>
                      <span className="text-gray-800 dark:text-white font-medium text-sm text-right max-w-[150px] truncate">{anime.produser}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Genres */}
              {anime.genre && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-gradient-to-b from-pink-500 to-rose-500 rounded-full"></span>
                    Genre
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {anime.genre.split(',').map((genre, index) => (
                      <Link
                        key={index}
                        to={`/genres?genre=${genre.trim().toLowerCase()}`}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 rounded-full text-sm border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
                      >
                        {genre.trim()}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recommendations Section */}
          {anime.recommendations && anime.recommendations.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full"></span>
                Rekomendasi Serupa
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {anime.recommendations.map((rec) => (
                  <Link
                    key={rec.slug}
                    to={`/anime/${rec.slug}`}
                    className="group"
                  >
                    <div className="relative rounded-xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm group-hover:shadow-lg group-hover:border-purple-300 dark:group-hover:border-purple-700">
                      <div className="aspect-[3/4] overflow-hidden">
                        <img
                          src={rec.poster}
                          alt={rec.title}
                          className="w-full h-full object-cover group-hover:scale-105"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="text-gray-800 dark:text-white font-medium text-sm line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                          {rec.title}
                        </h3>
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

