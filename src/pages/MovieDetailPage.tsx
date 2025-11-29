import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getMovieDetail, MovieDetail } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import SEOHead from '@/components/SEOHead';
import { generateMovieSEOData } from '@/lib/seo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faCalendar, faClock, faStar, faBuilding, faArrowLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

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
        setError('Gagal memuat detail movie');
        console.error('Error fetching movie detail:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchMovieDetail();
    }
  }, [slug]);

  const seoData = movie ? generateMovieSEOData({
    title: movie.data.title,
    synopsis: movie.data.synopsis.paragraphs.join(' '),
    image: movie.data.poster,
    slug: slug,
    releaseYear: movie.data.aired,
    score: movie.data.score.value,
    genres: movie.data.genreList.map(g => g.title),
  }) : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <LoadingSpinner size="lg" text="Memuat detail movie..." />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error || 'Movie tidak ditemukan'}</p>
          <Link
            to="/movie"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
          >
            Kembali ke Movie
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
              src={movie.data.poster || `https://placehold.co/800x600/1a1a1a/ffffff?text=${encodeURIComponent(movie.data.title)}`}
              alt={movie.data.title}
              className="w-full h-full object-cover object-center blur-sm scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-gray-50 dark:to-black"></div>
          </div>

          {/* Content */}
          <div className="relative max-w-7xl mx-auto px-4 pt-6 pb-8">
            {/* Back Button */}
            <Link
              to="/movie"
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
                    src={movie.data.poster || `https://placehold.co/300x400/1a1a1a/ffffff?text=${encodeURIComponent(movie.data.title)}`}
                    alt={movie.data.title}
                    className="relative w-40 sm:w-48 md:w-52 rounded-xl shadow-2xl"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left z-10">
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                  {movie.data.title}
                </h1>
                {movie.data.japanese && (
                  <p className="text-white/70 mb-4 text-sm md:text-base">{movie.data.japanese}</p>
                )}

                {/* Badges */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-5">
                  {movie.data.score && (
                    <div className="flex items-center gap-1.5 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
                      <FontAwesomeIcon icon={faStar} className="text-xs" />
                      <span>{movie.data.score.value}</span>
                    </div>
                  )}
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {movie.data.status}
                  </span>
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {movie.data.type}
                  </span>
                  {movie.data.duration && (
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                      {movie.data.duration}
                    </span>
                  )}
                </div>

                {/* Quick Info */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-white/80 text-sm mb-6">
                  {movie.data.studios && (
                    <div className="flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faBuilding} className="text-purple-400" />
                      <span>{movie.data.studios}</span>
                    </div>
                  )}
                  {movie.data.aired && (
                    <div className="flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faCalendar} className="text-blue-400" />
                      <span>{movie.data.aired}</span>
                    </div>
                  )}
                  {movie.data.duration && (
                    <div className="flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faClock} className="text-green-400" />
                      <span>{movie.data.duration}</span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                {movie.data.episodeList && movie.data.episodeList.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <Link
                      to={`/movie/watch/${movie.data.episodeList[0].episodeId}`}
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
              {movie.data.synopsis && movie.data.synopsis.paragraphs.length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
                    Sinopsis
                  </h2>
                  <div className="space-y-3">
                    {movie.data.synopsis.paragraphs.map((paragraph, index) => (
                      <p key={index} className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Episodes List */}
              {movie.data.episodeList && movie.data.episodeList.length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                      <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></span>
                      Daftar Episode
                    </h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                      {movie.data.episodeList.length} Episode
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
                    {movie.data.episodeList.map((episode) => (
                      <Link
                        key={episode.episodeId}
                        to={`/movie/watch/${episode.episodeId}`}
                        className="group flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-gray-100 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                          <FontAwesomeIcon icon={faPlay} className="text-white text-sm" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-gray-800 dark:text-white font-medium text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400 truncate">
                            Episode {episode.title}
                          </h3>
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
                  {movie.data.type && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Tipe</span>
                      <span className="text-gray-800 dark:text-white font-medium text-sm">{movie.data.type}</span>
                    </div>
                  )}
                  {movie.data.status && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Status</span>
                      <span className="text-gray-800 dark:text-white font-medium text-sm">{movie.data.status}</span>
                    </div>
                  )}
                  {movie.data.aired && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Rilis</span>
                      <span className="text-gray-800 dark:text-white font-medium text-sm">{movie.data.aired}</span>
                    </div>
                  )}
                  {movie.data.studios && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Studio</span>
                      <span className="text-gray-800 dark:text-white font-medium text-sm">{movie.data.studios}</span>
                    </div>
                  )}
                  {movie.data.duration && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Durasi</span>
                      <span className="text-gray-800 dark:text-white font-medium text-sm">{movie.data.duration}</span>
                    </div>
                  )}
                  {movie.data.score && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Skor</span>
                      <span className="text-yellow-600 dark:text-yellow-400 font-bold text-sm flex items-center gap-1">
                        <FontAwesomeIcon icon={faStar} className="text-xs" />
                        {movie.data.score.value}
                      </span>
                    </div>
                  )}
                  {movie.data.source && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Sumber</span>
                      <span className="text-gray-800 dark:text-white font-medium text-sm">{movie.data.source}</span>
                    </div>
                  )}
                  {movie.data.producers && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Produser</span>
                      <span className="text-gray-800 dark:text-white font-medium text-sm text-right max-w-[150px] truncate">{movie.data.producers}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Genres */}
              {movie.data.genreList && movie.data.genreList.length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-gradient-to-b from-pink-500 to-rose-500 rounded-full"></span>
                    Genre
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {movie.data.genreList.map((genre) => (
                      <Link
                        key={genre.genreId}
                        to={`/genre/${genre.genreId}`}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 rounded-full text-sm border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
                      >
                        {genre.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
