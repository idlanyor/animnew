import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// Axios instance dengan header palsu untuk bypass CORS
const axiosProxy = axios.create({
  timeout: 30000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'cross-site'
  }
});

// Interceptor untuk menambahkan header origin palsu
axiosProxy.interceptors.request.use((config) => {
  // Set fake origin dan referer berdasarkan target URL
  const targetUrl = config.url;
  
  if (targetUrl?.includes('short.icu') || targetUrl?.includes('abyss.to') || targetUrl?.includes('vidhidefast.com') || targetUrl?.includes('abysscdn.com') || targetUrl?.includes('dinisglows.com') || targetUrl?.includes('helvid.net') || targetUrl?.includes('ok.ru') || targetUrl?.includes('geo.dailymotion.com') || targetUrl?.includes('vidhidepre.com')) {
    config.headers['Origin'] = 'https://anime.antidonasi.web.id';
    config.headers['Referer'] = 'https://anime.antidonasi.web.id/';
  } else if (targetUrl?.includes('animasu')) {
    config.headers['Origin'] = 'https://v1.animasu.top';
    config.headers['Referer'] = 'https://v1.animasu.top/';
  } else {
    // Default fallback
    config.headers['Origin'] = 'https://anime.antidonasi.web.id';
    config.headers['Referer'] = 'https://anime.antidonasi.web.id/';
  }
  
  return config;
});

// Function untuk proxy stream URL dengan axios
export const proxyStreamUrl = async (url: string, options?: AxiosRequestConfig): Promise<AxiosResponse> => {
  try {
    const response = await axiosProxy.get(url, {
      responseType: 'stream',
      ...options
    });
    return response;
  } catch (error) {
    console.error('Error proxying stream URL:', error);
    throw error;
  }
};

// Function untuk proxy JSON/text response
export const proxyApiCall = async (url: string, options?: AxiosRequestConfig): Promise<AxiosResponse> => {
  try {
    const response = await axiosProxy(url, options);
    return response;
  } catch (error) {
    console.error('Error proxying API call:', error);
    throw error;
  }
};

// Function untuk POST request dengan header palsu
export const proxyPostRequest = async (url: string, data?: unknown, options?: AxiosRequestConfig): Promise<AxiosResponse> => {
  try {
    const response = await axiosProxy.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      ...options
    });
    return response;
  } catch (error) {
    console.error('Error proxying POST request:', error);
    throw error;
  }
};

// Function untuk download file dengan progress tracking
export const downloadWithProgress = async (
  url: string, 
  onProgress?: (progress: number) => void,
  options?: AxiosRequestConfig
): Promise<AxiosResponse> => {
  try {
    const response = await axiosProxy.get(url, {
      responseType: 'stream',
      onDownloadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
      ...options
    });
    return response;
  } catch (error) {
    console.error('Error downloading with progress:', error);
    throw error;
  }
};

export default axiosProxy;