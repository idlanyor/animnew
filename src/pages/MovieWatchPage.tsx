'use client';

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getMovieWatch, getServerUrl, MovieWatch } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDesktop, faArrowLeft, faChevronLeft, faChevronRight, faDownload, faPlay, faFilm } from '@fortawesome/free-solid-svg-icons';

export default function MovieWatchPage() {
  const params = useParams();
  const slug = params.slug as string;

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

        if (!slug) {
          throw new Error('Movie slug is required');
        }

        const data = await getMovieWatch(slug);
        setMovieData(data);

        // Find and set Premium 480p as default server
        let defaultServerFound = false;

        if (data.data.server?.qualities) {
          // Look for 480p quality
          const quality480p = data.data.server.qualities.find(q => q.title === '480p');

          if (quality480p?.serverList) {
            // Look for Premium server in 480p
            const premiumServer = quality480p.serverList.find(s =>
              s.title.toLowerCase().includes('premium')
            );

            if (premiumServer) {
              try {
                setLoadingServer(true);
                setSelectedServerId(premiumServer.serverId);
                setSelectedQuality('480p');

                // Fetch server URL
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

        // Fallback to default streaming URL if Premium 480p not found
        if (!defaultServerFound && data.data.defaultStreamingUrl) {
          setCurrentServer(data.data.defaultStreamingUrl);
          setSelectedServerId('default');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load movie';
        setError(errorMessage);
        console.error('Error fetching movie:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug && slug !== 'undefined') {
      fetchMovie();
    } else {
      setError('Invalid movie slug');
      setLoading(false);
    }
  }, [slug]);

  // Set iframe mode when movie data changes
  useEffect(() => {
    if (currentServer) {
      setVideoError(false);
      setVideoLoading(true);
    }
  }, [currentServer]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoadingSpinner size="lg" text="Loading movie..." />
      </div>
    );
  }

  if (error || !movieData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error || 'Movie not found'}</p>
          <Link
            to="/movie"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
            <Link
              to="/movie"
              className="inline-flex items-center gap-1.5 sm:gap-2 text-yellow-400 hover:text-yellow-300 transition-colors text-sm sm:text-base touch-manipulation active:scale-95"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-[18px] sm:w-5 sm:h-5" />
              <span className="sm:inline">Back to Movies</span>
            </Link>
            <Link
              to={`/movie/${movieData.data.animeId}`}
              className="inline-flex items-center gap-1.5 sm:gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm sm:text-base touch-manipulation active:scale-95"
            >
              <FontAwesomeIcon icon={faFilm} className="text-[18px] sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">View Movie Details</span>
              <span className="sm:hidden">Details</span>
            </Link>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight line-clamp-2">
            {movieData.data.title}
          </h1>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg mt-1 sm:mt-2">
            Released: {movieData.data.releasedOn}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {/* Video Player */}
          <div className="lg:col-span-3 order-1">
            <div className="bg-gray-900 rounded-lg overflow-hidden mb-4 sm:mb-6">
              {/* Quality Indicator */}
              {selectedQuality && (
                <div className="bg-gray-800 px-3 sm:px-4 py-2 flex items-center justify-between">
                  <span className="text-gray-400 text-xs sm:text-sm">Currently Playing:</span>
                  <span className="text-yellow-400 font-semibold text-xs sm:text-sm">{selectedQuality}</span>
                </div>
              )}
              <div className="aspect-video bg-black relative">
                {currentServer ? (
                  <>
                    <iframe
                      src={currentServer}
                      className="w-full h-full"
                      allowFullScreen
                      allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                      referrerPolicy="no-referrer"
                      sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation"
                      title="Movie Player"
                      onLoad={() => {
                        setVideoLoading(false);
                        setVideoError(false);
                      }}
                      onError={() => {
                        setVideoError(true);
                        setVideoLoading(false);
                      }}
                      style={{
                        backgroundColor: '#000',
                        width: '100%',
                        height: '100%',
                        border: 'none'
                      }}
                    />

                    {/* Video Loading Overlay */}
                    {videoLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                        <div className="flex items-center gap-3 text-white">
                          <LoadingSpinner size="sm" />
                          <span>Loading video...</span>
                        </div>
                      </div>
                    )}

                    {/* Video Error Overlay */}
                    {videoError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10">
                        <div className="text-center text-white">
                          <FontAwesomeIcon icon={faDesktop} className="text-red-500 mx-auto mb-4 text-[64px]" />
                          <p className="text-red-400 mb-4">Failed to load video</p>
                          <button
                            onClick={() => {
                              setVideoError(false);
                              setVideoLoading(true);
                              const iframe = document.querySelector('iframe');
                              if (iframe) {
                                iframe.src = iframe.src;
                              }
                            }}
                            className="bg-gradient-to-r from-yellow-500 to-blue-600 hover:from-yellow-600 hover:to-blue-700 px-4 py-2 rounded-lg transition-colors"
                          >
                            Retry Video
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <FontAwesomeIcon icon={faDesktop} className="text-gray-500 mx-auto mb-4 text-[64px]" />
                      <p className="text-gray-400">No video source available</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Server Selection */}
            {movieData.data.server && movieData.data.server.qualities.length > 0 && (
              <div className="bg-gray-900 rounded-lg p-4 sm:p-5 md:p-6 mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Select Server & Quality</h2>
                <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
                  Click a server button below to change video quality or try a different server if the current one isn&apos;t working.
                </p>
                <div className="space-y-3 sm:space-y-4">
                  {movieData.data.server.qualities.map((quality) => (
                    quality.serverList.length > 0 && (
                      <div key={quality.title}>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-300 mb-2">{quality.title}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                          {quality.serverList.map((server) => (
                            <button
                              key={server.serverId}
                              onClick={async () => {
                                try {
                                  setLoadingServer(true);
                                  setVideoLoading(true);
                                  setSelectedServerId(server.serverId);
                                  setSelectedQuality(quality.title);

                                  // Fetch server URL from API
                                  const serverUrl = await getServerUrl(server.serverId);

                                  if (serverUrl) {
                                    setCurrentServer(serverUrl);
                                  } else {
                                    // Fallback to default URL if server fetch fails
                                    setCurrentServer(movieData.data.defaultStreamingUrl);
                                  }
                                } catch (error) {
                                  console.error('Error fetching server URL:', error);
                                  // Fallback to default URL on error
                                  setCurrentServer(movieData.data.defaultStreamingUrl);
                                } finally {
                                  setLoadingServer(false);
                                }
                              }}
                              disabled={loadingServer && selectedServerId === server.serverId}
                              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all text-xs sm:text-sm font-medium touch-manipulation active:scale-95 ${selectedServerId === server.serverId
                                ? 'bg-gradient-to-r from-yellow-500 to-blue-600 text-white'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                } ${loadingServer && selectedServerId === server.serverId ? 'opacity-50 cursor-wait' : ''}`}
                            >
                              {loadingServer && selectedServerId === server.serverId ? (
                                <>
                                  <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                                  <span>Loading...</span>
                                </>
                              ) : (
                                <>
                                  <FontAwesomeIcon icon={faPlay} className="text-[14px] inline mr-1" />
                                  {server.title}
                                </>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Episode Navigation */}
            <div className="bg-gray-900 rounded-lg p-4 sm:p-5 md:p-6 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Episode Navigation</h2>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
                {movieData.data.hasPrevEpisode && movieData.data.prevEpisode && (
                  <Link
                    to={`/movie/watch/${movieData.data.prevEpisode.episodeId}`}
                    className="flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-yellow-500 to-blue-600 hover:from-yellow-600 hover:to-blue-700 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all text-xs sm:text-sm font-medium touch-manipulation active:scale-95"
                  >
                    <FontAwesomeIcon icon={faChevronLeft} className="text-[16px] sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Previous Episode</span>
                    <span className="sm:hidden">Previous</span>
                  </Link>
                )}
                {movieData.data.hasNextEpisode && movieData.data.nextEpisode && (
                  <Link
                    to={`/movie/watch/${movieData.data.nextEpisode.episodeId}`}
                    className="flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-yellow-500 to-blue-600 hover:from-yellow-600 hover:to-blue-700 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all text-xs sm:text-sm font-medium touch-manipulation active:scale-95"
                  >
                    <span className="hidden sm:inline">Next Episode</span>
                    <span className="sm:hidden">Next</span>
                    <FontAwesomeIcon icon={faChevronRight} className="text-[16px] sm:w-5 sm:h-5" />
                  </Link>
                )}
                {!movieData.data.hasPrevEpisode && !movieData.data.hasNextEpisode && (
                  <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">This is a standalone movie</p>
                )}
              </div>
            </div>

            {/* Download Links */}
            {movieData.data.downloadUrl && movieData.data.downloadUrl.formats.length > 0 && (
              <div className="bg-gray-900 rounded-lg p-4 sm:p-5 md:p-6 mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={faDownload} className="text-[20px] sm:w-6 sm:h-6 text-yellow-400" />
                  Download Options
                </h2>
                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                  {movieData.data.downloadUrl.formats.map((format, formatIndex) => (
                    <div key={formatIndex}>
                      <h3 className="text-base sm:text-lg font-semibold text-yellow-400 mb-2 sm:mb-3">{format.title}</h3>
                      <div className="space-y-3 sm:space-y-4">
                        {format.qualities.map((quality, qualityIndex) => (
                          <div key={qualityIndex} className="bg-gray-800 rounded-lg p-3 sm:p-4">
                            <h4 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3">{quality.title}</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                              {quality.urls.map((url, urlIndex) => (
                                <a
                                  key={urlIndex}
                                  href={url.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-xs sm:text-sm transition-all text-center font-medium touch-manipulation active:scale-95"
                                >
                                  {url.title}
                                </a>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Synopsis */}
            {movieData.data.synopsis && movieData.data.synopsis.paragraphs.length > 0 && (
              <div className="bg-gray-900 rounded-lg p-4 sm:p-5 md:p-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4">Synopsis</h2>
                {movieData.data.synopsis.paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-gray-300 text-sm sm:text-base leading-relaxed mb-2 sm:mb-3">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 order-2">
            {/* Episode Poster */}
            {movieData.data.poster && (
              <div className="bg-gray-900 rounded-lg p-4 sm:p-5 md:p-6 mb-4 sm:mb-6">
                <div className="aspect-[3/4] relative rounded-lg overflow-hidden">
                  <img
                    src={movieData.data.poster}
                    alt={movieData.data.title}
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* Episode Details */}
            <div className="bg-gray-900 rounded-lg p-4 sm:p-5 md:p-6 mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Episode Details</h3>
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-gray-400 text-xs sm:text-sm">Status:</span>
                  <span className="text-green-400 text-right text-xs sm:text-sm">{movieData.status}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-400 text-xs sm:text-sm">Released:</span>
                  <span className="text-white text-right text-xs sm:text-sm">{movieData.data.releasedOn}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-400 text-xs sm:text-sm">Anime:</span>
                  <Link
                    to={`/movie/${movieData.data.animeId}`}
                    className="text-yellow-400 hover:text-yellow-300 text-right transition-colors text-xs sm:text-sm touch-manipulation"
                  >
                    View Series
                  </Link>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-400 text-xs sm:text-sm">Player:</span>
                  <span className={`text-right text-xs sm:text-sm ${!videoLoading && !videoError ? 'text-green-400' :
                    videoError ? 'text-red-400' :
                      'text-yellow-400'
                    }`}>
                    {!videoLoading && !videoError ? 'Ready' : videoError ? 'Error' : 'Loading'}
                  </span>
                </div>
              </div>
            </div>

            {/* Genres */}
            {movieData.data.genreList && movieData.data.genreList.length > 0 && (
              <div className="bg-gray-900 rounded-lg p-4 sm:p-5 md:p-6 mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Genres</h3>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {movieData.data.genreList.map((genre) => (
                    <span
                      key={genre.genreId}
                      className="bg-gray-700 text-gray-300 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm"
                    >
                      {genre.title}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Episodes */}
            {movieData.data.recommendedEpisodeList && movieData.data.recommendedEpisodeList.length > 0 && (
              <div className="bg-gray-900 rounded-lg p-4 sm:p-5 md:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Recommended</h3>
                <div className="space-y-2.5 sm:space-y-3">
                  {movieData.data.recommendedEpisodeList.slice(0, 5).map((episode, index) => (
                    <Link
                      key={`${episode.episodeId}-${index}`}
                      to={`/movie/watch/${episode.episodeId}`}
                      className="block group touch-manipulation active:scale-98"
                    >
                      <div className="flex gap-2 sm:gap-3">
                        <div className="w-16 h-24 sm:w-20 sm:h-28 relative flex-shrink-0 rounded overflow-hidden">
                          <img
                            src={episode.poster}
                            alt={episode.title}
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white text-xs sm:text-sm font-medium group-hover:text-yellow-400 transition-colors line-clamp-2 leading-snug">
                            {episode.title}
                          </h4>
                          <p className="text-gray-400 text-[10px] sm:text-xs mt-1">{episode.releaseDate}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Movies */}
        {movieData.data.movie && movieData.data.movie.animeList.length > 0 && (
          <div className="mt-8 sm:mt-10 md:mt-12">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-5 md:mb-6">More Movies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
              {movieData.data.movie.animeList.slice(0, 6).map((anime, index) => (
                <Link
                  key={`${anime.animeId}-${index}`}
                  to={`/movie/${anime.animeId}`}
                  className="group block touch-manipulation"
                >
                  <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 active:scale-95">
                    <div className="aspect-[2/3] sm:aspect-[3/4] relative overflow-hidden">
                      <img
                        src={anime.poster}
                        alt={anime.title}
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                      />
                    </div>
                    <div className="p-2 sm:p-2.5 md:p-3">
                      <h3 className="text-white font-semibold text-xs sm:text-sm line-clamp-2 group-hover:text-yellow-400 transition-colors leading-tight">
                        {anime.title}
                      </h3>
                      <p className="text-gray-400 text-[10px] sm:text-xs mt-0.5 sm:mt-1">{anime.releaseDate}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
