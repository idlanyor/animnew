import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getMovieWatch, getServerUrl, MovieWatch } from '@/lib/api';
import { useWatchHistory } from '@/contexts/WatchHistoryContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDesktop, faChevronLeft, faChevronRight, faDownload, faPlay, faHome, faServer, faCircleCheck, faTv, faMobile, faFilm } from '@fortawesome/free-solid-svg-icons';

export default function MovieWatchPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addToHistory } = useWatchHistory();

  const [movieData, setMovieData] = useState<MovieWatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [currentServer, setCurrentServer] = useState<string>('');
  const [selectedQuality, setSelectedQuality] = useState<string>('');
  const [selectedServerId, setSelectedServerId] = useState<string>('');
  const [loadingServer, setLoadingServer] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        if (!slug) throw new Error('Movie slug is required');

        const data = await getMovieWatch(slug);
        setMovieData(data);

        let defaultServerFound = false;
        if (data.data.server?.qualities) {
          const quality480p = data.data.server.qualities.find(q => q.title === '480p');
          if (quality480p?.serverList) {
            const premiumServer = quality480p.serverList.find(s =>
              s.title.toLowerCase().includes('premium')
            );
            if (premiumServer) {
              try {
                setLoadingServer(true);
                setSelectedServerId(premiumServer.serverId);
                setSelectedQuality('480p');
                const serverUrl = await getServerUrl(premiumServer.serverId);
                if (serverUrl) {
                  setCurrentServer(serverUrl);
                  defaultServerFound = true;
                }
              } catch (error) {
                console.error('Error fetching default server:', error);
              } finally {
                setLoadingServer(false);
              }
            }
          }
        }

        if (!defaultServerFound && data.data.defaultStreamingUrl) {
          setCurrentServer(data.data.defaultStreamingUrl);
          setSelectedServerId('default');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Gagal memuat movie';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (slug && slug !== 'undefined') {
      fetchMovie();
    } else {
      setError('Slug movie tidak valid');
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (currentServer) {
      setVideoError(false);
      setVideoLoading(true);
    }
  }, [currentServer]);

  // Save to watch history
  useEffect(() => {
    if (movieData) {
      addToHistory({
        slug: movieData.data.animeId,
        title: movieData.data.title,
        episodeSlug: slug,
        type: 'movie',
      });
    }
  }, [movieData, slug, addToHistory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <LoadingSpinner size="lg" text="Memuat movie..." />
      </div>
    );
  }

  if (error || !movieData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="text-center bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
          <p className="text-red-500 mb-4">{error || 'Movie tidak ditemukan'}</p>
          <Link
            to="/movie"
            className="px-5 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full font-medium inline-block"
          >
            Kembali ke Movie
          </Link>
        </div>
      </div>
    );
  }

  const handleServerChange = async (serverId: string, quality: string) => {
    try {
      setLoadingServer(true);
      setVideoLoading(true);
      setSelectedServerId(serverId);
      setSelectedQuality(quality);
      const serverUrl = await getServerUrl(serverId);
      if (serverUrl) {
        setCurrentServer(serverUrl);
      } else {
        setCurrentServer(movieData.data.defaultStreamingUrl);
      }
    } catch (error) {
      console.error('Error fetching server URL:', error);
      setCurrentServer(movieData.data.defaultStreamingUrl);
    } finally {
      setLoadingServer(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header Bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-14 sm:top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Link
                to="/movie"
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 flex-shrink-0"
              >
                <FontAwesomeIcon icon={faHome} className="w-4 h-4" />
              </Link>
              <h1 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white truncate">
                {movieData.data.title}
              </h1>
            </div>
            {/* Episode Navigation */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {movieData.data.hasPrevEpisode && movieData.data.prevEpisode ? (
                <Link
                  to={`/movie/watch/${movieData.data.prevEpisode.episodeId}`}
                  className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50"
                  title="Episode Sebelumnya"
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
                </Link>
              ) : (
                <button disabled className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed">
                  <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
                </button>
              )}
              {movieData.data.hasNextEpisode && movieData.data.nextEpisode ? (
                <Link
                  to={`/movie/watch/${movieData.data.nextEpisode.episodeId}`}
                  className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50"
                  title="Episode Selanjutnya"
                >
                  <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
                </Link>
              ) : (
                <button disabled className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed">
                  <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-3 space-y-4">
            {/* Video Container */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm">
              {/* Video Frame */}
              <div className="aspect-video bg-black relative">
                {currentServer && currentServer.startsWith('http') ? (
                  <>
                    <iframe
                      src={currentServer}
                      className="w-full h-full"
                      allowFullScreen
                      allow="autoplay; encrypted-media; accelerometer; gyroscope; picture-in-picture; fullscreen"
                      referrerPolicy="no-referrer"
                      title="Movie Player"
                      onLoad={() => {
                        setVideoLoading(false);
                        setVideoError(false);
                      }}
                      onError={() => {
                        setVideoError(true);
                        setVideoLoading(false);
                      }}
                    />
                    {videoLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                        <LoadingSpinner size="lg" text="Memuat video..." />
                      </div>
                    )}
                    {videoError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                        <div className="text-center p-6">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-900/30 flex items-center justify-center">
                            <FontAwesomeIcon icon={faDesktop} className="text-red-500 text-2xl" />
                          </div>
                          <p className="text-gray-400 mb-4">Gagal memuat video</p>
                          <button
                            onClick={() => {
                              setVideoError(false);
                              setVideoLoading(true);
                              const iframe = document.querySelector('iframe');
                              if (iframe) iframe.src = iframe.src;
                            }}
                            className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium"
                          >
                            Coba Lagi
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                    <div className="text-center p-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                        <FontAwesomeIcon icon={faDesktop} className="text-gray-500 text-2xl" />
                      </div>
                      <p className="text-gray-400 font-medium mb-1">Video tidak tersedia</p>
                      <p className="text-gray-500 text-sm">Silakan pilih server lain</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Controls Bar */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                {/* Quality Selector */}
                {movieData.data.server && movieData.data.server.qualities.length > 0 && (
                  <div className="space-y-4">
                    {movieData.data.server.qualities.map((quality) => (
                      quality.serverList.length > 0 && (
                        <div key={quality.title}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Kualitas {quality.title}:</span>
                            {selectedQuality === quality.title && !videoLoading && !videoError && (
                              <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 text-sm">
                                <FontAwesomeIcon icon={faCircleCheck} className="w-4 h-4" />
                                <span>Aktif</span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {quality.serverList.map((server) => (
                              <button
                                key={server.serverId}
                                onClick={() => handleServerChange(server.serverId, quality.title)}
                                disabled={loadingServer && selectedServerId === server.serverId}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
                                  selectedServerId === server.serverId
                                    ? 'bg-purple-600 text-white border-purple-600'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500'
                                } ${loadingServer && selectedServerId === server.serverId ? 'opacity-50' : ''}`}
                              >
                                {loadingServer && selectedServerId === server.serverId ? (
                                  <span className="flex items-center gap-1">
                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Loading
                                  </span>
                                ) : (
                                  server.title
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Episode Navigation Cards */}
            <div className="grid grid-cols-2 gap-4">
              {movieData.data.hasPrevEpisode && movieData.data.prevEpisode ? (
                <Link
                  to={`/movie/watch/${movieData.data.prevEpisode.episodeId}`}
                  className="group p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-purple-400 dark:hover:border-purple-600 flex items-center gap-3"
                >
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50">
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Sebelumnya</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">Episode Sebelumnya</p>
                  </div>
                </Link>
              ) : (
                <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 flex items-center gap-3 opacity-50">
                  <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-400">
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Sebelumnya</p>
                    <p className="text-sm font-medium text-gray-400">Tidak ada</p>
                  </div>
                </div>
              )}

              {movieData.data.hasNextEpisode && movieData.data.nextEpisode ? (
                <Link
                  to={`/movie/watch/${movieData.data.nextEpisode.episodeId}`}
                  className="group p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-purple-400 dark:hover:border-purple-600 flex items-center justify-end gap-3 text-right"
                >
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Selanjutnya</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">Episode Selanjutnya</p>
                  </div>
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50">
                    <FontAwesomeIcon icon={faChevronRight} />
                  </div>
                </Link>
              ) : (
                <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 flex items-center justify-end gap-3 text-right opacity-50">
                  <div>
                    <p className="text-xs text-gray-400">Selanjutnya</p>
                    <p className="text-sm font-medium text-gray-400">Tidak ada</p>
                  </div>
                  <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-400">
                    <FontAwesomeIcon icon={faChevronRight} />
                  </div>
                </div>
              )}
            </div>

            {/* Synopsis */}
            {movieData.data.synopsis && movieData.data.synopsis.paragraphs.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800">
                <h2 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
                  Sinopsis
                </h2>
                <div className="space-y-2">
                  {movieData.data.synopsis.paragraphs.map((paragraph, index) => (
                    <p key={index} className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Download Section */}
            {movieData.data.downloadUrl && movieData.data.downloadUrl.formats.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800">
                <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <FontAwesomeIcon icon={faDownload} className="text-green-600 dark:text-green-400 w-4 h-4" />
                  </div>
                  Download
                </h3>
                <div className="space-y-4">
                  {movieData.data.downloadUrl.formats.map((format, formatIndex) => (
                    <div key={formatIndex}>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{format.title}</p>
                      {format.qualities.map((quality, qualityIndex) => (
                        <div key={qualityIndex} className="mb-3">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{quality.title}</p>
                          <div className="flex flex-wrap gap-2">
                            {quality.urls.map((url, urlIndex) => (
                              <a
                                key={urlIndex}
                                href={url.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-600 dark:hover:text-green-400 border border-gray-200 dark:border-gray-700"
                              >
                                {url.title}
                              </a>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Info Cards */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800">
              <h3 className="font-bold text-gray-800 dark:text-white mb-4">Informasi</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
                  <FontAwesomeIcon icon={faTv} className="text-blue-500 w-5 h-5" />
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">Kualitas HD</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Multi resolusi</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30">
                  <FontAwesomeIcon icon={faMobile} className="text-green-500 w-5 h-5" />
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">Mobile Friendly</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Semua perangkat</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/30">
                  <FontAwesomeIcon icon={faServer} className="text-purple-500 w-5 h-5" />
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">Multi Server</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Backup tersedia</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detail Link */}
            <Link
              to={`/movie/${movieData.data.animeId}`}
              className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-purple-400 dark:hover:border-purple-600 group"
            >
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <FontAwesomeIcon icon={faFilm} className="text-purple-500 w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">Lihat Detail Movie</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Info lengkap & episode lain</p>
              </div>
              <FontAwesomeIcon icon={faChevronRight} className="text-gray-400 group-hover:text-purple-500" />
            </Link>

            {/* Genres */}
            {movieData.data.genreList && movieData.data.genreList.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800">
                <h3 className="font-bold text-gray-800 dark:text-white mb-3">Genre</h3>
                <div className="flex flex-wrap gap-2">
                  {movieData.data.genreList.map((genre) => (
                    <span
                      key={genre.genreId}
                      className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs border border-gray-200 dark:border-gray-700"
                    >
                      {genre.title}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
