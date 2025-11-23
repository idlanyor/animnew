'use client';

import { useState, useEffect } from 'react';
import { getHomeData, AnimeItem, getSchedule, Schedule } from '@/lib/api';
import AnimeCard from '@/components/AnimeCard';
import TodayAnimeCarousel from '@/components/TodayAnimeCarousel';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Play, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading anime..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-yellow-500 to-blue-600 hover:from-yellow-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Today's Anime Carousel */}
      {todayAnime && todayAnime.anime_list.length > 0 && (
        <TodayAnimeCarousel
          animeList={todayAnime.anime_list}
          dayName={todayAnime.day}
        />
      )}

      {/* Ongoing Anime Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gray-950">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
              <TrendingUp className="text-yellow-500 h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Currently Airing
              </span>
            </h2>
            <Link
              href="/ongoing"
              className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium text-xs sm:text-sm lg:text-base"
            >
              View All →
            </Link>
          </div>

          {ongoingAnime.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
              {ongoingAnime.map((anime) => (
                <AnimeCard key={anime.slug} anime={anime} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-400 text-sm sm:text-base">No ongoing anime found</p>
            </div>
          )}
        </div>
      </section>

      {/* Complete Anime Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-black">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
              <Play className="text-blue-500 h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Complete Anime
              </span>
            </h2>
            <Link
              href="/complete"
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium text-xs sm:text-sm lg:text-base"
            >
              View All →
            </Link>
          </div>

          {popularAnime.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
              {popularAnime.map((anime) => (
                <AnimeCard key={anime.slug} anime={anime} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-400 text-sm sm:text-base">No complete anime found</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gray-950">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-6 sm:mb-8 lg:mb-12">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent">
              Why Choose KanataAnimeV2?
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="glass-card p-4 sm:p-6 text-center group hover:scale-105 transition-all duration-300">
              <div className="relative mx-auto mb-3 sm:mb-4">
                <div className="absolute inset-0 bg-yellow-500 blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-yellow-500 to-amber-600 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto">
                  <Play className="text-white" size={24} />
                </div>
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-2">High Quality Streaming</h3>
              <p className="text-gray-400 text-xs sm:text-sm lg:text-base">
                Watch anime in multiple resolutions including 720p HD for the best viewing experience.
              </p>
            </div>

            <div className="glass-card p-4 sm:p-6 text-center group hover:scale-105 transition-all duration-300">
              <div className="relative mx-auto mb-3 sm:mb-4">
                <div className="absolute inset-0 bg-blue-500 blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-blue-700 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="text-white" size={24} />
                </div>
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-2">Latest Episodes</h3>
              <p className="text-gray-400 text-xs sm:text-sm lg:text-base">
                Stay up to date with the latest episodes of ongoing anime series, updated regularly.
              </p>
            </div>

            <div className="glass-card p-4 sm:p-6 text-center group hover:scale-105 transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <div className="relative mx-auto mb-3 sm:mb-4">
                <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-yellow-400 to-blue-600 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto">
                  <Clock className="text-white" size={24} />
                </div>
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-2">Extensive Library</h3>
              <p className="text-gray-400 text-xs sm:text-sm lg:text-base">
                Access thousands of anime titles from classic series to the latest releases.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

