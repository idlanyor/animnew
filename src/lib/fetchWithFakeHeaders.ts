// Utility function to fetch with fake headers for bypassing CORS
export async function fetchWithFakeHeaders(url: string, options: RequestInit = {}) {
  const fakeHeaders = {
    'Origin': 'https://v1.animasu.top/',
    'Referer': 'https://v1.animasu.top/',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers: fakeHeaders,
    mode: 'cors',
  });
}

// Proxy function to bypass CORS by routing through our API
export async function fetchThroughProxy(url: string, options: RequestInit = {}) {
  const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
  
  return fetch(proxyUrl, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}