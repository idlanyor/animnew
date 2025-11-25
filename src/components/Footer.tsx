'use client';

import Link from 'next/link';
import { Play, Heart, Film, TrendingUp, Calendar, Star } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-gray-950 via-black to-gray-950 border-t border-white/10">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-12">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <div className="relative group mb-6">
              <Link href="/" className="inline-flex items-center space-x-3 text-white">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-0 group-hover:opacity-60 transition-all duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 blur-md opacity-20 animate-pulse"></div>
                  <Play className="relative h-10 w-10 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                </div>
                <span className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]">
                  KanataAnimeV2
                </span>
              </Link>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/10 mb-6">
              <p className="text-gray-300 leading-relaxed mb-4">
                Platform streaming anime terbaik dengan koleksi lengkap anime ongoing dan complete.
                Nikmati pengalaman menonton anime dengan kualitas HD dan subtitle Indonesia.
              </p>
              <div className="flex items-center text-gray-400">
                <span className="text-sm">Made with</span>
                <Heart className="h-4 w-4 mx-1.5 text-red-500 animate-pulse" fill="currentColor" />
                <span className="text-sm">for anime lovers</span>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card p-4 rounded-xl border border-white/10 hover:border-cyan-400/30 transition-all duration-300 group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all">
                    <TrendingUp className="text-cyan-400 h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Ongoing</p>
                    <p className="text-white font-bold">1000+</p>
                  </div>
                </div>
              </div>
              <div className="glass-card p-4 rounded-xl border border-white/10 hover:border-purple-400/30 transition-all duration-300 group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all">
                    <Star className="text-purple-400 h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Complete</p>
                    <p className="text-white font-bold">5000+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent mb-1">
                Quick Links
              </h3>
              <div className="h-1 w-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
            </div>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Home', icon: Film },
                { href: '/ongoing', label: 'Ongoing Anime', icon: TrendingUp },
                { href: '/complete', label: 'Complete Anime', icon: Star },
                { href: '/schedule', label: 'Schedule', icon: Calendar },
                { href: '/movie', label: 'Movie', icon: Film },
                { href: '/genres', label: 'Genres', icon: Star },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-all duration-300"
                  >
                    <div className="p-1 rounded bg-white/0 group-hover:bg-cyan-500/10 transition-all">
                      <link.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-1">
                Categories
              </h3>
              <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { genre: 'action', label: 'Action', color: 'from-red-500/20 to-orange-500/20 hover:from-red-500/30 hover:to-orange-500/30' },
                { genre: 'romance', label: 'Romance', color: 'from-pink-500/20 to-rose-500/20 hover:from-pink-500/30 hover:to-rose-500/30' },
                { genre: 'comedy', label: 'Comedy', color: 'from-yellow-500/20 to-amber-500/20 hover:from-yellow-500/30 hover:to-amber-500/30' },
                { genre: 'drama', label: 'Drama', color: 'from-purple-500/20 to-indigo-500/20 hover:from-purple-500/30 hover:to-indigo-500/30' },
                { genre: 'fantasy', label: 'Fantasy', color: 'from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30' },
                { genre: 'adventure', label: 'Adventure', color: 'from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30' },
              ].map((category) => (
                <Link
                  key={category.genre}
                  href={`/genres?genre=${category.genre}`}
                  className="group relative"
                >
                  <div className={`glass-badge backdrop-blur-sm bg-gradient-to-r ${category.color} border border-white/10 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all duration-300 hover:scale-105`}>
                    {category.label}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"></div>
          <div className="glass-card p-6 rounded-2xl border border-white/10">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © 2025 <span className="text-cyan-400 font-semibold">KanataAnimeV2</span>. All rights reserved.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Powered by</span>
                <div className="glass-badge backdrop-blur-sm bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 px-3 py-1 rounded-lg">
                  <span className="text-cyan-400 text-sm font-semibold">Ryzumi API</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

