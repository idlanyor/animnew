const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.join(__dirname, '../'),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'http',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'anime-indo.lol',
      },
      {
        protocol: 'http',
        hostname: 'anime-indo.lol',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'http',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'otakudesu.best',
      },
      {
        protocol: 'http',
        hostname: 'otakudesu.best',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, Origin, Referer' },
          { key: 'Origin', value: 'https://anime.antidonasi.web.id' },
          { key: 'Referer', value: 'https://anime.antidonasi.web.id/' },
        ],
      },
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:; media-src 'self' https:; frame-src 'self' https:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self';"
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          }
        ],
      },
    ];
  },
  experimental: {
    largePageDataBytes: 256 * 1024, // 256 kB instead of default 128 kB
  },
};

module.exports = nextConfig;

