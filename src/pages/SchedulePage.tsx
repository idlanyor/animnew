'use client';

import { useState, useEffect } from 'react';
import { getSchedule, Schedule } from '@/lib/api';
import { Link } from 'react-router-dom';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faChevronRight } from '@fortawesome/free-solid-svg-icons';

export default function SchedulePage() {
  const [scheduleData, setScheduleData] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const data = await getSchedule();
        setScheduleData(data);
      } catch (err) {
        setError('Failed to load anime schedule');
        console.error('Error fetching schedule:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <LoadingSpinner size="lg" text="Loading schedule..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8 space-x-2">
          <FontAwesomeIcon icon={faCalendar} className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Anime Schedule</h1>
        </div>

        <div className="grid gap-8">
          {scheduleData.map((day) => (
            <div key={day.day} className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md dark:shadow-lg border border-gray-200 dark:border-gray-800">
              <div className="bg-blue-600 px-6 py-3">
                <h2 className="text-xl font-bold text-white">{day.day}</h2>
              </div>
              <div className="p-6">
                {day.anime_list.length > 0 ? (
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {day.anime_list.map((anime) => (
                      <Link
                        key={anime.slug}
                        to={`/anime/${anime.slug}`}
                        className="flex items-center gap-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-800 group border border-gray-200 dark:border-gray-700"
                      >
                        <div className="relative w-16 h-20 flex-shrink-0 rounded overflow-hidden">
                          <img
                            src={anime.poster || '/placeholder.png'}
                            alt={anime.anime_name}
                            className="object-cover"
                            style={{ width: '64px', height: '80px' }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-gray-700 dark:text-gray-200 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
                            {anime.anime_name}
                          </h3>
                        </div>
                        <FontAwesomeIcon icon={faChevronRight} className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex-shrink-0" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 text-center py-4">No anime scheduled for this day</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}