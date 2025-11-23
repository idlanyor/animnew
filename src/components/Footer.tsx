'use client';

import Link from 'next/link';
import { Play, Heart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 text-white mb-4">
              <Play className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold">KanataAnimeV2</span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              Platform streaming anime terbaik dengan koleksi lengkap anime ongoing dan complete. 
              Nikmati pengalaman menonton anime dengan kualitas HD.
            </p>
            <div className="flex items-center text-gray-400">
              <span>Made with</span>
              <Heart className="h-4 w-4 mx-1 text-red-500" fill="currentColor" />
              <span>for anime lovers</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/ongoing" className="text-gray-400 hover:text-white transition-colors">
                  Ongoing Anime
                </Link>
              </li>
              <li>
                <Link href="/complete" className="text-gray-400 hover:text-white transition-colors">
                  Complete Anime
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="text-gray-400 hover:text-white transition-colors">
                  Schedule
                </Link>
              </li>
              <li>
                <Link href="/author" className="text-gray-400 hover:text-white transition-colors">
                  Author
                </Link>
              </li>
              <li>
                <Link href="/genres" className="text-gray-400 hover:text-white transition-colors">
                  Genres
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/genres?genre=action" className="text-gray-400 hover:text-white transition-colors">
                  Action
                </Link>
              </li>
              <li>
                <Link href="/genres?genre=romance" className="text-gray-400 hover:text-white transition-colors">
                  Romance
                </Link>
              </li>
              <li>
                <Link href="/genres?genre=comedy" className="text-gray-400 hover:text-white transition-colors">
                  Comedy
                </Link>
              </li>
              <li>
                <Link href="/genres?genre=drama" className="text-gray-400 hover:text-white transition-colors">
                  Drama
                </Link>
              </li>
              <li>
                <Link href="/genres?genre=fantasy" className="text-gray-400 hover:text-white transition-colors">
                  Fantasy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <Separator className="mt-8 bg-gray-800" />
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 KanataAnimeV2. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-2 md:mt-0">
            Powered by Ryzumi API
          </p>
        </div>
      </div>
    </footer>
  );
}

