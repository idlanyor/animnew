'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

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
    <section className="relative bg-gradient-to-r from-yellow-500 via-amber-500 to-blue-600 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={currentAnime.poster}
          alt={currentAnime.anime_name}
          fill
          className="object-cover opacity-20 blur-sm"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Poster */}
          <div className="flex-shrink-0">
            <Link
              href={`/anime/${currentAnime.slug}`}
              className="block relative w-48 h-64 md:w-64 md:h-96 rounded-lg overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300"
            >
              <Image
                src={currentAnime.poster}
                alt={currentAnime.anime_name}
                fill
                className="object-cover"
                priority
              />
            </Link>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <Calendar className="text-yellow-300" size={24} />
              <span className="text-yellow-300 font-semibold text-lg">
                Anime Rilis Hari Ini - {dayName}
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
              {currentAnime.anime_name}
            </h2>

            <Link
              href={`/anime/${currentAnime.slug}`}
              className="inline-block bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
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
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              aria-label="Next anime"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {animeList.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {animeList.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-yellow-400 w-8'
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
