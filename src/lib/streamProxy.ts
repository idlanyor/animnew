// Utility functions untuk menggunakan stream proxy dengan mudah

// Base URL untuk stream proxy API
const STREAM_PROXY_BASE = '/api/stream-proxy';

/**
 * Proxy URL stream dengan header origin palsu
 * @param url - URL yang ingin di-proxy
 * @param type - Tipe response: 'stream' | 'json' | 'text'
 * @returns Proxied URL yang bisa digunakan langsung
 */
export const getProxiedStreamUrl = (url: string, type: 'stream' | 'json' | 'text' = 'stream'): string => {
  const encodedUrl = encodeURIComponent(url);
  return `${STREAM_PROXY_BASE}?url=${encodedUrl}&type=${type}`;
};

/**
 * Fetch data melalui stream proxy
 * @param url - URL yang ingin di-fetch
 * @param options - Fetch options
 * @returns Promise dengan response data
 */
export const fetchThroughStreamProxy = async (url: string, options?: RequestInit) => {
  const proxiedUrl = getProxiedStreamUrl(url, 'json');
  
  try {
    const response = await fetch(proxiedUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching through stream proxy:', error);
    throw error;
  }
};

/**
 * POST request melalui stream proxy
 * @param url - URL target
 * @param data - Data yang akan dikirim
 * @param options - Fetch options
 * @returns Promise dengan response data
 */
export const postThroughStreamProxy = async (url: string, data?: unknown, options?: RequestInit) => {
  const encodedUrl = encodeURIComponent(url);
  const proxiedUrl = `${STREAM_PROXY_BASE}?url=${encodedUrl}`;
  
  try {
    const response = await fetch(proxiedUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error posting through stream proxy:', error);
    throw error;
  }
};

/**
 * Generate video source URL yang sudah di-proxy
 * Berguna untuk video player yang membutuhkan URL langsung
 * @param originalUrl - URL video asli
 * @returns Proxied video URL
 */
export const getProxiedVideoUrl = (originalUrl: string): string => {
  return getProxiedStreamUrl(originalUrl, 'stream');
};

/**
 * Check apakah URL perlu di-proxy berdasarkan domain
 * @param url - URL yang akan dicek
 * @returns boolean - true jika perlu proxy
 */
export const needsProxy = (url: string): boolean => {
  // Semua domain menggunakan proxy
  url;
  return true;
};

/**
 * Auto-proxy URL jika diperlukan
 * @param url - URL asli
 * @param type - Tipe response
 * @returns URL yang sudah di-proxy jika diperlukan, atau URL asli
 */
export const autoProxy = (url: string, type: 'stream' | 'json' | 'text' = 'stream'): string => {
  if (needsProxy(url)) {
    return getProxiedStreamUrl(url, type);
  }
  return url;
};

/**
 * Utility untuk video player React Player
 * @param url - URL video asli
 * @returns Config object untuk React Player
 */
export const getReactPlayerConfig = (url: string) => {
  const proxiedUrl = needsProxy(url) ? getProxiedVideoUrl(url) : url;
  
  return {
    url: proxiedUrl,
    config: {
      file: {
        attributes: {
          crossOrigin: 'anonymous',
        },
        hlsOptions: {
          xhrSetup: (xhr: XMLHttpRequest) => {
            xhr.setRequestHeader('Origin', 'https://anime.antidonasi.web.id');
            xhr.setRequestHeader('Referer', 'https://anime.antidonasi.web.id/');
          }
        }
      }
    }
  };
};

const streamProxy = {
  getProxiedStreamUrl,
  fetchThroughStreamProxy,
  postThroughStreamProxy,
  getProxiedVideoUrl,
  needsProxy,
  autoProxy,
  getReactPlayerConfig
};

export default streamProxy;