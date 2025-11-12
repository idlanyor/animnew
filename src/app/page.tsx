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
      <section className="py-16 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <TrendingUp className="text-yellow-500" />
              Currently Airing
            </h2>
            <Link
              href="/ongoing"
              className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
            >
              View All →
            </Link>
          </div>
          
          {ongoingAnime.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {ongoingAnime.map((anime) => (
                <AnimeCard key={anime.slug} anime={anime} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">No ongoing anime found</p>
            </div>
          )}
        </div>
      </section>

      {/* Complete Anime Section */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Play className="text-blue-500" />
              Complete Anime
            </h2>
            <Link
              href="/complete"
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              View All →
            </Link>
          </div>

          {popularAnime.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {popularAnime.map((anime) => (
                <AnimeCard key={anime.slug} anime={anime} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">No complete anime found</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why Choose KanataAnimeV2?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-yellow-500 to-amber-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">High Quality Streaming</h3>
              <p className="text-gray-400">
                Watch anime in multiple resolutions including 720p HD for the best viewing experience.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Latest Episodes</h3>
              <p className="text-gray-400">
                Stay up to date with the latest episodes of ongoing anime series, updated regularly.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-yellow-400 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Extensive Library</h3>
              <p className="text-gray-400">
                Access thousands of anime titles from classic series to the latest releases.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

