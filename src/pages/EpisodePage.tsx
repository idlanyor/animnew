
import { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getEpisode, getMirrorEpisode, getNonce, getIframe, Episode } from '@/lib/api';
import { useWatchHistory } from '@/contexts/WatchHistoryContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faDownload, faDesktop, faMobile, faTv, faArrowLeft, faChevronLeft, faChevronRight, faServer, faCircleCheck, faHome } from '@fortawesome/free-solid-svg-icons';

export default function EpisodePage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addToHistory } = useWatchHistory();

  const [episode, setEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<'360p' | '480p' | '720p'>('720p');
  const [selectedServer, setSelectedServer] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [loadingVideo, setLoadingVideo] = useState(false);

  // Helper functions
  const getEpisodeNumber = (episodeSlug: string): number => {
    const match = episodeSlug.match(/(?:episode-|ep-)([0-9]+)/i);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    return 0;
  };

  const currentEpisodeNumber = getEpisodeNumber(slug);

  const getPreviousEpisodeSlug = (): string | null => {
    if (currentEpisodeNumber <= 1) return null;
    return slug.replace(/(?:episode-|ep-)([0-9]+)/i, (match, number) => {
      return match.replace(number, (currentEpisodeNumber - 1).toString());
    });
  };

  const getNextEpisodeSlug = (): string | null => {
    if (currentEpisodeNumber < 1) return null;
    return slug.replace(/(?:episode-|ep-)([0-9]+)/i, (match, number) => {
      return match.replace(number, (currentEpisodeNumber + 1).toString());
    });
  };

  const previousEpisodeSlug = getPreviousEpisodeSlug();
  const nextEpisodeSlug = getNextEpisodeSlug();

  // Function definitions
  const loadVideoFromServer = async (content: string) => {
    try {
      setLoadingVideo(true);
      const nonceData = await getNonce(); // Remove the content parameter
      if (nonceData) {
        const iframeData = await getIframe(content, nonceData); // Pass content and nonce separately
        if (iframeData) {
          setVideoUrl(iframeData);
        }
      }
    } catch (error) {
      console.error('Error loading video:', error);
    } finally {
      setLoadingVideo(false);
    }
  };

  const getCurrentMirrors = useCallback(() => {
    if (!episode) return [];
    switch (selectedQuality) {
      case '360p':
        return episode.mirror.m360p || [];
      case '480p':
        return episode.mirror.m480p || [];
      case '720p':
        return episode.mirror.m720p || [];
      default:
        return [];
    }
  }, [episode, selectedQuality]);

  const getCurrentDownloads = () => {
    if (!episode) return [];
    switch (selectedQuality) {
      case '360p':
        return episode.download.d360pmp4 || [];
      case '480p':
        return episode.download.d480pmp4 || [];
      case '720p':
        return episode.download.d720pmp4 || [];
      default:
        return [];
    }
  };

  // ALL useEffect HOOKS MUST BE HERE - BEFORE ANY EARLY RETURNS
  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        setLoading(true);
        let data: Episode;

        try {
          data = await getEpisode(slug);
        } catch (err) {
          console.error('Error fetching episode:', err);
          data = await getMirrorEpisode(slug);
        }

        setEpisode(data);
      } catch (err) {
        setError('Failed to load episode' + err);
        console.error('Error fetching episode:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchEpisode();
    }
  }, [slug]);

  // Effect untuk memuat video ketika server atau quality berubah
  useEffect(() => {
    if (episode) {
      const mirrors = getCurrentMirrors();
      if (mirrors.length > 0 && mirrors[selectedServer]) {
        const selectedMirror = mirrors[selectedServer];
        if (selectedMirror.content) {
          loadVideoFromServer(selectedMirror.content);
        }
      }
    }
  }, [episode, selectedServer, selectedQuality, getCurrentMirrors]);

  // Save to watch history
  useEffect(() => {
    if (episode) {
      const animeSlug = slug.replace(/-episode-\d+$/i, '');
      addToHistory({
        slug: animeSlug,
        title: episode.judul,
        episode: `Episode ${currentEpisodeNumber}`,
        episodeSlug: slug,
        type: 'anime',
      });
    }
  }, [episode, slug, currentEpisodeNumber, addToHistory]);

  // NOW the early returns can happen AFTER all hooks
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <LoadingSpinner size="lg" text="Loading episode..." />
      </div>
    );
  }

  if (error || !episode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error || 'Episode not found'}</p>
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Now we can safely call these functions after the early returns
  const mirrors = getCurrentMirrors();
  const downloads = getCurrentDownloads();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header Bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-14 sm:top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Link
                to="/"
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 flex-shrink-0"
              >
                <FontAwesomeIcon icon={faHome} className="w-4 h-4" />
              </Link>
              <h1 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white truncate">
                {episode.judul}
              </h1>
            </div>
            {/* Episode Navigation */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {previousEpisodeSlug ? (
                <Link
                  to={`/episode/${previousEpisodeSlug}`}
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
              {nextEpisodeSlug ? (
                <Link
                  to={`/episode/${nextEpisodeSlug}`}
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
                {loadingVideo ? (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                    <LoadingSpinner size="lg" text="Memuat video..." />
                  </div>
                ) : episode.iframe && episode.iframe.startsWith('http') ? (
                  <iframe
                    src={episode.iframe}
                    className="w-full h-full"
                    allowFullScreen
                    allow="autoplay; encrypted-media; accelerometer; gyroscope; picture-in-picture; fullscreen"
                    referrerPolicy="no-referrer"
                    title={episode.judul}
                  />
                ) : videoUrl && videoUrl.startsWith('http') ? (
                  <iframe
                    src={videoUrl}
                    className="w-full h-full"
                    allowFullScreen
                    allow="autoplay; encrypted-media; accelerometer; gyroscope; picture-in-picture; fullscreen"
                    referrerPolicy="no-referrer"
                    title={episode.judul}
                  />
                ) : mirrors.length > 0 && mirrors[selectedServer] ? (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                    <div className="text-center p-6">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <FontAwesomeIcon icon={faPlay} className="text-white text-3xl ml-1" />
                      </div>
                      <p className="text-white font-medium mb-1">{mirrors[selectedServer].nama}</p>
                      <p className="text-gray-400 text-sm mb-4">{selectedQuality}</p>
                      <button
                        onClick={() => loadVideoFromServer(mirrors[selectedServer].content)}
                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-full"
                      >
                        Putar Video
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                    <div className="text-center p-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                        <FontAwesomeIcon icon={faDesktop} className="text-gray-500 text-2xl" />
                      </div>
                      <p className="text-gray-400 font-medium mb-1">Video tidak tersedia</p>
                      <p className="text-gray-500 text-sm">Silakan pilih server lain atau kualitas berbeda</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Controls Bar */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                {/* Quality Selector */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Kualitas:</span>
                    <div className="flex gap-1">
                      {['360p', '480p', '720p'].map((quality) => (
                        <button
                          key={quality}
                          onClick={() => {
                            setSelectedQuality(quality as '360p' | '480p' | '720p');
                            setSelectedServer(0);
                          }}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium ${selectedQuality === quality
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                        >
                          {quality}
                        </button>
                      ))}
                    </div>
                  </div>
                  {videoUrl && (
                    <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 text-sm">
                      <FontAwesomeIcon icon={faCircleCheck} className="w-4 h-4" />
                      <span>Video aktif</span>
                    </div>
                  )}
                </div>

                {/* Server Selector */}
                {mirrors.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FontAwesomeIcon icon={faServer} className="text-gray-500 w-4 h-4" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Server ({mirrors.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {mirrors.map((mirror, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedServer(index)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${selectedServer === index
                              ? 'bg-purple-600 text-white border-purple-600'
                              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500'
                            }`}
                        >
                          {mirror.nama}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Episode Navigation Cards */}
            <div className="grid grid-cols-2 gap-4">
              {previousEpisodeSlug ? (
                <Link
                  to={`/episode/${previousEpisodeSlug}`}
                  className="group p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-purple-400 dark:hover:border-purple-600 flex items-center gap-3"
                >
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50">
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Sebelumnya</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">Episode {currentEpisodeNumber - 1}</p>
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

              {nextEpisodeSlug ? (
                <Link
                  to={`/episode/${nextEpisodeSlug}`}
                  className="group p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-purple-400 dark:hover:border-purple-600 flex items-center justify-end gap-3 text-right"
                >
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Selanjutnya</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">Episode {currentEpisodeNumber + 1}</p>
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
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Download Section */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
              <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <FontAwesomeIcon icon={faDownload} className="text-green-600 dark:text-green-400 w-4 h-4" />
                </div>
                Download {selectedQuality}
              </h3>

              <div className="space-y-2">
                {downloads.length > 0 ? (
                  downloads.map((download, index) => (
                    <a
                      key={index}
                      href={download.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-600 group"
                    >
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400">{download.nama}</span>
                      <FontAwesomeIcon icon={faDownload} className="text-gray-400 group-hover:text-green-500 w-4 h-4" />
                    </a>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                    Tidak ada link download untuk {selectedQuality}
                  </p>
                )}
              </div>
            </div>

            {/* Info Cards */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm">
              <h3 className="font-bold text-gray-800 dark:text-white mb-4">Informasi</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
                  <FontAwesomeIcon icon={faTv} className="text-blue-500 w-5 h-5" />
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">Kualitas HD</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">360p, 480p, 720p</p>
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
                    <p className="text-xs text-gray-500 dark:text-gray-400">{mirrors.length} server tersedia</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

