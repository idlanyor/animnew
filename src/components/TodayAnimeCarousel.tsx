import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faCalendar } from '@fortawesome/free-solid-svg-icons';

interface AnimeItem {
  anime_name: string;
  slug: string;
  poster: string;
  url: string;
}

interface TodayAnimeCarouselProps {
  animeList: AnimeItem[];
  dayName: string;
}

export default function TodayAnimeCarousel({ animeList, dayName }: TodayAnimeCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % animeList.length);
  }, [animeList.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + animeList.length) % animeList.length);
  }, [animeList.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || animeList.length <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, animeList.length]);

  if (animeList.length === 0) {
    return null;
  }

  const currentAnime = animeList[currentIndex];

  return (
    <section className="relative bg-gray-900 overflow-hidden">
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={currentAnime.poster}
          alt={currentAnime.anime_name}
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Poster */}
          <div className="flex-shrink-0">
            <Link
              to={`/anime/${currentAnime.slug}`}
              className="block relative w-40 h-56 md:w-48 md:h-72 rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
            >
              <img
                src={currentAnime.poster}
                alt={currentAnime.anime_name}
                className="w-full h-full object-cover"
              />
            </Link>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <FontAwesomeIcon icon={faCalendar} className="text-yellow-400 text-lg" />
              <span className="text-yellow-400 font-semibold text-base">
                Anime Rilis Hari Ini - {dayName}
              </span>
            </div>

            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
              {currentAnime.anime_name}
            </h2>

            <Link
              to={`/anime/${currentAnime.slug}`}
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Tonton Sekarang
            </Link>
          </div>
        </div>

        {/* Navigation Arrows */}
        {animeList.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              aria-label="Previous anime"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="text-lg" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              aria-label="Next anime"
            >
              <FontAwesomeIcon icon={faChevronRight} className="text-lg" />
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {animeList.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {animeList.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-yellow-400 w-6'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
