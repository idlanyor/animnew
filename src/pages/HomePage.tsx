import { useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { useHomeData, useSchedule } from '@/hooks/useAnimeQuery';
import AnimeCard from '@/components/AnimeCard';
import TodayAnimeCarousel from '@/components/TodayAnimeCarousel';
import LoadingSpinner from '@/components/LoadingSpinner';
import SEOHead from '@/components/SEOHead';
import { generatePageSEOData } from '@/lib/seo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faArrowTrendUp, faClock, faFire, faChevronRight, faStar, faFilm, faCalendarAlt, faBolt } from '@fortawesome/free-solid-svg-icons';

// Helper function to get current day in Indonesian
const getDayInIndonesian = (): string => {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const today = new Date().getDay();
  return days[today];
};

function HomePage() {
  // Fetch data with React Query hooks - automatic caching and deduplication
  const { data: homeData, isLoading: homeLoading, isError: homeError } = useHomeData();
  const { data: scheduleData, isLoading: scheduleLoading } = useSchedule();

  // Get today's schedule using memoization
  const todayAnime = useMemo(() => {
    if (!scheduleData) return null;
    const currentDay = getDayInIndonesian();
    return scheduleData.find(day => day.day === currentDay) || null;
  }, [scheduleData]);

  const loading = homeLoading || scheduleLoading;
  const error = homeError ? 'Failed to load anime data' : null;
  const ongoingAnime = homeData?.ongoing || [];
  const popularAnime = homeData?.complete || [];

  // Generate SEO data for home page
  const seoData = generatePageSEOData({
    title: 'KanataAnime - Nonton Anime Sub Indo HD Gratis Tanpa Iklan',
    description: 'Nonton anime sub indo gratis di KanataAnime. Platform streaming anime terbaik dengan koleksi lengkap anime ongoing, complete dan movie. Streaming anime subtitle Indonesia dengan kualitas HD 720p tanpa iklan.',
    keywords: 'kanatanime, kanata anime, antidonasi anime, nonton anime, nonton anime sub indo, streaming anime, streaming anime sub indo, anime tanpa iklan, anime gratis, anime sub indo, anime subtitle indonesia, anime ongoing, anime complete, anime movie, anime terbaru, anime terlengkap',
    url: '/',
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-200 via-gray-100 to-gray-200 dark:from-black dark:via-gray-900 dark:to-black transition-colors duration-300">
        <div className="glass-card px-8 py-6 rounded-2xl border border-gray-300 dark:border-gray-700">
          <LoadingSpinner size="lg" text="Loading anime..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-200 via-gray-100 to-gray-200 dark:from-black dark:via-gray-900 dark:to-black transition-colors duration-300">
        <div className="text-center">
          <div className="glass-card px-8 py-6 rounded-2xl border border-gray-300 dark:border-gray-700 mb-6 inline-block">
            <p className="text-red-500 text-xl mb-4">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur rounded-xl"></div>
            <div className="relative glass-card px-8 py-3 rounded-xl border border-gray-300 dark:border-gray-700 group-hover:border-purple-400/50 transition-all duration-300">
              <span className="text-gray-800 dark:text-white font-medium bg-gradient-to-r from-gray-800 to-purple-200 dark:from-white dark:to-purple-200 bg-clip-text group-hover:text-transparent transition-all">
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
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        {/* Today's Anime Carousel */}
        {todayAnime && todayAnime.anime_list.length > 0 && (
          <TodayAnimeCarousel
            animeList={todayAnime.anime_list}
            dayName={todayAnime.day}
          />
        )}

        {/* Quick Stats Section */}
        <section className="py-6 bg-white dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-100 dark:border-purple-800/30">
                <div className="p-2 rounded-lg bg-purple-500">
                  <FontAwesomeIcon icon={faFire} className="text-white w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Ongoing</p>
                  <p className="font-bold text-gray-800 dark:text-white">{ongoingAnime.length}+ Anime</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-100 dark:border-green-800/30">
                <div className="p-2 rounded-lg bg-green-500">
                  <FontAwesomeIcon icon={faStar} className="text-white w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Complete</p>
                  <p className="font-bold text-gray-800 dark:text-white">{popularAnime.length}+ Anime</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-100 dark:border-blue-800/30">
                <div className="p-2 rounded-lg bg-blue-500">
                  <FontAwesomeIcon icon={faFilm} className="text-white w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Movies</p>
                  <p className="font-bold text-gray-800 dark:text-white">500+ Film</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-100 dark:border-orange-800/30">
                <div className="p-2 rounded-lg bg-orange-500">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-white w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Update</p>
                  <p className="font-bold text-gray-800 dark:text-white">Setiap Hari</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ongoing Anime Section */}
        <section className="py-10 sm:py-14 bg-gray-50 dark:bg-black" aria-label="Anime Ongoing Terbaru">
          <div className="max-w-7xl mx-auto px-4">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500 blur-lg opacity-40"></div>
                  <div className="relative p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                    <FontAwesomeIcon icon={faBolt} className="text-white w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                    Ongoing Terbaru
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Episode baru setiap hari</p>
                </div>
              </div>
              <Link
                to="/ongoing"
                className="group flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 font-medium text-sm"
              >
                Lihat Semua
                <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Anime Grid */}
            {ongoingAnime.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
                {ongoingAnime.map((anime) => (
                  <AnimeCard key={anime.slug} anime={anime} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                <FontAwesomeIcon icon={faPlay} className="text-gray-300 dark:text-gray-600 text-5xl mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Tidak ada anime ongoing</p>
              </div>
            )}
          </div>
        </section>

        {/* Complete Anime Section */}
        <section className="py-10 sm:py-14 bg-white dark:bg-gray-900/30" aria-label="Anime Complete Sub Indo">
          <div className="max-w-7xl mx-auto px-4">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500 blur-lg opacity-40"></div>
                  <div className="relative p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                    <FontAwesomeIcon icon={faStar} className="text-white w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                    Tamat Sub Indo
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Koleksi anime lengkap</p>
                </div>
              </div>
              <Link
                to="/complete"
                className="group flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 font-medium text-sm"
              >
                Lihat Semua
                <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Anime Grid */}
            {popularAnime.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
                {popularAnime.map((anime) => (
                  <AnimeCard key={anime.slug} anime={anime} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                <FontAwesomeIcon icon={faStar} className="text-gray-300 dark:text-gray-600 text-5xl mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Tidak ada anime complete</p>
              </div>
            )}
          </div>
        </section>

        {/* Quick Navigation */}
        <section className="py-10 bg-gray-50 dark:bg-black">
          <div className="max-w-7xl mx-auto px-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 text-center">Jelajahi Lebih Banyak</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link to="/schedule" className="group p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/10">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-3 group-hover:scale-110">
                    <FontAwesomeIcon icon={faCalendarAlt} className="w-6 h-6" />
                  </div>
                  <span className="font-semibold text-gray-800 dark:text-white">Jadwal</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Rilis mingguan</span>
                </div>
              </Link>
              <Link to="/genres" className="group p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-pink-400 dark:hover:border-pink-500 hover:shadow-lg hover:shadow-pink-500/10">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-xl bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 mb-3 group-hover:scale-110">
                    <FontAwesomeIcon icon={faFire} className="w-6 h-6" />
                  </div>
                  <span className="font-semibold text-gray-800 dark:text-white">Genre</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Cari favoritmu</span>
                </div>
              </Link>
              <Link to="/movie" className="group p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-3 group-hover:scale-110">
                    <FontAwesomeIcon icon={faFilm} className="w-6 h-6" />
                  </div>
                  <span className="font-semibold text-gray-800 dark:text-white">Movie</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Film anime</span>
                </div>
              </Link>
              <Link to="/favorites" className="group p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-red-400 dark:hover:border-red-500 hover:shadow-lg hover:shadow-red-500/10">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-3 group-hover:scale-110">
                    <FontAwesomeIcon icon={faStar} className="w-6 h-6" />
                  </div>
                  <span className="font-semibold text-gray-800 dark:text-white">Favorit</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Bookmarkmu</span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-14 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900/50 dark:to-black relative overflow-hidden" aria-label="Keunggulan KanataAnime">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-200 dark:bg-purple-900/20 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-pink-200 dark:bg-pink-900/20 rounded-full blur-3xl opacity-50"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-3">
                Kenapa <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">KanataAnime</span>?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Platform streaming anime terbaik dengan berbagai keunggulan</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="group relative p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 shadow-sm hover:shadow-xl hover:shadow-purple-500/10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full"></div>
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3">
                    <FontAwesomeIcon icon={faPlay} className="text-white text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Tanpa Iklan</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    Streaming anime HD 720p tanpa gangguan iklan. Nikmati pengalaman menonton yang lancar.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group relative p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-pink-300 dark:hover:border-pink-700 shadow-sm hover:shadow-xl hover:shadow-pink-500/10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/10 to-transparent rounded-bl-full"></div>
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3">
                    <FontAwesomeIcon icon={faArrowTrendUp} className="text-white text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Update Harian</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    Episode terbaru diupdate setiap hari. Tidak ketinggalan anime favoritmu.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group relative p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-orange-300 dark:hover:border-orange-700 shadow-sm hover:shadow-xl hover:shadow-orange-500/10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-bl-full"></div>
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3">
                    <FontAwesomeIcon icon={faClock} className="text-white text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Koleksi Lengkap</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    Ribuan anime dari klasik hingga terbaru. Semua dengan subtitle Indonesia.
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

// Memoize HomePage to prevent unnecessary re-renders
export default memo(HomePage);

