'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getEpisode, getMirrorEpisode, getNonce, getIframe, Episode } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Play, Download, Monitor, Smartphone, Tv, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

export default function EpisodePage() {
  const params = useParams();
  const slug = params.slug as string;
  
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
        setError('Failed to load episode'+err);
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

  // NOW the early returns can happen AFTER all hooks
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoadingSpinner size="lg" text="Loading episode..." />
      </div>
    );
  }

  if (error || !episode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error || 'Episode not found'}</p>
          <Link 
            href="/" 
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
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Home
            </Link>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {episode.judul}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900 rounded-lg overflow-hidden mb-6">
              {/* Quality Selector */}
              <div className="bg-gray-800 p-4 border-b border-gray-700">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <h2 className="text-white font-semibold">Video Player</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">Quality:</span>
                    <div className="flex gap-1">
                      {['360p', '480p', '720p'].map((quality) => (
                        <button
                          key={quality}
                          onClick={() => {
                            setSelectedQuality(quality as '360p' | '480p' | '720p');
                            setSelectedServer(0);
                          }}
                          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                            selectedQuality === quality
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {quality}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Frame */}
              <div className="aspect-video bg-black relative">
                {loadingVideo ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <LoadingSpinner size="lg" text="Loading video..." />
                  </div>
                ) : episode.iframe ? (
                  <iframe
                    src={episode.iframe}
                    className="w-full h-full"
                    allowFullScreen
                    title={episode.judul}
                  />
                ) : videoUrl ? (
                  <iframe
                    src={videoUrl}
                    className="w-full h-full"
                    allowFullScreen
                    title={episode.judul}
                  />
                ) : mirrors.length > 0 && mirrors[selectedServer] ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Play className="text-blue-500 mx-auto mb-4" size={64} />
                      <p className="text-white mb-4">
                        Server: {mirrors[selectedServer].nama}
                      </p>
                      <p className="text-gray-400 text-sm mb-4">
                        Quality: {selectedQuality}
                      </p>
                      <button
                        onClick={() => loadVideoFromServer(mirrors[selectedServer].content)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Load Video
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Monitor className="text-gray-500 mx-auto mb-4" size={64} />
                      <p className="text-gray-400">No video source available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Server Selector and Episode Navigation */}
              {mirrors.length > 0 && (
                <div className="bg-gray-800 p-4 border-t border-gray-700">
                  <div className="flex flex-wrap justify-between items-center mb-3">
                    <h3 className="text-white font-medium">Available Servers ({selectedQuality})</h3>
                    
                    {/* Episode Navigation (Next to Servers) */}
                    <div className="flex items-center gap-2">
                      {previousEpisodeSlug ? (
                        <Link
                          href={`/episode/${previousEpisodeSlug}`}
                          className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors"
                        >
                          <ChevronLeft size={18} />
                          Previous
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="inline-flex items-center gap-1 bg-gray-700 text-gray-400 px-3 py-2 rounded-lg cursor-not-allowed"
                        >
                          <ChevronLeft size={18} />
                          Previous
                        </button>
                      )}
                      
                      {nextEpisodeSlug ? (
                        <Link
                          href={`/episode/${nextEpisodeSlug}`}
                          className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors"
                        >
                          Next
                          <ChevronRight size={18} />
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="inline-flex items-center gap-1 bg-gray-700 text-gray-400 px-3 py-2 rounded-lg cursor-not-allowed"
                        >
                          Next
                          <ChevronRight size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {mirrors.map((mirror, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedServer(index)}
                        className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                          selectedServer === index
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {mirror.nama}
                      </button>
                    ))}
                  </div>
                  
                  {/* Status indicator */}
                  <div className="mt-3 text-sm text-gray-400">
                    Current: {mirrors[selectedServer]?.nama} - {selectedQuality}
                    {videoUrl && <span className="text-green-400 ml-2">✓ Video loaded</span>}
                  </div>
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Episode Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Tv className="text-blue-500 mx-auto mb-2" size={32} />
                  <h3 className="text-white font-medium">HD Quality</h3>
                  <p className="text-gray-400 text-sm">Multiple resolutions available</p>
                </div>
                <div className="text-center">
                  <Smartphone className="text-green-500 mx-auto mb-2" size={32} />
                  <h3 className="text-white font-medium">Mobile Friendly</h3>
                  <p className="text-gray-400 text-sm">Optimized for all devices</p>
                </div>
                <div className="text-center">
                  <Download className="text-purple-500 mx-auto mb-2" size={32} />
                  <h3 className="text-white font-medium">Download Available</h3>
                  <p className="text-gray-400 text-sm">Multiple download options</p>
                </div>
              </div>
              
              {/* Episode Navigation (Bottom) */}
              <div className="mt-8 flex justify-center gap-4">
                {previousEpisodeSlug ? (
                  <Link
                    href={`/episode/${previousEpisodeSlug}`}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <ChevronLeft size={20} />
                    Previous Episode
                  </Link>
                ) : (
                  <button
                    disabled
                    className="inline-flex items-center gap-2 bg-gray-700 text-gray-400 px-4 py-2 rounded-lg cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                    Previous Episode
                  </button>
                )}
                
                {nextEpisodeSlug ? (
                  <Link
                    href={`/episode/${nextEpisodeSlug}`}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Next Episode
                    <ChevronRight size={20} />
                  </Link>
                ) : (
                  <button
                    disabled
                    className="inline-flex items-center gap-2 bg-gray-700 text-gray-400 px-4 py-2 rounded-lg cursor-not-allowed"
                  >
                    Next Episode
                    <ChevronRight size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Download Section */}
            <div className="bg-gray-900 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Download className="text-green-500" />
                Download Links
              </h3>
              
              <div className="space-y-4">
                {downloads.length > 0 ? (
                  downloads.map((download, index) => (
                    <a
                      key={index}
                      href={download.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-green-600 hover:bg-green-700 text-white text-center py-3 px-4 rounded-lg transition-colors font-medium"
                    >
                      {download.nama} ({selectedQuality})
                    </a>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">
                    No download links available for {selectedQuality}
                  </p>
                )}
              </div>
            </div>

            {/* Quality Info */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quality Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">360p</span>
                  <span className="text-white">Mobile</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">480p</span>
                  <span className="text-white">Standard</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">720p</span>
                  <span className="text-yellow-500 font-semibold">HD</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-900/30 rounded-lg border border-blue-700">
                <p className="text-blue-300 text-sm">
                  💡 Tip: Use 720p for the best viewing experience on larger screens.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

