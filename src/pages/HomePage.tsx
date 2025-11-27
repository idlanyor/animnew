import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHomeData, AnimeItem, getSchedule, Schedule } from '@/lib/api';
import AnimeCard from '@/components/AnimeCard';
import TodayAnimeCarousel from '@/components/TodayAnimeCarousel';
import LoadingSpinner from '@/components/LoadingSpinner';
import SEOHead from '@/components/SEOHead';
import { generatePageSEOData } from '@/lib/seo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faArrowTrendUp, faClock } from '@fortawesome/free-solid-svg-icons';

// Helper function to get current day in Indonesian
const getDayInIndonesian = (): string => {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const today = new Date().getDay();
  return days[today];
};

export default function HomePage() {
  const [ongoingAnime, setOngoingAnime] = useState<AnimeItem[]>([]);
  const [popularAnime, setPopularAnime] = useState<AnimeItem[]>([]);
  const [todayAnime, setTodayAnime] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch schedule and filter by today
        const currentDay = getDayInIndonesian();
        const schedule = await getSchedule();
        const todaySchedule = schedule.find(day => day.day === currentDay);
        setTodayAnime(todaySchedule || null);

        // Fetch home data (ongoing and complete anime)
        const homeData = await getHomeData();
        setOngoingAnime(homeData.ongoing);
        setPopularAnime(homeData.complete);

      } catch (err) {
        setError('Failed to load anime data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate SEO data for home page
  const seoData = generatePageSEOData({
    title: 'KanataAnime - Nonton Anime Sub Indo HD Gratis Tanpa Iklan',
    description: 'Nonton anime sub indo gratis di KanataAnime. Platform streaming anime terbaik dengan koleksi lengkap anime ongoing, complete dan movie. Streaming anime subtitle Indonesia dengan kualitas HD 720p tanpa iklan.',
    keywords: 'kanatanime, kanata anime, antidonasi anime, nonton anime, nonton anime sub indo, streaming anime, streaming anime sub indo, anime tanpa iklan, anime gratis, anime sub indo, anime subtitle indonesia, anime ongoing, anime complete, anime movie, anime terbaru, anime terlengkap',
    url: '/',
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-black">
        <div className="glass-card px-8 py-6 rounded-2xl border border-white/10">
          <LoadingSpinner size="lg" text="Loading anime..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-black">
        <div className="text-center">
          <div className="glass-card px-8 py-6 rounded-2xl border border-white/10 mb-6 inline-block">
            <p className="text-red-500 text-xl mb-4">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur rounded-xl"></div>
            <div className="relative glass-card px-8 py-3 rounded-xl border border-white/20 group-hover:border-yellow-400/50 transition-all duration-300">
              <span className="text-white font-medium bg-gradient-to-r from-white to-yellow-200 bg-clip-text group-hover:text-transparent transition-all">
                Try Again
              </span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead {...seoData} />
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black">
      {/* Today's Anime Carousel */}
      {todayAnime && todayAnime.anime_list.length > 0 && (
        <TodayAnimeCarousel
          animeList={todayAnime.anime_list}
          dayName={todayAnime.day}
        />
      )}

      {/* Ongoing Anime Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-gray-950 via-gray-900 to-black" aria-label="Anime Ongoing Terbaru">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8 lg:mb-10">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-cyan-500/20 blur-xl"></div>
              <div className="relative glass-card px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border border-white/10">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500/20 to-cyan-500/20">
                    <FontAwesomeIcon icon={faArrowTrendUp} className="text-yellow-400 h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <span className="bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                    Anime Ongoing Terbaru
                  </span>
                </h1>
              </div>
            </div>
            <Link
              to="/ongoing"
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur rounded-lg"></div>
              <div className="relative glass-card px-4 py-2 rounded-lg border border-white/10 group-hover:border-yellow-400/50 transition-all">
                <span className="text-yellow-400 group-hover:text-yellow-300 font-medium text-xs sm:text-sm lg:text-base">
                  Lihat Semua →
                </span>
              </div>
            </Link>
          </div>

          {ongoingAnime.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
              {ongoingAnime.map((anime) => (
                <AnimeCard key={anime.slug} anime={anime} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <div className="glass-card inline-block px-8 py-6 rounded-2xl border border-white/10">
                <p className="text-gray-400 text-base sm:text-lg">No ongoing anime found</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Complete Anime Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-black via-gray-900 to-gray-950" aria-label="Anime Complete Sub Indo">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8 lg:mb-10">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl"></div>
              <div className="relative glass-card px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border border-white/10">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                    <FontAwesomeIcon icon={faPlay} className="text-blue-400 h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    Anime Complete Sub Indo
                  </span>
                </h2>
              </div>
            </div>
            <Link
              to="/complete"
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur rounded-lg"></div>
              <div className="relative glass-card px-4 py-2 rounded-lg border border-white/10 group-hover:border-blue-400/50 transition-all">
                <span className="text-blue-400 group-hover:text-blue-300 font-medium text-xs sm:text-sm lg:text-base">
                  Lihat Semua →
                </span>
              </div>
            </Link>
          </div>

          {popularAnime.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
              {popularAnime.map((anime) => (
                <AnimeCard key={anime.slug} anime={anime} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <div className="glass-card inline-block px-8 py-6 rounded-2xl border border-white/10">
                <p className="text-gray-400 text-base sm:text-lg">No complete anime found</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden bg-gradient-to-b from-gray-950 via-black to-gray-900" aria-label="Keunggulan KanataAnime">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          {/* Section Title */}
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <div className="inline-block">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent">
                  Kenapa Pilih KanataAnime untuk Nonton Anime?
                </span>
              </h2>
              <div className="h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent rounded-full"></div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-amber-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative glass-card p-6 sm:p-8 rounded-2xl border border-white/10 hover:border-yellow-500/30 transition-all duration-500 text-center">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl blur-md opacity-50"></div>
                  <div className="relative bg-gradient-to-br from-yellow-500 to-amber-600 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <FontAwesomeIcon icon={faPlay} className="text-white text-[32px]" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                  Streaming Anime HD Tanpa Iklan
                </h3>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                  Nonton anime dengan kualitas HD 720p tanpa gangguan iklan. Streaming lancar dan cepat untuk pengalaman menonton terbaik.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative glass-card p-6 sm:p-8 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all duration-500 text-center">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl blur-md opacity-50"></div>
                  <div className="relative bg-gradient-to-br from-blue-500 to-cyan-600 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <FontAwesomeIcon icon={faArrowTrendUp} className="text-white text-[32px]" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  Anime Terbaru Update Setiap Hari
                </h3>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                  Nonton episode anime ongoing terbaru yang diupdate setiap hari. Tidak ketinggalan anime favorit dengan subtitle Indonesia.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative sm:col-span-2 lg:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative glass-card p-6 sm:p-8 rounded-2xl border border-white/10 hover:border-cyan-500/30 transition-all duration-500 text-center">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl blur-md opacity-50"></div>
                  <div className="relative bg-gradient-to-br from-cyan-500 to-purple-600 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <FontAwesomeIcon icon={faClock} className="text-white text-[32px]" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  Koleksi Anime Terlengkap
                </h3>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                  Ribuan anime ongoing, complete, dan movie sub indo tersedia. Dari anime klasik hingga anime terbaru musim ini.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}

